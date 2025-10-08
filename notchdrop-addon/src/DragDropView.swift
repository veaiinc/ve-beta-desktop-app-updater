//
//  DragDropView.swift
//  boringNotch
//
//  Created by Richard Kunkli on 2024. 10. 19..
//

import SwiftUI
import AppKit

class DragDropView: NSView {
    var onDragEntered: () -> Void = {}
    var onDragExited: () -> Void = {}
    var onDrop: ([URL]) -> Void = { _ in }
    
    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        // Register for all common file types
        registerForDraggedTypes([.fileURL, .URL, .string, .tiff, .png, .pdf])
        print("✅ DragDropView: Registered for dragged types")
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func draggingEntered(_ sender: NSDraggingInfo) -> NSDragOperation {
        print("🎯 DragDropView: draggingEntered")
        onDragEntered()
        return .copy
    }
    
    override func draggingExited(_ sender: NSDraggingInfo?) {
        print("🚪 DragDropView: draggingExited")
        onDragExited()
    }
    
    override func performDragOperation(_ sender: NSDraggingInfo) -> Bool {
        print("📦 DragDropView: performDragOperation")
        let pasteboard = sender.draggingPasteboard
        
        if let urls = pasteboard.readObjects(forClasses: [NSURL.self], options: nil) as? [URL], !urls.isEmpty {
            print("✅ DragDropView: Got \(urls.count) URLs: \(urls.map { $0.lastPathComponent })")
            onDrop(urls)
            return true
        }
        
        print("❌ DragDropView: No URLs found in pasteboard")
        return false
    }
}

struct DragDropViewRepresentable: NSViewRepresentable {
    @Binding var isTargeted: Bool
    var onDrop: ([URL]) -> Void
    
    func makeNSView(context: Context) -> DragDropView {
        let view = DragDropView()
        view.onDragEntered = { 
            print("🎯 DragDropView callback: onDragEntered")
            isTargeted = true 
        }
        view.onDragExited = { 
            print("🚪 DragDropView callback: onDragExited")
            isTargeted = false 
        }
        view.onDrop = { urls in
            print("📦 DragDropView callback: onDrop with \(urls.count) URLs")
            onDrop(urls)
        }
        
        view.autoresizingMask = [.width, .height]
        
        return view
    }
    
    func updateNSView(_ nsView: DragDropView, context: Context) {}
}
