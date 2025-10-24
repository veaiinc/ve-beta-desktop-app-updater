//
//  TabSelectionView.swift
//  boringNotch
//
//  Created by Hugo Persson on 2024-08-25.
//

import Foundation
import SwiftUI
import LucideIcons

enum TabDisplayStyle {
    case homeIcon
    case shelfIcon
    case emailIcon
    case systemSymbol(name: String)
    case textLabel(String)
}

struct TabModel: Identifiable {
    let id = UUID()
    let label: String
    let displayStyle: TabDisplayStyle
    let view: NotchViews
}

let tabs = [
    TabModel(label: "Listen", displayStyle: .textLabel("Listen"), view: .meeting),
    TabModel(label: "Email", displayStyle: .textLabel("Mail"), view: .email),
    // TabModel(label: "Shelf", displayStyle: .textLabel("Tray"), view: .shelf),
    TabModel(label: "Ask", displayStyle: .textLabel("Ask"), view: .ask)
]


private struct TabItem: View {
    let tab: TabModel
    let selected: Bool
    let animation: Namespace.ID
    let onTap: () -> Void
    @State private var isHovering = false

    // Reduce padding for text tabs (Listen, Ask) to bring them closer together
    private var horizontalPadding: CGFloat {
        switch tab.displayStyle {
        case .textLabel:
            return 8
        default:
            return 12
        }
    }
    
    var body: some View {
        TabButton(selected: selected, onClick: onTap) {
            if selected {
                HStack(alignment: .center, spacing: 0) {
                    TabContentView(tab: tab, isSelected: selected)
                }
                .padding(.horizontal, horizontalPadding)
                .padding(.vertical, 2)
                .frame(height: 24, alignment: .center)
                .background(Color.white.opacity(0.1))
                .cornerRadius(24)
                .overlay(
                    RoundedRectangle(cornerRadius: 24)
                        .inset(by: 0.25)
                        .stroke(Color.white.opacity(0.4), lineWidth: 0.5)
                )
            } else {
                HStack(alignment: .center, spacing: 0) {
                    TabContentView(tab: tab, isSelected: selected)
                }
                .padding(.horizontal, horizontalPadding)
                .padding(.vertical, 2)
                .frame(height: 24, alignment: .center)
                .background(isHovering ? Color(red: 1, green: 1, blue: 1).opacity(0.12) : Color.clear)
                .cornerRadius(24)
                .onHover { hovering in
                    isHovering = hovering
                }
            }
        }
        .frame(height: 26)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text(tab.label))
    }
}

private struct TabContentView: View {
    let tab: TabModel
    let isSelected: Bool
    
    private var iconColor: Color {
        .white
    }
    
    var body: some View {
        switch tab.displayStyle {
        case .homeIcon:
            #if canImport(AppKit)
            if let houseIcon = NSImage.image(lucideId: "house") {
                Image(nsImage: houseIcon)
                    .renderingMode(.template)
                    .foregroundColor(iconColor)
                    .frame(width: 13, height: 13)
            }
            #endif
        case .emailIcon:
            #if canImport(AppKit)
            if let emailIcon = NSImage.image(lucideId: "mail") {
                Image(nsImage: emailIcon)
                    .renderingMode(.template)
                    .foregroundColor(iconColor)
                    .frame(width: 13, height: 13)
            }
            #endif
        case .shelfIcon:
            #if canImport(AppKit)
            if let inboxIcon = NSImage.image(lucideId: "inbox") {
                Image(nsImage: inboxIcon)
                    .renderingMode(.template)
                    .foregroundColor(iconColor)
                    .frame(width: 13, height: 13)
            }
            #endif
        case .systemSymbol(let name):
            Image(systemName: name)
                .font(.system(size: 21, weight: .semibold))
                .foregroundColor(iconColor)
        case .textLabel(let text):
            Text(text)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.white)
                .lineLimit(1)
                .fixedSize(horizontal: true, vertical: false)
        }
    }
}

private struct HomeTabIcon: View {
    let strokeColor: Color
    
