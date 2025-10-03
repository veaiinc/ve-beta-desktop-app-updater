import Cocoa
import Foundation
import SwiftUI
import UniformTypeIdentifiers
import Combine

// MARK: - Custom Panel for NotchDrop
class NotchDropPanel: NSPanel {
    override var canBecomeKey: Bool { true }
    override var canBecomeMain: Bool { false }

    override init(
        contentRect: NSRect,
        styleMask style: NSWindow.StyleMask,
        backing bufferingType: NSWindow.BackingStoreType,
        defer flag: Bool
    ) {
        super.init(contentRect: contentRect, styleMask: style, backing: bufferingType, defer: flag)
        isFloatingPanel = true
        becomesKeyOnlyIfNeeded = false  // Allow window to become key for text input
        worksWhenModal = true
        hidesOnDeactivate = false
    }

    override func makeFirstResponder(_ responder: NSResponder?) -> Bool {
        // Allow SwiftUI text inputs to receive focus properly
        return super.makeFirstResponder(responder)
    }
    
    override func becomeKey() {
        super.becomeKey()
        // Ensure the window can receive keyboard input for text fields
    }
    
    override func resignKey() {
        super.resignKey()
        // Handle focus loss gracefully
    }
}

// MARK: - Core NotchDrop Implementation
@objc public class NotchDropCore: NSObject {

    // MARK: - Properties
    private var notchWindow: NSWindow?
    private var isVisible: Bool = false
    private var status: String = "closed"
    private var contentType: String = "normal"
    private var hapticFeedback: Bool = true
    private var notchViewModel: NotchViewModel?
    private let notchWindowLevel: NSWindow.Level = {
        let assistive = NSWindow.Level(rawValue: Int(CGWindowLevelForKey(.assistiveTechHighWindow)))
        let statusBar = NSWindow.Level.statusBar
        return assistive.rawValue > statusBar.rawValue ? assistive : statusBar
    }()

    // MARK: - Callbacks
    private var statusChangedCallback: ((String) -> Void)?
    private var fileDroppedCallback: ((String) -> Void)?
    private var itemAddedCallback: ((String) -> Void)?
    private var itemRemovedCallback: ((String) -> Void)?
    private var swiftActionCallback: ((String, String) -> Void)?
    private var incomingActionCallback: ((String, String) -> Void)?

    // MARK: - Singleton
    @objc public static let shared = NotchDropCore()

    private override init() {
        super.init()
        setupNotchDrop()
    }

    // MARK: - Setup
    private func setupNotchDrop() {
        DispatchQueue.main.async { [weak self] in
            self?.createNotchWindow()
        }
    }

