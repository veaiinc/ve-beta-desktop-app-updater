import Foundation
import AppKit
import CryptoKit

/// Service for fetching profile pictures from multiple sources with caching
@MainActor
final class ProfilePictureService: ObservableObject {
    static let shared = ProfilePictureService()
    
    private let cache = NSCache<NSString, NSData>()
    private let fileManager = FileManager.default
    private let cacheDirectory: URL
    
    private init() {
        // Setup cache directory
        let documentsPath = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first!
        cacheDirectory = documentsPath.appendingPathComponent("ProfilePictures")
        
        // Create cache directory if it doesn't exist
        try? fileManager.createDirectory(at: cacheDirectory, withIntermediateDirectories: true)
        
        // Configure memory cache
        cache.countLimit = 100
        cache.totalCostLimit = 50 * 1024 * 1024 // 50MB
    }
    
    /// Get profile picture for an email address with multiple fallback sources
    func getProfilePicture(for emailAddress: String, senderName: String? = nil) async -> Data? {
        let cacheKey = emailAddress.lowercased()
        
        // Check memory cache first
        if let cachedData = cache.object(forKey: cacheKey as NSString) {
            print("📸 [PROFILE] Using cached image for \(emailAddress)")
            return cachedData as Data
        }
        
        // Check disk cache
        if let diskData = getCachedImageFromDisk(for: cacheKey) {
            print("📸 [PROFILE] Using disk cached image for \(emailAddress)")
            cache.setObject(diskData as NSData, forKey: cacheKey as NSString)
            return diskData
        }
        
        // Try multiple sources in order of preference
        let sources: [ProfilePictureSource] = [
            .contacts(emailAddress),
            .gravatar(emailAddress),
            .dicebear(emailAddress, senderName)
        ]
        
        for source in sources {
            if let data = await fetchFromSource(source) {
                print("📸 [PROFILE] Found image from \(source.description) for \(emailAddress)")
                
                // Cache the result
                cache.setObject(data as NSData, forKey: cacheKey as NSString)
                saveImageToDisk(data, for: cacheKey)
                
                return data
            }
        }
        
        print("📸 [PROFILE] No profile picture found for \(emailAddress)")
        return nil
    }
    
    /// Get profile picture URL for AsyncImage (for SwiftUI)
    func getProfilePictureURL(for emailAddress: String, senderName: String? = nil) -> URL? {
        // For Gravatar and DiceBear, we can return URLs directly
        // For Contacts, we need to fetch the data first
        
        // Try Gravatar first (fastest)
        if let gravatarURL = getGravatarURL(for: emailAddress) {
            return gravatarURL
        }
        
        // Fallback to DiceBear
        return getDiceBearURL(for: emailAddress, senderName: senderName)
    }
    
    // MARK: - Private Methods
    
    private func fetchFromSource(_ source: ProfilePictureSource) async -> Data? {
        switch source {
        case .contacts(let email):
            return await fetchFromContacts(email: email)
        case .gravatar(let email):
            return await fetchFromGravatar(email: email)
        case .dicebear(let email, let name):
            return await fetchFromDiceBear(email: email, name: name)
        }
    }
    
    private func fetchFromContacts(email: String) async -> Data? {
        let script = """
        tell application "Contacts"
            try
                set thePerson to first person whose value of first email contains "\(email)"
                if exists image of thePerson then
                    return image of thePerson
                end if
            on error
                return missing value
            end try
        end tell
        """
        
        do {
            let result = try await executeAppleScript(script)
            if let data = result?.data {
                print("📸 [PROFILE] Found contact image for \(email)")
                return data
            }
        } catch {
            print("📸 [PROFILE] Contacts error for \(email): \(error.localizedDescription)")
        }
        
        return nil
    }
    
    private func fetchFromGravatar(email: String) async -> Data? {
        guard let url = getGravatarURL(for: email) else { return nil }
        
        do {
            let (data, response) = try await URLSession.shared.data(from: url)
            
            // Check if Gravatar returned a valid image (not 404)
            if let httpResponse = response as? HTTPURLResponse,
               httpResponse.statusCode == 200 {
                print("📸 [PROFILE] Found Gravatar for \(email)")
                return data
            }
        } catch {
            print("📸 [PROFILE] Gravatar error for \(email): \(error.localizedDescription)")
        }
        
        return nil
    }
    
    private func fetchFromDiceBear(email: String, name: String?) async -> Data? {
        guard let url = getDiceBearURL(for: email, senderName: name) else { return nil }
        
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            print("📸 [PROFILE] Using DiceBear for \(email)")
            return data
        } catch {
            print("📸 [PROFILE] DiceBear error for \(email): \(error.localizedDescription)")
            return nil
        }
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
    
    private func executeAppleScript(_ script: String) async throws -> NSAppleEventDescriptor? {
        return try await AppleScriptHelper.executeAsync(script)
    }
    
    private func getCachedImageFromDisk(for key: String) -> Data? {
        let fileURL = cacheDirectory.appendingPathComponent("\(key).jpg")
        return try? Data(contentsOf: fileURL)
    }
    
    private func saveImageToDisk(_ data: Data, for key: String) {
        let fileURL = cacheDirectory.appendingPathComponent("\(key).jpg")
        try? data.write(to: fileURL)
    }
}

// MARK: - Supporting Types

private enum ProfilePictureSource {
    case contacts(String)
    case gravatar(String)
    case dicebear(String, String?)
    
    var description: String {
        switch self {
        case .contacts: return "Contacts"
        case .gravatar: return "Gravatar"
        case .dicebear: return "DiceBear"
        }
    }
}

// MARK: - Data Extension for MD5

private extension Data {
    var md5Hash: Data {
        let hash = Insecure.MD5.hash(data: self)
        return Data(hash)
    }
}
