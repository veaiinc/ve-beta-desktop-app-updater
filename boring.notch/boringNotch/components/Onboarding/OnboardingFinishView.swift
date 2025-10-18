//
//  OnboardingFinishView.swift
//  VENotch
//
//  Created by Alexander on 2025-06-23.
//


import SwiftUI

struct OnboardingFinishView: View {
    let onFinish: () -> Void
    let onOpenSettings: () -> Void
    struct Constants {
  static let primaryFont: Color = Color(red: 0.95, green: 0.95, blue: 0.95)
}

    var body: some View {
        VStack(spacing: 20) {
            Spacer()

            Image("finalsparkel")
                .resizable()
                .scaledToFit()
                .frame(width: 60, height: 60)
                .foregroundColor(.accentColor)
                .padding()
                Text("You’re All Set!")
                .font(
                    Font.custom("GeneralSans", size: 28)
                    .weight(.semibold)
                )
                .multilineTextAlignment(.center)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity, alignment: .top)

   Text("You can now enjoy the app. If you want to tweak things further, you can always visit the settings.")
    .font(Font.custom("GeneralSans", size: 13))
    .multilineTextAlignment(.center)
    .foregroundColor(Constants.primaryFont)
    .lineSpacing(6) // 👈 Add this for line spacing
    .frame(maxWidth: .infinity, alignment: .top)

            
            Spacer()
            Spacer()

            VStack(spacing: 12) {
                // Button(action: onOpenSettings) {
                //     Label("Customize in Settings", systemImage: "gear")
                //         .controlSize(.large)
                // }
                // .controlSize(.large)

                Button(action: onFinish) {
                    HStack(alignment: .center, spacing: 8) {
                        Text("Finish")
                            .font(
                                Font.custom("General Sans", size: 14)
                                    .weight(.medium)
                            )
                            .foregroundColor(Color(red: 0.47, green: 0.93, blue: 0.79))

                        Image(systemName: "arrow.right")
                            .foregroundColor(Color(red: 0.47, green: 0.93, blue: 0.79))
                            .font(.system(size: 14, weight: .medium))
                    }
                    .padding(.horizontal, 24)
                    .padding(.vertical, 13)
                    .frame(width: 270, alignment: .center)
                    .background(Color.black.opacity(0.05))
                    .cornerRadius(24)
                    .shadow(color: .black.opacity(0.15), radius: 6, x: 0, y: 4)
                    .overlay(
                        RoundedRectangle(cornerRadius: 24)
                            .inset(by: 0.3)
                            .stroke(Color(red: 0.47, green: 0.93, blue: 0.79), lineWidth: 0.6)
                    )
                }
                .buttonStyle(.plain)
                .keyboardShortcut(.defaultAction)
            }
            .padding(24)
        }
        .padding(.horizontal, 22)
        .padding(.vertical, 45)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(
            VisualEffectView(material: .underWindowBackground, blendingMode: .behindWindow)
                .ignoresSafeArea()
        )
    }
}

#Preview {
    OnboardingFinishView(onFinish: { }, onOpenSettings: { })
}
