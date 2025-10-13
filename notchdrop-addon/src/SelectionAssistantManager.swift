//
//  SelectionAssistantManager.swift
//  NotchDrop
//
//  Coordinates accessibility monitoring, secure history, and UI presentation.
//

import AppKit
import Combine
import SwiftUI
import ApplicationServices

final class SelectionAssistantManager: NSObject {
    static let shared = SelectionAssistantManager()

    enum Mode {
        case onboarding
        case prompt
        case history
        case idle
    }

    private enum Preferences {
        static let consentKey = "com.ve.selectionassistant.consent"
        static let lastPermissionStateKey = "com.ve.selectionassistant.lastPermissionState"
    }

    private let selectionMonitor = SelectionMonitor()
    private let historyStore = SelectionHistoryStore.shared
    private let userDefaults = UserDefaults.standard
    private let state = SelectionAssistantState()
    private let popupController: SelectionPopupController
    private let selectionPreviewController: SelectionPreviewController
    private var permissionPollTimer: Timer?
    private var onboardingShown = false
    private var lastSelectionTimestamp: Date?
    private var pendingHideWorkItem: DispatchWorkItem?
    private let selectionPersistDuration: TimeInterval = 1.8

    var onSelectionCaptured: ((SelectionHistoryEntry) -> Void)?
    var onPermissionStateChanged: ((Bool) -> Void)?
    var onSelectionAskAI: ((String) -> Void)?

    override private init() {
        assert(Thread.isMainThread, "SelectionAssistantManager must be initialized on the main thread.")
        popupController = SelectionPopupController(state: state)
        var askAIForwarder: ((String) -> Void)?
        selectionPreviewController = SelectionPreviewController { selectedText in
            askAIForwarder?(selectedText)
        }
        super.init()

        askAIForwarder = { [weak self] selectedText in
            guard let self else { return }
            print("the prompt is sent to ask ai", selectedText)
            self.selectionPreviewController.hide()
            self.onSelectionAskAI?(selectedText)
        }

        selectionPreviewController.onDismiss = { [weak self] in
            self?.pendingHideWorkItem?.cancel()
            self?.pendingHideWorkItem = nil
        }

        selectionMonitor.delegate = self
        state.permissionGranted = AXIsProcessTrusted()
        state.consentGranted = userDefaults.bool(forKey: Preferences.consentKey)
        state.mode = state.consentGranted && state.permissionGranted ? .idle : .onboarding

        popupController.onToggleHistory = { [weak self] in
            self?.toggleHistory()
        }
        popupController.onCloseRequested = { [weak self] in
            self?.dismiss()
        }

        state.onCopySelection = { [weak self] entry in
            self?.copyToClipboard(entry.text)
        }

        state.onPinSelection = { [weak self] entry, isPinned in
            self?.updatePinnedState(for: entry, isPinned: isPinned)
        }

        state.onClearHistory = { [weak self] in
            self?.clearHistory()
        }

        state.onDeleteEntry = { [weak self] entry in
            self?.deleteEntry(entry)
        }

        state.onRequestPermission = { [weak self] in
            self?.requestAccessibilityPermission()
        }

        state.onAcknowledgeOnboarding = { [weak self] in
            self?.acknowledgeOnboarding()
        }
    }

    func start() {
        refreshHistory()

        if state.permissionGranted && state.consentGranted {
            selectionMonitor.start()
        } else if !state.consentGranted {
            showOnboarding()
        } else {
            requestAccessibilityPermission()
        }
    }

    func dismiss() {
        pendingHideWorkItem?.cancel()
        pendingHideWorkItem = nil
        popupController.closePopover()
        selectionPreviewController.hide()
        state.mode = state.permissionGranted ? .idle : .onboarding
    }

    func showHistoryView() {
        refreshHistory()
        state.mode = .history
        popupController.showPopover()
    }

    func presentHistoryInterface() {
        DispatchQueue.main.async { [weak self] in
            self?.showHistoryView()
        }
    }

    func requestAccessibilityPrompt() {
        DispatchQueue.main.async { [weak self] in
            self?.requestAccessibilityPermission()
        }
    }

