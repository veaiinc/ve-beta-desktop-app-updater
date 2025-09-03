const path = require('path');
const log = require('electron-log');

class NotchDropService {
	constructor() {
		this.notchDropAddon = null;
		this.isInitialized = false;
		this.isEnabled = false;
		this.autoOpenOnStartup = true; // Auto-open NotchDrop when app starts

		// Swift-JS Bridge integration
		this.swiftJSBridge = null;
	}

	async initialize() {
		try {
			log.info('🚀 Starting NotchDrop service with bridge pre-initialization...');

			// Phase 1: Pre-warm bridge BEFORE addon initialization
			await this.preWarmBridge();
			log.info('✅ Phase 1: Bridge pre-warmed successfully');

			// Phase 2: Load and initialize addon with bridge ready
			const addonPath = path.join(__dirname, '../../notchdrop-addon/index.js');
			log.info('Loading NotchDrop addon from:', addonPath);
			const NotchDropAddonWrapper = require(addonPath);

			this.notchDropAddon = new NotchDropAddonWrapper();

			// Phase 3: Set up event listeners
			this.setupEventListeners();

			// Phase 4: Initialize the addon with bridge ready
			this.notchDropAddon.initialize();
			this.isInitialized = true;

			// Phase 5: Ensure Swift-JS Bridge is ready for immediate actions
			await this.ensureSwiftJSBridgeReady();
			log.info('✅ Phase 5: Swift-JS Bridge ready for immediate actions');

			// Phase 6: Pre-create overlay window for instant response
			await this.preCreateOverlayWindow();
			log.info('✅ Phase 6: Overlay window pre-created for instant response');

			log.info('🎉 NotchDrop service initialized with immediate response capability');

			// Auto-open NotchDrop after initialization if enabled
			if (this.autoOpenOnStartup) {
				// No delay needed since everything is pre-warmed
				this.enable();
				log.info('🚀 Auto-opening NotchDrop immediately (pre-warmed)');
			}

			return true;
		} catch (error) {
			log.error('❌ Failed to initialize NotchDrop service:', error);
			return false;
		}
	}

	setupEventListeners() {
		if (!this.notchDropAddon) return;

		// Listen for status changes
		this.notchDropAddon.on('statusChanged', (status) => {
			log.info('NotchDrop status changed:', status);
			// Emit to renderer process if needed
			this.emitToRenderer('notchdrop-status-changed', status);
		});

		// Listen for file drops
		this.notchDropAddon.on('fileDropped', (filePath) => {
			log.info('File dropped on NotchDrop:', filePath);
			// Handle the dropped file
			this.handleDroppedFile(filePath);
		});

		// Listen for item changes
		this.notchDropAddon.on('itemAdded', (itemData) => {
			log.info('Item added to NotchDrop:', itemData);
			this.emitToRenderer('notchdrop-item-added', itemData);
		});

		this.notchDropAddon.on('itemRemoved', (itemData) => {
			log.info('Item removed from NotchDrop:', itemData);
			this.emitToRenderer('notchdrop-item-removed', itemData);
		});

		// Listen for Swift log messages
		this.notchDropAddon.on('swiftLog', (message) => {
			log.info('📝 Swift UI sent log message:', message);
			this.handleSwiftLog(message);
		});

		// Listen for overlay recording requests from Swift UI
		this.notchDropAddon.on('requestOverlayRecording', () => {
			log.info('🎤 Swift UI requested overlay recording');
			this.handleOverlayRecordingRequest();
		});

		// Listen for Ask AI chat submissions from Swift UI
		this.notchDropAddon.on('submitChat', (message) => {
			try {
				const text = typeof message === 'string' ? message : String(message || '');
				const chatMessage = {
					type: 'notchdrop-chat',
					message: text,
					timestamp: new Date().toISOString(),
					source: 'notchdrop-swift-ui',
				};
				log.info('💬 Swift UI submitted Ask AI chat:', chatMessage);

				// Emit to main via process event to reuse main.js flow
				process.emit('swift-ui-submit-chat', chatMessage);
			} catch (error) {
				log.error('❌ Error handling Swift UI submitChat:', error);
			}
		});
	}

	enable() {
		if (!this.isInitialized) {
			log.warn('NotchDrop not initialized, cannot enable');
			return false;
		}

		try {
			this.notchDropAddon.show();
			this.isEnabled = true;
			log.info('✅ NotchDrop enabled');
			return true;
		} catch (error) {
			log.error('❌ Failed to enable NotchDrop:', error);
			return false;
		}
	}

	disable() {
		if (!this.isInitialized) {
			log.warn('NotchDrop not initialized, cannot disable');
			return false;
		}

		try {
			this.notchDropAddon.hide();
			this.isEnabled = false;
			log.info('✅ NotchDrop disabled');
			return true;
		} catch (error) {
			log.error('❌ Failed to disable NotchDrop:', error);
			return false;
		}
	}

