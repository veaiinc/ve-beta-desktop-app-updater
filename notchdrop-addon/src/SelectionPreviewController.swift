//
//  SelectionPreviewController.swift
//  NotchDrop
//
//  Displays a lightweight bubble next to selected text with quick actions.
//

import AppKit
import SwiftUI

private enum PreviewConstants {
    static let maxWidth: CGFloat = 320
    static let horizontalOffset: CGFloat = 16
    static let margin: CGFloat = 12
    static let cornerRadius: CGFloat = 12
}

final class SelectionPreviewController {

    private var window: NSPanel?
    private var effectView: NSVisualEffectView?
    private var hostingView: NSHostingView<SelectionPreviewView>?
    private var localKeyMonitor: Any?
    private var globalKeyMonitor: Any?
    private var currentText: String = ""
    private let askAIHandler: (String) -> Void

    deinit {
        removeKeyMonitors()
    }

    init(onAskAI: @escaping (String) -> Void) {
        askAIHandler = onAskAI
    }

    func show(text: String, bounds: CGRect) {
        DispatchQueue.main.async {
            self.currentText = text
            let view = SelectionPreviewView(
                text: text,
                onAskAI: { [weak self] in
                    guard let self else { return }
                    self.askAIHandler(text)
                }
            )

            if let hostingView = self.hostingView {
                hostingView.rootView = view
            } else {
                let host = NSHostingView(rootView: view)
                host.layer?.backgroundColor = NSColor.clear.cgColor
                host.wantsLayer = false
                self.hostingView = host
                self.ensureWindow(with: host)
            }

            guard
                let window = self.window,
                let effectView = self.effectView,
                let hostingView = self.hostingView
            else { return }

            let fittingSize = hostingView.fittingSize.clamped(maxWidth: PreviewConstants.maxWidth)
            effectView.frame = NSRect(origin: .zero, size: fittingSize)
            hostingView.frame = effectView.bounds
            window.setFrame(NSRect(origin: window.frame.origin, size: fittingSize), display: true)
            self.positionWindow(window, contentSize: fittingSize, relativeTo: bounds)
            self.activateKeyMonitors()
            window.orderFront(nil)
        }
    }

    func hide() {
        DispatchQueue.main.async { [weak self] in
            guard let self else { return }
            self.window?.orderOut(nil)
            self.removeKeyMonitors()
        }
    }

    private func ensureWindow(with contentView: NSView) {
        if window == nil {
            let panel = NSPanel(
                contentRect: .zero,
                styleMask: [.nonactivatingPanel],
                backing: .buffered,
                defer: false
            )

            panel.level = .floating
            panel.hasShadow = true
            panel.isOpaque = false
            panel.backgroundColor = .clear
            panel.ignoresMouseEvents = false
            panel.collectionBehavior = [.fullScreenAuxiliary, .transient, .ignoresCycle]
            panel.isMovable = false
            panel.isReleasedWhenClosed = false
            panel.hidesOnDeactivate = false
            panel.alphaValue = 1

            window = panel
        }

        if effectView == nil {
            let effect = NSVisualEffectView()
            effect.state = .active
            if #available(macOS 13.0, *) {
                effect.material = .contentBackground
            } else {
                effect.material = .windowBackground
            }
            effect.blendingMode = .withinWindow
            effect.wantsLayer = true
            effect.layer?.cornerRadius = PreviewConstants.cornerRadius
            effect.layer?.masksToBounds = true
            effectView = effect
            window?.contentView = effect
        }

        if let effectView, contentView.superview !== effectView {
            effectView.subviews.forEach { $0.removeFromSuperview() }
            contentView.frame = effectView.bounds
            contentView.autoresizingMask = [.width, .height]
            effectView.addSubview(contentView)
        }
    }

    private func positionWindow(_ window: NSWindow, contentSize: NSSize, relativeTo bounds: CGRect) {
        guard let screen = screenFor(rect: bounds) else { return }

        let visibleFrame = screen.visibleFrame
        var origin = CGPoint(
            x: bounds.maxX + PreviewConstants.horizontalOffset,
            y: bounds.midY - contentSize.height / 2
        )

        let maxX = visibleFrame.maxX - contentSize.width - PreviewConstants.margin
        if origin.x > maxX {
            origin.x = maxX
        }

        let minX = visibleFrame.minX + PreviewConstants.margin
        if origin.x < minX {
            origin.x = minX
        }

        let minY = visibleFrame.minY + PreviewConstants.margin
        let maxY = visibleFrame.maxY - contentSize.height - PreviewConstants.margin

        if origin.y < minY {
            origin.y = minY
        }
        if origin.y > maxY {
            origin.y = maxY
        }

        let frame = NSRect(origin: origin, size: contentSize)
        window.setFrame(frame, display: true, animate: false)
    }

    private func screenFor(rect: CGRect) -> NSScreen? {
        NSScreen.screens.first(where: { $0.frame.intersects(rect) }) ?? NSScreen.main
    }

    private func activateKeyMonitors() {
        removeKeyMonitors()

        localKeyMonitor = NSEvent.addLocalMonitorForEvents(matching: .keyDown) { [weak self] event in
            guard let self else { return event }
            if event.keyCode == 53 {
                self.hide()
                return nil
            }
            return event
        }

        globalKeyMonitor = NSEvent.addGlobalMonitorForEvents(matching: .keyDown) { [weak self] event in
            if event.keyCode == 53 {
                self?.hide()
            }
        }
    }

    private func removeKeyMonitors() {
        if let localKeyMonitor {
            NSEvent.removeMonitor(localKeyMonitor)
            self.localKeyMonitor = nil
        }

        if let globalKeyMonitor {
            NSEvent.removeMonitor(globalKeyMonitor)
            self.globalKeyMonitor = nil
        }
    }
}

private struct SelectionPreviewView: View {
    let text: String
    let onAskAI: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ScrollView {
                Text(text)
                    .font(.body)
                    .foregroundStyle(.primary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .frame(maxHeight: 160)

            Divider()

            HStack {
                Spacer()
                Button("Ask AI") {
                    onAskAI()
                }
                .buttonStyle(.borderedProminent)
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: PreviewConstants.cornerRadius, style: .continuous)
                .fill(Color(nsColor: NSColor.windowBackgroundColor))
                .shadow(color: Color.black.opacity(0.15), radius: 12, x: 0, y: 6)
        )
        .frame(minWidth: 220, alignment: .leading)
    }
}

private extension NSSize {
    func clamped(maxWidth: CGFloat) -> NSSize {
        let width = min(self.width, maxWidth)
        return NSSize(width: width, height: self.height)
    }
}
