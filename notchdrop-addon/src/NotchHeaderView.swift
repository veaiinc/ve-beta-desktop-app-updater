//
//  NotchHeaderView.swift
//  NotchDrop
//
//  Created by 秋星桥 on 2024/7/7.
//

import SwiftUI

struct NotchHeaderView: View {
    @StateObject var vm: NotchViewModel

    var body: some View {
        HStack {
            Text("Living Intelligence")
                .font(.system(.headline, design: .rounded))
                .foregroundColor(.white)
            Spacer()
            Button(action: {
                vm.showSettings()
            }) {
                Image(systemName: "ellipsis")
                    .font(.system(size: 16))
                    .foregroundColor(.white)
                    .frame(width: 24, height: 24)
                    .background(Color.white.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
            .buttonStyle(PlainButtonStyle())
        }
        .animation(vm.animation, value: vm.contentType)
    }
}

#Preview {
    NotchHeaderView(vm: .init())
}
