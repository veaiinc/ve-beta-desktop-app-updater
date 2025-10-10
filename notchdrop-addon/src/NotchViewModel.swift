import Cocoa
import Combine
import Foundation
import SwiftUI
import AVFoundation

// MARK: - Real-time Audio Monitor for AI Speech
class AudioMonitor: ObservableObject {
    @Published var amplitude: CGFloat = 0.0
    @Published var isMonitoring: Bool = false
    
    private let engine = AVAudioEngine()
    private let player = AVAudioPlayerNode()
    
    init() {
        setupAudioEngine()
    }
    
    deinit {
        stopMonitoring()
    }
    
    private func setupAudioEngine() {
        // Setup input node to monitor system audio (AI voice output)
        let inputNode = engine.inputNode
        let inputFormat = inputNode.outputFormat(forBus: 0)
        
        // Create a mixer node for processing
        let mixerNode = AVAudioMixerNode()
        engine.attach(mixerNode)
        
        // Connect input to mixer
        engine.connect(inputNode, to: mixerNode, format: inputFormat)
        
        // Install tap on the mixer to monitor audio input
        mixerNode.installTap(onBus: 0, bufferSize: 1024, format: inputFormat) { [weak self] buffer, _ in
            self?.updateAmplitude(buffer: buffer)
        }
    }
    
    private func updateAmplitude(buffer: AVAudioPCMBuffer) {
        guard let channelData = buffer.floatChannelData?[0] else { return }
        let frameCount = Int(buffer.frameLength)
        
        // Calculate RMS (Root Mean Square) for smooth amplitude
        let sum = (0..<frameCount).reduce(0.0) { sum, i in
            sum + Double(channelData[i] * channelData[i])
        }
        let rms = sqrt(sum / Double(frameCount))
        
        // Enhanced scaling for AI voice detection (more sensitive)
        let scaledAmplitude = min(max(CGFloat(rms * 25), 0), 1) // Increased sensitivity
        
        DispatchQueue.main.async { [weak self] in
            // Smooth amplitude changes for natural animation
            withAnimation(.easeInOut(duration: 0.08)) {
                self?.amplitude = scaledAmplitude
            }
        }
    }
    
    func startMonitoring() {
        guard !isMonitoring else { return }
        
        do {
            try engine.start()
            isMonitoring = true
            print("🎤 Audio monitoring started")
        } catch {
            print("❌ Failed to start audio monitoring: \(error)")
        }
    }
    
    func stopMonitoring() {
        guard isMonitoring else { return }
        
        engine.stop()
        engine.mainMixerNode.removeTap(onBus: 0)
        isMonitoring = false
        amplitude = 0.0
        print("🔇 Audio monitoring stopped")
    }
    
    func playAudio(url: URL) {
        do {
            let file = try AVAudioFile(forReading: url)
            player.scheduleFile(file, at: nil, completionHandler: nil)
            player.play()
        } catch {
            print("❌ Failed to play audio file: \(error)")
        }
    }
}

class NotchViewModel: NSObject, ObservableObject {
    var cancellables: Set<AnyCancellable> = []
    let inset: CGFloat

    init(inset: CGFloat = -4) {
        self.inset = inset
        super.init()
        setupCancellables()
        setupAudioIntegration()
        
        // CRITICAL: Validate lock state on initialization
        DispatchQueue.main.async { [weak self] in
            self?.validateLockState()
        }
        
        // Calendar will be initialized directly by Calendar
    }

    deinit {
        // Clean up browser permission window
        if let window = browserPermissionWindow {
            window.orderOut(nil)
            browserPermissionWindow = nil
        }
        // Stop audio monitoring
        audioMonitor.stopMonitoring()
        destroy()
    }
    
    // MARK: - Audio Integration Setup
    
    /// Setup real-time audio monitoring integration
    private func setupAudioIntegration() {
        // Smart audio integration: Real-time audio vs Idle breathing state
        Publishers.CombineLatest($aiResponseIntensity, audioMonitor.$amplitude)
            .map { aiIntensity, audioAmplitude in
                // Real-time audio takes priority - this is the actual AI voice
                if audioAmplitude > 0.08 {
                    // Strong audio detected - AI is actively speaking
                    return min(1.0, audioAmplitude * 2.5) // Amplify AI voice signal
                } else if aiIntensity > 0.15 {
                    // Fallback to simulated AI response when no clear audio
                    return aiIntensity * 0.7 // Moderate simulated intensity
                } else {
                    // Relaxed idle state - AI is listening/breathing
                    // Return low value to trigger gentle breathing animation
                    return 0.05
                }
            }
            .assign(to: &$effectiveAnimationIntensity)
        
        // Start audio monitoring when voice connection is established
        $voiceConnectionStatus
            .sink { [weak self] status in
                switch status {
                case .connected:
                    self?.audioMonitor.startMonitoring()
                case .disconnected, .connecting, .error:
                    self?.audioMonitor.stopMonitoring()
                }
            }
            .store(in: &cancellables)
    }
    
