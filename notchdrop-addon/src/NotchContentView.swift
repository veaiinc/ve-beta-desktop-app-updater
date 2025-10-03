
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

// MARK: - Start Meeting Card
struct StartMeetingCard: View {
    let vm: NotchViewModel

    var body: some View {
        GeometryReader { geo in
            let h = geo.size.height
            let corner: CGFloat = 12
            let padding: CGFloat = 12
            // Scale text to fit smaller height nicely (target 220x100 card)
            let titleSize = max(16, min(22, h * 0.28))

            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: corner, style: .continuous)
                    .fill(Color.white.opacity(0.04))
                    .overlay(
                        RoundedRectangle(cornerRadius: corner, style: .continuous)
                            .stroke(Color.white.opacity(0.12), lineWidth: 0.8)
                    )

                VStack(alignment: .leading, spacing: 2) {
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
                .padding(padding)
            }
            .contentShape(RoundedRectangle(cornerRadius: corner, style: .continuous))
            .onTapGesture { vm.startRecording() }
        }
        // Ensure the reader honors parent frame
        .clipped()
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
                                    vm.isTrayMode = false
                                    vm.resetToNotchHome()
                                }) {
                                    HStack(spacing: 6.0) {
                                        Image(systemName: "house")
                                            .font(.system(size: 14, weight: .regular))
                                            .foregroundColor((!vm.isTeamsView && !vm.isTrayMode) ? .black : .white)
                                    }
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 6)
                                    .background(
                                        RoundedRectangle(cornerRadius: 14, style: .continuous)
                                            .fill((!vm.isTeamsView && !vm.isTrayMode) ? Color(red: 0.69, green: 0.97, blue: 0.84) : Color.clear)
                                    )
                                }
                                .buttonStyle(PlainButtonStyle())

                                // Teams pill (sets Teams view)
                                Button(action: {
                                    vm.isTeamsView = true
                                    vm.isTrayMode = false
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
                                            .fill(vm.isTeamsView ? Color(red: 0.69, green: 0.97, blue: 0.84) : Color.clear)
                                    )
                                }
                                .buttonStyle(PlainButtonStyle())
                                // Removed desktop and VE icons per request
                                
                                // Tray button beside Start
                                Button(action: {
                                    vm.isTrayMode = true
                                    vm.isTeamsView = false
                                }) {
                                    HStack(spacing: 6.0) {
                                      
                                        Text("Tray")
                                            .font(.system(size: 15, weight: .semibold))
                                            .foregroundColor(vm.isTrayMode ? .black : .white)
                                    }
                                    
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 8)
                                    .background(
                                        RoundedRectangle(cornerRadius: 14, style: .continuous)
                                            .fill(vm.isTrayMode ? Color(red: 0.69, green: 0.97, blue: 0.84) : Color.clear)
                                    )
                                   
                                   
                                }
                                .buttonStyle(PlainButtonStyle())
                              
                            } else if vm.showVoiceInterface {
                                // Voice controls (mute/unmute and cancel buttons)
                                HStack(spacing: 12) {
                                    // Mute/Unmute toggle
                                    Button(action: {
                                        print("🎤 Mute button clicked - current state: \(vm.isMicrophoneMuted)")
                                        vm.toggleVoiceMute()
                                        print("🎤 After toggle - new state: \(vm.isMicrophoneMuted)")
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
                                        print("❌ Cancel button clicked")
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
                            // VE icon → Open Ve app (Electron main window)
                            Button(action: {
                                vm.navigateToMainScreen(path: nil)
                            }) {
                                VEIcon(color: .white)
                                    .frame(width: 16, height: 16)
                                    .padding(8) // Increased padding for larger clickable area
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 6) // Slightly larger corner radius
                                            .stroke(Color.white.opacity(0.15), lineWidth: 0.5)
                                    )
                                    .contentShape(RoundedRectangle(cornerRadius: 6)) // Make entire rectangular area clickable
                            }
                            .buttonStyle(PlainButtonStyle())
                            .help("Open Ve App")
                            
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
                                .contentShape(RoundedRectangle(cornerRadius: 6)) // Make entire rectangular area clickable
                            }
                            .buttonStyle(PlainButtonStyle())
                            .help(vm.isStealthModeEnabled ? "Disable Stealth Mode" : "Enable Stealth Mode")
                            
                            // Information icon (third icon) with popup menu
                            // InfoIconWithPopup(showInfoPopup: $showInfoPopup, infoPopupPosition: $infoPopupPosition)
                            
                            // Lock/Unlock button (fourth icon)
                            Button(action: {
                                vm.toggleNotchLock()
                            }) {
                                Image(systemName: vm.isNotchLocked ? "lock.fill" : "lock.open.fill")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(vm.isNotchLocked ? DynamicIslandTheme.primaryGreen : .white)
                                    .frame(width: 16, height: 16)
                                    .padding(8)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 6)
                                            .stroke(vm.isNotchLocked ? DynamicIslandTheme.primaryGreen.opacity(0.6) : Color.white.opacity(0.15), lineWidth: 0.5)
                                    )
                                    .contentShape(RoundedRectangle(cornerRadius: 6)) // Make entire rectangular area clickable
                            }
                            .buttonStyle(PlainButtonStyle())
                            .help(vm.isNotchLocked ? "Unlock Notch" : "Lock Notch")
                        }
                    }
                    
                    
                    // Main content area
                    HStack(alignment: .center, spacing: 8) {
                        if vm.showVoiceInterface {
                            // Voice split layout (left conversation, right controls) - PRIORITY: Always show voice interface when active
                            VoiceSplitLayout(vm: vm)
                        } else if vm.isTeamsView {
                            // Teams view: maintain even spacing between three blocks
                            HStack(spacing: 12) {
                                if !vm.isRecording {
                                    StartMeetingCard(vm: vm)
                                        .frame(width: 220, height: 100)
                                }
                                ChatTextAreaView(
                                    chatInput: $vm.chatInput,
                                    isTextFieldActive: $isTextFieldActive,
                                    vm: vm
                                )
                                .frame(width: 400, height: 100)
                                .animation(.easeInOut(duration: 0.2), value: vm.isTeamsView)
                                WebcamButton(vm: vm)
                                    .frame(width: 100, height: 100)
                            }
                        } else if vm.isTrayMode {
                            // Tray view with AirDrop functionality
                            TrayView(vm: vm)
                                .frame(maxWidth: .infinity, maxHeight: .infinity)
                                .transition(.scale.combined(with: .opacity))
                        } else {
                            // Default chat input section with voice/arrow icon inside - matches image layout
                            ChatTextAreaView(
                                chatInput: $vm.chatInput,
                                isTextFieldActive: $isTextFieldActive,
                                vm: vm
                            )
                            .frame(width: vm.isRecording ? 410 : 510) // 410px in meeting mode, 510px otherwise
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
                                        
                                    // Music Media Controller - only show when music is playing
                                    if vm.hasActiveMusic {
                                        MusicMediaController(vm: vm)
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
        // Check individual app status with detailed logging
        let spotifyRunning = isSpotifyRunning()
        let spotifyPlaying = isSpotifyPlaying()
        let appleMusicRunning = isAppleMusicRunning()
        let appleMusicPlaying = isAppleMusicPlaying()
        
        // Check system media info
        let nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo
        let hasSystemMedia = nowPlayingInfo != nil
        let systemPlaybackRate = nowPlayingInfo?[MPNowPlayingInfoPropertyPlaybackRate] as? Double ?? 0.0
        let systemPlaying = systemPlaybackRate > 0.0
        
        // Check YouTube status
        let youtubeActive = detectYouTubeVideo()
        
        print("🎵 === MEDIA STATUS UPDATE ===")
        print("🎵 Spotify - Running: \(spotifyRunning), Playing: \(spotifyPlaying)")
        print("🎵 Apple Music - Running: \(appleMusicRunning), Playing: \(appleMusicPlaying)")
        print("🎵 System Media - Present: \(hasSystemMedia), Rate: \(systemPlaybackRate), Playing: \(systemPlaying)")
        print("🎵 YouTube - Active: \(youtubeActive)")
        
        // Enhanced priority logic: Currently playing app takes precedence
        if youtubeActive && (appleMusicPlaying || spotifyPlaying) {
            // Both YouTube and music active - YouTube wins
            print("🎵 RESULT: YouTube wins over music")
            DispatchQueue.main.async {
                vm.hasActiveMusic = false
                vm.isMusicPlaying = false
                vm.hasActiveVideo = true
                vm.isVideoPlaying = true
            }
        } else if youtubeActive {
            // YouTube active, music not playing - show YouTube
            print("🎵 RESULT: YouTube only")
            DispatchQueue.main.async {
                vm.hasActiveMusic = false
                vm.isMusicPlaying = false
                vm.hasActiveVideo = true
                vm.isVideoPlaying = true
            }
        } else if appleMusicPlaying && !spotifyPlaying {
            // Only Apple Music playing
            print("🎵 RESULT: Apple Music playing (Spotify paused)")
            DispatchQueue.main.async {
                vm.hasActiveMusic = true
                vm.isMusicPlaying = true
                vm.hasActiveVideo = false
                vm.isVideoPlaying = false
                print("🎵 VM UPDATED: Apple Music active")
            }
        } else if spotifyPlaying && !appleMusicPlaying {
            // Only Spotify playing
            print("🎵 RESULT: Spotify playing (Apple Music paused)")
            DispatchQueue.main.async {
                vm.hasActiveMusic = true
                vm.isMusicPlaying = true
                vm.hasActiveVideo = false
                vm.isVideoPlaying = false
                print("🎵 VM UPDATED: Spotify active")
            }
        } else if appleMusicPlaying && spotifyPlaying {
            // Both music apps claim to be playing - use system media to determine which is actually active
            print("🎵 RESULT: Both music apps claim to be playing - checking system priority")
            
            // Get more detailed system media info to determine the actual active app
            if let nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo {
                let systemTitle = nowPlayingInfo[MPMediaItemPropertyTitle] as? String ?? ""
                let systemArtist = nowPlayingInfo[MPMediaItemPropertyArtist] as? String ?? ""
                print("🎵 System media: '\(systemTitle)' by '\(systemArtist)', Rate: \(systemPlaybackRate)")
                
                // If system media is playing and has content, use it to determine priority
                if systemPlaying && !systemTitle.isEmpty {
                    // Check which app matches the system media better
                    // This is a more reliable way to determine the actual active app
                    print("🎵 RESULT: Using system media as source of truth")
                    DispatchQueue.main.async {
                        vm.hasActiveMusic = true
                        vm.isMusicPlaying = true
                        vm.hasActiveVideo = false
                        vm.isVideoPlaying = false
                        print("🎵 VM UPDATED: Both playing, using system media priority")
                    }
                } else {
                    // If system media is not reliable, do a more thorough check
                    // Wait a moment and re-check to avoid stale AppleScript data
                    print("🎵 System media unreliable, doing secondary check...")
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                        self.resolveConflictingPlayStates()
                    }
                }
            } else {
                // No system media info available, do a secondary check
                print("🎵 No system media info, doing secondary check...")
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                    self.resolveConflictingPlayStates()
                }
            }
        } else if systemPlaying && hasSystemMedia {
            // System media playing but apps report not playing - trust system
            print("🎵 RESULT: System media playing (apps report paused)")
            DispatchQueue.main.async {
                vm.hasActiveMusic = true
                vm.isMusicPlaying = true
                vm.hasActiveVideo = false
                vm.isVideoPlaying = false
                print("🎵 VM UPDATED: System media active")
            }
        } else if appleMusicRunning || spotifyRunning || hasSystemMedia {
            // Music paused but running - show paused state
            let pausedApp = appleMusicRunning ? "Apple Music" : spotifyRunning ? "Spotify" : "System Media"
            print("🎵 RESULT: \(pausedApp) paused")
            DispatchQueue.main.async {
                vm.hasActiveMusic = true
                vm.isMusicPlaying = false
                vm.hasActiveVideo = false
                vm.isVideoPlaying = false
                print("🎵 VM UPDATED: \(pausedApp) paused")
            }
        } else {
            // Nothing running
            print("🎵 RESULT: Nothing active")
            DispatchQueue.main.async {
                vm.hasActiveMusic = false
                vm.isMusicPlaying = false
                vm.hasActiveVideo = false
                vm.isVideoPlaying = false
                print("🎵 VM UPDATED: Nothing active")
            }
        }
        
        print("🎵 === END STATUS UPDATE ===")
        print("🎵 FINAL VM STATE: hasActiveMusic=\(vm.hasActiveMusic), isMusicPlaying=\(vm.isMusicPlaying), hasActiveVideo=\(vm.hasActiveVideo), isVideoPlaying=\(vm.isVideoPlaying)")
    }
    
    // Helper function to resolve conflicting play states between apps
    private func resolveConflictingPlayStates() {
        print("🎵 === RESOLVING CONFLICTING PLAY STATES ===")
        
        // Re-check both apps with fresh AppleScript calls
        let spotifyPlaying = isSpotifyPlaying()
        let appleMusicPlaying = isAppleMusicPlaying()
        
        // Also check system media info again
        let nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo
        let systemPlaybackRate = nowPlayingInfo?[MPNowPlayingInfoPropertyPlaybackRate] as? Double ?? 0.0
        let systemPlaying = systemPlaybackRate > 0.0
        
        print("🎵 Secondary check - Spotify: \(spotifyPlaying), Apple Music: \(appleMusicPlaying), System: \(systemPlaying)")
        
        if spotifyPlaying && !appleMusicPlaying {
            // Only Spotify is playing
            print("🎵 RESOLVED: Spotify is the active player")
            DispatchQueue.main.async {
                vm.hasActiveMusic = true
                vm.isMusicPlaying = true
                vm.hasActiveVideo = false
                vm.isVideoPlaying = false
                print("🎵 VM UPDATED: Resolved to Spotify")
            }
        } else if appleMusicPlaying && !spotifyPlaying {
            // Only Apple Music is playing
            print("🎵 RESOLVED: Apple Music is the active player")
            DispatchQueue.main.async {
                vm.hasActiveMusic = true
                vm.isMusicPlaying = true
                vm.hasActiveVideo = false
                vm.isVideoPlaying = false
                print("🎵 VM UPDATED: Resolved to Apple Music")
            }
        } else if systemPlaying {
            // Trust system media if it's playing
            print("🎵 RESOLVED: Using system media as fallback")
            DispatchQueue.main.async {
                vm.hasActiveMusic = true
                vm.isMusicPlaying = true
                vm.hasActiveVideo = false
                vm.isVideoPlaying = false
                print("🎵 VM UPDATED: Resolved to system media")
            }
        } else {
            // Nothing is actually playing
            print("🎵 RESOLVED: Nothing is actually playing")
            DispatchQueue.main.async {
                vm.hasActiveMusic = false
                vm.isMusicPlaying = false
                vm.hasActiveVideo = false
                vm.isVideoPlaying = false
                print("🎵 VM UPDATED: Resolved to no active media")
            }
        }
        
        print("🎵 === CONFLICT RESOLUTION COMPLETE ===")
        
        // Trigger track info update after resolution
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            // This will trigger the onChange listeners in MusicMediaController
            // to update the track info for the resolved app
            print("🎵 Triggering track info update after conflict resolution")
        }
    }
    
    private func isMusicAppRunning() -> Bool {
        // Method 1: Check system media info
        let nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo
        let hasSystemMedia = nowPlayingInfo != nil
        
        // Method 2: Check specific apps via AppleScript
        let spotifyRunning = isSpotifyRunning()
        let appleMusicRunning = isAppleMusicRunning()
        
        let result = hasSystemMedia || spotifyRunning || appleMusicRunning
        print("🎵 Music app running check - System media: \(hasSystemMedia), Spotify: \(spotifyRunning), Apple Music: \(appleMusicRunning), Result: \(result)")
        
        return result
    }
    
    private func isMusicAppPlaying() -> Bool {
        // Method 1: Check system media playback rate
        if let nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo {
            let playbackRate = nowPlayingInfo[MPNowPlayingInfoPropertyPlaybackRate] as? Double ?? 0.0
            let systemPlaying = playbackRate > 0.0
            print("🎵 System media playback rate: \(playbackRate), playing: \(systemPlaying)")
            if systemPlaying {
                return true
            }
        }
        
        // Method 2: Check specific apps via AppleScript
        let spotifyPlaying = isSpotifyPlaying()
        let appleMusicPlaying = isAppleMusicPlaying()
        
        let result = spotifyPlaying || appleMusicPlaying
        print("🎵 Music app playing check - Spotify: \(spotifyPlaying), Apple Music: \(appleMusicPlaying), Result: \(result)")
        
        return result
    }
    
    private func isSpotifyRunning() -> Bool {
        let script = """
        tell application "System Events"
            return (name of processes) contains "Spotify"
        end tell
        """
        
            var error: NSDictionary?
        if let scriptObject = NSAppleScript(source: script) {
            let output = scriptObject.executeAndReturnError(&error)
            let result = output.booleanValue
            print("🎵 Spotify running check: \(result)")
            return result
        }
        print("🎵 Spotify running check failed")
        return false
    }
    
    private func isSpotifyPlaying() -> Bool {
        // First check if Spotify is even running
        if !isSpotifyRunning() {
            print("🎵 Spotify not running, returning false for playing")
        return false
    }
    
        let script = """
        tell application "Spotify"
            try
                if it is running then
                    return (player state as string) is equal to "playing"
                else
                    return false
                end if
            on error
                return false
            end try
        end tell
        """
        
        var error: NSDictionary?
        if let scriptObject = NSAppleScript(source: script) {
            let output = scriptObject.executeAndReturnError(&error)
            let result = output.booleanValue
            print("🎵 Spotify playing check: \(result)")
            if let error = error {
                print("🎵 Spotify AppleScript error: \(error)")
            }
            return result
        }
        print("🎵 Spotify playing check failed")
        return false
    }
    
    private func isAppleMusicRunning() -> Bool {
        let script = """
        tell application "System Events"
            return (name of processes) contains "Music"
        end tell
        """
        
        var error: NSDictionary?
        if let scriptObject = NSAppleScript(source: script) {
            let output = scriptObject.executeAndReturnError(&error)
            let result = output.booleanValue
            print("🎵 Apple Music running check: \(result)")
            return result
        }
        print("🎵 Apple Music running check failed")
        return false
    }
    
    private func isAppleMusicPlaying() -> Bool {
        // First check if Apple Music is even running
        if !isAppleMusicRunning() {
            print("🎵 Apple Music not running, returning false for playing")
            return false
        }
        
        let script = """
        tell application "Music"
            try
                if it is running then
                    return (player state as string) is equal to "playing"
                else
                    return false
                end if
            on error
                return false
            end try
        end tell
        """
        
        var error: NSDictionary?
        if let scriptObject = NSAppleScript(source: script) {
            let output = scriptObject.executeAndReturnError(&error)
            let result = output.booleanValue
            print("🎵 Apple Music playing check: \(result)")
            if let error = error {
                print("🎵 Apple Music AppleScript error: \(error)")
            }
            return result
        }
        print("🎵 Apple Music playing check failed")
        return false
    }
    
    private func detectYouTubeVideo() -> Bool {
        // Method 1: Check browser tabs for YouTube (try default browser first, then fallback to all)
        let youtubeFromBrowser = checkDefaultBrowserForYouTube() || checkBrowserForYouTube()
        
        // Method 2: Check system media for YouTube
        let youtubeFromMedia = checkSystemMediaForYouTube()
        
        // Return true if YouTube is present from either source
        return youtubeFromBrowser || youtubeFromMedia
    }
    
    private func isYouTubePlaying() -> Bool {
        // Check if YouTube is actually playing (not just present)
        // This is harder to detect reliably, so for now we'll assume if YouTube is detected, it's playing
        // In the future, we could enhance this with more sophisticated detection
        return detectYouTubeVideo()
    }
    
    private func getSystemDefaultBrowser() -> String? {
        // Use NSWorkspace to get the default browser for HTTP URLs
        if let httpURL = URL(string: "http://example.com"),
           let defaultAppURL = NSWorkspace.shared.urlForApplication(toOpen: httpURL),
           let bundle = Bundle(url: defaultAppURL),
           let bundleId = bundle.bundleIdentifier {
            
            // Map bundle IDs to app names we can check
            switch bundleId {
            case "com.apple.Safari":
                return "Safari"
            case "com.google.Chrome":
                return "Google Chrome"
            case "org.mozilla.firefox":
                return "Firefox"
            case "com.microsoft.edgemac":
                return "Microsoft Edge"
            case "company.thebrowser.Browser":
                return "Arc"
            case "com.brave.Browser":
                return "Brave Browser"
            default:
                // Try to get the display name
                if let appName = bundle.infoDictionary?["CFBundleDisplayName"] as? String {
                    return appName
                } else if let appName = bundle.infoDictionary?["CFBundleName"] as? String {
                    return appName
                }
                return "Safari" // Fallback to Safari
            }
        }
        return "Safari" // Default fallback
    }
    
    private func checkDefaultBrowserForYouTube() -> Bool {
        guard let defaultBrowser = getSystemDefaultBrowser() else {
            return false
        }
        
        if let (url, title) = checkBrowserApp(defaultBrowser) {
            if url.contains("youtube.com/watch") || url.contains("youtu.be/") {
                updateVideoInfo(from: title, url: url)
                return true
            }
        }
        return false
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
        
        guard let id = videoId else { return "" }
        
        // Return YouTube embed URL with autoplay and minimal UI
        return "https://www.youtube.com/embed/\(id)?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=1"
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
                    print("📨 Swift UI received message from Electron: \(message)")
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
                print("🎤 Mute button clicked - current state: \(vm.isMicrophoneMuted)")
                vm.toggleVoiceMute()
                print("🎤 After toggle - new state: \(vm.isMicrophoneMuted)")
            }) {
                Image(systemName: vm.isMicrophoneMuted ? "mic.slash.fill" : "mic.fill")
                    .font(.system(size: 16))
                    .foregroundColor(vm.isMicrophoneMuted ? Color.red : DynamicIslandTheme.primaryGreen)
                    .frame(width: 24, height: 24)
            }
            .buttonStyle(PlainButtonStyle())
            
            // Cancel/Disconnect button
            Button(action: {
                print("❌ Cancel button clicked")
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
                        }
                        return .handled
                    }
                }
                .onTapGesture {
                    // Direct tap on TextEditor to ensure focus and cursor
                    print("🎯 TextEditor directly tapped")
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
                        print("🔥 BUTTON CLICKED! isChatInputFocused: \(isChatInputFocused)")
                        if isChatInputFocused {
                            // Arrow mode - submit chat
                            print("🎯 Arrow button clicked - submitting chat")
                            if !vm.isSendingMessage && !chatInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                                vm.submitChat()
                            }
                        } else {
                            // Voice mode - activate voice assistant
                            print("🎤 WAVE ICON CLICKED - activating voice assistant")
                            print("🎤 Current showVoiceInterface: \(vm.showVoiceInterface)")
                            print("🎤 Current voiceConnectionStatus: \(vm.voiceConnectionStatus)")
                            // Ensure we don't accidentally focus the text area
                            DispatchQueue.main.async {
                                vm.connectVoiceAssistant()
                                print("🎤 connectVoiceAssistant() called")
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
                        print("🔥 TAP GESTURE DETECTED ON WAVE ICON!")
                    }
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
            print("🎯 Chat area tapped at location: \(location) - attempting to focus text input")
            
            // Check if tap is in the button area (bottom-right corner)
            let currentWidth = vm.isRecording ? 410 : 510
            let buttonArea = CGRect(
                x: currentWidth - 40, // 40px from right edge
                y: 100 - 40, // 40px from bottom edge
                width: 40,
                height: 40
            )
            
            if buttonArea.contains(location) {
                print("🎯 Tap detected in button area - ignoring chat focus")
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
                print("🎯 Making window key: \(window.className)")
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
            } else {
                print("🎯 No suitable window found for focus")
            }
        }
        .zIndex(2) // Ensure chat input is above the background overlay
    }
    

    
    private func handleTextChange(_ newValue: String) {
        // Fixed height implementation - no dynamic resizing
        // TextEditor will scroll when content exceeds the fixed height of 100px
        print("🎯 Text changed: \(newValue.count) characters")
        
        // Keep the height fixed at 100px - scrolling will handle overflow
        // No need to calculate or change textEditorHeight
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
                    // Default state - frosted circular button with icon and label
                    ZStack {
                        Circle()
                            .fill(Color.white.opacity(0.05)) // background: rgba(255, 255, 255, 0.05)
                            .frame(width: 100, height: 100)
                            .background(.ultraThinMaterial) // backdrop-filter: blur(15px)
                            .overlay(
                                Circle()
                                    .stroke(Color.white.opacity(0.03), lineWidth: 0.6) // border: 0.6px solid rgba(255, 255, 255, 0.03)
                            )
                            .overlay(
                                // Inner shadow effect using gradient
                                Circle()
                                    .stroke(
                                        LinearGradient(
                                            colors: [
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
// struct ShortcutKeyView: View {
//     let keyText: String
    
//     var body: some View {
//         Text(keyText)
//             .font(.system(size: 11, weight: .medium))
//             .foregroundColor(.white)
//             .padding(.horizontal, 6)
//             .padding(.vertical, 2)
//             .background(
//                 RoundedRectangle(cornerRadius: 4)
//                     .fill(Color.white.opacity(0.15))
//             )
//     }
// }

// MARK: - Music Media Controller (Apple Music, Spotify, etc.)
struct MusicMediaController: View {
    @ObservedObject var vm: NotchViewModel
    @State private var isPlaying: Bool = false
    @State private var songTitle: String = "Unknown Track"
    @State private var artistName: String = "Unknown Artist"
    @State private var albumArtwork: NSImage? = nil
    @State private var lastButtonPressed: MediaCommandType? = nil
    @State private var buttonPressTime: Date = Date()
    @State private var currentMusicApp: MusicApp = .unknown
    
    enum MusicApp {
        case spotify
        case appleMusic
        case unknown
        
        var borderColor: Color {
            switch self {
            case .spotify:
                return Color(red: 0.114, green: 0.725, blue: 0.329) // Spotify Green
            case .appleMusic:
                return Color(red: 0.988, green: 0.267, blue: 0.373) // Apple Music Pink/Red
            case .unknown:
                return Color(red: 0.475, green: 0.925, blue: 0.788).opacity(0.6) // Default teal
            }
        }
        
        var appName: String {
            switch self {
            case .spotify: return "Spotify"
            case .appleMusic: return "Apple Music"
            case .unknown: return "Music"
            }
        }
    }
    
    var body: some View {
        Group {
            if vm.hasActiveMusic {
                HStack(spacing: 12) {
            // Large album artwork (left side) with service badge
            Group {
                ZStack(alignment: .bottomTrailing) {
                if let artwork = albumArtwork {
                    Image(nsImage: artwork)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 50, height: 80)
                        .clipped()
                        .cornerRadius(8)
                        .background(Color.black.opacity(0.3))
                } else {
                        // Show app-specific fallback artwork when no album art is available
                    RoundedRectangle(cornerRadius: 8)
                        .fill(
                            LinearGradient(
                                    gradient: Gradient(colors: currentMusicApp == .appleMusic ? [
                                        Color(red: 0.988, green: 0.267, blue: 0.373).opacity(0.4), // Apple Music pink
                                        Color.black.opacity(0.3)
                                    ] : currentMusicApp == .spotify ? [
                                        Color(red: 0.114, green: 0.725, blue: 0.329).opacity(0.4), // Spotify green
                                        Color.black.opacity(0.3)
                                    ] : [
                                        Color(red: 0.475, green: 0.925, blue: 0.788).opacity(0.3), // Default teal
                                    Color.black.opacity(0.2)
                                ]),
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 60, height: 80)
                        .overlay(
                            VStack(spacing: 4) {
                                    // Show app-specific icon
                                    if currentMusicApp == .appleMusic {
                                        Image(systemName: "music.note.list")
                                            .foregroundColor(.white.opacity(0.9))
                                            .font(.system(size: 20, weight: .medium))
                                        Text("Apple Music")
                                            .foregroundColor(.white.opacity(0.7))
                                            .font(.system(size: 8, weight: .medium))
                                    } else if currentMusicApp == .spotify {
                                        Image(systemName: "music.note")
                                            .foregroundColor(.white.opacity(0.9))
                                            .font(.system(size: 20, weight: .medium))
                                        Text("Spotify")
                                            .foregroundColor(.white.opacity(0.7))
                                            .font(.system(size: 8, weight: .medium))
                                    } else {
                                Image(systemName: "music.note")
                                    .foregroundColor(.white.opacity(0.8))
                                    .font(.system(size: 24, weight: .medium))
                                Text("♫")
                                    .foregroundColor(.white.opacity(0.6))
                                    .font(.system(size: 12))
                                    }
                                }
                            )
                    }
                    
                    // Service badge overlay (like in your Spotify image)
                    if currentMusicApp != .unknown {
                        ZStack {
                            // Badge background with subtle shadow
                            Circle()
                                .fill(Color.black.opacity(0.7))
                                .frame(width: 18, height: 18)
                                .shadow(color: .black.opacity(0.3), radius: 1, x: 0, y: 1)
                            
                            // Service-specific badge icon with proper app logos
                            if currentMusicApp == .spotify {
                                // Spotify badge with the iconic wave pattern
                                ZStack {
                                    Circle()
                                        .fill(Color(red: 0.114, green: 0.725, blue: 0.329)) // Spotify green
                                        .frame(width: 16, height: 16)
                                    
                                    // Spotify's iconic curved lines (simplified version)
                                    VStack(spacing: 1) {
                                        // Top curve
                                        RoundedRectangle(cornerRadius: 1)
                                            .fill(Color.white)
                                            .frame(width: 8, height: 1.5)
                                            .rotationEffect(.degrees(-10))
                                        
                                        // Middle curve
                                        RoundedRectangle(cornerRadius: 1)
                                            .fill(Color.white)
                                            .frame(width: 7, height: 1.5)
                                            .rotationEffect(.degrees(-8))
                                        
                                        // Bottom curve
                                        RoundedRectangle(cornerRadius: 1)
                                            .fill(Color.white)
                                            .frame(width: 6, height: 1.5)
                                            .rotationEffect(.degrees(-6))
                                    }
                                    .offset(x: -0.5, y: 0)
                                }
                            } else if currentMusicApp == .appleMusic {
                                // Apple Music badge with the music note icon
                                ZStack {
                                    Circle()
                                        .fill(Color(red: 0.988, green: 0.267, blue: 0.373)) // Apple Music pink
                                        .frame(width: 16, height: 16)
                                    
                                    // Apple Music's music note icon (simplified)
                                    ZStack {
                                        // Note stem
                                        RoundedRectangle(cornerRadius: 0.5)
                                            .fill(Color.white)
                                            .frame(width: 1, height: 8)
                                            .offset(x: 2, y: -1)
                                        
                                        // Note head (circle)
                                        Circle()
                                            .fill(Color.white)
                                            .frame(width: 3, height: 3)
                                            .offset(x: 0, y: 2)
                                        
                                        // Eighth note flag
                                        Path { path in
                                            path.move(to: CGPoint(x: 2.5, y: -5))
                                            path.addCurve(to: CGPoint(x: 5, y: -2),
                                                        control1: CGPoint(x: 4, y: -4.5),
                                                        control2: CGPoint(x: 5, y: -3))
                                            path.addLine(to: CGPoint(x: 2.5, y: -1))
                                        }
                                        .fill(Color.white)
                                    }
                                    .scaleEffect(0.7)
                                }
                            }
                        }
                        .offset(x: -3, y: -3) // Position badge in bottom-right corner with some padding
                    }
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
                        .stroke(currentMusicApp.borderColor, lineWidth: 2)
                )
        )
        .onTapGesture {
            openCurrentMusicApp()
        }
        .onAppear {
            updateCurrentTrackInfo()
        }
        .onChange(of: vm.hasActiveMusic) { hasMusic in
            if hasMusic {
                print("🎵 Music became active - updating track info")
                updateCurrentTrackInfo()
            } else {
                print("🎵 Music became inactive - clearing track info")
                // Clear track info when no music is active
                DispatchQueue.main.async {
                    songTitle = "Unknown Track"
                    artistName = "Unknown Artist"
                    albumArtwork = nil
                    currentMusicApp = .unknown
                }
            }
        }
        .onChange(of: vm.isMusicPlaying) { isPlaying in
            print("🎵 Music playing state changed to: \(isPlaying) - force updating track info")
            // Always update track info when playing state changes
            updateCurrentTrackInfo()
            
            // Add a small delay and update again to ensure we get the correct app
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                print("🎵 Delayed track info update after playing state change")
                updateCurrentTrackInfo()
            }
        }
            }
        }
    }
    
    private func openCurrentMusicApp() {
        // Open the currently detected music app
        switch currentMusicApp {
        case .appleMusic:
            NSWorkspace.shared.launchApplication("Music")
            print("🎵 Opening Apple Music")
        case .spotify:
            NSWorkspace.shared.launchApplication("Spotify")
            print("🎵 Opening Spotify")
        case .unknown:
            // Fallback - try to open the default music app
            NSWorkspace.shared.launchApplication("Music")
            print("🎵 Opening default Music app")
        }
    }
    
    private func isAppleMusicRunning() -> Bool {
        let script = """
        tell application "System Events"
            return (name of processes) contains "Music"
        end tell
        """
        
        var error: NSDictionary?
        if let scriptObject = NSAppleScript(source: script) {
            let output = scriptObject.executeAndReturnError(&error)
            return output.booleanValue
        }
        return false
    }
    
    private func isSpotifyRunning() -> Bool {
        let script = """
        tell application "System Events"
            return (name of processes) contains "Spotify"
        end tell
        """
        
        var error: NSDictionary?
        if let scriptObject = NSAppleScript(source: script) {
            let output = scriptObject.executeAndReturnError(&error)
            return output.booleanValue
        }
        return false
    }
    
    private func sendMediaCommand(_ commandType: MediaCommandType) {
        // Track the button press for visual feedback
        lastButtonPressed = commandType
        buttonPressTime = Date()
        
        // Send command to the appropriate music app
        switch currentMusicApp {
        case .appleMusic:
            sendAppleMusicCommand(commandType)
        case .spotify:
            sendSpotifyCommand(commandType)
        case .unknown:
            // Try both as fallback
            if isAppleMusicRunning() {
                sendAppleMusicCommand(commandType)
            } else if isSpotifyRunning() {
                sendSpotifyCommand(commandType)
            }
        }
    }
    
    private func sendAppleMusicCommand(_ commandType: MediaCommandType) {
        switch commandType {
        case .play:
            executeAppleScript("tell application \"Music\" to play")
        case .pause:
            executeAppleScript("tell application \"Music\" to pause")
        case .nextTrack:
            executeAppleScript("tell application \"Music\" to next track")
        case .previousTrack:
            executeAppleScript("tell application \"Music\" to previous track")
        }
    }
    
    private func sendSpotifyCommand(_ commandType: MediaCommandType) {
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
        // First try to get track info from AppleScript (Apple Music or Spotify)
        getCurrentTrackFromAppleScript()
        
        // Fallback to system media player info if AppleScript fails
        let nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo
        
        if songTitle == "Unknown Track" && artistName == "Unknown Artist" {
            if let info = nowPlayingInfo {
                songTitle = info[MPMediaItemPropertyTitle] as? String ?? "Unknown Track"
                artistName = info[MPMediaItemPropertyArtist] as? String ?? "Unknown Artist"
                currentMusicApp = .unknown
                
                // Get album artwork from system media player
                if let artwork = info[MPMediaItemPropertyArtwork] as? MPMediaItemArtwork {
                    albumArtwork = artwork.image(at: CGSize(width: 300, height: 300))
                }
                
                // Get playback state
                let playbackRate = info[MPNowPlayingInfoPropertyPlaybackRate] as? Double ?? 0.0
                isPlaying = playbackRate > 0.0
            }
        }
        
        // If we still don't have artwork but we have system media info, try to get it
        if albumArtwork == nil, let info = nowPlayingInfo {
            if let artwork = info[MPMediaItemPropertyArtwork] as? MPMediaItemArtwork {
                albumArtwork = artwork.image(at: CGSize(width: 300, height: 300))
                print("🎵 Got artwork from system media info as fallback")
            }
        }
        
        // hasActiveMusic is now managed at the higher level, no need to set it here
    }
    
    private func getCurrentTrackFromAppleScript() {
        print("🎵 getCurrentTrackFromAppleScript - Current music playing: \(vm.isMusicPlaying)")
        
        // Check which app is actually playing by directly querying both apps
        let spotifyPlaying = checkSpotifyPlayingState()
        let appleMusicPlaying = checkAppleMusicPlayingState()
        
        print("🎵 Direct app check - Spotify playing: \(spotifyPlaying), Apple Music playing: \(appleMusicPlaying)")
        
        // Prioritize the app that's actually playing
        if appleMusicPlaying && !spotifyPlaying {
            print("🎵 Apple Music is playing, Spotify is not - getting Apple Music track")
            if !tryGetTrackFromAppleMusic() {
                print("🎵 Apple Music failed, trying Spotify as fallback")
                tryGetTrackFromSpotify()
            }
        } else if spotifyPlaying && !appleMusicPlaying {
            print("🎵 Spotify is playing, Apple Music is not - getting Spotify track")
            tryGetTrackFromSpotify()
        } else if appleMusicPlaying && spotifyPlaying {
            print("🎵 Both apps claim to be playing - checking system media for priority")
            // Both claim to be playing - use system media to determine which is actually active
            let nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo
            if let systemTitle = nowPlayingInfo?[MPMediaItemPropertyTitle] as? String, !systemTitle.isEmpty {
                print("🎵 System media title: '\(systemTitle)'")
                // Try both apps and compare titles
                
                // Get Apple Music track info
                let appleMusicSuccess = tryGetTrackFromAppleMusic()
                let appleMusicTitle = appleMusicSuccess ? songTitle : ""
                
                // Get Spotify track info
                tryGetTrackFromSpotify()
                let spotifyTitle = songTitle
                
                // Compare which title matches system media better
                if !appleMusicTitle.isEmpty && (systemTitle.contains(appleMusicTitle) || appleMusicTitle.contains(systemTitle)) {
                    print("🎵 System media matches Apple Music better: '\(appleMusicTitle)' vs '\(spotifyTitle)'")
                    if !tryGetTrackFromAppleMusic() {
                        tryGetTrackFromSpotify()
                    }
                } else if !spotifyTitle.isEmpty {
                    print("🎵 Using Spotify track: '\(spotifyTitle)'")
                    // Spotify track is already set
                } else {
                    print("🎵 Both apps failed, using fallback")
                    if !tryGetTrackFromAppleMusic() {
                        tryGetTrackFromSpotify()
                    }
                }
            } else {
                // No system media info, default to Apple Music since it was detected as playing
                print("🎵 No system media info, defaulting to Apple Music")
                if !tryGetTrackFromAppleMusic() {
                    tryGetTrackFromSpotify()
                }
            }
        } else {
            // Neither is playing or both are paused - try Apple Music first (better for paused content)
            print("🎵 Neither app is playing - trying Apple Music first for paused content")
            if !tryGetTrackFromAppleMusic() {
                print("🎵 Apple Music failed, trying Spotify for paused content")
                tryGetTrackFromSpotify()
            }
        }
    }
    
    // Helper functions to check playing state without affecting the main detection logic
    private func checkSpotifyPlayingState() -> Bool {
        let script = """
        tell application "System Events"
            if (name of processes) contains "Spotify" then
                tell application "Spotify"
                    try
                        return (player state as string) is equal to "playing"
                    on error
                        return false
                    end try
                end tell
            else
                return false
            end if
        end tell
        """
        
        var error: NSDictionary?
        if let scriptObject = NSAppleScript(source: script) {
            let output = scriptObject.executeAndReturnError(&error)
            return output.booleanValue
        }
        return false
    }
    
    private func checkAppleMusicPlayingState() -> Bool {
        let script = """
        tell application "System Events"
            if (name of processes) contains "Music" then
                tell application "Music"
                    try
                        return (player state as string) is equal to "playing"
                    on error
                        return false
                    end try
                end tell
            else
                return false
            end if
        end tell
        """
        
        var error: NSDictionary?
        if let scriptObject = NSAppleScript(source: script) {
            let output = scriptObject.executeAndReturnError(&error)
            return output.booleanValue
        }
        return false
    }
    
    private func tryGetTrackFromAppleMusic() -> Bool {
        print("🎵 === TRYING TO GET APPLE MUSIC TRACK INFO ===")
        
        let appleMusicScript = """
            tell application "Music"
                if it is running then
                    try
                        set trackName to name of current track
                        set artistName to artist of current track
                        set albumName to album of current track
                        set playerState to player state
                        set trackKind to kind of current track
                        
                        -- Try to get more info for iTunes Store content
                        try
                            set trackLocation to location of current track
                            set locationInfo to trackLocation as string
                        on error
                            set locationInfo to "no-location"
                        end try
                        
                        -- Build detailed response
                        set trackInfo to trackName & "|" & artistName & "|" & albumName & "|" & "apple-music-artwork" & "|" & (playerState as string) & "|" & trackKind & "|" & locationInfo
                        
                        return trackInfo
                    on error errMsg
                        -- Fallback for iTunes Store or other issues
                        return "Apple Music|Unknown Artist|Unknown Album|apple-music-artwork|playing|iTunes Store|error: " & errMsg
                    end try
                else
                    return "Music not running"
                end if
            end tell
        """
        
        var error: NSDictionary?
        if let appleScript = NSAppleScript(source: appleMusicScript) {
            let result = appleScript.executeAndReturnError(&error)
            
            if error == nil, let output = result.stringValue {
                print("🎵 Apple Music AppleScript result: \(output)")
                
                let components = output.components(separatedBy: "|")
                if components.count >= 5 {
                    let trackName = components[0]
                    let artist = components[1] 
                    let album = components[2]
                    let playerState = components[4]
                    let trackKind = components.count > 5 ? components[5] : "unknown"
                    let location = components.count > 6 ? components[6] : "no-location"
                    
                    print("🎵 Track details:")
                    print("🎵   Name: '\(trackName)'")
                    print("🎵   Artist: '\(artist)'")
                    print("🎵   Album: '\(album)'")
                    print("🎵   State: '\(playerState)'")
                    print("🎵   Kind: '\(trackKind)'")
                    print("🎵   Location: '\(location)'")
                    
                    // Handle empty or missing track info (common with iTunes Store previews)
                    if trackName.isEmpty || trackName == "Apple Music" {
                        print("🎵 ⚠️ Empty track name detected - might be iTunes Store preview")
                        songTitle = "iTunes Store Preview"
                        artistName = "Apple Music"
                    } else {
                        songTitle = trackName
                        artistName = artist.isEmpty ? "Unknown Artist" : artist
                    }
                    
                    isPlaying = playerState.contains("playing")
                    currentMusicApp = .appleMusic
                    
                    print("🎵 ✅ Final track info: '\(songTitle)' by '\(artistName)'")
                    
                    // Get artwork from system media info for Apple Music
                    getAppleMusicArtwork()
                    
                    return true
                } else {
                    print("🎵 ❌ Invalid Apple Music response format: \(components.count) components")
                }
            } else {
                print("🎵 ❌ Apple Music AppleScript error: \(error?.description ?? "Unknown error")")
            }
        } else {
            print("🎵 ❌ Failed to create Apple Music AppleScript")
        }
        return false
    }
    
    private func getAppleMusicArtwork() {
        print("🎵 === GETTING APPLE MUSIC ARTWORK ===")
        
        // Try to get artwork from MPNowPlayingInfoCenter
        if let nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo {
            print("🎵 System media info available")
            
            // Log all available media info for debugging
            for (key, value) in nowPlayingInfo {
                print("🎵 Media info - \(key): \(value)")
            }
            
            // Check if we have track title/artist from system media (might be more accurate for iTunes Store)
            if let systemTitle = nowPlayingInfo[MPMediaItemPropertyTitle] as? String,
               let systemArtist = nowPlayingInfo[MPMediaItemPropertyArtist] as? String,
               !systemTitle.isEmpty, !systemArtist.isEmpty {
                print("🎵 Found better track info from system media:")
                print("🎵   System Title: '\(systemTitle)'")
                print("🎵   System Artist: '\(systemArtist)'")
                
                // Use system media info if it's more complete than AppleScript result
                if songTitle == "iTunes Store Preview" || songTitle == "Apple Music" || songTitle.isEmpty {
                    print("🎵 ✅ Using system media info instead of AppleScript")
                    DispatchQueue.main.async {
                        self.songTitle = systemTitle
                        self.artistName = systemArtist
                    }
                }
            }
            
            if let artwork = nowPlayingInfo[MPMediaItemPropertyArtwork] as? MPMediaItemArtwork {
                let artworkImage = artwork.image(at: CGSize(width: 300, height: 300))
                DispatchQueue.main.async {
                    self.albumArtwork = artworkImage
                    print("🎵 ✅ Successfully got Apple Music artwork from system media info")
                }
                return
            } else {
                print("🎵 ❌ No artwork available in system media info")
            }
        } else {
            print("🎵 ❌ No system media info available")
        }
        
        // If no artwork found, use the app-specific fallback (which is now handled in the UI)
        print("🎵 Using app-specific fallback artwork")
        DispatchQueue.main.async {
            self.albumArtwork = nil
        }
    }
    
    private func tryGetTrackFromSpotify() {
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
                    currentMusicApp = .spotify
                    
                    // Track info retrieved successfully
                    print("🎵 Got Spotify track: \(songTitle) by \(artistName)")
                    
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

// MARK: - YouTube Video Player
struct YouTubeVideoPlayer: NSViewRepresentable {
    let embedURL: String
    
    func makeNSView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        
        // Configure for video playback with sound
        configuration.allowsAirPlayForMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        
        // Set user agent to avoid mobile YouTube version
        configuration.applicationNameForUserAgent = "Version/14.1.2 Safari/605.1.15"
        
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        
        // Allow sound playback
        webView.allowsMagnification = false
        webView.allowsBackForwardNavigationGestures = false
        
        // Load the YouTube embed URL
        if let url = URL(string: embedURL) {
            let request = URLRequest(url: url)
            webView.load(request)
        }
        
        return webView
    }
    
    func updateNSView(_ nsView: WKWebView, context: Context) {
        // Update if URL changes
        if let currentURL = nsView.url?.absoluteString,
           currentURL != embedURL,
           let newURL = URL(string: embedURL) {
            let request = URLRequest(url: newURL)
            nsView.load(request)
        }
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator()
    }
    
    class Coordinator: NSObject, WKNavigationDelegate {
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            // Wait a moment for the video to load, then unmute it
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                // Unmute the video and ensure it's playing with sound
                let unmuteScript = """
                    // Find the video element and unmute it
                    var video = document.querySelector('video');
                    if (video) {
                        video.muted = false;
                        video.volume = 0.7; // Set to 70% volume
                        
                        // Try to play with sound
                        video.play().then(() => {
                            console.log('Video playing with sound');
                        }).catch(e => {
                            console.log('Autoplay failed, user interaction required');
                        });
                    }
                    
                    // Also try YouTube player API if available
                    if (typeof YT !== 'undefined' && YT.Player) {
                        var iframe = document.querySelector('iframe');
                        if (iframe) {
                            try {
                                iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
                                iframe.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[70]}', '*');
                            } catch(e) {
                                console.log('YouTube API not available');
                            }
                        }
                    }
                """
                
                webView.evaluateJavaScript(unmuteScript) { result, error in
                    if let error = error {
                        print("📺 Error unmuting video: \(error)")
                    } else {
                        print("📺 Video unmuted successfully")
                    }
                }
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
                `;
                document.head.appendChild(style);
            """
            
            webView.evaluateJavaScript(css, completionHandler: nil)
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

#Preview {
    NotchContentView(vm: .init())
        .frame(width: 850, height: 150, alignment: .center)
        .background(.black)
        .preferredColorScheme(.dark)
}
