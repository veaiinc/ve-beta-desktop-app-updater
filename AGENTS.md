# AGENTS.md

**Owner**: Codex CLI assistant

---

## Purpose

-   **Working playbook for Electron.js and SwiftUI tasks in this repo.**
-   Covers run/build, where to change code, IPC patterns, native addon (Swift/ObjC/Node‑API) integration, NotchDrop, troubleshooting, checklists, commands, and debugging tips.
-   All instructions here apply to agents (Codex, Claude, Cursor, etc) and human contributors alike.

---

## Quick Start

-   **Install dependencies**:  
    `npm install`
-   **Build native addon (macOS)**:  
    `cd notchdrop-addon && npm run build`  
    Alt: `cd notchdrop-addon && sh build.sh`
-   **Development run**:
    -   Terminal A: `npm run dev` (builds NotchDrop native+UI, starts Vite, outputs `dist-electron/`)
-   **Windows dev variants**:  
    `npm run dev:win`, `npm run dev:win:no-clean`
-   **If the addon fails to load (preferred fix):**  
    `cd notchdrop-addon && sh build.sh`  
    If it still fails, rebuild for the current Electron ABI:  
    `npm run rebuild:native:mac` (wraps `electron-rebuild -f -w notchdrop-addon`)
-   **Package Release Build**:  
    `npm run package:mac` | `npm run package:win` | `npm run package:linux`
-   **Clean build artifacts**:  
    `npm run clean:build`
-   **Build NotchDrop only**:  
    `cd notchdrop-addon && sh build.sh`

---

## Repo Map (Change source code only in these)

-   **Electron Main & Preload**
    -   `electron/main.js`
    -   `electron/preload.js`
    -   `electron/helpers/windowHelper.js`
    -   `electron/notificationHelper.js`
    -   `electron/windowsCompatibility.js`
    -   `electron/services/notchDropService.js`
-   **HTML Entrypoints (Vite):**
    -   `index.html`, `overlay.html`, `askAI.html`, `dynamic-island.html`, `areYouThere.html`
-   **Swift/Native addon (SwiftUI + ObjC + Node‑API):**
    -   `notchdrop-addon/` (see README + docs inside)
        -   Node wrapper: `notchdrop-addon/index.js`
        -   Swift–JS bridge: `notchdrop-addon/swift-js-bridge.js`
        -   Native sources: `notchdrop-addon/src/` (e.g., `NotchContentView.swift`, `NotchDropCore.swift`, `notchdrop_addon.mm`, `NotchDropBridge.m`)
        -   Obj-C header: `notchdrop-addon/include/NotchDropBridge.h`
-   **React Dynamic Island (UI):**
    -   `src/notch/components/DynamicIslandUI.jsx`
-   **Reference docs:**
    -   `CLAUDE.md`, `cursor.md`, `swift-watcher.config.js`

---

## How Everything Communicates (IPC/Event Map)

### Electron ↔ Renderer

