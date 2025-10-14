//
//  SelectionAssistantViews.swift
//  NotchDrop
//
//  SwiftUI views backing the selection assistant popover.
//

import SwiftUI

struct SelectionAssistantRootView: View {
    @ObservedObject var state: SelectionAssistantState
    let onToggleHistory: () -> Void
    let onClose: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            header
            Divider()
            content
        }
        .padding(16)
        .frame(minWidth: 340, idealWidth: 360, maxWidth: 420, minHeight: 260, maxHeight: 420)
    }

    private var header: some View {
        HStack(spacing: 8) {
            VStack(alignment: .leading, spacing: 2) {
                Text("Selection Assistant")
                    .font(.headline)
                Text(state.permissionGranted ? "Monitoring highlighted text" : "Waiting for Accessibility permission")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Button(action: onToggleHistory) {
                Label(
                    state.mode == .history ? "Close History" : "History",
                    systemImage: "clock.arrow.circlepath"
                )
            }
            .buttonStyle(.borderless)
            Button(action: onClose) {
                Image(systemName: "xmark.circle.fill")
                    .font(.system(size: 16, weight: .semibold))
            }
            .buttonStyle(.borderless)
        }
    }

    @ViewBuilder
    private var content: some View {
        switch state.mode {
        case .onboarding:
            SelectionOnboardingView(
                message: state.onboardingMessage,
                permissionGranted: state.permissionGranted,
                consentGranted: state.consentGranted,
                onContinue: {
                    state.onAcknowledgeOnboarding?()
                },
                onOpenSettings: {
                    state.onRequestPermission?()
                }
            )
        case .prompt:
            if let entry = state.latestEntry {
                SelectionPromptView(
                    entry: entry,
                    onCopy: {
                        state.onCopySelection?(entry)
                    },
                    onTogglePin: { pin in
                        state.onPinSelection?(entry, pin)
                        state.latestEntry?.isPinned = pin
                    },
                    onShowHistory: onToggleHistory
                )
            } else {
                Text("Highlight text in any window to capture it instantly.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
        case .history:
            SelectionHistoryView(
                entries: state.history,
                onCopy: { entry in
                    state.onCopySelection?(entry)
                },
                onTogglePin: { entry, pin in
                    state.onPinSelection?(entry, pin)
                },
                onDelete: { entry in
                    state.onDeleteEntry?(entry)
                },
                onClearHistory: {
                    state.onClearHistory?()
                }
            )
        case .idle:
            VStack(alignment: .leading, spacing: 8) {
                Text("Highlight text anywhere to see it here.")
                    .font(.subheadline)
                if !state.permissionGranted {
                    Text(state.permissionDeniedMessage)
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                } else {
                    Text("Selections are stored locally and encrypted. Review or clear your history any time.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }
        }
    }
}

// MARK: - Onboarding
private struct SelectionOnboardingView: View {
    let message: String
    let permissionGranted: Bool
    let consentGranted: Bool
    let onContinue: () -> Void
    let onOpenSettings: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(message)
                .font(.body)
                .fixedSize(horizontal: false, vertical: true)

            if permissionGranted {
                Text("You're all set! Highlight text to see it here.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            } else {
                Text("Grant Accessibility access in System Settings so the assistant can observe the selected text.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            HStack {
                Button("Open System Settings") {
                    onOpenSettings()
                }
                .buttonStyle(.borderedProminent)

                Spacer()

                if !consentGranted {
                    Button("Continue") {
                        onContinue()
                    }
                    .buttonStyle(.bordered)
                }
            }
        }
    }
}

// MARK: - Prompt View
private struct SelectionPromptView: View {
    @State private var isPinned: Bool

    let entry: SelectionHistoryEntry
    let onCopy: () -> Void
    let onTogglePin: (Bool) -> Void
    let onShowHistory: () -> Void

    init(entry: SelectionHistoryEntry, onCopy: @escaping () -> Void, onTogglePin: @escaping (Bool) -> Void, onShowHistory: @escaping () -> Void) {
        self.entry = entry
        self.onCopy = onCopy
        self.onTogglePin = onTogglePin
        self.onShowHistory = onShowHistory
        _isPinned = State(initialValue: entry.isPinned)
    }

    var promptString: String {
        """
        You selected the following text:
        ---------------------
        \(entry.text)
        ---------------------
        You can copy, save, or review your selection history in the menu bar app.
        """
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ScrollView {
                Text(promptString)
                    .textSelection(.enabled)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(8)
                    .background(Color(nsColor: .controlBackgroundColor))
                    .cornerRadius(8)
            }
            .frame(maxHeight: 160)

            if let source = entry.sourceAppName {
                Text("Source: \(source)")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            HStack {
                Button(action: onCopy) {
                    Label("Copy", systemImage: "doc.on.doc")
                }
                .buttonStyle(.bordered)

                Button {
                    isPinned.toggle()
                    onTogglePin(isPinned)
                } label: {
                    Label(isPinned ? "Saved" : "Save", systemImage: isPinned ? "pin.fill" : "pin")
                }
                .buttonStyle(.bordered)

                Button(action: onShowHistory) {
                    Label("History", systemImage: "clock")
                }
                .buttonStyle(.bordered)

                Spacer()
            }
        }
    }
}

// MARK: - History View
private struct SelectionHistoryView: View {
    let entries: [SelectionHistoryEntry]
    let onCopy: (SelectionHistoryEntry) -> Void
    let onTogglePin: (SelectionHistoryEntry, Bool) -> Void
    let onDelete: (SelectionHistoryEntry) -> Void
    let onClearHistory: () -> Void

    private let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter
    }()

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            if entries.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("No selections yet.")
                        .font(.subheadline)
                    Text("Highlight any text to store it securely. History is encrypted and stays on this device.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
                Spacer()
            } else {
                ScrollView {
                    VStack(alignment: .leading, spacing: 12) {
                        ForEach(entries) { entry in
                            SelectionHistoryRow(
                                entry: entry,
                                dateFormatter: dateFormatter,
                                onCopy: { onCopy(entry) },
                                onTogglePin: { newValue in
                                    onTogglePin(entry, newValue)
                                },
                                onDelete: { onDelete(entry) }
                            )
                            Divider()
                        }
                    }
                }

                HStack {
                    Button("Clear History", role: .destructive) {
                        onClearHistory()
                    }
                    Spacer()
                    Text("Data stored locally with AES-256 encryption.")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }
        }
    }
}

private struct SelectionHistoryRow: View {
    let entry: SelectionHistoryEntry
    let dateFormatter: DateFormatter
    let onCopy: () -> Void
    let onTogglePin: (Bool) -> Void
    let onDelete: () -> Void

    @State private var isPinned: Bool

    init(entry: SelectionHistoryEntry, dateFormatter: DateFormatter, onCopy: @escaping () -> Void, onTogglePin: @escaping (Bool) -> Void, onDelete: @escaping () -> Void) {
        self.entry = entry
        self.dateFormatter = dateFormatter
        self.onCopy = onCopy
        self.onTogglePin = onTogglePin
        self.onDelete = onDelete
        _isPinned = State(initialValue: entry.isPinned)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(entry.trimmedText)
                .font(.body)
                .lineLimit(3)
                .textSelection(.enabled)

            HStack(spacing: 12) {
                if let app = entry.sourceAppName {
                    Label(app, systemImage: "app")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                Text(dateFormatter.string(from: entry.createdAt))
                    .font(.caption)
                    .foregroundStyle(.secondary)

                Spacer()

                Button(action: onCopy) {
                    Image(systemName: "doc.on.doc")
                }
                .buttonStyle(.borderless)
                .help("Copy selection")

                Button {
                    isPinned.toggle()
                    onTogglePin(isPinned)
                } label: {
                    Image(systemName: isPinned ? "pin.fill" : "pin")
                }
                .buttonStyle(.borderless)
                .help(isPinned ? "Unpin selection" : "Pin selection")

                Button(role: .destructive, action: onDelete) {
                    Image(systemName: "trash")
                }
                .buttonStyle(.borderless)
                .help("Delete selection")
            }
        }
    }
}
