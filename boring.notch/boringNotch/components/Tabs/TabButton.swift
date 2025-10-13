//
//  TabButton.swift
//  boringNotch
//
//  Created by Hugo Persson on 2024-08-24.
//  Updated to support arbitrary content rendering.
//

import SwiftUI

struct TabButton<Content: View>: View {
    let selected: Bool
    let onClick: () -> Void
    @ViewBuilder var content: () -> Content
    
    var body: some View {
        Button(action: onClick) {
            content()
                .padding(.horizontal, 15)
                .contentShape(Capsule())
        }
        .buttonStyle(PlainButtonStyle())
    }
}

#Preview {
    TabButton(selected: true, onClick: {}) {
        HStack(spacing: 6) {
            Image(systemName: "tray.fill")
            Text("Home")
        }
    }
}
