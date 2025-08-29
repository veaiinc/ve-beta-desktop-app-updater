const SwiftJSBridge = require('./swift-js-bridge.js');
const NotchDropAddonWrapper = require('./index.js');

class SwiftJSIntegrationTest {
	constructor() {
		this.swiftBridge = SwiftJSBridge.bridge;
		this.notchDrop = new NotchDropAddonWrapper();
		this.isInitialized = false;
	}

	async initialize() {
		try {
			console.log('🚀 Initializing Swift-JS Integration Test...');

			// Initialize the Swift-JS bridge
			await this.swiftBridge.initialize();

			// Initialize NotchDrop
			this.notchDrop.initialize();

			// Set up event listeners
			this.setupEventListeners();

			this.isInitialized = true;
			console.log('✅ Swift-JS Integration Test initialized successfully');
		} catch (error) {
			console.error('❌ Failed to initialize Swift-JS Integration Test:', error);
			throw error;
		}
	}

	setupEventListeners() {
		// Listen for Swift actions
		this.notchDrop.on('statusChanged', (status) => {
			console.log('📊 NotchDrop status changed:', status);
		});

		// Listen for file drops
		this.notchDrop.on('fileDropped', (filePath) => {
			console.log('📁 File dropped:', filePath);
		});
	}

	async runTests() {
		if (!this.isInitialized) {
			throw new Error('Swift-JS Integration Test not initialized');
		}

		console.log('\n🧪 Running Swift-JS Integration Tests...\n');

		// Test 1: Simulate Swift start recording action
		console.log('1️⃣ Testing Swift start recording action...');
		await this.swiftBridge.onSwiftAction('startRecording', { timestamp: Date.now() });
		await this.delay(2000);

		// Test 2: Simulate Swift pause recording action
		console.log('2️⃣ Testing Swift pause recording action...');
		await this.swiftBridge.onSwiftAction('pauseRecording', { timestamp: Date.now() });
		await this.delay(2000);

		// Test 3: Simulate Swift resume recording action
		console.log('3️⃣ Testing Swift resume recording action...');
		await this.swiftBridge.onSwiftAction('resumeRecording', { timestamp: Date.now() });
		await this.delay(2000);

		// Test 4: Simulate Swift stop recording action
		console.log('4️⃣ Testing Swift stop recording action...');
		await this.swiftBridge.onSwiftAction('stopRecording', { timestamp: Date.now() });
		await this.delay(2000);

		// Test 5: Simulate Swift authentication action
		console.log('5️⃣ Testing Swift authentication action...');
		await this.swiftBridge.onSwiftAction('setAuthenticated', true);
		await this.delay(2000);

		// Test 6: Simulate Swift chat mode toggle
		console.log('6️⃣ Testing Swift chat mode toggle...');
		await this.swiftBridge.onSwiftAction('toggleChatMode', { enabled: true });
		await this.delay(2000);

		// Test 7: Simulate Swift chat submission
		console.log('7️⃣ Testing Swift chat submission...');
		await this.swiftBridge.onSwiftAction('submitChat', { message: 'Hello from Swift!' });
		await this.delay(2000);

		// Test 8: Simulate Swift expand action
		console.log('8️⃣ Testing Swift expand action...');
		await this.swiftBridge.onSwiftAction('expand', { reason: 'user_interaction' });
		await this.delay(2000);

		// Test 9: Simulate Swift collapse action
		console.log('9️⃣ Testing Swift collapse action...');
		await this.swiftBridge.onSwiftAction('collapse', { reason: 'user_interaction' });
		await this.delay(2000);

		// Test 10: Get JavaScript UI state
		console.log('🔟 Testing JavaScript UI state request...');
		const state = this.swiftBridge.getJavaScriptUIState();
		console.log('📊 JavaScript UI State:', state);

		console.log('\n✅ All Swift-JS Integration Tests completed successfully!');
	}

	async delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// Interactive test mode
	async interactiveMode() {
		console.log('\n🎮 Interactive Swift-JS Integration Test Mode');
		console.log('Available commands:');
		console.log('  start    - Simulate Swift start recording');
		console.log('  stop     - Simulate Swift stop recording');
		console.log('  pause    - Simulate Swift pause recording');
		console.log('  resume   - Simulate Swift resume recording');
		console.log('  auth     - Simulate Swift authentication toggle');
		console.log('  chat     - Simulate Swift chat mode toggle');
		console.log('  expand   - Simulate Swift expand action');
		console.log('  collapse - Simulate Swift collapse action');
		console.log('  state    - Get JavaScript UI state');
		console.log('  quit     - Exit interactive mode');

		const readline = require('readline');
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		const askQuestion = () => {
			rl.question('\nEnter command: ', async (answer) => {
				const command = answer.trim().toLowerCase();

				switch (command) {
					case 'start':
						await this.swiftBridge.onSwiftAction('startRecording', {
							timestamp: Date.now(),
						});
						break;
					case 'stop':
						await this.swiftBridge.onSwiftAction('stopRecording', {
							timestamp: Date.now(),
						});
						break;
					case 'pause':
						await this.swiftBridge.onSwiftAction('pauseRecording', {
							timestamp: Date.now(),
						});
						break;
					case 'resume':
						await this.swiftBridge.onSwiftAction('resumeRecording', {
							timestamp: Date.now(),
						});
						break;
					case 'auth':
						await this.swiftBridge.onSwiftAction('setAuthenticated', true);
						break;
					case 'chat':
						await this.swiftBridge.onSwiftAction('toggleChatMode', { enabled: true });
						break;
					case 'expand':
						await this.swiftBridge.onSwiftAction('expand', {
							reason: 'user_interaction',
						});
						break;
					case 'collapse':
						await this.swiftBridge.onSwiftAction('collapse', {
							reason: 'user_interaction',
						});
						break;
					case 'state':
						const state = this.swiftBridge.getJavaScriptUIState();
						console.log('📊 JavaScript UI State:', state);
						break;
					case 'quit':
						console.log('👋 Exiting interactive mode...');
						rl.close();
						return;
					default:
						console.log('❌ Unknown command. Type "quit" to exit.');
				}

				askQuestion();
			});
		};

		askQuestion();
	}

	cleanup() {
		if (this.swiftBridge) {
			this.swiftBridge.destroy();
		}
		console.log('🧹 Swift-JS Integration Test cleaned up');
	}
}

// Main execution
async function main() {
	const test = new SwiftJSIntegrationTest();

	try {
		await test.initialize();

		// Check command line arguments
		const args = process.argv.slice(2);
		if (args.includes('--interactive') || args.includes('-i')) {
			await test.interactiveMode();
		} else {
			await test.runTests();
		}
	} catch (error) {
		console.error('❌ Test failed:', error);
		process.exit(1);
	} finally {
		test.cleanup();
	}
}

// Run if this file is executed directly
if (require.main === module) {
	main();
}

module.exports = SwiftJSIntegrationTest;
