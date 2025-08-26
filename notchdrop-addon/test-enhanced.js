const NotchDropAddonWrapper = require('./index.js');

async function testEnhancedNotchDrop() {
	console.log('🧪 Testing Enhanced NotchDrop Implementation...\n');

	try {
		// Initialize the addon
		console.log('1. Initializing NotchDrop...');
		const notchDrop = new NotchDropAddonWrapper();
		notchDrop.initialize();
		console.log('✅ NotchDrop initialized successfully\n');

		// Set up event listeners
		console.log('2. Setting up event listeners...');
		notchDrop.on('statusChanged', (status) => {
			console.log(`📊 Status changed: ${status}`);
		});

		notchDrop.on('fileDropped', (filePath) => {
			console.log(`📁 File dropped: ${filePath}`);
		});

		notchDrop.on('itemAdded', (itemData) => {
			console.log(`➕ Item added: ${itemData}`);
		});

		notchDrop.on('itemRemoved', (itemData) => {
			console.log(`➖ Item removed: ${itemData}`);
		});
		console.log('✅ Event listeners configured\n');

		// Test basic functionality
		console.log('3. Testing basic functionality...');

		// Show NotchDrop
		console.log('   - Showing NotchDrop...');
		notchDrop.show();
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Check visibility
		const isVisible = notchDrop.isVisible();
		console.log(`   - Is visible: ${isVisible}`);

		// Get status
		const status = notchDrop.getStatus();
		console.log(`   - Current status: ${status}`);

		// Get content type
		const contentType = notchDrop.getContentType();
		console.log(`   - Content type: ${contentType}`);
		console.log('✅ Basic functionality test completed\n');

		// Test settings
		console.log('4. Testing settings...');

		// Test haptic feedback
		notchDrop.setHapticFeedback(true);
		const hapticEnabled = notchDrop.getHapticFeedback();
		console.log(`   - Haptic feedback enabled: ${hapticEnabled}`);

		// Test notch visibility
		notchDrop.setNotchVisible(true);
		const notchVisible = notchDrop.getNotchVisible();
		console.log(`   - Notch visible: ${notchVisible}`);
		console.log('✅ Settings test completed\n');

		// Test content type switching
		console.log('5. Testing content type switching...');

		// Switch to menu
		notchDrop.setContentType('menu');
		await new Promise((resolve) => setTimeout(resolve, 500));
		console.log('   - Switched to menu view');

		// Switch to settings
		notchDrop.setContentType('settings');
		await new Promise((resolve) => setTimeout(resolve, 500));
		console.log('   - Switched to settings view');

		// Switch back to normal
		notchDrop.setContentType('normal');
		await new Promise((resolve) => setTimeout(resolve, 500));
		console.log('   - Switched back to normal view');
		console.log('✅ Content type switching test completed\n');

		// Test file handling
		console.log('6. Testing file handling...');

		// Simulate dropped files
		const testFiles = [
			'/Users/test/file1.txt',
			'/Users/test/file2.jpg',
			'/Users/test/file3.pdf',
		];

		notchDrop.handleDroppedFiles(testFiles);
		console.log(`   - Handled ${testFiles.length} test files`);

		// Get current items
		const items = notchDrop.getCurrentItems();
		console.log(`   - Current items: ${items.length}`);
		console.log('✅ File handling test completed\n');

		// Test toggle functionality
		console.log('7. Testing toggle functionality...');

		// Toggle off
		notchDrop.toggle();
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log('   - Toggled off');

		// Toggle on
		notchDrop.toggle();
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log('   - Toggled on');
		console.log('✅ Toggle functionality test completed\n');

		// Final status check
		console.log('8. Final status check...');
		const finalStatus = notchDrop.getStatus();
		const finalContentType = notchDrop.getContentType();
		const finalVisibility = notchDrop.isVisible();

		console.log(`   - Final status: ${finalStatus}`);
		console.log(`   - Final content type: ${finalContentType}`);
		console.log(`   - Final visibility: ${finalVisibility}`);
		console.log('✅ Final status check completed\n');

		console.log('🎉 All tests completed successfully!');
		console.log('\n📋 Test Summary:');
		console.log('   ✅ Initialization');
		console.log('   ✅ Event listeners');
		console.log('   ✅ Basic functionality');
		console.log('   ✅ Settings management');
		console.log('   ✅ Content type switching');
		console.log('   ✅ File handling');
		console.log('   ✅ Toggle functionality');
		console.log('   ✅ Status management');

		console.log('\n🚀 Enhanced NotchDrop is ready for use!');

		// Keep the window open for manual testing
		console.log('\n💡 NotchDrop window is now visible for manual testing.');
		console.log('   - Try dragging files over it');
		console.log('   - Test the different content types');
		console.log('   - Check the visual effects and animations');
		console.log('\nPress Ctrl+C to exit...');
	} catch (error) {
		console.error('❌ Test failed:', error);
		process.exit(1);
	}
}

// Run the test
testEnhancedNotchDrop().catch(console.error);
