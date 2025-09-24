import Cocoa
import Combine
import Foundation
import SwiftUI
import AVFoundation

class NotchViewModel: NSObject, ObservableObject {
    var cancellables: Set<AnyCancellable> = []
    let inset: CGFloat

    init(inset: CGFloat = -4) {
        self.inset = inset
        super.init()
        setupCancellables()
    }

    deinit {
        destroy()
    }

    let animation: Animation = DynamicIslandTheme.expansionAnimation
    // Fixed size - no width expansion functionality
    var notchOpenedSize: CGSize {
        // When showing notification, use notification-specific dimensions matching Figma
        if showNotificationOverlay {
            return .init(
                width: 370,  // Figma design width
                height: 100   // Figma design height
            )
        }
        // Always use fixed compact width - no expansion for any state
        return .init(
            width: 550, // Increased width to accommodate new UI layout
            height: DynamicIslandTheme.expandedHeight
        )
    }
    let dropDetectorRange: CGFloat = 32

    enum Status: String, Codable, Hashable, Equatable {
        case closed
        case opened
        case popping
    }

    enum OpenReason: String, Codable, Hashable, Equatable {
        case click
        case hover
        case drag
        case boot
        case unknown
    }

    enum ContentType: Int, Codable, Hashable, Equatable {
        case normal
        // case menu
        // case settings
    }

    var notchOpenedRect: CGRect {
        .init(
            x: screenRect.origin.x + (screenRect.width - notchOpenedSize.width) / 2,
            y: screenRect.origin.y + screenRect.height - notchOpenedSize.height,
            width: notchOpenedSize.width,
            height: notchOpenedSize.height
        )
    }

    var headlineOpenedRect: CGRect {
        .init(
            x: screenRect.origin.x + (screenRect.width - notchOpenedSize.width) / 2,
            y: screenRect.origin.y + screenRect.height - deviceNotchRect.height,
            width: notchOpenedSize.width + 100,
            height: deviceNotchRect.height
        )
    }

    @Published private(set) var status: Status = .closed
    @Published var openReason: OpenReason = .unknown
    @Published var contentType: ContentType = .normal

    @Published var spacing: CGFloat = 16
    @Published var cornerRadius: CGFloat = 16
    @Published var deviceNotchRect: CGRect = .zero
    @Published var screenRect: CGRect = .zero
    @Published var optionKeyPressed: Bool = false
    @Published var notchVisible: Bool = true

    @PublishedPersist(key: "selectedLanguage", defaultValue: .system)
    var selectedLanguage: Language

    @PublishedPersist(key: "hapticFeedback", defaultValue: true)
    var hapticFeedback: Bool

    let hapticSender = PassthroughSubject<Void, Never>()
    
    // Dynamic Island UI state
    @Published var isRecording: Bool = false
    @Published var isPaused: Bool = false
    @Published var timer: Int = 0
    @Published var isChatMode: Bool = false
    @Published var chatInput: String = ""
    @Published var isSendingMessage: Bool = false
    @Published var isAuthenticated: Bool = false
    @Published var controlledByDynamicIsland: Bool = false
    @Published var isConnecting = false
    @Published var isStealthModeEnabled: Bool = false
    
    // Chat expansion state
    @Published var isChatExpanded: Bool = false // Deprecated - no longer used for width expansion
    @Published var chatTextHeight: CGFloat = 100

    // Voice UI state (UI parity with React)
    enum VoiceConnectionStatus: String { case disconnected, connecting, connected, error }
    @Published var showVoiceInterface: Bool = false
    @Published var voiceConnectionStatus: VoiceConnectionStatus = .disconnected
    @Published var isMicrophoneMuted: Bool = false
    
    // Voice Assistant Integration (Web-based approach)
    @Published var voiceMessages: [VoiceMessage] = []
    @Published var isVoiceActive: Bool = false
    @Published var audioLevel: Float = 0.0
    
    // MARK: - Wake Word Detection Properties
    @Published var isWakeWordEnabled: Bool = false
    @Published var wakeWordScore: Float = 0.0

    // Notification Overlay State
    @Published var showNotificationOverlay: Bool = false
    @Published var notificationTitle: String = ""
    @Published var notificationBody: String = ""
    @Published var notificationType: String = ""
    @Published var isNotificationHovered: Bool = false
    
