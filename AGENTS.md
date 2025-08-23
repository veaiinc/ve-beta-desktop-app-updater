# AGENTS.md

## Global Shortcuts

### Main Window Toggle

-   \*\*Cmd+\*\* - Toggle between main window (index.html) and all other windows

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
