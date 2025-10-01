//
//  CalendarView.swift
//  Ve AI Desktop App - Calendar Integration
//
//  SwiftUI Calendar component similar to Boring Notch
//

import SwiftUI
import EventKit

// MARK: - Main Calendar View
struct CalendarView: View {
    @StateObject private var calendarVM = CalendarViewModel()
    @State private var showPermissionAlert = false
    
    var body: some View {
        Group {
            if calendarVM.hasPermission {
                CalendarContentView(viewModel: calendarVM)
            } else {
                CalendarPermissionView(
                    permissionStatus: calendarVM.permissionStatus,
                    onRequestPermission: {
                    Task {
                        print("📅 User clicked Allow Access button")
                        let granted = await calendarVM.requestPermission()
                        print("📅 Permission result: \(granted)")
                    }
                    }
                )
            }
        }
        .onAppear {
            calendarVM.checkPermissionStatus()
        }
    }
}

// MARK: - Calendar Content View
struct CalendarContentView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    var body: some View {
        VStack(spacing: 0) {
            // Calendar header with icon and title
            CalendarHeaderView()
            
            // Events list or empty state
            let events = viewModel.getDisplayEvents()
            if events.isEmpty {
                CalendarEmptyView()
            } else {
                CalendarEventsView(events: events) { event in
                    viewModel.openEventInCalendar(event)
                }
            }
        }
        .frame(width: 160, height: 80) // Compact size to fit alongside media
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.black.opacity(0.3))
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
        )
        .onTapGesture {
            // Open Calendar app on tap
            if let url = URL(string: "x-apple-calendar://") {
                NSWorkspace.shared.open(url)
            }
        }
    }
}

// MARK: - Calendar Header
struct CalendarHeaderView: View {
    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: "calendar")
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(.white.opacity(0.8))
            
            Text("Calendar")
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(.white.opacity(0.8))
            
            Spacer()
            
            // Current date indicator
            Text(DateFormatter.dayFormatter.string(from: Date()))
                .font(.system(size: 9, weight: .regular))
                .foregroundColor(.white.opacity(0.6))
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
    }
}

// MARK: - Calendar Events View
struct CalendarEventsView: View {
    let events: [CalendarEvent]
    let onEventTap: (CalendarEvent) -> Void
    
    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            LazyVStack(spacing: 4) {
                ForEach(events) { event in
                    CalendarEventRow(event: event) {
                        onEventTap(event)
                    }
                }
            }
            .padding(.horizontal, 6)
            .padding(.vertical, 4)
        }
        .frame(maxHeight: 100)
    }
}

// MARK: - Calendar Event Row
struct CalendarEventRow: View {
    let event: CalendarEvent
    let onTap: () -> Void
    
    var body: some View {
        HStack(spacing: 6) {
            // Event time indicator
            VStack(alignment: .leading, spacing: 1) {
                if event.isNow {
                    HStack(spacing: 2) {
                        Circle()
                            .fill(Color.green)
                            .frame(width: 4, height: 4)
                        Text("NOW")
                            .font(.system(size: 7, weight: .bold))
                            .foregroundColor(.green)
                    }
                } else {
                    Text(dayString)
                        .font(.system(size: 8, weight: .medium))
                        .foregroundColor(.white.opacity(0.7))
                }
                
                if !event.isAllDay {
                    Text(startTime)
                        .font(.system(size: 7, weight: .regular))
                        .foregroundColor(.white.opacity(0.5))
                }
            }
            .frame(width: 35, alignment: .leading)
            
            // Event details
            VStack(alignment: .leading, spacing: 1) {
                Text(event.title)
                    .font(.system(size: 9, weight: .medium))
                    .foregroundColor(.white)
                    .lineLimit(1)
                    .truncationMode(.tail)
                
                if let location = event.location, !location.isEmpty {
                    Text(location)
                        .font(.system(size: 7, weight: .regular))
                        .foregroundColor(.white.opacity(0.6))
                        .lineLimit(1)
                        .truncationMode(.tail)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            
            // Calendar color indicator
            Rectangle()
                .fill(Color(hex: event.color) ?? .blue)
                .frame(width: 2, height: 20)
                .clipShape(RoundedRectangle(cornerRadius: 1))
        }
        .padding(.horizontal, 6)
        .padding(.vertical, 3)
        .background(
            RoundedRectangle(cornerRadius: 6)
                .fill(event.isNow ? Color.green.opacity(0.1) : Color.white.opacity(0.05))
        )
        .onTapGesture {
            onTap()
        }
    }
    
    private var dayString: String {
        let f = DateFormatter()
        f.dateFormat = "E"
        return f.string(from: event.startDate)
    }
    
    private var startTime: String {
        if event.isAllDay { return "All day" }
        let f = DateFormatter()
        f.timeStyle = .short
        return f.string(from: event.startDate)
    }
}

// MARK: - Calendar Loading View
struct CalendarLoadingView: View {
    var body: some View {
        VStack {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                .scaleEffect(0.7)
            
            Text("Loading events...")
                .font(.system(size: 8, weight: .regular))
                .foregroundColor(.white.opacity(0.6))
        }
        .frame(height: 80)
    }
}

// MARK: - Calendar Empty View
struct CalendarEmptyView: View {
    var body: some View {
        VStack(spacing: 4) {
            Image(systemName: "calendar.badge.checkmark")
                .font(.system(size: 16, weight: .light))
                .foregroundColor(.white.opacity(0.4))
            
            Text("No upcoming events")
                .font(.system(size: 8, weight: .regular))
                .foregroundColor(.white.opacity(0.6))
                .multilineTextAlignment(.center)
        }
        .frame(height: 80)
    }
}

// MARK: - Calendar Permission View
struct CalendarPermissionView: View {
    let permissionStatus: EKAuthorizationStatus
    let onRequestPermission: () -> Void
    
    var body: some View {
        VStack(spacing: 6) {
            Image(systemName: "calendar.badge.exclamationmark")
                .font(.system(size: 14, weight: .light))
                .foregroundColor(.orange)
            
            Text("Calendar Access")
                .font(.system(size: 9, weight: .medium))
                .foregroundColor(.white)
            
            Text(permissionMessage)
                .font(.system(size: 7, weight: .regular))
                .foregroundColor(.white.opacity(0.7))
                .multilineTextAlignment(.center)
                .lineLimit(3)
            
            if permissionStatus == .notDetermined {
                Button("Allow Access") {
                    onRequestPermission()
                }
                .font(.system(size: 8, weight: .medium))
                .foregroundColor(.white)
                .padding(.horizontal, 8)
                .padding(.vertical, 3)
                .background(Color.blue.opacity(0.6))
                .clipShape(RoundedRectangle(cornerRadius: 4))
            }
        }
        .frame(width: 160, height: 120)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.black.opacity(0.3))
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.orange.opacity(0.3), lineWidth: 1)
                )
        )
    }
    
    private var permissionMessage: String {
        switch permissionStatus {
        case .notDetermined:
            return "Grant access to show your upcoming events"
        case .denied, .restricted:
            return "Enable calendar access in System Preferences"
        case .authorized:
            return "Calendar access granted"
        case .fullAccess:
            return "Calendar access granted"
        case .writeOnly:
            return "Limited calendar access granted"
        @unknown default:
            return "Calendar permission unknown"
        }
    }
}

// MARK: - Extensions
extension DateFormatter {
    static let dayFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM d"
        return formatter
    }()
}

extension Color {
    init?(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            return nil
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