    // Notification Timer State
    private var notificationTimer: Timer?
    private var notificationStartTime: Date?
    private var notificationPausedTime: TimeInterval = 0
    private let notificationDuration: TimeInterval = 10.0
    
    // Voice configuration (VE.AI settings)
    private var voiceURL: String = "wss://ve-ai-voice-agent-ginreaey.livekit.cloud"
    private var voiceToken: String = ""
    
    // Camera/Webcam state
    @Published var isCameraActive: Bool = false
    @Published var showCameraPreview: Bool = false  // Controls whether to show camera preview or icon
    @Published var cameraPermission: String = "not-determined" // 'not-determined', 'granted', 'denied', 'restricted'
    @Published var cameraError: String? = nil
    @Published var isCameraStarting: Bool = false
    @Published var cameraStatus: String = "idle" // 'idle', 'starting', 'active', 'error'
    
    // Event emitters for JavaScript integration
    let swiftActionSender = PassthroughSubject<SwiftAction, Never>()
    
    enum SwiftAction {
        case startRecording
        case stopRecording
        case pauseRecording
        case resumeRecording
        case toggleChatMode
        case submitChat(String)
        case sendChatMessageToAskAI([String: String])
        case setAuthenticated(Bool)
        case expand
        case collapse
        case triggerOverlayToggleLiveIntelligence
        case sendLog(String)
        case navigateToMainScreen(String?)
        // Voice Assistant Actions
        case connectVoice
        case disconnectVoice
        case toggleVoiceMute
        case sendVoiceMessage(String)
        case voiceConnectionStateChanged(String)
        case startVoiceAgent
        case receiveMessage(String)
        // Wake Word Detection Actions
        case wakeWordDetected(Float)
        // Notification Actions
        case showNotification(String, String, String)
        // Webcam Actions
        case toggleWebcam
        case startWebcam
        case stopWebcam
        case checkCameraPermission
        case requestCameraPermission
        case toggleStealthMode
    }
    
    // Voice Message Structure for UI
    struct VoiceMessage: Identifiable {
        let id: String
        let sender: String
        let content: String
        let timestamp: Date
        let isFromAgent: Bool
        
        init(sender: String, content: String, isFromAgent: Bool = false) {
            self.id = UUID().uuidString
            self.sender = sender
            self.content = content
            self.timestamp = Date()
            self.isFromAgent = isFromAgent
        }
    }
    
    private var timerCancellable: AnyCancellable?

    func notchOpen(_ reason: OpenReason) {
        openReason = reason
        status = .opened
        contentType = .normal
        // Avoid stealing focus when opening due to hover
        if reason != .hover {
            NSApp.activate(ignoringOtherApps: true)
        }
        // Emit expand action for JavaScript
        swiftActionSender.send(.expand)
    }

    func notchClose() {
        openReason = .unknown
        status = .closed
        contentType = .normal
        
        // Emit collapse action for JavaScript
        swiftActionSender.send(.collapse)
    }

    func showSettings() {
        // contentType = .settings
    }

    func notchPop() {
        openReason = .unknown
        status = .popping
    }
    
    // Dynamic Island UI functions
    func startRecording() {
        isConnecting = false // Set to false immediately to show recording state
        isRecording = true
        isPaused = false
        timer = 0
        startTimer()
        
        // Ensure voice interface is not shown when recording
        showVoiceInterface = false
        
        // Emit action for JavaScript
        swiftActionSender.send(.startRecording)
        
        // Trigger overlay integration - this is the key addition
        // This will communicate with the overlay system to actually start recording
        // and show the Live Intelligence panel, just like the JavaScript version
        swiftActionSender.send(.triggerOverlayToggleLiveIntelligence)
    }
    
    func stopRecording() {
        isRecording = false
        isPaused = false
        isConnecting = false
        timer = 0
        stopTimer()
        
        // Emit action for JavaScript
        swiftActionSender.send(.stopRecording)
    }
    
    func pauseRecording() {
        isPaused = true
        stopTimer()
        
        // Emit action for JavaScript
        swiftActionSender.send(.pauseRecording)
    }
    
    func resumeRecording() {
        isPaused = false
        startTimer()
        
        // Emit action for JavaScript
        swiftActionSender.send(.resumeRecording)
    }

    private var lastToggleTime: Date = Date.distantPast
    
