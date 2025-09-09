import Cocoa
import Combine
import Foundation
import SwiftUI

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
    // Dynamic opened size matches React spec; width adjusts when recording or chat expanded, height stays constant
    var notchOpenedSize: CGSize {
        if isRecording && isChatExpanded {
            // Recording + Chat expanded: Use the larger width for better chat experience
            let expandedWidth = max(DynamicIslandTheme.recordingExpandedWidth, DynamicIslandTheme.chatExpandedWidth)
            return .init(
                width: expandedWidth,
                height: DynamicIslandTheme.recordingExpandedHeight
            )
        } else if isRecording {
            // Recording only
            return .init(
                width: DynamicIslandTheme.recordingExpandedWidth,
                height: DynamicIslandTheme.recordingExpandedHeight
            )
        } else if isChatExpanded {
            // Chat expanded only (when not recording)
            return .init(
                width: DynamicIslandTheme.chatExpandedWidth,
                height: DynamicIslandTheme.expandedHeight
            )
        }
        // Default compact size when not expanded
        return .init(
            width: DynamicIslandTheme.compactWidth,
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
    
    // Chat expansion state
    @Published var isChatExpanded: Bool = false
    @Published var chatTextHeight: CGFloat = 100

    // Voice UI state (UI parity with React)
    enum VoiceConnectionStatus: String { case disconnected, connecting, connected, error }
    @Published var showVoiceInterface: Bool = false
    @Published var voiceConnectionStatus: VoiceConnectionStatus = .disconnected
    @Published var isMicrophoneMuted: Bool = false
    
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
        case navigateToMainScreen
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
        isRecording = true
        isPaused = false
        timer = 0
        startTimer()
        
        // Emit action for JavaScript
        swiftActionSender.send(.startRecording)
        
        // Trigger overlay integration - this is the key addition
        // This will communicate with the overlay system to actually start recording
        // and show the Live Intelligence panel, just like the JavaScript version
        // swiftActionSender.send(.triggerOverlayToggleLiveIntelligence)
    }
    
    func stopRecording() {
        isRecording = false
        isPaused = false
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

    // Voice UI helpers (UI-only; wiring can follow once UI is approved)
    func connectVoiceUI() {
        showVoiceInterface = true
        voiceConnectionStatus = .connecting
        // Simulate quick connect visually
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            self.voiceConnectionStatus = .connected
        }
    }

    func disconnectVoiceUI() {
        voiceConnectionStatus = .disconnected
        showVoiceInterface = false
        isMicrophoneMuted = false
    }

    func toggleMicMute() {
        isMicrophoneMuted.toggle()
    }
    
    func setAuthenticated(_ authenticated: Bool) {
        isAuthenticated = authenticated
        
        // Emit action for JavaScript
        swiftActionSender.send(.setAuthenticated(authenticated))
    }
    
    func navigateToMainScreen() {
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
        
        // Emit action for JavaScript integration
        swiftActionSender.send(.navigateToMainScreen)
        
        print("✅ Main screen navigation completed - all states reset")
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
}
