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
                    icon: Image(systemName: "mic.fill"),
                    title: "Enable Microphone Access",
                    description: "VE Notch uses your microphone for voice features and quick voice interactions. We only listen when you explicitly engage voice features.",
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
                    icon: Image(systemName: "display"),
                    title: "Enable Screen Recording",
                    description: "Grant screen capture permission so VE Notch can support features that reference on-screen content (e.g. overlay guidance).",
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
                    icon: Image(systemName: "hand.raised.fill"),
                    title: "Enable Accessibility",
                    description: "Accessibility permission lets VE Notch offer features like selection assistance and global shortcuts.",
                    privacyNote: "No keystrokes are logged; this permission is only used to enable specific interactions.",
                    onAllow: {
                        Task {
                            let _ = requestAccessibilityPermission()
                            withAnimation(.easeInOut(duration: 0.6)) {
                                step = .cameraPermission
                            }
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
                    icon: Image(systemName: "camera.fill"),
                    title: "Enable Camera Access",
                    description: "VE Notch includes a mirror feature that lets you quickly check your appearance using your camera, right from the notch. Camera access is required only to show this live preview. You can turn the mirror feature on or off at any time in the app.",
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
                    icon: Image(systemName: "calendar"),
                    title: "Enable Calendar Access",
                    description: "VE Notch can show all your upcoming events in one place. Access to your calendar is needed to display your schedule.",
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
                        icon: Image(systemName: "checklist"),
                        title: "Enable Reminders Access",
                        description: "VE Notch can show your scheduled reminders alongside your calendar events. Access to Reminders is needed to display your reminders.",
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
        let options = [kAXTrustedCheckOptionPrompt.takeRetainedValue() as NSString: true] as CFDictionary
        // This call shows the System Settings prompt if not granted
        let trusted = AXIsProcessTrustedWithOptions(options)
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

