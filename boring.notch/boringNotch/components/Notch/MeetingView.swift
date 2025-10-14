//
//  MeetingView.swift
//  boringNotch
//
//  Created by AI Assistant on $(date).
//

import SwiftUI
import Foundation
import Defaults
import AVFoundation

// MARK: - Date Extension
extension Date {
    var iso8601String: String {
        let formatter = ISO8601DateFormatter()
        return formatter.string(from: self)
    }
}

// MARK: - Color Constants
extension Color {
    static let transcriptionAccent = Color(red: 0.47, green: 0.93, blue: 0.79)
}

// MARK: - Persistent Storage Keys
extension Defaults.Keys {
    static let meetingTranscriptions = Key<[Transcription]>("meetingTranscriptions", default: [])
    static let isMeetingActive = Key<Bool>("isMeetingActive", default: false)
    static let currentMeetingId = Key<String?>("currentMeetingId", default: nil)
}

// MARK: - Transcription Data Model
struct Transcription: Identifiable, Codable, Defaults.Serializable, Equatable {
    let id: String
    let text: String
    let source: String
    let timestamp: String
    let confidence: Double?
    let words: [Word]?
    
    struct Word: Codable, Defaults.Serializable, Equatable {
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
    
    // Webcam functionality
    @StateObject private var webcamManager = WebcamManager.shared
    @State private var isWebcamVisible: Bool = false
    @State private var isRequestingAuthorization: Bool = false
    
    // Persistent storage for transcriptions
    @Default(.meetingTranscriptions) private var storedTranscriptions: [Transcription]
    @Default(.isMeetingActive) private var isMeetingActive: Bool
    @Default(.currentMeetingId) private var currentMeetingId: String?
    
    var body: some View {
        mainContent
    }
    
