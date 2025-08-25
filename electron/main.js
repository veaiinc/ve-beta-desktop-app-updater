// main.js
const {
	app,
	BrowserWindow,
	Menu,
	session,
	systemPreferences,
	ipcMain,
	desktopCapturer,
} = require('electron');
const path = require('node:path');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

// Import gallery processing functions
const {
	processImageWithSharp,
	extractImageMetadata,
	downloadAlbumZip,
	createZipFromUrls,
} = require('./galleryHelper');

// Import window helper for overlay functionality
const { WindowHelper } = require('./helpers/windowHelper');
// Import dynamic island helper
// const { DynamicIslandHelper } = require('./dynamicIslandHelper');

// Temporary inline DynamicIslandHelper class
class DynamicIslandHelper {
	constructor() {
		this.dynamicIslandWindow = null;
		this.isExpanded = false; // Start collapsed by default
		this.isVisible = true;
		this.screenWidth = 0;
		this.screenHeight = 0;
		
		// Default positions and sizes - start with collapsed pill size
		this.collapsedSize = { width: 250, height: 18 };
		this.expandedSize = { width: 875, height: 280, flexShrink: 0 };
		this.position = { x: 0, y: 0 };
		
		this.setupScreenDimensions();
	}

	setupScreenDimensions() {
		const { screen } = require('electron');
		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;
		this.screenWidth = workArea.width;
		this.screenHeight = workArea.height;
		
		// Position at center top - use expanded size for positioning
		this.position.x = Math.floor(this.screenWidth / 2) - Math.floor(this.expandedSize.width / 2);
		this.position.y = 30; // Close to top
	}

	createDynamicIslandWindow() {
		if (this.dynamicIslandWindow !== null) return;

		log.info(`Creating Dynamic Island window at ${this.position.x},${this.position.y} with size ${this.expandedSize.width}x${this.expandedSize.height}`);

		const { BrowserWindow } = require('electron');
		const path = require('node:path');

		const windowSettings = {
			width: this.expandedSize.width, // Start with expanded size (555x150)
			height: this.expandedSize.height, // Start with expanded size (555x150)
			x: this.position.x,
			y: this.position.y,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				preload: path.join(__dirname, 'preload.js'),
				devTools: process.env.NODE_ENV === 'development',
			},
			show: false,
			alwaysOnTop: true,
			frame: false,
			transparent: true,
			fullscreenable: false,
			hasShadow: false,
			backgroundColor: '#00000000',
			focusable: false, // Don't steal focus
			skipTaskbar: true,
			visibleOnAllWorkspaces: true,
			type: process.env.NODE_ENV === 'development' ? 'normal' : 'panel',
			acceptFirstMouse: true,
			disableAutoHideCursor: true,
			resizable: false, // Disable resizing - fixed size
			movable: false,
			minimizable: false,
			maximizable: false,
			closable: false,
		};

		this.dynamicIslandWindow = new BrowserWindow(windowSettings);

		const devURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
		const dynamicIslandUrl = process.env.NODE_ENV === 'development'
            ? `${devURL}/dynamic-island.html`
            : `file://${path.join(__dirname, '..', 'build', 'dynamic-island.html')}`;


		this.dynamicIslandWindow.loadURL(dynamicIslandUrl).catch((err) => {
			log.error('Failed to load dynamic island URL:', err);
		});

		// Configure for macOS
		if (process.platform === 'darwin') {
			this.dynamicIslandWindow.setAlwaysOnTop(true, 'floating');
			this.dynamicIslandWindow.setVisibleOnAllWorkspaces(true, {
				visibleOnFullScreen: true,
				skipTransformProcessType: true,
			});
			this.dynamicIslandWindow.setHiddenInMissionControl(true);
			this.dynamicIslandWindow.setIgnoreMouseEvents(false);
			this.dynamicIslandWindow.setMovable(true);
		} else {
			this.dynamicIslandWindow.setAlwaysOnTop(true, 'floating');
			this.dynamicIslandWindow.setIgnoreMouseEvents(false);
		}

		// Show the window
		this.dynamicIslandWindow.show();
		log.info('Dynamic Island window created and shown');

