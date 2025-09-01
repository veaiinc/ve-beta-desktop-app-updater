# Advanced Actions Example

This document shows how to extend the Swift to Electron communication with more advanced actions.

## Example: File Operation Action

### 1. Add to SwiftAction enum

```swift
// In NotchViewModel.swift
enum SwiftAction {
    // ... existing cases ...
    case openFile(String)  // File path
    case saveFile(String, String)  // File path, content
    case deleteFile(String)  // File path
}
```

### 2. Add Swift UI Button

```swift
// In NotchContentView.swift
Button("Open File") {
    vm.openFile("/path/to/file.txt")
}
.font(.system(size: 12, weight: .medium))
.foregroundColor(.white)
.padding(.horizontal, 16)
.padding(.vertical, 8)
.background(Color.orange.opacity(0.3))
.clipShape(RoundedRectangle(cornerRadius: 8))
.buttonStyle(PlainButtonStyle())
```

### 3. Add Method in NotchViewModel

```swift
// In NotchViewModel.swift
func openFile(_ filePath: String) {
    print("📁 Swift requesting to open file: \(filePath)")
    swiftActionSender.send(.openFile(filePath))
}
```

### 4. Add Case in NotchDropCore

```swift
// In NotchDropCore.swift
case .openFile(let filePath):
    swiftActionCallback?("openFile", filePath)
```

### 5. Add Case in JavaScript Wrapper

```javascript
// In index.js
case 'openFile':
    console.log('📁 Swift requested to open file:', data);
    this.handleFileOperation('open', data);
    break;
```

### 6. Add Handler in Electron Service

```javascript
// In notchDropService.js
this.notchDropAddon.on('fileOperation', (operation, filePath) => {
    this.handleFileOperation(operation, filePath);
});

handleFileOperation(operation, filePath) {
    try {
        const fs = require('fs');
        const path = require('path');

        switch (operation) {
            case 'open':
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    log.info(`📁 File opened: ${filePath}`);
                    this.emitToRenderer('file-opened', { filePath, content });
                } else {
                    log.error(`❌ File not found: ${filePath}`);
                }
                break;

            case 'save':
                // Handle save operation
                break;

            case 'delete':
                // Handle delete operation
                break;
        }
    } catch (error) {
        log.error('❌ File operation failed:', error);
    }
}
```

## Example: System Control Action

### 1. Add System Control Actions

```swift
// In NotchViewModel.swift
enum SwiftAction {
    // ... existing cases ...
    case setVolume(Double)  // Volume level 0.0-1.0
    case toggleMute
    case setBrightness(Double)  // Brightness level 0.0-1.0
    case lockScreen
    case sleep
}
```

### 2. Add Swift UI Controls

```swift
// In NotchContentView.swift
VStack(spacing: 8) {
    Text("System Controls")
        .font(.system(size: 14, weight: .medium))
        .foregroundColor(.white)

    HStack {
        Button("🔊 Vol +") {
            vm.setVolume(0.8)
        }
        .buttonStyle(PlainButtonStyle())

        Button("🔇 Mute") {
            vm.toggleMute()
        }
        .buttonStyle(PlainButtonStyle())

        Button("🔒 Lock") {
            vm.lockScreen()
        }
        .buttonStyle(PlainButtonStyle())
    }
}
```

### 3. Add Methods in NotchViewModel

```swift
// In NotchViewModel.swift
func setVolume(_ level: Double) {
    swiftActionSender.send(.setVolume(level))
}

func toggleMute() {
    swiftActionSender.send(.toggleMute)
}

func lockScreen() {
    swiftActionSender.send(.lockScreen)
}
```

### 4. Add Cases in NotchDropCore

```swift
// In NotchDropCore.swift
case .setVolume(let level):
    swiftActionCallback?("setVolume", String(level))
case .toggleMute:
    swiftActionCallback?("toggleMute", "")
case .lockScreen:
    swiftActionCallback?("lockScreen", "")
```

### 5. Add Cases in JavaScript Wrapper

```javascript
// In index.js
case 'setVolume':
    console.log('🔊 Swift requested volume change:', data);
    this.handleSystemControl('setVolume', parseFloat(data));
    break;
case 'toggleMute':
    console.log('🔇 Swift requested mute toggle');
    this.handleSystemControl('toggleMute');
    break;
case 'lockScreen':
    console.log('🔒 Swift requested screen lock');
    this.handleSystemControl('lockScreen');
    break;
```

### 6. Add Handler in Electron Service

