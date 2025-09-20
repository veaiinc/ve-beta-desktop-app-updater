
import SwiftUI
import UniformTypeIdentifiers
import AppKit
import Combine
import AVFoundation

struct NotchContentView: View {
    @StateObject var vm: NotchViewModel
    
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
                    DynamicIslandContentView(vm: vm)
                        .transition(.scale(scale: 0.8).combined(with: .opacity))
                }
            }
        }
        .animation(vm.animation, value: vm.contentType)
        .animation(vm.animation, value: vm.showNotificationOverlay)
    }
}

// New Dynamic Island Content View matching JavaScript structure
struct DynamicIslandContentView: View {
    @StateObject var vm: NotchViewModel
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
                VStack(spacing: 8.0) {
                    // Top row with start button and icons
                    HStack(spacing: 0.0) {
                        // Start button section
                        HStack(spacing: 8) {
                            if !vm.isRecording && !vm.showVoiceInterface {
                                // Listen button (existing functionality)
                                Button(action: {
                                    vm.startRecording()
                                }) {
                                    HStack(spacing: 5.0) {
                                        // Custom wave icon (SVG-based)
                                        WaveIcon(color: DynamicIslandTheme.black)
                                            .frame(width: 15, height: 15)
                                        Text(vm.isConnecting ? "Connecting..." : "Listen")
                                            .font(.system(size: 12, weight: .medium))
                                            .foregroundColor(Color(red: 0.055, green: 0.184, blue: 0.165)) // #0E2F2A
                                    }
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 2)
                                    .background(DynamicIslandTheme.textPrimary)
                                    .clipShape(Capsule())
                                }
                                .buttonStyle(PlainButtonStyle())
                                .scaleEffect(1.0)
                                .animation(.spring(response: 0.3, dampingFraction: 0.7), value: vm.isRecording)
                                .disabled(vm.isConnecting)
                                .opacity(vm.isConnecting ? 0.8 : 1.0)
                                // Voice button (new LiveKit voice assistant)
                                Button(action: {
                                    vm.connectVoiceAssistant()
                                }) {
                                    HStack(spacing: 4) {
                                        // Voice/microphone icon
                                        Image(systemName: "mic.fill")
                                            .font(.system(size: 12))
                                            .foregroundColor(DynamicIslandTheme.primaryGreen)
                                        Text("Voice")
                                            .font(.system(size: 12, weight: .medium))
                                            .foregroundColor(DynamicIslandTheme.primaryGreen)
                                    }
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 2)
                                    .background(DynamicIslandTheme.primaryGreen.opacity(0.1))
                                    .overlay(
                                        Capsule().stroke(DynamicIslandTheme.primaryGreen.opacity(0.3), lineWidth: 1)
                                    )
                                    .clipShape(Capsule())
                                }
                                .buttonStyle(PlainButtonStyle())
                                .scaleEffect(1.0)
                                .animation(.spring(response: 0.3, dampingFraction: 0.7), value: vm.voiceConnectionStatus)
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
                                            .background(DynamicIslandTheme.card)
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
                                .background(DynamicIslandTheme.card)
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
                                    isChatInputFocused = false
                                    isTextFieldActive = false
                                    vm.isChatMode = false
                                }
                            }
                        
