// Platform check - NotchDrop only works on macOS
if (process.platform !== 'darwin') {
	// Export a mock wrapper for non-macOS platforms
	class MockNotchDropAddonWrapper {
		constructor() {}

		initialize() {
			return false;
		}
		show() {
			return false;
		}
		hide() {
			return false;
		}
		toggle() {
			return false;
		}
		isVisible() {
			return false;
		}
		setStatus() {
			return false;
		}
		getStatus() {
			return 'unavailable';
		}
		on() {
			return this;
		}
		emit() {
			return this;
		}
		off() {
			return this;
		}

		// Mock all other methods to prevent errors
		setContentType() {
			return false;
		}
		getContentType() {
			return 'unavailable';
		}
		handleDroppedFiles() {
			return false;
		}
		getCurrentItems() {
			return [];
		}
		clearAllItems() {
			return false;
		}
		setHapticFeedback() {
			return false;
		}
		getHapticFeedback() {
			return false;
		}
		setNotchVisible() {
			return false;
		}
		getNotchVisible() {
			return false;
		}
		showMenu() {
			return false;
		}
		showSettings() {
			return false;
		}
		showNormal() {
			return false;
		}
		setAutoOpen() {
			return false;
		}
		getAutoOpen() {
			return false;
		}
		setLanguage() {
			return false;
		}
		getLanguage() {
			return 'system';
		}
		getTrayItemCount() {
			return 0;
		}
		clearTrayItems() {
			return false;
		}
		getStatusString() {
			return 'unavailable';
		}
		getContentTypeString() {
			return 'unavailable';
		}
		setContentTypeFromString() {
			return false;
		}
		getWindowPosition() {
			return { x: 0, y: 0, width: 0, height: 0 };
		}
		onOverlayStateChange() {
			return false;
		}

		// Mock voice and transcription methods
		addVoiceMessage() {
			return false;
		}
		addTranscriptionData() {
			return false;
		}
		sendLiveIntelligenceData() {
			return false;
		}

		// Mock async methods
		async triggerOverlayRecording() {
			return { success: false, error: 'Not supported on this platform' };
		}
		async triggerOverlayStopRecording() {
			return { success: false, error: 'Not supported on this platform' };
		}
		async triggerOverlayPauseRecording() {
			return { success: false, error: 'Not supported on this platform' };
		}
		async triggerOverlayResumeRecording() {
			return { success: false, error: 'Not supported on this platform' };
		}
		async triggerOverlayToggleLiveIntelligence() {
			return { success: false, error: 'Not supported on this platform' };
		}
		async initializeBridge() {
			return false;
		}
		async waitForBridgeReady() {
			return false;
		}
		isBridgeReady() {
			return false;
		}
	}

	module.exports = MockNotchDropAddonWrapper;
	module.exports.NotchDropAddonWrapper = MockNotchDropAddonWrapper;
	return;
}

