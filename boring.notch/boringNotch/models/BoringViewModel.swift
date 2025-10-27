//
//  BoringViewModel.swift
//  boringNotch
//
//  Created by Harsh Vardhan  Goswami  on 04/08/24.
//

import Combine
import Defaults
import SwiftUI
import TheBoringWorkerNotifier

// MARK: - Voice Interface Models
enum VoiceConnectionStatus: String, CaseIterable {
    case disconnected, connecting, connected, error
}


struct VoiceMessage: Identifiable, Codable {
    let id = UUID()
    let content: String
    let isFromAgent: Bool
    let timestamp: Date
    
    init(content: String, isFromAgent: Bool = false) {
        self.content = content
        self.isFromAgent = isFromAgent
        self.timestamp = Date()
    }
}

class BoringViewModel: NSObject, ObservableObject {
    @ObservedObject var coordinator = BoringViewCoordinator.shared
    @ObservedObject var detector = FullscreenMediaDetector.shared

    let animationLibrary: BoringAnimations = .init()
    let animation: Animation?

    // Static in-memory cache that survives BoringViewModel re-creations (multiple displays, window rebuilds, etc.)
    private static var persistedEmailLabels: [String] = []
    private static var persistedSelectedEmailLabel: String?

    @Published var contentType: ContentType = .normal
    @Published private(set) var notchState: NotchState = .closed

    @Published var dragDetectorTargeting: Bool = false
    @Published var dropZoneTargeting: Bool = false
    @Published var dropEvent: Bool = false
    @Published var anyDropZoneTargeting: Bool = false
    var cancellables: Set<AnyCancellable> = []
    
    @Published var hideOnClosed: Bool = true
    @Published var isHoveringCalendar: Bool = false
    @Published var isBatteryPopoverActive: Bool = false

    @Published var screen: String?
    
    // Stealth mode state for header pirate/eye toggle
    @Published var isStealthModeEnabled: Bool = false
    
    // Lock state to keep notch open
    @Published var isNotchLocked: Bool = false
    // Tracks pointer hovering over the floating lock button area
    @Published var isHoveringLockArea: Bool = false

    @Published var notchSize: CGSize = getClosedNotchSize()
    @Published var closedNotchSize: CGSize = getClosedNotchSize()
    
    let webcamManager = WebcamManager.shared
    @Published var isCameraExpanded: Bool = false
    @Published var isRequestingAuthorization: Bool = false
    
    // MARK: - Authentication State
    @Published var isAuthenticated: Bool = true
    
    // MARK: - Login Animation State
    @Published var showHelloAnimation: Bool = true
    @Published var showLoginText: Bool = false
    @Published var loginTextOffset: CGFloat = 100
    
    // Individual text animation properties for staggered bottom-to-center effect
    @Published var greetingTextOffset: CGFloat = 80
    @Published var greetingTextOpacity: Double = 0.0
    @Published var loginButtonOffset: CGFloat = 80
    @Published var loginButtonOpacity: Double = 0.0
    
    // MARK: - Voice Interface State
    @Published var showVoiceInterface: Bool = false
    @Published var voiceConnectionStatus: VoiceConnectionStatus = .disconnected
    @Published var isMicrophoneMuted: Bool = false
    @Published var voiceMessages: [VoiceMessage] = []
    @Published var isVoiceActive: Bool = false
    @Published var aiResponseIntensity: CGFloat = 0.0 // Wave animation intensity (0.0 → 1.0)
    @Published var effectiveAnimationIntensity: CGFloat = 0.0 // Combined AI + real-time audio intensity

    // MARK: - New: Shared Email State
    let emailViewModel = EmailViewModel()
    @Published var cachedEmailLabels: [String] = []
    @Published var cachedSelectedEmailLabel: String?
    
    deinit {
        destroy()
    }

    func destroy() {
        cancellables.forEach { $0.cancel() }
        cancellables.removeAll()
        
        // Stop email auto refresh
        emailViewModel.stopAutoRefresh()
        
        // Clean up notification observers
        NotificationCenter.default.removeObserver(self)
    }

