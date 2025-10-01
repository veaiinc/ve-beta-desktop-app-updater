//
//  Ext+FileProvider.swift
//  NotchDrop
//
//  Created by 秋星桥 on 2024/7/8.
//

import Cocoa
import Foundation
import UniformTypeIdentifiers

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
        try FileManager.default.copyItem(at: url, to: temp)
        print("✅ Duplicated file to temp: \(temp.lastPathComponent)")
        return temp
    }

    func convertToFilePathThatIsWhatWeThinkItWillWorkWithNotchDrop() -> URL? {
        var url: URL?
        let sem = DispatchSemaphore(value: 0)
        
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
            sem.signal()
        }
        sem.wait()
        
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
                        defer { sem.signal() }
                        if let error = error {
                            print("❌ Error loading \(typeIdentifier): \(error.localizedDescription)")
                        } else if let input = input {
                            url = try? self.duplicateToOurStorage(input)
                            if url != nil {
                                print("✅ Successfully loaded as \(typeIdentifier)")
                            }
                        }
                    }
                    sem.wait()
                    if url != nil { break }
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

extension [NSItemProvider] {
    func interfaceConvert() -> [URL]? {
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
