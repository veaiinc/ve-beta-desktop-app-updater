import Foundation
import Combine

@MainActor
final class EmailViewModel: ObservableObject {
    @Published private(set) var emails: [EmailItem] = []
    @Published private(set) var isLoading: Bool = false
    @Published var errorMessage: String?
    
    // MARK: - Smart caching and refresh tracking
    @Published private(set) var lastFetchedAt: Date?
    @Published private(set) var lastUserActivityAt: Date?
    private var autoRefreshCancellable: AnyCancellable?
    private var isCurrentlyFetching: Bool = false
    
    // Cache configuration
    private let cacheValidityMinutes: Int = 15
    private let autoRefreshIntervalMinutes: Int = 15
    private let userActivityTimeoutMinutes: Int = 30
    
    private let service: MailService
    private let limit: Int
    
    init(service: MailService = AppleScriptMailService(), limit: Int = 10) {
        self.service = service
        self.limit = limit
    }
    
    // MARK: - Smart fetching API
    
    /// Smart fetch that respects cache and prevents duplicates
    func fetch(force: Bool = false) async {
        // Prevent duplicate fetches
        if isCurrentlyFetching && !force {
            print("📧 [VIEWMODEL] Skipping fetch - already in progress")
            return
        }
        
        // Check if we have valid cached data (unless forced)
        if !force && hasValidCache() {
            print("📧 [VIEWMODEL] Using valid cache - \(emails.count) emails from \(lastFetchedAt?.timeAgoString ?? "unknown")")
            return
        }
        
        print("📧 [VIEWMODEL] Starting email fetch (force: \(force), cache valid: \(hasValidCache()))...")
        isCurrentlyFetching = true
        isLoading = true
        errorMessage = nil
        
        do {
            let items = try await fetchEmailsInBackground()
            self.emails = items
            self.lastFetchedAt = Date()
            print("✅ [VIEWMODEL] Fetch completed: \(items.count) emails")
        } catch let e as MailServiceError {
            self.errorMessage = e.localizedDescription
            // Only clear emails on first fetch or forced fetch
            if emails.isEmpty || force {
                self.emails = []
            }
            print("❌ [VIEWMODEL] Fetch failed: \(e.localizedDescription)")
        } catch {
            self.errorMessage = MailServiceError.unknown.localizedDescription
            if emails.isEmpty || force {
                self.emails = []
            }
            print("❌ [VIEWMODEL] Unknown error: \(error)")
        }
        
        isCurrentlyFetching = false
        isLoading = false
    }
    
    /// Smart fetch that only fetches when truly needed
    func fetchIfNeeded() async {
        // Debug cache state
        let cacheValid = hasValidCache()
        let cacheAge = lastFetchedAt?.timeIntervalSinceNow ?? TimeInterval.greatestFiniteMagnitude
        print("📧 [VIEWMODEL] fetchIfNeeded() called - emails: \(emails.count), cache valid: \(cacheValid), age: \(String(format: "%.1f", abs(cacheAge)))s")
        
        // Only fetch if we have no data or cache is stale
        if emails.isEmpty || !cacheValid {
            print("📧 [VIEWMODEL] Cache miss - fetching emails (empty: \(emails.isEmpty), stale: \(!cacheValid))")
            await fetch(force: false)
        } else {
            print("📧 [VIEWMODEL] Skipping fetchIfNeeded() — have \(emails.count) valid emails from \(lastFetchedAt?.timeAgoString ?? "unknown")")
        }
    }
    
    /// Track user activity for smart refresh optimization
    func recordUserActivity() {
        lastUserActivityAt = Date()
        print("📧 [VIEWMODEL] User activity recorded at \(Date())")
    }
    
    /// Start smart auto refresh with user activity awareness
    func startAutoRefresh(intervalMinutes: Int = 15) {
        stopAutoRefresh()
        let intervalSeconds = max(1, intervalMinutes * 60)
        print("⏱️ [VIEWMODEL] Starting smart auto-refresh every \(intervalMinutes) minutes")
        
        autoRefreshCancellable = Timer.publish(every: TimeInterval(intervalSeconds), on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                guard let self else { return }
                Task { [weak self] in
                    guard let self else { return }
                    
                    // Only refresh if user has been active recently or cache is very stale
                    if self.shouldAutoRefresh() {
                        print("⏱️ [VIEWMODEL] Smart auto-refresh triggered — refetching emails")
                        await self.fetch(force: true)
                    } else {
                        print("⏱️ [VIEWMODEL] Auto-refresh skipped — user inactive and cache fresh")
                    }
                }
            }
    }
    
    func stopAutoRefresh() {
        if autoRefreshCancellable != nil {
            print("⏱️ [VIEWMODEL] Stopping auto-refresh")
        }
        autoRefreshCancellable?.cancel()
        autoRefreshCancellable = nil
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
    
    // MARK: - Cache and Smart Refresh Logic
    
    /// Check if cached data is still valid
    private func hasValidCache() -> Bool {
        guard let lastFetched = lastFetchedAt else { 
            print("📧 [CACHE] No cache timestamp - invalid")
            return false 
        }
        let cacheAge = Date().timeIntervalSince(lastFetched)
        let cacheValiditySeconds = TimeInterval(cacheValidityMinutes * 60)
        let isValid = cacheAge < cacheValiditySeconds
        print("📧 [CACHE] Age: \(String(format: "%.1f", cacheAge))s, validity: \(cacheValiditySeconds)s, valid: \(isValid)")
        return isValid
    }
    
    /// Determine if auto-refresh should run based on user activity and cache age
    private func shouldAutoRefresh() -> Bool {
        // Always refresh if we have no data
        if emails.isEmpty { return true }
        
        // Check if user has been active recently
        let userActiveRecently: Bool
        if let lastActivity = lastUserActivityAt {
            let timeSinceActivity = Date().timeIntervalSince(lastActivity)
            userActiveRecently = timeSinceActivity < TimeInterval(userActivityTimeoutMinutes * 60)
        } else {
            userActiveRecently = false
        }
        
        // Check cache age
        let cacheAge: TimeInterval
        if let lastFetched = lastFetchedAt {
            cacheAge = Date().timeIntervalSince(lastFetched)
        } else {
            cacheAge = TimeInterval.greatestFiniteMagnitude
        }
        
        let cacheValiditySeconds = TimeInterval(cacheValidityMinutes * 60)
        let cacheIsStale = cacheAge >= cacheValiditySeconds
        
        // Refresh if user is active OR cache is stale
        return userActiveRecently || cacheIsStale
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

// MARK: - Date Extensions for Better Logging
extension Date {
    var timeAgoString: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: self, relativeTo: Date())
    }
}

