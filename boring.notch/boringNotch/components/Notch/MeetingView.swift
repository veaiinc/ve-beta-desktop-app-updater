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
import LucideIcons

// MARK: - Date Extension
extension Date {
    var iso8601String: String {
        let formatter = ISO8601DateFormatter()
        return formatter.string(from: self)
    }
}

// MARK: - Color Constants
extension Color {
    static let transcriptionAccent = Color(red: 0.33, green: 0.44, blue: 0.97)
}

// MARK: - Persistent Storage Keys
extension Defaults.Keys {
    static let meetingTranscriptions = Key<[Transcription]>("meetingTranscriptions", default: [])
    static let meetingLiveIntelligence = Key<[LiveIntelligence]>("meetingLiveIntelligence", default: [])
    static let isMeetingActive = Key<Bool>("isMeetingActive", default: false)
    static let currentMeetingId = Key<String?>("currentMeetingId", default: nil)
}

// MARK: - Transcription Data Model


// MARK: - Live Intelligence Data Model


struct MeetingView: View, WebSocketEventListener {
    @StateObject private var webSocketManager = WebSocketManager.shared
    @State private var meetingData: [String: Any] = [:]
    @State private var lastEventTime: Date = Date()
    @State private var eventHistory: [WebSocketEvent] = []
    @State private var transcriptions: [Transcription] = []
    @State private var liveIntelligenceData: [LiveIntelligence] = []
    @State private var meetingError: String? = nil
    
    // Webcam functionality
    @StateObject private var webcamManager = WebcamManager.shared
    @State private var isWebcamVisible: Bool = false
    @State private var isRequestingAuthorization: Bool = false
    
    // Persistent storage for transcriptions and live intelligence
    @Default(.meetingTranscriptions) private var storedTranscriptions: [Transcription]
    @Default(.meetingLiveIntelligence) private var storedLiveIntelligence: [LiveIntelligence]
    @Default(.isMeetingActive) private var isMeetingActive: Bool
    @Default(.currentMeetingId) private var currentMeetingId: String?
    
    // Coordinator for active meeting view
    @ObservedObject var coordinator = BoringViewCoordinator.shared
    
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
            
