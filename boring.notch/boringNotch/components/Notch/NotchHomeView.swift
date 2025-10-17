//
//  NotchHomeView.swift
//  boringNotch
//
//  Created by Hugo Persson on 2024-08-18.
//  Modified by Harsh Vardhan Goswami & Richard Kunkli & Mustafa Ramadan
//

import Combine
import Defaults
import SwiftUI

// MARK: - Voice Interface Components

struct VoiceInterfaceView: View {
    @ObservedObject var vm: BoringViewModel
    
    var body: some View {
        VStack(spacing: 0) {
            // Voice controls at the top
            VoiceTopControls(vm: vm)
            
            // Voice transcription area
            VoiceTranscriptionArea(vm: vm)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.clear)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

struct VoiceTopControls: View {
    @ObservedObject var vm: BoringViewModel
    
    var body: some View {
        HStack(spacing: 16) {
                // Left side: Mute/Unmute toggle
                Button(action: {
                    print("🎤 Mute button clicked - current state: \(vm.isMicrophoneMuted)")
                    vm.toggleVoiceMute()
                    print("🎤 After toggle - new state: \(vm.isMicrophoneMuted)")
                    
                    // Send direct command to Electron via stdin (this will be processed by the spawned process)
                    let directCommand = """
                    {"type": "electron_voice_mute", "isMuted": \(vm.isMicrophoneMuted), "timestamp": \(Int(Date().timeIntervalSince1970 * 1000)), "source": "boring-notch"}
                    """
                    print(directCommand)
                    fflush(stdout)
                }) {
                Image(systemName: vm.isMicrophoneMuted ? "mic.slash.fill" : "mic.fill")
                    .font(.system(size: 16))
                    .foregroundColor(vm.isMicrophoneMuted ? Color.red : Color.green)
                    .frame(width: 24, height: 24)
            }
            .buttonStyle(PlainButtonStyle())
            
                // Cancel/Disconnect button
                Button(action: {
                    print("❌ Cancel button clicked - disconnecting voice agent")
                    
                    // Send direct command to Electron via stdin (this will be processed by the spawned process)
                    let directCommand = """
                    {"type": "electron_voice_disconnect", "timestamp": \(Int(Date().timeIntervalSince1970 * 1000)), "source": "boring-notch"}
                    """
                    print(directCommand)
                    fflush(stdout)
                    
                    // Only deactivate UI after sending the disconnect command
                    vm.deactivateVoiceInterface()
                }) {
                Image(systemName: "xmark")
                    .font(.system(size: 16))
                    .foregroundColor(.white)
                    .frame(width: 24, height: 24)
            }
            .buttonStyle(PlainButtonStyle())
            
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
    }
}

struct VoiceTranscriptionArea: View {
    @ObservedObject var vm: BoringViewModel

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
            
                // Add wave animation at the bottom when voice is active (Exact NotchDrop Implementation)
                if vm.voiceConnectionStatus == .connected {
                    VoiceWaveAnimation(
                        isActive: !vm.isMicrophoneMuted,
                        isMuted: vm.isMicrophoneMuted,
                        aiIntensity: vm.aiResponseIntensity
                    )
                    .frame(width: 301, height: 16)
                    .padding(.bottom, 8)
                }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.clear)
    }
}

// MARK: - Music Player Components

struct MusicPlayerView: View {
    @EnvironmentObject var vm: BoringViewModel
    let albumArtNamespace: Namespace.ID
    let showShuffleAndRepeat: Bool