-   **Preload**: exposes `window.electronApi` for secure IPC to renderer (`electron/preload.js`)
-   **Main process**: registers handlers (`electron/main.js`)
-   **IPC Channels (non-exhaustive):**
    -   Overlay controls: `overlay-start-recording`, `overlay-stop-recording`, `overlay-pause-recording`, `overlay-resume-recording`, `overlay-toggle-live-intelligence`, `overlay-get-recording-state`, `overlay-state-update`, `overlay-command`, `hide-overlay-window`
    -   Dynamic Island: `dynamic-island-expand`, `dynamic-island-collapse`, `dynamic-island-toggle`, `dynamic-island-show|hide|focus`, `dynamic-island-chat-mode`, `dynamic-island-set-mouse-events`, `dynamic-island-voice-connect|disconnect|status`, `dynamic-island-state`, `overlay-state-changed`
    -   Ask AI window: `toggle-askAI-window`, `show-askAI-window`, `is-askAI-window-visible`, `update-askAI-dimensions`, `set-askAI-ignore-mouse-events`, `set-askAI-input-focus`, `get-askAI-input-focus`, `send-chat-message-to-askai`, `force-open-askai-window`
    -   NotchDrop: `notchdrop-enable|disable|toggle`, `notchdrop-is-visible`, `notchdrop-set-status`, `notchdrop-get-status`, `notchdrop-handle-files`, `notchdrop-set-auto-open|get-auto-open`, `notchdrop-set-haptic-feedback|get-haptic-feedback`, `update-notchdrop-menu`, `notchdrop-open-airdrop|open-share|open-file|delete-file`, `notchdrop:triggerOverlay*`
    -   Swift bridge: `swift:action`, `swift:triggerOverlayRecording`, `swift:triggerOverlayToggleLiveIntelligence`, process events `swift-ui-trigger-overlay-recording*`, `pre-create-overlay-window`
    -   Are You There: `are-you-there-continue-meeting|auto-continue-meeting|stop-meeting|pause-meeting-intelligence|end-session`, plus transcription detection `update-transcription-activity`, `are-you-there-continue-transcription|stop-transcription-monitoring|pause-transcription-monitoring|end-transcription-session`, `get-transcription-detection-state`
    -   System/permissions/utilities: `check-microphone-permission`, `request-microphone-permission`, `check-camera-permission`, `request-camera-permission`, `show-camera-permission-help`, `check-screen-recording-permission`, `request-screen-recording-permission`, `desktop:capture-screen`, `clipboard-write-text|read-text`, `open-dev-tools`
    -   Auto-updater: `check-for-updates`, `download-update`, `force-download-update` with event `update-status`

### NotchDrop (Native Addon) Events

Emitted from native layer, handled by `electron/services/notchDropService.js`:

-   `statusChanged`
-   `fileDropped`
-   `itemAdded`
-   `itemRemoved`
-   `swiftAction` (always wire to `handleSwiftAction`)
-   `swiftLog` (forwarded to Electron logs/UI)
-   `requestOverlayRecording` (triggers overlay recording)
-   `submitChat` (Ask AI chat payload)

---

## Native Module / macOS Integration

### Objective

Integrate **NotchDrop** (Swift/SwiftUI) as an optional native module for macOS. Uses an Objective-C++ bridge (Node.js NAPI). Platform-safe: macOS loads NotchDrop, Windows/Linux skip gracefully.

### Directory Structure

notchdrop-addon/
├─ binding.gyp
├─ include/NotchDropBridge.h
├─ index.js
├─ package.json
└─ src/
├─ NotchContentView.swift
├─ NotchDropCore.swift
├─ NotchDropBridge.m
└─ notchdrop_addon.mm

### Building & Tooling

-   Only loaded via `process.platform === 'darwin'`
    -   Build native:  
        `cd notchdrop-addon && npm run build` (or `sh build.sh`)
-   Add-on package.json scripts:
    -   `build`: `node-gyp rebuild`
    -   `clean`: `rimraf build dist`
-   **Dev script**:  
    `npm run dev:swift` (Vite + Swift watcher) or root: `npm run build:notchdrop:all`
-   Always guard NotchDrop requires in code so CI never fails on Windows/Linux.

### API & Usage Example

// In Electron main, use the service wrapper
const NotchDropService = require('./electron/services/notchDropService');
let notchDropService;
if (process.platform === 'darwin') {
notchDropService = new NotchDropService();
notchDropService.setMainWindow(mainWindow);
await notchDropService.initialize();
// Then control via IPC: 'notchdrop-enable|disable|toggle', etc.
}

Note: See the NotchDrop events list above for emitted events from the native layer; always update that list as integration evolves.

### Bridging

-   **Swift**: Expose classes/methods as `@objc`, declare in headers.
-   **Objective-C**: Wraps and exposes Swift to Node.js via `node-addon-api`.
-   **Node.js Addon**: Exposes event-based API, only loaded on macOS in Electron main.

---

## Plan & Review

-   For large/new features:
    -   Write a detailed plan in `./claude/tasks/TASK_NAME.md` (create folder if missing), including technical breakdown and MVP focus.
    -   Always ask for review/approval before implementation.
    -   Update the plan as you progress, append a change log as you go.
    -   Reference any external research or package docs.

---

## Frequent Dev Tasks (Checklists)

