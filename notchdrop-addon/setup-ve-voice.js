/**
 * Setup script for VE Voice Integration with NotchDrop
 * 
 * This script shows exactly how to integrate with your existing authentication system
 */

const VEVoiceIntegration = require('./ve-voice-integration');

/**
 * Setup VE Voice Integration in your Electron main process
 * Call this after your NotchDropService is initialized
 */
function setupVEVoiceWithNotchDrop(notchDropService, mainWindow) {
    console.log('🎤 Setting up VE Voice Integration with NotchDrop...');
    
    // Create the integration
    const veVoiceIntegration = VEVoiceIntegration.createIntegration(notchDropService);
    
    // Function to get authentication context from renderer process
    const getAuthContextFromRenderer = async () => {
        try {
            // Get authentication data from renderer process localStorage
            const authData = await mainWindow.webContents.executeJavaScript(`
                ({
                    workspaceId: localStorage.getItem('workspaceId'),
                    userToken: localStorage.getItem('usertoken'), // Note: 'usertoken' not 'token'
                    locationDetails: JSON.parse(localStorage.getItem('locationDetails') || '{}'),
                    region: localStorage.getItem('region')
                })
            `);
            
            console.log('🔐 Retrieved auth context from renderer:', {
                workspaceId: authData.workspaceId,
                hasToken: !!authData.userToken,
                region: authData.region,
                location: authData.locationDetails?.country
            });
            
            return authData;
        } catch (error) {
            console.error('❌ Error getting auth context from renderer:', error);
            return null;
        }
    };
    
    // Initialize authentication context
    const initializeAuth = async () => {
        const authData = await getAuthContextFromRenderer();
        
        if (authData && authData.workspaceId && authData.userToken) {
            veVoiceIntegration.setAuthContext(
                authData.workspaceId,
                authData.userToken,
                authData.locationDetails
            );
            console.log('✅ VE Voice authentication initialized');
        } else {
            console.warn('⚠️ VE Voice authentication not available - user may need to log in');
        }
    };
    
    // Initialize auth when renderer is ready
    mainWindow.webContents.once('dom-ready', () => {
        setTimeout(initializeAuth, 1000); // Small delay to ensure localStorage is populated
    });
    
    // Re-initialize auth when user logs in
    mainWindow.webContents.on('did-finish-load', () => {
        setTimeout(initializeAuth, 500);
    });
    
    // Add IPC handler to manually refresh auth context
    const { ipcMain } = require('electron');
    ipcMain.handle('ve-voice:refreshAuth', async () => {
        await initializeAuth();
        return veVoiceIntegration.getStatus();
    });
    
    console.log('✅ VE Voice Integration setup complete');
    return veVoiceIntegration;
}

/**
 * Alternative setup for when you have auth context available directly
 */
function setupVEVoiceWithAuthContext(notchDropService, authContext) {
    console.log('🎤 Setting up VE Voice with provided auth context...');
    
    const veVoiceIntegration = VEVoiceIntegration.createIntegration(notchDropService);
    
    veVoiceIntegration.setAuthContext(
        authContext.workspaceId,
        authContext.userToken,
        authContext.locationDetails
    );
    
    console.log('✅ VE Voice Integration setup complete with auth context');
    return veVoiceIntegration;
}

/**
 * Test the integration
 */
async function testVEVoiceIntegration(veVoiceIntegration) {
    console.log('🧪 Testing VE Voice Integration...');
    
    try {
        // Test token generation
        const tokenResult = await veVoiceIntegration.generateVoiceToken('TestUser');
        
        if (tokenResult.success) {
            console.log('✅ Token generation test passed');
            console.log('   Room name:', tokenResult.room_name);
            console.log('   Token length:', tokenResult.token?.length);
        } else {
            console.error('❌ Token generation test failed:', tokenResult.error);
        }
        
        // Test connection (this will trigger the NotchDrop UI)
        // const connectResult = await veVoiceIntegration.connectVoiceAssistant('TestUser');
        // console.log('🔗 Connection test result:', connectResult);
        
    } catch (error) {
        console.error('❌ Integration test failed:', error);
    }
}

/**
 * Example usage in your main.js
 */
const exampleUsage = `
// In your main Electron process (e.g., electron/main.js)

const { setupVEVoiceWithNotchDrop } = require('./notchdrop-addon/setup-ve-voice');

// After creating your main window and NotchDropService
const notchDropService = new NotchDropService();
const mainWindow = new BrowserWindow({...});

// Setup VE Voice integration
const veVoiceIntegration = setupVEVoiceWithNotchDrop(notchDropService, mainWindow);

// Optional: Test the integration
// setTimeout(() => testVEVoiceIntegration(veVoiceIntegration), 5000);
`;

module.exports = {
    setupVEVoiceWithNotchDrop,
    setupVEVoiceWithAuthContext,
    testVEVoiceIntegration,
    exampleUsage
};
