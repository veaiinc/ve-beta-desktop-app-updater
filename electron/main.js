// main.js
const {
	app,
	BrowserWindow,
	Menu,
	session,
	systemPreferences,
	ipcMain,
	desktopCapturer,
	Tray,
} = require('electron');
const path = require('node:path');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

// Import Windows compatibility fixes
const { loadSharpModule, safeProcessImageWithSharp, safeExtractImageMetadata } = require('./windowsCompatibility');

// Gallery processing functions will be loaded lazily when needed
let galleryHelper = null;

const loadGalleryHelper = () => {
	if (!galleryHelper) {
		try {
			galleryHelper = require('./galleryHelper');
		} catch (error) {
			log.error('Failed to load gallery helper:', error);
			return null;
		}
	}
	return galleryHelper;
};

// Import window helper for overlay functionality
const { WindowHelper } = require('./helpers/windowHelper');
// Import dynamic island helper
// const { DynamicIslandHelper } = require('./dynamicIslandHelper');

// Windows-specific variables
let tray = null;
let isQuitting = false;

// Add global error handler to prevent crashes
process.on('uncaughtException', (error) => {
	log.error('Uncaught Exception:', error);
	// Don't exit the process, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
	log.error('Unhandled Rejection at:', promise, 'reason:', reason);
	// Don't exit the process, just log the error
});

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
		this.position.x =
			Math.floor(this.screenWidth / 2) - Math.floor(this.expandedSize.width / 2);
		this.position.y = 30; // Close to top
	}

	createDynamicIslandWindow() {
		if (this.dynamicIslandWindow !== null) return;

		log.info(
			`Creating Dynamic Island window at ${this.position.x},${this.position.y} with size ${this.expandedSize.width}x${this.expandedSize.height}`,
		);

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
				devTools: true, // Enable dev tools in production too
			},
			show: false,
			alwaysOnTop: true,
			frame: false,
			transparent: true,
			fullscreenable: false,
			hasShadow: false,
			backgroundColor: '#00000000',
			focusable: true, // Make focusable by default for better Windows support
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
		const dynamicIslandUrl =
			process.env.NODE_ENV === 'development'
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
			this.dynamicIslandWindow.setMovable(true);
		} else {
			this.dynamicIslandWindow.setAlwaysOnTop(true, 'floating');
		}

		// Set initial mouse event handling - start with mouse events ignored since it's collapsed
		this.setMouseEventHandling(true);

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

		// Enable mouse events when expanded so user can interact with it
		this.setMouseEventHandling(false);

		// Make window focusable when expanded so input fields can receive focus
		this.dynamicIslandWindow.setFocusable(true);

		// Notify renderer - window size stays the same
		this.dynamicIslandWindow.webContents.send('dynamic-island-state', { expanded: true });
		log.info('Dynamic Island expanded');
	}

	collapse() {
		if (!this.dynamicIslandWindow || !this.isExpanded) return;

		this.isExpanded = false;
		log.info('Dynamic Island content collapsed (window size remains 555x150)');

		// Disable mouse events when collapsed so clicks pass through
		this.setMouseEventHandling(true);

		// Make window non-focusable when collapsed to prevent stealing focus
		this.dynamicIslandWindow.setFocusable(false);

		// Notify renderer - window size stays the same
		this.dynamicIslandWindow.webContents.send('dynamic-island-state', { expanded: false });
		log.info('Dynamic Island collapsed');
	}

	setMouseEventHandling(ignore) {
		if (!this.dynamicIslandWindow || this.dynamicIslandWindow.isDestroyed()) return;

		try {
			if (process.platform === 'darwin') {
				// On macOS, use the forward option to allow clicks to pass through
				this.dynamicIslandWindow.setIgnoreMouseEvents(ignore, { forward: true });
			} else if (process.platform === 'win32') {
				// On Windows, when collapsed, allow clicks to pass through to overlay
				// When expanded, capture all mouse events
				if (ignore) {
					// Collapsed state - allow clicks to pass through to overlay underneath
					this.dynamicIslandWindow.setIgnoreMouseEvents(true, { forward: true });
				} else {
					// Expanded state - capture all mouse events
					this.dynamicIslandWindow.setIgnoreMouseEvents(false);
				}
			} else {
				// On other platforms, just ignore mouse events
				this.dynamicIslandWindow.setIgnoreMouseEvents(ignore);
			}
			log.info(
				`Dynamic Island mouse events ${
					ignore ? 'ignored' : 'enabled'
				} (expanded: ${!ignore}) on ${process.platform}`,
			);
		} catch (error) {
			log.error('Error setting mouse event handling:', error);
		}
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

	focus() {
		if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
			try {
				// Focus the window and bring it to front
				this.dynamicIslandWindow.focus();
				this.dynamicIslandWindow.show();
				log.info('Dynamic Island window focused');
			} catch (error) {
				log.error('Error focusing Dynamic Island window:', error);
			}
		}
	}

	destroy() {
		log.info('🧹 DynamicIslandHelper destroy started...');

		try {
			if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
				log.info('🧹 Destroying Dynamic Island window...');
				this.dynamicIslandWindow.destroy();
				this.dynamicIslandWindow = null;
			}

			// Reset state
			this.isExpanded = false;
			this.isVisible = false;

			log.info('✅ DynamicIslandHelper destroy completed');
		} catch (error) {
			log.error('Error destroying DynamicIslandHelper:', error);
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
	// Windows doesn't have the same permission system as macOS
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
	// Windows doesn't have the same permission system as macOS
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
			devTools: true, // Enable developer tools in production
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
		
		// Enable developer tools for main window in both development and production
		log.info('Dev tools available with F12, Ctrl+F12, or Ctrl+Shift+I in all modes');
	});

	// Windows-specific close behavior
	if (process.platform === 'win32') {
		mainWindow.on('close', (event) => {
			if (!isQuitting) {
				event.preventDefault();
				mainWindow.hide();
				log.info('Main window hidden to tray (Windows)');
			}
		});
	}

	// Check for updates in production
	if (process.env.NODE_ENV !== 'development') {
		autoUpdater.checkForUpdatesAndNotify();
	}
}

