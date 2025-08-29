# AGENTS.md

## Global Shortcuts

### Main Window Toggle

-   **Cmd+\** - Toggle between main window (index.html) and all other windows
-   **Cmd+\** - Toggle overlay window

### Ask AI Window

-   **Cmd+Enter** - Toggle ask AI window on/off

### Window Movement (when overlay is visible)

-   **Cmd+Left** - Move overlay window left
-   **Cmd+Right** - Move overlay window right
-   **Cmd+Up** - Move overlay window up
-   **Cmd+Down** - Move overlay window down

### Developer Tools

-   **F12** - Toggle developer tools for overlay window
-   **Cmd+Shift+I** - Alternative shortcut for developer tools

## Implementation Details

### Command+Enter Shortcut for Ask AI:

-   Creates the ask AI window if it doesn't exist
-   Toggles between showing/hiding the ask AI window
-   Automatically hides the main window when showing ask AI
-   Automatically hides the overlay window if it's visible when showing ask AI
-   Restores the main window when hiding ask AI
-   Works seamlessly with existing overlay window functionality

### Command+\ Shortcut for Main Window:

-   When any other window is visible (overlay or ask AI), hides all other windows and shows the main window
-   When only the main window is visible, shows the overlay window (which hides the main window)
-   Provides a quick way to return to the main application from any other window
-   Ensures only one window type is visible at a time for clean user experience

## Requirements

-   macOS: Requires accessibility permissions for global shortcuts to work
-   The app must be added to System Preferences > Security & Privacy > Privacy > Accessibility

## Debugging Global Shortcuts

### Enhanced Console Logging

The app now includes comprehensive console logging for debugging global shortcuts:

1. **Startup Logs**: When the app starts, you'll see detailed registration status for all shortcuts
2. **Execution Logs**: When shortcuts are pressed, detailed execution information is logged
3. **System Information**: Platform, OS version, and Electron version information
4. **Conflict Detection**: Checks for potential conflicts with other applications

### How to Test Ctrl+\ Shortcut

1. **Start the app** and open Developer Tools (F12 or Ctrl+Shift+I)
2. **Look for startup logs** showing shortcut registration status
3. **Press Ctrl+\** (Windows) or Cmd+\ (macOS)
4. **Check console logs** for detailed execution information

### Expected Console Output

When Ctrl+\ is pressed, you should see:
```
🔍 Cmd+\ (Ctrl+\) SHORTCUT TRIGGERED!
📱 Platform: win32
🖥️  OS: Windows
⏰ Timestamp: 2024-01-01T12:00:00.000Z
👁️  Overlay window currently visible: false
👁️  Showing overlay window...
✅ Overlay window shown successfully
🎯 Cmd+\ (Ctrl+\) shortcut execution completed
```

### Troubleshooting

- **If shortcuts don't register**: Check if other applications are using the same shortcuts
- **If shortcuts register but don't work**: Check accessibility permissions (macOS) or run as administrator (Windows)
- **If overlay doesn't appear**: Check for window creation errors in console logs
- **Alternative shortcuts**: Try Ctrl+Alt+/ if the main shortcut fails

### Test Script

Run `node test-shortcuts.js` for a comprehensive testing guide.
