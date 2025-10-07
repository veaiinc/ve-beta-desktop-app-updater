//
//  NotchMenuView.swift
//  NotchDrop
//
//  Created by 秋星桥 on 2024/7/11.
//

import SwiftUI

private let productPage = URL(string: "https://github.com/Lakr233/NotchDrop")!
private let sponsorPage = URL(string: "https://github.com/sponsors/Lakr233")!

struct NotchMenuView: View {
    @StateObject var vm: NotchViewModel
    @StateObject var tvm = TrayDrop.shared

    var body: some View {
        HStack(spacing: vm.spacing) {
            close
            github
            donate
            settings
            clear
        }
    }

    var github: some View {
        ColorButton(
            colors: [.blue, .purple, .pink],
            image: Image(systemName: "link"),
            title: "GitHub"
        )
        .onTapGesture {
            NSWorkspace.shared.open(productPage)
            vm.notchClose()
        }
        .clipShape(RoundedRectangle(cornerRadius: vm.cornerRadius))
    }

    var donate: some View {
        ColorButton(
            colors: [.red, .orange, .yellow],
            image: Image(systemName: "heart.fill"),
            title: "Love Drop"
        )
        .onTapGesture {
            NSWorkspace.shared.open(sponsorPage)
            vm.notchClose()
        }
        .clipShape(RoundedRectangle(cornerRadius: vm.cornerRadius))
    }

    var close: some View {
        ColorButton(
            colors: [.red],
            image: Image(systemName: "xmark"),
            title: "Exit"
        )
        .onTapGesture {
            vm.notchClose()
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) {
                NSApp.terminate(nil)
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: vm.cornerRadius))
    }

    var clear: some View {
        ColorButton(
            colors: [.red],
            image: Image(systemName: "trash"),
            title: "Clear"
        )
        .onTapGesture {
            tvm.removeAll()
            vm.notchClose()
        }
        .clipShape(RoundedRectangle(cornerRadius: vm.cornerRadius))
    }

    var settings: some View {
        ColorButton(
            colors: [.blue, .green, .teal],
            image: Image(systemName: "gear"),
            title: LocalizedStringKey("Settings")
        )
        .onTapGesture {
            vm.showSettings()
        }
        .clipShape(RoundedRectangle(cornerRadius: vm.cornerRadius))
    }
}

private struct ColorButton: View {
    let colors: [Color]
    let image: Image
    let title: LocalizedStringKey

    // Hover scaling removed to keep icon size fixed

    var body: some View {
        Color.white
            .opacity(0.1)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .fill(
                        LinearGradient(
                            colors: colors,
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .mask {
                        VStack(spacing: 8) {
                            Text("888888")
                                .hidden()
                                .overlay {
                                    image
                                        .resizable()
                                        .aspectRatio(contentMode: .fit)
                                }
                            Text(title)
                        }
                        .font(.system(.headline, design: .rounded))
                    }
                    .contentShape(Rectangle())
            )
            .aspectRatio(1, contentMode: .fit)
            .contentShape(Rectangle())
    }
}

#Preview {
    NotchMenuView(vm: .init())
        .padding()
        .frame(width: 600, height: 150, alignment: .center)
        .background(.black)
        .preferredColorScheme(.dark)
}
