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

        var gradientColorsTargeting: [Color] {
            switch self {
            case .airdrop: return [.blue, .purple, .pink]
            case .generic: return [.orange, .red, .yellow]
            }
        }

        var gradientColorsNormal: [Color] {
            switch self {
            case .airdrop: return [.blue, .cyan, .purple]
            case .generic: return [.green, .blue, .teal]
            }
        }
    }

    @StateObject var vm: NotchViewModel
    let type: ShareType

    @State var trigger: UUID = .init()
    @State var targeting = false

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
        RoundedRectangle(cornerRadius: vm.cornerRadius)
            .fill(
                LinearGradient(
                    colors: targeting ? type.gradientColorsTargeting : type.gradientColorsNormal,
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .opacity(0.5)
            .overlay { dropLabel }
            .aspectRatio(1, contentMode: .fit)
            .contentShape(Rectangle())
            .scaleEffect(targeting ? 1.05 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.7), value: targeting)
    }

    var dropLabel: some View {
        VStack(spacing: 8) {
            Image(systemName: type.imageName)
            Text(type.title)
        }
        .font(.system(.headline, design: .rounded))
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
