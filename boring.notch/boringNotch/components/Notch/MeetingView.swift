//
//  MeetingView.swift
//  boringNotch
//
//  Created by AI Assistant on $(date).
//

import SwiftUI
import Foundation

// MARK: - Date Extension
extension Date {
    var iso8601String: String {
        let formatter = ISO8601DateFormatter()
        return formatter.string(from: self)
    }
}

// MARK: - Transcription Data Model
struct Transcription: Identifiable, Codable {
    let id: String
    let text: String
    let source: String
    let timestamp: String
    let confidence: Double?
    let words: [Word]?
    
    struct Word: Codable {
        let word: String
        let start: Double
        let end: Double
        let confidence: Double
    }
    
    // Computed property for formatted timestamp
    var formattedTime: String {
        // Parse timestamp and format as HH:mm
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        if let date = formatter.date(from: timestamp) {
            let timeFormatter = DateFormatter()
            timeFormatter.dateFormat = "HH:mm"
            return timeFormatter.string(from: date)
        }
        return "00:00"
    }
    
    // Computed property for speaker name
    var speakerName: String {
        return source == "mic" ? "YOU" : "SPEAKER"
    }
}

struct MeetingView: View, WebSocketEventListener {
    @StateObject private var webSocketManager = WebSocketManager.shared
    @State private var meetingData: [String: Any] = [:]
    @State private var lastEventTime: Date = Date()
    @State private var eventHistory: [WebSocketEvent] = []
    @State private var transcriptions: [Transcription] = []
    
