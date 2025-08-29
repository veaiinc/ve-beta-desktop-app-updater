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

		// Set up Swift action listener
		this.addon.on('swiftAction', (actionData) => {
			console.log('Swift action received:', actionData);
			this.handleSwiftAction(actionData);
		});
	}

	// Handle Swift actions and bridge to Electron overlay
	handleSwiftAction(actionData) {
		try {
			const [action, data] = actionData.split(':');
			console.log('🎯 Processing Swift action:', action, 'with data:', data);

			switch (action) {
				case 'startRecording':
					console.log('🎤 Swift requested start recording');
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
				default:
					console.warn('⚠️ Unknown Swift action:', action);
			}
		} catch (error) {
			console.error('❌ Error handling Swift action:', error);
		}
	}

	// Overlay integration methods
	async triggerOverlayRecording() {
		try {
			console.log('🎤 Triggering overlay recording from Swift');

			// Check if we're in main process or renderer process
			if (typeof require !== 'undefined') {
				try {
					// Try to use ipcRenderer (renderer process)
					const { ipcRenderer } = require('electron');
					if (ipcRenderer) {
						const result = await ipcRenderer.invoke('overlay-start-recording');
						console.log('Overlay recording result:', result);
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
								action: 'startRecording',
							});
							console.log('✅ Overlay recording command sent directly to window');
							return;
						}
					}
				}
				console.warn('⚠️ Overlay window not found');
			}
		} catch (error) {
			console.error('❌ Error triggering overlay recording:', error);
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