    // MARK: - Performance Optimization Methods
    
    /// Throttles UI updates to prevent excessive re-renders
    private var lastUpdateTime: Date = Date()
    private let updateThrottleInterval: TimeInterval = 0.016 // ~60fps
    
    /// Batch updates to reduce re-render frequency
    private func performBatchedUpdate(_ update: @escaping () -> Void) {
        let now = Date()
        guard now.timeIntervalSince(lastUpdateTime) >= updateThrottleInterval else {
            // Queue the update for later
            DispatchQueue.main.asyncAfter(deadline: .now() + updateThrottleInterval) { [weak self] in
                self?.performBatchedUpdate(update)
            }
            return
        }
        
        lastUpdateTime = now
        update()
    }
    
    /// Optimized property update with change detection
    private func updateProperty<T: Equatable>(_ keyPath: WritableKeyPath<NotchViewModel, T>, to newValue: T) {
        guard self[keyPath: keyPath] != newValue else { return }
        performBatchedUpdate { [weak self] in
            self?[keyPath: keyPath] = newValue
        }
    }
    
    /// Optimized multiple property updates
    private func updateProperties(_ updates: @escaping () -> Void) {
        performBatchedUpdate(updates)
    }

    let animation: Animation = DynamicIslandTheme.expansionAnimation
    let hoverAnimation: Animation = DynamicIslandTheme.hoverAnimation
    // Fixed size - no width expansion functionality
    var notchOpenedSize: CGSize {
        // Fixed dimensions for unauthenticated users
        if !isAuthenticated {
            return .init(
                width: 500,  // Fixed width
                height: 180   // Fixed height
            )
        }
        
        // Teams view: fixed compact width
        if isTeamsView {
            // When meeting is active (start card hidden), fix width to 580 so chat + webcam fit
            if isRecording {
                let fixedWidth: CGFloat = 792
                let maxAllowed = max(792, screenRect.width - 40)
                return .init(
                    width: min(fixedWidth, maxAllowed),
                    height: DynamicIslandTheme.expandedHeight
                )
            }
            // Responsive width for Meeting mode with Start card visible
            let startWidth: CGFloat = 220
            let chatWidth: CGFloat = 400 // Fixed chat width
            let webcamWidth: CGFloat = 100
            let innerGaps: CGFloat = 12 * 2 // spacing between the three items
            let outerPadding: CGFloat = spacing * 2 // view padding
            let buffer: CGFloat = 24 // breathing room for outlines/shadows
            let desiredWidth = startWidth + chatWidth + webcamWidth + innerGaps + outerPadding + buffer
            let minComfortableWidth: CGFloat = 800 // Increased minimum width for larger screens
            let targetWidth = max(desiredWidth, minComfortableWidth)
            let maxAllowed = max(600, screenRect.width - 40) // Increased minimum allowed width
            let baseWidth = min(targetWidth, maxAllowed)
            let adjustedWidth = max(600, baseWidth) // Increased minimum width
            return .init(
                width: adjustedWidth,
                height: DynamicIslandTheme.expandedHeight
            )
        }
        // When showing notification, use notification-specific dimensions matching Figma
        // if showNotificationOverlay {
        //     return .init(
        //         width: 370,  // Figma design width
        //         height: 100   // Figma design height
        //     )
        // }
        // Tray mode - wider to show file items
        if isTrayMode {
            return .init(
                width: 700,  // Wider for tray items
                height: 180   // Taller for tray with AirDrop
            )
        }
        // Dynamic width based on chat mode, voice agent mode, meeting mode, and media controllers
        if isChatMode || showVoiceInterface || isRecording {
            // Chat mode, Voice Agent mode, or Meeting/Recording mode - use compact width
            let compactWidth: CGFloat = 580  // Width optimized for chat/voice/meeting input only
            return .init(
                width: compactWidth,
                height: DynamicIslandTheme.expandedHeight
            )
        } else {
            // Normal mode - show calendar and media controllers if available
            let baseWidth: CGFloat = 580  // Width without any additional components
            let calendarWidth: CGFloat = 240  // Width of Boring Notch style calendar component (increased for month header)
            let spotifyWidth: CGFloat = 160  // Width of Spotify controller
            let youtubeWidth: CGFloat = showVideoPlayer ? 300 : 200  // Width of YouTube player (300) vs controller (200)
            let mediaWidth = (hasActiveMusic ? spotifyWidth : 0) + (hasActiveVideo ? youtubeWidth : 0)
            let totalWidth = baseWidth + calendarWidth + mediaWidth
            
            return .init(
                width: totalWidth,
                height: DynamicIslandTheme.expandedHeight
            )
        }
    }
    let dropDetectorRange: CGFloat = 80

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
    
