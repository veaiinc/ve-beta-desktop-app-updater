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
    @State private var animatedWidth: CGFloat = 800
    @State private var animatedHeight: CGFloat = 190
    @State private var isWidthTransitioning: Bool = false
    @State private var animatedTopCornerRadius: CGFloat = 19
    @State private var animatedBottomCornerRadius: CGFloat = 24
    
    @Namespace var albumArtNamespace
    
    @Default(.useMusicVisualizer) var useMusicVisualizer
    
    @Default(.showNotHumanFace) var showNotHumanFace
    @Default(.useModernCloseAnimation) var useModernCloseAnimation
    
    private let extendedHoverPadding: CGFloat = 30
    private let zeroHeightHoverPadding: CGFloat = 10
    
    var body: some View {
        ZStack(alignment: .top) {
            let isNotchOpen = vm.notchState == .open
            // Use animated corner radius values
            let notchCornerRadii: (top: CGFloat, bottom: CGFloat) = {
                if isNotchOpen {
                    return (animatedTopCornerRadius, animatedBottomCornerRadius)
                }
                
                return (cornerRadiusInsets.closed.top, cornerRadiusInsets.closed.bottom)
            }()
            
            let mainLayout = NotchLayout()
                .frame(alignment: .top)
                .padding(
                    .horizontal,
                    isNotchOpen
                    ? Defaults[.cornerRadiusScaling]
                    ? (cornerRadiusInsets.opened.top) : (cornerRadiusInsets.opened.bottom)
                    : cornerRadiusInsets.closed.bottom
                )
                .padding([.horizontal, .bottom], isNotchOpen ? 12 : 0)
                .background {
                    if isNotchOpen {
                        Rectangle().fill(Material.regularMaterial)
                    } else {
                        Color.black
                    }
                }
                .mask {
                    if isNotchOpen {
                        NotchShape(
                            topCornerRadius: notchCornerRadii.top,
                            bottomCornerRadius: notchCornerRadii.bottom
                        )
                        .drawingGroup()
                        .animation(isWidthTransitioning ? .none : .default, value: animatedTopCornerRadius)
                        .animation(isWidthTransitioning ? .none : .default, value: animatedBottomCornerRadius)
                    } else {
                        ClosedNotchShape(
                            topCornerRadius: notchCornerRadii.top,
                            bottomCornerRadius: notchCornerRadii.bottom
                        )
                        .drawingGroup()
                    }
                }
                .padding(
                    .bottom,
                    isNotchOpen && Defaults[.extendHoverArea]
                    ? 0
                    : (vm.effectiveClosedNotchHeight == 0)
                    ? zeroHeightHoverPadding
                    : 0
                )
                .preferredColorScheme(.dark)
            
            mainLayout
                .conditionalModifier(!useModernCloseAnimation) { view in
                    let hoverAnimationAnimation = Animation.bouncy.speed(1.2)
                    let notchStateAnimation = Animation.spring.speed(1.2)
                    return
                    view
                        .animation(vm.isAuthenticated ? hoverAnimationAnimation : .none, value: isHovering)
                        .animation(notchStateAnimation, value: vm.notchState)
                        .animation(.smooth, value: gestureProgress)
                        .transition(
                            .blurReplace.animation(.interactiveSpring(dampingFraction: 1.2)))
                }
                .conditionalModifier(useModernCloseAnimation) { view in
                    let hoverAnimationAnimation = Animation.bouncy.speed(1.2)
                    let notchStateAnimation = Animation.spring.speed(1.2)
                    return view
                        .animation(vm.isAuthenticated ? hoverAnimationAnimation : .none, value: isHovering)
                        .animation(notchStateAnimation, value: vm.notchState)
                }
                .conditionalModifier(Defaults[.openNotchOnHover] && vm.isAuthenticated) { view in
                    view.onHover { hovering in
                        handleHover(hovering)
                    }
                }
                .conditionalModifier(!Defaults[.openNotchOnHover] && vm.isAuthenticated) { view in
                    view
                        .onHover { hovering in
                            if (vm.notchState == .closed) && Defaults[.enableHaptics] {
                                haptics.toggle()
                            }
                            
                            withAnimation(vm.animation) {
                                isHovering = hovering
                            }
                            
                            // Only close if mouse leaves and the notch is open, but not locked
                            if !hovering && vm.notchState == .open && !vm.isNotchLocked && !vm.isHoveringLockArea {
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
            // Floating lock button at bottom-right of the notch
            if vm.notchState == .open {
                VStack {
                    Spacer()
                    HStack {
                        Spacer()
                        FloatingLockButton()
                    }
                }
                .padding(.trailing, 3)
                .padding(.bottom, -6)
                .frame(maxWidth: openNotchSize.width, maxHeight: openNotchSize.height, alignment: .bottomTrailing)
            }
        }
        .padding(.bottom, 8)
        .frame(maxWidth: animatedWidth, maxHeight: animatedHeight, alignment: .top)
        .shadow(
            color: ((vm.notchState == .open || isHovering) && Defaults[.enableShadow])
            ? .black.opacity(0.2) : .clear,
            radius: Defaults[.cornerRadiusScaling] ? 6 : 4
        )
        .animation(.easeInOut(duration: 0.3), value: animatedWidth)
        .background(dragDetector)
        .environmentObject(vm)
        .onAppear {
            // Initialize animated values
            let initialSize = getOpenNotchSize()
            animatedWidth = initialSize.width
            animatedHeight = initialSize.height
            animatedTopCornerRadius = cornerRadiusInsets.opened.top
            animatedBottomCornerRadius = cornerRadiusInsets.opened.bottom
        }
        .onChange(of: coordinator.currentView) { _, _ in
            // Animate only the frame changes smoothly, keep corner radius static
            let newSize = getOpenNotchSize()
            
            // Set transition state
            isWidthTransitioning = true
            
            withAnimation(.easeInOut(duration: 0.3)) {
                animatedWidth = newSize.width
                animatedHeight = newSize.height
                // Keep corner radius static during width transition
                animatedTopCornerRadius = cornerRadiusInsets.opened.top
                animatedBottomCornerRadius = cornerRadiusInsets.opened.bottom
            }
            
            // Reset transition state after animation completes
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                isWidthTransitioning = false
            }
        }
        .onChange(of: vm.notchState) { _, newState in
            // Animate corner radius for normal open/close transitions (not during width transitions)
            if !isWidthTransitioning {
                withAnimation(.easeInOut(duration: 0.3)) {
                    if newState == .open {
                        animatedTopCornerRadius = cornerRadiusInsets.opened.top
                        animatedBottomCornerRadius = cornerRadiusInsets.opened.bottom
                    } else {
                        animatedTopCornerRadius = cornerRadiusInsets.closed.top
                        animatedBottomCornerRadius = cornerRadiusInsets.closed.bottom
                    }
                }
            }
        }
    }
    
    @ViewBuilder
    func NotchLayout() -> some View {
        VStack(alignment: .leading, spacing: vm.notchState == .open ? 26 : 0) {
            VStack(alignment: .leading) {
                if !vm.isAuthenticated {
                    // Welcome section when not authenticated
                    LoginViewContent()
                } else if coordinator.firstLaunch {
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
                        MusicLiveActivity().frame(width: vm.closedNotchSize.width - 20, height: vm.effectiveClosedNotchHeight)
                    } else if !coordinator.expandingView.show && vm.notchState == .closed && (!musicManager.isPlaying && musicManager.isPlayerIdle) && Defaults[.showNotHumanFace] && !vm.hideOnClosed  {
                        BoringFaceAnimation().animation(.interactiveSpring, value: musicManager.isPlayerIdle)
                    } else if vm.notchState == .open {
                        BoringHeader()
                            .padding(.top, 4)
                            .frame(height: max(24, vm.effectiveClosedNotchHeight))
                            .blur(radius: (coordinator.currentView == .meeting) ? 0 : (abs(gestureProgress) > 0.3 ? min(abs(gestureProgress), 8) : 0))
                            .animation(.spring(response: 1, dampingFraction: 1, blendDuration: 0.8), value: vm.notchState)
                    } else {
                        ClosedNotchContentView()
                            .frame(width: vm.closedNotchSize.width - 20, height: vm.effectiveClosedNotchHeight)
                            .background(Color.clear)
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
                if vm.notchState == .open && vm.isAuthenticated {
                    switch coordinator.currentView {
                    case .home:
                        NotchHomeView(albumArtNamespace: albumArtNamespace)
                    case .email:
                        EmailView()
                    case .shelf:
                        NotchShelfView()
                    case .meeting:
                        MeetingView()
                    case .ask:
                        NotchHomeView(albumArtNamespace: albumArtNamespace)
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
        HStack{
            CircularMusicThumbnail()
                .frame(
                    width: max(0, vm.effectiveClosedNotchHeight + (isHovering ? 8 : 0)),
                    height: max(0, vm.effectiveClosedNotchHeight + (isHovering ? 8 : 0)),
                    alignment: .center
                )
            Spacer()
        }
        
    }
    
    // MARK: - Circular Music Thumbnail (compact style)
    @ViewBuilder
    private func CircularMusicThumbnail() -> some View {
        let size = max(0, vm.effectiveClosedNotchHeight + (isHovering ? 8 : 0))
        ZStack(alignment: .center) {
            // Album art circle
            Image(nsImage: musicManager.albumArt)
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: size, height: size)
                .clipShape(Circle())
                .overlay(
                    Circle()
                        .stroke(Color.white.opacity(0.12), lineWidth: 1)
                )
            
            // Title + artist centered
            VStack(spacing: 2) {
                Text(musicManager.songTitle.isEmpty ? "Not Playing" : musicManager.songTitle)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .minimumScaleFactor(0.6)
                Text(musicManager.artistName.isEmpty ? "Unknown" : musicManager.artistName)
                    .font(.system(size: 10))
                    .foregroundStyle(Color.white.opacity(0.85))
                    .lineLimit(1)
                    .minimumScaleFactor(0.6)
            }
            .padding(.horizontal, 8)
            .multilineTextAlignment(.center)
            .shadow(color: .black.opacity(0.6), radius: 2, x: 0, y: 1)
            
            // Small translucent play/pause chip at the top
            VStack {
                let symbolName = musicManager.isPlaying ? "pause" : "play"
                Circle()
                    .fill(.black.opacity(0.35))
                    .frame(width: 24, height: 24)
                    .overlay(
                        Image(systemName: symbolName)
                            .font(.system(size: 10, weight: .bold))
                            .foregroundStyle(.white)
                    )
                Spacer(minLength: 0)
            }
            .padding(.top, 4)
        }
        .contentShape(Circle())
        .matchedGeometryEffect(id: "albumArt", in: albumArtNamespace)
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
                        // Don't close if locked
                        if !vm.isNotchLocked {
                            vm.close()
                        }
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
                
                // Close the notch if it's open and battery popover is not active, but not locked
                if vm.notchState == .open && !vm.isBatteryPopoverActive && !vm.isNotchLocked && !vm.isHoveringLockArea {
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
                // Don't close the notch if locked
                if !vm.isNotchLocked {
                    vm.close()
                }
                
                if Defaults[.enableHaptics] {
                    haptics.toggle()
                }
            }
        }
    }
    
    @ViewBuilder
    func LoginViewContent() -> some View {
        ZStack {
            // Transparent background - let the black background show through
            Color.clear
            
            VStack(spacing: 0) {
                Spacer()
                
                VStack(spacing: 24) {
                    // Hello Animation - shows first, then disappears
                    if vm.showHelloAnimation {
                        HelloAnimation()
                            .frame(width: 180, height: 70)
                            .transition(.asymmetric(
                                insertion: .opacity.combined(with: .scale(scale: 0.8)),
                                removal: .opacity.combined(with: .scale(scale: 1.1))
                            ))
                    }
                    
                    // Text content - animates from bottom to center
                    if vm.showLoginText {
                        VStack(spacing: 12) { // Reduced gap from 20 to 12
                            // Main greeting text - with gradient foreground and individual animation
                            Text("Hey there! Ready when you are.")
                                .font(.system(size: 18, weight: .regular, design: .default))
                                .foregroundStyle(
                                    LinearGradient(
                                        gradient: Gradient(colors: [
                                            Color.white.opacity(0.4),
                                            Color.white.opacity(0.8),
                                            Color.white.opacity(0.4)
                                        ]),
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )
                                .multilineTextAlignment(.center)
                                .lineLimit(2)
                                .padding(.horizontal, 20)
                                .offset(y: vm.greetingTextOffset)
                                .opacity(vm.greetingTextOpacity)
                            
                            // Login text - with gradient foreground and tap gesture (no hover animation)
                            Text("LOGIN")
                                .font(.system(size: 16, weight: .semibold, design: .default))
                                .foregroundStyle(
                                    LinearGradient(
                                        gradient: Gradient(colors: [
                                            Color.purple.opacity(0.9),
                                            Color.blue.opacity(0.8),
                                            Color.cyan.opacity(0.7)
                                        ]),
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .padding(.horizontal, 40) // Apply padding to the tappable area
                                .contentShape(Rectangle()) // Ensures the entire padded area is tappable
                                .onTapGesture {
                                    vm.navigateToMainScreen(path: "/verify-user")
                                }
                                .offset(y: vm.loginButtonOffset)
                                .opacity(vm.loginButtonOpacity)
                        }
                        .frame(maxWidth: .infinity, alignment: .center) // Ensure proper centering
                    }
                }
                .frame(maxWidth: .infinity, alignment: .center) // Center the entire content
                
                Spacer()
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .allowsHitTesting(true)
        .onHover { _ in
            // Prevent hover events from bubbling up to parent views
            // This stops the login overlay from triggering hover animations
        }
        .onAppear {
            vm.startLoginAnimationSequence()
            // Request authentication status immediately when login view appears
            vm.requestAuthenticationStatusFromElectron()
            
            // Also request again after a short delay to ensure WebSocket is ready
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                vm.requestAuthenticationStatusFromElectron()
            }
        }
    }
}

// MARK: - Floating lock button aligned bottom-right
private struct FloatingLockButton: View {
    @EnvironmentObject var vm: BoringViewModel
    @ObservedObject var coordinator = BoringViewCoordinator.shared
    @State private var isHovering = false
    
    var body: some View {
        Button(action: {
            vm.toggleNotchLock()
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                vm.forceLockStateRefresh()
            }
        }) {
            ZStack {
                Circle()
                    .fill(vm.isNotchLocked ? Color.white.opacity(0.25) : Color.white.opacity(isHovering ? 0.1 : 0.05))
#if canImport(AppKit)
                Group {
                    if vm.isNotchLocked {
                        if let lockIcon = NSImage.image(lucideId: "lock") {
                            Image(nsImage: lockIcon).renderingMode(.template).foregroundColor(.white)
                        }
                    } else {
                        if let lockOpenIcon = NSImage.image(lucideId: "lock-open") {
                            Image(nsImage: lockOpenIcon).renderingMode(.template).foregroundColor(.white)
                        }
                    }
                }
                .frame(width: 13, height: 13)
#endif
            }
            .frame(width: 32, height: 32)
            .overlay(
                RoundedRectangle(cornerRadius: 32)
                    .inset(by: 0.25)
                    .stroke(
                        vm.isNotchLocked
                        ? Color.white.opacity(0.5)
                        : Color.white.opacity(isHovering ? 0.3 : 0.15),
                        lineWidth: vm.isNotchLocked ? 1.0 : 0.5
                    )
            )
            .scaleEffect(isHovering ? 1.05 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isHovering)
            .animation(.spring(response: 0.3, dampingFraction: 0.6), value: vm.isNotchLocked)
        }
        .buttonStyle(PlainButtonStyle())
        .onHover { hovering in
            isHovering = hovering
            vm.isHoveringLockArea = hovering
            // Open on hover when closed
            if hovering && vm.notchState == .closed {
                withAnimation(.bouncy.speed(1.2)) { vm.open() }
            }
            // Close when leaving if not locked
            if !hovering && vm.notchState == .open && !vm.isNotchLocked {
                vm.close()
            }
        }
        .help(vm.isNotchLocked ? "Unlock notch" : "Lock notch open")
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

#Preview {
    let vm = BoringViewModel()
    vm.open()
    return ContentView()
        .environmentObject(vm)
        .frame(width: vm.notchSize.width, height: vm.notchSize.height)
}
