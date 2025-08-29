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
		this.swiftActionHandlers.set('startRecording', (data) => {
			this.controlJavaScriptUI('startRecording', data);
		});

		this.swiftActionHandlers.set('stopRecording', (data) => {
			this.controlJavaScriptUI('stopRecording', data);
		});

		this.swiftActionHandlers.set('pauseRecording', (data) => {
			this.controlJavaScriptUI('pauseRecording', data);
		});

		this.swiftActionHandlers.set('resumeRecording', (data) => {
			this.controlJavaScriptUI('resumeRecording', data);
		});

		this.swiftActionHandlers.set('toggleChatMode', (data) => {
			this.controlJavaScriptUI('toggleChatMode', data);
		});

		this.swiftActionHandlers.set('submitChat', (data) => {
			this.controlJavaScriptUI('submitChat', data);
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
		// Handle Swift action events
		ipcMain.handle('swift:action', async (event, action, data) => {
			console.log('🔄 Swift action received:', action, data);
			return await this.handleSwiftAction(action, data);
		});

		// Handle JavaScript UI state requests
		ipcMain.handle('js:getState', async () => {
			return this.getJavaScriptUIState();
		});

		// Handle JavaScript UI control requests
		ipcMain.handle('js:control', async (event, action, data) => {
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
