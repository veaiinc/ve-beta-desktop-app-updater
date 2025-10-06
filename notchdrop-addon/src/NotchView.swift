//
//  NotchView.swift
//  NotchDrop
//  Created by 秋星桥 on 2024/7/7.
//

import SwiftUI

struct NotchView: View {
    @StateObject var vm: NotchViewModel

    @State var dropTargeting: Bool = false
	@State private var isHoveringNotch: Bool = false
    @State private var hoverScale: CGFloat = 1.0
    @State private var hoverGlow: CGFloat = 0.0
	@State private var isQuitting: Bool = false

    var notchSize: CGSize {
        switch vm.status {
        case .closed:
            // Fixed base dimensions with MacBook Pro scaling
            let isMacBookPro = vm.deviceNotchRect.width > 180
            let baseWidth: CGFloat = 343  // Fixed base width for better TemporaryFolder display
            let baseHeight: CGFloat = 48  // Fixed base height for better TemporaryFolder display
            
            // Make it bigger for MacBook Pro
            let widthMultiplier: CGFloat = isMacBookPro ? 1.2 : 1.0  // 20% larger for MacBook Pro
            var ans = CGSize(
                width: baseWidth * widthMultiplier,
                height: baseHeight * widthMultiplier
            )
            if ans.width < 0 { ans.width = 0 }
            if ans.height < 0 { ans.height = 0 }
            return ans
        case .opened:
            return vm.notchOpenedSize
        case .popping:
            return .init(
                width: vm.deviceNotchRect.width,
                height: vm.deviceNotchRect.height + 4
            )
        }
    }

    var notchCornerRadius: CGFloat {
        switch vm.status {
        case .closed: DynamicIslandTheme.collapsedRadius
        case .opened: DynamicIslandTheme.expandedRadius
        case .popping: 10
        }
    }
    
    var collapsedContentText: String {
        if vm.isRecording {
            if vm.isPaused {
                return "Paused \(vm.formatTime(vm.timer))"
            }
            return "Recording \(vm.formatTime(vm.timer))"
        } else {
            return "" //empty state
        }
    }

    var body: some View {
        ZStack(alignment: .top) {
            notch
                .zIndex(0)
                .disabled(true)
                .opacity(vm.notchVisible ? 1 : 0.3)
            
            // Collapsed state content - always present but with smooth transitions
            HStack(spacing: 6) {
                if vm.isRecording {
                    Text(vm.isPaused ? "Paused \(vm.formatTime(vm.timer))" : "Recording \(vm.formatTime(vm.timer))")
                        .font(.system(size: 9, weight: .medium))
                        .foregroundColor(DynamicIslandTheme.primaryGreen)
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                    if !vm.isPaused {
                        CollapsedAudioViz()
                    }
                } else if vm.showVoiceInterface {
                    Text("Voice Agent")
                        .font(.system(size: 9, weight: .regular))
                        .foregroundColor(.white)
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                } else if vm.hasActiveMusic || vm.hasActiveVideo {
                    // Media is playing - show appropriate indicator
                    if vm.hasActiveMusic && vm.hasActiveVideo {
                        // Both music and video - show combined indicator
                        MediaCollapsedIndicator(vm: vm, showMusic: vm.hasActiveMusic, showVideo: vm.hasActiveVideo)
                    } else if vm.hasActiveMusic {
                        // Music only - show music indicator
                        MediaCollapsedIndicator(vm: vm, showMusic: vm.hasActiveMusic, showVideo: false)
                    } else {
                        // Video only - show video indicator
                        MediaCollapsedIndicator(vm: vm, showMusic: false, showVideo: vm.hasActiveVideo)
                    }
                } else if vm.isAuthenticated {
                    // Show TemporaryFolder component in empty state only when authenticated
                    TemporaryFolderView()
                }
                // When not authenticated, show nothing in collapsed state
            }
            .frame(maxWidth: notchSize.width - 16, maxHeight: notchSize.height - 4)
            .clipped()
            .opacity(vm.status == .closed ? 1 : 0) // Fade out when opening
            .scaleEffect(vm.status == .closed ? 1 : 0.9) // Subtle scale down when opening
            .animation(DynamicIslandTheme.hoverAnimation, value: vm.status) // Ultra-smooth transition
            .zIndex(1)
            
            Group {
                if vm.status == .opened {
                    VStack(spacing: vm.spacing) {
                        // Header is not part of the JS Dynamic Island design; keep for non-normal modes
                        if vm.contentType != .normal {
                            NotchHeaderView(vm: vm)
                        }
                        NotchContentView(vm: vm)
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                    }
                    .padding(vm.spacing)
                    .frame(maxWidth: vm.notchOpenedSize.width, maxHeight: vm.notchOpenedSize.height)
                    .zIndex(1)
                }
            }
            .transition(
                .asymmetric(
                    // NotchNook-style open: quick scale up then settle
                    insertion: .scale(scale: 0.88, anchor: .center)
                        .combined(with: .opacity)
                        .combined(with: .offset(y: -12))
                        .animation(DynamicIslandTheme.bounceAnimation),
                    // Smooth close: slight down and fade
                    removal: .scale(scale: 0.92, anchor: .center)
                        .combined(with: .opacity)
                        .combined(with: .offset(y: 8))
                        .animation(DynamicIslandTheme.expansionAnimation)
                )
            )
        }
		.background(dragDetector)
		.opacity(isQuitting ? 0 : 1)
		.animation(.easeInOut(duration: 0.2), value: isQuitting)
        .contextMenu {
			Button(action: {
				withAnimation(.easeInOut(duration: 0.2)) {
					isQuitting = true
				}
				vm.notchClose()
				DispatchQueue.main.asyncAfter(deadline: .now() + 0.22) {
					NSApp.terminate(nil)
				}
			}) {
                Label("Quit Notch", systemImage: "xmark.circle.fill")
            }
        }
        .animation(DynamicIslandTheme.expansionAnimation, value: vm.status)
        .animation(DynamicIslandTheme.smoothEaseInOut, value: vm.isChatExpanded)
        .animation(DynamicIslandTheme.smoothEaseInOut, value: vm.isRecording) // Smooth recording state transition
        .animation(DynamicIslandTheme.smoothEaseInOut, value: vm.isPaused) // Smooth pause state transition
        .animation(.easeInOut(duration: 0.3), value: vm.isTrayMode) // Smooth tray mode transition
        .preferredColorScheme(.dark)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    }