```javascript
// In notchDropService.js
this.notchDropAddon.on('systemControl', (control, data) => {
    this.handleSystemControl(control, data);
});

handleSystemControl(control, data) {
    try {
        switch (control) {
            case 'setVolume':
                // Use system APIs to set volume
                log.info(`🔊 Volume set to: ${data}`);
                break;

            case 'toggleMute':
                // Toggle system mute
                log.info('🔇 Mute toggled');
                break;

            case 'lockScreen':
                // Lock the screen
                const { exec } = require('child_process');
                exec('pmset displaysleepnow', (error) => {
                    if (error) {
                        log.error('❌ Failed to lock screen:', error);
                    } else {
                        log.info('🔒 Screen locked');
                    }
                });
                break;
        }
    } catch (error) {
        log.error('❌ System control failed:', error);
    }
}
```

## Example: Application State Action

### 1. Add Application State Actions

```swift
// In NotchViewModel.swift
enum SwiftAction {
    // ... existing cases ...
    case setAppState(String)  // "active", "inactive", "background"
    case showNotification(String, String)  // title, message
    case updateStatus(String)  // status message
}
```

### 2. Add Swift UI Status Display

```swift
// In NotchContentView.swift
VStack(spacing: 8) {
    Text("App Status")
        .font(.system(size: 14, weight: .medium))
        .foregroundColor(.white)

    Button("📱 Set Active") {
        vm.setAppState("active")
    }
    .buttonStyle(PlainButtonStyle())

    Button("🔔 Show Notification") {
        vm.showNotification("Test", "Hello from Swift!")
    }
    .buttonStyle(PlainButtonStyle())
}
```

### 3. Add Methods in NotchViewModel

```swift
// In NotchViewModel.swift
func setAppState(_ state: String) {
    swiftActionSender.send(.setAppState(state))
}

func showNotification(_ title: String, _ message: String) {
    swiftActionSender.send(.showNotification(title, message))
}
```

### 4. Add Cases in NotchDropCore

```swift
// In NotchDropCore.swift
case .setAppState(let state):
    swiftActionCallback?("setAppState", state)
case .showNotification(let title, let message):
    swiftActionCallback?("showNotification", "\(title):\(message)")
```

### 5. Add Cases in JavaScript Wrapper

```javascript
// In index.js
case 'setAppState':
    console.log('📱 Swift requested app state change:', data);
    this.handleAppState(data);
    break;
case 'showNotification':
    console.log('🔔 Swift requested notification:', data);
    const [title, message] = data.split(':');
    this.handleNotification(title, message);
    break;
```

### 6. Add Handler in Electron Service

```javascript
// In notchDropService.js
this.notchDropAddon.on('appState', (state) => {
    this.handleAppState(state);
});

this.notchDropAddon.on('notification', (title, message) => {
    this.handleNotification(title, message);
});

handleAppState(state) {
    try {
        log.info(`📱 App state changed to: ${state}`);
        this.emitToRenderer('app-state-changed', state);
    } catch (error) {
        log.error('❌ App state change failed:', error);
    }
}

handleNotification(title, message) {
    try {
        // Show native notification
        const { Notification } = require('electron');
        new Notification({
            title: title,
            body: message,
            icon: path.join(__dirname, '../assets/app-logo.png')
        }).show();

        log.info(`🔔 Notification shown: ${title} - ${message}`);
    } catch (error) {
        log.error('❌ Notification failed:', error);
    }
}
```

## Testing Advanced Actions

Create a test script for advanced actions:

```javascript
// test-advanced-actions.js
const NotchDropAddonWrapper = require('./index.js');

async function testAdvancedActions() {
	const notchDropAddon = new NotchDropAddonWrapper();

	// Set up event listeners
	notchDropAddon.on('fileOperation', (operation, filePath) => {
		console.log(`📁 File operation: ${operation} on ${filePath}`);
	});

	notchDropAddon.on('systemControl', (control, data) => {
		console.log(`🔧 System control: ${control} with data ${data}`);
	});

	notchDropAddon.on('appState', (state) => {
		console.log(`📱 App state: ${state}`);
	});

	notchDropAddon.on('notification', (title, message) => {
		console.log(`🔔 Notification: ${title} - ${message}`);
	});

	notchDropAddon.initialize();
	notchDropAddon.show();

	console.log('✅ Advanced actions test ready!');
	console.log('📱 Use the Swift UI buttons to test different actions');
}

testAdvancedActions();
```

## Conclusion

These examples demonstrate how to extend the Swift to Electron communication with various types of actions:

1. **File Operations:** Read, write, delete files
2. **System Controls:** Volume, brightness, screen lock
3. **Application State:** Status updates, notifications

The modular design makes it easy to add new actions by following the same pattern across all layers of the architecture.



