# Windows Setup Guide for Ve AI Desktop App

This guide will help you set up and run the Ve AI Desktop App on Windows.

## Prerequisites

- Windows 10 or later
- Node.js 18+ 
- npm or yarn
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ve-desktop-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development mode**
   ```bash
   npm run dev:win
   ```

4. **Build for Windows**
   ```bash
   npm run package:win
   ```

## Windows-Specific Features

### Global Shortcuts
The app uses the following global shortcuts on Windows:

- **Ctrl+\\** - Toggle overlay window
- **Ctrl+/** - Toggle overlay window (alternative shortcut)
- **Ctrl+Enter** - Toggle Ask AI window
- **Ctrl+Alt+O** - Alternative overlay window shortcut (if main fails)
- **Ctrl+Alt+A** - Alternative Ask AI window shortcut (if main fails)
- **Ctrl+Arrow Keys** - Move overlay window
- **F12** - Toggle developer tools

### Window Behavior
- Overlay windows use the "toolbar" window type for better Windows compatibility
- Windows are always on top and can be moved around
- Both overlay and Ask AI windows can be visible simultaneously

### Permissions
- Windows doesn't require the same permission system as macOS
- Microphone and camera access is handled through the browser's permission system
- Screen recording permissions are not required on Windows

## Troubleshooting

### Global Shortcuts Not Working
If global shortcuts don't work:
1. Make sure the app is running as administrator
2. Check if other applications are using the same shortcuts
3. Try the alternative shortcuts (Ctrl+Alt+O, Ctrl+Alt+A)

### Window Not Showing
If overlay windows don't appear:
1. Check if the app is minimized to system tray
2. Try pressing the global shortcuts again
3. Restart the application

### Build Issues
If you encounter build issues:
1. Make sure you're using the Windows-specific build commands
2. Check that all dependencies are installed
3. Try cleaning the build cache: `npm run clean:build:win`

## Development

### Windows-Specific Development Commands
- `npm run dev:win` - Start development server with Windows environment
- `npm run build:win` - Build for Windows
- `npm run package:win` - Package for Windows distribution
- `npm run clean:build:win` - Clean build directories (Windows)

### File Paths
The app uses Node.js path module which automatically handles Windows path separators, so file paths should work correctly on Windows.

## Icon Requirements

For proper Windows distribution, you should convert the macOS `.icns` file to a Windows `.ico` file. You can use:
- Online converters
- ImageMagick
- Professional icon editing tools

The current setup includes a placeholder `.ico` file, but for production, you should create a proper Windows icon.

## Notes

- The app maintains compatibility with both macOS and Windows
- All macOS-specific features are properly handled with platform checks
- Windows-specific optimizations are in place for better performance
- The app will automatically detect the platform and use appropriate settings
