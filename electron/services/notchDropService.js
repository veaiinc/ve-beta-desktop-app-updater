const path = require('path');
const log = require('electron-log');
const { BrowserWindow } = require('electron');
// const { WakeWordIntegration } = import('../../notchdrop-addon/wake-word-integration');

let NotchDropAddonWrapper;

// TODO: PERFORMANCE - This service has complex initialization with multiple async operations
// TODO: PERFORMANCE - Consider implementing initialization state machine for better error handling
class NotchDropService {
	constructor() {
		this.notchDropAddon = null;
		this.isInitialized = false;
		this.isEnabled = false;
		this.autoOpenOnStartup = true; // Auto-open NotchDrop when app starts
		// NotchDrop only supported on Apple Silicon Macs (not Intel Macs)
		// Support testing overrides via environment variables
		const RUNTIME_PLATFORM = process.env.VE_FORCE_PLATFORM || process.platform;
		const RUNTIME_ARCH = process.env.VE_FORCE_ARCH || process.arch;
		this.platformSupported = RUNTIME_PLATFORM === 'darwin' && RUNTIME_ARCH === 'arm64';

		// Swift-JS Bridge integration
		this.swiftJSBridge = null;
		this.createMainWindowFn = null;
		this.stealthModeController = {
			toggle: null,
			getStatus: null,
			setStatus: null,
		};
		this.isStealthModeEnabled = false;

		// Wake word integration - DISABLED
		// this.wakeWordIntegration = null;
	}

	async initialize() {
		try {
			// Add timeout to prevent hanging during initialization
			const initTimeout = new Promise((_, reject) =>
				setTimeout(() => reject(new Error('NotchDrop initialization timeout')), 15000),
			);

			const initPromise = this.performInitialization();

			// Race between initialization and timeout
			await Promise.race([initPromise, initTimeout]);

			return true;
		} catch (error) {
			log.error('❌ Failed to initialize NotchDrop service:', error);
			this.isInitialized = false;
			return false;
		}
	}

	async performInitialization() {
		try {
			// Phase 1: Pre-warm bridge BEFORE addon initialization
			await this.preWarmBridge();

			// Phase 2: Load and initialize addon with bridge ready (Apple Silicon Mac only)
			if (!this.platformSupported) {
				const RUNTIME_PLATFORM = process.env.VE_FORCE_PLATFORM || process.platform;
				const RUNTIME_ARCH = process.env.VE_FORCE_ARCH || process.arch;
				if (RUNTIME_PLATFORM !== 'darwin') {
					log.info('ℹ️ NotchDrop not supported on this platform:', RUNTIME_PLATFORM);
				} else {
					log.info(
						'ℹ️ NotchDrop not supported on Intel Mac (arch:',
						RUNTIME_ARCH,
						') - using Dynamic Island instead',
					);
				}
				this.isInitialized = false;
				return false;
			}

			// TODO: PERFORMANCE - Multiple require() attempts with fallback paths could be optimized
			// Enhanced module resolution for both dev and packaged environments
			let NotchDropAddonWrapper;
			try {
				// Try module resolution first (works in packaged apps)
				NotchDropAddonWrapper = require('notchdrop-addon');
			} catch (moduleError) {
				// TODO: PERFORMANCE - Consider caching successful paths to avoid repeated attempts
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

			// Phase 4: Initialize the addon with bridge ready (with timeout)
			try {
				const addonInitTimeout = new Promise((_, reject) =>
					setTimeout(() => reject(new Error('Addon initialization timeout')), 10000),
				);

				const addonInitPromise = new Promise((resolve, reject) => {
					try {
						this.notchDropAddon.initialize();
						resolve();
					} catch (error) {
						reject(error);
					}
				});

				await Promise.race([addonInitPromise, addonInitTimeout]);
				this.isInitialized = true;
			} catch (error) {
				log.error('❌ Addon initialization failed:', error);
				this.isInitialized = false;
				throw error;
			}

			// Phase 5: Ensure Swift-JS Bridge is ready for immediate actions
			await this.ensureSwiftJSBridgeReady();

			// Phase 6: Pre-create overlay window for instant response
			await this.preCreateOverlayWindow();

			// Sync stealth mode state for initial render
			await this.syncStealthModeState();

			// Phase 7: Initialize wake word integration - DISABLED
			try {
				this.wakeWordIntegration = new WakeWordIntegration(this);
				//Commenting out wake word integration for now
				await this.wakeWordIntegration.start();
				log.info('✅ Wake word integration initialized - "Hey Ve" detection active');
			} catch (wakeWordError) {
				log.warn('⚠️ Wake word integration failed to start:', wakeWordError.message);
				// Continue without wake word - not critical for core functionality
			}
			log.info('ℹ️ Wake word integration disabled for build');

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
				console.log(
					'🎤 NotchDrop: Received startVoiceAgent event, activating voice agent...',
				);
				this.activateVoiceAgent();
			} catch (error) {
				log.error('❌ Error handling Swift UI startVoiceAgent:', error);
			}
		});

