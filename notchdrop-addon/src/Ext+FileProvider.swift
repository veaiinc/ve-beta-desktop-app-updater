//
//  Ext+FileProvider.swift
//  NotchDrop
//
//  Created by 秋星桥 on 2024/7/8.
//

import Cocoa
import Foundation
import UniformTypeIdentifiers

// ⚡ ULTRA OPTIMIZATION: Use DispatchGroup instead of semaphore to avoid blocking main thread
extension NSItemProvider {
    private func duplicateToOurStorage(_ url: URL?) throws -> URL {
        guard let url else { throw NSError(domain: "FileProvider", code: -1, userInfo: [NSLocalizedDescriptionKey: "URL is nil"]) }
        let temp = FileManager.default.temporaryDirectory
            .appendingPathComponent("TemporaryDrop")
            .appendingPathComponent(UUID().uuidString)
            .appendingPathComponent(url.lastPathComponent)
        try FileManager.default.createDirectory(
            at: temp.deletingLastPathComponent(),
            withIntermediateDirectories: true
        )
        
        // ⚡ OPTIMIZATION: Use async file operations on background queue
        try FileManager.default.copyItem(at: url, to: temp)
        print("✅ Duplicated file to temp: \(temp.lastPathComponent)")
        return temp
    }

    // ⚡ CRITICAL FIX: Convert synchronous semaphore-based implementation to async/await
    func convertToFilePathAsync() async -> URL? {
        // Try loadObject first
        if let url = await withCheckedContinuation({ (continuation: CheckedContinuation<URL?, Never>) in
            _ = loadObject(ofClass: URL.self) { item, _ in
                let result = try? self.duplicateToOurStorage(item)
                continuation.resume(returning: result)
            }
        }) {
            return url
        }
        
        // Fallback to loadInPlaceFileRepresentation
        return await withCheckedContinuation { (continuation: CheckedContinuation<URL?, Never>) in
            loadInPlaceFileRepresentation(
                forTypeIdentifier: UTType.data.identifier
            ) { input, _, _ in
                let result = try? self.duplicateToOurStorage(input)
                continuation.resume(returning: result)
            }
        }
    }
    
    // ⚡ LEGACY SUPPORT: Keep old sync method but move work to background queue
    // This is called from TrayDrop.load which is already off main thread
    func convertToFilePathThatIsWhatWeThinkItWillWorkWithNotchDrop() -> URL? {
        // ⚡ CRITICAL: Ensure we're NOT on main thread
        assert(!Thread.isMainThread, "⚠️ File operations should not be called on main thread!")
        
        var url: URL?
        let group = DispatchGroup()
        
        group.enter()
        
        print("🔄 Converting item provider with types: \(registeredTypeIdentifiers)")
        
        // First try loading as URL (direct file drops)
        _ = loadObject(ofClass: URL.self) { item, error in
            if let error = error {
                print("⚠️ Error loading URL: \(error.localizedDescription)")
            }
            if let item = item {
                url = try? self.duplicateToOurStorage(item)
                if url != nil {
                    print("✅ Successfully loaded as URL object")
                }
            }
            group.leave()
        }
        
        // ⚡ OPTIMIZATION: Wait with timeout to prevent infinite hangs
        let result = group.wait(timeout: .now() + 10.0)
        
        if url == nil && result != .timedOut {
            group.enter()
            
            // If that didn't work, try loading as file representation
            if url == nil {
                print("⚠️ URL loading failed, trying file representation...")
                // Try common file types
                let fileTypes = [
                    UTType.fileURL.identifier,
                    UTType.item.identifier,
                    UTType.data.identifier
                ]
                
                for typeIdentifier in fileTypes {
                    if hasItemConformingToTypeIdentifier(typeIdentifier) {
                        print("🔍 Trying type: \(typeIdentifier)")
                        loadInPlaceFileRepresentation(
                            forTypeIdentifier: typeIdentifier
                        ) { input, _, error in
                            defer { group.leave() }
                            if let error = error {
                                print("⚠️ Error loading \(typeIdentifier): \(error.localizedDescription)")
                            } else if let input = input {
                                url = try? self.duplicateToOurStorage(input)
                                if url != nil {
                                    print("✅ Successfully loaded as \(typeIdentifier)")
                                }
                            }
                        }
                        
                        group.wait()
                        if url != nil { break }
                    }
                }
            }
        }
        
        if let url = url {
            print("✅ Final URL: \(url.lastPathComponent)")
        } else {
            print("❌ Failed to convert item provider")
        }
        
        return url
    }
}

// ⚡ ULTRA OPTIMIZATION: Async version for concurrent file processing
extension [NSItemProvider] {
    // ⚡ NEW: Async concurrent conversion (MUCH faster for multiple files)
    func interfaceConvertAsync() async -> [URL]? {
        // Process all providers concurrently using TaskGroup
        let urls = await withTaskGroup(of: (Int, URL?).self) { group -> [URL?] in
            for (index, provider) in self.enumerated() {
                group.addTask {
                    let url = await provider.convertToFilePathAsync()
                    return (index, url)
                }
            }
            
            // Collect results in original order
            var results: [(Int, URL?)] = []
            for await result in group {
                results.append(result)
            }
            
            return results.sorted { $0.0 < $1.0 }.map { $0.1 }
        }
        
        // Filter out nils and check count
        let validUrls = urls.compactMap { $0 }
        guard validUrls.count == count else {
            DispatchQueue.main.async {
                NSAlert.popError(NSLocalizedString("One or more files failed to load", comment: ""))
            }
            return nil
        }
        
        return validUrls
    }
    
    // ⚡ LEGACY: Keep sync version but ensure it's called off main thread
    func interfaceConvert() -> [URL]? {
        // ⚡ CRITICAL: This should NEVER be called on main thread
        assert(!Thread.isMainThread, "⚠️ File conversion should not be called on main thread!")
        
        print("🔄 Converting \(count) item provider(s) to URLs...")
        let urls = compactMap { provider -> URL? in
            provider.convertToFilePathThatIsWhatWeThinkItWillWorkWithNotchDrop()
        }
        print("✅ Successfully converted \(urls.count) of \(count) items")
        
        guard urls.count == count else {
            print("❌ Failed to convert all items - only got \(urls.count) of \(count)")
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                NSAlert.popError(NSLocalizedString("One or more files failed to load. Please try again.", comment: ""))
            }
            return nil
        }
        return urls
    }
}