    var body: some View {
        GeometryReader { geometry in
            let minSide = min(geometry.size.width, geometry.size.height)
            let scale = minSide / 14.0
            let offsetX = (geometry.size.width - minSide) / 2.0
            let offsetY = (geometry.size.height - minSide) / 2.0
            
            let baseTransform = CGAffineTransform.identity
                .scaledBy(x: scale, y: scale)
            
            let translatedOutline = homeOutline
                .applying(baseTransform)
                .offsetBy(dx: offsetX, dy: offsetY)
            
            let translatedDoor = homeDoor
                .applying(baseTransform)
                .offsetBy(dx: offsetX, dy: offsetY)
            
            ZStack {
                translatedOutline.stroke(
                    strokeColor,
                    style: StrokeStyle(
                        lineWidth: 1.16667 * scale,
                        lineCap: .round,
                        lineJoin: .round
                    )
                )
                translatedDoor.stroke(
                    strokeColor,
                    style: StrokeStyle(
                        lineWidth: 1.16667 * scale,
                        lineCap: .round,
                        lineJoin: .round
                    )
                )
            }
        }
        .frame(width: 14, height: 14)
    }
    
    private var homeOutline: Path {
        var path = Path()
        path.move(to: CGPoint(x: 1.75, y: 5.83492))
        path.addCurve(
            to: CGPoint(x: 1.85838, y: 5.34358),
            control1: CGPoint(x: 1.74996, y: 5.6652),
            control2: CGPoint(x: 1.78694, y: 5.49753)
        )
        path.addCurve(
            to: CGPoint(x: 2.16358, y: 4.94358),
            control1: CGPoint(x: 1.92981, y: 5.18964),
            control2: CGPoint(x: 2.03397, y: 5.05313)
        )
        path.addLine(to: CGPoint(x: 6.24692, y: 1.44358))
        path.addCurve(
            to: CGPoint(x: 7.0, y: 1.16797),
            control1: CGPoint(x: 6.45749, y: 1.26561),
            control2: CGPoint(x: 6.72429, y: 1.16797)
        )
        path.addCurve(
            to: CGPoint(x: 7.75308, y: 1.44358),
            control1: CGPoint(x: 7.27571, y: 1.16797),
            control2: CGPoint(x: 7.54251, y: 1.26561)
        )
        path.addLine(to: CGPoint(x: 11.8364, y: 4.94358))
        path.addCurve(
            to: CGPoint(x: 12.1416, y: 5.34358),
            control1: CGPoint(x: 11.966, y: 5.05313),
            control2: CGPoint(x: 12.0702, y: 5.18964)
        )
        path.addCurve(
            to: CGPoint(x: 12.25, y: 5.83492),
            control1: CGPoint(x: 12.2131, y: 5.49753),
            control2: CGPoint(x: 12.25, y: 5.6652)
        )
        path.addLine(to: CGPoint(x: 12.25, y: 11.0849))
        path.addCurve(
            to: CGPoint(x: 11.9083, y: 11.9099),
            control1: CGPoint(x: 12.25, y: 11.3943),
            control2: CGPoint(x: 12.1271, y: 11.6911)
        )
        path.addCurve(
            to: CGPoint(x: 11.0833, y: 12.2516),
            control1: CGPoint(x: 11.6895, y: 12.1287),
            control2: CGPoint(x: 11.3928, y: 12.2516)
        )
        path.addLine(to: CGPoint(x: 2.91667, y: 12.2516))
        path.addCurve(
            to: CGPoint(x: 2.09171, y: 11.9099),
            control1: CGPoint(x: 2.60725, y: 12.2516),
            control2: CGPoint(x: 2.3105, y: 12.1287)
        )
        path.addCurve(
            to: CGPoint(x: 1.75, y: 11.0849),
            control1: CGPoint(x: 1.87292, y: 11.6911),
            control2: CGPoint(x: 1.75, y: 11.3943)
        )
        path.addLine(to: CGPoint(x: 1.75, y: 5.83492))
        path.closeSubpath()
        return path
    }
    
