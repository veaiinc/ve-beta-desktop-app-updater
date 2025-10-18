//
//  Transcription.swift
//  boringNotch
//
//  Created by Chandra on 17/10/25.
//


import SwiftUI
import Foundation
import Defaults
import AVFoundation

struct Transcription: Identifiable, Codable, Defaults.Serializable, Equatable {
    let id: String
    let text: String
    let source: String
    let timestamp: String
    let confidence: Double?
    let words: [Word]?
    
    struct Word: Codable, Defaults.Serializable, Equatable {
        let word: String
        let start: Double
        let end: Double
        let confidence: Double
    }
    
    // Computed property for formatted timestamp
    var formattedTime: String {
        // Parse timestamp and format as HH:mm in local timezone
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        formatter.timeZone = TimeZone(abbreviation: "UTC") // Input is UTC
        
        if let date = formatter.date(from: timestamp) {
            let timeFormatter = DateFormatter()
            timeFormatter.dateFormat = "HH:mm"
            timeFormatter.timeZone = TimeZone.current // Display in local timezone
            let formattedTime = timeFormatter.string(from: date)
            print("🕐 SwiftUI Timestamp: \(timestamp) -> \(formattedTime) (Local)")
            return formattedTime
        }
        
        // Fallback: try parsing without milliseconds
        let fallbackFormatter = DateFormatter()
        fallbackFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'"
        fallbackFormatter.timeZone = TimeZone(abbreviation: "UTC")
        
        if let date = fallbackFormatter.date(from: timestamp) {
            let timeFormatter = DateFormatter()
            timeFormatter.dateFormat = "HH:mm"
            timeFormatter.timeZone = TimeZone.current
            let formattedTime = timeFormatter.string(from: date)
            print("🕐 SwiftUI Timestamp (fallback): \(timestamp) -> \(formattedTime) (Local)")
            return formattedTime
        }
        
        print("❌ SwiftUI Timestamp parsing failed for: \(timestamp)")
        return "00:00"
    }
    
    // Computed property for speaker name
    var speakerName: String {
        return source == "mic" ? "YOU" : "SPEAKER"
    }
}