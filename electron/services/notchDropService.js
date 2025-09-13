const path = require('path');
const log = require('electron-log');

let NotchDropAddonWrapper;

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
				log.info('ℹ️ NotchDrop not supported on this platform:', process.platform);
				this.isInitialized = false;
				return false;
			}

			// Enhanced module resolution for both dev and packaged environments
			let NotchDropAddonWrapper;
			try {
				// Try module resolution first (works in packaged apps)
				NotchDropAddonWrapper = require('notchdrop-addon');
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

		// Listen for voice agent start requests from Swift UI
		this.notchDropAddon.on('startVoiceAgent', (data) => {
			try {
				log.info('🎤 Swift UI requested voice agent start');
				console.log('🎤 NotchDrop: Received startVoiceAgent event, activating voice agent...');
				this.activateVoiceAgent();
			} catch (error) {
				log.error('❌ Error handling Swift UI startVoiceAgent:', error);
			}
		});

		// Listen for voice agent disconnect requests from Swift UI
		this.notchDropAddon.on('disconnectVoice', (data) => {
			try {
				log.info('🔌 Swift UI requested voice agent disconnect');
				console.log('🔌 NotchDrop: Received disconnectVoice event, deactivating voice agent...');
				this.deactivateVoiceAgent();
			} catch (error) {
				log.error('❌ Error handling Swift UI disconnectVoice:', error);
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

			// Handle voice-specific actions
			if (action === 'connectVoice' || action === 'startVoiceAgent') {
				console.log('🎤 NotchDrop Voice button clicked - activating voice agent');
				await this.activateVoiceAgent();
			} else if (action === 'disconnectVoice') {
				console.log('🎤 NotchDrop Voice disconnect - deactivating voice agent');
				await this.deactivateVoiceAgent();
			}

			const result = await this.swiftJSBridge.handleSwiftAction(action, data);
			return result;
		} catch (error) {
			log.error('❌ Error handling Swift action:', error);
			return { success: false, error: error.message };
		}
	}

	async activateVoiceAgent() {
		try {
			console.log('🎤 Activating voice agent from NotchDrop...');
			
			// Send IPC to main window to show/activate voice agent
			if (this.mainWindow) {
				this.mainWindow.webContents.send('notchdrop:showVoiceAgent', {
					source: 'notchdrop',
					timestamp: Date.now()
				});
				
				// Direct voice agent activation using the working approach
				const result = await this.mainWindow.webContents.executeJavaScript(`
					(async () => {
						try {
							console.log('🎤 NotchDrop activating voice agent via JavaScript');
							
							// Method 1: Use the working voiceIntegration.connectToRoom() approach
							console.log('🔍 Checking window.voiceIntegration:', !!window.voiceIntegration);
							
							if (window.voiceIntegration && window.voiceIntegration.connectToRoom) {
								console.log('🎤 Found voiceIntegration.connectToRoom(), calling directly...');
								await window.voiceIntegration.connectToRoom();
								console.log('✅ Voice agent started successfully from NotchDrop!');
								
								// Notify NotchDrop that voice is connected
								setTimeout(() => {
									if (window.voiceIntegration && window.voiceIntegration.isConnected) {
										console.log('🔄 Notifying NotchDrop: voice connected');
										const event = new CustomEvent('notchdrop-voice-status', {
											detail: { status: 'connected' }
										});
										window.dispatchEvent(event);
									}
								}, 2000); // Wait 2 seconds for connection to establish
								
								return { success: true, method: 'voiceIntegration.connectToRoom' };
							}
							
							// Method 2: Try custom event as fallback
							console.log('⚠️ voiceIntegration not found on window, trying custom event...');
							const event = new CustomEvent('notchdrop-start-voice-agent', {
								detail: {
									source: 'notchdrop-voice-button',
									timestamp: Date.now()
								}
							});
							window.dispatchEvent(event);
							return { success: true, method: 'custom-event' };
							
						} catch (error) {
							console.error('❌ JavaScript voice activation error:', error);
							return { success: false, error: error.message };
						}
					})()
				`);
				
				console.log('🎤 Voice agent JavaScript activation result:', result);
			}
			
		} catch (error) {
			console.error('❌ Error activating voice agent:', error);
		}
	}

	async deactivateVoiceAgent() {
		try {
			console.log('🔌 DEACTIVATE: Deactivating voice agent from NotchDrop X button...');
			console.log('🔌 DEACTIVATE: Calling JavaScript disconnect method...');
			
			if (this.mainWindow) {
				const result = await this.mainWindow.webContents.executeJavaScript(`
					(async () => {
						try {
							console.log('🎤 NotchDrop deactivating voice agent via JavaScript');
							
							// Method 1: Use voiceIntegration.disconnect() if available
							if (window.voiceIntegration && window.voiceIntegration.disconnect) {
								console.log('🎤 Found voiceIntegration.disconnect(), calling...');
								await window.voiceIntegration.disconnect();
								console.log('✅ Voice agent disconnected successfully from NotchDrop!');
								return { success: true, method: 'voiceIntegration.disconnect' };
							}
							
							// Method 2: Try custom event as fallback
							console.log('⚠️ voiceIntegration.disconnect not found, trying custom event...');
							const event = new CustomEvent('notchdrop-voice-disconnect', {
								detail: {
									source: 'notchdrop-x-button',
									timestamp: Date.now()
								}
							});
							window.dispatchEvent(event);
							return { success: true, method: 'custom-event' };
							
						} catch (error) {
							console.error('❌ JavaScript voice deactivation error:', error);
							return { success: false, error: error.message };
						}
					})()
				`);
				
				console.log('🎤 Voice agent JavaScript deactivation result:', result);
			}
			
		} catch (error) {
			console.error('❌ Error deactivating voice agent:', error);
		}
	}

	async updateVoiceConnectionState(status) {
		try {
			console.log(`🔄 Updating NotchDrop voice connection state: ${status}`);
			
			if (!this.isInitialized) {
				log.warn('NotchDrop not initialized, cannot update voice connection state');
				return false;
			}

			// Call the native addon to update the Swift UI voice status
			if (this.notchDropAddon && this.notchDropAddon.updateVoiceConnectionState) {
				this.notchDropAddon.updateVoiceConnectionState(status);
				console.log(`✅ NotchDrop voice status updated to: ${status}`);
				return true;
			} else {
				console.warn('⚠️ updateVoiceConnectionState method not available on addon');
				return false;
			}
		} catch (error) {
			console.error('❌ Error updating NotchDrop voice connection state:', error);
			return false;
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
