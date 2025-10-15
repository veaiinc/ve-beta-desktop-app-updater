//
//  BoringViewCoordinator.swift
//  boringNotch
//
//  Created by Alexander on 2024-11-20.
//

import Combine
import Defaults
import SwiftUI
import TheBoringWorkerNotifier

enum SneakContentType {
    case brightness
    case volume
    case backlight
    case music
    case mic
    case battery
    case download
}

struct sneakPeek {
    var show: Bool = false
    var type: SneakContentType = .music
    var value: CGFloat = 0
    var icon: String = ""
}

struct SharedSneakPeek: Codable {
    var show: Bool
    var type: String
    var value: String
    var icon: String
}

enum BrowserType {
    case chromium
    case safari
}

struct ExpandedItem {
    var show: Bool = false
    var type: SneakContentType = .battery
    var value: CGFloat = 0
    var browser: BrowserType = .chromium
}

class BoringViewCoordinator: ObservableObject {
    static let shared = BoringViewCoordinator()
    var notifier: TheBoringWorkerNotifier = .init()

    // Persist and publish current tab
    @Published var currentView: NotchViews = .home {
        didSet {
            // Persist whenever it changes
            selectedTab = currentView
        }
    }

    private var sneakPeekDispatch: DispatchWorkItem?
    private var expandingViewDispatch: DispatchWorkItem?

    @AppStorage("firstLaunch") var firstLaunch: Bool = true
    @AppStorage("showWhatsNew") var showWhatsNew: Bool = true
    @AppStorage("musicLiveActivityEnabled") var musicLiveActivityEnabled: Bool = true
    @AppStorage("currentMicStatus") var currentMicStatus: Bool = true

    @AppStorage("alwaysShowTabs") var alwaysShowTabs: Bool = true {
        didSet {
            if !alwaysShowTabs {
                openLastTabByDefault = false
                if TrayDrop.shared.isEmpty || !Defaults[.openShelfByDefault] {
                    currentView = .home
                }
            }
        }
    }

    @AppStorage("openLastTabByDefault") var openLastTabByDefault: Bool = false {
        didSet {
            if openLastTabByDefault {
                alwaysShowTabs = true
            }
        }
    }
    
    @AppStorage("hudReplacement") var hudReplacement: Bool = true {
        didSet {
            notifier.postNotification(name: notifier.toggleHudReplacementNotification.name, userInfo: nil)
        }
    }
    
    @AppStorage("preferred_screen_name") var preferredScreen = NSScreen.main?.localizedName ?? "Unknown" {
        didSet {
            selectedScreen = preferredScreen
            NotificationCenter.default.post(name: Notification.Name.selectedScreenChanged, object: nil)
        }
    }

    @Published var selectedScreen: String = NSScreen.main?.localizedName ?? "Unknown"

    @Published var optionKeyPressed: Bool = true

    private init() {
        selectedScreen = preferredScreen
        notifier = TheBoringWorkerNotifier()
        // Restore last selected tab at startup
        currentView = selectedTab
        // Restore meeting state
        restoreMeetingState()
        // Restore active meeting view
        restoreActiveMeetingView()
        
        // Setup notification observers
        setupNotificationObservers()
    }
    
