# Overlay Window Implementation Plan

## Overview

Add an overlay window feature to the Ve AI Desktop App, inspired by the free-cluely-main implementation. The overlay window will provide screenshot capture accessible via global shortcuts.

## Requirements

-   ✅ Overlay window triggered by **Cmd+B** (global shortcut)
-   ✅ Main window hides when overlay shows, and vice versa (toggle behavior)
-   ✅ Window movement using **Cmd + Arrow keys**
-   ✅ No React Query integration (keep it simple)
-   ✅ Maintain existing project architecture and patterns

## Architecture Analysis

### Current Project Structure

-   **Electron main process:** `/electron/main.js` (JavaScript)
-   **Preload script:** `/electron/preload.js`
-   **React frontend:** `/src/` with Context API state management
-   **Styling:** SCSS with global theme system
-   **Build:** Vite + Electron Builder

### Free-Cluely Reference Structure

-   **TypeScript-based Electron** with modular helper classes
-   **WindowHelper:** Manages overlay window creation, positioning, visibility
-   **ShortcutsHelper:** Handles global keyboard shortcuts
-   **React UI** with Tailwind CSS and glassmorphism effects
-   **Transparent, frameless overlay window**

## Implementation Plan

### Phase 1: Core Window Management

#### 1.1 Create Window Helper Module

**File:** `/electron/helpers/WindowHelper.js`

```javascript
// Core functionality needed:
class WindowHelper {
  constructor() {
    this.overlayWindow = null;
    this.isOverlayVisible = false;
    this.windowPosition = { x: 0, y: 0 };
    this.windowSize = { width: 400, height: 150 };
    this.screenDimensions = {};
  }

  // Methods to implement:
  createOverlayWindow()     // Create transparent overlay window
  toggleOverlayWindow()     // Show/hide with main window toggle
  hideOverlayWindow()       // Hide and remember position
  showOverlayWindow()       // Show at saved position
  moveWindow(direction)     // Move window with arrow keys
  updateWindowDimensions()  // Dynamic sizing based on content
}
```

**Key Features:**

-   Transparent, frameless window (`transparent: true, frame: false`)
-   Always on top (`alwaysOnTop: true`)
-   Proper window positioning and movement logic
-   Screen boundary detection
-   macOS-specific optimizations (`setVisibleOnAllWorkspaces`, `setHiddenInMissionControl`)

#### 1.2 Create Shortcuts Helper Module

**File:** `/electron/helpers/ShortcutsHelper.js`

```javascript
class ShortcutsHelper {
	constructor(windowHelper, mainWindow) {
		this.windowHelper = windowHelper;
		this.mainWindow = mainWindow;
	}

	registerGlobalShortcuts() {
		// Cmd+B: Toggle overlay window & main window
		// Cmd+H: Take screenshot
		// Cmd+Arrow: Move overlay window
	}
}
```

**Shortcuts to implement:**

-   **Cmd+B:** Toggle overlay window (hide/show main window accordingly)
-   **Cmd+Left/Right/Up/Down:** Move overlay window
-   **Cmd+H:** Take screenshot (basic functionality)

#### 1.3 Update Main Process

**File:** `/electron/main.js`

**Changes needed:**

1. Import and initialize WindowHelper and ShortcutsHelper
2. Add IPC handlers for overlay window communication
3. Integrate with existing main window management
4. Add screenshot capture functionality

```javascript
// New IPC handlers needed:
ipcMain.handle('toggle-overlay-window');
ipcMain.handle('take-screenshot');
ipcMain.handle('update-overlay-dimensions');
```

### Phase 2: Frontend Implementation

#### 2.1 Create Overlay React App

**File:** `/src/overlay/OverlayApp.jsx`

**Components needed:**

-   `OverlayApp.jsx` - Main overlay application container
-   `OverlayCommands.jsx` - Command buttons and shortcuts display
-   `ScreenshotControls.jsx` - Screenshot capture interface
-   `VoiceRecorder.jsx` - Voice recording controls

**Key features:**

-   Glassmorphism UI design (dark transparent background)
-   Command buttons showing keyboard shortcuts
-   Dynamic window resizing based on content
-   Toast notifications for user feedback

#### 2.2 Create Overlay Styles

**File:** `/src/assets/scss/overlay/overlay.scss`

**Design requirements:**

-   Dark transparent background (`bg-black/60 backdrop-blur-md`)
-   Glassmorphism effect
-   Rounded corners and subtle borders
-   Consistent with existing Ve AI design system
-   Responsive button layouts

#### 2.3 Update Preload Script

**File:** `/electron/preload.js`

**New APIs to expose:**

