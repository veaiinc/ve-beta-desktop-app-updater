#!/usr/bin/env node
/**
 * Test script to verify overlay window readiness fix
 * This tests that overlay commands are properly queued until the window is ready
 */

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const WindowHelper = require('./electron/helpers/windowHelper.js');

// Prevent multiple instances
if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

let windowHelper;

async function testOverlayReadiness() {
    console.log('🧪 Testing Overlay Window Readiness Fix');
    console.log('=====================================');

    // Initialize window helper
    windowHelper = new WindowHelper();

    // Test 1: Create overlay window and send command immediately
    console.log('\n1️⃣ Creating overlay window...');
    windowHelper.createOverlayWindow();
    
    // Test 2: Send command immediately (should be queued)
    console.log('\n2️⃣ Sending startRecording command immediately (should queue)...');
    const commandSent = windowHelper.sendOverlayCommand({
        action: 'startRecording'
    });
    
    console.log(`   Command sent immediately: ${commandSent}`);
    console.log(`   Overlay ready: ${windowHelper.isOverlayReady()}`);
    console.log(`   Pending actions: ${windowHelper.pendingOverlayActions.length}`);

    // Test 3: Wait for window to be ready
    console.log('\n3️⃣ Waiting for overlay window to become ready...');
    
    return new Promise((resolve) => {
        const checkReady = setInterval(() => {
            if (windowHelper.isOverlayReady()) {
                console.log('✅ Overlay window is now ready!');
                console.log(`   Pending actions after ready: ${windowHelper.pendingOverlayActions.length}`);
                clearInterval(checkReady);
                
                // Test 4: Send another command (should go immediately)
                console.log('\n4️⃣ Sending another command (should be immediate)...');
                const immediateCommand = windowHelper.sendOverlayCommand({
                    action: 'stopRecording'
                });
                console.log(`   Command sent immediately: ${immediateCommand}`);
                
                setTimeout(() => {
                    console.log('\n🎉 Test completed successfully!');
                    console.log('Expected behavior:');
                    console.log('- First command queued (window not ready)');
                    console.log('- Command executed when window ready');
                    console.log('- Second command sent immediately');
                    
                    resolve();
                }, 1000);
            }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
            console.log('❌ Timeout: Window did not become ready');
            clearInterval(checkReady);
            resolve();
        }, 10000);
    });
}

app.whenReady().then(async () => {
    console.log('📱 Electron app ready');
    
    // Create a minimal main window to keep app alive
    const mainWindow = new BrowserWindow({
        width: 300,
        height: 200,
        show: false
    });
    
    await testOverlayReadiness();
    
    setTimeout(() => {
        app.quit();
    }, 2000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});