    private var homeDoor: Path {
        var path = Path()
        path.move(to: CGPoint(x: 8.75, y: 12.2516))
        path.addLine(to: CGPoint(x: 8.75, y: 7.58492))
        path.addCurve(
            to: CGPoint(x: 8.57915, y: 7.17244),
            control1: CGPoint(x: 8.75, y: 7.43021),
            control2: CGPoint(x: 8.68854, y: 7.28183)
        )
        path.addCurve(
            to: CGPoint(x: 8.16667, y: 7.00158),
            control1: CGPoint(x: 8.46975, y: 7.06304),
            control2: CGPoint(x: 8.32138, y: 7.00158)
        )
        path.addLine(to: CGPoint(x: 5.83333, y: 7.00158))
        path.addCurve(
            to: CGPoint(x: 5.42085, y: 7.17244),
            control1: CGPoint(x: 5.67862, y: 7.00158),
            control2: CGPoint(x: 5.53025, y: 7.06304)
        )
        path.addCurve(
            to: CGPoint(x: 5.25, y: 7.58492),
            control1: CGPoint(x: 5.31146, y: 7.28183),
            control2: CGPoint(x: 5.25, y: 7.43021)
        )
        path.addLine(to: CGPoint(x: 5.25, y: 12.2516))
        return path
    }
}

// New custom Shelf icon, scaled to match 14x14 canvas like HomeTabIcon
// Commented out since we're now using text "tray" instead of the icon
/*
private struct ShelfTabIcon: View {
    let strokeColor: Color
    
    var body: some View {
        GeometryReader { geometry in
            let minSide = min(geometry.size.width, geometry.size.height)
            let scale = minSide / 14.0
            let offsetX = (geometry.size.width - minSide) / 2.0
            let offsetY = (geometry.size.height - minSide) / 2.0
            
            let lw = 1.16667 * scale
            let stroke = StrokeStyle(lineWidth: lw, lineCap: .round, lineJoin: .round)
            
            // Helper to transform SVG-space points (14x14) into our local geometry
            let pt: (CGFloat, CGFloat) -> CGPoint = { x, y in
                CGPoint(x: offsetX + x * scale, y: offsetY + y * scale)
            }
            
            ZStack {
                // Top path: 12.8346 7 -> 9.3346 7 -> 8.168 8.75 -> 5.8346 8.75 -> 4.668 7 -> 1.168 7
                Path { p in
                    p.move(to: pt(12.8346, 7.0))
                    p.addLine(to: pt(9.33464, 7.0))
                    p.addLine(to: pt(8.16797, 8.75))
                    p.addLine(to: pt(5.83464, 8.75))
                    p.addLine(to: pt(4.66797, 7.0))
                    p.addLine(to: pt(1.16797, 7.0))
                }
                .stroke(strokeColor, style: stroke)
                
                // Bottom container (rounded rectangle) approximating V10.5 ... H11.668 ...
                Path { p in
                    let rect = CGRect(
                        x: offsetX + 1.16797 * scale,
                        y: offsetY + 7.0 * scale,
                        width: (12.8346 - 1.16797) * scale,
                        height: (11.6667 - 7.0) * scale
                    )
                    p.addRoundedRect(in: rect, cornerSize: CGSize(width: 1.2 * scale, height: 1.2 * scale))
                }
                .stroke(strokeColor, style: stroke)
                
                // Lid slants: approximate the top housing from left/right supports
                Path { p in
                    p.move(to: pt(1.16797, 7.0))
                    p.addLine(to: pt(3.18, 2.98083))
                    p.move(to: pt(12.8346, 7.0))
                    p.addLine(to: pt(10.8221, 2.98083))
                    // top edge hint
                    p.move(to: pt(4.22464, 2.33333))
                    p.addLine(to: pt(9.77797, 2.33333))
                }
                .stroke(strokeColor, style: stroke)
            }
        }
        .frame(width: 14, height: 14)
    }
}
*/


