//
//  NotchContentView.swift
//  NotchDrop
//
//  Created by 秋星桥 on 2024/7/7.
//  Last Modified by 冷月 on 2025/5/5.
//

import SwiftUI
import UniformTypeIdentifiers

struct NotchContentView: View {
    @StateObject var vm: NotchViewModel
    
    var body: some View {
        ZStack {
            switch vm.contentType {
            case .normal:
                DynamicIslandContentView(vm: vm)
                    .transition(.scale(scale: 0.8).combined(with: .opacity))
            case .menu:
                NotchMenuView(vm: vm)
                    .transition(.scale(scale: 0.8).combined(with: .opacity))
            case .settings:
                NotchSettingsView(vm: vm)
                    .transition(.scale(scale: 0.8).combined(with: .opacity))
            }
        }
        .animation(vm.animation, value: vm.contentType)
    }
}

// New Dynamic Island Content View matching JavaScript structure
struct DynamicIslandContentView: View {
    @StateObject var vm: NotchViewModel
    
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
                    Button("Test Login") {
                        vm.setAuthenticated(!vm.isAuthenticated)
                    }
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Color.blue.opacity(0.3))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    .buttonStyle(PlainButtonStyle())
                    
                    // Test button to send log message to Electron
                    Button("Send Log to Electron") {
                        vm.sendLogToElectron("Hello from Swift UI! Button clicked at \(Date())")
                    }
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Color.green.opacity(0.3))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    .buttonStyle(PlainButtonStyle())
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                // Full UI when authenticated
                VStack(spacing: 16) {
                    // Top row with start button and icons
                    HStack {
                        // Start button section
                        HStack(spacing: 8) {
                            if !vm.isRecording && !vm.showVoiceInterface {
                                // Start button
                                Button(action: {
                                    vm.startRecording()
                                }) {
                                    HStack(spacing: 4) {
                                        // Black bars on green pill (start button)
                                        HStack(spacing: 2) {
                                            ForEach(0..<5, id: \.self) { idx in
                                                RoundedRectangle(cornerRadius: 1.6)
                                                    .fill(DynamicIslandTheme.black)
                                                    .frame(width: 1.6, height: [6.0, 14.0, 10.0, 4.0, 6.0][idx])
                                            }
                                        }
                                        .frame(width: 24, height: 24)
                                        Text("start")
                                            .font(.system(size: 12, weight: .medium))
                                            .foregroundColor(Color(red: 0.055, green: 0.184, blue: 0.165)) // #0E2F2A
                                    }
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 2)
                                    .background(DynamicIslandTheme.primaryGreen)
                                    .clipShape(Capsule())
                                }
                                .buttonStyle(PlainButtonStyle())
                                .scaleEffect(1.0)
                                .animation(.spring(response: 0.3, dampingFraction: 0.7), value: vm.isRecording)
                            } else if vm.showVoiceInterface {
                                // Voice mode indicator (when split layout is visible)
                                HStack(spacing: 8) {
                                    Image(systemName: "waveform")
                                        .font(.system(size: 16))
                                        .foregroundColor(DynamicIslandTheme.primaryGreen)
                                    Text("Voice Mode")
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
                                            Image(systemName: "waveform")
                                                .font(.system(size: 14))
                                                .foregroundColor(DynamicIslandTheme.primaryGreen)
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
                            
                            // Audio visualizer
                            HStack(spacing: 2) {
                                ForEach(0..<5, id: \.self) { index in
                                    RoundedRectangle(cornerRadius: 1.6)
                                        .fill(DynamicIslandTheme.primaryGreen)
                                        .frame(width: 1.6, height: [6, 14, 10, 4, 6][index])
                                }
                            }
                            .padding(.horizontal, 6)
                            .padding(.vertical, 4)
                            .background(Color.white.opacity(0.2))
                            .clipShape(RoundedRectangle(cornerRadius: 4))
                        }
                        
                        Spacer()
                        
                        // Right side icons
                        HStack(spacing: 8) {
                            if vm.isChatMode || vm.showVoiceInterface {
                                // Back button
                                Button(action: {
                                    if vm.showVoiceInterface {
                                        vm.disconnectVoiceUI()
                                    } else {
                                        vm.toggleChatMode()
                                    }
                                }) {
                                    HStack(spacing: 8) {
                                        Image(systemName: "chevron.left")
                                            .font(.system(size: 12))
                                        Text("Back")
                                            .font(.system(size: 11, weight: .medium))
                                    }
                                    .foregroundColor(DynamicIslandTheme.textPrimary)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 2)
                                    .background(Color.clear)
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                                }
                                .buttonStyle(PlainButtonStyle())
                            }
                            
                            // Home icon
                            Button(action: {
                                // Home action
                            }) {
                                Image(systemName: "house.fill")
                                    .font(.system(size: 18))
                                    .foregroundColor(.white)
                                    .frame(width: 24, height: 24)
                                    .background(Color.white.opacity(0.15))
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                            }
                            .buttonStyle(PlainButtonStyle())
                            
                            // Security icon
                            Button(action: {
                                // Security action
                            }) {
                                Image(systemName: "lock.fill")
                                    .font(.system(size: 18))
                                    .foregroundColor(.white)
                                    .frame(width: 24, height: 24)
                                    .background(Color.white.opacity(0.15))
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                            }
                            .buttonStyle(PlainButtonStyle())
                            
                            // Test logout button
                            Button(action: {
                                vm.setAuthenticated(false)
                            }) {
                                Image(systemName: "person.crop.circle")
                                    .font(.system(size: 18))
                                    .foregroundColor(.white)
                                    .frame(width: 24, height: 24)
                                    .background(Color.white.opacity(0.15))
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    
                    // Main content area
                    HStack(spacing: 8) {
                        if vm.showVoiceInterface {
                            // Voice split layout (left conversation, right controls)
                            VoiceSplitLayout(vm: vm)
                        } else if vm.isChatMode {
                            // Chat mode - expanded chat interface
                            VStack {
                                HStack {
                                    TextField("Ask me anything...", text: $vm.chatInput)
                                        .textFieldStyle(PlainTextFieldStyle())
                                        .font(.system(size: 12, weight: .medium))
                                        .foregroundColor(DynamicIslandTheme.textPrimary)
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 8)
                                        .background(Color.clear)
                                        .onSubmit {
                                            vm.submitChat()
                                        }
                                    
                                    Spacer()
                                    
                                    Button(action: {
                                        vm.submitChat()
                                    }) {
                                        Image(systemName: "arrow.right")
                                            .font(.system(size: 14))
                                            .foregroundColor(DynamicIslandTheme.textPrimary)
                                    }
                                    .buttonStyle(PlainButtonStyle())
                                    .padding(.trailing, 4)
                                }
                                Spacer()
                            }
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                            .background(DynamicIslandTheme.card)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(DynamicIslandTheme.primaryGreen, lineWidth: 0.5)
                            )
                            .shadow(color: DynamicIslandTheme.primaryGreen.opacity(0.2), radius: 8)
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                        } else {
                            // Normal mode - chat and webcam sections
                            // Chat input section (now an actual input field that submits to Ask AI)
                            VStack {
                                Spacer()
                                HStack(spacing: 8) {
                                    TextField("Ask about screen or audio", text: $vm.chatInput)
                                        .textFieldStyle(PlainTextFieldStyle())
                                        .font(.system(size: 12, weight: .medium))
                                        .foregroundColor(DynamicIslandTheme.textPrimary)
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 8)
                                        .background(Color.clear)
                                        .onSubmit {
                                            vm.submitChat()
                                        }

                                    Spacer()

                                    Button(action: {
                                        vm.submitChat()
                                    }) {
                                        Image(systemName: "arrow.right")
                                            .font(.system(size: 14))
                                            .foregroundColor(DynamicIslandTheme.textPrimary)
                                    }
                                    .buttonStyle(PlainButtonStyle())
                                    .padding(.trailing, 4)
                                }
                                .padding(.horizontal, 2)
                                .padding(.vertical, 2)
                            }
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                            .background(DynamicIslandTheme.card)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(DynamicIslandTheme.stroke, lineWidth: 0.5)
                            )
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                            
                            // Right-hand tile: Webcam when recording, Voice control otherwise
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
                            } else {
                                VStack(spacing: 8) {
                                    if vm.voiceConnectionStatus == .connecting {
                                        ProgressView().controlSize(.small)
                                        Text("Connecting...")
                                            .font(.system(size: 11, weight: .medium))
                                            .foregroundColor(DynamicIslandTheme.textMuted)
                                    } else if vm.voiceConnectionStatus == .connected {
                                        Image(systemName: "waveform")
                                            .foregroundColor(DynamicIslandTheme.primaryGreen)
                                        Text("Voice Active")
                                            .font(.system(size: 12, weight: .medium))
                                            .foregroundColor(DynamicIslandTheme.textMuted)
                                    } else {
                                        Image(systemName: "waveform")
                                            .foregroundColor(.white)
                                        Text("Voice")
                                            .font(.system(size: 12, weight: .medium))
                                            .foregroundColor(DynamicIslandTheme.textMuted)
                                    }
                                }
                                .frame(width: 100, height: 100)
                                .background(DynamicIslandTheme.card)
                                .clipShape(Circle())
                                .onTapGesture {
                                    if vm.voiceConnectionStatus == .connected {
                                        vm.disconnectVoiceUI()
                                    } else {
                                        vm.connectVoiceUI()
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .padding(vm.spacing)
        .frame(maxWidth: vm.notchOpenedSize.width, maxHeight: vm.notchOpenedSize.height)
    }
}

// MARK: - Voice Split Layout (UI parity)
struct VoiceSplitLayout: View {
    @ObservedObject var vm: NotchViewModel

    var body: some View {
        HStack(spacing: 8) {
            // Left: conversation list (placeholder samples)
            VStack(alignment: .leading, spacing: 8) {
                VoiceMessageBubble(sender: "Agent", text: "Hello, how can I help you today?")
                VoiceMessageBubble(sender: "You", text: vm.voiceConnectionStatus == .connected ? (vm.isMicrophoneMuted ? "Muted" : "Listening...") : (vm.voiceConnectionStatus == .connecting ? "Connecting..." : ""))
                Spacer()
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .padding(8)
            .background(DynamicIslandTheme.card)
            .clipShape(RoundedRectangle(cornerRadius: 12))

            // Right: assistant controls circle
            VoiceControlsCircle(vm: vm)
        }
    }
}

struct VoiceMessageBubble: View {
    let sender: String
    let text: String
    var body: some View {
        VStack(alignment: .trailing, spacing: 4) {
            HStack(spacing: 6) {
                Circle().fill(Color(red: 0.173, green: 0.176, blue: 0.180)).frame(width: 6, height: 6)
                Text(sender)
                    .font(.system(size: 9, weight: .medium))
                    .foregroundColor(DynamicIslandTheme.textMuted)
            }
            Text(text)
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(DynamicIslandTheme.textPrimary)
        }
        .padding(8)
        .background(DynamicIslandTheme.card)
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
                // Visualizer / spinner by state
                if vm.voiceConnectionStatus == .connecting {
                    ProgressView().controlSize(.small)
                } else if vm.voiceConnectionStatus == .connected {
                    HStack(spacing: 2) {
                        ForEach(0..<5, id: \.self) { i in
                            RoundedRectangle(cornerRadius: 2)
                                .fill(DynamicIslandTheme.primaryGreen)
                                .frame(width: 3, height: 12)
                                .scaleEffect(y: 0.6 + 0.4 * CGFloat((i % 3)) , anchor: .bottom)
                        }
                    }
                } else {
                    Image(systemName: "waveform")
                        .foregroundColor(DynamicIslandTheme.primaryGreen)
                }

                // Status text
                Text(vm.voiceConnectionStatus == .connected ? "Voice Active" : (vm.voiceConnectionStatus == .connecting ? "Connecting..." : "Voice"))
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundColor(DynamicIslandTheme.textPrimary)

                // Action buttons
                HStack(spacing: 12) {
                    Button(action: { vm.disconnectVoiceUI() }) {
                        Image(systemName: "xmark")
                            .foregroundColor(DynamicIslandTheme.textPrimary)
                            .frame(width: 16, height: 16)
                    }.buttonStyle(PlainButtonStyle())

                    Button(action: { vm.toggleMicMute() }) {
                        Image(systemName: vm.isMicrophoneMuted ? "mic.slash.fill" : "mic.fill")
                            .foregroundColor(vm.isMicrophoneMuted ? Color.red : DynamicIslandTheme.textPrimary)
                            .frame(width: 16, height: 16)
                    }.buttonStyle(PlainButtonStyle())
                }
            }
            .padding(12)
        }
        .frame(width: 100, height: 100)
        .onAppear { rotate = true }
    }
}

#Preview {
    NotchContentView(vm: .init())
        .padding()
        .frame(width: 600, height: 150, alignment: .center)
        .background(.black)
        .preferredColorScheme(.dark)
}
