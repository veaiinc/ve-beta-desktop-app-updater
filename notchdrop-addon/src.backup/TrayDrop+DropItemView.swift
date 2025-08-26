//
//  TrayDrop+DropItemView.swift
//  NotchDrop
//
//  Created by 秋星桥 on 2024/7/8.
//

import Foundation
import SwiftUI
import UniformTypeIdentifiers

struct DropItemView: View {
    let item: String
    @StateObject var vm: NotchViewModel
    @StateObject var tvm: TrayDrop

    var body: some View {
        VStack(spacing: 4) {
            // File icon or thumbnail
            Image(systemName: "doc")
                .font(.system(size: 24))
                .foregroundColor(.white)
            
            // File name
            Text(URL(fileURLWithPath: item).lastPathComponent)
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(.white)
                .lineLimit(2)
                .multilineTextAlignment(.center)
        }
        .frame(width: 60, height: 60)
        .background(Color.gray.opacity(0.3))
        .cornerRadius(8)
        .onTapGesture {
            // Handle tap - could open file or show options
            NSWorkspace.shared.open(URL(fileURLWithPath: item))
        }
        .contextMenu {
            Button("Open") {
                NSWorkspace.shared.open(URL(fileURLWithPath: item))
            }
            Button("Show in Finder") {
                NSWorkspace.shared.selectFile(item, inFileViewerRootedAtPath: "")
            }
            Divider()
            Button("Delete") {
                tvm.delete(item)
            }
        }
    }
}
