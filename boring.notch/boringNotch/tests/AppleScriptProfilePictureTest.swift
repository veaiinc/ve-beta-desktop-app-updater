import Foundation
import XCTest

/// Test class for AppleScript profile picture integration
class AppleScriptProfilePictureTest: XCTestCase {
    
    func testEmailParsingWithProfilePictures() {
        // Test the 6-part format (current issue)
        let sixPartString = "msg_1|||Test Subject|||John Doe|||john@example.com|||2024-01-01T00:00:00Z|||true"
        let parts = sixPartString.split(separator: "|||", maxSplits: 6)
        
        XCTAssertEqual(parts.count, 6)
        XCTAssertEqual(String(parts[0]), "msg_1")
        XCTAssertEqual(String(parts[1]), "Test Subject")
        XCTAssertEqual(String(parts[2]), "John Doe")
        XCTAssertEqual(String(parts[3]), "john@example.com")
        XCTAssertEqual(String(parts[4]), "2024-01-01T00:00:00Z")
        XCTAssertEqual(String(parts[5]), "true")
    }
    
    func testEmailParsingWithProfilePictures7Parts() {
        // Test the 7-part format (with profile pictures)
        let sevenPartString = "msg_1|||Test Subject|||John Doe|||john@example.com|||2024-01-01T00:00:00Z|||true|||profileData"
        let parts = sevenPartString.split(separator: "|||", maxSplits: 6)
        
        XCTAssertEqual(parts.count, 7)
        XCTAssertEqual(String(parts[0]), "msg_1")
        XCTAssertEqual(String(parts[1]), "Test Subject")
        XCTAssertEqual(String(parts[2]), "John Doe")
        XCTAssertEqual(String(parts[3]), "john@example.com")
        XCTAssertEqual(String(parts[4]), "2024-01-01T00:00:00Z")
        XCTAssertEqual(String(parts[5]), "true")
        XCTAssertEqual(String(parts[6]), "profileData")
    }
    
    func testProfilePictureDataParsing() {
        // Test profile picture data parsing
        let profilePictureDataString = "base64ImageData"
        let profilePictureData = profilePictureDataString.isEmpty ? nil : profilePictureDataString.data(using: .utf8)
        
        XCTAssertNotNil(profilePictureData)
        XCTAssertEqual(profilePictureData?.count, 15) // "base64ImageData".count
    }
    
    func testEmptyProfilePictureData() {
        // Test empty profile picture data
        let emptyProfilePictureDataString = ""
        let profilePictureData = emptyProfilePictureDataString.isEmpty ? nil : emptyProfilePictureDataString.data(using: .utf8)
        
        XCTAssertNil(profilePictureData)
    }
    
    func testEmailItemWithProfilePicture() {
        // Test EmailItem creation with profile picture data
        let profilePictureData = "testImageData".data(using: .utf8)
        
        let emailItem = EmailItem(
            appleScriptID: "msg_1",
            subject: "Test Subject",
            senderName: "John Doe",
            senderAddress: "john@example.com",
            preview: nil,
            receivedDate: Date(),
            isRead: true,
            mailboxName: "Inbox",
            messageIDHeader: nil,
            profilePictureData: profilePictureData
        )
        
        XCTAssertNotNil(emailItem.profilePictureData)
        XCTAssertEqual(emailItem.profilePictureData, profilePictureData)
    }
    
    func testEmailItemWithoutProfilePicture() {
        // Test EmailItem creation without profile picture data
        let emailItem = EmailItem(
            appleScriptID: "msg_1",
            subject: "Test Subject",
            senderName: "John Doe",
            senderAddress: "john@example.com",
            preview: nil,
            receivedDate: Date(),
            isRead: true,
            mailboxName: "Inbox",
            messageIDHeader: nil,
            profilePictureData: nil
        )
        
        XCTAssertNil(emailItem.profilePictureData)
    }
}

// MARK: - Mock AppleScript Helper for Testing

class MockAppleScriptHelper {
    static func execute(_ script: String) throws -> NSAppleEventDescriptor? {
        // Mock implementation for testing
        if script.contains("tell application \"Contacts\"") {
            // Simulate Contacts app response
            let mockDescriptor = NSAppleEventDescriptor()
            mockDescriptor.setDescriptorType(typeData)
            mockDescriptor.setData("mockImageData".data(using: .utf8))
            return mockDescriptor
        }
        
        // Mock Mail app response
        let mockDescriptor = NSAppleEventDescriptor()
        mockDescriptor.setDescriptorType(typeAEList)
        
        // Add mock email data
        let emailDescriptor = NSAppleEventDescriptor()
        emailDescriptor.setDescriptorType(typeText)
        emailDescriptor.setString("msg_1|||Test Subject|||John Doe|||john@example.com|||2024-01-01T00:00:00Z|||true")
        
        mockDescriptor.insert(emailDescriptor, at: 1)
        
        return mockDescriptor
    }
}
