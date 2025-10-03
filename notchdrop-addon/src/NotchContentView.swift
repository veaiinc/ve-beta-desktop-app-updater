
import SwiftUI
import UniformTypeIdentifiers
import AppKit
import Combine
import AVFoundation
import MediaPlayer
import WebKit

struct NotchContentView: View {
    @StateObject var vm: NotchViewModel
    
    var body: some View {
        ZStack {
            if vm.showNotificationOverlay {
                // // When notification is showing, ONLY show the notification (no background content)
                // NotificationOverlayView(vm: vm)
                //     .transition(.scale(scale: 1.0).combined(with: .opacity))
            } else {
                // Normal content switching when no notification
                switch vm.contentType {
                case .normal:
                    DynamicIslandContentView(vm: vm)
                        .transition(.scale(scale: 0.8).combined(with: .opacity))
                }
            }
            
            // Info popup rendered outside the notch container
            // Commented out since InfoPopupMenu was commented out
            // if showInfoPopup {
            //     InfoPopupMenu()
            //         .offset(x: 400, y: 0) // Position to the right of the notch
            //         .zIndex(1000) // Ensure it appears above everything
            //         .transition(.scale(scale: 0.95).combined(with: .opacity))
            // }
        }
        .animation(vm.animation, value: vm.contentType)
        .animation(vm.animation, value: vm.showNotificationOverlay)
        .onAppear {
            // Set up browser permission window monitoring
            vm.setupBrowserPermissionWindow()
        }
    }
}

// MARK: - MeetingCompactChatBox (non-expandable chat lookalike)
struct MeetingCompactChatBox: View {
    let placeholder: String

    var body: some View {
        ZStack(alignment: .leading) {
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .fill(Color.white.opacity(0.04))
                .overlay(
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .stroke(DynamicIslandTheme.primaryGreen.opacity(0.6), lineWidth: 1)
                )

            Text(placeholder)
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color.white.opacity(0.6))
                .padding(.horizontal, 18)
        }
    }
}

// MARK: - Smart Meeting Card (replaces StartMeetingCard with alignment logic)
struct SmartMeetingCard: View {
    let vm: NotchViewModel
    @State private var isHovered: Bool = false

    var body: some View {
        GeometryReader { geo in
            let h = geo.size.height
            let corner: CGFloat = 12
            let padding: CGFloat = 12
            // Scale text to fit smaller height nicely (target 220x100 card)
            let titleSize = max(16, min(22, h * 0.28))

            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: corner, style: .continuous)
                    .fill(getBackgroundColor())
                    .overlay(
                        RoundedRectangle(cornerRadius: corner, style: .continuous)
                            .stroke(getBorderColor(), lineWidth: 0.8)
                    )

                VStack(alignment: .leading, spacing: 2) {
                    if vm.isRecording {
                        // Stop meeting state
                        Text("Stop")
                            .font(.system(size: titleSize, weight: .medium))
                            .foregroundColor(.white)
                            .lineLimit(1)
                            .minimumScaleFactor(0.7)
                        Text("Meeting")
                            .font(.system(size: titleSize, weight: .medium))
                            .foregroundColor(.white)
                            .lineLimit(1)
                            .minimumScaleFactor(0.7)
                    } else {
                        // Start meeting state
                        Text("Start")
                            .font(.system(size: titleSize, weight: .medium))
                            .foregroundColor(.white)
                            .lineLimit(1)
                            .minimumScaleFactor(0.7)
                        Text("Meeting")
                            .font(.system(size: titleSize, weight: .medium))
                            .foregroundColor(.white)
                            .lineLimit(1)
                            .minimumScaleFactor(0.7)
                    }
                }
                .padding(padding)
            }
            .contentShape(RoundedRectangle(cornerRadius: corner, style: .continuous))
            .onTapGesture { 
                if vm.isRecording {
                    vm.stopRecording()
                } else {
                    vm.startRecording()
                }
            }
            .onHover { hovering in
                withAnimation(.easeInOut(duration: 0.2)) {
                    isHovered = hovering
                }
            }
        }
        // Ensure the reader honors parent frame
        .clipped()
    }
    
    private func getBackgroundColor() -> Color {
        if isHovered {
            return DynamicIslandTheme.primaryGreen.opacity(0.15)
        } else {
            return Color.white.opacity(0.04)
        }
    }
    
    private func getBorderColor() -> Color {
        if isHovered {
            return DynamicIslandTheme.primaryGreen.opacity(0.4)
        } else {
            return Color.white.opacity(0.12)
        }
    }
}

// New Dynamic Island Content View matching JavaScript structure
struct DynamicIslandContentView: View {
    @StateObject var vm: NotchViewModel
    @FocusState private var isChatInputFocused: Bool
    @State private var isTextFieldActive: Bool = false
    @State private var textEditorHeight: CGFloat = 100 // Fixed height for textarea with scroll
    @State private var receivedMessage: String = "" // Track received messages from Electron
    @State private var cancellables = Set<AnyCancellable>()
    
    // Hover states for right side icons
    @State private var isVEIconHovered: Bool = false
    @State private var isStealthIconHovered: Bool = false
    @State private var isLockIconHovered: Bool = false
    
    // Hover states for left side buttons
    @State private var isHomeButtonHovered: Bool = false
    @State private var isMeetingButtonHovered: Bool = false
    
