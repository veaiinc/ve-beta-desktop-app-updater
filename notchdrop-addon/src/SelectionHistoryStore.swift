//
//  SelectionHistoryStore.swift
//  NotchDrop
//
//  Stores text selections in an encrypted, local history.
//

import Foundation
import CryptoKit
import Security

struct SelectionHistoryEntry: Codable, Identifiable, Equatable {
    let id: UUID
    let text: String
    let createdAt: Date
    var isPinned: Bool
    let sourceAppName: String?
    let sourceBundleIdentifier: String?

    var trimmedText: String {
        text.trimmingCharacters(in: .whitespacesAndNewlines)
    }
}

final class SelectionHistoryStore {
    static let shared = SelectionHistoryStore()

    private enum Constants {
        static let keychainService = "com.ve.selectionassistant"
        static let keychainAccount = "history-encryption-key"
        static let historyDirectoryName = "SelectionAssistant"
        static let historyFileName = "history.enc"
    }

    private let ioQueue = DispatchQueue(label: "com.ve.selectionassistant.history", qos: .utility)
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()
    private let fileURL: URL
    private var cachedEntries: [SelectionHistoryEntry] = []
    private var symmetricKey: SymmetricKey

    private init() {
        encoder.dateEncodingStrategy = .iso8601
        decoder.dateDecodingStrategy = .iso8601

        let baseDirectory = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)
            .first?
            .appendingPathComponent(Constants.historyDirectoryName, isDirectory: true)
            ?? URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent(Constants.historyDirectoryName, isDirectory: true)

        if !FileManager.default.fileExists(atPath: baseDirectory.path) {
            try? FileManager.default.createDirectory(at: baseDirectory, withIntermediateDirectories: true)
        }

        fileURL = baseDirectory.appendingPathComponent(Constants.historyFileName, isDirectory: false)

        symmetricKey = Self.loadOrCreateKey()
        cachedEntries = loadFromDisk()
    }

    func append(text: String, sourceAppName: String?, sourceBundleIdentifier: String?) -> SelectionHistoryEntry {
        let entry = SelectionHistoryEntry(
            id: UUID(),
            text: text,
            createdAt: Date(),
            isPinned: false,
            sourceAppName: sourceAppName,
            sourceBundleIdentifier: sourceBundleIdentifier
        )

        ioQueue.async { [weak self] in
            guard let self else { return }
            self.cachedEntries.append(entry)
            self.persist()
        }

        return entry
    }

    func updatePinnedState(for id: UUID, isPinned: Bool) {
        ioQueue.async { [weak self] in
            guard let self else { return }
            guard let index = self.cachedEntries.firstIndex(where: { $0.id == id }) else { return }
            self.cachedEntries[index].isPinned = isPinned
            self.persist()
        }
    }

    func removeEntry(with id: UUID) {
        ioQueue.async { [weak self] in
            guard let self else { return }
            self.cachedEntries.removeAll(where: { $0.id == id })
            self.persist()
        }
    }

    func clear() {
        ioQueue.async { [weak self] in
            guard let self else { return }
            self.cachedEntries.removeAll()
            do {
                if FileManager.default.fileExists(atPath: self.fileURL.path) {
                    try FileManager.default.removeItem(at: self.fileURL)
                }
            } catch {
                print("🛑 SelectionHistoryStore clear error: \(error)")
            }
        }
    }

    func entries(completion: @escaping ([SelectionHistoryEntry]) -> Void) {
        ioQueue.async { [weak self] in
            guard let self else {
                completion([])
                return
            }
            let sorted = self.cachedEntries.sorted { lhs, rhs in
                if lhs.isPinned == rhs.isPinned {
                    return lhs.createdAt > rhs.createdAt
                }
                return lhs.isPinned && !rhs.isPinned
            }
            completion(sorted)
        }
    }

    func entriesSync() -> [SelectionHistoryEntry] {
        var result: [SelectionHistoryEntry] = []
        let semaphore = DispatchSemaphore(value: 0)
        entries {
            result = $0
            semaphore.signal()
        }
        semaphore.wait()
        return result
    }

    func latestEntry() -> SelectionHistoryEntry? {
        cachedEntries.sorted(by: { $0.createdAt > $1.createdAt }).first
    }

    private static func loadOrCreateKey() -> SymmetricKey {
        if let data = KeychainHelper.loadKeyData(service: Constants.keychainService, account: Constants.keychainAccount) {
            return SymmetricKey(data: data)
        }

        let key = SymmetricKey(size: .bits256)
        let keyData = key.withUnsafeBytes { Data(Array($0)) }
        KeychainHelper.saveKeyData(keyData, service: Constants.keychainService, account: Constants.keychainAccount)
        return key
    }

    private func loadFromDisk() -> [SelectionHistoryEntry] {
        guard let data = try? Data(contentsOf: fileURL) else {
            return []
        }

        do {
            let sealedBox = try AES.GCM.SealedBox(combined: data)
            let decrypted = try AES.GCM.open(sealedBox, using: symmetricKey)
            return try decoder.decode([SelectionHistoryEntry].self, from: decrypted)
        } catch {
            print("🛑 SelectionHistoryStore decrypt error: \(error)")
            return []
        }
    }

    private func persist() {
        do {
            let data = try encoder.encode(cachedEntries)
            let sealedBox = try AES.GCM.seal(data, using: symmetricKey)
            try sealedBox.combined?.write(to: fileURL, options: [.atomic])
        } catch {
            print("🛑 SelectionHistoryStore persist error: \(error)")
        }
    }
}

private enum KeychainHelper {
    static func loadKeyData(service: String, account: String) -> Data? {
        let query: [CFString: Any] = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrService: service,
            kSecAttrAccount: account,
            kSecReturnData: true,
            kSecMatchLimit: kSecMatchLimitOne,
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        if status == errSecSuccess {
            return result as? Data
        }
        return nil
    }

    static func saveKeyData(_ data: Data, service: String, account: String) {
        let query: [CFString: Any] = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrService: service,
            kSecAttrAccount: account,
        ]

        let attributes: [CFString: Any] = [
            kSecValueData: data,
            kSecAttrAccessible: kSecAttrAccessibleAfterFirstUnlock,
        ]

        let status = SecItemAdd(query.merging(attributes) { _, new in new } as CFDictionary, nil)

        if status == errSecDuplicateItem {
            SecItemUpdate(query as CFDictionary, [kSecValueData: data] as CFDictionary)
        }
    }
}