    func toggleStealthMode() {
        print("🏴‍☠️ Swift requested stealth mode toggle - current: \(isStealthModeEnabled)")
        // Toggle immediately for instant UI feedback
        isStealthModeEnabled.toggle()
        lastToggleTime = Date() // Record when we toggled
        print("🏴‍☠️ Stealth mode toggled to: \(isStealthModeEnabled)")
        // Also send to JavaScript for synchronization
        swiftActionSender.send(.toggleStealthMode)
    }

    func updateStealthModeState(_ isEnabled: Bool) {
        DispatchQueue.main.async {
            // Ignore updates that come within 500ms of a manual toggle to prevent race conditions
            let timeSinceToggle = Date().timeIntervalSince(self.lastToggleTime)
            if timeSinceToggle < 0.5 {
                print("🏴‍☠️ Ignoring stealth mode update from JS (recent toggle: \(timeSinceToggle)s ago)")
                return
            }
            
            if self.isStealthModeEnabled != isEnabled {
                print("🏴‍☠️ Stealth mode state updated from JS: \(isEnabled ? "ENABLED" : "DISABLED")")
                self.isStealthModeEnabled = isEnabled
            }
        }
    }
    
    func toggleChatMode() {
        isChatMode.toggle()
        if !isChatMode {
            chatInput = ""
        }
        
        // Emit action for JavaScript
        swiftActionSender.send(.toggleChatMode)
    }
    
