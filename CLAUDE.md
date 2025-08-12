# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Plan & Review

### Before starting work

-   Always in plan mode to make a plan
-   After get the plan, make sure you write the plan to .claude/tasks/TASK_NAME.md.
-   The plan should be a detailed implementation plan and the reasoning behind them, as well as tasks broken down.
-   If the task require external knowledge or certain package, also research to get latest knowledge (Use Task tool for research)
-   Don't over plan it, always think MVP.
-   Once you write the plan, firstly ask me to review it. Do not continue until I approve the plan.

### While implementing

-   You should update the plan as you work.
-   After you complete tasks in the plan, you should update and append detailed descriptions of the changes you made, so following tasks can be easily hand over to other engineers.

## Development Commands

### Essential Commands

-   `npm start` - Start development server (Vite) on port 5173
-   `npm test` - Run Vitest tests
-   `npm run test:watch` - Run tests in watch mode
-   `npm run test:coverage` - Generate test coverage report
-   `npm run format` - Format code with Prettier (required before commits)

### Testing

-   Tests use **Vitest** and React Testing Library
-   Test files are in `src/tests/` directory
-   Run single test: `npm test -- filename.test.jsx`

### Code Quality

-   **ESLint**: Uses flat config with React plugin, most rules set to 'warn'
-   **Prettier**: Tab width 4, single quotes, trailing commas, 100 char line width
-   Always run `npm run format` before committing

## Architecture Overview

### Tech Stack

-   **React 18** with Vite build system
-   **React Router** v6 for routing
-   **Apollo Client** for GraphQL API calls
-   **Ant Design** for UI components
-   **SCSS** for styling

### Key Architecture Patterns

-   **Context-based State Management**: Multiple context providers handle different app domains (Calendar, Chat, Templates, etc.)
-   **Dynamic Route Loading**: Routes are lazy-loaded based on workspace mode (stable/beta/internal/suspended)
-   **Multi-tenant Architecture**: Workspace-specific configurations and routing
-   **GraphQL Integration**: Apollo Client with error handling and caching disabled by default

### Project Structure

-   `src/context/` - React Context providers for state management
-   `src/hooks/` - Custom React hooks (useAuth, useChatStream, useWorkspaceMode, etc.)
-   `src/services/` - API and GraphQL service layer with dev/production configs
-   `src/routes/` - Route definitions split by workspace mode
-   `src/views/` - React components organized by feature
-   `builderSrc/` - Separate builder application with its own components

### Workspace Modes

The app supports different workspace modes that determine available features:

-   `stable` - Production features
-   `beta` - Beta features for testing
-   `internal` - Internal company features
-   `suspended` - Suspended workspace state
-   Public routes available without workspace context

### State Management

Uses React Context pattern with individual providers for each domain, combined via `useCombineState` hook. State actions follow Redux-like pattern with action types and reducers.