    init(screen: String? = nil) {
        animation = animationLibrary.animation

        super.init()
        
        self.screen = screen
        notchSize = getClosedNotchSize(screen: screen)
        closedNotchSize = notchSize

        // Restore cached email labels immediately so the UI has data before any fresh fetch runs.
        cachedEmailLabels = Self.persistedEmailLabels
        cachedSelectedEmailLabel = Self.persistedSelectedEmailLabel
        if !Self.persistedEmailLabels.isEmpty {
            emailViewModel.applyCachedLabels(Self.persistedEmailLabels, selectedLabel: Self.persistedSelectedEmailLabel)
        }

        emailViewModel.$availableLabels
            .receive(on: RunLoop.main)
            .sink { [weak self] labels in
                guard let self else { return }
                self.cachedEmailLabels = labels
                Self.persistedEmailLabels = labels
            }
            .store(in: &cancellables)

        emailViewModel.$selectedLabel
            .receive(on: RunLoop.main)
            .sink { [weak self] label in
                guard let self else { return }
                self.cachedSelectedEmailLabel = label
                Self.persistedSelectedEmailLabel = label
            }
            .store(in: &cancellables)

        Publishers.CombineLatest($dropZoneTargeting, $dragDetectorTargeting)
            .map { value1, value2 in
                value1 || value2
            }
            .assign(to: \.anyDropZoneTargeting, on: self)
            .store(in: &cancellables)
        
        setupDetectorObserver()
        setupNotificationObservers()
        
        // Start email auto refresh every 15 minutes
        emailViewModel.startAutoRefresh(intervalMinutes: 15)
    }
    
