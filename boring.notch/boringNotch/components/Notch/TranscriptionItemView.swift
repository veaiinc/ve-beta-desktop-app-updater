//
//  TranscriptionItemView.swift
//  boringNotch
//
//  Created by Chandra on 17/10/25.
//


import SwiftUI
import Foundation
import Defaults
import AVFoundation

struct TranscriptionItemView: View {
    let transcription: Transcription
    
    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            header
            textBody
        }
        .frame(maxWidth: .infinity)
        .id(transcription.id)
    }
    
    @ViewBuilder
    private var header: some View {
        HStack(spacing: 10) {
            Text(transcription.speakerName)
                .font(Font.custom("General Sans Variable", size: 10).weight(.semibold))
                .foregroundColor(.transcriptionAccent)
            
            Divider()
            
            HStack(spacing: 5) {
                Image(systemName: "clock")
                    .font(.system(size: 10))
                    .foregroundColor(.transcriptionAccent)
                
                Text(transcription.formattedTime)
                    .font(Font.custom("General Sans Variable", size: 10).weight(.semibold))
                    .foregroundColor(.transcriptionAccent)
            }
            
            Spacer()
        }
        .padding(0)
    }
    
    @ViewBuilder
    private var textBody: some View {
        Text(transcription.text)
            .font(Font.custom("General Sans Variable", size: 14).weight(.medium))
            .lineSpacing(5)
            .foregroundColor(.white)
            .frame(maxWidth: .infinity, alignment: .leading)
    }
}