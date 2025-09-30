
import SwiftUI
import UniformTypeIdentifiers
import AppKit
import Combine
import AVFoundation

struct NotchContentView: View {
    @StateObject var vm: NotchViewModel
    @State private var showInfoPopup: Bool = false
    @State private var infoPopupPosition: CGPoint = .zero
    
    var body: some View {
        ZStack {
            if vm.showNotificationOverlay {
                // When notification is showing, ONLY show the notification (no background content)
                NotificationOverlayView(vm: vm)
                    .transition(.scale(scale: 1.0).combined(with: .opacity))
            } else {
                // Normal content switching when no notification
                switch vm.contentType {
                case .normal:
                    DynamicIslandContentView(vm: vm, showInfoPopup: $showInfoPopup, infoPopupPosition: $infoPopupPosition)
                        .transition(.scale(scale: 0.8).combined(with: .opacity))
                }
            }
            
            // Info popup rendered outside the notch container
            if showInfoPopup {
                InfoPopupMenu()
                    .offset(x: 400, y: 0) // Position to the right of the notch
                    .zIndex(1000) // Ensure it appears above everything
                    .transition(.scale(scale: 0.95).combined(with: .opacity))
            }
        }
        .animation(vm.animation, value: vm.contentType)
        .animation(vm.animation, value: vm.showNotificationOverlay)
    }
}

// New Dynamic Island Content View matching JavaScript structure
struct DynamicIslandContentView: View {
    @StateObject var vm: NotchViewModel
    @Binding var showInfoPopup: Bool
    @Binding var infoPopupPosition: CGPoint
    @FocusState private var isChatInputFocused: Bool
    @State private var isTextFieldActive: Bool = false
    @State private var textEditorHeight: CGFloat = 100 // Dynamic height for textarea
    @State private var receivedMessage: String = "" // Track received messages from Electron
    @State private var cancellables = Set<AnyCancellable>()
    