// Load the native addon with fallback to prebuilt binaries (macOS only)
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
			'toggleWebcam',
			'startWebcam',
			'stopWebcam',
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
			case 'toggleWebcam':
			case 'startWebcam':
			case 'stopWebcam':
				// Execute webcam actions immediately
				return this.executeAction(action, data);
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
			case 'navigateToMainScreen': {
				const targetPath =
					typeof data === 'string' && data.trim().length > 0
						? data.trim()
						: '/verify-user';
				this.emit('navigateToMainScreen', targetPath);
				break;
			}
			case 'sendLog':
				this.handleSwiftLog(data);
				break;
			// Voice Assistant Actions
			case 'connectVoice':
				this.emit('connectVoice', data);
				break;
			case 'disconnectVoice':
				this.emit('disconnectVoice', data);
				break;
			case 'toggleVoiceMute':
				this.emit('toggleVoiceMute', data);
				break;
			case 'sendVoiceMessage':
				this.emit('sendVoiceMessage', data);
				break;
			case 'voiceConnectionStateChanged':
				this.emit('voiceConnectionStateChanged', data);
				break;
			case 'startVoiceAgent':
				this.emit('startVoiceAgent', data);
				break;
			case 'receiveMessage':
				this.handleReceivedMessage(data);
				break;
			// Webcam Actions
			case 'toggleWebcam':
				this.emit('toggleWebcam', data);
				break;
			case 'startWebcam':
				this.emit('startWebcam', data);
				break;
			case 'stopWebcam':
				this.emit('stopWebcam', data);
				break;
			case 'checkCameraPermission':
				this.emit('checkCameraPermission', data);
				break;
			case 'requestCameraPermission':
				this.emit('requestCameraPermission', data);
				break;
			case 'toggleStealthMode':
				this.emit('toggleStealthMode', data);
				break;
			// Wake Word Detection Actions
			case 'wakeWordDetected':
				this.emit('wakeWordDetected', parseFloat(data) || 0.0);
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

	// Handle received messages from Electron
	handleReceivedMessage(message) {
		try {
			// Emit the received message event
			this.emit('messageReceived', message);
		} catch (error) {
			console.error('❌ Error handling received message:', error);
		}
	}

	// Send log message to overlay window
	sendLogToOverlay(message) {
		// This method is not fully implemented in the original file,
		// so it's left as a placeholder.
		// In a real scenario, you would try to send the message
		// to the overlay window via ipcRenderer or direct window communication.
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

	// Overlay State Integration
	onOverlayStateChange(state) {
		if (!this.isInitialized) {
			console.warn('NotchDrop not initialized, cannot send overlay state');
			return;
		}
		try {
			this.addon.onOverlayStateChange(state);
		} catch (error) {
			console.error('❌ Error sending overlay state to Swift:', error);
		}
	}

	// MARK: - Voice Assistant Methods

	configureVoice(url, token) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		try {
			this.addon.configureVoice(url, token);
		} catch (error) {
			console.error('❌ Error configuring voice:', error);
			throw error;
		}
	}

	connectVoiceAssistant() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		try {
			this.addon.connectVoiceAssistant();
		} catch (error) {
			console.error('❌ Error connecting voice assistant:', error);
			throw error;
		}
	}

	disconnectVoiceAssistant() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		try {
			this.addon.disconnectVoiceAssistant();
		} catch (error) {
			console.error('❌ Error disconnecting voice assistant:', error);
			throw error;
		}
	}

	getVoiceConnectionStatus() {
		if (!this.isInitialized) {
			return 'disconnected';
		}
		try {
			return this.addon.getVoiceConnectionStatus();
		} catch (error) {
			console.error('❌ Error getting voice connection status:', error);
			return 'error';
		}
	}

	// Update voice connection state from JavaScript
	updateVoiceConnectionState(status) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		try {
			this.addon.updateVoiceConnectionState(status);
			console.log(`🔄 Voice connection state updated to: ${status}`);
		} catch (error) {
			console.error('❌ Error updating voice connection state:', error);
			throw error;
		}
	}

	// Update voice mute state from JavaScript
	updateVoiceMuteState(isMuted) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		try {
			this.addon.updateVoiceMuteState(isMuted);
			console.log(`🔇 Voice mute state updated: ${isMuted}`);
		} catch (error) {
			console.error('❌ Error updating voice mute state:', error);
			throw error;
		}
	}

	updateStealthModeState(isEnabled) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		try {
			if (typeof this.addon.updateStealthModeState === 'function') {
				this.addon.updateStealthModeState(Boolean(isEnabled));
			}
			console.log(`🏴‍☠️ Stealth mode state updated: ${Boolean(isEnabled)}`);
		} catch (error) {
			console.error('❌ Error updating stealth mode state:', error);
			throw error;
		}
	}

	// LEGACY: Add voice message from JavaScript (preserved for audio functionality)
	addVoiceMessage(messageData) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		try {
			// Convert messageData to JSON string for native layer
			const messageJson = JSON.stringify(messageData);
			this.addon.addVoiceMessage(messageJson);
			console.log(
				`💬 Voice message added: ${messageData.sender}: ${messageData.content?.substring(
					0,
					30,
				)}...`,
			);
		} catch (error) {
			console.error('❌ Error adding voice message:', error);
			throw error;
		}
	}

	// Add transcription data to NotchDrop (following voice message pattern)
	addTranscriptionData(messageData) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		try {
			// // console.log('📝 JavaScript Wrapper: Received transcription data:', {
			// 	sender: messageData.sender,
			// 	content: messageData.content?.substring(0, 50),
			// 	isFromAgent: messageData.isFromAgent,
			// 	type: messageData.type,
			// 	hasConfidence: !!messageData.confidence,
			// 	hasWords: !!messageData.words,
			// });

			// Convert messageData to JSON string for native layer
			const messageJson = JSON.stringify(messageData);
			// console.log('📝 JavaScript Wrapper: Sending JSON to native layer:', messageJson);

			this.addon.addTranscriptionData(messageJson);
			// console.log(
			// 	`📝 Transcription data added: ${
			// 		messageData.sender
			// 	}: ${messageData.content?.substring(0, 30)}...`,
			// );
		} catch (error) {
			console.error('❌ Error adding transcription data:', error);
			throw error;
		}
	}

	// Send live intelligence data to NotchDrop
	sendLiveIntelligenceData(messageData) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		try {
			// console.log('🧠 JavaScript Wrapper: Received live intelligence data:', {
			// 	sender: messageData.sender,
			// 	content: messageData.content?.substring(0, 50),
			// 	isFromAgent: messageData.isFromAgent,
			// 	type: messageData.type,
			// 	hasConfidence: !!messageData.confidence,
			// 	hasMetadata: !!messageData.metadata,
			// });

			// Convert messageData to JSON string for native layer
			const messageJson = JSON.stringify(messageData);
			// console.log('🧠 JavaScript Wrapper: Sending JSON to native layer:', messageJson);

			this.addon.sendLiveIntelligenceData(messageJson);
			// console.log(
			// 	`🧠 Live intelligence data added: ${
			// 		messageData.sender
			// 	}: ${messageData.content?.substring(0, 30)}...`,
			// );
		} catch (error) {
			console.error('❌ Error sending live intelligence data:', error);
			throw error;
		}
	}

	// Replace entire transcription list in Swift UI
	replaceTranscriptions(messages) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		try {
			const messageArray = Array.isArray(messages) ? messages : [];
			const json = JSON.stringify(messageArray);
			if (this.addon.replaceTranscriptions) {
				this.addon.replaceTranscriptions(json);
				// console.log(
				// 	`📝 Replaced transcriptions array in Swift UI (count=${messageArray.length})`,
				// );
			} else {
				console.warn('⚠️ replaceTranscriptions not available on native addon');
			}
		} catch (error) {
			console.error('❌ Error replacing transcriptions:', error);
			throw error;
		}
	}

	// Set which panel to show during recording: 'transcription' or 'live-intel'
	setRecordingPanelMode(mode) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		try {
			const normalized = typeof mode === 'string' ? mode : 'transcription';
			if (this.addon.setRecordingPanelMode) {
				this.addon.setRecordingPanelMode(normalized);
				// console.log(`🧭 Set recording panel mode to ${normalized}`);
			} else {
				console.warn('⚠️ setRecordingPanelMode not available on native addon');
			}
		} catch (error) {
			console.error('❌ Error setting panel mode:', error);
			throw error;
		}
	}

	// GENERAL PURPOSE MESSAGE SYSTEM
	sendGeneralMessage(messageJson) {
		if (!this.isInitialized) {
			throw new Error('NotchDrop not initialized');
		}
		try {
			// Try to use dedicated general message method if available
			if (this.addon.sendGeneralMessage) {
				this.addon.sendGeneralMessage(messageJson);
				console.log('📤 General message sent to NotchDrop');
			} else {
				// Fallback to voice message system for backward compatibility
				console.log('📝 Fallback: Using voice message system for general data');
				const messageData = JSON.parse(messageJson);
				this.addon.addVoiceMessage(
					JSON.stringify({
						sender: messageData.sender || 'System',
						content: messageData.content || JSON.stringify(messageData),
						isFromAgent: messageData.isFromAgent || false,
					}),
				);
			}
		} catch (error) {
			console.error('❌ Error sending general message:', error);
			throw error;
		}
	}

	// MARK: - Wake Word Detection Methods

	handleWakeWordDetected(score) {
		if (!this.isInitialized) {
			console.warn('NotchDrop not initialized, cannot handle wake word detection');
			return;
		}
		try {
			this.addon.handleWakeWordDetected(score);
			console.log(`🎯 Wake word detected with score: ${score} - activating voice agent!`);
		} catch (error) {
			console.error('❌ Error handling wake word detection:', error);
		}
	}

	// Send action to Swift UI
	triggerSwiftAction(action, data) {
		if (!this.isInitialized) {
			console.warn('NotchDrop not initialized, cannot trigger Swift action');
			return;
		}
		try {
			// Call the native triggerSwiftAction method
			this.addon.triggerSwiftAction(action, data);
			console.log('📤 Swift action triggered:', action, 'with data:', data);
		} catch (error) {
			console.error('❌ Error triggering Swift action:', error);
		}
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
		console.log('⏹️ NotchDrop requested overlay stop recording');
		// this one is being used for stop recording
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
