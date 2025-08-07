# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ve AI Dashboard is a cross-platform Electron-based desktop application built with React and Vite. It serves as an intelligent AI assistant that helps users with task management, document handling, calendar integration, and real-time collaboration. The app features a modular architecture with dual source directories (`src/` and `builderSrc/`) for different application contexts.

## Development Commands

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

### Essential Commands

-   `npm run dev` - Start Vite development server
-   `npm start` - Launch Electron app (run after `npm run dev` in separate terminal)
-   `npm run build` - Build for production (use `NODE_ENV=production` flag)
-   `npm run package` - Build and package Electron app
-   `npm run clean:build` - Clean all build artifacts (`dist-electron`, `build`, `dist`)

### Platform-Specific Packaging

-   `npm run package:mac` - Package for macOS
-   `npm run package:win` - Package for Windows
-   `npm run package:linux` - Package for Linux

### Testing

-   `npm run test` - Run Vitest tests
-   `npm run test:watch` - Run tests in watch mode
-   `npm run test:ui` - Launch Vitest UI
-   `npm run test:coverage` - Generate coverage report

### Code Quality

<!-- - `npm run format` - Format code with Prettier (required before commits) -->
<!-- - Build verification: Always run `npm run build` before committing -->

## Architecture Overview

### Dual Source Structure

-   **`src/`** - Main application source code (primary desktop app)
-   **`builderSrc/`** - Builder/design tools source code (secondary context)
-   **`electron/`** - Electron main process and preload scripts
-   **`public/`** - Static assets and manifest files

### State Management Pattern

Uses Context API with modular reducer pattern:

-   **Global State**: `src/context/ContextStates.jsx` combines all context providers
-   **Module Pattern**: Each feature has its own context folder with:
    -   `state.js` - Initial state definition
    -   `reducer.js` - State update logic
    -   `actions.js` - Action creators
    -   `actionTypes.js` - Action type constants
    -   `graphQlFunctions.js` - API integration (where applicable)

### Key Context Modules

-   `auth/` - Authentication and user sessions
-   `Chat/` - Real-time messaging and AI interactions
-   `Calendar/` - Scheduling and event management
-   `contacts/` - Contact and client management
-   `tasks/` - Task tracking and automation
-   `Gallery/` - Media and file management
-   `Templates/` - Document templates and forms
-   `automationBuilder/` - Workflow automation tools

### Routing System

Dynamic route loading based on workspace mode:

-   **Public Routes**: Landing pages, auth flows (`/`, `/onboarding`, etc.)
-   **Workspace Routes**: Dynamically imported based on `workspaceMode`:
    -   `stable` → `stableRoutes.jsx`
    -   `beta` → `betaRoutes.jsx`
    -   `internal` → `internalRoutes.jsx`
    -   `suspended` → `suspendedRoute.jsx`
-   **Route Hook**: `useWorkspaceMode()` handles workspace detection and route selection

### Technology Stack Integration

-   **UI Framework**: React 18 with functional components and hooks
-   **Styling**: Sass/SCSS with modular component styles
-   **Component Library**: Ant Design (antd) for UI components
-   **Data Layer**: Apollo Client + GraphQL for API communication
-   **Build Tool**: Vite with optimized dependency bundling
-   **Testing**: Vitest with jsdom environment
-   **Desktop**: Electron with auto-updater functionality

### API and Services

-   **GraphQL**: Centralized in `src/services/graphQlServices.jsx`
-   **Configuration**: Environment-based config (`config.dev.js`, `config.live.js`)
-   **Error Handling**: Centralized error logging in `services/api/errorLogger.js`

## Code Conventions

### Prettier Configuration (from package.json)

-   Print width: 100 characters
-   Tab width: 4 spaces (using tabs)
-   Trailing commas: always
-   Semicolons: required
-   Quotes: single quotes
-   **Important**: Always run `npm run format` before committing

### File Naming

-   React components: PascalCase (e.g., `ChatBox.jsx`)
-   Hooks: camelCase with `use` prefix (e.g., `useWorkspaceMode.js`)
-   Context files: camelCase with descriptive names
-   SCSS files: kebab-case matching component names

### Component Structure

-   Use functional components with hooks
-   Prefer `memo()` for performance optimization where needed
-   Custom hooks for reusable logic
-   Context for cross-component state management

## Build Configuration Notes

### Vite Configuration

-   Base path: `'./'` for Electron compatibility
-   Build output: `build/` directory
-   Electron output: `dist-electron/` directory
-   Bundle analysis available via `npm run build:analyze`
-   Optimized dependencies include React, Ant Design, lodash, axios, and BlockNote

### Electron Builder

-   App ID: `com.veai.dashboard`
-   Multi-platform builds supported (macOS, Windows, Linux)
-   Auto-updater integration with GitHub releases
-   Hardened runtime enabled for macOS with entitlements

## Testing Setup

-   Vitest with jsdom environment
-   Setup files: `src/setupTests.js` and `src/tests/setup.js`
-   MSW (Mock Service Worker) for API mocking
-   Coverage reports with v8 provider

## Important Notes

-   Never commit `build/`, `dist/`, or `dist-electron/` directories
-   The app uses HashRouter for Electron compatibility
-   Workspace mode determines available features and routing
-   Auto-updater checks for updates on app launch
-   Both source directories (`src/` and `builderSrc/`) may need consideration for features spanning contexts
