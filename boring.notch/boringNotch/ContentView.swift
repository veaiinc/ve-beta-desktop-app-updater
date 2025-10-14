//
//  ContentView.swift
//  boringNotchApp
//
//  Created by Harsh Vardhan Goswami  on 02/08/24
//  Modified by Richard Kunkli on 24/08/2024.
//

import AVFoundation
import Combine
import Defaults
import KeyboardShortcuts
import SwiftUI
import SwiftUIIntrospect

struct ContentView: View {
    @EnvironmentObject var vm: BoringViewModel
    @ObservedObject var webcamManager = WebcamManager.shared

    @ObservedObject var coordinator = BoringViewCoordinator.shared
    @ObservedObject var musicManager = MusicManager.shared
    @ObservedObject var batteryModel = BatteryStatusViewModel.shared

    @State private var isHovering: Bool = false
    @State private var hoverWorkItem: DispatchWorkItem?
    @State private var debounceWorkItem: DispatchWorkItem?

    @State private var isHoverStateChanging: Bool = false

    @State private var gestureProgress: CGFloat = .zero

    @State private var haptics: Bool = false

    @Namespace var albumArtNamespace

    @Default(.useMusicVisualizer) var useMusicVisualizer

    @Default(.showNotHumanFace) var showNotHumanFace
    @Default(.useModernCloseAnimation) var useModernCloseAnimation

    private let extendedHoverPadding: CGFloat = 30
    private let zeroHeightHoverPadding: CGFloat = 10