    private func createNotchWindow() {
        guard notchWindow == nil else { return }

        // Use the same screen selection logic as NotchDropLatest
        let screen = findScreenFitsOurNeeds()
        guard let screen = screen else { return }

        let screenFrame = screen.frame
        let notchHeight: CGFloat = 200 // Full height like NotchDropLatest

        // Position at the very top of the screen (same as NotchDropLatest)
        let topRect = CGRect(
            x: screenFrame.origin.x,
            y: screenFrame.origin.y + screenFrame.height - notchHeight,
            width: screenFrame.width,
            height: notchHeight
        )

        let panelStyle: NSWindow.StyleMask = [
            .borderless,
            .fullSizeContentView,
            .nonactivatingPanel,
        ]

        notchWindow = NotchDropPanel(
            contentRect: topRect,
            styleMask: panelStyle,
            backing: .buffered,
            defer: false
        )

        guard let window = notchWindow else { return }

        // Use the same window properties as NotchDropLatest
        window.level = notchWindowLevel
        window.isOpaque = false
        window.alphaValue = 1
        window.titleVisibility = .hidden
        window.titlebarAppearsTransparent = true
        window.backgroundColor = NSColor.clear
        window.isMovable = false
        window.hasShadow = false
        window.collectionBehavior = [
            .fullScreenAuxiliary,
            .canJoinAllSpaces,
            .stationary,
            .transient,
            .ignoresCycle,
        ]
        window.isExcludedFromWindowsMenu = true
        window.isReleasedWhenClosed = false
        window.animationBehavior = .none
        
        // CRITICAL: Enable keyboard input and first responder capabilities
        window.acceptsMouseMovedEvents = true
        window.setFrame(topRect, display: false)
        
        // Make window completely fixed like Boring Notch
        window.isMovableByWindowBackground = false
        window.isMovable = false
        // window.ignoresMouseEvents = false
        window.hidesOnDeactivate = false

        // Don't set initial first responder - let SwiftUI manage TextField focus

        // Create the proper NotchDrop UI
        var notchSize = screen.notchSize
        let vm = NotchViewModel(inset: notchSize == .zero ? 0 : -4)
        self.notchViewModel = vm
        
        // Set up the device notch rect using actual notch detection (same as NotchDropLatest)
        if notchSize == .zero {
            notchSize = .init(width: 150, height: 28)
        }
        vm.deviceNotchRect = CGRect(
            x: screenFrame.origin.x + (screenFrame.width - notchSize.width) / 2,
            y: screenFrame.origin.y + screenFrame.height - notchSize.height,
            width: notchSize.width,
            height: notchSize.height
        )
        vm.screenRect = screenFrame

        // Create the proper NotchView
        let notchView = NotchView(vm: vm)

        // Set up status monitoring
        vm.$status
            .sink { [weak self] newStatus in
                let statusString = String(describing: newStatus)
                self?.status = statusString
                self?.statusChangedCallback?(statusString)
                // Ensure the notch window stays visible/above when opening (especially in fullscreen spaces)
                if statusString == "opened" {
                    self?.enforceWindowPresentation()
                }
            }
            .store(in: &vm.cancellables)

        // Set up Swift action monitoring
        vm.swiftActionSender
            .sink { [weak self] action in
                self?.handleSwiftAction(action)
            }
            .store(in: &vm.cancellables)

        let hostingView = NSHostingView(rootView: notchView)
        window.contentView = hostingView
        
        // Make window visible initially (same as NotchDropLatest)
        window.makeKeyAndOrderFront(nil)

        // Follow active space changes to keep the window visible above full-screen spaces
        NSWorkspace.shared.notificationCenter.addObserver(
            forName: NSWorkspace.activeSpaceDidChangeNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            guard let self, let window = self.notchWindow, let screen = window.screen else { return }
            // Reposition to the top of the current screen and bring forward
            let screenFrame = screen.frame
            let notchHeight: CGFloat = 200
            let topRect = CGRect(
                x: screenFrame.origin.x,
                y: screenFrame.origin.y + screenFrame.height - notchHeight,
                width: screenFrame.width,
                height: notchHeight
            )
            window.setFrame(topRect, display: false)
            self.enforceWindowPresentation()
        }

        // Also react to screen reconfiguration (external monitors attach/detach)
        NotificationCenter.default.addObserver(
            forName: NSApplication.didChangeScreenParametersNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            guard let self, let window = self.notchWindow else { return }
            // Keep the window on the primary/builtin screen if present
            if let target = self.findScreenFitsOurNeeds() {
                let screenFrame = target.frame
                let notchHeight: CGFloat = 200
                let topRect = CGRect(
                    x: screenFrame.origin.x,
                    y: screenFrame.origin.y + screenFrame.height - notchHeight,
                    width: screenFrame.width,
                    height: notchHeight
                )
                window.setFrame(topRect, display: false)
                // Recompute VM rects
                var notchSize = target.notchSize
                if notchSize == .zero { notchSize = .init(width: 150, height: 28) }
                self.notchViewModel?.deviceNotchRect = CGRect(
                    x: screenFrame.origin.x + (screenFrame.width - notchSize.width) / 2,
                    y: screenFrame.origin.y + screenFrame.height - notchSize.height,
                    width: notchSize.width,
                    height: notchSize.height
                )
                self.notchViewModel?.screenRect = screenFrame
            }
            self.enforceWindowPresentation()
        }
    }