    var body: some View {
        VStack(spacing: 3.0) {
            if !vm.isAuthenticated {
                // Welcome section when not authenticated
                VStack(spacing: 8) {
                    Text("hello")
                        .font(.system(size: 48, weight: .light, design: .default))
                        .foregroundColor(.white)
                    Text("Please log in to access features")
                        .font(.system(size: 14, weight: .regular))
                        .foregroundColor(.white.opacity(0.8))
                    
                    // Test buttons
                    HStack(spacing: 8) {
                        Button("Login") {
                            vm.navigateToMainScreen(path: "/verify-user")
                        }
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(.white)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(Color.blue.opacity(0.3))
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        .buttonStyle(PlainButtonStyle())

                        // Button("Test Notification") {
                        //     vm.showNotification(
                        //         title: "Test Meeting",
                        //         body: "This is a test notification from SwiftUI",
                        //         type: "meeting"
                        //     )
                        // }
                        // .font(.system(size: 12, weight: .medium))
                        // .foregroundColor(.white)
                        // .padding(.horizontal, 16)
                        // .padding(.vertical, 8)
                        // .background(Color.green.opacity(0.3))
                        // .clipShape(RoundedRectangle(cornerRadius: 8))
                        // .buttonStyle(PlainButtonStyle())
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                // Full UI when authenticated
                // Reduce spacing to bring chat input closer to the header
                VStack(spacing: 12.0) {
                    // Top row with start button and icons
                    HStack(spacing: 0.0) {
                        // Start button section
                        HStack(spacing: 8) {
                            if !vm.isRecording && !vm.showVoiceInterface {
                                // Start button (starts transcription/recording) - matches image design
                                Button(action: {
                                    vm.startRecording()
                                }) {
                                    HStack(spacing: 6.0) {
                                        // Custom wave icon (SVG-based)
                                        WaveIcon(color: DynamicIslandTheme.primaryGreen)
                                            .frame(width: 16, height: 16)
                                        Text(vm.isConnecting ? "Connecting..." : "Start")
                                            .font(.system(size: 13, weight: .medium))
                                            .foregroundColor(DynamicIslandTheme.primaryGreen)
                                    }
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 8)
                                    // .background(Color(red: 0.067, green: 0.184, blue: 0.165)) // Dark green background
                                    .overlay(
                                        Capsule()
                                            .stroke(DynamicIslandTheme.primaryGreen, lineWidth: 0.5)
                                    )
                                    .clipShape(Capsule())
                                }
                                .buttonStyle(PlainButtonStyle())
                                .scaleEffect(1.0)
                                .animation(.spring(response: 0.3, dampingFraction: 0.7), value: vm.isRecording)
                                .disabled(vm.isConnecting)
                                .opacity(vm.isConnecting ? 0.8 : 1.0)
                            } else if vm.showVoiceInterface {
                                // Voice mode indicator (when split layout is visible)
                                HStack(spacing: 8) {
                                    WaveIcon(color: DynamicIslandTheme.primaryGreen)
                                        .frame(width: 16, height: 16)
                                    Text("Voice Agent")
                                        .font(.system(size: 12, weight: .medium))
                                        .foregroundColor(DynamicIslandTheme.primaryGreen)
                                }
                                .padding(.horizontal, 12)
                                .padding(.vertical, 4)
                                .background(DynamicIslandTheme.primaryGreen.opacity(0.1))
                                .overlay(
                                    Capsule().stroke(DynamicIslandTheme.primaryGreen.opacity(0.3), lineWidth: 1)
                                )
                                .clipShape(Capsule())
                            } else {
                                // Recording controls
                                HStack(spacing: 4) {
                                    // Pause/Resume button
                                    Button(action: {
                                        if vm.isPaused {
                                            vm.resumeRecording()
                                        } else {
                                            vm.pauseRecording()
                                        }
                                    }) {
                                        Image(systemName: vm.isPaused ? "play.fill" : "pause.fill")
                                            .font(.system(size: 14))
                                            .foregroundColor(.white)
                                            .frame(width: 24, height: 24)
                                            .background(DynamicIslandTheme.cardMaterial)
                                            .clipShape(Circle())
                                    }
                                    .buttonStyle(PlainButtonStyle())
                                    .scaleEffect(1.0)
                                    .animation(.spring(response: 0.3, dampingFraction: 0.7), value: vm.isPaused)
                                    
                                    // Stop button
                                    Button(action: {
                                        vm.stopRecording()
                                    }) {
                                        Image(systemName: "stop.fill")
                                            .font(.system(size: 14))
                                            .foregroundColor(.white)
                                            .frame(width: 24, height: 24)
                                            .background(DynamicIslandTheme.stopRed)
                                            .clipShape(Circle())
                                    }
                                    .buttonStyle(PlainButtonStyle())
                                    .scaleEffect(1.0)
                                    .animation(.spring(response: 0.3, dampingFraction: 0.7), value: vm.isRecording)
                                    
                                    // Meeting mode label (only when controlled by Dynamic Island)
                                    if vm.controlledByDynamicIsland {
                                        HStack(spacing: 8) {
                                            WaveIcon(color: DynamicIslandTheme.primaryGreen)
                                                .frame(width: 14, height: 14)
                                            Text("Meeting mode")
                                                .font(.system(size: 12, weight: .medium))
                                                .foregroundColor(DynamicIslandTheme.primaryGreen)
                                        }
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 4)
                                        .background(DynamicIslandTheme.primaryGreen.opacity(0.1))
                                        .overlay(
                                            Capsule().stroke(DynamicIslandTheme.primaryGreen.opacity(0.3), lineWidth: 1)
                                        )
                                        .clipShape(Capsule())
                                    }
                                }
                            }
                            
                            // Recording status + timer (parity with React)
                            if vm.isRecording {
                                HStack(spacing: 6) {
                                    Circle()
                                        .fill(vm.isPaused ? Color.yellow : DynamicIslandTheme.primaryGreen)
                                        .frame(width: 6, height: 6)
                                    Text(vm.isPaused ? "Paused \(vm.formatTime(vm.timer))" : "Recording \(vm.formatTime(vm.timer))")
                                        .font(.system(size: 11, weight: .semibold))
                                        .foregroundColor(DynamicIslandTheme.textPrimary)
                                }
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(DynamicIslandTheme.cardMaterial)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(DynamicIslandTheme.stroke, lineWidth: 0.5)
                                )
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                            }

                          
                        }
                        
                        Spacer()
                            .contentShape(Rectangle()) // Make spacer area tappable
                            .onTapGesture {
                                // Click on spacer area should unfocus chat input
                                if isChatInputFocused {
                                    print("🎯 Clicked on spacer area - removing focus from chat input")
                                    DispatchQueue.main.async {
                                        isChatInputFocused = false
                                        isTextFieldActive = false
                                        vm.isChatMode = false
                                    }
                                }
                            }

                        // Right side icons and controls with even spacing
                        HStack(spacing: 8) {
                            // Home icon with border styling (first icon)
                            Button(action: {
                                vm.navigateToMainScreen()
                            }) {
                                HomeIcon(color: .white)
                                    .frame(width: 16, height: 16)
                                    .padding(8) // Increased padding for larger clickable area
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 6) // Slightly larger corner radius
                                            .stroke(Color.white.opacity(0.15), lineWidth: 0.5)
                                    )
                            }
                            .buttonStyle(PlainButtonStyle())
                            .help("Home")
                            
                            // Stealth mode toggle icon - second icon
                            Button(action: {
                                print("🎯 Stealth mode icon clicked - current stealth state: \(vm.isStealthModeEnabled)")
                                vm.toggleStealthMode()
                                print("🎯 After toggle - new stealth state: \(vm.isStealthModeEnabled)")
                            }) {
                                Group {
                                    if vm.isStealthModeEnabled {
                                        // Show eye icon when stealth mode is ON (clicked)
                                        EyeIcon(color: .white)
                                    } else {
                                        // Show pirate icon when stealth mode is OFF (default)
                                        PirateIcon(color: .white)
                                    }
                                }
                                .frame(width: 16, height: 16)
                                .padding(8) // Increased padding for larger clickable area
                                .overlay(
                                    RoundedRectangle(cornerRadius: 6) // Slightly larger corner radius
                                        .stroke(Color.white.opacity(0.15), lineWidth: 0.5)
                                )
                            }
                            .buttonStyle(PlainButtonStyle())
                            .help(vm.isStealthModeEnabled ? "Disable Stealth Mode" : "Enable Stealth Mode")
                            
                            // Information icon (third icon) with popup menu
                            InfoIconWithPopup(showInfoPopup: $showInfoPopup, infoPopupPosition: $infoPopupPosition)
                        }
                    }
                    
                    
                    // Main content area - always show chat box with Voice Mode button
                    HStack(alignment: .center, spacing: 16) {
                        if vm.showVoiceInterface {
                            // Voice split layout (left conversation, right controls)
                            VoiceSplitLayout(vm: vm)
                        } else {
                            // Chat input section with arrow icon inside - matches image layout
                            ChatTextAreaView(
                                chatInput: $vm.chatInput,
                                textEditorHeight: $textEditorHeight,
                                isTextFieldActive: $isTextFieldActive,
                                vm: vm
                            )
                            .frame(width: (vm.isChatMode && !vm.isRecording) ? 510 : 400) // Dynamic width: 400px initially, 510px when focused (but 400px in meeting mode)
                            .animation(.easeInOut(duration: 0.3), value: vm.isChatMode)
                            .animation(.easeInOut(duration: 0.3), value: vm.isRecording)
                            
                            // Voice Mode button - only show when NOT recording AND chat not focused
                            if !vm.isRecording && !vm.isChatMode {
                                VoiceModeButton(vm: vm, onFocusChat: {
                                    print("🎯 onFocusChat callback triggered")
                                    // When voice mode button is clicked, focus the chat input
                                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                                        print("🎯 Setting chat input focused: true")
                                        isChatInputFocused = true
                                        isTextFieldActive = true
                                        
                                        // Ensure window is key for cursor to appear
                                        if let window = NSApp.keyWindow {
                                            window.makeKeyAndOrderFront(nil)
                                            DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
                                                window.makeFirstResponder(window.firstResponder)
                                            }
                                        }
                                    }
                                })
                                    .frame(width: 100, height: 100) // Larger voice mode button to match image
                                    .transition(.scale.combined(with: .opacity))
                            }
                            
                            // Webcam button - only show when recording
                            if vm.isRecording {
                                WebcamButton(vm: vm)
                                    .frame(width: 90, height: 90) // Larger webcam button as requested
                            }
                        }
                    }
                    .frame(maxWidth: vm.notchOpenedSize.width - 32) // Constrain main content area
                    .clipped() // Ensure content doesn't overflow
                    .animation(.easeInOut(duration: 0.3), value: vm.isChatMode)
                    .animation(.easeInOut(duration: 0.3), value: vm.isRecording)
                }
            }
        }
        .padding(vm.spacing)
        .frame(width: vm.notchOpenedSize.width, height: vm.notchOpenedSize.height)
        .onAppear {
            // Set up listener for Swift actions to handle received messages
            setupMessageListener()
        }
    }
    
    // MARK: - Message Handling
    private func setupMessageListener() {
        // Listen for Swift actions from the view model
        vm.swiftActionSender
            .sink { action in
                switch action {
                case .receiveMessage(let message):
                    print("📨 Swift UI received message from Electron: \(message)")
                    receivedMessage = message
                default:
                    break
                }
            }
            .store(in: &cancellables)
    }
}