    var body: some View {
        VStack(spacing: 3.0) {
            if !vm.isAuthenticated {
                // Welcome section when not authenticated
                VStack(spacing: 8) {
                   Text("Hey")
                .font(.custom("Urbanist", size: 48)) // Use actual font name
                // .kerning(-0.03 * 54) // -3% of font size = -1.62
                .lineSpacing(-4) // Optional: Adjust if you want total line height to be close to 50px
                .foregroundColor(.white)

                    Text("I'm Ve, From the living intelligence company")
                        .font(.custom("Urbanist", size: 13))
                        .foregroundColor(.white.opacity(0.8))
                        .lineSpacing(17)

                    Text("of San Francisco")
                    .font(.custom("Urbanist", size: 13))
                    .foregroundColor(.white.opacity(0.8))
                    .lineSpacing(17)
                    
                    // Test buttons
                    HStack(spacing: 8) {
                        Button("LOGIN") {
                            vm.navigateToMainScreen(path: "/verify-user")
                        }
                        .font(.custom("Urbanist", size: 13))
                        .lineSpacing(17)
                        .foregroundColor(.white)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(Color.gray.opacity(0.3))
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
                        // Start/Navigation section
                        HStack(spacing: 8) {
                            if !vm.isRecording && !vm.showVoiceInterface {
                                // Home button → Reset to NotchDrop default starting page (stays within NotchDrop)
                                Button(action: {
                                    vm.isTeamsView = false
                                    vm.resetToNotchHome()
                                }) {
                                    HStack(spacing: 6.0) {
                                        Image(systemName: "house")
                                            .font(.system(size: 14, weight: .regular))
                                            .foregroundColor(vm.isTeamsView ? .white : .black)
                                    }
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 6)
                                    .background(
                                        RoundedRectangle(cornerRadius: 14, style: .continuous)
                                            .fill(vm.isTeamsView ? 
                                                (isHomeButtonHovered ? DynamicIslandTheme.primaryGreen.opacity(0.3) : Color.clear) :
                                                (isHomeButtonHovered ? DynamicIslandTheme.primaryGreen.opacity(0.4) : Color(red: 0.69, green: 0.97, blue: 0.84))
                                            )
                                    )
                                }
                                .buttonStyle(PlainButtonStyle())
                                .onHover { hovering in
                                    withAnimation(.easeInOut(duration: 0.2)) {
                                        isHomeButtonHovered = hovering && vm.isTeamsView
                                    }
                                }
                                .onChange(of: vm.isTeamsView) { newValue in
                                    if !newValue {
                                        // Home button is now active, reset hover state
                                        isHomeButtonHovered = false
                                    }
                                }

                                // Teams pill (sets Teams view)
                                Button(action: {
                                    vm.isTeamsView = true
                                }) {
                                    HStack(spacing: 6) {
                                        Text("Meeting AI")
                                            .font(.system(size: 15, weight: .semibold))
                                            .foregroundColor(vm.isTeamsView ? .black : .white)
                                    }
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 8)
                                    .background(
                                        RoundedRectangle(cornerRadius: 14, style: .continuous)
                                            .fill(vm.isTeamsView ? 
                                                (isMeetingButtonHovered ? DynamicIslandTheme.primaryGreen.opacity(0.4) : Color(red: 0.69, green: 0.97, blue: 0.84)) :
                                                (isMeetingButtonHovered ? DynamicIslandTheme.primaryGreen.opacity(0.2) : Color.clear)
                                            )
                                    )
                                }
                                .buttonStyle(PlainButtonStyle())
                                .onHover { hovering in
                                    withAnimation(.easeInOut(duration: 0.2)) {
                                        isMeetingButtonHovered = hovering && !vm.isTeamsView
                                    }
                                }
                                .onChange(of: vm.isTeamsView) { newValue in
                                    if newValue {
                                        // Meeting AI button is now active, reset hover state
                                        isMeetingButtonHovered = false
                                    }
                                }
                                // Removed desktop and VE icons per request
                            } else if vm.showVoiceInterface {
                                // Voice controls (mute/unmute and cancel buttons)
                                HStack(spacing: 12) {
                                    // Mute/Unmute toggle
                                    Button(action: {
                                        vm.toggleVoiceMute()
                                    }) {
                                        Image(systemName: vm.isMicrophoneMuted ? "mic.slash.fill" : "mic.fill")
                                            .font(.system(size: 14))
                                            .foregroundColor(.white)
                                            .frame(width: 24, height: 24)
                                            .background(Color.clear)
                                            .overlay(
                                                RoundedRectangle(cornerRadius: 6)
                                                    .stroke(Color.white.opacity(0.3), lineWidth: 1)
                                            )
                                            .clipShape(RoundedRectangle(cornerRadius: 6))
                                    }
                                    .buttonStyle(PlainButtonStyle())
                                    
                                    // Cancel/Disconnect button
                                    Button(action: {
                                        vm.disconnectVoiceAssistant()
                                    }) {
                                        RoundedRectangle(cornerRadius: 2)
                                            .fill(Color.red)
                                            .frame(width: 14, height: 14)
                                            .frame(width: 24, height: 24)
                                            .background(Color.clear)
                                            .overlay(
                                                RoundedRectangle(cornerRadius: 6)
                                                    .stroke(Color.white.opacity(0.3), lineWidth: 1)
                                            )
                                            .clipShape(RoundedRectangle(cornerRadius: 6))
                                    }
                                    .buttonStyle(PlainButtonStyle())
                                }
                                .padding(.horizontal, 12)
                                .padding(.top, 2) // Move left icons up to align with right icons
                                .padding(.bottom, 6)
                                .background(Color.clear) // Transparent background
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
                                    DispatchQueue.main.async {
                                        isChatInputFocused = false
                                        isTextFieldActive = false
                                        vm.isChatMode = false
                                    }
                                }
                            }

                        // Right side icons and controls with even spacing
                        HStack(spacing: 8) {
                            // VE icon → Open Ve app (Electron main window)
                            Button(action: {
                                vm.navigateToMainScreen(path: nil)
                            }) {
                                VEIcon(color: .white)
                                    .frame(width: 16, height: 16)
                                    .padding(8) // Increased padding for larger clickable area
                                    .background(
                                        RoundedRectangle(cornerRadius: 6)
                                            .fill(isVEIconHovered ? DynamicIslandTheme.primaryGreen.opacity(0.3) : Color.clear)
                                    )
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 6) // Slightly larger corner radius
                                            .stroke(Color.white.opacity(0.15), lineWidth: 0.5)
                                    )
                                    .contentShape(RoundedRectangle(cornerRadius: 6)) // Make entire rectangular area clickable
                            }
                            .buttonStyle(PlainButtonStyle())
                            .help("Open Ve App")
                            .onHover { hovering in
                                withAnimation(.easeInOut(duration: 0.2)) {
                                    isVEIconHovered = hovering
                                }
                            }
                            
                            // Stealth mode toggle icon - second icon
                            Button(action: {
                                vm.toggleStealthMode()
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
                                .background(
                                    RoundedRectangle(cornerRadius: 6)
                                        .fill(isStealthIconHovered ? DynamicIslandTheme.primaryGreen.opacity(0.2) : Color.clear)
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: 6) // Slightly larger corner radius
                                        .stroke(Color.white.opacity(0.15), lineWidth: 0.5)
                                )
                                .contentShape(RoundedRectangle(cornerRadius: 6)) // Make entire rectangular area clickable
                            }
                            .buttonStyle(PlainButtonStyle())
                            .help(vm.isStealthModeEnabled ? "Disable Stealth Mode" : "Enable Stealth Mode")
                            .onHover { hovering in
                                withAnimation(.easeInOut(duration: 0.2)) {
                                    isStealthIconHovered = hovering
                                }
                            }
                            
                            // Information icon (third icon) with popup menu
                            // InfoIconWithPopup(showInfoPopup: $showInfoPopup, infoPopupPosition: $infoPopupPosition)
                            
                            // Lock/Unlock button (fourth icon)
                            Button(action: {
                                vm.toggleNotchLock()
                                
                                // Force state validation after toggle
                                DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                                    vm.forceLockStateRefresh()
                                }
                            }) {
                                Image(systemName: vm.isNotchLocked ? "lock.fill" : "lock.open.fill")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(vm.isNotchLocked ? DynamicIslandTheme.primaryGreen : .white)
                                    .frame(width: 16, height: 16)
                                    .padding(8)
                                    .background(
                                        RoundedRectangle(cornerRadius: 6)
                                            .fill(isLockIconHovered ? DynamicIslandTheme.primaryGreen.opacity(0.1) : Color.clear)
                                    )
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 6)
                                            .stroke(vm.isNotchLocked ? DynamicIslandTheme.primaryGreen.opacity(0.6) : Color.white.opacity(0.15), lineWidth: 0.5)
                                    )
                                    .contentShape(RoundedRectangle(cornerRadius: 6)) // Make entire rectangular area clickable
                            }
                            .buttonStyle(PlainButtonStyle())
                            .help(vm.isNotchLocked ? "Unlock Notch" : "Lock Notch")
                            .onAppear {
                                // Validate state on appearance
                                vm.forceLockStateRefresh()
                            }
                            .onChange(of: vm.isNotchLocked) { newValue in
                                // Force UI refresh when state changes
                                DispatchQueue.main.async {
                                    vm.objectWillChange.send()
                                }
                            }
                            .onHover { hovering in
                                withAnimation(.easeInOut(duration: 0.2)) {
                                    isLockIconHovered = hovering
                                }
                            }
                        }
                    }
                    
                    
                    // Main content area
                    HStack(alignment: .center, spacing: 8) {
                        if vm.isRecording && vm.showTranscriptionDuringRecording {
                            // Show transcription data in chat-like format
                            ScrollView(.vertical, showsIndicators: true) {
                                LazyVStack(spacing: 12) {
                                    if vm.voiceMessages.isEmpty {
                                        Text("No transcription data yet...")
                                            .font(.system(size: 14))
                                            .foregroundColor(.white.opacity(0.6))
                                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                                            .padding()
                                    } else {
                                        ForEach(vm.voiceMessages) { message in
                                            TranscriptionMessageView(message: message)
                                                .padding(.horizontal, 4)
                                        }
                                    }
                                }
                                .padding(.vertical, 8)
                                .padding(.horizontal, 12)
                            }
                            .frame(width: min(240, vm.notchOpenedSize.width - 240), height: 120)
                            .background(Color.black.opacity(0.4))
                            .cornerRadius(10)
                        } else if vm.isRecording && !vm.showTranscriptionDuringRecording {
                            // Show live intelligence data in chat-like format
                            ScrollView(.vertical, showsIndicators: true) {
                                LazyVStack(spacing: 12) {
                                    if vm.liveIntelligenceMessages.isEmpty {
                                        Text("No live intelligence data yet...")
                                            .font(.system(size: 14))
                                            .foregroundColor(.white.opacity(0.6))
                                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                                            .padding()
                                    } else {
                                        ForEach(vm.liveIntelligenceMessages) { message in
                                            TranscriptionMessageView(message: message)
                                                .padding(.horizontal, 4)
                                        }
                                    }
                                }
                                .padding(.vertical, 8)
                                .padding(.horizontal, 12)
                            }
                            .frame(width: min(240, vm.notchOpenedSize.width - 240), height: 120)
                            .background(Color.black.opacity(0.4))
                            .cornerRadius(10)
                            // .onAppear {
                            //     // Console log live intelligence data display in SwiftUI
                            //     print("🧠 NotchContentView: Displaying live intelligence data")
                            //     print("🧠 Total live intelligence messages: \(vm.liveIntelligenceMessages.count)")
                            //     if let lastMessage = vm.liveIntelligenceMessages.last {
                            //         print("🧠 Latest message - Sender: \(lastMessage.sender), Content: \(lastMessage.content.prefix(50))...")
                            //     }
                            // }
                            .onChange(of: vm.liveIntelligenceMessages.count) { newCount in
                                // Console log when live intelligence messages count changes
                                print("🧠 NotchContentView: Live intelligence messages count changed to: \(newCount)")
                                if let lastMessage = vm.liveIntelligenceMessages.last {
                                    print("🧠 NotchContentView: Latest message - Sender: \(lastMessage.sender), Content: \(lastMessage.content.prefix(50))...")
                                }
                            }
                        }

                        if vm.showVoiceInterface {
                            // Voice split layout (left conversation, right controls) - PRIORITY: Always show voice interface when active
                            VoiceSplitLayout(vm: vm)
                        } else if vm.isTeamsView {
                            // Teams view: maintain even spacing between components
                            HStack(spacing: 12) {
                                // Smart meeting card - only show when not recording
                                if !vm.isRecording {
                                    SmartMeetingCard(vm: vm)
                                        .frame(width: 220, height: 100)
                                }
                                
                                ChatTextAreaView(
                                    chatInput: $vm.chatInput,
                                    isTextFieldActive: $isTextFieldActive,
                                    vm: vm
                                )
                                .frame(width: vm.isRecording ? 400 : 400, height: 100)
                                .animation(.easeInOut(duration: 0.2), value: vm.isTeamsView)
                                
                                WebcamButton(vm: vm)
                                    .frame(width: 100, height: 100)
                            }
                        } else {
                            // Chat input section with voice/arrow icon inside - matches image layout
                            ChatTextAreaView(
                                chatInput: $vm.chatInput,
                                isTextFieldActive: $isTextFieldActive,
                                vm: vm
                            )
                            .frame(width: vm.isRecording ? (vm.showTranscriptionDuringRecording ? 240 : 410) : 510) // Adaptive width
                            .animation(.easeInOut(duration: 0.3), value: vm.isChatMode)
                            .animation(.easeInOut(duration: 0.3), value: vm.isRecording)
                            
                            // Voice Mode button and Media Controllers - only show when NOT recording AND chat not focused
                            if !vm.isRecording && !vm.isChatMode {
                                HStack(spacing: 12) {
                                    // NotchDrop Calendar - always show when not in chat mode and not recording
                                    if vm.showCalendar {
                                        NotchCalendarView(vm: vm)
                                            .frame(width: 240, height: 100)
                                            .transition(.scale(scale: 0.8).combined(with: .opacity))
                                    }
                                    
                                    // Spotify Media Controller - only show when music is playing
                                    if vm.hasActiveMusic {
                                        SpotifyMediaController(vm: vm)
                                            .transition(.scale.combined(with: .opacity))
                                    }
                                    
                                    // YouTube Media Controller - only show when video is playing
                                    if vm.hasActiveVideo {
                                        YouTubeMediaController(vm: vm)
                                            .transition(.scale.combined(with: .opacity))
                                    }
                                }
                                .animation(.easeInOut(duration: 0.3), value: vm.hasActiveMusic)
                                .animation(.easeInOut(duration: 0.3), value: vm.hasActiveVideo)
                            }
                            
                            // Webcam button - only show when recording
                            if vm.isRecording {
                                Spacer(minLength: 0)
                                WebcamButton(vm: vm)
                                    .frame(width: 80, height: 80)
                            }
                        }
                    }
                    .frame(maxWidth: vm.notchOpenedSize.width - 32)
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
            
            // Set up Spotify detection timer for the whole view
            setupSpotifyDetectionTimer()
        }
    }
    
    // MARK: - Spotify Detection Timer
    private func setupSpotifyDetectionTimer() {
        // Initial check
        updateSpotifyStatus()
        
        // Set up periodic updates for Spotify status
        Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true) { _ in
            updateSpotifyStatus()
        }
    }
    
    private func updateSpotifyStatus() {
        // Check if Spotify is running
        let spotifyRunning = isSpotifyRunning()
        
        // Get system media info
        let nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo
        let hasSystemMedia = nowPlayingInfo != nil
        
        // Get basic playback state
        let playbackRate = nowPlayingInfo?[MPNowPlayingInfoPropertyPlaybackRate] as? Double ?? 0.0
        let isPlaying = playbackRate > 0.0
        
        // Update hasActiveMusic based on multiple detection methods
        vm.hasActiveMusic = spotifyRunning || hasSystemMedia || isPlaying
        vm.isMusicPlaying = isPlaying
        
        // Detect YouTube videos
        detectYouTubeVideo()
    }
    
    private func isSpotifyRunning() -> Bool {
        let script = "tell application \"System Events\" to (name of processes) contains \"Spotify\""
        if let appleScript = NSAppleScript(source: script) {
            var error: NSDictionary?
            let result = appleScript.executeAndReturnError(&error)
            if error == nil {
                return result.booleanValue
            }
        }
        return false
    }
    
    private func detectYouTubeVideo() {
        // Method 1: Check browser tabs for YouTube
        let youtubeFromBrowser = checkBrowserForYouTube()
        
        // Method 2: Check system media for YouTube
        let youtubeFromMedia = checkSystemMediaForYouTube()
        
        // Update YouTube state
        vm.hasActiveVideo = youtubeFromBrowser || youtubeFromMedia
        vm.isVideoPlaying = vm.hasActiveVideo
    }
    
    private func checkBrowserForYouTube() -> Bool {
        // Only check browsers if we have permission
        guard vm.hasBrowserPermission else {
            // Request permission first time
            if !vm.browserPermissionRequested {
                vm.requestBrowserPermission()
            }
            return false
        }
        
        // Check only major browsers: Safari, Chrome, Firefox
        let browsers = ["Safari", "Google Chrome", "Firefox"]
        
        for browser in browsers {
            if let (url, title) = checkBrowserApp(browser) {
                if url.contains("youtube.com/watch") || url.contains("youtu.be/") {
                    updateVideoInfo(from: title, url: url)
                    return true
                }
            }
        }
        return false
    }
    
    private func checkBrowserApp(_ appName: String) -> (String, String)? {
        let script: String
        
        if appName == "Safari" {
            script = """
            tell application "Safari"
                if it is running then
                    try
                        set currentURL to URL of current tab of window 1
                        set currentTitle to name of current tab of window 1
                        return currentURL & "|||" & currentTitle
                    end try
                end if
            end tell
            return ""
            """
        } else {
            script = """
            tell application "\(appName)"
                if it is running then
                    try
                        set currentURL to URL of active tab of window 1
                        set currentTitle to title of active tab of window 1
                        return currentURL & "|||" & currentTitle
                    end try
                end if
            end tell
            return ""
            """
        }
        
        if let appleScript = NSAppleScript(source: script) {
            var error: NSDictionary?
            let result = appleScript.executeAndReturnError(&error)
            if error == nil {
                let resultString = result.stringValue ?? ""
                if !resultString.isEmpty && resultString.contains("|||") {
                    let components = resultString.components(separatedBy: "|||")
                    if components.count >= 2 {
                        let url = components[0].trimmingCharacters(in: .whitespacesAndNewlines)
                        let title = components[1].trimmingCharacters(in: .whitespacesAndNewlines)
                        return (url, title)
                    }
                }
            }
        }
        return nil
    }
    
    private func checkSystemMediaForYouTube() -> Bool {
        guard let nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo else {
            return false
        }
        
        // Check if the media source is YouTube
        if let artist = nowPlayingInfo[MPMediaItemPropertyArtist] as? String,
           let title = nowPlayingInfo[MPMediaItemPropertyTitle] as? String {
            
            // YouTube videos often have "YouTube" as artist or in the title
            let isYouTube = artist.lowercased().contains("youtube") || 
                           title.lowercased().contains("youtube") ||
                           artist.isEmpty // YouTube often has empty artist
            
            if isYouTube {
                updateVideoInfo(from: title, url: "")
                return true
            }
        }
        
        return false
    }
    
    private func updateVideoInfo(from title: String, url: String) {
        let vm = self.vm
        DispatchQueue.main.async {
            
            // Parse title to extract video title and channel
            if title.contains(" - ") {
                let parts = title.split(separator: " - ", maxSplits: 1)
                if parts.count == 2 {
                    vm.videoTitle = String(parts[0]).trimmingCharacters(in: .whitespaces)
                    vm.videoChannel = String(parts[1]).trimmingCharacters(in: .whitespaces)
                } else {
                    vm.videoTitle = title
                    vm.videoChannel = "YouTube"
                }
            } else {
                vm.videoTitle = title
                vm.videoChannel = "YouTube"
            }
            
            // Store the video URL and create embed URL
            vm.videoURL = url
            if !url.isEmpty {
                vm.videoEmbedURL = self.convertToEmbedURL(url)
                vm.showVideoPlayer = true
                self.extractYouTubeThumbnail(from: url)
            }
        }
    }
    
    private func convertToEmbedURL(_ url: String) -> String {
        // Extract video ID from YouTube URL
        let patterns = [
            "(?:youtube\\.com\\/watch\\?v=)([a-zA-Z0-9_-]{11})",
            "(?:youtu\\.be\\/)([a-zA-Z0-9_-]{11})",
            "(?:youtube\\.com\\/embed\\/)([a-zA-Z0-9_-]{11})",
            "(?:youtube\\.com\\/v\\/)([a-zA-Z0-9_-]{11})"
        ]
        
        var videoId: String?
        for pattern in patterns {
            let regex = try? NSRegularExpression(pattern: pattern, options: [])
            let range = NSRange(url.startIndex..., in: url)
            if let match = regex?.firstMatch(in: url, options: [], range: range) {
                let videoIdRange = Range(match.range(at: 1), in: url)!
                videoId = String(url[videoIdRange])
                break
            }
        }
        
        guard let id = videoId else { return "" }
        
        // ULTIMATE SOLUTION: Use direct video streaming URL
        // This approach gets the actual video stream URL and plays it directly
        return "https://www.youtube.com/watch?v=\(id)"
    }
    
    /// Creates alternative embed URLs for fallback - NUCLEAR APPROACH with multiple proxies
    private func createAlternativeEmbedURLs(videoId: String) -> [String] {
        return [
            // NUCLEAR: Invidious proxies (bypass ALL YouTube restrictions)
            "https://inv.riverside.rocks/embed/\(videoId)?autoplay=1&controls=1&rel=0",
            "https://invidious.flokinet.to/embed/\(videoId)?autoplay=1&controls=1&rel=0",
            "https://invidious.lunar.icu/embed/\(videoId)?autoplay=1&controls=1&rel=0",
            "https://yt.artemislena.eu/embed/\(videoId)?autoplay=1&controls=1&rel=0",
            
            // YouTube alternatives (if proxies fail)
            "https://www.youtube-nocookie.com/embed/\(videoId)?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1",
            "https://www.youtube.com/embed/\(videoId)?autoplay=1&controls=1&rel=0",
            "https://www.youtube-nocookie.com/embed/\(videoId)?controls=1&rel=0",
            "https://www.youtube.com/embed/\(videoId)"
        ]
    }
    
    private func extractYouTubeThumbnail(from url: String) {
        // Extract video ID from YouTube URL
        let patterns = [
            "(?:youtube\\.com\\/watch\\?v=)([a-zA-Z0-9_-]{11})",
            "(?:youtu\\.be\\/)([a-zA-Z0-9_-]{11})"
        ]
        
        var videoId: String?
        for pattern in patterns {
            let regex = try? NSRegularExpression(pattern: pattern, options: [])
            let range = NSRange(url.startIndex..., in: url)
            if let match = regex?.firstMatch(in: url, options: [], range: range) {
                let videoIdRange = Range(match.range(at: 1), in: url)!
                videoId = String(url[videoIdRange])
                break
            }
        }
        
        guard let id = videoId else { return }
        
        // Download thumbnail from YouTube
        let thumbnailURL = "https://img.youtube.com/vi/\(id)/mqdefault.jpg"
        let vm = self.vm
        
        DispatchQueue.global(qos: .background).async {
            if let url = URL(string: thumbnailURL),
               let data = try? Data(contentsOf: url),
               let image = NSImage(data: data) {
                DispatchQueue.main.async {
                    vm.videoThumbnail = image
                }
            }
        }
    }
    
    // MARK: - Message Handling
    private func setupMessageListener() {
        // Listen for Swift actions from the view model
        vm.swiftActionSender
            .sink { action in
                switch action {
                case .receiveMessage(let message):
                    receivedMessage = message
                default:
                    break
                }
            }
            .store(in: &cancellables)
    }
}