struct TabSelectionView: View, WebSocketEventListener {
    @EnvironmentObject var vm: BoringViewModel
    @ObservedObject var coordinator = BoringViewCoordinator.shared
    @StateObject private var webSocketManager = WebSocketManager.shared
    @ObservedObject private var musicManager = MusicManager.shared
    @Namespace var animation
    @State var meetingLoading: Bool = false
    @State private var wasMusicPlayingBeforeRecording: Bool = false
    @State private var hasResumedMusic: Bool = false
    
    // MARK: - Universal Music Control Functions
    /// Checks if music is actually playing and pauses it if so.
    /// Only sets wasMusicPlayingBeforeRecording to true if music was actually detected and paused.
    /// This prevents automatically resuming music that the user had manually paused before starting the meeting.
    private func checkAndPauseMusic() async {
        print("🎵 ===== MUSIC DETECTION START =====")
        print("🎵 Checking for any music playing across all applications...")
        
        // Reset the resume flag for new meeting
        hasResumedMusic = false
        
        var musicWasPlaying = false
        
        // Method 1: Check the current active music controller
        print("🎵 Method 1 - Active controller check:")
        print("🎵   - musicManager.isPlaying: \(musicManager.isPlaying)")
        print("🎵   - musicManager.bundleIdentifier: \(musicManager.bundleIdentifier ?? "nil")")
        
        if musicManager.isPlaying {
            print("🎵   ✅ Music detected via active controller - pausing")
            musicWasPlaying = true
            musicManager.pause()
        } else {
            print("🎵   ❌ No music detected via active controller")
        }
        
        // Method 2: Try universal NowPlaying controller for any app supporting Now Playing
        print("🎵 Method 2 - NowPlaying controller check:")
        if let nowPlayingController = createUniversalNowPlayingController() {
            let isNowPlayingActive = nowPlayingController.playbackState.isPlaying
            print("🎵   - nowPlayingController.playbackState.isPlaying: \(isNowPlayingActive)")
            print("🎵   - nowPlayingController.playbackState.bundleIdentifier: \(nowPlayingController.playbackState.bundleIdentifier)")
            
            if isNowPlayingActive {
                print("🎵   ✅ Music detected via NowPlaying controller - pausing")
                await nowPlayingController.pause()
                musicWasPlaying = true
            } else {
                print("🎵   ❌ No music detected via NowPlaying controller")
            }
        } else {
            print("🎵   ❌ Could not create NowPlaying controller")
        }
        
        // Method 3: Try pausing common music apps directly via AppleScript
        // DISABLED: AppleScript approach can cause unexpected behavior and might resume music
        print("🎵 Method 3 - AppleScript pause check: DISABLED")
        // let musicPausedViaApps = await pauseCommonMusicApps()
        // print("🎵   - musicPausedViaApps: \(musicPausedViaApps)")
        // if musicPausedViaApps {
        //     musicWasPlaying = true
        // }
        print("🎵   - AppleScript approach disabled to prevent unexpected behavior")
        
        wasMusicPlayingBeforeRecording = musicWasPlaying
        print("🎵 ===== MUSIC DETECTION COMPLETE =====")
        print("🎵 Final result - wasMusicPlayingBeforeRecording: \(musicWasPlaying)")
        print("🎵 ======================================")
    }
    
    private func resumeMusicIfNeeded() async {
        print("🎵 ===== MUSIC RESUME CHECK =====")
        print("🎵 wasMusicPlayingBeforeRecording: \(wasMusicPlayingBeforeRecording)")
        print("🎵 hasResumedMusic: \(hasResumedMusic)")
        
        // Prevent multiple resume attempts
        if hasResumedMusic {
            print("🎵 ❌ Music already resumed, skipping duplicate call")
            return
        }
        
        if wasMusicPlayingBeforeRecording {
            print("🎵 ✅ Resuming music after recording stopped (music was playing before meeting started)")
            
            // Try to resume using the active controller first
            print("🎵   - Attempting resume via musicManager.play()")
            musicManager.play()
            
            // Also try universal NowPlaying controller
            if let nowPlayingController = createUniversalNowPlayingController() {
                print("🎵   - Attempting resume via NowPlaying controller")
                await nowPlayingController.play()
            }
            
            hasResumedMusic = true
            wasMusicPlayingBeforeRecording = false
            print("🎵 ✅ Music resume attempts completed")
        } else {
            print("🎵 ❌ Not resuming music - music was not playing before meeting started (user had paused it)")
            hasResumedMusic = true // Mark as processed even if not resuming
        }
        print("🎵 ==============================")
    }
    