    var notchClosedRect: CGRect {
        // Use fixed dimensions with MacBook Pro scaling
        let isMacBookPro = deviceNotchRect.width > 180
        let baseWidth: CGFloat = 343  // Fixed base width for better TemporaryFolder display
        let baseHeight: CGFloat = 48  // Fixed base height for better TemporaryFolder display
        
        // Make it bigger for MacBook Pro
        let widthMultiplier: CGFloat = isMacBookPro ? 1.2 : 1.0  // 20% larger for MacBook Pro
        let visualWidth = baseWidth * widthMultiplier
        let visualHeight = baseHeight * widthMultiplier
        
        return .init(
            x: screenRect.origin.x + (screenRect.width - visualWidth) / 2,
            y: screenRect.origin.y + screenRect.height - visualHeight,
            width: visualWidth,
            height: visualHeight
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

    // MARK: - Core UI State (Grouped for performance)
    @Published private(set) var status: Status = .closed
    @Published var openReason: OpenReason = .unknown
    @Published var contentType: ContentType = .normal

    // MARK: - Layout Properties (Grouped)
    @Published var spacing: CGFloat = 16
    @Published var cornerRadius: CGFloat = 16
    @Published var deviceNotchRect: CGRect = .zero
    @Published var screenRect: CGRect = .zero
    @Published var optionKeyPressed: Bool = false
    @Published var notchVisible: Bool = true
    @Published var isInteractionEnabled: Bool = true

    // MARK: - Media State (Grouped for performance)
    @Published var hasActiveMusic: Bool = false
    @Published var isMusicPlaying: Bool = false
    @Published var hasActiveVideo: Bool = false
    @Published var videoTitle: String = ""
    @Published var videoChannel: String = ""
    @Published var videoThumbnail: NSImage? = nil
    @Published var videoDuration: String = ""
    @Published var videoCurrentTime: String = ""
    @Published var isVideoPlaying: Bool = false
    @Published var videoURL: String = ""
    @Published var videoEmbedURL: String = ""
    @Published var showVideoPlayer: Bool = false
    @PublishedPersist(key: "isNotchLocked", defaultValue: true)
    var isNotchLocked: Bool
    
    // Video state persistence
    @PublishedPersist(key: "savedVideoCurrentTime", defaultValue: 0.0)
    var savedVideoCurrentTime: Double
    
    @PublishedPersist(key: "savedVideoDuration", defaultValue: 0.0)
    var savedVideoDuration: Double
    
    @PublishedPersist(key: "savedVideoIsPlaying", defaultValue: false)
    var savedVideoIsPlaying: Bool
    
    // Browser permission state for YouTube detection
    @PublishedPersist(key: "hasBrowserPermission", defaultValue: false)
    var hasBrowserPermission: Bool
    @Published var browserPermissionRequested: Bool = false
    @Published var showBrowserPermissionRequest: Bool = false
    
    // Browser permission window
    private var browserPermissionWindow: NSWindow?

    @PublishedPersist(key: "selectedLanguage", defaultValue: .system)
    var selectedLanguage: Language

    @PublishedPersist(key: "hapticFeedback", defaultValue: true)
    var hapticFeedback: Bool

    let hapticSender = PassthroughSubject<Void, Never>()
    
    // Lightweight hover edge-detection flags (not published)
    var wasInClosedHoverZone: Bool = false
    var wasInOpenedHoverZone: Bool = false

    // Keep the app in a high-responsiveness mode during interaction
    private var performanceActivity: NSObjectProtocol?
    private var performanceStopWorkItem: DispatchWorkItem?
    private let performanceIdleTimeout: TimeInterval = 90 // seconds

    func ensureInteractivePerformance() {
        // Begin activity if not already begun
        if performanceActivity == nil {
            performanceActivity = ProcessInfo.processInfo.beginActivity(options: [
                .userInitiatedAllowingIdleSystemSleep,
                .latencyCritical,
            ], reason: "Keep NotchDrop responsive during hover/expand") as NSObjectProtocol
        }

        // Reset the idle timer to end activity later
        performanceStopWorkItem?.cancel()
        let workItem = DispatchWorkItem { [weak self] in
            self?.endInteractivePerformance()
        }
        performanceStopWorkItem = workItem
        DispatchQueue.main.asyncAfter(deadline: .now() + performanceIdleTimeout, execute: workItem)
    }

    private func endInteractivePerformance() {
        if let token = performanceActivity {
            ProcessInfo.processInfo.endActivity(token)
            performanceActivity = nil
        }
        performanceStopWorkItem?.cancel()
        performanceStopWorkItem = nil
    }

    // Debounce hover haptics to avoid repeated feedback on micro-movements
    private var lastHoverHapticTime: Date = .distantPast
    private let hoverHapticMinInterval: TimeInterval = 0.3
    func performHoverHapticIfNeeded() {
        let now = Date()
        if now.timeIntervalSince(lastHoverHapticTime) >= hoverHapticMinInterval {
            NSHapticFeedbackManager.defaultPerformer.perform(.alignment, performanceTime: .default)
            lastHoverHapticTime = now
        }
    }
    
    // MARK: - Dynamic Island UI State (Grouped for performance)
    @Published var isRecording: Bool = false
    @Published var isPaused: Bool = false
    @Published var timer: Int = 0
    @Published var isChatMode: Bool = false
    @Published var chatInput: String = ""
    @Published var isChatInputFocused: Bool = false // Track when chat input has focus
    @Published var isSendingMessage: Bool = false
    @Published var isAuthenticated: Bool = false
    @Published var controlledByDynamicIsland: Bool = false
    @Published var isConnecting = false
    @Published var isStealthModeEnabled: Bool = false
    @Published var isTeamsView: Bool = false
    
    // Transition state to defer heavy UI work during animations
    @Published var isTransitioning: Bool = false

    // Chat expansion state
    @Published var isChatExpanded: Bool = false // Deprecated - no longer used for width expansion
    @Published var chatTextHeight: CGFloat = 100
    
    // Tray/Shelf state
    @Published var isTrayMode: Bool = false

    // MARK: - Voice UI State (Grouped for performance)
    enum VoiceConnectionStatus: String { case disconnected, connecting, connected, error }
    @Published var showVoiceInterface: Bool = false
    @Published var voiceConnectionStatus: VoiceConnectionStatus = .disconnected
    @Published var isMicrophoneMuted: Bool = false
    
    // Calendar UI state
    @Published var showCalendar: Bool = true // Show calendar by default in normal mode
    
    // Voice Assistant Integration (Web-based approach)
    @Published var voiceMessages: [VoiceMessage] = []
    @Published var liveIntelligenceMessages: [VoiceMessage] = []
    @Published var isVoiceActive: Bool = false
    @Published var audioLevel: Float = 0.0
    @Published var aiResponseIntensity: CGFloat = 0.0 // Wave animation intensity (0.0 → 1.0)
    @Published var effectiveAnimationIntensity: CGFloat = 0.0 // Combined AI + real-time audio intensity
    // When recording: true -> show transcription panel; false -> show live intelligence (voice UI)
    @Published var showTranscriptionDuringRecording: Bool = true
    
    // Real-time audio monitoring for AI speech
    private let audioMonitor = AudioMonitor()
    
    // MARK: - Wake Word Detection Properties (Grouped)
    @Published var isWakeWordEnabled: Bool = false
    @Published var wakeWordScore: Float = 0.0

    // MARK: - Notification Overlay State (Grouped for performance)
    // @Published var showNotificationOverlay: Bool = false
    // @Published var notificationTitle: String = ""
    // @Published var notificationBody: String = ""
    // @Published var notificationType: String = ""
    // @Published var isNotificationHovered: Bool = false
    
    // Notification Timer State
    // private var notificationTimer: Timer?
    // private var notificationStartTime: Date?
    // private var notificationPausedTime: TimeInterval = 0
    // private let notificationDuration: TimeInterval = 10.0
    
    // Voice configuration (VE.AI settings)
    private var voiceURL: String = "wss://ve-ai-voice-agent-ginreaey.livekit.cloud"
    private var voiceToken: String = ""
    
    // MARK: - Camera/Webcam State (Grouped for performance)
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
        // Video State Actions
        case saveVideoState
        case restoreVideoState
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
    private var lastNavigationTimestamp: Date = .distantPast
    private var lastNavigationPath: String? = nil

    func notchOpen(_ reason: OpenReason) {
        // Prevent rapid opening/closing that can cause performance issues
        guard isInteractionEnabled else { return }
        guard status != .opened else { return }
        
        updateProperties {
            self.openReason = reason
            self.status = .opened
            self.contentType = .normal
        }
        
        // Avoid stealing focus when opening due to hover
        if reason != .hover {
            NSApp.activate(ignoringOtherApps: true)
        }
        // Emit expand action for JavaScript
        swiftActionSender.send(.expand)
    }

    func notchClose() {
        // CRITICAL: Always validate lock state before attempting to close
        
        // Don't close if notch is locked - simple rule
        guard !isNotchLocked else { 
            return 
        }
        
        // Prevent rapid opening/closing that can cause performance issues
        guard status != .closed else { return }
        
        // Save video state before closing if video is playing
        if hasActiveVideo && showVideoPlayer {
            // Send save video state action to trigger JavaScript saving
            swiftActionSender.send(.saveVideoState)
            
            // Also save to persistent storage immediately
            saveVideoState(currentTime: 0.0, duration: 0.0, isPlaying: false)
        }
        
        isTransitioning = true
        openReason = .unknown
        status = .closed
        contentType = .normal
        
        // Emit collapse action for JavaScript ONLY after we've actually closed (non-blocking)
        DispatchQueue.global().async { [weak self] in
            self?.swiftActionSender.send(.collapse)
        }
        
        // End transition after animation completes
        DispatchQueue.main.asyncAfter(deadline: .now() + DynamicIslandTheme.expansionDuration) { [weak self] in
            self?.isTransitioning = false
        }
    }
    
    func toggleNotchLock() {
        let currentState = isNotchLocked
        let newValue = !currentState
        
        
        // IMMEDIATE synchronous state update to prevent race conditions
        isNotchLocked = newValue
        
        // Verify state was actually updated
        
        // Force UI refresh immediately
        objectWillChange.send()
        
        if isNotchLocked {
            // If locking, ensure notch is open
            notchOpen(.click)
        } else {
            // If unlocking, log the state change
            print("🔒 Notch UNLOCKED - click outside should now work")
            
            // Force another UI update to ensure consistency
            DispatchQueue.main.async { [weak self] in
                self?.objectWillChange.send()
            }
        }
    }

    // MARK: - Lock State Validation
    
    /// Validates and ensures lock state consistency
    private func validateLockState() {
        // Lightweight validation without expensive operations
        // Force UI update to ensure consistency
        objectWillChange.send()
    }
    
    /// Forces a complete state refresh
    func forceLockStateRefresh() {
        validateLockState()
    }
    
    // MARK: - Video State Management
    
    /// Saves the current video state when notch closes
    func saveVideoState(currentTime: Double, duration: Double, isPlaying: Bool) {
        savedVideoCurrentTime = currentTime
        savedVideoDuration = duration
        savedVideoIsPlaying = isPlaying
    }
    
    /// Restores the saved video state when notch reopens
    func restoreVideoState() -> (currentTime: Double, duration: Double, isPlaying: Bool) {
        return (savedVideoCurrentTime, savedVideoDuration, savedVideoIsPlaying)
    }
    
    /// Clears saved video state (when video changes)
    func clearVideoState() {
        savedVideoCurrentTime = 0.0
        savedVideoDuration = 0.0
        savedVideoIsPlaying = false
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
        updateProperties {
            self.isConnecting = false // Set to false immediately to show recording state
            self.isRecording = true
            self.isPaused = false
            self.timer = 0
            // Ensure voice interface is not shown when recording
            self.showVoiceInterface = false
        }
        
        // 🔒 LOCK NOTCH DURING RECORDING - Perfect for showing transcriptions!
        // This prevents users from accidentally closing the notch while recording
        // and ensures transcriptions are always visible
        if !isNotchLocked {
            isNotchLocked = true
            print("🔒 Notch LOCKED for recording - transcriptions will be displayed")
        }
        
        // Ensure notch is open to show recording state and transcriptions
        notchOpen(.click)
        
        // Clear previous meeting's live intelligence data to start fresh for new meeting
        DispatchQueue.main.async {
            // print("🧠 Starting new meeting - clearing previous live intelligence data")
            self.liveIntelligenceMessages.removeAll()
            // print("🧠 Live intelligence data cleared for new meeting")
        }
        
        startTimer()
        
        // Emit action for JavaScript
        swiftActionSender.send(.startRecording)
        
        // Trigger overlay integration - this is the key addition
        // This will communicate with the overlay system to actually start recording
        // and show the Live Intelligence panel, just like the JavaScript version
        // swiftActionSender.send(.triggerOverlayToggleLiveIntelligence)
    }
    
    func stopRecording() {
        updateProperties {
            self.isRecording = false
            self.isPaused = false
            self.isConnecting = false
            self.timer = 0
        }
        
        // 🔓 UNLOCK NOTCH WHEN RECORDING ENDS - Allow normal notch behavior to resume
        // This allows users to close the notch again after recording is complete
        if isNotchLocked {
            isNotchLocked = false
            print("🔓 Notch UNLOCKED - recording ended, normal behavior restored")
        }
        
        stopTimer()
        
        // Emit action for JavaScript
        swiftActionSender.send(.stopRecording)
    }
    
    func pauseRecording() {
        isPaused = true
        stopTimer()
        
        // Keep notch locked during pause - user might want to see transcriptions
        // and resume recording, so we maintain the locked state
        print("⏸️ Recording paused - notch remains locked for transcription viewing")
        
        // Emit action for JavaScript
        swiftActionSender.send(.pauseRecording)
    }
    
    func resumeRecording() {
        isPaused = false
        startTimer()
        
        // Ensure notch remains locked when resuming recording
        if !isNotchLocked {
            isNotchLocked = true
            print("🔒 Notch re-locked - recording resumed")
        }
        
        // Emit action for JavaScript
        swiftActionSender.send(.resumeRecording)
    }
    
    // MARK: - External Recording State Management
    
    /// Handle recording state changes from overlay system
    /// This ensures notch lock state stays in sync with actual recording state
    func handleExternalRecordingStateChange(isRecording: Bool, isPaused: Bool) {
        DispatchQueue.main.async {
            if isRecording && !isPaused {
                // Recording is active - ensure notch is locked
                if !self.isNotchLocked {
                    self.isNotchLocked = true
                    print("🔒 Notch LOCKED - external recording started")
                }
                // Ensure notch is open to show recording state
                self.notchOpen(.click)
            } else if !isRecording {
                // Recording stopped - unlock notch
                if self.isNotchLocked {
                    self.isNotchLocked = false
                    print("🔓 Notch UNLOCKED - external recording stopped")
                }
            }
            // If paused, keep locked state (user might resume)
        }
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
    
    func toggleTrayMode() {
        isTrayMode.toggle()
        // Close other modes when opening tray
        if isTrayMode {
            isChatMode = false
            showVoiceInterface = false
        }
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
                
                // Pulse wave intensity when AI responds
                if isFromAgent {
                    self.pulseAIResponseIntensity(basedOnContent: content)
                }
            } else {
                print("⚠️ Skipped duplicate voice message: \(sender): \(content.prefix(50))...")
            }
        }
    }
    
    /// Add transcription data from overlay (microphone data only)
    func addTranscriptionData(sender: String, content: String, isFromAgent: Bool, timestamp: String?, confidence: Double?, words: [Any]?) {
        DispatchQueue.main.async {
            // Only accept microphone/transcription data for transcription section
            // Filter out AI agent data - it should go to live intelligence section only
            guard !isFromAgent && sender != "ai-agent" else {
                print("📝 Skipping AI agent data for transcription: \(sender)")
                return
            }
            
            // Check for duplicate messages (same sender and content)
            let isDuplicate = self.voiceMessages.contains { existingMessage in
                existingMessage.sender == sender && 
                existingMessage.content == content &&
                existingMessage.isFromAgent == isFromAgent
            }
            
            if !isDuplicate {
                let message = VoiceMessage(sender: sender, content: content, isFromAgent: isFromAgent)
                self.voiceMessages.append(message)
                
                // print("📝 Added microphone transcription data: \(sender): \(content.prefix(50))...")
                if let confidence = confidence {
                    print("📝 Confidence: \(confidence)")
                }
                if let wordCount = words?.count {
                    print("📝 Word count: \(wordCount)")
                }
                if let timestamp = timestamp {
                    print("📝 Timestamp: \(timestamp)")
                }
            } else {
                print("⚠️ Skipped duplicate transcription data: \(sender): \(content.prefix(50))...")
            }
        }
    }

    /// Add live intelligence data from overlay (AI agent only)
    func addLiveIntelligenceData(sender: String, content: String, isFromAgent: Bool, timestamp: String?, confidence: Double?, metadata: [String: Any]?) {
        DispatchQueue.main.async {
            // Only accept AI agent data for live intelligence section
            // Filter out transcription data - it should go to transcription section only
            guard isFromAgent || sender == "ai-agent" else {
                print("🧠 Skipping non-AI data for live intelligence: \(sender)")
                return
            }
            
            // Check for duplicate messages (same sender and content)
            let isDuplicate = self.liveIntelligenceMessages.contains { existingMessage in
                existingMessage.sender == sender && 
                existingMessage.content == content &&
                existingMessage.isFromAgent == isFromAgent
            }
            
            if !isDuplicate {
                let message = VoiceMessage(sender: sender, content: content, isFromAgent: isFromAgent)
                self.liveIntelligenceMessages.append(message)
                
                // Pulse wave intensity when AI provides live intelligence
                self.pulseAIResponseIntensity(basedOnContent: content)
                
                // If we're currently recording and showing transcription panel,
                // immediately switch to live intelligence view in the notch
                if self.isRecording && self.showTranscriptionDuringRecording {
                    self.showTranscriptionDuringRecording = false
                    // Ensure notch is open/expanded so the user sees the new insight
                    self.notchOpen(.click)
                    // Inform Electron/bridge so renderer stays in sync
                    self.swiftActionSender.send(.triggerOverlayToggleLiveIntelligence)
                }
                
                // print("🧠 Added AI agent live intelligence data: \(sender): \(content.prefix(50))...")
                if let confidence = confidence {
                    print("🧠 Confidence: \(confidence)")
                }
                if let metadata = metadata {
                    print("🧠 Metadata: \(metadata)")
                }
                if let timestamp = timestamp {
                    print("🧠 Timestamp: \(timestamp)")
                }
            } else {
                print("⚠️ Skipped duplicate live intelligence data: \(sender): \(content.prefix(50))...")
            }
        }
    }
    
    /// Replace entire transcription array with new data from overlay
    func replaceTranscriptions(messages: [NotchViewModel.VoiceMessage]) {
        DispatchQueue.main.async {
            print("📝 Replacing transcription array with \(messages.count) messages")
            self.voiceMessages = messages
            print("📝 Transcription array replaced successfully")
        }
    }
    
    /// Clear all live intelligence data to start fresh for new meeting
    func clearLiveIntelligenceData() {
        DispatchQueue.main.async {
            // print("🧠 Clearing all live intelligence data for new meeting")
            self.liveIntelligenceMessages.removeAll()
            // print("🧠 Live intelligence data cleared successfully")
        }
    }
    
    /// Replace entire live intelligence array with new data from overlay
    func replaceLiveIntelligenceData(messages: [NotchViewModel.VoiceMessage]) {
        DispatchQueue.main.async {
            // print("🧠 Replacing live intelligence array with \(messages.count) messages")
            self.liveIntelligenceMessages = messages
            // print("🧠 Live intelligence array replaced successfully")
        }
    }
    
    /// Pulse wave animation intensity based on AI response activity
    private func pulseAIResponseIntensity(basedOnContent content: String) {
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

    // /// Show notification overlay in the notch
    // func showNotification(title: String, body: String, type: String = "meeting") {
    //     print("🔔 Showing notification overlay: \(title) - \(body)")

    //     DispatchQueue.main.async {
    //         // Force open the notch to show the notification
    //         print("🔔 Opening notch to show notification")
    //         self.notchOpen(.click)
            
    //         // Set notification content
    //         self.notificationTitle = title
    //         self.notificationBody = body
    //         self.notificationType = type
    //         // self.showNotificationOverlay = true

    //         print("🔔 Notification state set - showOverlay: \(self.showNotificationOverlay), title: '\(self.notificationTitle)'")

    //         // Emit action for JavaScript integration
    //         self.swiftActionSender.send(.showNotification(title, body, type))

    //         // Start the notification timer
    //         self.startNotificationTimer()
    //     }
    // }

    // /// Hide notification overlay
    // func hideNotification() {
    //     DispatchQueue.main.async {
    //         self.showNotificationOverlay = false
    //         self.notificationTitle = ""
    //         self.notificationBody = ""
    //         self.notificationType = ""
    //         self.isNotificationHovered = false
            
    //         // Clean up timer
    //         self.stopNotificationTimer()
    //     }
    // }
    
    // /// Start the notification auto-dismiss timer
    // private func startNotificationTimer() {
    //     stopNotificationTimer() // Clean up any existing timer
        
    //     notificationStartTime = Date()
    //     notificationPausedTime = 0
        
    //     notificationTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
    //         guard let self = self else { return }
            
    //         if !self.isNotificationHovered {
    //             let elapsed = Date().timeIntervalSince(self.notificationStartTime ?? Date()) - self.notificationPausedTime
                
    //             if elapsed >= self.notificationDuration {
    //                 self.hideNotification()
    //             }
    //         }
    //     }
    // }
    
    // /// Stop the notification timer
    // private func stopNotificationTimer() {
    //     notificationTimer?.invalidate()
    //     notificationTimer = nil
    //     notificationStartTime = nil
    //     notificationPausedTime = 0
    // }
    
    /// Pause the notification timer when hovering
    // func pauseNotificationTimer() {
    //     if let startTime = notificationStartTime, !isNotificationHovered {
    //         notificationPausedTime += Date().timeIntervalSince(startTime)
    //         notificationStartTime = Date()
    //         isNotificationHovered = true
    //         print("⏸️ Notification timer paused")
    //     }
    // }
    
    /// Resume the notification timer when not hovering
    // func resumeNotificationTimer() {
    //     if isNotificationHovered {
    //         notificationStartTime = Date()
    //         isNotificationHovered = false
    //         print("▶️ Notification timer resumed")
    //     }
    // }

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
                // showNotification(title: title, body: body, type: type)
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

            // Clear previous meeting's live intelligence data for fresh start
            clearLiveIntelligenceData()

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
        // Throttle duplicate/rapid navigations to avoid feedback loops
        let now = Date()
        let since = now.timeIntervalSince(lastNavigationTimestamp)
        if since < 0.5 && (path == nil || path == lastNavigationPath) {
            return
        }
        lastNavigationTimestamp = now
        lastNavigationPath = path
        
        // Reset to default home mode (exit Teams view)
        isTeamsView = false
        
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
        
    }
    
    func resetToNotchHome() {
        
        // Reset to default home mode (exit Teams view)
        isTeamsView = false
        
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
        
        // Reset notification overlay
        // if showNotificationOverlay {
        //     hideNotification()
        // }
        
        // Do NOT send JavaScript action - stay within NotchDrop Swift interface
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
                    // print("📹 Webcam started successfully with real camera access")
                } else {
                    self?.cameraStatus = "error"
                    self?.cameraPermission = "denied"
                    self?.cameraError = "Camera access denied"
                    // print("📹 Webcam failed to start - camera access denied")
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
        
        // print("📹 Webcam stopped")
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
            // print("📹 Camera permission updated: \(permission)")
        }
    }
    