	toggle() {
		if (!this.isInitialized) {
			log.warn('NotchDrop not initialized, cannot toggle');
			return false;
		}

		try {
			this.notchDropAddon.toggle();
			this.isEnabled = !this.isEnabled;
			log.info(`✅ NotchDrop toggled: ${this.isEnabled ? 'enabled' : 'disabled'}`);
			return true;
		} catch (error) {
			log.error('❌ Failed to toggle NotchDrop:', error);
			return false;
		}
	}

	isVisible() {
		if (!this.isInitialized) return false;
		return this.notchDropAddon.isVisible();
	}

	setStatus(status) {
		if (!this.isInitialized) {
			log.warn('NotchDrop not initialized, cannot set status');
			return false;
		}

		try {
			this.notchDropAddon.setStatus(status);
			return true;
		} catch (error) {
			log.error('❌ Failed to set NotchDrop status:', error);
			return false;
		}
	}

	getStatus() {
		if (!this.isInitialized) return 'closed';
		return this.notchDropAddon.getStatus();
	}

	setContentType(contentType) {
		if (!this.isInitialized) {
			log.warn('NotchDrop not initialized, cannot set content type');
			return false;
		}

		try {
			this.notchDropAddon.setContentType(contentType);
			return true;
		} catch (error) {
			log.error('❌ Failed to set NotchDrop content type:', error);
			return false;
		}
	}

	getContentType() {
		if (!this.isInitialized) return 'normal';
		return this.notchDropAddon.getContentType();
	}

	handleDroppedFiles(filePaths) {
		if (!this.isInitialized) {
			log.warn('NotchDrop not initialized, cannot handle dropped files');
			return false;
		}

		try {
			this.notchDropAddon.handleDroppedFiles(filePaths);
			return true;
		} catch (error) {
			log.error('❌ Failed to handle dropped files:', error);
			return false;
		}
	}

	getCurrentItems() {
		if (!this.isInitialized) return [];
		return this.notchDropAddon.getCurrentItems();
	}

	clearAllItems() {
		if (!this.isInitialized) {
			log.warn('NotchDrop not initialized, cannot clear items');
			return false;
		}

		try {
			this.notchDropAddon.clearAllItems();
			return true;
		} catch (error) {
			log.error('❌ Failed to clear NotchDrop items:', error);
			return false;
		}
	}

	setHapticFeedback(enabled) {
		if (!this.isInitialized) {
			log.warn('NotchDrop not initialized, cannot set haptic feedback');
			return false;
		}

		try {
			this.notchDropAddon.setHapticFeedback(enabled);
			return true;
		} catch (error) {
			log.error('❌ Failed to set haptic feedback:', error);
			return false;
		}
	}

	getHapticFeedback() {
		if (!this.isInitialized) return true;
		return this.notchDropAddon.getHapticFeedback();
	}

	setNotchVisible(visible) {
		if (!this.isInitialized) {
			log.warn('NotchDrop not initialized, cannot set notch visibility');
			return false;
		}

		try {
			this.notchDropAddon.setNotchVisible(visible);
			return true;
		} catch (error) {
			log.error('❌ Failed to set notch visibility:', error);
			return false;
		}
	}

	getNotchVisible() {
		if (!this.isInitialized) return false;
		return this.notchDropAddon.getNotchVisible();
	}

	// Auto-open settings
	setAutoOpenOnStartup(enabled) {
		this.autoOpenOnStartup = enabled;
		log.info(`🔧 Auto-open on startup ${enabled ? 'enabled' : 'disabled'}`);
		return true;
	}

	getAutoOpenOnStartup() {
		return this.autoOpenOnStartup;
	}

	handleDroppedFile(filePath) {
		log.info('Processing dropped file:', filePath);

		// Here you can implement custom logic for handling dropped files
		// For example, you might want to:
		// 1. Copy the file to a specific location
		// 2. Process the file (e.g., if it's an image, resize it)
		// 3. Add it to a queue for processing
		// 4. Send it to the renderer process

		// For now, just emit the file path to the renderer
		this.emitToRenderer('notchdrop-file-dropped', filePath);
	}

	emitToRenderer(event, data) {
		// This method will be overridden by the main process
		// to emit events to the renderer process
		if (this.mainWindow && this.mainWindow.webContents) {
			this.mainWindow.webContents.send(event, data);
		}
	}

	setMainWindow(mainWindow) {
		this.mainWindow = mainWindow;
	}

	cleanup() {
		if (this.isInitialized) {
			try {
				this.disable();
				log.info('🧹 NotchDrop service cleanup completed');
			} catch (error) {
				log.error('❌ Error during NotchDrop cleanup:', error);
			}
		}
	}

