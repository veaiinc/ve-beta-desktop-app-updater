import Foundation

struct EmailItem: Identifiable, Equatable {
    let id = UUID()
    let appleScriptID: String
    let subject: String
    let senderName: String
    let senderAddress: String?
    let preview: String?
    let receivedDate: Date
    let isRead: Bool
    let mailboxName: String
    let messageIDHeader: String?
    
    // NEW: Optional profile picture data parsed from AppleScript/Contacts
    let profilePictureData: Data?
}

// MARK: - Computed Properties
extension EmailItem {
    var displayPreview: String {
        if let preview = preview, !preview.isEmpty {
            return preview
        }
        return subject
    }
    
}