1. **Add new renderer→main IPC**

    - Preload: add under `electronApi.overlay`/`askAI` in `preload.js`
    - Main: add `ipcMain.handle('<channel>', ...)` in `main.js`
    - Renderer: listen for overlay-command
    - Devtools: F12/Ctrl+F12

2. **Add new Swift→Electron action**

    - JS bridge: add handler in `notchdrop-addon/index.js` + `swift-js-bridge.js`
    - Electron: ensure `notchDropService.js` `handleSwiftAction` is updated
    - Main: add `ipcMain.handle('swift:yourAction', ...)` if needed
    - Test: open Swift UI, trigger, confirm overlay receives overlay-command

3. **Modify overlay window/state sync**

    - All window helpers: `windowHelper.js`
    - Emit/observe: `overlay-state-changed`

4. **Wire new Dynamic Island control**

    - Add handlers in `DynamicIslandUI.jsx`, use `electronApi.overlay.*`
    - Add/modify IPC in preload/main if needed

5. **Update auto-updater or UI**
    - Use core update channels in `main.js`
    - Listen in frontend via `electronApi.onUpdateStatus`

---

## SwiftUI / Native Addon Details

-   Build (macOS):  
    `cd notchdrop-addon && npm install && npm run build` or `sh build.sh`
-   Addon fails to load or ABI mismatch?  
    `cd notchdrop-addon && sh build.sh`  
    If needed, then: `npx electron-rebuild -f -w notchdrop-addon`
-   Ensure add-on is unpacked in Electron ASAR. See `package.json > build.mac.asarUnpack` and `extraResources` entries for `notchdrop-addon/**`.
-   Exposed events: `statusChanged`, `fileDropped`, `itemAdded`, `itemRemoved`, `swiftAction`
-   Extend Swift actions: add in bridge, wire through Electron, update docs here.

---

## Permissions & Platform Notes

-   **macOS**:
    -   Global shortcuts require Accessibility permissions.
    -   Microphone/camera/screen: always ask, handlers in main (`check-microphone-permission` etc.)
    -   Hardened runtime: `entitlements/entitlements.mac.plist`.
-   **Windows**:
    -   Tray & minimize: `main.js`
    -   Overlay/y-offset/positioning: handled in helpers
    -   Checksum mismatch: UI prompts manual download

---

## Logging & Debugging

-   Logging:  
    Uses `electron-log` across main, helpers, services.
-   Devtools:  
    `electronApi.openDevTools({ targetWindow, mode: 'detach' })` or F12/Ctrl+F12
-   Native add-on fails?  
    First: `cd notchdrop-addon && sh build.sh`  
    Then: `npx electron-rebuild -f -w notchdrop-addon` (if needed).  
    Also check ASAR unpack config.

---

## Build & Packaging

-   **Builds**
    -   Vite → `build/`
    -   Electron → `dist-electron/` (`vite-plugin-electron`)
    -   Native modules via `node-gyp`, `electron-rebuild`
-   **electron-builder**:  
    Config in `package.json` for mac, win, linux
-   **ASAR**:  
    `asarUnpack` must include native binaries
-   **Hardened runtime**:  
    macOS requires proper signing/entitlement

---

## Coding Style & Conventions

-   Prettier:
    -   print width: 100
    -   tab width: 4 spaces (tabs)
    -   trailing commas: always
    -   semicolons: required
    -   quotes: single
    -   run `npm run format` before any commit
-   JS/SCSS/Component naming:
    -   Components: PascalCase
    -   Hooks: camelCase (with `use`)
    -   Context files: camelCase
    -   SCSS: kebab-case
-   Use only `electronApi` (preload) for renderer IPC, never direct `ipcRenderer`

---

## Planning for Agents

-   One task at a time, surgical code changes.
-   Provide minimal, targeted logging for observability.
-   Update this file with all new IPC events/features.

## Agent Expertise & Available Skills

As your AI assistant, I have specialized knowledge and capabilities across the following areas:

### Swift & Native Development

-   **SwiftUI**: Complex UI development with state management, view composition, animations, and Swift-specific patterns
-   **Swift-Objective-C Bridging**: Seamless interoperability between Swift and Objective-C codebases, including `@objc` declarations and bridging headers
-   **Cocoa/AppKit**: macOS-specific APIs, window management, screen handling, event monitoring, and system integration
-   **Node-API/N-API**: Native addon development for Node.js using both C++ and Objective-C++ bridges
-   **Swift Package Manager & Build Systems**: Package management, build configuration, and dependency resolution

