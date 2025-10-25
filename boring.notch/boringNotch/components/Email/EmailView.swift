import SwiftUI

struct EmailView: View {
    @EnvironmentObject var viewModel: EmailViewModel
    
    var body: some View {
        VStack(spacing: 10) { // slightly more spacing between header/row/labels
            // Error message
            if let error = viewModel.errorMessage {
                Text(error)
                    .font(.system(size: 11))
                    .foregroundColor(.red)
                    .padding(.horizontal, 10)
            }
            
            // Email cards
            ScrollView(.horizontal, showsIndicators: false) {
                LazyHStack(spacing: 10) { // a bit more gap between cards
                    if viewModel.isLoading || (viewModel.emails.isEmpty && viewModel.isLabelsLoading) {
                        // Loading placeholders - show during email fetch OR initial label load
                        ForEach(0..<4, id: \.self) { _ in
                            RoundedRectangle(cornerRadius: 12)
                                .fill(Color.white.opacity(0.1))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(Color.white.opacity(0.06), lineWidth: 0.5)
                                )
                                .frame(width: 228, height: 92)
                                .redacted(reason: .placeholder)
                        }
                    } else {
                        // Real emails
                        ForEach(viewModel.emails) { email in
                            EmailRow(email: email)
                                .contentShape(Rectangle())
                                .onTapGesture {
                                    // Record user activity when interacting with emails
                                    viewModel.recordUserActivity()
                                    Task { await viewModel.open(email) }
                                }
                        }
                    }
                }
                .padding(.vertical, 4) // add top/bottom padding around the row
            }
            
            // Labels row
            LabelRow(viewModel: viewModel)
                .padding(.top, 2) // slight separation from cards
        }
        .onAppear {
            // Record user activity and use smart fetch
            viewModel.recordUserActivity()
            Task { 
                // 🚫 INBOX FETCHING DISABLED - Only fetch labels, not emails
                // Commented out inbox fetch:
                // await viewModel.fetchIfNeeded()
                
                // Fetch labels so user can select one
                await viewModel.fetchLabels()
            }
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Subviews

private struct EmailRow: View {
    let email: EmailItem
    private let cardSize = CGSize(width: 228, height: 92)
    private let cornerRadius: CGFloat = 12
    private let contentPadding: CGFloat = 12  // uniform inner padding to avoid clipping
    private let avatarSize: CGFloat = 20
    private let avatarInset: CGFloat = 10  // keep avatar comfortably inside
    
    var body: some View {
        ZStack(alignment: .topLeading) {
            // Background
            RoundedRectangle(cornerRadius: cornerRadius)
                .fill(Color.white.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: cornerRadius)
                        .stroke(Color.white.opacity(0.06), lineWidth: 0.5) // subtle inner stroke
                )
            
            // Content container (uniform padding keeps text/avatars clear of rounded edges)
            VStack(alignment: .leading, spacing: 0) {
                // Text content with proper spacing
                Text(email.displayPreview)
                    .foregroundColor(.secondary)
                    .lineLimit(3)
                    .font(.system(size: 12))
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.top, 10) // tiny extra air so it doesn’t hug the ceiling
                
                Spacer() // Push avatar to bottom
                
                // Avatar container at bottom-right, still inside padded safe area
                HStack {
                    ProfilePictureView(email: email)
                        .frame(width: avatarSize, height: avatarSize)
                        .clipShape(Circle())
                        .padding(.bottom, avatarInset)
                }
            }
            .padding(contentPadding - 5) // single source of truth for inner margins
            .frame(width: cardSize.width, height: cardSize.height, alignment: .topLeading)
        }
        .frame(width: cardSize.width, height: cardSize.height)
        .cornerRadius(cornerRadius)
    }
}

private struct ProfilePictureView: View {
    let email: EmailItem
    private let size: CGFloat = 20
    
    var body: some View {
        Group {
            if let profilePictureData = email.profilePictureData,
               let nsImage = NSImage(data: profilePictureData) {
                Image(nsImage: nsImage)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: size, height: size)
                    .clipShape(Circle())
                    .onAppear {
                        print("📸 [UI] Using Contacts image (\(profilePictureData.count) bytes)")
                    }
            } else {
                MonogramAvatar(name: email.senderName, address: email.senderAddress, size: size)
            }
        }
        .frame(width: size, height: size)
        .clipped()
    }
}