    func submitChat() {
        let trimmedInput = chatInput.trimmingCharacters(in: .whitespacesAndNewlines)
        
        guard !trimmedInput.isEmpty && !isSendingMessage else {
            if trimmedInput.isEmpty {
                print("⚠️ Cannot submit empty chat message")
            } else {
                print("⚠️ Already sending a message, please wait")
            }
            return
        }
        
        print("💬 Swift NotchDrop submitting chat: '\(trimmedInput)'")
        
        // Set sending state for UI feedback
        isSendingMessage = true
        
        // Store message and clear input immediately for better UX
        let message = trimmedInput
        chatInput = ""
        
        // Create message object that matches the Dynamic Island format exactly
        let chatMessage = [
            "type": "dynamic-island-chat",
            "message": message,
            "timestamp": ISO8601DateFormatter().string(from: Date()),
            "source": "notchdrop-swift"
        ]
        
        print("📤 Swift sending chat message to AskAI:", chatMessage)
        
        // Emit action for JavaScript with formatted message
        swiftActionSender.send(.submitChat(message))
        
        // Also emit a separate action for sending to askAI - this is the main integration point
        swiftActionSender.send(.sendChatMessageToAskAI(chatMessage))
        
        print("✅ Swift chat actions emitted successfully")
        
        // Reset sending state after a brief delay (simulating API call)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.isSendingMessage = false
        }
    }

    // MARK: - Voice Assistant Integration
    
    /// Configure voice connection parameters (called from JavaScript/Electron)
    func configureVoice(url: String, token: String) {
        self.voiceURL = url
        self.voiceToken = token
        print("🎤 Voice configured with URL: \(url)")
    }
    
    /// Connect to voice assistant - DIRECT APPROACH
    func connectVoiceAssistant() {
        print("🎤 VOICE: Button clicked - connecting directly to voice agent")
        
        showVoiceInterface = true
        voiceConnectionStatus = .connecting
        isVoiceActive = true
        
        // DIRECT: Trigger voice agent via specific action
        swiftActionSender.send(.startVoiceAgent)
        
        print("🚀 VOICE: Voice agent start command sent")
    }
    
    /// Disconnect from voice assistant
    func disconnectVoiceAssistant() {
        print("🎤 Disconnecting from voice assistant...")
        
        voiceConnectionStatus = .disconnected
        showVoiceInterface = false
        isMicrophoneMuted = false
        isVoiceActive = false
        voiceMessages.removeAll()
        audioLevel = 0.0
        
        // Emit action for JavaScript integration
        swiftActionSender.send(.disconnectVoice)
        swiftActionSender.send(.voiceConnectionStateChanged("disconnected"))
    }
    
    /// Toggle microphone mute in voice chat
    func toggleVoiceMute() {
        isMicrophoneMuted.toggle()
        
        // Emit action for JavaScript integration
        swiftActionSender.send(.toggleVoiceMute)
        print("🎤 Microphone \(isMicrophoneMuted ? "muted" : "unmuted")")
    }
    
    /// Send a message through voice assistant (for debugging/testing)
    func sendVoiceMessage(_ message: String) {
        let userMessage = VoiceMessage(sender: "User", content: message, isFromAgent: false)
        voiceMessages.append(userMessage)
        
        swiftActionSender.send(.sendVoiceMessage(message))
        print("💬 Voice message sent: \(message)")
        
        // Simulate agent response
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            let agentResponse = VoiceMessage(sender: "Agent", content: "I received: \(message)", isFromAgent: true)
            self.voiceMessages.append(agentResponse)
        }
    }
    
    /// Update voice connection state from JavaScript
    func updateVoiceConnectionState(_ state: String) {
        DispatchQueue.main.async {
            switch state {
            case "connected":
                self.voiceConnectionStatus = .connected
            case "connecting":
                self.voiceConnectionStatus = .connecting
            case "disconnected":
                self.voiceConnectionStatus = .disconnected
            case "error":
                self.voiceConnectionStatus = .error
            default:
                break
            }
        }
    }
    
    /// Add voice message from JavaScript transcription
    func addVoiceMessage(sender: String, content: String, isFromAgent: Bool) {
        DispatchQueue.main.async {
            // Check for duplicate messages (same sender and content)
            let isDuplicate = self.voiceMessages.contains { existingMessage in
                existingMessage.sender == sender && 
                existingMessage.content == content &&
                existingMessage.isFromAgent == isFromAgent
            }
            
            if !isDuplicate {
                let message = VoiceMessage(sender: sender, content: content, isFromAgent: isFromAgent)
                self.voiceMessages.append(message)
                print("💬 Added voice message: \(sender): \(content.prefix(50))...")
            } else {
                print("⚠️ Skipped duplicate voice message: \(sender): \(content.prefix(50))...")
            }
        }
    }
    
    // MARK: - Wake Word Detection Integration
    
    /// Handle wake word detection from Python service - automatically trigger voice agent
    func handleWakeWordDetected(score: Float) {
        print("🎯 'Hey Ve' detected with score: \(score) - activating voice agent!")
        
        // Update UI state
        wakeWordScore = score
        isWakeWordEnabled = true
        
        // AUTO-EXPAND NOTCH when Hey Ve is detected (like "Hey Siri")
        print("🏝️ AUTO-EXPANDING NotchDrop for Hey Ve...")
        notchOpen(.click) // This will expand the notch UI
        
        // Emit wake word detected action for logging/analytics
        swiftActionSender.send(.wakeWordDetected(score))
        
        // Automatically trigger voice agent (like "Hey Siri")
        connectVoiceAssistant()
        
        // Log the activation
        swiftActionSender.send(.sendLog("Hey Ve detected (score: \(score)) - NotchDrop expanded and voice agent activated"))
    }
    
    /// Update audio level from JavaScript
    func updateAudioLevel(_ level: Float) {
        DispatchQueue.main.async {
            self.audioLevel = level
        }
    }

    /// Show notification overlay in the notch
    func showNotification(title: String, body: String, type: String = "meeting") {
        print("🔔 Showing notification overlay: \(title) - \(body)")

        DispatchQueue.main.async {
            // Force open the notch to show the notification
            print("🔔 Opening notch to show notification")
            self.notchOpen(.click)
            
            // Set notification content
            self.notificationTitle = title
            self.notificationBody = body
            self.notificationType = type
            self.showNotificationOverlay = true

            print("🔔 Notification state set - showOverlay: \(self.showNotificationOverlay), title: '\(self.notificationTitle)'")

            // Emit action for JavaScript integration
            self.swiftActionSender.send(.showNotification(title, body, type))

            // Start the notification timer
            self.startNotificationTimer()
        }
    }

    /// Hide notification overlay
    func hideNotification() {
        DispatchQueue.main.async {
            self.showNotificationOverlay = false
            self.notificationTitle = ""
            self.notificationBody = ""
            self.notificationType = ""
            self.isNotificationHovered = false
            
            // Clean up timer
            self.stopNotificationTimer()
        }
    }
    
    /// Start the notification auto-dismiss timer
    private func startNotificationTimer() {
        stopNotificationTimer() // Clean up any existing timer
        
        notificationStartTime = Date()
        notificationPausedTime = 0
        
        notificationTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            
            if !self.isNotificationHovered {
                let elapsed = Date().timeIntervalSince(self.notificationStartTime ?? Date()) - self.notificationPausedTime
                
                if elapsed >= self.notificationDuration {
                    self.hideNotification()
                }
            }
        }
    }
    
    /// Stop the notification timer
    private func stopNotificationTimer() {
        notificationTimer?.invalidate()
        notificationTimer = nil
        notificationStartTime = nil
        notificationPausedTime = 0
    }
    
    /// Pause the notification timer when hovering
    func pauseNotificationTimer() {
        if let startTime = notificationStartTime, !isNotificationHovered {
            notificationPausedTime += Date().timeIntervalSince(startTime)
            notificationStartTime = Date()
            isNotificationHovered = true
            print("⏸️ Notification timer paused")
        }
    }
    
    /// Resume the notification timer when not hovering
    func resumeNotificationTimer() {
        if isNotificationHovered {
            notificationStartTime = Date()
            isNotificationHovered = false
            print("▶️ Notification timer resumed")
        }
    }

    // Voice UI helpers (UI-only; wiring can follow once UI is approved)
    func connectVoiceUI() {
        // Use the new LiveKit integration instead of simulation
        connectVoiceAssistant()
    }

    func disconnectVoiceUI() {
        // Use the new LiveKit integration instead of simulation
        disconnectVoiceAssistant()
    }

    func toggleMicMute() {
        // Use the new LiveKit integration instead of simple toggle
        toggleVoiceMute()
    }
    
    func setAuthenticated(_ authenticated: Bool) {
        isAuthenticated = authenticated
        
        // Emit action for JavaScript
        swiftActionSender.send(.setAuthenticated(authenticated))
    }
    
    func receiveMessage(_ message: String) {
        print("📨 Received message from Electron: \(message)")

        // Try to parse as JSON first for structured messages
        if let jsonData = message.data(using: .utf8),
           let jsonObject = try? JSONSerialization.jsonObject(with: jsonData, options: []) as? [String: Any] {
            handleJSONMessage(jsonObject)
        } else {
            // Handle legacy string messages
            handleLegacyMessage(message)
        }

        // Emit the receiveMessage action so the UI can listen to it
        swiftActionSender.send(.receiveMessage(message))
    }

    private func handleJSONMessage(_ jsonObject: [String: Any]) {
        guard let action = jsonObject["action"] as? String else {
            print("⚠️ JSON message missing 'action' field")
            return
        }

        switch action {
        case "showNotification":
            if let data = jsonObject["data"] as? [String: Any],
               let title = data["title"] as? String,
               let body = data["body"] as? String,
               let type = data["type"] as? String {
                print("🔔 Processing notification: \(title) - \(body)")
                showNotification(title: title, body: body, type: type)
            } else {
                print("⚠️ Invalid notification data format")
            }
        default:
            print("⚠️ Unknown JSON action: \(action)")
        }
    }

    private func handleLegacyMessage(_ message: String) {
        let lowerMessage = message.lowercased()

        // Handle authentication state changes based on message content
        if lowerMessage == "authorized" {
            // Set authentication state to true for authorized message
            setAuthenticated(true)
            print("🔐 Authentication state set to TRUE based on message: \(message)")
        } else if lowerMessage == "unauthorized" || lowerMessage == "loggedout" {
            // Set authentication state to false for unauthorized or loggedOut messages
            setAuthenticated(false)
            print("🔓 Authentication state set to FALSE based on message: \(message)")
        } else if lowerMessage == "meetingstarted" {
            // Set authentication state to true for loggedin message
            // startRecording()

            isConnecting = false      // stop loading
            isRecording = true
            isPaused = false
            timer = 0
            startTimer()

            // Show webcam when meeting starts
            startWebcam()

            // contentType = .recording
            print("🔐 Meeting started based on message: \(message)")
        } else if lowerMessage == "meetingstopped" {
            // Set authentication state to true for loggedin message
            stopRecording()
            print("🔐 Meeting stopped based on message: \(message)")
        } else if lowerMessage == "meetingmute" {
            // Set authentication state to true for loggedin message
            toggleVoiceMute()
            print("🔐 Meeting muted based on message: \(message)")
        }
    }
    
    func navigateToMainScreen(path: String? = nil) {
        print("🏠 Navigating to main screen - resetting UI state")
        
        // Reset chat-related state
        isChatMode = false
        isChatExpanded = false
        chatInput = ""
        isSendingMessage = false
        
        // Reset voice interface state
        if showVoiceInterface {
            disconnectVoiceUI()
        }
        
        // Reset recording state if active
        if isRecording {
            stopRecording()
        }
        
        // Reset webcam state
        if isCameraActive {
            stopWebcam()
        }
        
        // Emit action for JavaScript integration
        swiftActionSender.send(.navigateToMainScreen(path))
        
        print("✅ Main screen navigation completed - all states reset")
    }
    
    // MARK: - Webcam Functionality
    
    /// Toggle webcam on/off
    func toggleWebcam() {
        print("📹 Toggling webcam - current state: \(isCameraActive), showPreview: \(showCameraPreview)")
        
        if showCameraPreview {
            // Hide camera preview, show icon
            showCameraPreview = false
            if isCameraActive {
                stopWebcam()
            }
        } else {
            // Show camera preview, start webcam if not already active
            showCameraPreview = true
            if !isCameraActive {
                startWebcam()
            }
        }
        
        // Emit action for JavaScript integration
        swiftActionSender.send(.toggleWebcam)
    }
    
    /// Start webcam
    func startWebcam() {
        print("📹 Starting webcam...")
        
        // Clear any previous errors
        cameraError = nil
        isCameraStarting = true
        cameraStatus = "starting"
        
        // Emit action for JavaScript integration
        swiftActionSender.send(.startWebcam)
        
        // Request camera permission and start actual camera
        requestCameraAccess { [weak self] success in
            DispatchQueue.main.async {
                self?.isCameraStarting = false
                if success {
                    self?.isCameraActive = true
                    self?.cameraStatus = "active"
                    self?.cameraPermission = "granted"
                    print("📹 Webcam started successfully with real camera access")
                } else {
                    self?.cameraStatus = "error"
                    self?.cameraPermission = "denied"
                    self?.cameraError = "Camera access denied"
                    print("📹 Webcam failed to start - camera access denied")
                }
            }
        }
    }
    
    /// Request camera access using AVCaptureDevice
    private func requestCameraAccess(completion: @escaping (Bool) -> Void) {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            // Camera access already granted
            completion(true)
        case .notDetermined:
            // Request permission
            AVCaptureDevice.requestAccess(for: .video) { granted in
                completion(granted)
            }
        case .denied, .restricted:
            // Permission denied or restricted
            completion(false)
        @unknown default:
            completion(false)
        }
    }
    
    /// Stop webcam
    func stopWebcam() {
        print("📹 Stopping webcam...")
        
        isCameraActive = false
        showCameraPreview = false
        isCameraStarting = false
        cameraStatus = "idle"
        cameraError = nil
        
        // Emit action for JavaScript integration
        swiftActionSender.send(.stopWebcam)
        
        print("📹 Webcam stopped")
    }
    
    /// Check camera permission status
    func checkCameraPermission() {
        print("📹 Checking camera permission...")
        
        // Emit action for JavaScript integration
        swiftActionSender.send(.checkCameraPermission)
    }
    
    /// Request camera permission
    func requestCameraPermission() {
        print("📹 Requesting camera permission...")
        
        // Emit action for JavaScript integration
        swiftActionSender.send(.requestCameraPermission)
    }
    
    /// Update camera permission status from JavaScript
    func updateCameraPermission(_ permission: String) {
        DispatchQueue.main.async {
            self.cameraPermission = permission
            print("📹 Camera permission updated: \(permission)")
        }
    }
    
    /// Update camera error from JavaScript
    func updateCameraError(_ error: String?) {
        DispatchQueue.main.async {
            self.cameraError = error
            if let error = error {
                print("📹 Camera error: \(error)")
            }
        }
    }
    
    // New method to send log messages to Electron
    // func sendLogToElectron(_ message: String) {
    //     print("📝 Swift sending log to Electron: \(message)")
        
    //     // Emit action for JavaScript
    //     swiftActionSender.send(.sendLog(message))
    // }
    
    private func startTimer() {
        timerCancellable?.cancel()
        timerCancellable = Timer.publish(every: 1, on: .main, in: .common)
            .autoconnect()
            .sink { _ in
                if self.isRecording && !self.isPaused {
                    self.timer += 1
                }
            }
    }
    
    private func stopTimer() {
        timerCancellable?.cancel()
        timerCancellable = nil
    }
    
    func formatTime(_ seconds: Int) -> String {
        let minutes = seconds / 60
        let remainingSeconds = seconds % 60
        return String(format: "%d:%02d", minutes, remainingSeconds)
    }
    
    func toggleVoiceMode() {
        // Toggle voice mode UI appearance only
        showVoiceInterface.toggle()
    }
}
