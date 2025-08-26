import Cocoa
import Combine
import Foundation

// MARK: - TrayDrop Implementation (Ported from NotchDropLatest)
@objc public class TrayDrop: NSObject, ObservableObject {
    public static let shared = TrayDrop()

    public var cancellables = Set<AnyCancellable>()

    @objc public var keepInterval: TimeInterval = 3600 * 24 // Default 1 day

    private override init() {
        super.init()
        setupCancellables()
    }

    public var isEmpty: Bool { items.isEmpty }

    @objc public var items: [String] = [] // Simplified for now - would be DropItem objects

    @objc public var isLoading: Int = 0

    @objc public func load(_ filePaths: [String]) {
        DispatchQueue.main.async { self.isLoading += 1 }

        // Process files
        for filePath in filePaths {
            items.append(filePath)
        }

        DispatchQueue.main.async {
            self.isLoading -= 1
        }
    }

    @objc public func cleanExpiredFiles() {
        // Clean up expired files based on keepInterval
        // Implementation would check file timestamps
    }

    @objc public func delete(_ filePath: String) {
        items.removeAll { $0 == filePath }
        // Clean up actual file if needed
        try? FileManager.default.removeItem(atPath: filePath)
    }

    @objc public func removeAll() {
        let itemsToDelete = items
        items.removeAll()

        // Clean up actual files
        for filePath in itemsToDelete {
            try? FileManager.default.removeItem(atPath: filePath)
        }
    }

    private func setupCancellables() {
        // Set up periodic cleanup
        Timer.publish(every: 3600, on: .main, in: .common) // Every hour
            .autoconnect()
            .sink { [weak self] _ in
                self?.cleanExpiredFiles()
            }
            .store(in: &cancellables)
    }
}