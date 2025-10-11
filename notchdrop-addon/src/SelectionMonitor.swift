//
//  SelectionMonitor.swift
//  NotchDrop
//
//  Observes system-wide text selections via the Accessibility API.
//

import AppKit
import Combine
import ApplicationServices

protocol SelectionMonitorDelegate: AnyObject {
    func selectionMonitor(_ monitor: SelectionMonitor, didCapture event: SelectionMonitor.SelectionEvent)
    func selectionMonitorRequiresAccessibilityPermission(_ monitor: SelectionMonitor)
    func selectionMonitorDidClearSelection(_ monitor: SelectionMonitor)
}

extension SelectionMonitorDelegate {
    func selectionMonitorDidClearSelection(_ monitor: SelectionMonitor) {}
}

final class SelectionMonitor {
    struct SelectionEvent {
        let text: String
        let applicationName: String?
        let bundleIdentifier: String?
        let timestamp: Date
        let bounds: CGRect?
    }

    private let notifications: [CFString] = [
        kAXFocusedUIElementChangedNotification as CFString,
        kAXSelectedTextChangedNotification as CFString,
    ]

    private let focusChangedNotification = String(kAXFocusedUIElementChangedNotification)
    private let selectedTextChangedNotification = String(kAXSelectedTextChangedNotification)
    private var axObserver: AXObserver?
    private var observerContext: UnsafeMutableRawPointer?
    private var observedApplicationElement: AXUIElement?
    private var workspaceObserver: NSObjectProtocol?
    private var lastDeliveredText: String?
    private var lastDeliveredBounds: CGRect?
    private var hasActiveSelection = false
    private var currentApp: NSRunningApplication?

    weak var delegate: SelectionMonitorDelegate?

    deinit {
        stop()
    }

    func start() {
        guard AXIsProcessTrusted() else {
            delegate?.selectionMonitorRequiresAccessibilityPermission(self)
            return
        }

        registerWorkspaceNotifications()
        updateActiveApplication()
    }

    func stop() {
        unregisterWorkspaceNotifications()
        cleanupObserver()
        lastDeliveredText = nil
        lastDeliveredBounds = nil
        hasActiveSelection = false
    }

    func refreshAccessibilityTrust() {
        if AXIsProcessTrusted() {
            start()
        } else {
            delegate?.selectionMonitorRequiresAccessibilityPermission(self)
        }
    }

    private func registerWorkspaceNotifications() {
        guard workspaceObserver == nil else { return }

        workspaceObserver = NSWorkspace.shared.notificationCenter.addObserver(
            forName: NSWorkspace.didActivateApplicationNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            self?.updateActiveApplication()
        }
    }

    private func unregisterWorkspaceNotifications() {
        if let workspaceObserver {
            NSWorkspace.shared.notificationCenter.removeObserver(workspaceObserver)
        }
        workspaceObserver = nil
    }

    private func updateActiveApplication() {
        guard let application = NSWorkspace.shared.frontmostApplication else {
            cleanupObserver()
            return
        }

        if currentApp?.processIdentifier == application.processIdentifier {
            return
        }

        currentApp = application
        setupObserver(for: application)
    }

    private func setupObserver(for application: NSRunningApplication) {
        cleanupObserver()

        let pid = application.processIdentifier
        let appElement = AXUIElementCreateApplication(pid)
        var observer: AXObserver?

        let callback: AXObserverCallback = { observer, element, notification, context in
            guard let context else { return }
            let monitor = Unmanaged<SelectionMonitor>.fromOpaque(context).takeUnretainedValue()
            monitor.handle(notification: notification as String, element: element)
        }

        let createResult = AXObserverCreate(pid, callback, &observer)
        guard createResult == .success, let observer else {
            delegate?.selectionMonitorRequiresAccessibilityPermission(self)
            return
        }

        axObserver = observer
        observedApplicationElement = appElement
        observerContext = Unmanaged.passUnretained(self).toOpaque()

        for notification in notifications {
            let result = AXObserverAddNotification(observer, appElement, notification, observerContext)
            switch result {
            case .success, .notificationAlreadyRegistered:
                continue
            default:
                print("⚠️ SelectionMonitor failed to add notification: \(notification) (\(result.rawValue))")
            }
        }

        let source = AXObserverGetRunLoopSource(observer)
        CFRunLoopAddSource(CFRunLoopGetMain(), source, .defaultMode)

        DispatchQueue.main.async { [weak self] in
            self?.fetchSelection()
        }
    }

    private func cleanupObserver() {
        guard let observer = axObserver else { return }

        let source = AXObserverGetRunLoopSource(observer)
        CFRunLoopRemoveSource(CFRunLoopGetMain(), source, .defaultMode)

        if let appElement = observedApplicationElement {
            for notification in notifications {
                AXObserverRemoveNotification(observer, appElement, notification)
            }
        }

        observerContext = nil
        axObserver = nil
        observedApplicationElement = nil
    }

    private func handle(notification: String, element: AXUIElement) {
        switch notification {
        case focusChangedNotification:
            fetchSelection(from: element)
        case selectedTextChangedNotification:
            fetchSelection(from: element)
        default:
            break
        }
    }