    var body: some View {
        HStack {
            AlbumArtView(vm: vm, albumArtNamespace: albumArtNamespace).padding(.all, 5)
            MusicControlsView(showShuffleAndRepeat: showShuffleAndRepeat).drawingGroup().compositingGroup()
        }
    }
}

struct AlbumArtView: View {
    @ObservedObject var musicManager = MusicManager.shared
    @ObservedObject var vm: BoringViewModel
    let albumArtNamespace: Namespace.ID

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            if Defaults[.lightingEffect] {
                albumArtBackground
            }
            albumArtButton
        }
    }

    private var albumArtBackground: some View {
        Color.clear
            .aspectRatio(1, contentMode: .fit)
            .background(
                Image(nsImage: musicManager.albumArt)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            )
            .clipped()
            .clipShape(
                RoundedRectangle(
                    cornerRadius: Defaults[.cornerRadiusScaling]
                        ? MusicPlayerImageSizes.cornerRadiusInset.opened
                        : MusicPlayerImageSizes.cornerRadiusInset.closed)
            )
            .scaleEffect(x: 1.3, y: 1.4)
            .rotationEffect(.degrees(92))
            .blur(radius: 40)
            .opacity(musicManager.isPlaying ? 0.5 : 0)
    }

    private var albumArtButton: some View {
        ZStack {
            Button {
                musicManager.openMusicApp()
            } label: {
                ZStack(alignment:.bottomTrailing) {
                    albumArtImage
                    appIconOverlay
                }
            }
            .buttonStyle(PlainButtonStyle())
            .scaleEffect(musicManager.isPlaying ? 1 : 0.85)
            
            albumArtDarkOverlay
        }
    }

    private var albumArtDarkOverlay: some View {
        Rectangle()
            .aspectRatio(1, contentMode: .fit)
            .foregroundColor(Color.black)
            .opacity(musicManager.isPlaying ? 0 : 0.8)
            .blur(radius: 50)
    }
                

    private var albumArtImage: some View {
        Color.clear
            .aspectRatio(1, contentMode: .fit)
            .background(
                Image(nsImage: musicManager.albumArt)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .animation(
                        .spring(response: 0.4, dampingFraction: 0.8), value: musicManager.isFlipping
                    )
            )
            .clipped()
            .clipShape(
                RoundedRectangle(
                    cornerRadius: Defaults[.cornerRadiusScaling]
                        ? MusicPlayerImageSizes.cornerRadiusInset.opened
                        : MusicPlayerImageSizes.cornerRadiusInset.closed)
            )
            .matchedGeometryEffect(id: "albumArt", in: albumArtNamespace)
    }

    @ViewBuilder
    private var appIconOverlay: some View {
        if vm.notchState == .open && !musicManager.usingAppIconForArtwork {
            AppIcon(for: musicManager.bundleIdentifier ?? "com.apple.Music")
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: 30, height: 30)
                .offset(x: 10, y: 10)
                .transition(.scale.combined(with: .opacity).animation(.bouncy.delay(0.3)))
        }
    }
}

struct MusicControlsView: View {
    @ObservedObject var musicManager = MusicManager.shared
    @State private var sliderValue: Double = 0
    @State private var dragging: Bool = false
    @State private var lastDragged: Date = .distantPast
    let showShuffleAndRepeat: Bool

    var body: some View {
        VStack(alignment: .leading) {
            songInfoAndSlider
            playbackControls
        }
        .buttonStyle(PlainButtonStyle())
        .frame(minWidth: Defaults[.showMirror] && Defaults[.showCalendar] ? 140 : 180)
    }

    private var songInfoAndSlider: some View {
        GeometryReader { geo in
            VStack(alignment: .leading, spacing: 4) {
                songInfo(width: geo.size.width)
                musicSlider
            }
        }
        .padding(.top, 10)
        .padding(.leading, 5)
    }

