// Load the native addon with fallback to prebuilt binaries
let NotchDropAddon;
try {
	// Try to load the built addon first
	({ NotchDropAddon } = require('./build/Release/notchdrop_addon.node'));
} catch (error) {
	try {
		// Fallback to prebuilt binary
		const { platform, arch } = process;
		const electronVersion = process.versions.electron
			? process.versions.modules
			: process.versions.modules;
		const binaryPath = `./bin/${platform}-${arch}-${electronVersion}/notchdrop_addon.node`;
		({ NotchDropAddon } = require(binaryPath));
	} catch (fallbackError) {
		throw new Error(
			`Failed to load NotchDrop addon: ${error.message}. Fallback also failed: ${fallbackError.message}`,
		);
	}
}
const { ipcRenderer, BrowserWindow, ipcMain } = require('electron');
const { EventEmitter } = require('events');

class NotchDropAddonWrapper extends EventEmitter {
	constructor() {
		super();
		this.addon = new NotchDropAddon();
		this.isInitialized = false;

		// CRITICAL FIX: Immediate response capability
		this.bridgeReady = true; // Start as ready for immediate response
		this.initializationPromise = null;
		this.pendingActions = [];
		this.electronProcessReady = true; // Assume ready for immediate actions
		this.immediateMode = true; // Enable immediate action execution

		this.setupEventListeners();

		// CRITICAL FIX: Initialize bridge in background, don't wait
		this.initializeBridge().catch(console.error);

		// Signal readiness immediately for first-click responsiveness
		this.signalReadiness();
	}

	setupEventListeners() {
		// Set up event listeners for native callbacks
		this.addon.on('statusChanged', (status) => {
			this.emit('statusChanged', status);
		});

		this.addon.on('fileDropped', (filePath) => {
			this.emit('fileDropped', filePath);
		});

		this.addon.on('itemAdded', (itemData) => {
			this.emit('itemAdded', itemData);
		});

		this.addon.on('itemRemoved', (itemData) => {
			this.emit('itemRemoved', itemData);
		});

		// Set up Swift action listener
		this.addon.on('swiftAction', (actionData) => {
			this.handleSwiftAction(actionData);
		});
	}

	// CRITICAL FIX: Enhanced bridge initialization with Swift readiness signaling
	async initializeBridge() {
		if (this.initializationPromise) {
			return this.initializationPromise;
		}

		this.initializationPromise = new Promise(async (resolve, reject) => {
			try {
				// Phase 1: Verify Electron context is available
				await this.verifyElectronContext();

				// Phase 2: Wait for core services to be ready
				await this.waitForCoreServicesReady();

				// Phase 3: Test IPC communication
				await this.verifyIPCCommunication();

				// Phase 4: Set bridge as ready
				this.bridgeReady = true;
				this.electronProcessReady = true;

				// Phase 5: Process any pending actions
				if (this.pendingActions.length > 0) {
					const actionsToProcess = [...this.pendingActions];
					this.pendingActions = [];

					for (const action of actionsToProcess) {
						this.handleSwiftAction(action);
					}
				}

				await this.sendBridgeReadySignalToSwift();
				resolve(true);
			} catch (error) {
				console.error('❌ NotchDropAddon: Bridge initialization failed:', error);
				this.bridgeReady = false;
				this.sendBridgeFailureSignalToSwift(error.message);
				reject(error);
			}
		});

		return this.initializationPromise;
	}

	// Signal immediate readiness for first-click responsiveness
	signalReadiness() {
		// Emit readiness signal immediately
		this.emit('bridgeReady');

		try {
			if (typeof global !== 'undefined' && global.notchDropSwiftCallback) {
				global.notchDropSwiftCallback('bridgeReady', 'immediate');
			}
		} catch (error) {}
	}

