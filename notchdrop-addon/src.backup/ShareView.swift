//
//  Share+View.swift
//  NotchDrop
//
//  Created by 秋星桥 on 2024/7/8.
//  Last Modified by 冷月 on 2025/5/5.
//

import SwiftUI
import UniformTypeIdentifiers

struct ShareView: View {
    enum ShareType {
        case airdrop
        case generic

        var imageName: String {
            switch self {
            case .airdrop: return "airplayaudio"
            case .generic: return "arrow.up.circle"
            }
        }

        var title: String {
            switch self {
            case .airdrop: return NSLocalizedString("AirDrop", comment: "AirDrop sharing title")
            case .generic: return NSLocalizedString("Share", comment: "Generic sharing title")
            }
        }

        var service: ( [URL] ) -> Share {
            switch self {
            case .airdrop:
                return { urls in Share(files: urls, serviceName: .sendViaAirDrop) }
            case .generic:
                return { urls in Share(files: urls) }
            }
        }

        var gradientColors: [Color] {
            switch self {
            case .airdrop: return [.blue, .purple, .pink]
            case .generic: return [.green, .blue, .teal]
            }
        }
    }

    @StateObject var vm: NotchViewModel
    let type: ShareType

    @State var trigger: UUID = .init()
    @State var targeting = false
    @State var isHovered = false

    var body: some View {
        dropArea
            .onDrop(of: [.data], isTargeted: $targeting) { providers in
                trigger = .init()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) {
                    vm.notchClose()
                }
                DispatchQueue.global().async { beginDrop(providers) }
                return true
            }
    }

    var dropArea: some View {
        ZStack {
            // Background gradient
            RoundedRectangle(cornerRadius: vm.cornerRadius)
                .fill(
                    LinearGradient(
                        colors: targeting ? type.gradientColors : [.gray.opacity(0.3)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .opacity(targeting ? 0.8 : 0.6)
                .scaleEffect(targeting ? 1.05 : (isHovered ? 1.02 : 1.0))
                .animation(.spring(response: 0.3, dampingFraction: 0.7), value: targeting)
                .animation(.spring(response: 0.2, dampingFraction: 0.8), value: isHovered)
            
            // Content
            dropLabel
                .scaleEffect(targeting ? 1.1 : (isHovered ? 1.05 : 1.0))
                .animation(.spring(response: 0.3, dampingFraction: 0.7), value: targeting)
                .animation(.spring(response: 0.2, dampingFraction: 0.8), value: isHovered)
        }
        .aspectRatio(1, contentMode: .fit)
        .contentShape(Rectangle())
        .onHover { hovering in
            isHovered = hovering
        }
        .shadow(
            color: .black.opacity(targeting ? 0.3 : 0.1),
            radius: targeting ? 12 : 8,
            x: 0,
            y: targeting ? 6 : 4
        )
    }

    var dropLabel: some View {
        VStack(spacing: 12) {
            Image(systemName: type.imageName)
                .font(.system(size: 24, weight: .medium))
                .foregroundStyle(.white)
                .shadow(color: .black.opacity(0.3), radius: 2, x: 0, y: 1)
            
            Text(type.title)
                .font(.system(.headline, design: .rounded, weight: .semibold))
                .foregroundStyle(.white)
                .shadow(color: .black.opacity(0.3), radius: 1, x: 0, y: 1)
        }
        .contentShape(Rectangle())
        .onTapGesture {
            trigger = .init()
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) {
                vm.notchClose()
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                let picker = NSOpenPanel()
                picker.allowsMultipleSelection = true
                picker.canChooseDirectories = true
                picker.canChooseFiles = true
                picker.begin { response in
                    if response == .OK {
                        let drop = type.service(picker.urls)
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
            let drop = type.service(urls)
            drop.begin()
        }
    }
}

#Preview {
    HStack(spacing: 16) {
        ShareView(vm: .init(), type: .airdrop)
        ShareView(vm: .init(), type: .generic)
    }
    .padding()
    .frame(width: 400, height: 150, alignment: .center)
    .background(.black)
    .preferredColorScheme(.dark)
}

// MARK: - Share Service Implementation
struct Share {
    let files: [URL]
    let serviceName: NSSharingService.Name?

    func begin() {
        guard let serviceName = serviceName else {
            // Generic share - open system share menu
            NSSharingServicePicker(items: files).show(relativeTo: .zero, of: NSApp.keyWindow!, preferredEdge: .minY)
            return
        }

        // Specific service (like AirDrop)
        if let service = NSSharingService(named: serviceName) {
            service.perform(withItems: files)
        }
    }
}

// MARK: - Extension for NSItemProvider
extension Array where Element == NSItemProvider {
    func interfaceConvert() -> [URL]? {
        var urls: [URL] = []

        for provider in self {
            if provider.hasItemConformingToTypeIdentifier("public.file-url") {
                provider.loadItem(forTypeIdentifier: "public.file-url", options: nil) { (item, error) in
                    if let url = item as? URL {
                        urls.append(url)
                    }
                }
            }
        }

        return urls.isEmpty ? nil : urls
    }
}