    private func songInfo(width: CGFloat) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            MarqueeText(
                $musicManager.songTitle, font: .headline, nsFont: .headline, textColor: .white,
                frameWidth: width)
            MarqueeText(
                $musicManager.artistName,
                font: .headline,
                nsFont: .headline,
                textColor: Defaults[.playerColorTinting]
                    ? Color(nsColor: musicManager.avgColor)
                        .ensureMinimumBrightness(factor: 0.6) : .gray,
                frameWidth: width
            )
            .fontWeight(.medium)
        }
    }

    private var musicSlider: some View {
        TimelineView(.animation(minimumInterval: musicManager.playbackRate > 0 ? 0.1 : nil)) {
            timeline in
            MusicSliderView(
                sliderValue: $sliderValue,
                duration: $musicManager.songDuration,
                lastDragged: $lastDragged,
                color: musicManager.avgColor,
                dragging: $dragging,
                currentDate: timeline.date,
                timestampDate: musicManager.timestampDate,
                elapsedTime: musicManager.elapsedTime,
                playbackRate: musicManager.playbackRate,
                isPlaying: musicManager.isPlaying
            ) { newValue in
                MusicManager.shared.seek(to: newValue)
            }
            .padding(.top, 5)
            .frame(height: 36)
        }
    }

    private var playbackControls: some View {
        HStack(spacing: 8) {
            if showShuffleAndRepeat {
                HoverButton(
                    icon: "shuffle", iconColor: musicManager.isShuffled ? .red : .white,
                    scale: .medium
                ) {
                    MusicManager.shared.toggleShuffle()
                }
            }
            HoverButton(icon: "backward.fill", scale: .medium) {
                MusicManager.shared.previousTrack()
            }
            HoverButton(icon: musicManager.isPlaying ? "pause.fill" : "play.fill", scale: .large) {
                MusicManager.shared.togglePlay()
            }
            HoverButton(icon: "forward.fill", scale: .medium) {
                MusicManager.shared.nextTrack()
            }
            if showShuffleAndRepeat {
                HoverButton(icon: repeatIcon, iconColor: repeatIconColor, scale: .medium) {
                    MusicManager.shared.toggleRepeat()
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .center)
    }

    private var repeatIcon: String {
        switch musicManager.repeatMode {
        case .off:
            return "repeat"
        case .all:
            return "repeat"
        case .one:
            return "repeat.1"
        }
    }

    private var repeatIconColor: Color {
        switch musicManager.repeatMode {
        case .off:
            return .white
        case .all, .one:
            return .red
        }
    }
}

// MARK: - Shortcut Palette Card used beside music
private struct ShortcutPaletteCard: View {
    let title: String
    let rows: [[String]]

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(Color.white.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .stroke(Color.white.opacity(0.12), lineWidth: 1)
                )

            VStack(alignment: .leading, spacing: 10) {
                Text(title)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)

                VStack(alignment: .leading, spacing: 8) {
                    ForEach(Array(rows.enumerated()), id: \.offset) { _, row in
                        HStack(spacing: 8) {
                            ForEach(Array(row.enumerated()), id: \.offset) { _, symbol in
                                Keycap(symbol: symbol)
                            }
                        }
                    }
                }
            }
            .padding(12)
        }
    }
}

private struct Keycap: View {
    let symbol: String

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 10, style: .continuous)
                .fill(Color.white.opacity(0.06))
                .overlay(
                    RoundedRectangle(cornerRadius: 10, style: .continuous)
                        .stroke(Color.white.opacity(0.28), lineWidth: 1)
                )

            Text(symbol)
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(.white)
        }
        .frame(width: 28, height: 28)
    }
}

// MARK: - Figma-style Shortcut List Card (3 rows)
private struct ShortcutListCard: View {
    struct Row {
        let title: String
        let leftKey: String
        let rightKey: String
    }

    let rows: [Row]

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(Color.white.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .stroke(Color.white.opacity(0.12), lineWidth: 1)
                )

            Grid(horizontalSpacing: 12, verticalSpacing: 10) {
                ForEach(Array(rows.enumerated()), id: \.offset) { _, row in
                    GridRow(alignment: .center) {
                        Text(row.title)
                            .foregroundColor(.white)
                            .lineLimit(1)
                            .frame(height: 24, alignment: .leading)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .gridColumnAlignment(.leading)

                        // Flexible spacer column to push keys to the far right
                        Color.clear
                            .frame(maxWidth: .infinity, maxHeight: 1)

                        smallKeycap(row.leftKey)
                            .gridColumnAlignment(.trailing)

                        smallKeycap(row.rightKey)
                            .gridColumnAlignment(.trailing)
                    }
                }
            }
            .padding(12)
        }
    }
}

private struct ShortcutRow: View {
    let title: String
    let leftKey: String
    let rightKey: String

    var body: some View {
        HStack(spacing: 70) {
            Text(title)
                .foregroundColor(.white)
                .lineLimit(1)
                .layoutPriority(1)
                .frame(height: 24, alignment: .center)

            HStack(spacing: 8) {
                // Left keycap (empty inside like the spec)
                RoundedRectangle(cornerRadius: 4, style: .continuous)
                    .fill(Color.clear)
                    .frame(width: 18, height: 18)
                    .overlay(
                        RoundedRectangle(cornerRadius: 4)
                            .inset(by: 0.25)
                            .stroke(Color.white.opacity(0.15), lineWidth: 0.25)
                    )
                    .overlay(
                        Text(leftKey)
                            .foregroundColor(.white)
                    )

                RoundedRectangle(cornerRadius: 4, style: .continuous)
                    .fill(Color.clear)
                    .frame(width: 18, height: 18)
                    .overlay(
                        RoundedRectangle(cornerRadius: 4)
                            .inset(by: 0.25)
                            .stroke(Color.white.opacity(0.15), lineWidth: 0.25)
                    )
                    .overlay(
                        Text(rightKey)
                            .foregroundColor(.white)
                    )
            }
            .frame(width: 64, alignment: .trailing)
        }
    }
}

