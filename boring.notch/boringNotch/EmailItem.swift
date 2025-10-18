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
}

// MARK: - Computed Properties
extension EmailItem {
    var displayPreview: String {
        if let preview = preview, !preview.isEmpty {
            return preview
        }
        return subject
    }
    
    var photoURL: URL? {
        let seed: String
        if let addr = senderAddress, !addr.isEmpty {
            seed = addr
        } else {
            seed = senderName.isEmpty ? "user" : senderName
        }
        
        let safeSeed = seed.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "user"
        return URL(string: "https://api.dicebear.com/7.x/avataaars/svg?seed=\(safeSeed)")
    }
}