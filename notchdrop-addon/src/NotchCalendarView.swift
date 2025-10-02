//
//  NotchCalendarView.swift
//  NotchDrop
//
//  Created by AI Assistant on 2024/10/02.
//

import SwiftUI
import EventKit
import Foundation

// MARK: - Color Extension for Hex Support
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

// MARK: - Calendar Configuration
struct CalendarConfig: Equatable {
    var past: Int = 7
    var future: Int = 14
    var steps: Int = 1  // Each step is one day
    var spacing: CGFloat = 0
    var showsText: Bool = true
    var offset: Int = 2  // Number of dates to the left of the selected date
}

// MARK: - Event Model
struct NotchEventModel: Identifiable, Equatable {
    let id: String
    let title: String
    let start: Date
    let end: Date
    let isAllDay: Bool
    let location: String?
    let calendar: NotchCalendarInfo
    let type: EventType
    
    enum EventType: Equatable {
        case event
        case reminder(completed: Bool)
        
        var isReminder: Bool {
            switch self {
            case .reminder: return true
            case .event: return false
            }
        }
    }
    
    var eventStatus: EventStatus {
        let now = Date()
        if end < now {
            return .ended
        } else if start <= now && end > now {
            return .ongoing
        } else {
            return .upcoming
        }
    }
    
    enum EventStatus {
        case upcoming, ongoing, ended
    }
    
    func calendarAppURL() -> URL? {
        // Create URL to open in Calendar app
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyyMMdd'T'HHmmss"
        let startString = formatter.string(from: start)
        return URL(string: "calshow:\(startString)")
    }
}

struct NotchCalendarInfo: Equatable {
    let title: String
    let color: NSColor
    
    init(title: String, color: NSColor) {
        self.title = title
        self.color = color
    }
}

// MARK: - Calendar Manager
@MainActor
class NotchCalendarManager: ObservableObject {
    static let shared = NotchCalendarManager()
    
    @Published var events: [NotchEventModel] = []
    @Published var hasPermission = false
    
    private let eventStore = EKEventStore()
    private var currentDate = Date()
    
    private init() {
        requestPermission()
    }
    
    func requestPermission() {
        // Check current authorization status first
        let currentStatus = EKEventStore.authorizationStatus(for: .event)
        print("📅 Current calendar authorization status: \(currentStatus.rawValue)")
        
        // If already authorized, set permission and load events
        if #available(macOS 14.0, *) {
            if currentStatus == .fullAccess || currentStatus == .writeOnly {
                print("📅 Calendar already authorized")
                hasPermission = true
                loadEvents()
                return
            }
        } else {
            if currentStatus == .authorized {
                print("📅 Calendar already authorized (legacy)")
                hasPermission = true
                loadEvents()
                return
            }
        }
        