    var notch: some View {
        Rectangle()
            .foregroundStyle(.regularMaterial)
            .mask(notchBackgroundMaskGroup)
            .frame(
                width: notchSize.width + notchCornerRadius * 2 + sidePulseOffset,
                height: notchSize.height
            )
            .scaleEffect(vm.status == .closed ? hoverScale : 1.02) // Dynamic hover scale
            .animation(DynamicIslandTheme.hoverAnimation, value: vm.status)
            .animation(DynamicIslandTheme.hoverAnimation, value: hoverScale)
            .shadow(
                color: .black.opacity(([.opened, .popping].contains(vm.status) && !vm.showNotificationOverlay) ? 1 : 0),
                radius: 16
            )
            // Enhanced professional glows
            .shadow(
                color: (vm.controlledByDynamicIsland && !vm.showNotificationOverlay) ? DynamicIslandTheme.primaryGreen.opacity(0.3) : .clear,
                radius: (vm.controlledByDynamicIsland && !vm.showNotificationOverlay) ? 12 : 0
            )
            .shadow(
                color: (vm.isChatMode && !vm.showNotificationOverlay) ? DynamicIslandTheme.primaryGreen.opacity(0.4) : .clear,
                radius: (vm.isChatMode && !vm.showNotificationOverlay) ? 16 : 0
            )
            // Professional hover glow effect
            .shadow(
                color: (vm.status == .opened && !vm.showNotificationOverlay) ? DynamicIslandTheme.primaryGreen.opacity(0.1 + hoverGlow * 0.1) : .clear,
                radius: (vm.status == .opened && !vm.showNotificationOverlay) ? 20 + hoverGlow * 10 : 0
            )
            .onHover { hovering in
                withAnimation(hovering ? DynamicIslandTheme.sideBounceKick : DynamicIslandTheme.sideBounceReturn) {
                    hoverScale = hovering ? 1.05 : 1.0
                    hoverGlow = hovering ? 1.0 : 0.0
                    isHoveringNotch = hovering
                }
            }
    }

    // Side bounce pulse during hover-open
    private var sidePulseOffset: CGFloat {
        guard vm.status == .opened else { return 0 }
        // small width wobble to sell the bubbly feel
        return isHoveringNotch ? 6 : 0
    }

