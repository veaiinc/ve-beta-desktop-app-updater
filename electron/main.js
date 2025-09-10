// main.js
const {
	app,
	BrowserWindow,
	Menu,
	session,
	systemPreferences,
	ipcMain,
	desktopCapturer,
	Notification,
	Tray,
	screen,
	globalShortcut,
	clipboard,
	dialog,
} = require('electron');
const path = require('node:path');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const { WindowHelper } = require('./helpers/windowHelper');
const fs = require('fs');
const { exec } = require('child_process');
// Import dynamic island helper
// const { DynamicIslandHelper } = require('./dynamicIslandHelper');

// Import Windows compatibility fixes
const {
	loadSharpModule,
	safeProcessImageWithSharp,
	safeExtractImageMetadata,
} = require('./windowsCompatibility');

const {
	processImageWithSharp,
	extractImageMetadata,
	downloadAlbumZip,
	createZipFromUrls,
} = require('./galleryHelper');

const meetingMonitor = require('./notificationHelper'); // Adjust path if needed
// Import NotchDrop service
const NotchDropService = require('./services/notchDropService');

// Gallery processing functions will be loaded lazily when needed
let galleryHelper = null;
let mainWindow = null;
let windowHelper = null;
let dynamicIslandHelper = null;
let pendingNotificationAction = null;

// Windows-specific variables
let tray = null;
let isQuitting = false;

// Runtime platform override for testing (set VE_FORCE_PLATFORM=linux|win32|darwin)
const RUNTIME_PLATFORM = process.env.VE_FORCE_PLATFORM || process.platform;
const isMacRuntime = RUNTIME_PLATFORM === 'darwin';
const isWindowsRuntime = RUNTIME_PLATFORM === 'win32';

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
// Import dynamic island helper
// const { DynamicIslandHelper } = require('./dynamicIslandHelper');

// Window state management
let lastWindowState = {
	route: '/home', // Default route
	timestamp: Date.now(),
	windowBounds: null, // Store window size and position
};

// Recording timer variables for Are You There functionality
let recordingStartTime = null;
let areYouThereTimer = null;
let isAreYouThereWindowShown = false;
let isRecordingActive = false;

// Transcription detection variables for Are You There functionality
let lastTranscriptionTime = null;
let transcriptionDetectionTimer = null;
let isTranscriptionDetectionActive = false;
let isTranscriptionBasedAreYouThereShown = false;

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
		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;
		this.screenWidth = workArea.width;
		this.screenHeight = workArea.height;

		// Position at center top - use expanded size for positioning
		this.position.x =
			Math.floor(this.screenWidth / 2) - Math.floor(this.expandedSize.width / 2);

		this.position.y = 0;
	}

	createDynamicIslandWindow() {
		if (this.dynamicIslandWindow !== null) return;

		// Skip window creation on macOS (runtime) - only create for Windows/Linux
		if (isMacRuntime) {
			log.info('🍎 Skipping Dynamic Island window creation on macOS');
			return;
		}

		const windowSettings = {
			width: this.expandedSize.width, // Start with expanded size (875x280)
			height: this.expandedSize.height, // Start with expanded size (875x280)
			x: this.position.x,
			y: this.position.y, // Y=0 to stick to top of screen
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				preload: path.join(__dirname, 'preload.js'),
				devTools: true, // Enable dev tools in production too
			},
			show: true, // Show immediately when created
			alwaysOnTop: true,
			frame: false, // Frameless to blend with menu bar
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
			movable: true, // Enable movement for Dynamic Island
			minimizable: false,
			maximizable: false,
			closable: false,
		};

		this.dynamicIslandWindow = new BrowserWindow(windowSettings);

		const devURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
		// Force the Dynamic Island React app mode so it renders the island UI
		const query = '?mode=dynamic-island';
		const dynamicIslandUrl =
			process.env.NODE_ENV === 'development'
				? `${devURL}/dynamic-island.html${query}`
				: `file://${path.join(__dirname, '..', 'build', 'dynamic-island.html')}${query}`;

		this.dynamicIslandWindow.loadURL(dynamicIslandUrl).catch((err) => {
			log.error('Failed to load dynamic island URL:', err);
		});

		// Configure for non-macOS platforms
		this.dynamicIslandWindow.setAlwaysOnTop(true, 'screen-saver');

		// Set initial mouse event handling - start with mouse events ignored since it's collapsed
		this.setMouseEventHandling(true);

		// Show the window immediately
		this.dynamicIslandWindow.show();
		this.isVisible = true;
		log.info('Dynamic Island window created and shown immediately');

		// Listen for resize events from the renderer
		this.dynamicIslandWindow.webContents.on('did-finish-load', () => {
			log.info('Dynamic Island content loaded, setting up resize listener');
			// Send initial state to React component - start collapsed
			log.info('Sending initial state to React component: { expanded: false }');
			this.dynamicIslandWindow.webContents.send('dynamic-island-state', { expanded: false });
		});
	}

	expand() {
		// On macOS (runtime), just track the state without window operations
		if (isMacRuntime) {
			this.isExpanded = true;
			log.info('🍎 Dynamic Island expand state tracked (no window on macOS)');
			return;
		}

		if (!this.dynamicIslandWindow || this.isExpanded) return;

		this.isExpanded = true;

		// Enable mouse events when expanded so user can interact with it
		this.setMouseEventHandling(false);

		// Make window focusable when expanded so input fields can receive focus
		this.dynamicIslandWindow.setFocusable(true);

		// Notify renderer - window size stays the same
		this.dynamicIslandWindow.webContents.send('dynamic-island-state', { expanded: true });
	}

	collapse() {
		// On macOS (runtime), just track the state without window operations
		if (isMacRuntime) {
			this.isExpanded = false;
			log.info('🍎 Dynamic Island collapse state tracked (no window on macOS)');
			return;
		}

		if (!this.dynamicIslandWindow || !this.isExpanded) return;

		this.isExpanded = false;

		// Disable mouse events when collapsed so clicks pass through
		this.setMouseEventHandling(true);

		// Make window non-focusable when collapsed to prevent stealing focus
		this.dynamicIslandWindow.setFocusable(false);

		// Notify renderer - window size stays the same
		this.dynamicIslandWindow.webContents.send('dynamic-island-state', { expanded: false });
	}

	setMouseEventHandling(ignore) {
		if (!this.dynamicIslandWindow || this.dynamicIslandWindow.isDestroyed()) return;

		try {
			if (isMacRuntime) {
				// On macOS, use the forward option to allow clicks to pass through
				this.dynamicIslandWindow.setIgnoreMouseEvents(ignore, { forward: true });
			} else if (isWindowsRuntime) {
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
		} catch (error) {
			log.error('Error setting mouse event handling:', error);
		}
	}

	show() {
		// On macOS (runtime), just track the state without window operations
		if (isMacRuntime) {
			this.isVisible = true;
			log.info('🍎 Dynamic Island show state tracked (no window on macOS)');
			return;
		}

		if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
			this.dynamicIslandWindow.show();
			this.isVisible = true;
			log.info('Dynamic Island shown');
		}
	}

	hide() {
		// On macOS (runtime), just track the state without window operations
		if (isMacRuntime) {
			this.isVisible = false;
			log.info('🍎 Dynamic Island hide state tracked (no window on macOS)');
			return;
		}

		if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
			this.dynamicIslandWindow.hide();
			this.isVisible = false;
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

	// Method to reposition Dynamic Island based on platform
	repositionForPlatform() {
		// On macOS (runtime), just log that repositioning was called
		if (isMacRuntime) {
			log.info('🍎 Dynamic Island reposition called (no window on macOS)');
			return;
		}

		if (!this.dynamicIslandWindow || this.dynamicIslandWindow.isDestroyed()) return;

		// Recalculate position based on current platform - eliminate gap with menu bar
		if (isWindowsRuntime) {
			this.position.y = -5; // Slightly above screen edge on Windows
		} else {
			this.position.y = -8; // Slightly above screen edge on Linux to eliminate menu bar gap
		}

		// Update window position
		this.dynamicIslandWindow.setPosition(this.position.x, this.position.y);
	}

	focus() {
		// On macOS (runtime), just log that focus was called
		if (isMacRuntime) {
			log.info('🍎 Dynamic Island focus called (no window on macOS)');
			return;
		}

		if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
			try {
				// Focus the window and bring it to front
				this.dynamicIslandWindow.focus();
				this.dynamicIslandWindow.show();
			} catch (error) {
				log.error('Error focusing Dynamic Island window:', error);
			}
		}
	}

	showDynamicIsland() {
		if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
			try {
				this.dynamicIslandWindow.show();
				this.isVisible = true;
				log.info('Dynamic Island shown');
			} catch (error) {
				log.error('Error showing Dynamic Island:', error);
			}
		}
	}

	expandDynamicIsland() {
		if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
			try {
				// Set expanded size and position
				this.dynamicIslandWindow.setSize(this.expandedSize.width, this.expandedSize.height);
				this.dynamicIslandWindow.setPosition(this.position.x, this.position.y);
				this.isExpanded = true;

				// Enable mouse events when expanded so user can interact with it
				this.setMouseEventHandling(false);

				// Make window focusable when expanded so input fields can receive focus
				this.dynamicIslandWindow.setFocusable(true);

				// Send state change to the window
				this.dynamicIslandWindow.webContents.send('dynamic-island-state', {
					expanded: true,
					visible: true,
				});

				log.info('Dynamic Island expanded');
			} catch (error) {
				log.error('Error expanding Dynamic Island:', error);
			}
		}
	}

	destroy() {
		try {
			if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
				this.dynamicIslandWindow.destroy();
				this.dynamicIslandWindow = null;
			}

			// Reset state
			this.isExpanded = false;
			this.isVisible = false;
		} catch (error) {
			log.error('Error destroying DynamicIslandHelper:', error);
		}
	}
}
let notchDropService = null;

// Auto-updater setup
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// Configure auto-updater for all platforms
autoUpdater.autoDownload = false; // Manual control for better error handling
autoUpdater.autoInstallOnAppQuit = true;

// Update event forwarding
autoUpdater.on('checking-for-update', () => {
	mainWindow?.webContents.send('update-status', { status: 'checking' });
});

