//
//  MeetingView.swift
//  boringNotch
//
//  Created by AI Assistant on $(date).
//

import SwiftUI
import Foundation

struct MeetingView: View, WebSocketEventListener {
    @StateObject private var webSocketManager = WebSocketManager.shared
    @State private var meetingData: [String: Any] = [:]
    @State private var lastEventTime: Date = Date()
    @State private var eventHistory: [WebSocketEvent] = []
    
    var body: some View {
        VStack(spacing: 12) {
            // Connection Status
            HStack {
                Circle()
                    .fill(webSocketManager.isConnected ? Color.green : Color.red)
                    .frame(width: 8, height: 8)
                
                Text(webSocketManager.connectionStatus)
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                Button(action: {
                    if webSocketManager.isConnected {
                        webSocketManager.disconnect()
                    } else {
                        webSocketManager.connect()
                    }
                }) {
                    Text(webSocketManager.isConnected ? "Disconnect" : "Connect")
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.blue.opacity(0.2))
                        .foregroundColor(.blue)
                        .cornerRadius(4)
                }
            }
            .padding(.horizontal, 16)
            
            // Meeting Status
            HStack {
                Text("Status:")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Text(webSocketManager.meetingStatus)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(getStatusColor())
                
                Spacer()
            }
            .padding(.horizontal, 16)
            
            // Event History
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 8) {
                    ForEach(eventHistory.suffix(10), id: \.id) { event in
                        EventBubble(event: event)
                    }
                }
                .padding(.horizontal, 16)
            }
            .frame(maxHeight: 200)
            
            // Action Buttons
            VStack(spacing: 8) {
                HStack(spacing: 8) {
                    Button("Start Meeting") {
                        webSocketManager.sendEvent(type: .startMeeting, data: ["source": "swift_ui"])
                    }
                    .disabled(!webSocketManager.isConnected)
                    
                    Button("Stop Meeting") {
                        webSocketManager.sendEvent(type: .stopMeeting, data: ["source": "swift_ui"])
                    }
                    .disabled(!webSocketManager.isConnected)
                }
                
                HStack(spacing: 8) {
                    Button("Pause Meeting") {
                        webSocketManager.sendEvent(type: .pauseMeeting, data: ["source": "swift_ui"])
                    }
                    .disabled(!webSocketManager.isConnected)
                    
                    Button("Resume Meeting") {
                        webSocketManager.sendEvent(type: .resumeMeeting, data: ["source": "swift_ui"])
                    }
                    .disabled(!webSocketManager.isConnected)
                }
                
                Button("Test Custom Event") {
                    webSocketManager.sendEvent(type: .custom, data: [
                        "message": "Test from Swift UI",
                        "timestamp": Date().timeIntervalSince1970
                    ])
                }
                .disabled(!webSocketManager.isConnected)
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 8)
        }
        .onAppear {
            // Register as event listener
            webSocketManager.addEventListener(self)
        }
        .onDisappear {
            // Unregister event listener
            webSocketManager.removeEventListener(self)
        }
    }
    
    // MARK: - WebSocketEventListener
    
    func onWebSocketEvent(_ event: WebSocketEvent) {
        DispatchQueue.main.async {
            self.eventHistory.append(event)
            self.lastEventTime = event.timestamp
            
            // Handle specific event types
            switch event.type {
            case .meetingStarted:
                handleMeetingStarted(event)
            case .meetingStopped:
                handleMeetingStopped(event)
            case .meetingPaused:
                handleMeetingPaused(event)
            case .meetingResumed:
                handleMeetingResumed(event)
            case .startMeeting:
                handleStartMeeting(event)
            case .stopMeeting:
                handleStopMeeting(event)
            case .pauseMeeting:
                handlePauseMeeting(event)
            case .resumeMeeting:
                handleResumeMeeting(event)
            case .transcriptionUpdate:
                handleTranscriptionUpdate(event)
            case .participantJoined:
                handleParticipantJoined(event)
            case .participantLeft:
                handleParticipantLeft(event)
            case .dataUpdate:
                handleDataUpdate(event)
            case .areYouThereShow:
                handleAreYouThereShow(event)
            case .areYouThereContinue:
                handleAreYouThereContinue(event)
            case .areYouThereStop:
                handleAreYouThereStop(event)
            default:
                print("📨 Unhandled event type: \(event.type.rawValue)")
            }
        }
    }
    
    // MARK: - Event Handlers
    
    private func handleMeetingStarted(_ event: WebSocketEvent) {
        print("🎯 Meeting started with data: \(event.data)")
        // Update UI based on meeting start data
        if let meetingId = event.data["meetingId"] as? String {
            meetingData["meetingId"] = meetingId
        }
    }
    
    private func handleMeetingStopped(_ event: WebSocketEvent) {
        print("🏁 Meeting stopped with data: \(event.data)")
        // Clear meeting data
        meetingData.removeAll()
    }
    
    private func handleMeetingPaused(_ event: WebSocketEvent) {
        print("⏸️ Meeting paused with data: \(event.data)")
        // Handle meeting pause
        if let reason = event.data["reason"] as? String {
            meetingData["pauseReason"] = reason
        }
    }
    
    private func handleMeetingResumed(_ event: WebSocketEvent) {
        print("▶️ Meeting resumed with data: \(event.data)")
        // Handle meeting resume
        meetingData.removeValue(forKey: "pauseReason")
    }
    
    private func handleStartMeeting(_ event: WebSocketEvent) {
        print("🚀 Start meeting request with data: \(event.data)")
        // Handle start meeting request
    }
    
    private func handleStopMeeting(_ event: WebSocketEvent) {
        print("🛑 Stop meeting request with data: \(event.data)")
        // Handle stop meeting request
    }
    
    private func handlePauseMeeting(_ event: WebSocketEvent) {
        print("⏸️ Pause meeting request with data: \(event.data)")
        // Handle pause meeting request
    }
    
    private func handleResumeMeeting(_ event: WebSocketEvent) {
        print("▶️ Resume meeting request with data: \(event.data)")
        // Handle resume meeting request
    }
    
    private func handleTranscriptionUpdate(_ event: WebSocketEvent) {
        print("📝 Transcription update: \(event.data)")
        // Handle transcription data
        if let text = event.data["text"] as? String {
            meetingData["lastTranscription"] = text
        }
    }
    
    private func handleParticipantJoined(_ event: WebSocketEvent) {
        print("👋 Participant joined: \(event.data)")
        // Update participant list
        if let participantName = event.data["name"] as? String {
            // Add to participant list logic here
        }
    }
    
    private func handleParticipantLeft(_ event: WebSocketEvent) {
        print("👋 Participant left: \(event.data)")
        // Update participant list
        if let participantName = event.data["name"] as? String {
            // Remove from participant list logic here
        }
    }
    
    private func handleDataUpdate(_ event: WebSocketEvent) {
        print("📊 Data update: \(event.data)")
        // Merge new data with existing data
        for (key, value) in event.data {
            meetingData[key] = value
        }
    }
    
    private func handleAreYouThereShow(_ event: WebSocketEvent) {
        print("❓ Are You There window shown: \(event.data)")
        // Handle Are You There window display
        if let reason = event.data["reason"] as? String {
            meetingData["areYouThereReason"] = reason
        }
    }
    
    private func handleAreYouThereContinue(_ event: WebSocketEvent) {
        print("✅ Are You There - User continued: \(event.data)")
        // Handle user continuing the meeting
        meetingData.removeValue(forKey: "areYouThereReason")
    }
    
    private func handleAreYouThereStop(_ event: WebSocketEvent) {
        print("🛑 Are You There - User stopped: \(event.data)")
        // Handle user stopping the meeting
        meetingData.removeAll()
    }
    
    // MARK: - Helper Methods
    
    private func getStatusColor() -> Color {
        switch webSocketManager.meetingStatus {
        case "Meeting Started":
            return .green
        case "Meeting Stopped":
            return .red
        case "Meeting Paused":
            return .orange
        case "Meeting Resumed":
            return .green
        case "Starting Meeting...":
            return .blue
        case "Stopping Meeting...":
            return .orange
        case "Pausing Meeting...":
            return .yellow
        case "Resuming Meeting...":
            return .blue
        default:
            return .primary
        }
    }
}

struct EventBubble: View {
    let event: WebSocketEvent
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(event.type.rawValue)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(.blue)
                
                Spacer()
                
                Text(formatTimestamp(event.timestamp))
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            
            if !event.data.isEmpty {
                Text(formatEventData(event.data))
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(Color.gray.opacity(0.1))
        .cornerRadius(8)
    }
    
    private func formatTimestamp(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
    
    private func formatEventData(_ data: [String: Any]) -> String {
        let keyValuePairs = data.compactMap { key, value in
            "\(key): \(value)"
        }
        return keyValuePairs.joined(separator: ", ")
    }
}
