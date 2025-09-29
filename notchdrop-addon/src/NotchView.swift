//
//  NotchView.swift
//  NotchDrop
//
//  Created by 秋星桥 on 2024/7/7.
//

import SwiftUI

struct NotchView: View {
    @StateObject var vm: NotchViewModel

    @State var dropTargeting: Bool = false
    @State private var isHoveringNotch: Bool = false

    var notchSize: CGSize {
        switch vm.status {
        case .closed:
            var ans = CGSize(
                width: vm.deviceNotchRect.width - 4,
                height: vm.deviceNotchRect.height - 4
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
                } else if vm.hasActiveMusic {
                    // Music is playing - show album art on left and wave animation on right
                    MusicCollapsedIndicator()
                } else {
                    Text("")//empty state
                        .font(.system(size: 9, weight: .regular))
                        .foregroundColor(.white)
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                }
            }
            .frame(maxWidth: notchSize.width - 16, maxHeight: notchSize.height - 8)
            .clipped()
            .opacity(vm.status == .closed ? 1 : 0) // Fade out when opening
            .scaleEffect(vm.status == .closed ? 1 : 0.8) // Scale down when opening
            .animation(.easeInOut(duration: 0.25), value: vm.status) // Smooth transition
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
                .scale.combined(
                    with: .opacity
                ).combined(
                    with: .offset(y: -vm.notchOpenedSize.height / 2)
                ).animation(vm.animation)
            )
        }
        .background(dragDetector)
        .animation(vm.animation, value: vm.status)
        .animation(vm.animation, value: vm.isChatExpanded)
        .animation(.easeInOut(duration: 0.3), value: vm.isRecording) // Smooth recording state transition
        .animation(.easeInOut(duration: 0.3), value: vm.isPaused) // Smooth pause state transition
        .preferredColorScheme(.dark)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    }

    var notch: some View {
        Rectangle()
            .foregroundStyle(.black)
            .mask(notchBackgroundMaskGroup)
            .frame(
                width: notchSize.width + notchCornerRadius * 2,
                height: notchSize.height
            )
            .shadow(
                color: .black.opacity(([.opened, .popping].contains(vm.status) && !vm.showNotificationOverlay) ? 1 : 0),
                radius: 16
            )
            // Soft glows for states (approximate box-shadow) - disabled during notifications
            .shadow(
                color: (vm.controlledByDynamicIsland && !vm.showNotificationOverlay) ? DynamicIslandTheme.primaryGreen.opacity(0.2) : .clear,
                radius: (vm.controlledByDynamicIsland && !vm.showNotificationOverlay) ? 8 : 0
            )
            .shadow(
                color: (vm.isChatMode && !vm.showNotificationOverlay) ? DynamicIslandTheme.primaryGreen.opacity(0.3) : .clear,
                radius: (vm.isChatMode && !vm.showNotificationOverlay) ? 12 : 0
            )
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
    
    // Music indicator for collapsed state - album art + wave animation
    struct MusicCollapsedIndicator: View {
        @State private var currentAlbumArt: NSImage? = nil
        @State private var phase: CGFloat = 0
        
        var body: some View {
            HStack(spacing: 8) {
                // Album artwork on the left
                Group {
                    if let artwork = currentAlbumArt {
                        Image(nsImage: artwork)
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: 16, height: 16)
                            .clipShape(RoundedRectangle(cornerRadius: 3))
                    } else {
                        RoundedRectangle(cornerRadius: 3)
                            .fill(LinearGradient(
                                colors: [Color.blue.opacity(0.6), Color.purple.opacity(0.6)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ))
                            .frame(width: 16, height: 16)
                            .overlay(
                                Image(systemName: "music.note")
                                    .font(.system(size: 8))
                                    .foregroundColor(.white.opacity(0.8))
                            )
                    }
                }
                .animation(.easeInOut(duration: 0.3), value: currentAlbumArt != nil)
                
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
                // Start wave animation
                withAnimation(.easeInOut(duration: 1.2).repeatForever(autoreverses: true)) {
                    phase = .pi
                }
                
                // Get current album artwork
                getCurrentAlbumArt()
                
                // Update album art periodically
                Timer.scheduledTimer(withTimeInterval: 3.0, repeats: true) { _ in
                    getCurrentAlbumArt()
                }
            }
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
            .foregroundStyle(Color.black.opacity(0.001)) // fuck you apple and 0.001 is the smallest we can have
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