// MARK: - Small keycap helper (18x18) for aligned grid columns
@ViewBuilder
private func smallKeycap(_ symbol: String) -> some View {
    RoundedRectangle(cornerRadius: 4, style: .continuous)
        .fill(Color.white.opacity(0.1))
        .frame(width: 18, height: 18)
        .overlay(
            RoundedRectangle(cornerRadius: 4)
                .inset(by: 0.25)
                .stroke(Color.white.opacity(0.15), lineWidth: 0.25)
        )
        .overlay(alignment: .center) {
            Group {
                if symbol == "." {
                    Text(symbol)
                        .foregroundColor(.white)
                        .font(.system(size: 12, weight: .semibold))
                        .baselineOffset(5) // nudge dot down to optical center
                } else if symbol == "↩︎" {
                    Text(symbol)
                        .foregroundColor(.white)
                        .font(.system(size: 12, weight: .semibold))
                        .baselineOffset(-1) // nudge enter down slightly
                } else {
                    Text(symbol)
                        .foregroundColor(.white)
                        .font(.system(size: 11, weight: .semibold))
                }
            }
            .multilineTextAlignment(.center)
            .frame(width: 18, height: 18, alignment: .center)
        }
}

// MARK: - Main View

struct NotchHomeView: View {
    @EnvironmentObject var vm: BoringViewModel
    @ObservedObject var webcamManager = WebcamManager.shared
    @ObservedObject var coordinator = BoringViewCoordinator.shared
    let albumArtNamespace: Namespace.ID

    var body: some View {
        Group {
            if !coordinator.firstLaunch {
                mainContent
            }
        }
        .transition(.opacity.combined(with: .blurReplace))
    }

    private var shouldShowCamera: Bool {
        Defaults[.showMirror] && webcamManager.cameraAvailable && vm.isCameraExpanded
    }
    
    private var showShuffleAndRepeat: Bool {
        !(shouldShowCamera && Defaults[.showCalendar]) && Defaults[.showShuffleAndRepeat]
    }

    private var mainContent: some View {
        Group {
            if vm.showVoiceInterface {
                // Show voice interface when active
                VoiceInterfaceView(vm: vm)
                    .transition(.opacity.combined(with: .scale))
            } else {
                // Show normal content (calendar | centered shortcuts | music at end)
                HStack(alignment: .center, spacing: (shouldShowCamera && Defaults[.showCalendar]) ? 10 : 15) {
                            if Defaults[.showCalendar] {
                        CalendarView()
                            .frame(width: shouldShowCamera ? 170 : 215)
                            .onHover { isHovering in
                                vm.isHoveringCalendar = isHovering
                            }
                            .environmentObject(vm)
                    }

                    Spacer(minLength: 12)

            ShortcutListCard(
                rows: [
                    .init(title: "Open VE", leftKey: "⌘", rightKey: "."),
                    .init(title: "Notch", leftKey: "⌘", rightKey: "E"),
                    .init(title: "Ask Ve", leftKey: "⌘", rightKey: "↩︎"),
                ]
            )
            .frame(width: 220, height: 108)


                    if shouldShowCamera {
                        CameraPreviewView(webcamManager: webcamManager)
                            .scaledToFit()
                            .opacity(vm.notchState == .closed ? 0 : 1)
                            .blur(radius: vm.notchState == .closed ? 20 : 0)
                    }

            MusicPlayerView(albumArtNamespace: albumArtNamespace, showShuffleAndRepeat: showShuffleAndRepeat)
                .frame(maxWidth: 330) // compact music at end
                }
                .transition(.opacity.combined(with: .scale))
            }
        }
        .transition(
            .opacity.animation(.smooth.speed(0.9))
                .combined(with: .blurReplace.animation(.smooth.speed(0.9)))
                .combined(with: .move(edge: .top))
        )
        .blur(radius: vm.notchState == .closed ? 30 : 0)
    }
}

struct MusicSliderView: View {
    @Binding var sliderValue: Double
    @Binding var duration: Double
    @Binding var lastDragged: Date
    var color: NSColor
    @Binding var dragging: Bool
    let currentDate: Date
    let timestampDate: Date
    let elapsedTime: Double
    let playbackRate: Double
    let isPlaying: Bool
    var onValueChange: (Double) -> Void

