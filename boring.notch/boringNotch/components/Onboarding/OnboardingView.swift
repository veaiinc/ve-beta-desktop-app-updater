//
//  OnboardingView.swift
//  VENotch
//
//  Created by Alexander on 2025-06-23.
//

import SwiftUI
import Defaults
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
    case notchBehaviour
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
                    description: "Ve uses your microphone for voice features and Meetings.",
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
                    },
                    isSkippable: false
                )
                .transition(.opacity)

            case .screenPermission:
                PermissionRequestView(
                    icon: Image("screen"),
                    title: "Enable Screen Access",
                    description: "Ve requires screen access to display real-time visuals, overlays, or shared views within the app. This helps create interactive and dynamic on-screen experiences.",
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
                    },
                    isSkippable: false
                )
                .transition(.opacity)

            case .accessibilityPermission:
                PermissionRequestView(
                    icon: Image("accessibility"),
                    title: "Enable Accessibility",
                    description: "Ve requires accessibility permissions to enhance your experience — allowing smooth interactions, shortcuts, and smart on-screen assistance.  Granting this access helps the app work seamlessly across your system.",
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
                    description: "Ve includes a mirror feature that lets you quickly check your appearance using your camera, right from the notch. Camera access is required only to show this live preview. You can turn the mirror feature on or off at any time in the app.",
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
                    description: "Ve can show all your upcoming events in one place. Access to your calendar is needed to display your schedule.",
                    privacyNote: "Your calendar data is only used to show your events and is never shared or stored.",
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
                        description: "Ve can show your scheduled reminders alongside your calendar events. Access to Reminders is needed to display your reminders.",
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
                            step = .notchBehaviour
                        }
                    }
                )
                .transition(.opacity)

            case .notchBehaviour:
                NotchBehaviourOnboardingView(
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
        .font(Font.custom("GeneralSans", size: 15))
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


// MARK: - Notch Behaviour Onboarding Inline View
struct NotchBehaviourOnboardingView: View {
    let onContinue: () -> Void

    @Default(.notchHeight) private var notchHeight
    @Default(.notchHeightMode) private var notchHeightMode
    @Default(.nonNotchHeight) private var nonNotchHeight
    @Default(.nonNotchHeightMode) private var nonNotchHeightMode
    @Default(.nonNotchWidth) private var nonNotchWidth
    @Default(.nonNotchWidthMode) private var nonNotchWidthMode
    @Default(.openNotchOnHover) private var openNotchOnHover

    var body: some View {
        GeometryReader { geo in
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 0) {
                    Spacer(minLength: 0)
                    VStack(spacing: 26) {
            Text("Notch Behaviour")
                .font(Font.custom("GeneralSans", size: 28).weight(.semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity, alignment: .top)

            Text(
                "Adjust how the notch responds and appears on different displays. Customize height, width, and interaction behavior to match your design preference.")
                .font(Font.custom("GeneralSans", size: 13))
                .foregroundColor(Color(red: 0.95, green: 0.95, blue: 0.95))
                .multilineTextAlignment(.center)
                .lineSpacing(6)
                .fixedSize(horizontal: false, vertical: true)
                .frame(maxWidth: .infinity, alignment: .top)

            VStack(spacing: 0) {
                row {
                    Text("Notch display height")
                    Spacer()
                    Picker("", selection: $notchHeightMode) {
                        Text("Match real notch size").tag(WindowHeightMode.matchRealNotchSize)
                        Text("Match menubar height").tag(WindowHeightMode.matchMenuBar)
                        Text("Custom height").tag(WindowHeightMode.custom)
                    }
                    .labelsHidden()
                    .frame(width: 220)
                }
                if notchHeightMode == .custom {
                    controlRow {
                        Text("Custom notch size – \(notchHeight, specifier: "%.0f")")
                        Slider(value: $notchHeight, in: 15...45, step: 1)
                    }
                }

                Divider().opacity(0.15)

                row {
                    Text("Non-notch display height")
                    Spacer()
                    Picker("", selection: $nonNotchHeightMode) {
                        Text("Match menubar height").tag(WindowHeightMode.matchMenuBar)
                        Text("Match real notch size").tag(WindowHeightMode.matchRealNotchSize)
                        Text("Custom height").tag(WindowHeightMode.custom)
                    }
                    .labelsHidden()
                    .frame(width: 220)
                }
                if nonNotchHeightMode == .custom {
                    controlRow {
                        Text("Custom notch size – \(nonNotchHeight, specifier: "%.0f")")
                        Slider(value: $nonNotchHeight, in: 0...40, step: 1)
                    }
                }
                
                Divider().opacity(0.15)

                row {
                    Text("Non-notch display width")
                    Spacer()
                    Picker("", selection: $nonNotchWidthMode) {
                        Text("Match menubar width").tag(WindowHeightMode.matchMenuBar)
                        Text("Match real notch size").tag(WindowHeightMode.matchRealNotchSize)
                        Text("Custom width").tag(WindowHeightMode.custom)
                    }
                    .labelsHidden()
                    .frame(width: 220)
                }
                if nonNotchWidthMode == .custom {
                    controlRow {
                        Text("Custom notch size – \(nonNotchWidth, specifier: "%.0f")")
                        Slider(value: $nonNotchWidth, in: 20...600, step: 1)
                    }
                }
            }
            .padding(18)
            .background(Color.black.opacity(0.12))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(Color.white.opacity(0.1), lineWidth: 1)
            )
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .padding(.top, 6)
            .padding(.bottom, 6)

            VStack(spacing: 18) {
                Text("Choose how you want the notch to open.")
                    .foregroundColor(.white)
                    .font(Font.custom("GeneralSans", size: 13))

                HStack(spacing: 16) {
                    // Open on click
                    Button {
                        withAnimation(.easeInOut(duration: 0.2)) {
                            openNotchOnHover = false
                        }
                    } label: {
                        let isActive = !openNotchOnHover
                        Text("Open notch on click")
                            .font(Font.custom("GeneralSans", size: 14).weight(.medium))
                            .foregroundColor(isActive ? Color(red: 0.47, green: 0.93, blue: 0.79) : .white)
                            .frame(width: 170, height: 32)
                            .background(isActive ? Color.black.opacity(0.1) : Color.clear)
                            .overlay(
                                RoundedRectangle(cornerRadius: 8)
                                    .stroke(isActive ? Color(red: 0.47, green: 0.93, blue: 0.79) : .white.opacity(0.4), lineWidth: 1)
                            )
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                    }
                    .buttonStyle(.plain)

                    // Open on hover
                    Button {
                        withAnimation(.easeInOut(duration: 0.2)) {
                            openNotchOnHover = true
                        }
                    } label: {
                        let isActive = openNotchOnHover
                        Text("Open notch on hover")
                            .font(Font.custom("GeneralSans", size: 14).weight(.medium))
                            .foregroundColor(isActive ? Color(red: 0.47, green: 0.93, blue: 0.79) : .white)
                            .frame(width: 170, height: 32)
                            .background(isActive ? Color.black.opacity(0.1) : Color.clear)
                            .overlay(
                                RoundedRectangle(cornerRadius: 8)
                                    .stroke(isActive ? Color(red: 0.47, green: 0.93, blue: 0.79) : .white.opacity(0.4), lineWidth: 1)
                            )
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                    }
                    .buttonStyle(.plain)
                }
            }

            Button { onContinue() } label: {
                Text("Do it later")
                    .font(Font.custom("GeneralSans", size: 14).weight(.medium))
                    .foregroundColor(Color(red: 0.47, green: 0.93, blue: 0.79))
            }
            .buttonStyle(.plain)
                    }
                    .padding(.horizontal, 22)
                    .padding(.vertical, 54)
                    Spacer(minLength: 0)
                }
                .frame(height: geo.size.height)
            }
            .background(
                VisualEffectView(material: .underWindowBackground, blendingMode: .behindWindow)
                    .ignoresSafeArea()
            )
        }
        .frame(width: 400, height: 700)
    }

    @ViewBuilder
    private func row<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        HStack { content() }
            .padding(.vertical, 14)
    }

    @ViewBuilder
    private func controlRow<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        HStack(spacing: 16) { content() }
            .padding(.vertical, 10)
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

#Preview("Notch Behaviour") {
    NotchBehaviourOnboardingView(onContinue: {})
}

