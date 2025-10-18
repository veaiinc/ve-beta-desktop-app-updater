import SwiftUI

private struct EmailCard: View {
    let item: EmailItem
    
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(item.displaySender)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.white)
                .lineLimit(1)
            
            Text(item.displayPreview)
                .font(.system(size: 12))
                .foregroundColor(.secondary)
                .lineLimit(3)
        }
        .padding(10)
        .frame(width: 228, height: 92, alignment: .topLeading)
        .background(Color.white.opacity(0.08))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.white.opacity(0.12), lineWidth: 0.5)
        )
    }
}

struct EmailView: View {
    @StateObject private var viewModel = EmailViewModel()
    
    var body: some View {
        VStack(spacing: 8) {
            // Header with refresh
            HStack {
                Text("Inbox")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(.white)
                Spacer()
                Button {
                    Task { await viewModel.fetch() }
                } label: {
                    Image(systemName: "arrow.clockwise")
                        .foregroundColor(.white.opacity(0.9))
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 8)
            
            if let error = viewModel.errorMessage {
                Text(error)
                    .font(.system(size: 11))
                    .foregroundColor(.red)
                    .padding(.horizontal, 8)
            }
            
            ScrollView(.horizontal, showsIndicators: false) {
                LazyHStack(spacing: 8) {
                    if viewModel.isLoading && viewModel.emails.isEmpty {
                        ForEach(0..<4, id: \.self) { _ in
                            RoundedRectangle(cornerRadius: 12)
                                .fill(Color.white.opacity(0.06))
                                .frame(width: 228, height: 92)
                                .redacted(reason: .placeholder)
                        }
                    } else {
                        ForEach(viewModel.emails) { email in
                            EmailCard(item: email)
                                .contentShape(Rectangle())
                                .onTapGesture {
                                    Task { await viewModel.open(email) }
                                }
                        }
                    }
                }
                .padding(.horizontal, 8)
            }
        }
        .onAppear {
            Task { await viewModel.fetch() }
        }
    }
}

struct EmailView_Previews: PreviewProvider {
    static var previews: some View {
        EmailView().frame(width: 600, height: 188)
            .background(Color.black)
    }
}

