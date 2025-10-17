//
//  MeetingButtons.swift
//  boringNotch
//
//  Created by Chandra on 14/10/25.
//

import SwiftUI

struct MeetingButtons: View, WebSocketEventListener {
    @ObservedObject var coordinator = BoringViewCoordinator.shared
    @State private var meetingIsLoading: Bool = false
    
    // Optional callbacks for parent integration
    var onPauseToggle: ((Bool) -> Void)? = nil
    var onStop: (() -> Void)? = nil

    // Tick every second to refresh elapsed label
//    private let tick = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    var body: some View {
            
            HStack(spacing: 0) {
                // Pause/Resume button
                if meetingIsLoading {
                    ProgressView()
                        .progressViewStyle(.circular)
                        .scaleEffect(0.5)
                }else {
                    Button {
                        togglePause()
                    } label: {
                        Label(coordinator.meetingIsPaused ? "Resume" : "Pause",
                              systemImage: coordinator.meetingIsPaused ? "play.fill" : "pause.fill")
                        .labelStyle(.iconOnly)
                        .foregroundColor(.white)
                    }
                    .buttonStyle(.plain)
                    .frame(maxWidth: 30)
                    .frame(height: 24)
                    .help(coordinator.meetingIsPaused ? "Resume" : "Pause")
                    .onHover { isHovered in
                        if isHovered {
                            NSCursor.pointingHand.push()
                        } else {
                            NSCursor.pop()
                        }
                    }
                }
               
                
                Divider()
                    .frame(height: 24)
                
                // Stop button
                Button {
                    stopTimer()
                } label: {
                    Label("Stop", systemImage: "stop.fill")
                    .labelStyle(.iconOnly)
                    .foregroundColor(.white)
                }
                .buttonStyle(.plain)
                .frame(maxWidth: 30)
                .frame(height: 24)
                .help("Stop")
                .onHover { isHovered in
                    if isHovered {
                        NSCursor.pointingHand.push()
                    } else {
                        NSCursor.pop()
                    }
                }
            
                
//                Button {
//                    coordinator.toggleActiveMeetingView()
//                } label: {
//                    Text(coordinator.activeMeetingView == .transcription ? "SHOW LIVE INTELLIGENCE" : "SHOW TRANSCRIPTION")
//                        .font(.system(size: 9, weight: .medium))
//                        .foregroundStyle(.white)
//                        .lineLimit(1)
//                        .fixedSize(horizontal: true, vertical: false)
//                }
//                .buttonStyle(.plain)
//                .padding(.horizontal, 8)
//                .padding(.vertical, 2)
//                .frame(height: 24)
//                .background(Color.clear)
//                .cornerRadius(24)
//                .overlay(
//                    RoundedRectangle(cornerRadius: 24)
//                        .inset(by: 0.25)
//                        .stroke(.white.opacity(0.2), lineWidth: 0.5)
//                )
//                .help(coordinator.activeMeetingView == .transcription ? "Switch to Live Intelligence" : "Switch to Transcription")
//                .onHover { isHovered in
//                    if isHovered {
//                        NSCursor.pointingHand.push()
//                    } else {
//                        NSCursor.pop()
//                    }
//                }
            
        }
        .cornerRadius(12)
        .frame(height: 24)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .inset(by: 0.25)
                .stroke(.white.opacity(0.2), lineWidth: 0.5)
        )
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
        case .startMeeting:
            meetingIsLoading = true
        case .meetingStarted:
            BoringViewCoordinator.shared.meetingStart()
            meetingIsLoading = false
        case .meetingPaused:
            BoringViewCoordinator.shared.meetingPause()
        case .meetingResumed:
            BoringViewCoordinator.shared.meetingResume()
        case .meetingStopped:
            BoringViewCoordinator.shared.meetingStopAndReset()
        case .meetingStartError:
            meetingIsLoading = false
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