    // MARK: - Universal Music Detection Helper
    private func createUniversalNowPlayingController() -> NowPlayingController? {
        // Create a NowPlayingController for universal music control
        // This works with any app that supports Now Playing (most music apps)
        return NowPlayingController()
    }
    
    // MARK: - Common Music Apps Pause
    private func pauseCommonMusicApps() async -> Bool {
        print("🎵   - Checking for running music apps...")
        
        // List of common music app bundle identifiers
        let commonMusicApps = [
            "com.apple.Music",
            "com.spotify.client", 
            "com.google.Chrome", // YouTube Music in browser
            "com.microsoft.edgemac", // YouTube Music in Edge
            "org.mozilla.firefox", // YouTube Music in Firefox
            "com.apple.Safari", // YouTube Music in Safari
            "com.tidal.desktop",
            "com.soundcloud.desktop",
            "com.deezer.Deezer",
            "com.amazon.music",
            "com.pandora.desktop"
        ]
        
        var musicWasPaused = false
        
        // Check which apps are running and try to pause them
        let runningApps = NSWorkspace.shared.runningApplications
        let runningMusicApps = runningApps.filter { app in
            guard let bundleId = app.bundleIdentifier else { return false }
            return commonMusicApps.contains(bundleId)
        }
        
        print("🎵   - Found \(runningMusicApps.count) running music apps")
        
        for app in runningMusicApps {
            if let bundleId = app.bundleIdentifier {
                print("🎵   - Found running music app: \(bundleId)")
                let wasPaused = await pauseAppIfPlaying(bundleId)
                if wasPaused {
                    musicWasPaused = true
                }
            }
        }
        
        print("🎵   - AppleScript pause result: \(musicWasPaused)")
        return musicWasPaused
    }
    
    private func pauseAppIfPlaying(_ bundleIdentifier: String) async -> Bool {
        print("🎵     - Attempting to pause app: \(bundleIdentifier)")
        
        // Use AppleScript to pause specific music apps
        let script: String
        
        switch bundleIdentifier {
        case "com.apple.Music":
            script = "tell application \"Music\" to pause"
        case "com.spotify.client":
            script = "tell application \"Spotify\" to pause"
        case "com.google.Chrome", "com.microsoft.edgemac", "org.mozilla.firefox", "com.apple.Safari":
            // For browser-based music, we can't easily pause without knowing the specific tab
            // This is a limitation, but the NowPlaying controller should handle most cases
            print("🎵     - Skipping browser app (can't pause without specific tab)")
            return false
        default:
            // For other apps, try a generic approach
            script = "tell application \"\(bundleIdentifier)\" to pause"
        }
        
        print("🎵     - Executing AppleScript: \(script)")
        
        do {
            try await AppleScriptHelper.executeVoid(script)
            print("🎵     ✅ Successfully paused \(bundleIdentifier)")
            return true
        } catch {
            print("🎵     ❌ Failed to pause \(bundleIdentifier): \(error)")
            return false
        }
    }
    
