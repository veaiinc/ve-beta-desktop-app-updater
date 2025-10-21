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
                    if viewModel.isLoading && viewModel.emails.isEmpty {
                        // Loading placeholders
                        ForEach(0..<4, id: \.self) { _ in
                            RoundedRectangle(cornerRadius: 12)
                                .fill(Color(red: 0.32, green: 0.59, blue: 0.89).opacity(0.2))
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
//            LabelRow()
//                .padding(.top, 2) // slight separation from cards
        }
        .onAppear {
            // Record user activity and use smart fetch
            viewModel.recordUserActivity()
            Task { await viewModel.fetchIfNeeded() }
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
                .fill(Color(red: 0.32, green: 0.59, blue: 0.89).opacity(0.2))
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
                    Spacer()
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
            // Priority 1: Use profile picture data from Contacts (via AppleScript)
            if let profilePictureData = email.profilePictureData,
               let nsImage = NSImage(data: profilePictureData) {
                Image(nsImage: nsImage)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: size, height: size)
                    .clipShape(Circle())
                    .onAppear {
                        print("📸 [UI] Using Contacts/AppleScript image (\(profilePictureData.count) bytes)")
                    }
            } else if let profilePictureData = email.profilePictureData {
                // Data exists but failed to decode – fallback to URL or placeholder
                if let photoURL = email.photoURL {
                    FallbackAsyncProfileImage(email: email, primaryURL: photoURL, size: size)
                        .onAppear {
                            print("📸 [UI] Failed to decode Contacts image (\(profilePictureData.count) bytes) → URL fallback")
                        }
                } else {
                    MonogramAvatar(name: email.senderName, address: email.senderAddress, size: size)
                        .onAppear {
                            print("📸 [UI] Failed to decode Contacts image and no URL → Monogram")
                        }
                }
            }
            // Priority 2: Use Gravatar/DiceBear URL fallback
            else if let photoURL = email.photoURL {
                FallbackAsyncProfileImage(email: email, primaryURL: photoURL, size: size)
            }
            // Priority 3: Final fallback → Monogram avatar (offline)
            else {
                MonogramAvatar(name: email.senderName, address: email.senderAddress, size: size)
            }
        }
        .frame(width: size, height: size) // Ensure consistent sizing
        .clipped() // Prevent any overflow
    }
}

// Loads primaryURL (e.g., Gravatar). If it fails, falls back to DiceBear based on email/senderName.
// If that fails too, shows a local monogram avatar.
private struct FallbackAsyncProfileImage: View {
    let email: EmailItem
    let primaryURL: URL
    let size: CGFloat
    @State private var phase: Phase = .primary
    
    private enum Phase {
        case primary
        case fallbackURL
        case monogram
    }
    
    private var fallbackURL: URL? {
        // Build DiceBear fallback deterministically
        let seed: String
        if let addr = email.senderAddress, !addr.isEmpty {
            seed = addr
        } else {
            seed = email.senderName.isEmpty ? "user" : email.senderName
        }
        let safeSeed = seed.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "user"
        return URL(string: "https://api.dicebear.com/7.x/avataaars/svg?seed=\(safeSeed)")
    }
    
    var body: some View {
        Group {
            switch phase {
            case .primary:
                AsyncImage(url: primaryURL) { result in
                    switch result {
                    case .success(let image):
                             image
                                 .resizable()
                                 .aspectRatio(contentMode: .fill)
                                 .frame(width: size, height: size)
                                 .clipShape(Circle())
                    case .failure:
                        // Gravatar likely 404 → try DiceBear
                        Color.clear
                            .frame(width: size, height: size)
                            .onAppear { phase = .fallbackURL }
                    case .empty:
                        Circle()
                            .fill(Color.gray.opacity(0.3))
                            .frame(width: size, height: size)
                    @unknown default:
                        Circle()
                            .fill(Color.gray.opacity(0.3))
                            .frame(width: size, height: size)
                    }
                }
            case .fallbackURL:
                if let url = fallbackURL {
                    AsyncImage(url: url) { result in
                        switch result {
                        case .success(let image):
                             image
                                 .resizable()
                                 .aspectRatio(contentMode: .fill)
                                 .frame(width: size, height: size)
                                 .clipShape(Circle())
                        case .failure:
                            // DiceBear failed or blocked → monogram
                            Color.clear
                                .frame(width: size, height: size)
                                .onAppear { phase = .monogram }
                        case .empty:
                            Circle()
                                .fill(Color.gray.opacity(0.3))
                                .frame(width: size, height: size)
                        @unknown default:
                            Circle()
                                .fill(Color.gray.opacity(0.3))
                                .frame(width: size, height: size)
                        }
                    }
                } else {
                    MonogramAvatar(name: email.senderName, address: email.senderAddress, size: size)
                }
            case .monogram:
                MonogramAvatar(name: email.senderName, address: email.senderAddress, size: size)
            }
        }
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
    let labels = [
        "Actioned", "To respond", "FYI", "Comment", "Notification",
        "Awaiting reply", "Risks", "Suggestions", "Opportunity"
    ]
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 6) {
                ForEach(labels, id: \.self) { label in
                    Text(label)
                        .font(.caption)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 7)
                        .background(Color.white.opacity(0.12))
                        .foregroundColor(.white)
                        .clipShape(Capsule())
                        .overlay(
                            Capsule().stroke(Color.white.opacity(0.2), lineWidth: 0.5)
                        )
                }
            }
            .frame(maxWidth: .infinity, alignment: .center)
            .padding(.horizontal, 12)
            .padding(.vertical, 2) // a little vertical air for the labels strip
        }
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
