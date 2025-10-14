//
//  EventDrivenViewExample.swift
//  boringNotch
//
//  Created by AI Assistant on $(date).
//  Example showing how to use the event-driven WebSocket system
//

import SwiftUI
import Foundation

// MARK: - Example View that listens to WebSocket events

struct EventDrivenViewExample: View, WebSocketEventListener {
    @StateObject private var webSocketManager = WebSocketManager.shared
    @State private var participantCount: Int = 0
    @State private var isRecording: Bool = false
    @State private var lastTranscription: String = ""
    @State private var customData: [String: Any] = [:]
    
    var body: some View {
        VStack(spacing: 16) {
            Text("Event-Driven Example")
                .font(.headline)
            
            // Connection Status
            HStack {
                Circle()
                    .fill(webSocketManager.isConnected ? Color.green : Color.red)
                    .frame(width: 12, height: 12)
                Text(webSocketManager.connectionStatus)
                    .font(.caption)
            }
            
            // Meeting Info
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text("Participants:")
                    Spacer()
                    Text("\(participantCount)")
                        .fontWeight(.medium)
                }
                
                HStack {
                    Text("Recording:")
                    Spacer()
                    Text(isRecording ? "🔴 Recording" : "⏹️ Stopped")
                        .foregroundColor(isRecording ? .red : .secondary)
                }
                
                if !lastTranscription.isEmpty {
                    VStack(alignment: .leading) {
                        Text("Last Transcription:")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Text(lastTranscription)
                            .font(.caption)
                            .lineLimit(3)
                    }
                }
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(8)
            
            // Action Buttons
            VStack(spacing: 8) {
                Button("Simulate Participant Join") {
                    webSocketManager.sendEvent(type: .participantJoined, data: [
                        "name": "John Doe",
                        "id": UUID().uuidString,
                        "timestamp": Date().timeIntervalSince1970
                    ])
                }
                .disabled(!webSocketManager.isConnected)
                
                Button("Simulate Recording Start") {
                    webSocketManager.sendEvent(type: .recordingStarted, data: [
                        "recordingId": UUID().uuidString,
                        "quality": "HD"
                    ])
                }
                .disabled(!webSocketManager.isConnected)
                
                Button("Send Custom Data") {
                    webSocketManager.sendEvent(type: .dataUpdate, data: [
                        "key1": "value1",
                        "key2": 42,
                        "key3": true,
                        "nested": [
                            "subkey": "subvalue"
                        ]
                    ])
                }
                .disabled(!webSocketManager.isConnected)
            }
        }
        .padding()
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
            switch event.type {
            case .participantJoined:
                handleParticipantJoined(event)
            case .participantLeft:
                handleParticipantLeft(event)
            case .recordingStarted:
                handleRecordingStarted(event)
            case .recordingStopped:
                handleRecordingStopped(event)
            case .transcriptionUpdate:
                handleTranscriptionUpdate(event)
            case .dataUpdate:
                handleDataUpdate(event)
            default:
                print("📨 Unhandled event in example view: \(event.type.rawValue)")
            }
        }
    }
    
    // MARK: - Event Handlers
    
    private func handleParticipantJoined(_ event: WebSocketEvent) {
        print("👋 Participant joined: \(event.data)")
        participantCount += 1
        
        if let name = event.data["name"] as? String {
            print("Welcome \(name)!")
        }
    }
    
    private func handleParticipantLeft(_ event: WebSocketEvent) {
        print("👋 Participant left: \(event.data)")
        participantCount = max(0, participantCount - 1)
        
        if let name = event.data["name"] as? String {
            print("Goodbye \(name)!")
        }
    }
    
    private func handleRecordingStarted(_ event: WebSocketEvent) {
        print("🔴 Recording started: \(event.data)")
        isRecording = true
        
        if let recordingId = event.data["recordingId"] as? String {
            print("Recording ID: \(recordingId)")
        }
    }
    
    private func handleRecordingStopped(_ event: WebSocketEvent) {
        print("⏹️ Recording stopped: \(event.data)")
        isRecording = false
    }
    
    private func handleTranscriptionUpdate(_ event: WebSocketEvent) {
        print("📝 Transcription update: \(event.data)")
        
        if let text = event.data["text"] as? String {
            lastTranscription = text
        }
    }
    
    private func handleDataUpdate(_ event: WebSocketEvent) {
        print("📊 Data update: \(event.data)")
        
        // Merge new data with existing data
        for (key, value) in event.data {
            customData[key] = value
        }
        
        print("Updated custom data: \(customData)")
    }
}

// MARK: - Preview

#Preview {
    EventDrivenViewExample()
        .frame(width: 300, height: 400)
}
