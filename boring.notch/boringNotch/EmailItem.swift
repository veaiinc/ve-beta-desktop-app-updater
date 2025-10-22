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
    
    /// Get profile picture URL with multiple fallback sources
    var photoURL: URL? {
        guard let address = senderAddress, !address.isEmpty else {
            // Fallback to DiceBear if no email address
            return getDiceBearURL()
        }
        
        // Use ProfilePictureService for real profile pictures
        return ProfilePictureService.shared.getProfilePictureURL(for: address, senderName: senderName)
    }
    
    /// Legacy method for backward compatibility
    var legacyPhotoURL: URL? {
        return getDiceBearURL()
    }
    
    /// Get DiceBear avatar URL as fallback
    private func getDiceBearURL() -> URL? {
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
