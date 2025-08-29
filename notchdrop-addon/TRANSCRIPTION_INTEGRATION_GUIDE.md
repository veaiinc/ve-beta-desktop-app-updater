# NotchDrop Transcription Integration Guide

## Overview

This guide explains how the transcription functionality is integrated between the NotchDrop addon and the existing overlay system. The integration allows users to start transcription by clicking the start button in NotchDrop, which then triggers the overlay system to begin recording and displaying transcriptions.

## Architecture

```
Swift UI → NotchDrop Addon → Main Process → Overlay Window → Transcription System
```

### Flow Diagram

```
┌─────────────┐    ┌─────────────────┐    ┌──────────────┐    ┌─────────────┐
│   Swift UI  │───▶│ NotchDrop Addon │───▶│ Main Process │───▶│ Overlay     │
│             │    │                 │    │              │    │ Window      │
│ Start Button│    │ handleSwiftAction│   │ IPC Handlers │    │ Transcription│
└─────────────┘    └─────────────────┘    └──────────────┘    └─────────────┘
```

## Key Components

### 1. Swift Side (NotchViewModel.swift)

The Swift UI sends actions through the `swiftActionSender`:

```swift
func startRecording() {
    isRecording = true
    isPaused = false
    timer = 0
    startTimer()

    // Emit action for JavaScript
    swiftActionSender.send(.startRecording)

    // Trigger overlay integration
    swiftActionSender.send(.triggerOverlayToggleLiveIntelligence)
}
```

### 2. NotchDrop Addon (index.js)

The addon handles Swift actions and bridges to the overlay system:

```javascript
handleSwiftAction(actionData) {
    const [action, data] = actionData.split(':');

    switch (action) {
        case 'startRecording':
            this.triggerOverlayRecording();
            break;
        case 'triggerOverlayToggleLiveIntelligence':
            this.triggerOverlayToggleLiveIntelligence();
            break;
        // ... other actions
    }
}
```

### 3. Main Process Integration

The addon communicates with the overlay system through two methods:

#### Method 1: IPC Communication (Renderer Process)

```javascript
const { ipcRenderer } = require('electron');
const result = await ipcRenderer.invoke('overlay-start-recording');
```

#### Method 2: Direct Window Communication (Main Process)

```javascript
const { BrowserWindow } = require('electron');
const windows = BrowserWindow.getAllWindows();
for (const window of windows) {
	if (window.getTitle().includes('Overlay')) {
		window.webContents.send('overlay-command', {
			action: 'startRecording',
		});
		break;
	}
}
```

### 4. Overlay System (OverlayApp.jsx)

The overlay receives commands and starts transcription:

```javascript
const handleOverlayCommand = (event, command) => {
	switch (command.action) {
		case 'startRecording':
			handleDynamicIslandListenClick();
			break;
		case 'toggleLiveIntelligence':
			handleDynamicIslandListenClick();
			break;
		// ... other commands
	}
};
```

## Fixed Issues

### 1. IPC Channel Mismatch

**Problem**: The notchdrop-addon was using colon-based channel names (`overlay:startRecording`) but the main process expected hyphen-based names (`overlay-start-recording`).

**Solution**: Updated all IPC channel names in the notchdrop-addon to match the main process expectations:

```javascript
// Before
startRecording: () => ipcRenderer.invoke('overlay:startRecording'),

// After
startRecording: () => ipcRenderer.invoke('overlay-start-recording'),
```

### 2. Process Context Issues

**Problem**: The notchdrop-addon was trying to use `ipcRenderer` in the main process context where it's not available.

**Solution**: Implemented dual-mode communication that works in both renderer and main process contexts:

```javascript
async triggerOverlayRecording() {
    try {
        // Try renderer process approach first
        const { ipcRenderer } = require('electron');
        if (ipcRenderer) {
            const result = await ipcRenderer.invoke('overlay-start-recording');
            return;
        }
    } catch (e) {
        // Fall back to main process approach
        const { BrowserWindow } = require('electron');
        // ... direct window communication
    }
}
```

### 3. Missing IPC Handlers

**Problem**: Some overlay integration handlers were missing or incorrectly implemented.

**Solution**: Added proper IPC handlers and ensured all overlay integration methods are available.

## Testing

### Manual Testing

1. **Start the Electron app**
2. **Open NotchDrop** (should appear automatically)
3. **Click the start button** in NotchDrop
4. **Verify** that the overlay window opens and transcription starts

### Automated Testing

Run the test script to verify integration:

```bash
cd notchdrop-addon
node test-transcription-integration.js
```

## Troubleshooting

### Common Issues

1. **Transcription doesn't start**

    - Check console logs for IPC errors
    - Verify overlay window exists
    - Ensure microphone permissions are granted

2. **Overlay window doesn't appear**

    - Check if overlay window is created properly
    - Verify window title matching logic
    - Check main process logs

3. **Swift actions not received**
    - Verify NotchDrop addon initialization
    - Check Swift-JS bridge connection
    - Ensure action names match exactly

### Debug Logs

The integration includes comprehensive logging:

```
🎤 Swift requested start recording
🎤 Triggering overlay recording from Swift
Running in main process, using direct window communication
✅ Overlay recording command sent directly to window
```

### Console Commands

Check the integration status:

```javascript
// In Electron DevTools console
console.log('NotchDrop integration status:', window.electronApi?.notchDrop);
console.log('Overlay integration status:', window.electronApi?.overlay);
```

## Configuration

### IPC Channel Names

All overlay integration uses these standardized channel names:

-   `overlay-start-recording`
-   `overlay-stop-recording`
-   `overlay-pause-recording`
-   `overlay-resume-recording`
-   `overlay-toggle-live-intelligence`

### Window Title Matching

The overlay window is identified by these title patterns:

-   `Overlay`
-   `Live Intelligence`

## Future Enhancements

1. **State Synchronization**: Sync recording state between NotchDrop and overlay
2. **Error Recovery**: Implement automatic retry mechanisms
3. **Performance Optimization**: Reduce IPC overhead
4. **Enhanced Logging**: Add more detailed debugging information

## Support

For issues with the transcription integration:

1. Check the console logs for error messages
2. Run the test script to verify functionality
3. Review this documentation for troubleshooting steps
4. Check the main overlay system documentation for additional context