// MARK: - Voice Split Layout (UI parity)
struct VoiceSplitLayout: View {
    @ObservedObject var vm: NotchViewModel

    var body: some View {
        HStack(spacing: 8) {
            // Left: conversation list (real messages from LiveKit)
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 8) {
                        if vm.voiceMessages.isEmpty {
                            // Show connection status when no messages
                            VoiceMessageBubble(
                                sender: "System",
                                text: vm.voiceConnectionStatus == .connected ?
                                    (vm.isMicrophoneMuted ? "Microphone muted - tap to unmute" : "Start speaking - your conversation will appear here") :
                                    (vm.voiceConnectionStatus == .connecting ? "Connecting to voice assistant..." : "Voice assistant disconnected")
                            )
                        } else {
                            // Show actual conversation messages
                            ForEach(vm.voiceMessages) { message in
                                VoiceMessageBubble(
                                    sender: message.sender,
                                    text: message.content,
                                    isFromAgent: message.isFromAgent
                                )
                                .id(message.id)
                            }
                        }
                        
                        // Show current status only when there are no voice messages
                        if vm.voiceConnectionStatus == .connected && vm.voiceMessages.isEmpty {
                            VoiceMessageBubble(
                                sender: "Status",
                                text: vm.isMicrophoneMuted ? "🔇 Muted" : "🎤 Listening...",
                                isStatus: true
                            )
                        }
                    }
                    .padding(.vertical, 4)
                }
                .onChange(of: vm.voiceMessages.count) { _, _ in
                    // Auto-scroll to latest message
                    if let lastMessage = vm.voiceMessages.last {
                        withAnimation(.easeInOut(duration: 0.3)) {
                            proxy.scrollTo(lastMessage.id, anchor: .bottom)
                        }
                    }
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .padding(8)
            .background(Color.clear)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            // .border(DynamicIslandTheme.stroke.opacity(0.3), lineWidth: 0.5)

            // Right: assistant controls circle (restore original functionality)
            VoiceControlsCircle(vm: vm)
        }
        .frame(maxWidth: vm.notchOpenedSize.width - 32) // Constrain to dynamic island width minus padding
    }
}

struct VoiceMessageBubble: View {
    let sender: String
    let text: String
    var isFromAgent: Bool = false
    var isStatus: Bool = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 6) {
                Circle()
                    .fill(isFromAgent ? DynamicIslandTheme.primaryGreen :
                          isStatus ? Color.yellow :
                          Color(red: 0.173, green: 0.176, blue: 0.180))
                    .frame(width: 6, height: 6)
                Text(sender)
                    .font(.system(size: 9, weight: .medium))
                    .foregroundColor(DynamicIslandTheme.textMuted)
                Spacer()
            }
            Text(text)
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(isStatus ? DynamicIslandTheme.textMuted : DynamicIslandTheme.textPrimary)
                .multilineTextAlignment(.leading)
        }
        .padding(8)
        .background(
            isFromAgent ? DynamicIslandTheme.primaryGreen.opacity(0.1) :
            isStatus ? Color.clear :
            Color.clear
        )
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(
                    isFromAgent ? DynamicIslandTheme.primaryGreen.opacity(0.3) :
                    isStatus ? Color.clear :
                    DynamicIslandTheme.stroke.opacity(0.3),
                    lineWidth: 0.5
                )
        )
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}

struct VoiceControlsCircle: View {
    @ObservedObject var vm: NotchViewModel
    @State private var rotate = false
    var body: some View {
        ZStack {
            // Rotating border when connected (listening)
            Circle()
                .strokeBorder(style: StrokeStyle(lineWidth: 2))
                .foregroundStyle(
                    AngularGradient(
                        gradient: Gradient(colors: [
                            Color(red: 0.271, green: 0.525, blue: 0.447),
                            DynamicIslandTheme.primaryGreen,
                            Color(red: 0.271, green: 0.525, blue: 0.447)
                        ]),
                        center: .center
                    )
                )
                .opacity(vm.voiceConnectionStatus == .connected ? 1 : 0.2)
                .rotationEffect(.degrees(rotate && vm.voiceConnectionStatus == .connected ? 360 : 0))
                .animation(
                    vm.voiceConnectionStatus == .connected
                    ? .linear(duration: 3).repeatForever(autoreverses: false)
                    : .default,
                    value: rotate && vm.voiceConnectionStatus == .connected
                )

            // Inner card
            Circle()
                .shadow(color: DynamicIslandTheme.primaryGreen.opacity(0.5), radius: 15)

            VStack(spacing: 10) {
                // Visualizer / spinner by state with real audio level
                if vm.voiceConnectionStatus == .connecting {
                    ProgressView().controlSize(.small)
                } else if vm.voiceConnectionStatus == .connected {
                    // Real-time audio visualizer using actual audio levels
                    HStack(spacing: 2) {
                        ForEach(0..<5, id: \.self) { i in
                            RoundedRectangle(cornerRadius: 2)
                                .fill(vm.isMicrophoneMuted ? Color.gray : DynamicIslandTheme.primaryGreen)
                                .frame(width: 3, height: 12)
                                .scaleEffect(y: vm.isMicrophoneMuted ? 0.3 : (0.3 + CGFloat(vm.audioLevel) * 0.7 + CGFloat(i % 3) * 0.2), anchor: .bottom)
                                .animation(.easeInOut(duration: 0.1), value: vm.audioLevel)
                        }
                    }
                } else if vm.voiceConnectionStatus == .error {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundColor(.red)
                } else {
                    Image(systemName: "mic.fill")
                        .foregroundColor(DynamicIslandTheme.primaryGreen)
                }

                // Status text with connection state
                Text(getStatusText())
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundColor(vm.voiceConnectionStatus == .error ? .red : DynamicIslandTheme.textPrimary)

                // Action buttons
                HStack(spacing: 12) {
                    // Disconnect button
                    Button(action: { vm.disconnectVoiceAssistant() }) {
                        Image(systemName: "xmark")
                            .foregroundColor(DynamicIslandTheme.textPrimary)
                            .frame(width: 16, height: 16)
                    }.buttonStyle(PlainButtonStyle())

                    // Microphone mute/unmute button (restored for voice chat)
                    if vm.voiceConnectionStatus == .connected {
                        Button(action: { vm.toggleVoiceMute() }) {
                            Image(systemName: vm.isMicrophoneMuted ? "mic.slash.fill" : "mic.fill")
                                .foregroundColor(vm.isMicrophoneMuted ? Color.red : DynamicIslandTheme.primaryGreen)
                                .frame(width: 16, height: 16)
                        }.buttonStyle(PlainButtonStyle())
                    }
                }
            }
            .padding(12)
        }
        .frame(width: 100, height: 100)
        .onAppear { rotate = true }
    }
    