        // Request permission if not already granted
        if #available(macOS 14.0, *) {
            // Use new API for macOS 14+
            print("📅 Requesting full calendar access...")
            eventStore.requestFullAccessToEvents { [weak self] granted, error in
                DispatchQueue.main.async {
                    print("📅 Calendar permission granted: \(granted)")
                    if let error = error {
                        print("📅 Calendar permission error: \(error)")
                    }
                    self?.hasPermission = granted
                    if granted {
                        self?.loadEvents()
                    }
                }
            }
        } else {
            // Use legacy API for older macOS versions
            print("📅 Requesting calendar access (legacy)...")
            eventStore.requestAccess(to: .event) { [weak self] granted, error in
                DispatchQueue.main.async {
                    print("📅 Calendar permission granted: \(granted)")
                    if let error = error {
                        print("📅 Calendar permission error: \(error)")
                    }
                    self?.hasPermission = granted
                    if granted {
                        self?.loadEvents()
                    }
                }
            }
        }
        
        // Also request reminder access
        let reminderStatus = EKEventStore.authorizationStatus(for: .reminder)
        print("📅 Current reminder authorization status: \(reminderStatus.rawValue)")
        
        if #available(macOS 14.0, *) {
            if reminderStatus != .fullAccess && reminderStatus != .writeOnly {
                eventStore.requestFullAccessToReminders { [weak self] granted, error in
                    DispatchQueue.main.async {
                        print("📅 Reminder permission granted: \(granted)")
                        if granted {
                            self?.loadEvents()
                        }
                    }
                }
            }
        } else {
            if reminderStatus != .authorized {
                eventStore.requestAccess(to: .reminder) { [weak self] granted, error in
                    DispatchQueue.main.async {
                        print("📅 Reminder permission granted: \(granted)")
                        if granted {
                            self?.loadEvents()
                        }
                    }
                }
            }
        }
    }
    
    func updateCurrentDate(_ date: Date) async {
        currentDate = date
        loadEvents()
    }
    
    private func loadEvents() {
        guard hasPermission else { 
            print("📅 No calendar permission, skipping event load")
            return 
        }
        
        let calendar = Calendar.current
        let startOfDay = calendar.startOfDay(for: currentDate)
        let endOfDay = calendar.date(byAdding: .day, value: 1, to: startOfDay) ?? startOfDay
        
        print("📅 Loading events for date: \(currentDate)")
        print("📅 Date range: \(startOfDay) to \(endOfDay)")
        
        // Load calendar events
        let predicate = eventStore.predicateForEvents(withStart: startOfDay, end: endOfDay, calendars: nil)
        let ekEvents = eventStore.events(matching: predicate)
        
        print("📅 Found \(ekEvents.count) calendar events")
        
        // Load reminders
        let reminderPredicate = eventStore.predicateForReminders(in: nil)
        eventStore.fetchReminders(matching: reminderPredicate) { [weak self] reminders in
            DispatchQueue.main.async {
                guard let self = self else { return }
                
                var allEvents: [NotchEventModel] = []
                
                // Convert calendar events
                for ekEvent in ekEvents {
                    print("📅 Processing event: \(ekEvent.title ?? "Untitled") at \(ekEvent.startDate)")
                    let event = NotchEventModel(
                        id: ekEvent.eventIdentifier,
                        title: ekEvent.title ?? "Untitled Event",
                        start: ekEvent.startDate,
                        end: ekEvent.endDate,
                        isAllDay: ekEvent.isAllDay,
                        location: ekEvent.location,
                        calendar: NotchCalendarInfo(
                            title: ekEvent.calendar.title,
                            color: NSColor(cgColor: ekEvent.calendar.cgColor) ?? .systemBlue
                        ),
                        type: .event
                    )
                    allEvents.append(event)
                }
                
                // Convert reminders for today
                if let reminders = reminders {
                    for reminder in reminders {
                        if let dueDate = reminder.dueDateComponents?.date,
                           calendar.isDate(dueDate, inSameDayAs: self.currentDate) {
                            let event = NotchEventModel(
                                id: reminder.calendarItemIdentifier,
                                title: reminder.title ?? "Untitled Reminder",
                                start: dueDate,
                                end: dueDate,
                                isAllDay: true,
                                location: nil,
                                calendar: NotchCalendarInfo(
                                    title: reminder.calendar.title,
                                    color: NSColor(cgColor: reminder.calendar.cgColor) ?? .systemOrange
                                ),
                                type: .reminder(completed: reminder.isCompleted)
                            )
                            allEvents.append(event)
                        }
                    }
                }
                
                // Sort events by start time
                self.events = allEvents.sorted { $0.start < $1.start }
                print("📅 Final event count: \(self.events.count)")
                for event in self.events {
                    print("📅 Event: \(event.title) at \(event.start)")
                }
            }
        }
    }
    
    func setReminderCompleted(reminderID: String, completed: Bool) async {
        guard let reminder = eventStore.calendarItem(withIdentifier: reminderID) as? EKReminder else { return }
        
        reminder.isCompleted = completed
        
        do {
            try eventStore.save(reminder, commit: true)
            loadEvents() // Refresh events
        } catch {
            print("Failed to update reminder: \(error)")
        }
    }
}