    var currentElapsedTime: Double {
        // A small buffer is needed to ensure a meaningful difference between the two dates
        guard !dragging, timestampDate.timeIntervalSince(lastDragged) > -1 else {
            return sliderValue
        }
        let timeDifference = isPlaying ? currentDate.timeIntervalSince(timestampDate) : 0
        let elapsed = elapsedTime + (timeDifference * playbackRate)
        return min(elapsed, duration)
    }

    var body: some View {
        VStack {
            CustomSlider(
                value: $sliderValue,
                range: 0...duration,
                color: Defaults[.sliderColor] == SliderColorEnum.albumArt
                    ? Color(
                        nsColor: color
                    ).ensureMinimumBrightness(factor: 0.8)
                    : Defaults[.sliderColor] == SliderColorEnum.accent ? .accentColor : .white,
                dragging: $dragging,
                lastDragged: $lastDragged,
                onValueChange: onValueChange
            )
            .frame(height: 10, alignment: .center)
            HStack {
                Text(timeString(from: sliderValue))
                Spacer()
                Text(timeString(from: duration))
            }
            .fontWeight(.medium)
            .foregroundColor(
                Defaults[.playerColorTinting]
                    ? Color(nsColor: color)
                        .ensureMinimumBrightness(factor: 0.6) : .gray
            )
            .font(.caption)
        }
        .onChange(of: currentDate) {
            sliderValue = currentElapsedTime
        }
    }

    func timeString(from seconds: Double) -> String {
        let totalMinutes = Int(seconds) / 60
        let remainingSeconds = Int(seconds) % 60
        let hours = totalMinutes / 60
        let minutes = totalMinutes % 60

        if hours > 0 {
            return String(format: "%d:%02d:%02d", hours, minutes, remainingSeconds)
        } else {
            return String(format: "%d:%02d", minutes, remainingSeconds)
        }
    }
}

struct CustomSlider: View {
    @Binding var value: Double
    var range: ClosedRange<Double>
    var color: Color = .white
    @Binding var dragging: Bool
    @Binding var lastDragged: Date
    var onValueChange: ((Double) -> Void)?
    var thumbSize: CGFloat = 12

