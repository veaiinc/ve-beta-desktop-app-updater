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
                    
                    // Delete button - ALWAYS visible (no hover needed)
                    Button(action: {
                        print("🗑️ DELETE BUTTON CLICKED for: \(item.fileName)")
                        tvm.delete(item.id)
                    }) {
                        Circle()
                            .fill(Color(red: 0x79 / 255.0, green: 0xec / 255.0, blue: 0xc9 / 255.0).opacity(0.9))
                            .overlay(
                                Image(systemName: "xmark")
                                    .foregroundStyle(.white)
                                    .font(.system(size: 8))
                                    .fontWeight(.bold)
                            )
                            .frame(width: 18, height: 18)
                            .shadow(color: .black.opacity(0.6), radius: 4)
                    }
                    .buttonStyle(PlainButtonStyle())
                    .offset(x: 10, y: -10)
                    .zIndex(100) // Ensure it's on top
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
