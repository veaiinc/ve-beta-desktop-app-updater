//
//  WebSocketManager.swift
//  boringNotch
//
//  Created by AI Assistant on $(date).
//

import Foundation
import Combine
import SwiftUI

// MARK: - Event Types

enum WebSocketEventType: String, CaseIterable {
    // Meeting Control Events (from main.js)
    case startMeeting = "START_MEETING"
    case stopMeeting = "STOP_MEETING"
    case pauseMeeting = "PAUSE_MEETING"
    case resumeMeeting = "RESUME_MEETING"
    case navigateToMainScreen = "NAVIGATE_TO_MAIN_SCREEN"
    
    // Meeting Status Events (responses from main.js)
    case meetingStarted = "MEETING_STARTED"
    case meetingStopped = "MEETING_STOPPED"
    case meetingPaused = "MEETING_PAUSED"
    case meetingResumed = "MEETING_RESUMED"
    
    // Meeting Data Events
    case transcriptionUpdate = "TRANSCRIPTION_UPDATE"
    case liveIntelligenceUpdate = "LIVE_INTELLIGENCE_UPDATE"
    case participantJoined = "PARTICIPANT_JOINED"
    case participantLeft = "PARTICIPANT_LEFT"
    case screenShareStarted = "SCREEN_SHARE_STARTED"
    case screenShareEnded = "SCREEN_SHARE_ENDED"
    case recordingStarted = "RECORDING_STARTED"
    case recordingStopped = "RECORDING_STOPPED"
    
    // AI and Response Events
    case aiResponse = "AI_RESPONSE"
    case statusUpdate = "STATUS_UPDATE"
    case dataUpdate = "DATA_UPDATE"
    
    // Are You There Events (from main.js)
    case areYouThereShow = "ARE_YOU_THERE_SHOW"
    case areYouThereContinue = "ARE_YOU_THERE_CONTINUE"
    case areYouThereStop = "ARE_YOU_THERE_STOP"
    
    // Custom Events
    case custom = "CUSTOM"
    
    // Boring Notch Messages (from Electron)
    case boringNotchMessage = "BORING_NOTCH_MESSAGE"
}

// MARK: - Event Data Models

struct WebSocketEvent {
    let id: UUID
    let type: WebSocketEventType
    let data: [String: Any]
    let timestamp: Date
    let rawMessage: String
}

// MARK: - Event Listener Protocol

protocol WebSocketEventListener {
    func onWebSocketEvent(_ event: WebSocketEvent)
}

// MARK: - WebSocket Manager

class WebSocketManager: ObservableObject {
    static let shared = WebSocketManager()
    
    @Published var isConnected = false
    @Published var connectionStatus: String = "Disconnected"
    @Published var meetingStatus: String = "Ready"
    
    // Event system
    private var eventListeners: [ObjectIdentifier: WebSocketEventListener] = [:]
    var eventSubject = PassthroughSubject<WebSocketEvent, Never>()
    
    private var webSocketTask: URLSessionWebSocketTask?
    private var urlSession: URLSession?
    private var cancellables = Set<AnyCancellable>()
    
    private let serverURL = "ws://localhost:8080"
    
    private init() {
        setupURLSession()
        setupEventSystem()
    }
    
