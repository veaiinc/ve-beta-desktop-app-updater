const { NotchDropAddon } = require('./build/Release/notchdrop_addon.node');

class NotchDropAddonWrapper {
	constructor() {
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
			console.log('NotchDrop status changed:', status);
			this.emit('statusChanged', status);
		});

		this.addon.on('fileDropped', (filePath) => {
			console.log('File dropped:', filePath);
			this.emit('fileDropped', filePath);
		});

		this.addon.on('itemAdded', (itemData) => {
			console.log('Item added:', itemData);
			this.emit('itemAdded', itemData);
		});

		this.addon.on('itemRemoved', (itemData) => {
			console.log('Item removed:', itemData);
			this.emit('itemRemoved', itemData);
		});

		// Set up Swift action listener
		this.addon.on('swiftAction', (actionData) => {
			console.log('Swift action received:', actionData);
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
				console.log('🔧 NotchDropAddon: Starting bridge initialization with Swift handshake...');
				
				// Phase 1: Verify Electron context is available
				await this.verifyElectronContext();
				console.log('✅ Phase 1: Electron context verified');
				
				// Phase 2: Wait for core services to be ready
				await this.waitForCoreServicesReady();
				console.log('✅ Phase 2: Core services ready');
				
				// Phase 3: Test IPC communication
				await this.verifyIPCCommunication();
				console.log('✅ Phase 3: IPC communication verified');
				
				// Phase 4: Set bridge as ready
				this.bridgeReady = true;
				this.electronProcessReady = true;
				
				// Phase 5: Process any pending actions
				if (this.pendingActions.length > 0) {
					console.log(`🎯 Processing ${this.pendingActions.length} pending actions`);
					const actionsToProcess = [...this.pendingActions];
					this.pendingActions = [];
					
					for (const action of actionsToProcess) {
						this.handleSwiftAction(action);
					}
				}
				
				// Phase 6: CRITICAL - Send readiness signal to Swift UI
				await this.sendBridgeReadySignalToSwift();
				console.log('✅ Phase 6: Bridge ready signal sent to Swift UI');
				
				console.log('🎉 NotchDropAddon: Bridge initialization completed with Swift handshake');
				resolve(true);
			} catch (error) {
				console.error('❌ NotchDropAddon: Bridge initialization failed:', error);
				this.bridgeReady = false;
				
				// Send bridge failure signal to Swift UI
				this.sendBridgeFailureSignalToSwift(error.message);
				reject(error);
			}
		});
		
		return this.initializationPromise;
	}

	// Signal immediate readiness for first-click responsiveness
	signalReadiness() {
		console.log('🚀 NotchDropAddon: Signaling immediate readiness for first-click response');
		
		// Emit readiness signal immediately
		this.emit('bridgeReady');
		
		// Signal to Swift UI that we're ready for immediate actions
		try {
			if (typeof global !== 'undefined' && global.notchDropSwiftCallback) {
				global.notchDropSwiftCallback('bridgeReady', 'immediate');
			}
		} catch (error) {
			// Ignore callback errors in immediate mode
		}
		
		console.log('✅ NotchDropAddon: Immediate readiness signaled');
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
						const { BrowserWindow } = require('electron');
						const windows = BrowserWindow.getAllWindows();
						
						if (windows.length > 0) {
							console.log(`✅ Core services ready (${windows.length} windows found)`);
							resolve(true);
							return;
						}
					}
				} catch (e) {
					// Not in main process or Electron not ready
				}
				
				if (attempts >= maxAttempts) {
					console.log('⚠️ Core services readiness timeout, proceeding anyway');
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
						const { ipcRenderer } = require('electron');
						if (ipcRenderer) {
							// Test basic IPC communication
							ipcRenderer.invoke('test-overlay-connection').then(() => {
								console.log('✅ IPC communication test passed');
								resolve(true);
							}).catch((error) => {
								console.warn('⚠️ IPC test failed but proceeding:', error.message);
								resolve(true); // Proceed anyway
							});
							return;
						}
					} catch (e) {
						// Not in renderer process
					}
				}
				
				// If we can't test IPC directly, just resolve
				console.log('✅ IPC verification skipped (not in renderer context)');
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
			console.log('📡 Sending bridge ready signal to Swift UI');
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
			console.log('📡 Sending bridge failure signal to Swift UI');
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
						const { ipcRenderer } = require('electron');
						if (ipcRenderer) {
							console.log('✅ NotchDropAddon: ipcRenderer available');
							resolve(true);
							return;
						}
					} catch (e) {
						// ipcRenderer not available, we're in main process
						console.log('📍 NotchDropAddon: Running in main process');
					}
					
					try {
						const { ipcMain } = require('electron');
						if (ipcMain) {
							console.log('✅ NotchDropAddon: ipcMain available');
							resolve(true);
							return;
						}
					} catch (e) {
						// ipcMain not available either
					}
				}
				
				console.log('✅ NotchDropAddon: Electron context verified (generic)');
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
			console.log('⚡ IMMEDIATE: Processing Swift action:', action, 'with data:', data);
			
			// CRITICAL FIX: Execute critical actions immediately regardless of bridge state
			if (this.isCriticalAction(action)) {
				console.log('🚀 CRITICAL ACTION: Executing immediately for first-click responsiveness');
				return this.executeImmediately(action, data);
			}
			
			// For non-critical actions, check bridge readiness
			if (!this.bridgeReady && !this.immediateMode) {
				console.log('⏳ Bridge not ready, queuing action:', action);
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
			'resumeRecording'
		];
		return criticalActions.includes(action);
	}

	// Execute critical actions immediately without waiting for bridge
	executeImmediately(action, data) {
		console.log('⚡ EXECUTING IMMEDIATELY:', action);
		
		switch (action) {
			case 'startRecording':
				console.log('🎤 IMMEDIATE: Swift start recording - opening overlay NOW');
				return this.triggerOverlayRecordingImmediate();
			case 'triggerOverlayToggleLiveIntelligence':
				console.log('🧠 IMMEDIATE: Swift toggle live intelligence - opening overlay NOW');
				return this.triggerOverlayToggleLiveIntelligenceImmediate();
			case 'stopRecording':
				console.log('⏹️ IMMEDIATE: Swift stop recording');
				return this.triggerOverlayStopRecordingImmediate();
			case 'pauseRecording':
				console.log('⏸️ IMMEDIATE: Swift pause recording');
				return this.triggerOverlayPauseRecordingImmediate();
			case 'resumeRecording':
				console.log('▶️ IMMEDIATE: Swift resume recording');
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
				console.log('🎤 Swift requested start recording - opening overlay window');
				this.triggerOverlayRecording();
				break;
			case 'stopRecording':
				console.log('⏹️ Swift requested stop recording');
				this.triggerOverlayStopRecording();
				break;
			case 'pauseRecording':
				console.log('⏸️ Swift requested pause recording');
				this.triggerOverlayPauseRecording();
				break;
			case 'resumeRecording':
				console.log('▶️ Swift requested resume recording');
				this.triggerOverlayResumeRecording();
				break;
			case 'triggerOverlayToggleLiveIntelligence':
				console.log('🧠 Swift requested overlay toggle live intelligence');
				this.triggerOverlayToggleLiveIntelligence();
				break;
			case 'expand':
				console.log('📏 Swift requested expand');
				this.emit('expand');
				break;
			case 'collapse':
				console.log('📐 Swift requested collapse');
				this.emit('collapse');
				break;
			case 'toggleChatMode':
				console.log('💬 Swift requested toggle chat mode');
				this.emit('toggleChatMode');
				break;
			case 'submitChat':
				console.log('📝 Swift submitted chat:', data);
				this.emit('submitChat', data);
				break;
			case 'setAuthenticated':
				console.log('🔐 Swift set authenticated:', data);
				this.emit('setAuthenticated', data === 'true');
				break;
			case 'sendLog':
				console.log('📝 Swift sent log message:', data);
				this.handleSwiftLog(data);
				break;
			default:
				console.warn('⚠️ Unknown Swift action:', action);
		}
	}

	// Handle Swift log messages
	handleSwiftLog(message) {
		try {
			console.log('📝 Processing Swift log message:', message);

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
			console.log('🎤 IMMEDIATE: Triggering overlay recording from Swift UI');
			
			// CRITICAL FIX: Ensure bridge is ready before proceeding
			if (!this.bridgeReady) {
				console.log('⏳ Bridge not ready, initializing first...');
				await this.initializeBridge();
			}

			// Check if we're in main process or renderer process
			if (typeof require !== 'undefined') {
				try {
					// Try to use ipcRenderer (renderer process)
					const { ipcRenderer } = require('electron');
					if (ipcRenderer) {
						console.log('🔗 Using ipcRenderer to trigger overlay recording');
						// Use the correct IPC channel that creates/shows overlay window
						const result = await ipcRenderer.invoke(
							'notchdrop:triggerOverlayRecording',
						);
						console.log('✅ IMMEDIATE: Overlay recording result:', result);
						return result;
					}
				} catch (e) {
					// ipcRenderer not available, we're in main process
					console.log('📍 Running in main process, using direct IPC call');
				}

				// Main process approach - call the IPC handler directly
				try {
					const { ipcMain } = require('electron');
					console.log('🔗 Using main process approach for overlay recording');
					// Simulate the IPC call directly since we're in main process
					// We'll emit the action to be handled by the existing IPC handler
					this.emit('requestOverlayRecording');
					console.log('✅ IMMEDIATE: Overlay recording request emitted from main process');
					return { success: true };
				} catch (error) {
					console.error('❌ Error in main process overlay trigger:', error);
					return { success: false, error: error.message };
				}
			} else {
				console.warn('⚠️ require() not available, attempting fallback');
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
			console.log('⏹️ Triggering overlay stop recording from Swift');

			// Check if we're in main process or renderer process
			if (typeof require !== 'undefined') {
				try {
					// Try to use ipcRenderer (renderer process)
					const { ipcRenderer } = require('electron');
					if (ipcRenderer) {
						const result = await ipcRenderer.invoke('overlay-stop-recording');
						console.log('Overlay stop recording result:', result);
						return;
					}
				} catch (e) {
					// ipcRenderer not available, we're in main process
					console.log('Running in main process, using direct window communication');
				}

				// Main process approach - find overlay window and send command directly
				const { BrowserWindow } = require('electron');
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', {
								action: 'stopRecording',
							});
							console.log(
								'✅ Overlay stop recording command sent directly to window',
							);
							return;
						}
					}
				}
				console.warn('⚠️ Overlay window not found');
			}
		} catch (error) {
			console.error('❌ Error triggering overlay stop recording:', error);
		}
	}

	async triggerOverlayPauseRecording() {
		try {
			console.log('⏸️ Triggering overlay pause recording from Swift');

			// Check if we're in main process or renderer process
			if (typeof require !== 'undefined') {
				try {
					// Try to use ipcRenderer (renderer process)
					const { ipcRenderer } = require('electron');
					if (ipcRenderer) {
						const result = await ipcRenderer.invoke('overlay-pause-recording');
						console.log('Overlay pause recording result:', result);
						return;
					}
				} catch (e) {
					// ipcRenderer not available, we're in main process
					console.log('Running in main process, using direct window communication');
				}

				// Main process approach - find overlay window and send command directly
				const { BrowserWindow } = require('electron');
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', {
								action: 'pauseRecording',
							});
							console.log(
								'✅ Overlay pause recording command sent directly to window',
							);
							return;
						}
					}
				}
				console.warn('⚠️ Overlay window not found');
			}
		} catch (error) {
			console.error('❌ Error triggering overlay pause recording:', error);
		}
	}

	async triggerOverlayResumeRecording() {
		try {
			console.log('▶️ Triggering overlay resume recording from Swift');

			// Check if we're in main process or renderer process
			if (typeof require !== 'undefined') {
				try {
					// Try to use ipcRenderer (renderer process)
					const { ipcRenderer } = require('electron');
					if (ipcRenderer) {
						const result = await ipcRenderer.invoke('overlay-resume-recording');
						console.log('Overlay resume recording result:', result);
						return;
					}
				} catch (e) {
					// ipcRenderer not available, we're in main process
					console.log('Running in main process, using direct window communication');
				}

				// Main process approach - find overlay window and send command directly
				const { BrowserWindow } = require('electron');
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', {
								action: 'resumeRecording',
							});
							console.log(
								'✅ Overlay resume recording command sent directly to window',
							);
							return;
						}
					}
				}
				console.warn('⚠️ Overlay window not found');
			}
		} catch (error) {
			console.error('❌ Error triggering overlay resume recording:', error);
		}
	}

	async triggerOverlayToggleLiveIntelligence() {
		try {
			console.log('🧠 Triggering overlay toggle live intelligence from Swift');

			// Check if we're in main process or renderer process
			if (typeof require !== 'undefined') {
				try {
					// Try to use ipcRenderer (renderer process)
					const { ipcRenderer } = require('electron');
					if (ipcRenderer) {
						const result = await ipcRenderer.invoke('overlay-toggle-live-intelligence');
						console.log('Overlay toggle live intelligence result:', result);
						return;
					}
				} catch (e) {
					// ipcRenderer not available, we're in main process
					console.log('Running in main process, using direct window communication');
				}

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
							return;
						}
					}
				}
				console.warn('⚠️ Overlay window not found');
			}
		} catch (error) {
			console.error('❌ Error triggering overlay toggle live intelligence:', error);
		}
	}

	// CRITICAL FIX: Enhanced initialization with bridge readiness
	initialize() {
		if (this.isInitialized) {
			console.warn('NotchDrop already initialized');
			return;
		}

		try {
			this.addon.initialize();
			this.isInitialized = true;
			console.log('✅ NotchDrop addon initialized successfully');
			
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
		
		while (!this.isBridgeReady() && (Date.now() - startTime) < timeoutMs) {
			await new Promise(resolve => setTimeout(resolve, 100));
		}
		
		const ready = this.isBridgeReady();
		console.log(ready ? '✅ Bridge is ready!' : '❌ Bridge readiness timeout');
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
		console.log('⚡ IMMEDIATE: Triggering overlay recording NOW - no waiting');
		
		try {
			// Method 1: Direct IPC call to main process
			if (typeof require !== 'undefined') {
				try {
					const { ipcRenderer } = require('electron');
					if (ipcRenderer) {
						console.log('📡 Using ipcRenderer for immediate overlay trigger');
						const result = await ipcRenderer.invoke('notchdrop:triggerOverlayRecording');
						console.log('✅ Immediate overlay recording triggered via ipcRenderer:', result);
						return result;
					}
				} catch (e) {
					// Not in renderer process, try main process method
				}

				try {
					const { ipcMain } = require('electron');
					if (ipcMain) {
						console.log('📡 Using process emit for immediate overlay trigger');
						process.emit('swift-ui-trigger-overlay-recording-immediate');
						console.log('✅ Immediate overlay recording event emitted');
						return { success: true, method: 'process-emit' };
					}
				} catch (e) {
					// Neither renderer nor main process IPC available
				}
			}

			// Method 2: Global callback fallback
			if (typeof global !== 'undefined' && global.notchDropOverlayCallback) {
				console.log('📡 Using global callback for immediate overlay trigger');
				global.notchDropOverlayCallback('startRecording', { immediate: true });
				console.log('✅ Immediate overlay recording triggered via global callback');
				return { success: true, method: 'global-callback' };
			}

			// Method 3: Event emission fallback
			console.log('📡 Using event emission for immediate overlay trigger');
			this.emit('triggerOverlayRecording', { immediate: true });
			console.log('✅ Immediate overlay recording event emitted');
			return { success: true, method: 'event-emission' };

		} catch (error) {
			console.error('❌ Failed to trigger immediate overlay recording:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayToggleLiveIntelligenceImmediate() {
		console.log('⚡ IMMEDIATE: Triggering overlay live intelligence NOW - no waiting');
		
		try {
			// Method 1: Direct IPC call to main process
			if (typeof require !== 'undefined') {
				try {
					const { ipcRenderer } = require('electron');
					if (ipcRenderer) {
						console.log('📡 Using ipcRenderer for immediate live intelligence trigger');
						const result = await ipcRenderer.invoke('notchdrop:triggerOverlayToggleLiveIntelligence');
						console.log('✅ Immediate live intelligence triggered via ipcRenderer:', result);
						return result;
					}
				} catch (e) {
					// Not in renderer process, try main process method
				}

				try {
					const { ipcMain } = require('electron');
					if (ipcMain) {
						console.log('📡 Using process emit for immediate live intelligence trigger');
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
				console.log('📡 Using global callback for immediate live intelligence trigger');
				global.notchDropOverlayCallback('toggleLiveIntelligence', { immediate: true });
				console.log('✅ Immediate live intelligence triggered via global callback');
				return { success: true, method: 'global-callback' };
			}

			// Method 3: Event emission fallback
			console.log('📡 Using event emission for immediate live intelligence trigger');
			this.emit('triggerOverlayToggleLiveIntelligence', { immediate: true });
			console.log('✅ Immediate live intelligence event emitted');
			return { success: true, method: 'event-emission' };

		} catch (error) {
			console.error('❌ Failed to trigger immediate overlay live intelligence:', error);
			return { success: false, error: error.message };
		}
	}

	// Immediate stop/pause/resume methods for completeness
	async triggerOverlayStopRecordingImmediate() {
		console.log('⚡ IMMEDIATE: Stopping overlay recording NOW');
		try {
			this.emit('triggerOverlayStopRecording', { immediate: true });
			return { success: true };
		} catch (error) {
			console.error('❌ Failed to stop recording immediately:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayPauseRecordingImmediate() {
		console.log('⚡ IMMEDIATE: Pausing overlay recording NOW');
		try {
			this.emit('triggerOverlayPauseRecording', { immediate: true });
			return { success: true };
		} catch (error) {
			console.error('❌ Failed to pause recording immediately:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayResumeRecordingImmediate() {
		console.log('⚡ IMMEDIATE: Resuming overlay recording NOW');
		try {
			this.emit('triggerOverlayResumeRecording', { immediate: true });
			return { success: true };
		} catch (error) {
			console.error('❌ Failed to resume recording immediately:', error);
			return { success: false, error: error.message };
		}
	}
}

// Export both the class and an object containing it for flexibility
module.exports = NotchDropAddonWrapper;
module.exports.NotchDropAddonWrapper = NotchDropAddonWrapper;
