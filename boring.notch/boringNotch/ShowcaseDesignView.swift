import SwiftUI

struct ShowcaseDesignView: View {
    // Colors approximating the screenshot
    private let accent = Color(red: 0.0, green: 0.74, blue: 0.60) // teal/green for selection and slider
    private let pillBg = Color.white.opacity(0.10)
    private let pillStroke = Color.white.opacity(0.35)
    private let secondary = Color.white.opacity(0.65)

    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            topControls
            dateStrip
            contentRow
        }
        .padding(.horizontal, 18)
        .padding(.vertical, 14)
        .foregroundStyle(.white)
    }

    // MARK: - Top controls (segmented pills)
    private var topControls: some View {
        HStack(spacing: 14) {
            segment(icon: "house.fill", title: "Home", selected: true)
            segment(icon: "tray.full.fill", title: "", selected: false)
            segment(icon: "display", title: "", selected: false)
            segment(textOnly: "AI")
            Spacer()
            // Right-side icons
            HStack(spacing: 16) {
                Text("ve").font(.system(size: 18, weight: .semibold, design: .rounded)).opacity(0.9)
                Image(systemName: "car.2.fill").imageScale(.medium).opacity(0.9)
                Image(systemName: "gearshape").imageScale(.medium).opacity(0.9)
            }
        }
    }

    private func segment(icon: String? = nil, title: String = "", selected: Bool = false, textOnly: String? = nil) -> some View {
        let fill = selected ? accent.opacity(0.18) : pillBg
        let stroke = selected ? accent : pillStroke
        return HStack(spacing: 8) {
            if let textOnly { Text(textOnly).font(.system(size: 14, weight: .semibold, design: .rounded)) }
            if let icon { Image(systemName: icon).imageScale(.medium) }
            if !title.isEmpty { Text(title).font(.system(size: 14, weight: .semibold, design: .rounded)) }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 8)
        .background(
            Capsule().fill(fill)
        )
        .overlay(
            Capsule().stroke(stroke, lineWidth: 1)
        )
    }

    // MARK: - Date strip
    private var dateStrip: some View {
        HStack(spacing: 18) {
            VStack(alignment: .leading, spacing: 2) {
                Text("SEPT").font(.system(size: 22, weight: .bold, design: .rounded)).opacity(0.95)
                Text("2025").font(.system(size: 18, weight: .semibold, design: .rounded)).foregroundStyle(secondary)
            }
            ForEach(sampleDates) { item in
                VStack(spacing: 4) {
                    Text("\(item.day)").font(.system(size: 22, weight: .bold, design: .rounded))
                    Text(item.weekday).font(.system(size: 14, weight: .regular, design: .rounded)).foregroundStyle(secondary)
                }
                .frame(width: 48, height: 64)
                .background(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .fill(item.selected ? accent : Color.clear)
                )
                .foregroundStyle(item.selected ? .white : .white)
            }
            Spacer()
        }
    }

    // MARK: - Main content row
    private var contentRow: some View {
        HStack(alignment: .center) {
            // Left column: event title and subtitle
            VStack(alignment: .leading, spacing: 6) {
                Text("Doctor").font(.system(size: 28, weight: .heavy, design: .rounded))
                Text("Movie").font(.system(size: 20, weight: .semibold, design: .rounded)).foregroundStyle(secondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            // Middle column: time ranges
            VStack(alignment: .leading, spacing: 6) {
                Text("12:30 PM - 1:30 PM").font(.system(size: 28, weight: .heavy, design: .rounded))
                Text("5:30PM - 7:30 PM").font(.system(size: 20, weight: .semibold, design: .rounded)).foregroundStyle(secondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            // Right column: music player
            VStack(alignment: .trailing, spacing: 12) {
                HStack(spacing: 10) {
                    Circle().fill(accent).frame(width: 34, height: 34).overlay(Image(systemName: "music.note").foregroundStyle(.white))
                    Text("Shape of you").font(.system(size: 22, weight: .semibold, design: .rounded))
                    Spacer(minLength: 0)
                }
                HStack(spacing: 10) {
                    Text("00:00").foregroundStyle(secondary)
                    ProgressView(value: 0.25)
                        .progressViewStyle(LinearProgressViewStyle(tint: accent))
                        .frame(width: 160)
                        .overlay(alignment: .leading) {
                            Circle().fill(.white).frame(width: 14, height: 14).offset(x: 160 * 0.25 - 7)
                        }
                    Text("03:50").foregroundStyle(secondary)
                }
                HStack(spacing: 18) {
                    Image(systemName: "backward.fill").imageScale(.large)
                    Image(systemName: "play.fill").imageScale(.large)
                    Image(systemName: "forward.fill").imageScale(.large)
                }
                .padding(.top, 2)
            }
            .frame(maxWidth: .infinity, alignment: .trailing)
        }
        .padding(.top, 4)
    }

    private struct DayItem: Identifiable { let id = UUID(); let day: Int; let weekday: String; let selected: Bool }
    private var sampleDates: [DayItem] {
        [
            .init(day: 22, weekday: "Mon", selected: false),
            .init(day: 23, weekday: "Tue", selected: false),
            .init(day: 24, weekday: "Wed", selected: false),
            .init(day: 25, weekday: "Thu", selected: true),
            .init(day: 26, weekday: "Fri", selected: false),
            .init(day: 27, weekday: "Sat", selected: false),
            .init(day: 28, weekday: "Sun", selected: false)
        ]
    }
}

#Preview {
    ZStack {
        RoundedRectangle(cornerRadius: 24).fill(Color.black.opacity(0.6))
        ShowcaseDesignView()
    }
    .frame(width: 640, height: 190)
    .padding()
    .background(Color(.sRGB, red: 0.15, green: 0.30, blue: 0.28, opacity: 1.0))
}