    var body: some View {
        VStack(spacing: 12) {
            HStack(spacing: 0) {
                      // Scrollable list (takes remaining space)
                      ScrollView {
                          VStack(alignment: .leading, spacing: 10) {
                              if transcriptions.isEmpty {
                                  // Empty state
                                  VStack(spacing: 8) {
                                      Image(systemName: "mic.slash")
                                          .font(.system(size: 24))
                                          .foregroundColor(.gray)
                                      Text("No transcriptions yet")
                                          .font(Font.custom("General Sans Variable", size: 14))
                                          .foregroundColor(.gray)
                                  }
                                  .frame(maxWidth: .infinity, maxHeight: .infinity)
                                  .padding()
                              } else {
                                  ForEach(transcriptions) { transcription in
                                      VStack(alignment: .leading, spacing: 5) {
                                          HStack(spacing: 10) {
                                              Text(transcription.speakerName)
                                                  .font(
                                                      Font.custom("General Sans Variable", size: 10)
                                                          .weight(.semibold)
                                                  )
                                                  .foregroundColor(Color(red: 0.47, green: 0.93, blue: 0.79))
                                              Divider()
                                              HStack(spacing: 5) {
                                                  Image(systemName: "clock")
                                                      .font(.system(size: 10))
                                                      .foregroundColor(Color(red: 0.47, green: 0.93, blue: 0.79))
                                                  
                                                  Text(transcription.formattedTime)
                                                      .font(
                                                          Font.custom("General Sans Variable", size: 10)
                                                              .weight(.semibold)
                                                      )
                                                      .foregroundColor(Color(red: 0.47, green: 0.93, blue: 0.79))
                                              }
                                              
                                              Spacer()
                                          }
                                          .padding(0)
                                          
                                          Text(transcription.text)
                                              .font(
                                                  Font.custom("General Sans Variable", size: 14)
                                                      .weight(.medium)
                                              )
                                              .lineSpacing(5)
                                              .foregroundColor(.white)
                                              .frame(maxWidth: .infinity, alignment: .leading)
                                      }
                                      .frame(maxWidth: .infinity)
                                  }
                              }
                          }
                          .padding()
                      }
                      .frame(maxWidth: .infinity, maxHeight: .infinity)

                      // Square view (like a button with icon)
                      Button(action: {
                          print("Square tapped - Testing transcription flow")
                          testTranscriptionFlow()
                      }) {
                          VStack {
                              Image(systemName: "camera.fill")
                                  .font(.largeTitle)
                                  .foregroundColor(.white)
                                  .frame(maxWidth: .infinity, maxHeight: .infinity)
                          }
                          .frame(maxWidth: .infinity, maxHeight: .infinity)
                      }
                      .aspectRatio(1, contentMode: .fit)// keeps it square
                  }
                  .frame(maxWidth: .infinity, maxHeight: .infinity)
        }.frame(maxWidth: .infinity, maxHeight: .infinity)
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
        print("📝 Transcription update received: \(event.data)")
        
        // Handle transcription array replacement
        if let transcriptionsData = event.data["transcriptions"] as? [[String: Any]] {
            print("📝 Processing \(transcriptionsData.count) transcriptions from Electron")
            
            var newTranscriptions: [Transcription] = []
            
            for (index, transcriptionDict) in transcriptionsData.enumerated() {
                // Create a unique ID if not provided
                let id = transcriptionDict["id"] as? String ?? "transcription_\(index)"
                let text = transcriptionDict["text"] as? String ?? transcriptionDict["content"] as? String ?? ""
                let source = transcriptionDict["source"] as? String ?? transcriptionDict["sender"] as? String ?? "overlay"
                let timestamp = transcriptionDict["timestamp"] as? String ?? Date().iso8601String
                let confidence = transcriptionDict["confidence"] as? Double
                
                print("📝 Processing transcription \(index + 1): '\(text.prefix(50))...' from \(source)")
                
                // Handle words array if present
                var words: [Transcription.Word]? = nil
                if let wordsData = transcriptionDict["words"] as? [[String: Any]] {
                    words = wordsData.compactMap { wordDict in
                        guard let word = wordDict["word"] as? String,
                              let start = wordDict["start"] as? Double,
                              let end = wordDict["end"] as? Double,
                              let wordConfidence = wordDict["confidence"] as? Double else {
                            return nil
                        }
                        return Transcription.Word(word: word, start: start, end: end, confidence: wordConfidence)
                    }
                }
                
                let transcription = Transcription(
                    id: id,
                    text: text,
                    source: source,
                    timestamp: timestamp,
                    confidence: confidence,
                    words: words
                )
                
                newTranscriptions.append(transcription)
            }
            
            // Replace the entire transcriptions array
            DispatchQueue.main.async {
                self.transcriptions = newTranscriptions
                print("✅ Successfully updated BoringNotch transcriptions array with \(newTranscriptions.count) items")
                
                // Log first few transcriptions for debugging
                for (index, transcription) in newTranscriptions.prefix(3).enumerated() {
                    print("📝 Transcription \(index + 1): [\(transcription.speakerName)] \(transcription.text.prefix(30))...")
                }
            }
        } else if let text = event.data["text"] as? String {
            // Handle single transcription update (legacy support)
            meetingData["lastTranscription"] = text
            print("📝 Single transcription update (legacy): \(text)")
        } else {
            print("⚠️ No transcriptions data found in event: \(event.data)")
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
    
    // MARK: - Test Methods
    
    private func testTranscriptionFlow() {
        print("🧪 Testing transcription flow with sample data")
        
        // Create sample transcription data
        let sampleTranscriptions = [
            [
                "id": "test_1",
                "text": "Hello, this is a test transcription from the microphone.",
                "source": "mic",
                "timestamp": Date().iso8601String,
                "confidence": 0.95
            ],
            [
                "id": "test_2", 
                "text": "This is another test transcription from the screen capture.",
                "source": "screen",
                "timestamp": Date().iso8601String,
                "confidence": 0.88
            ],
            [
                "id": "test_3",
                "text": "And here's a third transcription to test the array replacement.",
                "source": "mic", 
                "timestamp": Date().iso8601String,
                "confidence": 0.92
            ]
        ]
        
        // Simulate receiving a transcription update event
        let testEvent = WebSocketEvent(
            id: UUID(),
            type: .transcriptionUpdate,
            data: ["transcriptions": sampleTranscriptions],
            timestamp: Date(),
            rawMessage: "test"
        )
        
        // Process the test event
        handleTranscriptionUpdate(testEvent)
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
