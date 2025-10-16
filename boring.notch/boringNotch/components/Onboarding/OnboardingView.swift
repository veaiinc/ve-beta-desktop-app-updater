//
//  OnboardingView.swift
//  VENotch
//
//  Created by Alexander on 2025-06-23.
//

import SwiftUI
import AVFoundation
import CoreGraphics
import ApplicationServices
import AppKit

enum OnboardingStep {
    case welcome
    case microphonePermission
    case screenPermission
    case accessibilityPermission
    case cameraPermission
    case calendarPermission
    case remindersPermission
    case musicPermission
    case finished
}

private let calendarService = CalendarService()

struct OnboardingView: View {
    @State var step: OnboardingStep = .welcome
    let onFinish: () -> Void
    let onOpenSettings: () -> Void

    var body: some View {
        ZStack {
            switch step {
            case .welcome:
                WelcomeView {
                    withAnimation(.easeInOut(duration: 0.6)) {
                        step = .microphonePermission
                    }
                }
                .transition(.opacity)

            case .microphonePermission:
                PermissionRequestView(
                    icon: Image("microphone"),
                    title: "Enable Microphone Access",
                    description: "Ve.Ai uses your microphone for voice features and quick voice interactions. We only listen when you explicitly engage voice features.",
                    privacyNote: "Audio is never recorded or sent without your consent.",
                    onAllow: {
                        Task {
                            await requestMicrophonePermission()
                            withAnimation(.easeInOut(duration: 0.6)) {
                                step = .screenPermission
                            }
                        }
                    },
                    onSkip: {
                        withAnimation(.easeInOut(duration: 0.6)) {
                            step = .screenPermission
                        }
                    }
                )
                .transition(.opacity)

            case .screenPermission:
                PermissionRequestView(
                    icon: Image("screen"),
                    title: "Enable Screen Access",
                    description: "Grant screen capture permission so Ve.Ai can support features that reference on-screen content (e.g. overlay guidance).",
                    privacyNote: "We never capture your screen without an explicit action.",
                    onAllow: {
                        Task {
                            let _ = await requestScreenRecordingPermission()
                            withAnimation(.easeInOut(duration: 0.6)) {
                                step = .accessibilityPermission
                            }
                        }
                    },
                    onSkip: {
                        withAnimation(.easeInOut(duration: 0.6)) {
                            step = .accessibilityPermission
                        }
                    }
                )
                .transition(.opacity)

            case .accessibilityPermission:
                PermissionRequestView(
                    icon: Image("accessibility"),
                    title: "Enable Accessibility",
                    description: "Accessibility permission lets Ve.Ai offer features like selection assistance and global shortcuts.",
                    privacyNote: "No keystrokes are logged; this permission is only used to enable specific interactions.",
                    onAllow: {
                        let hasPermission = requestAccessibilityPermission()
                        // Note: accessibility permission opens System Settings directly
                        // so we proceed to next step regardless of immediate result
                        withAnimation(.easeInOut(duration: 0.6)) {
                            step = .cameraPermission
                        }
                    },
                    onSkip: {
                        withAnimation(.easeInOut(duration: 0.6)) {
                            step = .cameraPermission
                        }
                    }
                )
                .transition(.opacity)

            case .cameraPermission:
                PermissionRequestView(
                    icon: Image("camera"),
                    title: "Enable Camera Access",
                    description: "Ve.Ai includes a mirror feature that lets you quickly check your appearance using your camera, right from the notch. Camera access is required only to show this live preview. You can turn the mirror feature on or off at any time in the app.",
                    privacyNote: "Your camera is never used without your consent, and nothing is recorded or stored.",
                    onAllow: {
                        Task {
                            await requestCameraPermission()
                            withAnimation(.easeInOut(duration: 0.6)) {
                                step = .calendarPermission
                            }
                        }
                    },
                    onSkip: {
                        withAnimation(.easeInOut(duration: 0.6)) {
                            step = .calendarPermission
                        }
                    }
                )
                .transition(.opacity)

            case .calendarPermission:
                PermissionRequestView(
                    icon: Image("calendar"),
                    title: "Enable Calendar Access",
                    description: "Ve.Ai can show all your upcoming events in one place. Access to your calendar is needed to display your schedule.",
                    privacyNote: "Your calendar data is only used to show your events and is never shared.",
                    onAllow: {
                        Task {
                                await requestCalendarPermission()
                                withAnimation(.easeInOut(duration: 0.6)) {
                                    step = .remindersPermission
                                }
                        }
                    },
                    onSkip: {
                            withAnimation(.easeInOut(duration: 0.6)) {
                                step = .remindersPermission
                            }
                    }
                )
                .transition(.opacity)

                case .remindersPermission:
                    PermissionRequestView(
                        icon: Image("reminders"),
                        title: "Enable Reminders Access",
                        description: "Ve.Ai can show your scheduled reminders alongside your calendar events. Access to Reminders is needed to display your reminders.",
                        privacyNote: "Your reminders data is only used to show your reminders and is never shared.",
                        onAllow: {
                            Task {
                                await requestRemindersPermission()
                                withAnimation(.easeInOut(duration: 0.6)) {
                                    step = .musicPermission
                                }
                            }
                        },
                        onSkip: {
                            withAnimation(.easeInOut(duration: 0.6)) {
                                step = .musicPermission
                            }
                        }
                    )
                    .transition(.opacity)
                
            case .musicPermission:
                MusicControllerSelectionView(
                    onContinue: {
                        withAnimation(.easeInOut(duration: 0.6)) {
                            step = .finished
                        }
                    }
                )
                .transition(.opacity)

            case .finished:
                OnboardingFinishView(onFinish: onFinish, onOpenSettings: onOpenSettings)
            }
        }
        .frame(width: 400, height: 600)
    }