    private func enforceWindowPresentation() {
        guard let window = notchWindow else { return }
        if window.level != notchWindowLevel {
            window.level = notchWindowLevel
        }
        if !window.isVisible {
            window.makeKeyAndOrderFront(nil)
        }
        window.orderFrontRegardless()
    }
    
    // Add the same screen selection logic as NotchDropLatest
    private func findScreenFitsOurNeeds() -> NSScreen? {
        if let screen = NSScreen.buildin, screen.notchSize != .zero { return screen }
        return .main
    }

    // MARK: - Public API
    @objc public func initializeNotchDrop() {
        // Already initialized in init()
    }

    @objc public func showNotchDrop() {
        DispatchQueue.main.async { [weak self] in
            guard let window = self?.notchWindow else { return }
            
            // Make the window key and visible
            window.makeKeyAndOrderFront(nil)
            self?.enforceWindowPresentation()
            
            // Don't immediately set first responder - let SwiftUI handle TextField focus
            
            self?.isVisible = true
            self?.notchViewModel?.notchOpen(.click)
        }
    }

    @objc public func hideNotchDrop() {
        DispatchQueue.main.async { [weak self] in
            self?.notchWindow?.orderOut(nil)
            self?.isVisible = false
            self?.notchViewModel?.notchClose()
        }
    }

    @objc public func toggleNotchDrop() {
        if isVisible {
            hideNotchDrop()
        } else {
            showNotchDrop()
        }
    }

    @objc public func isNotchDropVisible() -> Bool {
        return isVisible
    }

    @objc public func setNotchDropStatus(_ status: String) {
        self.status = status
        DispatchQueue.main.async { [weak self] in
            switch status {
            case "opened":
                self?.notchViewModel?.notchOpen(.click)
            case "closed":
                self?.notchViewModel?.notchClose()
            default:
                break
            }
        }
    }

    @objc public func getNotchDropStatus() -> String {
        return status
    }

    @objc public func setNotchDropContentType(_ contentType: String) {
        self.contentType = contentType
        DispatchQueue.main.async { [weak self] in
            switch contentType {
            case "normal":
                self?.notchViewModel?.contentType = .normal
            default:
                break
            }
        }
    }

    @objc public func getNotchDropContentType() -> String {
        return contentType
    }

    @objc public func handleDroppedFiles(_ filePaths: [String]) {
        // Convert file paths to URLs and handle them
        let urls = filePaths.compactMap { URL(string: $0) }
        for url in urls {
            fileDroppedCallback?(url.path)
        }
    }

    @objc public func getCurrentItems() -> [String] {
        // Return current tray items
        return []
    }

    @objc public func clearAllItems() {
        // Clear all tray items
        itemRemovedCallback?("all")
    }

    @objc public func setHapticFeedback(_ enabled: Bool) {
        hapticFeedback = enabled
        DispatchQueue.main.async { [weak self] in
            self?.notchViewModel?.hapticFeedback = enabled
        }
    }

    @objc public func getHapticFeedback() -> Bool {
        return hapticFeedback
    }

    @objc public func setNotchVisible(_ visible: Bool) {
        if visible {
            showNotchDrop()
        } else {
            hideNotchDrop()
        }
    }

    @objc public func getNotchVisible() -> Bool {
        return isVisible
    }

    @objc public func getWindowPosition() -> [String: CGFloat] {
        guard let window = notchWindow else {
            return ["x": 0, "y": 0, "width": 0, "height": 0]
        }

        let frame = window.frame
        return [
            "x": frame.origin.x,
            "y": frame.origin.y,
            "width": frame.size.width,
            "height": frame.size.height
        ]
    }

    // MARK: - Advanced NotchDropLatest methods
    // @objc public func showMenu() {
    //     setNotchDropContentType("menu")
    // }

