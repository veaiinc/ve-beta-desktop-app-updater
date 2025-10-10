import Cocoa
import Combine
import Foundation

class TrayDrop: ObservableObject {
    static let shared = TrayDrop()

    var cancellables = Set<AnyCancellable>()

    @Persist(key: "keepInterval", defaultValue: 3600 * 24)
    var keepInterval: TimeInterval

    private init() {
        Publishers.CombineLatest3(
            $selectedFileStorageTime.removeDuplicates(),
            $customStorageTime.removeDuplicates(),
            $customStorageTimeUnit.removeDuplicates()
        )
        .map { selectedFileStorageTime, customStorageTime, customStorageTimeUnit in
            let customTime = switch customStorageTimeUnit {
            case .hours:
                TimeInterval(customStorageTime) * 60 * 60
            case .days:
                TimeInterval(customStorageTime) * 60 * 60 * 24
            case .weeks:
                TimeInterval(customStorageTime) * 60 * 60 * 24 * 7
            case .months:
                TimeInterval(customStorageTime) * 60 * 60 * 24 * 30
            case .years:
                TimeInterval(customStorageTime) * 60 * 60 * 24 * 365
            }
            let ans = selectedFileStorageTime.toTimeInterval(customTime: customTime)
            return ans
        }
        .receive(on: DispatchQueue.main)
        .sink { [weak self] output in
            self?.keepInterval = output
        }
        .store(in: &cancellables)
    }

    var isEmpty: Bool { items.isEmpty }

    @PublishedPersist(key: "TrayDropItems", defaultValue: .init())
    var items: [DropItem]

    @PublishedPersist(key: "selectedFileStorageTime", defaultValue: .oneDay)
    var selectedFileStorageTime: FileStorageTime

    @PublishedPersist(key: "customStorageTime", defaultValue: 1)
    var customStorageTime: Int

    @PublishedPersist(key: "customStorageTimeUnit", defaultValue: .days)
    var customStorageTimeUnit: CustomstorageTimeUnit

    @Published var isLoading: Int = 0

    func load(_ providers: [NSItemProvider]) {
        // Don't assert - just log the thread
        print("📥 TrayDrop: Loading \(providers.count) provider(s) on thread: \(Thread.isMainThread ? "MAIN" : "BACKGROUND")")
        
        // Ensure we increment loading on main thread
        if Thread.isMainThread {
            isLoading += 1
        } else {
            DispatchQueue.main.sync { isLoading += 1 }
        }
        
        guard let urls = providers.interfaceConvert() else {
            print("❌ TrayDrop: Failed to convert providers to URLs")
            DispatchQueue.main.async { self.isLoading -= 1 }
            return
        }
        
        print("✅ TrayDrop: Got \(urls.count) URLs, creating items...")
        urls.forEach { url in
            print("📂 URL: \(url.path)")
        }
        
        do {
            let items = try urls.map { url in
                print("📦 Creating DropItem for: \(url.lastPathComponent)")
                let item = try DropItem(url: url)
                print("✅ Created DropItem with ID: \(item.id)")
                return item
            }
            
            print("💾 TrayDrop: Successfully created \(items.count) items, adding to array...")
            
            DispatchQueue.main.async {
                print("💾 Adding \(items.count) items to tray (current count: \(self.items.count))")
                items.forEach { item in
                    if !self.items.contains(where: { $0.id == item.id }) {
                        self.items.insert(item, at: 0)
                        print("✅ Added: \(item.fileName) (new count: \(self.items.count))")
                    } else {
                        print("⚠️ Item already exists: \(item.fileName)")
                    }
                }
                self.isLoading -= 1
                print("🎉 TrayDrop: Load complete! Total items: \(self.items.count)")
                print("📋 Current items: \(self.items.map { $0.fileName })")
            }
        } catch {
            print("❌ TrayDrop: Error creating items: \(error)")
            print("❌ Error details: \(error.localizedDescription)")
            DispatchQueue.main.async {
                self.isLoading -= 1
                NSAlert.popError(error)
            }
        }
    }

    func cleanExpiredFiles() {
        var inEdit = items
        let shouldCleanItems = items.filter(\.shouldClean)
        for item in shouldCleanItems {
            if let index = inEdit.firstIndex(where: { $0.id == item.id }) {
                inEdit.remove(at: index)
            }
        }
        items = inEdit
    }

    func delete(_ item: DropItem.ID) {
        guard let item = items.first(where: { $0.id == item }) else { 
            print("⚠️ TrayDrop: Item not found for deletion: \(item)")
            return 
        }
        print("🗑️ TrayDrop: Starting deletion of item: \(item.fileName)")
        delete(item: item)
    }

    private func delete(item: DropItem) {
        print("🗑️ TrayDrop: Deleting item: \(item.fileName) (ID: \(item.id))")
        
        // First, immediately remove from UI to provide instant feedback
        DispatchQueue.main.async {
            if let index = self.items.firstIndex(where: { $0.id == item.id }) {
                print("🗑️ TrayDrop: Removing item from UI at index: \(index)")
                self.items.remove(at: index)
                print("✅ TrayDrop: Item removed from UI. Remaining items: \(self.items.count)")
            } else {
                print("⚠️ TrayDrop: Item not found in items array during deletion")
            }
        }
        
        // Then handle file system cleanup in background
        DispatchQueue.global(qos: .background).async {
            var url = item.storageURL
            print("🗑️ TrayDrop: Deleting file at: \(url.path)")
            
            do {
                try FileManager.default.removeItem(at: url)
                print("✅ TrayDrop: File deleted successfully")
            } catch {
                print("❌ TrayDrop: Failed to delete file: \(error)")
            }

            // Clean up empty directories
            do {
                url = url.deletingLastPathComponent()
                while url.lastPathComponent != DropItem.mainDir, url != FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first {
                    let contents = try FileManager.default.contentsOfDirectory(atPath: url.path)
                    guard contents.isEmpty else { break }
                    try FileManager.default.removeItem(at: url)
                    print("🗑️ TrayDrop: Removed empty directory: \(url.path)")
                    url = url.deletingLastPathComponent()
                }
            } catch {
                print("⚠️ TrayDrop: Error cleaning up directories: \(error)")
            }
        }
    }

    func removeAll() {
        items.forEach { delete(item: $0) }
    }
}

extension TrayDrop {
    enum FileStorageTime: String, CaseIterable, Identifiable, Codable {
        case oneHour = "1 Hour"
        case oneDay = "1 Day"
        case twoDays = "2 Days"
        case threeDays = "3 Days"
        case oneWeek = "1 Week"
        case never = "Forever"
        case custom = "Custom"

        var id: String { rawValue }

        var localized: String {
            NSLocalizedString(rawValue, comment: "")
        }

        func toTimeInterval(customTime: TimeInterval) -> TimeInterval {
            switch self {
            case .oneHour:
                60 * 60
            case .oneDay:
                60 * 60 * 24
            case .twoDays:
                60 * 60 * 24 * 2
            case .threeDays:
                60 * 60 * 24 * 3
            case .oneWeek:
                60 * 60 * 24 * 7
            case .never:
                TimeInterval.infinity
            case .custom:
                customTime
            }
        }
    }

    enum CustomstorageTimeUnit: String, CaseIterable, Identifiable, Codable {
        case hours = "Hours"
        case days = "Days"
        case weeks = "Weeks"
        case months = "Months"
        case years = "Years"

        var id: String { rawValue }

        var localized: String {
            NSLocalizedString(rawValue, comment: "")
        }
    }
}

