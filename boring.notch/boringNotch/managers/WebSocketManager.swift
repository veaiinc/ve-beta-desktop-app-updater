//
//  WebSocketManager.swift
//  boringNotch
//
//  Created by AI Assistant on $(date).
//

import Foundation
import Combine
import SwiftUI

// MARK: - WebSocket Manager

class WebSocketManager: ObservableObject {
    static let shared = WebSocketManager()
    
    @Published var isConnected = false
    @Published var connectionStatus: String = "Disconnected"
    @Published var lastMessage: String = ""
    @Published var messages: [WebSocketMessage] = []
    @Published var meetingStatus: String = "Ready"
    
    private var webSocketTask: URLSessionWebSocketTask?
    private var urlSession: URLSession?
    private var cancellables = Set<AnyCancellable>()
    
    private let serverURL = "ws://localhost:8080"
    
    private init() {
        setupURLSession()
    }
    
    private func setupURLSession() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 10
        config.timeoutIntervalForResource = 30
        urlSession = URLSession(configuration: config)
    }
    
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
    
    func sendMessage(_ message: String) {
        guard isConnected else {
            print("WebSocket not connected")
            return
        }
        
        let messageData = WebSocketMessage(
            id: UUID(),
            content: message,
            timestamp: Date(),
            type: .sent
        )
        
        messages.append(messageData)
        
        let message = URLSessionWebSocketTask.Message.string(message)
        webSocketTask?.send(message) { [weak self] error in
            if let error = error {
                print("Failed to send message: \(error)")
                DispatchQueue.main.async {
                    self?.updateConnectionStatus("Send Error: \(error.localizedDescription)", isConnected: false)
                }
            }
        }
    }
    
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
                // Try to parse as JSON to handle structured messages
                if let data = text.data(using: .utf8),
                   let jsonObject = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                   let messageType = jsonObject["type"] as? String {
                    
                    // Handle MEETING_STARTED message
                    if messageType == "MEETING_STARTED" {
                        print("🎯 MEETING_STARTED message received from Electron")
                        self.meetingStatus = "Meeting Started"
                    }
                }
                
                let receivedMessage = WebSocketMessage(
                    id: UUID(),
                    content: text,
                    timestamp: Date(),
                    type: .received
                )
                self.messages.append(receivedMessage)
                self.lastMessage = text
            }
        case .data(let data):
            if let text = String(data: data, encoding: .utf8) {
                DispatchQueue.main.async {
                    // Try to parse as JSON to handle structured messages
                    if let jsonData = text.data(using: .utf8),
                       let jsonObject = try? JSONSerialization.jsonObject(with: jsonData) as? [String: Any],
                       let messageType = jsonObject["type"] as? String {
                        
                        // Handle MEETING_STARTED message
                        if messageType == "MEETING_STARTED" {
                            print("🎯 MEETING_STARTED message received from Electron")
                            self.meetingStatus = "Meeting Started"
                        }
                    }
                    
                    let receivedMessage = WebSocketMessage(
                        id: UUID(),
                        content: text,
                        timestamp: Date(),
                        type: .received
                    )
                    self.messages.append(receivedMessage)
                    self.lastMessage = text
                }
            }
        @unknown default:
            print("Unknown message type received")
        }
    }
    
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
    
    func clearMessages() {
        messages.removeAll()
        lastMessage = ""
    }
    
    func cleanup() {
        disconnect()
    }
}

// MARK: - WebSocket Message Model

struct WebSocketMessage: Identifiable {
    let id: UUID
    let content: String
    let timestamp: Date
    let type: MessageType
    
    enum MessageType {
        case sent
        case received
    }
}