// MARK: - Voice Split Layout (New Design)
struct VoiceSplitLayout: View {
    @ObservedObject var vm: NotchViewModel

    var body: some View {
        VStack(spacing: 0) {
            // Main content area with transcriptions (controls are now in top left)
            VoiceTranscriptionArea(vm: vm)
        }
        .frame(maxWidth: vm.notchOpenedSize.width - 32) // Constrain to dynamic island width minus padding
        .background(Color.clear)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

// MARK: - Voice Top Controls Component
struct VoiceTopControls: View {
    @ObservedObject var vm: NotchViewModel
    
    var body: some View {
        HStack(spacing: 16) {
            // Left side: Mute/Unmute toggle
            Button(action: {
                vm.toggleVoiceMute()
            }) {
                Image(systemName: vm.isMicrophoneMuted ? "mic.slash.fill" : "mic.fill")
                    .font(.system(size: 16))
                    .foregroundColor(vm.isMicrophoneMuted ? Color.red : DynamicIslandTheme.primaryGreen)
                    .frame(width: 24, height: 24)
            }
            .buttonStyle(PlainButtonStyle())
            
            // Cancel/Disconnect button
            Button(action: {
                vm.disconnectVoiceAssistant()
            }) {
                Image(systemName: "xmark")
                    .font(.system(size: 16))
                    .foregroundColor(.white)
                    .frame(width: 24, height: 24)
            }
            .buttonStyle(PlainButtonStyle())
            
            Spacer()
        }
        // .padding(.horizontal, 16)
        // .padding(.vertical, 8)
        // .background(Color(red: 0.1, green: 0.1, blue: 0.1)) // Darker background for controls
    }
}

// MARK: - Voice Transcription Area Component
struct VoiceTranscriptionArea: View {
    @ObservedObject var vm: NotchViewModel
    
    var body: some View {
        VStack(spacing: 0) {
            if vm.voiceMessages.isEmpty {
                // Show connection status when no messages - centered text
                Text(vm.voiceConnectionStatus == .connected ?
                    (vm.isMicrophoneMuted ? "Microphone muted - tap to unmute" : "Start speaking - your conversation will appear here") :
                    (vm.voiceConnectionStatus == .connecting ? "Connecting to voice assistant..." : "Voice assistant disconnected"))
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
                    .padding(.horizontal, 16)
                    .padding(.top, 8)
                    .padding(.bottom, 20)
            } else {
                // Show only the most recent message - positioned towards top
                if let lastMessage = vm.voiceMessages.last {
                    Text(lastMessage.content)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
                        .padding(.horizontal, 16)
                        .padding(.top, 8)
                        .padding(.bottom, 20)
                        .id(lastMessage.id)
                        // .onAppear {
                        //     // Console log transcription data display in SwiftUI
                        //     print("📝 NotchContentView: Displaying transcription data:")
                        //     print("📝 Sender: \(lastMessage.sender)")
                        //     print("📝 Content: \(lastMessage.content)")
                        //     print("📝 Is from agent: \(lastMessage.isFromAgent)")
                        //     print("📝 Message ID: \(lastMessage.id)")
                        //     print("📝 Total voice messages: \(vm.voiceMessages.count)")
                        // }
                }
            }
            
            // Show current status only when there are no voice messages
            if vm.voiceConnectionStatus == .connected && vm.voiceMessages.isEmpty {
                Text(vm.isMicrophoneMuted ? "🔇 Muted" : "🎤 Listening...")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.white.opacity(0.7))
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: .infinity)
                    .padding(.horizontal, 16)
                    .padding(.bottom, 12)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.clear)
        .onChange(of: vm.voiceMessages.count) { newCount in
            // Console log when voice messages count changes (new transcription data added)
            print("📝 NotchContentView: Voice messages count changed to: \(newCount)")
            if let lastMessage = vm.voiceMessages.last {
                print("📝 NotchContentView: Latest message - Sender: \(lastMessage.sender), Content: \(lastMessage.content.prefix(50))...")
            }
        }
    }
}


// MARK: - Transcription Message View Component
struct TranscriptionMessageView: View {
    let message: NotchViewModel.VoiceMessage
    
    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            // Sender label
            Text(message.sender)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(.white.opacity(0.8))
                .frame(width: 40, alignment: .leading)
            
            // Message content
            Text(message.content)
                .font(.system(size: 13))
                .foregroundColor(.white)
                .multilineTextAlignment(.leading)
                .lineLimit(nil)
                .fixedSize(horizontal: false, vertical: true)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.vertical, 6)
                .padding(.horizontal, 10)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(message.isFromAgent ? Color.blue.opacity(0.2) : Color.gray.opacity(0.2))
                )
        }
        .frame(maxWidth: .infinity, alignment: .leading)
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
                // Circle()
                //     .fill(isFromAgent ? DynamicIslandTheme.primaryGreen :
                //           isStatus ? Color.yellow :
                //           Color(red: 0.173, green: 0.176, blue: 0.180))
                //     .frame(width: 6, height: 6)
                Text(sender)
                    .font(.system(size: 9, weight: .medium))
                    // .foregroundColor(DynamicIslandTheme.textMuted)
                Spacer()
            }
            Text(text)
                .font(.system(size: 20, weight: .medium))
                // .foregroundColor(isStatus ? DynamicIslandTheme.textMuted : DynamicIslandTheme.textPrimary)
                .multilineTextAlignment(.leading)
        }
        // .padding(8)
        // .background(
        //     isFromAgent ? DynamicIslandTheme.primaryGreen.opacity(0.1) :
        //     isStatus ? Color.clear :
        //     Color.clear
        // )
        // .overlay(
        //     RoundedRectangle(cornerRadius: 8)
        //         .stroke(
        //             isFromAgent ? DynamicIslandTheme.primaryGreen.opacity(0.3) :
        //             isStatus ? Color.clear :
        //             DynamicIslandTheme.stroke.opacity(0.3),
        //             lineWidth: 0.5
        //         )
        // )
        // .clipShape(RoundedRectangle(cornerRadius: 8))
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
    @Binding var isTextFieldActive: Bool
    @ObservedObject var vm: NotchViewModel
    @State private var textEditorWidth: CGFloat = 0 // Will be calculated based on available space
    
    var body: some View {
        ZStack(alignment: .topLeading) {
            // Background for the textarea with active effect
            RoundedRectangle(cornerRadius: 8)
                .fill(isChatInputFocused ? DynamicIslandTheme.primaryGreen.opacity(0.02) : Color.clear) // Subtle background when active
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(
                            DynamicIslandTheme.primaryGreen, // White border for chat box area
                            lineWidth: 1.5 // Consistent border width
                        )
                )
                .frame(width: .infinity, height: 100) // Fixed height
//                 .shadow(
// color: isChatInputFocused ? DynamicIslandTheme.primaryGreen.opacity(0.3) : Color.clear,
//                     radius: isChatInputFocused ? 4 : 0,
//                     x: 0,
//                     y: 0
//                 )
                .animation(DynamicIslandTheme.expansionAnimation, value: textEditorWidth)
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
            
            // TextEditor (multi-line text input) with fixed height and scroll
            TextEditor(text: $chatInput)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(DynamicIslandTheme.white)
                .accentColor(DynamicIslandTheme.primaryGreen) // Green cursor for better visibility
                .padding(.horizontal, 16)
                .padding(.top, 12)
                .padding(.bottom, 16) // Extra bottom padding
                .padding(.trailing, 40) // Add space for arrow icon
                .background(Color.clear)
                .focused($isChatInputFocused)
                .frame(width: textEditorWidth, height: 100) // Fixed height - no dynamic resizing
                .clipShape(RoundedRectangle(cornerRadius: 16))
                .scrollContentBackground(.hidden) // Hide default TextEditor background
                .scrollDisabled(false) // Enable scrolling when content exceeds height
                .allowsHitTesting(true) // Ensure TextEditor can receive mouse events
                .onKeyPress(keys: [.return]) { event in
                    if event.modifiers == .shift {
                        // Shift+Enter: Insert new line manually
                        chatInput.append("\n")
                        return .handled
                    } else {
                        // Enter alone: Submit chat
                        if !vm.isSendingMessage && !chatInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                            vm.submitChat()
                        }
                        return .handled
                    }
                }
                .onTapGesture {
                    // Direct tap on TextEditor to ensure focus and cursor
                    DispatchQueue.main.async {
                        isChatInputFocused = true
                        isTextFieldActive = true
                        // Only enable chat mode if NOT in meeting mode (recording) and NOT in Teams/Meeting layout
                        if !vm.isRecording && !vm.isTeamsView {
                            vm.isChatMode = true
                        }
                        
                        // Force focus with a slight delay to ensure cursor appears
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                            isChatInputFocused = true
                        }
                    }
                }
            
            // Voice/Arrow icon inside the input box (bottom-right)
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    Button(action: {
                        if isChatInputFocused {
                            // Arrow mode - submit chat
                            if !vm.isSendingMessage && !chatInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                                vm.submitChat()
                            }
                        } else {
                            // Voice mode - activate voice assistant
                            // Ensure we don't accidentally focus the text area
                            DispatchQueue.main.async {
                                vm.connectVoiceAssistant()
                            }
                        }
                    }) {
                        if isChatInputFocused {
                            Image(systemName: "arrow.right")
                                .font(.system(size: 14))
                                .foregroundColor(.white)
                                .frame(width: 24, height: 24)
                                .clipShape(RoundedRectangle(cornerRadius: 4))
                        } else {
                            ZStack {
                                // Background with styling using brand primary green
                                RoundedRectangle(cornerRadius: 4)
                                    .fill(Color.white.opacity(0.01)) // background: rgba(255, 255, 255, 0.01)
                                    .frame(width: 24, height: 24)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 4) // border-radius: 4px
                                            .stroke(DynamicIslandTheme.primaryGreen.opacity(0.30), lineWidth: 0.6) // Use brand primary green
                                    )
                                    .overlay(
                                        // Inner glow effect using brand primary green
                                        RoundedRectangle(cornerRadius: 4)
                                            .stroke(
                                                LinearGradient(
                                                    colors: [
                                                        DynamicIslandTheme.primaryGreen.opacity(0.30),
                                                        DynamicIslandTheme.primaryGreen.opacity(0.15),
                                                        DynamicIslandTheme.primaryGreen.opacity(0.05),
                                                        Color.clear
                                                    ],
                                                    startPoint: .topLeading,
                                                    endPoint: .bottomTrailing
                                                ),
                                                lineWidth: 3
                                            )
                                            .blur(radius: 3)
                                            .blendMode(.overlay)
                                    )
                                
                                // Wave icon on top - using brand primary green
                                WaveIcon(color: DynamicIslandTheme.primaryGreen)
                                    .frame(width: 14, height: 14) // Icon size: 14px
                                    .allowsHitTesting(false) // Allow touches to pass through to button
                            }
                            .frame(width: 24, height: 24) // Container size: 24px
                        }
                    }
                    .buttonStyle(PlainButtonStyle())
                    .padding(.trailing, 8)
                    .padding(.bottom, 8)
                    .contentShape(RoundedRectangle(cornerRadius: 4)) // Ensure button area matches the visual shape
                    .allowsHitTesting(true) // Ensure button can receive taps
                    .onTapGesture {
                    }
                }
            }
                .onKeyPress(keys: [.return]) { event in
                    if event.modifiers == .shift {
                        // Shift+Enter: Insert new line manually
                        chatInput.append("\n")
                        return .handled
                    } else {
                        // Enter alone: Submit chat
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
                .onChange(of: vm.showVoiceInterface) { oldValue, newValue in
                    // Adjust width when voice interface state changes
                    withAnimation(DynamicIslandTheme.expansionAnimation) {
                        calculateTextEditorWidth()
                    }
                }
        }
        .contentShape(Rectangle()) // Ensure entire area is tappable
        .allowsHitTesting(true) // Explicitly allow hit testing
        .onTapGesture { location in
            
            // Check if tap is in the button area (bottom-right corner)
            let currentWidth = vm.isRecording ? 410 : 510
            let buttonArea = CGRect(
                x: currentWidth - 40, // 40px from right edge
                y: 100 - 40, // 40px from bottom edge
                width: 40,
                height: 40
            )
            
            if buttonArea.contains(location) {
                return
            }
            
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
                window.makeKeyAndOrderFront(nil)
                
                // Set focus with proper timing to ensure cursor appears
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                    isChatInputFocused = true
                    isTextFieldActive = true
                    // Only enable chat mode if NOT in meeting mode (recording) and NOT in Teams/Meeting layout
                    if !vm.isRecording && !vm.isTeamsView {
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
            }
        }
        .zIndex(2) // Ensure chat input is above the background overlay
    }
    

    
    private func handleTextChange(_ newValue: String) {
        // Fixed height implementation - no dynamic resizing
        // TextEditor will scroll when content exceeds the fixed height of 100px
        
        // Keep the height fixed at 100px - scrolling will handle overflow
        // No need to calculate or change textEditorHeight
    }
    
    private func handleFocusChange(_ newValue: Bool) {
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
        
        // When unfocused and no text, clear chat input (height stays fixed)
        if !newValue && chatInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            // Height remains fixed at 100px - no need to reset
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
        // In Teams/Meeting layout keep width strictly fixed regardless of focus/chat mode
        if vm.isTeamsView {
            textEditorWidth = 400
            return
        }
        // Dynamic width based on chat mode: 400px initially, 510px when focused (but 400px in meeting mode)
        let calculatedWidth: CGFloat = (vm.isChatMode && !vm.isRecording) ? 510 : 400
        
        textEditorWidth = calculatedWidth
    }
}



