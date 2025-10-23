//
//  LiveIntelligenceItemView.swift
//  boringNotch
//
//  Created by Chandra on 17/10/25.
//


import SwiftUI
import Foundation
import Defaults
import AVFoundation

struct LiveIntelligenceItemView: View {
    let liveIntelligence: LiveIntelligence
    
    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            header
            textBody
        }
        .frame(maxWidth: .infinity)
        .id(liveIntelligence.id)
    }
    
    @ViewBuilder
    private var header: some View {
        HStack(spacing: 10) {
            Text(liveIntelligence.sourceName)
                .font(Font.custom("General Sans Variable", size: 10).weight(.semibold))
                .foregroundColor(.orange)
            
            Divider()
            
            HStack(spacing: 5) {
                Image(systemName: "brain.head.profile")
                    .font(.system(size: 10))
                    .foregroundColor(.orange)
                
                Text(liveIntelligence.formattedTime)
                    .font(Font.custom("General Sans Variable", size: 10).weight(.semibold))
                    .foregroundColor(.orange)
            }
            
            Spacer()
        }
        .padding(0)
    }
    
    @ViewBuilder
    private var textBody: some View {
        Text(liveIntelligence.text)
            .font(Font.custom("General Sans Variable", size: 14).weight(.medium))
            .lineSpacing(5)
            .foregroundColor(.white)
            .frame(maxWidth: .infinity, alignment: .leading)
    }
}