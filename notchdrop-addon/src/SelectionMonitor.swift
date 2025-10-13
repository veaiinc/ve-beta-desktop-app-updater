//
//  SelectionMonitor.swift
//  NotchDrop
//
//  Observes system-wide text selections via the Accessibility API.
//

import AppKit
import Combine
import ApplicationServices

private let AXTextChangedNotificationName: CFString = "AXTextChangedNotification" as CFString

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
        kAXValueChangedNotification as CFString,
        AXTextChangedNotificationName,
    ]
    private let elementSelectionNotifications: [CFString] = [
        kAXSelectedTextChangedNotification as CFString,
        kAXValueChangedNotification as CFString,
        AXTextChangedNotificationName,
    ]

    private let focusChangedNotification = String(kAXFocusedUIElementChangedNotification)
    private let selectedTextChangedNotification = String(kAXSelectedTextChangedNotification)
    private let valueChangedNotification = String(kAXValueChangedNotification)
    private let textChangedNotification = String(AXTextChangedNotificationName)
    private var axObserver: AXObserver?
    private var observerContext: UnsafeMutableRawPointer?
    private var observedApplicationElement: AXUIElement?
    private var observedFocusedElement: AXUIElement?
    private var workspaceObserver: NSObjectProtocol?
    private var lastDeliveredText: String?
    private var lastDeliveredBounds: CGRect?
    private var hasActiveSelection = false
    private var currentApp: NSRunningApplication?
    private var globalEventMonitors: [Any] = []
    private var selectionFetchWorkItem: DispatchWorkItem?
    private let selectionFetchDebounceInterval: TimeInterval = 0.05
    private var lastPointerTriggerDate: Date?
    private var pointerDragInProgress = false
    private let pointerTriggerWindow: TimeInterval = 0.9

    private enum SelectionTriggerSource {
        case pointer
        case keyboard
        case accessibility
    }

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
        registerGlobalEventMonitors()
        updateActiveApplication()
    }

    func stop() {
        unregisterWorkspaceNotifications()
        deregisterGlobalEventMonitors()
        cleanupObserver()
        lastDeliveredText = nil
        lastDeliveredBounds = nil
        hasActiveSelection = false
        lastPointerTriggerDate = nil
        selectionFetchWorkItem?.cancel()
        selectionFetchWorkItem = nil
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

    private func registerGlobalEventMonitors() {
        guard globalEventMonitors.isEmpty else { return }

        if let mouseDownMonitor = NSEvent.addGlobalMonitorForEvents(matching: .leftMouseDown, handler: { [weak self] _ in
            self?.pointerDragInProgress = false
        }) {
            globalEventMonitors.append(mouseDownMonitor)
        }

        if let mouseDragMonitor = NSEvent.addGlobalMonitorForEvents(matching: .leftMouseDragged, handler: { [weak self] _ in
            self?.pointerDragInProgress = true
        }) {
            globalEventMonitors.append(mouseDragMonitor)
        }

        if let mouseUpMonitor = NSEvent.addGlobalMonitorForEvents(matching: .leftMouseUp, handler: { [weak self] event in
            guard let self else { return }
            let shouldTriggerSelection = pointerDragInProgress
                || event.clickCount > 1
                || event.modifierFlags.contains(.shift)
            pointerDragInProgress = false
            if shouldTriggerSelection {
                recordSelectionTrigger(.pointer)
            }
            scheduleSelectionFetch()
        }) {
            globalEventMonitors.append(mouseUpMonitor)
        }

        if let rightMouseUpMonitor = NSEvent.addGlobalMonitorForEvents(matching: .rightMouseUp, handler: { [weak self] _ in
            self?.scheduleSelectionFetch()
        }) {
            globalEventMonitors.append(rightMouseUpMonitor)
        }

        if let otherMouseUpMonitor = NSEvent.addGlobalMonitorForEvents(matching: .otherMouseUp, handler: { [weak self] _ in
            self?.scheduleSelectionFetch()
        }) {
            globalEventMonitors.append(otherMouseUpMonitor)
        }

        if let keyMonitor = NSEvent.addGlobalMonitorForEvents(matching: .keyUp, handler: { [weak self] event in
            guard let self else { return }
            if self.shouldTriggerSelectionFetch(for: event) {
                if self.isSelectionKeyEvent(event) {
                    self.recordSelectionTrigger(.keyboard)
                }
                self.scheduleSelectionFetch()
            }
        }) {
            globalEventMonitors.append(keyMonitor)
        }
    }

    private func deregisterGlobalEventMonitors() {
        guard !globalEventMonitors.isEmpty else { return }
        for monitor in globalEventMonitors {
            NSEvent.removeMonitor(monitor)
        }
        globalEventMonitors.removeAll()
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
            guard let self else { return }
            let element = self.focusedElement()
            self.registerSelectionChangeNotification(for: element)
            self.fetchSelection(from: element)
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

        if let focusedElement = observedFocusedElement {
            for notification in elementSelectionNotifications {
                AXObserverRemoveNotification(observer, focusedElement, notification)
            }
        }

        observerContext = nil
        axObserver = nil
        observedApplicationElement = nil
        observedFocusedElement = nil
    }

    private func handle(notification: String, element: AXUIElement) {
        switch notification {
        case focusChangedNotification:
            registerSelectionChangeNotification(for: element)
            fetchSelection(from: element)
        case selectedTextChangedNotification,
             valueChangedNotification,
             textChangedNotification:
            recordSelectionTrigger(.accessibility)
            scheduleSelectionFetch(from: element)
        default:
            break
        }
    }

    private func scheduleSelectionFetch(from element: AXUIElement? = nil) {
        selectionFetchWorkItem?.cancel()

        let workItem = DispatchWorkItem { [weak self] in
            self?.fetchSelection(from: element)
        }

        selectionFetchWorkItem = workItem
        DispatchQueue.main.asyncAfter(deadline: .now() + selectionFetchDebounceInterval, execute: workItem)
    }

    private func fetchSelection(from element: AXUIElement? = nil) {
        selectionFetchWorkItem?.cancel()
        selectionFetchWorkItem = nil

        guard AXIsProcessTrusted() else {
            delegate?.selectionMonitorRequiresAccessibilityPermission(self)
            return
        }

        var targetElement = element

        if targetElement == nil {
            targetElement = focusedElement()
        }

        guard let element = targetElement else { return }
        registerSelectionChangeNotification(for: element)

        if let text = readSelectedText(from: element), !text.isEmpty {
            deliver(text: text, element: element)
            return
        }

        // Some controls keep selection on the container element
        if let container = elementContainer(element),
           let containerText = readSelectedText(from: container),
           !containerText.isEmpty {
            registerSelectionChangeNotification(for: container)
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

        let normalizedText = "\(trimmed)?"
        guard selectionShouldBeDelivered() else {
            return
        }

        let bounds = selectionBounds(for: element)

        if let lastText = lastDeliveredText,
           let previousBounds = lastDeliveredBounds,
           let bounds,
           lastText == normalizedText,
           previousBounds.equalTo(bounds) {
            return
        }

        lastDeliveredText = normalizedText
        lastDeliveredBounds = bounds
        hasActiveSelection = true
        lastPointerTriggerDate = nil

        let event = SelectionEvent(
            text: normalizedText,
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

        if let frame = elementFrame(element) {
            return frame
        }

        if let container = elementContainer(element), let containerFrame = elementFrame(container) {
            return containerFrame
        }

        if let lastBounds = lastDeliveredBounds {
            return lastBounds
        }

        if let mouseBounds = mouseCursorBounds() {
            return mouseBounds
        }

        return nil
    }

    private func registerSelectionChangeNotification(for element: AXUIElement?) {
        guard let observer = axObserver else { return }

        if let current = observedFocusedElement,
           let element,
           CFEqual(current, element) {
            return
        }

        if let current = observedFocusedElement {
            for notification in elementSelectionNotifications {
                AXObserverRemoveNotification(observer, current, notification)
            }
            observedFocusedElement = nil
        }

        guard let element else { return }

        var didRegisterNotification = false
        var encounteredUnsupported = false

        for notification in elementSelectionNotifications {
            let result = AXObserverAddNotification(observer, element, notification, observerContext)
            switch result {
            case .success, .notificationAlreadyRegistered:
                didRegisterNotification = true
            case .cannotComplete,
                 .notificationUnsupported,
                 .invalidUIElement,
                 .invalidUIElementObserver,
                 .attributeUnsupported,
                 .noValue,
                 .actionUnsupported:
                encounteredUnsupported = true
            default:
                print("⚠️ SelectionMonitor failed to add selected-text observer (\(notification)): \(result.rawValue)")
            }
        }

        if didRegisterNotification {
            observedFocusedElement = element
            return
        }

        if encounteredUnsupported, let container = elementContainer(element), !CFEqual(container, element) {
            registerSelectionChangeNotification(for: container)
        }
    }

    private func recordSelectionTrigger(_ source: SelectionTriggerSource) {
        let now = Date()
        if source == .pointer {
            lastPointerTriggerDate = now
        }
    }

    // Gate deliveries so only pointer-driven selections surface the popup.
    private func selectionShouldBeDelivered() -> Bool {
        guard let pointerDate = lastPointerTriggerDate else { return false }
        return Date().timeIntervalSince(pointerDate) <= pointerTriggerWindow
    }

    private func isSelectionKeyEvent(_ event: NSEvent) -> Bool {
        if event.modifierFlags.contains(.shift) || event.modifierFlags.contains(.option) {
            return true
        }

        if event.modifierFlags.contains(.command) {
            let selectAllKeyCode: UInt16 = 0 // A
            if event.keyCode == selectAllKeyCode {
                return true
            }
        }

        return false
    }

    private func shouldTriggerSelectionFetch(for event: NSEvent) -> Bool {
        switch event.type {
        case .keyUp:
            let navigationKeyCodes: Set<UInt16> = [
                123, // left arrow
                124, // right arrow
                125, // down arrow
                126, // up arrow
                116, // page up
                121, // page down
                115, // home
                119, // end
                51,  // delete
                117, // forward delete
                36,  // return
                48,  // tab
            ]

            if navigationKeyCodes.contains(event.keyCode) {
                return true
            }

            let hasShiftOrOption = event.modifierFlags.contains(.shift) || event.modifierFlags.contains(.option)
            if hasShiftOrOption {
                return true
            }

            if event.modifierFlags.contains(.command) {
                // Capture select-all (Cmd+A) and undo/redo (Cmd+Z/Cmd+Shift+Z) which affect selection.
                let selectAllKeyCode: UInt16 = 0 // A
                let undoKeyCode: UInt16 = 6 // Z
                if event.keyCode == selectAllKeyCode || event.keyCode == undoKeyCode {
                    return true
                }
            }

            return false
        default:
            return true
        }
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

    private func elementFrame(_ element: AXUIElement) -> CGRect? {
        let frameAttribute = "AXFrame" as CFString
        if let frameValue = copyAttribute(element, attribute: frameAttribute) {
            let cfValue = frameValue as CFTypeRef
            if CFGetTypeID(cfValue) == AXValueGetTypeID() {
                let axValue = unsafeBitCast(cfValue, to: AXValue.self)
                if AXValueGetType(axValue) == .cgRect {
                    var rect = CGRect.zero
                    if AXValueGetValue(axValue, .cgRect, &rect) {
                        return rect
                    }
                }
            }
        }

        let positionAttribute = "AXPosition" as CFString
        let sizeAttribute = "AXSize" as CFString

        if let positionValue = copyAttribute(element, attribute: positionAttribute),
           let sizeValue = copyAttribute(element, attribute: sizeAttribute) {
            let positionRef = positionValue as CFTypeRef
            let sizeRef = sizeValue as CFTypeRef

            if CFGetTypeID(positionRef) == AXValueGetTypeID(),
               CFGetTypeID(sizeRef) == AXValueGetTypeID() {
                let axPosition = unsafeBitCast(positionRef, to: AXValue.self)
                let axSize = unsafeBitCast(sizeRef, to: AXValue.self)

                if AXValueGetType(axPosition) == .cgPoint, AXValueGetType(axSize) == .cgSize {
                    var origin = CGPoint.zero
                    var size = CGSize.zero

                    if AXValueGetValue(axPosition, .cgPoint, &origin),
                       AXValueGetValue(axSize, .cgSize, &size) {
                        return CGRect(origin: origin, size: size)
                    }
                }
            }
        }

        return nil
    }

    private func mouseCursorBounds() -> CGRect? {
        let location = NSEvent.mouseLocation
        let cursorSize = CGSize(width: 12, height: 12)
        let origin = CGPoint(
            x: location.x - cursorSize.width / 2,
            y: location.y - cursorSize.height / 2
        )
        let rect = CGRect(origin: origin, size: cursorSize)

        let intersectsScreen = NSScreen.screens.contains { screen in
            screen.frame.intersects(rect)
        }

        return intersectsScreen ? rect : nil
    }
}
