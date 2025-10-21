import Foundation

enum MailServiceError: Error, LocalizedError, Equatable {
    case mailNotRunning
    case appleScriptExecutionFailed(String)
    case parsingFailed
    case messageNotFound
    case permissionDenied
    case unknown
    
    var errorDescription: String? {
        switch self {
        case .mailNotRunning: return "Apple Mail is not running."
        case .appleScriptExecutionFailed(let reason): return "AppleScript failed: \(reason)"
        case .parsingFailed: return "Failed to parse Mail response."
        case .messageNotFound: return "Message not found."
        case .permissionDenied: return "Permission to control Mail was denied."
        case .unknown: return "Unknown error."
        }
    }
}

protocol MailService {
    func fetchRecentEmails(limit: Int) async throws -> [EmailItem]
    func openEmail(_ email: EmailItem) async throws
    func fetchLabels() async throws -> [String]
    func fetchEmailsForLabel(_ label: String, limit: Int) async throws -> [EmailItem]
}

