//
//  NotchView.swift
//  NotchDrop
//
//  Created by 秋星桥 on 2024/7/7.
//

import SwiftUI

struct NotchView: View {
    @StateObject var vm: NotchViewModel

    @State var dropTargeting: Bool = false

    var notchSize: CGSize {
        switch vm.status {
        case .closed:
            var ans = CGSize(
                width: vm.deviceNotchRect.width - 4,
                height: vm.deviceNotchRect.height - 4
            )
            if ans.width < 0 { ans.width = 0 }
            if ans.height < 0 { ans.height = 0 }
            return ans
        case .opened:
            return vm.notchOpenedSize
        case .popping:
            return .init(
                width: vm.deviceNotchRect.width,
                height: vm.deviceNotchRect.height + 4
            )
        }
    }

    var notchCornerRadius: CGFloat {
        switch vm.status {
        case .closed: DynamicIslandTheme.collapsedRadius
        case .opened: DynamicIslandTheme.expandedRadius
        case .popping: 10
        }
    }
    
    var collapsedContentText: String {
        if vm.isRecording {
            return "● Recording \(vm.formatTime(vm.timer))"
        } else if vm.isChatMode {
            return "Chat Mode"
        } else {
            return "Living Intelligence"
        }
    }

    var body: some View {
        ZStack(alignment: .top) {
            notch
                .zIndex(0)
                .disabled(true)
                .opacity(vm.notchVisible ? 1 : 0.3)
            
            // Collapsed state content
            if vm.status == .closed {
                HStack(spacing: 8) {
                    if vm.isRecording {
                        Text("Recording \(vm.formatTime(vm.timer))")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(DynamicIslandTheme.primaryGreen)
                        CollapsedAudioViz()
                    } else if vm.isChatMode {
                        Text("Chat Mode")
                            .font(.system(size: 10, weight: .regular))
                            .foregroundColor(.white)
                    } else {
                        Text("Living Intelligence")
                            .font(.system(size: 10, weight: .regular))
                            .foregroundColor(.white)
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .zIndex(1)
            }
            
            Group {
                if vm.status == .opened {
                    VStack(spacing: vm.spacing) {
                        // Header is not part of the JS Dynamic Island design; keep for non-normal modes
                        if vm.contentType != .normal {
                            NotchHeaderView(vm: vm)
                        }
                        NotchContentView(vm: vm)
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                    }
                    .padding(vm.spacing)
                    .frame(maxWidth: vm.notchOpenedSize.width, maxHeight: vm.notchOpenedSize.height)
                    .zIndex(1)
                }
            }
            .transition(
                .scale.combined(
                    with: .opacity
                ).combined(
                    with: .offset(y: -vm.notchOpenedSize.height / 2)
                ).animation(vm.animation)
            )
        }
        .background(dragDetector)
        .animation(vm.animation, value: vm.status)
        .preferredColorScheme(.dark)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    }

    var notch: some View {
        Rectangle()
            .foregroundStyle(.black)
            .mask(notchBackgroundMaskGroup)
            .frame(
                width: notchSize.width + notchCornerRadius * 2,
                height: notchSize.height
            )
            .shadow(
                color: .black.opacity(([.opened, .popping].contains(vm.status)) ? 1 : 0),
                radius: 16
            )
            // Soft glows for states (approximate box-shadow)
            .shadow(
                color: vm.controlledByDynamicIsland ? DynamicIslandTheme.primaryGreen.opacity(0.2) : .clear,
                radius: vm.controlledByDynamicIsland ? 8 : 0
            )
            .shadow(
                color: vm.isChatMode ? DynamicIslandTheme.primaryGreen.opacity(0.3) : .clear,
                radius: vm.isChatMode ? 12 : 0
            )
    }

    // Mini collapsed audio visualizer (5 bars)
    struct CollapsedAudioViz: View {
        @State private var phase: CGFloat = 0
        var body: some View {
            HStack(spacing: 1) {
                ForEach(0..<5, id: \.self) { i in
                    let base: CGFloat = 8
                    let peak: CGFloat = 14
                    let progress = abs(sin((phase + CGFloat(i) * 0.4)))
                    let h = base + (peak - base) * progress
                    RoundedRectangle(cornerRadius: 1)
                        .fill(DynamicIslandTheme.primaryGreen)
                        .frame(width: 2, height: h)
                }
            }
            .onAppear {
                withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) {
                    phase = .pi
                }
            }
        }
    }

    var notchBackgroundMaskGroup: some View {
        Rectangle()
            .foregroundStyle(.black)
            .frame(
                width: notchSize.width,
                height: notchSize.height
            )
            .clipShape(.rect(
                bottomLeadingRadius: notchCornerRadius,
                bottomTrailingRadius: notchCornerRadius
            ))
            .overlay {
                ZStack(alignment: .topTrailing) {
                    Rectangle()
                        .frame(width: notchCornerRadius, height: notchCornerRadius)
                        .foregroundStyle(.black)
                    Rectangle()
                        .clipShape(.rect(topTrailingRadius: notchCornerRadius))
                        .foregroundStyle(.white)
                        .frame(
                            width: notchCornerRadius + vm.spacing,
                            height: notchCornerRadius + vm.spacing
                        )
                        .blendMode(.destinationOut)
                }
                .compositingGroup()
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                .offset(x: -notchCornerRadius - vm.spacing + 0.5, y: -0.5)
            }
            .overlay {
                ZStack(alignment: .topLeading) {
                    Rectangle()
                        .frame(width: notchCornerRadius, height: notchCornerRadius)
                        .foregroundStyle(.black)
                    Rectangle()
                        .clipShape(.rect(topLeadingRadius: notchCornerRadius))
                        .foregroundStyle(.white)
                        .frame(
                            width: notchCornerRadius + vm.spacing,
                            height: notchCornerRadius + vm.spacing
                        )
                        .blendMode(.destinationOut)
                }
                .compositingGroup()
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topTrailing)
                .offset(x: notchCornerRadius + vm.spacing - 0.5, y: -0.5)
            }
    }

    @ViewBuilder
    var dragDetector: some View {
        RoundedRectangle(cornerRadius: notchCornerRadius)
            .foregroundStyle(Color.black.opacity(0.001)) // fuck you apple and 0.001 is the smallest we can have
            .contentShape(Rectangle())
            .frame(width: notchSize.width + vm.dropDetectorRange, height: notchSize.height + vm.dropDetectorRange)
            .onDrop(of: [.data], isTargeted: $dropTargeting) { _ in true }
            .onChange(of: dropTargeting) { oldValue, isTargeted in
                if isTargeted, vm.status == .closed {
                    // Open the notch when a file is dragged over it
                    vm.notchOpen(.drag)
                    vm.hapticSender.send()
                } else if !isTargeted {
                    // Close the notch when the dragged item leaves the area
                    let mouseLocation: NSPoint = NSEvent.mouseLocation
                    if !vm.notchOpenedRect.insetBy(dx: vm.inset, dy: vm.inset).contains(mouseLocation) {
                        vm.notchClose()
                    }
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    }
}
