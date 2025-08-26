const { NotchDropAddon } = require('./build/Release/notchdrop_addon.node');

class NotchDropAddonWrapper {
	constructor() {
		this.addon = new NotchDropAddon();
		this.isInitialized = false;
		this.setupEventListeners();
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
	}

	// Initialize NotchDrop
	initialize() {
		if (this.isInitialized) {
			console.warn('NotchDrop already initialized');
			return;
		}

		try {
			this.addon.initialize();
			this.isInitialized = true;
			console.log('NotchDrop initialized successfully');
		} catch (error) {
			console.error('Failed to initialize NotchDrop:', error);
			throw error;
		}
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
}

// Export both the class and an object containing it for flexibility
module.exports = NotchDropAddonWrapper;
module.exports.NotchDropAddonWrapper = NotchDropAddonWrapper;
