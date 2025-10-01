//
//  BoringNotchCalendarView.swift
//  Ve AI Desktop App - Exact Boring Notch Calendar UI
//
//  Recreates the exact calendar design from Boring Notch
//

import SwiftUI
import EventKit
import AppKit

// MARK: - Main Boring Notch Style Calendar
struct BoringNotchCalendarView: View {
    @StateObject private var calendarVM = CalendarViewModel()
    @State private var baseDate: Date = Date()
    @State private var selectedDate: Date? = nil
    
    var body: some View {
        VStack(spacing: 6) {
            // Week view with native swipe recognizer (no drag)
            CalendarWeekView(baseDate: $baseDate, selectedDate: $selectedDate)
                .padding(.top, 4)
                .padding(.bottom, 2)
                .background(
                    SwipeGestureLayer(
                        onLeft: {
                            withAnimation(.easeInOut(duration: 0.15)) {
                                baseDate = Calendar.current.date(byAdding: .day, value: 7, to: baseDate) ?? baseDate
                            }
                        },
                        onRight: {
                            withAnimation(.easeInOut(duration: 0.15)) {
                                baseDate = Calendar.current.date(byAdding: .day, value: -7, to: baseDate) ?? baseDate
                            }
                        }
                    )
                )
            
            CalendarEventsList(
                events: eventsForCurrentSelection(),
                onEventTap: { event in calendarVM.openEventInCalendar(event) }
            )
        }
        .frame(width: 200, height: 100)
        .background(Color.clear)
        .onAppear { calendarVM.checkPermissionStatus() }
        .onTapGesture { openCalendarApp(date: selectedDate) }
    }
    
    private func eventsForCurrentSelection() -> [CalendarEvent] {
        if let date = selectedDate {
            let events = calendarVM.events(for: date)
            if !events.isEmpty { return Array(events.prefix(2)) }
        }
        return calendarVM.getDisplayEvents()
    }
}

// Helper to open Calendar app reliably
private func openCalendarApp(date: Date? = nil) {
    if let date = date {
        let secs = date.timeIntervalSinceReferenceDate
        if let url = URL(string: "calshow:\(secs)") {
            if NSWorkspace.shared.open(url) { return }
        }
    }
    let bundleId = "com.apple.iCal"
    if let appURL = NSWorkspace.shared.urlForApplication(withBundleIdentifier: bundleId) {
        _ = NSWorkspace.shared.open(appURL)
        return
    }
    let fallbackPath = "/System/Applications/Calendar.app"
    _ = NSWorkspace.shared.open(URL(fileURLWithPath: fallbackPath))
}

// MARK: - Swipe layer using horizontal scrollWheel (Magic Mouse/trackpad)
private struct SwipeGestureLayer: NSViewRepresentable {
    let onLeft: () -> Void
    let onRight: () -> Void
    
    func makeNSView(context: Context) -> ScrollView {
        let v = ScrollView()
        v.onLeft = onLeft
        v.onRight = onRight
        return v
    }
    
    func updateNSView(_ nsView: ScrollView, context: Context) {}
    
    final class ScrollView: NSView {
        var onLeft: (() -> Void)?
        var onRight: (() -> Void)?
        private var accum: CGFloat = 0
        private let threshold: CGFloat = 20
        private var lastTrigger: TimeInterval = 0
        private let debounce: TimeInterval = 0.2
        
        override func scrollWheel(with event: NSEvent) {
            // Use horizontal delta; Magic Mouse swipe reports precise deltas
            let dx = event.hasPreciseScrollingDeltas ? event.scrollingDeltaX : event.deltaX
            accum += dx
            let now = event.timestamp
            defer {
                // small decay to avoid runaway accumulation
                accum *= 0.5
            }
            guard now - lastTrigger > debounce else { return }
            if accum <= -threshold { // swipe right-to-left → next week
                lastTrigger = now
                accum = 0
                onLeft?()
            } else if accum >= threshold { // swipe left-to-right → previous week
                lastTrigger = now
                accum = 0
                onRight?()
            }
        }
    }
}