    private func fetchSelection(from element: AXUIElement? = nil) {
        guard AXIsProcessTrusted() else {
            delegate?.selectionMonitorRequiresAccessibilityPermission(self)
            return
        }

        var targetElement = element

        if targetElement == nil {
            targetElement = focusedElement()
        }

        guard let element = targetElement else { return }

        if let text = readSelectedText(from: element), !text.isEmpty {
            deliver(text: text, element: element)
            return
        }

        // Some controls keep selection on the container element
        if let container = elementContainer(element),
           let containerText = readSelectedText(from: container),
           !containerText.isEmpty {
            deliver(text: containerText, element: container)
            return
        }

        clearSelectionIfNeeded()
    }

    private func focusedElement() -> AXUIElement? {
        guard let appElement = observedApplicationElement else { return nil }
        var focused: CFTypeRef?
        let result = AXUIElementCopyAttributeValue(
            appElement,
            kAXFocusedUIElementAttribute as CFString,
            &focused
        )
        if result == .success, let focused {
            return (focused as! AXUIElement)
        }
        return nil
    }

    private func elementContainer(_ element: AXUIElement) -> AXUIElement? {
        var parent: CFTypeRef?
        let result = AXUIElementCopyAttributeValue(element, kAXParentAttribute as CFString, &parent)
        if result == .success, let parent {
            return (parent as! AXUIElement)
        }
        return nil
    }

    private func readSelectedText(from element: AXUIElement) -> String? {
        if let primary = copyAttribute(element, attribute: kAXSelectedTextAttribute as CFString) as? String {
            return primary
        }

        if let attributed = copyAttribute(element, attribute: kAXSelectedTextAttribute as CFString) as? NSAttributedString {
            return attributed.string
        }

        if let range = copyAttribute(element, attribute: kAXSelectedTextRangeAttribute as CFString),
           let text = copyParameterizedAttribute(element, attribute: kAXStringForRangeParameterizedAttribute as CFString, parameter: range) as? String {
            return text
        }

        if let markerRange = copyAttribute(element, attribute: kAXSelectedTextMarkerRangeAttribute as CFString),
           let text = copyParameterizedAttribute(element, attribute: kAXStringForTextMarkerRangeParameterizedAttribute as CFString, parameter: markerRange) as? String {
            return text
        }

        return nil
    }

    private func copyAttribute(_ element: AXUIElement, attribute: CFString) -> AnyObject? {
        var value: CFTypeRef?
        let result = AXUIElementCopyAttributeValue(element, attribute, &value)
        if result == .success, let value {
            return value
        }
        return nil
    }

    private func copyParameterizedAttribute(_ element: AXUIElement, attribute: CFString, parameter: AnyObject) -> CFTypeRef? {
        var value: CFTypeRef?
        let result = AXUIElementCopyParameterizedAttributeValue(element, attribute, parameter, &value)
        if result == .success {
            return value
        }
        return nil
    }

    private func clearSelectionIfNeeded() {
        guard hasActiveSelection else { return }
        hasActiveSelection = false
        lastDeliveredText = nil
        lastDeliveredBounds = nil
        DispatchQueue.main.async { [weak self] in
            guard let self else { return }
            self.delegate?.selectionMonitorDidClearSelection(self)
        }
    }

    private func deliver(text: String, element: AXUIElement) {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else {
            clearSelectionIfNeeded()
            return
        }

        let bounds = selectionBounds(for: element)

        if let lastText = lastDeliveredText,
           let previousBounds = lastDeliveredBounds,
           let bounds,
           lastText == trimmed,
           previousBounds.equalTo(bounds) {
            return
        }

        lastDeliveredText = trimmed
        lastDeliveredBounds = bounds
        hasActiveSelection = true

        let event = SelectionEvent(
            text: trimmed,
            applicationName: currentApp?.localizedName,
            bundleIdentifier: currentApp?.bundleIdentifier,
            timestamp: Date(),
            bounds: bounds
        )

        delegate?.selectionMonitor(self, didCapture: event)
    }

    private func selectionBounds(for element: AXUIElement) -> CGRect? {
        if let range = copyAttribute(element, attribute: kAXSelectedTextRangeAttribute as CFString),
           let rect = boundsForRange(element: element, range: range) {
            return rect
        }

        if let markerRange = copyAttribute(element, attribute: kAXSelectedTextMarkerRangeAttribute as CFString),
           let rect = boundsForTextMarkerRange(element: element, markerRange: markerRange) {
            return rect
        }

        return nil
    }

    private func boundsForRange(element: AXUIElement, range: AnyObject) -> CGRect? {
        guard let rawValue = copyParameterizedAttribute(
            element,
            attribute: kAXBoundsForRangeParameterizedAttribute as CFString,
            parameter: range
        ), CFGetTypeID(rawValue) == AXValueGetTypeID() else {
            return nil
        }

        let value = unsafeBitCast(rawValue, to: AXValue.self)

        if AXValueGetType(value) == .cgRect {
            var rect = CGRect.zero
            if AXValueGetValue(value, .cgRect, &rect) {
                return rect
            }
        }
        return nil
    }

    private func boundsForTextMarkerRange(element: AXUIElement, markerRange: AnyObject) -> CGRect? {
        guard let rawValue = copyParameterizedAttribute(
            element,
            attribute: kAXBoundsForTextMarkerRangeParameterizedAttribute as CFString,
            parameter: markerRange
        ), CFGetTypeID(rawValue) == AXValueGetTypeID() else {
            return nil
        }

        let value = unsafeBitCast(rawValue, to: AXValue.self)

        if AXValueGetType(value) == .cgRect {
            var rect = CGRect.zero
            if AXValueGetValue(value, .cgRect, &rect) {
                return rect
            }
        }
        return nil
    }
}
