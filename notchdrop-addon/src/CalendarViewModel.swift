//
//  CalendarViewModel.swift
//  Ve AI Desktop App - Calendar Integration (EventKit)
//
//  Real EventKit-backed model with permissions and event fetching.
//

import Foundation
import EventKit
import Combine
import SwiftUI

// MARK: - Calendar Event Model
struct CalendarEvent: Identifiable, Codable {
	let id: String
	let title: String
	let startDate: Date
	let endDate: Date
	let isAllDay: Bool
	let location: String?
	let notes: String?
	let calendar: String
	let color: String
	
	var isToday: Bool { Calendar.current.isDateInToday(startDate) }
	var isTomorrow: Bool { Calendar.current.isDateInTomorrow(startDate) }
	var isNow: Bool { let now = Date(); return startDate <= now && endDate > now }
	var isUpcoming: Bool { startDate > Date() }
}

// MARK: - View Model
final class CalendarViewModel: ObservableObject {
	// Permissions
	@Published var permissionStatus: EKAuthorizationStatus = .notDetermined
	@Published var hasPermission: Bool = false
	
	// Events
	@Published var todayEvents: [CalendarEvent] = []
	@Published var upcomingEvents: [CalendarEvent] = []
	@Published var currentEvent: CalendarEvent? = nil
	
	// Internals
	private let eventStore = EKEventStore()
	private var refreshTimer: Timer?
	private let refreshInterval: TimeInterval = 60 * 5
	private let maxEventsToShow: Int = 2
	
	deinit {
		refreshTimer?.invalidate()
	}
	
	// MARK: - Permissions
	func checkPermissionStatus() {
		let status = EKEventStore.authorizationStatus(for: .event)
		permissionStatus = status
		if #available(macOS 14.0, *) {
			hasPermission = (status == .fullAccess) || (status == .writeOnly) || (status == .authorized)
		} else {
			hasPermission = (status == .authorized)
		}
		
