//
//  TabSelectionView.swift
//  boringNotch
//
//  Created by Hugo Persson on 2024-08-25.
//

import SwiftUI

struct TabModel: Identifiable {
    let id = UUID()
    let label: String
    let icon: String
    let view: NotchViews
}

let tabs = [
    TabModel(label: "Home", icon: "house.fill", view: .home),
    TabModel(label: "Shelf", icon: "tray.fill", view: .shelf),
    TabModel(label: "Listen", icon: "", view: .meeting),
    TabModel(label: "Ask", icon: "", view: .ask)
]

private struct TabItem: View {
    let tab: TabModel
    let selected: Bool
    let animation: Namespace.ID
    let onTap: () -> Void

    var body: some View {
        TabButton(selected: selected, onClick: onTap) {
            HStack(spacing: 6) {
                if tab.icon.isEmpty {
                    Text(tab.label)
                        .font(.footnote)
                        .lineLimit(1)
                        .fixedSize(horizontal: true, vertical: false)
                        .layoutPriority(10)
                        .allowsTightening(false)
                } else {
                    Image(systemName: tab.icon)
                }
            }
            .padding(.horizontal, 0)
        }
        .frame(height: 26)
        .foregroundStyle(selected ? .white : .gray)
        .background {
            if selected {
                Capsule()
                    .fill(Color(nsColor: .secondarySystemFill))
                    .matchedGeometryEffect(id: "capsule", in: animation)
            } else {
                Capsule()
                    .fill(Color.clear)
                    .matchedGeometryEffect(id: "capsule", in: animation)
                    .hidden()
            }
        }
    }
}

struct TabSelectionView: View {
    @ObservedObject var coordinator = BoringViewCoordinator.shared
    @Namespace var animation
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 0) {
                ForEach(tabs) { tab in
                    TabItem(
                        tab: tab,
                        selected: coordinator.currentView == tab.view,
                        animation: animation,
                        onTap: {
                            withAnimation(.smooth) {
                                coordinator.currentView = tab.view
                                if tab.view == .meeting || tab.view == .ask {
                                    DispatchQueue.main.async {
                                        if let window = NSApplication.shared.windows.first(where: { $0 is BoringNotchWindow }) {
                                            window.makeKeyAndOrderFront(nil)
                                        }
                                    }
                                }
                            }
                        }
                    )
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

#Preview {
    BoringHeader().environmentObject(BoringViewModel())
}