    private func getStatusText() -> String {
        switch vm.voiceConnectionStatus {
        case .connected:
            return vm.isMicrophoneMuted ? "Muted" : "Voice Active"
        case .connecting:
            return "Connecting..."
        case .error:
            return "Error"
        case .disconnected:
            return "Voice"
        }
    }
}

// MARK: - Chat TextArea Component
struct ChatTextAreaView: View {
    @Binding var chatInput: String
    @FocusState var isChatInputFocused: Bool
    @Binding var textEditorHeight: CGFloat
    @Binding var isTextFieldActive: Bool
    @ObservedObject var vm: NotchViewModel
    @State private var textEditorWidth: CGFloat = 0 // Will be calculated based on available space
    
    var body: some View {
        ZStack(alignment: .topLeading) {
            // Background for the textarea with active effect
            RoundedRectangle(cornerRadius: 8)
                .fill(isChatInputFocused ? Color.white.opacity(0.05) : Color.clear) // Subtle background when active
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(
                            isChatInputFocused ? 
                            DynamicIslandTheme.primaryGreen.opacity(0.8) : // Green border when active
                            DynamicIslandTheme.white.opacity(0.7), 
                            lineWidth: isChatInputFocused ? 1.5 : 1 // Thicker border when active
                        )
                )
                .frame(width: .infinity, height: textEditorHeight)
                .shadow(
                    color: isChatInputFocused ? DynamicIslandTheme.primaryGreen.opacity(0.3) : Color.clear,
                    radius: isChatInputFocused ? 4 : 0,
                    x: 0,
                    y: 0
                )
                .animation(DynamicIslandTheme.expansionAnimation, value: textEditorWidth)
                .animation(.easeInOut(duration: 0.25), value: textEditorHeight)
                .animation(.easeInOut(duration: 0.2), value: isChatInputFocused) // Smooth transition for active state
            
            // Placeholder text when empty - matches image
            if chatInput.isEmpty {
                Text("Ask about screen")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(DynamicIslandTheme.textMuted)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 10)
                    .allowsHitTesting(false) // Allow taps to pass through to TextEditor
            }
            
            // TextEditor (multi-line text input)
            TextEditor(text: $chatInput)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(DynamicIslandTheme.white)
                .accentColor(DynamicIslandTheme.white) // Ensure cursor and selection are white
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .padding(.trailing, 40) // Add space for arrow icon
                .background(Color.clear)
                .focused($isChatInputFocused)
                .frame(width: textEditorWidth, height: textEditorHeight)
                .clipShape(RoundedRectangle(cornerRadius: 16))
                .scrollContentBackground(.hidden) // Hide default TextEditor background
                .allowsHitTesting(true) // Ensure TextEditor can receive mouse events
                .onTapGesture {
                    // Direct tap on TextEditor to ensure focus and cursor
                    print("🎯 TextEditor directly tapped")
                    DispatchQueue.main.async {
                        isChatInputFocused = true
                        isTextFieldActive = true
                        // Only enable chat mode if NOT in meeting mode (recording)
                        if !vm.isRecording {
                            vm.isChatMode = true
                        }
                    }
                }
            
