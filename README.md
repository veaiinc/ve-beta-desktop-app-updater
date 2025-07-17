# Ve AI Dashboard

Your living intelligence remembers everything, sees what you see, figures out your goals, and doesn’t stop until they're done.

## Table of Contents

-   [Overview](#overview)
-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Getting Started](#getting-started)
-   [Development](#development)
-   [Building for Production](#building-for-production)
-   [Testing](#testing)
-   [Contributing](#contributing)
-   [License](#license)

---

## Overview

**Ve AI Dashboard** is a cross-platform desktop application that acts as your intelligent assistant. It leverages advanced AI, automation, and integrations to help you remember, organize, and accomplish your goals efficiently. The app is built with Electron, React, and Vite, providing a fast and modern user experience.

## Features

-   AI-powered personal assistant
-   Task and calendar management
-   Document editing and preview
-   Real-time chat and collaboration
-   Integrations with popular services
-   Customizable themes and layouts
-   Offline-first desktop experience
-   Secure authentication and user management

## Tech Stack

-   **Electron**: Desktop app framework
-   **React**: UI library
-   **Vite**: Fast build tool
-   **Apollo Client & GraphQL**: Data management
-   **Ant Design (antd)**: UI components
-   **Sass**: Styling
-   **Vitest**: Testing

## Getting Started

### Prerequisites

-   **Node.js** (v18+ recommended)
-   **npm** (v9+ recommended)
-   **Git**

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ve-dashboard-v1.git
    cd ve-dashboard-v1
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```

### Running the App (Development)

-   **Start the development server:**
    ```bash
    npm run dev
    ```
-   **Start Electron:**
    In a separate terminal, run:
    ```bash
    npm start
    ```
    This will launch the Electron app using the local Vite server.

## Development

### Useful Scripts

-   `npm run dev` — Start Vite dev server
-   `npm start` — Start Electron with the current build
-   `npm run build` — Build the app for production
-   `npm run package` — Build and package the Electron app
-   `npm run test` — Run tests with Vitest
-   `npm run format` — Format code with Prettier
-   `npm run clean:build` — Clean build artifacts

### Directory Structure

-   `src/` — Main source code (React, context, hooks, views)
-   `builderSrc/` — Additional builder-related source code
-   `electron/` — Electron main and preload scripts
-   `public/` — Static assets

## Building for Production

To build and package the app for your OS:

-   **macOS:**
    ```bash
    npm run package:mac
    ```
-   **Windows:**
    ```bash
    npm run package:win
    ```
-   The packaged app will be in the `dist/` directory.

## Testing

-   **Run all tests:**
    ```bash
    npm run test
    ```
-   **Watch mode:**
    ```bash
    npm run test:watch
    ```
-   **Test UI:**
    ```bash
    npm run test:ui
    ```
-   **Coverage report:**
    ```bash
    npm run test:coverage
    ```

## Contributing

Contributions are welcome! Please open issues or pull requests for any improvements or bug fixes.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

This project is © Ve AI. All rights reserved. (Add license details here if applicable)