autoUpdater.on('update-available', (info) => {
	log.info('Update available:', info);

	// Notify frontend that update is available
	mainWindow?.webContents.send('update-status', {
		status: 'available',
		version: info.version,
	});

	// Start manual download since autoDownload is false
	log.info('Starting update download...');
	autoUpdater.downloadUpdate().catch((downloadErr) => {
		log.error('Download failed:', downloadErr);
		mainWindow?.webContents.send('update-status', {
			status: 'download-failed',
			error: downloadErr.message,
			details: { code: downloadErr.code },
		});
	});
});

autoUpdater.on('update-not-available', (info) => {
	log.info('Update not available:', info);
	mainWindow?.webContents.send('update-status', { status: 'not-available' });
});

autoUpdater.on('error', (err) => {
	log.error('Update error:', err);

	let errorStatus = {
		status: 'error',
		error: err.message,
		details: { code: err.code, errno: err.errno },
	};

	// Handle specific error types
	if (err.message.includes('checksum mismatch') || err.code === 'ERR_CHECKSUM_MISMATCH') {
		log.warn('Checksum mismatch detected - likely due to unsigned builds');
		errorStatus = {
			status: 'checksum-error',
			error: 'Update verification failed. This may be due to unsigned builds.',
			details: {
				code: err.code,
				errno: err.errno,
				suggestion: 'Try manual download or check for signed releases',
			},
		};
	} else if (err.message.includes('ENOENT') || err.message.includes('404')) {
		errorStatus = {
			status: 'not-found',
			error: 'Update file not found on server.',
			details: { code: err.code },
		};
	} else if (err.message.includes('network') || err.message.includes('ENOTFOUND')) {
		errorStatus = {
			status: 'network-error',
			error: 'Network error while checking for updates.',
			details: { code: err.code },
		};
	} else if (err.message.includes('ditto') || err.message.includes('No such file or directory')) {
		errorStatus = {
			status: 'installation-error',
			error: 'Update installation failed due to file system error.',
			details: {
				code: err.code,
				suggestion:
					'Please try restarting the app manually or download the update from the releases page.',
			},
		};
	}

	mainWindow?.webContents.send('update-status', errorStatus);
});

autoUpdater.on('update-downloaded', (info) => {
	log.info('Update downloaded:', info);

	// Show user-friendly message about automatic restart
	mainWindow?.webContents.send('update-status', {
		status: 'downloaded',
		version: info.version,
		message: 'Update downloaded! App will restart automatically in 3 seconds...',
	});

	// Auto-restart after 3 seconds
	setTimeout(() => {
		log.info('Auto-restarting app to install update...');

		// Clean up before restart
		if (dynamicIslandHelper) {
			dynamicIslandHelper.destroy();
		}
		if (windowHelper) {
			windowHelper.cleanup();
		}

		// Restart automatically
		autoUpdater.quitAndInstall(true, false); // Wait for windows to close gracefully
	}, 3000);
});

function showNotification(title, body) {
	const notification = new Notification({
		title: title || 'Alert',
		body: body || 'This is a test',
		silent: false,
		actions: [
			{ type: 'button', text: 'Join Meet' },
			{ type: 'button', text: 'Not Now' },
		],
	});

	notification.on('action', (event, index) => {
		if (index === 0) {
			log.info('User clicked "Join Meet"');
			handleNotificationAction('join-meet');
		} else {
			log.info('User clicked "Not Now"');
		}
	});

	notification.on('click', () => {
		log.info('Notification clicked - treating as "Join Meet"');
		handleNotificationAction('join-meet');
		if (mainWindow) mainWindow.focus();
	});

	notification.show();
}

function handleNotificationAction(action) {
	pendingNotificationAction = action;

	if (action === 'join-meet') {
		if (!windowHelper) {
			log.info('windowHelper not ready — action queued');
			return;
		}

		// First, ensure overlay window exists and is created
		let overlayWindow = windowHelper.getOverlayWindow();

		if (!overlayWindow || overlayWindow.isDestroyed()) {
			windowHelper.createOverlayWindow();

			// Wait a moment for the window to be created
			setTimeout(() => {
				overlayWindow = windowHelper.getOverlayWindow();
				if (overlayWindow && !overlayWindow.isDestroyed()) {
					handleOverlayWindowReady(overlayWindow);
				} else {
					log.error('Failed to create overlay window');
				}
			}, 1000);
		} else {
			// Window exists, handle it directly
			handleOverlayWindowReady(overlayWindow);
		}

		// Show and expand dynamic island
		dynamicIslandHelper?.show();
		dynamicIslandHelper?.expand();

		pendingNotificationAction = null;
	}
}

// Helper function to handle overlay window when it's ready
function handleOverlayWindowReady(overlayWindow) {
	// Show the overlay window first
	windowHelper.showOverlayWindow();

	// Focus the window to ensure it's visible
	overlayWindow.focus();
	overlayWindow.show();

	// Wait for DOM to be ready before sending commands
	overlayWindow.webContents.once('dom-ready', () => {
		// Small delay to ensure React has mounted
		setTimeout(() => {
			// Send the startRecording command
			overlayWindow.webContents.send('overlay-command', {
				action: 'startRecording',
			});
		}, 500);
	});

	// Also listen for the window to finish loading
	overlayWindow.webContents.once('did-finish-load', () => {
		log.info('Overlay window finished loading');
	});

	// Additional safety check - if DOM ready doesn't fire within 3 seconds, try sending anyway
	setTimeout(() => {
		if (overlayWindow && !overlayWindow.isDestroyed()) {
			log.info('Fallback: sending startRecording command after timeout');
			overlayWindow.webContents.send('overlay-command', {
				action: 'startRecording',
			});
		}
	}, 3000);
}
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
	if (process.env.NODE_ENV === 'development') {
		return { success: false, error: 'Not available in development' };
	}

	try {
		// Clean up before restart
		if (dynamicIslandHelper) {
			dynamicIslandHelper.destroy();
		}
		if (windowHelper) {
			windowHelper.cleanup();
		}

		log.info('Restarting app to install update...');

		// Use safer restart approach - wait for windows to close gracefully
		// This helps avoid file system conflicts during update
		autoUpdater.quitAndInstall(true, false); // Wait for windows to close, don't force quit

		return { success: true };
	} catch (error) {
		log.error('Error restarting app:', error);
		return { success: false, error: error.message };
	}
});

// Add manual download handler for Windows checksum issues
ipcMain.handle('force-download-update', async () => {
	if (process.env.NODE_ENV === 'development') {
		return { success: false, error: 'Not available in dev' };
	}

	try {
		log.info('Force downloading update (skipping checksum verification)...');

		// Temporarily disable autoDownload if it was enabled
		const originalAutoDownload = autoUpdater.autoDownload;
		autoUpdater.autoDownload = false;

		// Start download
		await autoUpdater.downloadUpdate();

		// Restore original setting
		autoUpdater.autoDownload = originalAutoDownload;

		return { success: true, message: 'Force download initiated' };
	} catch (error) {
		log.error('Force download failed:', error);
		return { success: false, error: error.message };
	}
});

// Dynamic Island repositioning handler
ipcMain.handle('reposition-dynamic-island', () => {
	if (dynamicIslandHelper) {
		dynamicIslandHelper.repositionForPlatform();
		return { success: true, platform: process.platform };
	}
	return { success: false, error: 'Dynamic Island helper not available' };
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
	const granted = await systemPreferences.askForMediaAccess('screen');

	return { success: true, granted };
});
// Window state management functions
function saveWindowState() {
	if (mainWindow && !mainWindow.isDestroyed()) {
		// Save current route, timestamp, and window bounds
		lastWindowState = {
			route: '/home', // Default route - can be enhanced to get actual route
			timestamp: Date.now(),
			windowBounds: mainWindow.getBounds(), // Save window size and position
		};
		log.info('Window state saved:', lastWindowState);
	}
}

// function restoreWindowState() {
// 	return lastWindowState;
// }

// Menu bar creation
function createMenuBar() {
	const isMac = isMacRuntime;
	const template = [
		{
			label: 'Application',
			submenu: [
				{
					label: 'About',
					role: 'about',
				},
				{
					type: 'separator',
				},
				{
					label: 'Quit',
					accelerator: isMac ? 'Cmd+Q' : 'Ctrl+Q',
					click: () => {
						app.quit();
					},
				},
			],
		},
		// Insert NotchDrop menu only on macOS
		...(isMac
			? [
					{
						label: 'Notch',
						submenu: [
							{
								label: 'Open Notch',
								accelerator: 'CmdOrCtrl+N',
								click: async () => {
									try {
										if (notchDropService) {
											const result = await notchDropService.enable();
											if (result) {
												log.info('✅ NotchDrop opened from menu');
												updateMenuBarState();
											}
										}
									} catch (error) {
										log.error('❌ Failed to open NotchDrop from menu:', error);
									}
								},
							},
							{
								label: 'Close Notch',
								accelerator: 'CmdOrCtrl+Shift+N',
								click: async () => {
									try {
										if (notchDropService) {
											const result = await notchDropService.disable();
											if (result) {
												log.info('✅ NotchDrop closed from menu');
												updateMenuBarState();
											}
										}
									} catch (error) {
										log.error('❌ Failed to close NotchDrop from menu:', error);
									}
								},
							},
							{
								type: 'separator',
							},
							{
								label: 'Toggle Notch',
								accelerator: 'CmdOrCtrl+T',
								click: async () => {
									try {
										if (notchDropService) {
											const result = await notchDropService.toggle();
											if (result) {
												log.info('✅ NotchDrop toggled from menu');
												updateMenuBarState();
											}
										}
									} catch (error) {
										log.error(
											'❌ Failed to toggle NotchDrop from menu:',
											error,
										);
									}
								},
							},
							{
								type: 'separator',
							},
							{
								label: 'Status',
								enabled: false,
								id: 'notchdrop-status',
							},
							{
								type: 'separator',
							},
							{
								label: 'Auto-open on Startup',
								type: 'checkbox',
								checked: true,
								click: async (menuItem) => {
									try {
										if (notchDropService) {
											const result =
												await notchDropService.setAutoOpenOnStartup(
													menuItem.checked,
												);
											if (result) {
												log.info(
													`🔧 Auto-open on startup ${
														menuItem.checked ? 'enabled' : 'disabled'
													} from menu`,
												);
											}
										}
									} catch (error) {
										log.error(
											'❌ Failed to set auto-open setting from menu:',
											error,
										);
									}
								},
							},
						],
					},
			  ]
			: []),
		{
			label: 'View',
			submenu: [
				{
					label: 'Toggle Developer Tools',
					accelerator: 'F12',
					click: () => {
						mainWindow.webContents.toggleDevTools();
					},
				},
				// Show Dynamic Island toggle only for non-mac runtime
				...(isMac
					? []
					: [
							{
								label: 'Toggle Dynamic Island',
								accelerator: 'CmdOrCtrl+I',
								click: () => {
									try {
										if (dynamicIslandHelper) {
											dynamicIslandHelper.toggleVisibility();
										}
									} catch (error) {
										log.error(
											'Error toggling dynamic island from menu:',
											error,
										);
									}
								},
							},
					  ]),
				{
					label: 'Reload',
					accelerator: 'CmdOrCtrl+R',
					click: () => {
						mainWindow.reload();
					},
				},
			],
		},
		{
			label: 'Window',
			submenu: [
				{
					label: 'Minimize',
					accelerator: 'CmdOrCtrl+M',
					role: 'minimize',
				},
				{
					label: 'Close',
					accelerator: 'CmdOrCtrl+W',
					role: 'close',
				},
			],
		},
	];

	// macOS specific menu adjustments
	if (process.platform === 'darwin') {
		// Add macOS specific items to the Application menu
		template[0].submenu = [
			{
				label: 'About',
				role: 'about',
			},
			{
				type: 'separator',
			},
			{
				label: 'Services',
				role: 'services',
				submenu: [],
			},
			{
				type: 'separator',
			},
			{
				label: 'Hide',
				accelerator: 'Cmd+H',
				role: 'hide',
			},
			{
				label: 'Hide Others',
				accelerator: 'Cmd+Shift+H',
				role: 'hideOthers',
			},
			{
				label: 'Show All',
				role: 'unhide',
			},
			{
				type: 'separator',
			},
			{
				label: 'Quit',
				accelerator: 'Cmd+Q',
				click: () => {
					app.quit();
				},
			},
		];
	}

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);

	// Update menu state after creation
	setTimeout(() => {
		updateMenuBarState();
	}, 2000); // Wait for NotchDrop service to initialize
}

