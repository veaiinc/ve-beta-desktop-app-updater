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
                guard self.isInteractionEnabled else { return }
                let mouseLocation: NSPoint = NSEvent.mouseLocation
                switch status {
                case .opened:
                    // Fast-path: if we opened by hover and user clicks anywhere outside → close immediately
                    if openReason == .hover, !notchOpenedRect.contains(mouseLocation) {
                        withAnimation(DynamicIslandTheme.instantAnimation) {
                            self.notchClose()
                        }
                        return
                    }
                    // If chat input is focused or we're in chat mode, don't interfere with clicks in the notch area
                    if isChatInputFocused || (isChatMode && notchOpenedRect.contains(mouseLocation)) {
                        // Let SwiftUI handle the click for text input
                        return
                    }
                    
                    // For unauthenticated users: auto-unlock and collapse when clicking on opened notch
                    // But allow a small delay to let SwiftUI buttons handle their clicks first
                    if !isAuthenticated && notchOpenedRect.contains(mouseLocation) {
                        if isNotchLocked {
                            isNotchLocked = false
                        }
                        
                        // Add a small delay to allow SwiftUI buttons to handle their clicks first
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                            // Only collapse if the notch is still opened (button didn't handle the click)
                            if self.status == .opened {
                                self.notchClose()
                            }
                        }
                        return
                    }
                    
                    // touch outside, close (unless explicitly locked)
                    if !notchOpenedRect.contains(mouseLocation), !isNotchLocked {
                        print("🖱️ Click outside detected - closing notch (unlocked)")
                        notchClose()
                    } else if !notchOpenedRect.contains(mouseLocation), isNotchLocked {
                        print("🖱️ Click outside detected - NOT closing notch (LOCKED)")
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
                            isNotchLocked = false
                        }
                        // Lock the notch when opened by click to prevent auto-close
                        isNotchLocked = true
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

        // ULTIMATE FIX: Ultra-optimized hover processing with memory management
        events.mouseLocation
            .throttle(for: .milliseconds(50), scheduler: DispatchQueue.main, latest: true) // Further reduced frequency
            .sink { [weak self] _ in
                guard let self else { return }
                guard self.isInteractionEnabled else { return }
                // Skip hover processing while opened by click to reduce churn
                if status == .opened, openReason == .click { return }
                
                // ULTIMATE FIX: Use autoreleasepool to prevent memory accumulation
                autoreleasepool { [weak self] in
                    guard let self = self else { return }
                    let mouseLocation: NSPoint = NSEvent.mouseLocation
                    
                    // ULTIMATE FIX: Cache hover zone calculations with reduced precision
                    let inClosedHoverZone = self.notchClosedRect.insetBy(dx: self.inset, dy: self.inset).contains(mouseLocation)
                    let inOpenedHoverZone = self.notchOpenedRect.insetBy(dx: self.inset, dy: self.inset).contains(mouseLocation)

                    // ULTIMATE FIX: Only activate performance mode when needed
                    if inClosedHoverZone || inOpenedHoverZone {
                        self.ensureInteractivePerformance()
                    }

                    switch self.status {
                    case .closed:
                        // Edge-detect hover ENTER into closed zone
                        if inClosedHoverZone && !self.wasInClosedHoverZone {
                            // ULTIMATE FIX: Reduced haptic feedback frequency
                            self.performHoverHapticIfNeeded()
                            
                            // ULTIMATE FIX: Faster animation
                            withAnimation(DynamicIslandTheme.hoverOpenBubbly) {
                                self.notchOpen(.hover) 
                            }
                        }
                        // Update edge state
                        self.wasInClosedHoverZone = inClosedHoverZone
                        self.wasInOpenedHoverZone = false
                    case .opened:
                        // Edge-detect hover EXIT from opened zone for auto-close
                        if self.openReason == .hover, !inOpenedHoverZone, self.wasInOpenedHoverZone, !self.hasActiveVideo, !self.isNotchLocked {
                            // ULTIMATE FIX: Faster close animation
                            withAnimation(DynamicIslandTheme.hoverAnimation) {
                                self.notchClose() 
                            }
                        }
                        // Update edge state
                        self.wasInOpenedHoverZone = inOpenedHoverZone
                        self.wasInClosedHoverZone = false
                    case .popping:
                        // Legacy pop behavior: close pop if pointer leaves the closed hover zone
                        if !inClosedHoverZone { 
                            // ULTIMATE FIX: Instant close for better responsiveness
                            withAnimation(DynamicIslandTheme.instantAnimation) {
                                self.notchClose() 
                            }
                        }
                        // Update edge state
                        self.wasInClosedHoverZone = inClosedHoverZone
                        self.wasInOpenedHoverZone = false
                    }
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
        
        return isInChatArea
    }
}
