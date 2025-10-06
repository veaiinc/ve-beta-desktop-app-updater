import SwiftUI

enum DynamicIslandTheme {
    // Core sizes (match React SCSS)
    static let collapsedWidth: CGFloat = 310
    static let collapsedHeight: CGFloat = 32
    static let collapsedRadius: CGFloat = 8

    static let expandedWidth: CGFloat = 600
    static let expandedHeight: CGFloat = 160
    static let expandedRadius: CGFloat = 16

    // Chat expansion sizes - reversed behavior: compact is smaller, chat mode is wider
    static let compactWidth: CGFloat = 500        // Increased from 425 to accommodate webcam button
    static let chatExpandedWidth: CGFloat = 560   // Increased from 485 to accommodate webcam button

    static let recordingExpandedWidth: CGFloat = 600  // Optimized width for 480px chatbox + 80px webcam + padding
    static let recordingExpandedHeight: CGFloat = 160
    static let recordingBottomRadius: CGFloat = 8
    
    // Animation timings - ultra-smooth and professional
    static let expansionDuration: Double = 0.25    // Faster, more responsive
    static let hoverDuration: Double = 0.12        // Snappier hover response
    static let springDuration: Double = 0.36       // Open/close spring duration
    
    // Professional animation curves
    static let expansionAnimation: Animation = .spring(
        response: springDuration,
        dampingFraction: 0.76,  // slightly more bounce
        blendDuration: 0.08
    )
    
    static let hoverAnimation: Animation = .spring(
        response: hoverDuration,
        dampingFraction: 0.9,
        blendDuration: 0.05
    )
    
    static let bounceAnimation: Animation = .spring(
        response: 0.26,       // quick engage
        dampingFraction: 0.62, // NotchNook-like overshoot
        blendDuration: 0.06
    )
    
    static let smoothEaseInOut: Animation = .easeInOut(duration: 0.2)
    static let instantAnimation: Animation = .easeInOut(duration: 0.1)
    
    // NotchNook-style slow, bubbly hover-open
    static let hoverOpenBubbly: Animation = .spring(
        response: 0.5,        // slower approach
        dampingFraction: 0.72, // gentle overshoot
        blendDuration: 0.08
    )

    // Side bounce sequence (width wobble)
    static let sideBounceKick: Animation = .spring(
        response: 0.18,
        dampingFraction: 0.55,
        blendDuration: 0.04
    )
    static let sideBounceReturn: Animation = .spring(
        response: 0.22,
        dampingFraction: 0.75,
        blendDuration: 0.05
    )

    // Colors
    static let black = Color.black
    static let white = Color.white
    static let textPrimary = Color(red: 0.95, green: 0.95, blue: 0.95) // #F2F2F3
    static let textMuted = Color(red: 0.58, green: 0.596, blue: 0.62)   // #94989E-ish
    static let primaryGreen = Color(red: 0.475, green: 0.925, blue: 0.788) // #79ECC9
    static let primaryGreenDark = Color(red: 0.427, green: 0.831, blue: 0.722) // hover approx
    static let card = Color(red: 0.106, green: 0.110, blue: 0.114)
    static let cardMaterial = Material.regularMaterial
    static let stopRed = Color(red: 0.812, green: 0.212, blue: 0.208) // #CF3635
    static let stroke = Color(red: 0.173, green: 0.176, blue: 0.180) // subtle stroke

    // Shadows / glows
    static func glow(color: Color, radius: CGFloat) -> some ViewModifier {
        return ShadowModifier(color: color, radius: radius)
    }

    private struct ShadowModifier: ViewModifier {
        let color: Color
        let radius: CGFloat
        func body(content: Content) -> some View {
            content
                .shadow(color: color.opacity(0.4), radius: radius)
        }
    }
}

