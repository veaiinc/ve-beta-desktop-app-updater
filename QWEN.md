# Ve AI Dashboard - Project Context

## Overview

This is a cross-platform desktop application called **Ve AI Dashboard**, built with Electron, React, and Vite. It functions as an intelligent personal assistant, providing features like task management, document editing, real-time chat, and integrations with various services. The application is designed to be a "living intelligence" that remembers user interactions and helps accomplish goals.

## Key Technologies & Architecture

-   **Framework**: Electron (for desktop app cross-platform compatibility)
-   **Frontend**: React with Vite as the build tool for fast development.
-   **UI Library**: Ant Design (antd) for components.
-   **Styling**: Sass.
-   **State Management**: Apollo Client with GraphQL.
-   **Testing**: Vitest.
-   **Packaging**: Electron Builder.

## Project Structure

-   `src/`: Main frontend source code (React components, hooks, context, views).
-   `electron/`: Electron main process scripts (`main.js`, `preload.js`) and helpers.
-   `public/`: Static assets.
-   `builderSrc/`: Additional builder-related source code.
-   `dist/`, `build/`, `dist-electron/`: Output directories for builds and packaging.

## Development Workflow

### Prerequisites

-   Node.js (v18+ recommended)
-   npm (v9+ recommended)
-   Git

### Setup

1. Clone the repository.
2. Install dependencies: `npm install`

### Running the App (Development)

1. Start the Vite development server: `npm run dev`

## Plan & Review

-   Always in plan mode to make a plan
-   After get the plan, make sure you Write the plan to ./claude/tasks/TASK_NAME.md.
-   The plan should be a detailed implementation plan and the reasoning behind them, as well as tasks broken down.
-   If the task require external knowledge or certain package, also research to get latest knowledge (Use Task tool for research)
-   Don't over plan it, always think MVP.
-   Once you write the plan, firstly ask me to review it. Do not continue until I approve the plan.

### While implementing

-   You should update the plan as you work.
-   After you complete tasks in the plan, you should update and append detailed descriptions of the changes you made, so following tasks can be easily hand over to other engineers.

### Useful Development Scripts

-   `npm run dev` — Start Vite dev server
-   `npm run build` — Build the app for production
-   `npm run package` — Build and package the Electron app
-   `npm run test` — Run tests with Vitest
-   `npm run format` — Format code with Prettier
-   `npm run clean:build` — Clean build artifacts

## Building and Packaging

-   **Build**: `npm run build`
-   **Package for macOS**: `npm run package:mac`
-   **Package for Windows**: `npm run package:win`
-   **Package for Linux**: `npm run package:linux`

Packaged applications are output to the `dist/` directory.

## Testing

-   **Run all tests**: `npm run test`
-   **Watch mode**: `npm run test:watch`
-   **Test UI**: `npm run test:ui`
-   **Coverage report**: `npm run test:coverage`

## Communication Between Frontend and Electron Main Process

The application uses Electron's `contextBridge` to securely expose an `electronApi` object to the frontend. This API allows the React frontend to invoke IPC (Inter-Process Communication) handlers defined in the Electron main process (`main.js`) and receive asynchronous responses or events.

Key functionalities exposed via `electronApi` include:

-   Auto-updater controls and status (`checkForUpdates`, `downloadUpdate`, `onUpdateStatus`)
-   Overlay window management (`overlay.toggleWindow`, `overlay.updateDimensions`)
-   Ask AI window management (`askAI.toggleWindow`, `askAI.showWindow`)
-   Dynamic Island integration (`dynamicIsland.expand`, `dynamicIsland.collapse`)
-   NotchDrop service integration (`notchdrop.enable`, `notchdrop.toggle`)
-   Clipboard access (`clipboard.writeText`, `clipboard.readText`)
-   Microphone/Camera permission handling (`microphone.checkPermission`, `camera.requestPermission`)
-   Screen capture (`desktop.captureScreen`)
