import Foundation
import AppKit

final class AppleScriptMailService: MailService {
    private let mailBundleID = "com.apple.mail"
    private let scriptExecutionQueue = DispatchQueue(
        label: "com.veai.mail.script-execution",
        qos: .userInitiated
    )
    
    func fetchRecentEmails(limit: Int) async throws -> [EmailItem] {
        print("📧 [MAIL] Starting email fetch (limit: \(limit))")
        let startTime = Date()
        
        // Check if Mail is running
        let workspace = NSWorkspace.shared
        let runningApps = workspace.runningApplications
        let mailRunning = runningApps.contains { $0.bundleIdentifier == mailBundleID }
        
        if !mailRunning {
            print("⚠️ [MAIL] Mail.app is not running, attempting to launch...")
            do {
                try await launchMailViaScript()
                print("✅ [MAIL] Mail launched, waiting for full initialization...")
                try await Task.sleep(nanoseconds: 6_000_000_000) // 6 seconds
            } catch {
                print("❌ [MAIL] Failed to launch Mail: \(error.localizedDescription)")
                throw MailServiceError.mailNotRunning
            }
        }
        
        do {
            let result: NSAppleEventDescriptor? = try await executeOnBackgroundQueue {
                print("📧 [MAIL] Building AppleScript...")
                let script = self.buildFetchScript(fetchLimit: min(limit, 50))
                print("📧 [MAIL] Script size: \(script.count) characters")
                
                print("📧 [MAIL] Executing AppleScript on background queue...")
                do {
                    let descriptor = try AppleScriptHelper.execute(script)
                    print("📧 [MAIL] AppleScript executed - descriptor is \(descriptor != nil ? "present" : "nil")")
                    if let desc = descriptor {
                        print("📧 [MAIL] Descriptor type: \(desc.descriptorType)")
                        print("📧 [MAIL] Number of items: \(desc.numberOfItems)")
                    }
                    return descriptor
                } catch {
                    print("❌ [MAIL] AppleScript execution error: \(error.localizedDescription)")
                    throw error
                }
            }
            
            print("📧 [MAIL] Parsing results...")
            var items = EmailParser.parseList(result)
            
            // ✅ Fixed: Use sorted(by:) with explicit property name
            let sortedItems = items.sorted { $0.receivedDate > $1.receivedDate }
            let finalItems = Array(sortedItems.prefix(limit))
            
            let duration = Date().timeIntervalSince(startTime)
            print("✅ [MAIL] Fetch completed in \(String(format: "%.2f", duration))s with \(finalItems.count) emails")
            
            return finalItems
            
        } catch let error as NSError {
            let duration = Date().timeIntervalSince(startTime)
            
            print("❌ [MAIL] Fetch failed after \(String(format: "%.2f", duration))s")
            print("   Error Code: \(error.code)")
            print("   Error Domain: \(error.domain)")
            print("   Description: \(error.localizedDescription)")
            if let userInfo = error.userInfo as? [String: Any] {
                print("   User Info: \(userInfo)")
            }
            
            if error.code == -600 {
                throw MailServiceError.mailNotRunning
            } else if error.code == -1743 {
                throw MailServiceError.permissionDenied
            } else if error.domain == "AppleScriptError" {
                throw MailServiceError.appleScriptExecutionFailed(error.localizedDescription)
            }
            
            throw error
        }
    }
    
