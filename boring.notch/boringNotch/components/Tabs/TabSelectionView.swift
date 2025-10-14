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


struct TabSelectionView: View, WebSocketEventListener {
    @ObservedObject var coordinator = BoringViewCoordinator.shared
    @StateObject private var webSocketManager = WebSocketManager.shared
    @Namespace var animation
    @State var meetingLoading: Bool = false
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            if coordinator.isMeetingStarted && coordinator.currentView == .meeting {
                // Show only Home tab and MeetingButtons while meeting is ongoing
                let homeTab = tabs[0]
                HStack(spacing: 0) {
                    TabItem(
                        tab: homeTab,
                        selected: coordinator.currentView == homeTab.view,
                        animation: animation,
                        onTap: {
                            withAnimation(.smooth) {
                                selectTab(homeTab.view)
                            }
                        }
                    )
                    MeetingButtons()
                }
            } else {
                HStack(spacing: 0) {
                    ForEach(tabs) { tab in
                            TabItem(
                                tab: tab,
                                selected: coordinator.currentView == tab.view,
                                animation: animation,
                                onTap: {
                                    withAnimation(.smooth) {
                                        selectTab(tab.view)
                                        
                                        // Send START_MEETING event when Listen tab is clicked
                                        if tab.view == .meeting && !coordinator.isMeetingStarted && !meetingLoading {
                                            webSocketManager.sendEvent(type: .startMeeting, data: ["source": "tab_selection"])
                                        }
                                    }
                                }
                            )
                        
                    }
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .onAppear {
            // Restore the last selected tab
            coordinator.currentView = coordinator.selectedTab
            webSocketManager.addEventListener(self)
        }
        .onDisappear {
            webSocketManager.removeEventListener(self)
        }
    }
    
    private func selectTab(_ view: NotchViews) {
        coordinator.currentView = view
        // Persist selection explicitly (also handled by didSet on currentView)
        coordinator.selectedTab = view
        
        if view == .meeting || view == .ask {
            DispatchQueue.main.async {
                if let window = NSApplication.shared.windows.first(where: { $0 is BoringNotchWindow }) {
                    window.makeKeyAndOrderFront(nil)
                }
            }
        }
    }
    
    // MARK: - WebSocketEventListener
    func onWebSocketEvent(_ event: WebSocketEvent) {
        switch event.type {
        case .meetingStarted:
            meetingLoading = false
            coordinator.meetingStart()
        case .startMeeting:
            meetingLoading = true
        case .meetingPaused, .pauseMeeting:
            coordinator.meetingPause()
        case .meetingResumed, .resumeMeeting:
            coordinator.meetingResume()
        case .meetingStopped, .stopMeeting:
            coordinator.meetingStopAndReset()
            meetingLoading = false
            // Switch to home tab when meeting is stopped
            if coordinator.currentView == .meeting {
                coordinator.currentView = .home
            }
        default:
            break
        }
    }
}

#Preview {
    BoringHeader().environmentObject(BoringViewModel())
}

