//
//  LiveIntelligence.swift
//  boringNotch
//
//  Created by Chandra on 17/10/25.
//


import SwiftUI
import Foundation
import Defaults
import AVFoundation

struct LiveIntelligence: Identifiable, Codable, Defaults.Serializable, Equatable {
    let id: String
    let text: String
    let source: String
    let timestamp: String
    let confidence: Double?
    let type: String
    let metadata: [String: String]?
    
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
            return formattedTime
        }
        
        return "00:00"
    }
    
    // Computed property for source name
    var sourceName: String {
        return "AI AGENT"
    }
}