    var body: some View {
        ZStack(alignment: .top) {
            let mainLayout = NotchLayout()
                .frame(alignment: .top)
                .padding(
                    .horizontal,
                    vm.notchState == .open
                        ? Defaults[.cornerRadiusScaling]
                            ? (cornerRadiusInsets.opened.top) : (cornerRadiusInsets.opened.bottom)
                        : cornerRadiusInsets.closed.bottom
                )
                .padding([.horizontal, .bottom], vm.notchState == .open ? 12 : 0)
                .background(Material.regularMaterial)
                .mask {
                    ((vm.notchState == .open) && Defaults[.cornerRadiusScaling])
                        ? NotchShape(
                            topCornerRadius: cornerRadiusInsets.opened.top,
                            bottomCornerRadius: cornerRadiusInsets.opened.bottom
                        )
                        .drawingGroup()
                        : NotchShape(
                            topCornerRadius: cornerRadiusInsets.closed.top,
                            bottomCornerRadius: cornerRadiusInsets.closed.bottom
                        )
                        .drawingGroup()
                }
                .padding(
                    .bottom,
                    vm.notchState == .open && Defaults[.extendHoverArea]
                        ? 0
                        : (vm.effectiveClosedNotchHeight == 0)
                            ? zeroHeightHoverPadding
                            : 0
                )

            mainLayout
                .conditionalModifier(!useModernCloseAnimation) { view in
                    let hoverAnimationAnimation = Animation.bouncy.speed(1.2)
                    let notchStateAnimation = Animation.spring.speed(1.2)
                    return
                        view
                        .animation(hoverAnimationAnimation, value: isHovering)
                        .animation(notchStateAnimation, value: vm.notchState)
                        .animation(.smooth, value: gestureProgress)
                        .transition(
                            .blurReplace.animation(.interactiveSpring(dampingFraction: 1.2)))
                }
                .conditionalModifier(useModernCloseAnimation) { view in
                    let hoverAnimationAnimation = Animation.bouncy.speed(1.2)
                    let notchStateAnimation = Animation.spring.speed(1.2)
                    return view
                        .animation(hoverAnimationAnimation, value: isHovering)
                        .animation(notchStateAnimation, value: vm.notchState)
                }
                .conditionalModifier(Defaults[.openNotchOnHover]) { view in
                    view.onHover { hovering in
                        handleHover(hovering)
                    }
                }
                .conditionalModifier(!Defaults[.openNotchOnHover]) { view in
                    view
                        .onHover { hovering in
                            if (vm.notchState == .closed) && Defaults[.enableHaptics] {
                                haptics.toggle()
                            }

                            withAnimation(vm.animation) {
                                isHovering = hovering
                            }

                            // Only close if mouse leaves and the notch is open, but not in meeting view
                            if !hovering && vm.notchState == .open && coordinator.currentView != .meeting {
                                vm.close()
                            }
                        }
                        .onTapGesture {
                            doOpen()
                        }
                        .conditionalModifier(Defaults[.enableGestures]) { view in
                            view
                                .panGesture(direction: .down) { translation, phase in
                                    handleDownGesture(translation: translation, phase: phase)
                                }
                        }
                }
                .conditionalModifier(Defaults[.closeGestureEnabled] && Defaults[.enableGestures]) { view in
                    view
                        .panGesture(direction: .up) { translation, phase in
                            handleUpGesture(translation: translation, phase: phase)
                        }
                }
                .onAppear(perform: {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                        withAnimation(vm.animation) {
                            if coordinator.firstLaunch {
                                doOpen()
                            }
                        }
                    }
                })
                .onChange(of: vm.notchState) { _, newState in
                    // Reset hover state when notch state changes
                    if newState == .closed && isHovering {
                        // Only reset visually, without triggering the hover logic again
                        isHoverStateChanging = true
                        withAnimation {
                            isHovering = false
                        }
                        // Reset the flag after the animation completes
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                            isHoverStateChanging = false
                        }
                    }
                }
                .sensoryFeedback(.alignment, trigger: haptics)
                .contextMenu {
                    Button("Settings") {
                        SettingsWindowController.shared.showWindow()
                    }
                    .keyboardShortcut(KeyEquivalent(","), modifiers: .command)
//                    Button("Edit") { // Doesnt work....
//                        let dn = DynamicNotch(content: EditPanelView())
//                        dn.toggle()
//                    }
//                    #if DEBUG
//                    .disabled(false)
//                    #else
//                    .disabled(true)
//                    #endif
//                    .keyboardShortcut("E", modifiers: .command)
                }
        }
        .padding(.bottom, 8)
        .frame(maxWidth: openNotchSize.width, maxHeight: openNotchSize.height, alignment: .top)
        .shadow(
            color: ((vm.notchState == .open || isHovering) && Defaults[.enableShadow])
                ? .black.opacity(0.2) : .clear, radius: Defaults[.cornerRadiusScaling] ? 6 : 4
        )
        .background(dragDetector)
        .environmentObject(vm)
    }

    @ViewBuilder
    func NotchLayout() -> some View {
        VStack(alignment: .leading, spacing: vm.notchState == .open ? 26 : 0) {
            VStack(alignment: .leading) {
                if coordinator.firstLaunch {
                    Spacer()
                    HelloAnimation().frame(width: 200, height: 80).onAppear(perform: {
                        vm.closeHello()
                    })
                    .padding(.top, 40)
                    Spacer()
                } else {
                    if coordinator.expandingView.type == .battery && coordinator.expandingView.show
                        && vm.notchState == .closed && Defaults[.showPowerStatusNotifications]
                    {
                        HStack(spacing: 0) {
                            HStack {
                                Text(batteryModel.statusText)
                                    .font(.subheadline)
                                    .foregroundStyle(.white)
                            }

                            Rectangle()
                                .fill(.black)
                                .frame(width: vm.closedNotchSize.width + 10)

                            HStack {
                                BoringBatteryView(
                                    batteryWidth: 30,
                                    isCharging: batteryModel.isCharging,
                                    isInLowPowerMode: batteryModel.isInLowPowerMode,
                                    isPluggedIn: batteryModel.isPluggedIn,
                                    levelBattery: batteryModel.levelBattery,
                                    isForNotification: true
                                )
                            }
                            .frame(width: 76, alignment: .trailing)
                        }
                        .frame(height: vm.effectiveClosedNotchHeight + (isHovering ? 8 : 0), alignment: .center)
                      } else if coordinator.sneakPeek.show && Defaults[.inlineHUD] && (coordinator.sneakPeek.type != .music) && (coordinator.sneakPeek.type != .battery) {
                          InlineHUD(type: $coordinator.sneakPeek.type, value: $coordinator.sneakPeek.value, icon: $coordinator.sneakPeek.icon, hoverAnimation: $isHovering, gestureProgress: $gestureProgress)
                              .transition(.opacity)
                      } else if (!coordinator.expandingView.show || coordinator.expandingView.type == .music) && vm.notchState == .closed && (musicManager.isPlaying || !musicManager.isPlayerIdle) && coordinator.musicLiveActivityEnabled && !vm.hideOnClosed {
                          MusicLiveActivity()
                      } else if !coordinator.expandingView.show && vm.notchState == .closed && (!musicManager.isPlaying && musicManager.isPlayerIdle) && Defaults[.showNotHumanFace] && !vm.hideOnClosed  {
                          BoringFaceAnimation().animation(.interactiveSpring, value: musicManager.isPlayerIdle)
                      } else if vm.notchState == .open {
                          BoringHeader()
                              .frame(height: max(24, vm.effectiveClosedNotchHeight))
                              .blur(radius: (coordinator.currentView == .meeting) ? 0 : (abs(gestureProgress) > 0.3 ? min(abs(gestureProgress), 8) : 0))
                              .animation(.spring(response: 1, dampingFraction: 1, blendDuration: 0.8), value: vm.notchState)
                       } else {
                           Rectangle().fill(.clear).frame(width: vm.closedNotchSize.width - 20, height: vm.effectiveClosedNotchHeight)
                       }

                      if coordinator.sneakPeek.show {
                          if (coordinator.sneakPeek.type != .music) && (coordinator.sneakPeek.type != .battery) && !Defaults[.inlineHUD] {
                              SystemEventIndicatorModifier(eventType: $coordinator.sneakPeek.type, value: $coordinator.sneakPeek.value, icon: $coordinator.sneakPeek.icon, sendEventBack: { _ in
                                  //
                              })
                              .padding(.bottom, 10)
                              .padding(.leading, 4)
                              .padding(.trailing, 8)
                          }
                          // Old sneak peek music
                          else if coordinator.sneakPeek.type == .music {
                              if vm.notchState == .closed && !vm.hideOnClosed && Defaults[.sneakPeekStyles] == .standard {
                                  HStack(alignment: .center) {
                                      Image(systemName: "music.note")
                                      GeometryReader { geo in
                                          MarqueeText(.constant(musicManager.songTitle + " - " + musicManager.artistName),  textColor: Defaults[.playerColorTinting] ? Color(nsColor: musicManager.avgColor).ensureMinimumBrightness(factor: 0.6) : .gray, minDuration: 1, frameWidth: geo.size.width)
                                      }
                                  }
                                  .foregroundStyle(.gray)
                                  .padding(.bottom, 10)
                              }
                          }
                      }
                  }
              }
              .conditionalModifier((coordinator.sneakPeek.show && (coordinator.sneakPeek.type == .music) && vm.notchState == .closed && !vm.hideOnClosed && Defaults[.sneakPeekStyles] == .standard) || (coordinator.sneakPeek.show && (coordinator.sneakPeek.type != .music) && (vm.notchState == .closed))) { view in
                  view
                      .fixedSize()
              }
              .zIndex(2)

            ZStack {
                if vm.notchState == .open {
                    switch coordinator.currentView {
                    case .home:
                        NotchHomeView(albumArtNamespace: albumArtNamespace)
                    case .shelf:
                        NotchShelfView()
                    case .meeting:
                        MeetingView()
                    case .ask:
                        MeetingView()
                    }
                }
            }
            .zIndex(1)
            .allowsHitTesting(vm.notchState == .open)
            .blur(radius: (coordinator.currentView == .meeting) ? 0 : (abs(gestureProgress) > 0.3 ? min(abs(gestureProgress), 8) : 0))
            .opacity((coordinator.currentView == .meeting) ? 1 : (abs(gestureProgress) > 0.3 ? min(abs(gestureProgress * 2), 0.8) : 1))
        }
    }

    @ViewBuilder
    func BoringFaceAnimation() -> some View {
        HStack {
            HStack {
                Rectangle()
                    .fill(.clear)
                    .frame(
                        width: max(0, vm.effectiveClosedNotchHeight - 12),
                        height: max(0, vm.effectiveClosedNotchHeight - 12))
                Rectangle()
                    .fill(.black)
                    .frame(width: vm.closedNotchSize.width - 20)
                MinimalFaceFeatures()
            }
        }.frame(height: vm.effectiveClosedNotchHeight + (isHovering ? 8 : 0), alignment: .center)
    }

    @ViewBuilder
    func MusicLiveActivity() -> some View {
        HStack {
            HStack {
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
                            cornerRadius: MusicPlayerImageSizes.cornerRadiusInset.closed)
                    )
                    .matchedGeometryEffect(id: "albumArt", in: albumArtNamespace)
                    .frame(
                        width: max(0, vm.effectiveClosedNotchHeight - 12),
                        height: max(0, vm.effectiveClosedNotchHeight - 12))
            }
            .frame(
                width: max(
                    0, vm.effectiveClosedNotchHeight - (isHovering ? 0 : 12) + gestureProgress / 2),
                height: max(0, vm.effectiveClosedNotchHeight - (isHovering ? 0 : 12)))

            Rectangle()
                .fill(.black)
                .overlay(
                    HStack(alignment: .top) {
                        if coordinator.expandingView.show
                            && coordinator.expandingView.type == .music
                        {
                            MarqueeText(
                                .constant(musicManager.songTitle),
                                textColor: Defaults[.coloredSpectrogram]
                                    ? Color(nsColor: musicManager.avgColor) : Color.gray,
                                minDuration: 0.4,
                                frameWidth: 100
                            )
                            .opacity(
                                (coordinator.expandingView.show && Defaults[.enableSneakPeek]
                                    && Defaults[.sneakPeekStyles] == .inline) ? 1 : 0)
                            Spacer(minLength: vm.closedNotchSize.width)
                            // Song Artist
                            Text(musicManager.artistName)
                                .lineLimit(1)
                                .truncationMode(.tail)
                                .foregroundStyle(
                                    Defaults[.coloredSpectrogram]
                                        ? Color(nsColor: musicManager.avgColor) : Color.gray
                                )
                                .opacity(
                                    (coordinator.expandingView.show
                                        && coordinator.expandingView.type == .music
                                        && Defaults[.enableSneakPeek]
                                        && Defaults[.sneakPeekStyles] == .inline) ? 1 : 0)
                        }
                    }
                )
                .frame(
                    width: (coordinator.expandingView.show
                        && coordinator.expandingView.type == .music && Defaults[.enableSneakPeek]
                        && Defaults[.sneakPeekStyles] == .inline)
                        ? 380 : vm.closedNotchSize.width + (isHovering ? 8 : 0))

            HStack {
                if useMusicVisualizer {
                    Rectangle()
                        .fill(
                            Defaults[.coloredSpectrogram]
                                ? Color(nsColor: musicManager.avgColor).gradient
                                : Color.gray.gradient
                        )
                        .frame(width: 50, alignment: .center)
                        .matchedGeometryEffect(id: "spectrum", in: albumArtNamespace)
                        .mask {
                            AudioSpectrumView(isPlaying: $musicManager.isPlaying)
                                .frame(width: 16, height: 12)
                        }
                        .frame(
                            width: max(
                                0,
                                vm.effectiveClosedNotchHeight - (isHovering ? 0 : 12)
                                    + gestureProgress / 2),
                            height: max(0, vm.effectiveClosedNotchHeight - (isHovering ? 0 : 12)),
                            alignment: .center)
                } else {
                    LottieAnimationView()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            }
            .frame(
                width: max(
                    0, vm.effectiveClosedNotchHeight - (isHovering ? 0 : 12) + gestureProgress / 2),
                height: max(0, vm.effectiveClosedNotchHeight - (isHovering ? 0 : 12)),
                alignment: .center)
        }
        .frame(height: vm.effectiveClosedNotchHeight + (isHovering ? 8 : 0), alignment: .center)
    }

    @ViewBuilder
    var dragDetector: some View {
        if Defaults[.boringShelf] {
            Color.clear
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .contentShape(Rectangle())
                .onDrop(of: [.data], isTargeted: $vm.dragDetectorTargeting) { _ in true }
                .onChange(of: vm.anyDropZoneTargeting) { _, isTargeted in
                    if isTargeted, vm.notchState == .closed {
                        coordinator.currentView = .shelf
                        doOpen()
                    } else if !isTargeted {
                        print("DROP EVENT", vm.dropEvent)
                        if vm.dropEvent {
                            vm.dropEvent = false
                            return
                        }

                        vm.dropEvent = false
                        vm.close()
                    }
                }
        } else {
            EmptyView()
        }
    }

    private func doOpen() {
        withAnimation(.bouncy.speed(1.2)) {
            vm.open()
        }
    }

    // MARK: - Hover Management

    /// Handle hover state changes with debouncing
    private func handleHover(_ hovering: Bool) {
        // Don't process events if we're already transitioning
        if isHoverStateChanging { return }

        // Cancel any pending tasks
        hoverWorkItem?.cancel()
        hoverWorkItem = nil
        debounceWorkItem?.cancel()
        debounceWorkItem = nil

        if hovering {
            // Handle mouse enter
            withAnimation(.bouncy.speed(1.2)) {
                isHovering = true
            }

            // Only provide haptic feedback if notch is closed
            if vm.notchState == .closed && Defaults[.enableHaptics] {
                haptics.toggle()
            }

            // Don't open notch if there's a sneak peek showing
            if coordinator.sneakPeek.show {
                return
            }

            // Delay opening the notch
            let task = DispatchWorkItem {
                // ContentView is a struct, so we don't use weak self here
                guard vm.notchState == .closed, isHovering else { return }
                doOpen()
            }

            hoverWorkItem = task
            DispatchQueue.main.asyncAfter(
                deadline: .now() + Defaults[.minimumHoverDuration],
                execute: task
            )
        } else {
            // Handle mouse exit with debounce to prevent flickering
            let debounce = DispatchWorkItem {
                // ContentView is a struct, so we don't use weak self here

                // Update visual state
                withAnimation(.bouncy.speed(1.2)) {
                    isHovering = false
                }

                // Close the notch if it's open and battery popover is not active, but not in meeting view
                if vm.notchState == .open && !vm.isBatteryPopoverActive && coordinator.currentView != .meeting {
                    vm.close()
                }
            }

            debounceWorkItem = debounce
            // Add a small delay to debounce rapid mouse movements
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1, execute: debounce)
        }
    }

    // MARK: - Gesture Handling

    private func handleDownGesture(translation: CGFloat, phase: NSEvent.Phase) {
        guard vm.notchState == .closed else { return }

        withAnimation(.smooth) {
            gestureProgress = (translation / Defaults[.gestureSensitivity]) * 20
        }

        if phase == .ended {
            withAnimation(.smooth) {
                gestureProgress = .zero
            }
        }

        if translation > Defaults[.gestureSensitivity] {
            if Defaults[.enableHaptics] {
                haptics.toggle()
            }
            withAnimation(.smooth) {
                gestureProgress = .zero
            }
            doOpen()
        }
    }

    private func handleUpGesture(translation: CGFloat, phase: NSEvent.Phase) {
        if vm.notchState == .open && !vm.isHoveringCalendar {
            withAnimation(.smooth) {
                gestureProgress = (translation / Defaults[.gestureSensitivity]) * -20
            }

            if phase == .ended {
                withAnimation(.smooth) {
                    gestureProgress = .zero
                }
            }

            if translation > Defaults[.gestureSensitivity] {
                withAnimation(.smooth) {
                    gestureProgress = .zero
                    isHovering = false
                }
                // Don't close the notch if we're in the meeting view
                if coordinator.currentView != .meeting {
                    vm.close()
                }

                if Defaults[.enableHaptics] {
                    haptics.toggle()
                }
            }
        }
    }
}

