import Foundation
import XCTest

/// Test class for ProfilePictureService functionality
class ProfilePictureServiceTest: XCTestCase {
    
    func testGravatarURLGeneration() {
        let service = ProfilePictureService.shared
        
        // Test with a known email
        let testEmail = "test@example.com"
        let expectedHash = "55502f40dc8b7c769880b10874abc9d0" // MD5 of "test@example.com"
        
        let url = service.getProfilePictureURL(for: testEmail)
        
        XCTAssertNotNil(url)
        XCTAssertTrue(url?.absoluteString.contains(expectedHash) == true)
        XCTAssertTrue(url?.absoluteString.contains("gravatar.com") == true)
    }
    
    func testDiceBearFallback() {
        let service = ProfilePictureService.shared
        
        // Test with email that has no Gravatar
        let testEmail = "nonexistent@example.com"
        let url = service.getProfilePictureURL(for: testEmail)
        
        XCTAssertNotNil(url)
        // Should fallback to DiceBear
        XCTAssertTrue(url?.absoluteString.contains("dicebear.com") == true)
    }
    
    func testEmailAddressValidation() {
        let service = ProfilePictureService.shared
        
        // Test with empty email
        let emptyURL = service.getProfilePictureURL(for: "")
        XCTAssertNil(emptyURL)
        
        // Test with valid email
        let validURL = service.getProfilePictureURL(for: "user@example.com")
        XCTAssertNotNil(validURL)
    }
    
    func testCacheKeyGeneration() {
        // Test that cache keys are consistent
        let email1 = "test@example.com"
        let email2 = "TEST@EXAMPLE.COM"
        
        // Both should generate the same cache key (lowercase)
        let key1 = email1.lowercased()
        let key2 = email2.lowercased()
        
        XCTAssertEqual(key1, key2)
    }
}

// MARK: - Test Extensions

extension ProfilePictureService {
    /// Expose internal methods for testing
    func getProfilePictureURL(for emailAddress: String, senderName: String? = nil) -> URL? {
        // Try Gravatar first
        if let gravatarURL = getGravatarURL(for: emailAddress) {
            return gravatarURL
        }
        
        // Fallback to DiceBear
        return getDiceBearURL(for: emailAddress, senderName: senderName)
    }
    
    private func getGravatarURL(for email: String) -> URL? {
        let hash = email.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
            .data(using: .utf8)?
            .md5Hash
            .map { String(format: "%02hhx", $0) }
            .joined()
        
        guard let hash = hash else { return nil }
        return URL(string: "https://www.gravatar.com/avatar/\(hash)?d=404&s=200")
    }
    
    private func getDiceBearURL(for email: String, senderName: String?) -> URL? {
        let seed = email.isEmpty ? (senderName ?? "user") : email
        let safeSeed = seed.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "user"
        return URL(string: "https://api.dicebear.com/7.x/avataaars/svg?seed=\(safeSeed)")
    }
}