### Electron & Cross-Platform Desktop

-   **Electron Architecture**: Main/renderer process patterns, IPC communication, security best practices, and native integration
-   **IPC Communication**: Complex inter-process communication patterns, event handling, and asynchronous message passing
-   **Desktop Integration**: System tray, global shortcuts, window management, auto-updater, and platform-specific features
-   **Security & Sandboxing**: Code signing, entitlements, hardened runtime, and security best practices

### Frontend Development

-   **React Ecosystem**: Modern React patterns, hooks, context API, state management, and component architecture
-   **JavaScript/TypeScript**: ES6+, async/await, module systems, and type-safe development
-   **Build Tools**: Vite, Webpack, bundling strategies, and development workflow optimization
-   **UI/UX**: Responsive design, component libraries (Ant Design), animations, and accessibility

### Architecture & Integration

-   **Bridge Patterns**: Complex communication bridges between different runtimes (Swift ↔ JavaScript ↔ Electron)
-   **Event-Driven Architecture**: Publisher/subscriber patterns, event emitters, and reactive programming
-   **Cross-Platform Development**: Platform abstraction, feature detection, and graceful degradation
-   **Performance Optimization**: Memory management, rendering optimization, and resource efficiency

### NotchDrop Specific Expertise

Based on the codebase analysis, I have deep understanding of:

-   **Dynamic Island UI**: SwiftUI implementation of macOS notch integration with custom window management
-   **Native Addon Architecture**: Node.js native module with Swift/Objective-C++ bridge using NotchDropBridge pattern
-   **Screen & Window Management**: Multi-screen detection, notch size calculation, and window positioning algorithms
-   **IPC Event System**: Complex event routing between Swift UI, Node.js addon, and Electron main/renderer processes
-   **State Management**: `NotchViewModel` with Combine publishers, authentication states, and UI mode transitions
-   **Recording & Chat Integration**: Integration with overlay recording system and AI chat functionality

### Development Workflow

-   **Version Control**: Git workflows, branch management, and collaborative development practices
-   **Testing & QA**: Unit testing, integration testing, and debugging across multiple runtimes
-   **Documentation**: Technical writing, API documentation, and developer experience optimization
-   **Project Planning**: Task breakdown, architectural decisions, and MVP development strategies

I'm equipped to handle complex multi-language, multi-platform development tasks that span Swift, Objective-C, JavaScript, TypeScript, React, and Electron ecosystems. I can architect solutions, debug integration issues, implement new features, and provide guidance on best practices across all these technologies.

---

## NotchDrop Integration Checklist

-   [ ] Native module loads only on macOS, code guarded
-   [ ] All native (SwiftUI) events mapped to JS and documented
-   [ ] No CI/build breakage on Windows/Linux
-   [ ] TypeScript interfaces exist for all APIs
-   [ ] Pull Requests: note architecture/test status before review

---

## Handy File References

-   electron/main.js
-   electron/preload.js
-   electron/helpers/windowHelper.js
-   electron/services/notchDropService.js
-   src/notch/components/DynamicIslandUI.jsx
-   notchdrop-addon/index.js
-   notchdrop-addon/swift-js-bridge.js
-   vite.config.js
-   package.json

---

## Troubleshooting Snippets

-   **Addon fails to load:**  
    `cd notchdrop-addon && sh build.sh`  
    If it still fails: `npx electron-rebuild -f -w notchdrop-addon`  
    Confirm `asarUnpack` includes native binary; verify it’s bundled.
-   **Global shortcuts not working (macOS):**  
    Grant Accessibility permissions, check main logs.
-   **Update errors/checksum mismatch (Windows):**  
    Prompt manual download; already handled in main/UI.

---

## Further Reading (in-repo)

-   `CLAUDE.md`
-   `cursor.md`
-   `swift-watcher.config.js`
-   `builderSrc/` scripts

---

**NEVER edit or add files in build/ or dist-electron/ directories. Source code changes only in files/directories listed above!**
