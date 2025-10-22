import Foundation
import AppKit

// Parses AppleScript result: a list of NAMED records with 4-char keys
struct EmailParser {
    static func parseList(_ descriptor: NSAppleEventDescriptor?) -> [EmailItem] {
        guard let list = descriptor, list.descriptorType == typeAEList else {
            print("❌ Invalid descriptor or not a list")
            return []
        }
        
        var items: [EmailItem] = []
        let count = list.numberOfItems
        print("📊 Processing \(count) email items...")
        
        // Handle empty list case to prevent range error
        guard count > 0 else {
            print("📊 No email items to process")
            return []
        }
        
        for i in 1...count {
            guard let msgString = list.atIndex(i)?.stringValue else {
                print("⚠️ Item \(i): Not a string, skipping...")
                continue
            }
            
            // ✅ Handle both 6-part (old format) and 7-part (new format with profile pictures)
            let parts = msgString.split(separator: "|||", maxSplits: 6)
            guard parts.count >= 6 else {
                print("⚠️ Item \(i): Invalid format (expected at least 6 parts, got \(parts.count)), skipping...")
                continue
            }
            
            let idString = String(parts[0])
            let subject = String(parts[1])
            let senderName = String(parts[2])
            let senderAddress = String(parts[3])
            let dateString = String(parts[4])
            let isRead = String(parts[5]).lowercased() == "true"
            let profilePictureDataString = parts.count >= 7 ? String(parts[6]) : "" // ✅ Handle missing profile picture data
            
            guard !idString.isEmpty else {
                print("⚠️ Item \(i): Empty ID, skipping...")
                continue
            }
            
            var dateReceived = Date()
            if !dateString.isEmpty, let parsed = ISO8601DateFormatter().date(from: dateString) {
                dateReceived = parsed
            }
            
            // ✅ Parse profile picture data from AppleScript
            var profilePictureData: Data? = nil
            if !profilePictureDataString.isEmpty && profilePictureDataString != "" {
                // AppleScript returns image data as base64 or raw data
                // Try to parse as base64 first, then as raw data
                if let data = Data(base64Encoded: profilePictureDataString) {
                    profilePictureData = data
                } else if let data = profilePictureDataString.data(using: .utf8) {
                    profilePictureData = data
                }
            }
            
            let item = EmailItem(
                appleScriptID: idString,
                subject: subject,
                senderName: senderName,
                senderAddress: senderAddress.isEmpty ? nil : senderAddress,
                preview: nil,
                receivedDate: dateReceived,
                isRead: isRead,
                mailboxName: "Inbox",
                messageIDHeader: nil,
                profilePictureData: profilePictureData // ✅ Include profile picture data
            )
            items.append(item)
            print("✅ Parsed email \(i): ID='\(idString)' Subject='\(subject.prefix(50))' Address='\(senderAddress)'")
        }
        
        print("📈 Successfully parsed \(items.count) emails out of \(count) items")
        return items
    }
}

// MARK: - FourCharCode Helper (only accepts 4-char strings)
private extension String {
    func toFourCharCode() -> OSType {
        guard self.count == 4 else {
            print("❌ Invalid fourCharCode: '\(self)' - must be exactly 4 characters (got \(self.count))")
            return 0
        }
        
        var result: OSType = 0
        for char in self.prefix(4) {
            result = (result << 8) | OSType(char.asciiValue ?? 0)
        }
        return result
    }
}