    // @objc public func showSettings() {
    //     setNotchDropContentType("settings")
    // }

    @objc public func showNormal() {
        setNotchDropContentType("normal")
    }

    @objc public func setAutoOpen(_ enabled: Bool) {
        // Auto-open functionality
    }

    @objc public func getAutoOpen() -> Bool {
        return true
    }

    @objc public func setLanguage(_ language: String) {
        // Language setting
    }

    @objc public func getLanguage() -> String {
        return "system"
    }

    @objc public func getTrayItemCount() -> Int {
        return 0
    }

    @objc public func clearTrayItems() {
        clearAllItems()
    }

    @objc public func getStatusString() -> String {
        return getNotchDropStatus()
    }

    @objc public func getContentTypeString() -> String {
        return getNotchDropContentType()
    }

    @objc public func setContentTypeFromString(_ contentType: String) {
        setNotchDropContentType(contentType)
    }

    // MARK: - Callback Setters
    @objc public func setNotchDropStatusChangedCallback(_ callback: @escaping (String) -> Void) {
        statusChangedCallback = callback
    }

    @objc public func setFileDroppedCallback(_ callback: @escaping (String) -> Void) {
        fileDroppedCallback = callback
    }

    @objc public func setItemAddedCallback(_ callback: @escaping (String) -> Void) {
        itemAddedCallback = callback
    }

    @objc public func setItemRemovedCallback(_ callback: @escaping (String) -> Void) {
        itemRemovedCallback = callback
    }

    @objc public func setSwiftActionCallback(_ callback: @escaping (String, String) -> Void) {
        swiftActionCallback = callback
    }
    
    @objc public func setIncomingActionCallback(_ callback: @escaping (String, String) -> Void) {
        incomingActionCallback = callback
    }
    
    @objc public func handleIncomingAction(_ action: String, data: String) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let viewModel = self.notchViewModel else { return }
            
