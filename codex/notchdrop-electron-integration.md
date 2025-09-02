# NotchDrop ⇄ Electron Integration Notes (Codex)

Owner: Codex CLI assistant

Goals

- Integrate the SwiftUI-based NotchDrop UI with the Electron app via an Objective‑C/Node-API bridge.
- Ensure low-latency, reliable command routing between Swift and Electron overlay (start/pause/resume/stop recording, toggle live intelligence, state sync).
- Package for macOS with hardened runtime, proper entitlements, and stable native module loading.

Repo Inventory (relevant to integration)

- Electron app entry and services
  - electron/main.js — main process wiring, IPC, window lifecycle
  - electron/helpers/windowHelper.js — overlay + Ask AI windows, global shortcuts
  - electron/services/notchDropService.js — orchestrates the native addon and Swift-JS bridge
  - electron/preload.js — contextBridge IPC exposure to renderer
  - vite.config.js — vite-plugin-electron build targets for main/preload and HTML entries
  - dist-electron/** — built artifacts consumed at runtime (mirrors electron/** sources)

- Native addon (Swift + ObjC + Node-API)
  - notchdrop-addon/binding.gyp — node-gyp target, Swift compile action, headers/flags
  - notchdrop-addon/src/*.swift — NotchDropCore, view models, SwiftUI views
  - notchdrop-addon/src/NotchDropBridge.m — ObjC bridge exposing Swift API
  - notchdrop-addon/src/notchdrop_addon.mm — Node-API wrapper (C++) emitting events to JS
  - notchdrop-addon/include/NotchDropBridge.h — exposed ObjC API
  - notchdrop-addon/index.js — JS wrapper with event emitter + overlay helpers
  - notchdrop-addon/swift-js-bridge.js — auxiliary bridge for Swift actions → JS UI/overlay
  - notchdrop-addon/preload.js — exposes notchdrop/overlay APIs to renderer
  - notchdrop-addon/package.json — scripts for building with node-gyp (no install hook yet)

- Demos/References
  - electron-native-code-demos/packages/swift/**
  - electron-native-code-demos/packages/objective-c/**

- Packaging/Config
  - package.json — electron-builder config, dependencies, scripts
  - entitlements/entitlements.mac.plist — hardened runtime entitlements (may need adjusting)

Current Wiring Overview

- SwiftUI emits actions via NotchViewModel.SwiftAction → NotchDropCore.swift calls swiftActionCallback(action,data)
- ObjC bridge NotchDropBridge forwards callbacks
- Node-API layer notchdrop_addon.mm registers a threadsafe function and emits JS events:
  - statusChanged, fileDropped, itemAdded, itemRemoved, swiftAction
- JS wrapper notchdrop-addon/index.js handles swiftAction and routes to overlay via IPC or direct window webContents.send, with immediate-mode fallbacks for first-click responsiveness.
- Electron NotchDropService (electron/services/notchDropService.js) owns addon lifecycle, pre-warms Swift-JS bridge, pre-creates overlay, and proxies actions via IPC to main/windowHelper.
- Main process (electron/main.js) registers swift:action, overlay-* handlers, and coordinates with WindowHelper to create/show/focus overlay and send overlay-command to the renderer.

Developer Workflow (local)

1) Prereqs (macOS only for Swift build)
   - Xcode + Command Line Tools
   - Python 3 (for node-gyp), make/clang (via Xcode CLT)
   - Node.js matching Electron ABI (Electron 37.x → Node 20.x runtime; using Node-API via node-addon-api mitigates ABI churn, but still rebuild per Electron version)
   - node-gyp and (optionally) electron-rebuild

2) Install & build
   - Root install: npm install
   - Build native addon (until we add an install hook):
     - cd notchdrop-addon && npm run build
     - Optional per-Electron rebuild: npx electron-rebuild -f -w notchdrop-addon

3) Dev run
   - Terminal A: npm run dev (Vite dev server + vite-plugin-electron builds dist-electron)
   - Terminal B (after vite starts): npm start (electron .)
   - Open overlay via shortcuts (Cmd+/), Ask AI (Cmd+Enter), or menu (NotchDrop → Open)

4) Packaging sanity
   - npm run package:mac
   - Verify .node is present in app bundle and loads under hardened runtime

Architecture Notes & Key Files

- NotchDrop Swift core
  - notchdrop-addon/src/NotchDropCore.swift — window create/show, state, SwiftAction → callback
  - notchdrop-addon/src/NotchViewModel(+Events).swift — UI events and publishers

- ObjC bridge
  - notchdrop-addon/include/NotchDropBridge.h and src/NotchDropBridge.m — ObjC API mapping to Swift methods and callbacks, including setSwiftActionCallback

- Node-API addon
  - notchdrop-addon/src/notchdrop_addon.mm — wraps NotchDropBridge to JS, creates TSFN for callbacks, exposes methods (initialize/show/hide/toggle/…/on)

- JS wrapper (action routing + immediacy)
  - notchdrop-addon/index.js — immediate-mode action handling, IPC bridges, overlay triggers, event emitter
  - notchdrop-addon/swift-js-bridge.js — maps Swift actions to UI controls and overlay IPC channels

- Electron side
  - electron/services/notchDropService.js — initializes addon + bridge, pre-creates overlay, exposes helpers
  - electron/helpers/windowHelper.js — overlay window lifecycle, global shortcuts, overlay-command channel
  - electron/main.js — IPC handlers (swift:action, overlay-*), ties windowHelper + service

Build & Packaging Considerations (macOS)

- Hardened Runtime
  - entitlements/entitlements.mac.plist currently enables JIT/unsigned executable memory for Electron.
  - Likely need to add com.apple.security.cs.disable-library-validation to allow loading .node native modules and Swift static lib under hardened runtime, unless everything is signed with the same Team ID.
  - Verify: codesign -dv --verbose=4 <App.app> and spctl --assess diagnostics.

- Electron Builder
  - package.json build.files includes node_modules/** but requires NotchDrop to be present under node_modules at pack time.
  - Current code loads addon via relative path: dist-electron/services/notchDropService.js → ../../notchdrop-addon/index.js.
  - Risk: when packaged, relative path may not exist. Prefer require('notchdrop-addon') and ensure file: dependency installs into node_modules with prebuilt binary.
  - asar/asarUnpack: ensure the .node binary is either unpacked or loaded from a path that supports native loading. Consider adding notchdrop-addon/build/Release/*.node to asarUnpack.

- Rebuild
  - Add an install/postinstall that runs node-gyp rebuild (and/or electron-rebuild) for notchdrop-addon to match Electron’s runtime.
  - Demo packages use electron-rebuild; mirror that approach here for stability.

Testing & Debugging

- Global shortcuts
  - Cmd+/ toggles overlay; Cmd+\ toggles overlay; Cmd+Enter toggles Ask AI.
  - Check logs in main process; use test-shortcuts.js for checklist.

- Overlay link
  - From Swift: start/pause/resume/stopRecording and toggleLiveIntelligence should reach windowHelper and emit overlay-command to renderer.
  - Verify IPC channels: overlay-start-recording, overlay-stop-recording, overlay-toggle-live-intelligence, overlay-command.

- Swift → JS callback path
  - Trigger SwiftAction (e.g., sendLog, startRecording) and watch for swiftAction in notchdrop-addon JS wrapper, then downstream effects.

- Ready/Immediate path
  - Pre-create overlay (windowHelper.preCreateOverlayWindow())
  - NotchDropService.preWarmBridge() and ensureSwiftJSBridgeReady()
  - Wrapper’s immediate-mode executeImmediately() to remove first-click latency.

Open Risks / TODOs

- Packaging pathing
  - Switch to require('notchdrop-addon') in electron/services/notchDropService.js. Confirm node_modules inclusion in packaged app. Add asarUnpack entry for the .node binary if needed.

- Build-on-install
  - notchdrop-addon lacks an "install" or "postinstall" script. Add to auto-build native addon on root npm install. Optionally integrate electron-rebuild postinstall for correct ABI.

- Entitlements
  - Consider adding com.apple.security.cs.disable-library-validation. Validate app launch and native module loading under hardened runtime and notarization.

- Codesigning
  - Ensure native addon and bundled Swift static lib are signed with correct identity when packaging. electron-builder’s signing pipeline may need extra configuration.

- API surface
  - Stabilize IPC channels and action names; document overlay-command payloads for Swift parity.

- Telemetry/logging
  - Standardize logging for Swift → JS → overlay path; optionally funnel into a single logger with tags [Swift] [Bridge] [Overlay].

Quick Reference: Commands

- Dev build and run
  - npm install
  - (one-time) cd notchdrop-addon && npm run build
  - npm run dev  (vite)
  - npm start    (electron .)

- Rebuild native modules for current Electron
  - npx electron-rebuild -f -w notchdrop-addon

- Package (mac)
  - npm run package:mac

Research Backlog (links to consult)

- Node-API (N-API) stability and usage
  - https://nodejs.org/api/n-api.html
  - https://github.com/nodejs/node-addon-api

- Electron native modules & packaging
  - https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules
  - https://github.com/electron/electron-rebuild
  - https://www.electron.build/

- macOS hardened runtime & entitlements
  - https://developer.apple.com/documentation/security/hardened_runtime
  - https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_security_cs_disable-library-validation

- Swift <-> ObjC bridging
  - https://developer.apple.com/documentation/swift/importing-objective-c-into-swift
  - https://developer.apple.com/documentation/swift/importing-swift-into-objective-c

Next Actions (for future tasks)

- Update NotchDropService to require('notchdrop-addon') and adjust packaging config (asarUnpack) to include native module.
- Add notchdrop-addon postinstall to build/rebuild for Electron (node-gyp/electron-rebuild).
- Add packaging-time validation: script to assert addon binary presence at runtime path.
- Add e2e test harness: simulate SwiftAction → verify overlay-command received in renderer.
- Validate hardened runtime/notarization flow with native module loading.

Notes

- The repo includes both electron/ (source) and dist-electron/ (built); use electron/ for edits and keep dist-electron as build output.
- The current integration already includes immediate-mode fallbacks to minimize first-click latency; keep that invariant in future changes.