// Create system tray for Windows
function createTray() {
	if (process.platform !== 'win32') return;

	try {
		// Use the app icon for the tray - try multiple paths
		let iconPath;
		const possiblePaths = [
			path.join(__dirname, '..', 'electron', 'assets', 've-black-circle-logo.png'), // Development
			path.join(__dirname, 'assets', 've-black-circle-logo.png'), // Built app
			path.join(__dirname, '..', 'public', 've-black-circle-logo.png'), // Fallback
		];
		
		// Find the first path that exists
		const fs = require('fs');
		for (const testPath of possiblePaths) {
			if (fs.existsSync(testPath)) {
				iconPath = testPath;
				break;
			}
		}
		
		if (!iconPath) {
			log.warn('Tray icon not found, skipping tray creation');
			return;
		}
		tray = new Tray(iconPath);
		tray.setToolTip('VE Desktop App');

		// Create tray menu
		const contextMenu = Menu.buildFromTemplate([
			{
				label: 'Show App',
				click: () => {
					if (mainWindow && !mainWindow.isDestroyed()) {
						mainWindow.show();
						mainWindow.focus();
					}
				}
			},
			{
				label: 'Quit',
				click: () => {
					isQuitting = true;
					app.quit();
				}
			}
		]);

		tray.setContextMenu(contextMenu);

		// Double-click tray icon to show app
		tray.on('double-click', () => {
			if (mainWindow && !mainWindow.isDestroyed()) {
				mainWindow.show();
				mainWindow.focus();
			}
		});

		log.info('System tray created for Windows');
	} catch (error) {
		log.error('Error creating system tray:', error);
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

	// Check macOS microphone permission status (macOS only)
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
	} else {
		// Windows and Linux don't have the same permission system
		log.info('Platform is not macOS - using default permission handling');
	}

	// ✅ ADD THE DEBUG SCREEN PERMISSION PROMPT HERE (macOS only)
	if (process.platform === 'darwin') {
		setTimeout(async () => {
			try {
				const { systemPreferences } = require('electron');
				console.log('🔧 Forcing screen permission prompt...');
				const granted = await systemPreferences.askForMediaAccess('screen');
				console.log('🎯 Screen permission granted:', granted);
			} catch (error) {
				console.log('⚠️ Screen permission request failed:', error.message);
				// This is expected in some cases, not a critical error
			}
		}, 2000);

		// Also request camera permission
		setTimeout(async () => {
			const { systemPreferences } = require('electron');
			console.log('📹 Requesting camera permission...');
			const cameraGranted = await systemPreferences.askForMediaAccess('camera');
			console.log('📹 Camera permission granted:', cameraGranted);
		}, 3000);

		// Log initial camera permission status
		setTimeout(async () => {
			const { systemPreferences } = require('electron');
			const cameraStatus = systemPreferences.getMediaAccessStatus('camera');
			console.log('📹 Initial camera permission status:', cameraStatus);

			if (cameraStatus === 'denied') {
				console.log(
					'⚠️ Camera access denied. User needs to enable it in System Preferences > Security & Privacy > Privacy > Camera',
				);
			} else if (cameraStatus === 'restricted') {
				console.log('🚫 Camera access restricted by system policy');
			} else if (cameraStatus === 'granted') {
				console.log('✅ Camera access already granted');
			} else {
				console.log('❓ Camera permission not yet determined');
			}
		}, 4000);
	}

	createWindow();
	createTray(); // Create system tray for Windows

	// Windows compatibility startup message
	if (process.platform === 'win32') {
		log.info('🪟 Windows platform detected - initializing compatibility features...');
		// Pre-load sharp module to ensure Windows compatibility
		setTimeout(() => {
			try {
				loadSharpModule();
				log.info('✅ Windows compatibility features initialized successfully');
			} catch (error) {
				log.warn('⚠️ Windows compatibility initialization had issues:', error.message);
			}
		}, 1000);
	}

	// Initialize WindowHelper for overlay window functionality
	windowHelper = new WindowHelper();
	windowHelper.registerGlobalShortcuts(mainWindow);

	// Test shortcuts after registration
	setTimeout(() => {
		windowHelper.testShortcuts();
	}, 2000); // Wait 2 seconds for app to fully initialize

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
	} else {
		// Windows and Linux global shortcut handling
		log.info('Platform is not macOS - global shortcuts should work by default');
	}

	// Register dynamic island IPC handlers
	ipcMain.handle('dynamic-island-expand', async () => {
		try {
			if (!dynamicIslandHelper) {
				return { success: false, error: 'Dynamic Island Helper not initialized' };
			}
			const result = await dynamicIslandHelper.expand();
			return { success: true, result };
		} catch (error) {
			log.error('Error expanding dynamic island:', error);
			return { success: false, error: error.message };
		}
	});

	// Handle chat mode activation to ensure input field can receive focus
	ipcMain.handle('dynamic-island-chat-mode', async (event, isChatMode) => {
		try {
			if (!dynamicIslandHelper) {
				return { success: false, error: 'Dynamic Island Helper not initialized' };
			}

			const dynamicIslandWindow = dynamicIslandHelper.getDynamicIslandWindow();
			if (dynamicIslandWindow && !dynamicIslandWindow.isDestroyed()) {
				// Make window focusable when entering chat mode
				dynamicIslandWindow.setFocusable(isChatMode);
				
				// Windows-specific focus handling
				if (process.platform === 'win32' && isChatMode) {
					// Force focus on Windows with multiple methods
					dynamicIslandWindow.focus();
					dynamicIslandWindow.show();
					
					// Additional Windows focus method with delay
					setTimeout(() => {
						if (!dynamicIslandWindow.isDestroyed()) {
							dynamicIslandWindow.focus();
							// Send a focus event to the renderer
							dynamicIslandWindow.webContents.send('force-focus');
						}
					}, 100);
				}
				
				log.info(
					`Dynamic Island chat mode ${
						isChatMode ? 'enabled' : 'disabled'
					}, focusable: ${isChatMode}, platform: ${process.platform}`,
				);
			}

			return { success: true };
		} catch (error) {
			log.error('Error setting dynamic island chat mode:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('dynamic-island-collapse', async () => {
		try {
			if (!dynamicIslandHelper) {
				return { success: false, error: 'Dynamic Island Helper not initialized' };
			}
			const result = await dynamicIslandHelper.collapse();
			return { success: true, result };
		} catch (error) {
			log.error('Error collapsing dynamic island:', error);
			return { success: false, error: error.message };
		}
	});



	// Camera permission handler
	ipcMain.handle('request-camera-permission', async () => {
		try {
			if (process.platform === 'darwin') {
				const { systemPreferences } = require('electron');

				// First check current permission status
				const currentStatus = systemPreferences.getMediaAccessStatus('camera');
				log.info('Current camera permission status:', currentStatus);

				if (currentStatus === 'granted') {
					log.info('Camera permission already granted');
					return { success: true, granted: true, status: currentStatus };
				}

				if (currentStatus === 'denied') {
					log.warn('Camera permission denied by user');
					return {
						success: false,
						granted: false,
						status: currentStatus,
						error: 'Camera access denied. Please enable camera access in System Preferences > Security & Privacy > Privacy > Camera.',
					};
				}

				// Request permission if not determined
				log.info('Requesting camera permission...');
				const cameraGranted = await systemPreferences.askForMediaAccess('camera');
				log.info('Camera permission request result:', cameraGranted);

				return {
					success: true,
					granted: cameraGranted,
					status: cameraGranted ? 'granted' : 'denied',
					message: cameraGranted
						? 'Camera permission granted'
						: 'Camera permission denied',
				};
			} else {
				// On other platforms, assume permission is available
				log.info('Non-macOS platform - camera permission assumed available');
				return { success: true, granted: true, status: 'granted' };
			}
		} catch (error) {
			log.error('Error requesting camera permission:', error);
			return {
				success: false,
				error: error.message,
				status: 'error',
			};
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

	ipcMain.handle('dynamic-island-focus', async () => {
		try {
			if (!dynamicIslandHelper) {
				return { success: false, error: 'Dynamic Island helper not initialized' };
			}
			dynamicIslandHelper.focus();
			return { success: true };
		} catch (error) {
			log.error('Error focusing dynamic island:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('dynamic-island-set-mouse-events', async (event, ignore) => {
		try {
			if (!dynamicIslandHelper) {
				return { success: false, error: 'Dynamic Island helper not initialized' };
			}
			dynamicIslandHelper.setMouseEventHandling(ignore);
			return { success: true };
		} catch (error) {
			log.error('Error setting dynamic island mouse events:', error);
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

	// Dynamic Island to Overlay communication handlers
	log.info('=== Dynamic Island to Overlay Communication ===');

	ipcMain.handle('overlay-start-recording', async () => {
		try {
			let overlayWindow = windowHelper?.getOverlayWindow();
			if (!overlayWindow) {
				// Create overlay window if it doesn't exist
				windowHelper?.createOverlayWindow();
				// Wait a moment for the window to be created
				await new Promise((resolve) => setTimeout(resolve, 1000));
				// Get the window reference again after creating it
				overlayWindow = windowHelper?.getOverlayWindow();
			}

			if (overlayWindow) {
				// Show the window if it's not visible
				if (!overlayWindow.isVisible()) {
					windowHelper?.showOverlayWindow();
					// Wait a moment for the window to be shown
					await new Promise((resolve) => setTimeout(resolve, 500));
				}

				// Send command to overlay window to start recording
				overlayWindow.webContents.send('overlay-command', {
					action: 'startRecording',
				});
				log.info('Sent startRecording command to overlay window');
			} else {
				log.error('Overlay window not available after creating');
				return { success: false, error: 'Overlay window not available' };
			}
			return { success: true };
		} catch (error) {
			log.error('Error starting recording from dynamic island:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('overlay-stop-recording', async () => {
		try {
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow) {
				overlayWindow.webContents.send('overlay-command', {
					action: 'stopRecording',
				});
				log.info('Sent stopRecording command to overlay window');
			} else {
				log.warn('Overlay window not available for stopRecording');
			}
			return { success: true };
		} catch (error) {
			log.error('Error stopping recording from dynamic island:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('overlay-pause-recording', async () => {
		try {
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow) {
				overlayWindow.webContents.send('overlay-command', {
					action: 'pauseRecording',
				});
				log.info('Sent pauseRecording command to overlay window');
			} else {
				log.warn('Overlay window not available for pauseRecording');
			}
			return { success: true };
		} catch (error) {
			log.error('Error pausing recording from dynamic island:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('overlay-resume-recording', async () => {
		try {
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow) {
				overlayWindow.webContents.send('overlay-command', {
					action: 'resumeRecording',
				});
				log.info('Sent resumeRecording command to overlay window');
			} else {
				log.warn('Overlay window not available for resumeRecording');
			}
			return { success: true };
		} catch (error) {
			log.error('Error resuming recording from dynamic island:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('overlay-toggle-live-intelligence', async () => {
		try {
			let overlayWindow = windowHelper?.getOverlayWindow();
			if (!overlayWindow) {
				// Create overlay window if it doesn't exist
				windowHelper?.createOverlayWindow();
				// Wait a moment for the window to be created
				await new Promise((resolve) => setTimeout(resolve, 1000));
				// Get the window reference again after creating it
				overlayWindow = windowHelper?.getOverlayWindow();
			}

			if (overlayWindow) {
				// Show the window if it's not visible
				if (!overlayWindow.isVisible()) {
					windowHelper?.showOverlayWindow();
					// Wait a moment for the window to be shown
					await new Promise((resolve) => setTimeout(resolve, 500));
				}

				// Send command to overlay window to toggle live intelligence
				overlayWindow.webContents.send('overlay-command', {
					action: 'toggleLiveIntelligence',
				});
				log.info('Sent toggleLiveIntelligence command to overlay window');
			} else {
				log.error('Overlay window not available after creating');
				return { success: false, error: 'Overlay window not available' };
			}
			return { success: true };
		} catch (error) {
			log.error('Error toggling live intelligence from dynamic island:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('overlay-get-recording-state', async () => {
		try {
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow) {
				// Request state from overlay window
				overlayWindow.webContents.send('overlay-command', {
					action: 'getRecordingState',
				});
				log.info('Sent getRecordingState command to overlay window');
			} else {
				log.warn('Overlay window not available for getRecordingState');
			}
			return { success: true };
		} catch (error) {
			log.error('Error getting recording state from dynamic island:', error);
			return { success: false, error: error.message };
		}
	});

	// Handle state updates from overlay to Dynamic Island
	ipcMain.handle('overlay-state-update', async (event, state) => {
		try {
			const dynamicIslandWindow = dynamicIslandHelper?.dynamicIslandWindow;
			if (dynamicIslandWindow) {
				// Forward state to Dynamic Island window
				dynamicIslandWindow.webContents.send('overlay-state-changed', state);
				log.info('Forwarded state to Dynamic Island:', state);
			} else {
				log.warn('Dynamic Island window not available for state update');
			}
			return { success: true };
		} catch (error) {
			log.error('Error forwarding state to dynamic island:', error);
			return { success: false, error: error.message };
		}
	});

	// Test handler for debugging
	ipcMain.handle('test-overlay-connection', async () => {
		try {
			log.info('🧪 Testing overlay connection...');
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow) {
				log.info('✅ Overlay window exists');
				log.info('Overlay window visible:', overlayWindow.isVisible());
				log.info('Overlay window destroyed:', overlayWindow.isDestroyed());
				return { success: true, exists: true, visible: overlayWindow.isVisible() };
			} else {
				log.info('❌ Overlay window does not exist');
				return { success: true, exists: false, visible: false };
			}
		} catch (error) {
			log.error('Error testing overlay connection:', error);
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

	ipcMain.handle('show-askAI-window', async () => {
		try {
			if (!windowHelper) {
				return { success: false, error: 'Window helper not initialized' };
			}
			windowHelper.showAskAIWindow();
			return { success: true };
		} catch (error) {
			log.error('Error showing Ask AI window:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('is-askAI-window-visible', async () => {
		try {
			if (!windowHelper) {
				return { success: false, error: 'Window helper not initialized' };
			}
			const isVisible = windowHelper.isAskAIWindowVisible();
			return { success: true, isVisible };
		} catch (error) {
			log.error('Error checking Ask AI window visibility:', error);
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

	// Home icon click handler for Windows - restore main window
	ipcMain.handle('restore-main-window', async () => {
		try {
			if (mainWindow && !mainWindow.isDestroyed()) {
				mainWindow.show();
				mainWindow.focus();
				log.info('Main window restored from home icon click (Windows)');
				return { success: true };
			} else {
				log.warn('Main window not available to restore');
				return { success: false, error: 'Main window not available' };
			}
		} catch (error) {
		log.error('Error restoring main window:', error);
		return { success: false, error: error.message };
		}
	});

	// Register gallery IPC handlers from galleryUtils
	ipcMain.handle('process-image-with-sharp', (event, data) => {
		const helper = loadGalleryHelper();
		if (!helper) {
			return { success: false, error: 'Gallery helper not available' };
		}
		return safeProcessImageWithSharp(data, helper.processImageWithSharp);
	});
	
	ipcMain.handle('extract-image-metadata', (event, data) => {
		const helper = loadGalleryHelper();
		if (!helper) {
			return { success: false, error: 'Gallery helper not available' };
		}
		return safeExtractImageMetadata(data, helper.extractImageMetadata);
	});
	
	ipcMain.handle('download-album-zip', (event, data) => {
		const helper = loadGalleryHelper();
		if (!helper) {
			return { success: false, error: 'Gallery helper not available' };
		}
		return helper.downloadAlbumZip(event, data);
	});
	
	ipcMain.handle('create-zip-from-urls', (event, data) => {
		const helper = loadGalleryHelper();
		if (!helper) {
			return { success: false, error: 'Gallery helper not available' };
		}
		return helper.createZipFromUrls(event, data);
	});

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

	// Show camera permission help dialog
	ipcMain.handle('show-camera-permission-help', async () => {
		try {
			if (process.platform === 'darwin') {
				const { dialog } = require('electron');
				const result = await dialog.showMessageBox(mainWindow, {
					type: 'info',
					title: 'Camera Permission Required',
					message: 'Camera access is needed for webcam functionality',
					detail: 'To enable camera access:\n\n1. Go to System Preferences > Security & Privacy > Privacy\n2. Select "Camera" from the left sidebar\n3. Check the box next to this app\n4. Restart the app if needed',
					buttons: ['Open System Preferences', 'Cancel'],
					defaultId: 0,
					cancelId: 1,
				});

				if (result.response === 0) {
					// Open System Preferences to Camera section
					const { exec } = require('child_process');
					exec(
						'open "x-apple.systempreferences:com.apple.preference.security?Privacy_Camera"',
					);
				}

				return { success: true, openedSystemPrefs: result.response === 0 };
			} else {
				return {
					success: true,
					openedSystemPrefs: false,
					message: 'Camera permissions handled by system',
				};
			}
		} catch (error) {
			log.error('Error showing camera permission help:', error);
			return { success: false, error: error.message };
		}
	});

	// Check camera permission status handler
	ipcMain.handle('check-camera-permission', async () => {
		try {
			if (process.platform === 'darwin') {
				const { systemPreferences } = require('electron');
				const cameraStatus = systemPreferences.getMediaAccessStatus('camera');

				log.info('Checking camera permission status:', cameraStatus);

				return {
					success: true,
					permission: cameraStatus,
					hasPermission: cameraStatus === 'granted',
					message:
						cameraStatus === 'granted'
							? 'Camera access granted'
							: cameraStatus === 'denied'
							? 'Camera access denied'
							: cameraStatus === 'not-determined'
							? 'Camera permission not yet determined'
							: 'Camera access restricted',
				};
			} else {
				// For non-macOS platforms, assume permission is available
				return {
					success: true,
					permission: 'granted',
					hasPermission: true,
					message: 'Camera access available',
				};
			}
		} catch (error) {
			log.error('Error checking camera permission:', error);
			return {
				success: false,
				error: error.message,
				hasPermission: false,
				permission: 'error',
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

	// Open developer tools handler for WebSocket debugging
	ipcMain.handle('open-dev-tools', async (event, options = {}) => {
		try {
			const { targetWindow = 'current', mode = 'detach' } = options;
			let window = null;
			
			if (targetWindow === 'current') {
				// Use the window that sent the request
				window = BrowserWindow.fromWebContents(event.sender);
			} else if (targetWindow === 'main') {
				window = mainWindow;
			} else if (targetWindow === 'overlay') {
				window = windowHelper?.getOverlayWindow();
			} else if (targetWindow === 'askAI') {
				window = windowHelper?.getAskAIWindow();
			}
			
			if (window && !window.isDestroyed()) {
				if (window.webContents.isDevToolsOpened()) {
					window.webContents.closeDevTools();
					log.info(`Closed dev tools for ${targetWindow} window`);
				} else {
					window.webContents.openDevTools({ mode });
					log.info(`Opened dev tools for ${targetWindow} window in ${mode} mode`);
				}
				return { success: true, action: window.webContents.isDevToolsOpened() ? 'opened' : 'closed' };
			} else {
				return { success: false, error: `${targetWindow} window not available` };
			}
		} catch (error) {
			log.error('Error opening dev tools:', error);
			return { success: false, error: error.message };
		}
	});

	// Send chat message from Dynamic Island to Ask AI handler
	ipcMain.handle('send-chat-message-to-askai', async (event, chatMessage) => {
		try {
			log.info('Sending chat message from Dynamic Island to Ask AI:', chatMessage);

			// Get the Ask AI window through windowHelper
			let askAIWindow = windowHelper.getAskAIWindow();

			// If Ask AI window doesn't exist or is destroyed, create it
			if (!askAIWindow || askAIWindow.isDestroyed()) {
				log.info('Ask AI window not available, creating new window...');
				windowHelper.createAskAIWindow();

				// Wait for window to be created and ready
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Get the window reference again after creating it
				askAIWindow = windowHelper.getAskAIWindow();
			}

			// Ensure window is visible
			if (askAIWindow && !askAIWindow.isDestroyed()) {
				if (!askAIWindow.isVisible()) {
					log.info('Ask AI window exists but not visible, showing it...');
					windowHelper.showAskAIWindow();
					// Wait a bit for the window to be fully visible
					await new Promise((resolve) => setTimeout(resolve, 500));
				}

				// Send the chat message to Ask AI window
				askAIWindow.webContents.send('receive-chat-message', chatMessage);
				log.info('Chat message sent to Ask AI window successfully');
				return { success: true };
			} else {
				log.error('Ask AI window not available after creation attempts');
				return { success: false, error: 'Ask AI window not available' };
			}
		} catch (error) {
			log.error('Error sending chat message to Ask AI:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	});

	// Force open AskAI window handler (fallback for Dynamic Island)
	ipcMain.handle('force-open-askai-window', async () => {
		try {
			log.info('Force opening AskAI window...');

			// Try to create and show the window
			windowHelper.createAskAIWindow();
			await new Promise((resolve) => setTimeout(resolve, 500));

			windowHelper.showAskAIWindow();
			await new Promise((resolve) => setTimeout(resolve, 500));

			const askAIWindow = windowHelper.getAskAIWindow();
			if (askAIWindow && !askAIWindow.isDestroyed() && askAIWindow.isVisible()) {
				log.info('AskAI window opened successfully');
				return { success: true };
			} else {
				log.error('Failed to open AskAI window');
				return { success: false, error: 'Window not available or visible' };
			}
		} catch (error) {
			log.error('Error forcing open AskAI window:', error);
			return { success: false, error: error.message };
		}
	});
});

// Handle app quit properly
app.on('before-quit', (event) => {
	log.info('🔄 App quit requested - cleaning up...');

	// Prevent default quit behavior to allow cleanup
	event.preventDefault();

	// Clean up all windows and processes
	cleanupAndQuit();
});

// Handle macOS dock quit
app.on('quit', (event, exitCode) => {
	log.info('🔄 App quit event triggered with exit code:', exitCode);

	// Ensure cleanup happens even if before-quit didn't trigger
	if (dynamicIslandHelper || windowHelper) {
		log.info('🔄 Force cleanup on quit event...');
		cleanupAndQuit();
	}
});

app.on('window-all-closed', () => {
	log.info('🔄 All windows closed - cleaning up...');

	// Clean up all windows and processes
	cleanupAndQuit();
});

app.on('will-quit', () => {
	log.info('🔄 Will quit - final cleanup...');

	// Unregister all global shortcuts
	try {
		const { globalShortcut } = require('electron');
		globalShortcut.unregisterAll();
		log.info('✅ Global shortcuts unregistered');
	} catch (error) {
		log.error('Error unregistering global shortcuts:', error);
	}
});

// Function to handle cleanup and quit
function cleanupAndQuit() {
	log.info('🧹 Starting cleanup process...');

	try {
		// 1. Clean up Dynamic Island
		if (dynamicIslandHelper) {
			log.info('🧹 Cleaning up Dynamic Island...');
			dynamicIslandHelper.destroy();
			dynamicIslandHelper = null;
		}

		// 2. Clean up Window Helper and all its windows
		if (windowHelper) {
			log.info('🧹 Cleaning up Window Helper...');
			windowHelper.cleanup();
			windowHelper = null;
		}

		// 3. Close main window if it exists
		if (mainWindow && !mainWindow.isDestroyed()) {
			log.info('🧹 Closing main window...');
			mainWindow.close();
		}

		// 4. Force quit all remaining windows
		const { BrowserWindow } = require('electron');
		BrowserWindow.getAllWindows().forEach((window) => {
			if (!window.isDestroyed()) {
				log.info('🧹 Force closing window:', window.getTitle());
				window.destroy();
			}
		});

		// 5. Unregister all global shortcuts
		try {
			const { globalShortcut } = require('electron');
			globalShortcut.unregisterAll();
			log.info('✅ Global shortcuts unregistered');
		} catch (error) {
			log.error('Error unregistering global shortcuts:', error);
		}

		log.info('✅ Cleanup completed - quitting app');

		// Force quit the app
		setTimeout(() => {
			app.exit(0);
		}, 100);
	} catch (error) {
		log.error('Error during cleanup:', error);
		// Force quit even if cleanup fails
		app.exit(0);
	}
}

// Handle process exit to ensure cleanup
process.on('exit', (code) => {
	log.info('🔄 Process exiting with code:', code);
});

process.on('SIGINT', () => {
	log.info('🔄 SIGINT received - cleaning up...');
	cleanupAndQuit();
});

process.on('SIGTERM', () => {
	log.info('🔄 SIGTERM received - cleaning up...');
	cleanupAndQuit();
});