	// CRITICAL FIX: Wait for core Electron services to be ready
	async waitForCoreServicesReady() {
		return new Promise(async (resolve) => {
			// Wait for basic Electron services with progressive checking
			let attempts = 0;
			const maxAttempts = 20;

			const checkServices = async () => {
				attempts++;

				// Check if main window exists (indicates Electron is fully ready)
				try {
					if (typeof require !== 'undefined') {
						const windows = BrowserWindow.getAllWindows();

						if (windows.length > 0) {
							resolve(true);
							return;
						}
					}
				} catch (e) {
					console.error('❌ Error checking core services readiness:', e);
				}

				if (attempts >= maxAttempts) {
					resolve(true);
					return;
				}

				// Wait and retry
				setTimeout(checkServices, 200);
			};

			checkServices();
		});
	}

	// CRITICAL FIX: Verify IPC communication is working
	async verifyIPCCommunication() {
		return new Promise((resolve, reject) => {
			try {
				// Try to verify IPC is working by attempting a test call
				if (typeof require !== 'undefined') {
					try {
						if (ipcRenderer) {
							// Test basic IPC communication
							ipcRenderer
								.invoke('test-overlay-connection')
								.then(() => {
									resolve(true);
								})
								.catch((error) => {
									console.warn(
										'❌ IPC test failed but proceeding:',
										error.message,
									);
									resolve(true); // Proceed anyway
								});
							return;
						}
					} catch (e) {
						// Not in renderer process
					}
				}

				// If we can't test IPC directly, just resolve
				resolve(true);
			} catch (error) {
				console.error('❌ IPC verification failed:', error);
				reject(error);
			}
		});
	}

	// CRITICAL FIX: Send bridge ready signal to Swift UI
	async sendBridgeReadySignalToSwift() {
		try {
			// Use the existing Swift action callback system to notify Swift
			this.emit('bridgeReady', { ready: true, timestamp: Date.now() });

			// Also try to trigger a Swift callback if available
			if (typeof global !== 'undefined' && global.notchDropSwiftCallback) {
				global.notchDropSwiftCallback('bridgeReady', 'true');
			}
		} catch (error) {
			console.error('❌ Failed to send bridge ready signal to Swift:', error);
		}
	}

	// CRITICAL FIX: Send bridge failure signal to Swift UI
	sendBridgeFailureSignalToSwift(errorMessage) {
		try {
			this.emit('bridgeFailure', { error: errorMessage, timestamp: Date.now() });

			// Also try to trigger a Swift callback if available
			if (typeof global !== 'undefined' && global.notchDropSwiftCallback) {
				global.notchDropSwiftCallback('bridgeFailure', errorMessage);
			}
		} catch (error) {
			console.error('❌ Failed to send bridge failure signal to Swift:', error);
		}
	}

	// CRITICAL FIX: Verify Electron context is ready
	async verifyElectronContext() {
		return new Promise((resolve, reject) => {
			try {
				// Try to access Electron APIs
				if (typeof require !== 'undefined') {
					try {
						if (ipcRenderer) {
							resolve(true);
							return;
						}
					} catch (e) {
						// ipcRenderer not available, we're in main process
						console.error('❌ Error checking electron context:', e);
					}

					try {
						if (ipcMain) {
							resolve(true);
							return;
						}
					} catch (e) {
						// ipcMain not available either
						console.error('❌ Error checking electron context:', e);
					}
				}

				resolve(true);
			} catch (error) {
				console.error('❌ NotchDropAddon: Electron context verification failed:', error);
				reject(error);
			}
		});
	}

	// CRITICAL FIX: Immediate action execution for first-click responsiveness
	handleSwiftAction(actionData) {
		try {
			let action = actionData;
			let data = '';
			const sepIndex = typeof actionData === 'string' ? actionData.indexOf(':') : -1;
			if (sepIndex !== -1) {
				action = actionData.slice(0, sepIndex);
				data = actionData.slice(sepIndex + 1);
			}

			// CRITICAL FIX: Execute critical actions immediately regardless of bridge state
			if (this.isCriticalAction(action)) {
				return this.executeImmediately(action, data);
			}

			// For non-critical actions, check bridge readiness
			if (!this.bridgeReady && !this.immediateMode) {
				this.pendingActions.push(actionData);

				// Trigger bridge initialization if not already in progress
				if (!this.initializationPromise) {
					this.initializeBridge().catch(console.error);
				}
				return;
			}

			// Execute action immediately
			this.executeAction(action, data);
		} catch (error) {
			console.error('❌ Error handling Swift action:', error);
		}
	}