    var body: some View {
        GeometryReader { geometry in
            let width = geometry.size.width
            let height = CGFloat(dragging ? 9 : 5)
            let rangeSpan = range.upperBound - range.lowerBound

            let progress = rangeSpan == .zero ? 0 : (value - range.lowerBound) / rangeSpan
            let filledTrackWidth = min(max(progress, 0), 1) * width

            ZStack(alignment: .leading) {
                // Background track
                Rectangle()
                    .fill(.gray.opacity(0.3))
                    .frame(height: height)

                // Filled track
                Rectangle()
                    .fill(color)
                    .frame(width: filledTrackWidth, height: height)
            }
            .cornerRadius(height / 2)
            .frame(height: 10)
            .contentShape(Rectangle())
            .highPriorityGesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { gesture in
                        withAnimation {
                            dragging = true
                        }
                        let newValue =
                            range.lowerBound + Double(gesture.location.x / width) * rangeSpan
                        value = min(max(newValue, range.lowerBound), range.upperBound)
                    }
                    .onEnded { _ in
                        onValueChange?(value)
                        dragging = false
                        lastDragged = Date()
                    }
            )
            .animation(.bouncy.speed(1.4), value: dragging)
        }
    }
}

    // MARK: - Voice Wave Animation Components (Exact NotchDrop Implementation)

    struct VoiceWaveAnimation: View {
        @State private var bulge: CGFloat = 12
        let isActive: Bool
        let isMuted: Bool // Microphone muted state
        let aiIntensity: CGFloat // AI activity intensity from ViewModel (0.0 → 1.0)

        var body: some View {
            ZStack(alignment: .bottom) {
                // Glow (Figma spec: soft mint glow with reactive bulge)
                VoiceUnderlineBulge(bulge: effectiveBulgeHeight)
                    .stroke(
                        LinearGradient(
                            gradient: Gradient(colors: [
                                Color(red: 0.47, green: 0.93, blue: 0.79).opacity(0.55), // mint glow
                                Color(red: 0.47, green: 0.93, blue: 0.79).opacity(0.45)
                            ]),
                            startPoint: .leading,
                            endPoint: .trailing
                        ),
                        style: StrokeStyle(lineWidth: 8, lineCap: .round)
                    )
                    .blur(radius: 18)
                    .opacity((isActive || isMuted) ? 0.5 : 0)
                    .animation(.easeInOut(duration: 0.2), value: isActive || isMuted)

                // Crisp 1–2px line following the same curve (dark ends, light middle)
                VoiceUnderlineBulge(bulge: effectiveBulgeHeight)
                    .stroke(
                        LinearGradient(
                            gradient: Gradient(stops: [
                                .init(color: Color(red: 0.07, green: 0.53, blue: 0.39), location: 0.0), // dark left
                                .init(color: Color(red: 0.47, green: 0.93, blue: 0.79), location: 0.5), // light center
                                .init(color: Color(red: 0.07, green: 0.53, blue: 0.39), location: 1.0)  // dark right
                            ]),
                            startPoint: .leading,
                            endPoint: .trailing
                        ),
                        style: StrokeStyle(lineWidth: 2, lineCap: .round)
                    )
                    .opacity((isActive || isMuted) ? 1 : 0)
                    .animation(.easeInOut(duration: 0.25), value: isActive || isMuted)
            }
            .allowsHitTesting(false)
            .onAppear {
                // Initialize at base position - no jerks
                bulge = 12
                if isActive && !isMuted {
                    // Smooth delayed start to avoid initial jerk
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                        startBulgeAnimation()
                    }
                } else if isMuted {
                    // When muted, show static 16pt hump
                    bulge = 16
                }
            }
            .onChange(of: isActive) { _, active in
                if active && !isMuted {
                    // Start from base with ultra-smooth entry
                    withAnimation(.timingCurve(0.45, 0.05, 0.55, 0.95, duration: 0.5)) {
                        bulge = 12
                    }
                    // Then begin slow breathing
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                        startBulgeAnimation()
                    }
                } else if !active && !isMuted {
                    // Smooth exit
                    withAnimation(.timingCurve(0.45, 0.05, 0.55, 0.95, duration: 0.4)) { 
                        bulge = 0 
                    }
                }
            }
            .onChange(of: isMuted) { _, muted in
                if muted {
                    // When muted: smoothly transition to static 16pt hump
                    withAnimation(.easeInOut(duration: 0.3)) {
                        bulge = 16
                    }
                } else if isActive {
                    // When unmuted and active: return to breathing animation
                    withAnimation(.easeInOut(duration: 0.3)) {
                        bulge = 12
                    }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                        startBulgeAnimation()
                    }
                }
            }
            .onChange(of: aiIntensity) { _, newIntensity in
                print("🌊 Wave animation intensity changed: \(newIntensity)")
                // Only react to AI intensity when NOT muted
                if isActive && !isMuted {
                    // Real-time audio takes priority - immediate response to actual voice
                    if newIntensity > 0.1 {
                        // AI is actively speaking - use dramatic AI response animation
                        print("🎤 AI speaking detected - triggering dramatic wave animation")
                        animateBulgeForAIResponse(intensity: newIntensity)
                    } else {
                        // AI is in relaxed state (listening/idle) - ultra-smooth transition back to breathing
                        withAnimation(.timingCurve(0.45, 0.05, 0.55, 0.95, duration: 1.0)) {
                            self.bulge = 12 // Smooth return to base
                        }
                        // Then start continuous ultra-smooth breathing animation
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                            self.startBulgeAnimation()
                        }
                    }
                }
            }
        }
        
        // Calculate bulge height based on AI intensity (dramatic scaling)
        private var effectiveBulgeHeight: CGFloat {
            // When muted: show static 20pt hump
            if isMuted {
                return 20
            }
            
            // When not active and not muted: no bulge
            guard isActive else { return 0 }
            
            // Base height: 12pt (idle state)
            // AI intensity adds: 0-60pt (max 72pt total) - More dramatic range
            // Smooth scaling: longer responses = higher bulges
            let baseHeight: CGFloat = 12
            let intensityBoost = aiIntensity * 60 // Increased for more dramatic effect
            let finalHeight = baseHeight + intensityBoost
            
            // Debug logging
            if aiIntensity > 0.1 {
                print("🌊 Effective bulge height: \(finalHeight) (base: \(baseHeight) + intensity: \(intensityBoost))")
            }
            
            return finalHeight
        }
        
        private func startBulgeAnimation() {
            // Ultra-smooth, slow, meditative breathing animation
            // No jerks - completely smooth and slow like calm meditation
            
            // Start from base position
            bulge = 12
            
            // Ultra-slow, buttery smooth breathing with custom easing
            withAnimation(
                .timingCurve(0.45, 0.05, 0.55, 0.95, duration: 2.5) // Ultra smooth custom curve
                .repeatForever(autoreverses: true)
            ) {
                bulge = 17 // Very gentle breath up (reduced for smoother motion)
            }
        }
        
        private func animateBulgeForAIResponse(intensity: CGFloat) {
            print("🎤 Starting AI response animation with intensity: \(intensity)")
            // Dramatic AI speaking animation - strong up-down vibration like real talking
            let baseHeight: CGFloat = 12
            let maxHeight = baseHeight + (intensity * 50) // Increased for more dramatic effect
            
            // Cancel any existing animations
            bulge = baseHeight
            
            // Create strong speech rhythm with more dramatic pulses
            let speechDuration = max(3.0, Double(intensity) * 6.0) // Longer speaking duration
            let pulseCount = Int(speechDuration * 4.0) // ~4 pulses per second for more activity
            
            print("🎤 AI speech duration: \(speechDuration)s, pulse count: \(pulseCount)")
            
            for i in 0..<pulseCount {
                let delay = Double(i) * 0.25 // 250ms between pulses (faster rhythm)
                let pulseIntensity = intensity * (0.7 + 0.3 * sin(Double(i) * 1.5)) // More dramatic variation
                
                DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                    // Strong dramatic pulse up
                    withAnimation(.easeOut(duration: 0.08)) {
                        self.bulge = baseHeight + (pulseIntensity * 50) // Strong upward movement
                        print("🌊 Wave pulse up: \(self.bulge)")
                    }
                    
                    // Quick dramatic pulse down
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.08) {
                        withAnimation(.easeIn(duration: 0.12)) {
                            self.bulge = baseHeight + (pulseIntensity * 8) // Strong downward movement
                        }
                    }
                    
                    // Secondary smaller bounce for more natural feel
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.20) {
                        withAnimation(.easeOut(duration: 0.08)) {
                            self.bulge = baseHeight + (pulseIntensity * 20) // Small bounce back
                        }
                    }
                }
            }
            
            // Final dramatic fade to idle after speech completes
            DispatchQueue.main.asyncAfter(deadline: .now() + speechDuration + 0.5) {
                withAnimation(.easeInOut(duration: 1.5)) {
                    self.bulge = 15 // Return to gentle idle breathing
                    print("🌊 AI response animation completed, returning to breathing")
                }
            }
        }
        
        /// Real-time audio reactive animation - immediate response to actual AI voice
        private func animateBulgeForRealTimeAudio(intensity: CGFloat) {
            let baseHeight: CGFloat = 12
            let targetHeight = baseHeight + (intensity * 50) // Higher multiplier for real-time audio
            
            // Immediate response to actual AI voice - no delays
            withAnimation(.easeOut(duration: 0.06)) {
                bulge = targetHeight
            }
            
            // Quick recovery for natural feel - mimics real speech rhythm
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.06) {
                withAnimation(.easeIn(duration: 0.10)) {
                    self.bulge = baseHeight + (intensity * 6) // Quick partial recovery
                }
            }
            
            // Secondary bounce for natural speech feel
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.16) {
                withAnimation(.easeOut(duration: 0.08)) {
                    self.bulge = baseHeight + (intensity * 3) // Small final bounce
                }
            }
            
            // Final settle to base
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.24) {
                withAnimation(.easeInOut(duration: 0.12)) {
                    self.bulge = baseHeight
                }
            }
        }
    }

struct VoiceUnderlineBulge: Shape {
    var bulge: CGFloat

    var animatableData: CGFloat {
        get { bulge }
        set { bulge = newValue }
    }

    func path(in rect: CGRect) -> Path {
        var path = Path()
        // Render exactly on the bottom edge
        let baselineY = rect.maxY
        path.move(to: CGPoint(x: 0, y: baselineY))
        path.addQuadCurve(
            to: CGPoint(x: rect.width, y: baselineY),
            control: CGPoint(x: rect.width / 2, y: baselineY - max(bulge, 0))
        )
        return path
    }
}
