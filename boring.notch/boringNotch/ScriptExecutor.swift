import Foundation
import AppKit

enum ScriptExecutor {
    static func execute(_ script: String, caller: StaticString = #function) throws -> NSAppleEventDescriptor? {
        var errorDict: NSDictionary?
        let appleScript = NSAppleScript(source: script)
        let result = appleScript?.executeAndReturnError(&errorDict)
        if let error = errorDict as? [String: Any] {
            let message = (error[NSAppleScript.errorMessage] as? String) ?? "Unknown"
            let number = (error[NSAppleScript.errorNumber] as? Int) ?? 0
            let range = (error[NSAppleScript.errorRange] as? NSRange) ?? NSRange(location: NSNotFound, length: 0)
            let partial = "nil"
            print("Mail Script error in \(caller): number=\(number), message=\(message), range=\(range), partial=\(partial)")
            if message.localizedCaseInsensitiveContains("not allowed")
                || message.localizedCaseInsensitiveContains("not permitted")
                || message.localizedCaseInsensitiveContains("not authorized") {
                throw MailServiceError.permissionDenied
            }
            throw MailServiceError.appleScriptExecutionFailed(message)
        }
        return result
    }
}
