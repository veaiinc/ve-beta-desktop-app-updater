//
//  MeetingButtons.swift
//  boringNotch
//
//  Created by Chandra on 14/10/25.
//

import SwiftUI

struct MeetingButtons: View, WebSocketEventListener {
    @ObservedObject var coordinator = BoringViewCoordinator.shared
    
    // Optional callbacks for parent integration
    var onPauseToggle: ((Bool) -> Void)? = nil
    var onStop: (() -> Void)? = nil

    // Tick every second to refresh elapsed label
//    private let tick = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    var body: some View {
        HStack(spacing: 10,) {
            // Pause/Resume
            Button {
                togglePause()
            } label: {
                Label(coordinator.meetingIsPaused ? "Resume" : "Pause",
                      systemImage: coordinator.meetingIsPaused ? "play.fill" : "pause.fill")
                    .labelStyle(.iconOnly)
            }
            .buttonStyle(.plain)
            .foregroundStyle(.white)
            .padding(6)
            .background(.white.opacity(0.08))
            .cornerRadius(6)
            .help(coordinator.meetingIsPaused ? "Resume" : "Pause")

            // Stop
            Button {
                stopTimer()
            } label: {
                Label("Stop", systemImage: "stop.fill")
                    .labelStyle(.iconOnly)
            }
            .buttonStyle(.plain)
            .foregroundStyle(.white)
            .padding(6)
            .background(.white.opacity(0.08))
            .cornerRadius(6)
            .help("Stop")
            
            // Elapsed Time
            Text(coordinator.formattedMeetingTime())
//                .font(.caption)
//                .foregroundStyle(.white)
//                .monospacedDigit()
//                .frame(alignment: .leading)
            
            // Live Intelligence Toggle Button
            Button {
                coordinator.toggleActiveMeetingView()
            } label: {
                Text(coordinator.activeMeetingView == .transcription ? "LIVE INTELLIGENCE" : "TRANSCRIPTION")
                    .font(.system(size: 9, weight: .medium))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .frame(minWidth: 80)
            }
            .buttonStyle(.plain)
            .background(coordinator.activeMeetingView == .liveIntelligence ? .white.opacity(0.2) : .white.opacity(0.08))
            .cornerRadius(6)
            .help(coordinator.activeMeetingView == .transcription ? "Switch to Live Intelligence" : "Switch to Transcription")
        }
        .onAppear {
            // Listen to websocket events
            WebSocketManager.shared.addEventListener(self)
        }
        .onDisappear {
            WebSocketManager.shared.removeEventListener(self)
        }
        .animation(.default, value: coordinator.meetingIsPaused)
    }

    // MARK: - Actions (outgoing)

    private func togglePause() {
        if coordinator.meetingIsPaused {
            // Resume
            coordinator.meetingResume()
            WebSocketManager.shared.sendEvent(type: .resumeMeeting, data: ["source": "meeting_buttons"])
        } else {
            // Pause
            coordinator.meetingPause()
            WebSocketManager.shared.sendEvent(type: .pauseMeeting, data: ["source": "meeting_buttons"])
        }
        onPauseToggle?(coordinator.meetingIsPaused)
    }

    private func stopTimer() {
        WebSocketManager.shared.sendEvent(type: .stopMeeting, data: ["source": "meeting_buttons"])

        // Reset coordinator timer
        coordinator.meetingStopAndReset()

        onStop?()
    }

    // MARK: - WebSocketEventListener (incoming)

    func onWebSocketEvent(_ event: WebSocketEvent) {
        switch event.type {
        case .meetingStarted:
            BoringViewCoordinator.shared.meetingStart()
        case .meetingPaused:
            BoringViewCoordinator.shared.meetingPause()
        case .meetingResumed:
            BoringViewCoordinator.shared.meetingResume()
        case .meetingStopped:
            BoringViewCoordinator.shared.meetingStopAndReset()
        default:
            break
        }
    }

}

#Preview {
    ZStack {
        Color.black
        MeetingButtons()
            .padding()
    }
    .frame(width: 240, height: 60)
}
