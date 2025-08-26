import Cocoa
import Foundation
import SwiftUI
import UniformTypeIdentifiers

// MARK: - Core NotchDrop Implementation
@objc public class NotchDropCore: NSObject {

    // MARK: - Properties
    private var notchWindow: NSWindow?
    private var isVisible: Bool = false
    private var status: String = "closed"
    private var contentType: String = "normal"
    private var hapticFeedback: Bool = true

    // MARK: - Callbacks
    private var statusChangedCallback: ((String) -> Void)?
    private var fileDroppedCallback: ((String) -> Void)?
    private var itemAddedCallback: ((String) -> Void)?
    private var itemRemovedCallback: ((String) -> Void)?

    // MARK: - Singleton
    @objc public static let shared = NotchDropCore()

    private override init() {
        super.init()
        setupNotchDrop()
    }

    // MARK: - Setup
    private func setupNotchDrop() {
        DispatchQueue.main.async { [weak self] in
            self?.createNotchWindow()
        }
    }

    private func createNotchWindow() {
        guard notchWindow == nil else { return }

        let screen = NSScreen.main ?? NSScreen.screens.first
        guard let screen = screen else { return }

        let screenFrame = screen.frame
        let notchWidth: CGFloat = 250
        let notchHeight: CGFloat = 18

        // Position at top center above menu bar
        let menuBarHeight: CGFloat = (NSApp?.mainMenu?.menuBarHeight) ?? 22
        let topPadding: CGFloat = 8

        let windowFrame = NSRect(
            x: screenFrame.midX - notchWidth / 2,
            y: screenFrame.maxY - menuBarHeight - notchHeight - topPadding,
            width: notchWidth,
            height: notchHeight
        )

        notchWindow = NSWindow(
            contentRect: windowFrame,
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )

        guard let window = notchWindow else { return }

        window.level = .floating
        window.isOpaque = false
        window.backgroundColor = NSColor.clear
        window.hasShadow = false
        window.isMovable = false
        window.ignoresMouseEvents = false
        window.collectionBehavior = [.canJoinAllSpaces, .stationary]

        // Create the view
        let notchView = SimpleNotchView(
            status: status,
            contentType: contentType,
            hapticFeedback: hapticFeedback,
            onStatusChanged: { [weak self] newStatus in
                self?.status = newStatus
                self?.statusChangedCallback?(newStatus)
            },
            onFileDropped: { [weak self] filePath in
                self?.fileDroppedCallback?(filePath)
            },
            onItemAdded: { [weak self] itemData in
                self?.itemAddedCallback?(itemData)
            },
            onItemRemoved: { [weak self] itemData in
                self?.itemRemovedCallback?(itemData)
            }
        )

        let hostingView = NSHostingView(rootView: notchView)
        window.contentView = hostingView
    }

    // MARK: - Public API
    @objc public func initializeNotchDrop() {
        if notchWindow == nil {
            createNotchWindow()
        }
    }

    @objc public func showNotchDrop() {
        DispatchQueue.main.async { [weak self] in
            self?.notchWindow?.makeKeyAndOrderFront(nil)
            self?.isVisible = true
        }
    }

    @objc public func hideNotchDrop() {
        DispatchQueue.main.async { [weak self] in
            self?.notchWindow?.orderOut(nil)
            self?.isVisible = false
        }
    }

    @objc public func toggleNotchDrop() {
        if isVisible {
            hideNotchDrop()
        } else {
            showNotchDrop()
        }
    }

    @objc public func isNotchDropVisible() -> Bool {
        return isVisible
    }

    @objc public func setNotchDropStatus(_ newStatus: String) {
        status = newStatus
        statusChangedCallback?(newStatus)
    }

    @objc public func getNotchDropStatus() -> String {
        return status
    }

    @objc public func setNotchDropContentType(_ newContentType: String) {
        contentType = newContentType
    }

    @objc public func getNotchDropContentType() -> String {
        return contentType
    }

    @objc public func handleDroppedFiles(_ filePaths: [String]) {
        for filePath in filePaths {
            fileDroppedCallback?(filePath)
        }
    }

    @objc public func getCurrentItems() -> [String] {
        return []
    }

    @objc public func clearAllItems() {
        // Clear all items
    }

    @objc public func setHapticFeedback(_ enabled: Bool) {
        hapticFeedback = enabled
    }

    @objc public func getHapticFeedback() -> Bool {
        return hapticFeedback
    }

    @objc public func setNotchVisible(_ visible: Bool) {
        if visible {
            showNotchDrop()
        } else {
            hideNotchDrop()
        }
    }

    @objc public func getNotchVisible() -> Bool {
        return isVisible
    }

    @objc public func getWindowPosition() -> [String: CGFloat] {
        guard let window = notchWindow else {
            return ["x": 0, "y": 0, "width": 0, "height": 0]
        }

        let frame = window.frame
        return [
            "x": frame.origin.x,
            "y": frame.origin.y,
            "width": frame.size.width,
            "height": frame.size.height
        ]
    }

    // MARK: - Callback Setters
    @objc public func setNotchDropStatusChangedCallback(_ callback: @escaping (String) -> Void) {
        statusChangedCallback = callback
    }

    @objc public func setFileDroppedCallback(_ callback: @escaping (String) -> Void) {
        fileDroppedCallback = callback
    }

    @objc public func setItemAddedCallback(_ callback: @escaping (String) -> Void) {
        itemAddedCallback = callback
    }

    @objc public func setItemRemovedCallback(_ callback: @escaping (String) -> Void) {
        itemRemovedCallback = callback
    }
}

// MARK: - Simple NotchDrop View
struct SimpleNotchView: View {
    let status: String
    let contentType: String
    let hapticFeedback: Bool

    let onStatusChanged: (String) -> Void
    let onFileDropped: (String) -> Void
    let onItemAdded: (String) -> Void
    let onItemRemoved: (String) -> Void

    var body: some View {
        ZStack {
            // Background
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.black.opacity(0.8))
                .frame(width: 280, height: 20)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.white.opacity(0.3), lineWidth: 1)
                )

            // Content
            HStack(spacing: 8) {
                // Status indicator
                Circle()
                    .fill(status == "opened" ? Color.green : Color.gray)
                    .frame(width: 6, height: 6)

                // Main content area
                HStack {
                    Image(systemName: "arrow.down.circle.fill")
                        .foregroundColor(.white)
                        .font(.system(size: 12))

                    Text("Drop files here")
                        .foregroundColor(.white)
                        .font(.system(size: 11))

                    Spacer()
                }
            }
            .padding(.horizontal, 10)
        }
        .onTapGesture {
            toggleNotch()
        }
    }

    private func toggleNotch() {
        let newStatus = status == "closed" ? "opened" : "closed"
        onStatusChanged(newStatus)
    }
}