// MARK: - Wheel Picker Component
struct NotchWheelPicker: View {
    @ObservedObject var vm: NotchViewModel
    @Binding var selectedDate: Date
    @State private var scrollPosition: Int?
    @State private var haptics: Bool = false
    @State private var byClick: Bool = false
    let config: CalendarConfig

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 16) {
                let spacerNum = config.offset
                let dateCount = totalDateItems()
                let totalItems = dateCount + 2 * spacerNum
                ForEach(0..<totalItems, id: \.self) { index in
                    if index < spacerNum || index >= spacerNum + dateCount {
                        // Leading/trailing spacers sized to match a date cell
                        Spacer()
                            .frame(width: 28, height: 30)
                            .id(index)
                    } else {
                        let date = dateForItemIndex(index: index, spacerNum: spacerNum)
                        let isSelected = Calendar.current.isDate(date, inSameDayAs: selectedDate)
                        dateButton(date: date, isSelected: isSelected, id: index) {
                            selectedDate = date
                            byClick = true
                            withAnimation {
                                scrollPosition = index
                            }
                            // Add haptic feedback if enabled in NotchDrop settings
                            if vm.hapticFeedback {
                                haptics.toggle()
                            }
                        }
                    }
                }
            }
            .frame(height: 30)
            .scrollTargetLayout()
        }
        .scrollIndicators(.never)
        .scrollPosition(id: $scrollPosition, anchor: .center)
        .scrollTargetBehavior(.viewAligned)  // Ensures scroll view snaps the centered view
        .safeAreaPadding(.horizontal)
        .sensoryFeedback(.alignment, trigger: haptics)
        .onChange(of: scrollPosition) { oldValue, newValue in
            if !byClick {
                handleScrollChange(newValue: newValue, config: config)
            } else {
                byClick = false
            }
        }
        .onAppear {
            scrollToToday(config: config)
        }
        // When parent updates the bound selectedDate (e.g., view reopen), center the wheel on it
        .onChange(of: selectedDate) { _, newValue in
            let targetIndex = indexForDate(newValue)
            if scrollPosition != targetIndex {
                byClick = true
                withAnimation {
                    scrollPosition = targetIndex
                }
            }
        }
    }

    private func dateButton(
        date: Date, isSelected: Bool, id: Int, onClick: @escaping () -> Void
    ) -> some View {
        let isToday = Calendar.current.isDateInToday(date)
        
        return Button(action: onClick) {
            VStack(spacing: 0) {
                // Date number (larger, on top)
                Text("\(date.day)")
                    .font(.system(size: isToday ? 14 : 12, weight: isToday ? .bold : .semibold))
                    .foregroundColor(isSelected ? Color(hex: "79ecc9") ?? Color.blue : Color.white)
                
                // Day of week (smaller, below)
                Text(dateToString(for: date))
                    .font(.system(size: isToday ? 7 : 6, weight: isToday ? .semibold : .medium))
                    .foregroundColor(isSelected ? Color(hex: "79ecc9") ?? Color.blue : Color.white.opacity(0.6))
                
                // Teal dot for selected
                if isSelected {
                    Circle()
                        .fill(Color(hex: "79ecc9") ?? Color.blue)
                        .frame(width: 4, height: 4)
                } else {
                    Spacer()
                        .frame(height: 4)
                }
            }
            .frame(width: 28, height: 30)
        }
        .buttonStyle(PlainButtonStyle())
        .id(id)
    }


    func handleScrollChange(newValue: Int?, config: CalendarConfig) {
        guard let newIndex = newValue else { return }
        let spacerNum = config.offset
        let dateCount = totalDateItems()
        guard (spacerNum..<(spacerNum + dateCount)).contains(newIndex) else { return }
        let date = dateForItemIndex(index: newIndex, spacerNum: spacerNum)
        if !Calendar.current.isDate(date, inSameDayAs: selectedDate) {
            selectedDate = date
            if vm.hapticFeedback {
                haptics.toggle()
            }
        }
    }

    private func scrollToToday(config: CalendarConfig) {
        let today = Date()
        byClick = true
        scrollPosition = indexForDate(today)
        selectedDate = today
    }

    // MARK: - Index/Date mapping with steps and spacers
    private func indexForDate(_ date: Date) -> Int {
        let spacerNum = config.offset
        let cal = Calendar.current
        let today = cal.startOfDay(for: Date())
        let startDate = cal.startOfDay(for: cal.date(byAdding: .day, value: -config.past, to: today) ?? today)
        let target = cal.startOfDay(for: date)
        let days = cal.dateComponents([.day], from: startDate, to: target).day ?? 0
        let stepIndex = max(0, min(days / max(config.steps, 1), totalDateItems() - 1))
        return spacerNum + stepIndex
    }

    private func dateForItemIndex(index: Int, spacerNum: Int) -> Date {
        let cal = Calendar.current
        let today = cal.startOfDay(for: Date())
        let startDate = cal.date(byAdding: .day, value: -config.past, to: today) ?? today
        let stepIndex = index - spacerNum
        return cal.date(byAdding: .day, value: stepIndex * max(config.steps, 1), to: startDate) ?? today
    }

    private func totalDateItems() -> Int {
        let range = config.past + config.future
        let step = max(config.steps, 1)
        return Int(ceil(Double(range) / Double(step))) + 1
    }

    private func dateToString(for date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "E"
        return formatter.string(from: date)
    }
}

