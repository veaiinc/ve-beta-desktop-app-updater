//
//  boringNotchApp.swift
//  boringNotchApp
//
//  Created by Harsh Vardhan  Goswami  on 02/08/24.
//

import AVFoundation
import Combine
import Defaults
import KeyboardShortcuts
import Sparkle
import SwiftUI

@main
struct DynamicNotchApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @Default(.menubarIcon) var showMenuBarIcon
    @Environment(\.openWindow) var openWindow

    let updaterController: SPUStandardUpdaterController

    init() {
        updaterController = SPUStandardUpdaterController(
            startingUpdater: true, updaterDelegate: nil, userDriverDelegate: nil)

        // Initialize the settings window controller with the updater controller
        SettingsWindowController.shared.setUpdaterController(updaterController)
    }

    var body: some Scene {
        MenuBarExtra("ve.ai", systemImage: "sparkle", isInserted: $showMenuBarIcon) {
            Button("Settings") {
                SettingsWindowController.shared.showWindow()
            }
            .keyboardShortcut(KeyEquivalent(","), modifiers: .command)
            CheckForUpdatesView(updater: updaterController.updater)
            Divider()
            Button("Restart Ve.Ai") {
                guard let bundleIdentifier = Bundle.main.bundleIdentifier else { return }

                let workspace = NSWorkspace.shared

                if let appURL = workspace.urlForApplication(withBundleIdentifier: bundleIdentifier)
                {

                    let configuration = NSWorkspace.OpenConfiguration()
                    configuration.createsNewApplicationInstance = true

                    workspace.openApplication(at: appURL, configuration: configuration)
                }

                NSApplication.shared.terminate(self)
            }
            Button("Quit", role: .destructive) {
                NSApplication.shared.terminate(self)
            }
            .keyboardShortcut(KeyEquivalent("Q"), modifiers: .command)
        }
    }
}

