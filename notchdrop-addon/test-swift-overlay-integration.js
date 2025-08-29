const NotchDropAddonWrapper = require('./index.js');

async function testSwiftOverlayIntegration() {
	console.log('🧪 Testing Swift-Overlay Integration...');

	try {
		// Initialize the addon
		const addon = new NotchDropAddonWrapper();
		await addon.initialize();
		console.log('✅ Addon initialized');

		// Set up event listeners
		addon.on('swiftAction', (actionData) => {
			console.log('🎯 Swift action received:', actionData);
		});

		// Simulate Swift actions
		console.log('🎤 Simulating Swift startRecording action...');
		addon.handleSwiftAction('startRecording');

		console.log('🧠 Simulating Swift triggerOverlayToggleLiveIntelligence action...');
		addon.handleSwiftAction('triggerOverlayToggleLiveIntelligence');

		console.log('⏹️ Simulating Swift stopRecording action...');
		addon.handleSwiftAction('stopRecording');

		console.log('✅ Test completed successfully');

	} catch (error) {
		console.error('❌ Test failed:', error);
	}
}

// Run the test
testSwiftOverlayIntegration();
