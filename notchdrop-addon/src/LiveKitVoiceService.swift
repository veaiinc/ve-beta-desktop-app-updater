import Foundation
import Combine
import LiveKit
import AVFoundation

// MARK: - LiveKit Voice Assistant Service
@objc public class LiveKitVoiceService: NSObject, ObservableObject {
    
    // MARK: - Properties
    private var room: Room?
    private var audioTrack: LocalAudioTrack?
    private var cancellables = Set<AnyCancellable>()
    
    // Published properties for UI binding
    @Published var connectionState: ConnectionState = .disconnected
    @Published var isConnecting: Bool = false
    @Published var isMuted: Bool = false
    @Published var conversationMessages: [VoiceMessage] = []
    @Published var currentSpeaker: String = ""
    @Published var audioLevel: Float = 0.0
    
    // Configuration
    private var liveKitURL: String = ""
    private var accessToken: String = ""
    private var participantName: String = "User"
    
    // Callbacks for NotchDrop integration
    private var onConnectionStateChanged: ((ConnectionState) -> Void)?
    private var onMessageReceived: ((VoiceMessage) -> Void)?
    private var onAudioLevelChanged: ((Float) -> Void)?
    
    // MARK: - Voice Message Structure
    struct VoiceMessage {
        let id: String
        let sender: String
        let content: String
        let timestamp: Date
        let isFromAgent: Bool
        
        init(sender: String, content: String, isFromAgent: Bool = false) {
            self.id = UUID().uuidString
            self.sender = sender
            self.content = content
            self.timestamp = Date()
            self.isFromAgent = isFromAgent
        }
    }
    
    // MARK: - Connection States
    enum ConnectionState: String, CaseIterable {
        case disconnected = "disconnected"
        case connecting = "connecting"
        case connected = "connected"
        case error = "error"
        
        var displayName: String {
            switch self {
            case .disconnected: return "Disconnected"
            case .connecting: return "Connecting..."
            case .connected: return "Connected"
            case .error: return "Error"
            }
        }
    }
    
    // MARK: - Initialization
    override init() {
        super.init()
        setupAudioSession()
    }
    
    // MARK: - Public API
    
    /// Configure LiveKit connection parameters
    @objc public func configure(url: String, token: String, participantName: String = "User") {
        // Use VE.AI LiveKit server URL
        self.liveKitURL = url.isEmpty ? "wss://ve-ai-voice-agent-ginreaey.livekit.cloud" : url
        self.accessToken = token
        self.participantName = participantName
        
        print("🎤 LiveKit Voice Service configured with URL: \(self.liveKitURL)")
    }
    
    /// Connect to LiveKit room and start voice conversation
    @objc public func connect() async throws {
        guard !liveKitURL.isEmpty && !accessToken.isEmpty else {
            throw LiveKitError.invalidConfiguration("URL and token are required")
        }
        
        await MainActor.run {
            isConnecting = true
            connectionState = .connecting
        }
        
        do {
            // Create room
            let room = Room()
            self.room = room
            
            // Set up room delegates
            setupRoomDelegates()
            
            // Connect to room - LiveKit SDK will automatically add /rtc path and query parameters
            print("🔗 Connecting to LiveKit URL: \(liveKitURL)")
            print("🎫 Using access token: \(String(accessToken.prefix(20)))...")
            try await room.connect(url: liveKitURL, token: accessToken)
            
            // Enable audio
            try await enableAudio()
            
            await MainActor.run {
                isConnecting = false
                connectionState = .connected
                print("✅ Connected to LiveKit room successfully")
            }
            
            // Notify delegate
            onConnectionStateChanged?(.connected)
            
        } catch {
            await MainActor.run {
                isConnecting = false
                connectionState = .error
            }
            onConnectionStateChanged?(.error)
            print("❌ Failed to connect to LiveKit: \(error)")
            throw error
        }
    }
    
    /// Disconnect from LiveKit room
    @objc public func disconnect() async {
        guard let room = self.room else { return }
        
        // Clean up audio track
        if let audioTrack = audioTrack {
            try? await room.localParticipant.unpublish(publication: audioTrack)
            self.audioTrack = nil
        }
        
        // Disconnect room
        await room.disconnect()
        self.room = nil
        
        await MainActor.run {
            connectionState = .disconnected
            isConnecting = false
            conversationMessages.removeAll()
            currentSpeaker = ""
            audioLevel = 0.0
        }
        
        onConnectionStateChanged?(.disconnected)
        print("🔌 Disconnected from LiveKit room")
    }
    
    /// Toggle microphone mute state
    @objc public func toggleMute() async {
        guard let audioTrack = audioTrack else { return }
        
        let newMutedState = !audioTrack.isMuted
        await audioTrack.set(muted: newMutedState)
        
        await MainActor.run {
            isMuted = newMutedState
        }
        
        print("🎤 Microphone \(newMutedState ? "muted" : "unmuted")")
    }
    