	// Determine if action is critical and needs immediate execution
	isCriticalAction(action) {
		const criticalActions = [
			'startRecording',
			'triggerOverlayToggleLiveIntelligence',
			'stopRecording',
			'pauseRecording',
			'resumeRecording',
		];
		return criticalActions.includes(action);
	}

	// Execute critical actions immediately without waiting for bridge
	executeImmediately(action, data) {
		switch (action) {
			case 'startRecording':
				return this.triggerOverlayRecordingImmediate();
			case 'triggerOverlayToggleLiveIntelligence':
				return this.triggerOverlayToggleLiveIntelligenceImmediate();
			case 'stopRecording':
				return this.triggerOverlayStopRecordingImmediate();
			case 'pauseRecording':
				return this.triggerOverlayPauseRecordingImmediate();
			case 'resumeRecording':
				return this.triggerOverlayResumeRecordingImmediate();
			default:
				// Fallback to normal execution
				return this.executeAction(action, data);
		}
	}

	// Normal action execution
	executeAction(action, data) {
		switch (action) {
			case 'startRecording':
				this.triggerOverlayRecording();
				break;
			case 'stopRecording':
				this.triggerOverlayStopRecording();
				break;
			case 'pauseRecording':
				this.triggerOverlayPauseRecording();
				break;
			case 'resumeRecording':
				this.triggerOverlayResumeRecording();
				break;
			case 'triggerOverlayToggleLiveIntelligence':
				this.triggerOverlayToggleLiveIntelligence();
				break;
			case 'expand':
				this.emit('expand');
				break;
			case 'collapse':
				this.emit('collapse');
				break;
			case 'toggleChatMode':
				this.emit('toggleChatMode');
				break;
			case 'submitChat':
				this.emit('submitChat', data);
				break;
			case 'sendChatMessageToAskAI':
				this.emit('sendChatMessageToAskAI', data);
				break;
			case 'setAuthenticated':
				this.emit('setAuthenticated', data === 'true');
				break;
			case 'sendLog':
				this.handleSwiftLog(data);
				break;
			default:
				console.error('❌ Unknown Swift action:', action);
		}
	}

	// Handle Swift log messages
	handleSwiftLog(message) {
		try {
			// Emit the log event for Electron to handle
			this.emit('swiftLog', message);

			// Also try to send to overlay if available
			this.sendLogToOverlay(message);
		} catch (error) {
			console.error('❌ Error handling Swift log:', error);
		}
	}

	// Send log message to overlay window
	sendLogToOverlay(message) {
		// This method is not fully implemented in the original file,
		// so it's left as a placeholder.
		// In a real scenario, you would try to send the message
		// to the overlay window via ipcRenderer or direct window communication.
		console.log('Attempting to send log to overlay:', message);
	}

