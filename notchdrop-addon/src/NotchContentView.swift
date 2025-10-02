
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
                   Text("Hello I’m Ve")
                .font(.custom("Urbanist", size: 54)) // Use actual font name
                .kerning(-0.03 * 54) // -3% of font size = -1.62
                .lineSpacing(-4) // Optional: Adjust if you want total line height to be close to 50px
                .foregroundColor(.white)

                    // Text("Please log in to access features")
                    //     .font(.system(size: 14, weight: .regular))
                    //     .foregroundColor(.white.opacity(0.8))
                    
                    // Test buttons
                    HStack(spacing: 8) {
                        Button("LOGIN") {
                            vm.navigateToMainScreen(path: "/verify-user")
                        }
                        .font(.custom("Urbanist", size: 14))
                        .foregroundColor(.white)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        // .background(Color.blue.opacity(0.3))
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
                                // Home button → default home; also exit Teams view
                                Button(action: {
                                    vm.isTeamsView = false
                                    vm.navigateToMainScreen(path: nil)
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
                                            .fill(vm.isTeamsView ? Color.clear : Color(red: 0.69, green: 0.97, blue: 0.84))
                                    )
                                }
                                .buttonStyle(PlainButtonStyle())

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
                                            .fill(vm.isTeamsView ? Color(red: 0.69, green: 0.97, blue: 0.84) : Color.clear)
                                    )
                                }
                                .buttonStyle(PlainButtonStyle())
                                // Removed desktop and VE icons per request
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
                            // VE icon with border styling (first icon)
                            Button(action: {
                                vm.resetToNotchHome()
                            }) {
                                VEIcon(color: .white)
                                    .frame(width: 16, height: 16)
                                    .padding(8) // Increased padding for larger clickable area
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 6) // Slightly larger corner radius
                                            .stroke(Color.white.opacity(0.15), lineWidth: 0.5)
                                    )
                            }
                            .buttonStyle(PlainButtonStyle())
                            .help("VE")
                            
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
                            
                            // Lock/Unlock button (third icon)
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
                            }
                            .buttonStyle(PlainButtonStyle())
                            .help(vm.isNotchLocked ? "Unlock Notch" : "Lock Notch")
                        }
                    }
                    
                    
                    // Main content area
                    HStack(alignment: .center, spacing: 8) {
                        if vm.isTeamsView {
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
                        } else if vm.showVoiceInterface {
                            // Voice split layout (left conversation, right controls)
                            VoiceSplitLayout(vm: vm)
                        } else {
                            // Chat input section with voice/arrow icon inside - matches image layout
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
                                    // Boring Notch Style Calendar - always show when not in chat mode and not recording
                                    BoringNotchCalendarWithPermissions()
                                        .transition(.scale.combined(with: .opacity))
                                        
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
        // Check each browser separately for better reliability
        let browsers = ["Safari", "Google Chrome", "Firefox", "Microsoft Edge", "Arc", "Brave Browser"]
        
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
                        if isChatInputFocused {
                            // Arrow mode - submit chat
                            print("🎯 Arrow button clicked - submitting chat")
                            if !vm.isSendingMessage && !chatInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                                vm.submitChat()
                            }
                        } else {
                            // Voice mode - activate voice assistant
                            print("🎤 Voice button clicked - activating voice assistant")
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
                            WaveIcon(color: .white)
                                .frame(width: 16, height: 16)
                        }
                    }
                    .buttonStyle(PlainButtonStyle())
                    .padding(.trailing, 8)
                    .padding(.bottom, 8)
                    .contentShape(Rectangle()) // Ensure button area is properly defined
                    .allowsHitTesting(true) // Ensure button can receive taps
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
                    // Default state - frosted circular button with icon and label
                    ZStack {
                        Circle()
                            .fill(DynamicIslandTheme.cardMaterial)
                            .frame(width: 100, height: 100)
                            .shadow(color: Color.black.opacity(0.25), radius: 8, x: 0, y: 2)
                            .overlay(
                                Circle()
                                    .stroke(Color.white.opacity(0.18), lineWidth: 1.5)
                                    .blur(radius: 0.3)
                            )
                        VStack(spacing: 10) {
                            WebcamIcon(color: .white)
                                .frame(width: 28, height: 28)
                            Text("WEBCAM")
                                .font(.system(size: 13, weight: .semibold))
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
            // Large album artwork (left side)
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

#Preview {
    NotchContentView(vm: .init())
        .frame(width: 850, height: 150, alignment: .center)
        .background(.black)
        .preferredColorScheme(.dark)
}
