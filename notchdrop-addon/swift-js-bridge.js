const { ipcMain, BrowserWindow } = require('electron');

class SwiftJSBridge {
	constructor() {
		this.isInitialized = false;
		this.dynamicIslandWindow = null;
		this.swiftActionHandlers = new Map();
		this.setupSwiftActionHandlers();
	}

	async initialize() {
		if (this.isInitialized) {
			console.warn('Swift-JS Bridge already initialized');
			return;
		}

		try {
			// Set up IPC handlers for Swift actions
			// Note: Primary swift:action handler is managed by main.js
			this.setupIPCHandlers();

			this.isInitialized = true;
			console.log('✅ Swift-JS Bridge initialized successfully');
		} catch (error) {
			console.error('❌ Failed to initialize Swift-JS Bridge:', error);
			throw error;
		}
	}

	setupSwiftActionHandlers() {
		// Map Swift actions to JavaScript UI control functions
		this.swiftActionHandlers.set('startRecording', async (data) => {
			// Try overlay first for reliability, then update UI
			await this.triggerOverlayRecording(data);
			this.controlJavaScriptUI('startRecording', data);
		});

		this.swiftActionHandlers.set('stopRecording', async (data) => {
			// Ensure overlay is stopped even if UI window isn't present
			await this.triggerOverlayStopRecording(data);
			this.controlJavaScriptUI('stopRecording', data);
		});

		this.swiftActionHandlers.set('pauseRecording', async (data) => {
			await this.triggerOverlayPauseRecording(data);
			this.controlJavaScriptUI('pauseRecording', data);
		});

		this.swiftActionHandlers.set('resumeRecording', async (data) => {
			await this.triggerOverlayResumeRecording(data);
			this.controlJavaScriptUI('resumeRecording', data);
		});

		this.swiftActionHandlers.set('toggleChatMode', (data) => {
			this.controlJavaScriptUI('toggleChatMode', data);
		});

		this.swiftActionHandlers.set('submitChat', (data) => {
			this.controlJavaScriptUI('submitChat', data);
		});

		this.swiftActionHandlers.set('sendChatMessageToAskAI', async (data) => {
			console.log('🎯 Swift sending chat message to AskAI:', data);
			await this.sendChatMessageToAskAI(data);
		});

		this.swiftActionHandlers.set('setAuthenticated', (data) => {
			this.controlJavaScriptUI('setAuthenticated', data);
		});

		this.swiftActionHandlers.set('expand', (data) => {
			this.controlJavaScriptUI('expand', data);
		});

		this.swiftActionHandlers.set('collapse', (data) => {
			this.controlJavaScriptUI('collapse', data);
		});

		// Enhanced overlay integration handlers
		this.swiftActionHandlers.set('triggerOverlayRecording', (data) => {
			this.triggerOverlayRecording(data);
		});

		this.swiftActionHandlers.set('triggerOverlayToggleLiveIntelligence', (data) => {
			this.triggerOverlayToggleLiveIntelligence(data);
		});
	}

	setupIPCHandlers() {
		// Check if handlers are already registered to prevent duplicates
		const registeredHandlers = new Set();

		// Helper function to safely register IPC handlers
		const safeRegisterHandler = (channel, handler) => {
			if (!registeredHandlers.has(channel)) {
				try {
					ipcMain.handle(channel, handler);
					registeredHandlers.add(channel);
					console.log(`✅ Registered IPC handler: ${channel}`);
				} catch (error) {
					if (error.message.includes('second handler')) {
						console.warn(`⚠️ Handler ${channel} already registered, skipping...`);
					} else {
						throw error;
					}
				}
			} else {
				console.warn(
					`⚠️ Handler ${channel} already registered in this session, skipping...`,
				);
			}
		};

		// Note: swift:action is handled by main.js to route to NotchDrop service
		// This bridge focuses on UI-specific handlers

		// Handle JavaScript UI state requests
		safeRegisterHandler('js:getState', async () => {
			return this.getJavaScriptUIState();
		});

		// Handle JavaScript UI control requests
		safeRegisterHandler('js:control', async (event, action, data) => {
			return await this.controlJavaScriptUI(action, data);
		});
	}