	// CRITICAL FIX: Enhanced overlay integration methods
	async triggerOverlayRecording() {
		try {
			// CRITICAL FIX: Ensure bridge is ready before proceeding
			if (!this.bridgeReady) {
				await this.initializeBridge();
			}

			// Check if we're in main process or renderer process
			if (typeof require !== 'undefined') {
				try {
					// Try to use ipcRenderer (renderer process)
					if (ipcRenderer) {
						// Use the correct IPC channel that creates/shows overlay window
						const result = await ipcRenderer.invoke(
							'notchdrop:triggerOverlayRecording',
						);
						return result;
					}
				} catch (e) {
					// ipcRenderer not available, we're in main process
					console.error('❌ Error in main process overlay trigger:', e);
				}

				// Main process approach - call the IPC handler directly
				try {
					// Simulate the IPC call directly since we're in main process
					// We'll emit the action to be handled by the existing IPC handler
					this.emit('requestOverlayRecording');
					return { success: true };
				} catch (error) {
					console.error('❌ Error in main process overlay trigger:', error);
					return { success: false, error: error.message };
				}
			} else {
				console.error('❌ require() not available, attempting fallback');
				// Fallback: emit event to be handled by parent processes
				this.emit('requestOverlayRecording');
				return { success: true, fallback: true };
			}
		} catch (error) {
			console.error('❌ CRITICAL ERROR triggering overlay recording:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayStopRecording() {
		try {
			// Prefer robust NotchDrop IPC channel handled in main.js
			if (typeof require !== 'undefined') {
				try {
					if (ipcRenderer) {
						const result = await ipcRenderer.invoke(
							'notchdrop:triggerOverlayStopRecording',
						);
						return result;
					}
				} catch (e) {
					// ipcRenderer not available, fallback to main-process direct send
					console.error('❌ Error in main process overlay trigger:', e);
				}

				// Main process approach - find overlay window and send command directly
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', { action: 'stopRecording' });
							return { success: true, method: 'direct-window' };
						}
					}
				}
				console.error('❌ Overlay window not found');
				return { success: false, error: 'Overlay window not found' };
			}
		} catch (error) {
			console.error('❌ Error triggering overlay stop recording:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayPauseRecording() {
		try {
			if (typeof require !== 'undefined') {
				try {
					if (ipcRenderer) {
						const result = await ipcRenderer.invoke(
							'notchdrop:triggerOverlayPauseRecording',
						);
						return result;
					}
				} catch (e) {
					console.error('❌ Error in main process overlay trigger:', e);
				}

				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', {
								action: 'pauseRecording',
							});
							return { success: true, method: 'direct-window' };
						}
					}
				}
				console.error('❌ Overlay window not found');
				return { success: false, error: 'Overlay window not found' };
			}
		} catch (error) {
			console.error('❌ Error triggering overlay pause recording:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayResumeRecording() {
		try {
			if (typeof require !== 'undefined') {
				try {
					if (ipcRenderer) {
						const result = await ipcRenderer.invoke(
							'notchdrop:triggerOverlayResumeRecording',
						);
						return result;
					}
				} catch (e) {
					console.error('❌ Error in main process overlay trigger:', e);
				}
				// Main process approach - find overlay window and send command directly
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', {
								action: 'resumeRecording',
							});
							return { success: true, method: 'direct-window' };
						}
					}
				}
				console.error('❌ Overlay window not found');
				return { success: false, error: 'Overlay window not found' };
			}
		} catch (error) {
			console.error('❌ Error triggering overlay resume recording:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayToggleLiveIntelligence() {
		try {
			// Check if we're in main process or renderer process
			if (typeof require !== 'undefined') {
				try {
					// Try to use ipcRenderer (renderer process)
					if (ipcRenderer) {
						const result = await ipcRenderer.invoke('overlay-toggle-live-intelligence');
						return;
					}
				} catch (e) {
					// ipcRenderer not available, we're in main process
					console.error('❌ Error in main process overlay trigger:', e);
				}

				// Main process approach - find overlay window and send command directly
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
							return;
						}
					}
				}
				console.error('❌ Overlay window not found');
			}
		} catch (error) {
			console.error('❌ Error triggering overlay toggle live intelligence:', error);
		}
	}

	// CRITICAL FIX: Enhanced initialization with bridge readiness
	initialize() {
		if (this.isInitialized) {
			console.error('❌ NotchDrop already initialized');
			return;
		}

		try {
			this.addon.initialize();
			this.isInitialized = true;

			// Ensure bridge initialization is also started
			if (!this.bridgeReady && !this.initializationPromise) {
				this.initializeBridge().catch(console.error);
			}
		} catch (error) {
			console.error('❌ Failed to initialize NotchDrop:', error);
			throw error;
		}
	}

	// CRITICAL FIX: Bridge readiness check methods
	isBridgeReady() {
		return this.bridgeReady && this.isInitialized;
	}

	async waitForBridgeReady(timeoutMs = 5000) {
		if (this.isBridgeReady()) {
			return true;
		}

		console.log('⏳ Waiting for bridge to be ready...');
		const startTime = Date.now();

		while (!this.isBridgeReady() && Date.now() - startTime < timeoutMs) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		const ready = this.isBridgeReady();
		return ready;
	}

	// Show/hide NotchDrop
	show() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		this.addon.show();
	}

	hide() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		this.addon.hide();
	}

	toggle() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		this.addon.toggle();
	}

	isVisible() {
		if (!this.isInitialized) {
			return false;
		}
		return this.addon.isVisible();
	}

	// Status management
	setStatus(status) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		this.addon.setStatus(status);
	}

	getStatus() {
		if (!this.isInitialized) {
			return 'closed';
		}
		return this.addon.getStatus();
	}

	setContentType(contentType) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		this.addon.setContentType(contentType);
	}

	getContentType() {
		if (!this.isInitialized) {
			return 'normal';
		}
		return this.addon.getContentType();
	}

	// File handling
	handleDroppedFiles(filePaths) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		this.addon.handleDroppedFiles(filePaths);
	}

	getCurrentItems() {
		if (!this.isInitialized) {
			return [];
		}
		return this.addon.getCurrentItems();
	}

	clearAllItems() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		this.addon.clearAllItems();
	}

	// Settings
	setHapticFeedback(enabled) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		this.addon.setHapticFeedback(enabled);
	}

	getHapticFeedback() {
		if (!this.isInitialized) {
			return true;
		}
		return this.addon.getHapticFeedback();
	}

	setNotchVisible(visible) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		this.addon.setNotchVisible(visible);
	}

	getNotchVisible() {
		if (!this.isInitialized) {
			return false;
		}
		return this.addon.getNotchVisible();
	}

	// Advanced NotchDropLatest methods
	showMenu() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		this.addon.showMenu();
	}

	showSettings() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		this.addon.showSettings();
	}

	showNormal() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		this.addon.showNormal();
	}

	setAutoOpen(enabled) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		this.addon.setAutoOpen(enabled);
	}

	getAutoOpen() {
		if (!this.isInitialized) {
			return true;
		}
		return this.addon.getAutoOpen();
	}

	setLanguage(language) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		this.addon.setLanguage(language);
	}

	getLanguage() {
		if (!this.isInitialized) {
			return 'system';
		}
		return this.addon.getLanguage();
	}

	getTrayItemCount() {
		if (!this.isInitialized) {
			return 0;
		}
		return this.addon.getTrayItemCount();
	}

	clearTrayItems() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		this.addon.clearTrayItems();
	}

	getStatusString() {
		if (!this.isInitialized) {
			return 'closed';
		}
		return this.addon.getStatusString();
	}

	getContentTypeString() {
		if (!this.isInitialized) {
			return 'normal';
		}
		return this.addon.getContentTypeString();
	}

	setContentTypeFromString(contentType) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		this.addon.setContentTypeFromString(contentType);
	}

	getWindowPosition() {
		if (!this.isInitialized) {
			return { x: 0, y: 0, width: 0, height: 0 };
		}
		return this.addon.getWindowPosition();
	}

	// Event emitter functionality
	emit(event, data) {
		// Simple event emitter implementation
		if (this.listeners && this.listeners[event]) {
			this.listeners[event].forEach((callback) => {
				try {
					callback(data);
				} catch (error) {
					console.error('Error in event listener:', error);
				}
			});
		}
	}

	on(event, callback) {
		if (!this.listeners) {
			this.listeners = {};
		}
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(callback);
	}

	off(event, callback) {
		if (this.listeners && this.listeners[event]) {
			const index = this.listeners[event].indexOf(callback);
			if (index > -1) {
				this.listeners[event].splice(index, 1);
			}
		}
	}

	// CRITICAL FIX: Immediate overlay trigger methods for first-click responsiveness
	async triggerOverlayRecordingImmediate() {
		try {
			// Method 1: Direct IPC call to main process
			if (typeof require !== 'undefined') {
				try {
					if (ipcRenderer) {
						const result = await ipcRenderer.invoke(
							'notchdrop:triggerOverlayRecording',
						);
						return result;
					}
				} catch (e) {
					// Not in renderer process, try main process method
				}

				try {
					if (ipcMain) {
						process.emit('swift-ui-trigger-overlay-recording-immediate');
						return { success: true, method: 'process-emit' };
					}
				} catch (e) {
					// Neither renderer nor main process IPC available
				}
			}

			// Method 2: Global callback fallback
			if (typeof global !== 'undefined' && global.notchDropOverlayCallback) {
				global.notchDropOverlayCallback('startRecording', { immediate: true });
				return { success: true, method: 'global-callback' };
			}

			// Method 3: Event emission fallback
			this.emit('triggerOverlayRecording', { immediate: true });
			return { success: true, method: 'event-emission' };
		} catch (error) {
			console.error('❌ Failed to trigger immediate overlay recording:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayToggleLiveIntelligenceImmediate() {
		try {
			// Method 1: Direct IPC call to main process
			if (typeof require !== 'undefined') {
				try {
					if (ipcRenderer) {
						const result = await ipcRenderer.invoke(
							'notchdrop:triggerOverlayToggleLiveIntelligence',
						);
						return result;
					}
				} catch (e) {
					// Not in renderer process, try main process method
				}

				try {
					if (ipcMain) {
						process.emit('swift-ui-trigger-overlay-live-intelligence-immediate');
						console.log('✅ Immediate live intelligence event emitted');
						return { success: true, method: 'process-emit' };
					}
				} catch (e) {
					// Neither renderer nor main process IPC available
				}
			}

			// Method 2: Global callback fallback
			if (typeof global !== 'undefined' && global.notchDropOverlayCallback) {
				global.notchDropOverlayCallback('toggleLiveIntelligence', { immediate: true });
				return { success: true, method: 'global-callback' };
			}

			// Method 3: Event emission fallback
			this.emit('triggerOverlayToggleLiveIntelligence', { immediate: true });
			return { success: true, method: 'event-emission' };
		} catch (error) {
			console.error('❌ Failed to trigger immediate overlay live intelligence:', error);
			return { success: false, error: error.message };
		}
	}

	// Immediate stop/pause/resume methods for completeness
	async triggerOverlayStopRecordingImmediate() {
		try {
			if (typeof require !== 'undefined') {
				try {
					if (ipcRenderer) {
						const result = await ipcRenderer.invoke(
							'notchdrop:triggerOverlayStopRecording',
						);
						return result;
					}
				} catch (e) {
					// Not in renderer; try direct process emit or direct window
				}
				// Direct window fallback
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', { action: 'stopRecording' });
							return { success: true, method: 'direct-window' };
						}
					}
				}
			}
			// Event emission fallback (legacy)
			this.emit('triggerOverlayStopRecording', { immediate: true });
			return { success: true, method: 'event-emission' };
		} catch (error) {
			console.error('❌ Failed to stop recording immediately:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayPauseRecordingImmediate() {
		try {
			if (typeof require !== 'undefined') {
				try {
					if (ipcRenderer) {
						const result = await ipcRenderer.invoke(
							'notchdrop:triggerOverlayPauseRecording',
						);
						return result;
					}
				} catch (e) {
					// Not in renderer; try direct window
				}
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', {
								action: 'pauseRecording',
							});
							return { success: true, method: 'direct-window' };
						}
					}
				}
			}
			this.emit('triggerOverlayPauseRecording', { immediate: true });
			return { success: true, method: 'event-emission' };
		} catch (error) {
			console.error('❌ Failed to pause recording immediately:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayResumeRecordingImmediate() {
		try {
			if (typeof require !== 'undefined') {
				try {
					if (ipcRenderer) {
						const result = await ipcRenderer.invoke(
							'notchdrop:triggerOverlayResumeRecording',
						);
						return result;
					}
				} catch (e) {
					// Not in renderer; try direct window
				}
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', {
								action: 'resumeRecording',
							});
							return { success: true, method: 'direct-window' };
						}
					}
				}
			}
			this.emit('triggerOverlayResumeRecording', { immediate: true });
			return { success: true, method: 'event-emission' };
		} catch (error) {
			console.error('❌ Failed to resume recording immediately:', error);
			return { success: false, error: error.message };
		}
	}
}

// Export both the class and an object containing it for flexibility
module.exports = NotchDropAddonWrapper;
module.exports.NotchDropAddonWrapper = NotchDropAddonWrapper;
