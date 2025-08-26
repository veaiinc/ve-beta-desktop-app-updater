import SwiftUI

struct NotchHeaderView: View {
    @StateObject var vm: NotchViewModel

    var body: some View {
        HStack {
            // Left side - Menu button
            Button(action: {
                vm.contentType = .menu
            }) {
                Image(systemName: "line.3.horizontal")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundStyle(.white.opacity(0.8))
                    .frame(width: 32, height: 32)
                    .background(.white.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
            .buttonStyle(PlainButtonStyle())
            .hoverEffect(.lift)
            
            Spacer()
            
            // Center - Title
            Text("NotchDrop")
                .font(.system(.headline, design: .rounded, weight: .semibold))
                .foregroundStyle(.white.opacity(0.9))
                .shadow(color: .black.opacity(0.3), radius: 1, x: 0, y: 1)
            
            Spacer()
            
            // Right side - Close button
            Button(action: {
                vm.notchClose()
            }) {
                Image(systemName: "xmark")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundStyle(.white.opacity(0.8))
                    .frame(width: 32, height: 32)
                    .background(.white.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
            .buttonStyle(PlainButtonStyle())
            .hoverEffect(.lift)
        }
        .padding(.horizontal, 8)
        .frame(height: 32)
    }
}

#Preview {
    NotchHeaderView(vm: .init())
        .padding()
        .frame(width: 600, height: 50)
        .background(.black)
        .preferredColorScheme(.dark)
}