    func isAccessibilityPermissionGranted() -> Bool {
        state.permissionGranted
    }

    func fetchHistoryEntries() -> [SelectionHistoryEntry] {
        historyStore.entriesSync()
    }

    func clearAllHistoryEntries() {
        clearHistory()
    }

    private func showOnboarding() {
        guard !onboardingShown else { return }
        onboardingShown = true
        state.mode = .onboarding
        popupController.showPopover()
    }

    private func acknowledgeOnboarding() {
        state.consentGranted = true
        userDefaults.set(true, forKey: Preferences.consentKey)
        requestAccessibilityPermission()
    }

    private func requestAccessibilityPermission() {
        let promptKey = kAXTrustedCheckOptionPrompt.takeUnretainedValue()
        let options = [promptKey: true] as CFDictionary
        let trusted = AXIsProcessTrustedWithOptions(options)
        state.permissionGranted = trusted
        onPermissionStateChanged?(trusted)

        if trusted {
            userDefaults.set(true, forKey: Preferences.lastPermissionStateKey)
            selectionMonitor.start()
            refreshHistory()
            popupController.closePopover()
            state.mode = state.consentGranted ? .idle : .onboarding
        } else {
            schedulePermissionPoll()
        }
    }

    private func schedulePermissionPoll() {
        permissionPollTimer?.invalidate()
        permissionPollTimer = Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true) { [weak self] timer in
            guard let self else { return }
            let trusted = AXIsProcessTrusted()
            if trusted {
                timer.invalidate()
                self.state.permissionGranted = true
                self.onPermissionStateChanged?(true)
                self.selectionMonitor.start()
                self.refreshHistory()
                self.popupController.closePopover()
                self.state.mode = self.state.consentGranted ? .idle : .onboarding
            }
        }
    }

    private func refreshHistory() {
        historyStore.entries { [weak self] entries in
            guard let self else { return }
            DispatchQueue.main.async {
                self.state.history = entries
            }
        }
    }

    private func toggleHistory() {
        if state.mode == .history {
            state.mode = state.permissionGranted ? .idle : .onboarding
            popupController.closePopover()
        } else {
            pendingHideWorkItem?.cancel()
            pendingHideWorkItem = nil
            refreshHistory()
            state.mode = .history
            popupController.showPopover()
        }
    }

    private func copyToClipboard(_ text: String) {
        let pasteboard = NSPasteboard.general
        pasteboard.declareTypes([.string], owner: nil)
        pasteboard.setString(text, forType: .string)
    }

    private func updatePinnedState(for entry: SelectionHistoryEntry, isPinned: Bool) {
        historyStore.updatePinnedState(for: entry.id, isPinned: isPinned)
        if var latest = state.latestEntry, latest.id == entry.id {
            latest.isPinned = isPinned
            state.latestEntry = latest
        }
        refreshHistory()
    }

    private func deleteEntry(_ entry: SelectionHistoryEntry) {
        historyStore.removeEntry(with: entry.id)
        refreshHistory()
    }

    private func clearHistory() {
        historyStore.clear()
        DispatchQueue.main.async {
            self.state.history = []
            self.state.latestEntry = nil
        }
    }

    private func handleSelectionEvent(_ event: SelectionMonitor.SelectionEvent) {
        guard state.consentGranted else {
            showOnboarding()
            return
        }

        pendingHideWorkItem?.cancel()
        pendingHideWorkItem = nil

        if let lastTimestamp = lastSelectionTimestamp {
            if Date().timeIntervalSince(lastTimestamp) < 0.25 {
                return
            }
        }

        lastSelectionTimestamp = event.timestamp

        let entry = historyStore.append(
            text: event.text,
            sourceAppName: event.applicationName,
            sourceBundleIdentifier: event.bundleIdentifier
        )

        state.latestEntry = entry
        state.mode = .prompt
        refreshHistory()
        if let bounds = event.bounds {
            selectionPreviewController.show(text: event.text, bounds: bounds)
        } else {
            selectionPreviewController.hide()
        }

        onSelectionCaptured?(entry)
    }
}

