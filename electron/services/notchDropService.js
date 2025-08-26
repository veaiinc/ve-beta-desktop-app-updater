const path = require('path');
const log = require('electron-log');

class NotchDropService {
	constructor() {
		this.notchDropAddon = null;
		this.isInitialized = false;
		this.isEnabled = false;
		this.autoOpenOnStartup = true; // Auto-open NotchDrop when app starts
	}

	async initialize() {
		try {
			// Load the native addon wrapper
			const addonPath = path.join(__dirname, '../../notchdrop-addon/index.js');
			log.info('Loading NotchDrop addon from:', addonPath);
			const NotchDropAddonWrapper = require(addonPath);

			this.notchDropAddon = new NotchDropAddonWrapper();

			// Set up event listeners
			this.setupEventListeners();

			// Initialize the addon
			this.notchDropAddon.initialize();
			this.isInitialized = true;

			log.info('✅ NotchDrop service initialized successfully');

			// Auto-open NotchDrop after initialization if enabled
			if (this.autoOpenOnStartup) {
				setTimeout(() => {
					this.enable();
					log.info('🚀 Auto-opening NotchDrop on startup');
				}, 1000); // 1 second delay to ensure everything is ready
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
}

module.exports = NotchDropService;