class AppDelegate: NSObject, NSApplicationDelegate {
    var statusItem: NSStatusItem?
    var windows: [NSScreen: NSWindow] = [:]
    var viewModels: [NSScreen: BoringViewModel] = [:]
    private var cancellables = Set<AnyCancellable>()
    var window: NSWindow?
    let vm: BoringViewModel = .init()
    @ObservedObject var coordinator = BoringViewCoordinator.shared
    var whatsNewWindow: NSWindow?
    var timer: Timer?
    var closeNotchWorkItem: DispatchWorkItem?
    private var previousScreens: [NSScreen]?
    private var onboardingWindowController: NSWindowController?

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return false
    }

    func applicationWillTerminate(_ notification: Notification) {
        NotificationCenter.default.removeObserver(self)
        MusicManager.shared.destroy()
        // Cleanup WebSocket connection
        WebSocketManager.shared.cleanup()
        // Cleanup Combine cancellables
        cancellables.removeAll()
        cleanupWindows()
    }

    @objc func onScreenLocked(_: Notification) {
        print("Screen locked")
        cleanupWindows()
    }

    @objc func onScreenUnlocked(_: Notification) {
        print("Screen unlocked")
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) { [weak self] in
            self?.cleanupWindows()
            self?.adjustWindowPosition(changeAlpha: true)
        }
    }

    private func cleanupWindows(shouldInvert: Bool = false) {
        if shouldInvert ? !Defaults[.showOnAllDisplays] : Defaults[.showOnAllDisplays] {
            for window in windows.values {
                window.close()
                NotchSpaceManager.shared.notchSpace.windows.remove(window)
            }
            windows.removeAll()
            viewModels.removeAll()
        } else if let window = window {
            window.close()
            NotchSpaceManager.shared.notchSpace.windows.remove(window)
            self.window = nil
        }
    }

    private func createBoringNotchWindow(for screen: NSScreen, with viewModel: BoringViewModel)
        -> NSWindow
    {
        let window = BoringNotchWindow(
            contentRect: NSRect(
                x: 0, y: 0, width: openNotchSize.width, height: openNotchSize.height),
            styleMask: [.borderless, .nonactivatingPanel, .utilityWindow, .hudWindow],
            backing: .buffered,
            defer: false
        )

        window.contentView = NSHostingView(
            rootView: ContentView()
                .environmentObject(viewModel)
        )

        window.orderFrontRegardless()
        NotchSpaceManager.shared.notchSpace.windows.insert(window)
        return window
    }

    private func positionWindow(_ window: NSWindow, on screen: NSScreen, changeAlpha: Bool = false)
    {
        if changeAlpha {
            window.alphaValue = 0
        }

        DispatchQueue.main.async { [weak window] in
            guard let window = window else { return }
            let screenFrame = screen.frame
            window.setFrameOrigin(
                NSPoint(
                    x: screenFrame.origin.x + (screenFrame.width / 2) - window.frame.width / 2,
                    y: screenFrame.origin.y + screenFrame.height - window.frame.height
                ))
            window.alphaValue = 1
        }
    }

    func applicationDidFinishLaunching(_ notification: Notification) {

        coordinator.setupWorkersNotificationObservers()

        NotificationCenter.default.addObserver(
            self,
            selector: #selector(screenConfigurationDidChange),
            name: NSApplication.didChangeScreenParametersNotification,
            object: nil
        )

        NotificationCenter.default.addObserver(
            forName: Notification.Name.selectedScreenChanged, object: nil, queue: nil
        ) { [weak self] _ in
            self?.adjustWindowPosition(changeAlpha: true)
        }

        NotificationCenter.default.addObserver(
            forName: Notification.Name.notchHeightChanged, object: nil, queue: nil
        ) { [weak self] _ in
            self?.adjustWindowPosition()
        }

        NotificationCenter.default.addObserver(
            forName: Notification.Name.automaticallySwitchDisplayChanged, object: nil, queue: nil
        ) { [weak self] _ in
            guard let self = self, let window = self.window else { return }
            window.alphaValue =
                self.coordinator.selectedScreen == self.coordinator.preferredScreen ? 1 : 0
        }

        NotificationCenter.default.addObserver(
            forName: Notification.Name.showOnAllDisplaysChanged, object: nil, queue: nil
        ) { [weak self] _ in
            guard let self = self else { return }
            self.cleanupWindows(shouldInvert: true)

            if !Defaults[.showOnAllDisplays] {
                let viewModel = self.vm
                let window = self.createBoringNotchWindow(
                    for: NSScreen.main ?? NSScreen.screens.first!, with: viewModel)
                self.window = window
                self.setupStealthModeObserver(for: viewModel, window: window)
                self.adjustWindowPosition(changeAlpha: true)
            } else {
                self.adjustWindowPosition()
            }
        }

        DistributedNotificationCenter.default().addObserver(
            self, selector: #selector(onScreenLocked(_:)),
            name: NSNotification.Name(rawValue: "com.apple.screenIsLocked"), object: nil)
        DistributedNotificationCenter.default().addObserver(
            self, selector: #selector(onScreenUnlocked(_:)),
            name: NSNotification.Name(rawValue: "com.apple.screenIsUnlocked"), object: nil)

        KeyboardShortcuts.onKeyDown(for: .toggleSneakPeek) { [weak self] in
            guard let self = self else { return }
            self.coordinator.toggleSneakPeek(
                status: !self.coordinator.sneakPeek.show,
                type: .music,
                duration: 3.0
            )
        }

        KeyboardShortcuts.onKeyDown(for: .toggleNotchOpen) { [weak self] in
            guard let self = self else { return }

            let mouseLocation = NSEvent.mouseLocation

            var viewModel = self.vm

            if Defaults[.showOnAllDisplays] {
                for screen in NSScreen.screens {
                    if screen.frame.contains(mouseLocation) {
                        if let screenViewModel = self.viewModels[screen] {
                            viewModel = screenViewModel
                            break
                        }
                    }
                }
            }

            self.closeNotchWorkItem?.cancel()
            self.closeNotchWorkItem = nil

            switch viewModel.notchState {
            case .closed:
                viewModel.open()

                let workItem = DispatchWorkItem { [weak viewModel] in
                    viewModel?.close()
                }
                self.closeNotchWorkItem = workItem

                DispatchQueue.main.asyncAfter(deadline: .now() + 3.0, execute: workItem)
            case .open:
                viewModel.close()
            }
        }

        if !Defaults[.showOnAllDisplays] {
            let viewModel = self.vm
            let window = createBoringNotchWindow(
                for: NSScreen.main ?? NSScreen.screens.first!, with: viewModel)
            self.window = window
            setupStealthModeObserver(for: viewModel, window: window)
            adjustWindowPosition(changeAlpha: true)
        } else {
            adjustWindowPosition(changeAlpha: true)
        }

        if coordinator.firstLaunch {
            DispatchQueue.main.async {
                self.showOnboardingWindow()
            }
            playWelcomeSound()
        } else if MusicManager.shared.isNowPlayingDeprecated
            && Defaults[.mediaController] == .nowPlaying
        {
            DispatchQueue.main.async {
                self.showOnboardingWindow(step: .musicPermission)
            }
        }

        previousScreens = NSScreen.screens
        
        // Auto-connect websocket on app startup
        autoConnectWebSocketOnStartup()
        
        // Setup stdin message handling for Electron communication
        setupStdinMessageHandling()
        
        // Setup WebSocket event handling for Electron communication
        setupWebSocketEventHandling()
    }
    
    private func autoConnectWebSocketOnStartup() {
        print("🔌 AppDelegate: Setting up websocket auto-connection on app startup...")
        
        // Connect immediately and also after a delay to ensure connection
        print("🔌 AppDelegate: Auto-connecting to websocket immediately...")
        WebSocketManager.shared.connect()
        
        // Also try again after a short delay to ensure connection is established
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            print("🔌 AppDelegate: Retrying websocket connection...")
            if !WebSocketManager.shared.isConnected {
                WebSocketManager.shared.connect()
            }
        }
    }
    
    private func setupStdinMessageHandling() {
        print("📡 AppDelegate: Setting up stdin message handling for Electron communication...")

        // Create a background queue for stdin reading
        let stdinQueue = DispatchQueue(label: "stdin.reader", qos: .background)

        stdinQueue.async {
            while let line = readLine() {
                // Process the message on the main queue
                DispatchQueue.main.async {
                    self.handleStdinMessage(line)
                }
            }
        }
    }
    
    private func setupWebSocketEventHandling() {
        print("🌐 AppDelegate: Setting up WebSocket event handling for Electron communication...")
        
        // Listen to WebSocket events
        WebSocketManager.shared.eventSubject
            .sink { [weak self] event in
                self?.handleWebSocketEvent(event)
            }
            .store(in: &cancellables)
    }
    
    private func handleWebSocketEvent(_ event: WebSocketEvent) {
        print("🌐 AppDelegate: Received WebSocket event: \(event.type.rawValue)")
        
        switch event.type {
        case .boringNotchMessage:
            // Handle messages from Electron
            // The data has already been parsed by WebSocketManager, so we can use it directly
            print("🌐 AppDelegate: Processing WebSocket message from Electron: \(event.data)")
            
            // Handle the parsed message object
            if let messageType = event.data["type"] as? String {
                print("🌐 AppDelegate: Message type: \(messageType)")
                                
                                switch messageType {
                                case "activate_voice_interface":
                                    print("🌐 AppDelegate: Activating voice interface from WebSocket message")
                                    DispatchQueue.main.async {
                                        self.vm.activateVoiceInterface()
                                    }
                                case "update_voice_connection_status":
                                    if let statusString = event.data["status"] as? String,
                                       let status = VoiceConnectionStatus(rawValue: statusString) {
                                        print("🌐 AppDelegate: Updating voice connection status: \(status)")
                                        DispatchQueue.main.async {
                                            self.vm.updateVoiceConnectionStatus(status)
                                        }
                                    }
                                case "add_voice_message":
                                    if let content = event.data["content"] as? String,
                                       let isFromAgent = event.data["isFromAgent"] as? Bool {
                                        print("🌐 AppDelegate: Adding voice message: \(content), fromAgent: \(isFromAgent)")
                                        DispatchQueue.main.async {
                                            let message = VoiceMessage(content: content, isFromAgent: isFromAgent)
                                            self.vm.addVoiceMessage(message)
                                        }
                                    }
                                default:
                                    print("🌐 AppDelegate: Unknown message type: \(messageType)")
                                }
            } else {
                print("🌐 AppDelegate: Could not extract message type from WebSocket event data: \(event.data)")
            }
        default:
            break
        }
    }
    
    private func handleStdinMessage(_ message: String) {
        print("📡 AppDelegate: Received stdin message: \(message)")
        
        // Try to parse as JSON
        guard let data = message.data(using: .utf8),
              let jsonObject = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let messageType = jsonObject["type"] as? String else {
            print("⚠️ AppDelegate: Could not parse stdin message as JSON")
            return
        }
        
        switch messageType {
        case "activate_voice_interface":
            print("🎤 AppDelegate: Activating voice interface from Electron")
            // Find the appropriate view model and activate voice interface
            if Defaults[.showOnAllDisplays] {
                // For all displays, activate on the main screen
                if let mainScreen = NSScreen.main,
                   let viewModel = viewModels[mainScreen] {
                    viewModel.activateVoiceInterface()
                }
            } else {
                // For single display, use the main view model
                vm.activateVoiceInterface()
            }
            
        case "deactivate_voice_interface":
            print("🔌 AppDelegate: Deactivating voice interface from Electron")
            // Find the appropriate view model and deactivate voice interface
            if Defaults[.showOnAllDisplays] {
                // For all displays, deactivate on the main screen
                if let mainScreen = NSScreen.main,
                   let viewModel = viewModels[mainScreen] {
                    viewModel.deactivateVoiceInterface()
                }
            } else {
                // For single display, use the main view model
                vm.deactivateVoiceInterface()
            }
            
        case "add_voice_message":
            print("💬 AppDelegate: Adding voice message from Electron")
            if let content = jsonObject["content"] as? String,
               let isFromAgent = jsonObject["isFromAgent"] as? Bool {
                let voiceMessage = VoiceMessage(content: content, isFromAgent: isFromAgent)
                
                // Find the appropriate view model and add message
                if Defaults[.showOnAllDisplays] {
                    if let mainScreen = NSScreen.main,
                       let viewModel = viewModels[mainScreen] {
                        viewModel.addVoiceMessage(voiceMessage)
                    }
                } else {
                    vm.addVoiceMessage(voiceMessage)
                }
            }
            
            case "update_voice_connection_status":
                print("🔗 AppDelegate: Updating voice connection status from Electron")
                if let statusString = jsonObject["status"] as? String,
                   let status = VoiceConnectionStatus(rawValue: statusString) {

                    // Find the appropriate view model and update status
                    if Defaults[.showOnAllDisplays] {
                        if let mainScreen = NSScreen.main,
                           let viewModel = viewModels[mainScreen] {
                            viewModel.updateVoiceConnectionStatus(status)
                        }
                    } else {
                        vm.updateVoiceConnectionStatus(status)
                    }
                }

            case "disconnect_voice_agent":
                print("🔌 AppDelegate: Disconnecting voice agent from boring.notch")
                // Find the appropriate view model and deactivate voice interface
                if Defaults[.showOnAllDisplays] {
                    // For all displays, deactivate on the main screen
                    if let mainScreen = NSScreen.main,
                       let viewModel = viewModels[mainScreen] {
                        viewModel.deactivateVoiceInterface()
                    }
                } else {
                    // For single display, use the main view model
                    vm.deactivateVoiceInterface()
                }

            case "toggle_voice_mute":
                print("🎤 AppDelegate: Toggling voice mute from boring.notch")
                if let isMuted = jsonObject["isMuted"] as? Bool {
                    // Find the appropriate view model and update mute state
                    if Defaults[.showOnAllDisplays] {
                        if let mainScreen = NSScreen.main,
                           let viewModel = viewModels[mainScreen] {
                            viewModel.isMicrophoneMuted = isMuted
                        }
                    } else {
                        vm.isMicrophoneMuted = isMuted
                    }
                }

            case "electron_voice_mute":
                print("🎤 AppDelegate: Received electron_voice_mute command from boring.notch")
                if let isMuted = jsonObject["isMuted"] as? Bool {
                    // Update local UI state
                    if Defaults[.showOnAllDisplays] {
                        if let mainScreen = NSScreen.main,
                           let viewModel = viewModels[mainScreen] {
                            viewModel.isMicrophoneMuted = isMuted
                        }
                    } else {
                        vm.isMicrophoneMuted = isMuted
                    }
                    
                    // Send the command to Electron via stdout
                    let command = """
                    {"type": "electron_voice_mute", "isMuted": \(isMuted), "timestamp": \(Int(Date().timeIntervalSince1970 * 1000)), "source": "boring-notch"}
                    """
                    print(command)
                    fflush(stdout)
                }

            case "electron_voice_disconnect":
                print("🔌 AppDelegate: Received electron_voice_disconnect command from boring.notch")
                // Update local UI state
                if Defaults[.showOnAllDisplays] {
                    if let mainScreen = NSScreen.main,
                       let viewModel = viewModels[mainScreen] {
                        viewModel.deactivateVoiceInterface()
                    }
                } else {
                    vm.deactivateVoiceInterface()
                }
                
                // Send the command to Electron via stdout
                let command = """
                {"type": "electron_voice_disconnect", "timestamp": \(Int(Date().timeIntervalSince1970 * 1000)), "source": "boring-notch"}
                """
                print(command)
                fflush(stdout)

            case "direct_voice_mute":
                print("🎤 AppDelegate: Direct voice mute command from boring.notch")
                if let isMuted = jsonObject["isMuted"] as? Bool {
                    // Update local UI state
                    if Defaults[.showOnAllDisplays] {
                        if let mainScreen = NSScreen.main,
                           let viewModel = viewModels[mainScreen] {
                            viewModel.isMicrophoneMuted = isMuted
                        }
                    } else {
                        vm.isMicrophoneMuted = isMuted
                    }
                    
                    // Send direct command to Electron to actually control the voice agent
                    let electronCommand = """
                    {"type": "electron_voice_mute", "isMuted": \(isMuted), "timestamp": \(Int(Date().timeIntervalSince1970 * 1000)), "source": "boring-notch"}
                    """
                    print(electronCommand)
                }

            case "direct_voice_disconnect":
                print("🔌 AppDelegate: Direct voice disconnect command from boring.notch")
                // Update local UI state
                if Defaults[.showOnAllDisplays] {
                    if let mainScreen = NSScreen.main,
                       let viewModel = viewModels[mainScreen] {
                        viewModel.deactivateVoiceInterface()
                    }
                } else {
                    vm.deactivateVoiceInterface()
                }
                
                // Send direct command to Electron to actually disconnect the voice agent
                let electronCommand = """
                {"type": "electron_voice_disconnect", "timestamp": \(Int(Date().timeIntervalSince1970 * 1000)), "source": "boring-notch"}
                """
                print(electronCommand)

            default:
                print("⚠️ AppDelegate: Unknown message type: \(messageType)")
            }
    }

    func playWelcomeSound() {
        let audioPlayer = AudioPlayer()
        audioPlayer.play(fileName: "boring", fileExtension: "m4a")
    }

    func deviceHasNotch() -> Bool {
        if #available(macOS 12.0, *) {
            for screen in NSScreen.screens {
                if screen.safeAreaInsets.top > 0 {
                    return true
                }
            }
        }
        return false
    }

    @objc func screenConfigurationDidChange() {
        let currentScreens = NSScreen.screens

        let screensChanged =
            currentScreens.count != previousScreens?.count
            || Set(currentScreens.map { $0.localizedName })
                != Set(previousScreens?.map { $0.localizedName } ?? [])
            || Set(currentScreens.map { $0.frame }) != Set(previousScreens?.map { $0.frame } ?? [])

        previousScreens = currentScreens

        if screensChanged {
            DispatchQueue.main.async { [weak self] in
                self?.cleanupWindows()
                self?.adjustWindowPosition()
            }
        }
    }

    @objc func adjustWindowPosition(changeAlpha: Bool = false) {
        if Defaults[.showOnAllDisplays] {
            let currentScreens = Set(NSScreen.screens)

            for screen in windows.keys where !currentScreens.contains(screen) {
                if let window = windows[screen] {
                    window.close()
                    NotchSpaceManager.shared.notchSpace.windows.remove(window)
                    windows.removeValue(forKey: screen)
                    viewModels.removeValue(forKey: screen)
                }
            }

            for screen in currentScreens {
                if windows[screen] == nil {
                    let viewModel = BoringViewModel(screen: screen.localizedName)
                    let window = createBoringNotchWindow(for: screen, with: viewModel)

                    windows[screen] = window
                    viewModels[screen] = viewModel
                    setupStealthModeObserver(for: viewModel, window: window)
                }

                if let window = windows[screen], let viewModel = viewModels[screen] {
                    positionWindow(window, on: screen, changeAlpha: changeAlpha)

                    if viewModel.notchState == .closed {
                        viewModel.close()
                    }
                }
            }
        } else {
            let selectedScreen: NSScreen

            if let preferredScreen = NSScreen.screens.first(where: {
                $0.localizedName == coordinator.preferredScreen
            }) {
                coordinator.selectedScreen = coordinator.preferredScreen
                selectedScreen = preferredScreen
            } else if Defaults[.automaticallySwitchDisplay], let mainScreen = NSScreen.main {
                coordinator.selectedScreen = mainScreen.localizedName
                selectedScreen = mainScreen
            } else {
                if let window = window {
                    window.alphaValue = 0
                }
                return
            }

            vm.screen = selectedScreen.localizedName
            vm.notchSize = getClosedNotchSize(screen: selectedScreen.localizedName)

            if window == nil {
                window = createBoringNotchWindow(for: selectedScreen, with: vm)
            }

            if let window = window {
                positionWindow(window, on: selectedScreen, changeAlpha: changeAlpha)

                if vm.notchState == .closed {
                    vm.close()
                }
            }
        }
    }

    @objc func togglePopover(_ sender: Any?) {
        if window?.isVisible == true {
            window?.orderOut(nil)
        } else {
            window?.orderFrontRegardless()
        }
    }

    @objc func showMenu() {
        statusItem?.menu?.popUp(positioning: nil, at: NSEvent.mouseLocation, in: nil)
    }

    @objc func quitAction() {
        NSApplication.shared.terminate(self)
    }

    private func showOnboardingWindow(step: OnboardingStep = .welcome) {
        if onboardingWindowController == nil {
            let window = NSWindow(
                contentRect: NSRect(x: 0, y: 0, width: 400, height: 600),
                styleMask: [.titled, .fullSizeContentView],
                backing: .buffered,
                defer: false
            )
            window.center()
            window.title = "Onboarding"
            window.titlebarAppearsTransparent = true
            window.titleVisibility = .hidden
            window.contentView = NSHostingView(
                rootView: OnboardingView(
                    step: step,
                    onFinish: {
                        window.orderOut(nil)
//                        NSApp.setActivationPolicy(.accessory)
                        window.close()
                        NSApp.deactivate()
                    },
                    onOpenSettings: {
                        window.close()
                        SettingsWindowController.shared.showWindow()
                    }
                ))
            window.isRestorable = false
            window.identifier = NSUserInterfaceItemIdentifier("OnboardingWindow")

            onboardingWindowController = NSWindowController(window: window)
        }

//        NSApp.setActivationPolicy(.regular)
        NSApp.activate(ignoringOtherApps: true)
        onboardingWindowController?.window?.makeKeyAndOrderFront(nil)
        onboardingWindowController?.window?.orderFrontRegardless()
    }
    
    // MARK: - Stealth Mode Observer
    private func setupStealthModeObserver(for viewModel: BoringViewModel, window: NSWindow) {
        viewModel.$isStealthModeEnabled
            .sink { [weak window] isEnabled in
                guard let window = window else { return }
                
                if isEnabled {
                    // STEALTH MODE ON: Hide from screen recordings
                    if #available(macOS 10.13, *) {
                        window.sharingType = .none
                    }
                    window.level = NSWindow.Level(rawValue: Int(CGWindowLevelForKey(.maximumWindow)))
                } else {
                    // STEALTH MODE OFF: Restore normal behavior
                    if #available(macOS 10.13, *) {
                        window.sharingType = .readOnly
                    }
                    window.level = .mainMenu + 3  // Original level from BoringNotchWindow
                }
            }
            .store(in: &cancellables)
    }
}

extension Notification.Name {
    static let selectedScreenChanged = Notification.Name("SelectedScreenChanged")
    static let notchHeightChanged = Notification.Name("NotchHeightChanged")
    static let showOnAllDisplaysChanged = Notification.Name("showOnAllDisplaysChanged")
    static let automaticallySwitchDisplayChanged = Notification.Name("automaticallySwitchDisplayChanged")
}

extension CGRect: @retroactive Hashable {
    public func hash(into hasher: inout Hasher) {
        hasher.combine(origin.x)
        hasher.combine(origin.y)
        hasher.combine(size.width)
        hasher.combine(size.height)
    }

    public static func == (lhs: CGRect, rhs: CGRect) -> Bool {
        return lhs.origin == rhs.origin && lhs.size == rhs.size
    }
}
