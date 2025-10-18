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
        
        for i in 1...count {
            guard let msgString = list.atIndex(i)?.stringValue else {
                print("⚠️ Item \(i): Not a string, skipping...")
                continue
            }
            
            let parts = msgString.split(separator: "|||", maxSplits: 4)
            guard parts.count == 5 else {
                print("⚠️ Item \(i): Invalid format, skipping...")
                continue
            }
            
            let idString = String(parts[0])
            let subject = String(parts[1])
            let sender = String(parts[2])
            let dateString = String(parts[3])
            let isRead = String(parts[4]).lowercased() == "true"
            
            guard !idString.isEmpty else {
                print("⚠️ Item \(i): Empty ID, skipping...")
                continue
            }
            
            var dateReceived = Date()
            if !dateString.isEmpty, let parsed = ISO8601DateFormatter().date(from: dateString) {
                dateReceived = parsed
            }
            
            let item = EmailItem(
                appleScriptID: idString,
                subject: subject,
                senderName: sender,
                senderAddress: nil,
                preview: nil,
                receivedDate: dateReceived,
                isRead: isRead,
                mailboxName: "Inbox",
                messageIDHeader: nil
            )
            items.append(item)
            print("✅ Parsed email \(i): ID='\(idString)' Subject='\(subject.prefix(50))'")
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