// MARK: - VEIcon (VE logo icon for navigation)
struct VEIcon: View {
    var color: Color = .white
    var body: some View {
        // Simple, clean V and E representation
        HStack(spacing: 1) {
            // V shape
            ZStack {
                Path { path in
                    path.move(to: CGPoint(x: 0, y: 0))
                    path.addLine(to: CGPoint(x: 3, y: 8))
                    path.addLine(to: CGPoint(x: 4, y: 8))
                    path.addLine(to: CGPoint(x: 7, y: 0))
                    path.addLine(to: CGPoint(x: 5.5, y: 0))
                    path.addLine(to: CGPoint(x: 3.5, y: 6))
                    path.addLine(to: CGPoint(x: 1.5, y: 0))
                    path.closeSubpath()
                }
                .fill(color)
            }
            .frame(width: 7, height: 8)
            
            // E shape
            ZStack {
                Path { path in
                    path.move(to: CGPoint(x: 0, y: 0))
                    path.addLine(to: CGPoint(x: 0, y: 8))
                    path.addLine(to: CGPoint(x: 6, y: 8))
                    path.addLine(to: CGPoint(x: 6, y: 6.5))
                    path.addLine(to: CGPoint(x: 1.5, y: 6.5))
                    path.addLine(to: CGPoint(x: 1.5, y: 4.5))
                    path.addLine(to: CGPoint(x: 5, y: 4.5))
                    path.addLine(to: CGPoint(x: 5, y: 3.5))
                    path.addLine(to: CGPoint(x: 1.5, y: 3.5))
                    path.addLine(to: CGPoint(x: 1.5, y: 1.5))
                    path.addLine(to: CGPoint(x: 6, y: 1.5))
                    path.addLine(to: CGPoint(x: 6, y: 0))
                    path.closeSubpath()
                }
                .fill(color)
            }
            .frame(width: 6, height: 8)
        }
        .frame(width: 14, height: 8)
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
    var color: Color = .white
    var body: some View {
        GeometryReader { geo in
            let w: CGFloat = 20.0
            let h: CGFloat = 21.0
            let sx = geo.size.width / w
            let sy = geo.size.height / h
            let s = min(sx, sy)
            Path { p in
                // Outer circle - camera body
                // M10 14.25C13.1066 14.25 15.625 11.7316 15.625 8.625C15.625 5.5184 13.1066 3 10 3C6.8934 3 4.375 5.5184 4.375 8.625C4.375 11.7316 6.8934 14.25 10 14.25Z
                p.addEllipse(in: CGRect(x: 4.375 * sx, y: 3 * sy, width: 11.25 * sx, height: 11.25 * sy))
                
                // Inner circle - lens
                // M10 11.125C11.3807 11.125 12.5 10.0057 12.5 8.625C12.5 7.24429 11.3807 6.125 10 6.125C8.61929 6.125 7.5 7.24429 7.5 8.625C7.5 10.0057 8.61929 11.125 10 11.125Z
                p.addEllipse(in: CGRect(x: 7.5 * sx, y: 6.125 * sy, width: 5 * sx, height: 5 * sy))
                
                // Vertical line from camera to tripod
                // M10 14.25V16.75
                p.move(to: CGPoint(x: 10 * sx, y: 14.25 * sy))
                p.addLine(to: CGPoint(x: 10 * sx, y: 16.75 * sy))
                
                // Horizontal tripod base
                // M2.5 16.75H17.5
                p.move(to: CGPoint(x: 2.5 * sx, y: 16.75 * sy))
                p.addLine(to: CGPoint(x: 17.5 * sx, y: 16.75 * sy))
            }
            .stroke(color, style: StrokeStyle(lineWidth: 1.25 * s, lineCap: .round, lineJoin: .round))
        }
        .aspectRatio(20/21, contentMode: .fit)
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
            // Camera setup error
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
                        .background(
                            Circle()
                                .fill(isHovered ? DynamicIslandTheme.primaryGreen.opacity(0.2) : Color.clear)
                        )
                        .frame(width: 90, height: 90)
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
                            .background(
                                Circle()
                                    .fill(isHovered ? DynamicIslandTheme.primaryGreen.opacity(0.2) : Color.clear)
                            )
                            .frame(width: 90, height: 90)
                        
                        // Camera preview
                        CameraPreviewView()
                            .frame(width: 90, height: 90)
                            .clipShape(Circle())
                    }
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
                    // Default state - frosted circular button with icon and label
                    ZStack {
                        Circle()
                            .fill(isHovered ? DynamicIslandTheme.primaryGreen.opacity(0.2) : Color.white.opacity(0.05)) // background: rgba(255, 255, 255, 0.05)
                            .frame(width: 100, height: 100)
                            .background(.ultraThinMaterial) // backdrop-filter: blur(15px)
                            .overlay(
                                Circle()
                                    .stroke(isHovered ? DynamicIslandTheme.primaryGreen.opacity(0.4) : Color.white.opacity(0.03), lineWidth: 0.6) // border: 0.6px solid rgba(255, 255, 255, 0.03)
                            )
                            .overlay(
                                // Inner shadow effect using gradient
                                Circle()
                                    .stroke(
                                        LinearGradient(
                                            colors: isHovered ? [
                                                DynamicIslandTheme.primaryGreen.opacity(0.30),
                                                DynamicIslandTheme.primaryGreen.opacity(0.15),
                                                DynamicIslandTheme.primaryGreen.opacity(0.05),
                                                Color.clear
                                            ] : [
                                                Color.white.opacity(0.30),
                                                Color.white.opacity(0.15),
                                                Color.white.opacity(0.05),
                                                Color.clear
                                            ],
                                            startPoint: .top,
                                            endPoint: .bottom
                                        ),
                                        lineWidth: 2
                                    )
                                    .blur(radius: 1)
                                    .blendMode(.overlay)
                            )
                            .clipShape(Circle())
                        
                        VStack(spacing: 10) {
                            WebcamIcon(color: .white)
                                .frame(width: 28, height: 28)
                            Text("MIRROR")
                                .font(.system(size: 11, weight: .medium))
                                .kerning(0.6)
                                .foregroundColor(.white)
                        }
                    }
                }
                
                // // Error overlay
                // if let error = vm.cameraError {
                //     VStack {
                //         Spacer()
                //         Text(error)
                //             .font(.system(size: 9, weight: .medium))
                //             .foregroundColor(.red)
                //             .multilineTextAlignment(.center)
                //             .padding(.horizontal, 8)
                //             .padding(.bottom, 4)
                //     }
                // }
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


// MARK: - Notification Overlay View
// struct NotificationOverlayView: View {
//     @ObservedObject var vm: NotchViewModel
//     @State private var progressValue: Double = 0.0
//     @State private var progressTimer: Timer?

//     var body: some View {
//         Group {
//             if vm.showNotificationOverlay {
//                 let _ = print("🔔 Notification overlay rendering - title: '\(vm.notificationTitle)', body: '\(vm.notificationBody)'")
                
//                 // Center the notification content in the available space
//                 VStack {
//                     Spacer()
                    
//                     // Notification content matching the Figma design exactly
//                     VStack(spacing: 0) {
//                     // Main content area
//                     HStack(spacing: 16) {
//                         // Left content
//                         VStack(alignment: .leading, spacing: 4) {
//                             // Main title - "Meeting detected"
//                             Text("Meeting detected")
//                                 .font(.system(size: 16, weight: .semibold))
//                                 .foregroundColor(.white)
//                                 .lineLimit(1)
                            
//                             // Subtitle - "Google meet • Starting in 2 min"
//                             Text("Google meet • Starting in 2 min")
//                                 .font(.system(size: 13))
//                                 .foregroundColor(.white.opacity(0.7))
//                                 .lineLimit(1)
//                         }
                        
//                         Spacer()
                        
//                         // Join button on the right
//                         Button(action: {
//                             print("🎯 Join button tapped")
//                             vm.hideNotification()
//                         }) {
//                             HStack(spacing: 8) {
//                                 Image(systemName: "waveform.path")
//                                     .font(.system(size: 14))
//                                     .foregroundColor(.white)
                                
//                                 Text("Join")
//                                     .font(.system(size: 14, weight: .medium))
//                                     .foregroundColor(.white)
//                             }
//                             .padding(.horizontal, 20)
//                             .padding(.vertical, 10)
//                             .background(
//                                 RoundedRectangle(cornerRadius: 20)
//                                     .stroke(.white.opacity(0.3), lineWidth: 1)
//                                     .background(
//                                         RoundedRectangle(cornerRadius: 20)
//                                             .fill(.white.opacity(0.1))
//                                     )
//                             )
//                         }
//                         .buttonStyle(PlainButtonStyle())
//                     }
//                     .padding(.horizontal, 20)
//                     .padding(.top, 16)
//                     .padding(.bottom, 12)
                    
//                     // Green progress bar at the bottom
//                     VStack(spacing: 0) {
//                         Spacer()
                        
//                         // Progress bar
//                         GeometryReader { geometry in
//                             ZStack(alignment: .leading) {
//                                 // Background
//                                 Rectangle()
//                                     .fill(Color.white.opacity(0.1))
//                                     .frame(height: 3)
                                
//                                 // Progress fill
//                                 Rectangle()
//                                     .fill(Color.green)
//                                     .frame(width: geometry.size.width * progressValue, height: 3)
//                             }
//                         }
//                         .frame(height: 3)
//                     }
//                     }
//                     .background(.ultraThinMaterial)
//                     .clipShape(RoundedRectangle(cornerRadius: vm.cornerRadius))
//                     .frame(width: 370, height: 74) // Matching the Figma dimensions
//                     .onHover { isHovering in
//                         if isHovering {
//                             vm.pauseNotificationTimer()
//                         } else {
//                             vm.resumeNotificationTimer()
//                         }
//                     }
                    
//                     Spacer()
//                 }
//                 .frame(maxWidth: .infinity, maxHeight: .infinity)
//                 .transition(.scale(scale: 1.0).combined(with: .opacity)) // Remove scaling to prevent shadow artifacts
//                 .onAppear {
//                     // Start progress bar animation that syncs with notification timer
//                     startProgressAnimation()
//                 }
//                 .onDisappear {
//                     // Clean up progress animation
//                     stopProgressAnimation()
//                 }
//             }
//         }
//         .animation(.spring(response: 0.3, dampingFraction: 0.8), value: vm.showNotificationOverlay)
//     }
    
//     // Progress animation methods
//     private func startProgressAnimation() {
//         progressValue = 0.0
//         progressTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { _ in
//             if !vm.isNotificationHovered {
//                 // Only advance progress when not hovering
//                 let increment = 0.1 / 10.0 // 10 seconds total
//                 progressValue = min(1.0, progressValue + increment)
//             }
//         }
//     }
    
//     private func stopProgressAnimation() {
//         progressTimer?.invalidate()
//         progressTimer = nil
//         progressValue = 0.0
//     }
// }


// // MARK: - Info Icon with Popup Menu
// struct InfoIconWithPopup: View {
//     @Binding var showInfoPopup: Bool
//     @Binding var infoPopupPosition: CGPoint
//     @State private var isHovered: Bool = false
    
//     var body: some View {
//         // Info icon button
//         Button(action: {
//             print("🎯 Information icon clicked")
//             // Toggle popup on click as well
//             withAnimation(.easeInOut(duration: 0.2)) {
//                 showInfoPopup.toggle()
//             }
//         }) {
//             InfoIcon(color: .white)
//                 .frame(width: 16, height: 16)
//                 .padding(8) // Increased padding for larger clickable area
//                 .overlay(
//                     RoundedRectangle(cornerRadius: 6) // Slightly larger corner radius
//                         .stroke(Color.white.opacity(0.15), lineWidth: 0.5)
//                 )
//         }
//         .buttonStyle(PlainButtonStyle())
//         .help("Information")
//         .onHover { hovering in
//             isHovered = hovering
//             withAnimation(.easeInOut(duration: 0.2)) {
//                 showInfoPopup = hovering
//             }
//         }
//     }
// }

// // MARK: - Info Popup Menu Component
// struct InfoPopupMenu: View {
//     var body: some View {
//         VStack(alignment: .leading, spacing: 0) {
//             // Live Intelligence
//             InfoMenuItem(
//                 title: "Live Intelligence",
//                 shortcutKeys: ["⌘", "\\"]
//             )
            
//             // Notch
//             InfoMenuItem(
//                 title: "Notch",
//                 shortcutKeys: ["⌘", "N"]
//             )
            
//             // Ask Ve
//             InfoMenuItem(
//                 title: "Ask Ve",
//                 shortcutKeys: ["⌘", "⏎"]
//             )
            
//             // Ve App
//             InfoMenuItem(
//                 title: "Ve App",
//                 shortcutKeys: ["⌘", "."]
//             )
//         }
//         .padding(.vertical, 8)
//         .background(
//             RoundedRectangle(cornerRadius: 8)
//                 .fill(Color(red: 0.15, green: 0.15, blue: 0.15)) // Dark grey background
//                 .shadow(color: .black.opacity(0.3), radius: 8, x: 0, y: 4)
//         )
//         .overlay(
//             RoundedRectangle(cornerRadius: 8)
//                 .stroke(Color.white.opacity(0.1), lineWidth: 0.5)
//         )
//         .frame(width: 200) // Fixed width to match design
//     }
// }

// MARK: - Info Menu Item Component
// struct InfoMenuItem: View {
//     let title: String
//     let shortcutKeys: [String]
    
//     var body: some View {
//         HStack {
//             // Menu item title
//             Text(title)
//                 .font(.system(size: 14, weight: .medium))
//                 .foregroundColor(.white)
            
//             Spacer()
            
//             // Keyboard shortcut
//             HStack(spacing: 4) {
//                 ForEach(shortcutKeys, id: \.self) { key in
//                     ShortcutKeyView(keyText: key)
//                 }
//             }
//         }
//         .padding(.horizontal, 16)
//         .padding(.vertical, 8)
//         .contentShape(Rectangle())
//         .onTapGesture {
//             print("🎯 Menu item tapped: \(title)")
//             // Handle menu item actions here
//         }
//     }
// }

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

// MARK: - Spotify Media Controller
struct SpotifyMediaController: View {
    @ObservedObject var vm: NotchViewModel
    @State private var isPlaying: Bool = false
    @State private var songTitle: String = "Unknown Track"
    @State private var artistName: String = "Unknown Artist"
    @State private var albumArtwork: NSImage? = nil
    @State private var isHovered: Bool = false
    @State private var lastButtonPressed: MediaCommandType? = nil
    @State private var buttonPressTime: Date = Date()
    