// MARK: - SelectionMonitorDelegate
extension SelectionAssistantManager: SelectionMonitorDelegate {
    func selectionMonitor(_ monitor: SelectionMonitor, didCapture event: SelectionMonitor.SelectionEvent) {
        handleSelectionEvent(event)
    }

    func selectionMonitorRequiresAccessibilityPermission(_ monitor: SelectionMonitor) {
        state.permissionGranted = AXIsProcessTrusted()
        if !state.permissionGranted {
            pendingHideWorkItem?.cancel()
            pendingHideWorkItem = nil
            selectionPreviewController.hide()
            onPermissionStateChanged?(false)
            schedulePermissionPoll()
            if state.consentGranted {
                state.mode = .onboarding
                popupController.showPopover()
            }
        }
    }

    func selectionMonitorDidClearSelection(_ monitor: SelectionMonitor) {
        pendingHideWorkItem?.cancel()

        let workItem = DispatchWorkItem { [weak self] in
            guard let self else { return }
            self.selectionPreviewController.hide()
            self.pendingHideWorkItem = nil
        }

        pendingHideWorkItem = workItem
        DispatchQueue.main.asyncAfter(deadline: .now() + selectionPersistDuration, execute: workItem)
    }
}

// MARK: - UI State Container
final class SelectionAssistantState: ObservableObject {
    @Published var mode: SelectionAssistantManager.Mode = .onboarding
    @Published var consentGranted = false
    @Published var permissionGranted = false
    @Published var history: [SelectionHistoryEntry] = []
    @Published var latestEntry: SelectionHistoryEntry?

    var onboardingMessage: String {
        "This app needs Accessibility permissions to detect and display selected text from any window. Your extracted content is always stored locally and never shared. You can review or clear your text history any time."
    }

    var permissionDeniedMessage: String {
        "Accessibility access is required to observe selected text. Enable the permission in System Settings > Privacy & Security > Accessibility."
    }

    var onCopySelection: ((SelectionHistoryEntry) -> Void)?
    var onPinSelection: ((SelectionHistoryEntry, Bool) -> Void)?
    var onClearHistory: (() -> Void)?
    var onDeleteEntry: ((SelectionHistoryEntry) -> Void)?
    var onRequestPermission: (() -> Void)?
    var onAcknowledgeOnboarding: (() -> Void)?
}

// MARK: - Popup Controller
final class SelectionPopupController {
    private let statusItem: NSStatusItem
    private let popover: NSPopover
    private lazy var hostingController: NSHostingController<SelectionAssistantRootView> = {
        let rootView = SelectionAssistantRootView(
            state: state,
            onToggleHistory: { [weak self] in self?.onToggleHistory?() },
            onClose: { [weak self] in self?.onCloseRequested?() }
        )
        return NSHostingController(rootView: rootView)
    }()
    private let state: SelectionAssistantState

    var onToggleHistory: (() -> Void)?
    var onCloseRequested: (() -> Void)?

    init(state: SelectionAssistantState) {
        self.state = state
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        popover = NSPopover()
        popover.behavior = .semitransient
        popover.contentViewController = hostingController

        if let button = statusItem.button {
            button.title = ""
            if #available(macOS 11.0, *) {
                button.image = NSImage(systemSymbolName: "text.quote", accessibilityDescription: "Selection Assistant")
            } else {
                button.image = NSImage(named: NSImage.infoName)
            }
            button.action = #selector(togglePopover(_:))
            button.target = self
        }
    }

    func showPopover() {
        guard let button = statusItem.button else { return }
        if !popover.isShown {
            popover.contentSize = NSSize(width: 360, height: 320)
            popover.show(relativeTo: button.bounds, of: button, preferredEdge: .minY)
        } else {
            popover.contentViewController = hostingController
            popover.contentViewController?.view.needsDisplay = true
        }
    }

    func closePopover() {
        popover.performClose(nil)
    }

    @objc private func togglePopover(_ sender: Any?) {
        if popover.isShown {
            closePopover()
        } else {
            showPopover()
        }
    }
}
