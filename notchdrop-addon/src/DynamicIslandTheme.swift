import SwiftUI

enum DynamicIslandTheme {
    // Core sizes (match React SCSS)
    static let collapsedWidth: CGFloat = 310
    static let collapsedHeight: CGFloat = 32
    static let collapsedRadius: CGFloat = 8

    static let expandedWidth: CGFloat = 600
    static let expandedHeight: CGFloat = 160
    static let expandedRadius: CGFloat = 16

    // Chat expansion sizes
    static let compactWidth: CGFloat = 585        // main home dynamic island width
    static let chatExpandedWidth: CGFloat = 525   // Wider when chat expanded

    static let recordingExpandedWidth: CGFloat = 495
    static let recordingExpandedHeight: CGFloat = 160
    static let recordingBottomRadius: CGFloat = 8
    
    // Animation timings - smooth and synchronized
    static let expansionDuration: Double = 0.3    // Smooth expansion timing
    static let expansionAnimation: Animation = .easeInOut(duration: expansionDuration)

    // Colors
    static let black = Color.black
    static let white = Color.white
    static let textPrimary = Color(red: 0.95, green: 0.95, blue: 0.95) // #F2F2F3
    static let textMuted = Color(red: 0.58, green: 0.596, blue: 0.62)   // #94989E-ish
    static let primaryGreen = Color(red: 0.475, green: 0.925, blue: 0.788) // #79ECC9
    static let primaryGreenDark = Color(red: 0.427, green: 0.831, blue: 0.722) // hover approx
    static let card = Color(red: 0.106, green: 0.110, blue: 0.114) // #1B1C1D
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