    // Mini collapsed audio visualizer (5 bars) - matches CSS animation
    struct CollapsedAudioViz: View {
        @State private var phase: CGFloat = 0
        var body: some View {
            HStack(spacing: 0.5) {
                ForEach(0..<5, id: \.self) { i in
                    let base: CGFloat = 4
                    let peak: CGFloat = 7
                    let progress = abs(sin((phase + CGFloat(i) * 0.4)))
                    let h = base + (peak - base) * progress
                    RoundedRectangle(cornerRadius: 0.5)
                        .fill(DynamicIslandTheme.primaryGreen)
                        .frame(width: 1.5, height: h)
                        .opacity(0.7 + (0.3 * progress)) // Match CSS opacity animation
                        .animation(
                            .easeInOut(duration: 1.5)
                            .repeatForever(autoreverses: true)
                            .delay(Double(i) * 0.2), // Match CSS animation delays
                            value: phase
                        )
                }
            }
            .onAppear {
                withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) {
                    phase = .pi
                }
            }
        }
    }
    
    // Media indicator for collapsed state - supports both music and video
    struct MediaCollapsedIndicator: View {
        let vm: NotchViewModel
        let showMusic: Bool
        let showVideo: Bool
        @State private var currentAlbumArt: NSImage? = nil
        @State private var phase: CGFloat = 0
        @State private var playbackPollTimer: Timer? = nil
        @State private var waveTimer: Timer? = nil
        
        var body: some View {
            HStack(spacing: 6) {
                // Media indicators on the left
                HStack(spacing: 4) {
                    // Music indicator
                    if showMusic {
                        Group {
                            if let artwork = currentAlbumArt {
                                Image(nsImage: artwork)
                                    .resizable()
                                    .aspectRatio(contentMode: .fill)
                                    .frame(width: 14, height: 14)
                                    .clipShape(RoundedRectangle(cornerRadius: 2))
                            } else {
                                RoundedRectangle(cornerRadius: 2)
                                    .fill(LinearGradient(
                                        colors: [Color.blue.opacity(0.6), Color.purple.opacity(0.6)],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    ))
                                    .frame(width: 14, height: 14)
                                    .overlay(
                                        Image(systemName: "music.note")
                                            .font(.system(size: 7))
                                            .foregroundColor(.white.opacity(0.8))
                                    )
                            }
                        }
                        .animation(.easeInOut(duration: 0.3), value: currentAlbumArt != nil)
                    }
                    
                    // Video indicator  
                    if showVideo {
                        RoundedRectangle(cornerRadius: 2)
                            .fill(LinearGradient(
                                colors: [Color.red.opacity(0.7), Color.orange.opacity(0.5)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ))
                            .frame(width: 14, height: 14)
                            .overlay(
                                Image(systemName: "play.rectangle.fill")
                                    .font(.system(size: 7))
                                    .foregroundColor(.white.opacity(0.8))
                            )
                    }
                }
                
                Spacer()
                
                // Wave animation on the right
                HStack(spacing: 1) {
                    ForEach(0..<4, id: \.self) { i in
                        let base: CGFloat = 3
                        let peak: CGFloat = 8
                        let progress = abs(sin((phase + CGFloat(i) * 0.6)))
                        let h = base + (peak - base) * progress
                        RoundedRectangle(cornerRadius: 0.5)
                            .fill(.white.opacity(0.7))
                            .frame(width: 1.5, height: h)
                            .animation(
                                .easeInOut(duration: 1.2)
                                .repeatForever(autoreverses: true)
                                .delay(Double(i) * 0.15),
                                value: phase
                            )
                    }
                }
            }
            .onAppear {
                // Start/stop wave animation based on closed state and real playback
                updateWave(active: vm.status == .closed && (vm.isMusicPlaying || vm.isVideoPlaying))
                
                // Get current album artwork (only if showing music)
                if showMusic {
                    getCurrentAlbumArt()
                    
                    // Update album art periodically
                    Timer.scheduledTimer(withTimeInterval: 3.0, repeats: true) { _ in
                        getCurrentAlbumArt()
                    }
                }

                // Lightweight polling to keep collapsed indicator in sync
                playbackPollTimer?.invalidate()
                playbackPollTimer = Timer.scheduledTimer(withTimeInterval: 1.5, repeats: true) { _ in
                    updateWave(active: vm.status == .closed && (vm.isMusicPlaying || vm.isVideoPlaying))
                }
            }
            .onChange(of: vm.status) { _, newStatus in
                updateWave(active: newStatus == .closed && (vm.isMusicPlaying || vm.isVideoPlaying))
            }
            .onChange(of: vm.isMusicPlaying) { _, isPlaying in
                updateWave(active: vm.status == .closed && (isPlaying || vm.isVideoPlaying))
            }
            .onChange(of: vm.isVideoPlaying) { _, isPlaying in
                updateWave(active: vm.status == .closed && (isPlaying || vm.isMusicPlaying))
            }
            .onDisappear {
                playbackPollTimer?.invalidate()
                playbackPollTimer = nil
                stopWave()
            }
            .onChange(of: vm.hasActiveMusic) { _, _ in
                updateWave(active: vm.status == .closed && (vm.isMusicPlaying || vm.isVideoPlaying))
            }
        }
        
        private func startWave() {
            stopWave()
            // Drive phase manually for reliable animation
            waveTimer = Timer.scheduledTimer(withTimeInterval: 1.0 / 30.0, repeats: true) { _ in
                phase += 0.2
                if phase > .pi * 2 { phase = 0 }
            }
        }
        
        private func stopWave() {
            waveTimer?.invalidate()
            waveTimer = nil
            phase = 0
        }
        
        private func updateWave(active: Bool) {
            if active {
                startWave()
            } else {
                stopWave()
            }
        }

        private func systemIsPlaying() -> Bool {
            // Prefer view model's playback state to avoid MediaPlayer import in this file
            return vm.isMusicPlaying
        }
        
        private func getCurrentAlbumArt() {
            // Try to get album artwork from Spotify
            let spotifyScript = """
                tell application "Spotify"
                    if it is running then
                        try
                            set artworkURL to artwork url of current track
                            return artworkURL
                        on error
                            return "missing value"
                        end try
                    end if
                end tell
            """
            
            if let appleScript = NSAppleScript(source: spotifyScript) {
                var error: NSDictionary?
                let result = appleScript.executeAndReturnError(&error)
                
                if error == nil, let urlString = result.stringValue,
                   !urlString.isEmpty && urlString != "missing value",
                   let url = URL(string: urlString) {
                    
                    // Download artwork in background
                    DispatchQueue.global(qos: .background).async {
                        do {
                            let data = try Data(contentsOf: url)
                            if let image = NSImage(data: data) {
                                DispatchQueue.main.async {
                                    self.currentAlbumArt = image
                                }
                            }
                        } catch {
                            // Failed to download, keep current artwork or fallback
                        }
                    }
                }
            }
        }
    }

    var notchBackgroundMaskGroup: some View {
        Rectangle()
            .foregroundStyle(.black)
            .frame(
                width: notchSize.width,
                height: notchSize.height
            )
            .clipShape(.rect(
                bottomLeadingRadius: notchCornerRadius,
                bottomTrailingRadius: notchCornerRadius
            ))
            .overlay {
                ZStack(alignment: .topTrailing) {
                    Rectangle()
                        .frame(width: notchCornerRadius, height: notchCornerRadius)
                        .foregroundStyle(.black)
                    Rectangle()
                        .clipShape(.rect(topTrailingRadius: notchCornerRadius))
                        .foregroundStyle(.white)
                        .frame(
                            width: notchCornerRadius + vm.spacing,
                            height: notchCornerRadius + vm.spacing
                        )
                        .blendMode(.destinationOut)
                }
                .compositingGroup()
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                .offset(x: -notchCornerRadius - vm.spacing + 0.5, y: -0.5)
            }
            .overlay {
                ZStack(alignment: .topLeading) {
                    Rectangle()
                        .frame(width: notchCornerRadius, height: notchCornerRadius)
                        .foregroundStyle(.black)
                    Rectangle()
                        .clipShape(.rect(topLeadingRadius: notchCornerRadius))
                        .foregroundStyle(.white)
                        .frame(
                            width: notchCornerRadius + vm.spacing,
                            height: notchCornerRadius + vm.spacing
                        )
                        .blendMode(.destinationOut)
                }
                .compositingGroup()
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topTrailing)
                .offset(x: notchCornerRadius + vm.spacing - 0.5, y: -0.5)
            }
    }

    @ViewBuilder
    var dragDetector: some View {
        RoundedRectangle(cornerRadius: notchCornerRadius)
            .foregroundStyle(.regularMaterial.opacity(0.001)) // Use material background with minimal opacity for hit testing
            .contentShape(Rectangle())
            .frame(width: notchSize.width + vm.dropDetectorRange, height: notchSize.height + vm.dropDetectorRange)
            .onDrop(of: [.data], isTargeted: $dropTargeting) { _ in true }
            .onChange(of: dropTargeting) { oldValue, isTargeted in
                if isTargeted, vm.status == .closed {
                    // Open the notch when a file is dragged over it
                    vm.notchOpen(.drag)
                    vm.hapticSender.send()
                } else if !isTargeted {
                    // Close the notch when the dragged item leaves the area
                    let mouseLocation: NSPoint = NSEvent.mouseLocation
                    if !vm.notchOpenedRect.insetBy(dx: vm.inset, dy: vm.inset).contains(mouseLocation) {
                        vm.notchClose()
                    }
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    }
}

