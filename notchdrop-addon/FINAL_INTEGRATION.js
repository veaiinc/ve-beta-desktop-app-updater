/**
 * FINAL INTEGRATION SCRIPT
 * 
 * Add this to your electron/main.js to enable VE Voice in NotchDrop
 */

// Enable debug logging
process.env.DEBUG_VE_VOICE = 'true';

// Import the VE Voice Integration
const VEVoiceIntegration = require('./notchdrop-addon/ve-voice-integration');

/**
 * Add this function to your main.js after NotchDropService is created
 */
function setupNotchDropVoice(notchDropService, mainWindow) {
    console.log('🎤 Setting up NotchDrop VE Voice Integration...');
    
    try {
        // Create the integration
        const veVoiceIntegration = VEVoiceIntegration.createIntegration(notchDropService);
        
        // Setup authentication context from renderer
        const setupAuth = async () => {
            try {
                console.log('🔐 Getting auth context from renderer...');
                
                const authData = await mainWindow.webContents.executeJavaScript(`
                    ({
                        workspaceId: localStorage.getItem('workspaceId'),
                        userToken: localStorage.getItem('usertoken'),
                        locationDetails: JSON.parse(localStorage.getItem('locationDetails') || '{}')
                    })
                `);
                
                if (authData.workspaceId && authData.userToken) {
                    veVoiceIntegration.setAuthContext(
                        authData.workspaceId,
                        authData.userToken,
                        authData.locationDetails
                    );
                    console.log('✅ VE Voice authentication configured');
                } else {
                    console.warn('⚠️ Auth data not available yet, will retry...');
                }
            } catch (error) {
                console.warn('⚠️ Could not get auth context:', error.message);
            }
        };
        
        // Setup auth when renderer is ready
        mainWindow.webContents.once('dom-ready', () => {
            setTimeout(setupAuth, 2000); // Wait for localStorage to be populated
        });
        
        // Re-setup auth on navigation
        mainWindow.webContents.on('did-finish-load', () => {
            setTimeout(setupAuth, 1000);
        });
        
        console.log('✅ NotchDrop VE Voice Integration ready!');
        return veVoiceIntegration;
        
    } catch (error) {
        console.error('❌ Failed to setup NotchDrop voice integration:', error);
        return null;
    }
}

/**
 * EXAMPLE: How to add this to your main.js
 */
const integrationExample = `
// In your electron/main.js, after creating NotchDropService:

const { setupNotchDropVoice } = require('./notchdrop-addon/FINAL_INTEGRATION');

// After this line where you create NotchDropService:
// const notchDropService = new NotchDropService();

// Add this:
const veVoiceIntegration = setupNotchDropVoice(notchDropService, mainWindow);

// That's it! The Voice button will now appear in NotchDrop
`;

module.exports = {
    setupNotchDropVoice,
    integrationExample
};

console.log('📋 Final Integration Script Loaded');
console.log('');
console.log('🎯 WHAT YOU GET:');
console.log('   ✅ Voice button next to Listen button');
console.log('   ✅ Real-time voice conversation with AI');
console.log('   ✅ Uses your exact API endpoints');
console.log('   ✅ Same authentication as web version');
console.log('   ✅ Beautiful Swift UI in NotchDrop');
console.log('');
console.log('🚀 TO ACTIVATE:');
console.log('   1. Add setupNotchDropVoice() to your main.js');
console.log('   2. Click the Voice button in NotchDrop');
console.log('   3. Start talking to your AI agent!');
console.log('');
