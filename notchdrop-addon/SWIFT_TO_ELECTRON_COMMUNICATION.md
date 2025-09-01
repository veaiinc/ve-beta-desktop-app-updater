# Swift UI to Electron Communication Implementation

## Overview

This document describes the implementation of communication between the Swift UI notch and the Electron desktop application. The implementation allows the Swift UI to send actions and messages to Electron, enabling control of the desktop application from the notch interface.

## Architecture

```
Swift UI (NotchContentView.swift)
    ↓
NotchViewModel.swift (SwiftAction enum)
    ↓
NotchDropCore.swift (handleSwiftAction)
    ↓
NotchDropBridge.m (Objective-C bridge)
    ↓
C++ Addon (notchdrop_addon.node)
    ↓
JavaScript Wrapper (index.js)
    ↓
Electron Service (notchDropService.js)
    ↓
Electron Main (main.js)
```

## Implementation Details

### 1. Swift UI Layer

**File: `src/NotchContentView.swift`**

-   Added a "Send Log to Electron" button in the Swift UI
-   Button calls `vm.sendLogToElectron()` with a timestamped message

**File: `src/NotchViewModel.swift`**

-   Added `sendLogToElectron()` method
-   Added `sendLog(String)` case to `SwiftAction` enum
-   Uses `swiftActionSender` to emit actions

### 2. Swift Core Layer

**File: `src/NotchDropCore.swift`**

-   Added `swiftActionSender` connection in setup
-   Added `handleSwiftAction()` method to process all Swift actions
-   Converts Swift actions to callback format for JavaScript bridge

### 3. JavaScript Wrapper Layer

**File: `index.js`**

-   Added `sendLog` case in `handleSwiftAction()` method
-   Added `handleSwiftLog()` method to process log messages
-   Emits `swiftLog` event for Electron to handle

### 4. Electron Service Layer

**File: `electron/services/notchDropService.js`**

-   Added `swiftLog` event listener
-   Added `handleSwiftLog()` method
-   Logs messages to Electron's log system
-   Emits to renderer process for UI display

## Usage

### Basic Log Message

1. **Click the "Send Log to Electron" button** in the Swift UI
2. **Message flows through the pipeline:**
    - Swift UI → NotchViewModel → NotchDropCore → JavaScript → Electron
3. **Result:** Message appears in Electron's console and logs

### Adding New Actions

To add new actions from Swift to Electron:

1. **Add to SwiftAction enum** in `NotchViewModel.swift`:

    ```swift
    case newAction(String)
    ```

2. **Add method in NotchViewModel.swift**:

    ```swift
    func triggerNewAction(_ data: String) {
        swiftActionSender.send(.newAction(data))
    }
    ```

3. **Add case in NotchDropCore.swift**:

    ```swift
    case .newAction(let data):
        swiftActionCallback?("newAction", data)
    ```

4. **Add case in index.js**:

    ```javascript
    case 'newAction':
        console.log('New action from Swift:', data);
        this.handleNewAction(data);
        break;
    ```

5. **Add handler in notchDropService.js**:
    ```javascript
    this.notchDropAddon.on('newAction', (data) => {
    	this.handleNewAction(data);
    });
    ```

## Testing

### Standalone Test

Run the standalone test to verify the basic functionality:

```bash
cd notchdrop-addon
node test-swift-log.js
```

### Full Electron Test

1. Start the Electron application:

    ```bash
    npm run dev
    ```

2. The NotchDrop UI should appear automatically
3. Click the "Send Log to Electron" button
4. Check the Electron console for log messages

## Debugging

### Console Logs

The implementation includes comprehensive logging:

-   **Swift side:** `print("📝 Swift sending log to Electron: \(message)")`
-   **JavaScript side:** `console.log('📝 Swift sent log message:', data)`
-   **Electron side:** `log.info('📝 Swift UI Log Message:', message)`

### Common Issues

1. **NotchDrop not appearing:**

    - Check if the addon built successfully
    - Verify accessibility permissions on macOS

2. **Messages not reaching Electron:**

    - Check console logs at each layer
    - Verify event listeners are properly set up

3. **Build errors:**
    - Run `npm run build` in the notchdrop-addon directory
    - Check for missing dependencies

## Future Enhancements

### Potential Improvements

1. **Bidirectional Communication:**

    - Add Electron to Swift communication
    - Real-time status updates

2. **Advanced Actions:**

    - File operations
    - System controls
    - Application state management

3. **Error Handling:**

    - Retry mechanisms
    - Fallback options
    - Better error reporting

4. **Performance:**
    - Message batching
    - Async processing
    - Memory optimization

## Security Considerations

-   All communication is local (no network)
-   Messages are validated at each layer
-   No sensitive data is transmitted
-   Consider adding message signing for production use

## Conclusion

This implementation provides a solid foundation for Swift UI to Electron communication. The modular design makes it easy to extend with new actions and features. The comprehensive logging and error handling ensure reliable operation and easy debugging.



