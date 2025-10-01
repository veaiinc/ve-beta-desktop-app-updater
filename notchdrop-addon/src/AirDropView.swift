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
        VStack(spacing: 8) {
            Image(systemName: "airplayaudio")
                .font(.system(size: 24))
            Text("AirDrop")
                .font(.system(size: 11, weight: .medium))
        }
        .foregroundStyle(.gray)
        .contentShape(Rectangle())
        .onTapGesture {
            trigger = .init()
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                let picker = NSOpenPanel()
                picker.allowsMultipleSelection = true
                picker.canChooseDirectories = true
                picker.canChooseFiles = true
                picker.begin { response in
                    if response == .OK {
                        let drop = AirDrop(files: picker.urls)
                        drop.begin()
                    }
                }
            }
        }
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
