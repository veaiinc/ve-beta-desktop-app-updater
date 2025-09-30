//
//  DebugCalendarView.swift
//  Ve AI Desktop App - Calendar Debug Component
//
//  Debug version with detailed logging to troubleshoot permission issues
//

import SwiftUI
import EventKit

struct DebugCalendarView: View {
    @StateObject private var calendarVM = CalendarViewModel()
    @State private var debugInfo: String = "Initializing..."
    @State private var permissionCheckCount: Int = 0
    
    var body: some View {
        VStack(spacing: 8) {
            // Calendar header
            HStack(spacing: 6) {
                Image(systemName: "calendar")
                    .font(.system(size: 10, weight: .medium))
                    .foregroundColor(.white.opacity(0.8))
                
                Text("Calendar Debug")
                    .font(.system(size: 10, weight: .medium))
                    .foregroundColor(.white.opacity(0.8))
                
                Spacer()
                
                // Permission status indicator
                Circle()
                    .fill(calendarVM.hasPermission ? Color.green : Color.red)
                    .frame(width: 6, height: 6)
            }
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            
            // Debug information
            VStack(alignment: .leading, spacing: 2) {
                Text("Status: \(calendarVM.permissionStatus.rawValue)")
                    .font(.system(size: 7, weight: .regular))
                    .foregroundColor(.white.opacity(0.7))
                
                Text("Has Permission: \(calendarVM.hasPermission ? "YES" : "NO")")
                    .font(.system(size: 7, weight: .regular))
                    .foregroundColor(calendarVM.hasPermission ? .green : .red)
                
                Text("Events: \(calendarVM.todayEvents.count + calendarVM.upcomingEvents.count)")
                    .font(.system(size: 7, weight: .regular))
                    .foregroundColor(.white.opacity(0.7))
                
                Text("Check #\(permissionCheckCount)")
                    .font(.system(size: 7, weight: .regular))
                    .foregroundColor(.white.opacity(0.5))
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 8)
            
            // Action buttons
            VStack(spacing: 4) {
                if !calendarVM.hasPermission {
                    Button("Request Permission") {
                        Task {
                            print("📅 DEBUG: User clicked Request Permission")
                            debugInfo = "Requesting..."
                            let granted = await calendarVM.requestPermission()
                            debugInfo = granted ? "Granted!" : "Denied"
                            permissionCheckCount += 1
                        }
                    }
                    .font(.system(size: 8, weight: .medium))
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color.blue.opacity(0.6))
                    .clipShape(RoundedRectangle(cornerRadius: 4))
                    .buttonStyle(PlainButtonStyle())
                }
                
                Button("Check Status") {
                    print("📅 DEBUG: User clicked Check Status")
                    calendarVM.checkPermissionStatus()
                    permissionCheckCount += 1
                }
                .font(.system(size: 8, weight: .medium))
                .foregroundColor(.white)
                .padding(.horizontal, 8)
                .padding(.vertical, 3)
                .background(Color.gray.opacity(0.6))
                .clipShape(RoundedRectangle(cornerRadius: 4))
                .buttonStyle(PlainButtonStyle())
                
                if calendarVM.hasPermission {
                    Button("Refresh Events") {
                        print("📅 DEBUG: User clicked Refresh Events")
                        calendarVM.refresh()
                    }
                    .font(.system(size: 8, weight: .medium))
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color.green.opacity(0.6))
                    .clipShape(RoundedRectangle(cornerRadius: 4))
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .padding(.horizontal, 8)
        }
        .frame(width: 160, height: 100)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.black.opacity(0.3))
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.yellow.opacity(0.3), lineWidth: 1)
                )
        )
        .onAppear {
            print("📅 DEBUG: DebugCalendarView appeared")
            calendarVM.checkPermissionStatus()
            permissionCheckCount += 1
        }
        .onTapGesture {
            // Open System Preferences to Calendar privacy settings
            let systemPrefsURL = "x-apple.systempreferences:com.apple.preference.security?Privacy_Calendars"
            if let url = URL(string: systemPrefsURL) {
                NSWorkspace.shared.open(url)
            }
        }
    }
}
