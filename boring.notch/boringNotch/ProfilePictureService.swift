import Foundation
import CryptoKit

final class ProfilePictureService {
    static let shared = ProfilePictureService()
    
    private var cache = [String: URL]()
    private let queue = DispatchQueue(label: "ProfilePictureService.cache.queue", attributes: .concurrent)
    
    private init() {}
    
    // Preferred API used by EmailItem.photoURL
    func getProfilePictureURL(for email: String, senderName: String) -> URL? {
        let normalized = email.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        guard !normalized.isEmpty else {
            return diceBearURL(seed: senderName.isEmpty ? "user" : senderName)
        }
        
        if let cached = cachedURL(for: normalized) {
            return cached
        }
        
        let hash = md5Hex(of: normalized)
        if let gravatar = URL(string: "https://www.gravatar.com/avatar/\(hash)?d=404&s=80") {
            setCachedURL(gravatar, for: normalized)
            return gravatar
        }
        
        let fallback = diceBearURL(seed: normalized.isEmpty ? (senderName.isEmpty ? "user" : senderName) : normalized)
        if let fallback = fallback {
            setCachedURL(fallback, for: normalized)
        }
        return fallback
    }
    
    // Optional: keep a compatibility alias if any older code calls getProfilePicture(...)
    @available(*, deprecated, message: "Use getProfilePictureURL(for:senderName:) instead")
    func getProfilePicture(for email: String, senderName: String) -> URL? {
        return getProfilePictureURL(for: email, senderName: senderName)
    }
    
    // MARK: - Helpers
    
    private func diceBearURL(seed: String) -> URL? {
        let safeSeed = seed.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "user"
        return URL(string: "https://api.dicebear.com/7.x/avataaars/svg?seed=\(safeSeed)")
    }
    
    private func md5Hex(of string: String) -> String {
        let digest = Insecure.MD5.hash(data: Data(string.utf8))
        return digest.map { String(format: "%02x", $0) }.joined()
    }
    
    private func cachedURL(for email: String) -> URL? {
        var result: URL?
        queue.sync { result = cache[email] }
        return result
    }
    
    private func setCachedURL(_ url: URL, for email: String) {
        queue.async(flags: .barrier) { self.cache[email] = url }
    }
}