// Offline monogram avatar: initials in a colored circle
private struct MonogramAvatar: View {
    let name: String
    let address: String?
    let size: CGFloat
    
    private var initials: String {
        // Helper to get first alphabetic character from a string
        func firstAlpha(in s: String) -> Character? {
            for ch in s.unicodeScalars {
                if CharacterSet.letters.contains(ch) {
                    return Character(ch)
                }
            }
            return nil
        }
        
        let trimmedName = name.trimmingCharacters(in: .whitespacesAndNewlines)
        if !trimmedName.isEmpty {
            // Split name into words
            let parts = trimmedName
                .components(separatedBy: CharacterSet.whitespaces)
                .filter { !$0.isEmpty }
            
            if let firstWord = parts.first,
               let firstInitial = firstAlpha(in: firstWord) {
                
                var result = String(firstInitial)
                
                if parts.count >= 2 {
                    // Find first alphabetic initial in the second word only
                    if let secondInitial = firstAlpha(in: parts[1]) {
                        result.append(secondInitial)
                    }
                }
                
                return result.uppercased()
            }
        }
        
        // Fallback to email username
        if let email = address,
           let user = email.split(separator: "@").first {
            if let firstInitial = firstAlpha(in: String(user)) {
                return String(firstInitial).uppercased()
            }
        }
        
        return "?"
    }
    
    private var backgroundColor: Color {
        // Deterministic color from hash of address or name
        let key = (address ?? name).lowercased()
        let hash = key.unicodeScalars.reduce(0) { ($0 &* 31) &+ Int($1.value) }
        // A small palette of pleasant colors
        let palette: [Color] = [
            Color(red: 0.35, green: 0.56, blue: 0.98),
            Color(red: 0.99, green: 0.59, blue: 0.26),
            Color(red: 0.36, green: 0.78, blue: 0.45),
            Color(red: 0.82, green: 0.41, blue: 0.93),
            Color(red: 0.96, green: 0.42, blue: 0.48),
            Color(red: 0.41, green: 0.75, blue: 0.87),
            Color(red: 0.96, green: 0.76, blue: 0.26)
        ]
        return palette[abs(hash) % palette.count]
    }
    
    var body: some View {
        ZStack {
            Circle()
                .fill(backgroundColor.opacity(0.9))
            Text(initials)
                .font(.system(size: size * 0.5, weight: .semibold))
                .foregroundColor(.white)
                .minimumScaleFactor(0.5)
        }
        .frame(width: size, height: size)
        .clipShape(Circle())
        .overlay(
            Circle()
                .stroke(Color.white.opacity(0.12), lineWidth: 0.5)
        )
    }
}

private struct LabelRow: View {
    @ObservedObject var viewModel: EmailViewModel
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 6) {
                // 🚫 INBOX BUTTON DISABLED - Only show labels
                // Commented out inbox button:
                // InboxButton(viewModel: viewModel)
                
                // Dynamic labels from Mail.app
                if viewModel.isLabelsLoading {
                    // Placeholder labels that match the exact styling of real labels
                    ForEach(0..<4, id: \.self) { _ in
                        PlaceholderLabelButton()
                    }
                } else if viewModel.availableLabels.isEmpty {
                    // No labels with emails found
                    HStack(spacing: 4) {
                        Image(systemName: "folder.badge.minus")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                        Text("No labels with emails found")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 7)
                } else {
                    // Available labels
                    ForEach(viewModel.availableLabels, id: \.self) { label in
                        LabelButton(
                            label: label,
                            isSelected: viewModel.selectedLabel == label,
                            viewModel: viewModel
                        )
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .center)
            .padding(.horizontal, 12)
            .padding(.vertical, 2) // a little vertical air for the labels strip
        }
    }
}

private struct InboxButton: View {
    @ObservedObject var viewModel: EmailViewModel
    