// Set up listeners for NotchDrop status changes to update menu
function setupNotchDropMenuUpdates() {
	if (!notchDropService) return;

	// Listen for status changes from NotchDrop service
	// Since the service emits events to the renderer, we'll listen for IPC messages
	// that indicate status changes and update the menu accordingly

	// Set up a periodic check to update menu state (as a fallback)
	setInterval(() => {
		updateMenuBarState();
	}, 5000); // Update every 5 seconds

	log.info('✅ NotchDrop menu update listeners set up');
}

// Update menu bar to reflect current NotchDrop state
function updateMenuBarState() {
	try {
		const menu = Menu.getApplicationMenu();
		if (!menu) return;

		const notchDropMenu = menu.getMenuItemById('notchdrop-status');
		if (notchDropMenu && notchDropService) {
			const isVisible = notchDropService.isVisible();
			const status = notchDropService.getStatus();
			const autoOpen = notchDropService.getAutoOpenOnStartup();

			// Update status label
			notchDropMenu.label = `Status: ${status} (${isVisible ? 'Visible' : 'Hidden'})`;

			// Update auto-open checkbox
			const autoOpenMenu = menu.items
				.find((item) => item.label === 'NotchDrop')
				?.submenu?.items.find((item) => item.label === 'Auto-open on Startup');
			if (autoOpenMenu) {
				autoOpenMenu.checked = autoOpen;
			}

			log.info(
				`📊 Menu updated - Status: ${status}, Visible: ${isVisible}, Auto-open: ${autoOpen}`,
			);
		}
	} catch (error) {
		log.error('❌ Failed to update menu bar state:', error);
	}
}

// Window creation
function createWindow(restoreState = false) {
	// Determine the appropriate icon based on platform
	let iconPath;
	if (process.platform === 'win32') {
		// Try multiple possible paths for development and production
		const possiblePaths = [
			path.join(__dirname, 'assets', 'app-logo.ico'),
			path.join(__dirname, '..', 'electron', 'assets', 'app-logo.ico'),
			path.join(process.cwd(), 'electron', 'assets', 'app-logo.ico'),
		];

		// Find the first path that exists
		for (const testPath of possiblePaths) {
			if (require('fs').existsSync(testPath)) {
				iconPath = testPath;
				break;
			}
		}

		// Fallback to the first path if none exist
		if (!iconPath) {
			iconPath = possiblePaths[0];
		}
	} else if (process.platform === 'darwin') {
		iconPath = path.join(__dirname, 'assets', 'app-logo.icns');
	} else {
		iconPath = path.join(__dirname, 'assets', 've-black-circle-logo.png');
	}

	// Log the icon path being used
	log.info('🎨 Using icon:', iconPath);

	// Use saved window bounds if available, otherwise use defaults
	const defaultBounds = { width: 1366, height: 768, x: undefined, y: undefined };
	const windowBounds =
		restoreState && lastWindowState.windowBounds
			? { ...defaultBounds, ...lastWindowState.windowBounds }
			: defaultBounds;

	mainWindow = new BrowserWindow({
		title: 'Ve AI - Priority',
		width: windowBounds.width,
		height: windowBounds.height,
		x: windowBounds.x,
		y: windowBounds.y,
		show: false,
		icon: iconPath,
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

		// If restoring state, navigate to the last known route
		if (restoreState && lastWindowState.route) {
			setTimeout(() => {
				mainWindow.webContents.send('restore-window-state', lastWindowState);
				log.info('Window state restoration message sent:', lastWindowState);
			}, 1000); // Wait a bit for the app to fully load
		}
	});

	// Save window state before closing (cross-platform)
	mainWindow.on('close', (event) => {
		// Save the current window state
		saveWindowState();

		// Cross-platform close behavior - keep app running in background
		if (!isQuitting) {
			event.preventDefault();
			mainWindow.hide();
			log.info('Main window hidden - app continues running in background');
		}
	});

	// Check for updates in both dev and production
	log.info('Starting automatic update check...');
	// Delay update check to ensure app is fully loaded
	setTimeout(() => {
		autoUpdater.checkForUpdatesAndNotify();
	}, 5000); // Wait 5 seconds after app loads
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
					log.info('🖥️ Show App clicked from tray menu');
					if (mainWindow && !mainWindow.isDestroyed()) {
						mainWindow.show();
						mainWindow.focus();
						log.info('Main window shown and focused from tray menu');
					} else {
						// Window doesn't exist, recreate it
						log.info('Main window not available, recreating from tray menu');
						createWindow(true); // Pass true to restore state
					}
				},
			},
			{
				label: 'Quit',
				click: () => {
					isQuitting = true;
					app.quit();
				},
			},
		]);

		tray.setContextMenu(contextMenu);

		// Double-click tray icon to show app
		tray.on('double-click', () => {
			log.info('🖥️ Tray icon double-clicked - reopening main window');
			if (mainWindow && !mainWindow.isDestroyed()) {
				mainWindow.show();
				mainWindow.focus();
				log.info('Main window shown and focused from tray double-click');
			} else {
				// Window doesn't exist, recreate it
				log.info('Main window not available, recreating from tray double-click');
				createWindow(true); // Pass true to restore state
			}
		});

		log.info('System tray created for Windows');
	} catch (error) {
		log.error('Error creating system tray:', error);
	}
}

