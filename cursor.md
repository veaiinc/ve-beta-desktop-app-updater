🧑‍💻 Expert SwiftUI <-> ElectronJS Integration Developer Prompt
Context
I am integrating a SwiftUI application (forked from the open-source notchdrop repo) with a modern Electron JS desktop app, aiming for seamless interoperability—similar to what NotchNook provides. My current approach involves building a native Node.js module from the SwiftUI code, leveraging an Objective-C bridge to link JavaScript and Swift.
My goal: bridge features of the native macOS app (SwiftUI) into the Electron framework, allowing JS and native code to communicate directly.

This is a complex, AI-assisted engineering task. The workflow should leverage AI, web research, top-level planning, and documentation at every step.

🚀 Workflow

1. Research Phase
   Google:

Query for relevant keywords about SwiftUI-Electron integration, Node native addons with Swift, Objective-C bridges for Electron, and similar “open-source” or “tutorial” posts.

Reddit:

Search for real-world dev experiences on r/electronjs, r/macapps, r/swift, r/node, r/reactjs, and r/programming. Look for architecture discussions, integration pitfalls, and “anyone tried this?” posts.

Documentation:

Read and reference Apple’s and Electron’s official docs (Node Addons, Objective-C bridging, Electron Native Modules, GitHub repo docs for NotchDrop, NotchNook).

Other Tools:

Explore Stack Overflow, GitHub Issues, Medium, Dev.to, and any relevant technical forums.

Quickly summarize all research findings as markdown notes, linking key resources.

2. Implementation Phase
   2.1 Planning
   Draft a high-level breakdown:

List each module/component

Define responsibilities (e.g., “SwiftUI: handles macOS UI & system APIs”, “Node Native Addon: bridges Swift/Objective-C to JS”, “Electron: hosts JS frontend”, etc.)

Identify technical risks/unknowns—list them with research links or documentation pointers.

2.2 During Implementation
If any code confusion arises, check:

Official documentation first (Apple, Electron, Node APIs)

Your summarized research notes or Google for clarifications

If still blocked, raise a detailed question to AI or, if needed, to the user with context

Update the implementation plan continuously as you discover obstacles or new requirements.

Document:

Steps taken

Key decisions and their rationale

Any workarounds, limitations, or “gotchas” encountered

2.3 Code Standards
Use lucide-react icons by default for UI components/icons in the Electron frontend.
If not available, generate custom SVGs and import as ReactComponent.

Write clean, modular, and well-commented code supporting future handover.

2.4 Handover-Ready Updates
After completing each task, append clear, detailed markdown notes:

What changed

Why

What’s next

Any tasks blocked and pointers for next engineer

This ensures anyone joining later can immediately pick up where you left off.

🛠️ Integration Plan [AI/Engineer Workflow]
Set up Node Native Addon

Scaffold with N-API, build initial Swift/Objective-C bridge

Bridge SwiftUI

Expose required SwiftUI APIs to Objective-C

Map Objective-C to Node bindings

Connect to Electron

Confirm Electron main process can call into Native Addon, receive callbacks/events

UI/UX Integration

Build React-layer Electron components, use lucide-react or custom SVGs as icons throughout

Test end-to-end

Ensure bi-directional communication flows as designed

Document

Write a README section for every completed milestone and decision

🧑‍🔬 Research to start with
“Electron native modules with Swift code”

“Objective-C bridge between Swift and JS (Node/Electron)”

“Open source projects: NotchDrop, NotchNook, Electron Swift integration”

“lucide-react alternatives/custom SVG usage in React/Electron”

“Best patterns for seamless app handover and documentation”

🤝 How to Collaborate with AI
When blocked or facing technical ambiguity, describe the confusion in detail for targeted help.

Use AI for:

Tokenizing research findings/trends from the web

Summarizing difficult documentation

Drafting, scaffolding, and reviewing interoperable code

Brainstorming alternative strategies/stack choices if stuck

🔗 Quick Reference
[NotchDrop GitHub](repo URL)

Electron Native Modules Docs

N-API Docs

Apple Developer Docs

lucide-react: lucide.dev