		// Listen for voice agent disconnect requests from Swift UI
		this.notchDropAddon.on('disconnectVoice', (data) => {
			try {
				log.info('🔌 Swift UI requested voice agent disconnect');
				console.log(
					'🔌 NotchDrop: Received disconnectVoice event, deactivating voice agent...',
				);
				this.deactivateVoiceAgent();
			} catch (error) {
				log.error('❌ Error handling Swift UI disconnectVoice:', error);
			}
		});

		this.notchDropAddon.on('toggleStealthMode', () => {
			Promise.resolve(this.handleToggleStealthModeRequest('swift-event')).catch((error) => {
				log.error('❌ Error handling Swift UI stealth toggle event:', error);
			});
		});

		// Listen for voice mute toggle requests from Swift UI
		this.notchDropAddon.on('toggleVoiceMute', (data) => {
			try {
				log.info('🔇 Swift UI requested voice mute toggle');
				console.log('🔇 NotchDrop: Received toggleVoiceMute event, toggling microphone...');
				this.toggleVoiceMute();
			} catch (error) {
				log.error('❌ Error handling Swift UI toggleVoiceMute:', error);
			}
		});

		// Listen for messages received by Swift UI from Electron
		this.notchDropAddon.on('messageReceived', (message) => {
			log.info('📨 Swift UI received message from Electron:', message);
			// You can add additional handling here if needed
		});

