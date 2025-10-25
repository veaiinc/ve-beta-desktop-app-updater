import Foundation
import Combine

@MainActor
final class EmailViewModel: ObservableObject {
    @Published private(set) var emails: [EmailItem] = []
    @Published private(set) var isLoading: Bool = false
    @Published var errorMessage: String?
    
    // MARK: - Label Management
    @Published private(set) var availableLabels: [String] = []
    @Published private(set) var selectedLabel: String? = nil
    @Published private(set) var isLabelsLoading: Bool = false
    
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
    
    // MARK: - Label Management
    
    /// Fetch available labels/mailboxes from Mail.app
    func fetchLabels() async {
        print("🏷️ [VIEWMODEL] Fetching labels...")
        isLabelsLoading = true
        errorMessage = nil
        
        do {
            let labels = try await fetchLabelsInBackground()
            self.availableLabels = labels
            print("✅ [VIEWMODEL] Labels fetched: \(labels.count) labels")
            
            // Additional debugging
            if labels.isEmpty {
                print("⚠️ [VIEWMODEL] No labels found - this might mean:")
                print("   - All mailboxes are empty")
                print("   - AppleScript message counting failed")
                print("   - Mail.app has no mailboxes")
            } else {
                print("🏷️ [VIEWMODEL] Found labels with emails:")
                for label in labels {
                    print("   - '\(label)'")
                }
                
                // ✅ HYBRID APPROACH: Auto-select first label only on initial load
                // This keeps notch from looking empty while maintaining lazy loading for other labels
                if selectedLabel == nil && !labels.isEmpty {
                    let firstLabel = labels[0]
                    print("🏷️ [VIEWMODEL] Auto-selecting first label to populate notch: '\(firstLabel)'")
                    print("🏷️ [VIEWMODEL] Other labels will lazy load when clicked")
                    await selectLabel(firstLabel)
                }
            }
        } catch let e as MailServiceError {
            self.errorMessage = e.localizedDescription
            print("❌ [VIEWMODEL] Failed to fetch labels: \(e.localizedDescription)")
        } catch {
            self.errorMessage = MailServiceError.unknown.localizedDescription
            print("❌ [VIEWMODEL] Failed to fetch labels: Unknown error")
        }
        
        isLabelsLoading = false
    }
    
    /// Select a label and fetch emails for that label
    func selectLabel(_ label: String) async {
        print("🏷️ [VIEWMODEL] Selecting label: \(label)")
        
        // Don't refetch if already selected
        guard selectedLabel != label else {
            print("🏷️ [VIEWMODEL] Label already selected, skipping")
            return
        }
        
        selectedLabel = label
        
        // Clear current emails and fetch new ones for the selected label
        emails = []
        
        do {
            await fetch(force: true)
            
            // If no emails found, show a helpful message
            if emails.isEmpty {
                print("🏷️ [VIEWMODEL] No emails found for label '\(label)'")
                // You could set a user-friendly error message here
                // self.errorMessage = "No emails found in '\(label)'"
            }
        } catch {
            print("🏷️ [VIEWMODEL] Error fetching emails for label '\(label)': \(error)")
        }
    }
    
    /// Clear label selection and return to inbox
    func clearLabelSelection() async {
        print("🏷️ [VIEWMODEL] Clearing label selection")
        selectedLabel = nil
        
        // 🚫 INBOX FETCHING DISABLED - Just clear emails, don't fetch inbox
        emails = []
        print("🏷️ [VIEWMODEL] Inbox button clicked - cleared emails (inbox fetching disabled)")
        
        // Commented out inbox fetch:
        // await fetch(force: true)
    }
    
    /// Check if a label is currently selected
    var isLabelSelected: Bool {
        return selectedLabel != nil
    }
    
    /// Get the display name for the current selection
    var currentSelectionDisplayName: String {
        if let label = selectedLabel {
            return label
        }
        return "Inbox"
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
        let selectedLabel = self.selectedLabel
        
        return try await Task.detached(priority: .userInitiated) {
            if let label = selectedLabel {
                // Fetch emails for specific label
                return try await service.fetchEmailsForLabel(label, limit: limit)
            } else {
                // 🚫 INBOX FETCHING DISABLED - Only fetch emails from labels
                print("📧 [VIEWMODEL] Inbox fetching disabled - select a label to view emails")
                return []
                
                // Commented out inbox fetch:
                // return try await service.fetchRecentEmails(limit: limit)
            }
        }.value
    }
    
    private func fetchLabelsInBackground() async throws -> [String] {
        let service = self.service
        
        return try await Task.detached(priority: .userInitiated) {
            try await service.fetchLabels()
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