    var body: some View {
        Group {
            // Show Home tab + MeetingButtons when meeting is active and in meeting view
            if  coordinator.currentView == .meeting {
                
                HStack(spacing:4){
                    // Add MeetingButtons
                    MeetingButtons()
                
            }
                
            } else {
                // Show all tabs normally
                HStack(spacing: 6) {
                    ForEach(tabs) { tab in
                        TabItem(
                            tab: tab,
                            selected: coordinator.currentView == tab.view,
                            animation: animation,
                            onTap: {
                                withAnimation(.smooth) {
                                    coordinator.currentView = tab.view
                                    
                                    // Send START_MEETING message when Listen tab is clicked
                                    if tab.view == .meeting {
                                        // Check and pause music before starting recording
                                        Task {
                                            await checkAndPauseMusic()
                                        }
                                        // Set loading state immediately if no meeting is ongoing
                                    if !coordinator.isMeetingStarted {
                                        
                                        if vm.isNotchLocked != true {
                                            vm.toggleNotchLock()
                                        }
                                        
                                        coordinator.isMeetingLoading = true
                                    }
                                    
                                    // Check workspace suspension before starting meeting
                                    // This will either navigate to pricing page if suspended or start the meeting
                                    vm.checkWorkspaceSuspensionAndStartMeeting()
                                    }
                                    
                                    if tab.view == .meeting || tab.view == .ask {
                                        DispatchQueue.main.async {
                                            if let window = NSApplication.shared.windows.first(where: { $0 is BoringNotchWindow }) {
                                                window.makeKeyAndOrderFront(nil)
                                            }
                                        }
                                    }
                                    
                                    // Send message to Electron to show Ask AI window when Ask tab is clicked
                                    if tab.view == .ask {
                                        print("🎯 TabSelectionView: Ask tab clicked - triggering Electron Ask AI window")
                                        
                                        // Send command to Electron via WebSocket to show Ask AI window
                                        webSocketManager.sendEvent(type: .showAskAIWindow, data: [
                                            "source": "boring-notch",
                                            "timestamp": Int(Date().timeIntervalSince1970 * 1000)
                                        ])
                                    }
                                }
                            }
                        )
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        .onAppear {
            // Register for WebSocket events to detect when recording stops
            webSocketManager.addEventListener(self)
        }
        .onDisappear {
            // Unregister from WebSocket events
            webSocketManager.removeEventListener(self)
        }
    }
    
    // MARK: - WebSocketEventListener Implementation
    
    func onWebSocketEvent(_ event: WebSocketEvent) {
        switch event.type {
        case .recordingStopped, .meetingStopped:
            // Resume music when recording/meeting stops
            Task {
                await resumeMusicIfNeeded()
            }
        case .workspaceModeResponse:
            // Handle workspace mode response
            if let data = event.data as? [String: Any],
               let mode = data["mode"] as? String {
                vm.handleWorkspaceModeResponse(mode)
            } else {
                // If no mode data, assume not suspended and start meeting
                vm.handleWorkspaceModeResponse(nil)
            }
        case .updateUIState:
            // Handle UI state update from Electron
            let data = event.data
            if let state = data["state"] as? String {
                if state == "home" {
                    // Update coordinator to show home view
                    DispatchQueue.main.async {
                        coordinator.currentView = .home
                        coordinator.isMeetingLoading = false
                        coordinator.isMeetingStarted = false
                    }
                }
            }   
        case .boringNotchMessage:
            // Handle BORING_NOTCH_MESSAGE from Electron (wrapped messages)
            let data = event.data
            if let messageType = data["type"] as? String,
               messageType == "UPDATE_UI_STATE" {
                if let messageData = data["data"] as? [String: Any],
                   let state = messageData["state"] as? String {
                    if state == "home" {
                        // Send a test message back to Electron to confirm WebSocket is working
                        WebSocketManager.shared.sendEvent(type: .testMessage, data: ["message": "UI state update received"])
                        
                        // Update coordinator to show home view
                        DispatchQueue.main.async {
                            
                            coordinator.currentView = .home
                            coordinator.isMeetingLoading = false
                            coordinator.isMeetingStarted = false
                            
                            // Force UI update by triggering objectWillChange
                            coordinator.objectWillChange.send()

                        }
                    }
                }
            }
        default:
            break
        }
    }
}

#Preview {
    BoringHeader().environmentObject(BoringViewModel())
}
