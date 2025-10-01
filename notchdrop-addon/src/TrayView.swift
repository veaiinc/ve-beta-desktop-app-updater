//
//  TrayView.swift (Enhanced with AirDrop)
//  NotchDrop
//
//  Enhanced with boring.notch AirDrop functionality
//

import SwiftUI
import UniformTypeIdentifiers

struct TrayView: View {
    @StateObject var vm: NotchViewModel
    @StateObject var tvm = TrayDrop.shared

    @State private var targeting = false
    
    // All supported file types for dropping
    private let acceptedTypes: [UTType] = [
        .fileURL,
        .url,
        .data,
        .item,
        .image,
        .png,
        .jpeg,
        .pdf,
        .plainText,
        .text,
        .movie,
        .video,
        .audio
    ]

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
            .background(
                // Native AppKit drop zone - BEHIND content so it doesn't block clicks
                DragDropViewRepresentable(isTargeted: $targeting) { urls in
                    print("🎯 TrayView: Native drop received \(urls.count) URLs!")
                    print("📂 Files: \(urls.map { $0.lastPathComponent })")
                    
                    // Convert URLs to NSItemProviders and load
                    DispatchQueue.global().async {
                        let providers = urls.map { url in
                            NSItemProvider(contentsOf: url)
                        }.compactMap { $0 }
                        
                        print("🔄 TrayView: Loading \(providers.count) providers via native drop")
                        self.tvm.load(providers)
                    }
                }
                .allowsHitTesting(false) // Don't block interactions
            )
    }

    // Custom teal color for drop zone
    private var dropHighlightColor: Color {
        Color(red: 0x79 / 255.0, green: 0xec / 255.0, blue: 0xc9 / 255.0)
    }
    
    var panel: some View {
        ZStack {
            RoundedRectangle(cornerRadius: vm.cornerRadius)
                .strokeBorder(style: StrokeStyle(lineWidth: 4, dash: [10]))
                .foregroundStyle(targeting ? dropHighlightColor.opacity(0.6) : .white.opacity(0.1))
                .background(loading)
            
            content
                .padding()
                .allowsHitTesting(true) // Allow all interactions (delete, AirDrop, etc.)
        }
        .animation(vm.animation, value: tvm.items)
        .animation(vm.animation, value: tvm.isLoading)
        .animation(.easeInOut(duration: 0.2), value: targeting)
        .onChange(of: targeting) { newValue in
            print("🎯 TrayView: Targeting changed to \(newValue)")
        }
        .onDrop(of: acceptedTypes, isTargeted: $targeting) { providers in
            print("🎯 TrayView: SwiftUI onDrop triggered with \(providers.count) providers")
            DispatchQueue.global().async {
                print("🔄 TrayView: Starting load via SwiftUI onDrop")
                tvm.load(providers)
            }
            return true
        }
    }

    var loading: some View {
        RoundedRectangle(cornerRadius: vm.cornerRadius)
            .foregroundStyle(targeting ? dropHighlightColor.opacity(0.15) : .white.opacity(0.1))
            .overlay(
                RoundedRectangle(cornerRadius: vm.cornerRadius)
                    .stroke(tvm.isLoading > 0 ? dropHighlightColor : .clear, lineWidth: tvm.isLoading > 0 ? 2 : 0)
                    .opacity(tvm.isLoading > 0 ? 0.8 : 0)
            )
            .animation(.easeInOut(duration: 0.3), value: tvm.isLoading)
            .animation(.easeInOut(duration: 0.2), value: targeting)
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
                HStack(spacing: vm.spacing) {
                    // Empty state with drop instructions
                    VStack(spacing: 8) {
                        Image(systemName: targeting ? "arrow.down.doc.fill" : "tray.and.arrow.down.fill")
                            .font(.system(size: 32))
                            .foregroundColor(targeting ? dropHighlightColor : .gray)
                        Text(targeting ? "Drop files here" : text)
                            .multilineTextAlignment(.center)
                            .font(.system(.headline, design: .rounded))
                            .foregroundColor(targeting ? dropHighlightColor : .gray)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .contentShape(Rectangle())
                    .animation(.easeInOut(duration: 0.2), value: targeting)
                    
                    // AirDrop zone - always visible
                    AirDropView(vm: vm)
                }
            } else {
                ScrollView(.horizontal) {
                    HStack(spacing: vm.spacing) {
                        // Tray items with enhanced styling
                        ForEach(tvm.items) { item in
                            EnhancedDropItemView(item: item, vm: vm)
                        }
                        
                        // AirDrop zone when items exist
                        AirDropView(vm: vm)
                    }
                    .padding(vm.spacing)
                }
                .padding(-vm.spacing)
                .scrollIndicators(.never)
            }
        }
        .frame(maxHeight: .infinity)
        .contentShape(Rectangle())
    }
}

#Preview {
    NotchContentView(vm: .init())
        .padding()
        .frame(width: 550, height: 150, alignment: .center)
        .background(.black)
        .preferredColorScheme(.dark)
}
