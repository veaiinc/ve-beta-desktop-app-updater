import SwiftUI

struct EmailView: View {
    @EnvironmentObject var viewModel: EmailViewModel
    
    var body: some View {
        VStack(spacing: 8) {
            // Header
//            HStack {
//                Text("Inbox")
//                    .font(.system(size: 13, weight: .semibold))
//                    .foregroundColor(.white)
//                Spacer()
//                Button {
//                    Task { await viewModel.fetch(force: true) }
//                } label: {
//                    Image(systemName: "arrow.clockwise")
//                        .foregroundColor(.white.opacity(0.9))
//                }
//                .buttonStyle(.plain)
//            }
//            .padding(.horizontal, 8)
            
            // Error message
            if let error = viewModel.errorMessage {
                Text(error)
                    .font(.system(size: 11))
                    .foregroundColor(.red)
                    .padding(.horizontal, 8)
            }
            
            // Email cards
            ScrollView(.horizontal, showsIndicators: false) {
                LazyHStack(spacing: 8) {
                    if viewModel.isLoading && viewModel.emails.isEmpty {
                        // Loading placeholders
                        ForEach(0..<4, id: \.self) { _ in
                            RoundedRectangle(cornerRadius: 12)
                                .fill(Color(red: 0.32, green: 0.59, blue: 0.89).opacity(0.2))
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
                .padding(.horizontal, 8)
            }
            
            // Labels row
            LabelRow()
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
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(email.displayPreview)
                .foregroundColor(.secondary)
                .lineLimit(3)
                .font(.system(size: 12))
            
            HStack {
                Spacer()
                AsyncImage(url: email.photoURL) { image in
                    image
                        .resizable()
                        .frame(width: 20, height: 20)
                        .clipShape(Circle())
                } placeholder: {
                    Circle()
                        .fill(Color.gray.opacity(0.3))
                        .frame(width: 20, height: 20)
                }
            }
        }
        .padding(8)
        .frame(width: 228, height: 92)
        .background(Color(red: 0.32, green: 0.59, blue: 0.89).opacity(0.2))
        .cornerRadius(12)
    }
}

private struct LabelRow: View {
    let labels = [
        "Actioned", "To respond", "FYI", "Comment", "Notification",
        "Awaiting reply", "Risks", "Suggestions", "Opportunity"
    ]
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 4) {
                ForEach(labels, id: \.self) { label in
                    Text(label)
                        .font(.caption)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Color.white.opacity(0.12))
                        .foregroundColor(.white)
                        .clipShape(Capsule())
                        .overlay(
                            Capsule().stroke(Color.white.opacity(0.2), lineWidth: 0.5)
                        )
                }
            }
            .frame(maxWidth: .infinity, alignment: .center)
            .padding(.horizontal)
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
