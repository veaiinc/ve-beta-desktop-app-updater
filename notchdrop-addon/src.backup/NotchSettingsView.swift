import SwiftUI

// MARK: - Advanced NotchSettingsView (Ported from NotchDropLatest)
@objc public struct NotchSettingsView: View {
    @StateObject var vm: NotchViewModel

    public var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Header
                HStack {
                    Button(action: {
                        vm.contentType = .normal
                    }) {
                        Image(systemName: "chevron.left")
                            .foregroundColor(.white.opacity(0.8))
                            .font(.system(size: 16))
                    }
                    .buttonStyle(PlainButtonStyle())

                    Spacer()

                    Text("Settings")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)

                    Spacer()
                }
                .padding(.bottom, 8)

                // Settings sections
                VStack(spacing: 24) {
                    // General Settings
                    SettingsSection(title: "General") {
                        ToggleRow(
                            title: "Haptic Feedback",
                            subtitle: "Vibrate when interacting with the notch",
                            isOn: $vm.hapticFeedback
                        )

                        ToggleRow(
                            title: "Auto-open",
                            subtitle: "Automatically open notch when dragging files",
                            isOn: .constant(true) // Would be stored in UserDefaults
                        )
                    }

                    // File Storage Settings
                    SettingsSection(title: "File Storage") {
                        StorageTimePicker()

                        Button(action: {
                            clearAllFiles()
                        }) {
                            HStack {
                                Image(systemName: "trash")
                                    .foregroundColor(.red)
                                Text("Clear All Files")
                                    .foregroundColor(.red)
                                Spacer()
                            }
                            .padding(.vertical, 8)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }

                    // Appearance Settings
                    SettingsSection(title: "Appearance") {
                        ToggleRow(
                            title: "Dark Mode",
                            subtitle: "Use dark theme for the interface",
                            isOn: .constant(true)
                        )
                    }

                    // About Section
                    SettingsSection(title: "About") {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("NotchDrop")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.white)

                            Text("Transform your MacBook's notch into a convenient file drop zone.")
                                .font(.system(size: 12))
                                .foregroundColor(.white.opacity(0.7))
                                .lineSpacing(2)

                            Text("Version 1.0.0")
                                .font(.system(size: 12))
                                .foregroundColor(.white.opacity(0.5))
                        }
                        .padding(.vertical, 8)
                    }
                }
            }
            .padding(16)
        }
        .background(
            RoundedRectangle(cornerRadius: vm.cornerRadius)
                .fill(Color.black.opacity(0.85))
                .overlay(
                    RoundedRectangle(cornerRadius: vm.cornerRadius)
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
        )
        .shadow(color: Color.black.opacity(0.3), radius: 20, x: 0, y: 10)
    }

    private func clearAllFiles() {
        let alert = NSAlert()
        alert.messageText = "Clear All Files"
        alert.informativeText = "This will permanently delete all files in the tray. This action cannot be undone."
        alert.addButton(withTitle: "Cancel")
        alert.addButton(withTitle: "Delete All")
        alert.alertStyle = .warning

        if alert.runModal() == .alertSecondButtonReturn {
            TrayDrop.shared.removeAll()
        }
    }
}

// MARK: - Settings Components
struct SettingsSection<Content: View>: View {
    let title: String
    let content: Content

    init(title: String, @ViewBuilder content: () -> Content) {
        self.title = title
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.white.opacity(0.9))
                .textCase(.uppercase)
                .padding(.horizontal, 4)

            content
        }
    }
}

struct ToggleRow: View {
    let title: String
    let subtitle: String?
    @Binding var isOn: Bool

    @State private var isHovering = false

    var body: some View {
        HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.white)

                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(.system(size: 12))
                        .foregroundColor(.white.opacity(0.6))
                        .lineLimit(2)
                }
            }

            Spacer()

            CustomToggle(isOn: $isOn)
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 12)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(isHovering ? Color.white.opacity(0.05) : Color.clear)
        )
        .onHover { hovering in
            isHovering = hovering
        }
    }
}

struct CustomToggle: View {
    @Binding var isOn: Bool

    @State private var isHovering = false

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 12)
                .fill(isOn ? Color.blue : Color.gray.opacity(0.3))
                .frame(width: 36, height: 20)
                .animation(.easeInOut(duration: 0.2), value: isOn)

            Circle()
                .fill(Color.white)
                .frame(width: 16, height: 16)
                .offset(x: isOn ? 8 : -8)
                .animation(.easeInOut(duration: 0.2), value: isOn)
                .shadow(color: Color.black.opacity(0.2), radius: 2, x: 0, y: 1)
        }
        .onTapGesture {
            isOn.toggle()
        }
        .onHover { hovering in
            isHovering = hovering
        }
    }
}

struct StorageTimePicker: View {
    @State private var selectedTime = "1 Day"

    let timeOptions = ["1 Hour", "1 Day", "2 Days", "1 Week", "Forever"]

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Keep files for")
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(.white)

            Menu {
                ForEach(timeOptions, id: \.self) { option in
                    Button(option) {
                        selectedTime = option
                    }
                }
            } label: {
                HStack {
                    Text(selectedTime)
                        .font(.system(size: 14))
                        .foregroundColor(.white)

                    Spacer()

                    Image(systemName: "chevron.down")
                        .font(.system(size: 12))
                        .foregroundColor(.white.opacity(0.6))
                }
                .padding(.vertical, 8)
                .padding(.horizontal, 12)
                .background(Color.white.opacity(0.05))
                .cornerRadius(6)
            }
            .buttonStyle(PlainButtonStyle())
        }
    }
}