    var body: some View {
        Group {
            if vm.hasActiveMusic {
                HStack(spacing: 12) {
            
            Group {
                if let artwork = albumArtwork {
                    Image(nsImage: artwork)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 50, height: 80)
                        .clipped()
                        .cornerRadius(8)
                        .background(Color.black.opacity(0.3))
                } else {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(
                            LinearGradient(
                                gradient: Gradient(colors: [
                                    Color(red: 0.475, green: 0.925, blue: 0.788).opacity(0.3),
                                    Color.black.opacity(0.2)
                                ]),
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 60, height: 80)
                        .overlay(
                            VStack(spacing: 4) {
                                Image(systemName: "music.note")
                                    .foregroundColor(.white.opacity(0.8))
                                    .font(.system(size: 24, weight: .medium))
                                Text("♫")
                                    .foregroundColor(.white.opacity(0.6))
                                    .font(.system(size: 12))
                            }
                        )
                }
            }
            
            // Song info and controls (right side)
            VStack(alignment: .leading, spacing: 8) {
                // Song title and artist
                VStack(alignment: .leading, spacing: 2) {
                    Text(songTitle)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.white)
                        .lineLimit(1)
                        .truncationMode(.tail)
                    
                    Text(artistName)
                        .font(.system(size: 12, weight: .regular))
                        .foregroundColor(.white.opacity(0.7))
                        .lineLimit(1)
                        .truncationMode(.tail)
                }
                
                // Media controls
                HStack(spacing: 12) {
                    // Previous button
                    Button(action: {
                        print("🎵 Previous track")
                        sendMediaCommand(.previousTrack)
                    }) {
                        Image(systemName: "backward.fill")
                            .foregroundColor(.white)
                            .font(.system(size: 14))
                    }
                    .buttonStyle(PlainButtonStyle())
                    .scaleEffect(lastButtonPressed == .previousTrack ? 0.9 : 1.0)
                    .animation(.easeInOut(duration: 0.1), value: lastButtonPressed)
                    
                    // Play/Pause button (larger)
                    Button(action: {
                        print("🎵 Play/Pause toggle")
                        isPlaying.toggle()
                        sendMediaCommand(isPlaying ? .play : .pause)
                    }) {
                        Image(systemName: isPlaying ? "pause.fill" : "play.fill")
                            .foregroundColor(.white)
                            .font(.system(size: 16, weight: .medium))
                    }
                    .buttonStyle(PlainButtonStyle())
                    .scaleEffect((lastButtonPressed == .play || lastButtonPressed == .pause) ? 0.9 : 1.0)
                    .animation(.easeInOut(duration: 0.1), value: lastButtonPressed)
                    
                    // Next button
                    Button(action: {
                        print("🎵 Next track")
                        sendMediaCommand(.nextTrack)
                    }) {
                        Image(systemName: "forward.fill")
                            .foregroundColor(.white)
                            .font(.system(size: 14))
                    }
                    .buttonStyle(PlainButtonStyle())
                    .scaleEffect(lastButtonPressed == .nextTrack ? 0.9 : 1.0)
                    .animation(.easeInOut(duration: 0.1), value: lastButtonPressed)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(12)
        .frame(width: 160, height: 100)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.black.opacity(0.8))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color(red: 0.475, green: 0.925, blue: 0.788).opacity(0.6), lineWidth: 1)
                )
        )
        .scaleEffect(isHovered ? 1.02 : 1.0)
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isHovered)
       
        .onAppear {
            updateCurrentTrackInfo()
        }
            }
        }
    }
    
    private func sendMediaCommand(_ commandType: MediaCommandType) {
        // Track the button press for visual feedback
        lastButtonPressed = commandType
        buttonPressTime = Date()
        
        switch commandType {
        case .play:
            executeAppleScript("tell application \"Spotify\" to play")
        case .pause:
            executeAppleScript("tell application \"Spotify\" to pause")
        case .nextTrack:
            executeAppleScript("tell application \"Spotify\" to next track")
        case .previousTrack:
            executeAppleScript("tell application \"Spotify\" to previous track")
        }
        
        // Update track info after command, with faster refresh for track changes
        let updateDelay: Double = (commandType == .nextTrack || commandType == .previousTrack) ? 0.3 : 0.5
        
        DispatchQueue.main.asyncAfter(deadline: .now() + updateDelay) {
            self.updateCurrentTrackInfo()
        }
        
        // For track changes, do multiple quick updates to catch the change faster
        if commandType == .nextTrack || commandType == .previousTrack {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
                self.updateCurrentTrackInfo()
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                self.updateCurrentTrackInfo()
            }
        }
        
        // Clear the button press indicator after a short delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.lastButtonPressed = nil
        }
    }
    
    private func updateCurrentTrackInfo() {
        // First try to get track info from Spotify directly using AppleScript
        getCurrentTrackFromAppleScript()
        
        // Fallback to system media player info if Spotify AppleScript fails
        let nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo
        
        if songTitle == "Unknown Track" && artistName == "Unknown Artist" {
            if let info = nowPlayingInfo {
                songTitle = info[MPMediaItemPropertyTitle] as? String ?? "Unknown Track"
                artistName = info[MPMediaItemPropertyArtist] as? String ?? "Unknown Artist"
                
                // Get album artwork from system media player
                if let artwork = info[MPMediaItemPropertyArtwork] as? MPMediaItemArtwork {
                    albumArtwork = artwork.image(at: CGSize(width: 40, height: 60))
                }
                
                // Get playback state
                let playbackRate = info[MPNowPlayingInfoPropertyPlaybackRate] as? Double ?? 0.0
                isPlaying = playbackRate > 0.0
            }
        }
        
        // hasActiveMusic is now managed at the higher level, no need to set it here
    }
    
    private func getCurrentTrackFromAppleScript() {
        let spotifyScript = """
            tell application "Spotify"
                if it is running then
                    try
                        set trackName to name of current track
                        set artistName to artist of current track
                        set albumName to album of current track
                        set artworkURL to artwork url of current track
                        set playerState to player state
                        return trackName & "|" & artistName & "|" & albumName & "|" & artworkURL & "|" & (playerState as string)
                    on error
                        return "Spotify|Running|Unknown|missing value|playing"
                    end try
                end if
            end tell
        """
        
        if let appleScript = NSAppleScript(source: spotifyScript) {
            var error: NSDictionary?
            let result = appleScript.executeAndReturnError(&error)
            
            if error == nil, let output = result.stringValue {
                let components = output.components(separatedBy: "|")
                if components.count >= 5 {
                    songTitle = components[0]
                    artistName = components[1]
                    // albumName = components[2] // We can use this later if needed
                    let artworkURLString = components[3]
                    isPlaying = components[4].contains("playing")
                    
                    // Track info retrieved successfully
                    
                    // Download album artwork from URL
                    if !artworkURLString.isEmpty && artworkURLString != "missing value" {
                        downloadAlbumArtwork(from: artworkURLString)
                    }
                } else {
                    // No valid track info found
                    songTitle = "Unknown Track"
                    artistName = "Unknown Artist"
                }
            } else {
                print("🎵 AppleScript error: \(error?.description ?? "Unknown error")")
                // Try alternative method using System Events
                getTrackInfoFromSystemEvents()
            }
        }
    }
    
    private func downloadAlbumArtwork(from urlString: String) {
        guard let url = URL(string: urlString) else { return }
        
        DispatchQueue.global(qos: .background).async {
            do {
                let data = try Data(contentsOf: url)
                if let image = NSImage(data: data) {
                    DispatchQueue.main.async {
                        self.albumArtwork = image
                    }
                }
            } catch {
                print("🎵 Failed to download artwork: \(error.localizedDescription)")
                // Try to get artwork from macOS Now Playing if download fails
                DispatchQueue.main.async {
                    self.getArtworkFromNowPlaying()
                }
            }
        }
    }
    
    private func getArtworkFromNowPlaying() {
        let nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo
        if let info = nowPlayingInfo,
           let artwork = info[MPMediaItemPropertyArtwork] as? MPMediaItemArtwork {
            albumArtwork = artwork.image(at: CGSize(width: 60, height: 60))
        }
    }
    
    private func getTrackInfoFromSystemEvents() {
        // Alternative method using System Events to get current track
        let systemEventsScript = """
            tell application "System Events"
                tell process "Spotify"
                    if exists then
                        try
                            set trackInfo to (name of window 1)
                            return trackInfo
                        end try
                    end if
                end tell
            end tell
        """
        
        if let appleScript = NSAppleScript(source: systemEventsScript) {
            var error: NSDictionary?
            let result = appleScript.executeAndReturnError(&error)
            
            if error == nil, let windowTitle = result.stringValue {
                // Spotify window title format is usually "Artist - Song Title"
                let components = windowTitle.components(separatedBy: " - ")
                if components.count >= 2 {
                    artistName = components[0]
                    songTitle = components[1]
                } else if !windowTitle.isEmpty && windowTitle != "Spotify" {
                    songTitle = windowTitle
                }
            }
        }
    }
    
    private func executeAppleScript(_ script: String) {
        if let appleScript = NSAppleScript(source: script) {
            var error: NSDictionary?
            appleScript.executeAndReturnError(&error)
            if let error = error {
                print("🎵 AppleScript error: \(error)")
            }
        }
    }
    
    enum MediaCommandType {
        case play, pause, nextTrack, previousTrack
    }
}

// MARK: - YouTube Media Controller
struct YouTubeMediaController: View {
    @ObservedObject var vm: NotchViewModel
    @State private var isHovered: Bool = false
    