                        // Right side icons (parity: Back + Home only)
                        HStack(spacing: 8) {
                            // COMMENTED OUT: Back button (as requested)
                            // if vm.isChatMode || vm.showVoiceInterface {
                            //     // Back button
                            //     Button(action: {
                            //         if vm.showVoiceInterface {
                            //             vm.disconnectVoiceUI()
                            //         } else {
                            //             vm.toggleChatMode()
                            //         }
                            //     }) {
                            //         HStack(spacing: 8) {
                            //             Image(systemName: "chevron.left")
                            //                 .font(.system(size: 12))
                            //             Text("Back")
                            //                 .font(.system(size: 11, weight: .medium))
                            //         }
                            //         .foregroundColor(DynamicIslandTheme.textPrimary)
                            //         .padding(.horizontal, 8)
                            //         .padding(.vertical, 2)
                            //         .background(Color.clear)
                            //         .clipShape(RoundedRectangle(cornerRadius: 8))
                            //     }
                            //     .buttonStyle(PlainButtonStyle())
                            // }

                            // Home icon - only show when chat input is focused or in voice mode
                            if vm.isChatMode || vm.showVoiceInterface {
                                Button(action: {
                                    vm.navigateToMainScreen()
                                }) {
                                    HomeIcon(color: .white)
                                        .frame(width: 24, height: 24)
                                        .background(Color.white.opacity(0.15))
                                        .clipShape(RoundedRectangle(cornerRadius: 8))
                                }
                                .buttonStyle(PlainButtonStyle())
                            }
                        }
                    }
                    
                    
                    // Main content area
                    HStack(spacing: 12) {
                        if vm.showVoiceInterface {
                            // Voice split layout (left conversation, right controls)
                            VoiceSplitLayout(vm: vm)
                        } else {
                            // Chat input section with fixed container
                            HStack(spacing: 12) {
                                ChatTextAreaView(
                                    chatInput: $vm.chatInput,
                                    textEditorHeight: $textEditorHeight,
                                    isTextFieldActive: $isTextFieldActive,
                                    vm: vm
                                )
                                .frame(width: 480) // Reduced width for chatbox to accommodate webcam
                                
                                // Webcam button - only show when recording
                                if vm.isRecording {
                                    WebcamButton(vm: vm)
                                        .frame(width: 70, height: 70) // Further reduced size to prevent cropping
                                }
                            }
                            .frame(width: vm.isRecording ? 550 : 480) // Optimized container width: 480px chatbox + 70px webcam + 0px spacing
                        }
                    }
                    .frame(maxWidth: vm.notchOpenedSize.width - 32) // Constrain main content area
                    .clipped() // Ensure content doesn't overflow
                    .animation(DynamicIslandTheme.expansionAnimation, value: vm.isChatMode)
                }
            }
        }
        .padding(vm.spacing)
        .frame(width: vm.notchOpenedSize.width, height: vm.notchOpenedSize.height)
        .animation(vm.animation, value: vm.isChatExpanded)
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
            .background(DynamicIslandTheme.card)
            .clipShape(RoundedRectangle(cornerRadius: 12))

            // Right: assistant controls circle
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
            DynamicIslandTheme.card
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
                .fill(DynamicIslandTheme.card)
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
            // Background for the textarea
            RoundedRectangle(cornerRadius: 16)
                .fill(DynamicIslandTheme.card)
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(DynamicIslandTheme.stroke.opacity(isChatInputFocused ? 1.0 : 0.5), lineWidth: 1)
                )
                .frame(width: .infinity, height: textEditorHeight)
                .animation(DynamicIslandTheme.expansionAnimation, value: textEditorWidth)
                .animation(.easeInOut(duration: 0.25), value: textEditorHeight)
            
            // Placeholder text when empty
            if chatInput.isEmpty {
                Text("Ask about screen or audio")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(DynamicIslandTheme.textMuted)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 10)
                    .allowsHitTesting(false) // Allow taps to pass through to TextEditor
            }
            
            // TextEditor (multi-line text input)
            TextEditor(text: $chatInput)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(DynamicIslandTheme.textPrimary)
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Color.clear)
                .focused($isChatInputFocused)
                .frame(width: textEditorWidth, height: textEditorHeight)
                .clipShape(RoundedRectangle(cornerRadius: 16))
                .scrollContentBackground(.hidden) // Hide default TextEditor background
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
                }
                .onChange(of: vm.isChatMode) { oldValue, newValue in
                    // When chat mode is turned off (back button pressed), remove focus
                    if !newValue && isChatInputFocused {
                        isChatInputFocused = false
                    }
                }
                .onAppear {
                    // Calculate width based on available space in the dynamic island
                    calculateTextEditorWidth()
                }
                .onChange(of: vm.isRecording) { oldValue, newValue in
                    // Adjust width when recording state changes (but only if not focused)
                    if !isChatInputFocused {
                        withAnimation(DynamicIslandTheme.expansionAnimation) {
                            calculateTextEditorWidth()
                        }
                    }
                }
        }
        .contentShape(Rectangle()) // Ensure entire area is tappable
        .allowsHitTesting(true) // Explicitly allow hit testing
        .onTapGesture {
            
            // Ensure window is key first
            if let window = NSApp.keyWindow ?? NSApp.windows.first(where: { $0.isVisible }) {
                if !window.isKeyWindow {
                    window.makeKey()
                }
            }
            
            // Set focus directly without delays or additional responder calls
            isChatInputFocused = true
            isTextFieldActive = true
            vm.isChatMode = true
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
        
        // Hide voice section when focused, show when unfocused (like React behavior)
        vm.isChatMode = newValue
        
        // Update chat expansion state for Dynamic Island sizing
        withAnimation(vm.animation) {
            vm.isChatExpanded = newValue
        }
        
        // Animate width change based on focus state - synchronized with Dynamic Island timing
        withAnimation(DynamicIslandTheme.expansionAnimation) {
            calculateTextEditorWidth()
        }
        
        // When unfocused and no text, clear chat input and reset height
        if !newValue && chatInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            chatInput = ""
            withAnimation(.easeInOut(duration: 0.25)) {
                textEditorHeight = 100 // Reset to minimum height
            }
        }
        
        // When focused, ensure window is key but DON'T change first responder
        if newValue {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
                if let window = NSApp.keyWindow ?? NSApp.windows.first(where: { $0.isVisible }) {
                    if !window.isKeyWindow {
                        window.makeKey()
                    }
                    // Don't call makeFirstResponder here - it steals focus from TextEditor
                }
            }
        }
    }
    
    // MARK: - Width Calculation Helper
    private func calculateTextEditorWidth() {
        // Use fixed width for chatbox - 480px
        let calculatedWidth: CGFloat = 480
        
        textEditorWidth = calculatedWidth
    }
}



// MARK: - HomeIcon (SVG path rendered in SwiftUI - matches JavaScript HomeIcon)
struct HomeIcon: View {
    var color: Color = .white
    var body: some View {
        Image(systemName: "house.fill")
            .font(.system(size: 18))
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
                        .fill(DynamicIslandTheme.card)
                        .frame(width: 70, height: 80)
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
                            .fill(DynamicIslandTheme.card)
                            .frame(width: 70, height: 70)
                        
                        // Camera preview
                        CameraPreviewView()
                            .frame(width: 70, height: 70)
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
                    .background(Color.black)
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

#Preview {
    NotchContentView(vm: .init())
        .frame(width: 850, height: 150, alignment: .center)
        .background(.black)
        .preferredColorScheme(.dark)
}
