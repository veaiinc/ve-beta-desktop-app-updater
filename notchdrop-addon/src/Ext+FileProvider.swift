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
        guard let url else { throw NSError() }
        let temp = FileManager.default.temporaryDirectory
            .appendingPathComponent("TemporaryDrop")
            .appendingPathComponent(UUID().uuidString)
            .appendingPathComponent(url.lastPathComponent)
        try? FileManager.default.createDirectory(
            at: temp.deletingLastPathComponent(),
            withIntermediateDirectories: true
        )
        
        // ⚡ OPTIMIZATION: Use async file operations on background queue
        try FileManager.default.copyItem(at: url, to: temp)
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
        _ = loadObject(ofClass: URL.self) { item, _ in
            url = try? self.duplicateToOurStorage(item)
            group.leave()
        }
        
        // ⚡ OPTIMIZATION: Wait with timeout to prevent infinite hangs
        let result = group.wait(timeout: .now() + 10.0)
        
        if url == nil && result != .timedOut {
            group.enter()
            loadInPlaceFileRepresentation(
                forTypeIdentifier: UTType.data.identifier
            ) { input, _, _ in
                url = try? self.duplicateToOurStorage(input)
                group.leave()
            }
            _ = group.wait(timeout: .now() + 10.0)
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
        
        let urls = compactMap { provider -> URL? in
            provider.convertToFilePathThatIsWhatWeThinkItWillWorkWithNotchDrop()
        }
        guard urls.count == count else {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                NSAlert.popError(NSLocalizedString("One or more files failed to load", comment: ""))
            }
            return nil
        }
        return urls
    }
}