// App lifecycle
app.whenReady().then(async () => {
	// Set application branding for Windows
	if (process.platform === 'win32') {
		app.setAppUserModelId('com.veai.dashboard');
	}

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
			return true;
		}
		return false;
	});

	// Check macOS microphone permission status (macOS only)
	if (process.platform === 'darwin') {
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
			console.log('📹 Requesting camera permission...');
			const cameraGranted = await systemPreferences.askForMediaAccess('camera');
			console.log('📹 Camera permission granted:', cameraGranted);
		}, 3000);

		// Log initial camera permission status
		setTimeout(async () => {
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

	meetingMonitor.setNotificationHandler(showNotification);
	meetingMonitor.startMeetingMonitor();

	// 🎤 IPC: Start Mic Monitoring

	// IMMEDIATE: Create Dynamic Island FIRST for instant display
	log.info('🚀 Creating Dynamic Island FIRST for instant display...');
	dynamicIslandHelper = new DynamicIslandHelper();
	dynamicIslandHelper.createDynamicIslandWindow();

	// THEN: Create main window after dynamic island
	createWindow();

	ipcMain.handle('process-image-with-sharp', processImageWithSharp);
	ipcMain.handle('extract-image-metadata', extractImageMetadata);
	ipcMain.handle('download-album-zip', downloadAlbumZip);
	ipcMain.handle('create-zip-from-urls', createZipFromUrls);
	createTray(); // Create system tray for Windows
	createMenuBar();

	// CRITICAL FIX: Enhanced initialization sequence to prevent race conditions
	log.info('🚀 Starting enhanced service initialization sequence...');

	// Phase 1: Initialize WindowHelper first (required for overlay operations)
	log.info('📋 Phase 1: Initializing WindowHelper...');
	windowHelper = new WindowHelper();
	windowHelper.registerGlobalShortcuts(mainWindow);

	// Phase 1.2: CRITICAL FIX: Register all IPC handlers before window creation
	log.info('📋 Phase 1.2: Registering IPC handlers before window creation...');

	// Register Ask AI window IPC handlers
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

	// Handler to track ask AI input focus state
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
			const focusState = global.askAIInputFocused || false;
			log.info(`🔍 Getting ask AI input focus state: ${focusState}`);
			return { success: true, isFocused: focusState };
		} catch (error) {
			log.error('Error getting ask AI input focus state:', error);
			return { success: false, error: error.message };
		}
	});
	log.info('✅ Registered get-askAI-input-focus IPC handler');

	// Handler to hide all windows (overlay and ask AI)
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

	log.info('✅ Ask AI IPC handlers registered before window creation');

	// Phase 1.5: CRITICAL FIX: Pre-create overlay window for immediate response
	log.info('📋 Phase 1.5: Pre-creating overlay window for instant Swift UI response...');
	try {
		if (windowHelper && typeof windowHelper.preCreateOverlayWindow === 'function') {
			await windowHelper.preCreateOverlayWindow();
			log.info('✅ Overlay window pre-created successfully for immediate response');
		} else {
			log.warn('⚠️ WindowHelper pre-creation method not available, will create on-demand');
		}
	} catch (error) {
		log.error('❌ Error pre-creating overlay window:', error);
	}

	// Phase 3: Initialize NotchDrop service with proper readiness waiting (macOS only)
	if (isMacRuntime) {
		log.info('📋 Phase 3: Initializing NotchDrop service with bridge readiness...');
		notchDropService = new NotchDropService();
		notchDropService.setMainWindow(mainWindow);

		// CRITICAL: Ensure NotchDrop service fully initializes before proceeding
		let notchDropInitialized = false;
		let initRetries = 0;
		const maxInitRetries = 5;

		while (!notchDropInitialized && initRetries < maxInitRetries) {
			try {
				await notchDropService.initialize();

				// Verify service is truly ready
				if (notchDropService && notchDropService.isInitialized) {
					notchDropInitialized = true;
					log.info('✅ NotchDrop service initialization verified');
				} else {
					throw new Error('NotchDrop service initialization incomplete');
				}
			} catch (error) {
				initRetries++;
				log.warn(
					`⚠️ NotchDrop init attempt ${initRetries}/${maxInitRetries} failed:`,
					error.message,
				);

				if (initRetries < maxInitRetries) {
					await new Promise((resolve) => setTimeout(resolve, 1000 * initRetries)); // Exponential backoff
				} else {
					log.error('❌ NotchDrop service failed to initialize after maximum retries');
					// Continue anyway but log the issue
					notchDropInitialized = true; // Allow app to continue
				}
			}
		}
	} else {
		log.info('🖥️ Not macOS — skipping NotchDrop service initialization');
	}

	// Phase 4: Wait for bridge components to be ready
	log.info('📋 Phase 4: Waiting for bridge components to be ready...');
	await new Promise((resolve) => setTimeout(resolve, 1500)); // Give bridge time to initialize

	// Phase 5: Validate system readiness
	setTimeout(() => {
		log.info('📋 Phase 5: Testing system readiness...');

		// Test NotchDrop service readiness
		if (notchDropService && notchDropService.isInitialized) {
			try {
				const status = notchDropService.getStatus();
				log.info('✅ NotchDrop service status check:', status);
			} catch (error) {
				log.warn('⚠️ NotchDrop service status check failed:', error.message);
			}
		}

		// Signal that all services are ready
		log.info(
			'🎉 All services initialization completed - system ready for Swift UI interactions',
		);

		// Emit readiness signal for any listening components
		if (mainWindow && !mainWindow.isDestroyed()) {
			mainWindow.webContents.send('system-ready', {
				timestamp: Date.now(),
				services: {
					windowHelper: !!windowHelper,
					dynamicIslandHelper: !!dynamicIslandHelper,
					notchDropService: !!notchDropService,
				},
			});
		}
	}, 3000); // Extended wait time for complete initialization

	// CRITICAL FIX: Enhanced Swift UI overlay recording requests with immediate response
	process.on('swift-ui-trigger-overlay-recording', async () => {
		try {
			log.info('🎤 Received Swift UI overlay recording request');
			await handleSwiftOverlayRequest('startRecording');
		} catch (error) {
			log.error('❌ Error handling Swift UI overlay recording request:', error);
		}
	});

	// CRITICAL FIX: Immediate overlay recording request handler
	process.on('swift-ui-trigger-overlay-recording-immediate', async () => {
		try {
			log.info('⚡ IMMEDIATE: Received Swift UI overlay recording request');
			await handleSwiftOverlayRequestImmediate('startRecording');
		} catch (error) {
			log.error('❌ Error handling immediate Swift UI overlay recording request:', error);
		}
	});

	// CRITICAL FIX: Immediate live intelligence request handler
	process.on('swift-ui-trigger-overlay-live-intelligence-immediate', async () => {
		try {
			log.info('⚡ IMMEDIATE: Received Swift UI live intelligence request');
			await handleSwiftOverlayRequestImmediate('toggleLiveIntelligence');
		} catch (error) {
			log.error('❌ Error handling immediate Swift UI live intelligence request:', error);
		}
	});

	// CRITICAL FIX: Pre-create overlay window signal handler
	process.on('pre-create-overlay-window', async () => {
		try {
			log.info('🔧 Received pre-create overlay window signal');
			if (windowHelper && typeof windowHelper.preCreateOverlayWindow === 'function') {
				await windowHelper.preCreateOverlayWindow();
				log.info('✅ Overlay window pre-created via process signal');
			} else {
				log.warn('⚠️ WindowHelper not available for overlay pre-creation');
			}
		} catch (error) {
			log.error('❌ Error pre-creating overlay window via signal:', error);
		}
	});

	// Swift UI -> AskAI chat submission (bypass IPC, reuse windowHelper directly)
	async function waitForAskAIReady(win) {
		try {
			if (!win || win.isDestroyed()) return false;
			const wc = win.webContents;
			if (!wc || wc.isDestroyed()) return false;
			if (wc.isLoading && wc.isLoading()) {
				await new Promise((resolve) => wc.once('did-finish-load', resolve));
			}
			// tiny buffer to allow React to mount listeners
			await new Promise((r) => setTimeout(r, 200));
			return true;
		} catch (e) {
			log.warn('⚠️ waitForAskAIReady error:', e);
			return false;
		}
	}

	process.on('swift-ui-submit-chat', async (chatMessage) => {
		try {
			log.info('💬 Received Swift UI chat for AskAI:', chatMessage);
			if (!windowHelper) {
				log.error('windowHelper not available for AskAI forwarding');
				return;
			}

			let askAIWindow = windowHelper.getAskAIWindow();
			if (!askAIWindow || askAIWindow.isDestroyed()) {
				windowHelper.createAskAIWindow();
				// Wait for the window to load fully
				await new Promise((r) => setTimeout(r, 100));
				askAIWindow = windowHelper.getAskAIWindow();
				if (askAIWindow) {
					await waitForAskAIReady(askAIWindow);
				}
			}

			if (askAIWindow && !askAIWindow.isDestroyed()) {
				// Ensure visible and focused
				if (!askAIWindow.isVisible()) {
					windowHelper.showAskAIWindow();
					await new Promise((r) => setTimeout(r, 200));
				}
				// Ensure listeners are mounted
				await waitForAskAIReady(askAIWindow);
				askAIWindow.webContents.send('receive-chat-message', chatMessage);
				// Resend once shortly after as a safety net in case listener attached late
				setTimeout(() => {
					try {
						if (askAIWindow && !askAIWindow.isDestroyed()) {
							askAIWindow.webContents.send('receive-chat-message', chatMessage);
							log.info('🔁 Re-forwarded Swift UI chat to AskAI (safety resend)');
						}
					} catch (e) {
						log.warn('⚠️ Safety resend failed:', e);
					}
				}, 400);
				log.info('✅ Forwarded Swift UI chat to AskAI');
			} else {
				log.error('❌ AskAI window unavailable after creation');
			}
		} catch (error) {
			log.error('❌ Error forwarding Swift UI chat to AskAI:', error);
		}
	});

	// CRITICAL FIX: Common handler for Swift overlay requests
	async function handleSwiftOverlayRequest(action) {
		let overlayWindow = windowHelper?.getOverlayWindow();
		if (!overlayWindow) {
			// Create overlay window if it doesn't exist
			windowHelper?.createOverlayWindow();
			await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
			overlayWindow = windowHelper?.getOverlayWindow();
		}

		if (overlayWindow) {
			// Show overlay window if not visible
			if (!overlayWindow.isVisible()) {
				windowHelper?.showOverlayWindow();
			}

			// Send command to overlay window
			overlayWindow.webContents.send('overlay-command', {
				action: action,
			});
			log.info(`✅ Sent ${action} command to overlay window from Swift UI`);
		} else {
			log.error(`❌ Overlay window not available after creating for ${action}`);
		}
	}

	// CRITICAL FIX: Immediate handler for Swift overlay requests (no waiting)
	async function handleSwiftOverlayRequestImmediate(action) {
		log.info(`⚡ IMMEDIATE: Handling Swift ${action} request with zero delay`);

		// Try to use pre-created overlay first
		let overlayWindow = windowHelper?.getOverlayWindow();

		if (
			!overlayWindow &&
			windowHelper &&
			typeof windowHelper.showOverlayImmediate === 'function'
		) {
			// Use immediate show method
			const success = windowHelper.showOverlayImmediate();
			if (success) {
				overlayWindow = windowHelper.getOverlayWindow();
			}
		}

		if (!overlayWindow) {
			// Fallback to normal creation but don't wait
			windowHelper?.createOverlayWindow();
			overlayWindow = windowHelper?.getOverlayWindow();
		}

		if (overlayWindow) {
			// Show immediately without delay
			if (!overlayWindow.isVisible()) {
				overlayWindow.show();
				overlayWindow.focus();
				overlayWindow.moveTop();
			}

			// Send command immediately
			overlayWindow.webContents.send('overlay-command', {
				action: action,
				immediate: true,
			});

			log.info(`⚡ IMMEDIATE: Sent ${action} command to overlay window - NO DELAY`);
			return { success: true };
		} else {
			log.error(`❌ IMMEDIATE: Failed to get overlay window for Swift ${action} request`);
			return { success: false, error: 'Overlay window not available' };
		}
	}

	// Set up NotchDrop status change listener to update menu
	setupNotchDropMenuUpdates();

	// macOS dock icon click handler to reopen main window
	if (process.platform === 'darwin') {
		app.on('activate', () => {
			log.info('🍎 Dock icon clicked - reopening main window');
			if (mainWindow && !mainWindow.isDestroyed()) {
				// Window exists, just show and focus it
				mainWindow.show();
				mainWindow.focus();
				log.info('Main window shown and focused from dock click');
			} else {
				// Window doesn't exist, recreate it
				log.info('Main window not available, recreating from dock click');
				createWindow(true); // Pass true to restore state
			}
		});
	}

	// Register global shortcut for dynamic island (Cmd+I)
	globalShortcut.register('CommandOrControl+I', () => {
		log.info('Cmd+I pressed - toggling dynamic island');
		if (dynamicIslandHelper) {
			dynamicIslandHelper.toggleVisibility();
		}
	});

	// Check if global shortcuts are working (especially important on macOS)
	if (process.platform === 'darwin') {
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

	// Home icon click handler - restore or recreate main window (cross-platform)
	ipcMain.handle('restore-main-window', async () => {
		try {
			// Check if main window exists and is not destroyed
			if (mainWindow && !mainWindow.isDestroyed()) {
				mainWindow.show();
				mainWindow.focus();
				log.info('Main window restored from home icon click');
				return { success: true };
			} else {
				// Main window doesn't exist or is destroyed, recreate it
				log.info('Main window not available, recreating it...');

				// Recreate the main window with state restoration
				createWindow(true);

				// Wait for the window to be ready
				await new Promise((resolve) => {
					if (mainWindow && !mainWindow.isDestroyed()) {
						mainWindow.once('ready-to-show', () => {
							mainWindow.show();
							mainWindow.focus();
							log.info(
								'Main window recreated and shown successfully with state restoration',
							);
							resolve();
						});
					} else {
						log.error('Failed to recreate main window');
						resolve();
					}
				});

				return { success: true, message: 'Main window recreated with state restoration' };
			}
		} catch (error) {
			log.error('Error restoring/recreating main window:', error);
			return { success: false, error: error.message };
		}
	});

	// This will handle main window navigation
	ipcMain.handle('navigate-main-window', async (event, data) => {
		try {
			// Check if main window exists and is not destroyed
			if (mainWindow && !mainWindow.isDestroyed()) {
				mainWindow.show();
				mainWindow.focus();
				mainWindow.webContents.send('navigate-to', data?.path);
				log.info('Main window navigated to:', data?.path);
				return { success: true };
			} else {
				// Main window doesn't exist or is destroyed, recreate it
				log.info('Main window not available, recreating it...');

				// Recreate the main window with state restoration
				createWindow(true);

				// Wait for the window to be ready
				await new Promise((resolve) => {
					if (mainWindow && !mainWindow.isDestroyed()) {
						mainWindow.once('ready-to-show', () => {
							mainWindow.show();
							mainWindow.focus();
							mainWindow.webContents.send('navigate-to', data?.path);
							log.info(
								'Main window recreated and shown successfully with state restoration and navigated to:',
								data?.path,
							);
							resolve();
						});
					} else {
						log.error('Failed to recreate main window and navigated to:', data?.path);
						resolve();
					}
				});

				return { success: true, message: 'Main window recreated with state restoration' };
			}
		} catch (error) {
			log.error('Error navigating main window to:', data?.path, error);
			return { success: false, error: error.message };
		}
	});

	// Check camera permission status handler
	ipcMain.handle('check-camera-permission', async () => {
		try {
			if (process.platform === 'darwin') {
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

	// Register NotchDrop IPC handlers
	ipcMain.handle('notchdrop-enable', async () => {
		try {
			if (!notchDropService) {
				return { success: false, error: 'NotchDrop service not initialized' };
			}
			const result = notchDropService.enable();
			return { success: result };
		} catch (error) {
			log.error('Error enabling NotchDrop:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('notchdrop-disable', async () => {
		try {
			if (!notchDropService) {
				return { success: false, error: 'NotchDrop service not initialized' };
			}
			const result = notchDropService.disable();
			return { success: result };
		} catch (error) {
			log.error('Error disabling NotchDrop:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('notchdrop-toggle', async () => {
		try {
			if (!notchDropService) {
				return { success: false, error: 'NotchDrop service not initialized' };
			}
			const result = notchDropService.toggle();
			return { success: result };
		} catch (error) {
			log.error('Error toggling NotchDrop:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('notchdrop-is-visible', async () => {
		try {
			if (!notchDropService) {
				return {
					success: false,
					visible: false,
					error: 'NotchDrop service not initialized',
				};
			}
			const visible = notchDropService.isVisible();
			return { success: true, visible };
		} catch (error) {
			log.error('Error checking NotchDrop visibility:', error);
			return { success: false, visible: false, error: error.message };
		}
	});

	ipcMain.handle('notchdrop-set-status', async (event, status) => {
		try {
			if (!notchDropService) {
				return { success: false, error: 'NotchDrop service not initialized' };
			}
			const result = notchDropService.setStatus(status);
			return { success: result };
		} catch (error) {
			log.error('Error setting NotchDrop status:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('notchdrop-get-status', async () => {
		try {
			if (!notchDropService) {
				return {
					success: false,
					status: 'closed',
					error: 'NotchDrop service not initialized',
				};
			}
			const status = notchDropService.getStatus();
			return { success: true, status };
		} catch (error) {
			log.error('Error getting NotchDrop status:', error);
			return { success: false, status: 'closed', error: error.message };
		}
	});

	ipcMain.handle('notchdrop-handle-files', async (event, filePaths) => {
		try {
			if (!notchDropService) {
				return { success: false, error: 'NotchDrop service not initialized' };
			}
			const result = notchDropService.handleDroppedFiles(filePaths);
			return { success: result };
		} catch (error) {
			log.error('Error handling dropped files:', error);
			return { success: false, error: error.message };
		}
	});

	// Auto-open settings
	ipcMain.handle('notchdrop-set-auto-open', async (event, enabled) => {
		try {
			if (!notchDropService) {
				return { success: false, error: 'NotchDrop service not initialized' };
			}
			const result = notchDropService.setAutoOpenOnStartup(enabled);
			return { success: result };
		} catch (error) {
			log.error('Error setting auto-open setting:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('notchdrop-get-auto-open', async () => {
		try {
			if (!notchDropService) {
				return {
					success: false,
					enabled: true,
					error: 'NotchDrop service not initialized',
				};
			}
			const enabled = notchDropService.getAutoOpenOnStartup();
			return { success: true, enabled };
		} catch (error) {
			log.error('Error getting auto-open setting:', error);
			return { success: false, enabled: true, error: error.message };
		}
	});

	// Swift action handlers for overlay integration
	// Use try-catch to handle potential duplicate handler registration
	try {
		ipcMain.handle('swift:action', async (event, action, data) => {
			try {
				if (!notchDropService) {
					return { success: false, error: 'NotchDrop service not initialized' };
				}
				log.info('🎯 Swift action received in main.js:', action, data);
				const result = await notchDropService.handleSwiftAction(action, data);
				return result;
			} catch (error) {
				log.error('Error handling Swift action:', error);
				return { success: false, error: error.message };
			}
		});
		log.info('✅ Registered swift:action IPC handler in main.js');
	} catch (error) {
		if (error.message.includes('second handler')) {
			log.warn('⚠️ swift:action handler already registered, skipping...');
		} else {
			log.error('Error registering swift:action handler:', error);
			throw error;
		}
	}

	// Enhanced overlay integration handlers for Swift UI
	// Helper function to safely register Swift IPC handlers
	const safeRegisterSwiftHandler = (channel, handler) => {
		try {
			ipcMain.handle(channel, handler);
			log.info(`✅ Registered ${channel} IPC handler`);
		} catch (error) {
			if (error.message.includes('second handler')) {
				log.warn(`⚠️ ${channel} handler already registered, skipping...`);
			} else {
				log.error(`Error registering ${channel} handler:`, error);
				throw error;
			}
		}
	};

	safeRegisterSwiftHandler('swift:triggerOverlayRecording', async (event, data) => {
		try {
			if (!notchDropService) {
				return { success: false, error: 'NotchDrop service not initialized' };
			}
			const result = await notchDropService.handleSwiftAction(
				'triggerOverlayRecording',
				data,
			);
			return result;
		} catch (error) {
			log.error('Error triggering overlay recording from Swift:', error);
			return { success: false, error: error.message };
		}
	});

	safeRegisterSwiftHandler('swift:triggerOverlayToggleLiveIntelligence', async (event, data) => {
		try {
			if (!notchDropService) {
				return { success: false, error: 'NotchDrop service not initialized' };
			}
			const result = await notchDropService.handleSwiftAction(
				'triggerOverlayToggleLiveIntelligence',
				data,
			);
			return result;
		} catch (error) {
			log.error('Error triggering overlay toggle live intelligence from Swift:', error);
			return { success: false, error: error.message };
		}
	});

	// Menu update handler
	ipcMain.handle('update-notchdrop-menu', async () => {
		try {
			updateMenuBarState();
			return { success: true };
		} catch (error) {
			log.error('Error updating NotchDrop menu:', error);
			return { success: false, error: error.message };
		}
	});

	// Additional NotchDrop IPC handlers for UI integration
	ipcMain.handle('notchdrop-set-haptic-feedback', async (event, enabled) => {
		try {
			if (!notchDropService) {
				return { success: false, error: 'NotchDrop service not initialized' };
			}
			const result = notchDropService.setHapticFeedback(enabled);
			return { success: result };
		} catch (error) {
			log.error('Error setting haptic feedback:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('notchdrop-get-haptic-feedback', async () => {
		try {
			if (!notchDropService) {
				return {
					success: false,
					enabled: true,
					error: 'NotchDrop service not initialized',
				};
			}
			const enabled = notchDropService.getHapticFeedback();
			return { success: true, enabled };
		} catch (error) {
			log.error('Error getting haptic feedback:', error);
			return { success: false, enabled: true, error: error.message };
		}
	});

	// New NotchDropLatest IPC handlers
	ipcMain.handle('notchdrop-open-airdrop', async () => {
		try {
			log.info('Opening AirDrop from NotchDropLatest');
			// Open AirDrop sharing dialog
			const { exec } = require('child_process');
			exec('open -a AirDrop', (error) => {
				if (error) {
					log.error('Error opening AirDrop:', error);
				}
			});
			return { success: true };
		} catch (error) {
			log.error('Error opening AirDrop:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('notchdrop-open-share', async () => {
		try {
			log.info('Opening share dialog from NotchDropLatest');
			// Open file picker for sharing
			const { dialog } = require('electron');
			const result = await dialog.showOpenDialog(mainWindow, {
				properties: ['openFile', 'multiSelections'],
				title: 'Select files to share',
			});
			return { success: true, files: result.filePaths };
		} catch (error) {
			log.error('Error opening share dialog:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('notchdrop-open-file', async (event, filePath) => {
		try {
			log.info('Opening file from NotchDropLatest:', filePath);
			const { shell } = require('electron');
			await shell.openPath(filePath);
			return { success: true };
		} catch (error) {
			log.error('Error opening file:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('notchdrop-delete-file', async (event, fileId) => {
		try {
			log.info('Deleting file from NotchDropLatest:', fileId);
			// This would integrate with the file storage system
			// For now, just return success
			return { success: true };
		} catch (error) {
			log.error('Error deleting file:', error);
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

	// Voice integration handlers for Dynamic Island
	ipcMain.handle('dynamic-island-voice-connect', async () => {
		try {
			log.info('Dynamic Island voice connect requested');
			// In the future, this could trigger specific voice setup for Dynamic Island
			return { success: true, message: 'Voice connection initiated from Dynamic Island' };
		} catch (error) {
			log.error('Error connecting voice from Dynamic Island:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('dynamic-island-voice-disconnect', async () => {
		try {
			log.info('Dynamic Island voice disconnect requested');
			// In the future, this could trigger specific voice cleanup for Dynamic Island
			return { success: true, message: 'Voice disconnection initiated from Dynamic Island' };
		} catch (error) {
			log.error('Error disconnecting voice from Dynamic Island:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('dynamic-island-voice-status', async () => {
		// Return voice status for Dynamic Island
		return {
			success: true,
			status: 'ready',
			message: 'Voice integration ready for Dynamic Island',
		};
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

	// CRITICAL FIX: Enhanced NotchDrop overlay integration handlers with immediate response
	ipcMain.handle('notchdrop:triggerOverlayRecording', async () => {
		try {
			log.info('⚡ SWIFT UI START BUTTON: Immediate overlay recording - ZERO DELAY MODE');

			// CRITICAL FIX: Try immediate response method first
			const immediateResult = await handleSwiftOverlayRequestImmediate('startRecording');
			if (immediateResult.success) {
				log.info('🚀 SUCCESS: Immediate overlay recording triggered instantly!');
				return immediateResult;
			}

			log.info('🔄 Immediate failed, using fallback method...');

			// CRITICAL FIX: Verify windowHelper is available
			if (!windowHelper) {
				log.error('❌ WindowHelper not initialized - critical error');
				return { success: false, error: 'WindowHelper not available' };
			}

			// CRITICAL FIX: Get or create overlay window with retry logic
			let overlayWindow = windowHelper.getOverlayWindow();
			let retryCount = 0;
			const maxRetries = 3;

			while (!overlayWindow && retryCount < maxRetries) {
				log.info(`🔧 Attempt ${retryCount + 1}: Creating overlay window...`);
				windowHelper.createOverlayWindow();

				// Progressive wait times: 100ms, 200ms, 300ms
				const waitTime = 100 + retryCount * 100;
				await new Promise((resolve) => setTimeout(resolve, waitTime));

				overlayWindow = windowHelper.getOverlayWindow();
				retryCount++;
			}

			if (overlayWindow) {
				// CRITICAL FIX: Verify window is not destroyed
				if (overlayWindow.isDestroyed()) {
					log.error('❌ Overlay window was destroyed, recreating...');
					windowHelper.createOverlayWindow();
					await new Promise((resolve) => setTimeout(resolve, 200));
					overlayWindow = windowHelper.getOverlayWindow();
				}

				// CRITICAL FIX: Enhanced window visibility handling
				if (!overlayWindow.isVisible()) {
					log.info('👁️ Showing overlay window...');
					windowHelper.showOverlayWindow();

					// Wait for window to be properly visible
					let visibilityRetries = 0;
					while (!overlayWindow.isVisible() && visibilityRetries < 5) {
						await new Promise((resolve) => setTimeout(resolve, 50));
						visibilityRetries++;
					}

					if (!overlayWindow.isVisible()) {
						log.warn('⚠️ Window may not be fully visible, proceeding anyway');
					}
				}

				// CRITICAL FIX: Enhanced command sending with fallback
				let commandSent = false;

				// Try using the queuing system first
				if (windowHelper.sendOverlayCommand) {
					commandSent = windowHelper.sendOverlayCommand({
						action: 'startRecording',
					});
					log.info(
						`✅ SMART QUEUE: StartRecording command ${
							commandSent ? 'sent immediately' : 'queued'
						} from Swift UI`,
					);
				}

				// Fallback: Direct webContents send if queuing failed
				if (
					!commandSent &&
					overlayWindow.webContents &&
					!overlayWindow.webContents.isDestroyed()
				) {
					try {
						overlayWindow.webContents.send('overlay-command', {
							action: 'startRecording',
						});
						log.info(
							'✅ FALLBACK: StartRecording command sent directly to webContents',
						);
						commandSent = true;
					} catch (fallbackError) {
						log.error('❌ Fallback command sending failed:', fallbackError);
					}
				}

				// CRITICAL FIX: Ensure window is properly focused and visible
				try {
					overlayWindow.focus();
					overlayWindow.moveTop();
					overlayWindow.show(); // Extra show() call for reliability

					// Force window to be interactive
					overlayWindow.setIgnoreMouseEvents(false);

					log.info('✅ Overlay window focused and brought to front');
				} catch (focusError) {
					log.warn('⚠️ Could not focus overlay window:', focusError);
				}

				return {
					success: true,
					commandSent,
					windowVisible: overlayWindow.isVisible(),
					windowDestroyed: overlayWindow.isDestroyed(),
				};
			} else {
				log.error('❌ CRITICAL: Overlay window not available after all retry attempts');
				return { success: false, error: 'Overlay window creation failed after retries' };
			}
		} catch (error) {
			log.error('❌ CRITICAL ERROR handling Swift UI overlay recording request:', error);
			return { success: false, error: error.message, stack: error.stack };
		}
	});

	ipcMain.handle('notchdrop:triggerOverlayStopRecording', async () => {
		try {
			log.info('⏹️ NotchDrop requested overlay stop recording');
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow) {
				overlayWindow.webContents.send('overlay-command', {
					action: 'stopRecording',
				});
				log.info('Sent stopRecording command to overlay window from NotchDrop');
			} else {
				log.warn('Overlay window not available for stopRecording');
			}
			return { success: true };
		} catch (error) {
			log.error('Error handling NotchDrop overlay stop recording:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('notchdrop:triggerOverlayPauseRecording', async () => {
		try {
			log.info('⏸️ NotchDrop requested overlay pause recording');
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow) {
				overlayWindow.webContents.send('overlay-command', {
					action: 'pauseRecording',
				});
				log.info('Sent pauseRecording command to overlay window from NotchDrop');
			} else {
				log.warn('Overlay window not available for pauseRecording');
			}
			return { success: true };
		} catch (error) {
			log.error('Error handling NotchDrop overlay pause recording:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('notchdrop:triggerOverlayResumeRecording', async () => {
		try {
			log.info('▶️ NotchDrop requested overlay resume recording');
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow) {
				overlayWindow.webContents.send('overlay-command', {
					action: 'resumeRecording',
				});
				log.info('Sent resumeRecording command to overlay window from NotchDrop');
			} else {
				log.warn('Overlay window not available for resumeRecording');
			}
			return { success: true };
		} catch (error) {
			log.error('Error handling NotchDrop overlay resume recording:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('notchdrop:triggerOverlayToggleLiveIntelligence', async () => {
		try {
			log.info('🧠 NotchDrop requested overlay toggle live intelligence');
			let overlayWindow = windowHelper?.getOverlayWindow();
			if (!overlayWindow) {
				// Create overlay window if it doesn't exist
				windowHelper?.createOverlayWindow();
				await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
				overlayWindow = windowHelper?.getOverlayWindow();
			}

			if (overlayWindow) {
				// Show overlay window if not visible
				if (!overlayWindow.isVisible()) {
					windowHelper?.showOverlayWindow();
				}

				// Send command to overlay window to toggle live intelligence
				overlayWindow.webContents.send('overlay-command', {
					action: 'toggleLiveIntelligence',
				});
				log.info('Sent toggleLiveIntelligence command to overlay window from NotchDrop');
			} else {
				log.error('Overlay window not available after creating');
				return { success: false, error: 'Overlay window not available' };
			}

			return { success: true };
		} catch (error) {
			log.error('Error handling NotchDrop overlay toggle live intelligence:', error);
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
				// REDUCED DELAY: Wait only 200ms for window creation
				await new Promise((resolve) => setTimeout(resolve, 200));
				// Get the window reference again after creating it
				overlayWindow = windowHelper?.getOverlayWindow();
			}

			if (overlayWindow) {
				// Show the window if it's not visible
				if (!overlayWindow.isVisible()) {
					windowHelper?.showOverlayWindow();
					// REDUCED DELAY: Wait only 100ms for window display
					await new Promise((resolve) => setTimeout(resolve, 100));
				}

				// CRITICAL FIX: Use windowHelper's queuing system
				const commandSent = windowHelper?.sendOverlayCommand({
					action: 'startRecording',
				});
				log.info(
					`✅ SMART QUEUE: StartRecording command ${
						commandSent ? 'sent immediately' : 'queued'
					}`,
				);

				// Also trigger focus and bring to front
				overlayWindow.focus();
				overlayWindow.moveTop();

				// Start the Are You There timer for 30-minute intervals
				startAreYouThereTimer();
			} else {
				log.error('❌ Overlay window not available after creating');
				return { success: false, error: 'Overlay window not available' };
			}
			return { success: true };
		} catch (error) {
			log.error('❌ Error starting recording from dynamic island:', error);
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

			// Stop the Are You There timer when recording stops
			stopAreYouThereTimer();

			// Hide the Are You There window if it's visible
			if (windowHelper) {
				windowHelper.hideAreYouThereWindow();
				log.info('🏠 Hiding Are You There window - recording stopped from Dynamic Island');
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

			// Update recording state and manage Are You There timer
			if (state && typeof state.isRecording === 'boolean') {
				if (state.isRecording) {
					// Recording started - start the timer
					if (!isRecordingActive) {
						log.info('Recording started - starting Are You There timer');
						startAreYouThereTimer();
					}
				} else {
					// Recording stopped - stop the timer and hide window
					if (isRecordingActive) {
						log.info('Recording stopped - stopping Are You There timer');
						stopAreYouThereTimer();
						if (windowHelper) {
							windowHelper.hideAreYouThereWindow();
						}
					}
				}
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

	// Test handler for sending commands directly
	ipcMain.handle('test-overlay-command', async (event, command) => {
		try {
			log.info('🧪 Testing overlay command:', command);
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow && !overlayWindow.isDestroyed()) {
				overlayWindow.webContents.send('overlay-command', command);
				log.info('✅ Test command sent to overlay window');
				return { success: true, commandSent: true };
			} else {
				log.info('❌ Overlay window not available for test command');
				return {
					success: false,
					commandSent: false,
					error: 'Overlay window not available',
				};
			}
		} catch (error) {
			log.error('Error testing overlay command:', error);
			return { success: false, error: error.message };
		}
	});

	// Test handler for creating and showing overlay window
	ipcMain.handle('test-overlay-window', async () => {
		try {
			log.info('🧪 Testing overlay window creation...');

			if (!windowHelper) {
				return { success: false, error: 'Window helper not initialized' };
			}

			// Create overlay window
			windowHelper.createOverlayWindow();
			log.info('✅ Overlay window creation initiated');

			// Wait a moment for the window to be created
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Get the window reference
			const overlayWindow = windowHelper.getOverlayWindow();
			if (overlayWindow && !overlayWindow.isDestroyed()) {
				log.info('✅ Overlay window created successfully');
				log.info('Window visible:', overlayWindow.isVisible());
				log.info('Window destroyed:', overlayWindow.isDestroyed());

				// Show the window
				windowHelper.showOverlayWindow();
				overlayWindow.focus();

				return {
					success: true,
					exists: true,
					visible: overlayWindow.isVisible(),
					destroyed: overlayWindow.isDestroyed(),
				};
			} else {
				log.info('❌ Overlay window not available after creation');
				return { success: false, error: 'Overlay window not available after creation' };
			}
		} catch (error) {
			log.error('Error testing overlay window creation:', error);
			return { success: false, error: error.message };
		}
	});

	// Handler to hide overlay window only (without stopping recording)
	ipcMain.handle('hide-overlay-window', async () => {
		try {
			if (!windowHelper) {
				return { success: false, error: 'Window helper not initialized' };
			}
			windowHelper.hideOverlayWindow();
			return { success: true };
		} catch (error) {
			log.error('Error hiding overlay window:', error);
			return { success: false, error: error.message };
		}
	});

	// CRITICAL FIX: Add missing update-overlay-dimensions handler
	ipcMain.handle('update-overlay-dimensions', async (event, { width, height }) => {
		try {
			if (!windowHelper) {
				log.error('❌ WindowHelper not initialized for overlay dimensions update');
				return { success: false, error: 'Window helper not initialized' };
			}

			log.info(`🔧 Updating overlay dimensions to: ${width}x${height}`);
			windowHelper.updateWindowDimensions(width, height);

			return { success: true };
		} catch (error) {
			log.error('❌ Error updating overlay dimensions:', error);
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
			const focusState = global.askAIInputFocused || false;

			return { success: true, isFocused: focusState };
		} catch (error) {
			log.error('Error getting ask AI input focus state:', error);
			return { success: false, error: error.message };
		}
	});
	log.info('✅ Registered get-askAI-input-focus IPC handler');

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

	// Are You There window IPC handlers
	ipcMain.handle('are-you-there-continue-meeting', async () => {
		try {
			log.info("✅ User clicked I'm here - continuing meeting");

			// Reset the flag to allow next popup
			isAreYouThereWindowShown = false;

			// Close the Are You There window
			if (windowHelper) {
				windowHelper.hideAreYouThereWindow();
			}
			return { success: true };
		} catch (error) {
			log.error('Error continuing meeting:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('are-you-there-auto-continue-meeting', async () => {
		try {
			log.info('⏰ Auto-continuing meeting after timeout');
			// Close the Are You There window
			if (windowHelper) {
				windowHelper.hideAreYouThereWindow();
			}
			return { success: true };
		} catch (error) {
			log.error('Error auto-continuing meeting:', error);
			return { success: false, error: error.message };
		}
	});

	// Get current recording time for Are You There window
	ipcMain.handle('are-you-there-get-recording-time', async () => {
		try {
			if (recordingStartTime && isRecordingActive) {
				const currentRecordingTime = Math.floor((Date.now() - recordingStartTime) / 1000);
				return { success: true, recordingTime: currentRecordingTime };
			} else {
				return { success: false, error: 'No recording in progress' };
			}
		} catch (error) {
			log.error('Error getting recording time:', error);
			return { success: false, error: error.message };
		}
	});

	// Check if recording is active
	ipcMain.handle('are-you-there-check-recording-state', async () => {
		try {
			return {
				success: true,
				isRecordingActive: isRecordingActive,
				recordingStartTime: recordingStartTime,
				hasTimer: areYouThereTimer !== null,
			};
		} catch (error) {
			log.error('Error checking recording state:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('are-you-there-stop-meeting', async () => {
		try {
			log.info('🛑 Stopping meeting due to no user response');

			// Reset the flag
			isAreYouThereWindowShown = false;

			// Stop the Are You There timer
			stopAreYouThereTimer();

			// Stop the recording by sending stop command to overlay
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow) {
				overlayWindow.webContents.send('overlay-command', {
					action: 'stopRecording',
				});
				log.info('Sent stopRecording command to overlay window');
			}

			// Close the Are You There window
			if (windowHelper) {
				windowHelper.hideAreYouThereWindow();
			}

			return { success: true };
		} catch (error) {
			log.error('Error stopping meeting:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('are-you-there-pause-meeting-intelligence', async () => {
		try {
			log.info('⏸️ User clicked Pause Meeting Intelligence');

			// Pause the recording by sending pause command to overlay
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow) {
				overlayWindow.webContents.send('overlay-command', {
					action: 'pauseRecording',
				});
				log.info('Sent pauseRecording command to overlay window');
			}

			// Close the Are You There window
			if (windowHelper) {
				windowHelper.hideAreYouThereWindow();
			}

			return { success: true };
		} catch (error) {
			log.error('Error pausing meeting intelligence:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('are-you-there-end-session', async () => {
		try {
			log.info('🔚 User clicked End Session');

			// Reset the flag
			isAreYouThereWindowShown = false;

			// Stop the Are You There timer
			stopAreYouThereTimer();

			// Stop the recording by sending stop command to overlay
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow) {
				overlayWindow.webContents.send('overlay-command', {
					action: 'stopRecording',
				});
				log.info('Sent stopRecording command to overlay window');
			}

			// Close the Are You There window
			if (windowHelper) {
				windowHelper.hideAreYouThereWindow();
			}

			return { success: true };
		} catch (error) {
			log.error('Error ending session:', error);
			return { success: false, error: error.message };
		}
	});

	// New IPC handlers for transcription-based Are You There functionality
	ipcMain.handle('update-transcription-activity', async () => {
		try {
			updateTranscriptionActivity();
			return { success: true };
		} catch (error) {
			log.error('Error updating transcription activity:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('are-you-there-continue-transcription', async () => {
		try {
			log.info("✅ User clicked I'm here - restarting transcription monitoring");

			// Reset the flag to allow next popup
			isTranscriptionBasedAreYouThereShown = false;

			// Restart the transcription detection timer
			restartTranscriptionDetectionTimer();

			// Close the Are You There window
			if (windowHelper) {
				windowHelper.hideAreYouThereWindow();
			}
			return { success: true };
		} catch (error) {
			log.error('Error continuing transcription monitoring:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('are-you-there-stop-transcription-monitoring', async () => {
		try {
			log.info('🛑 Stopping transcription monitoring due to no user response');

			// Reset the flag
			isTranscriptionBasedAreYouThereShown = false;

			// Stop the transcription detection timer
			stopTranscriptionDetectionTimer();

			// Stop the recording by sending stop command to overlay
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow) {
				overlayWindow.webContents.send('overlay-command', {
					action: 'stopRecording',
				});
				log.info('Sent stopRecording command to overlay window');
			}

			// Close the Are You There window
			if (windowHelper) {
				windowHelper.hideAreYouThereWindow();
			}

			return { success: true };
		} catch (error) {
			log.error('Error stopping transcription monitoring:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('are-you-there-pause-transcription-monitoring', async () => {
		try {
			log.info('⏸️ User clicked Pause Transcription Monitoring');

			// Pause the recording by sending pause command to overlay
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow) {
				overlayWindow.webContents.send('overlay-command', {
					action: 'pauseRecording',
				});
				log.info('Sent pauseRecording command to overlay window');
			}

			// Close the Are You There window
			if (windowHelper) {
				windowHelper.hideAreYouThereWindow();
			}

			return { success: true };
		} catch (error) {
			log.error('Error pausing transcription monitoring:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('are-you-there-end-transcription-session', async () => {
		try {
			log.info('🔚 User clicked End Transcription Session');

			// Reset the flag
			isTranscriptionBasedAreYouThereShown = false;

			// Stop the transcription detection timer
			stopTranscriptionDetectionTimer();

			// Stop the recording by sending stop command to overlay
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow) {
				overlayWindow.webContents.send('overlay-command', {
					action: 'stopRecording',
				});
				log.info('Sent stopRecording command to overlay window');
			}

			// Close the Are You There window
			if (windowHelper) {
				windowHelper.hideAreYouThereWindow();
			}

			return { success: true };
		} catch (error) {
			log.error('Error ending transcription session:', error);
			return { success: false, error: error.message };
		}
	});

	// Get detailed transcription detection state
	ipcMain.handle('get-transcription-detection-state', async () => {
		try {
			const currentTime = Date.now();
			const timeSinceLastTranscription = lastTranscriptionTime
				? Math.floor((currentTime - lastTranscriptionTime) / 1000)
				: 0;

			return {
				success: true,
				isActive: isTranscriptionDetectionActive,
				isWindowShown: isTranscriptionBasedAreYouThereShown,
				timeSinceLastTranscription,
				lastTranscriptionTime,
				isRecordingActive,
				recordingStartTime,
			};
		} catch (error) {
			log.error('Error getting transcription detection state:', error);
			return { success: false, error: error.message };
		}
	});

	// Save current route from frontend
	ipcMain.handle('save-current-route', async (event, route) => {
		try {
			lastWindowState.route = route;
			lastWindowState.timestamp = Date.now();
			log.info('Current route saved:', route);
			return { success: true };
		} catch (error) {
			log.error('Error saving current route:', error);
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

	// Wake word service IPC handlers
	// ipcMain.handle('wake-word-start', () => {
	// 	if (wakeWordService) {
	// 		wakeWordService.start();
	// 		return { success: true };
	// 	}
	// 	return { success: false, error: 'Wake word service not initialized' };
	// });

	// ipcMain.handle('wake-word-stop', () => {
	// 	if (wakeWordService) {
	// 		wakeWordService.stop();
	// 		return { success: true };
	// 	}
	// 	return { success: false, error: 'Wake word service not initialized' };
	// });

	// ipcMain.handle('wake-word-status', () => {
	// 	return {
	// 		success: true,
	// 		isRunning: wakeWordService ? wakeWordService.isRunning : false,
	// 	};
	// });

	// Microphone permission check handler
	ipcMain.handle('check-microphone-permission', async () => {
		try {
			if (process.platform === 'darwin') {
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

	// Request microphone permission handler
	ipcMain.handle('request-microphone-permission', async () => {
		try {
			if (process.platform === 'darwin') {
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
				return {
					success: true,
					action: window.webContents.isDevToolsOpened() ? 'opened' : 'closed',
				};
			} else {
				return { success: false, error: `${targetWindow} window not available` };
			}
		} catch (error) {
			log.error('Error opening dev tools:', error);
			return { success: false, error: error.message };
		}
	});

	// Duplicate handler removed - keeping the first registration around line 1592

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
		globalShortcut.unregisterAll();
		log.info('✅ Global shortcuts unregistered');
	} catch (error) {
		log.error('Error unregistering global shortcuts:', error);
	}
});

// Are You There timer functions
function startAreYouThereTimer() {
	// Clear any existing timer
	if (areYouThereTimer) {
		clearInterval(areYouThereTimer);
	}

	// Set recording start time and mark recording as active
	recordingStartTime = Date.now();
	isAreYouThereWindowShown = false;
	isRecordingActive = true;

	log.info('⏰ Started Are You There timer - will trigger at 30min, 60min, 90min, etc.');

	// Start transcription detection timer alongside the 30-minute timer
	startTranscriptionDetectionTimer();

	// Use setInterval to check every second and show window at 30-minute marks
	areYouThereTimer = setInterval(() => {
		// Check if recording is still active - if not, stop the timer
		if (!isRecordingActive || !recordingStartTime) {
			log.info('⏰ Recording stopped or not active - stopping Are You There timer');
			stopAreYouThereTimer();
			return;
		}

		const currentRecordingTime = Math.floor((Date.now() - recordingStartTime) / 1000);

		// Debug: Log every 5 minutes to see what's happening
		if (currentRecordingTime % 300 === 0) {
			console.log(
				`⏰ Timer check: ${currentRecordingTime}s (recording active: ${isRecordingActive})`,
			);
		}

		// Show window at exact 30-minute marks (1800s, 3600s, 5400s, etc.)
		// Only show if the window is not currently being shown and recording is active
		if (
			currentRecordingTime > 0 &&
			currentRecordingTime % 1800 === 0 && // 30 minutes = 1800 seconds
			!isAreYouThereWindowShown &&
			isRecordingActive
		) {
			console.log(`⏰ Showing Are You There window at ${currentRecordingTime}s mark`);
			showAreYouThereWindow();
		}
	}, 1000); // Check every second
}

function stopAreYouThereTimer() {
	if (areYouThereTimer) {
		clearInterval(areYouThereTimer);
		areYouThereTimer = null;
	}

	// Also stop transcription detection timer
	stopTranscriptionDetectionTimer();

	recordingStartTime = null;
	isAreYouThereWindowShown = false;
	isRecordingActive = false;
	log.info('⏰ Stopped Are You There timer');
}

function showAreYouThereWindow() {
	try {
		if (windowHelper) {
			// Set flag to prevent multiple windows from showing
			isAreYouThereWindowShown = true;

			// Get the Are You There window
			const areYouThereWindow = windowHelper.getAreYouThereWindow();

			if (areYouThereWindow && !areYouThereWindow.isDestroyed()) {
				// Send show command with time-based flag
				areYouThereWindow.webContents.send('are-you-there-show-command', {
					type: 'time-based',
					reason: 'recording-timeout',
				});
				log.info('🏠 Sent time-based show command to Are You There window');
			}

			// Show the window
			windowHelper.showAreYouThereWindow();
			log.info('🏠 Showing Are You There window at 30-minute interval');
		} else {
			log.error('❌ Window helper not available to show Are You There window');
		}
	} catch (error) {
		log.error('❌ Error showing Are You There window:', error);
	}
}

// Transcription detection timer functions
function startTranscriptionDetectionTimer() {
	// Only start if recording is active
	if (!isRecordingActive || !recordingStartTime) {
		log.warn('🎤 Cannot start transcription detection - recording not active');
		return;
	}

	// Clear any existing timer
	if (transcriptionDetectionTimer) {
		clearInterval(transcriptionDetectionTimer);
	}

	// Reset transcription time and mark detection as active
	lastTranscriptionTime = Date.now();
	isTranscriptionDetectionActive = true;
	isTranscriptionBasedAreYouThereShown = false;

	log.info(
		'🎤 Started transcription detection timer - will trigger after 5 minutes of no transcriptions',
	);

	// Use the same logic as restart function
	startTranscriptionDetectionInterval();
}

function startTranscriptionDetectionInterval() {
	// Check every 5 seconds for transcription activity
	transcriptionDetectionTimer = setInterval(() => {
		// Check if recording is still active - if not, stop the timer
		if (!isRecordingActive || !recordingStartTime) {
			log.info('🎤 Recording stopped or not active - stopping transcription detection timer');
			stopTranscriptionDetectionTimer();
			return;
		}

		const currentTime = Date.now();
		const timeSinceLastTranscription = Math.floor((currentTime - lastTranscriptionTime) / 1000);

		// Debug: Log every 10 seconds to see what's happening
		if (timeSinceLastTranscription % 10 === 0 && timeSinceLastTranscription > 0) {
			console.log(
				`🎤 Transcription check: ${timeSinceLastTranscription}s since last transcription (recording active: ${isRecordingActive})`,
			);
		}

		// Show window after 5 minutes (300 seconds) of no transcriptions
		// Only show if the window is not currently being shown and recording is active
		if (
			timeSinceLastTranscription >= 300 && // 5 minutes = 300 seconds
			!isTranscriptionBasedAreYouThereShown &&
			isRecordingActive
		) {
			console.log(
				`🎤 Showing Are You There window after ${timeSinceLastTranscription}s of no transcriptions`,
			);
			showTranscriptionBasedAreYouThereWindow();
		}
	}, 5000); // Check every 5 seconds
}

function stopTranscriptionDetectionTimer() {
	if (transcriptionDetectionTimer) {
		clearInterval(transcriptionDetectionTimer);
		transcriptionDetectionTimer = null;
	}
	lastTranscriptionTime = null;
	isTranscriptionDetectionActive = false;
	isTranscriptionBasedAreYouThereShown = false;
	log.info('🎤 Stopped transcription detection timer');
}

function updateTranscriptionActivity() {
	// Update the last transcription time
	lastTranscriptionTime = Date.now();

	// If the Are You There window is shown due to no transcriptions, hide it
	if (isTranscriptionBasedAreYouThereShown) {
		log.info('🎤 Transcription detected - hiding transcription-based Are You There window');
		hideTranscriptionBasedAreYouThereWindow();
	}

	// If transcription detection is active, reset the timer
	if (isTranscriptionDetectionActive) {
		log.info('🎤 Transcription detected - resetting 1-minute timer');
		// Reset the timer by updating the last transcription time
		lastTranscriptionTime = Date.now();
	}
}

function restartTranscriptionDetectionTimer() {
	// Only restart if recording is active
	if (!isRecordingActive || !recordingStartTime) {
		log.warn('🎤 Cannot restart transcription detection - recording not active');
		return;
	}

	// Stop current timer if running
	if (transcriptionDetectionTimer) {
		clearInterval(transcriptionDetectionTimer);
		transcriptionDetectionTimer = null;
	}

	// Reset transcription time and restart detection
	lastTranscriptionTime = Date.now();
	isTranscriptionDetectionActive = true;
	isTranscriptionBasedAreYouThereShown = false;

	log.info(
		'🎤 Restarted transcription detection timer - will trigger after 5 minutes of no transcriptions',
	);

	// Use the shared interval logic
	startTranscriptionDetectionInterval();
}

function showTranscriptionBasedAreYouThereWindow() {
	try {
		if (windowHelper) {
			// Set flag to prevent multiple windows from showing
			isTranscriptionBasedAreYouThereShown = true;

			// Get the Are You There window
			const areYouThereWindow = windowHelper.getAreYouThereWindow();

			if (areYouThereWindow && !areYouThereWindow.isDestroyed()) {
				// Send show command with transcription-based flag
				areYouThereWindow.webContents.send('are-you-there-show-command', {
					type: 'transcription-based',
					reason: 'no-transcriptions',
				});
				log.info('🏠 Sent transcription-based show command to Are You There window');
			}

			// Show the window
			windowHelper.showAreYouThereWindow();
			log.info('🏠 Showing Are You There window due to no transcriptions');
		} else {
			log.error(
				'❌ Window helper not available to show transcription-based Are You There window',
			);
		}
	} catch (error) {
		log.error('❌ Error showing transcription-based Are You There window:', error);
	}
}

function hideTranscriptionBasedAreYouThereWindow() {
	try {
		if (windowHelper) {
			// Reset flag
			isTranscriptionBasedAreYouThereShown = false;

			// Hide the window
			windowHelper.hideAreYouThereWindow();
			log.info('🏠 Hiding transcription-based Are You There window');
		}
	} catch (error) {
		log.error('❌ Error hiding transcription-based Are You There window:', error);
	}
}

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

		// 3. Clean up Wake Word Service
		// if (wakeWordService) {
		// 	log.info('🧹 Cleaning up Wake Word Service...');
		// 	wakeWordService.stop();
		// 	wakeWordService = null;
		// }

		// 3. Close main window if it exists
		if (mainWindow && !mainWindow.isDestroyed()) {
			log.info('🧹 Closing main window...');
			mainWindow.close();
		}

		// 4. Force quit all remaining windows
		BrowserWindow.getAllWindows().forEach((window) => {
			if (!window.isDestroyed()) {
				log.info('🧹 Force closing window:', window.getTitle());
				window.destroy();
			}
		});

		// 5. Clean up Are You There timer
		if (areYouThereTimer) {
			clearInterval(areYouThereTimer);
			areYouThereTimer = null;
			log.info('✅ Are You There timer cleared');
		}

		// 6. Clean up transcription detection timer
		if (transcriptionDetectionTimer) {
			clearInterval(transcriptionDetectionTimer);
			transcriptionDetectionTimer = null;
			log.info('✅ Transcription detection timer cleared');
		}

		// 7. Unregister all global shortcuts
		try {
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