	// CRITICAL FIX: Pre-warm bridge for immediate response
	async preWarmBridge() {
		try {
			log.info('🔧 Pre-warming Swift-JS bridge...');

			// Pre-load bridge dependencies
			const bridgePath = path.join(__dirname, '../../notchdrop-addon/swift-js-bridge.js');
			const SwiftJSBridge = require(bridgePath);

			// Store bridge reference immediately
			this.swiftJSBridge = SwiftJSBridge.bridge;

			// Pre-initialize bridge components
			if (this.swiftJSBridge && this.swiftJSBridge.initialize) {
				await this.swiftJSBridge.initialize();
			}

			log.info('✅ Swift-JS bridge pre-warmed successfully');
			return true;
		} catch (error) {
			log.warn(
				'⚠️ Bridge pre-warming failed, will retry during normal initialization:',
				error,
			);
			return false;
		}
	}

	// Enhanced bridge readiness verification
	async ensureSwiftJSBridgeReady() {
		try {
			if (!this.swiftJSBridge) {
				// Fallback to normal initialization if pre-warming failed
				return await this.initializeSwiftJSBridge();
			}

			// Verify bridge is functional
			if (typeof this.swiftJSBridge.handleSwiftAction !== 'function') {
				log.warn('⚠️ Bridge loaded but not functional, re-initializing...');
				return await this.initializeSwiftJSBridge();
			}

			log.info('✅ Swift-JS Bridge verified ready for immediate actions');
			return true;
		} catch (error) {
			log.error('❌ Failed to ensure Swift-JS Bridge readiness:', error);
			return false;
		}
	}

	// Pre-create overlay window for instant response
	async preCreateOverlayWindow() {
		try {
			log.info('🔧 Pre-creating overlay window for instant response...');

			// Signal to main process to pre-create overlay window
			if (this.mainWindow && this.mainWindow.webContents) {
				this.mainWindow.webContents.send('pre-create-overlay-window');
				log.info('✅ Overlay window pre-creation signal sent');
			} else {
				// Use process event as fallback
				process.emit('pre-create-overlay-window');
				log.info('✅ Overlay window pre-creation event emitted');
			}

			return true;
		} catch (error) {
			log.warn('⚠️ Overlay window pre-creation failed:', error);
			return false;
		}
	}

	async initializeSwiftJSBridge() {
		try {
			// Load the Swift-JS bridge if not already loaded
			if (!this.swiftJSBridge) {
				const bridgePath = path.join(__dirname, '../../notchdrop-addon/swift-js-bridge.js');
				log.info('Loading Swift-JS bridge from:', bridgePath);
				const SwiftJSBridge = require(bridgePath);
				this.swiftJSBridge = SwiftJSBridge.bridge;
			}

			// Initialize the bridge
			if (this.swiftJSBridge && this.swiftJSBridge.initialize) {
				await this.swiftJSBridge.initialize();
			}

			log.info('✅ Swift-JS Bridge initialized successfully');
			return true;
		} catch (error) {
			log.error('❌ Failed to initialize Swift-JS Bridge:', error);
			return false;
		}
	}

	// Handle Swift actions for overlay integration
	async handleSwiftAction(action, data) {
		try {
			if (!this.swiftJSBridge) {
				log.warn('Swift-JS Bridge not initialized, cannot handle Swift action');
				return { success: false, error: 'Swift-JS Bridge not initialized' };
			}

			log.info('🎯 Handling Swift action:', action, data);
			const result = await this.swiftJSBridge.handleSwiftAction(action, data);
			return result;
		} catch (error) {
			log.error('❌ Error handling Swift action:', error);
			return { success: false, error: error.message };
		}
	}

	// Handle Swift log messages
	handleSwiftLog(message) {
		try {
			log.info('📝 Swift UI Log Message:', message);

			// Log to Electron's log system
			log.info(`[Swift UI] ${message}`);

			// Emit to renderer process for UI display
			this.emitToRenderer('swift-log-message', {
				timestamp: new Date().toISOString(),
				message: message,
				source: 'Swift UI',
			});

			// You can add additional processing here:
			// - Save to a log file
			// - Send to a monitoring service
			// - Display in the app's UI
			// - Trigger other actions based on the message
		} catch (error) {
			log.error('❌ Error handling Swift log message:', error);
		}
	}

	// Handle overlay recording requests from Swift UI
	async handleOverlayRecordingRequest() {
		try {
			// We'll trigger the overlay by calling the same logic as the existing IPC handler
			// This ensures consistency with the existing overlay functionality

			// The overlay logic is in main.js, so we need to access the windowHelper
			// We'll use a global reference or require the windowHelper

			// For now, let's emit an event that main.js can listen to
			process.emit('swift-ui-trigger-overlay-recording');
			log.info('✅ Emitted swift-ui-trigger-overlay-recording event');

			return { success: true };
		} catch (error) {
			log.error('❌ Error handling overlay recording request:', error);
			return { success: false, error: error.message };
		}
	}
}

module.exports = NotchDropService;