    @ViewBuilder
    private var mainContent: some View {
        VStack(spacing: 12) {
            contentRow
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .onAppear {
            // Register as event listener
            webSocketManager.addEventListener(self)
            
            // Load stored transcriptions if meeting is active
            if isMeetingActive {
                transcriptions = storedTranscriptions
                print("📝 Loaded \(storedTranscriptions.count) stored transcriptions")
            }
        }
        .onDisappear {
            // Unregister event listener
            webSocketManager.removeEventListener(self)
            
            // Stop webcam session when view disappears
            if webcamManager.isSessionRunning {
                webcamManager.stopSession()
                isWebcamVisible = false
            }
        }
    }
    
    @ViewBuilder
    private var contentRow: some View {
        HStack(spacing: 0) {
            transcriptionScrollArea
            webcamButton
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    @ViewBuilder
    private var transcriptionScrollArea: some View {
        ScrollViewReader { proxy in
            ScrollView {
                transcriptionScrollContent(proxy: proxy)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    @ViewBuilder
    private var webcamButton: some View {
        Button(action: {
            toggleWebcam()
        }) {
            webcamSquare
        }
        .aspectRatio(1, contentMode: .fit)
    }
    
    @ViewBuilder
    private var webcamSquare: some View {
        ZStack {
            // Show webcam feed when active
            if isWebcamVisible && webcamManager.isSessionRunning {
                if let previewLayer = webcamManager.previewLayer {
                    CameraPreviewLayerView(previewLayer: previewLayer)
                        .scaleEffect(x: -1, y: 1) // Mirror the camera
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }
            } else {
                // Show webcam icon when not active
                webcamIcon
            }
        }.padding(0)
    }
    
    @ViewBuilder
    private var webcamIcon: some View {
        VStack {
            Image(systemName: webcamManager.authorizationStatus == .denied ? "exclamationmark.triangle" : "web.camera")
                .font(.largeTitle)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
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
            currentMeetingId = meetingId
        }
        
        // Set meeting as active
        isMeetingActive = true
        
        // Load any existing transcriptions from storage
        transcriptions = storedTranscriptions
        print("📝 Meeting started - loaded \(storedTranscriptions.count) stored transcriptions")
    }
    
    private func handleMeetingStopped(_ event: WebSocketEvent) {
        print("🏁 Meeting stopped with data: \(event.data)")
        
        // Clear meeting data
        meetingData.removeAll()
        
        // Clear persistent storage
        storedTranscriptions = []
        isMeetingActive = false
        currentMeetingId = nil
        
        // Clear current transcriptions
        transcriptions = []
        
        print("📝 Meeting stopped - cleared all transcription data")
        
        // Navigate to home view (this will be handled by the coordinator)
        navigateToHome()
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
                
                // Persist transcriptions to storage
                self.storedTranscriptions = newTranscriptions
                
                print("✅ Successfully updated BoringNotch transcriptions array with \(newTranscriptions.count) items")
                
                // Log first few transcriptions for debugging
                for (index, transcription) in newTranscriptions.prefix(3).enumerated() {
                    print("📝 Transcription \(index + 1): [\(transcription.speakerName)] \(transcription.text.prefix(30))...")
                }
                
                // Auto-scroll is now handled by onChange modifier
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
        if event.data["name"] != nil {
            // Add to participant list logic here
        }
    }
    
    private func handleParticipantLeft(_ event: WebSocketEvent) {
        print("👋 Participant left: \(event.data)")
        // Update participant list
        if event.data["name"] != nil {
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
        
        // Create sample transcription data with long text to test auto-scroll
        let sampleTranscriptions = [
            [
                "id": "test_1",
                "text": "Hello, this is a test transcription from the microphone. This is a longer text to test the auto-scrolling functionality when text content changes.",
                "source": "mic",
                "timestamp": Date().iso8601String,
                "confidence": 0.95
            ],
            [
                "id": "test_2",
                "text": "This is another test transcription from the screen capture. This text is also quite long to demonstrate how the auto-scroll works when the transcription content gets updated with more text.",
                "source": "screen",
                "timestamp": Date().iso8601String,
                "confidence": 0.88
            ],
            [
                "id": "test_3",
                "text": "And here's a third transcription to test the array replacement. This is a very long transcription that should trigger auto-scroll when it gets updated with additional content, demonstrating the improved auto-scrolling behavior for long texts.",
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
        
        // Simulate a text update after 2 seconds to test auto-scroll on content change
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            print("🧪 Simulating text update for auto-scroll test")
            var updatedTranscriptions = sampleTranscriptions
            updatedTranscriptions[2]["text"] = "And here's a third transcription to test the array replacement. This is a very long transcription that should trigger auto-scroll when it gets updated with additional content, demonstrating the improved auto-scrolling behavior for long texts. This is additional text that was added to test the auto-scroll functionality when the content of an existing transcription changes."
            
            let updateEvent = WebSocketEvent(
                id: UUID(),
                type: .transcriptionUpdate,
                data: ["transcriptions": updatedTranscriptions],
                timestamp: Date(),
                rawMessage: "test_update"
            )
            
            self.handleTranscriptionUpdate(updateEvent)
        }
    }
    
    // MARK: - View Helper Methods
    
    @ViewBuilder
    private func transcriptionScrollContent(proxy: ScrollViewProxy) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            if transcriptions.isEmpty {
                emptyStateView
            } else {
                transcriptionListView
                bottomSpacer
            }
        }
        .padding()
        // Simpler dependencies help the type checker
        .onChange(of: transcriptions.count) {
            autoScrollToBottom(proxy: proxy)
        }
        .onChange(of: transcriptions.last?.id) {
            // Also scroll when the last transcription identity changes
            autoScrollToBottom(proxy: proxy)
        }
    }
    
    @ViewBuilder
    private var emptyStateView: some View {
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
        .id("empty-state")
    }
    
    @ViewBuilder
    private var transcriptionListView: some View {
        ForEach(transcriptions, id: \.id) { transcription in
            TranscriptionItemView(transcription: transcription)
        }
    }
    
    @ViewBuilder
    private var bottomSpacer: some View {
        Color.clear
            .frame(height: 1)
            .id("bottom")
    }
    
    private func autoScrollToBottom(proxy: ScrollViewProxy) {
        print("📜 Auto-scrolling to bottom - transcriptions count: \(transcriptions.count)")
        
        // Use a shorter delay for more responsive scrolling
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
            withAnimation(.easeInOut(duration: 0.2)) {
                proxy.scrollTo("bottom", anchor: UnitPoint.bottom)
                print("📜 Scrolled to bottom")
            }
        }
    }
    
    // MARK: - Webcam Methods
    
    private func toggleWebcam() {
        if isRequestingAuthorization {
            return
        }

        switch webcamManager.authorizationStatus {
        case .authorized:
            if webcamManager.isSessionRunning {
                webcamManager.stopSession()
                isWebcamVisible = false
            } else if webcamManager.cameraAvailable {
                webcamManager.startSession()
                isWebcamVisible = true
            }

        case .denied, .restricted:
            DispatchQueue.main.async {
                NSApp.setActivationPolicy(.regular)
                NSApp.activate(ignoringOtherApps: true)

                let alert = NSAlert()
                alert.messageText = "Camera Access Required"
                alert.informativeText = "Please allow camera access in System Settings."
                alert.addButton(withTitle: "Open Settings")
                alert.addButton(withTitle: "Cancel")

                if alert.runModal() == .alertFirstButtonReturn {
                    if let url = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Camera") {
                        NSWorkspace.shared.open(url)
                    }
                }

                NSApp.setActivationPolicy(.accessory)
                NSApp.deactivate()
            }

        case .notDetermined:
            isRequestingAuthorization = true
            webcamManager.checkAndRequestVideoAuthorization()
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                self.isRequestingAuthorization = false
            }

        default:
            break
        }
    }
    
    // MARK: - Helper Methods
    
    private func navigateToHome() {
        // This will be handled by the BoringViewCoordinator
        // We'll emit an event or use a notification to trigger navigation
        print("🏠 Navigating to home view after meeting stopped")
        
        // Post notification to coordinator
        NotificationCenter.default.post(
            name: NSNotification.Name("MeetingStoppedNavigateHome"),
            object: nil
        )
    }
    
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

struct TranscriptionItemView: View {
    let transcription: Transcription
    
    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            header
            textBody
        }
        .frame(maxWidth: .infinity)
        .id(transcription.id)
    }
    
    @ViewBuilder
    private var header: some View {
        HStack(spacing: 10) {
            Text(transcription.speakerName)
                .font(Font.custom("General Sans Variable", size: 10).weight(.semibold))
                .foregroundColor(.transcriptionAccent)
            
            Divider()
            
            HStack(spacing: 5) {
                Image(systemName: "clock")
                    .font(.system(size: 10))
                    .foregroundColor(.transcriptionAccent)
                
                Text(transcription.formattedTime)
                    .font(Font.custom("General Sans Variable", size: 10).weight(.semibold))
                    .foregroundColor(.transcriptionAccent)
            }
            
            Spacer()
        }
        .padding(0)
    }
    
    @ViewBuilder
    private var textBody: some View {
        Text(transcription.text)
            .font(Font.custom("General Sans Variable", size: 14).weight(.medium))
            .lineSpacing(5)
            .foregroundColor(.white)
            .frame(maxWidth: .infinity, alignment: .leading)
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