            // Arrow icon inside the input box (bottom-right)
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    Button(action: {
                        print("🎯 Arrow button clicked - submitting chat")
                        if !vm.isSendingMessage && !chatInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                            vm.submitChat()
                        }
                    }) {
                        Image(systemName: "arrow.right")
                            .font(.system(size: 14))
                            .foregroundColor(.white)
                            .frame(width: 24, height: 24)
                            // .background(Color(red: 0.067, green: 0.184, blue: 0.165)) // Dark green background
                            .clipShape(RoundedRectangle(cornerRadius: 4))
                    }
                    .buttonStyle(PlainButtonStyle())
                    .padding(.trailing, 8)
                    .padding(.bottom, 8)
                }
            }
                .onKeyPress(keys: [.return]) { event in
                    print("🎯 Return key pressed - modifiers: \(event.modifiers)")
                    if event.modifiers == .shift {
                        // Shift+Enter: Insert new line manually
                        print("🎯 Shift+Enter detected - inserting new line")
                        chatInput.append("\n")
                        return .handled
                    } else {
                        // Enter alone: Submit chat
                        print("🎯 Enter alone detected - submitting chat")
                        if !vm.isSendingMessage && !chatInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                            vm.submitChat()
                            return .handled
                        }
                        return .handled // Still consume the event even if not submitting
                    }
                }
                .onChange(of: chatInput) { oldValue, newValue in
                    handleTextChange(newValue)
                }
                .onChange(of: isChatInputFocused) { oldValue, newValue in
                    handleFocusChange(newValue)
                    // Sync focus state with view model
                    vm.isChatInputFocused = newValue
                }
                .onChange(of: vm.isChatMode) { oldValue, newValue in
                    // When chat mode is turned off (back button pressed), remove focus
                    if !newValue && isChatInputFocused {
                        isChatInputFocused = false
                    }
                    // When chat mode is turned ON, focus the text input
                    else if newValue && !oldValue {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                            isChatInputFocused = true
                            vm.isChatInputFocused = true
                            print("🎯 Auto-focusing TextEditor when chat mode activated")
                        }
                    }
                }
                .onAppear {
                    // Calculate width based on available space in the dynamic island
                    calculateTextEditorWidth()
                    
                    // Auto-focus when TextEditor appears
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                        if vm.isChatMode {
                            isChatInputFocused = true
                            vm.isChatInputFocused = true
                            print("🎯 Auto-focusing TextEditor on appear")
                        }
                    }
                }
                .onChange(of: vm.isRecording) { oldValue, newValue in
                    // When recording starts, disable chat mode to keep width at 400px
                    if newValue && vm.isChatMode {
                        vm.isChatMode = false
                    }
                    
                    // Adjust width when recording state changes
                    withAnimation(DynamicIslandTheme.expansionAnimation) {
                        calculateTextEditorWidth()
                    }
                }
        }
        .contentShape(Rectangle()) // Ensure entire area is tappable
        .allowsHitTesting(true) // Explicitly allow hit testing
        .onTapGesture {
            print("🎯 Chat area tapped - attempting to focus text input")
            
            // Find the NotchDrop window specifically
            var notchWindow: NSWindow?
            for window in NSApp.windows {
                if window.isVisible && window.className.contains("NotchDropPanel") {
                    notchWindow = window
                    break
                }
            }
            
            // Ensure window is key first
            if let window = notchWindow ?? NSApp.keyWindow ?? NSApp.windows.first(where: { $0.isVisible }) {
                print("🎯 Making window key: \(window.className)")
                window.makeKeyAndOrderFront(nil)
                
                // Set focus with proper timing to ensure cursor appears
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                    isChatInputFocused = true
                    isTextFieldActive = true
                    // Only enable chat mode if NOT in meeting mode (recording)
                    if !vm.isRecording {
                        vm.isChatMode = true
                        vm.isChatInputFocused = true
                    }
                    
                    // Force the window to become first responder after a short delay
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
                        if let window = NSApp.keyWindow {
                            window.makeFirstResponder(window.firstResponder)
                        }
                    }
                }
            } else {
                print("🎯 No suitable window found for focus")
            }
        }
        .zIndex(2) // Ensure chat input is above the background overlay
    }
    

    
    private func handleTextChange(_ newValue: String) {
        
        // Only resize based on actual content, not placeholder
        if !newValue.isEmpty {

            // Auto-resize functionality - use correct font size (13, same as TextEditor)
            let font = NSFont.systemFont(ofSize: 13, weight: .medium)
            let textAttributes: [NSAttributedString.Key: Any] = [
                .font: font
            ]
            
            let attributedString = NSAttributedString(string: newValue, attributes: textAttributes)
            
            // Calculate text size with padding constraints - match TextEditor's actual available width
            let textWidth: CGFloat = textEditorWidth - 36 // TextEditor horizontal padding (16px each side) + small buffer for text rendering
            print("🎯 Available text width: \(textWidth)px")
            let boundingRect = attributedString.boundingRect(
                with: CGSize(width: textWidth, height: .greatestFiniteMagnitude),
                options: [.usesLineFragmentOrigin, .usesFontLeading, .usesDeviceMetrics],
                context: nil
            )
            print("🎯 Calculated text height: \(boundingRect.height)px")
            
            // Calculate new height with min/max constraints
            let minHeight: CGFloat = 100 // Minimum height
            let maxHeight: CGFloat = 200 // Maximum height
            let contentHeight = boundingRect.height + 30 // Add vertical padding for TextEditor
            
            let newHeight = max(minHeight, min(maxHeight, contentHeight))
            
            // Update height with animation if it changed significantly
            if abs(textEditorHeight - newHeight) > 5 {
                withAnimation(.easeInOut(duration: 0.25)) {
                    textEditorHeight = newHeight
                }
            }
        } else {
            // Reset to minimum height when empty
            let minHeight: CGFloat = 100
            if abs(textEditorHeight - minHeight) > 5 {
                withAnimation(.easeInOut(duration: 0.25)) {
                    textEditorHeight = minHeight
                }
            }
        }
    }
    
    private func handleFocusChange(_ newValue: Bool) {
        print("🎯 TextEditor focus changed: \(newValue)")
        isTextFieldActive = newValue
        
        // Enable chat mode to hide Voice Mode button and expand chat (but not in meeting mode)
        if !vm.isRecording {
            vm.isChatMode = newValue
        }
        
        // Chat expansion disabled - keep fixed width
        
        // Animate width change based on focus state - synchronized with Dynamic Island timing
        withAnimation(DynamicIslandTheme.expansionAnimation) {
            calculateTextEditorWidth()
        }
        
        // When unfocused and no text, clear chat input and reset height
        if !newValue && chatInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            withAnimation(.easeInOut(duration: 0.25)) {
                textEditorHeight = 100 // Reset to minimum height
            }
        }
        
        // When focused, ensure window is key and cursor appears
        if newValue {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                if let window = NSApp.keyWindow ?? NSApp.windows.first(where: { $0.isVisible }) {
                    if !window.isKeyWindow {
                        window.makeKey()
                    }
                    // Force window to become key and order front to ensure cursor appears
                    window.makeKeyAndOrderFront(nil)
                    
                    // Additional delay to ensure TextEditor gets proper focus
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
                        // Force the window to become first responder to show cursor
                        window.makeFirstResponder(window.firstResponder)
                    }
                }
            }
        }
    }
    
    // MARK: - Width Calculation Helper
    private func calculateTextEditorWidth() {
        // Dynamic width based on chat mode: 400px initially, 510px when focused (but 400px in meeting mode)
        let calculatedWidth: CGFloat = (vm.isChatMode && !vm.isRecording) ? 510 : 400
        
        textEditorWidth = calculatedWidth
    }
}



// MARK: - HomeIcon (SVG path rendered in SwiftUI - matches JavaScript HomeIcon)
struct HomeIcon: View {
    var color: Color = .white
    var body: some View {
        Image(systemName: "house.fill")
            .font(.system(size: 14))
            .foregroundColor(color)
    }
}

// MARK: - WaveIcon (SVG path rendered in SwiftUI)
struct WaveIcon: View {
    var color: Color = Color(red: 0.071, green: 0.071, blue: 0.071) // #121212
    var body: some View {
        GeometryReader { geo in
            let w: CGFloat = 11.0
            let h: CGFloat = 12.0
            let sx = geo.size.width / w
            let sy = geo.size.height / h
            let s = min(sx, sy)
            Path { p in
                func pt(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: x * sx, y: y * sy) }
                // M5.49967 11.1048 V0.896484
                p.move(to: pt(5.49967, 11.1048))
                p.addLine(to: pt(5.49967, 0.896484))
                // M10.1663 7.72732 V4.27398
                p.move(to: pt(10.1663, 7.72732))
                p.addLine(to: pt(10.1663, 4.27398))
                // M0.833008 7.72732 V4.27398
                p.move(to: pt(0.833008, 7.72732))
                p.addLine(to: pt(0.833008, 4.27398))
                // M7.83301 9.44932 V2.55198
                p.move(to: pt(7.83301, 9.44932))
                p.addLine(to: pt(7.83301, 2.55198))
                // M3.16634 9.44932 V2.55198
                p.move(to: pt(3.16634, 9.44932))
                p.addLine(to: pt(3.16634, 2.55198))
            }
            .stroke(color, style: StrokeStyle(lineWidth: 0.875 * s, lineCap: .round, lineJoin: .round))
        }
        .aspectRatio(11.0/12.0, contentMode: .fit)
    }
}