		this.notchDropAddon.on('navigateToMainScreen', (targetPath) => {
			try {
				log.info('🏠 Swift UI requested main window navigation:', targetPath);
				// Special handling for Meeting AI click: decide based on workspace suspension
				if (typeof targetPath === 'string' && targetPath === 'MEETING_AI_CLICK') {
					this.handleMeetingAIClick().catch((error) => {
						log.error('❌ Error handling Meeting AI click:', error);
					});
				} else {
					this.navigateMainWindow(targetPath);
				}
			} catch (error) {
				log.error('❌ Error handling Swift UI main window navigation request:', error);
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

	setMainWindowFactory(factory) {
		if (typeof factory === 'function') {
			this.createMainWindowFn = factory;
		} else {
			this.createMainWindowFn = null;
		}
	}

	setStealthModeController(controller = {}) {
		this.stealthModeController = {
			toggle: typeof controller.toggle === 'function' ? controller.toggle : null,
			getStatus: typeof controller.getStatus === 'function' ? controller.getStatus : null,
			setStatus: typeof controller.setStatus === 'function' ? controller.setStatus : null,
		};

		if (this.isInitialized) {
			this.syncStealthModeState().catch((error) => {
				log.warn('⚠️ Failed to resync stealth mode state after controller update:', error);
			});
		}
	}

	navigateMainWindow(path) {
		const defaultPath = '/verify-user';
		const resolvedPath =
			typeof path === 'string' && path.trim().length > 0 ? path.trim() : defaultPath;
		const normalizedPath = resolvedPath.startsWith('/') ? resolvedPath : `/${resolvedPath}`;

		// Debounce duplicate navigation requests to avoid loops/stack overflow
		if (!this._lastNavigation) {
			this._lastNavigation = { path: null, ts: 0 };
		}
		const now = Date.now();
		if (this._lastNavigation.path === normalizedPath && now - this._lastNavigation.ts < 400) {
			log.warn('⏱️ Skipping duplicate navigation (debounced):', normalizedPath);
			return true;
		}
		this._lastNavigation = { path: normalizedPath, ts: now };

		try {
			if (this.focusAndNavigateWindow(this.mainWindow, normalizedPath)) {
				return true;
			}

			const allWindows = BrowserWindow.getAllWindows();
			const fallbackWindow = allWindows.find((win) => {
				if (!win || win.isDestroyed()) {
					return false;
				}
				const title = typeof win.getTitle === 'function' ? win.getTitle() : '';
				return title.toLowerCase().includes('ve ai');
			});

			if (this.focusAndNavigateWindow(fallbackWindow, normalizedPath)) {
				return true;
			}

			if (typeof this.createMainWindowFn === 'function') {
				const createdWindow = this.createMainWindowFn(true);
				if (this.focusAndNavigateWindow(createdWindow, normalizedPath)) {
					return true;
				}
			}

			log.warn('⚠️ Unable to navigate main window - no window available', {
				path: normalizedPath,
			});
			return false;
		} catch (error) {
			log.error('❌ Failed to navigate main window from NotchDrop request:', error);
			return false;
		}
	}

	focusAndNavigateWindow(windowInstance, path) {
		if (!windowInstance || windowInstance.isDestroyed()) {
			return false;
		}

		this.setMainWindow(windowInstance);

		try {
			if (!windowInstance.isVisible()) {
				windowInstance.show();
			}
			windowInstance.focus();
		} catch (error) {
			log.warn('⚠️ Unable to show/focus main window:', error);
		}

		const { webContents } = windowInstance;
		const sendNavigation = () => {
			log.info('🏠 Main window navigated via NotchDrop request:', path);
			try {
				if (path !== '/verify-user') {
					webContents.send('navigate-to', path);
				}
				log.info('🏠 Main window navigated via NotchDrop request:', path);
			} catch (error) {
				log.error('❌ Failed to send navigation message to main window:', error);
			}
		};

		if (webContents.isLoading()) {
			if (path) {
				webContents.once('did-finish-load', sendNavigation);
			}
		} else {
			if (path) {
				sendNavigation();
			}
		}

		return true;
	}

	// Decide Meeting AI behavior based on renderer workspaceMode in localStorage
	async handleMeetingAIClick() {
		try {
			const windowInstance = this.mainWindow;
			if (!windowInstance || windowInstance.isDestroyed()) {
				log.warn('⚠️ No main window available for Meeting AI handling');
				// Fallback: just try to start meeting overlay
				this.notchDropAddon &&
					this.notchDropAddon.triggerOverlayRecording &&
					this.notchDropAddon.triggerOverlayRecording();
				return { success: false, reason: 'no-window' };
			}

			const wc = windowInstance.webContents;
			// Ask renderer for workspaceMode from localStorage; returns null if unavailable
			const result = await wc.executeJavaScript(
				`(function(){ try { return localStorage.getItem('workspaceMode') || null; } catch(e) { return null; } })();`,
				true,
			);

			const mode = typeof result === 'string' ? result : null;
			log.info('🧭 Renderer workspaceMode from localStorage:', mode);

			if (mode === 'suspended') {
				// Navigate to pricing page
				this.navigateMainWindow('/settings/pricing');
				return { success: true, action: 'navigate-pricing' };
			}

			// Otherwise, start the meeting via overlay integration
			if (
				this.notchDropAddon &&
				typeof this.notchDropAddon.triggerOverlayRecording === 'function'
			) {
				this.notchDropAddon.triggerOverlayRecording();
				return { success: true, action: 'start-meeting' };
			}

			// As a secondary path, emit the same event used elsewhere
			process.emit && process.emit('swift-ui-trigger-overlay-recording');
			return { success: true, action: 'start-meeting-fallback' };
		} catch (error) {
			log.error('❌ Failed to handle Meeting AI click:', error);
			return { success: false, error: error.message };
		}
	}

	cleanup() {
		if (this.isInitialized) {
			try {
				this.disable();
			} catch (error) {
				log.error('❌ Error during NotchDrop cleanup:', error);
			}
		}

		// CRITICAL: Remove all event listeners to prevent memory leaks
		try {
			if (this.notchDropAddon) {
				this.notchDropAddon.removeAllListeners();
			}

			// Clear any pending timeouts
			if (this._initTimeout) {
				clearTimeout(this._initTimeout);
			}
			if (this._addonInitTimeout) {
				clearTimeout(this._addonInitTimeout);
			}

			// Reset state
			this.isInitialized = false;
			this.isEnabled = false;
			this.notchDropAddon = null;
			this.swiftJSBridge = null;

			log.info('🧹 NotchDrop service cleaned up successfully');
		} catch (error) {
			log.error('❌ Error during NotchDrop cleanup:', error);
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

			if (action === 'navigateToMainScreen') {
				const resolvedPath =
					typeof data === 'string' && data.trim().length > 0
						? data.trim()
						: '/verify-user';
				const navigationSucceeded = this.navigateMainWindow(null);
				return {
					success: navigationSucceeded,
					action,
					path: null,
				};
			}

			if (action === 'toggleStealthMode') {
				const enabled = await this.handleToggleStealthModeRequest('swift-ipc');
				return { success: true, action, enabled };
			}

			// Handle voice-specific actions
			if (action === 'connectVoice' || action === 'startVoiceAgent') {
				// console.log('🎤 NotchDrop Voice button clicked - activating voice agent');
				await this.activateVoiceAgent();
			} else if (action === 'disconnectVoice') {
				// console.log('🎤 NotchDrop Voice disconnect - deactivating voice agent');
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
			// console.log('🎤 Activating voice agent from NotchDrop (LiveKit only)...');

			// ONLY dispatch LiveKit voice activation event - no web interface
			if (this.mainWindow) {
				const liveKitResult = await this.mainWindow.webContents.executeJavaScript(`
window.dispatchEvent(new CustomEvent('notchdrop-activate-voice', {
detail: {
source: 'notchdrop',
timestamp: Date.now(),
action: 'activate_livekit_voice'
}
}));
'{ "success": true, "method": "LiveKit voice activation event" }';
`);
				// console.log('🎤 LiveKit voice activation event result:', liveKitResult);
				// console.log('✅ Voice conversation will stay within NotchDrop UI');
			}
		} catch (error) {
			console.error('❌ Error activating voice agent:', error);
		}
	}

	async deactivateVoiceAgent() {
		try {
			// console.log('🔌 Deactivating voice agent from NotchDrop (LiveKit only)...');

			if (this.mainWindow) {
				// ONLY dispatch LiveKit voice deactivation event - no web interface
				const liveKitResult = await this.mainWindow.webContents.executeJavaScript(`
window.dispatchEvent(new CustomEvent('notchdrop-deactivate-voice', {
detail: {
source: 'notchdrop',
timestamp: Date.now(),
action: 'deactivate_livekit_voice'
}
}));
'{ "success": true, "method": "LiveKit voice deactivation event" }';
`);
				// console.log('🔌 LiveKit voice deactivation event result:', liveKitResult);
				// console.log('✅ Voice conversation ended within NotchDrop UI');
			}
		} catch (error) {
			console.error('❌ Error deactivating voice agent:', error);
		}
	}

	async toggleVoiceMute() {
		try {
			// console.log('🔇 Toggling voice mute from NotchDrop...');

			if (this.mainWindow) {
				// Dispatch LiveKit microphone toggle event
				const muteToggleResult = await this.mainWindow.webContents.executeJavaScript(`
window.dispatchEvent(new CustomEvent('notchdrop-toggle-microphone', {
detail: {
source: 'notchdrop',
timestamp: Date.now(),
action: 'toggle_microphone_mute'
}
}));
'{ "success": true, "method": "LiveKit microphone toggle event" }';
`);
				// console.log('🔇 LiveKit microphone toggle event result:', muteToggleResult);
				// console.log('✅ Microphone mute toggled from NotchDrop');
			}
		} catch (error) {
			console.error('❌ Error toggling voice mute:', error);
		}
	}

	async updateVoiceConnectionState(status) {
		try {
			// console.log(`🔄 Updating NotchDrop voice connection state: ${status}`);

			if (!this.isInitialized) {
				log.warn('NotchDrop not initialized, cannot update voice connection state');
				return false;
			}

			// Call the native addon to update the Swift UI voice status
			if (this.notchDropAddon && this.notchDropAddon.updateVoiceConnectionState) {
				this.notchDropAddon.updateVoiceConnectionState(status);
				// console.log(`✅ NotchDrop voice status updated to: ${status}`);
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

	async addVoiceMessage(messageData) {
		try {
			// console.log(
			// `💬 Adding voice message to NotchDrop: ${
			// messageData.sender
			// }: ${messageData.content?.substring(0, 50)}...`,
			// );

			if (!this.isInitialized) {
				log.warn('NotchDrop not initialized, cannot add voice message');
				return false;
			}

			// Call the native addon to add the voice message to Swift UI
			if (this.notchDropAddon && this.notchDropAddon.addVoiceMessage) {
				this.notchDropAddon.addVoiceMessage(messageData);
				return true;
			} else {
				console.warn('⚠️ addVoiceMessage method not available on addon');
				return false;
			}
		} catch (error) {
			console.error('❌ Error adding voice message to NotchDrop:', error);
			return false;
		}
	}

	// Add transcription data to NotchDrop (following voice message pattern)
	async addTranscriptionData(transcriptionData) {
		try {
			if (!this.isInitialized) {
				log.warn('NotchDrop not initialized, cannot add transcription data');
				return false;
			}

			// Console log the transcription data in NotchDrop service
			console.log('📝 NotchDrop Service: Adding transcription data:', transcriptionData);

			// Send to Swift via native addon
			if (this.notchDropAddon && this.notchDropAddon.addTranscriptionData) {
				// Pass the messageData object directly, not the JSON string
				this.notchDropAddon.addTranscriptionData({
					sender: transcriptionData.source || 'overlay',
					content: transcriptionData.text || '',
					isFromAgent: false, // Transcription is from user, not agent
					timestamp: transcriptionData.timestamp || new Date().toISOString(),
					confidence: transcriptionData.confidence,
					words: transcriptionData.words,
					type: 'transcription',
				});
				console.log('✅ Transcription data sent to NotchDrop native addon');
				return true;
			} else {
				console.warn('⚠️ addTranscriptionData method not available on addon');
				return false;
			}
		} catch (error) {
			console.error('❌ Error adding transcription data to NotchDrop:', error);
			return false;
		}
	}

	// Send live intelligence data to NotchDrop
	async sendLiveIntelligenceData(liveIntelligenceData) {
		try {
			if (!this.isInitialized) {
				log.warn('NotchDrop not initialized, cannot send live intelligence data');
				return false;
			}

			// Console log the live intelligence data in NotchDrop service
			console.log(
				'🧠 NotchDrop Service: Adding live intelligence data:',
				liveIntelligenceData,
			);

			// Send to Swift via native addon
			if (this.notchDropAddon && this.notchDropAddon.sendLiveIntelligenceData) {
				// Pass the messageData object directly, not the JSON string
				this.notchDropAddon.sendLiveIntelligenceData({
					sender: liveIntelligenceData.source || 'ai-agent',
					content: liveIntelligenceData.text || '',
					isFromAgent: true, // Live intelligence is from AI agent
					timestamp: liveIntelligenceData.timestamp || new Date().toISOString(),
					confidence: liveIntelligenceData.confidence,
					type: 'live-intelligence',
					metadata: liveIntelligenceData.metadata,
				});
				console.log('✅ Live intelligence data sent to NotchDrop native addon');
				return true;
			} else {
				console.warn('⚠️ sendLiveIntelligenceData method not available on addon');
				return false;
			}
		} catch (error) {
			console.error('❌ Error sending live intelligence data to NotchDrop:', error);
			return false;
		}
	}

	// Send transcription data to NotchDrop
	async sendTranscriptionData(transcriptionData) {
		try {
			if (!this.isInitialized) {
				log.warn('NotchDrop not initialized, cannot send transcription data');
				return { success: false, error: 'NotchDrop not initialized' };
			}

			// Console log the transcription data in NotchDrop service
			console.log('📝 NotchDrop Service: Received transcription data:', transcriptionData);

			// Log additional details for debugging
			if (transcriptionData) {
				console.log('📝 NotchDrop Service: Transcription details:', {
					text: transcriptionData.text,
					source: transcriptionData.source,
					timestamp: transcriptionData.timestamp,
					confidence: transcriptionData.confidence,
					words: transcriptionData.words?.length || 0,
				});
			}

			// Use the existing sendMessage method with transcription type
			const messageData = {
				type: 'transcription',
				content: transcriptionData.text || '',
				text: transcriptionData.text || '',
				sender: transcriptionData.source || 'overlay',
				timestamp: transcriptionData.timestamp || new Date().toISOString(),
				confidence: transcriptionData.confidence,
				words: transcriptionData.words,
				originalData: transcriptionData,
			};

			return await this.sendMessage(messageData);
		} catch (error) {
			console.error('❌ Error sending transcription data to NotchDrop:', error);
			return { success: false, error: error.message };
		}
	}

	// Replace entire transcription list in Swift UI
	async replaceTranscriptions(messages) {
		try {
			if (!this.isInitialized) {
				log.warn('NotchDrop not initialized, cannot replace transcriptions');
				return false;
			}

			if (this.notchDropAddon && this.notchDropAddon.replaceTranscriptions) {
				// Ensure messages are well-formed
				const normalized = (messages || []).map((m) => ({
					sender: m.sender || 'overlay',
					content: m.content || m.text || '',
					isFromAgent: Boolean(m.isFromAgent) || false,
					timestamp: m.timestamp || new Date().toISOString(),
					confidence: m.confidence,
					words: m.words,
					type: 'transcription',
				}));
				this.notchDropAddon.replaceTranscriptions(normalized);
				return true;
			}
			console.warn('⚠️ replaceTranscriptions method not available on addon');
			return false;
		} catch (error) {
			console.error('❌ Error replacing transcriptions in NotchDrop:', error);
			return false;
		}
	}

	// Opposite panel sync: transcription vs live intelligence
	async setRecordingPanelMode(mode) {
		try {
			if (!this.isInitialized) {
				log.warn('NotchDrop not initialized, cannot set panel mode');
				return false;
			}

			if (this.notchDropAddon && this.notchDropAddon.setRecordingPanelMode) {
				this.notchDropAddon.setRecordingPanelMode(mode);
				log.info(`🧭 NotchDrop: setRecordingPanelMode(${mode})`);
				return true;
			} else {
				log.warn('⚠️ setRecordingPanelMode method not available on addon');
				return false;
			}
		} catch (error) {
			log.error('❌ Error setting recording panel mode:', error);
			return false;
		}
	}

	// GENERAL PURPOSE MESSAGE SYSTEM
	async sendMessage(messageData) {
		try {
			if (!this.isInitialized) {
				log.warn('NotchDrop not initialized, cannot send message');
				return { success: false, error: 'NotchDrop not initialized' };
			}

			if (!this.notchDropAddon) {
				log.warn('NotchDrop addon not available');
				return { success: false, error: 'NotchDrop addon not available' };
			}

			// Handle different message types
			switch (messageData.type) {
				case 'voice':
				case 'audio':
				case 'transcription':
					// Use existing voice message system for audio-related data
					if (this.notchDropAddon.addVoiceMessage) {
						this.notchDropAddon.addVoiceMessage({
							sender: messageData.sender || 'System',
							content: messageData.content || messageData.text || '',
							isFromAgent: messageData.isFromAgent || false,
						});
						return { success: true, type: 'voice' };
					} else {
						return { success: false, error: 'Voice message method not available' };
					}

				case 'data':
				case 'command':
				case 'notification':
				case 'status':
				default:
					// Use general message system for other data types
					if (this.notchDropAddon.sendGeneralMessage) {
						this.notchDropAddon.sendGeneralMessage(JSON.stringify(messageData));
						return { success: true, type: 'general' };
					} else {
						// Fallback to voice message system if general method not available
						log.info('📝 Fallback: Using voice message system for general data');
						if (this.notchDropAddon.addVoiceMessage) {
							this.notchDropAddon.addVoiceMessage({
								sender: messageData.sender || 'System',
								content: JSON.stringify(messageData),
								isFromAgent: messageData.isFromAgent || false,
							});
							return { success: true, type: 'fallback' };
						} else {
							return { success: false, error: 'No message methods available' };
						}
					}
			}
		} catch (error) {
			console.error('❌ Error sending message to NotchDrop:', error);
			return { success: false, error: error.message };
		}
	}

	async updateVoiceMuteState(isMuted) {
		try {
			// console.log(`🔇 Updating NotchDrop voice mute state: ${isMuted}`);

			if (!this.isInitialized) {
				log.warn('NotchDrop not initialized, cannot update voice mute state');
				return false;
			}

			// Call the native addon to update the voice mute state in Swift UI
			if (this.notchDropAddon && this.notchDropAddon.updateVoiceMuteState) {
				this.notchDropAddon.updateVoiceMuteState(isMuted);
				// console.log(`✅ Voice mute state updated to: ${isMuted}`);
				return true;
			} else {
				console.warn('⚠️ updateVoiceMuteState method not available on addon');
				return false;
			}
		} catch (error) {
			console.error('❌ Error updating voice mute state in NotchDrop:', error);
			return false;
		}
	}

	// Update voice status in NotchDrop
	async updateVoiceStatus(status) {
		try {
			if (!this.isInitialized) {
				log.warn('NotchDrop not initialized, cannot update voice status');
				return false;
			}

			// Call the native addon to update the voice status in Swift UI
			if (this.notchDropAddon && this.notchDropAddon.updateVoiceStatus) {
				this.notchDropAddon.updateVoiceStatus(status);
				// console.log(`✅ Voice status updated to: ${status}`);
				return true;
			} else {
				console.warn('⚠️ updateVoiceStatus method not available on addon');
				return false;
			}
		} catch (error) {
			console.error('❌ Error updating voice status in NotchDrop:', error);
			return false;
		}
	}

	async updateStealthModeState(isEnabled) {
		try {
			const normalized = Boolean(isEnabled);
			this.isStealthModeEnabled = normalized;

			if (!this.isInitialized) {
				log.warn('NotchDrop not initialized, deferring stealth mode update');
				return normalized;
			}

			if (
				this.notchDropAddon &&
				typeof this.notchDropAddon.updateStealthModeState === 'function'
			) {
				this.notchDropAddon.updateStealthModeState(normalized);
				// log.info(`🏴‍☠️ Stealth mode state synced to Swift UI: ${normalized}`);
			} else {
				log.warn('⚠️ updateStealthModeState method not available on addon');
			}

			return normalized;
		} catch (error) {
			log.error('❌ Error updating stealth mode state in NotchDrop:', error);
			return this.isStealthModeEnabled;
		}
	}

	async handleToggleStealthModeRequest(source = 'unknown') {
		try {
			if (!this.stealthModeController?.toggle) {
				log.warn('⚠️ Stealth mode controller not configured; cannot toggle');
				return this.isStealthModeEnabled;
			}

			const result = await Promise.resolve(this.stealthModeController.toggle(source));
			const enabled = Boolean(result);
			await this.updateStealthModeState(enabled);
			return enabled;
		} catch (error) {
			log.error('❌ Error toggling stealth mode from NotchDrop:', error);
			return this.isStealthModeEnabled;
		}
	}

	async setStealthMode(enabled) {
		try {
			if (this.stealthModeController?.setStatus) {
				await Promise.resolve(this.stealthModeController.setStatus(enabled));
			}
			return await this.updateStealthModeState(enabled);
		} catch (error) {
			log.error('❌ Error setting stealth mode state:', error);
			return this.isStealthModeEnabled;
		}
	}

	async syncStealthModeState() {
		try {
			if (!this.stealthModeController?.getStatus) {
				return this.isStealthModeEnabled;
			}

			const status = await Promise.resolve(this.stealthModeController.getStatus());
			return await this.updateStealthModeState(status);
		} catch (error) {
			log.warn('⚠️ Unable to sync stealth mode state:', error);
			return this.isStealthModeEnabled;
		}
	}

	// Handle Swift log messages
	handleSwiftLog(message) {
		try {
			// Log to Electron's log system
			// log.info(`[Swift UI] ${message}`);

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

	// Send message to Swift UI
	async sendMessageToSwiftUI(message) {
		try {
			if (!this.notchDropAddon) {
				log.warn('NotchDrop addon not initialized, cannot send message to Swift UI');
				return { success: false, error: 'NotchDrop addon not initialized' };
			}

			// Use the triggerSwiftAction method to send a custom message action
			if (this.notchDropAddon.triggerSwiftAction) {
				this.notchDropAddon.triggerSwiftAction('receiveMessage', message);
				// log.info('📤 Message sent to Swift UI:', message);
				return { success: true };
			} else {
				log.error('❌ triggerSwiftAction method not available on NotchDrop addon');
				return { success: false, error: 'triggerSwiftAction method not available' };
			}
		} catch (error) {
			log.error('❌ Error sending message to Swift UI:', error);
			return { success: false, error: error.message };
		}
	}
}

module.exports = NotchDropService;
