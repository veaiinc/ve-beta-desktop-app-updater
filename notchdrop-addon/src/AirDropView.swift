//
//  AirDropView.swift
//  NotchDrop
//
//  Adapted from boring.notch - AirDrop integration for NotchDrop
//

import SwiftUI
import UniformTypeIdentifiers

struct AirDropView: View {
    @ObservedObject var vm: NotchViewModel
    
    @State var trigger: UUID = .init()
    @State var targeting = false
    
    var body: some View {
        dropArea
            .onDrop(of: [.data], isTargeted: $targeting) { providers in
                trigger = .init()
                DispatchQueue.global().async { beginDrop(providers) }
                return true
            }
    }
    
    var dropArea: some View {
        Rectangle()
            .fill(.white.opacity(0.1))
            .opacity(targeting ? 0.8 : 0.5)
            .clipShape(RoundedRectangle(cornerRadius: vm.cornerRadius))
            .overlay { dropLabel }
            .frame(width: 80, height: 80)
            .contentShape(Rectangle())
            .animation(.easeInOut(duration: 0.2), value: targeting)
    }
    
    var dropLabel: some View {
        Button(action: {
            print("📤 AirDrop button clicked - getting tray items")
            trigger = .init()
            
            // Get all current tray items
            let trayItems = TrayDrop.shared.items
            
            if trayItems.isEmpty {
                print("⚠️ No items in tray, opening file picker instead")
                // No items, open picker
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                    let picker = NSOpenPanel()
                    picker.allowsMultipleSelection = true
                    picker.canChooseDirectories = true
                    picker.canChooseFiles = true
                    picker.begin { response in
                        if response == .OK {
                            print("📤 Sharing \(picker.urls.count) files via AirDrop")
                            let drop = AirDrop(files: picker.urls)
                            drop.begin()
                        }
                    }
                }
            } else {
                // Share all tray items via AirDrop
                print("📤 Sharing \(trayItems.count) tray items via AirDrop")
                let urls = trayItems.map { $0.storageURL }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                    let drop = AirDrop(files: urls)
                    drop.begin()
                }
            }
        }) {
            VStack(spacing: 8) {
                Image(systemName: "airplayaudio")
                    .font(.system(size: 24))
                Text("AirDrop")
                    .font(.system(size: 11, weight: .medium))
            }
            .foregroundStyle(.gray)
        }
        .buttonStyle(PlainButtonStyle())
        .contentShape(Rectangle())
    }
    
    func beginDrop(_ providers: [NSItemProvider]) {
        assert(!Thread.isMainThread)
        guard let urls = providers.interfaceConvert() else { return }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            let drop = AirDrop(files: urls)
            drop.begin()
        }
    }
}
