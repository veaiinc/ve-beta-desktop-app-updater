#!/bin/bash

# Test and Build Script for Swift UI → Overlay.html Immediate Fix
# This script builds the NotchDrop addon and runs our test

echo "🔧 Building and Testing Swift UI → Overlay.html Immediate Fix"
echo "============================================================"

# Check current directory
if [[ ! -d "notchdrop-addon" ]]; then
    echo "❌ Error: notchdrop-addon directory not found"
    echo "Please run this script from the ve-desktop-app root directory"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo "📁 NotchDrop addon directory: $(ls -la notchdrop-addon/)"

# Step 1: Build the NotchDrop addon
echo ""
echo "1️⃣ Building NotchDrop addon..."
cd notchdrop-addon

if [[ -f "build.sh" ]]; then
    echo "📦 Found build.sh, running build script..."
    chmod +x build.sh
    ./build.sh
else
    echo "📦 No build.sh found, trying npm install..."
    if [[ -f "package.json" ]]; then
        npm install
        if [[ -f "binding.gyp" ]]; then
            echo "🔨 Building native addon with node-gyp..."
            npx node-gyp rebuild
        fi
    else
        echo "⚠️  No package.json found, skipping npm build"
    fi
fi

# Check if build succeeded
if [[ -f "build/Release/notchdrop_addon.node" ]]; then
    echo "✅ Native addon built successfully"
    ls -la build/Release/notchdrop_addon.node
else
    echo "❌ Native addon build failed or not found"
    echo "Expected: build/Release/notchdrop_addon.node"
    echo "Available files:"
    find build -name "*.node" 2>/dev/null || echo "No .node files found"
fi

# Step 2: Go back to root and run our test
cd ..
echo ""
echo "2️⃣ Running Swift UI → Overlay immediate fix test..."

if [[ -f "test-swift-overlay-immediate-fix.js" ]]; then
    echo "🧪 Running enhanced test script..."
    node test-swift-overlay-immediate-fix.js
else
    echo "❌ Test script not found: test-swift-overlay-immediate-fix.js"
    echo "Available test scripts:"
    ls -la test-*.js 2>/dev/null || echo "No test scripts found"
fi

echo ""
echo "3️⃣ Summary of changes made..."
echo "📝 Files modified for the fix:"
echo "  • notchdrop-addon/NotchDrop/NotchDrop/NotchContentView.swift"
echo "    - Added bridge readiness state to StartButton"
echo "    - Added processing indicator and retry logic"
echo "    - Integrated with ElectronBridgeManager"
echo ""
echo "  • notchdrop-addon/index.js"
echo "    - Added bridge initialization promise"
echo "    - Added command queuing for unready bridge"
echo "    - Enhanced triggerOverlayRecording method"
echo ""
echo "  • electron/main.js"
echo "    - Enhanced notchdrop:triggerOverlayRecording IPC handler"
echo "    - Added retry logic and fallback mechanisms"
echo "    - Improved window creation robustness"
echo ""
echo "  • notchdrop-addon/NotchDrop/NotchDrop/DynamicIsland/Bridge/ElectronBridgeManager.swift"
echo "    - Enhanced startRecording method"
echo "    - Direct NotchDropCore callback integration"
echo ""

echo "🎯 EXPECTED BEHAVIOR:"
echo "  ✅ First click on Swift UI 'start' button opens overlay.html immediately"
echo "  ✅ No more start→stop→start workaround needed"
echo "  ✅ Bridge initializes proactively, not reactively"
echo "  ✅ Proper error handling and retry mechanisms"
echo ""
echo "🚀 To test manually:"
echo "  1. Run: npm run dev (in one terminal)"
echo "  2. Run: npm start (in another terminal)"
echo "  3. Click the 'start' button in the Swift NotchDrop UI"
echo "  4. Verify overlay.html window opens immediately on first click"

echo ""
echo "✅ Build and test script completed!"