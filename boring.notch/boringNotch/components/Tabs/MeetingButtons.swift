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
        HStack(spacing: 4,) {
            // Pause/Resume
            Button {
                togglePause()
            } label: {
                Label(coordinator.meetingIsPaused ? "Resume" : "Pause",
                      systemImage: coordinator.meetingIsPaused ? "play.fill" : "pause.fill")
                    .labelStyle(.iconOnly)
                    .frame(width: 10,height: 10)
                    .foregroundColor(.white)
            }
            .buttonStyle(.plain)
            .padding(.horizontal, 10)
            .padding(.vertical, 2)
            .frame(height: 24, alignment: .center)
            .cornerRadius(24)
            .overlay(
            RoundedRectangle(cornerRadius: 24)
            .inset(by: 0.25)
            .stroke(.white.opacity(0.2), lineWidth: 0.5)

            )
            .help(coordinator.meetingIsPaused ? "Resume" : "Pause")
            .onHover { isHovered in
                if isHovered {
                    NSCursor.pointingHand.push()
                } else {
                    NSCursor.pop()
                }
            }

            // Stop
            Button {
                stopTimer()
            } label: {
                Label("Stop", systemImage: "stop.fill")
                    .labelStyle(.iconOnly)
                    .frame(width: 10,height: 10)
                    .foregroundColor(Color(red: 0.79, green: 0.28, blue: 0.29))
            }
            .buttonStyle(.plain)
            .padding(.horizontal, 10)
            .padding(.vertical, 2)
            .frame(height: 24, alignment: .center)
            .cornerRadius(24)
            .overlay(
            RoundedRectangle(cornerRadius: 24)
            .inset(by: 0.25)
            .stroke(.white.opacity(0.2), lineWidth: 0.5)

            )
            .help("Stop")
            .onHover { isHovered in
                if isHovered {
                    NSCursor.pointingHand.push()
                } else {
                    NSCursor.pop()
                }
            }
            
            // Elapsed Time
  //          Text(coordinator.formattedMeetingTime())
//                .font(.caption)
//                .foregroundStyle(.white)
//                .monospacedDigit()
//                .frame(alignment: .leading)
            
            // Live Intelligence Toggle Button
            Button {
                coordinator.toggleActiveMeetingView()
            } label: {
                Text(coordinator.activeMeetingView == .transcription ? "SHOW LIVE INTELLIGENCE" : "SHOW TRANSCRIPTION")
                    .font(.system(size: 9, weight: .medium))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .fixedSize(horizontal: true, vertical: false)
            }
            .buttonStyle(.plain)
            .padding(.horizontal, 8)
            .padding(.vertical, 2)
            .frame(height: 24)
            .background(Color.clear)
            .cornerRadius(24)
            .overlay(
                RoundedRectangle(cornerRadius: 24)
                    .inset(by: 0.25)
                    .stroke(.white.opacity(0.2), lineWidth: 0.5)
            )
            .help(coordinator.activeMeetingView == .transcription ? "Switch to Live Intelligence" : "Switch to Transcription")
            .onHover { isHovered in
                if isHovered {
                    NSCursor.pointingHand.push()
                } else {
                    NSCursor.pop()
                }
            }
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
