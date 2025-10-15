//
//  BoringHeader.swift
//  boringNotch
//
//  Created by Harsh Vardhan  Goswami  on 04/08/24.
//

import Defaults
import SwiftUI

struct BoringHeader: View {
    @EnvironmentObject var vm: BoringViewModel
    @ObservedObject var batteryModel = BatteryStatusViewModel.shared
    @ObservedObject var coordinator = BoringViewCoordinator.shared
    @StateObject var tvm = TrayDrop.shared
    @State private var hoverVE = false
    @State private var hoverStealth = false
    @State private var hoverMirror = false
    @State private var hoverSettings = false
    var body: some View {
        HStack(spacing: 0) {
            HStack {
                if vm.notchState == .open {
                    TabSelectionView()
                }
            }
            .frame(maxWidth: .infinity, minHeight: 24, maxHeight: 24, alignment: .leading)
            .opacity(vm.notchState == .closed ? 0 : 1)
            .blur(radius: vm.notchState == .closed ? 20 : 0)
            .animation(.smooth.delay(0.1), value: vm.notchState)
            .zIndex(2)

            if vm.notchState == .open {
                Rectangle()
                    .fill(NSScreen.screens
                        .first(where: { $0.localizedName == coordinator.selectedScreen })?.safeAreaInsets.top ?? 0 > 0 ? .black : .clear)
                    .frame(width: vm.closedNotchSize.width)
                    .mask {
                        NotchShape()
                    }
            }

            HStack(spacing: 4) {
                if vm.notchState == .open {
                    if coordinator.isMeetingStarted {
                        HStack(spacing: 4) {
                            Text(coordinator.formattedMeetingTime())
                                .font(.system(size: 12, weight: .medium))
                                .foregroundColor(.white)

                            Image(systemName: "waveform")
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 12, height: 12)
                                .foregroundColor(Color(red: 0.47, green: 0.93, blue: 0.79))
                        }
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .frame(height: 24)
                        .cornerRadius(24)
                        .overlay(
                            RoundedRectangle(cornerRadius: 24)
                                .inset(by: 0.25)
                                .stroke(.white, lineWidth: 0.5)
                        )
                    }
                    // VE logo button (open app)
                    Button(action: {
                        // Send message to Electron to open main window
                        WebSocketManager.shared.sendEvent(type: .navigateToMainScreen)
                    }) {
                        HStack(alignment: .center, spacing: 4) {
                            VEIcon(color: .white)
                                .frame(width: 14, height: 14)
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 2)
                        .frame(width: 24, height: 24, alignment: .center)
                        .background(hoverVE ? Color(red: 1, green: 1, blue: 1).opacity(0.15) : Color.clear)
                        .cornerRadius(24)
                        .onHover { hover in
                            hoverVE = hover
                        }
                    }
                    .buttonStyle(PlainButtonStyle())

                    // Stealth mode toggle (Pirate/Eye)
                    Button(action: {
                        vm.toggleStealthMode()
                    }) {
                        HStack(alignment: .center, spacing: 4) {
                            Group {
                                if vm.isStealthModeEnabled {
                                    EyeIcon(color: .white)
                                } else {
                                    PirateIcon(color: .white)
                                }
                            }
                            .frame(width: 14, height: 14)
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 2)
                        .frame(width: 24, height: 24, alignment: .center)
                        .background(hoverStealth ? Color(red: 1, green: 1, blue: 1).opacity(0.15) : Color.clear)
                        .cornerRadius(24)
                        .onHover { hover in
                            hoverStealth = hover
                        }
                    }
                    .buttonStyle(PlainButtonStyle())

                    if Defaults[.showMirror] {
                        Button(action: {
                            vm.toggleCameraPreview()
                        }) {
                            HStack(spacing: 4) {
                                ZStack() {
                                    Image(systemName: "web.camera")
                                        .foregroundColor(.white)
                                        .font(.system(size: 12, weight: .semibold))
                                }
                                .frame(width: 14, height: 14)
                            }
                            .padding(EdgeInsets(top: 2, leading: 12, bottom: 2, trailing: 12))
                            .frame(width: 24, height: 24)
                            .background(hoverMirror ? Color(red: 1, green: 1, blue: 1).opacity(0.15) : Color.clear)
                            .cornerRadius(24)
                            .onHover { hover in
                                hoverMirror = hover
                            }
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                    if Defaults[.settingsIconInNotch] {
                        Button(action: {
                            SettingsWindowController.shared.showWindow()
                        }) {
                            HStack(spacing: 4) {
                                ZStack() {
                                    SettingsIcon(color: .white)
                                        .frame(width: 14, height: 14)
                                }
                                .frame(width: 14, height: 14)
                            }
                            .padding(EdgeInsets(top: 2, leading: 12, bottom: 2, trailing: 12))
                            .frame(width: 24, height: 24)
                            .background(hoverSettings ? Color(red: 1, green: 1, blue: 1).opacity(0.15) : Color.clear)
                            .cornerRadius(24)
                            .onHover { hover in
                                hoverSettings = hover
                            }
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                    // if Defaults[.showBatteryIndicator] {
                    //     BoringBatteryView(
                    //         batteryWidth: 30,
                    //         isCharging: batteryModel.isCharging,
                    //         isInLowPowerMode: batteryModel.isInLowPowerMode,
                    //         isPluggedIn: batteryModel.isPluggedIn,
                    //         levelBattery: batteryModel.levelBattery,
                    //         maxCapacity: batteryModel.maxCapacity,
                    //         timeToFullCharge: batteryModel.timeToFullCharge,
                    //         isForNotification: false
                    //     )
                    // }
                    // Battery indicator removed per design
                }
            }
            .font(.system(.headline, design: .rounded))
            .frame(maxWidth: .infinity, alignment: .trailing)
            .opacity(vm.notchState == .closed ? 0 : 1)
            .blur(radius: vm.notchState == .closed ? 20 : 0)
            .animation(.smooth.delay(0.1), value: vm.notchState)
            .zIndex(2)
        }
        .frame(minHeight: 24, maxHeight: 24)
        .padding(.top, 12)
        .foregroundColor(.gray)
        .environmentObject(vm)
    }
}

// MARK: - Inline VE/Pirate/Eye icons (ported from NotchContentView)
private struct VEIcon: View {
    var color: Color = .white
    var body: some View {
        ZStack {
            Path { path in
                path.move(to: CGPoint(x: 7.5466, y: 0.00034523))
                path.addCurve(to: CGPoint(x: 6.90741, y: 0.031127), control1: CGPoint(x: 7.26923, y: 0.00531769), control2: CGPoint(x: 7.07517, y: 0.0147889))
                path.addCurve(to: CGPoint(x: 5.88864, y: 0.368307), control1: CGPoint(x: 6.46667, y: 0.0739848), control2: CGPoint(x: 6.17616, y: 0.170356))
                path.addCurve(to: CGPoint(x: 5.58405, y: 0.629006), control1: CGPoint(x: 5.77649, y: 0.445735), control2: CGPoint(x: 5.68535, y: 0.523637))
                path.addCurve(to: CGPoint(x: 5.38075, y: 0.871472), control1: CGPoint(x: 5.50651, y: 0.709512), control2: CGPoint(x: 5.45136, y: 0.775575))
                path.addCurve(to: CGPoint(x: 4.35021, y: 2.79889), control1: CGPoint(x: 5.06393, y: 1.30242), control2: CGPoint(x: 4.72011, y: 1.94552))
                path.addCurve(to: CGPoint(x: 3.77841, y: 4.21012), control1: CGPoint(x: 4.18222, y: 3.18627), control2: CGPoint(x: 4.062, y: 3.48343))
                path.addCurve(to: CGPoint(x: 3.42997, y: 5.06491), control1: CGPoint(x: 3.53935, y: 4.82315), control2: CGPoint(x: 3.49227, y: 4.93847))
                path.addCurve(to: CGPoint(x: 3.36282, y: 5.17786), control1: CGPoint(x: 3.39997, y: 5.12576), control2: CGPoint(x: 3.3799, y: 5.15962))
                path.addCurve(to: CGPoint(x: 3.34182, y: 5.19159), control1: CGPoint(x: 3.35174, y: 5.18946), control2: CGPoint(x: 3.34851, y: 5.19159))
                path.addCurve(to: CGPoint(x: 3.32198, y: 5.17383), control1: CGPoint(x: 3.33282, y: 5.19159), control2: CGPoint(x: 3.32913, y: 5.18804))
                path.addCurve(to: CGPoint(x: 3.23498, y: 4.19473), control1: CGPoint(x: 3.28483, y: 5.09735), control2: CGPoint(x: 3.25806, y: 4.79569))
                path.addCurve(to: CGPoint(x: 3.20729, y: 3.30679), control1: CGPoint(x: 3.22714, y: 3.98636), control2: CGPoint(x: 3.21975, y: 3.75313))
                path.addCurve(to: CGPoint(x: 3.16807, y: 2.05421), control1: CGPoint(x: 3.18837, y: 2.62864), control2: CGPoint(x: 3.18006, y: 2.36345))
                path.addCurve(to: CGPoint(x: 3.06423, y: 0.651974), control1: CGPoint(x: 3.14038, y: 1.34433), control2: CGPoint(x: 3.10415, y: 0.855134))
                path.addCurve(to: CGPoint(x: 2.67241, y: 0.0640397), control1: CGPoint(x: 3.00492, y: 0.350311), control2: CGPoint(x: 2.8727, y: 0.152123))
                path.addCurve(to: CGPoint(x: 2.39043, y: 0.00792217), control1: CGPoint(x: 2.58334, y: 0.0247336), control2: CGPoint(x: 2.49888, y: 0.00792217))
                path.addCurve(to: CGPoint(x: 1.91739, y: 0.101215), control1: CGPoint(x: 2.26513, y: 0.00792217), control2: CGPoint(x: 2.17814, y: 0.0249706))
                path.addCurve(to: CGPoint(x: 0.874153, y: 0.467283), control1: CGPoint(x: 1.61187, y: 0.190246), control2: CGPoint(x: 1.28628, y: 0.304612))
                path.addCurve(to: CGPoint(x: 0.156974, y: 0.760657), control1: CGPoint(x: 0.664168, y: 0.550394), control2: CGPoint(x: 0.184434, y: 0.74645))
                path.addCurve(to: CGPoint(x: 0.010677, y: 0.924748), control1: CGPoint(x: 0.0861331, y: 0.797359), control2: CGPoint(x: 0.031214, y: 0.858686))
                path.addCurve(to: CGPoint(x: 0.0178303, y: 1.0796), control1: CGPoint(x: -0.00570645, y: 0.977314), control2: CGPoint(x: -0.00316817, y: 1.03272))
                path.addCurve(to: CGPoint(x: 0.193664, y: 1.22073), control1: CGPoint(x: 0.0485204, y: 1.14756), control2: CGPoint(x: 0.107593, y: 1.19492))
                path.addCurve(to: CGPoint(x: 0.52041, y: 1.36919), control1: CGPoint(x: 0.332808, y: 1.26264), control2: CGPoint(x: 0.426955, y: 1.30526))
                path.addCurve(to: CGPoint(x: 0.742624, y: 1.59224), control1: CGPoint(x: 0.604865, y: 1.42673), control2: CGPoint(x: 0.683552, y: 1.50558))
                path.addCurve(to: CGPoint(x: 0.951456, y: 2.19272), control1: CGPoint(x: 0.843002, y: 1.73952), control2: CGPoint(x: 0.907613, y: 1.92516))
                path.addCurve(to: CGPoint(x: 1.01168, y: 2.66984), control1: CGPoint(x: 0.968993, y: 2.3007), control2: CGPoint(x: 0.973839, y: 2.33929))
                path.addCurve(to: CGPoint(x: 1.40881, y: 5.96706), control1: CGPoint(x: 1.14436, y: 3.83553), control2: CGPoint(x: 1.27451, y: 4.91621))
                path.addCurve(to: CGPoint(x: 1.47434, y: 6.40345), control1: CGPoint(x: 1.4448, y: 6.25001), control2: CGPoint(x: 1.4538, y: 6.30968))
                path.addCurve(to: CGPoint(x: 1.77432, y: 6.93503), control1: CGPoint(x: 1.52857, y: 6.65349), control2: CGPoint(x: 1.62087, y: 6.81687))
                path.addCurve(to: CGPoint(x: 1.89662, y: 7.01103), control1: CGPoint(x: 1.81055, y: 6.96273), control2: CGPoint(x: 1.84747, y: 6.9857))
                path.addCurve(to: CGPoint(x: 2.67079, y: 7.22651), control1: CGPoint(x: 2.12483, y: 7.12753), control2: CGPoint(x: 2.39343, y: 7.20236))
                path.addCurve(to: CGPoint(x: 3.14038, y: 7.22201), control1: CGPoint(x: 2.81501, y: 7.23906), control2: CGPoint(x: 2.99385, y: 7.2374))
                path.addCurve(to: CGPoint(x: 4.11877, y: 6.92721), control1: CGPoint(x: 3.48004, y: 7.18625), control2: CGPoint(x: 3.81325, y: 7.08586))
                path.addCurve(to: CGPoint(x: 5.0037, y: 6.16595), control1: CGPoint(x: 4.4822, y: 6.73826), control2: CGPoint(x: 4.78656, y: 6.47661))
                path.addCurve(to: CGPoint(x: 5.19569, y: 5.83564), control1: CGPoint(x: 5.06877, y: 6.07314), control2: CGPoint(x: 5.1057, y: 6.00944))
                path.addCurve(to: CGPoint(x: 6.28899, y: 3.59448), control1: CGPoint(x: 5.49613, y: 5.25552), control2: CGPoint(x: 5.76149, y: 4.71163))
                path.addCurve(to: CGPoint(x: 7.04286, y: 2.03526), control1: CGPoint(x: 6.68243, y: 2.76148), control2: CGPoint(x: 6.86611, y: 2.3812))
                path.addCurve(to: CGPoint(x: 7.61005, y: 1.02657), control1: CGPoint(x: 7.263, y: 1.60432), control2: CGPoint(x: 7.44045, y: 1.28892))
                path.addCurve(to: CGPoint(x: 7.94534, y: 0.570994), control1: CGPoint(x: 7.7342, y: 0.834534), control2: CGPoint(x: 7.82327, y: 0.713538))
                path.addCurve(to: CGPoint(x: 8.05264, y: 0.43508), control1: CGPoint(x: 7.99472, y: 0.513219), control2: CGPoint(x: 8.02818, y: 0.470834))
                path.addCurve(to: CGPoint(x: 8.15048, y: 0.189535), control1: CGPoint(x: 8.12209, y: 0.333499), control2: CGPoint(x: 8.15394, y: 0.25394))
                path.addCurve(to: CGPoint(x: 8.09602, y: 0.083693), control1: CGPoint(x: 8.14817, y: 0.144783), control2: CGPoint(x: 8.13156, y: 0.112581))
                path.addCurve(to: CGPoint(x: 7.80273, y: 0.0036602), control1: CGPoint(x: 8.04272, y: 0.0398881), control2: CGPoint(x: 7.94926, y: 0.0145522))
                path.addCurve(to: CGPoint(x: 7.5466, y: 0.00034523), control1: CGPoint(x: 7.76743, y: 0.00105558), control2: CGPoint(x: 7.61513, y: -0.000838688))
                path.closeSubpath()
            }
            .fill(color)

            Path { path in
                path.move(to: CGPoint(x: 11.2273, y: 0.332537))
                path.addCurve(to: CGPoint(x: 8.48854, y: 1.47318), control1: CGPoint(x: 10.2399, y: 0.374469), control2: CGPoint(x: 9.26458, y: 0.78073))
                path.addCurve(to: CGPoint(x: 8.13183, y: 1.82858), control1: CGPoint(x: 8.37314, y: 1.5763), control2: CGPoint(x: 8.23329, y: 1.71561))
                path.addCurve(to: CGPoint(x: 7.06283, y: 4.07184), control1: CGPoint(x: 7.55299, y: 2.47314), control2: CGPoint(x: 7.18234, y: 3.25084))
                path.addCurve(to: CGPoint(x: 7.05826, y: 5.17674), control1: CGPoint(x: 7.0041, y: 4.47581), control2: CGPoint(x: 7.0025, y: 4.83945))
                path.addCurve(to: CGPoint(x: 8.21318, y: 6.84097), control1: CGPoint(x: 7.18051, y: 5.91869), control2: CGPoint(x: 7.57196, y: 6.4826))
                path.addCurve(to: CGPoint(x: 9.24493, y: 7.22455), control1: CGPoint(x: 8.47917, y: 6.98968), control2: CGPoint(x: 8.88022, y: 7.13862))
                path.addCurve(to: CGPoint(x: 10.6688, y: 7.29352), control1: CGPoint(x: 9.72047, y: 7.33659), control2: CGPoint(x: 10.2052, y: 7.35997))
                path.addCurve(to: CGPoint(x: 12.2739, y: 6.69363), control1: CGPoint(x: 11.2189, y: 7.21446), control2: CGPoint(x: 11.7533, y: 7.01466))
                path.addCurve(to: CGPoint(x: 12.7993, y: 6.24063), control1: CGPoint(x: 12.5321, y: 6.53438), control2: CGPoint(x: 12.6836, y: 6.40354))
                path.addCurve(to: CGPoint(x: 12.9908, y: 5.69528), control1: CGPoint(x: 12.9026, y: 6.09467), control2: CGPoint(x: 12.9702, y: 5.90173))
                path.addCurve(to: CGPoint(x: 12.9894, y: 5.52572), control1: CGPoint(x: 12.9949, y: 5.65312), control2: CGPoint(x: 12.9942, y: 5.56146))
                path.addCurve(to: CGPoint(x: 12.8386, y: 5.27023), control1: CGPoint(x: 12.9716, y: 5.39167), control2: CGPoint(x: 12.9231, y: 5.30964))
                path.addCurve(to: CGPoint(x: 12.7063, y: 5.248), control1: CGPoint(x: 12.7995, y: 5.2519), control2: CGPoint(x: 12.7657, y: 5.24617))
                path.addCurve(to: CGPoint(x: 12.3171, y: 5.35455), control1: CGPoint(x: 12.6144, y: 5.25052), control2: CGPoint(x: 12.55, y: 5.26817))
                path.addCurve(to: CGPoint(x: 11.0251, y: 5.63777), control1: CGPoint(x: 11.8975, y: 5.51037), control2: CGPoint(x: 11.4597, y: 5.60637))
                path.addCurve(to: CGPoint(x: 10.7166, y: 5.64716), control1: CGPoint(x: 10.911, y: 5.64601), control2: CGPoint(x: 10.8756, y: 5.64716))
                path.addCurve(to: CGPoint(x: 10.4024, y: 5.63662), control1: CGPoint(x: 10.553, y: 5.64716), control2: CGPoint(x: 10.5262, y: 5.64624))
                path.addCurve(to: CGPoint(x: 9.41494, y: 5.36074), control1: CGPoint(x: 9.98326, y: 5.60454), control2: CGPoint(x: 9.63615, y: 5.50739))
                path.addCurve(to: CGPoint(x: 9.07034, y: 4.83258), control1: CGPoint(x: 9.22482, y: 5.23425), control2: CGPoint(x: 9.11147, y: 5.0608))
                path.addCurve(to: CGPoint(x: 9.058, y: 4.74207), control1: CGPoint(x: 9.06463, y: 4.8005), control2: CGPoint(x: 9.058, y: 4.74207))
                path.addCurve(to: CGPoint(x: 9.45859, y: 4.66553), control1: CGPoint(x: 9.06029, y: 4.73977), control2: CGPoint(x: 9.39621, y: 4.67562))
                path.addCurve(to: CGPoint(x: 10.7806, y: 4.46939), control1: CGPoint(x: 9.53674, y: 4.6527), control2: CGPoint(x: 9.97527, y: 4.58763))
                path.addCurve(to: CGPoint(x: 11.6535, y: 4.34016), control1: CGPoint(x: 11.1014, y: 4.42219), control2: CGPoint(x: 11.4483, y: 4.37086))
                path.addCurve(to: CGPoint(x: 12.9782, y: 4.13256), control1: CGPoint(x: 12.212, y: 4.25629), control2: CGPoint(x: 12.8973, y: 4.14906))
                path.addCurve(to: CGPoint(x: 13.2334, y: 4.05488), control1: CGPoint(x: 13.0598, y: 4.11583), control2: CGPoint(x: 13.1619, y: 4.08467))
                path.addCurve(to: CGPoint(x: 13.9409, y: 3.14956), control1: CGPoint(x: 13.5947, y: 3.90342), control2: CGPoint(x: 13.8317, y: 3.60004))
                path.addCurve(to: CGPoint(x: 14.0134, y: 2.68097), control1: CGPoint(x: 13.9757, y: 3.00658), control2: CGPoint(x: 13.9997, y: 2.85076))
                path.addCurve(to: CGPoint(x: 14.0145, y: 2.33497), control1: CGPoint(x: 14.0184, y: 2.61819), control2: CGPoint(x: 14.0191, y: 2.39432))
                path.addCurve(to: CGPoint(x: 13.9453, y: 1.91473), control1: CGPoint(x: 14.0022, y: 2.17778), control2: CGPoint(x: 13.9802, y: 2.0442))
                path.addCurve(to: CGPoint(x: 13.5253, y: 1.13085), control1: CGPoint(x: 13.8651, y: 1.61685), control2: CGPoint(x: 13.727, y: 1.35953))
                path.addCurve(to: CGPoint(x: 13.3685, y: 0.973664), control1: CGPoint(x: 13.4919, y: 1.09304), control2: CGPoint(x: 13.4071, y: 1.00803))
                path.addCurve(to: CGPoint(x: 12.0317, y: 0.382946), control1: CGPoint(x: 13.0271, y: 0.670056), control2: CGPoint(x: 12.5895, y: 0.476664))
                path.addCurve(to: CGPoint(x: 11.2273, y: 0.332537), control1: CGPoint(x: 11.8694, y: 0.355679), control2: CGPoint(x: 11.7154, y: 0.339868))
                path.closeSubpath()
                path.move(to: CGPoint(x: 10.9451, y: 2.03022))
                path.addCurve(to: CGPoint(x: 11.2458, y: 2.07375), control1: CGPoint(x: 11.0513, y: 2.03572), control2: CGPoint(x: 11.159, y: 2.0513))
                path.addCurve(to: CGPoint(x: 11.6249, y: 2.32237), control1: CGPoint(x: 11.4209, y: 2.11912), control2: CGPoint(x: 11.5433, y: 2.19932))
                path.addCurve(to: CGPoint(x: 11.6882, y: 2.44954), control1: CGPoint(x: 11.6443, y: 2.35193), control2: CGPoint(x: 11.675, y: 2.41288))
                path.addCurve(to: CGPoint(x: 11.7508, y: 2.79164), control1: CGPoint(x: 11.7223, y: 2.54234), control2: CGPoint(x: 11.7444, y: 2.66333))
                path.addCurve(to: CGPoint(x: 11.7447, y: 2.82418), control1: CGPoint(x: 11.7524, y: 2.82281), control2: CGPoint(x: 11.7447, y: 2.82418))
                path.addCurve(to: CGPoint(x: 9.45333, y: 3.17476), control1: CGPoint(x: 11.7118, y: 2.83014), control2: CGPoint(x: 9.45333, y: 3.17476))
                path.addCurve(to: CGPoint(x: 9.47459, y: 3.08288), control1: CGPoint(x: 9.45174, y: 3.17339), control2: CGPoint(x: 9.46293, y: 3.12504))
                path.addCurve(to: CGPoint(x: 9.99332, y: 2.32649), control1: CGPoint(x: 9.55708, y: 2.78408), control2: CGPoint(x: 9.73944, y: 2.51805))
                path.addCurve(to: CGPoint(x: 10.9451, y: 2.03022), control1: CGPoint(x: 10.2669, y: 2.11981), control2: CGPoint(x: 10.6101, y: 2.01303))
                path.closeSubpath()
            }
            .fill(color)
        }
        .frame(width: 15, height: 8)
    }
}

private struct EyeIcon: View {
    var color: Color = .white
    var body: some View {
        GeometryReader { geo in
            let scale = min(geo.size.width, geo.size.height) / 24.0
            let offsetX = (geo.size.width - 24.0 * scale) / 2.0
            let offsetY = (geo.size.height - 24.0 * scale) / 2.0
            let strokeStyle = StrokeStyle(lineWidth: 2.0 * scale, lineCap: .round, lineJoin: .round)
            let point: (CGFloat, CGFloat) -> CGPoint = { x, y in
                CGPoint(x: offsetX + x * scale, y: offsetY + y * scale)
            }
            ZStack {
                Path { path in
                    path.move(to: point(2.0, 12.0))
                    path.addQuadCurve(to: point(12.0, 5.0), control: point(5.0, 6.0))
                    path.addQuadCurve(to: point(22.0, 12.0), control: point(19.0, 6.0))
                    path.addQuadCurve(to: point(12.0, 19.0), control: point(19.0, 18.0))
                    path.addQuadCurve(to: point(2.0, 12.0), control: point(5.0, 18.0))
                }
                .stroke(color, style: strokeStyle)
                Path { path in
                    let radius: CGFloat = 3.0
                    let rect = CGRect(
                        x: offsetX + (12.0 - radius) * scale,
                        y: offsetY + (12.0 - radius) * scale,
                        width: radius * 2.0 * scale,
                        height: radius * 2.0 * scale
                    )
                    path.addEllipse(in: rect)
                }
                .stroke(color, style: strokeStyle)
            }
        }
        .aspectRatio(1.0, contentMode: .fit)
    }
}

private struct PirateIcon: View {
    var color: Color = .white
    var body: some View {
        GeometryReader { geo in
            let scale = min(geo.size.width, geo.size.height) / 24.0
            let offsetX = (geo.size.width - 24.0 * scale) / 2.0
            let offsetY = (geo.size.height - 24.0 * scale) / 2.0
            let strokeStyle = StrokeStyle(lineWidth: 2.0 * scale, lineCap: .round, lineJoin: .round)
            let point: (CGFloat, CGFloat) -> CGPoint = { x, y in
                CGPoint(x: offsetX + x * scale, y: offsetY + y * scale)
            }
            let circleRect: (CGFloat, CGFloat, CGFloat) -> CGRect = { centerX, centerY, radius in
                CGRect(
                    x: offsetX + (centerX - radius) * scale,
                    y: offsetY + (centerY - radius) * scale,
                    width: radius * 2.0 * scale,
                    height: radius * 2.0 * scale
                )
            }
            ZStack {
                Path { path in
                    path.move(to: point(2.0, 11.0))
                    path.addLine(to: point(22.0, 11.0))
                }
                .stroke(color, style: strokeStyle)
                Path { path in
                    path.move(to: point(19.0, 11.0))
                    path.addLine(to: point(16.9, 4.3))
                    path.addLine(to: point(14.4, 3.2))
                    path.addLine(to: point(12.0, 4.0))
                    path.addLine(to: point(8.5, 4.0))
                    path.addLine(to: point(6.6, 5.9))
                    path.addLine(to: point(5.0, 11.0))
                }
                .stroke(color, style: strokeStyle)
                Path { path in
                    path.move(to: point(10.0, 18.0))
                    path.addLine(to: point(14.0, 18.0))
                }
                .stroke(color, style: strokeStyle)
                Path { path in
                    path.addEllipse(in: circleRect(7.0, 18.0, 3.0))
                }
                .stroke(color, style: strokeStyle)
                Path { path in
                    path.addEllipse(in: circleRect(17.0, 18.0, 3.0))
                }
                .stroke(color, style: strokeStyle)
                Path { path in
                    path.addArc(
                        center: point(12.0, 18.0),
                        radius: 2.0 * scale,
                        startAngle: .degrees(0),
                        endAngle: .degrees(180),
                        clockwise: true
                    )
                }
                .stroke(color, style: strokeStyle)
            }
        }
        .aspectRatio(1.0, contentMode: .fit)
    }
}

// MARK: - SettingsIcon (SVG path)
private struct SettingsIcon: View {
    var color: Color = .white
    var body: some View {
        GeometryReader { geo in
            let w: CGFloat = 14
            let h: CGFloat = 14
            let sx = geo.size.width / w
            let sy = geo.size.height / h
            let s = min(sx, sy)

            Path { p in
                // Inner circle
                p.addArc(center: CGPoint(x: 7 * s, y: 7 * s), radius: 2.1875 * s, startAngle: .degrees(0), endAngle: .degrees(360), clockwise: false)
            }
            .stroke(color, style: StrokeStyle(lineWidth: 0.875 * s, lineCap: .round, lineJoin: .round))

            Path { p in
                // Outer gear path approximated from the provided SVG
                // This is a simplified but visually matching path sized to 14x14
                p.move(to: CGPoint(x: 7.11116 * s, y: 11.2716 * s))
                p.addLine(to: CGPoint(x: 6.89241 * s, y: 11.2716 * s))
                p.addLine(to: CGPoint(x: 5.13968 * s, y: 12.25 * s))
                p.addCurve(to: CGPoint(x: 3.26773 * s, y: 11.2 * s), control1: CGPoint(x: 4.45736 * s, y: 12.0205 * s), control2: CGPoint(x: 3.82448 * s, y: 11.6642 * s))
                p.addLine(to: CGPoint(x: 3.15835 * s, y: 9.04477 * s))
                p.addLine(to: CGPoint(x: 1.41546 * s, y: 8.05219 * s))
                p.addCurve(to: CGPoint(x: 1.41546 * s, y: 5.94891 * s), control1: CGPoint(x: 1.27818 * s, y: 7.35781 * s), control2: CGPoint(x: 1.27818 * s, y: 6.64328 * s))
                p.addLine(to: CGPoint(x: 3.15671 * s, y: 4.95906 * s))
                p.addLine(to: CGPoint(x: 3.27483 * s, y: 2.80383 * s))
                p.addCurve(to: CGPoint(x: 5.13968 * s, y: 1.75 * s), control1: CGPoint(x: 3.82453 * s, y: 2.33824 * s), control2: CGPoint(x: 4.45724 * s, y: 1.9807 * s))
                p.addLine(to: CGPoint(x: 6.88968 * s, y: 2.72836 * s))
                p.addLine(to: CGPoint(x: 7.10843 * s, y: 2.72836 * s))
                p.addLine(to: CGPoint(x: 8.85843 * s, y: 1.75 * s))
                p.addCurve(to: CGPoint(x: 10.7238 * s, y: 2.8 * s), control1: CGPoint(x: 9.54075 * s, y: 1.97952 * s), control2: CGPoint(x: 10.1736 * s, y: 2.33575 * s))
                p.addLine(to: CGPoint(x: 10.8398 * s, y: 4.95523 * s))
                p.addLine(to: CGPoint(x: 12.5816 * s, y: 5.94727 * s))
                p.addCurve(to: CGPoint(x: 12.5816 * s, y: 8.05055 * s), control1: CGPoint(x: 12.7188 * s, y: 6.64164 * s), control2: CGPoint(x: 12.7188 * s, y: 7.35617 * s))
                p.addLine(to: CGPoint(x: 10.7222 * s, y: 11.1956 * s))
                p.addCurve(to: CGPoint(x: 8.85843 * s, y: 12.25 * s), control1: CGPoint(x: 10.1729 * s, y: 11.6613 * s), control2: CGPoint(x: 9.54052 * s, y: 12.019 * s))
                p.addLine(to: CGPoint(x: 7.11116 * s, y: 11.2716 * s))
            }
            .stroke(color, style: StrokeStyle(lineWidth: 0.875 * s, lineCap: .round, lineJoin: .round))
        }
        .aspectRatio(1.0, contentMode: .fit)
    }
}

#Preview {
    BoringHeader().environmentObject(BoringViewModel())
}
