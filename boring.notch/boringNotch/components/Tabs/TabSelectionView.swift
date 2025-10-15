//
//  TabSelectionView.swift
//  boringNotch
//
//  Created by Hugo Persson on 2024-08-25.
//

import Foundation
import SwiftUI
import LucideIcons

enum TabDisplayStyle {
    case homeIcon
    case shelfIcon
    case systemSymbol(name: String)
    case textLabel(String)
}

struct TabModel: Identifiable {
    let id = UUID()
    let label: String
    let displayStyle: TabDisplayStyle
    let view: NotchViews
}

let tabs = [
    TabModel(label: "Home", displayStyle: .homeIcon, view: .home),
    TabModel(label: "Shelf", displayStyle: .shelfIcon, view: .shelf),
    TabModel(label: "Listen", displayStyle: .textLabel("Listen"), view: .meeting),
    TabModel(label: "Ask", displayStyle: .textLabel("Ask"), view: .ask)
]


private struct TabItem: View {
    let tab: TabModel
    let selected: Bool
    let animation: Namespace.ID
    let onTap: () -> Void
    @State private var isHovering = false

    // Reduce padding for text tabs (Listen, Ask) to bring them closer together
    private var horizontalPadding: CGFloat {
        switch tab.displayStyle {
        case .textLabel:
            return 8
        default:
            return 12
        }
    }

    var body: some View {
        TabButton(selected: selected, onClick: onTap) {
            if selected {
                HStack(alignment: .center, spacing: 0) {
                    TabContentView(tab: tab, isSelected: selected)
                }
                .padding(.horizontal, horizontalPadding)
                .padding(.vertical, 2)
                .frame(height: 24, alignment: .center)
                .background(Color.white.opacity(0.1))
                .cornerRadius(24)
                .overlay(
                    RoundedRectangle(cornerRadius: 24)
                        .inset(by: 0.25)
                        .stroke(Color.white.opacity(0.4), lineWidth: 0.5)
                )
            } else {
                HStack(alignment: .center, spacing: 0) {
                    TabContentView(tab: tab, isSelected: selected)
                }
                .padding(.horizontal, horizontalPadding)
                .padding(.vertical, 2)
                .frame(height: 24, alignment: .center)
                .background(isHovering ? Color(red: 1, green: 1, blue: 1).opacity(0.12) : Color.clear)
                .cornerRadius(24)
                .onHover { hovering in
                    isHovering = hovering
                }
            }
        }
        .frame(height: 26)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text(tab.label))
    }
}

private struct TabContentView: View {
    let tab: TabModel
    let isSelected: Bool

    private var iconColor: Color {
        .white
    }

    var body: some View {
        switch tab.displayStyle {
        case .homeIcon:
            #if canImport(AppKit)
            if let houseIcon = NSImage.image(lucideId: "house") {
                Image(nsImage: houseIcon)
                    .renderingMode(.template)
                    .foregroundColor(iconColor)
                    .frame(width: 13, height: 13)
            }
            #endif
        case .shelfIcon:
            #if canImport(AppKit)
            if let inboxIcon = NSImage.image(lucideId: "inbox") {
                Image(nsImage: inboxIcon)
                    .renderingMode(.template)
                    .foregroundColor(iconColor)
                    .frame(width: 13, height: 13)
            }
            #endif
        case .systemSymbol(let name):
            Image(systemName: name)
                .font(.system(size: 21, weight: .semibold))
                .foregroundColor(iconColor)
        case .textLabel(let text):
            Text(text)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.white)
                .lineLimit(1)
                .fixedSize(horizontal: true, vertical: false)
        }
    }
}

struct TabSelectionView: View {
    @ObservedObject var coordinator = BoringViewCoordinator.shared
    @StateObject private var webSocketManager = WebSocketManager.shared
    @Namespace var animation
    @State var meetingLoading: Bool = false
    
    var body: some View {
        HStack(spacing: 6) {
            ForEach(tabs) { tab in
                TabItem(
                    tab: tab,
                    selected: coordinator.currentView == tab.view,
                    animation: animation,
                    onTap: {
                        withAnimation(.smooth) {
                            coordinator.currentView = tab.view
                            
                            // Send START_MEETING message when Listen tab is clicked
                            if tab.view == .meeting {
                                webSocketManager.sendEvent(type: .startMeeting)
                            }
                            
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
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.top, 2)
    }
}

#Preview {
    BoringHeader().environmentObject(BoringViewModel())
}