// MARK: - WebcamIcon (SVG path rendered in SwiftUI)
struct WebcamIcon: View {
    var color: Color = Color(red: 0.580, green: 0.596, blue: 0.620) // #94989e
    var body: some View {
        GeometryReader { geo in
            let w: CGFloat = 24.0
            let h: CGFloat = 24.0
            let sx = geo.size.width / w
            let sy = geo.size.height / h
            let s = min(sx, sy)
            Path { p in
                func pt(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: x * sx, y: y * sy) }
                // Camera icon path
                // M12 15.5A3.5 3.5 0 1 0 12 8.5A3.5 3.5 0 0 0 12 15.5Z
                p.addEllipse(in: CGRect(x: 8.5 * sx, y: 8.5 * sy, width: 7 * sx, height: 7 * sy))
                // M20.84 4.61A5.5 5.5 0 0 0 19.5 4H4.5A5.5 5.5 0 0 0 3.16 4.61A2 2 0 0 0 2 6.5V17A2 2 0 0 0 3.16 19.39A5.5 5.5 0 0 0 4.5 20H19.5A5.5 5.5 0 0 0 20.84 19.39A2 2 0 0 0 22 17V6.5A2 2 0 0 0 20.84 4.61ZM12 17A5 5 0 1 1 12 7A5 5 0 0 1 12 17Z
                p.addRoundedRect(in: CGRect(x: 2 * sx, y: 4 * sy, width: 20 * sx, height: 16 * sy), cornerSize: CGSize(width: 2 * sx, height: 2 * sy))
            }
            .stroke(color, style: StrokeStyle(lineWidth: 1.5 * s, lineCap: .round, lineJoin: .round))
        }
        .aspectRatio(1.0, contentMode: .fit)
    }
}

// MARK: - Camera Preview View
struct CameraPreviewView: NSViewRepresentable {
    func makeNSView(context: Context) -> NSView {
        let view = CameraPreviewNSView()
        return view
    }
    
    func updateNSView(_ nsView: NSView, context: Context) {
        // Update if needed
    }
}

class CameraPreviewNSView: NSView {
    private var captureSession: AVCaptureSession?
    private var previewLayer: AVCaptureVideoPreviewLayer?
    
    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        setupCamera()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupCamera()
    }
    
    private func setupCamera() {
        // Create capture session
        let session = AVCaptureSession()
        session.sessionPreset = .medium
        
        // Get default camera
        guard let camera = AVCaptureDevice.default(for: .video) else {
            print("📹 No camera available")
            return
        }
        
        do {
            // Create input
            let input = try AVCaptureDeviceInput(device: camera)
            if session.canAddInput(input) {
                session.addInput(input)
            }
            
            // Create preview layer
            let previewLayer = AVCaptureVideoPreviewLayer(session: session)
            previewLayer.videoGravity = .resizeAspectFill
            previewLayer.frame = bounds
            layer = previewLayer
            wantsLayer = true
            
            self.captureSession = session
            self.previewLayer = previewLayer
            
            // Start session
            DispatchQueue.global(qos: .userInitiated).async {
                session.startRunning()
            }
            
        } catch {
            print("📹 Error setting up camera: \(error)")
        }
    }
    
    override func layout() {
        super.layout()
        previewLayer?.frame = bounds
    }
    
    deinit {
        captureSession?.stopRunning()
    }
}

// MARK: - WebcamButton (Circular webcam button matching Dynamic Island design)
struct WebcamButton: View {
    @ObservedObject var vm: NotchViewModel
    @State private var isHovered: Bool = false
    
    var body: some View {
        Button(action: {
            vm.toggleWebcam()
        }) {
            ZStack {
                // Background circle - only show when camera preview is not active
                if !vm.showCameraPreview {
                    Circle()
                        .fill(DynamicIslandTheme.cardMaterial)
                        .frame(width: 90, height: 90)
                        .scaleEffect(isHovered ? 1.05 : 1.0)
                        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isHovered)
                }
                
                // Content based on camera state
                if vm.isCameraStarting {
                    // Loading state
                    VStack(spacing: 8) {
                        ProgressView()
                            .controlSize(.small)
                            .progressViewStyle(CircularProgressViewStyle(tint: DynamicIslandTheme.primaryGreen))
                        Text("Starting...")
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(DynamicIslandTheme.textMuted)
                    }
                } else if vm.showCameraPreview && vm.isCameraActive {
                    // Active camera state - show real camera preview filling the entire circle
                    ZStack {
                        // Background circle for camera preview
                        Circle()
                            .fill(DynamicIslandTheme.cardMaterial)
                            .frame(width: 90, height: 90)
                        
                        // Camera preview
                        CameraPreviewView()
                            .frame(width: 90, height: 90)
                            .clipShape(Circle())
                    }
                    .scaleEffect(isHovered ? 1.05 : 1.0)
                    .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isHovered)
                } else if vm.cameraPermission == "denied" || vm.cameraPermission == "restricted" {
                    // Permission denied state
                    VStack(spacing: 4) {
                        Image(systemName: "camera.fill")
                            .font(.system(size: 24))
                            .foregroundColor(.red)
                        Text("Permission Required")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.red)
                            .multilineTextAlignment(.center)
                    }
                } else {
                    // Default state - webcam icon (always show unless camera preview is active)
                    VStack(spacing: 4) {
                        WebcamIcon(color: DynamicIslandTheme.textMuted)
                            .frame(width: 24, height: 24)
                        Text("Webcam")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(DynamicIslandTheme.textMuted)
                    }
                }
                
                // Error overlay
                if let error = vm.cameraError {
                    VStack {
                        Spacer()
                        Text(error)
                            .font(.system(size: 9, weight: .medium))
                            .foregroundColor(.red)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 8)
                            .padding(.bottom, 4)
                    }
                }
            }
        }
        .buttonStyle(PlainButtonStyle())
        .onHover { hovering in
            isHovered = hovering
        }
        .disabled(vm.isCameraStarting)
    }
}

// MARK: - EyeIcon
struct EyeIcon: View {
    var color: Color = .white

    var body: some View {
        GeometryReader { geo in
            let scale = min(geo.size.width, geo.size.height) / 24.0
            let offsetX = (geo.size.width - 24.0 * scale) / 2.0
            let offsetY = (geo.size.height - 24.0 * scale) / 2.0
            let strokeStyle = StrokeStyle(lineWidth: 2.0 * scale, lineCap: .round, lineJoin: .round)
            let point: (CGFloat, CGFloat) -> CGPoint = { x, y in
                CGPoint(x: offsetX + x * scale, y: offsetY + y * scale)
            }

            ZStack {
                Path { path in
                    path.move(to: point(2.0, 12.0))
                    path.addQuadCurve(to: point(12.0, 5.0), control: point(5.0, 6.0))
                    path.addQuadCurve(to: point(22.0, 12.0), control: point(19.0, 6.0))
                    path.addQuadCurve(to: point(12.0, 19.0), control: point(19.0, 18.0))
                    path.addQuadCurve(to: point(2.0, 12.0), control: point(5.0, 18.0))
                }
                .stroke(color, style: strokeStyle)

                Path { path in
                    let radius: CGFloat = 3.0
                    let rect = CGRect(
                        x: offsetX + (12.0 - radius) * scale,
                        y: offsetY + (12.0 - radius) * scale,
                        width: radius * 2.0 * scale,
                        height: radius * 2.0 * scale
                    )
                    path.addEllipse(in: rect)
                }
                .stroke(color, style: strokeStyle)
            }
        }
        .aspectRatio(1.0, contentMode: .fit)
    }
}

