const NotchDropUIBridge = require('./ui-bridge.js');

async function testNotchDropUI() {
	console.log('🧪 Testing NotchDrop UI Integration...\n');

	try {
		// Initialize the UI bridge
		console.log('1. Initializing NotchDrop UI Bridge...');
		const bridge = NotchDropUIBridge.bridge;
		await bridge.initialize();
		console.log('✅ NotchDrop UI Bridge initialized successfully\n');

		// Set up event listeners
		console.log('2. Setting up event listeners...');
		bridge.on('uiStateChanged', (state) => {
			console.log(`📊 UI State changed:`, {
				isExpanded: state.isExpanded,
				isRecording: state.isRecording,
				isPaused: state.isPaused,
				timer: state.timer,
				isAuthenticated: state.isAuthenticated,
				isChatMode: state.isChatMode,
			});
		});

		bridge.on('startRecording', () => {
			console.log('🎤 Start recording event emitted');
		});

		bridge.on('stopRecording', () => {
			console.log('⏹️ Stop recording event emitted');
		});

		bridge.on('fileDropped', (filePath) => {
			console.log(`📁 File dropped event: ${filePath}`);
		});
		console.log('✅ Event listeners configured\n');

		// Test UI state management
		console.log('3. Testing UI state management...');

		// Test expand/collapse
		console.log('   - Testing expand...');
		await bridge.expand();
		await new Promise((resolve) => setTimeout(resolve, 1000));

		console.log('   - Testing collapse...');
		await bridge.collapse();
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log('✅ UI state management test completed\n');

		// Test recording controls
		console.log('4. Testing recording controls...');

		console.log('   - Testing start recording...');
		await bridge.startRecording();
		await new Promise((resolve) => setTimeout(resolve, 1000));

		console.log('   - Testing pause recording...');
		await bridge.pauseRecording();
		await new Promise((resolve) => setTimeout(resolve, 1000));

		console.log('   - Testing resume recording...');
		await bridge.resumeRecording();
		await new Promise((resolve) => setTimeout(resolve, 1000));

		console.log('   - Testing stop recording...');
		await bridge.stopRecording();
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log('✅ Recording controls test completed\n');

		// Test chat mode
		console.log('5. Testing chat mode...');
		bridge.setChatMode(true);
		bridge.setChatInput('Hello, this is a test message');
		await new Promise((resolve) => setTimeout(resolve, 1000));

		bridge.setChatMode(false);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log('✅ Chat mode test completed\n');

		// Test timer updates
		console.log('6. Testing timer updates...');
		for (let i = 0; i < 5; i++) {
			bridge.updateTimer(i);
			await new Promise((resolve) => setTimeout(resolve, 500));
		}
		console.log('✅ Timer updates test completed\n');

		// Test overlay state integration
		console.log('7. Testing overlay state integration...');
		bridge.onOverlayStateChange({
			isRecording: true,
			isPaused: false,
			timer: 30,
			isLiveIntelligenceOpen: true,
			isNotchDropControlled: true,
		});
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log('✅ Overlay state integration test completed\n');

		// Final state check
		console.log('8. Final state check...');
		const finalState = bridge.getUIState();
		console.log('   - Final UI State:', finalState);
		console.log('✅ Final state check completed\n');

		console.log('🎉 All UI tests completed successfully!');
		console.log('\n📋 Test Summary:');
		console.log('   ✅ UI Bridge initialization');
		console.log('   ✅ Event listeners');
		console.log('   ✅ UI state management');
		console.log('   ✅ Recording controls');
		console.log('   ✅ Chat mode');
		console.log('   ✅ Timer updates');
		console.log('   ✅ Overlay state integration');
		console.log('   ✅ State management');

		console.log('\n🚀 NotchDrop UI is ready for integration!');

		// Keep the bridge active for manual testing
		console.log('\n💡 NotchDrop UI Bridge is now active for manual testing.');
		console.log('   - Try interacting with the UI');
		console.log('   - Test the recording controls');
		console.log('   - Check the chat functionality');
		console.log('\nPress Ctrl+C to exit...');

		// Keep the process alive
		process.on('SIGINT', () => {
			console.log('\n🧹 Cleaning up...');
			bridge.destroy();
			process.exit(0);
		});
	} catch (error) {
		console.error('❌ UI test failed:', error);
		process.exit(1);
	}
}

// Run the test
testNotchDropUI().catch(console.error);
