import Foundation

class AppleScriptHelper {
    @discardableResult
    class func execute(_ scriptText: String) throws -> NSAppleEventDescriptor? {
        let script = NSAppleScript(source: scriptText)
        var error: NSDictionary?
        
        guard let descriptor = script?.executeAndReturnError(&error) else {
            // Handle error case
            if let error = error {
                print("❌ AppleScript error dict: \(error)")
                
                // Extract the actual error message
                let errorMessage = error[NSAppleScript.errorMessage] as? String ?? "Unknown error"
                let errorNumber = error[NSAppleScript.errorNumber] as? NSNumber ?? -1
                
                print("   Error Number: \(errorNumber)")
                print("   Error Message: \(errorMessage)")
                
                // Create a descriptive error
                let userInfo: [String: Any] = [
                    NSLocalizedDescriptionKey: errorMessage,
                    "NSAppleScriptErrorNumber": errorNumber,
                    "NSAppleScriptErrorDict": error
                ]
                
                throw NSError(
                    domain: "AppleScriptError",
                    code: errorNumber.intValue,
                    userInfo: userInfo
                )
            } else {
                print("❌ AppleScript execution failed with no error details")
                throw NSError(
                    domain: "AppleScriptError",
                    code: -1,
                    userInfo: [NSLocalizedDescriptionKey: "AppleScript execution failed with no error information"]
                )
            }
        }
        
        print("✅ AppleScript executed successfully")
        return descriptor
    }
    
    @discardableResult
    class func executeAsync(_ scriptText: String) async throws -> NSAppleEventDescriptor? {
        return try await Task.detached(priority: .userInitiated) {
            return try execute(scriptText)
        }.value
    }
    
    class func executeVoid(_ scriptText: String) async throws {
        _ = try await executeAsync(scriptText)
    }
}

// MARK: - Synchronous version (if needed)
extension AppleScriptHelper {
    /// Synchronous version for situations where async isn't possible
    @discardableResult
    class func executeSync(_ scriptText: String) throws -> NSAppleEventDescriptor? {
        let script = NSAppleScript(source: scriptText)
        var error: NSDictionary?
        
        guard let descriptor = script?.executeAndReturnError(&error) else {
            if let error = error {
                let errorMessage = error[NSAppleScript.errorMessage] as? String ?? "Unknown error"
                let errorNumber = error[NSAppleScript.errorNumber] as? NSNumber ?? -1
                
                let userInfo: [String: Any] = [
                    NSLocalizedDescriptionKey: errorMessage,
                    "NSAppleScriptErrorNumber": errorNumber
                ]
                
                throw NSError(
                    domain: "AppleScriptError",
                    code: errorNumber.intValue,
                    userInfo: userInfo
                )
            } else {
                throw NSError(
                    domain: "AppleScriptError",
                    code: -1,
                    userInfo: [NSLocalizedDescriptionKey: "AppleScript execution failed"]
                )
            }
        }
        
        return descriptor
    }
}