		// Listen for resize events from the renderer
		this.dynamicIslandWindow.webContents.on('did-finish-load', () => {
			log.info('Dynamic Island content loaded, setting up resize listener');
		});
	}

	expand() {
		if (!this.dynamicIslandWindow || this.isExpanded) return;
		
		this.isExpanded = true;
		log.info('Dynamic Island content expanded (window size remains 555x150)');
		
		// Notify renderer - window size stays the same
		this.dynamicIslandWindow.webContents.send('dynamic-island-state', { expanded: true });
		log.info('Dynamic Island expanded');
	}

	collapse() {
		if (!this.dynamicIslandWindow || !this.isExpanded) return;
		
		this.isExpanded = false;
		log.info('Dynamic Island content collapsed (window size remains 555x150)');
		
		// Notify renderer - window size stays the same
		this.dynamicIslandWindow.webContents.send('dynamic-island-state', { expanded: false });
		log.info('Dynamic Island collapsed');
	}

	show() {
		if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
			this.dynamicIslandWindow.show();
			this.isVisible = true;
			log.info('Dynamic Island shown');
		}
	}

	hide() {
		if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
			this.dynamicIslandWindow.hide();
			this.isVisible = false;
			log.info('Dynamic Island hidden');
		}
	}

	toggleVisibility() {
		if (this.isVisible) {
			this.hide();
		} else {
			this.show();
		}
	}

	getDynamicIslandWindow() {
		return this.dynamicIslandWindow;
	}

	isDynamicIslandVisible() {
		return this.isVisible;
	}

	isDynamicIslandExpanded() {
		return this.isExpanded;
	}

	destroy() {
		if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
			this.dynamicIslandWindow.destroy();
			this.dynamicIslandWindow = null;
		}
	}
}

let mainWindow = null;
let windowHelper = null;
let dynamicIslandHelper = null;

// Auto-updater setup
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// Update event forwarding
autoUpdater.on('checking-for-update', () => {
	log.info('Checking for updates...');
	mainWindow?.webContents.send('update-status', { status: 'checking' });
});

autoUpdater.on('update-available', (info) => {
	log.info('Update available:', info);
	mainWindow?.webContents.send('update-status', {
		status: 'download-started',
		version: info.version,
	});
});

autoUpdater.on('update-not-available', (info) => {
	log.info('Update not available:', info);
	mainWindow?.webContents.send('update-status', { status: 'not-available' });
});

autoUpdater.on('error', (err) => {
	log.error('Update error:', err);
	mainWindow?.webContents.send('update-status', {
		status: 'error',
		error: err.message,
		details: { code: err.code, errno: err.errno },
	});
});

autoUpdater.on('update-downloaded', (info) => {
	log.info('Update downloaded:', info);
	mainWindow?.webContents.send('update-status', {
		status: 'download-completed',
		version: info.version,
		message: 'Restarting in 3 seconds...',
	});
	setTimeout(() => autoUpdater.quitAndInstall(), 3000);
});

// IPC Handlers for updates
ipcMain.handle('check-for-updates', async () => {
	log.info('Manual update check triggered');
	if (process.env.NODE_ENV === 'development') {
		return { success: true, message: 'Skipped in dev mode' };
	}
	try {
		await autoUpdater.checkForUpdatesAndNotify();
		return { success: true, message: 'Check initiated' };
	} catch (error) {
		log.error('Update check failed:', error);
		return { success: false, error: error.message };
	}
});