// MARK: - Week View Component (Top Section)
struct CalendarWeekView: View {
    @Binding var baseDate: Date
    @Binding var selectedDate: Date?
    private let calendar = Calendar.current
    
    private var weekDays: [Date] {
        let startOfWeek = calendar.dateInterval(of: .weekOfYear, for: baseDate)?.start ?? baseDate
        return (0..<7).compactMap { dayOffset in
            calendar.date(byAdding: .day, value: dayOffset, to: startOfWeek)
        }
    }
    
    var body: some View {
        VStack(spacing: 4) {
            HStack {
                Text(monthText.uppercased())
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.white)
                Spacer()
            }
            .padding(.horizontal, 8)
            
            HStack(spacing: 0) {
                ForEach(weekDays, id: \.self) { date in
                    WeekDayView(
                        date: date,
                        isToday: calendar.isDateInToday(date),
                        isSelected: selectedDate.map { calendar.isDate($0, inSameDayAs: date) } ?? false
                    )
                    .contentShape(Rectangle())
                    .onTapGesture {
                        withAnimation(.easeInOut(duration: 0.12)) {
                            if selectedDate.map({ calendar.isDate($0, inSameDayAs: date) }) == true {
                                selectedDate = nil
                            } else {
                                selectedDate = date
                            }
                        }
                    }
                }
            }
            .padding(.horizontal, 4)
            .background(
                SwipeGestureLayer(
                    onLeft: {
                        withAnimation(.easeInOut(duration: 0.15)) {
                            baseDate = calendar.date(byAdding: .day, value: 7, to: baseDate) ?? baseDate
                        }
                    },
                    onRight: {
                        withAnimation(.easeInOut(duration: 0.15)) {
                            baseDate = calendar.date(byAdding: .day, value: -7, to: baseDate) ?? baseDate
                        }
                    }
                )
            )
        }
    }
    
    private var monthText: String {
        let formatter = DateFormatter(); formatter.dateFormat = "MMM"; return formatter.string(from: baseDate)
    }
}

// MARK: - Individual Week Day View
struct WeekDayView: View {
    let date: Date
    let isToday: Bool
    let isSelected: Bool
    private let calendar = Calendar.current
    
    var body: some View {
        VStack(spacing: 0) {
            Text(dayText)
                .font(.system(size: isToday ? 16 : 14, weight: isToday ? .bold : .semibold))
                .foregroundColor(isToday || isSelected ? Color.mint : Color.white.opacity(0.7))
                .minimumScaleFactor(0.8)
            Text(dayNameText)
                .font(.system(size: 10, weight: .regular))
                .foregroundColor(isToday || isSelected ? Color.white : Color.white.opacity(0.5))
            if isToday || isSelected { Circle().fill(Color.mint).frame(width: 4, height: 4) } else { Color.clear.frame(width: 4, height: 4) }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 2)
        .background(RoundedRectangle(cornerRadius: 6).fill(isSelected ? Color.white.opacity(0.12) : Color.clear))
    }
    
    private var foreground: Color { .white }
    private var secondary: Color { .white.opacity(0.6) }
    private var dayText: String { "\(calendar.component(.day, from: date))" }
    private var dayNameText: String { let f = DateFormatter(); f.dateFormat = "E"; return f.string(from: date) }
}

// MARK: - Events List Component (Bottom Section)
struct CalendarEventsList: View {
    let events: [CalendarEvent]
    let onEventTap: (CalendarEvent) -> Void
    
    var body: some View {
        VStack(spacing: 4) {
            if events.isEmpty {
                Text("No events today")
                    .font(.system(size: 10, weight: .regular))
                    .foregroundColor(.white.opacity(0.7))
                    .frame(maxHeight: .infinity, alignment: .top)
            } else {
                if let first = events.first {
                    HStack {
                        Text(first.title)
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                            .lineLimit(1)
                        Spacer(minLength: 6)
                        Text(timeText(for: first))
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                            .lineLimit(1)
                    }
                    .contentShape(Rectangle())
                    .onTapGesture { onEventTap(first) }
                    Rectangle().fill(Color.white.opacity(0.2)).frame(height: 1)
                }
                if events.count > 1 {
                    let second = events[1]
                    HStack {
                        Text(second.title)
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(.white.opacity(0.65))
                            .lineLimit(1)
                        Spacer(minLength: 6)
                        Text(timeText(for: second))
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(.white.opacity(0.65))
                            .lineLimit(1)
                    }
                    .contentShape(Rectangle())
                    .onTapGesture { onEventTap(second) }
                }
            }
        }
        .padding(.horizontal, 10)
        .padding(.bottom, 6)
        .frame(maxHeight: .infinity, alignment: .top)
    }