    var body: some View {
        Group {
            if vm.hasActiveVideo && vm.showVideoPlayer && !vm.videoEmbedURL.isEmpty {
                // Embedded YouTube video player
                YouTubeVideoPlayer(embedURL: vm.videoEmbedURL)
                    .frame(width: 300, height: 100) // Wider to show actual video
                    .cornerRadius(16)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.red.opacity(0.6), lineWidth: 1)
                    )
                    .scaleEffect(isHovered ? 1.02 : 1.0)
                    .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isHovered)
                    
                    .onTapGesture {
                        // User interaction to enable sound if needed
                        print("📺 User tapped video player - attempting to enable sound")
                    }
            }
        }
    }
}

// MARK: - YouTube Video Player - ULTIMATE SOLUTION
struct YouTubeVideoPlayer: NSViewRepresentable {
    let embedURL: String
    
    func makeNSView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        
        // ULTIMATE SOLUTION: Maximum permissiveness for direct video streaming
        configuration.allowsAirPlayForMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        configuration.preferences.javaScriptCanOpenWindowsAutomatically = false
        configuration.preferences.isElementFullscreenEnabled = true
        
        // Use a clean user agent that works with YouTube
        configuration.applicationNameForUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
        
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        
        // Settings for direct video playback
        webView.allowsMagnification = false
        webView.allowsBackForwardNavigationGestures = false
        webView.allowsLinkPreview = false
        webView.customUserAgent = configuration.applicationNameForUserAgent
        
        // Load the YouTube video directly with custom HTML that bypasses restrictions
        let videoId = extractVideoId(from: embedURL)
        let customHTML = createDirectVideoHTML(videoId: videoId)
        
        print("📺 ULTIMATE: Loading YouTube video directly with custom HTML for video: \(videoId)")
        webView.loadHTMLString(customHTML, baseURL: URL(string: "https://www.youtube.com"))
        