	async handleSwiftAction(action, data) {
		try {
			const handler = this.swiftActionHandlers.get(action);
			if (handler) {
				await handler(data);
				return { success: true, action, data };
			} else {
				console.warn('⚠️ No handler found for Swift action:', action);
				return { success: false, error: 'No handler found' };
			}
		} catch (error) {
			console.error('❌ Error handling Swift action:', error);
			return { success: false, error: error.message };
		}
	}

	async controlJavaScriptUI(action, data) {
		try {
			console.log('🎯 Controlling JavaScript UI:', action, data);

			// Find the Dynamic Island window
			const dynamicIslandWindow = this.findDynamicIslandWindow();
			if (!dynamicIslandWindow) {
				console.warn('⚠️ Dynamic Island window not found');
				return { success: false, error: 'Dynamic Island window not found' };
			}

			// Send action to JavaScript UI
			dynamicIslandWindow.webContents.send('swift:control', { action, data });

			return { success: true, action, data };
		} catch (error) {
			console.error('❌ Error controlling JavaScript UI:', error);
			return { success: false, error: error.message };
		}
	}

	findDynamicIslandWindow() {
		// Find the window that contains the Dynamic Island UI
		const windows = BrowserWindow.getAllWindows();
		for (const window of windows) {
			if (window.webContents && !window.isDestroyed()) {
				// Check if this window has the Dynamic Island UI
				// You might need to add a specific identifier to the window
				const title = window.getTitle();
				if (title.includes('Dynamic Island') || title.includes('NotchDrop')) {
					return window;
				}
			}
		}
		return null;
	}

	getJavaScriptUIState() {
		const dynamicIslandWindow = this.findDynamicIslandWindow();
		if (dynamicIslandWindow) {
			// Request state from JavaScript UI
			dynamicIslandWindow.webContents.send('swift:getState');
			return { success: true, message: 'State request sent' };
		}
		return { success: false, error: 'Dynamic Island window not found' };
	}

	// Method to be called from Swift side
	onSwiftAction(action, data) {
		console.log('🔄 Swift action received via bridge:', action, data);
		this.handleSwiftAction(action, data);
	}

