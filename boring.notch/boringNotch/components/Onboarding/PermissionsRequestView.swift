//
//  PermissionsRequestView.swift
//  boringNotch
//
//  Created by Alexander on 2025-06-23.
//

import SwiftUI

struct PermissionRequestView: View {
    let icon: Image
    let title: String
    let description: String
    let privacyNote: String?
    let onAllow: () -> Void
    let onSkip: () -> Void
 
    struct Constants {
        static let primaryFont: Color = Color(red: 0.95, green: 0.95, blue: 0.95)
    }
 
    var body: some View {
        VStack(spacing: 28) {
            icon
                .resizable()
                .scaledToFit()
                .frame(width: 70, height: 56)
                .foregroundColor(.accentColor)
                .padding(.top, 32)

            Text(title)
                .font(
                    Font.custom("GeneralSans", size: 28)
                        .weight(.semibold)
                )
                .multilineTextAlignment(.center)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity, alignment: .top)

            Text(description)
                .font(Font.custom("GeneralSans", size: 13))
                .multilineTextAlignment(.center)
                .foregroundColor(Constants.primaryFont)
                .lineSpacing(6)
                .frame(maxWidth: .infinity, alignment: .top)
                .padding(.horizontal)

            if let privacyNote = privacyNote {
                HStack(spacing: 8) {
                    Image("shield")
                        .resizable()
                        .renderingMode(.template)
                        .foregroundColor(Constants.primaryFont)
                        .frame(width: 18, height: 18)
                    Text(privacyNote)
                        .font(Font.custom("GeneralSans", size: 13))
                        .foregroundColor(Constants.primaryFont)
                        .lineSpacing(6)
                        .multilineTextAlignment(.leading)
                }
                .padding(.bottom, 8)
                .padding(.horizontal)
            }

            HStack(spacing: 12) {
                Button(action: onSkip) {
                    HStack(alignment: .center, spacing: 8) { }
                        .padding(.horizontal, 24)
                        .padding(.vertical, 8)
                        .frame(width: 135, height: 32, alignment: .center)
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .inset(by: 0.5)
                                .stroke(.white.opacity(0.4), lineWidth: 1)
                        )
                        .overlay(
                            Text("Not Now")
                                .font(
                                    Font.custom("GeneralSans", size: 14)
                                        .weight(.medium)
                                )
                                .foregroundColor(.white)
                        )
                }
                .buttonStyle(.plain)

                Button(action: onAllow) {
                    HStack(alignment: .center, spacing: 8) { }
                        .padding(.horizontal, 24)
                        .padding(.vertical, 8)
                        .frame(width: 135, height: 32, alignment: .center)
                        .background(Color.black.opacity(0.1))
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .inset(by: 0.5)
                                .stroke(Color(red: 0.47, green: 0.93, blue: 0.79), lineWidth: 1)
                        )
                        .overlay(
                            Text("Allow Access ")
                                .font(
                                    Font.custom("GeneralSans", size: 14)
                                        .weight(.medium)
                                )
                                .foregroundColor(Color(red: 0.47, green: 0.93, blue: 0.79))
                        )
                }
                .buttonStyle(.plain)
            }
            .padding(.top, 10)
        }
        .padding(.horizontal, 22)
        .padding(.vertical, 45)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
        .background(
            VisualEffectView(material: .underWindowBackground, blendingMode: .behindWindow)
                .ignoresSafeArea()
        )
    }
}
