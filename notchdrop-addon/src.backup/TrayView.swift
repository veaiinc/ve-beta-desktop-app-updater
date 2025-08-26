//
//  TrayDrop+View.swift
//  NotchDrop
//
//  Created by 秋星桥 on 2024/7/8.
//

import SwiftUI

struct TrayView: View {
    @StateObject var vm: NotchViewModel
    @StateObject var tvm = TrayDrop.shared

    @State private var targeting = false
    @State private var isHovered = false

    var storageTime: String {
        switch tvm.selectedFileStorageTime {
        case .oneHour:
            return NSLocalizedString("an hour", comment: "")
        case .oneDay:
            return NSLocalizedString("a day", comment: "")
        case .twoDays:
            return NSLocalizedString("two days", comment: "")
        case .threeDays:
            return NSLocalizedString("three days", comment: "")
        case .oneWeek:
            return NSLocalizedString("a week", comment: "")
        case .never:
            return NSLocalizedString("forever", comment: "")
        case .custom:
            let localizedTimeUnit = NSLocalizedString(tvm.customStorageTimeUnit.localized.lowercased(), comment: "")
            return "\(tvm.customStorageTime) \(localizedTimeUnit)"
        }
    }

    var body: some View {
        panel
            .onDrop(of: [.data], isTargeted: $targeting) { providers in
                DispatchQueue.global().async { tvm.load(providers) }
                return true
            }
    }

    var panel: some View {
        ZStack {
            // Background with gradient border
            RoundedRectangle(cornerRadius: vm.cornerRadius)
                .fill(.black.opacity(0.2))
                .overlay(
                    RoundedRectangle(cornerRadius: vm.cornerRadius)
                        .strokeBorder(
                            LinearGradient(
                                colors: targeting ? [.blue, .purple, .pink] : [.white.opacity(0.3), .white.opacity(0.1)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ),
                            style: StrokeStyle(lineWidth: targeting ? 3 : 2, dash: targeting ? [] : [8, 4])
                        )
                )
                .background(loading)
                .scaleEffect(targeting ? 1.02 : (isHovered ? 1.01 : 1.0))
                .animation(.spring(response: 0.3, dampingFraction: 0.8), value: targeting)
                .animation(.spring(response: 0.2, dampingFraction: 0.9), value: isHovered)
            
            // Content
            content
                .padding()
        }
        .onHover { hovering in
            isHovered = hovering
        }
        .animation(vm.animation, value: tvm.items)
        .animation(vm.animation, value: tvm.isLoading)
        .shadow(
            color: .black.opacity(targeting ? 0.4 : 0.2),
            radius: targeting ? 16 : 8,
            x: 0,
            y: targeting ? 8 : 4
        )
    }

    var loading: some View {
        RoundedRectangle(cornerRadius: vm.cornerRadius)
            .fill(.white.opacity(0.05))
            .conditionalEffect(
                .repeat(
                    .glow(color: .blue, radius: 50),
                    every: 1.5
                ),
                condition: tvm.isLoading > 0
            )
            .overlay(
                // Pulsing border when loading
                RoundedRectangle(cornerRadius: vm.cornerRadius)
                    .strokeBorder(.blue.opacity(0.6), lineWidth: 2)
                    .scaleEffect(tvm.isLoading > 0 ? 1.05 : 1.0)
                    .opacity(tvm.isLoading > 0 ? 0.8 : 0.0)
                    .animation(.easeInOut(duration: 1.0).repeatForever(autoreverses: true), value: tvm.isLoading)
            )
    }

    var text: String {
        [
            String(
                format: NSLocalizedString("Drag files here to keep them for %@", comment: ""),
                storageTime
            ),
            "&",
            NSLocalizedString("Press Option to delete", comment: ""),
        ].joined(separator: " ")
    }

    var content: some View {
        Group {
            if tvm.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "tray.and.arrow.down.fill")
                        .font(.system(size: 28, weight: .medium))
                        .foregroundStyle(.white.opacity(0.8))
                        .shadow(color: .black.opacity(0.3), radius: 2, x: 0, y: 1)
                    
                    Text(text)
                        .multilineTextAlignment(.center)
                        .font(.system(.headline, design: .rounded, weight: .medium))
                        .foregroundStyle(.white.opacity(0.9))
                        .shadow(color: .black.opacity(0.3), radius: 1, x: 0, y: 1)
                }
                .opacity(targeting ? 0.7 : 1.0)
                .scaleEffect(targeting ? 0.95 : 1.0)
                .animation(.spring(response: 0.3, dampingFraction: 0.7), value: targeting)
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: vm.spacing) {
                        ForEach(tvm.items) { item in
                            DropItemView(item: item, vm: vm, tvm: tvm)
                                .transition(.scale.combined(with: .opacity))
                        }
                    }
                    .padding(vm.spacing)
                }
                .padding(-vm.spacing)
                .scrollIndicators(.never)
            }
        }
    }
}

#Preview {
    TrayView(vm: .init())
        .padding()
        .frame(width: 300, height: 150, alignment: .center)
        .background(.black)
        .preferredColorScheme(.dark)
}
