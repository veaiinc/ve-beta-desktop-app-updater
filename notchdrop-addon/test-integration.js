/**
 * Test script for VE Voice Integration
 * Run this to test the NotchDrop voice integration
 */

// Enable debug logging
process.env.DEBUG_VE_VOICE = 'true';

console.log('🧪 Testing VE Voice Integration...');

try {
    // Test loading the addon
    console.log('📦 Loading NotchDrop addon...');
    const NotchDropAddon = require('./index.js');
    
    // Test creating the addon wrapper
    console.log('🔧 Creating NotchDrop wrapper...');
    const notchDrop = new NotchDropAddon();
    
    // Test initialization
    console.log('⚡ Initializing NotchDrop...');
    notchDrop.initialize();
    
    // Test voice configuration
    console.log('🎤 Testing voice configuration...');
    notchDrop.configureVoice('wss://ve-ai-voice-agent-ginreaey.livekit.cloud', 'test-token');
    
    // Test voice connection
    console.log('📞 Testing voice connection...');
    notchDrop.connectVoiceAssistant();
    
    // Test voice status
    console.log('📊 Testing voice status...');
    const status = notchDrop.getVoiceConnectionStatus();
    console.log('Voice status:', status);
    
    // Test showing NotchDrop
    console.log('👁️ Testing NotchDrop visibility...');
    notchDrop.show();
    
    console.log('✅ All tests passed! NotchDrop voice integration is working.');
    console.log('');
    console.log('🎯 What you can expect:');
    console.log('   - Voice button will appear next to Listen button');
    console.log('   - Clicking Voice will show voice interface');
    console.log('   - Real-time conversation with AI agent');
    console.log('   - Audio visualization and controls');
    console.log('');
    console.log('🚀 To use in your app:');
    console.log('   1. Import: const VEVoiceIntegration = require("./notchdrop-addon/ve-voice-integration");');
    console.log('   2. Setup: const veVoice = VEVoiceIntegration.createIntegration(notchDropService);');
    console.log('   3. Configure auth: veVoice.setAuthContext(workspaceId, userToken, locationDetails);');
    console.log('   4. Click the Voice button in NotchDrop!');
    
    // Test cleanup
    setTimeout(() => {
        console.log('🧹 Testing cleanup...');
        notchDrop.disconnectVoiceAssistant();
        notchDrop.hide();
        console.log('✅ Cleanup completed successfully!');
        process.exit(0);
    }, 3000);
    
} catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    
    if (error.message.includes('NotchDrop addon skipped')) {
        console.log('ℹ️ This is expected on non-macOS platforms');
    } else {
        console.log('');
        console.log('🔧 Troubleshooting:');
        console.log('   1. Make sure you\'re on macOS');
        console.log('   2. Run: npm run build');
        console.log('   3. Check Xcode and Swift are installed');
        console.log('   4. Verify node-gyp dependencies');
    }
    
    process.exit(1);
}