            // Load stored transcriptions and live intelligence if meeting is active
            if isMeetingActive {
                transcriptions = storedTranscriptions
                liveIntelligenceData = storedLiveIntelligence
                print("📝 Loaded \(storedTranscriptions.count) stored transcriptions")
                print("🧠 Loaded \(storedLiveIntelligence.count) stored live intelligence items")
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
        //        .aspectRatio(1, contentMode: .fill)
        .buttonStyle(.plain)
        .padding(0)
        .frame(width: 92, height: 92, alignment: .center)
        .background(.white.opacity(0.08))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(.white.opacity(0.1), lineWidth: 0.5)
            
        )
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
        VStack(alignment: .center, spacing: 8) {
            let webCamIcon = NSImage.image(lucideId: "webcam")
            let exclamationIcon = NSImage.image(lucideId: "triangle-alert")
            Image(
                nsImage: webcamManager.authorizationStatus == .denied ? exclamationIcon! : webCamIcon!
            ).renderingMode(.template)
                .frame(width: 20,height: 20)
                .foregroundColor(webcamManager.authorizationStatus == .denied ? .orange : .white)
            Text("WEBCAM")
                .font(Font.custom("General Sans Variable", size: 10)
                    .weight(.medium)
                )
                .foregroundColor(.white)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(.black.opacity(0.2))
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
            case .liveIntelligenceUpdate:
                handleLiveIntelligenceUpdate(event)
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
            case .meetingStartError:
                handleMeetingStartError(event)
            default:
                print("📨 Unhandled event type: \(event.type.rawValue)")
            }
        }
    }
    
    // MARK: - Event Handlers
    
    private func handleMeetingStarted(_ event: WebSocketEvent) {
        print("🎯 Meeting started with data: \(event.data)")
        
        // Call coordinator to set meeting state
        coordinator.meetingStart()
        
        // Update UI based on meeting start data
        if let meetingId = event.data["meetingId"] as? String {
            meetingData["meetingId"] = meetingId
            currentMeetingId = meetingId
        }
        
        // Set meeting as active
        isMeetingActive = true
        coordinator.isMeetingLoading = false
        
        // Load any existing transcriptions from storage
        transcriptions = storedTranscriptions
        print("📝 Meeting started - loaded \(storedTranscriptions.count) stored transcriptions")
    }
    
    private func handleMeetingStopped(_ event: WebSocketEvent) {
        print("🏁 Meeting stopped with data: \(event.data)")
        
        // Call coordinator to reset meeting state
        coordinator.meetingStopAndReset()
        
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
        
        // Call coordinator to pause meeting
        coordinator.meetingPause()
        
        // Handle meeting pause
        if let reason = event.data["reason"] as? String {
            meetingData["pauseReason"] = reason
        }
    }
    
    private func handleMeetingResumed(_ event: WebSocketEvent) {
        print("▶️ Meeting resumed with data: \(event.data)")
        
        // Call coordinator to resume meeting
        coordinator.meetingResume()
        
        // Handle meeting resume
        meetingData.removeValue(forKey: "pauseReason")
    }
    
    private func handleStartMeeting(_ event: WebSocketEvent) {
        print("🚀 Start meeting request with data: \(event.data)")
        // Handle start meeting request - loading state is now set in TabSelectionView
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
    
    private func handleMeetingStartError(_ event: WebSocketEvent) {
        meetingError = event.data["message"] as? String ?? "Unknown error"
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
    
    private func handleLiveIntelligenceUpdate(_ event: WebSocketEvent) {
        print("🧠 Live intelligence update received: \(event.data)")
        
        // Check if this is an array replacement or individual item
        if let liveIntelligenceArray = event.data["liveIntelligenceArray"] as? [[String: Any]] {
            // Handle array replacement
            print("🧠 Processing live intelligence array replacement with \(liveIntelligenceArray.count) items")
            
            let newLiveIntelligenceData = liveIntelligenceArray.compactMap { itemDict -> LiveIntelligence? in
                let id = itemDict["id"] as? String ?? "live_intelligence_\(Date().timeIntervalSince1970)"
                let text = itemDict["text"] as? String ?? itemDict["content"] as? String ?? itemDict["prompt"] as? String ?? ""
                let source = itemDict["source"] as? String ?? itemDict["sender"] as? String ?? "ai-agent"
                let timestamp = itemDict["timestamp"] as? String ?? itemDict["created_at"] as? String ?? Date().iso8601String
                let confidence = itemDict["confidence"] as? Double
                let type = itemDict["type"] as? String ?? "live-intelligence"
                
                // Handle metadata
                var metadata: [String: String]? = nil
                if let metadataDict = itemDict["metadata"] as? [String: Any] {
                    metadata = metadataDict.compactMapValues { value in
                        if let stringValue = value as? String {
                            return stringValue
                        } else if let numberValue = value as? NSNumber {
                            return numberValue.stringValue
                        }
                        return nil
                    }
                }
                
                return LiveIntelligence(
                    id: id,
                    text: text,
                    source: source,
                    timestamp: timestamp,
                    confidence: confidence,
                    type: type,
                    metadata: metadata
                )
            }
            
            DispatchQueue.main.async {
                // Replace the entire array
                self.liveIntelligenceData = newLiveIntelligenceData
                
                // Persist live intelligence to storage
                self.storedLiveIntelligence = self.liveIntelligenceData
                
                print("✅ Successfully replaced live intelligence array. Total count: \(self.liveIntelligenceData.count)")
            }
        } else if let liveIntelligenceDict = event.data as? [String: Any] {
            // Handle individual item (legacy support)
            print("🧠 Processing individual live intelligence data from Electron")
            
            // Create a unique ID if not provided
            let id = liveIntelligenceDict["id"] as? String ?? "live_intelligence_\(Date().timeIntervalSince1970)"
            let text = liveIntelligenceDict["text"] as? String ?? liveIntelligenceDict["content"] as? String ?? ""
            let source = liveIntelligenceDict["source"] as? String ?? liveIntelligenceDict["sender"] as? String ?? "ai-agent"
            let timestamp = liveIntelligenceDict["timestamp"] as? String ?? Date().iso8601String
            let confidence = liveIntelligenceDict["confidence"] as? Double
            let type = liveIntelligenceDict["type"] as? String ?? "live-intelligence"
            
            // Handle metadata
            var metadata: [String: String]? = nil
            if let metadataDict = liveIntelligenceDict["metadata"] as? [String: Any] {
                metadata = metadataDict.compactMapValues { value in
                    if let stringValue = value as? String {
                        return stringValue
                    } else if let numberValue = value as? NSNumber {
                        return numberValue.stringValue
                    }
                    return nil
                }
            }
            
            print("🧠 Processing live intelligence: '\(text.prefix(50))...' from \(source)")
            
            let liveIntelligence = LiveIntelligence(
                id: id,
                text: text,
                source: source,
                timestamp: timestamp,
                confidence: confidence,
                type: type,
                metadata: metadata
            )
            
            // Add to the live intelligence array
            DispatchQueue.main.async {
                self.liveIntelligenceData.append(liveIntelligence)
                
                // Persist live intelligence to storage
                self.storedLiveIntelligence = self.liveIntelligenceData
                
                print("✅ Successfully added live intelligence item. Total count: \(self.liveIntelligenceData.count)")
                print("🧠 Live intelligence: [\(liveIntelligence.sourceName)] \(liveIntelligence.text.prefix(30))...")
                
                // Auto-scroll is handled by onChange modifier
            }
        } else {
            print("⚠️ No live intelligence data found in event: \(event.data)")
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
    
    // MARK: - View Helper Methods
    
    @ViewBuilder
    private func transcriptionScrollContent(proxy: ScrollViewProxy) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            if meetingError != nil {
                Text(meetingError ?? "")
            } else {
                if coordinator.activeMeetingView == .transcription {
                    if transcriptions.isEmpty {
                        emptyStateView
                    } else {
                        transcriptionListView
                        bottomSpacer
                    }
                } else {
                    if liveIntelligenceData.isEmpty {
                        liveIntelligenceEmptyStateView
                    } else {
                        liveIntelligenceListView
                        bottomSpacer
                    }
                }
            }
            
        }
        .padding()
        // Simpler dependencies help the type checker
        .onChange(of: transcriptions.count) {
            if coordinator.activeMeetingView == .transcription {
                autoScrollToBottom(proxy: proxy)
            }
        }
        .onChange(of: transcriptions.last?.id) {
            if coordinator.activeMeetingView == .transcription {
                // Also scroll when the last transcription identity changes
                autoScrollToBottom(proxy: proxy)
            }
        }
        .onChange(of: liveIntelligenceData.count) {
            if coordinator.activeMeetingView == .liveIntelligence {
                autoScrollToBottom(proxy: proxy)
            }
        }
        .onChange(of: liveIntelligenceData.last?.id) {
            if coordinator.activeMeetingView == .liveIntelligence {
                // Also scroll when the last live intelligence identity changes
                autoScrollToBottom(proxy: proxy)
            }
        }
    }
    
    @ViewBuilder
    private var emptyStateView: some View {
        VStack(spacing: 8) {
            if coordinator.isMeetingLoading {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Starting meet with")
                        .font(Font.custom("General Sans Variable", size: 20))
                        .foregroundColor(.white)
                        .frame(width: 197, alignment: .leading)

                    Text("Live Intelligence")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(red: 0.33, green: 0.44, blue: 0.97))
                }
                .frame(width: 300, height: 70, alignment: .bottomLeading)
            } else {
                Text("Start talking I am listening")
                    .font(.system(size: 18))
                    .italic()
                    .foregroundColor(.white.opacity(0.5))
            }
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
    private var liveIntelligenceEmptyStateView: some View {
        VStack(spacing: 8) {
            Image(systemName: "brain.head.profile")
                .font(.largeTitle)
                .foregroundColor(.white.opacity(0.6))
            
            Text("No Live Intelligence Yet")
                .font(.headline)
                .foregroundColor(.white.opacity(0.8))
            
            Text("AI insights will appear here during your meeting")
                .font(.caption)
                .foregroundColor(.white.opacity(0.6))
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding()
        .id("live-intelligence-empty-state")
    }
    
    @ViewBuilder
    private var liveIntelligenceListView: some View {
        ForEach(liveIntelligenceData, id: \.id) { liveIntelligence in
            LiveIntelligenceItemView(liveIntelligence: liveIntelligence)
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
    
}