	// Enhanced overlay integration methods
	async triggerOverlayRecording(data) {
		try {
			console.log('🎤 Triggering overlay recording from Swift-JS bridge');

			// Check if we're in main process or renderer process
			try {
				// Try to use ipcRenderer (renderer process)
				const { ipcRenderer } = require('electron');
				if (ipcRenderer) {
					const result = await ipcRenderer.invoke('overlay-start-recording');
					console.log('✅ Overlay recording result:', result);
				}
			} catch (e) {
				// ipcRenderer not available, we're in main process
				console.log('Running in main process, using direct window communication');

				// Main process approach - find overlay window and send command directly
				const { BrowserWindow } = require('electron');
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', {
								action: 'startRecording',
							});
							console.log('✅ Overlay recording command sent directly to window');
							break;
						}
					}
				}
			}

			// Also control the JavaScript UI
			await this.controlJavaScriptUI('startRecording', data);

			return { success: true };
		} catch (error) {
			console.error('❌ Error triggering overlay recording:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayStopRecording(data) {
		try {
			console.log('⏹️ Triggering overlay stop recording from Swift-JS bridge');

			try {
				const { ipcRenderer } = require('electron');
				if (ipcRenderer) {
					const result = await ipcRenderer.invoke(
						'notchdrop:triggerOverlayStopRecording',
					);
					console.log('✅ Overlay stop recording result:', result);
				}
			} catch (e) {
				console.log('Running in main process, using direct window communication');
				const { BrowserWindow } = require('electron');
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', { action: 'stopRecording' });
							console.log('✅ Overlay stop command sent directly to window');
							break;
						}
					}
				}
			}

			return { success: true };
		} catch (error) {
			console.error('❌ Error triggering overlay stop recording:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayPauseRecording(data) {
		try {
			console.log('⏸️ Triggering overlay pause recording from Swift-JS bridge');

			try {
				const { ipcRenderer } = require('electron');
				if (ipcRenderer) {
					const result = await ipcRenderer.invoke(
						'notchdrop:triggerOverlayPauseRecording',
					);
					console.log('✅ Overlay pause recording result:', result);
				}
			} catch (e) {
				console.log('Running in main process, using direct window communication');
				const { BrowserWindow } = require('electron');
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', {
								action: 'pauseRecording',
							});
							console.log('✅ Overlay pause command sent directly to window');
							break;
						}
					}
				}
			}

			return { success: true };
		} catch (error) {
			console.error('❌ Error triggering overlay pause recording:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayResumeRecording(data) {
		try {
			console.log('▶️ Triggering overlay resume recording from Swift-JS bridge');

			try {
				const { ipcRenderer } = require('electron');
				if (ipcRenderer) {
					const result = await ipcRenderer.invoke(
						'notchdrop:triggerOverlayResumeRecording',
					);
					console.log('✅ Overlay resume recording result:', result);
				}
			} catch (e) {
				console.log('Running in main process, using direct window communication');
				const { BrowserWindow } = require('electron');
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', {
								action: 'resumeRecording',
							});
							console.log('✅ Overlay resume command sent directly to window');
							break;
						}
					}
				}
			}

			return { success: true };
		} catch (error) {
			console.error('❌ Error triggering overlay resume recording:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayToggleLiveIntelligence(data) {
		try {
			console.log('🧠 Triggering overlay toggle live intelligence from Swift-JS bridge');

			// Check if we're in main process or renderer process
			try {
				// Try to use ipcRenderer (renderer process)
				const { ipcRenderer } = require('electron');
				if (ipcRenderer) {
					const result = await ipcRenderer.invoke('overlay-toggle-live-intelligence');
					console.log('✅ Overlay toggle live intelligence result:', result);
				}
			} catch (e) {
				// ipcRenderer not available, we're in main process
				console.log('Running in main process, using direct window communication');

				// Main process approach - find overlay window and send command directly
				const { BrowserWindow } = require('electron');
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', {
								action: 'toggleLiveIntelligence',
							});
							console.log(
								'✅ Overlay toggle live intelligence command sent directly to window',
							);
							break;
						}
					}
				}
			}

			// Also control the JavaScript UI
			await this.controlJavaScriptUI('startRecording', data);

			return { success: true };
		} catch (error) {
			console.error('❌ Error triggering overlay toggle live intelligence:', error);
			return { success: false, error: error.message };
		}
	}

	findOverlayWindow() {
		// Find the overlay window
		const windows = BrowserWindow.getAllWindows();
		for (const window of windows) {
			if (window.webContents && !window.isDestroyed()) {
				const title = window.getTitle();
				if (title.includes('Overlay') || title.includes('Live Intelligence')) {
					return window;
				}
			}
		}
		return null;
	}

	// Send chat message to AskAI window using the same event as Dynamic Island
	async sendChatMessageToAskAI(chatMessage) {
		try {
			console.log('🚀 Sending chat message from NotchDrop to AskAI:', chatMessage);

			// Use the same IPC event that Dynamic Island uses
			const { ipcRenderer } = require('electron');
			if (ipcRenderer && ipcRenderer.invoke) {
				const result = await ipcRenderer.invoke('send-chat-message-to-askai', chatMessage);
				console.log('📥 AskAI response:', result);
				return result;
			} else {
				console.error('❌ ipcRenderer not available in NotchDrop context');
				return { success: false, error: 'IPC not available' };
			}
		} catch (error) {
			console.error('❌ Error sending chat message to AskAI from NotchDrop:', error);
			return { success: false, error: error.message };
		}
	}

	// Cleanup
	destroy() {
		this.isInitialized = false;
		this.swiftActionHandlers.clear();
		console.log('🧹 Swift-JS Bridge destroyed');
	}
}

// Create singleton instance
const swiftJSBridge = new SwiftJSBridge();

// Export both the class and singleton instance
module.exports = SwiftJSBridge;
module.exports.bridge = swiftJSBridge;