    private func setupNotificationObservers() {
        // Listen for meeting stopped navigation
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleMeetingStoppedNavigation),
            name: NSNotification.Name("MeetingStoppedNavigateHome"),
            object: nil
        )
    }
    
    @objc private func handleMeetingStoppedNavigation() {
        print("🏠 BoringViewCoordinator: Handling meeting stopped navigation")
        
        // Navigate to home view
        DispatchQueue.main.async {
            self.currentView = .home
        }
        
        // Ensure notch shrinks when not in meeting
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.shrinkNotchIfNeeded()
        }
    }
    
    private func shrinkNotchIfNeeded() {
        // This will be handled by the BoringViewModel
        // We can post a notification or use a delegate pattern
        NotificationCenter.default.post(
            name: NSNotification.Name("ShrinkNotchAfterMeeting"),
            object: nil
        )
    }
    
    deinit {
        // Clean up notification observers
        NotificationCenter.default.removeObserver(self)
    }

    func setupWorkersNotificationObservers() {
        notifier.setupObserver(notification: notifier.micStatusNotification, handler: initialMicStatus)
        notifier.setupObserver(notification: notifier.sneakPeakNotification, handler: sneakPeekEvent)
    }
    
    @objc func sneakPeekEvent(_ notification: Notification) {
        let decoder = JSONDecoder()
        if let decodedData = try? decoder.decode(
            SharedSneakPeek.self, from: notification.userInfo?.first?.value as! Data)
        {
            let contentType =
                decodedData.type == "brightness"
                ? SneakContentType.brightness
                : decodedData.type == "volume"
                    ? SneakContentType.volume
                    : decodedData.type == "backlight"
                        ? SneakContentType.backlight
                        : decodedData.type == "mic"
                            ? SneakContentType.mic : SneakContentType.brightness

            let formatter = NumberFormatter()
            formatter.locale = Locale(identifier: "en_US_POSIX")
            formatter.numberStyle = .decimal
            let value = CGFloat((formatter.number(from: decodedData.value) ?? 0.0).floatValue)
            let icon = decodedData.icon

            print("Decoded: \(decodedData), Parsed value: \(value)")

            toggleSneakPeek(status: decodedData.show, type: contentType, value: value, icon: icon)

        } else {
            print("Failed to decode JSON data")
        }
    }

    func toggleSneakPeek(
        status: Bool, type: SneakContentType, duration: TimeInterval = 1.5, value: CGFloat = 0,
        icon: String = ""
    ) {
        sneakPeekDuration = duration
        if type != .music {
            if !hudReplacement {
                return
            }
        }
        DispatchQueue.main.async {
            withAnimation(.smooth) {
                self.sneakPeek.show = status
                self.sneakPeek.type = type
                self.sneakPeek.value = value
                self.sneakPeek.icon = icon
            }
        }

        if type == .mic {
            currentMicStatus = value == 1
        }
    }

    private var sneakPeekDuration: TimeInterval = 1.5
    private var sneakPeekTask: Task<Void, Never>?

    private func scheduleSneakPeekHide(after duration: TimeInterval) {
        sneakPeekTask?.cancel()

        sneakPeekTask = Task { [weak self] in
            try? await Task.sleep(for: .seconds(duration))
            guard let self = self, !Task.isCancelled else { return }
            await MainActor.run {
                withAnimation {
                    self.toggleSneakPeek(status: false, type: .music)
                    self.sneakPeekDuration = 1.5
                }
            }
        }
    }

    @Published var sneakPeek: sneakPeek = .init() {
        didSet {
            if sneakPeek.show {
                scheduleSneakPeekHide(after: sneakPeekDuration)
            } else {
                sneakPeekTask?.cancel()
            }
        }
    }

    func toggleExpandingView(
        status: Bool,
        type: SneakContentType,
        value: CGFloat = 0,
        browser: BrowserType = .chromium
    ) {
        Task { @MainActor in
            withAnimation(.smooth) {
                self.expandingView.show = status
                self.expandingView.type = type
                self.expandingView.value = value
                self.expandingView.browser = browser
            }
        }
    }

    private var expandingViewTask: Task<Void, Never>?

    @Published var expandingView: ExpandedItem = .init() {
        didSet {
            if expandingView.show {
                expandingViewTask?.cancel()
                let duration: TimeInterval = (expandingView.type == .download ? 2 : 3)
                expandingViewTask = Task { [weak self] in
                    try? await Task.sleep(for: .seconds(duration))
                    guard let self = self, !Task.isCancelled else { return }
                    self.toggleExpandingView(status: false, type: .battery)
                }
            } else {
                expandingViewTask?.cancel()
            }
        }
    }

    @objc func initialMicStatus(_ notification: Notification) {
        currentMicStatus = notification.userInfo?.first?.value as! Bool
    }
    
    func toggleMic() {
        notifier.postNotification(name: notifier.toggleMicNotification.name, userInfo: nil)
    }
    
    func showEmpty() {
        currentView = .home
    }

    // MARK: - Meeting Timer and persisted meeting state

    @AppStorage("isMeetingStarted") var isMeetingStarted: Bool = false {
        didSet {
            objectWillChange.send()
        }
    }
    @AppStorage("meetingElapsed") var persistedMeetingElapsed: Double = 0
    @AppStorage("meetingIsPaused") var persistedMeetingIsPaused: Bool = true
    @AppStorage("meetingStartTimestamp") var persistedMeetingStartTimestamp: Double = 0
    @AppStorage("activeMeetingView") var persistedActiveMeetingView: String = "transcription"

    @Published var meetingElapsed: TimeInterval = 0
    @Published var meetingIsPaused: Bool = true
    @Published var activeMeetingView: ActiveMeetingView = .transcription

    private var meetingStartDate: Date?
    private var meetingTickerTask: Task<Void, Never>?

    private func ensureMeetingTicker() {
        // Cancel existing task if it exists
        meetingTickerTask?.cancel()
        meetingTickerTask = nil
        
        // Only start new task if meeting is started
        guard isMeetingStarted else { return }
        
        meetingTickerTask = Task { [weak self] in
            guard let self else { return }
            while !Task.isCancelled {
                await MainActor.run {
                    if !self.meetingIsPaused, let start = self.meetingStartDate {
                        self.meetingElapsed += Date().timeIntervalSince(start)
                        self.meetingStartDate = Date()
                        // Persist the updated elapsed time
                        self.persistedMeetingElapsed = self.meetingElapsed
                        print("⏱️ Timer updated: \(self.formattedMeetingTime())")
                    }
                }
                try? await Task.sleep(for: .seconds(1))
            }
        }
    }

    func meetingStart() {
        if !isMeetingStarted {
            // First start: reset and run
            isMeetingStarted = true
            meetingElapsed = 0
            persistedMeetingElapsed = 0
            meetingStartDate = Date()
            persistedMeetingStartTimestamp = Date().timeIntervalSince1970
            meetingIsPaused = false
            persistedMeetingIsPaused = false
            print("🚀 Meeting started - Timer initialized")
        } else {
            // Already started: treat as resume without reset
            if meetingIsPaused {
                meetingStartDate = Date()
                persistedMeetingStartTimestamp = Date().timeIntervalSince1970
                meetingIsPaused = false
                persistedMeetingIsPaused = false
                print("▶️ Meeting resumed - Timer restarted")
            }
        }
        ensureMeetingTicker()
    }

    func meetingPause() {
        if let start = meetingStartDate {
            meetingElapsed += Date().timeIntervalSince(start)
            persistedMeetingElapsed = meetingElapsed
        }
        meetingStartDate = nil
        persistedMeetingStartTimestamp = 0
        meetingIsPaused = true
        persistedMeetingIsPaused = true
        print("⏸️ Meeting paused - Timer stopped")
        ensureMeetingTicker()
    }

    func meetingResume() {
        if meetingIsPaused {
            meetingStartDate = Date()
            persistedMeetingStartTimestamp = Date().timeIntervalSince1970
            meetingIsPaused = false
            persistedMeetingIsPaused = false
            print("▶️ Meeting resumed - Timer restarted")
        }
        ensureMeetingTicker()
    }

    func meetingStopAndReset() {
        // Cancel the timer task first
        meetingTickerTask?.cancel()
        meetingTickerTask = nil
        
        isMeetingStarted = false
        meetingElapsed = 0
        persistedMeetingElapsed = 0
        meetingStartDate = nil
        persistedMeetingStartTimestamp = 0
        meetingIsPaused = true
        persistedMeetingIsPaused = true
        
        print("🛑 Meeting stopped and reset - All timers cleared")
    }

    func formattedMeetingTime() -> String {
        let total = Int(max(0, meetingElapsed.rounded()))
        let hours = total / 3600
        let minutes = (total % 3600) / 60
        let seconds = total % 60
        if hours > 0 {
            return String(format: "%02d:%02d:%02d", hours, minutes, seconds)
        } else {
            return String(format: "%02d:%02d", minutes, seconds)
        }
    }

    // MARK: - Meeting State Restoration

    func restoreMeetingState() {
        // Restore persisted state
        meetingElapsed = persistedMeetingElapsed
        meetingIsPaused = persistedMeetingIsPaused
        
        // If meeting was started and not paused, calculate elapsed time since last start
        if isMeetingStarted && !meetingIsPaused && persistedMeetingStartTimestamp > 0 {
            let timeSinceStart = Date().timeIntervalSince1970 - persistedMeetingStartTimestamp
            meetingElapsed += timeSinceStart
            meetingStartDate = Date()
            // Update the persisted elapsed time with the additional time
            persistedMeetingElapsed = meetingElapsed
        }
        
        // Start ticker if meeting is active
        if isMeetingStarted {
            ensureMeetingTicker()
        }
        
        print("🔄 Meeting state restored - Started: \(isMeetingStarted), Paused: \(meetingIsPaused), Elapsed: \(meetingElapsed)")
    }

    // MARK: - Persist selected tab without changing NotchViews

    @AppStorage("selectedTabRaw") private var selectedTabRaw: String = "home"

    var selectedTab: NotchViews {
        get {
            switch selectedTabRaw {
            case "shelf": return .shelf
            case "meeting": return .meeting
            case "ask": return .ask
            default: return .home
            }
        }
        set {
            selectedTabRaw = {
                switch newValue {
                case .home: return "home"
                case .shelf: return "shelf"
                case .meeting: return "meeting"
                case .ask: return "ask"
                }
            }()
        }
    }
    
    // MARK: - Active Meeting View Persistence
    
    var persistedActiveMeetingViewValue: ActiveMeetingView {
        get {
            switch persistedActiveMeetingView {
            case "liveIntelligence": return .liveIntelligence
            default: return .transcription
            }
        }
        set {
            persistedActiveMeetingView = {
                switch newValue {
                case .transcription: return "transcription"
                case .liveIntelligence: return "liveIntelligence"
                }
            }()
        }
    }
    
    func restoreActiveMeetingView() {
        activeMeetingView = persistedActiveMeetingViewValue
        print("🔄 Active meeting view restored: \(activeMeetingView)")
    }
    
    func toggleActiveMeetingView() {
        activeMeetingView = activeMeetingView == .transcription ? .liveIntelligence : .transcription
        persistedActiveMeetingViewValue = activeMeetingView
        print("🔄 Active meeting view toggled to: \(activeMeetingView)")
    }
}

