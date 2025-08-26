# NotchDrop Addon for Electron

A native macOS addon that provides a beautiful, modern SwiftUI interface for file sharing and management, integrated with Electron applications.

## Features

### 🎨 Modern UI Design

-   **Enhanced Visual Design**: Beautiful gradients and animations using ColorfulX
-   **Smooth Transitions**: Fluid animations between different states
-   **Hover Effects**: Interactive feedback for better user experience
-   **Dark Theme**: Optimized for dark mode with proper contrast

### 📁 File Management

-   **Drag & Drop**: Intuitive file dropping with visual feedback
-   **AirDrop Integration**: Direct AirDrop sharing functionality
-   **File Tray**: Temporary file storage with customizable retention
-   **Multiple File Support**: Handle multiple files simultaneously

### ⚙️ Advanced Features

-   **Haptic Feedback**: Tactile feedback for interactions
-   **Auto-hide**: Smart visibility management
-   **Settings Panel**: Customizable preferences
-   **Menu System**: Quick access to common actions

## Architecture

### SwiftUI Components

#### Core Views

-   **NotchView**: Main container with dynamic sizing and animations
-   **NotchContentView**: Content switcher for different modes
-   **NotchHeaderView**: Header with navigation controls
-   **NotchMenuView**: Menu with action buttons

#### Feature Views

-   **ShareView**: File sharing with AirDrop and generic sharing
-   **TrayView**: File storage and management
-   **NotchSettingsView**: Settings and preferences

#### Supporting Views

-   **DropItemView**: Individual file item display
-   **ColorButton**: Reusable button component with gradients

### State Management

-   **NotchViewModel**: Central state management
-   **TrayDrop**: File storage and management
-   **PublishedPersist**: Persistent settings storage

## Installation

### Prerequisites

-   macOS 11.0 or later
-   Node.js 16+
-   Xcode Command Line Tools

### Build Instructions

1. **Install Dependencies**

    ```bash
    cd notchdrop-addon
    npm install
    ```

2. **Build Native Addon**

    ```bash
    npm run build
    ```

3. **Integration with Electron**
    ```javascript
    const NotchDropService = require('./services/notchDropService');
    const notchDrop = new NotchDropService();
    await notchDrop.initialize();
    ```

## Usage

### Basic Integration

```javascript
// Initialize the service
const notchDrop = new NotchDropService();
await notchDrop.initialize();

// Show/hide NotchDrop
notchDrop.enable(); // Show
notchDrop.disable(); // Hide
notchDrop.toggle(); // Toggle

// Handle events
notchDrop.on('fileDropped', (filePath) => {
	console.log('File dropped:', filePath);
});

notchDrop.on('statusChanged', (status) => {
	console.log('Status changed:', status);
});
```

### Advanced Configuration

```javascript
// Configure settings
notchDrop.setHapticFeedback(true);
notchDrop.setNotchVisible(true);
notchDrop.setAutoOpenOnStartup(true);

// Handle dropped files
notchDrop.handleDroppedFiles(['/path/to/file1', '/path/to/file2']);

// Get current state
const status = notchDrop.getStatus();
const items = notchDrop.getCurrentItems();
```

## UI Components

### ShareView

-   **AirDrop Button**: Direct AirDrop sharing with neon gradient
-   **Generic Share Button**: System share menu with sunrise gradient
-   **Hover Effects**: Scale and color animations
-   **Drop Feedback**: Visual feedback during file drops

### TrayView

-   **File Storage**: Temporary file storage with retention settings
-   **Visual Feedback**: Loading animations and progress indicators
-   **Drag & Drop**: Enhanced drop zone with gradient borders
-   **Item Management**: Scrollable file list with thumbnails

### NotchMenuView

-   **Action Buttons**: GitHub, Donate, Settings, Clear, Exit
-   **Gradient Effects**: Colorful button backgrounds
-   **Hover Animations**: Scale and shadow effects
-   **Press Feedback**: Tactile button press animations

## Styling

### Color Schemes

-   **Aurora**: Blue-purple gradient for AirDrop
-   **Sunrise**: Green-blue gradient for generic sharing
-   **Neon**: Bright colors for active states
-   **Sunset**: Warm colors for targeting states

### Animations

-   **Spring Animations**: Natural, bouncy transitions
-   **Scale Effects**: Subtle size changes for feedback
-   **Opacity Transitions**: Smooth fade effects
-   **Shadow Effects**: Dynamic shadows for depth

### Typography

-   **System Fonts**: SF Pro with rounded design
-   **Weight Variations**: Medium and semibold weights
-   **Size Hierarchy**: Headline, caption, and body text
-   **Color Contrast**: High contrast white text on dark backgrounds

## Development

### File Structure

```
notchdrop-addon/
├── src/
│   ├── NotchDropCore.swift      # Main SwiftUI integration
│   ├── NotchView.swift          # Main container view
│   ├── NotchViewModel.swift     # State management
│   ├── ShareView.swift          # File sharing interface
│   ├── TrayView.swift           # File storage interface
│   ├── NotchMenuView.swift      # Menu interface
│   └── ...                      # Supporting files
├── binding.gyp                  # Build configuration
├── package.json                 # Dependencies
└── index.js                     # Node.js wrapper
```

### Building

```bash
# Clean build
npm run clean

# Build addon
npm run build

# Install in parent project
npm install
```

### Testing

```bash
# Test the addon
node test.js

# Test with Electron
npm run dev
```

## Troubleshooting

### Common Issues

1. **Build Failures**

    - Ensure Xcode Command Line Tools are installed
    - Check macOS version compatibility (11.0+)
    - Verify Swift version (5.0+)

2. **Runtime Errors**

    - Check accessibility permissions
    - Verify Electron version compatibility
    - Ensure proper file paths

3. **UI Issues**
    - Check dark mode compatibility
    - Verify screen resolution settings
    - Test with different macOS versions

### Debug Mode

```javascript
// Enable debug logging
const notchDrop = new NotchDropService();
notchDrop.setDebugMode(true);
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

-   Inspired by the original NotchDrop design
-   Built with SwiftUI and Electron
-   Enhanced with ColorfulX for beautiful gradients
