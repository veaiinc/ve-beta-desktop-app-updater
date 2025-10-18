import Foundation
import Combine

@MainActor
final class EmailViewModel: ObservableObject {
    @Published private(set) var emails: [EmailItem] = []
    @Published private(set) var isLoading: Bool = false
    @Published var errorMessage: String?
    
    private let service: MailService
    private let limit: Int
    
    init(service: MailService = AppleScriptMailService(), limit: Int = 10) {
        self.service = service
        self.limit = limit
    }
    
    func fetch() async {
        print("📧 [VIEWMODEL] Starting email fetch...")
        
        isLoading = true
        errorMessage = nil
        
        do {
            // Fetch on background thread
            let items = try await fetchEmailsInBackground()
            
            self.emails = items
            self.isLoading = false
            print("✅ [VIEWMODEL] Fetch completed: \(items.count) emails")
            
        } catch let e as MailServiceError {
            self.errorMessage = e.localizedDescription
            self.emails = []
            self.isLoading = false
            print("❌ [VIEWMODEL] Fetch failed: \(e.localizedDescription)")
            
        } catch {
            self.errorMessage = MailServiceError.unknown.localizedDescription
            self.emails = []
            self.isLoading = false
            print("❌ [VIEWMODEL] Unknown error: \(error)")
        }
    }
    
    func open(_ email: EmailItem) async {
        print("📧 [VIEWMODEL] Opening email...")
        
        do {
            try await openEmailInBackground(email)
            print("✅ [VIEWMODEL] Email opened")
            
        } catch let e as MailServiceError {
            self.errorMessage = e.localizedDescription
            print("❌ [VIEWMODEL] Failed to open: \(e.localizedDescription)")
            
        } catch {
            self.errorMessage = MailServiceError.unknown.localizedDescription
            print("❌ [VIEWMODEL] Failed to open: Unknown error")
        }
    }
    
    // MARK: - Background Execution
    
    private func fetchEmailsInBackground() async throws -> [EmailItem] {
        let service = self.service
        let limit = self.limit
        
        return try await Task.detached(priority: .userInitiated) {
            try await service.fetchRecentEmails(limit: limit)
        }.value
    }
    
    private func openEmailInBackground(_ email: EmailItem) async throws {
        let service = self.service
        
        return try await Task.detached(priority: .userInitiated) {
            try await service.openEmail(email)
        }.value
    }
}