    private func timeText(for event: CalendarEvent) -> String {
        if event.isAllDay { return "All day" }
        let f = DateFormatter(); f.timeStyle = .short
        return "\(f.string(from: event.startDate)) - \(f.string(from: event.endDate))"
    }
}

// MARK: - Event Row View (Compact)
struct EventRowView: View {
    let event: CalendarEvent
    let onTap: () -> Void
    
    var body: some View {
        HStack(spacing: 6) {
            // Time (compact)
            Text(timeText)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.white)
                .lineLimit(1)
                .frame(width: 82, alignment: .leading)
                .minimumScaleFactor(0.8)
            
            // Title
            Text(event.title)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(.white)
                .lineLimit(1)
                .truncationMode(.tail)
                .frame(maxWidth: .infinity, alignment: .trailing)
                .minimumScaleFactor(0.8)
        }
        .padding(.vertical, 2)
        .contentShape(Rectangle())
        .onTapGesture { onTap() }
    }
    
    private var timeText: String {
        if event.isAllDay { return "All day" }
        let f = DateFormatter(); f.timeStyle = .short
        return "\(f.string(from: event.startDate)) - \(f.string(from: event.endDate))"
    }
}

// MARK: - Permission Handling Overlay (unchanged sizing)
struct CalendarPermissionOverlay: View {
    let permissionStatus: EKAuthorizationStatus
    let onRequestPermission: () -> Void
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: "calendar.badge.exclamationmark")
                .font(.system(size: 18, weight: .regular))
                .foregroundColor(.white.opacity(0.8))
            Text("Calendar Access")
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(.white)
            Text("Enable calendar access to see your events")
                .font(.system(size: 9, weight: .regular))
                .foregroundColor(.white.opacity(0.7))
                .multilineTextAlignment(.center)
                .lineLimit(2)
            if permissionStatus == .notDetermined {
                Button("Allow") { onRequestPermission() }
                    .font(.system(size: 10, weight: .medium))
                    .foregroundColor(.white)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 5)
                    .background(RoundedRectangle(cornerRadius: 8).fill(Color.white.opacity(0.2)))
                    .buttonStyle(PlainButtonStyle())
            } else {
                Button("Open Settings") {
                    if let url = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Calendars") {
                        NSWorkspace.shared.open(url)
                    }
                }
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(.white)
                .padding(.horizontal, 14)
                .padding(.vertical, 5)
                .background(RoundedRectangle(cornerRadius: 8).fill(Color.white.opacity(0.2)))
                .buttonStyle(PlainButtonStyle())
            }
        }
        .frame(width: 200, height: 100)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(
                    LinearGradient(
                        gradient: Gradient(colors: [
                            Color(red: 0.34, green: 0.34, blue: 0.86).opacity(0.8),
                            Color(red: 0.20, green: 0.40, blue: 0.80).opacity(0.8),
                        ]),
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
        )
    }
}

// MARK: - Main Calendar Component with Permission Handling
struct BoringNotchCalendarWithPermissions: View {
    @StateObject private var calendarVM = CalendarViewModel()
    
    var body: some View {
        Group {
            if calendarVM.hasPermission {
                BoringNotchCalendarView()
            } else {
                CalendarPermissionOverlay(
                    permissionStatus: calendarVM.permissionStatus,
                    onRequestPermission: {
                        Task { await calendarVM.requestPermission() }
                    }
                )
            }
        }
        .onAppear {
            calendarVM.checkPermissionStatus()
            if calendarVM.permissionStatus == .notDetermined {
                Task { await calendarVM.requestPermission() }
            }
        }
    }
}
