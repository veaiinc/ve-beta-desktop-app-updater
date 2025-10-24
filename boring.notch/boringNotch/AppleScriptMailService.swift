import Foundation
import AppKit

// MARK: - Label Parser

// Parses AppleScript result for mailbox/label names
struct LabelParser {
    static func parseList(_ descriptor: NSAppleEventDescriptor?) -> [String] {
        guard let list = descriptor, list.descriptorType == typeAEList else {
            print("❌ Invalid descriptor or not a list for labels")
            return []
        }
        
        var labels: [String] = []
        let count = list.numberOfItems
        print("📊 Processing \(count) label items...")
        
        // Handle empty list case to prevent range error
        guard count > 0 else {
            print("📊 No label items to process")
            return []
        }
        
        for i in 1...count {
            guard let labelName = list.atIndex(i)?.stringValue else {
                print("⚠️ Label \(i): Not a string, skipping...")
                continue
            }
            
            let trimmedLabel = labelName.trimmingCharacters(in: .whitespacesAndNewlines)
            if !trimmedLabel.isEmpty {
                labels.append(trimmedLabel)
                print("✅ Parsed label \(i): '\(trimmedLabel)'")
            }
        }
        
        print("📈 Successfully parsed \(labels.count) labels out of \(count) items")
        return labels
    }
}

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
            
            // ✅ Fetch profile pictures separately to avoid AppleScript complexity
            print("📧 [MAIL] Fetching profile pictures...")
            items = await fetchProfilePictures(for: items)
            
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
        
        // Try to open by message URL first (most reliable)
        if !email.appleScriptID.hasPrefix("msg_") {
            // This is a real message URL, use it directly
            let script = """
            tell application id "com.apple.mail"
                activate
                delay 0.5
                
                try
                    -- Try to find message by URL
                    set allMsgs to messages of inbox
                    repeat with m in allMsgs
                        try
                            set msgUrl to url of m
                            if msgUrl is "\(email.appleScriptID)" then
                                open m
                                try
                                    tell message viewer 1 to set selected messages to {m}
                                end try
                                return true
                            end if
                        on error
                            -- Skip messages without URL
                        end try
                    end repeat
                    return false
                on error err
                    log "Open by URL failed: " & err
                    return false
                end try
            end tell
            """
            
            let result: NSAppleEventDescriptor? = try await executeOnBackgroundQueue {
                return try AppleScriptHelper.execute(script)
            }
            
            let ok = result?.booleanValue ?? false
            if ok {
                print("✅ [MAIL] Email opened successfully by URL")
                return
            } else {
                print("⚠️ [MAIL] Failed to open by URL, trying fallback method")
            }
        }
        
        // Fallback: Extract index from "msg_1", "msg_2", etc.
        guard email.appleScriptID.hasPrefix("msg_"),
              let indexStr = email.appleScriptID.split(separator: "_").last,
              let index = Int(indexStr),
              index > 0 else {
            throw MailServiceError.messageNotFound
        }
        
        // Enhanced fallback: Try to match by subject and sender for better accuracy
        let fallbackScript = """
        tell application id "com.apple.mail"
            activate
            delay 0.5
            
            try
                -- Ensure inbox is loaded
                set allMsgs to messages of inbox
                set msgCount to count of allMsgs
                
                -- First try: Find by subject and sender (more reliable than index)
                repeat with m in allMsgs
                    try
                        set msgSubject to subject of m
                        set msgSender to sender of m
                        if msgSubject is "\(email.subject.replacingOccurrences(of: "\"", with: "\\\""))" and msgSender contains "\(email.senderName.replacingOccurrences(of: "\"", with: "\\\""))" then
                            open m
                            try
                                tell message viewer 1 to set selected messages to {m}
                            end try
                            return true
                        end if
                    on error
                        -- Skip problematic messages
                    end try
                end repeat
                
                -- Second try: Use index as last resort
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
                log "Open by fallback failed: " & err
                return false
            end try
        end tell
        """
        
        let fallbackResult: NSAppleEventDescriptor? = try await executeOnBackgroundQueue {
            return try AppleScriptHelper.execute(fallbackScript)
        }
        
        let fallbackOk = fallbackResult?.booleanValue ?? false
        if !fallbackOk {
            print("❌ [MAIL] Failed to open email with all methods")
            throw MailServiceError.messageNotFound
        }
        print("✅ [MAIL] Email opened successfully with fallback method")
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
                        -- Validate that we got a real URL, not empty
                        if msgId is "" then
                            set msgId to "msg_" & i
                        end if
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
                    
                    -- ✅ GET PROFILE PICTURE FROM CONTACTS (simplified approach)
                    set profilePictureData to ""
                    -- Note: We'll fetch profile pictures separately to avoid AppleScript complexity
                    
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
                    
                    -- ✅ DELIMITED STRING WITH PROFILE PICTURE DATA (7 fields now)
                    set msgString to msgId & "|||" & msgSubject & "|||" & msgSender & "|||" & senderAddress & "|||" & msgDateISO & "|||" & (msgIsRead as string) & "|||" & profilePictureData
                    log "Email " & i & ": " & msgSubject & " from " & senderAddress & " (ID: " & msgId & ", profile data: " & (profilePictureData is not "") & ")"
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
    
    // MARK: - Profile Picture Fetching
    
    private func fetchProfilePictures(for emails: [EmailItem]) async -> [EmailItem] {
        var updatedEmails: [EmailItem] = []
        
        for email in emails {
            var updatedEmail = email
            
            if let address = email.senderAddress, !address.isEmpty {
                do {
                    let profilePictureData = try await fetchContactPhoto(for: address)
                    if let data = profilePictureData {
                        print("📸 [MAIL] Found profile picture for \(address) - \(data.count) bytes")
                        updatedEmail = EmailItem(
                            appleScriptID: email.appleScriptID,
                            subject: email.subject,
                            senderName: email.senderName,
                            senderAddress: email.senderAddress,
                            preview: email.preview,
                            receivedDate: email.receivedDate,
                            isRead: email.isRead,
                            mailboxName: email.mailboxName,
                            messageIDHeader: email.messageIDHeader,
                            profilePictureData: data
                        )
                        print("📸 [MAIL] Successfully updated EmailItem with profile picture data")
                    } else {
                        print("📸 [MAIL] No profile picture data returned for \(address)")
                    }
                } catch {
                    print("📸 [MAIL] No profile picture found for \(address): \(error.localizedDescription)")
                }
            }
            
            updatedEmails.append(updatedEmail)
        }
        
        return updatedEmails
    }
    
    private func fetchContactPhoto(for emailAddress: String) async throws -> Data? {
        let script = """
        tell application "Contacts"
            try
                set matchingContacts to people whose value of emails contains "\(emailAddress)"
                if (count of matchingContacts) > 0 then
                    set theContact to item 1 of matchingContacts
                    if exists image of theContact then
                        return image of theContact
                    end if
                end if
            on error
                return missing value
            end try
        end tell
        """
        
        let result = try await executeOnBackgroundQueue {
            return try AppleScriptHelper.execute(script)
        }
        
        // ✅ Fix: Properly extract image data from NSAppleEventDescriptor
        if let descriptor = result {
            // Try different methods to extract image data
            // Note: NSAppleEventDescriptor doesn't have a .data property
            if let stringValue = descriptor.stringValue,
                      let data = Data(base64Encoded: stringValue) {
                print("📸 [MAIL] Extracted image data via base64 string: \(data.count) bytes")
                return data
            } else if let stringValue = descriptor.stringValue,
                      let data = stringValue.data(using: .utf8) {
                print("📸 [MAIL] Extracted image data via UTF8 string: \(data.count) bytes")
                return data
            } else {
                print("📸 [MAIL] Failed to extract image data from descriptor")
                print("   Descriptor type: \(descriptor.descriptorType)")
                print("   String value: \(descriptor.stringValue ?? "nil")")
                print("   Number of items: \(descriptor.numberOfItems)")
            }
        }
        
        return nil
    }
    
    // MARK: - Label Management
    
    /// Test method to debug message counting - call this to see what's happening
    func debugMessageCounts() async throws {
        print("🔍 [DEBUG] Testing message count detection...")
        
        let testScript = """
        tell application id "com.apple.mail"
            try
                log "=== DEBUGGING MESSAGE COUNTS ==="
                
                -- Test local mailboxes
                set localMailboxes to mailboxes
                log "Found " & (count of localMailboxes) & " local mailboxes"
                
                repeat with mb in localMailboxes
                    set mbName to name of mb
                    try
                        set msgCount to count of messages of mb
                        log "Local '" & mbName & "': " & msgCount & " messages"
                    on error err
                        log "ERROR counting '" & mbName & "': " & err
                    end try
                end repeat
                
                -- Test account mailboxes
                set allAccounts to accounts
                log "Found " & (count of allAccounts) & " accounts"
                
                repeat with acct in allAccounts
                    set acctName to name of acct
                    set acctMailboxes to mailboxes of acct
                    log "Account " & acctName & " has " & (count of acctMailboxes) & " mailboxes"
                    
                    repeat with mb in acctMailboxes
                        set mbName to name of mb
                        try
                            set msgCount to count of messages of mb
                            log "Account '" & mbName & "' in " & acctName & ": " & msgCount & " messages"
                        on error err
                            log "ERROR counting '" & mbName & "' in " & acctName & ": " & err
                        end try
                    end repeat
                end repeat
                
                log "=== END DEBUG ==="
                return "Debug complete"
            on error err
                log "DEBUG ERROR: " & err
                return "Debug failed: " & err
            end try
        end tell
        """
        
        let result: NSAppleEventDescriptor? = try await executeOnBackgroundQueue {
            return try AppleScriptHelper.execute(testScript)
        }
        
        if let resultString = result?.stringValue {
            print("🔍 [DEBUG] AppleScript result: \(resultString)")
        } else {
            print("🔍 [DEBUG] No result from AppleScript")
        }
    }
    
    func fetchLabels() async throws -> [String] {
        print("🏷️ [MAIL] Fetching labels/mailboxes (with email filtering)...")
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
                print("🏷️ [MAIL] Building label fetch script...")
                let script = self.buildLabelFetchScript()
                print("🏷️ [MAIL] Executing AppleScript for labels...")
                return try AppleScriptHelper.execute(script)
            }
            
            print("🏷️ [MAIL] Parsing label results...")
            let allLabels = LabelParser.parseList(result)
            
            // Define your custom labels (in priority order)
            let targetLabels = ["1: To Respond", "2: FYI", "3: Comment", "4: Notification", 
                               "5: Meeting Update", "6: Awaiting Reply", "7: Actioned", "8: Marketing"]
            
            // Filter to ONLY include your custom labels that have emails
            let labels = allLabels.filter { targetLabels.contains($0) }
            
            print("🏷️ [MAIL] Filtered to your custom labels with emails:")
            if labels.isEmpty {
                print("⚠️ [MAIL] None of your custom labels found with emails")
                print("💡 Make sure these mailboxes exist in Mail.app and contain emails:")
                for (index, label) in targetLabels.enumerated() {
                    print("   \(index + 1). '\(label)'")
                }
            } else {
                for (index, label) in labels.enumerated() {
                    print("   \(index + 1). '\(label)' ✓")
                }
            }
            
            let duration = Date().timeIntervalSince(startTime)
            print("✅ [MAIL] Label fetch completed in \(String(format: "%.2f", duration))s with \(labels.count) custom labels")
            
            return labels
            
        } catch let error as NSError {
            let duration = Date().timeIntervalSince(startTime)
            print("❌ [MAIL] Label fetch failed after \(String(format: "%.2f", duration))s")
            print("   Error Code: \(error.code)")
            print("   Error Domain: \(error.domain)")
            print("   Description: \(error.localizedDescription)")
            
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
    
    func fetchEmailsForLabel(_ label: String, limit: Int) async throws -> [EmailItem] {
        print("📧 [MAIL] Fetching emails for label: '\(label)' (limit: \(limit))")
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
                print("📧 [MAIL] Building label email fetch script for: \(label)")
                let script = self.buildLabelEmailFetchScript(label: label, fetchLimit: min(limit, 50))
                print("📧 [MAIL] Executing AppleScript for label emails...")
                return try AppleScriptHelper.execute(script)
            }
            
            print("📧 [MAIL] Parsing label email results...")
            var items = EmailParser.parseList(result)
            
            if items.isEmpty {
                print("⚠️ [MAIL] No emails found for label '\(label)'. This could mean:")
                print("   - The label/mailbox doesn't exist")
                print("   - The mailbox is empty")
                print("   - There was an error accessing the mailbox")
                print("   - The mailbox is in a different location (local vs account)")
                
                // Let's try to debug this by checking if the label exists
                print("🔍 [MAIL] Debugging label '\(label)':")
                print("   - Checking if this is one of your custom labels...")
                let customLabels = ["1: To Respond", "2: FYI", "3: Comment", "4: Notification", "5: Meeting Update", "6: Awaiting Reply", "7: Actioned", "8: Marketing"]
                if customLabels.contains(label) {
                    print("   ✅ This is one of your custom labels")
                    print("   💡 Make sure this mailbox exists in Mail.app and has emails")
                } else {
                    print("   ⚠️ This is not one of your expected custom labels")
                }
            }
            
            // Fetch profile pictures separately
            print("📧 [MAIL] Fetching profile pictures for label emails...")
            items = await fetchProfilePictures(for: items)
            
            // Sort by date
            let sortedItems = items.sorted { $0.receivedDate > $1.receivedDate }
            let finalItems = Array(sortedItems.prefix(limit))
            
            let duration = Date().timeIntervalSince(startTime)
            print("✅ [MAIL] Label email fetch completed in \(String(format: "%.2f", duration))s with \(finalItems.count) emails")
            
            return finalItems
            
        } catch let error as NSError {
            let duration = Date().timeIntervalSince(startTime)
            print("❌ [MAIL] Label email fetch failed after \(String(format: "%.2f", duration))s")
            print("   Error Code: \(error.code)")
            print("   Error Domain: \(error.domain)")
            print("   Description: \(error.localizedDescription)")
            
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
    
    // MARK: - AppleScript Builders
    
    private func buildLabelFetchScript() -> String {
        """
        tell application id "com.apple.mail"
            try
                set allMailboxNames to {}
                
                -- Get ALL mailboxes (both local and account-specific) with message count check
                log "Fetching all mailboxes with message count validation..."
                
                -- First, get local mailboxes
                set localMailboxes to mailboxes
                log "Checking " & (count of localMailboxes) & " local mailboxes"
                
                repeat with mb in localMailboxes
                    set mbName to name of mb
                    try
                        -- Try multiple methods to check if mailbox has messages
                        set msgCount to count of messages of mb
                        set msgList to messages of mb
                        set msgListCount to count of msgList
                        
                        log "Local mailbox '" & mbName & "':"
                        log "  - count of messages: " & msgCount
                        log "  - count of messages list: " & msgListCount
                        
                        -- Use both methods to be sure
                        if msgCount > 0 and msgListCount > 0 then
                            set end of allMailboxNames to mbName
                            log "✅ ADDED: " & mbName & " (has " & msgCount & " messages)"
                        else
                            log "❌ SKIPPED: " & mbName & " (empty - count: " & msgCount & ", list: " & msgListCount & ")"
                        end if
                    on error errMsg
                        log "❌ ERROR counting messages in '" & mbName & "': " & errMsg
                    end try
                end repeat
                
                -- Then, get account-specific mailboxes
                set allAccounts to accounts
                log "Checking " & (count of allAccounts) & " accounts"
                
                repeat with acct in allAccounts
                    set acctName to name of acct
                    log "Processing account: " & acctName
                    set acctMailboxes to mailboxes of acct
                    log "Account " & acctName & " has " & (count of acctMailboxes) & " mailboxes"
                    
                    repeat with mb in acctMailboxes
                        set mbName to name of mb
                        try
                            -- Try multiple methods to check if mailbox has messages
                            set msgCount to count of messages of mb
                            set msgList to messages of mb
                            set msgListCount to count of msgList
                            
                            log "Account mailbox '" & mbName & "' in " & acctName & ":"
                            log "  - count of messages: " & msgCount
                            log "  - count of messages list: " & msgListCount
                            
                            -- Use both methods to be sure
                            if msgCount > 0 and msgListCount > 0 then
                                set end of allMailboxNames to mbName
                                log "✅ ADDED: " & mbName & " from " & acctName & " (has " & msgCount & " messages)"
                            else
                                log "❌ SKIPPED: " & mbName & " from " & acctName & " (empty - count: " & msgCount & ", list: " & msgListCount & ")"
                            end if
                        on error errMsg
                            log "❌ ERROR counting messages in '" & mbName & "' from " & acctName & ": " & errMsg
                        end try
                    end repeat
                end repeat
                
                log "FINAL RESULT: " & (count of allMailboxNames) & " mailboxes with emails"
                return allMailboxNames
            on error err
                log "❌ CRITICAL ERROR in label fetch script: " & err
                return {}
            end try
        end tell
        """
    }
    
    private func buildLabelEmailFetchScript(label: String, fetchLimit: Int) -> String {
        """
        tell application id "com.apple.mail"
            try
                log "Attempting to access mailbox: '\(label)'"
                set targetMailbox to missing value
                
                -- Try to find mailbox in local mailboxes first
                try
                    set targetMailbox to mailbox "\(label)"
                    log "Found mailbox in local mailboxes: '\(label)'"
                on error
                    log "Not found in local mailboxes, trying accounts..."
                    -- Try to find in account mailboxes
                    set allAccounts to accounts
                    repeat with acct in allAccounts
                        try
                            set targetMailbox to mailbox "\(label)" of acct
                            log "Found mailbox in account " & (name of acct) & ": '\(label)'"
                            exit repeat
                        on error
                            -- Continue to next account
                        end try
                    end repeat
                end try
                
                if targetMailbox is missing value then
                    log "ERROR: Mailbox '\(label)' not found in any location"
                    return {}
                end if
                
                set allMsgs to messages of targetMailbox
                set total to count of allMsgs
                log "Mailbox '\(label)' has " & total & " messages"
                
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
                        -- Validate that we got a real URL, not empty
                        if msgId is "" then
                            set msgId to "msg_" & i
                        end if
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
                    
                    -- EXTRACT CLEAN EMAIL ADDRESS
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
                    
                    -- GET PROFILE PICTURE FROM CONTACTS (simplified approach)
                    set profilePictureData to ""
                    
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
                    
                    -- DELIMITED STRING WITH PROFILE PICTURE DATA (7 fields)
                    set msgString to msgId & "|||" & msgSubject & "|||" & msgSender & "|||" & senderAddress & "|||" & msgDateISO & "|||" & (msgIsRead as string) & "|||" & profilePictureData
                    log "Label Email " & i & ": " & msgSubject & " from " & senderAddress & " (ID: " & msgId & ")"
                    copy msgString to end of outputList
                end repeat
                
                return outputList
            on error err
                log "Label email fetch script error: " & err
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
}