struct FullScreenDropDelegate: DropDelegate {
    @Binding var isTargeted: Bool
    let onDrop: () -> Void

    func dropEntered(info _: DropInfo) {
        isTargeted = true
    }

    func dropExited(info _: DropInfo) {
        isTargeted = false
    }

    func performDrop(info _: DropInfo) -> Bool {
        isTargeted = false
        onDrop()
        return true
    }
}

// MARK: - WebSocket Manager

class WebSocketManager: ObservableObject {
    static let shared = WebSocketManager()
    
    @Published var isConnected = false
    @Published var connectionStatus: String = "Disconnected"
    @Published var lastMessage: String = ""
    @Published var messages: [WebSocketMessage] = []
    @Published var meetingStatus: String = "Ready"
    
    private var webSocketTask: URLSessionWebSocketTask?
    private var urlSession: URLSession?
    private var cancellables = Set<AnyCancellable>()
    
    private let serverURL = "ws://localhost:8080"
    
    private init() {
        setupURLSession()
    }
    
    private func setupURLSession() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 10
        config.timeoutIntervalForResource = 30
        urlSession = URLSession(configuration: config)
    }
    
    func connect() {
        guard let url = URL(string: serverURL) else {
            updateConnectionStatus("Invalid URL", isConnected: false)
            return
        }
        
        webSocketTask = urlSession?.webSocketTask(with: url)
        webSocketTask?.resume()
        
        updateConnectionStatus("Connecting...", isConnected: false)
        
        // Start listening for messages
        receiveMessage()
        
        // Send ping to test connection
        sendPing()
    }
    
    func disconnect() {
        webSocketTask?.cancel(with: .goingAway, reason: nil)
        webSocketTask = nil
        updateConnectionStatus("Disconnected", isConnected: false)
    }
    
    func sendMessage(_ message: String) {
        guard isConnected else {
            print("WebSocket not connected")
            return
        }
        
        let messageData = WebSocketMessage(
            id: UUID(),
            content: message,
            timestamp: Date(),
            type: .sent
        )
        
        messages.append(messageData)
        
        let message = URLSessionWebSocketTask.Message.string(message)
        webSocketTask?.send(message) { [weak self] error in
            if let error = error {
                print("Failed to send message: \(error)")
                DispatchQueue.main.async {
                    self?.updateConnectionStatus("Send Error: \(error.localizedDescription)", isConnected: false)
                }
            }
        }
    }
    
    func sendNavigateToMainScreen(path: String? = nil) {
        guard isConnected else {
            print("⚠️ WebSocket not connected - attempting to open main window via URL scheme")
            // Fallback: try to activate Electron app
            if let appURL = NSWorkspace.shared.urlForApplication(withBundleIdentifier: "com.thelivingcompany.ve") {
                NSWorkspace.shared.open(appURL)
            }
            return
        }
        
        // Send navigation message matching NotchDrop's format
        let message: [String: Any] = [
            "type": "NAVIGATE_TO_MAIN_SCREEN",
            "path": path ?? NSNull()
        ]
        
        if let jsonData = try? JSONSerialization.data(withJSONObject: message),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            sendMessage(jsonString)
            print("📤 Sent navigation message to Electron: \(path ?? "home")")
        }
    }
    
    private func receiveMessage() {
        webSocketTask?.receive { [weak self] result in
            switch result {
            case .success(let message):
                self?.handleMessage(message)
                // Continue listening for more messages
                self?.receiveMessage()
            case .failure(let error):
                print("WebSocket receive error: \(error)")
                DispatchQueue.main.async {
                    self?.updateConnectionStatus("Receive Error: \(error.localizedDescription)", isConnected: false)
                }
            }
        }
    }
    
    private func handleMessage(_ message: URLSessionWebSocketTask.Message) {
        switch message {
        case .string(let text):
            DispatchQueue.main.async {
                // Try to parse as JSON to handle structured messages
                if let data = text.data(using: .utf8),
                   let jsonObject = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                   let messageType = jsonObject["type"] as? String {
                    
                    // Handle MEETING_STARTED message
                    if messageType == "MEETING_STARTED" {
                        print("🎯 MEETING_STARTED message received from Electron")
                        self.meetingStatus = "Meeting Started"
                    }
                }
                
                let receivedMessage = WebSocketMessage(
                    id: UUID(),
                    content: text,
                    timestamp: Date(),
                    type: .received
                )
                self.messages.append(receivedMessage)
                self.lastMessage = text
            }
        case .data(let data):
            if let text = String(data: data, encoding: .utf8) {
                DispatchQueue.main.async {
                    // Try to parse as JSON to handle structured messages
                    if let jsonData = text.data(using: .utf8),
                       let jsonObject = try? JSONSerialization.jsonObject(with: jsonData) as? [String: Any],
                       let messageType = jsonObject["type"] as? String {
                        
                        // Handle MEETING_STARTED message
                        if messageType == "MEETING_STARTED" {
                            print("🎯 MEETING_STARTED message received from Electron")
                            self.meetingStatus = "Meeting Started"
                        }
                    }
                    
                    let receivedMessage = WebSocketMessage(
                        id: UUID(),
                        content: text,
                        timestamp: Date(),
                        type: .received
                    )
                    self.messages.append(receivedMessage)
                    self.lastMessage = text
                }
            }
        @unknown default:
            print("Unknown message type received")
        }
    }
    
    private func sendPing() {
        webSocketTask?.sendPing { [weak self] error in
            if let error = error {
                print("Ping failed: \(error)")
                DispatchQueue.main.async {
                    self?.updateConnectionStatus("Connection Lost", isConnected: false)
                }
            } else {
                DispatchQueue.main.async {
                    self?.updateConnectionStatus("Connected", isConnected: true)
                }
            }
        }
    }
    
    private func updateConnectionStatus(_ status: String, isConnected: Bool) {
        self.connectionStatus = status
        self.isConnected = isConnected
    }
    
    func clearMessages() {
        messages.removeAll()
        lastMessage = ""
    }
    
    func cleanup() {
        disconnect()
    }
}

