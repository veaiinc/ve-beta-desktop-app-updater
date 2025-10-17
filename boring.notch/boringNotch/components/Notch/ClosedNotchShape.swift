//
//  NotchShape.swift
//  boringNotch
//
// Created by Kai Azim on 2023-08-24.
// Original source: https://github.com/MrKai77/DynamicNotchKit
// Modified by Alexander on 2025-05-18.

import SwiftUI
import LucideIcons

struct ClosedNotchShape: Shape {
    private var topCornerRadius: CGFloat
    private var bottomCornerRadius: CGFloat

    init(
        topCornerRadius: CGFloat? = nil,
        bottomCornerRadius: CGFloat? = nil
    ) {
        self.topCornerRadius = topCornerRadius ?? 6
        self.bottomCornerRadius = bottomCornerRadius ?? 14
    }

    var animatableData: AnimatablePair<CGFloat, CGFloat> {
        get {
            .init(
                topCornerRadius,
                bottomCornerRadius
            )
        }
        set {
            topCornerRadius = newValue.first
            bottomCornerRadius = newValue.second
        }
    }

    func path(in rect: CGRect) -> Path {
        var path = Path()

       path.move(
            to: CGPoint(
                x: rect.minX,
                y: rect.minY
            )
        )

        path.addQuadCurve(
            to: CGPoint(
                x: rect.minX + topCornerRadius,
                y: rect.minY + topCornerRadius
            ),
            control: CGPoint(
                x: rect.minX + topCornerRadius,
                y: rect.minY
            )
        )

        path.addLine(
            to: CGPoint(
                x: rect.minX + topCornerRadius,
                y: rect.maxY - bottomCornerRadius
            )
        )

        path.addQuadCurve(
            to: CGPoint(
                x: rect.minX + topCornerRadius + bottomCornerRadius,
                y: rect.maxY
            ),
            control: CGPoint(
                x: rect.minX + topCornerRadius,
                y: rect.maxY
            )
        )

        path.addLine(
            to: CGPoint(
                x: rect.maxX - topCornerRadius - bottomCornerRadius,
                y: rect.maxY
            )
        )

        path.addQuadCurve(
            to: CGPoint(
                x: rect.maxX - topCornerRadius,
                y: rect.maxY - bottomCornerRadius
            ),
            control: CGPoint(
                x: rect.maxX - topCornerRadius,
                y: rect.maxY
            )
        )

        path.addLine(
            to: CGPoint(
                x: rect.maxX - topCornerRadius,
                y: rect.minY + topCornerRadius
            )
        )

        path.addQuadCurve(
            to: CGPoint(
                x: rect.maxX,
                y: rect.minY
            ),
            control: CGPoint(
                x: rect.maxX - topCornerRadius,
                y: rect.minY
            )
        )

        path.addLine(
            to: CGPoint(
                x: rect.minX,
                y: rect.minY
            )
        )

        return path
    }
}

struct ClosedNotchContentView: View {

    private struct HomeTabIcon: View {
        let strokeColor: Color

        var body: some View {
            #if canImport(AppKit)
            if let houseIcon = NSImage.image(lucideId: "house") {
                Image(nsImage: houseIcon)
                    .renderingMode(.template)
                    .foregroundColor(strokeColor)
                    .frame(width: 13, height: 13)
            }
            #endif
        }
    }

    private struct ShelfTabIcon: View {
        let strokeColor: Color

        var body: some View {
            #if canImport(AppKit)
            if let inboxIcon = NSImage.image(lucideId: "inbox") {
                Image(nsImage: inboxIcon)
                    .renderingMode(.template)
                    .foregroundColor(strokeColor)
                    .frame(width: 13, height: 13)
            }
            #endif
        }
    }

    var body: some View {
        HStack(alignment: .center, spacing: 0) {
            // Ve logo on the left
            Image("ve-logo")
                .resizable()
                .renderingMode(.template)
                .foregroundColor(.white)
                .aspectRatio(contentMode: .fit)
                .frame(width: 50, height: 32)
                .padding(.leading, -5)
            
            Spacer()
        }
        .padding(.horizontal, 0)
        .padding(.vertical, 0)
    }
}

#Preview {
    ZStack {
        ClosedNotchShape(topCornerRadius: 6, bottomCornerRadius: 14)
            .frame(width: 300, height: 32)
        
        ClosedNotchContentView()
    }
    .padding(10)
}
