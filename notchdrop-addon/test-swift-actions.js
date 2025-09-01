#!/usr/bin/env node

/**
 * Test script to verify Swift action callback is working
 * This script tests that Swift actions are properly flowing from Swift UI to JavaScript
 */

const NotchDropAddonWrapper = require('./index.js');

console.log('🧪 Testing Swift Action Callback Integration...\n');

async function testSwiftActionCallback() {
	console.log('1️⃣ Creating NotchDrop Addon Wrapper...');

	try {
		const notchDropAddon = new NotchDropAddonWrapper();

		console.log('✅ NotchDrop Addon Wrapper created successfully\n');

		// Set up event listeners to catch Swift actions
		console.log('2️⃣ Setting up Swift action event listeners...');

		notchDropAddon.on('swiftAction', (actionData) => {
			console.log('🎯 Swift action received in test:', actionData);
			const [action, data] = actionData.split(':');
			console.log(`   Action: ${action}`);
			console.log(`   Data: ${data}`);

			if (action === 'startRecording') {
				console.log('✅ START RECORDING action detected - this should trigger overlay!');
			}
			if (action === 'sendLog') {
				console.log(
					'✅ SEND LOG action detected - this confirms Swift actions are working!',
				);
			}
		});

		console.log('✅ Event listeners set up\n');

		console.log('3️⃣ Initializing NotchDrop addon...');
		notchDropAddon.initialize();
		console.log('✅ NotchDrop addon initialized\n');

		console.log('🎉 Test setup complete!');
		console.log('\n📋 Next steps:');
		console.log('1. Start your Electron app: npm run dev');
		console.log('2. Click the "Send Log to Electron" button in Swift UI');
		console.log('3. Click the "start" button in Swift UI');
		console.log('4. Check console logs for Swift action messages\n');

		console.log('🔍 Expected log messages:');
		console.log(
			'   - "Swift action received in test: sendLog:Hello from Swift UI! Button clicked at..."',
		);
		console.log('   - "Swift action received in test: startRecording:"');
		console.log('   - "START RECORDING action detected - this should trigger overlay!"\n');

		// Keep the process alive to listen for events
		console.log('⏳ Keeping process alive to listen for Swift actions...');
		console.log('   Press Ctrl+C to exit\n');

		// Keep alive
		setInterval(() => {
			// Just keep the process running
		}, 1000);
	} catch (error) {
		console.error('❌ Error in test:', error);
		process.exit(1);
	}
}

// Handle graceful shutdown
process.on('SIGINT', () => {
	console.log('\n\n👋 Test script shutting down...');
	process.exit(0);
});

// Run the test
testSwiftActionCallback();
