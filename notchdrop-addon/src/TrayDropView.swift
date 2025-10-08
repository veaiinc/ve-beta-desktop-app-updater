//
//  TrayDropView.swift
//  NotchDrop
//
//  Native AppKit drop view for reliable file drops
//

import SwiftUI
import AppKit
import UniformTypeIdentifiers

// Native NSView that handles drag and drop properly
class TrayDropNSView: NSView {
    var onDragEntered: () -> Void = {}
    var onDragExited: () -> Void = {}
    var onDrop: ([URL]) -> Void = { _ in }
    
    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        setupDragAndDrop()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupDragAndDrop() {
        // Register for ALL possible file types
        registerForDraggedTypes([
            .fileURL,
            .URL,
            .string,
            .tiff,
            .png,
            .pdf
        ])
        print("✅ TrayDropNSView: Registered for dragged types")
    }
    
    override func draggingEntered(_ sender: NSDraggingInfo) -> NSDragOperation {
        print("🎯 TrayDropNSView: draggingEntered called!")
        
        // Check if we have file URLs
        let pasteboard = sender.draggingPasteboard
        print("📋 Pasteboard types: \(pasteboard.types ?? [])")
        
        if let urls = pasteboard.readObjects(forClasses: [NSURL.self], options: nil) as? [URL], !urls.isEmpty {
            print("✅ Found \(urls.count) file URLs")
            onDragEntered()
            return .copy
        }
        
        print("⚠️ No valid file URLs found")
        return []
    }
    
    override func draggingExited(_ sender: NSDraggingInfo?) {
        print("🚪 TrayDropNSView: draggingExited")
        onDragExited()
    }
    
    override func performDragOperation(_ sender: NSDraggingInfo) -> Bool {
        print("🎯 TrayDropNSView: performDragOperation called!")
        
        let pasteboard = sender.draggingPasteboard
        
        if let urls = pasteboard.readObjects(forClasses: [NSURL.self], options: nil) as? [URL], !urls.isEmpty {
            print("✅ Dropping \(urls.count) files: \(urls.map { $0.lastPathComponent })")
            onDrop(urls)
            return true
        }
        
        print("❌ performDragOperation: No valid URLs found")
        return false
    }
}

// SwiftUI wrapper for the native drop view
struct TrayDropZone: NSViewRepresentable {
    @Binding var isTargeted: Bool
    var onDrop: ([URL]) -> Void
    
    func makeNSView(context: Context) -> TrayDropNSView {
        let view = TrayDropNSView()
        view.onDragEntered = { 
            print("🎯 onDragEntered callback")
            isTargeted = true 
        }
        view.onDragExited = { 
            print("🚪 onDragExited callback")
            isTargeted = false 
        }
        view.onDrop = { urls in
            print("📦 onDrop callback with \(urls.count) URLs")
            onDrop(urls)
        }
        
        view.autoresizingMask = [.width, .height]
        
        return view
    }
    
    func updateNSView(_ nsView: TrayDropNSView, context: Context) {
        // Update callbacks if needed
    }
}