// MARK: - Main Calendar View
struct NotchCalendarView: View {
    @ObservedObject var vm: NotchViewModel
    @ObservedObject private var calendarManager = NotchCalendarManager.shared
    @State private var selectedDate = Date()

    var body: some View {
        VStack(spacing: 2) {
            // Month and year header with horizontal date picker
            VStack(spacing: 2) {
                HStack {
                    Text(selectedDate.formatted(.dateTime.month(.abbreviated)))
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(.white)
                        .textCase(.uppercase)
                        .padding(.top, 2)
                    Spacer()
                }
                
                // Horizontal date picker
                NotchWheelPicker(vm: vm, selectedDate: $selectedDate, config: CalendarConfig())
            }

            // Events list with increased spacing
            let filteredEvents = NotchEventListView.filteredEvents(
                events: calendarManager.events
            )
            if filteredEvents.isEmpty {
                Spacer(minLength: 6) // Slightly more space when no events
                NotchEmptyEventsView()
                Spacer(minLength: 0)
            } else {
                Spacer(minLength: 4) // Small gap when there are events
                NotchEventListView(vm: vm, events: calendarManager.events)
            }
        }
        .background(Color.clear)
        .listRowBackground(Color.clear)
        .padding(.top, 1)
        .onChange(of: selectedDate) {
            Task {
                await calendarManager.updateCurrentDate(selectedDate)
            }
        }
        .onAppear {
            print("📅 NotchCalendarView appeared, loading events for today")
            Task {
                await calendarManager.updateCurrentDate(selectedDate)
            }
        }
        .onChange(of: vm.status) { _, _ in
            Task {
                await calendarManager.updateCurrentDate(Date.now)
                selectedDate = Date.now
            }
        }
    }
}

// MARK: - Empty Events View
struct NotchEmptyEventsView: View {
    var body: some View {
        VStack(spacing: 4) {
            Image(systemName: "calendar.badge.checkmark")
                .font(.title2)
                .foregroundColor(Color.white.opacity(0.4))
            Text("No events today")
                .font(.caption)
                .foregroundColor(.white.opacity(0.6))
        }
        .background(Color.clear)
    }
}

// MARK: - Event List View
struct NotchEventListView: View {
    @Environment(\.openURL) private var openURL
    @ObservedObject var vm: NotchViewModel
    @ObservedObject private var calendarManager = NotchCalendarManager.shared
    let events: [NotchEventModel]

    static func filteredEvents(events: [NotchEventModel]) -> [NotchEventModel] {
        events.filter { event in
            if event.type.isReminder {
                if case .reminder(let completed) = event.type {
                    return !completed // Always show incomplete reminders, hide completed ones by default
                }
            }
            return true
        }
    }

    private var filteredEvents: [NotchEventModel] {
        Self.filteredEvents(events: events)
    }

    var body: some View {
        List {
            ForEach(Array(filteredEvents.enumerated()), id: \.element.id) { index, event in
                Button(action: {
                    if let url = event.calendarAppURL() {
                        openURL(url)
                    }
                }) {
                    eventRow(event, isLast: index == filteredEvents.count - 1)
                }
                .padding(.leading, -5)
                .buttonStyle(PlainButtonStyle())
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
            }
        }
        .listStyle(.plain)
        .scrollIndicators(.never)
        .scrollContentBackground(.hidden)
        .background(Color.clear)
        Spacer(minLength: 0)
    }

