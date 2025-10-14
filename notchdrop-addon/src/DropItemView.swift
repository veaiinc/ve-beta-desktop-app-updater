//
//  DropItemView.swift (Enhanced version)
//  NotchDrop
//
//  Adapted from boring.notch with improved visuals and interactions
//

import Foundation
import SwiftUI
import UniformTypeIdentifiers

// Coordinator for tracking global key states
class BoringViewCoordinator: ObservableObject {
    static let shared = BoringViewCoordinator()
    
    @Published var optionKeyPressed: Bool = false
    
    private var monitor: Any?
    
    private init() {
        setupKeyMonitoring()
    }
    
    private func setupKeyMonitoring() {
        monitor = NSEvent.addLocalMonitorForEvents(matching: .flagsChanged) { [weak self] event in
            self?.optionKeyPressed = event.modifierFlags.contains(.option)
            return event
        }
    }
    
    deinit {
        if let monitor = monitor {
            NSEvent.removeMonitor(monitor)
        }
    }
}

// Enhanced DropItemView with boring.notch styling
struct EnhancedDropItemView: View {
    let item: TrayDrop.DropItem
    @ObservedObject var vm: NotchViewModel
    @ObservedObject var coordinator = BoringViewCoordinator.shared
    @StateObject var tvm = TrayDrop.shared

    @State var hover = false
    @State private var isDeleting = false // Prevent multiple delete operations
    
    var spacing: CGFloat { vm.spacing }

    var body: some View {
        ZStack(alignment: .topTrailing) {
            VStack(spacing: 4) {
                ZStack(alignment: .topTrailing) {
                    RoundedRectangle(cornerRadius: 6)
                        .fill(.clear)
                        .background {
                            Image(nsImage: item.workspacePreviewImage)
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .clipShape(RoundedRectangle(cornerRadius: 6))
                        }
                        .frame(width: 64, height: 64)
                        .allowsHitTesting(false) // Don't interfere with button clicks
                    
                    // Delete button - ALWAYS visible (no hover needed)
                    Button(action: {
                        print("🎯 DELETE BUTTON: Click detected for: \(item.fileName)")
                        
                        // Prevent multiple delete operations
                        guard !isDeleting else {
                            print("⚠️ DELETE BUTTON: Already deleting, ignoring click for: \(item.fileName)")
                            return
                        }
                        
                        print("🗑️ DELETE BUTTON CLICKED for: \(item.fileName)")
                        isDeleting = true
                        
                        // Perform delete operation
                        tvm.delete(item.id)
                        
                        // Reset deleting state after a short delay
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                            isDeleting = false
                        }
                    }) {
                        ZStack {
                            // Larger invisible hit area for easier clicking
                            Circle()
                                .fill(Color.clear)
                                .frame(width: 32, height: 32)
                            
                            // Visible button
                            Circle()
                                .fill(isDeleting ? 
                                    Color.red.opacity(0.9) : 
                                    Color(red: 0x79 / 255.0, green: 0xec / 255.0, blue: 0xc9 / 255.0).opacity(0.9))
                                .overlay(
                                    Image(systemName: isDeleting ? "trash.fill" : "xmark")
                                        .foregroundStyle(.white)
                                        .font(.system(size: 10))
                                        .fontWeight(.bold)
                                )
                                .frame(width: 20, height: 20)
                                .shadow(color: .black.opacity(0.6), radius: 4)
                                .scaleEffect(isDeleting ? 1.1 : 1.0)
                                .animation(.easeInOut(duration: 0.2), value: isDeleting)
                        }
                    }
                    .buttonStyle(PlainButtonStyle())
                    .contentShape(Circle()) // Ensure entire circular area is clickable
                    .allowsHitTesting(true) // Explicitly enable hit testing
                    .offset(x: 10, y: -10)
                    .zIndex(1000) // Higher z-index to ensure it's on top of everything
                }
                
                Text(item.fileName)
                    .multilineTextAlignment(.center)
                    .font(.footnote)
                    .foregroundStyle(hover ? .white : .gray)
                    .lineLimit(2)
                    .allowsTightening(true)
                    .frame(width: 80)
            }
            .contentShape(Rectangle())
            .onDrag {
                handleOnDrag(for: item)
            }
            .onTapGesture {
                guard !coordinator.optionKeyPressed else { return }
                print("👆 Opening file: \(item.fileName)")
                vm.notchClose()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    NSWorkspace.shared.open(item.storageURL)
                }
            }
            .allowsHitTesting(true) // Ensure the main item can receive taps
        }
        .scaleEffect(hover ? 1.05 : 1.0)
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: hover)
        .onHover { hovering in
            print("👆 Hover \(hovering ? "ENTERED" : "EXITED") for: \(item.fileName)")
            withAnimation(.smooth(duration: 0.2)) {
                hover = hovering
            }
        }
    }

    private func handleOnDrag(for item: TrayDrop.DropItem) -> NSItemProvider {
        print("🎯 Starting drag for: \(item.fileName)")
        print("📂 Storage URL: \(item.storageURL.path)")
        
        // Verify the file exists
        if !FileManager.default.fileExists(atPath: item.storageURL.path) {
            print("❌ File doesn't exist at storage URL!")
            return NSItemProvider()
        }
        
        print("✅ File exists, creating NSItemProvider")
        
        guard let itemProvider = NSItemProvider(contentsOf: item.storageURL) else {
            print("❌ Failed to create NSItemProvider")
            return NSItemProvider()
        }
        
        // Set the suggested name
        itemProvider.suggestedName = item.fileName
        
        print("✅ NSItemProvider created with name: \(item.fileName)")
        return itemProvider
    }
}
