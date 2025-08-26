const NotchDropAddonWrapper = require('./index.js');

console.log('🧪 Testing NotchDrop positioning above menu bar...\n');

const notchDrop = new NotchDropAddonWrapper();

// Initialize
notchDrop.initialize();
console.log('✅ NotchDrop initialized');

// Show the window
notchDrop.show();
console.log('✅ NotchDrop shown');

// Wait a moment for the window to be created and positioned
setTimeout(() => {
	const position = notchDrop.getWindowPosition();
	console.log('\n📐 Window position:', position);

	if (position.width > 0 && position.height > 0) {
		console.log('✅ NotchDrop window is created and positioned');

		const screenWidth = 1920; // Example screen width
		const screenHeight = 1080; // Example screen height

		// Check if it's full-width
		const isFullWidth = Math.abs(position.width - screenWidth) < 10;
		console.log(`📏 Full-width check: ${isFullWidth ? '✅ Full-width' : '❌ Not full-width'}`);
		console.log(`   Expected width: ${screenWidth}, Actual width: ${position.width}`);

		// Check if it's above menu bar
		const menuBarHeight = 22; // macOS menu bar height
		const topPadding = 8; // Padding above menu bar
		const expectedY = screenHeight - menuBarHeight - position.height - topPadding;
		const isAboveMenuBar = Math.abs(position.y - expectedY) < 5;
		console.log(
			`📍 Above menu bar: ${isAboveMenuBar ? '✅ Above menu bar' : '❌ Not above menu bar'}`,
		);
		console.log(`   Y position: ${position.y} (should be close to ${expectedY})`);

		// Check if it's centered horizontally
		const isCentered = Math.abs(position.x) < 10;
		console.log(`🎯 Horizontal centering: ${isCentered ? '✅ Centered' : '❌ Not centered'}`);
		console.log(`   X position: ${position.x} (should be 0 for full-width)`);

		if (isFullWidth && isAboveMenuBar && isCentered) {
			console.log('\n🎉 SUCCESS: NotchDrop is positioned above menu bar!');
			console.log('   - Full-width window');
			console.log('   - Above the menu bar');
			console.log('   - Horizontally centered');
		} else {
			console.log('\n❌ NotchDrop positioning needs adjustment');
		}
	} else {
		console.log('❌ Window not properly created or positioned');
	}

	// Clean up
	notchDrop.hide();
	console.log('\n🧹 Test completed');
}, 500);