```javascript
overlayAPI: {
  toggleWindow: () => ipcRenderer.invoke('toggle-overlay-window'),
  takeScreenshot: () => ipcRenderer.invoke('take-screenshot'),
  updateDimensions: (dims) => ipcRenderer.invoke('update-overlay-dimensions', dims),
}
```

### Phase 3: Build and Integration

#### 3.1 Update Build Configuration

**Files to modify:**

-   `vite.config.js` - Add overlay build target
-   `package.json` - Update scripts if needed
-   Electron builder config - Ensure overlay assets are included

#### 3.2 Create Overlay HTML Entry Point

**File:** `/overlay.html` (in project root)

Simple HTML file to load the overlay React app, similar to main `index.html` but minimal.

#### 3.3 Context Integration (Optional)

If state sharing between main app and overlay is needed:

-   Create `/src/context/overlay/` state management
-   Add overlay-specific actions and reducers
-   Integrate with existing ContextStates.jsx

### Phase 4: Features Implementation

#### 4.1 Screenshot Functionality

-   Use Electron's `desktopCapturer` API
-   Hide overlay during screenshot capture
-   Save to temp directory with timestamp
-   Show preview in overlay UI
-   Basic screenshot management (view, delete)

#### 4.2 Window Management Enhancements

-   Smart positioning (avoid screen edges)
-   Remember last position between sessions
-   Smooth animations for show/hide
-   Multi-monitor support

### Phase 5: Testing and Polish

#### 5.1 Testing Checklist

-   [ ] Overlay window creation and destruction
-   [ ] Global shortcuts work across all applications
-   [ ] Main window properly hides/shows with overlay toggle
-   [ ] Window movement with arrow keys
-   [ ] Screenshot capture without overlay visible
-   [ ] UI responsiveness and styling
-   [ ] Cross-platform compatibility (macOS primary)

#### 5.2 Performance Optimizations

-   Lazy load overlay window (create only when first needed)
-   Optimize screenshot capture performance
-   Minimize memory footprint
-   Efficient event listener management

## File Structure

```
ve-desktop-app/
├── electron/
│   ├── helpers/
│   │   ├── WindowHelper.js          # NEW - Overlay window management
│   │   └── ShortcutsHelper.js       # NEW - Global shortcuts
│   ├── main.js                      # MODIFIED - Add overlay integration
│   └── preload.js                   # MODIFIED - Add overlay APIs
├── src/
│   ├── overlay/                     # NEW - Overlay React components
│   │   ├── OverlayApp.jsx
│   │   ├── OverlayCommands.jsx
│   │   ├── ScreenshotControls.jsx
│   └── assets/scss/overlay/         # NEW - Overlay styles
│       └── overlay.scss
├── overlay.html                     # NEW - Overlay HTML entry point
└── package.json                     # MODIFIED - Update scripts/dependencies
```

## Dependencies

### New Dependencies Needed

```json
{
	"dependencies": {
		// For screenshot functionality (if not using desktopCapturer)
		// "screenshot-desktop": "^1.12.7",
	}
}
```

**Note:** Most functionality can be implemented with existing Electron APIs and browser APIs, minimizing external dependencies.

## Implementation Notes

### Key Design Decisions

1. **Keep it Simple:** No React Query, minimal external dependencies
2. **Reuse Existing Patterns:** Follow current project's JavaScript + Context API approach
3. **Performance First:** Lazy load overlay, efficient window management
4. **User Experience:** Smooth animations, clear visual feedback
5. **Cross-Platform:** Primary focus on macOS, ensure Windows/Linux compatibility

### Potential Challenges

1. **Global Shortcuts Conflicts:** Ensure shortcuts don't interfere with other apps
2. **Window Focus Management:** Proper handling of focus between main app and overlay
3. **Screenshot Timing:** Ensure overlay is hidden before screenshot capture
4. **Memory Management:** Proper cleanup of event listeners and window resources

### Future Enhancements (Not in Scope)

-   Advanced screenshot editing
-   Cloud sync for captures
-   AI-powered voice transcription integration
-   Custom shortcut configuration
-   Overlay theming options

## Success Criteria

✅ **Core Functionality:**

-   Overlay window toggles with Cmd+B
-   Main window hides when overlay shows (and vice versa)
-   Window moves with Cmd+Arrow keys
-   Screenshot capture works without showing overlay

✅ **User Experience:**

-   Smooth, responsive UI with glassmorphism design
-   Clear visual indicators for shortcuts and functionality
-   No interference with main application workflows
-   Intuitive and discoverable features

✅ **Technical Requirements:**

-   No memory leaks or performance degradation
-   Proper cleanup on app exit
-   Cross-platform functionality
-   Maintainable, well-documented code following project conventions

---

_This plan provides a comprehensive roadmap for implementing the overlay window feature while maintaining the existing project architecture and ensuring a smooth user experience._
