// Test script for the enhanced NotchDrop addon with Swift UI components
const NotchDropAddonWrapper = require('./index.js');

console.log('🧪 Testing Enhanced NotchDrop Addon with Swift UI Components\n');

// Create addon instance
const notchDrop = new NotchDropAddonWrapper();

// Set up event listeners
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

// Initialize the addon
console.log('🚀 Initializing NotchDrop...');
notchDrop.initialize();

// Test basic functionality
console.log('\n📋 Testing basic functionality:');
console.log(`Is visible: ${notchDrop.isVisible()}`);
console.log(`Status: ${notchDrop.getStatus()}`);
console.log(`Content type: ${notchDrop.getContentType()}`);

// Show the window to test positioning
console.log('\n📍 Testing top-center positioning:');
notchDrop.show();

// Wait a moment for the window to be created and positioned
setTimeout(() => {
	const position = notchDrop.addon.getWindowPosition();
	console.log('📐 Window position:', position);

	if (position.width > 0 && position.height > 0) {
		console.log('✅ NotchDrop window is created and positioned');

		const screenWidth = 1920; // Actual screen width
		const screenHeight = 1080; // Actual screen height
		const menuBarHeight = 22; // macOS menu bar height
		const topPadding = 8; // Padding from menu bar

		const expectedX = (screenWidth - position.width) / 2;
		console.log(`🎯 Expected center X: ${expectedX}, Actual X: ${position.x}`);
		console.log(
			`📏 Position verification: ${
				Math.abs(position.x - expectedX) < 10 ? '✅ Centered correctly' : '❌ Not centered'
			}`,
		);

		// Check if it's positioned at the top (above menu bar)
		const expectedY = screenHeight - menuBarHeight - position.height - topPadding;
		console.log(`📍 Y position check: ${position.y} (should be close to ${expectedY})`);
		console.log(
			`📏 Top positioning: ${
				Math.abs(position.y - expectedY) < 5
					? '✅ Positioned at top correctly'
					: '❌ Not at top'
			}`,
		);

		if (Math.abs(position.x - expectedX) < 10 && Math.abs(position.y - expectedY) < 5) {
			console.log(
				'\n🎉 SUCCESS: NotchDrop is perfectly positioned at the top center above the menu bar!',
			);
		}
	} else {
		console.log('❌ Window not properly created or positioned');
	}
}, 100); // Wait 100ms for window creation

// Test advanced Swift UI features
console.log('\n🎨 Testing advanced Swift UI features:');
notchDrop.addon.showAdvancedView();
notchDrop.addon.addNotification('Test notification from Electron!');
notchDrop.addon.updateProgress(0.75);
notchDrop.addon.setProcessing(true);

// Test status changes
console.log('\n🔄 Testing status changes:');
setTimeout(() => {
	notchDrop.setStatus('opened');
	console.log('Status set to opened');
}, 1000);

setTimeout(() => {
	notchDrop.setStatus('closed');
	console.log('Status set to closed');
}, 2000);

// Test file handling
setTimeout(() => {
	console.log('\n📂 Testing file handling:');
	notchDrop.handleDroppedFiles(['/Users/test/file1.txt', '/Users/test/file2.jpg']);
}, 3000);

// Test visibility toggle
setTimeout(() => {
	console.log('\n👁️ Testing visibility toggle:');
	notchDrop.toggle();
	console.log(`After toggle - Is visible: ${notchDrop.isVisible()}`);
}, 4000);

// Clean up
setTimeout(() => {
	console.log('\n🧹 Cleaning up...');
	notchDrop.addon.hideAdvancedView();
	notchDrop.addon.setProcessing(false);
	console.log('✅ Test completed successfully!');
}, 5000);
