//
//  NotchContentView.swift
//  NotchDrop
//
//  Created by 秋星桥 on 2024/7/7.
//  Last Modified by 冷月 on 2025/5/5.
//

import SwiftUI
import UniformTypeIdentifiers
import AppKit

struct NotchContentView: View {
    @StateObject var vm: NotchViewModel
    
    var body: some View {
        ZStack {
            switch vm.contentType {
            case .normal:
                DynamicIslandContentView(vm: vm)
                    .transition(.scale(scale: 0.8).combined(with: .opacity))
            }
        }
        .animation(vm.animation, value: vm.contentType)
    }
}

// New Dynamic Island Content View matching JavaScript structure
struct DynamicIslandContentView: View {
    @StateObject var vm: NotchViewModel
    @FocusState private var isChatInputFocused: Bool
    @State private var isTextFieldActive: Bool = false
    @State private var textEditorHeight: CGFloat = 100 // Dynamic height for textarea
    
    var body: some View {
        VStack(spacing: 16) {
            if !vm.isAuthenticated {
                // Welcome section when not authenticated
                VStack(spacing: 8) {
                    Text("hello")
                        .font(.system(size: 48, weight: .light, design: .default))
                        .foregroundColor(.white)
                    Text("Please log in to access features")
                        .font(.system(size: 14, weight: .regular))
                        .foregroundColor(.white.opacity(0.8))
                    
                    // Test button to toggle authentication
                    Button("Login") {
                        vm.setAuthenticated(!vm.isAuthenticated)
                    }
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Color.blue.opacity(0.3))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    .buttonStyle(PlainButtonStyle())
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                // Full UI when authenticated
                // Reduce spacing to bring chat input closer to the header
                VStack(spacing: 16) {
                    // Top row with start button and icons
                    HStack {
                        // Start button section
                        HStack(spacing: 8) {
                            if !vm.isRecording && !vm.showVoiceInterface {
                                // Listen button (existing functionality)
                                Button(action: {
                                    vm.startRecording()
                                }) {
                                    HStack(spacing: 4) {
                                        // Custom wave icon (SVG-based)
                                        WaveIcon(color: DynamicIslandTheme.black)
                                            .frame(width: 15, height: 15)
                                        Text("Listen")
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

                            // Audio visualizer
                            // HStack(spacing: 2) {
                            //     ForEach(0..<5, id: \.self) { index in
                            //         RoundedRectangle(cornerRadius: 1.6)
                            //             .fill(DynamicIslandTheme.primaryGreen)
                            //             .frame(width: 1.6, height: [6, 14, 10, 4, 6][index])
                            //     }
                            // }
                            // .padding(.horizontal, 6)
                            // .padding(.vertical, 4)
                            // .background(Color.white.opacity(0.2))
                            // .clipShape(RoundedRectangle(cornerRadius: 4))
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
                            // TextEditor implementation (textarea-like with multi-line support and auto-resize)
                            ChatTextAreaView(
                                chatInput: $vm.chatInput,
                                textEditorHeight: $textEditorHeight,
                                isTextFieldActive: $isTextFieldActive,
                                vm: vm
                            )
                                
                            // Debug: Manual focus trigger (remove in production)
                            #if DEBUG
                            HStack {
                                Button("Focus TextEditor") {
                                    print("🎯 Manual focus button tapped")
                                    isChatInputFocused = true
                                    isTextFieldActive = true
                                    vm.isChatMode = true
                                }
                                .font(.system(size: 10))
                                .foregroundColor(.yellow)
                                
                                Button("Test Chat") {
                                    print("🎯 Test chat button tapped")
                                    guard !vm.isSendingMessage else {
                                        print("⚠️ Already sending message, ignoring test button")
                                        return
                                    }
                                    vm.chatInput = "Test message from NotchDrop Swift\nWith multiple lines\nLike a real textarea!"
                                    vm.submitChat()
                                }
                                .font(.system(size: 10))
                                .foregroundColor(.yellow)
                            }
                            .padding(.top, 4)
                            #endif
                            
                            // COMMENTED OUT: Right-hand tile (Webcam and Voice controls)
                            // This section contained webcam icon when recording and voice controls when not recording
                            // Removed to simplify the notch UI and reduce width requirements
                            /*
                            if !vm.isChatMode {
                                // Webcam when recording, Voice control otherwise
                                if vm.isRecording {
                                    VStack(spacing: 8) {
                                        Image(systemName: "video.fill")
                                            .font(.system(size: 24))
                                            .foregroundColor(.white)
                                        Text("Webcam")
                                            .font(.system(size: 12, weight: .medium))
                                            .foregroundColor(DynamicIslandTheme.textMuted)
                                    }
                                    .frame(width: 100, height: 100)
                                    .background(DynamicIslandTheme.card)
                                    .clipShape(Circle())
                                    .transition(.scale(scale: 0.8).combined(with: .opacity))
                                } else {
                                    VStack(spacing: 8) {
                                        if vm.voiceConnectionStatus == .connecting {
                                            ProgressView().controlSize(.small)
                                            Text("Connecting...")
                                                .font(.system(size: 11, weight: .medium))
                                                .foregroundColor(DynamicIslandTheme.textMuted)
                                        } else if vm.voiceConnectionStatus == .connected {
                                            WaveIcon(color: DynamicIslandTheme.primaryGreen)
                                                .frame(width: 18, height: 18)
                                            Text("Voice Active")
                                                .font(.system(size: 12, weight: .medium))
                                                .foregroundColor(DynamicIslandTheme.textMuted)
                                        } else {
                                            WaveIcon(color: .white)
                                                .frame(width: 18, height: 18)
                                            Text("Voice")
                                                .font(.system(size: 12, weight: .medium))
                                                .foregroundColor(DynamicIslandTheme.textMuted)
                                        }
                                    }
                                    .frame(width: 100, height: 100)
                                    .background(DynamicIslandTheme.card)
                                    .clipShape(Circle())
                                    .transition(.scale(scale: 0.8).combined(with: .opacity))
                                    .onTapGesture {
                                        if vm.voiceConnectionStatus == .connected {
                                            vm.disconnectVoiceUI()
                                        } else {
                                            vm.connectVoiceUI()
                                        }
                                    }
                                }
                            }
                            */
                        }
                    }
                    .frame(maxWidth: vm.notchOpenedSize.width - 32) // Constrain main content area
                    .animation(DynamicIslandTheme.expansionAnimation, value: vm.isChatMode)
                }
            }
        }
        .padding(vm.spacing)
        .frame(width: vm.notchOpenedSize.width, height: vm.notchOpenedSize.height)
        .animation(vm.animation, value: vm.isChatExpanded)
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
                                    (vm.isMicrophoneMuted ? "Microphone muted - tap to unmute" : "Voice assistant ready - start speaking") : 
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
                        
                        // Show current status
                        if vm.voiceConnectionStatus == .connected {
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
                .frame(width: textEditorWidth, height: textEditorHeight)
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
                        print("🎯 Chat mode disabled - removing focus from TextEditor")
                        isChatInputFocused = false
                    }
                }
                .onAppear {
                    print("🎯 TextEditor appeared - ready for focus")
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
            print("🎯 TextEditor container tapped - setting focus")
            
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
        print("🎯 TextEditor text changed: '\(newValue)'")
        
        // Only resize based on actual content, not placeholder
        if !newValue.isEmpty {
            print("🎯 TextEditor width: \(textEditorWidth)px")
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
        // Get the actual available width from the dynamic island
        let islandWidth = vm.notchOpenedSize.width
        
        // Calculate available space considering:
        // - Total padding (32px: 16px on each side)
        // - Spacing between elements (12px)
        // - Right tile has been removed, so no need to account for it
        let totalPadding: CGFloat = 32 // 16px on each side
        let elementSpacing: CGFloat = 12
        
        var availableWidth = islandWidth - totalPadding
        
        // Right tile has been commented out, so no need to subtract its width
        // The text editor can now use the full available width
        
        // Ensure minimum width and apply some margin for visual balance
        let minWidth: CGFloat = 200
        let calculatedWidth = max(minWidth, availableWidth - 20) // 20px margin for visual balance
        
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

#Preview {
    NotchContentView(vm: .init())
        .frame(width: 450, height: 150, alignment: .center)
        .background(.black)
        .preferredColorScheme(.dark)
}