    /// Send a text message to the agent (for debugging/testing)
    @objc public func sendMessage(_ message: String) {
        guard let room = room, room.connectionState == .connected else {
            print("❌ Cannot send message: not connected to room")
            return
        }
        
        // Create user message
        let userMessage = VoiceMessage(sender: participantName, content: message, isFromAgent: false)
        
        DispatchQueue.main.async {
            self.conversationMessages.append(userMessage)
        }
        
        // Send data message to agent
        let messageData = [
            "type": "chat",
            "message": message,
            "timestamp": ISO8601DateFormatter().string(from: Date())
        ]
        
        if let jsonData = try? JSONSerialization.data(withJSONObject: messageData, options: []) {
            room.localParticipant.publishData(data: jsonData, reliability: .reliable)
        }
        
        onMessageReceived?(userMessage)
        print("💬 Sent message: \(message)")
    }
    
    // MARK: - Callback Registration
    
    @objc public func setConnectionStateCallback(_ callback: @escaping (String) -> Void) {
        onConnectionStateChanged = { state in
            callback(state.rawValue)
        }
    }
    
    @objc public func setMessageReceivedCallback(_ callback: @escaping ([String: String]) -> Void) {
        onMessageReceived = { message in
            callback([
                "id": message.id,
                "sender": message.sender,
                "content": message.content,
                "timestamp": ISO8601DateFormatter().string(from: message.timestamp),
                "isFromAgent": message.isFromAgent ? "true" : "false"
            ])
        }
    }
    
    @objc public func setAudioLevelCallback(_ callback: @escaping (Float) -> Void) {
        onAudioLevelChanged = callback
    }
    
    // MARK: - Private Methods
    
    private func setupAudioSession() {
        do {
            let audioSession = AVAudioSession.sharedInstance()
            try audioSession.setCategory(.playAndRecord, mode: .voiceChat, options: [.allowBluetooth, .defaultToSpeaker])
            try audioSession.setActive(true)
            print("🔊 Audio session configured for voice chat")
        } catch {
            print("❌ Failed to configure audio session: \(error)")
        }
    }
    
    private func setupRoomDelegates() {
        guard let room = room else { return }
        
        // Monitor connection state changes
        room.$connectionState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                switch state {
                case .connected:
                    self?.connectionState = .connected
                case .connecting, .reconnecting:
                    self?.connectionState = .connecting
                case .disconnected:
                    self?.connectionState = .disconnected
                default:
                    break
                }
            }
            .store(in: &cancellables)
        
        // Monitor participants
        room.participants.values.forEach { participant in
            setupParticipantDelegates(participant)
        }
    }
    
    private func setupParticipantDelegates(_ participant: Participant) {
        // Monitor participant audio tracks
        participant.audioTrackPublications.values.forEach { publication in
            if let track = publication.track as? RemoteAudioTrack {
                // Monitor audio levels
                track.$audioLevel
                    .receive(on: DispatchQueue.main)
                    .sink { [weak self] level in
                        self?.audioLevel = level
                        self?.onAudioLevelChanged?(level)
                    }
                    .store(in: &cancellables)
            }
        }
        
        // Monitor data messages from agent
        if let remoteParticipant = participant as? RemoteParticipant {
            remoteParticipant.dataReceivedPublisher
                .receive(on: DispatchQueue.main)
                .sink { [weak self] data in
                    self?.handleDataMessage(data.data, from: participant)
                }
                .store(in: &cancellables)
        }
    }
    
    private func handleDataMessage(_ data: Data, from participant: Participant) {
        guard let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
              let type = json["type"] as? String,
              type == "chat",
              let messageContent = json["message"] as? String else {
            return
        }
        
        // Create agent message
        let agentMessage = VoiceMessage(
            sender: participant.name ?? "Agent",
            content: messageContent,
            isFromAgent: true
        )
        
        conversationMessages.append(agentMessage)
        currentSpeaker = participant.name ?? "Agent"
        
        onMessageReceived?(agentMessage)
        print("🤖 Received agent message: \(messageContent)")
    }
    
    private func enableAudio() async throws {
        guard let room = room else { return }
        
        // Create audio track
        let audioTrack = LocalAudioTrack.createTrack()
        self.audioTrack = audioTrack
        
        // Publish audio track
        try await room.localParticipant.publish(audioTrack: audioTrack)
        
        print("🎤 Audio track enabled and published")
    }
    
    // MARK: - Cleanup
    deinit {
        Task {
            await disconnect()
        }
        cancellables.removeAll()
    }
}

// MARK: - LiveKit Error Types
enum LiveKitError: Error, LocalizedError {
    case invalidConfiguration(String)
    case connectionFailed(String)
    case audioSetupFailed(String)
    
    var errorDescription: String? {
        switch self {
        case .invalidConfiguration(let message):
            return "Configuration Error: \(message)"
        case .connectionFailed(let message):
            return "Connection Error: \(message)"
        case .audioSetupFailed(let message):
            return "Audio Setup Error: \(message)"
        }
    }
}