ipcMain.handle('download-update', async () => {
	if (process.env.NODE_ENV === 'development') {
		return { success: false, error: 'Not available in dev' };
	}
	try {
		await autoUpdater.downloadUpdate();
		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
});

ipcMain.handle('restart-app', () => {
	if (process.env.NODE_ENV === 'development') return { success: false };
	autoUpdater.quitAndInstall();
	return { success: true };
});

ipcMain.handle('desktop:capture-screen', async () => {
	try {
		const sources = await desktopCapturer.getSources({
			types: ['screen'],
			thumbnailSize: { width: 1200, height: 800 },
		});

		if (!sources || sources.length === 0) {
			console.warn('⚠️ No screen sources. Permission denied or not granted.');
			return null;
		}

		const thumbnail = sources[0].thumbnail?.resize({ width: 1000, height: 700 });
		if (!thumbnail) return null;

		return thumbnail.toDataURL(); // "image/png;base64,..."
	} catch (err) {
		console.error('❌ Error in desktop:capture-screen:', err);
		return null;
	}
});

ipcMain.handle('check-screen-recording-permission', async () => {
	if (process.platform !== 'darwin') {
		return { success: true, hasPermission: true };
	}

	const { systemPreferences } = require('electron');
	const status = systemPreferences.getMediaAccessStatus('screen');

	return {
		success: true,
		permission: status,
		hasPermission: status === 'granted',
	};
});

// Request screen recording permission
ipcMain.handle('request-screen-recording-permission', async () => {
	if (process.platform !== 'darwin') {
		return { success: true, granted: true };
	}

	const { systemPreferences } = require('electron');
	const granted = await systemPreferences.askForMediaAccess('screen');

	return { success: true, granted };
});
// Window creation
function createWindow() {
	mainWindow = new BrowserWindow({
		title: 'Main window',
		width: 1366,
		height: 768,
		show: false,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	if (process.env.VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
	} else {
		mainWindow.loadFile('build/index.html');
	}

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		log.info('Window ready-to-show');
	});

	// Check for updates in production
	if (process.env.NODE_ENV !== 'development') {
		autoUpdater.checkForUpdatesAndNotify();
	}
}

// App lifecycle
app.whenReady().then(() => {
	// Set up permission request handler for microphone access
	session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
		const allowedPermissions = [
			'media', // Covers getUserMedia requests
			'audioCapture',
			'microphone',
			'camera',
			'displayCapture', // For screen sharing if needed
			'geolocation',
			'notifications',
			'clipboard-read', // Clipboard read permission
			'clipboard-write', // Clipboard write permission
		];

		log.info('Permission requested:', permission);

		if (allowedPermissions.includes(permission)) {
			log.info('✅ Granted permission for:', permission);
			callback(true);
		} else {
			log.info('❌ Denied permission for:', permission);
			callback(false);
		}
	});

	// Set default permissions for clipboard access
	session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
		if (permission === 'clipboard-read' || permission === 'clipboard-write') {
			log.info('Permission check for clipboard:', permission);
			return true;
		}
		return false;
	});

	// Check macOS microphone permission status
	if (process.platform === 'darwin') {
		const { systemPreferences } = require('electron');

		// Check microphone permission status (this is synchronous)
		const microphoneStatus = systemPreferences.getMediaAccessStatus('microphone');
		const cameraStatus = systemPreferences.getMediaAccessStatus('camera');

		log.info('macOS Microphone permission status:', microphoneStatus);
		log.info('macOS Camera permission status:', cameraStatus);

		if (microphoneStatus === 'denied') {
			log.warn(
				'Microphone access denied. Users need to grant permission in System Preferences > Privacy & Security > Microphone.',
			);
		} else if (microphoneStatus === 'not-determined') {
			log.info('Microphone permission not yet determined. Will prompt user on first access.');
		} else if (microphoneStatus === 'granted') {
			log.info('✅ Microphone permission already granted');
		} else if (microphoneStatus === 'restricted') {
			log.warn('Microphone access is restricted by system policy');
		}
	}

	// ✅ ADD THE DEBUG SCREEN PERMISSION PROMPT HERE
	if (process.platform === 'darwin') {
		setTimeout(async () => {
			const { systemPreferences } = require('electron');
			console.log('🔧 Forcing screen permission prompt...');
			const granted = await systemPreferences.askForMediaAccess('screen');
			console.log('🎯 Screen permission granted:', granted);
		}, 2000);
	}

	createWindow();

	// Initialize WindowHelper for overlay window functionality
	windowHelper = new WindowHelper();
	windowHelper.registerGlobalShortcuts(mainWindow);

	// Initialize DynamicIslandHelper for dynamic island functionality
	dynamicIslandHelper = new DynamicIslandHelper();
	dynamicIslandHelper.createDynamicIslandWindow();

	// Register global shortcut for dynamic island (Cmd+I)
	const { globalShortcut } = require('electron');
	const cmdIRegistered = globalShortcut.register('CommandOrControl+I', () => {
		log.info('Cmd+I pressed - toggling dynamic island');
		if (dynamicIslandHelper) {
			dynamicIslandHelper.toggleVisibility();
		}
	});

	if (cmdIRegistered) {
		log.info('✅ Cmd+I shortcut registered successfully for dynamic island');
	} else {
		log.error('❌ Failed to register Cmd+I shortcut for dynamic island');
	}

	// Check if global shortcuts are working (especially important on macOS)
	if (process.platform === 'darwin') {
		const { systemPreferences } = require('electron');

		// Check if the app has accessibility permissions
		const hasAccessibilityPermission = systemPreferences.isTrustedAccessibilityClient(false);

		if (!hasAccessibilityPermission) {
			log.warn('⚠️ Global shortcuts may not work! The app needs accessibility permissions.');
			log.warn(
				'Please go to System Preferences > Security & Privacy > Privacy > Accessibility',
			);
			log.warn('and add this app to the list of allowed applications.');

			// Show a dialog to the user
			// const { dialog } = require('electron');
			// dialog.showMessageBox(mainWindow, {
			// 	type: 'warning',
			// 	title: 'Accessibility Permission Required',
			// 	message: 'Global shortcuts (Cmd+B) require accessibility permissions',
			// 	detail: 'Please go to System Preferences > Security & Privacy > Privacy > Accessibility and add this app to the allowed applications list.',
			// 	buttons: ['OK'],
			// });
		} else {
			log.info('✅ Accessibility permissions granted - global shortcuts should work');
		}
	}

	// Register dynamic island IPC handlers
	ipcMain.handle('dynamic-island-expand', async () => {
		try {
			if (!dynamicIslandHelper) {
				return { success: false, error: 'Dynamic Island helper not initialized' };
			}
			dynamicIslandHelper.expand();
			return { success: true };
		} catch (error) {
			log.error('Error expanding dynamic island:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('dynamic-island-collapse', async () => {
		try {
			if (!dynamicIslandHelper) {
				return { success: false, error: 'Dynamic Island helper not initialized' };
			}
			dynamicIslandHelper.collapse();
			return { success: true };
		} catch (error) {
			log.error('Error collapsing dynamic island:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('dynamic-island-toggle', async () => {
		try {
			if (!dynamicIslandHelper) {
				return { success: false, error: 'Dynamic Island helper not initialized' };
			}
			dynamicIslandHelper.toggleVisibility();
			return { success: true };
		} catch (error) {
			log.error('Error toggling dynamic island:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('dynamic-island-show', async () => {
		try {
			if (!dynamicIslandHelper) {
				return { success: false, error: 'Dynamic Island helper not initialized' };
			}
			dynamicIslandHelper.show();
			return { success: true };
		} catch (error) {
			log.error('Error showing dynamic island:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('dynamic-island-hide', async () => {
		try {
			if (!dynamicIslandHelper) {
				return { success: false, error: 'Dynamic Island helper not initialized' };
			}
			dynamicIslandHelper.hide();
			return { success: true };
		} catch (error) {
			log.error('Error hiding dynamic island:', error);
			return { success: false, error: error.message };
		}
	});

	// Register overlay window IPC handlers
	ipcMain.handle('toggle-overlay-window', async () => {
		try {
			if (!windowHelper) {
				return { success: false, error: 'Window helper not initialized' };
			}
			windowHelper.toggleOverlayWindow();
			return { success: true };
		} catch (error) {
			log.error('Error toggling overlay window:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('update-overlay-dimensions', async (event, { width, height }) => {
		try {
			if (!windowHelper) {
				return { success: false, error: 'Window helper not initialized' };
			}
			windowHelper.updateWindowDimensions(width, height);
			return { success: true };
		} catch (error) {
			log.error('Error updating overlay dimensions:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('toggle-askAI-window', async () => {
		try {
			if (!windowHelper) {
				return { success: false, error: 'Window helper not initialized' };
			}
			windowHelper.toggleAskAIWindow();
			return { success: true };
		} catch (error) {
			log.error('Error toggling Ask AI window:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('update-askAI-dimensions', async (event, { width, height }) => {
		try {
			if (!windowHelper) {
				return { success: false, error: 'Window helper not initialized' };
			}
			windowHelper.updateAskAIWindowDimensions(width, height);
			return { success: true };
		} catch (error) {
			log.error('Error updating Ask AI dimensions:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('set-ignore-mouse-events', async (event, ignore) => {
		try {
			if (!windowHelper) {
				return { success: false, error: 'Window helper not initialized' };
			}
			const overlayWindow = windowHelper.getOverlayWindow();
			if (overlayWindow && !overlayWindow.isDestroyed()) {
				overlayWindow.setIgnoreMouseEvents(ignore);
			}
			return { success: true };
		} catch (error) {
			log.error('Error setting ignore mouse events:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('set-askAI-ignore-mouse-events', async (event, ignore) => {
		try {
			if (!windowHelper) {
				return { success: false, error: 'Window helper not initialized' };
			}
			const askAIWindow = windowHelper.getAskAIWindow();
			if (askAIWindow && !askAIWindow.isDestroyed()) {
				askAIWindow.setIgnoreMouseEvents(ignore);
			}
			return { success: true };
		} catch (error) {
			log.error('Error setting Ask AI ignore mouse events:', error);
			return { success: false, error: error.message };
		}
	});

	// New handler to track ask AI input focus state
	ipcMain.handle('set-askAI-input-focus', async (event, isFocused) => {
		try {
			// Store the focus state globally so overlay can access it
			global.askAIInputFocused = isFocused;
			return { success: true };
		} catch (error) {
			log.error('Error setting ask AI input focus state:', error);
			return { success: false, error: error.message };
		}
	});

	// Handler to get ask AI input focus state
	ipcMain.handle('get-askAI-input-focus', async () => {
		try {
			return { success: true, isFocused: global.askAIInputFocused || false };
		} catch (error) {
			log.error('Error getting ask AI input focus state:', error);
			return { success: false, error: error.message };
		}
	});

	// New handler to hide all windows (overlay and ask AI)
	ipcMain.handle('hide-all-windows', async () => {
		try {
			if (!windowHelper) {
				return { success: false, error: 'Window helper not initialized' };
			}
			windowHelper.hideAllWindows();
			return { success: true };
		} catch (error) {
			log.error('Error hiding all windows:', error);
			return { success: false, error: error.message };
		}
	});

	// Register gallery IPC handlers from galleryUtils
	ipcMain.handle('process-image-with-sharp', processImageWithSharp);
	ipcMain.handle('extract-image-metadata', extractImageMetadata);
	ipcMain.handle('download-album-zip', downloadAlbumZip);
	ipcMain.handle('create-zip-from-urls', createZipFromUrls);

	// Clipboard IPC handlers
	ipcMain.handle('clipboard-write-text', async (event, text) => {
		try {
			// Verify clipboard module is available
			const { clipboard } = require('electron');
			if (!clipboard) {
				log.error('Clipboard module not available');
				return { success: false, error: 'Clipboard module not available' };
			}

			clipboard.writeText(text);
			log.info('Text copied to clipboard successfully');
			return { success: true };
		} catch (error) {
			log.error('Clipboard write error:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('clipboard-read-text', async () => {
		try {
			// Verify clipboard module is available
			const { clipboard } = require('electron');
			if (!clipboard) {
				log.error('Clipboard module not available');
				return { success: false, error: 'Clipboard module not available' };
			}

			const text = clipboard.readText();
			return { success: true, text };
		} catch (error) {
			log.error('Clipboard read error:', error);
			return { success: false, error: error.message };
		}
	});

	// Microphone permission check handler
	ipcMain.handle('check-microphone-permission', async () => {
		try {
			if (process.platform === 'darwin') {
				const { systemPreferences } = require('electron');
				const microphoneStatus = systemPreferences.getMediaAccessStatus('microphone');

				log.info('Checking microphone permission from renderer:', microphoneStatus);

				return {
					success: true,
					permission: microphoneStatus,
					hasPermission: microphoneStatus === 'granted',
				};
			} else {
				// For non-macOS platforms, assume permission is available
				return {
					success: true,
					permission: 'granted',
					hasPermission: true,
				};
			}
		} catch (error) {
			log.error('Error checking microphone permission:', error);
			return {
				success: false,
				error: error.message,
				hasPermission: false,
			};
		}
	});

	// Request microphone permission handler
	ipcMain.handle('request-microphone-permission', async () => {
		try {
			if (process.platform === 'darwin') {
				const { systemPreferences } = require('electron');

				// Request microphone access (this will show the system dialog)
				const granted = await systemPreferences.askForMediaAccess('microphone');

				log.info('Microphone permission request result:', granted);

				return {
					success: true,
					granted: granted,
				};
			} else {
				// For non-macOS platforms, assume permission is available
				return {
					success: true,
					granted: true,
				};
			}
		} catch (error) {
			log.error('Error requesting microphone permission:', error);
			return {
				success: false,
				error: error.message,
				granted: false,
			};
		}
	});

	// Send tab content to Ask AI handler
	ipcMain.handle('send-tab-content-to-askai', async (event, tabContent) => {
		try {
			log.info('Sending tab content to Ask AI:', tabContent);

			// Get the Ask AI window through windowHelper
			const askAIWindow = windowHelper.getAskAIWindow();

			// Send the content to Ask AI window if it exists
			if (askAIWindow && !askAIWindow.isDestroyed()) {
				askAIWindow.webContents.send('receive-tab-content', tabContent);
				return { success: true };
			} else {
				// If Ask AI window doesn't exist, create it and send content
				windowHelper.showAskAIWindow();
				// Wait a bit for the window to be ready
				setTimeout(() => {
					const newAskAIWindow = windowHelper.getAskAIWindow();
					if (newAskAIWindow && !newAskAIWindow.isDestroyed()) {
						newAskAIWindow.webContents.send('receive-tab-content', tabContent);
					}
				}, 500);
				return { success: true };
			}
		} catch (error) {
			log.error('Error sending tab content to Ask AI:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	});
});

app.on('window-all-closed', () => {
	// Clean up dynamic island
	if (dynamicIslandHelper) {
		dynamicIslandHelper.destroy();
	}
	app.quit();
});

app.on('will-quit', () => {
	// Unregister all global shortcuts
	globalShortcut.unregisterAll();
});