    /// Update camera error from JavaScript
    func updateCameraError(_ error: String?) {
        DispatchQueue.main.async {
            self.cameraError = error
            if error != nil {
                // print("📹 Camera error: \(error ?? "Unknown error")")
            }
        }
    }
    
    // MARK: - Browser Permission Methods
    
    /// Set up browser permission window monitoring
    func setupBrowserPermissionWindow() {
        // Monitor showBrowserPermissionRequest changes
        $showBrowserPermissionRequest
            .sink { [weak self] shouldShow in
                if shouldShow {
                    self?.createBrowserPermissionWindow()
                } else {
                    self?.closeBrowserPermissionWindow()
                }
            }
            .store(in: &cancellables)
    }
    
    /// Request browser permission for YouTube detection
    func requestBrowserPermission() {
        print("🌐 Requesting browser permission for YouTube detection...")
        
        DispatchQueue.main.async {
            self.browserPermissionRequested = true
            self.showBrowserPermissionRequest = true
        }
    }
    
    /// Grant browser permission
    func grantBrowserPermission() {
        print("🌐 Browser permission granted - starting permission flow")
        
        DispatchQueue.main.async {
            print("🌐 Setting hasBrowserPermission = true")
            self.hasBrowserPermission = true
            print("🌐 Setting showBrowserPermissionRequest = false")
            self.showBrowserPermissionRequest = false
            print("🌐 Browser permission flow completed")
        }
    }
    
