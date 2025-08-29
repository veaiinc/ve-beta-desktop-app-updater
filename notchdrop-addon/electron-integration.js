const { ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const NotchDropUIBridge = require('./ui-bridge.js');

class NotchDropElectronIntegration {
	constructor() {
		this.bridge = NotchDropUIBridge.bridge;
		this.notchDropWindow = null;
		this.isInitialized = false;
	}

	async initialize(mainWindow) {
		if (this.isInitialized) {
			console.warn('NotchDrop Electron Integration already initialized');
			return;
		}

		try {
			// Initialize the UI bridge
			await this.bridge.initialize();

			// Set up IPC handlers
			this.setupIPCHandlers();

			// Set up bridge event listeners
			this.setupBridgeEventListeners();

			// Create the NotchDrop window
			await this.createNotchDropWindow();

			this.isInitialized = true;
			console.log('✅ NotchDrop Electron Integration initialized successfully');
		} catch (error) {
			console.error('❌ Failed to initialize NotchDrop Electron Integration:', error);
			throw error;
		}
	}

	setupIPCHandlers() {
		// NotchDrop control handlers
		ipcMain.handle('notchDrop:expand', async () => {
			return await this.bridge.expand();
		});

		ipcMain.handle('notchDrop:collapse', async () => {
			return await this.bridge.collapse();
		});

		// Recording control handlers
		ipcMain.handle('notchDrop:startRecording', async () => {
			return await this.bridge.startRecording();
		});

		ipcMain.handle('notchDrop:stopRecording', async () => {
			return await this.bridge.stopRecording();
		});

		ipcMain.handle('notchDrop:pauseRecording', async () => {
			return await this.bridge.pauseRecording();
		});

		ipcMain.handle('notchDrop:resumeRecording', async () => {
			return await this.bridge.resumeRecording();
		});

		// Chat mode handlers
		ipcMain.handle('notchDrop:setChatMode', async (event, enabled) => {
			this.bridge.setChatMode(enabled);
			return { success: true };
		});

		ipcMain.handle('notchDrop:setChatInput', async (event, input) => {
			this.bridge.setChatInput(input);
			return { success: true };
		});

		// Timer handlers
		ipcMain.handle('notchDrop:updateTimer', async (event, seconds) => {
			this.bridge.updateTimer(seconds);
			return { success: true };
		});

		// State handlers
		ipcMain.handle('notchDrop:getState', async () => {
			return this.bridge.getUIState();
		});

		// Overlay state integration
		ipcMain.handle('notchDrop:onOverlayStateChange', async (event, state) => {
			this.bridge.onOverlayStateChange(state);
			return { success: true };
		});

		// Enhanced overlay integration handlers
		ipcMain.handle('notchDrop:triggerOverlayRecording', async () => {
			return await this.bridge.triggerOverlayRecording();
		});

		ipcMain.handle('notchDrop:triggerOverlayToggleLiveIntelligence', async () => {
			return await this.bridge.triggerOverlayToggleLiveIntelligence();
		});
	}

	setupBridgeEventListeners() {
		// Listen for Swift actions from the native addon
		this.bridge.on('swiftAction', (actionData) => {
			console.log('🎯 Swift action received in Electron integration:', actionData);
			this.handleSwiftAction(actionData);
		});

		// Listen for other bridge events
		this.bridge.on('uiStateChanged', (state) => {
			console.log('📊 UI state changed:', state);
			// Update the NotchDrop window if needed
		});

		// Listen for recording events and forward to main window
		this.bridge.on('startRecording', () => {
			// Forward to overlay window if it exists
			if (global.overlayWindow && !global.overlayWindow.isDestroyed()) {
				global.overlayWindow.webContents.send('notchDrop:startRecording');
			}
		});

		this.bridge.on('stopRecording', () => {
			if (global.overlayWindow && !global.overlayWindow.isDestroyed()) {
				global.overlayWindow.webContents.send('notchDrop:stopRecording');
			}
		});

		this.bridge.on('pauseRecording', () => {
			if (global.overlayWindow && !global.overlayWindow.isDestroyed()) {
				global.overlayWindow.webContents.send('notchDrop:pauseRecording');
			}
		});

		this.bridge.on('resumeRecording', () => {
			if (global.overlayWindow && !global.overlayWindow.isDestroyed()) {
				global.overlayWindow.webContents.send('notchDrop:resumeRecording');
			}
		});

		// Enhanced overlay trigger events
		this.bridge.on('triggerOverlayRecording', () => {
			if (global.overlayWindow && !global.overlayWindow.isDestroyed()) {
				global.overlayWindow.webContents.send('overlay-command', {
					action: 'startRecording',
				});
			}
		});

		this.bridge.on('toggleLiveIntelligence', () => {
			if (global.overlayWindow && !global.overlayWindow.isDestroyed()) {
				global.overlayWindow.webContents.send('overlay-command', {
					action: 'toggleLiveIntelligence',
				});
			}
		});

		// Listen for file drops
		this.bridge.on('fileDropped', (filePath) => {
			if (this.notchDropWindow && !this.notchDropWindow.isDestroyed()) {
				this.notchDropWindow.webContents.send('notchDrop:fileDropped', filePath);
			}
		});
	}

	// Handle Swift actions and bridge to overlay system
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
					this.bridge.expand();
					break;
				case 'collapse':
					console.log('📐 Swift requested collapse');
					this.bridge.collapse();
					break;
				case 'toggleChatMode':
					console.log('💬 Swift requested toggle chat mode');
					this.bridge.setChatMode(!this.bridge.getUIState().isChatMode);
					break;
				case 'submitChat':
					console.log('📝 Swift submitted chat:', data);
					this.bridge.setChatInput(data);
					// Handle chat submission
					break;
				case 'setAuthenticated':
					console.log('🔐 Swift set authenticated:', data);
					this.bridge.updateUIState({ isAuthenticated: data === 'true' });
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

			// Use IPC to communicate with main process
			const { ipcRenderer } = require('electron');
			if (ipcRenderer) {
				const result = await ipcRenderer.invoke('overlay-start-recording');
				console.log('Overlay recording result:', result);
			}
		} catch (error) {
			console.error('❌ Error triggering overlay recording:', error);
		}
	}

	async triggerOverlayStopRecording() {
		try {
			console.log('⏹️ Triggering overlay stop recording from Swift');

			const { ipcRenderer } = require('electron');
			if (ipcRenderer) {
				const result = await ipcRenderer.invoke('overlay-stop-recording');
				console.log('Overlay stop recording result:', result);
			}
		} catch (error) {
			console.error('❌ Error triggering overlay stop recording:', error);
		}
	}

	async triggerOverlayPauseRecording() {
		try {
			console.log('⏸️ Triggering overlay pause recording from Swift');

			const { ipcRenderer } = require('electron');
			if (ipcRenderer) {
				const result = await ipcRenderer.invoke('overlay-pause-recording');
				console.log('Overlay pause recording result:', result);
			}
		} catch (error) {
			console.error('❌ Error triggering overlay pause recording:', error);
		}
	}

	async triggerOverlayResumeRecording() {
		try {
			console.log('▶️ Triggering overlay resume recording from Swift');

			const { ipcRenderer } = require('electron');
			if (ipcRenderer) {
				const result = await ipcRenderer.invoke('overlay-resume-recording');
				console.log('Overlay resume recording result:', result);
			}
		} catch (error) {
			console.error('❌ Error triggering overlay resume recording:', error);
		}
	}

	async triggerOverlayToggleLiveIntelligence() {
		try {
			console.log('🧠 Triggering overlay toggle live intelligence from Swift');

			const { BrowserWindow } = require('electron');
			const windows = BrowserWindow.getAllWindows();
			for (const window of windows) {
				if (window.webContents && !window.isDestroyed()) {
					window.webContents.send('notchdrop:triggerOverlayToggleLiveIntelligence');
					break;
				}
			}
		} catch (error) {
			console.error('❌ Error triggering overlay toggle live intelligence:', error);
		}
	}

	async createNotchDropWindow() {
		// Create the NotchDrop window
		this.notchDropWindow = new BrowserWindow({
			width: 575,
			height: 180,
			x: 0,
			y: 0,
			frame: false,
			transparent: true,
			alwaysOnTop: true,
			skipTaskbar: true,
			resizable: false,
			movable: false,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				preload: path.join(__dirname, 'preload.js'),
			},
		});

		// Load the UI
		if (process.env.NODE_ENV === 'development') {
			// Development mode - load from Vite dev server
			await this.notchDropWindow.loadURL('http://localhost:5173');
		} else {
			// Production mode - load from built files
			await this.notchDropWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
		}

		// Position the window at the top center of the screen
		this.positionWindow();

		// Handle window events
		this.notchDropWindow.on('closed', () => {
			this.notchDropWindow = null;
		});

		console.log('✅ NotchDrop window created successfully');
	}

	positionWindow() {
		if (!this.notchDropWindow) return;

		// Get the primary display
		const { screen } = require('electron');
		const primaryDisplay = screen.getPrimaryDisplay();
		const { width, height } = primaryDisplay.workAreaSize;

		// Position at the top center
		const windowWidth = 575;
		const windowHeight = 180;
		const x = Math.floor((width - windowWidth) / 2);
		const y = 0;

		this.notchDropWindow.setBounds({ x, y, width: windowWidth, height: windowHeight });
	}

	// Public methods for external use
	show() {
		if (this.notchDropWindow && !this.notchDropWindow.isDestroyed()) {
			this.notchDropWindow.show();
		}
	}

	hide() {
		if (this.notchDropWindow && !this.notchDropWindow.isDestroyed()) {
			this.notchDropWindow.hide();
		}
	}

	toggle() {
		if (this.notchDropWindow && !this.notchDropWindow.isDestroyed()) {
			if (this.notchDropWindow.isVisible()) {
				this.hide();
			} else {
				this.show();
			}
		}
	}

	// Cleanup
	destroy() {
		if (this.notchDropWindow && !this.notchDropWindow.isDestroyed()) {
			this.notchDropWindow.destroy();
		}

		if (this.bridge) {
			this.bridge.destroy();
		}

		this.isInitialized = false;
		console.log('🧹 NotchDrop Electron Integration destroyed');
	}
}

// Create singleton instance
const notchDropIntegration = new NotchDropElectronIntegration();

// Export both the class and singleton instance
module.exports = NotchDropElectronIntegration;
module.exports.integration = notchDropIntegration;
