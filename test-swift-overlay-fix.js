#!/usr/bin/env node
/**
 * Test script to verify Swift UI overlay integration fix
 * This tests the immediate overlay opening when "start" is clicked
 */

const NotchDropAddonWrapper = require('./notchdrop-addon/index.js');

async function testSwiftOverlayFix() {
	console.log('🧪 Testing Swift UI -> Overlay.html integration fix');
	console.log('=====================================\n');

	try {
		// Initialize the NotchDrop addon
		console.log('1️⃣ Initializing NotchDrop addon...');
		const notchDropAddon = new NotchDropAddonWrapper();
		notchDropAddon.initialize();
		console.log('✅ NotchDrop addon initialized\n');

		// Wait a bit for initialization
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Test the Swift "start" action
		console.log('2️⃣ Simulating Swift UI "start" button click...');
		console.log('   This should immediately open overlay.html window');
		
		// This simulates what happens when the Swift "start" button is clicked
		notchDropAddon.handleSwiftAction('startRecording:');
		console.log('✅ Swift startRecording action sent\n');

		// Wait a moment and test again
		console.log('3️⃣ Waiting 2 seconds, then testing again...');
		await new Promise((resolve) => setTimeout(resolve, 2000));
		
		console.log('4️⃣ Testing second click (should work immediately)...');
		notchDropAddon.handleSwiftAction('startRecording:');
		console.log('✅ Second Swift startRecording action sent\n');

		// Test stop action
		console.log('5️⃣ Testing stop recording...');
		await new Promise((resolve) => setTimeout(resolve, 1000));
		notchDropAddon.handleSwiftAction('stopRecording:');
		console.log('✅ Swift stopRecording action sent\n');

		console.log('🎉 All tests completed!');
		console.log('Expected behavior:');
		console.log('- First click: overlay.html should open immediately (no delay)');
		console.log('- Second click: should work instantly');
		console.log('- No start->stop->start cycle needed');

	} catch (error) {
		console.error('❌ Test failed:', error);
	}

	// Keep the test running for a bit to see results
	setTimeout(() => {
		console.log('\n🏁 Test script finished. Check Electron logs for overlay window creation.');
		process.exit(0);
	}, 3000);
}

// Run the test
testSwiftOverlayFix().catch(console.error);