    // MARK: - Permission Request Logic

    func requestMicrophonePermission() async {
        if #available(macOS 10.14, *) {
            _ = await AVCaptureDevice.requestAccess(for: .audio)
        }
    }

    func requestScreenRecordingPermission() async -> Bool {
        // CGPreflightScreenCaptureAccess returns current grant state
        let hasAccess = CGPreflightScreenCaptureAccess()
        if hasAccess {
            return true
        }
        // This will prompt the user to grant access in System Settings
        return CGRequestScreenCaptureAccess()
    }

    func requestAccessibilityPermission() -> Bool {
        // Check if already granted
        let currentStatus = AXIsProcessTrusted()
        if currentStatus {
            print("🔐 Accessibility permission already granted")
            return true
        }
        
        print("🔐 Requesting accessibility permission...")
        
        // Method 1: Try to trigger permission dialog
        let options = [kAXTrustedCheckOptionPrompt.takeRetainedValue() as NSString: true] as CFDictionary
        let trusted = AXIsProcessTrustedWithOptions(options)
        
        // Method 2: If no dialog appeared, try opening System Settings directly
        if !trusted {
            print("🔐 No dialog appeared, opening System Settings...")
            DispatchQueue.main.async {
                if let url = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility") {
                    NSWorkspace.shared.open(url)
                }
            }
        }
        
        print("🔐 Accessibility permission status: \(trusted ? "Granted" : "Not granted")")
        return trusted
    }

    func requestCameraPermission() async {
        await AVCaptureDevice.requestAccess(for: .video)
    }

    func requestCalendarPermission() async {
        _ = try? await calendarService.requestAccess(to: .event)
    }

    func requestRemindersPermission() async {
        _ = try? await calendarService.requestAccess(to: .reminder)
    }
}


// MARK: - Previews

#Preview("Welcome") {
    OnboardingView(
        onFinish: {},
        onOpenSettings: {}
    )
}

#Preview("Microphone") {
    OnboardingView(
        step: .microphonePermission,
        onFinish: {},
        onOpenSettings: {}
    )
}

#Preview("Screen Recording") {
    OnboardingView(
        step: .screenPermission,
        onFinish: {},
        onOpenSettings: {}
    )
}

#Preview("Accessibility") {
    OnboardingView(
        step: .accessibilityPermission,
        onFinish: {},
        onOpenSettings: {}
    )
}

#Preview("Camera") {
    OnboardingView(
        step: .cameraPermission,
        onFinish: {},
        onOpenSettings: {}
    )
}

#Preview("Calendar") {
    OnboardingView(
        step: .calendarPermission,
        onFinish: {},
        onOpenSettings: {}
    )
}

#Preview("Reminders") {
    OnboardingView(
        step: .remindersPermission,
        onFinish: {},
        onOpenSettings: {}
    )
}

#Preview("Music Selection") {
    OnboardingView(
        step: .musicPermission,
        onFinish: {},
        onOpenSettings: {}
    )
}

#Preview("Finished") {
    OnboardingView(
        step: .finished,
        onFinish: {},
        onOpenSettings: {}
    )
}

