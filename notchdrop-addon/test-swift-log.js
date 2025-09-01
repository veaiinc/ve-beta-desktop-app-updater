const path = require('path');
const log = require('electron-log');

// Test script for Swift to Electron log communication
async function testSwiftLogCommunication() {
	try {
		console.log('🧪 Testing Swift to Electron log communication...');

		// Load the NotchDrop addon
		const NotchDropAddonWrapper = require('./index.js');
		const notchDropAddon = new NotchDropAddonWrapper();

		// Set up event listeners
		notchDropAddon.on('swiftLog', (message) => {
			console.log('✅ Received Swift log message:', message);
			log.info('📝 Swift UI Log:', message);
		});

		notchDropAddon.on('statusChanged', (status) => {
			console.log('📊 NotchDrop status changed:', status);
		});

		// Initialize the addon
		console.log('🔧 Initializing NotchDrop addon...');
		notchDropAddon.initialize();

		// Show the NotchDrop UI
		console.log('👁️ Showing NotchDrop UI...');
		notchDropAddon.show();

		console.log('✅ Test setup complete!');
		console.log('📱 Now click the "Send Log to Electron" button in the Swift UI');
		console.log('📝 You should see the log message appear in the console');

		// Keep the process running
		setTimeout(() => {
			console.log('⏰ Test timeout reached. Cleaning up...');
			notchDropAddon.hide();
			process.exit(0);
		}, 30000); // 30 seconds timeout
	} catch (error) {
		console.error('❌ Test failed:', error);
		process.exit(1);
	}
}

// Run the test
testSwiftLogCommunication();