    var body: some View {
        Button(action: {
            Task { await viewModel.clearLabelSelection() }
        }) {
            Text("Inbox")
                .font(.caption)
                .padding(.horizontal, 12)
                .padding(.vertical, 7)
                .background(
                    viewModel.selectedLabel == nil 
                        ? Color.white.opacity(0.25) 
                        : Color.white.opacity(0.12)
                )
                .foregroundColor(.white)
                .clipShape(Capsule())
                .overlay(
                    Capsule().stroke(
                        viewModel.selectedLabel == nil 
                            ? Color.white.opacity(0.4) 
                            : Color.white.opacity(0.2), 
                        lineWidth: viewModel.selectedLabel == nil ? 1.0 : 0.5
                    )
                )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

private struct LabelButton: View {
    let label: String
    let isSelected: Bool
    @ObservedObject var viewModel: EmailViewModel
    @State private var isHovered: Bool = false
    
    // Color mapping for label backgrounds (active state)
    private var labelColor: Color {
        let lowercased = label.lowercased()
        
        // Color palette from design system
        if lowercased.contains("respond") || lowercased.contains("reply") {
            return Color(red: 0.890, green: 0.639, blue: 0.588) // #E3A396
        }
        if lowercased == "fyi" || lowercased.contains("fyi") {
            return Color(red: 0.961, green: 0.749, blue: 0.471) // #F5BF78
        }
        if lowercased.contains("comment") || lowercased.contains("feedback") {
            return Color(red: 0.973, green: 0.914, blue: 0.569) // #F8E991
        }
        if lowercased.contains("notif") || lowercased.contains("alert") {
            return Color(red: 0.529, green: 0.867, blue: 0.675) // #87DDAC
        }
        if lowercased.contains("meeting") || lowercased.contains("calendar") || lowercased.contains("event") || lowercased.contains("update") {
            return Color(red: 0.647, green: 0.835, blue: 0.882) // #A5D5E1
        }
        if lowercased.contains("await") || lowercased.contains("pending") {
            return Color(red: 0.663, green: 0.753, blue: 0.941) // #A9C0F0
        }
        if lowercased.contains("action") || lowercased.contains("done") || lowercased.contains("complet") || lowercased.contains("archive") {
            return Color(red: 0.800, green: 0.741, blue: 0.925) // #CCBDEC
        }
        if lowercased.contains("market") || lowercased.contains("promo") || lowercased.contains("campaign") {
            return Color(red: 0.961, green: 0.835, blue: 0.875) // #F5D5DF
        }
        
        // Default fallback - use the Awaiting Reply color as neutral option
        return Color(red: 0.663, green: 0.753, blue: 0.941) // #A9C0F0
    }
    
    var body: some View {
        Button(action: {
            Task { await viewModel.selectLabel(label) }
        }) {
            HStack(spacing: 6) {
                // Colored dot indicator - only show when selected/active
                if isSelected {
                    Circle()
                        .fill(labelColor)
                        .frame(width: 6, height: 6)
                }
                
                Text(label)
                    .font(.caption)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 7)
            .background(
                Group {
                    if isHovered || isSelected {
                        Color.black.opacity(0.2)
                    } else {
                        Color.clear
                    }
                }
            )
            .foregroundColor(.white)
            .clipShape(Capsule())
            .overlay(
                Capsule().stroke(
                    isSelected
                        ? Color.white.opacity(0.7)
                        : (isHovered ? Color.white.opacity(0.3) : Color.clear), 
                    lineWidth: 0.5
                )
            )
        }
        .buttonStyle(PlainButtonStyle())
        .onHover { hovering in
            isHovered = hovering
        }
    }
}

private struct PlaceholderLabelButton: View {
    var body: some View {
        // Placeholder text
        Rectangle()
            .fill(Color.white.opacity(0.3))
            .frame(width: 50, height: 10)
            .cornerRadius(2)
            .padding(.horizontal, 12)
            .padding(.vertical, 7)
            .background(Color.clear)
            .clipShape(Capsule())
            .redacted(reason: .placeholder)
    }
}

// MARK: - Preview

struct EmailView_Previews: PreviewProvider {
    static var previews: some View {
        EmailView()
            .frame(width: 600, height: 188)
            .background(Color.black)
    }
}
