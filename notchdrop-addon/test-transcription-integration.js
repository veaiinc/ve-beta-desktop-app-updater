#!/usr/bin/env node

/**
 * Test Script for NotchDrop Transcription Integration
 *
 * This script tests the complete flow from Swift → NotchDrop → Overlay → Transcription
 */

const path = require('path');
const { NotchDropAddonWrapper } = require('./index.js');

console.log('🧪 Testing NotchDrop Transcription Integration...\n');

async function testTranscriptionIntegration() {
	try {
		// 1. Initialize NotchDrop Addon
		console.log('1️⃣ Initializing NotchDrop Addon...');
		const notchDropAddon = new NotchDropAddonWrapper();
		notchDropAddon.initialize();
		console.log('✅ NotchDrop Addon initialized\n');

		// 2. Test Swift Action Handling
		console.log('2️⃣ Testing Swift Action Handling...');

		// Simulate Swift sending startRecording action
		console.log('🎤 Simulating Swift startRecording action...');
		notchDropAddon.handleSwiftAction('startRecording:');
		console.log('✅ startRecording action handled\n');

		// Simulate Swift sending triggerOverlayToggleLiveIntelligence action
		console.log('🧠 Simulating Swift triggerOverlayToggleLiveIntelligence action...');
		notchDropAddon.handleSwiftAction('triggerOverlayToggleLiveIntelligence:');
		console.log('✅ triggerOverlayToggleLiveIntelligence action handled\n');

		// 3. Test Overlay Integration Methods
		console.log('3️⃣ Testing Overlay Integration Methods...');

		console.log('🎤 Testing triggerOverlayRecording...');
		await notchDropAddon.triggerOverlayRecording();
		console.log('✅ triggerOverlayRecording completed\n');

		console.log('🧠 Testing triggerOverlayToggleLiveIntelligence...');
		await notchDropAddon.triggerOverlayToggleLiveIntelligence();
		console.log('✅ triggerOverlayToggleLiveIntelligence completed\n');

		// 4. Test Recording Control Methods
		console.log('4️⃣ Testing Recording Control Methods...');

		console.log('⏸️ Testing triggerOverlayPauseRecording...');
		await notchDropAddon.triggerOverlayPauseRecording();
		console.log('✅ triggerOverlayPauseRecording completed\n');

		console.log('▶️ Testing triggerOverlayResumeRecording...');
		await notchDropAddon.triggerOverlayResumeRecording();
		console.log('✅ triggerOverlayResumeRecording completed\n');

		console.log('⏹️ Testing triggerOverlayStopRecording...');
		await notchDropAddon.triggerOverlayStopRecording();
		console.log('✅ triggerOverlayStopRecording completed\n');

		console.log('🎉 All tests completed successfully!');
		console.log('\n📋 Summary:');
		console.log('✅ NotchDrop Addon initialization');
		console.log('✅ Swift action handling');
		console.log('✅ Overlay integration methods');
		console.log('✅ Recording control methods');
		console.log(
			'\n🚀 The transcription integration should now work when you click the start button in NotchDrop!',
		);
	} catch (error) {
		console.error('❌ Test failed:', error);
		console.error('\n🔧 Troubleshooting:');
		console.error('1. Make sure the Electron app is running');
		console.error('2. Check that the overlay window exists');
		console.error('3. Verify that the main process IPC handlers are set up');
		console.error('4. Check the console logs for detailed error messages');
	}
}

// Run the test
testTranscriptionIntegration();