    private func eventRow(_ event: NotchEventModel, isLast: Bool = false) -> some View {
        if event.type.isReminder {
            let isCompleted: Bool
            if case .reminder(let completed) = event.type {
                isCompleted = completed
            } else {
                isCompleted = false
            }
            return AnyView(
                HStack(spacing: 8) {
                    NotchReminderToggle(
                        isOn: Binding(
                            get: { isCompleted },
                            set: { newValue in
                                Task {
                                    await calendarManager.setReminderCompleted(
                                        reminderID: event.id, completed: newValue
                                    )
                                }
                            }
                        ),
                        color: Color(event.calendar.color)
                    )
                    .opacity(1.0)  // Ensure the toggle is always fully opaque
                    HStack {
                        Text(event.title)
                            .font(.callout)
                            .foregroundColor(.white)
                            .lineLimit(1)
                        Spacer(minLength: 0)
                        VStack(alignment: .trailing, spacing: 4) {
                            Text(event.start, style: .time)
                                .foregroundColor(.white)
                                .font(.caption)
                        }
                    }
                    .opacity(
                        isCompleted
                            ? 0.4
                            : event.start < Date.now && Calendar.current.isDateInToday(event.start)
                                ? 0.6 : 1.0
                    )
                }
                .padding(.vertical, 4)
            )
        } else {
            return AnyView(
                 VStack(spacing: 0) {
                     HStack(alignment: .center, spacing: 0) {
                         Text(event.title)
                             .font(.system(size: 12, weight: .medium))
                             .foregroundColor(event.eventStatus == .ended ? Color.white.opacity(0.5) : .white)
                             .lineLimit(1)
                         
                         Spacer()
                         
                         if event.isAllDay {
                             Text("All Day")
                                 .font(.system(size: 10, weight: .medium))
                                 .foregroundColor(event.eventStatus == .ended ? Color.white.opacity(0.5) : .white)
                         } else {
                             Text(formatTimeRange(start: event.start, end: event.end))
                                 .font(.system(size: 10, weight: .medium))
                                 .foregroundColor(event.eventStatus == .ended ? Color.white.opacity(0.5) : .white)
                         }
                     }
                     .padding(.vertical, 8)
                     
                     // Divider line (only if not last event)
                     if !isLast {
                         Rectangle()
                             .fill(Color.white.opacity(0.2))
                             .frame(height: 0.5)
                     }
                 }
            )
        }
    }
    
    private func formatTimeRange(start: Date, end: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "h:mm a"
        
        let startTime = formatter.string(from: start).uppercased()
        let endTime = formatter.string(from: end).uppercased()
        
        // Remove :00 from times for cleaner display (12:00 PM becomes 12 PM)
        let cleanStartTime = startTime.replacingOccurrences(of: ":00", with: "")
        let cleanEndTime = endTime.replacingOccurrences(of: ":00", with: "")
        
        return "\(cleanStartTime) - \(cleanEndTime)"
    }
}

// MARK: - Reminder Toggle
struct NotchReminderToggle: View {
    @Binding var isOn: Bool
    var color: Color

    var body: some View {
        Button(action: {
            isOn.toggle()
        }) {
            ZStack {
                // Outer ring
                Circle()
                    .strokeBorder(color, lineWidth: 2)
                    .frame(width: 14, height: 14)
                // Inner fill
                if isOn {
                    Circle()
                        .fill(color)
                        .frame(width: 8, height: 8)
                }
                Circle()
                    .fill(Color.black.opacity(0.001))
                    .frame(width: 14, height: 14)
            }
        }
        .buttonStyle(PlainButtonStyle())
        .padding(0)
        .accessibilityLabel(isOn ? "Mark as incomplete" : "Mark as complete")
    }
}

// MARK: - Date Extension
extension Date {
    var day: Int {
        Calendar.current.component(.day, from: self)
    }
}

// MARK: - NotchViewModel Extension
extension NotchViewModel {
    var hideCompletedReminders: Bool {
        // Default to false, can be made configurable later
        false
    }
}