    /// Deny browser permission
    func denyBrowserPermission() {
        print("🌐 Browser permission denied")
        
        DispatchQueue.main.async {
            self.hasBrowserPermission = false
            self.showBrowserPermissionRequest = false
        }
    }
    
    /// Create centered browser permission window
    private func createBrowserPermissionWindow() {
        guard browserPermissionWindow == nil else { 
            print("🌐 Browser permission window already exists, skipping creation")
            return 
        }
        
        print("🌐 Creating browser permission window...")
        
        // Get the main screen
        guard let screen = NSScreen.main else { 
            print("🌐 Error: Could not get main screen")
            return 
        }
        let screenFrame = screen.frame
        
        // Create a centered window like system notifications
        let windowWidth: CGFloat = 360
        let windowHeight: CGFloat = 200
        let windowFrame = NSRect(
            x: screenFrame.midX - windowWidth / 2,
            y: screenFrame.midY - windowHeight / 2 + 100, // Slightly above center like system notifications
            width: windowWidth,
            height: windowHeight
        )
        
        browserPermissionWindow = NSWindow(
            contentRect: windowFrame,
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )
        
        guard let window = browserPermissionWindow else { 
            print("🌐 Error: Failed to create browser permission window")
            return 
        }
        
        print("🌐 Browser permission window created successfully")
        
        // Configure window like system notifications - but safer settings
        window.level = .modalPanel  // Use modalPanel instead of floating to avoid conflicts
        window.isOpaque = false
        window.backgroundColor = NSColor.clear
        window.hasShadow = true
        window.isMovable = false
        window.collectionBehavior = [.canJoinAllSpaces, .stationary]
        window.animationBehavior = .documentWindow
        window.isReleasedWhenClosed = false  // Prevent automatic cleanup
        window.hidesOnDeactivate = false     // Don't hide when app loses focus
        
        // Create the permission view
        let permissionView = BrowserPermissionRequestView(vm: self)
        let hostingView = NSHostingView(rootView: permissionView)
        window.contentView = hostingView
        
        // Show with animation - but don't make it key window
        window.alphaValue = 0
        window.orderFront(nil)  // Use orderFront instead of makeKeyAndOrderFront
        
        NSAnimationContext.runAnimationGroup { context in
            context.duration = 0.3
            context.timingFunction = CAMediaTimingFunction(name: .easeOut)
            window.animator().alphaValue = 1.0
        }
    }
    
    /// Close browser permission window
    private func closeBrowserPermissionWindow() {
        guard let window = browserPermissionWindow else { 
            print("🌐 Browser permission window already closed")
            return 
        }
        
        print("🌐 Closing browser permission window...")
        
        NSAnimationContext.runAnimationGroup({ context in
            context.duration = 0.2
            context.timingFunction = CAMediaTimingFunction(name: .easeIn)
            window.animator().alphaValue = 0.0
        }, completionHandler: {
            // Safely close the window
            DispatchQueue.main.async {
                print("🌐 Ordering out browser permission window")
                window.orderOut(nil)  // Use orderOut instead of close()
                self.browserPermissionWindow = nil
                print("🌐 Browser permission window closed successfully")
            }
        })
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