    private func setupURLSession() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 10
        config.timeoutIntervalForResource = 30
        urlSession = URLSession(configuration: config)
    }
    
    private func setupEventSystem() {
        // Subscribe to events for internal handling
        eventSubject
            .sink { [weak self] event in
                self?.handleInternalEvent(event)
            }
            .store(in: &cancellables)
    }
    
    // MARK: - Connection Management
    
    func connect() {
        guard let url = URL(string: serverURL) else {
            updateConnectionStatus("Invalid URL", isConnected: false)
            return
        }
        
        webSocketTask = urlSession?.webSocketTask(with: url)
        webSocketTask?.resume()
        
        updateConnectionStatus("Connecting...", isConnected: false)
        
        // Start listening for messages
        receiveMessage()
        
        // Send ping to test connection
        sendPing()
    }
    
    func disconnect() {
        webSocketTask?.cancel(with: .goingAway, reason: nil)
        webSocketTask = nil
        updateConnectionStatus("Disconnected", isConnected: false)
    }
    
    // MARK: - Event System
    
    func addEventListener(_ listener: WebSocketEventListener) {
        let identifier = ObjectIdentifier(listener as AnyObject)
        eventListeners[identifier] = listener
    }
    
    func removeEventListener(_ listener: WebSocketEventListener) {
        let identifier = ObjectIdentifier(listener as AnyObject)
        eventListeners.removeValue(forKey: identifier)
    }
    
    func sendEvent(type: WebSocketEventType, data: [String: Any] = [:]) {
        guard isConnected else {
            print("WebSocket not connected")
            return
        }
        
        let eventData: [String: Any] = [
            "type": type.rawValue,
            "data": data,
            "timestamp": Date().timeIntervalSince1970
        ]
        
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: eventData)
            let jsonString = String(data: jsonData, encoding: .utf8) ?? ""
            
            let message = URLSessionWebSocketTask.Message.string(jsonString)
            webSocketTask?.send(message) { [weak self] error in
                if let error = error {
                    print("Failed to send event: \(error)")
                    DispatchQueue.main.async {
                        self?.updateConnectionStatus("Send Error: \(error.localizedDescription)", isConnected: false)
                    }
                } else {
                    print("✅ Event sent: \(type.rawValue)")
                }
            }
        } catch {
            print("Failed to serialize event data: \(error)")
        }
    }
    
    // MARK: - Message Handling
    
    private func receiveMessage() {
        webSocketTask?.receive { [weak self] result in
            switch result {
            case .success(let message):
                self?.handleMessage(message)
                // Continue listening for more messages
                self?.receiveMessage()
            case .failure(let error):
                print("WebSocket receive error: \(error)")
                DispatchQueue.main.async {
                    self?.updateConnectionStatus("Receive Error: \(error.localizedDescription)", isConnected: false)
                }
            }
        }
    }
    
    private func handleMessage(_ message: URLSessionWebSocketTask.Message) {
        switch message {
        case .string(let text):
            DispatchQueue.main.async {
                self.processIncomingMessage(text)
            }
        case .data(let data):
            if let text = String(data: data, encoding: .utf8) {
                DispatchQueue.main.async {
                    self.processIncomingMessage(text)
                }
            }
        @unknown default:
            print("Unknown message type received")
        }
    }
    
    private func processIncomingMessage(_ text: String) {
        guard let data = text.data(using: .utf8),
              let jsonObject = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let typeString = jsonObject["type"] as? String,
              let eventType = WebSocketEventType(rawValue: typeString) else {
            print("⚠️ Failed to parse message: \(text)")
            return
        }
        
        // For BORING_NOTCH_MESSAGE, the data field contains a JSON string that needs to be parsed
        var eventData: [String: Any] = [:]
        if eventType == .boringNotchMessage {
            if let dataString = jsonObject["data"] as? String,
               let dataData = dataString.data(using: .utf8),
               let parsedData = try? JSONSerialization.jsonObject(with: dataData) as? [String: Any] {
                eventData = parsedData
            }
        } else {
            eventData = jsonObject["data"] as? [String: Any] ?? [:]
        }
        
        let event = WebSocketEvent(
            id: UUID(),
            type: eventType,
            data: eventData,
            timestamp: Date(),
            rawMessage: text
        )
        
        print("📨 Event received: \(eventType.rawValue)")
        
        // Emit event to all listeners
        eventSubject.send(event)
        
        // Notify all registered listeners
        for (_, listener) in eventListeners {
            listener.onWebSocketEvent(event)
        }
    }
    
    private func handleInternalEvent(_ event: WebSocketEvent) {
        switch event.type {
        case .meetingStarted:
            meetingStatus = "Meeting Started"
        case .meetingStopped:
            meetingStatus = "Meeting Stopped"
        case .meetingPaused:
            meetingStatus = "Meeting Paused"
        case .meetingResumed:
            meetingStatus = "Meeting Resumed"
        case .startMeeting:
            meetingStatus = "Starting Meeting..."
        case .stopMeeting:
            meetingStatus = "Stopping Meeting..."
        case .pauseMeeting:
            meetingStatus = "Pausing Meeting..."
        case .resumeMeeting:
            meetingStatus = "Resuming Meeting..."
        default:
            break
        }
    }
    
    // MARK: - Utility Methods
    
    private func sendPing() {
        webSocketTask?.sendPing { [weak self] error in
            if let error = error {
                print("Ping failed: \(error)")
                DispatchQueue.main.async {
                    self?.updateConnectionStatus("Connection Lost", isConnected: false)
                }
            } else {
                DispatchQueue.main.async {
                    self?.updateConnectionStatus("Connected", isConnected: true)
                }
            }
        }
    }
    
    private func updateConnectionStatus(_ status: String, isConnected: Bool) {
        self.connectionStatus = status
        self.isConnected = isConnected
    }
    
    func cleanup() {
        disconnect()
        eventListeners.removeAll()
        cancellables.removeAll()
    }
}