// MARK: - PirateIcon
struct PirateIcon: View {
    var color: Color = .white

    var body: some View {
        GeometryReader { geo in
            let scale = min(geo.size.width, geo.size.height) / 24.0
            let offsetX = (geo.size.width - 24.0 * scale) / 2.0
            let offsetY = (geo.size.height - 24.0 * scale) / 2.0
            let strokeStyle = StrokeStyle(lineWidth: 2.0 * scale, lineCap: .round, lineJoin: .round)
            let point: (CGFloat, CGFloat) -> CGPoint = { x, y in
                CGPoint(x: offsetX + x * scale, y: offsetY + y * scale)
            }
            let circleRect: (CGFloat, CGFloat, CGFloat) -> CGRect = { centerX, centerY, radius in
                CGRect(
                    x: offsetX + (centerX - radius) * scale,
                    y: offsetY + (centerY - radius) * scale,
                    width: radius * 2.0 * scale,
                    height: radius * 2.0 * scale
                )
            }

            ZStack {
                // Hat brim
                Path { path in
                    path.move(to: point(2.0, 11.0))
                    path.addLine(to: point(22.0, 11.0))
                }
                .stroke(color, style: strokeStyle)

                // Hat crown (approximation of lucide hat)
                Path { path in
                    path.move(to: point(19.0, 11.0))
                    path.addLine(to: point(16.9, 4.3))
                    path.addLine(to: point(14.4, 3.2))
                    path.addLine(to: point(12.0, 4.0))
                    path.addLine(to: point(8.5, 4.0))
                    path.addLine(to: point(6.6, 5.9))
                    path.addLine(to: point(5.0, 11.0))
                }
                .stroke(color, style: strokeStyle)

                // Glasses bridge
                Path { path in
                    path.move(to: point(10.0, 18.0))
                    path.addLine(to: point(14.0, 18.0))
                }
                .stroke(color, style: strokeStyle)

                // Left lens
                Path { path in
                    path.addEllipse(in: circleRect(7.0, 18.0, 3.0))
                }
                .stroke(color, style: strokeStyle)

                // Right lens
                Path { path in
                    path.addEllipse(in: circleRect(17.0, 18.0, 3.0))
                }
                .stroke(color, style: strokeStyle)

                // Moustache arc
                Path { path in
                    path.addArc(
                        center: point(12.0, 18.0),
                        radius: 2.0 * scale,
                        startAngle: .degrees(0),
                        endAngle: .degrees(180),
                        clockwise: true
                    )
                }
                .stroke(color, style: strokeStyle)
            }
        }
        .aspectRatio(1.0, contentMode: .fit)
    }
}

// MARK: - InfoIcon
struct InfoIcon: View {
    var color: Color = .white

    var body: some View {
        GeometryReader { geo in
            let scale = min(geo.size.width, geo.size.height) / 24.0
            let offsetX = (geo.size.width - 24.0 * scale) / 2.0
            let offsetY = (geo.size.height - 24.0 * scale) / 2.0
            let strokeStyle = StrokeStyle(lineWidth: 2.0 * scale, lineCap: .round, lineJoin: .round)
            let point: (CGFloat, CGFloat) -> CGPoint = { x, y in
                CGPoint(x: offsetX + x * scale, y: offsetY + y * scale)
            }
            let circleRect: (CGFloat, CGFloat, CGFloat) -> CGRect = { centerX, centerY, radius in
                CGRect(
                    x: offsetX + (centerX - radius) * scale,
                    y: offsetY + (centerY - radius) * scale,
                    width: radius * 2.0 * scale,
                    height: radius * 2.0 * scale
                )
            }

            ZStack {
                // Outer circle
                Path { path in
                    path.addEllipse(in: circleRect(12.0, 12.0, 10.0))
                }
                .stroke(color, style: strokeStyle)

                // Inner dot (i dot)
                Path { path in
                    path.addEllipse(in: circleRect(12.0, 8.0, 1.5))
                }
                .fill(color)

                // Vertical line (i stem)
                Path { path in
                    path.move(to: point(12.0, 10.0))
                    path.addLine(to: point(12.0, 16.0))
                }
                .stroke(color, style: strokeStyle)
            }
        }
        .aspectRatio(1.0, contentMode: .fit)
    }
}

// MARK: - Notification Overlay View
struct NotificationOverlayView: View {
    @ObservedObject var vm: NotchViewModel
    @State private var progressValue: Double = 0.0
    @State private var progressTimer: Timer?

    var body: some View {
        Group {
            if vm.showNotificationOverlay {
                let _ = print("🔔 Notification overlay rendering - title: '\(vm.notificationTitle)', body: '\(vm.notificationBody)'")
                
                // Center the notification content in the available space
                VStack {
                    Spacer()
                    
                    // Notification content matching the Figma design exactly
                    VStack(spacing: 0) {
                    // Main content area
                    HStack(spacing: 16) {
                        // Left content
                        VStack(alignment: .leading, spacing: 4) {
                            // Main title - "Meeting detected"
                            Text("Meeting detected")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.white)
                                .lineLimit(1)
                            
                            // Subtitle - "Google meet • Starting in 2 min"
                            Text("Google meet • Starting in 2 min")
                                .font(.system(size: 13))
                                .foregroundColor(.white.opacity(0.7))
                                .lineLimit(1)
                        }
                        
                        Spacer()
                        
                        // Join button on the right
                        Button(action: {
                            print("🎯 Join button tapped")
                            vm.hideNotification()
                        }) {
                            HStack(spacing: 8) {
                                Image(systemName: "waveform.path")
                                    .font(.system(size: 14))
                                    .foregroundColor(.white)
                                
                                Text("Join")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.white)
                            }
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(
                                RoundedRectangle(cornerRadius: 20)
                                    .stroke(.white.opacity(0.3), lineWidth: 1)
                                    .background(
                                        RoundedRectangle(cornerRadius: 20)
                                            .fill(.white.opacity(0.1))
                                    )
                            )
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 16)
                    .padding(.bottom, 12)
                    
                    // Green progress bar at the bottom
                    VStack(spacing: 0) {
                        Spacer()
                        
                        // Progress bar
                        GeometryReader { geometry in
                            ZStack(alignment: .leading) {
                                // Background
                                Rectangle()
                                    .fill(Color.white.opacity(0.1))
                                    .frame(height: 3)
                                
                                // Progress fill
                                Rectangle()
                                    .fill(Color.green)
                                    .frame(width: geometry.size.width * progressValue, height: 3)
                            }
                        }
                        .frame(height: 3)
                    }
                    }
                    .background(.ultraThinMaterial)
                    .clipShape(RoundedRectangle(cornerRadius: vm.cornerRadius))
                    .frame(width: 370, height: 74) // Matching the Figma dimensions
                    .onHover { isHovering in
                        if isHovering {
                            vm.pauseNotificationTimer()
                        } else {
                            vm.resumeNotificationTimer()
                        }
                    }
                    
                    Spacer()
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .transition(.scale(scale: 1.0).combined(with: .opacity)) // Remove scaling to prevent shadow artifacts
                .onAppear {
                    // Start progress bar animation that syncs with notification timer
                    startProgressAnimation()
                }
                .onDisappear {
                    // Clean up progress animation
                    stopProgressAnimation()
                }
            }
        }
        .animation(.spring(response: 0.3, dampingFraction: 0.8), value: vm.showNotificationOverlay)
    }
    
