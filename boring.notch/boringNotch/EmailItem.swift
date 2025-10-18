import Foundation

struct EmailItem: Identifiable, Equatable {
    let id = UUID()
    let appleScriptID: String          // ✅ Must be String
    let subject: String
    let senderName: String
    let senderAddress: String?
    let preview: String?
    let receivedDate: Date
    let isRead: Bool
    let mailboxName: String
    let messageIDHeader: String?
}

extension EmailItem {
    var displaySender: String {
        if !senderName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            return senderName
        }
        return senderAddress ?? "Unknown Sender"
    }
    
    var displayPreview: String {
        if let preview, !preview.isEmpty {
            return preview
        }
        return subject.isEmpty ? "No subject" : subject
    }
}