struct WebSocketMessage: Identifiable {
    let id: UUID
    let content: String
    let timestamp: Date
    let type: MessageType
    
    enum MessageType {
        case sent
        case received
    }
}

// MARK: - Meeting View

struct MeetingView: View {
    @StateObject private var webSocketManager = WebSocketManager.shared
    @State private var messageText = ""
    
    var body: some View {
        VStack(spacing: 12) {
            // Connection Status
            HStack {
                Circle()
                    .fill(webSocketManager.isConnected ? Color.green : Color.red)
                    .frame(width: 8, height: 8)
                
                Text(webSocketManager.connectionStatus)
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                Button(action: {
                    if webSocketManager.isConnected {
                        webSocketManager.disconnect()
                    } else {
                        webSocketManager.connect()
                    }
                }) {
                    Text(webSocketManager.isConnected ? "Disconnect" : "Connect")
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.blue.opacity(0.2))
                        .foregroundColor(.blue)
                        .cornerRadius(4)
                }
            }
            .padding(.horizontal, 16)
            
            // Meeting Status
            HStack {
                Text("Status:")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Text(webSocketManager.meetingStatus)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(webSocketManager.meetingStatus == "Meeting Started" ? .green : .primary)
                
                Spacer()
            }
            .padding(.horizontal, 16)
            
            // Messages List
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 8) {
                    ForEach(webSocketManager.messages) { message in
                        MessageBubble(message: message)
                    }
                }
                .padding(.horizontal, 16)
            }
            .frame(maxHeight: 200)
            
            // Input Area
            HStack(spacing: 8) {
                TextField("Type your message...", text: $messageText)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .onSubmit {
                        sendMessage()
                    }
                    .onTapGesture {
                        // Ensure window can receive focus when text field is tapped
                        DispatchQueue.main.async {
                            if let window = NSApplication.shared.windows.first(where: { $0 is BoringNotchWindow }) {
                                window.makeKeyAndOrderFront(nil)
                            }
                        }
                    }
                
                Button(action: sendMessage) {
                    Image(systemName: "paperplane.fill")
                        .foregroundColor(.white)
                        .frame(width: 32, height: 32)
                        .background(Color.blue)
                        .cornerRadius(16)
                }
                .disabled(messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || !webSocketManager.isConnected)
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 8)
        }
        .onAppear {
            // WebSocket auto-connection is now handled by WebSocketManager on startup
            // No need to manually connect here
        }
    }
    
    private func sendMessage() {
        let trimmedMessage = messageText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmedMessage.isEmpty else { return }
        
        webSocketManager.sendMessage(trimmedMessage)
        messageText = ""
    }
}

struct MessageBubble: View {
    let message: WebSocketMessage
    
    var body: some View {
        HStack {
            if message.type == .sent {
                Spacer()
            }
            
            VStack(alignment: message.type == .sent ? .trailing : .leading, spacing: 4) {
                Text(message.content)
                    .font(.system(size: 14))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(
                        message.type == .sent ? Color.blue : Color.gray.opacity(0.2)
                    )
                    .foregroundColor(message.type == .sent ? .white : .primary)
                    .cornerRadius(16)
                
                Text(formatTimestamp(message.timestamp))
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            
            if message.type == .received {
                Spacer()
            }
        }
    }
    
    private func formatTimestamp(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}

#Preview {
    let vm = BoringViewModel()
    vm.open()
    return ContentView()
        .environmentObject(vm)
        .frame(width: vm.notchSize.width, height: vm.notchSize.height)
}

