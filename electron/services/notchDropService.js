const path = require('path');
const log = require('electron-log');

let NotchDropAddonWrapper = require('notchdrop-addon');

class NotchDropService {
	constructor() {
		this.notchDropAddon = null;
		this.isInitialized = false;
		this.isEnabled = false;
		this.autoOpenOnStartup = true; // Auto-open NotchDrop when app starts
		this.platformSupported = process.platform === 'darwin';

		// Swift-JS Bridge integration
		this.swiftJSBridge = null;
	}

	async initialize() {
		try {
			// Phase 1: Pre-warm bridge BEFORE addon initialization
			await this.preWarmBridge();

			// Phase 2: Load and initialize addon with bridge ready (macOS only)
			if (!this.platformSupported) {
				this.isInitialized = false;
				return false;
			}

			// Enhanced module resolution for both dev and packaged environments

			try {
				// Try module resolution first (works in packaged apps)
			} catch (moduleError) {
				// Enhanced fallback paths for development and packaged environments
				const fallbackPaths = [
					// Development paths
					path.join(__dirname, '../../notchdrop-addon'),
					path.join(__dirname, '../../notchdrop-addon/index.js'),

					// Packaged app paths
					path.join(process.resourcesPath, 'app.asar.unpacked/notchdrop-addon'),
					path.join(process.resourcesPath, 'notchdrop-addon'),
					path.join(process.resourcesPath, 'notchdrop-addon/index.js'),

					// Alternative packaged paths
					path.join(__dirname, '../../../Resources/notchdrop-addon'),
					path.join(__dirname, '../../../Resources/app.asar.unpacked/notchdrop-addon'),
				];

				let loaded = false;
				for (const fallbackPath of fallbackPaths) {
					try {
						NotchDropAddonWrapper = require(fallbackPath);
						loaded = true;
						break;
					} catch (fallbackError) {
						log.warn(
							`⚠️ Fallback path failed: ${fallbackPath} - ${fallbackError.message}`,
						);
					}
				}

				if (!loaded) {
					throw new Error('Failed to load NotchDrop addon via any resolution path');
				}
			}

			this.notchDropAddon = new NotchDropAddonWrapper();

			// Phase 3: Set up event listeners
			this.setupEventListeners();

			// Phase 4: Initialize the addon with bridge ready
			this.notchDropAddon.initialize();
			this.isInitialized = true;

			// Phase 5: Ensure Swift-JS Bridge is ready for immediate actions
			await this.ensureSwiftJSBridgeReady();

			// Phase 6: Pre-create overlay window for instant response
			await this.preCreateOverlayWindow();

			// Auto-open NotchDrop after initialization if enabled
			if (this.autoOpenOnStartup) {
				// No delay needed since everything is pre-warmed
				this.enable();
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
		return true;
	}

	getAutoOpenOnStartup() {
		return this.autoOpenOnStartup;
	}

	handleDroppedFile(filePath) {
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
			} catch (error) {
				log.error('❌ Error during NotchDrop cleanup:', error);
			}
		}
	}

	// CRITICAL FIX: Pre-warm bridge for immediate response
	async preWarmBridge() {
		try {
			if (process.platform !== 'darwin') {
				// Skip bridge pre-warm on non-macOS platforms
				return false;
			}

			// Pre-load bridge dependencies (resolve from node_modules)
			const SwiftJSBridge = require('notchdrop-addon/swift-js-bridge.js');

			// Store bridge reference immediately
			this.swiftJSBridge = SwiftJSBridge.bridge;

			// Pre-initialize bridge components
			if (this.swiftJSBridge && this.swiftJSBridge.initialize) {
				await this.swiftJSBridge.initialize();
			}

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
				return await this.initializeSwiftJSBridge();
			}

			return true;
		} catch (error) {
			log.error('❌ Failed to ensure Swift-JS Bridge readiness:', error);
			return false;
		}
	}

	// Pre-create overlay window for instant response
	async preCreateOverlayWindow() {
		try {
			// Signal to main process to pre-create overlay window
			if (this.mainWindow && this.mainWindow.webContents) {
				this.mainWindow.webContents.send('pre-create-overlay-window');
			} else {
				// Use process event as fallback
				process.emit('pre-create-overlay-window');
			}

			return true;
		} catch (error) {
			log.warn('⚠️ Overlay window pre-creation failed:', error);
			return false;
		}
	}

	async initializeSwiftJSBridge() {
		try {
			if (process.platform !== 'darwin') {
				return false;
			}
			// Load the Swift-JS bridge if not already loaded (resolve from node_modules)
			if (!this.swiftJSBridge) {
				const SwiftJSBridge = require('notchdrop-addon/swift-js-bridge.js');
				this.swiftJSBridge = SwiftJSBridge.bridge;
			}

			// Initialize the bridge
			if (this.swiftJSBridge && this.swiftJSBridge.initialize) {
				await this.swiftJSBridge.initialize();
			}

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
			// Log to Electron's log system
			log.info(`[Swift UI] ${message}`);

			// Emit to renderer process for UI display
			this.emitToRenderer('swift-log-message', {
				timestamp: new Date().toISOString(),
				message: message,
				source: 'Swift UI',
			});
		} catch (error) {
			log.error('❌ Error handling Swift log message:', error);
		}
	}

	// Handle overlay recording requests from Swift UI
	async handleOverlayRecordingRequest() {
		try {
			process.emit('swift-ui-trigger-overlay-recording');

			return { success: true };
		} catch (error) {
			log.error('❌ Error handling overlay recording request:', error);
			return { success: false, error: error.message };
		}
	}
}

module.exports = NotchDropService;
