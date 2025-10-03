//
//  NotchViewModel+Events.swift
//  NotchDrop
//
//  Created by 秋星桥 on 2024/7/8.
//

import Cocoa
import Combine
import Foundation
import SwiftUI

extension NotchViewModel {
    func setupCancellables() {
        let events = EventMonitors.shared
        events.mouseDown
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                guard let self else { return }
                let mouseLocation: NSPoint = NSEvent.mouseLocation
                switch status {
                case .opened:
                    // If chat input is focused or we're in chat mode, don't interfere with clicks in the notch area
                    if isChatInputFocused || (isChatMode && notchOpenedRect.contains(mouseLocation)) {
                        // Let SwiftUI handle the click for text input
                        print("🎯 Chat input focused or click in chat area - allowing SwiftUI to handle")
                        return
                    }
                    
                    // For unauthenticated users: auto-unlock and collapse when clicking on opened notch
                    if !isAuthenticated && notchOpenedRect.contains(mouseLocation) {
                        if isNotchLocked {
                            print("🔓 Auto-unlocking notch for unauthenticated user (opened state)")
                            isNotchLocked = false
                        }
                        print("📱 Collapsing notch for unauthenticated user")
                        notchClose()
                        return
                    }
                    
                    // touch outside, close (but not if locked)
                    if !notchOpenedRect.contains(mouseLocation), !isNotchLocked {
                        notchClose()
                        // click where user open the panel - but don't auto-close if video is playing or locked
                    } else if notchClosedRect.insetBy(dx: inset, dy: inset).contains(mouseLocation), !hasActiveVideo, !isNotchLocked {
                        notchClose()
                        // for the same height as device notch, open the url of project
                    } else if headlineOpenedRect.contains(mouseLocation) {
                        // for clicking headline which mouse event may handled by another app
                        // open the menu
                        if let nextValue = ContentType(rawValue: contentType.rawValue + 1) {
                            contentType = nextValue
                        } else {
                            contentType = ContentType(rawValue: 0)!
                        }
                    }
                case .closed, .popping:
                    // touch inside, open
                    if notchClosedRect.insetBy(dx: inset, dy: inset).contains(mouseLocation) {
                        // For unauthenticated users: auto-unlock and open
                        if !isAuthenticated && isNotchLocked {
                            print("🔓 Auto-unlocking notch for unauthenticated user")
                            isNotchLocked = false
                        }
                        notchOpen(.click)
                    }
                }
            }
            .store(in: &cancellables)

        events.optionKeyPress
            .receive(on: DispatchQueue.main)
            .sink { [weak self] input in
                guard let self else { return }
                optionKeyPressed = input
            }
            .store(in: &cancellables)

        events.mouseLocation
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                guard let self else { return }
                let mouseLocation: NSPoint = NSEvent.mouseLocation
                // Hover zones
                let inClosedHoverZone = notchClosedRect.insetBy(dx: inset, dy: inset).contains(mouseLocation)
                let inOpenedHoverZone = notchOpenedRect.insetBy(dx: inset, dy: inset).contains(mouseLocation)

                switch status {
                case .closed:
                    // Fully expand on hover entry
                    if inClosedHoverZone { notchOpen(.hover) }
                case .opened:
                    // Auto-close only if we opened due to hover and the pointer leaves the opened islandisland
                    // BUT don't close if video is playing or notch is locked
                    if openReason == .hover, !inOpenedHoverZone, !hasActiveVideo, !isNotchLocked { notchClose() }
                case .popping:
                    // Legacy pop behavior: close pop if pointer leaves the closed hover zone
                    if !inClosedHoverZone { notchClose() }
                }
            }
            .store(in: &cancellables)

        $status
            .filter { $0 != .closed }
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                withAnimation { self?.notchVisible = true }
            }
            .store(in: &cancellables)

        $status
            .filter { $0 == .popping }
            .throttle(for: .seconds(0.5), scheduler: DispatchQueue.main, latest: false)
            .sink { [weak self] _ in
                guard NSEvent.pressedMouseButtons == 0 else { return }
                self?.hapticSender.send()
            }
            .store(in: &cancellables)

        hapticSender
            .throttle(for: .seconds(0.5), scheduler: DispatchQueue.main, latest: false)
            .sink { [weak self] _ in
                guard self?.hapticFeedback ?? false else { return }
                NSHapticFeedbackManager.defaultPerformer.perform(
                    .levelChange,
                    performanceTime: .now
                )
            }
            .store(in: &cancellables)

        $status
            .debounce(for: 0.5, scheduler: DispatchQueue.global())
            .filter { $0 == .closed }
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                withAnimation {
                    self?.notchVisible = false
                }
            }
            .store(in: &cancellables)

        $selectedLanguage
            .dropFirst()
            .removeDuplicates()
            .receive(on: DispatchQueue.main)
            .sink { [weak self] output in
                self?.notchClose()
                output.apply()
            }
            .store(in: &cancellables)
    }

    func destroy() {
        cancellables.forEach { $0.cancel() }
        cancellables.removeAll()
    }
    
    // Helper method to check if a click is within the chat input area
    private func isClickInChatInputArea(_ mouseLocation: NSPoint) -> Bool {
        // Calculate the chat input area bounds within the opened notch
        let notchRect = notchOpenedRect
        
        // Chat input area is positioned in the lower part of the opened notch
        // Based on the SwiftUI layout: padding(vm.spacing) + main content area
        let chatAreaHeight: CGFloat = 120 // Approximate height of chat input area
        let chatAreaWidth: CGFloat = 480 // Fixed width as defined in SwiftUI
        
        let chatInputRect = CGRect(
            x: notchRect.origin.x + (notchRect.width - chatAreaWidth) / 2,
            y: notchRect.origin.y + notchRect.height - chatAreaHeight - spacing,
            width: chatAreaWidth,
            height: chatAreaHeight
        )
        
        let isInChatArea = chatInputRect.contains(mouseLocation)
        print("🎯 Mouse at: \(mouseLocation), Chat area: \(chatInputRect), Contains: \(isInChatArea)")
        
        return isInChatArea
    }
}
