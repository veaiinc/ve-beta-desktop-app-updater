//
//  MeetingView.swift
//  boringNotch
//
//  Created by AI Assistant on $(date).
//

import SwiftUI
import Foundation

struct MeetingView: View {
    @StateObject private var webSocketManager = WebSocketManager.shared
    @State private var messageText = ""
    
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
                    .foregroundColor(webSocketManager.meetingStatus == "Meeting Started" ? .green : .primary)
                
                Spacer()
            }
            .padding(.horizontal, 16)
            
            // Messages List
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 8) {
                    ForEach(webSocketManager.messages) { message in
                        MessageBubble(message: message)
                    }
                }
                .padding(.horizontal, 16)
            }
            .frame(maxHeight: 200)
            
            // Input Area
            HStack(spacing: 8) {
                TextField("Type your message...", text: $messageText)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .onSubmit {
                        sendMessage()
                    }
                    .onTapGesture {
                        // Ensure window can receive focus when text field is tapped
                        DispatchQueue.main.async {
                            if let window = NSApplication.shared.windows.first(where: { $0 is BoringNotchWindow }) {
                                window.makeKeyAndOrderFront(nil)
                            }
                        }
                    }
                
                Button(action: sendMessage) {
                    Image(systemName: "paperplane.fill")
                        .foregroundColor(.white)
                        .frame(width: 32, height: 32)
                        .background(Color.blue)
                        .cornerRadius(16)
                }
                .disabled(messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || !webSocketManager.isConnected)
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 8)
        }
        .onAppear {
            // WebSocket auto-connection is now handled by WebSocketManager on startup
            // No need to manually connect here
        }
    }
    
    private func sendMessage() {
        let trimmedMessage = messageText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmedMessage.isEmpty else { return }
        
        webSocketManager.sendMessage(trimmedMessage)
        messageText = ""
    }
}

struct MessageBubble: View {
    let message: WebSocketMessage
    
    var body: some View {
        HStack {
            if message.type == .sent {
                Spacer()
            }
            
            VStack(alignment: message.type == .sent ? .trailing : .leading, spacing: 4) {
                Text(message.content)
                    .font(.system(size: 14))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(
                        message.type == .sent ? Color.blue : Color.gray.opacity(0.2)
                    )
                    .foregroundColor(message.type == .sent ? .white : .primary)
                    .cornerRadius(16)
                
                Text(formatTimestamp(message.timestamp))
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            
            if message.type == .received {
                Spacer()
            }
        }
    }
    
    private func formatTimestamp(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}
