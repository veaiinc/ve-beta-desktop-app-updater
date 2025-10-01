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
                RoundedRectangle(cornerRadius: 6)
                    .fill(.clear)
                    .background {
                        Image(nsImage: item.workspacePreviewImage)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .clipShape(RoundedRectangle(cornerRadius: 6))
                    }
                    .frame(width: 64, height: 64)
                
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
                vm.notchClose()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    NSWorkspace.shared.open(item.storageURL)
                }
            }
            
            // Delete button (only visible when option key is pressed)
            if hover && coordinator.optionKeyPressed {
                Circle()
                    .fill(.white)
                    .overlay(
                        Image(systemName: "xmark")
                            .foregroundStyle(.black)
                            .font(.system(size: 7))
                            .fontWeight(.semibold)
                    )
                    .frame(width: spacing, height: spacing)
                    .scaleEffect(1.0)
                    .transition(.scale.combined(with: .opacity))
                    .offset(x: spacing / 2, y: -spacing / 2)
                    .onTapGesture { tvm.delete(item.id) }
                    .shadow(color: .black.opacity(0.3), radius: 3)
            }
        }
        .scaleEffect(hover ? 1.05 : 1.0)
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: hover)
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: coordinator.optionKeyPressed)
        .onHover { hovering in
            withAnimation(.smooth(duration: 0.2)) {
                hover = hovering
            }
        }
    }

    private func handleOnDrag(for item: TrayDrop.DropItem) -> NSItemProvider {
        guard let itemProvider = NSItemProvider(contentsOf: item.storageURL) else {
            return NSItemProvider()
        }
        
        let nameWithoutExtension = (item.fileName as NSString).deletingPathExtension
        itemProvider.suggestedName = nameWithoutExtension
        
        return itemProvider
    }
}