    func openEmail(_ email: EmailItem) async throws {
        print("📧 [MAIL] Opening email: \(email.subject) with ID: \(email.appleScriptID)")
        
        // Extract index from "msg_1", "msg_2", etc.
        guard email.appleScriptID.hasPrefix("msg_"),
              let indexStr = email.appleScriptID.split(separator: "_").last,
              let index = Int(indexStr),
              index > 0 else {
            throw MailServiceError.messageNotFound
        }
        
        let script = """
        tell application id "com.apple.mail"
            activate
            delay 0.5
            
            try
                -- Ensure inbox is loaded
                set allMsgs to messages of inbox
                set msgCount to count of allMsgs
                
                if msgCount ≥ \(index) then
                    set theMsg to item \(index) of allMsgs
                    open theMsg
                    try
                        tell message viewer 1 to set selected messages to {theMsg}
                    end try
                    return true
                else
                    log "Index \(index) out of range (total: " & msgCount & ")"
                    return false
                end if
            on error err
                log "Open by index failed: " & err
                return false
            end try
        end tell
        """
        
        let result: NSAppleEventDescriptor? = try await executeOnBackgroundQueue {
            return try AppleScriptHelper.execute(script)
        }
        
        let ok = result?.booleanValue ?? false
        if !ok {
            print("❌ [MAIL] Failed to open email")
            throw MailServiceError.messageNotFound
        }
        print("✅ [MAIL] Email opened successfully")
    }
    
    private func executeOnBackgroundQueue<T>(_ work: @escaping () throws -> T) async throws -> T {
        return try await withCheckedThrowingContinuation { continuation in
            scriptExecutionQueue.async {
                do {
                    let result = try work()
                    continuation.resume(returning: result)
                } catch {
                    continuation.resume(throwing: error)
                }
            }
        }
    }
    
    private func buildFetchScript(fetchLimit: Int) -> String {
        """
        tell application id "com.apple.mail"
            try
                set allMsgs to messages of inbox
                set total to count of allMsgs
                log "Inbox has " & total & " messages"
                
                if total is 0 then
                    return {}
                end if
                
                set outputList to {}
                set maxIndex to total
                if total > \(fetchLimit) then
                    set maxIndex to \(fetchLimit)
                end if
                
                repeat with i from 1 to maxIndex
                    set m to item i of allMsgs
                    
                    try
                        set msgId to url of m
                    on error
                        set msgId to "msg_" & i
                    end try
                    
                    try
                        set msgSubject to subject of m
                    on error
                        set msgSubject to "(no subject)"
                    end try
                    
                    try
                        set msgSender to sender of m
                    on error
                        set msgSender to ""
                    end try
                    
                    -- ✅ EXTRACT CLEAN EMAIL ADDRESS
                    try
                        set senderFull to sender of m
                        if senderFull contains "<" and senderFull contains ">" then
                            set AppleScript's text item delimiters to "<"
                            set temp to text items of senderFull
                            set AppleScript's text item delimiters to ">"
                            set addrParts to text items of (item 2 of temp)
                            set senderAddress to item 1 of addrParts
                        else
                            set senderAddress to senderFull
                        end if
                    on error
                        set senderAddress to ""
                    end try
                    
                    try
                        set msgDate to date received of m
                        set y to year of msgDate
                        set mo to my pad(month of msgDate as integer)
                        set d to my pad(day of msgDate)
                        set h to my pad(hours of msgDate)
                        set mi to my pad(minutes of msgDate)
                        set s to my pad(seconds of msgDate)
                        set msgDateISO to (y as string) & "-" & mo & "-" & d & "T" & h & ":" & mi & ":" & s & "Z"
                    on error
                        set msgDateISO to "2000-01-01T00:00:00Z"
                    end try
                    
                    try
                        set msgIsRead to read status of m
                    on error
                        set msgIsRead to false
                    end try
                    
                    -- ✅ DELIMITED STRING WITH SENDER EMAIL (6 fields now)
                    set msgString to msgId & "|||" & msgSubject & "|||" & msgSender & "|||" & senderAddress & "|||" & msgDateISO & "|||" & (msgIsRead as string)
                    copy msgString to end of outputList
                end repeat
                
                return outputList
            on error err
                log "Fetch script error: " & err
                return {}
            end try
        end tell
        
        on pad(n)
            if n < 10 then
                return "0" & (n as string)
            else
                return n as string
            end if
        end pad
        """
    }
    
    private func launchMailViaScript() async throws {
        let launchScript = """
        tell application "Mail"
            launch
        end tell
        """
        _ = try await executeOnBackgroundQueue {
            return try AppleScriptHelper.execute(launchScript)
        }
    }
}