    // Progress animation methods
    private func startProgressAnimation() {
        progressValue = 0.0
        progressTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { _ in
            if !vm.isNotificationHovered {
                // Only advance progress when not hovering
                let increment = 0.1 / 10.0 // 10 seconds total
                progressValue = min(1.0, progressValue + increment)
            }
        }
    }
    
    private func stopProgressAnimation() {
        progressTimer?.invalidate()
        progressTimer = nil
        progressValue = 0.0
    }
}

// MARK: - Voice Mode Button (Large circular button as shown in image)
struct VoiceModeButton: View {
    @ObservedObject var vm: NotchViewModel
    @State private var isHovered: Bool = false
    let onFocusChat: () -> Void
    
    var body: some View {
        Button(action: {
            print("🎤 Voice Mode button clicked - connecting to voice assistant")
            // Connect to voice assistant instead of just enabling chat mode
            vm.connectVoiceAssistant()
        }) {
            ZStack {
                // Main circle with CSS properties
                ZStack {
                    // Background circle - border-radius: 100px; background: rgba(255, 255, 255, 0.01);
                    Circle()
                        .fill(Color.white.opacity(0.01))
                        .frame(width: 90, height: 90)
                    
                  
                    
                    // Border - border: 1px solid #79ECC9;
                     Circle()
                         .stroke(Color(red: 0.475, green: 0.925, blue: 0.788), lineWidth: 1)
                         .frame(width: 90, height: 90)
                }
                .scaleEffect(isHovered ? 1.05 : 1.0)
                .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isHovered)
                
                // Content with inline text
                HStack(spacing: 2) {
                    // "VOICE" text - bold
                    Text("VOICE")
                        .font(.custom("SF Pro Text", size: 10))
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .tracking(1)
                    
                    // "MODE" text - semibold
                    Text("MODE")
                        .font(.custom("SF Pro Text", size: 10))
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                        .tracking(1)
                }
                .frame(width: 90, height: 90) // width: 90px; height: 90px;
                .padding(.horizontal, 24) // padding: 6px 24px; (horizontal)
                .padding(.vertical, 6)    // padding: 6px 24px; (vertical)
            }
        }
        .buttonStyle(PlainButtonStyle())
        .onHover { hovering in
            isHovered = hovering
        }
    }
}

// MARK: - Info Icon with Popup Menu
struct InfoIconWithPopup: View {
    @Binding var showInfoPopup: Bool
    @Binding var infoPopupPosition: CGPoint
    @State private var isHovered: Bool = false
    
    var body: some View {
        // Info icon button
        Button(action: {
            print("🎯 Information icon clicked")
            // Toggle popup on click as well
            withAnimation(.easeInOut(duration: 0.2)) {
                showInfoPopup.toggle()
            }
        }) {
            InfoIcon(color: .white)
                .frame(width: 16, height: 16)
                .padding(8) // Increased padding for larger clickable area
                .overlay(
                    RoundedRectangle(cornerRadius: 6) // Slightly larger corner radius
                        .stroke(Color.white.opacity(0.15), lineWidth: 0.5)
                )
        }
        .buttonStyle(PlainButtonStyle())
        .help("Information")
        .onHover { hovering in
            isHovered = hovering
            withAnimation(.easeInOut(duration: 0.2)) {
                showInfoPopup = hovering
            }
        }
    }
}

// MARK: - Info Popup Menu Component
struct InfoPopupMenu: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Live Intelligence
            InfoMenuItem(
                title: "Live Intelligence",
                shortcutKeys: ["⌘", "\\"]
            )
            
            // Notch
            InfoMenuItem(
                title: "Notch",
                shortcutKeys: ["⌘", "N"]
            )
            
            // Ask Ve
            InfoMenuItem(
                title: "Ask Ve",
                shortcutKeys: ["⌘", "⏎"]
            )
            
            // Ve App
            InfoMenuItem(
                title: "Ve App",
                shortcutKeys: ["⌘", "."]
            )
        }
        .padding(.vertical, 8)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(Color(red: 0.15, green: 0.15, blue: 0.15)) // Dark grey background
                .shadow(color: .black.opacity(0.3), radius: 8, x: 0, y: 4)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(Color.white.opacity(0.1), lineWidth: 0.5)
        )
        .frame(width: 200) // Fixed width to match design
    }
}

// MARK: - Info Menu Item Component
struct InfoMenuItem: View {
    let title: String
    let shortcutKeys: [String]
    
    var body: some View {
        HStack {
            // Menu item title
            Text(title)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(.white)
            
            Spacer()
            
            // Keyboard shortcut
            HStack(spacing: 4) {
                ForEach(shortcutKeys, id: \.self) { key in
                    ShortcutKeyView(keyText: key)
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .contentShape(Rectangle())
        .onTapGesture {
            print("🎯 Menu item tapped: \(title)")
            // Handle menu item actions here
        }
    }
}

// MARK: - Shortcut Key View Component
struct ShortcutKeyView: View {
    let keyText: String
    
    var body: some View {
        Text(keyText)
            .font(.system(size: 11, weight: .medium))
            .foregroundColor(.white)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(
                RoundedRectangle(cornerRadius: 4)
                    .fill(Color.white.opacity(0.15))
            )
    }
}

#Preview {
    NotchContentView(vm: .init())
        .frame(width: 850, height: 150, alignment: .center)
        .background(.black)
        .preferredColorScheme(.dark)
}
