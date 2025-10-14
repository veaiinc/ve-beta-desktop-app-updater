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
    
    // 🚨 CRITICAL FIX: Ultra-optimized animations for maximum performance
    static let expansionDuration: Double = 0.15    // Even faster for responsiveness
    static let hoverDuration: Double = 0.05        // Minimal hover response time
    static let springDuration: Double = 0.2        // Faster spring duration
    
    // 🚨 CRITICAL FIX: Simplified animations for better performance
    static let expansionAnimation: Animation = .easeInOut(duration: expansionDuration)
    static let hoverAnimation: Animation = .easeInOut(duration: hoverDuration)
    
    static let bounceAnimation: Animation = .spring(
        response: 0.2,          // Faster engage
        dampingFraction: 0.7,   // Balanced bounce
        blendDuration: 0.04     // Reduced blend duration
    )
    
    static let smoothEaseInOut: Animation = .easeInOut(duration: 0.15)  // Faster
    static let instantAnimation: Animation = .easeInOut(duration: 0.05) // Much faster
    
    // PERFORMANCE OPTIMIZED: Faster hover-open animation
    static let hoverOpenBubbly: Animation = .spring(
        response: 0.3,          // Faster approach
        dampingFraction: 0.8,   // Less overshoot for stability
        blendDuration: 0.05     // Reduced blend duration
    )

    // PERFORMANCE OPTIMIZED: Simplified side bounce
    static let sideBounceKick: Animation = .spring(
        response: 0.12,         // Faster
        dampingFraction: 0.7,   // More stable
        blendDuration: 0.03     // Minimal blend
    )
    static let sideBounceReturn: Animation = .spring(
        response: 0.15,         // Faster
        dampingFraction: 0.8,   // More stable
        blendDuration: 0.03     // Minimal blend
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

