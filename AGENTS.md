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
-   **Development run**:
    -   Terminal A: `npm run dev` (Vite + builds `dist-electron/`)
    -   Terminal B: `npm start` (Electron main)
-   **Windows dev variants**:  
    `npm run dev:win`, `npm run dev:win:no-clean`
-   **If the addon fails to load (preferred fix):**  
    `cd notchdrop-addon && sh build.sh`  
    If it still fails, try rebuilding for the current Electron ABI:  
    `npx electron-rebuild -f -w notchdrop-addon`
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
    -   `electron/services/notchDropService.js`
-   **HTML Entrypoints (Vite):**
    -   `index.html`, `overlay.html`, `askAI.html`, `dynamic-island.html`
-   **Swift/Native addon (SwiftUI + ObjC + Node‑API):**
    -   `notchdrop-addon/` (see README + docs inside)
        -   Node wrapper: `notchdrop-addon/index.js`
        -   Swift–JS bridge: `notchdrop-addon/swift-js-bridge.js`
-   **React Dynamic Island (UI):**
    -   `src/notch/components/DynamicIslandUI.jsx`
-   **Reference docs:**
    -   `codex/notchdrop-electron-integration.md`

---

## How Everything Communicates (IPC/Event Map)

### Electron ↔ Renderer

-   **Preload**: exposes `window.electronApi` for secure IPC to renderer (`electron/preload.js`)
-   **Main process**: registers handlers (`electron/main.js`)
-   **IPC Channels (non-exhaustive):**
    -   `overlay-start-recording`, `overlay-stop-recording`, `overlay-pause-recording`, `overlay-resume-recording`, `overlay-toggle-live-intelligence`, `overlay-get-recording-state`
    -   `dynamic-island-expand`, `dynamic-island-collapse`, `dynamic-island-chat-mode`, `dynamic-island-state`, `overlay-state-changed`
    -   `notchdrop-enable|disable|toggle|...`, `notchdrop-open-airdrop`, `notchdrop-open-share`, `update-notchdrop-menu`
    -   `swift:action`, `swift-ui-trigger-overlay-recording`, `pre-create-overlay-window`
    -   OS permissions utilities: `check-microphone-permission`, `check-camera-permission`, `desktop:capture-screen`, `open-dev-tools`

### NotchDrop (Native Addon) Events

Emitted from native layer, handled by `electron/services/notchDropService.js`:

-   `statusChanged`
-   `fileDropped`
-   `itemAdded`
-   `itemRemoved`
-   `swiftAction` (always wire to `handleSwiftAction`)

---

## Native Module / macOS Integration

### Objective

Integrate **NotchDrop** (Swift/SwiftUI) as an optional native module for macOS. Uses an Objective-C++ bridge (Node.js NAPI). Platform-safe: macOS loads NotchDrop, Windows/Linux skip gracefully.

### Directory Structure

notchdrop-addon/
├─ binding.gyp
├─ include/NotchDropBridge.h
├─ js/index.js
├─ package.json
└─ src/
├─ NotchDrop.swift
├─ NotchDropBridge.m
└─ notchdrop_addon.mm

### Building & Tooling

-   Only loaded via `process.platform === 'darwin'`
-   Build for Electron ABI:  
    `cd notchdrop-addon && npm run build-electron`
-   Add-on package.json scripts:
    -   `build`: `node-gyp configure && node-gyp build`
    -   `build-electron`: `electron-rebuild`
    -   `clean`: `rimraf build`
-   **Dev script**:  
    `npm run build:notchdrop`
-   Always guard NotchDrop requires in code so CI never fails on Windows/Linux.

### API & Usage Example

const notchdrop = require('notchdrop-addon');
if (process.platform === 'darwin') {
notchdrop.on('notchdropComplete', (result) => { /_ handle result _/ });
notchdrop.launchNotchDropUI();
}

**Events:**

-   `notchdropComplete`, plus others forwarded via bridge.
-   ALWAYS add new events & signatures here as integration evolves.

**TypeScript**:  
Define types/interfaces for every API.

### Bridging

-   **Swift**: Expose classes/methods as `@objc`, declare in headers.
-   **Objective-C**: Wraps and exposes Swift to Node.js via `node-addon-api`.
-   **Node.js Addon**: Exposes event-based API, only loaded on macOS in Electron main.

---

## Plan & Review

-   For large/new features:
    -   Write a detailed plan in `./claude/tasks/TASK_NAME.md`, including technical breakdown and MVP focus.
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
    `cd notchdrop-addon && npm install && npm run build`
-   Addon fails to load or ABI mismatch?  
    `cd notchdrop-addon && sh build.sh`  
    If needed, then: `npx electron-rebuild -f -w notchdrop-addon`
-   Ensure add-on is unpacked in Electron ASAR.
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
-   Use `lucide-react` icons; if not present, create SVG and import as ReactComponent.

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

-   `codex/notchdrop-electron-integration.md`
-   `SWIFT_UI_OVERLAY_INTEGRATION.md`
-   `SWIFT_UI_START_BUTTON_FIX.md`
-   `WEBSOCKET_DEBUG_GUIDE.md`
-   `WINDOWS_SETUP.md`

---

**NEVER edit or add files in build/ or dist-electron/ directories. Source code changes only in files/directories listed above!**
