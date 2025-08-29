# NotchDrop UI Implementation

This document describes the React-based UI implementation for the NotchDrop addon, which provides the same functionality and appearance as the original notch implementation.

## Overview

The NotchDrop UI is a React-based interface that mirrors the functionality of the original DynamicIslandUI from the `src/notch/` folder. It provides:

-   **Same Visual Design**: Identical styling and animations
-   **Same Functionality**: Recording controls, chat mode, authentication handling
-   **Native Integration**: Seamless integration with the native NotchDrop addon
-   **Electron Support**: Full integration with the Electron main process

## Architecture

```
notchdrop-addon/
├── ui/                          # React UI source
│   ├── src/
│   │   ├── components/
│   │   │   ├── NotchDropUI.jsx  # Main UI component
│   │   │   └── NotchDropIcons.jsx # Icon components
│   │   ├── styles/
│   │   │   ├── index.scss       # Main styles
│   │   │   └── variables.scss   # SCSS variables
│   │   └── main.jsx             # React entry point
│   └── index.html               # HTML template
├── ui-bridge.js                 # Bridge between native addon and UI
├── electron-integration.js      # Electron integration
├── preload.js                   # Electron preload script
└── test-ui.js                   # UI testing script
```

## Features

### 1. Visual Design

-   **Collapsed State**: Small pill-shaped interface (250px × 15px)
-   **Expanded State**: Rich UI with controls (575px × 180px)
-   **Recording State**: Extended interface for recording controls (765px × 180px)
-   **Hover Animations**: Smooth transitions and scaling effects
-   **Dark Theme**: Consistent with the original design

### 2. Functionality

-   **Recording Controls**: Start, stop, pause, resume recording
-   **Chat Mode**: Interactive chat interface
-   **Authentication**: Login/logout state handling
-   **Timer Display**: Real-time recording timer
-   **Audio Visualizer**: Visual feedback during recording
-   **File Drop Support**: Native file drop functionality

### 3. Integration

-   **Native Addon**: Direct communication with NotchDrop native code
-   **Electron**: Full Electron main/renderer process integration
-   **Overlay System**: Integration with existing overlay functionality
-   **Event System**: Comprehensive event handling and state management

## Installation & Setup

### Prerequisites

-   Node.js 16+
-   npm or yarn
-   Electron (for integration)

### 1. Install Dependencies

```bash
cd notchdrop-addon
npm install
```

### 2. Build Native Addon

```bash
npm run build
```

### 3. Build UI (Development)

```bash
npm run dev:ui
```

### 4. Build UI (Production)

```bash
npm run build:ui
```

## Usage

### Basic Usage

```javascript
const NotchDropUIBridge = require('./ui-bridge.js');

// Initialize the bridge
const bridge = NotchDropUIBridge.bridge;
await bridge.initialize();

// Control the UI
await bridge.expand();
await bridge.startRecording();
bridge.setChatMode(true);
```

### Electron Integration

```javascript
const NotchDropIntegration = require('./electron-integration.js');

// Initialize in main process
const integration = NotchDropIntegration.integration;
await integration.initialize(mainWindow);

// Control from main process
integration.show();
integration.hide();
integration.toggle();
```

### React Component Usage

```jsx
import NotchDropUI from './components/NotchDropUI';

function App() {
	return (
		<div>
			<NotchDropUI />
		</div>
	);
}
```

## API Reference

### NotchDropUIBridge

#### Methods

-   `initialize()`: Initialize the bridge and native addon
-   `expand()`: Expand the UI to show rich interface
-   `collapse()`: Collapse the UI to pill state
-   `startRecording()`: Start recording
-   `stopRecording()`: Stop recording
-   `pauseRecording()`: Pause recording
-   `resumeRecording()`: Resume recording
-   `setChatMode(enabled)`: Enable/disable chat mode
-   `setChatInput(input)`: Set chat input value
-   `updateTimer(seconds)`: Update recording timer
-   `destroy()`: Clean up resources

#### Events

-   `uiStateChanged`: Fired when UI state changes
-   `startRecording`: Fired when recording starts
-   `stopRecording`: Fired when recording stops
-   `fileDropped`: Fired when files are dropped

### Electron Integration

#### Methods

-   `initialize(mainWindow)`: Initialize integration with main window
-   `show()`: Show the NotchDrop window
-   `hide()`: Hide the NotchDrop window
-   `toggle()`: Toggle window visibility
-   `destroy()`: Clean up integration

## Testing

### Run UI Tests

```bash
npm run test:ui
```

### Run Native Addon Tests

```bash
npm test
```

### Manual Testing

1. Start the development server: `npm run dev:ui`
2. Open the UI in a browser
3. Test hover interactions and functionality
4. Check console for detailed logs

## Development

### File Structure

-   **UI Components**: React components in `ui/src/components/`
-   **Styles**: SCSS files in `ui/src/styles/`
-   **Bridge**: Native addon integration in `ui-bridge.js`
-   **Electron**: Main process integration in `electron-integration.js`
-   **Preload**: Renderer process API in `preload.js`

### Key Features Implementation

#### 1. State Management

The UI uses React state management with a bridge to the native addon:

```javascript
const [isExpanded, setIsExpanded] = useState(false);
const [isRecording, setIsRecording] = useState(false);
const [isAuthenticated, setIsAuthenticated] = useState(false);
```

#### 2. Event Handling

Comprehensive event system for communication between components:

```javascript
bridge.on('uiStateChanged', (state) => {
	// Update React state
});
```

#### 3. Styling

SCSS-based styling with variables for consistency:

```scss
$primary-color: #79ecc9;
$background-color: #000000;
$transition-slow: 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

## Integration with Existing System

### Overlay Integration

The NotchDrop UI integrates with the existing overlay system:

-   Receives overlay state changes
-   Controls overlay recording functionality
-   Maintains synchronization between UI states

### Authentication

Handles user authentication state:

-   Monitors localStorage for user token
-   Updates UI based on authentication status
-   Provides appropriate messaging for unauthenticated users

### File Drop

Supports native file drop functionality:

-   Receives dropped files from native addon
-   Processes file paths and metadata
-   Integrates with existing file handling system

## Troubleshooting

### Common Issues

1. **UI Not Loading**

    - Check if Vite dev server is running
    - Verify file paths in `vite.config.js`
    - Check console for build errors

2. **Native Addon Not Working**

    - Ensure native addon is built: `npm run build`
    - Check platform compatibility
    - Verify Node.js version

3. **Electron Integration Issues**
    - Check preload script configuration
    - Verify IPC handler setup
    - Check window creation parameters

### Debug Mode

Enable debug logging by setting environment variable:

```bash
DEBUG=notchdrop:* npm run dev:ui
```

## Future Enhancements

1. **Additional UI Modes**: Settings, menu, and configuration views
2. **Enhanced Animations**: More sophisticated transition effects
3. **Accessibility**: Screen reader support and keyboard navigation
4. **Theming**: Support for different color schemes
5. **Plugin System**: Extensible functionality through plugins

## Contributing

1. Follow the existing code style and patterns
2. Add tests for new functionality
3. Update documentation for API changes
4. Test on multiple platforms
5. Ensure backward compatibility

## License

MIT License - see LICENSE file for details.