    private func setupNotificationObservers() {
        // Listen for notch shrinking after meeting
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleShrinkNotchAfterMeeting),
            name: NSNotification.Name("ShrinkNotchAfterMeeting"),
            object: nil
        )
        
        // Listen for authentication status updates from WebSocket
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleAuthenticationStatusUpdate),
            name: NSNotification.Name("AuthenticationStatusUpdate"),
            object: nil
        )
        
        // Listen for notch size changes (height and width settings)
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleNotchSizeChanged),
            name: Notification.Name.notchHeightChanged,
            object: nil
        )
    }
    
    @objc private func handleAuthenticationStatusUpdate(_ notification: Notification) {
        if let userInfo = notification.userInfo,
           let isAuthenticated = userInfo["isAuthenticated"] as? Bool {
            print("🔐 BoringViewModel: Received authentication status update: \(isAuthenticated)")
            print("🔐 BoringViewModel: Current authentication status before update: \(self.isAuthenticated)")
            updateAuthenticationStatus(isAuthenticated)
            print("🔐 BoringViewModel: Authentication status updated to: \(self.isAuthenticated)")
        } else {
            print("⚠️ BoringViewModel: Received invalid authentication status notification")
        }
    }
    
    @objc private func handleShrinkNotchAfterMeeting() {
        print("📏 BoringViewModel: Shrinking notch after meeting ended")
        
        DispatchQueue.main.async {
            withAnimation(.easeInOut(duration: 0.5)) {
                // Ensure notch is in closed state
                self.notchState = .closed
                self.notchSize = getClosedNotchSize(screen: self.screen)
                
                // Hide notch if it should be hidden when closed
                if self.hideOnClosed {
                    self.hideOnClosed = true
                }
            }
        }
    }
    
    @objc private func handleNotchSizeChanged() {
        print("📏 BoringViewModel: Notch size settings changed, updating size...")
        DispatchQueue.main.async {
            // Update the closed notch size with new settings
            let newClosedSize = getClosedNotchSize(screen: self.screen)
            self.closedNotchSize = newClosedSize
            
            // If the notch is currently closed, update the current size too
            if self.notchState == .closed {
                withAnimation(.smooth) {
                    self.notchSize = newClosedSize
                }
            }
            print("📏 BoringViewModel: Updated notch size to \(newClosedSize)")
        }
    }
    
    private func setupDetectorObserver() {
        // Publisher for the user’s fullscreen detection setting
        let enabledPublisher = Defaults
            .publisher(.enableFullscreenMediaDetection)
            .map(\.newValue)
            .removeDuplicates()

        // Publisher for the current screen name (non-nil, distinct)
        let screenPublisher = $screen
            .compactMap { $0 }
            .removeDuplicates()

        // Publisher for fullscreen status dictionary
        let fullscreenStatusPublisher = detector.$fullscreenStatus
            .removeDuplicates()

        // Combine all three: screen name, fullscreen status, and enabled setting
        Publishers.CombineLatest3(screenPublisher, fullscreenStatusPublisher, enabledPublisher)
            .map { screenName, fullscreenStatus, enabled in
                let isFullscreen = fullscreenStatus[screenName] ?? false
                return enabled && isFullscreen
            }
            .removeDuplicates()
            .receive(on: RunLoop.main)
            .sink { [weak self] shouldHide in
                withAnimation(.smooth) {
                    self?.hideOnClosed = shouldHide
                }
            }
            .store(in: &cancellables)
    }

    // Computed property for effective notch height
    var effectiveClosedNotchHeight: CGFloat {
        let currentScreen = NSScreen.screens.first { $0.localizedName == screen }
        let noNotchAndFullscreen = hideOnClosed && (currentScreen?.safeAreaInsets.top ?? 0 <= 0 || currentScreen == nil)
        return noNotchAndFullscreen ? 0 : closedNotchSize.height
    }

    func toggleCameraPreview() {
        if isRequestingAuthorization {
            return
        }

        switch webcamManager.authorizationStatus {
        case .authorized:
            if webcamManager.isSessionRunning {
                webcamManager.stopSession()
                isCameraExpanded = false
            } else if webcamManager.cameraAvailable {
                webcamManager.startSession()
                isCameraExpanded = true
            }

        case .denied, .restricted:
            DispatchQueue.main.async {
                NSApp.setActivationPolicy(.regular)
                NSApp.activate(ignoringOtherApps: true)

                let alert = NSAlert()
                alert.messageText = "Camera Access Required"
                alert.informativeText = "Please allow camera access in System Settings."
                alert.addButton(withTitle: "Open Settings")
                alert.addButton(withTitle: "Cancel")

                if alert.runModal() == .alertFirstButtonReturn {
                    if let url = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Camera") {
                        NSWorkspace.shared.open(url)
                    }
                }

                NSApp.setActivationPolicy(.accessory)
                NSApp.deactivate()
            }

        case .notDetermined:
            isRequestingAuthorization = true
            webcamManager.checkAndRequestVideoAuthorization()
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                self.isRequestingAuthorization = false
            }

        default:
            break
        }
    }
    
    func isMouseHovering(position: NSPoint = NSEvent.mouseLocation) -> Bool {
        let screenFrame = getScreenFrame(screen)
        if let frame = screenFrame {
            
            let baseY = frame.maxY - notchSize.height
            let baseX = frame.midX - notchSize.width / 2
            
            return position.y >= baseY && position.x >= baseX && position.x <= baseX + notchSize.width
        }
        
        return false
    }

    func open() {
        withAnimation(.bouncy) {
            self.notchSize = openNotchSize
            self.notchState = .open
        }
        
        // Force music information update when notch is opened
        MusicManager.shared.forceUpdate()
    }

    func close() {
        withAnimation(.smooth) { [weak self] in
            guard let self = self else { return }
            self.notchSize = getClosedNotchSize(screen: self.screen)
            self.closedNotchSize = self.notchSize
            self.notchState = .closed
        }

        // No default tab selection on close - respect current tab selection
    }

    func closeHello() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.5) { [weak self] in
            self?.coordinator.firstLaunch = false
            withAnimation(self?.animationLibrary.animation) {
                self?.close()
            }
        }
    }
    
    // MARK: - Voice Interface Methods
    func activateVoiceInterface() {
        print("🎤 Activating voice interface in boring.notch")
        DispatchQueue.main.async {
            self.showVoiceInterface = true
            self.voiceConnectionStatus = .connecting
            self.isVoiceActive = true
            self.voiceMessages.removeAll()
        }
    }
    
    func deactivateVoiceInterface() {
        print("🔌 Deactivating voice interface in boring.notch")
        DispatchQueue.main.async {
            self.showVoiceInterface = false
            self.voiceConnectionStatus = .disconnected
            self.isVoiceActive = false
            self.isMicrophoneMuted = false
            self.voiceMessages.removeAll()
        }
    }
    
    func updateVoiceConnectionStatus(_ status: VoiceConnectionStatus) {
        DispatchQueue.main.async {
            self.voiceConnectionStatus = status
        }
    }
    
        func addVoiceMessage(_ message: VoiceMessage) {
            DispatchQueue.main.async {
                self.voiceMessages.append(message)
                
                // Pulse wave intensity when AI responds
                if message.isFromAgent {
                    print("🎤 AI Response detected - triggering wave animation for: \(message.content.prefix(50))...")
                    self.pulseAIResponseIntensity(basedOnContent: message.content)
                }
            }
        }
    
    func toggleVoiceMute() {
        DispatchQueue.main.async {
            self.isMicrophoneMuted.toggle()
        }
    }
    
    // MARK: - Voice Agent Activation
    func activateVoiceAgent() {
        print("🎤 Activating voice agent - sending message to Electron")
        
        // Send message to Electron to activate the voice agent
        WebSocketManager.shared.sendEvent(type: .custom, data: [
            "type": "activate_voice_agent",
            "timestamp": Date().timeIntervalSince1970,
            "source": "boring-notch"
        ])
        
        // Also activate the voice interface locally
        activateVoiceInterface()
    }
    
    // MARK: - Authentication Methods
    func updateAuthenticationStatus(_ isAuthenticated: Bool) {
        DispatchQueue.main.async {
            print("🔐 BoringViewModel: Updating authentication status from \(self.isAuthenticated) to \(isAuthenticated)")
            self.isAuthenticated = isAuthenticated
            print("🔐 BoringViewModel: Authentication status updated: \(isAuthenticated)")
        }
    }
    
    func navigateToMainScreen(path: String) {
        // This method will be called when user taps login
        // Don't automatically set authentication status to true
        // Instead, request the actual authentication status from Electron
        print("🔗 Navigate to main screen: \(path)")
        print("🔐 Requesting actual authentication status after login attempt...")
        
        // Send a message to Electron to open the login page
        WebSocketManager.shared.sendEvent(type: .navigateToMainScreen, data: ["path": path])
        
        // Request the real authentication status from Electron after a delay
        // to give the main app time to process the navigation
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.requestAuthenticationStatusFromElectron()
        }
        
        // Also request again after a longer delay to catch any authentication changes
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
            self.requestAuthenticationStatusFromElectron()
        }
    }
    
    // MARK: - Workspace Suspension Check
    func checkWorkspaceSuspensionAndStartMeeting() {
        print("🔍 [DEBUG] Checking workspace suspension before starting meeting...")
        
        // Send a message to Electron to check workspace mode
        WebSocketManager.shared.sendEvent(type: .checkWorkspaceMode, data: [:])
        print("🔍 [DEBUG] Sent CHECK_WORKSPACE_MODE event to Electron")
    }
    
    func handleWorkspaceModeResponse(_ mode: String?) {
        print("🔍 [DEBUG] Received workspace mode response: \(mode ?? "nil")")
        
        if mode == "suspended" {
            print("🚫 [DEBUG] Workspace is suspended, navigating to pricing page")
            
            // Immediately update UI to home state when workspace is suspended
            DispatchQueue.main.async {
                print("🚫 [DEBUG] Updating Boring Notch UI to home state due to suspended workspace")
                self.coordinator.currentView = .home
                self.coordinator.isMeetingLoading = false
                self.coordinator.isMeetingStarted = false
                print("🚫 [DEBUG] Boring Notch UI updated to home state")
            }
            
            // Navigate to pricing page
            WebSocketManager.shared.sendEvent(type: .navigateToMainScreen, data: ["path": "/settings/pricing"])
            print("🚫 [DEBUG] Sent NAVIGATE_TO_MAIN_SCREEN event with path: /settings/pricing")
        } else {
            print("✅ [DEBUG] Workspace is not suspended, starting meeting")
            // Start the meeting
            WebSocketManager.shared.sendEvent(type: .startMeeting, data: [:])
            print("✅ [DEBUG] Sent START_MEETING event")
        }
    }
    
    func startLoginAnimationSequence() {
        // Reset animation state
        showHelloAnimation = true
        showLoginText = false
        loginTextOffset = 100
        
        // Reset individual text animation properties
        greetingTextOffset = 80
        greetingTextOpacity = 0.0
        loginButtonOffset = 80
        loginButtonOpacity = 0.0
        
        // Start the animation sequence - let hello animation complete fully (4 seconds)
        DispatchQueue.main.asyncAfter(deadline: .now() + 4.0) {
            // Hide hello animation with same duration as initial display (4 seconds)
            withAnimation(.easeInOut(duration: 4.0)) {
                self.showHelloAnimation = false
            }
            
            // Show text content immediately after hello starts fading
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                withAnimation(.easeOut(duration: 1.5)) {
                    self.showLoginText = true
                    self.loginTextOffset = 0
                }
                
                // Animate both text elements simultaneously (no delay between them)
                withAnimation(.easeOut(duration: 1.2)) {
                    self.greetingTextOffset = 0
                    self.loginButtonOffset = 0
                }
                withAnimation(.easeOut(duration: 0.8)) {
                    self.greetingTextOpacity = 1.0
                    self.loginButtonOpacity = 1.0
                }
            }
        }
    }
    
    func requestAuthenticationStatusFromElectron() {
        // Manually request authentication status from Electron
        print("🔐 BoringViewModel: Manually requesting authentication status from Electron")
        print("🔐 BoringViewModel: Current WebSocket connection status: \(WebSocketManager.shared.isConnected)")
        
        if WebSocketManager.shared.isConnected {
            WebSocketManager.shared.sendEvent(type: .requestAuthenticationStatus, data: [:])
            print("🔐 BoringViewModel: Authentication status request sent via WebSocket")
        } else {
            print("⚠️ BoringViewModel: WebSocket not connected, attempting to connect...")
            WebSocketManager.shared.connect()
            
            // Retry after connection is established
            DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
                if WebSocketManager.shared.isConnected {
                    WebSocketManager.shared.sendEvent(type: .requestAuthenticationStatus, data: [:])
                    print("🔐 BoringViewModel: Authentication status request sent after reconnection")
                } else {
                    print("❌ BoringViewModel: WebSocket connection failed, using fallback authentication check")
                    // Fallback: assume not authenticated if we can't connect
                    self.updateAuthenticationStatus(false)
                }
            }
        }
    }
    
        /// Pulse wave animation intensity based on AI response activity (Exact NotchDrop Implementation)
        func pulseAIResponseIntensity(basedOnContent content: String) {
            // Professional AI speaking intensity calculation
            let wordCount = content.split(separator: " ").count
            let charCount = content.count
            
            // Multi-factor intensity calculation for realistic speech patterns:
            // 1. Word count factor (0.3-0.8 weight)
            // 2. Character density factor (0.2-0.6 weight)  
            // 3. Response complexity indicators (questions, exclamations)
            let wordFactor = min(0.8, CGFloat(wordCount) / 60.0 + 0.2)
            let charFactor = min(0.6, CGFloat(charCount) / 400.0 + 0.1)
            let complexityBonus = content.contains("?") || content.contains("!") ? 0.1 : 0.0
            
            let targetIntensity = min(1.0, wordFactor + charFactor + complexityBonus)
            
            // Smooth professional animation timing
            withAnimation(.easeOut(duration: 0.4)) {
                self.aiResponseIntensity = targetIntensity
            }
            
            // Intelligent fade-back timing based on response length
            let fadeDelay = min(3.0, max(1.5, Double(wordCount) * 0.08)) // Longer responses = longer fade
            DispatchQueue.main.asyncAfter(deadline: .now() + fadeDelay) {
                withAnimation(.easeInOut(duration: 1.0)) {
                    // Gradual decay to baseline, maintaining some activity
                    self.aiResponseIntensity = max(0.15, self.aiResponseIntensity * 0.6)
                }
            }
        }

    // MARK: - Stealth Mode
    func toggleStealthMode() {
        withAnimation(.easeInOut(duration: 0.2)) {
            isStealthModeEnabled.toggle()
        }
        
        // Send stealth mode change to Electron via WebSocket for synchronization
        let stealthData: [String: Any] = [
            "type": "electron_stealth_mode",
            "isEnabled": isStealthModeEnabled,
            "timestamp": Int(Date().timeIntervalSince1970 * 1000),
            "source": "boring-notch"
        ]
        
        // Send via WebSocket
        WebSocketManager.shared.sendEvent(type: .custom, data: stealthData)
        print("🥷 BoringViewModel: Sent stealth mode change via WebSocket: \(isStealthModeEnabled)")
    }
    
    func setStealthMode(_ isEnabled: Bool) {
        print("🥷 BoringViewModel: Setting stealth mode to: \(isEnabled)")
        withAnimation(.easeInOut(duration: 0.2)) {
            isStealthModeEnabled = isEnabled
        }
        print("🥷 BoringViewModel: Stealth mode state updated to: \(isStealthModeEnabled)")
    }
    
    // MARK: - Lock Notch
    func toggleNotchLock() {
        withAnimation(.easeInOut(duration: 0.2)) {
            isNotchLocked.toggle()
        }
        print("🔒 Notch lock toggled: \(isNotchLocked ? "LOCKED" : "UNLOCKED")")
    }
    
    func forceLockStateRefresh() {
        // Force UI refresh by sending object will change
        DispatchQueue.main.async {
            self.objectWillChange.send()
        }
    }
}
