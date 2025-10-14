//
//  TabSelectionView.swift
//  boringNotch
//
//  Created by Hugo Persson on 2024-08-25.
//

import SwiftUI

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

    var body: some View {
        TabButton(selected: selected, onClick: onTap) {
            if selected {
                HStack(alignment: .center, spacing: 0) {
                    TabContentView(tab: tab, isSelected: selected)
                }
                .padding(.horizontal, 12)
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
                .padding(.horizontal, 12)
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
        isSelected ? .white : Color.white.opacity(0.7)
    }

    var body: some View {
        switch tab.displayStyle {
        case .homeIcon:
            HomeTabIcon(strokeColor: iconColor)
                .frame(width: 16, height: 16)
        case .shelfIcon:
            ShelfTabIcon(strokeColor: iconColor)
                .frame(width: 16, height: 16)
        case .systemSymbol(let name):
            Image(systemName: name)
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(iconColor)
        case .textLabel(let text):
            Text(text)
                .font(.footnote)
                .foregroundColor(iconColor)
                .lineLimit(1)
                .fixedSize(horizontal: true, vertical: false)
        }
    }
}

private struct HomeTabIcon: View {
    let strokeColor: Color

    var body: some View {
        GeometryReader { geometry in
            let minSide = min(geometry.size.width, geometry.size.height)
            let scale = minSide / 14.0
            let offsetX = (geometry.size.width - minSide) / 2.0
            let offsetY = (geometry.size.height - minSide) / 2.0

            let baseTransform = CGAffineTransform.identity
                .scaledBy(x: scale, y: scale)

            let translatedOutline = homeOutline
                .applying(baseTransform)
                .offsetBy(dx: offsetX, dy: offsetY)

            let translatedDoor = homeDoor
                .applying(baseTransform)
                .offsetBy(dx: offsetX, dy: offsetY)

            ZStack {
                translatedOutline.stroke(
                    strokeColor,
                    style: StrokeStyle(
                        lineWidth: 1.16667 * scale,
                        lineCap: .round,
                        lineJoin: .round
                    )
                )
                translatedDoor.stroke(
                    strokeColor,
                    style: StrokeStyle(
                        lineWidth: 1.16667 * scale,
                        lineCap: .round,
                        lineJoin: .round
                    )
                )
            }
        }
        .frame(width: 14, height: 14)
    }

    private var homeOutline: Path {
        var path = Path()
        path.move(to: CGPoint(x: 1.75, y: 5.83492))
        path.addCurve(
            to: CGPoint(x: 1.85838, y: 5.34358),
            control1: CGPoint(x: 1.74996, y: 5.6652),
            control2: CGPoint(x: 1.78694, y: 5.49753)
        )
        path.addCurve(
            to: CGPoint(x: 2.16358, y: 4.94358),
            control1: CGPoint(x: 1.92981, y: 5.18964),
            control2: CGPoint(x: 2.03397, y: 5.05313)
        )
        path.addLine(to: CGPoint(x: 6.24692, y: 1.44358))
        path.addCurve(
            to: CGPoint(x: 7.0, y: 1.16797),
            control1: CGPoint(x: 6.45749, y: 1.26561),
            control2: CGPoint(x: 6.72429, y: 1.16797)
        )
        path.addCurve(
            to: CGPoint(x: 7.75308, y: 1.44358),
            control1: CGPoint(x: 7.27571, y: 1.16797),
            control2: CGPoint(x: 7.54251, y: 1.26561)
        )
        path.addLine(to: CGPoint(x: 11.8364, y: 4.94358))
        path.addCurve(
            to: CGPoint(x: 12.1416, y: 5.34358),
            control1: CGPoint(x: 11.966, y: 5.05313),
            control2: CGPoint(x: 12.0702, y: 5.18964)
        )
        path.addCurve(
            to: CGPoint(x: 12.25, y: 5.83492),
            control1: CGPoint(x: 12.2131, y: 5.49753),
            control2: CGPoint(x: 12.25, y: 5.6652)
        )
        path.addLine(to: CGPoint(x: 12.25, y: 11.0849))
        path.addCurve(
            to: CGPoint(x: 11.9083, y: 11.9099),
            control1: CGPoint(x: 12.25, y: 11.3943),
            control2: CGPoint(x: 12.1271, y: 11.6911)
        )
        path.addCurve(
            to: CGPoint(x: 11.0833, y: 12.2516),
            control1: CGPoint(x: 11.6895, y: 12.1287),
            control2: CGPoint(x: 11.3928, y: 12.2516)
        )
        path.addLine(to: CGPoint(x: 2.91667, y: 12.2516))
        path.addCurve(
            to: CGPoint(x: 2.09171, y: 11.9099),
            control1: CGPoint(x: 2.60725, y: 12.2516),
            control2: CGPoint(x: 2.3105, y: 12.1287)
        )
        path.addCurve(
            to: CGPoint(x: 1.75, y: 11.0849),
            control1: CGPoint(x: 1.87292, y: 11.6911),
            control2: CGPoint(x: 1.75, y: 11.3943)
        )
        path.addLine(to: CGPoint(x: 1.75, y: 5.83492))
        path.closeSubpath()
        return path
    }

    private var homeDoor: Path {
        var path = Path()
        path.move(to: CGPoint(x: 8.75, y: 12.2516))
        path.addLine(to: CGPoint(x: 8.75, y: 7.58492))
        path.addCurve(
            to: CGPoint(x: 8.57915, y: 7.17244),
            control1: CGPoint(x: 8.75, y: 7.43021),
            control2: CGPoint(x: 8.68854, y: 7.28183)
        )
        path.addCurve(
            to: CGPoint(x: 8.16667, y: 7.00158),
            control1: CGPoint(x: 8.46975, y: 7.06304),
            control2: CGPoint(x: 8.32138, y: 7.00158)
        )
        path.addLine(to: CGPoint(x: 5.83333, y: 7.00158))
        path.addCurve(
            to: CGPoint(x: 5.42085, y: 7.17244),
            control1: CGPoint(x: 5.67862, y: 7.00158),
            control2: CGPoint(x: 5.53025, y: 7.06304)
        )
        path.addCurve(
            to: CGPoint(x: 5.25, y: 7.58492),
            control1: CGPoint(x: 5.31146, y: 7.28183),
            control2: CGPoint(x: 5.25, y: 7.43021)
        )
        path.addLine(to: CGPoint(x: 5.25, y: 12.2516))
        return path
    }
}

// New custom Shelf icon, scaled to match 14x14 canvas like HomeTabIcon
private struct ShelfTabIcon: View {
    let strokeColor: Color

    var body: some View {
        GeometryReader { geometry in
            let minSide = min(geometry.size.width, geometry.size.height)
            let scale = minSide / 14.0
            let offsetX = (geometry.size.width - minSide) / 2.0
            let offsetY = (geometry.size.height - minSide) / 2.0

            let lw = 1.16667 * scale
            let stroke = StrokeStyle(lineWidth: lw, lineCap: .round, lineJoin: .round)

            // Helper to transform SVG-space points (14x14) into our local geometry
            let pt: (CGFloat, CGFloat) -> CGPoint = { x, y in
                CGPoint(x: offsetX + x * scale, y: offsetY + y * scale)
            }

            ZStack {
                // Top path: 12.8346 7 -> 9.3346 7 -> 8.168 8.75 -> 5.8346 8.75 -> 4.668 7 -> 1.168 7
                Path { p in
                    p.move(to: pt(12.8346, 7.0))
                    p.addLine(to: pt(9.33464, 7.0))
                    p.addLine(to: pt(8.16797, 8.75))
                    p.addLine(to: pt(5.83464, 8.75))
                    p.addLine(to: pt(4.66797, 7.0))
                    p.addLine(to: pt(1.16797, 7.0))
                }
                .stroke(strokeColor, style: stroke)

                // Bottom container (rounded rectangle) approximating V10.5 ... H11.668 ...
                Path { p in
                    let rect = CGRect(
                        x: offsetX + 1.16797 * scale,
                        y: offsetY + 7.0 * scale,
                        width: (12.8346 - 1.16797) * scale,
                        height: (11.6667 - 7.0) * scale
                    )
                    p.addRoundedRect(in: rect, cornerSize: CGSize(width: 1.2 * scale, height: 1.2 * scale))
                }
                .stroke(strokeColor, style: stroke)

                // Lid slants: approximate the top housing from left/right supports
                Path { p in
                    p.move(to: pt(1.16797, 7.0))
                    p.addLine(to: pt(3.18, 2.98083))
                    p.move(to: pt(12.8346, 7.0))
                    p.addLine(to: pt(10.8221, 2.98083))
                    // top edge hint
                    p.move(to: pt(4.22464, 2.33333))
                    p.addLine(to: pt(9.77797, 2.33333))
                }
                .stroke(strokeColor, style: stroke)
            }
        }
        .frame(width: 14, height: 14)
    }
}

struct TabSelectionView: View {
    @ObservedObject var coordinator = BoringViewCoordinator.shared
    @StateObject private var webSocketManager = WebSocketManager.shared
    @Namespace var animation
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(alignment: .center, spacing: 4) {
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
                                    let message = """
                                    {"type":"START_MEETING","data":{}}
                                    """
                                    webSocketManager.sendMessage(message)
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
        }
        .frame(maxWidth: .infinity, minHeight: 24, maxHeight: 24, alignment: .leading)
    }
}

#Preview {
    BoringHeader().environmentObject(BoringViewModel())
}