        return webView
    }
    
    func updateNSView(_ nsView: WKWebView, context: Context) {
        // Update if video ID changes
        let newVideoId = extractVideoId(from: embedURL)
        if newVideoId != extractVideoId(from: nsView.url?.absoluteString ?? "") {
            let customHTML = createDirectVideoHTML(videoId: newVideoId)
            print("📺 ULTIMATE: Updating to new video: \(newVideoId)")
            nsView.loadHTMLString(customHTML, baseURL: URL(string: "https://www.youtube.com"))
        }
    }
    
    // MARK: - Helper Functions
    
    private func extractVideoId(from url: String) -> String {
        let patterns = [
            "(?:youtube\\.com\\/watch\\?v=)([a-zA-Z0-9_-]{11})",
            "(?:youtu\\.be\\/)([a-zA-Z0-9_-]{11})",
            "(?:youtube\\.com\\/embed\\/)([a-zA-Z0-9_-]{11})",
            "(?:youtube\\.com\\/v\\/)([a-zA-Z0-9_-]{11})"
        ]
        
        for pattern in patterns {
            let regex = try? NSRegularExpression(pattern: pattern, options: [])
            let range = NSRange(url.startIndex..., in: url)
            if let match = regex?.firstMatch(in: url, options: [], range: range) {
                let videoIdRange = Range(match.range(at: 1), in: url)!
                return String(url[videoIdRange])
            }
        }
        return ""
    }
    
    private func createDirectVideoHTML(videoId: String) -> String {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background: #000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .video-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    background: #000;
                }
                iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                    border-radius: 12px;
                }
                .loading {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 16px;
                }
                .error {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #ff6b6b;
                    text-align: center;
                    font-size: 14px;
                }
                .retry-btn {
                    background: #ff6b6b;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-top: 10px;
                }
            </style>
        </head>
        <body>
            <div class="video-container">
                <div class="loading" id="loading">Loading video...</div>
                <iframe id="player" src="" style="display: none;"></iframe>
                <div class="error" id="error" style="display: none;">
                    <div>Video failed to load</div>
                    <button class="retry-btn" onclick="retryVideo()">Retry</button>
                </div>
            </div>
            
            <script>
                let currentVideoId = '\(videoId)';
                let fallbackIndex = 0;
                let savedVideoState = null;
                let videoStateInterval = null;
                let videoStartTime = Date.now();
                let hasRestoredPosition = false;
                let restoreAttempts = 0;
                let lastKnownVideoTime = 0;
                let videoTimeTrackingInterval = null;
                
                const fallbackUrls = [
                    'https://www.youtube.com/embed/' + currentVideoId + '?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1',
                    'https://www.youtube-nocookie.com/embed/' + currentVideoId + '?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1',
                    'https://inv.riverside.rocks/embed/' + currentVideoId + '?autoplay=1&controls=1&rel=0',
                    'https://invidious.flokinet.to/embed/' + currentVideoId + '?autoplay=1&controls=1&rel=0',
                    'https://invidious.lunar.icu/embed/' + currentVideoId + '?autoplay=1&controls=1&rel=0'
                ];
                
                // Check for saved video state in localStorage
                function getSavedVideoState() {
                    try {
                        const saved = localStorage.getItem('notchVideoState_' + currentVideoId);
                        if (saved) {
                            savedVideoState = JSON.parse(saved);
                            return savedVideoState;
                        }
                    } catch (e) {
                    }
                    return null;
                }
                
                // Save current video state with actual position
                function saveCurrentVideoState() {
                    try {
                        const player = document.getElementById('player');
                        if (player) {
                            const playerState = {
                                videoId: currentVideoId,
                                timestamp: Date.now(),
                                currentTime: 0,
                                duration: 0,
                                isPlaying: false
                            };
                            
                            // Method 1: Try to access iframe content directly (most reliable)
                            try {
                                const iframeDoc = player.contentDocument || player.contentWindow.document;
                                if (iframeDoc) {
                                    // Look for video element in iframe
                                    const videoElement = iframeDoc.querySelector('video');
                                    if (videoElement && videoElement.readyState >= 2) {
                                        playerState.currentTime = videoElement.currentTime;
                                        playerState.duration = videoElement.duration;
                                        playerState.isPlaying = !videoElement.paused;
                                    } else {
                                        // Try to get time from YouTube player object
                                        const ytPlayer = iframeDoc.querySelector('#movie_player');
                                        if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
                                            playerState.currentTime = ytPlayer.getCurrentTime();
                                            playerState.duration = ytPlayer.getDuration();
                                            playerState.isPlaying = ytPlayer.getPlayerState() === 1;
                                        }
                                    }
                                }
                            } catch (e) {
                            }
                            
                            // Method 2: Try YouTube API if iframe access failed
                            if (playerState.currentTime === 0) {
                                try {
                                    if (window.YT && window.YT.Player) {
                                        const ytPlayer = new YT.Player('player');
                                        if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
                                            playerState.currentTime = ytPlayer.getCurrentTime();
                                            playerState.duration = ytPlayer.getDuration();
                                            playerState.isPlaying = ytPlayer.getPlayerState() === 1;
                                        }
                                    }
                                } catch (e) {
                                }
                            }
                            
                            // Method 3: Use tracked time from our time tracking system
                            if (playerState.currentTime === 0) {
                                const timeSinceStart = (Date.now() - videoStartTime) / 1000;
                                if (timeSinceStart > 5) { // Only estimate if video has been playing for more than 5 seconds
                                    playerState.currentTime = Math.min(timeSinceStart, 600); // Cap at 10 minutes
                                    playerState.isPlaying = true; // Assume playing if we're estimating
                                }
                            }
                            
                            // Method 4: Use last known video time from monitoring
                            if (playerState.currentTime === 0 && lastKnownVideoTime > 0) {
                                playerState.currentTime = lastKnownVideoTime;
                                playerState.isPlaying = true;
                            }
                            
                            // Only save if we have a meaningful current time
                            if (playerState.currentTime > 0) {
                                localStorage.setItem('notchVideoState_' + currentVideoId, JSON.stringify(playerState));
                            } else {
                            }
                        }
                    } catch (e) {
                    }
                }
                
                // Restore video to saved position using multiple methods
                function restoreVideoPosition() {
                    // Only prevent if we've already successfully restored
                    if (hasRestoredPosition) {
                        return false;
                    }
                    
                    const saved = getSavedVideoState();
                    if (saved && saved.currentTime > 0) {
                        restoreAttempts++;
                        
                        let restorationSuccessful = false;
                        
                        // Method 1: Try direct iframe access
                        try {
                            const player = document.getElementById('player');
                            if (player && player.contentWindow) {
                                const iframeDoc = player.contentDocument || player.contentWindow.document;
                                if (iframeDoc) {
                                    const videoElement = iframeDoc.querySelector('video');
                                    if (videoElement && videoElement.readyState >= 2) {
                                        videoElement.currentTime = saved.currentTime;
                                        if (saved.isPlaying) {
                                            videoElement.play();
                                        }
                                        restorationSuccessful = true;
                                    }
                                    
                                    // Try YouTube player object if video element didn't work
                                    if (!restorationSuccessful) {
                                        const ytPlayer = iframeDoc.querySelector('#movie_player');
                                        if (ytPlayer && ytPlayer.seekTo) {
                                            ytPlayer.seekTo(saved.currentTime, true);
                                            if (saved.isPlaying) {
                                                ytPlayer.playVideo();
                                            }
                                            restorationSuccessful = true;
                                        }
                                    }
                                }
                            }
                        } catch (e) {
                        }
                        
                        // Method 2: Try YouTube Player API
                        if (!restorationSuccessful) {
                            try {
                                if (window.YT && window.YT.Player) {
                                    const ytPlayer = new YT.Player('player');
                                    if (ytPlayer && ytPlayer.seekTo) {
                                        ytPlayer.seekTo(saved.currentTime, true);
                                        if (saved.isPlaying) {
                                            ytPlayer.playVideo();
                                        }
                                        restorationSuccessful = true;
                                    }
                                }
                            } catch (e) {
                            }
                        }
                        
                        // If restoration was successful, mark as completed
                        if (restorationSuccessful) {
                            hasRestoredPosition = true;
                            // Clear the saved state to prevent repeated restorations
                            localStorage.removeItem('notchVideoState_' + currentVideoId);
                            return true;
                        } else {
                            // Method 3: Return time for URL parameter (fallback)
                            const currentTimeSeconds = Math.floor(saved.currentTime);
                            if (currentTimeSeconds > 0 && restoreAttempts >= 2) {
                                hasRestoredPosition = true;
                                localStorage.removeItem('notchVideoState_' + currentVideoId);
                                return true; // Return true to indicate we have a fallback plan
                            }
                        }
                    } else {
                    }
                    return false;
                }
                
                function loadVideo() {
                    const player = document.getElementById('player');
                    const loading = document.getElementById('loading');
                    const error = document.getElementById('error');
                    
                    if (fallbackIndex >= fallbackUrls.length) {
                        loading.style.display = 'none';
                        error.style.display = 'block';
                        return;
                    }
                    
                    let videoUrl = fallbackUrls[fallbackIndex];
                    let savedState = null;
                    
                    // Check for saved state first to determine if we need to restore
                    if (fallbackIndex === 0) {
                        savedState = getSavedVideoState();
                        if (savedState && savedState.currentTime > 0) {
                            // Keep loading overlay visible during restoration to hide the glitch
                            loading.style.display = 'flex';
                            loading.innerHTML = '<div class="spinner"></div><p>Resuming video...</p>';
                        }
                    }
                    
                    // If we have saved state, add start time parameter to URL
                    if (savedState && savedState.currentTime > 0) {
                        const savedPosition = Math.floor(savedState.currentTime);
                        // Add start time parameter to YouTube URLs
                        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtube-nocookie.com')) {
                            videoUrl += '&start=' + savedPosition;
                        } else if (videoUrl.includes('inv.')) {
                            videoUrl += '&t=' + savedPosition;
                        }
                    }
                    
                    player.src = videoUrl;
                    player.style.display = 'block';
                    
                    // Check if video loads successfully
                    player.onload = function() {
                        
                        // If we have saved state, hide the video initially and restore position
                        if (savedState && savedState.currentTime > 0) {
                            player.style.display = 'none';
                            
                            // Try to restore position after video loads
                            setTimeout(() => {
                                if (!hasRestoredPosition) {
                                    const restored = restoreVideoPosition();
                                    if (restored) {
                                        // Show the video after successful restoration
                                        player.style.display = 'block';
                                        loading.style.display = 'none';
                                    }
                                }
                            }, 1000); // Faster restoration attempt
                            
                            // Second attempt after 2 seconds
                            setTimeout(() => {
                                if (!hasRestoredPosition) {
                                    const restored = restoreVideoPosition();
                                    if (restored) {
                                        player.style.display = 'block';
                                        loading.style.display = 'none';
                                    }
                                }
                            }, 2000);
                            
                            // Final attempt after 3 seconds - show video regardless
                            setTimeout(() => {
                                if (!hasRestoredPosition) {
                                    restoreVideoPosition();
                                }
                                // Always show video after 3 seconds to prevent infinite loading
                                player.style.display = 'block';
                                loading.style.display = 'none';
                            }, 3000);
                        } else {
                            // No saved state, show video immediately
                            loading.style.display = 'none';
                        }
                        
                        // Start monitoring video state
                        startVideoStateMonitoring();
                    };
                    
                    player.onerror = function() {
                        fallbackIndex++;
                        setTimeout(loadVideo, 1000);
                    };
                }
                
                function startVideoStateMonitoring() {
                    // Start time tracking system
                    startVideoTimeTracking();
                    
                    // Monitor video state every 2 seconds for better performance
                    videoStateInterval = setInterval(saveCurrentVideoState, 2000);
                    
                    // Save state when page is about to unload
                    window.addEventListener('beforeunload', saveCurrentVideoState);
                    
                    // Save state when notch closes (if we can detect it)
                    document.addEventListener('visibilitychange', function() {
                        if (document.hidden) {
                            saveCurrentVideoState();
                        }
                    });
                    
                    // Listen for message events from iframe
                    window.addEventListener('message', function(event) {
                        if (event.data && event.data.type === 'VIDEO_TIME_UPDATE') {
                            lastKnownVideoTime = event.data.currentTime || 0;
                            const playerState = {
                                videoId: currentVideoId,
                                timestamp: Date.now(),
                                currentTime: event.data.currentTime || 0,
                                duration: event.data.duration || 0,
                                isPlaying: event.data.isPlaying || false
                            };
                            localStorage.setItem('notchVideoState_' + currentVideoId, JSON.stringify(playerState));
                        }
                    });
                    
                    // Try to inject monitoring script into iframe
                    try {
                        const player = document.getElementById('player');
                        if (player && player.contentWindow) {
                            player.addEventListener('load', function() {
                                setTimeout(() => {
                                    try {
                                        // Inject script to monitor video state and send updates
                                        const monitoringScript = `
                                            setInterval(() => {
                                                try {
                                                    const video = document.querySelector('video');
                                                    if (video && video.readyState >= 2) {
                                                        window.parent.postMessage({
                                                            type: 'VIDEO_TIME_UPDATE',
                                                            currentTime: video.currentTime,
                                                            duration: video.duration,
                                                            isPlaying: !video.paused
                                                        }, '*');
                                                    }
                                                } catch (e) {
                                                }
                                            }, 1000);
                                        `;
                                        
                                        player.contentWindow.eval(monitoringScript);
                                    } catch (e) {
                                    }
                                }, 3000);
                            });
                        }
                    } catch (e) {
                    }
                }
                
                function startVideoTimeTracking() {
                    // Track video time based on elapsed time since start
                    videoTimeTrackingInterval = setInterval(() => {
                        const timeSinceStart = (Date.now() - videoStartTime) / 1000;
                        lastKnownVideoTime = timeSinceStart;
                    }, 1000);
                }
                
                function retryVideo() {
                    fallbackIndex = 0;
                    savedVideoState = null; // Clear saved state on retry
                    hasRestoredPosition = false; // Reset restoration flag
                    restoreAttempts = 0; // Reset attempt counter
                    document.getElementById('error').style.display = 'none';
                    document.getElementById('loading').style.display = 'block';
                    document.getElementById('player').style.display = 'none';
                    loadVideo();
                }
                
                // Start loading
                loadVideo();
            </script>
        </body>
        </html>
        """
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator()
    }
    
    class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate {
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            print("📺 YouTube video page loaded successfully")
            
            // Wait a moment for the video to load, then configure it for production
            DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
                self.configureVideoPlayer(webView: webView)
            }
            
            // Inject CSS to hide unnecessary YouTube UI elements
            let css = """
                var style = document.createElement('style');
                style.innerHTML = `
                    iframe { 
                        border-radius: 12px !important;
                    }
                    .ytp-watermark { 
                        display: none !important; 
                    }
                    .ytp-chrome-top { 
                        display: none !important; 
                    }
                    .ytp-show-cards-title { 
                        display: none !important; 
                    }
                `;
                document.head.appendChild(style);
            """
            
            webView.evaluateJavaScript(css) { result, error in
                    if let error = error {
                    print("📺 Error injecting CSS: \(error)")
                    } else {
                    print("📺 CSS injected successfully")
                }
            }
        }
        
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            print("📺 YouTube video failed to load: \(error.localizedDescription)")
            
            // Try to load a fallback or show error message
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                self.handleVideoLoadError(webView: webView, error: error)
            }
        }
        
        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            print("📺 YouTube video provisional navigation failed: \(error.localizedDescription)")
        }
        
        private func configureVideoPlayer(webView: WKWebView) {
            // NUCLEAR SOLUTION: Universal YouTube video compatibility
            let configureScript = """
                (function() {
                    
                    // Check for ANY video problems (Error 153, Video unavailable, etc.)
                    setTimeout(() => {
                        var errorText = document.body.innerText.toLowerCase();
                        var hasError = errorText.includes('error 153') || 
                                      errorText.includes('video player configuration error') ||
                                      errorText.includes('video unavailable') ||
                                      errorText.includes('this video is not available') ||
                                      errorText.includes('private video') ||
                                      errorText.includes('video unavailable');
                        
                        if (hasError) {
                            
                            var iframe = document.querySelector('iframe');
                            if (iframe && (iframe.src.includes('youtube') || iframe.src.includes('inv.'))) {
                                var videoId = iframe.src.match(/embed\\/([a-zA-Z0-9_-]{11})/);
                                if (videoId && videoId[1]) {
                                    // NUCLEAR: Try multiple invidious proxies that bypass ALL restrictions
                                    var nuclearUrls = [
                                        'https://inv.riverside.rocks/embed/' + videoId[1] + '?autoplay=1&controls=1&rel=0',
                                        'https://invidious.flokinet.to/embed/' + videoId[1] + '?autoplay=1&controls=1&rel=0',
                                        'https://invidious.lunar.icu/embed/' + videoId[1] + '?autoplay=1&controls=1&rel=0',
                                        'https://yt.artemislena.eu/embed/' + videoId[1] + '?autoplay=1&controls=1&rel=0',
                                        'https://invidious.privacydev.net/embed/' + videoId[1] + '?autoplay=1&controls=1&rel=0',
                                        'https://yt.oelrichsgarcia.de/embed/' + videoId[1] + '?autoplay=1&controls=1&rel=0',
                                        'https://invidious.namazso.eu/embed/' + videoId[1] + '?autoplay=1&controls=1&rel=0',
                                        'https://invidious.nerdvpn.de/embed/' + videoId[1] + '?autoplay=1&controls=1&rel=0'
                                    ];
                                    
                                    // Try each nuclear URL
                                    var currentIndex = 0;
                                    function tryNuclearFallback() {
                                        if (currentIndex < nuclearUrls.length) {
                                            iframe.src = nuclearUrls[currentIndex];
                                            currentIndex++;
                                            
                                            // Check if this one worked after 4 seconds
                                            setTimeout(() => {
                                                var newErrorText = document.body.innerText.toLowerCase();
                                                var stillHasError = newErrorText.includes('error 153') || 
                                                                   newErrorText.includes('video player configuration error') ||
                                                                   newErrorText.includes('video unavailable') ||
                                                                   newErrorText.includes('this video is not available') ||
                                                                   newErrorText.includes('private video');
                                                
                                                if (stillHasError) {
                                                    tryNuclearFallback();
                                                } else {
                                                }
                                            }, 4000);
                                        } else {
                                        }
                                    }
                                    
                                    tryNuclearFallback();
                                }
                            }
                        } else {
                        }
                    }, 3000);
                })();
            """
            
            webView.evaluateJavaScript(configureScript) { result, error in
                if let error = error {
                    print("📺 Error in nuclear script: \(error)")
                } else {
                    print("📺 NUCLEAR SOLUTION script executed - YouTube videos will work!")
                }
            }
        }
        
        private func handleVideoLoadError(webView: WKWebView, error: Error) {
            let errorScript = """
                (function() {
                    
                    // Try to show a user-friendly error message
                    var errorDiv = document.createElement('div');
                    errorDiv.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 10px; text-align: center; font-family: system-ui;';
                    errorDiv.innerHTML = '<h3>Video Error</h3><p>Unable to load YouTube video</p><button onclick="location.reload()" style="background: #ff0000; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Retry</button>';
                    
                    document.body.appendChild(errorDiv);
                    
                    // Try to reload after 3 seconds
                    setTimeout(() => {
                        location.reload();
                    }, 3000);
                })();
            """
            
            webView.evaluateJavaScript(errorScript) { result, error in
                print("📺 Error handling script executed")
            }
        }
    }
}

// MARK: - Browser Permission Request View
struct BrowserPermissionRequestView: View {
    @ObservedObject var vm: NotchViewModel
    
    var body: some View {
        VStack(spacing: 16) {
            // Icon
            Image(systemName: "globe")
                .font(.system(size: 28))
                .foregroundColor(DynamicIslandTheme.primaryGreen)
            
            // Title and description
            VStack(spacing: 8) {
                Text("Browser Access")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.primary)
                
                Text("Allow access to Safari, Chrome, and Firefox to detect YouTube videos playing in your browser")
                    .font(.system(size: 13))
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .lineLimit(3)
                    .fixedSize(horizontal: false, vertical: true)
            }
            
            // Buttons
            HStack(spacing: 12) {
                Button("Not Now") {
                    vm.denyBrowserPermission()
                }
                .buttonStyle(SystemSecondaryButtonStyle())
                
                Button("Allow") {
                    vm.grantBrowserPermission()
                }
                .buttonStyle(SystemPrimaryButtonStyle())
            }
        }
        .padding(24)
        .frame(width: 360, height: 200)
        .background(
            // System notification-like background
            RoundedRectangle(cornerRadius: 12)
                .fill(.regularMaterial)
                .shadow(color: .black.opacity(0.3), radius: 20, x: 0, y: 10)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(.separator.opacity(0.5), lineWidth: 0.5)
        )
    }
}

// MARK: - System-like Button Styles for Permission Request
struct SystemPrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 14, weight: .medium))
            .foregroundColor(.white)
            .padding(.horizontal, 20)
            .padding(.vertical, 10)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color.accentColor)
            )
            .scaleEffect(configuration.isPressed ? 0.96 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

struct SystemSecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 14, weight: .medium))
            .foregroundColor(.primary)
            .padding(.horizontal, 20)
            .padding(.vertical, 10)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(.quaternary)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(.separator.opacity(0.5), lineWidth: 0.5)
            )
            .scaleEffect(configuration.isPressed ? 0.96 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

// MARK: - Legacy Button Styles (kept for compatibility)
struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 14, weight: .medium))
            .foregroundColor(.white)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(DynamicIslandTheme.primaryGreen)
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 14, weight: .medium))
            .foregroundColor(.white.opacity(0.7))
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(Color.white.opacity(0.1))
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color.white.opacity(0.2), lineWidth: 0.5)
            )
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

// MARK: - TemporaryFolderView Component
struct TemporaryFolderView: View {
    var body: some View {
        HStack(spacing: 8) {
            // VE Icon (compact)
            CompactTemporaryFolderIcon()
            
            // Listen button (compact)
            CompactTemporaryFolderListenButton()
            
            // Share button (compact)
            CompactTemporaryFolderShareButton()
            
            // Ask anything button (compact)
            CompactTemporaryFolderAskAnythingButton()
            
            // Incognito button (compact)
            CompactTemporaryFolderIncognitoButton()
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 6)
    }
}

// MARK: - TemporaryFolder Icon
struct TemporaryFolderIcon: View {
    var body: some View {
        ZStack {
            // Background circle with border and shadow
            Circle()
                .fill(Color.clear)
                .frame(width: 24, height: 24)
                .overlay(
                    Circle()
                        .stroke(Color.white.opacity(0.7), lineWidth: 0.5)
                )
                .background(
                    Circle()
                        .fill(Color.black.opacity(0.25))
                        .shadow(color: Color.black.opacity(0.1), radius: 10, x: 0, y: 0)
                )
                .overlay(
                    Circle()
                        .fill(Color.black.opacity(0.25))
                        .shadow(color: Color.black.opacity(0.25), radius: 6, x: 0, y: 0)
                        .blendMode(.multiply)
                )
            
            // VE Icon
            VEIcon(color: .white)
                .frame(width: 22, height: 14)
        }
    }
}

// MARK: - TemporaryFolder Listen Button
struct TemporaryFolderListenButton: View {
    var body: some View {
        HStack(spacing: 4) {
            WaveIcon(color: .white)
                .frame(width: 11, height: 12)
            
            Text("Listen")
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(.white)
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 5)
        .background(
            RoundedRectangle(cornerRadius: 100)
                .fill(
                    LinearGradient(
                        colors: [
                            Color.white.opacity(0.06),
                            Color.white.opacity(0.1),
                            Color.white.opacity(0.06)
                        ],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 100)
                        .stroke(Color.white.opacity(0.7), lineWidth: 0.5)
                )
                .background(
                    RoundedRectangle(cornerRadius: 100)
                        .fill(Color.black.opacity(0.25))
                        .shadow(color: Color.black.opacity(0.1), radius: 10, x: 0, y: 0)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 100)
                        .fill(Color.black.opacity(0.25))
                        .shadow(color: Color.black.opacity(0.25), radius: 6, x: 0, y: 0)
                        .blendMode(.multiply)
                )
        )
    }
}

// MARK: - TemporaryFolder Share Button
struct TemporaryFolderShareButton: View {
    var body: some View {
        Text("Share")
            .font(.system(size: 10, weight: .medium))
            .foregroundColor(.white)
            .padding(.horizontal, 8)
            .padding(.vertical, 5)
            .background(
                RoundedRectangle(cornerRadius: 100)
                    .fill(
                        LinearGradient(
                            colors: [
                                Color.white.opacity(0.06),
                                Color.white.opacity(0.1),
                                Color.white.opacity(0.06)
                            ],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 100)
                            .stroke(Color.white.opacity(0.7), lineWidth: 0.5)
                    )
                    .background(
                        RoundedRectangle(cornerRadius: 100)
                            .fill(Color.black.opacity(0.25))
                            .shadow(color: Color.black.opacity(0.1), radius: 10, x: 0, y: 0)
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 100)
                            .fill(Color.black.opacity(0.25))
                            .shadow(color: Color.black.opacity(0.25), radius: 6, x: 0, y: 0)
                            .blendMode(.multiply)
                    )
            )
    }
}

// MARK: - TemporaryFolder Ask Anything Button
struct TemporaryFolderAskAnythingButton: View {
    var body: some View {
        HStack(spacing: 4) {
            AskAnythingIcon(color: .white)
                .frame(width: 15, height: 14)
            
            Text("Ask anything")
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(.white.opacity(0.7))
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .frame(width: 105, height: 24)
    }
}

// MARK: - TemporaryFolder Incognito Button
struct TemporaryFolderIncognitoButton: View {
    var body: some View {
        ZStack {
            // Background circle with border and shadow
            Circle()
                .fill(Color.clear)
                .frame(width: 24, height: 24)
                .overlay(
                    Circle()
                        .stroke(Color.white.opacity(0.7), lineWidth: 0.5)
                )
                .background(
                    Circle()
                        .fill(Color.black.opacity(0.25))
                        .shadow(color: Color.black.opacity(0.1), radius: 10, x: 0, y: 0)
                )
                .overlay(
                    Circle()
                        .fill(Color.black.opacity(0.25))
                        .shadow(color: Color.black.opacity(0.25), radius: 6, x: 0, y: 0)
                        .blendMode(.multiply)
                )
            
            // Incognito Icon
            IncognitoIcon(color: .white)
                .frame(width: 15, height: 14)
        }
    }
}

// MARK: - Ask Anything Icon
struct AskAnythingIcon: View {
    var color: Color = .white
    
    var body: some View {
        GeometryReader { geo in
            let scale = min(geo.size.width, geo.size.height) / 15.0
            let offsetX = (geo.size.width - 15.0 * scale) / 2.0
            let offsetY = (geo.size.height - 14.0 * scale) / 2.0
            let point: (CGFloat, CGFloat) -> CGPoint = { x, y in
                CGPoint(x: offsetX + x * scale, y: offsetY + y * scale)
            }
            
            ZStack {
                // T shape from TIcon.svg - using the actual SVG path
                Path { path in
                    // Main T shape path from SVG
                    path.move(to: point(5.12817, 1.16797))
                    path.addLine(to: point(9.87183, 1.16797))
                    path.addCurve(to: point(10.3887, 1.16797), control1: point(10.8343, 1.16797), control2: point(11.1913, 1.2158))
                    path.addCurve(to: point(11.5734, 1.26714), control1: point(11.9403, 1.38322), control2: point(12.2372, 1.68072))
                    path.addCurve(to: point(12.5347, 1.97822), control1: point(12.6508, 2.34455), control2: point(12.7022, 2.72664))
                    path.addCurve(to: point(12.75, 3.08364), control1: point(12.75, 3.5293), control2: point(12.75, 4.04614))
                    path.addLine(to: point(12.75, 4.6388))
                    path.addCurve(to: point(12.6885, 4.94188), control1: point(12.5791, 5.05128), control2: point(12.4697, 5.16068))
                    path.addCurve(to: point(12.3214, 5.22214), control1: point(12.1667, 5.22214), control2: point(12.012, 5.22214))
                    path.addCurve(to: point(11.8636, 5.16068), control1: point(11.7542, 5.05128), control2: point(11.6448, 4.94188))
                    path.addCurve(to: point(11.5833, 4.79351), control1: point(11.5833, 4.6388), control2: point(11.5833, 4.08464))
                    path.addCurve(to: point(11.5833, 3.51822), control1: point(11.5822, 3.15189), control2: point(11.546, 2.88239))
                    path.addCurve(to: point(11.5116, 2.62922), control1: point(11.4567, 2.54989), control2: point(11.4124, 2.50555))
                    path.addCurve(to: point(11.3681, 2.46122), control1: point(11.2887, 2.40639), control2: point(11.0356, 2.37197))
                    path.addCurve(to: point(10.7667, 2.3358), control1: point(10.3997, 2.33464), control2: point(9.83333, 2.33464))
                    path.addLine(to: point(8.08333, 2.33464))
                    path.addLine(to: point(8.08333, 12.2513))
                    path.addCurve(to: point(8.02187, 12.5544), control1: point(7.91248, 12.6638), control2: point(7.80308, 12.7732))
                    path.addCurve(to: point(7.65471, 12.8346), control1: point(7.5, 12.8346), control2: point(7.34529, 12.8346))
                    path.addCurve(to: point(7.19692, 12.7732), control1: point(7.08752, 12.6638), control2: point(6.97812, 12.5544))
                    path.addCurve(to: point(6.91667, 12.406), control1: point(6.91667, 12.2513), control2: point(6.91667, 2.33464))
                    path.addLine(to: point(5.16667, 2.33464))
                    path.addCurve(to: point(4.60025, 2.33464), control1: point(4.23392, 2.3358), control2: point(3.96442, 2.37197))
                    path.addCurve(to: point(3.71125, 2.40639), control1: point(3.63192, 2.46122), control2: point(3.58758, 2.50555))
                    path.addCurve(to: point(3.54325, 2.54989), control1: point(3.48842, 2.62922), control2: point(3.454, 2.88239))
                    path.addCurve(to: point(3.41783, 3.1513), control1: point(3.41667, 3.51822), control2: point(3.41667, 4.08464))
                    path.addLine(to: point(3.41667, 4.6388))
                    path.addCurve(to: point(3.35521, 4.94188), control1: point(3.24581, 5.05128), control2: point(3.13642, 5.16068))
                    path.addCurve(to: point(2.98804, 5.22214), control1: point(2.83333, 5.22214), control2: point(2.67862, 5.22214))
                    path.addCurve(to: point(2.53025, 5.16068), control1: point(2.42085, 5.05128), control2: point(2.31146, 4.94188))
                    path.addCurve(to: point(2.25, 4.79351), control1: point(2.25, 4.6388), control2: point(2.25, 4.04614))
                    path.addCurve(to: point(2.25, 3.5293), control1: point(2.25, 3.08364), control2: point(2.29783, 2.72664))
                    path.addCurve(to: point(2.34917, 2.34455), control1: point(2.46525, 1.97764), control2: point(2.76275, 1.68072))
                    path.addCurve(to: point(3.06025, 1.38322), control1: point(3.42658, 1.26714), control2: point(3.80867, 1.2158))
                    path.addCurve(to: point(4.16567, 1.16797), control1: point(4.61133, 1.16797), control2: point(5.12817, 1.16797))
                    path.closeSubpath()
                }
                .fill(color.opacity(0.7))
                
                // Bottom line from TIcon.svg
                Path { path in
                    path.move(to: point(4.58594, 12.25))
                    path.addLine(to: point(10.4193, 12.25))
                }
                .stroke(color.opacity(0.7), style: StrokeStyle(lineWidth: 1.0 * scale, lineCap: .round, lineJoin: .round))
            }
        }
        .aspectRatio(15.0/14.0, contentMode: .fit)
    }
}

// MARK: - Incognito Icon
struct IncognitoIcon: View {
    var color: Color = .white
    
    var body: some View {
        GeometryReader { geo in
            let scale = min(geo.size.width, geo.size.height) / 15.0
            let offsetX = (geo.size.width - 15.0 * scale) / 2.0
            let offsetY = (geo.size.height - 14.0 * scale) / 2.0
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
                // Top line
                Path { path in
                    path.move(to: point(0.94, 6.56))
                    path.addLine(to: point(14.06, 6.56))
                }
                .stroke(color, style: StrokeStyle(lineWidth: 0.875 * scale, lineCap: .round, lineJoin: .round))
                
                // Left wheel
                Path { path in
                    path.addEllipse(in: circleRect(4.66, 9.84, 1.53))
                }
                .stroke(color, style: StrokeStyle(lineWidth: 0.875 * scale, lineCap: .round, lineJoin: .round))
                
                // Right wheel
                Path { path in
                    path.addEllipse(in: circleRect(10.34, 9.84, 1.53))
                }
                .stroke(color, style: StrokeStyle(lineWidth: 0.875 * scale, lineCap: .round, lineJoin: .round))
                
                // Bottom line
                Path { path in
                    path.move(to: point(6.17, 10.06))
                    path.addLine(to: point(8.83, 10.06))
                }
                .stroke(color, style: StrokeStyle(lineWidth: 0.875 * scale, lineCap: .round, lineJoin: .round))
                
                // Car body
                Path { path in
                    path.move(to: point(2.69, 6.56))
                    path.addLine(to: point(5.42, 2.80))
                    path.addLine(to: point(8.18, 3.61))
                    path.addLine(to: point(12.31, 6.56))
                }
                .stroke(color, style: StrokeStyle(lineWidth: 0.875 * scale, lineCap: .round, lineJoin: .round))
            }
        }
        .aspectRatio(15.0/14.0, contentMode: .fit)
    }
}

// MARK: - Compact TemporaryFolder Components for Collapsed State
struct CompactTemporaryFolderIcon: View {
    var body: some View {
        ZStack {
            // Background circle with border and shadow (optimized for 48px height)
            Circle()
                .fill(Color.clear)
                .frame(width: 20, height: 20)
                .overlay(
                    Circle()
                        .stroke(Color.white.opacity(0.7), lineWidth: 0.5)
                )
                .background(
                    Circle()
                        .fill(Color.black.opacity(0.25))
                        .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 0)
                )
                .overlay(
                    Circle()
                        .fill(Color.black.opacity(0.25))
                        .shadow(color: Color.black.opacity(0.25), radius: 4, x: 0, y: 0)
                        .blendMode(.multiply)
                )
            
            // VE Icon (optimized for 48px height)
            VEIcon(color: .white)
                .frame(width: 22, height: 14)
        }
    }
}

struct CompactTemporaryFolderListenButton: View {
    var body: some View {
        HStack(spacing: 4) {
            WaveIcon(color: .white)
                .frame(width: 10, height: 11)
            
            Text("Listen")
                .font(.system(size: 9, weight: .medium))
                .foregroundColor(.white)
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(
            RoundedRectangle(cornerRadius: 100)
                .fill(
                    LinearGradient(
                        colors: [
                            Color.white.opacity(0.06),
                            Color.white.opacity(0.1),
                            Color.white.opacity(0.06)
                        ],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 100)
                        .stroke(Color.white.opacity(0.7), lineWidth: 0.5)
                )
                .background(
                    RoundedRectangle(cornerRadius: 100)
                        .fill(Color.black.opacity(0.25))
                        .shadow(color: Color.black.opacity(0.1), radius: 6, x: 0, y: 0)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 100)
                        .fill(Color.black.opacity(0.25))
                        .shadow(color: Color.black.opacity(0.25), radius: 3, x: 0, y: 0)
                        .blendMode(.multiply)
                )
        )
    }
}

struct CompactTemporaryFolderShareButton: View {
    var body: some View {
        Text("Share")
            .font(.system(size: 9, weight: .medium))
            .foregroundColor(.white)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(
                RoundedRectangle(cornerRadius: 100)
                    .fill(
                        LinearGradient(
                            colors: [
                                Color.white.opacity(0.06),
                                Color.white.opacity(0.1),
                                Color.white.opacity(0.06)
                            ],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 100)
                            .stroke(Color.white.opacity(0.7), lineWidth: 0.5)
                    )
                    .background(
                        RoundedRectangle(cornerRadius: 100)
                            .fill(Color.black.opacity(0.25))
                            .shadow(color: Color.black.opacity(0.1), radius: 6, x: 0, y: 0)
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 100)
                            .fill(Color.black.opacity(0.25))
                            .shadow(color: Color.black.opacity(0.25), radius: 3, x: 0, y: 0)
                            .blendMode(.multiply)
                    )
            )
    }
}

struct CompactTemporaryFolderAskAnythingButton: View {
    var body: some View {
        HStack(spacing: 4) {
            AskAnythingIcon(color: .white)
                .frame(width: 12, height: 11)
            
            Text("Ask anything")
                .font(.system(size: 9, weight: .medium))
                .foregroundColor(.white.opacity(0.7))
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .frame(width: 100, height: 20)
    }
}

struct CompactTemporaryFolderIncognitoButton: View {
    var body: some View {
        ZStack {
            // Background circle with border and shadow (optimized for 48px height)
            Circle()
                .fill(Color.clear)
                .frame(width: 20, height: 20)
                .overlay(
                    Circle()
                        .stroke(Color.white.opacity(0.7), lineWidth: 0.5)
                )
                .background(
                    Circle()
                        .fill(Color.black.opacity(0.25))
                        .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 0)
                )
                .overlay(
                    Circle()
                        .fill(Color.black.opacity(0.25))
                        .shadow(color: Color.black.opacity(0.25), radius: 4, x: 0, y: 0)
                        .blendMode(.multiply)
                )
            
            // Incognito Icon (optimized for 48px height)
            IncognitoIcon(color: .white)
                .frame(width: 12, height: 11)
        }
    }
}

#Preview {
    NotchContentView(vm: .init())
        .frame(width: 850, height: 150, alignment: .center)
        .background(.black)
        .preferredColorScheme(.dark)
}