            switch action {
            case "receiveMessage":
                viewModel.receiveMessage(data)
            default:
                break
            }
        }
    }
    
    // MARK: - Overlay State Integration
    @objc public func onOverlayStateChange(_ state: [String: Any]) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let viewModel = self.notchViewModel else { 
                return 
            }
            
            
            // Update recording state
            if let isRecording = state["isRecording"] as? Bool {
                viewModel.isRecording = isRecording
                
                // Stop the timer if recording stopped
                if !isRecording {
                    viewModel.stopRecording()
                }
            }
            
            // Update pause state
            if let isPaused = state["isPaused"] as? Bool {
                viewModel.isPaused = isPaused
            }
            
            // Update timer
            if let timer = state["timer"] as? Int {
                viewModel.timer = timer
            }
            
            // Chat mode removed - no longer needed
            
            // Update authentication state
            if let isAuthenticated = state["isAuthenticated"] as? Bool {
                viewModel.isAuthenticated = isAuthenticated
            }
            
            // Update controlled by dynamic island state
            if let controlledByDynamicIsland = state["controlledByDynamicIsland"] as? Bool {
                viewModel.controlledByDynamicIsland = controlledByDynamicIsland
            }
            
        }
    }
    
    // MARK: - Voice Assistant Configuration
    @objc public func configureVoice(_ url: String, token: String) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let viewModel = self.notchViewModel else { 
                return 
            }
            
            viewModel.configureVoice(url: url, token: token)
        }
    }
    
    @objc public func connectVoiceAssistant() {
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let viewModel = self.notchViewModel else { return }
            viewModel.connectVoiceAssistant()
        }
    }
    
    @objc public func disconnectVoiceAssistant() {
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let viewModel = self.notchViewModel else { return }
            viewModel.disconnectVoiceAssistant()
        }
    }
    
    @objc public func getVoiceConnectionStatus() -> String {
        guard let viewModel = notchViewModel else { return "disconnected" }
        return viewModel.voiceConnectionStatus.rawValue
    }
    
    @objc public func updateVoiceConnectionState(_ status: String) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let viewModel = self.notchViewModel else { return }
            viewModel.updateVoiceConnectionState(status)
        }
    }
    
    @objc public func updateVoiceMuteState(_ isMuted: Bool) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let viewModel = self.notchViewModel else { return }
            viewModel.isMicrophoneMuted = isMuted
        }
    }

    // @objc public func updateStealthModeState(_ isEnabled: Bool) {
    //     DispatchQueue.main.async { [weak self] in
    //         guard let self = self, let viewModel = self.notchViewModel else { return }
    //         viewModel.updateStealthModeState(isEnabled)
    //     }
    // }
    
    @objc public func addVoiceMessage(_ messageJson: String) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let viewModel = self.notchViewModel else { return }
            
            // Parse JSON message
            guard let messageData = messageJson.data(using: .utf8),
                  let json = try? JSONSerialization.jsonObject(with: messageData) as? [String: Any],
                  let sender = json["sender"] as? String,
                  let content = json["content"] as? String else {
                return
            }
            
            let isFromAgent = json["isFromAgent"] as? Bool ?? false
            viewModel.addVoiceMessage(sender: sender, content: content, isFromAgent: isFromAgent)
        }
    }
    
    @objc public func addTranscriptionData(_ messageJson: String) {
        print("📝 Swift Core: Received transcription data JSON: \(messageJson)")
        
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let viewModel = self.notchViewModel else { 
                print("📝 Swift Core: No viewModel available")
                return 
            }
            
            print("📝 Swift Core: Parsing JSON data...")
            
            // Parse JSON message
            guard let messageData = messageJson.data(using: .utf8),
                  let json = try? JSONSerialization.jsonObject(with: messageData) as? [String: Any],
                  let sender = json["sender"] as? String,
                  let content = json["content"] as? String else {
                print("📝 Swift Core: Failed to parse JSON data")
                return
            }
            
            let isFromAgent = json["isFromAgent"] as? Bool ?? false
            let timestamp = json["timestamp"] as? String
            let confidence = json["confidence"] as? Double
            let words = json["words"] as? [Any]
            
            print("📝 Swift Core: Parsed data - Sender: \(sender), Content: \(content.prefix(50))..., IsFromAgent: \(isFromAgent)")
            
            // Add transcription data to viewModel
            viewModel.addTranscriptionData(
                sender: sender, 
                content: content, 
                isFromAgent: isFromAgent,
                timestamp: timestamp,
                confidence: confidence,
                words: words
            )
            
            print("📝 Swift Core: Called viewModel.addTranscriptionData")
        }
    }

    @objc public func sendLiveIntelligenceData(_ messageJson: String) {
        print("🧠 Swift Core: Received live intelligence data JSON: \(messageJson)")
        
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let viewModel = self.notchViewModel else { 
                print("🧠 Swift Core: No viewModel available")
                return 
            }
            
            print("🧠 Swift Core: Parsing JSON data...")
            
            // Parse JSON message
            guard let messageData = messageJson.data(using: .utf8),
                  let json = try? JSONSerialization.jsonObject(with: messageData) as? [String: Any],
                  let sender = json["sender"] as? String,
                  let content = json["content"] as? String else {
                print("🧠 Swift Core: Failed to parse JSON data")
                return
            }
            
            let isFromAgent = json["isFromAgent"] as? Bool ?? true // Live intelligence is from AI agent
            let timestamp = json["timestamp"] as? String
            let confidence = json["confidence"] as? Double
            let metadata = json["metadata"] as? [String: Any]
            
            print("🧠 Swift Core: Parsed data - Sender: \(sender), Content: \(content.prefix(50))..., IsFromAgent: \(isFromAgent)")
            
            // Add live intelligence data to viewModel
            viewModel.addLiveIntelligenceData(
                sender: sender, 
                content: content, 
                isFromAgent: isFromAgent,
                timestamp: timestamp,
                confidence: confidence,
                metadata: metadata
            )
            
            print("🧠 Swift Core: Called viewModel.addLiveIntelligenceData")
        }
    }

    // Replace the entire transcription/voiceMessages array from JSON array
    @objc public func replaceTranscriptions(_ messagesJson: String) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let viewModel = self.notchViewModel else { return }

            guard let data = messagesJson.data(using: .utf8),
                  let jsonArray = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] else {
                print("📝 Swift Core: Failed to parse messages JSON array")
                return
            }

            // Map to VoiceMessage
            var newMessages: [NotchViewModel.VoiceMessage] = []
            for obj in jsonArray {
                let sender = (obj["sender"] as? String) ?? "overlay"
                let content = (obj["content"] as? String) ?? (obj["text"] as? String) ?? ""
                let isFromAgent = (obj["isFromAgent"] as? Bool) ?? false
                let message = NotchViewModel.VoiceMessage(sender: sender, content: content, isFromAgent: isFromAgent)
                newMessages.append(message)
            }

            viewModel.replaceTranscriptions(messages: newMessages)
            print("📝 Swift Core: Replaced voiceMessages (count=\(newMessages.count))")
        }
    }

    // Toggle what to show during recording: "transcription" or "live-intel"
    @objc public func setRecordingPanelMode(_ mode: String) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let viewModel = self.notchViewModel else { return }
            let normalized = mode.lowercased()
            // Overlay 'transcription' => Notch shows live intelligence (hide transcription)
            // Overlay 'live-intel'   => Notch shows transcription panel
            viewModel.showTranscriptionDuringRecording = (normalized == "live-intel")
            print("🧭 Swift Core: setRecordingPanelMode=\(normalized) | showTranscriptionDuringRecording=\(viewModel.showTranscriptionDuringRecording)")
        }
    }
    
    // MARK: - Wake Word Detection Methods
    
    @objc public func handleWakeWordDetected(_ score: Float) {
        DispatchQueue.main.async { [weak self] in
            guard let viewModel = self?.notchViewModel else { return }
            viewModel.handleWakeWordDetected(score: score)
        }
    }
    
    // MARK: - Swift Action Handling
    private func handleSwiftAction(_ action: NotchViewModel.SwiftAction) {
        switch action {
        case .startRecording:
            swiftActionCallback?("startRecording", "")
        case .stopRecording:
            swiftActionCallback?("stopRecording", "")
        case .pauseRecording:
            swiftActionCallback?("pauseRecording", "")
        case .resumeRecording:
            swiftActionCallback?("resumeRecording", "")
        case .toggleChatMode:
            swiftActionCallback?("toggleChatMode", "")
        case .submitChat(let message):
            swiftActionCallback?("submitChat", message)
        case .sendChatMessageToAskAI(let chatMessage):
            // Convert dictionary to JSON string for the callback
            if let jsonData = try? JSONSerialization.data(withJSONObject: chatMessage, options: []),
               let jsonString = String(data: jsonData, encoding: .utf8) {
                swiftActionCallback?("sendChatMessageToAskAI", jsonString)
            }
        case .setAuthenticated(let authenticated):
            swiftActionCallback?("setAuthenticated", authenticated ? "true" : "false")
        case .expand:
            swiftActionCallback?("expand", "")
        case .collapse:
            swiftActionCallback?("collapse", "")
        case .triggerOverlayToggleLiveIntelligence:
            swiftActionCallback?("triggerOverlayToggleLiveIntelligence", "")
        case .sendLog(let message):
            swiftActionCallback?("sendLog", message)
        case .navigateToMainScreen(let path):
            swiftActionCallback?("navigateToMainScreen", path ?? "")
        // Voice Assistant Actions
        case .connectVoice:
            swiftActionCallback?("connectVoice", "")
        case .disconnectVoice:
            swiftActionCallback?("disconnectVoice", "")
        case .toggleVoiceMute:
            swiftActionCallback?("toggleVoiceMute", "")
        case .sendVoiceMessage(let message):
            swiftActionCallback?("sendVoiceMessage", message)
        case .voiceConnectionStateChanged(let state):
            swiftActionCallback?("voiceConnectionStateChanged", state)
        case .startVoiceAgent:
            swiftActionCallback?("startVoiceAgent", "")
        case .receiveMessage(let message):
            swiftActionCallback?("receiveMessage", message)
        // Wake Word Detection Actions
        case .wakeWordDetected(let score):
            swiftActionCallback?("wakeWordDetected", String(score))
        // Notification Actions
        case .showNotification(let title, let body, let type):
            let notificationData = "\(title)|\(body)|\(type)"
            swiftActionCallback?("showNotification", notificationData)
        // Webcam Actions
        case .toggleWebcam:
            swiftActionCallback?("toggleWebcam", "")
        case .startWebcam:
            swiftActionCallback?("startWebcam", "")
        case .stopWebcam:
            swiftActionCallback?("stopWebcam", "")
        case .checkCameraPermission:
            swiftActionCallback?("checkCameraPermission", "")
        case .requestCameraPermission:
            swiftActionCallback?("requestCameraPermission", "")
        case .toggleStealthMode:
            swiftActionCallback?("toggleStealthMode", "")
        // Video State Actions
        case .saveVideoState:
            swiftActionCallback?("saveVideoState", "")
        case .restoreVideoState:
            swiftActionCallback?("restoreVideoState", "")
        }
    }
    // MARK: - Stealth Mode
    @objc public func updateStealthModeState(_ isEnabled: Bool) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let window = self.notchWindow else {
                print(":pirate_flag: NotchDropCore: No window available for stealth mode")
                return
            }
            print(":pirate_flag: NotchDropCore: Applying stealth mode: \(isEnabled)")
            print(":pirate_flag: NotchDropCore: Window type: \(type(of: window))")
            print(":pirate_flag: NotchDropCore: Window title: \(window.title)")
            print(":pirate_flag: NotchDropCore: Window isVisible: \(window.isVisible)")
            if isEnabled {
                // STEALTH MODE ON: Hide from screen recordings but keep visible to user
                print(":pirate_flag: NotchDropCore: ENABLING stealth mode - hiding from recordings only")
                // Method 1: Set sharing type to exclude from screen recording
                if #available(macOS 10.13, *) {
                    window.sharingType = .none
                    print(":pirate_flag: NotchDropCore: Window sharingType set to .none (hidden from recordings)")
                }
                // Method 2: Set window level to be above screen recording level
                window.level = NSWindow.Level(rawValue: Int(CGWindowLevelForKey(.maximumWindow)))
                print(":pirate_flag: NotchDropCore: Window level set to maximum (above recording)")
                // Keep window visible to user - DO NOT hide or make transparent
                print(":pirate_flag: NotchDropCore: Window remains visible to user")
            } else {
                // STEALTH MODE OFF: Restore normal behavior
                print(":pirate_flag: NotchDropCore: DISABLING stealth mode - restoring normal recording")
                // Restore normal sharing type
                if #available(macOS 10.13, *) {
                    window.sharingType = .readOnly
                    print(":pirate_flag: NotchDropCore: Window sharingType restored to .readOnly")
                }
                // Restore ORIGINAL window level (not normal, but the custom notch level)
                window.level = self.notchWindowLevel
                print(":pirate_flag: NotchDropCore: Window level restored to normal")
                // Ensure window is visible
                if !window.isVisible {
                    window.orderFront(nil)
                    window.makeKeyAndOrderFront(nil)
                    self.enforceWindowPresentation()
                    print(":pirate_flag: NotchDropCore: Window restored to visible state")
                }
            }
            print(":pirate_flag: NotchDropCore: Stealth mode \(isEnabled ? "ENABLED" : "DISABLED")")
        }
    }


}