		if hasPermission {
			fetchEvents()
			setupRefreshTimer()
		}
	}
	
	func requestPermission() async -> Bool {
		do {
			let granted: Bool
			if #available(macOS 14.0, *) {
				granted = try await eventStore.requestFullAccessToEvents()
			} else {
				granted = try await eventStore.requestAccess(to: .event)
			}
			
			await MainActor.run {
				let status = EKEventStore.authorizationStatus(for: .event)
				self.permissionStatus = status
				if #available(macOS 14.0, *) {
					self.hasPermission = (status == .fullAccess) || (status == .writeOnly) || (status == .authorized)
				} else {
					self.hasPermission = (status == .authorized)
				}
				
				if self.hasPermission {
					self.fetchEvents()
					self.setupRefreshTimer()
				}
			}
			return granted
		} catch {
			print("❌ Calendar permission error: \(error)")
			return false
		}
	}
	
	// MARK: - Fetching
	func fetchEvents() {
		print("📅 Fetching events...")
		Task.detached { [weak self] in
			guard let self = self else { return }
			do {
				let events = try await self.fetchCalendarEvents()
				let mapped = events.map { self.mapEKEvent($0) }
				let today = mapped.filter { $0.isToday }
				let nowEvent = mapped.first(where: { $0.isNow })
				let upcoming = mapped.filter { $0.isUpcoming }.sorted { $0.startDate < $1.startDate }
				
				await MainActor.run {
					self.todayEvents = today
					self.upcomingEvents = upcoming
					self.currentEvent = nowEvent
					print("📅 Events loaded — today: \(today.count), upcoming: \(upcoming.count), now: \(nowEvent != nil)")
				}
			} catch {
				print("❌ Calendar fetch error: \(error)")
			}
		}
	}
	
	private func fetchCalendarEvents() async throws -> [EKEvent] {
		return try await withCheckedThrowingContinuation { continuation in
			DispatchQueue.global(qos: .userInitiated).async { [weak self] in
				guard let self = self else {
					continuation.resume(throwing: NSError(domain: "CalendarViewModel", code: -1))
					return
				}
				let startDate = Calendar.current.startOfDay(for: Date())
				let endDate = Calendar.current.date(byAdding: .day, value: 14, to: startDate) ?? Date().addingTimeInterval(60*60*24*14)
				let predicate = self.eventStore.predicateForEvents(withStart: startDate, end: endDate, calendars: nil)
				let events = self.eventStore.events(matching: predicate)
				continuation.resume(returning: events)
			}
		}
	}
	
	private func mapEKEvent(_ event: EKEvent) -> CalendarEvent {
		let title = event.title ?? "(No Title)"
		let calName = event.calendar.title
		let colorHex = colorFromCalendar(event.calendar)
		return CalendarEvent(
			id: event.eventIdentifier,
			title: title,
			startDate: event.startDate,
			endDate: event.endDate,
			isAllDay: event.isAllDay,
			location: event.location,
			notes: event.notes,
			calendar: calName,
			color: colorHex
		)
	}
	
	// MARK: - Timer
	private func setupRefreshTimer() {
		refreshTimer?.invalidate()
		refreshTimer = Timer.scheduledTimer(withTimeInterval: refreshInterval, repeats: true) { [weak self] _ in
			Task { @MainActor in
				self?.fetchEvents()
			}
		}
	}
	
	// MARK: - Public helpers
	func getDisplayEvents() -> [CalendarEvent] {
		let now = Date()
		var results: [CalendarEvent] = []
		
		// Current event first if present
		if let current = currentEvent {
			results.append(current)
		}
		
		// Build a unified upcoming list: prefer timed over all‑day, earliest first
		let upcomingUnified: [CalendarEvent] = (
			(todayEvents + upcomingEvents)
				.filter { $0.startDate > now }
				.sorted { lhs, rhs in
					if lhs.isAllDay != rhs.isAllDay { return rhs.isAllDay } // timed before all‑day
					return lhs.startDate < rhs.startDate
				}
		)
		
		// If we already have current, add only the next one; else add next two
		let need = (results.isEmpty ? 2 : 1)
		for e in upcomingUnified.prefix(need) {
			results.append(e)
		}
		
		return results
	}
	
	func events(for date: Date) -> [CalendarEvent] {
		let cal = Calendar.current
		let sameDay: (CalendarEvent) -> Bool = { ev in cal.isDate(ev.startDate, inSameDayAs: date) }
		var dayEvents = (todayEvents + upcomingEvents).filter(sameDay)
		dayEvents.sort { a, b in
			if a.isAllDay != b.isAllDay { return b.isAllDay } // timed before all‑day
			return a.startDate < b.startDate
		}
		if cal.isDateInToday(date), let current = currentEvent, sameDay(current) {
			// Ensure current is first
			dayEvents.removeAll { $0.id == current.id }
			dayEvents.insert(current, at: 0)
		}
		return dayEvents
	}
	
	func openEventInCalendar(_ event: CalendarEvent) {
		// Prefer calshow: with seconds since reference date to jump to start date
		let secs = event.startDate.timeIntervalSinceReferenceDate
		if let url = URL(string: "calshow:\(secs)") {
			if NSWorkspace.shared.open(url) { return }
		}
		// Fallback to opening Calendar app by bundle id
		let bundleId = "com.apple.iCal"
		if let appURL = NSWorkspace.shared.urlForApplication(withBundleIdentifier: bundleId) {
			_ = NSWorkspace.shared.open(appURL)
			return
		}
		// Last resort: system path
		let fallbackPath = "/System/Applications/Calendar.app"
		_ = NSWorkspace.shared.open(URL(fileURLWithPath: fallbackPath))
	}
	
	// MARK: - Sample (for UI fallback if needed)
	func getSampleEvents() -> [CalendarEvent] {
		let calendar = Calendar.current
		let today = Date()
		let doctorStart = calendar.date(bySettingHour: 12, minute: 30, second: 0, of: today) ?? today
		let doctorEnd = calendar.date(bySettingHour: 13, minute: 30, second: 0, of: today) ?? today.addingTimeInterval(3600)
		let movieStart = calendar.date(bySettingHour: 17, minute: 30, second: 0, of: today) ?? today
		let movieEnd = calendar.date(bySettingHour: 19, minute: 30, second: 0, of: today) ?? today.addingTimeInterval(7200)
		return [
			CalendarEvent(id: UUID().uuidString, title: "Doctor", startDate: doctorStart, endDate: doctorEnd, isAllDay: false, location: nil, notes: nil, calendar: "Personal", color: "#FFCC00"),
			CalendarEvent(id: UUID().uuidString, title: "Movie", startDate: movieStart, endDate: movieEnd, isAllDay: false, location: nil, notes: nil, calendar: "Personal", color: "#58A6FF"),
		]
	}
	
	// MARK: - Color helpers
	private func colorFromCalendar(_ calendar: EKCalendar) -> String {
		#if canImport(AppKit)
		if let nsColor = calendar.color {
			if let ciColor = CIColor(color: nsColor) {
				let red = Int(ciColor.red * 255)
				let green = Int(ciColor.green * 255)
				let blue = Int(ciColor.blue * 255)
				return String(format: "#%02X%02X%02X", red, green, blue)
			}
		}
		#endif
		return "#007AFF"
	}
}
