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
	shell,
} = require('electron');
const path = require('node:path');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const WindowHelper = require('./helpers/windowHelper');
const DynamicIslandHelper = require('./helpers/dynamicIslandHelper');
const fs = require('fs');
const { exec } = require('child_process');
const { Worker } = require('worker_threads');
const os = require('os');
const cpuCores = os.cpus().length;
const safeLimit = Math.max(4, Math.min(cpuCores - 1, 8));
const pLimit = require('p-limit'); // ← THIS IS THE FIX
const { cleanupAndQuit } = require('./desktopUtilHelper');
const {
	checkForUpdates,
	updateAvailable,
	updateNotAvailable,
	downloadProgress,
	handleUpdateDownloaded,
	ipcMainHandleCheckForUpdates,
	ipcMainHandleDownloadUpdates,
	ipcMainHandleRestartApp,
} = require('./helpers/autoUpdateHelper');

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
const { handleError } = require('@apollo/client/link/http/parseAndCheckHttpResponse');

const imageProcessingLimit = pLimit(safeLimit); // Max 4 concurrent workers

// Gallery processing functions will be loaded lazily when needed
let galleryHelper = null;

let mainWindow = null;
let windowHelper = null;
let dynamicIslandHelper = null;
let pendingNotificationAction = null;

// Windows-specific variables
let tray = null;
let isQuitting = false;

// Content Protection - Simple & Working Implementation
let isContentProtectionEnabled = false; // for stealth mode

// Runtime platform override for testing (set VE_FORCE_PLATFORM=linux|win32|darwin)
const isMacRuntime = process.platform === 'darwin';

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

let notchDropService = null;

// Auto-updater setup
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// Configure auto-updater for all platforms
autoUpdater.autoDownload = true; // Enable auto-download to prevent conflicts
autoUpdater.autoInstallOnAppQuit = false; // Manual control for better error handling

// Flag to prevent concurrent update operations
let isUpdateInProgress = false;
const getIsUpdateInProgress = () => isUpdateInProgress;
const setIsUpdateInProgress = (value) => {
	isUpdateInProgress = value;
};

const toggleContentProtection = () => {
	isContentProtectionEnabled = !isContentProtectionEnabled;

	// Apply to all windows except main window - keep main window always visible
	const allWindows = BrowserWindow.getAllWindows();
	let protectedCount = 0;

	allWindows.forEach((window) => {
		if (!window.isDestroyed()) {
			// Skip main window - keep it always visible
			if (window === mainWindow) {
				return;
			}

			window.setContentProtection(isContentProtectionEnabled);
			protectedCount++;
		}
	});

	if (notchDropService && typeof notchDropService.updateStealthModeState === 'function') {
		notchDropService.updateStealthModeState(isContentProtectionEnabled);
	}

	return isContentProtectionEnabled;
};

const getContentProtectionStatus = () => {
	return isContentProtectionEnabled;
};

const setContentProtection = (enabled) => {
	isContentProtectionEnabled = enabled;

	BrowserWindow.getAllWindows().forEach((window) => {
		if (!window.isDestroyed()) {
			// Skip main window - keep it always visible
			if (window === mainWindow) {
				return;
			}

			window.setContentProtection(isContentProtectionEnabled);
		}
	});

	log.info(
		`🔒 Content protection set to: ${
			isContentProtectionEnabled ? 'ON' : 'OFF'
		} (main window excluded)`,
	);

	if (notchDropService && typeof notchDropService.updateStealthModeState === 'function') {
		notchDropService.updateStealthModeState(isContentProtectionEnabled);
	}
	return isContentProtectionEnabled;
};

// Function to apply content protection to a newly created window
const applyContentProtectionToWindow = (window) => {
	if (window && !window.isDestroyed()) {
		// Skip main window - keep it always visible
		if (window === mainWindow) {
			return;
		}

		window.setContentProtection(isContentProtectionEnabled);
	}
};

const shouldInitDynamicIsland = (() => {
	const value = String(process.env.VITE_ELECTRON_SHOW_DYNAMIC_ISLAND || '')
		.trim()
		.toLowerCase();
	return (
		process.platform !== 'darwin' ||
		value === '1' ||
		value === 'true' ||
		value === 'yes' ||
		value === 'on'
	);
})();

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

// Add global error handler to prevent crashes
process.on('uncaughtException', (error) => {
	log.error('Uncaught Exception:', error);
	// Don't exit the process, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
	log.error('Unhandled Rejection at:', promise, 'reason:', reason);
	// Don't exit the process, just log the error
});

autoUpdater.on('checking-for-update', () => checkForUpdates(mainWindow));

autoUpdater.on('update-available', (info) =>
	updateAvailable({ info, mainWindow, setIsUpdateInProgress }),
);

autoUpdater.on('update-not-available', (info) =>
	updateNotAvailable({ mainWindow, info, setIsUpdateInProgress }),
);

// Add download progress tracking
autoUpdater.on('download-progress', (progressObj) => downloadProgress({ progressObj, mainWindow }));

autoUpdater.on('error', (err) => handleError({ err, setIsUpdateInProgress, mainWindow }));

autoUpdater.on('update-downloaded', (info) =>
	handleUpdateDownloaded({
		info,
		mainWindow,
		setIsUpdateInProgress,
	}),
);

async function showNotification(title, body) {
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

	// Also send notification to Dynamic Island
	if (dynamicIslandHelper) {
		const dynamicIslandWindow = dynamicIslandHelper.getDynamicIslandWindow();
		if (dynamicIslandWindow && !dynamicIslandWindow.isDestroyed()) {
			const dynamicIslandNotification = {
				title: title || 'Alert',
				message: body || 'This is a test',
				type: 'info',
				duration: 8000,
				actions: [
					{ type: 'join-meet', text: 'Join Meet' },
					{ type: 'dismiss', text: 'Dismiss' },
				],
			};
			dynamicIslandWindow.webContents.send(
				'dynamic-island-notification',
				dynamicIslandNotification,
			);
			log.info('Notification also sent to Dynamic Island');
		}
	}

	// Send notification to SwiftUI NotchDrop
	if (notchDropService && notchDropService.isInitialized) {
		try {
			const notificationData = {
				title: title || 'Alert',
				body: body || 'This is a test',
				type: 'meeting',
				timestamp: new Date().toISOString(),
			};
			const result = await notchDropService.sendMessageToSwiftUI(
				JSON.stringify({
					action: 'showNotification',
					data: notificationData,
				}),
			);
			if (result.success) {
				log.info('✅ Notification sent to SwiftUI successfully');
			} else {
				log.warn('⚠️ Failed to send notification to SwiftUI:', result.error);
			}
		} catch (error) {
			log.error('❌ Error sending notification to SwiftUI:', error);
		}
	} else {
		log.info('ℹ️ NotchDrop service not available, skipping SwiftUI notification');
	}
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
ipcMain.handle(
	'check-for-updates',
	async () =>
		await ipcMainHandleCheckForUpdates({
			getIsUpdateInProgress,
			setIsUpdateInProgress,
		}),
);

ipcMain.handle(
	'download-update',
	async () =>
		await ipcMainHandleDownloadUpdates({
			getIsUpdateInProgress,
			setIsUpdateInProgress,
		}),
);

ipcMain.handle('restart-app', () =>
	ipcMainHandleRestartApp({
		setIsUpdateInProgress,
		dynamicIslandHelper,
		windowHelper,
	}),
);

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
			label: 'Edit',
			submenu: [
				{
					label: 'Undo',
					role: 'undo',
					accelerator: 'CmdOrCtrl+Z',
				},
				{
					label: 'Redo',
					role: 'redo',
					accelerator: 'CmdOrCtrl+Y',
				},
				{
					type: 'separator',
				},
				{
					label: 'Cut',
					role: 'cut',
					accelerator: 'CmdOrCtrl+X',
				},
				{
					label: 'Copy',
					role: 'copy',
					accelerator: 'CmdOrCtrl+C',
				},
				{
					label: 'Paste',
					role: 'paste',
					accelerator: 'CmdOrCtrl+V',
				},
				{
					type: 'separator',
				},
				{
					label: 'Select All',
					role: 'selectAll',
					accelerator: 'CmdOrCtrl+A',
				},
			],
		},
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
				{
					type: 'separator',
				},
				{
					label: 'Developer Tools',
					submenu: [
						{
							label: 'Main Window (index.html)',
							accelerator: 'CmdOrCtrl+Shift+D',
							click: () => {
								try {
									if (mainWindow && !mainWindow.isDestroyed()) {
										mainWindow.webContents.toggleDevTools();
									}
								} catch (error) {
									log.error('Error toggling main window dev tools:', error);
								}
							},
						},
						{
							label: 'Ask AI Window (askai.html)',
							accelerator: 'CmdOrCtrl+Shift+A',
							click: () => {
								try {
									const askAIWindow = windowHelper?.getAskAIWindow();
									if (askAIWindow && !askAIWindow.isDestroyed()) {
										askAIWindow.webContents.openDevTools({ mode: 'detach' });
									} else {
										log.warn('Ask AI window not available for dev tools');
									}
								} catch (error) {
									log.error('Error toggling Ask AI window dev tools:', error);
								}
							},
						},
						{
							label: 'Overlay Window (overlay.html)',
							accelerator: 'CmdOrCtrl+Shift+O',
							click: () => {
								try {
									const overlayWindow = windowHelper?.getOverlayWindow();
									if (overlayWindow && !overlayWindow.isDestroyed()) {
										overlayWindow.webContents.openDevTools({ mode: 'detach' });
									} else {
										log.warn('Overlay window not available for dev tools');
									}
								} catch (error) {
									log.error('Error toggling overlay window dev tools:', error);
								}
							},
						},
						{
							label: 'Dynamic Island Window (dynamic-island.html)',
							accelerator: 'CmdOrCtrl+Shift+I',
							click: () => {
								try {
									const dynamicIslandWindow =
										dynamicIslandHelper?.getDynamicIslandWindow();
									if (dynamicIslandWindow && !dynamicIslandWindow.isDestroyed()) {
										dynamicIslandWindow.webContents.openDevTools({
											mode: 'detach',
										});
									} else {
										log.warn(
											'Dynamic Island window not available for dev tools',
										);
									}
								} catch (error) {
									log.error(
										'Error toggling Dynamic Island window dev tools:',
										error,
									);
								}
							},
						},
						{
							label: 'Are You There Window (areyouthere.html)',
							accelerator: 'CmdOrCtrl+Shift+Y',
							click: () => {
								try {
									const areYouThereWindow = windowHelper?.getAreYouThereWindow();
									if (areYouThereWindow && !areYouThereWindow.isDestroyed()) {
										areYouThereWindow.webContents.openDevTools({
											mode: 'detach',
										});
									} else {
										log.warn(
											'Are You There window not available for dev tools',
										);
									}
								} catch (error) {
									log.error(
										'Error toggling Are You There window dev tools:',
										error,
									);
								}
							},
						},
						{
							type: 'separator',
						},
						{
							label: 'Open All Dev Tools',
							accelerator: 'CmdOrCtrl+Shift+Alt+D',
							click: () => {
								try {
									// Main window
									if (mainWindow && !mainWindow.isDestroyed()) {
										mainWindow.webContents.openDevTools({ mode: 'detach' });
									}

									// Ask AI window
									const askAIWindow = windowHelper?.getAskAIWindow();
									if (askAIWindow && !askAIWindow.isDestroyed()) {
										askAIWindow.webContents.openDevTools({ mode: 'detach' });
									}

									// Overlay window
									const overlayWindow = windowHelper?.getOverlayWindow();
									if (overlayWindow && !overlayWindow.isDestroyed()) {
										overlayWindow.webContents.openDevTools({ mode: 'detach' });
									}

									// Dynamic Island window
									const dynamicIslandWindow =
										dynamicIslandHelper?.getDynamicIslandWindow();
									if (dynamicIslandWindow && !dynamicIslandWindow.isDestroyed()) {
										dynamicIslandWindow.webContents.openDevTools({
											mode: 'detach',
										});
									}

									// Are You There window
									const areYouThereWindow = windowHelper?.getAreYouThereWindow();
									if (areYouThereWindow && !areYouThereWindow.isDestroyed()) {
										areYouThereWindow.webContents.openDevTools({
											mode: 'detach',
										});
									}

									log.info('Opened developer tools for all available windows');
								} catch (error) {
									log.error('Error opening all dev tools:', error);
								}
							},
						},
						{
							label: 'Close All Dev Tools',
							accelerator: 'CmdOrCtrl+Shift+Alt+C',
							click: () => {
								try {
									// Main window
									if (mainWindow && !mainWindow.isDestroyed()) {
										mainWindow.webContents.closeDevTools();
									}

									// Ask AI window
									const askAIWindow = windowHelper?.getAskAIWindow();
									if (askAIWindow && !askAIWindow.isDestroyed()) {
										askAIWindow.webContents.closeDevTools();
									}

									// Overlay window
									const overlayWindow = windowHelper?.getOverlayWindow();
									if (overlayWindow && !overlayWindow.isDestroyed()) {
										overlayWindow.webContents.closeDevTools();
									}

									// Dynamic Island window
									const dynamicIslandWindow =
										dynamicIslandHelper?.getDynamicIslandWindow();
									if (dynamicIslandWindow && !dynamicIslandWindow.isDestroyed()) {
										dynamicIslandWindow.webContents.closeDevTools();
									}

									// Are You There window
									const areYouThereWindow = windowHelper?.getAreYouThereWindow();
									if (areYouThereWindow && !areYouThereWindow.isDestroyed()) {
										areYouThereWindow.webContents.closeDevTools();
									}

									log.info('Closed developer tools for all windows');
								} catch (error) {
									log.error('Error closing all dev tools:', error);
								}
							},
						},
					],
				},
				{
					type: 'separator',
				},
				// Show Dynamic Island toggle only for non-mac runtime
				...(!isMac
					? [
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
					  ]
					: []),
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
	if (isMacRuntime) {
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

	// Listen for NotchDrop service events to update menu
	if (notchDropService.notchDropAddon) {
		notchDropService.notchDropAddon.on('statusChanged', (status) => {
			updateMenuBarState();
		});

		notchDropService.notchDropAddon.on('itemAdded', () => {
			updateMenuBarState();
		});

		notchDropService.notchDropAddon.on('itemRemoved', () => {
			updateMenuBarState();
		});
	}
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
			if (fs.existsSync(testPath)) {
				iconPath = testPath;
				break;
			}
		}

		// Fallback to the first path if none exist
		if (!iconPath) {
			iconPath = possiblePaths[0];
		}
	} else if (isMacRuntime) {
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

	if (notchDropService) {
		notchDropService.setMainWindow(mainWindow);
	}

	// Add context menu support for copy/paste functionality
	mainWindow.webContents.on('context-menu', (event, params) => {
		const menu = Menu.buildFromTemplate([
			{
				label: 'Cut',
				role: 'cut',
				enabled:
					params.isEditable && params.selectionText && params.selectionText.length > 0,
			},
			{
				label: 'Copy',
				role: 'copy',
				enabled: params.selectionText && params.selectionText.length > 0,
			},
			{
				label: 'Paste',
				role: 'paste',
				enabled: params.isEditable,
			},
			{
				type: 'separator',
			},
			{
				label: 'Select All',
				role: 'selectAll',
				enabled: params.isEditable,
			},
		]);

		// Only show context menu if there's text selected or if it's an editable element
		if (params.selectionText || params.isEditable) {
			menu.popup();
		}
	});
	// Add context menu support for copy/paste functionality
	mainWindow.webContents.on('context-menu', (event, params) => {
		const menu = Menu.buildFromTemplate([
			{
				label: 'Cut',
				role: 'cut',
				enabled:
					params.isEditable && params.selectionText && params.selectionText.length > 0,
			},
			{
				label: 'Copy',
				role: 'copy',
				enabled: params.selectionText && params.selectionText.length > 0,
			},
			{
				label: 'Paste',
				role: 'paste',
				enabled: params.isEditable,
			},
			{
				type: 'separator',
			},
			{
				label: 'Select All',
				role: 'selectAll',
				enabled: params.isEditable,
			},
		]);

		// Only show context menu if there's text selected or if it's an editable element
		if (params.selectionText || params.isEditable) {
			menu.popup();
		}
	});

	ipcMain.on('veAppMsg', async (event, msg) => {
		// log.info('🔄 Received message from veApp:', msg); // logs: btn clicked from react

		// Handle logout message - notify Dynamic Island
		if (msg === 'loggedout') {
			log.info('🔓 User logged out - notifying Dynamic Island');
			const dynamicIslandWindow = dynamicIslandHelper?.dynamicIslandWindow;
			if (dynamicIslandWindow && !dynamicIslandWindow.isDestroyed()) {
				dynamicIslandWindow.webContents.send('user-logout');
				log.info('✅ Logout notification sent to Dynamic Island');
			}
		}

		// Send the same message to Swift UI if NotchDrop service is available
		if (notchDropService && notchDropService.isInitialized) {
			try {
				const result = await notchDropService.sendMessageToSwiftUI(msg);
				// if (result.success) {
				// 	log.info('✅ Message sent to Swift UI successfully');
				// } else {
				// 	log.warn('⚠️ Failed to send message to Swift UI:', result.error);
				// }
			} catch (error) {
				log.error('❌ Error sending message to Swift UI:', error);
			}
		} else {
			log.info('ℹ️ NotchDrop service not available, skipping Swift UI message');
		}
	});

	if (process.env.VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
	} else {
		mainWindow.loadFile('build/index.html');
	}

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();

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
		if (!isQuitting && !isUpdateInProgress) {
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

	return mainWindow;
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
					if (mainWindow && !mainWindow.isDestroyed()) {
						mainWindow.show();
						mainWindow.focus();
					} else {
						// Window doesn't exist, recreate it
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
			if (mainWindow && !mainWindow.isDestroyed()) {
				mainWindow.show();
				mainWindow.focus();
			} else {
				// Window doesn't exist, recreate it
				createWindow(true); // Pass true to restore state
			}
		});
	} catch (error) {
		log.error('Error creating system tray:', error);
	}
}

// Single instance lock to prevent multiple app instances
// This ensures only one instance of the app can run at a time
// When a second instance is attempted, it will focus the existing window instead
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
	// Another instance is already running, focus it and quit
	log.info('Another instance is already running, focusing existing window and quitting...');
	app.quit();
} else {
	// Handle second instance attempts
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		log.info('Second instance attempted, focusing existing window...');
		log.info('Command line:', commandLine);
		log.info('Working directory:', workingDirectory);

		// Focus the main window if it exists
		if (mainWindow && !mainWindow.isDestroyed()) {
			if (mainWindow.isMinimized()) {
				mainWindow.restore();
			}
			mainWindow.focus();
			mainWindow.show();
			log.info('✅ Main window focused and shown');
		} else {
			log.warn('⚠️ Main window not available, creating new one...');
			// If main window doesn't exist, we might need to create it
			// This could happen if the app was closed but the process is still running
		}

		// Also focus any other important windows
		const allWindows = BrowserWindow.getAllWindows();
		let focusedCount = 0;
		allWindows.forEach((window) => {
			if (!window.isDestroyed() && window.isVisible()) {
				window.focus();
				focusedCount++;
			}
		});
		log.info(`✅ Focused ${focusedCount} existing windows`);
	});

	// Handle app being opened with files or URLs
	app.on('open-file', (event, filePath) => {
		log.info('App opened with file:', filePath);
		event.preventDefault();

		// Focus existing window
		if (mainWindow && !mainWindow.isDestroyed()) {
			if (mainWindow.isMinimized()) {
				mainWindow.restore();
			}
			mainWindow.focus();
			mainWindow.show();
		}
	});

	app.on('open-url', (event, url) => {
		log.info('App opened with URL:', url);
		event.preventDefault();

		// Focus existing window
		if (mainWindow && !mainWindow.isDestroyed()) {
			if (mainWindow.isMinimized()) {
				mainWindow.restore();
			}
			mainWindow.focus();
			mainWindow.show();
		}
	});
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

		if (allowedPermissions.includes(permission)) {
			callback(true);
		} else {
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

	// Configure automatic screen capture without dialog
	session.defaultSession.setDisplayMediaRequestHandler(
		(request, callback) => {
			log.info('📺 Display media requested - providing automatic whole screen capture');
			desktopCapturer
				.getSources({ types: ['screen'] })
				.then((sources) => {
					if (sources && sources.length > 0) {
						// Automatically select the first (primary) screen
						log.info(`🎯 Auto-selecting primary screen: ${sources[0].name}`);
						callback({
							video: sources[0],
							audio: 'loopback', // Include system audio
						});
					} else {
						log.warn('⚠️ No screen sources available for automatic capture');
						callback({});
					}
				})
				.catch((error) => {
					log.error('❌ Error getting screen sources for automatic capture:', error);
					callback({});
				});
		},
		{ useSystemPicker: false }, // CRITICAL: Disable system picker to avoid dialog
	);

	// Check macOS microphone permission status (macOS only)
	if (isMacRuntime) {
		// Check microphone permission status (this is synchronous)
		const microphoneStatus = systemPreferences.getMediaAccessStatus('microphone');
		const cameraStatus = systemPreferences.getMediaAccessStatus('camera');

		log.info('macOS Microphone permission status:', microphoneStatus);
		log.info('macOS Camera permission status:', cameraStatus);

		console.log('Microphone status:', microphoneStatus);
		console.log('Camera status:', cameraStatus);
	}

	// ✅ Request screen recording permission (macOS only)
	if (isMacRuntime) {
		setTimeout(async () => {
			try {
				const granted = await systemPreferences.askForMediaAccess('screen-recording');
			} catch (error) {
				log.error('Error requesting screen recording permission:', error);
				// This is expected in some cases, not a critical error
			}
		}, 2000);

		// Also request camera permission
		setTimeout(async () => {
			const cameraGranted = await systemPreferences.askForMediaAccess('camera');
			log.info('Camera permission result:', cameraGranted);
		}, 3000);
	}

	meetingMonitor.setNotificationHandler(showNotification);
	meetingMonitor.startMeetingMonitor();

	// 🎤 IPC: Start Mic Monitoring

	// Initialize Dynamic Island with comprehensive error handling
	try {
		log.info('Initializing Dynamic Island Helper...');
		dynamicIslandHelper = new DynamicIslandHelper();
		dynamicIslandHelper.createDynamicIslandWindow();
		log.info('Dynamic Island Helper initialized successfully');
	} catch (error) {
		log.error('Failed to initialize Dynamic Island Helper:', error);
		// Continue app initialization even if Dynamic Island fails
		dynamicIslandHelper = null;
	}

	// THEN: Create main window after dynamic island
	createWindow();

	ipcMain.handle('process-image-with-sharp', processImageWithSharp);
	ipcMain.handle('extract-image-metadata', extractImageMetadata);
	ipcMain.handle('download-album-zip', downloadAlbumZip);
	ipcMain.handle('create-zip-from-urls', createZipFromUrls);

	createTray(); // Create system tray for Windows
	createMenuBar();

	windowHelper = new WindowHelper(applyContentProtectionToWindow);
	windowHelper.registerGlobalShortcuts(mainWindow);
	windowHelper.setDynamicIslandHelper(dynamicIslandHelper);

	// Simple Content Protection IPC handlers
	ipcMain.handle('toggle-content-protection', () => {
		const newStatus = toggleContentProtection();
		const statusText = newStatus ? 'ON' : 'OFF';
		const windowCount = BrowserWindow.getAllWindows().length;

		// Show system notification with clear status
		showNotification(
			`Content Protection: ${statusText}`,
			newStatus
				? `🔒 INVISIBILITY ON - ${windowCount} windows are now protected from screen recording`
				: `👁️ INVISIBILITY OFF - ${windowCount} windows are now visible in screen recording`,
		);

		return newStatus;
	});

	ipcMain.handle('get-content-protection-status', () => {
		const status = getContentProtectionStatus();
		return status;
	});

	ipcMain.handle('set-content-protection', (event, enabled) => {
		return setContentProtection(enabled);
	});

	// Register Ask AI window IPC handlers
	ipcMain.handle('toggle-askAI-window', async () => {
		try {
			windowHelper?.toggleAskAIWindow();
		} catch (error) {
			log.error('Error toggling Ask AI window:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('show-askAI-window', async () => {
		try {
			windowHelper?.showAskAIWindow();

			return { success: true };
		} catch (error) {
			log.error('Error showing Ask AI window:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('is-askAI-window-visible', async () => {
		try {
			const isVisible = windowHelper?.isAskAIWindowVisible();
			return { success: true, isVisible };
		} catch (error) {
			log.error('Error checking Ask AI window visibility:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('update-askAI-dimensions', async (event, { width, height }) => {
		try {
			windowHelper?.updateAskAIWindowDimensions(width, height);
			return { success: true };
		} catch (error) {
			log.error('Error updating Ask AI dimensions:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('set-askAI-ignore-mouse-events', async (event, ignore) => {
		try {
			const askAIWindow = windowHelper?.getAskAIWindow();
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
			return { success: true, isFocused: focusState };
		} catch (error) {
			log.error('Error getting ask AI input focus state:', error);
			return { success: false, error: error.message };
		}
	});

	// Handler to hide all windows (overlay and ask AI)
	ipcMain.handle('hide-all-windows', async () => {
		try {
			windowHelper?.hideAllWindows();
			return { success: true };
		} catch (error) {
			log.error('Error hiding all windows:', error);
			return { success: false, error: error.message };
		}
	});

	try {
		await windowHelper?.preCreateOverlayWindow();
	} catch (error) {
		log.error('❌ Error pre-creating overlay window:', error);
	}

	if (isMacRuntime) {
		notchDropService = new NotchDropService();
		notchDropService.setMainWindow(mainWindow);
		notchDropService.setMainWindowFactory((restoreState = false) => createWindow(restoreState));
		notchDropService.setStealthModeController({
			toggle: toggleContentProtection,
			getStatus: getContentProtectionStatus,
			setStatus: setContentProtection,
		});

		// CRITICAL: Ensure NotchDrop service fully initializes before proceeding
		let notchDropInitialized = false;
		let initRetries = 0;
		const maxInitRetries = 5;

		while (!notchDropInitialized && initRetries < maxInitRetries) {
			try {
				await notchDropService.initialize();

				notchDropInitialized = notchDropService && notchDropService.isInitialized;

				if (!notchDropInitialized) {
					throw new Error('NotchDrop service initialization incomplete');
				}
			} catch (error) {
				initRetries++;

				if (initRetries < maxInitRetries) {
					await new Promise((resolve) => setTimeout(resolve, 1000 * initRetries)); // Exponential backoff
				} else {
					log.error('❌ NotchDrop service failed to initialize after maximum retries');
					// Continue anyway but log the issue
					notchDropInitialized = true; // Allow app to continue
				}
			}
		}
	}

	await new Promise((resolve) => setTimeout(resolve, 1500)); // Give bridge time to initialize

	// Phase 5: Validate system readiness
	setTimeout(() => {
		// Test NotchDrop service readiness
		if (notchDropService && notchDropService.isInitialized) {
			try {
				const status = notchDropService.getStatus();
				log.info('✅ NotchDrop service status check:', status);
			} catch (error) {
				log.warn('⚠️ NotchDrop service status check failed:', error.message);
			}
		}

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
			await handleSwiftOverlayRequest('startRecording');
		} catch (error) {
			log.error('❌ Error handling Swift UI overlay recording request:', error);
		}
	});

	// CRITICAL FIX: Immediate overlay recording request handler
	process.on('swift-ui-trigger-overlay-recording-immediate', async () => {
		try {
			await handleSwiftOverlayRequestImmediate('startRecording');
		} catch (error) {
			log.error('❌ Error handling immediate Swift UI overlay recording request:', error);
		}
	});

	// CRITICAL FIX: Immediate live intelligence request handler
	process.on('swift-ui-trigger-overlay-live-intelligence-immediate', async () => {
		try {
			await handleSwiftOverlayRequestImmediate('toggleLiveIntelligence');
		} catch (error) {
			log.error('❌ Error handling immediate Swift UI live intelligence request:', error);
		}
	});

	// CRITICAL FIX: Pre-create overlay window signal handler
	process.on('pre-create-overlay-window', async () => {
		try {
			if (windowHelper && typeof windowHelper.preCreateOverlayWindow === 'function') {
				await windowHelper.preCreateOverlayWindow();
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
			if (!windowHelper) {
				log.error('windowHelper not available for AskAI forwarding');
				return;
			}

			let askAIWindow = windowHelper?.getAskAIWindow();
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
		} else {
			log.error(`❌ Overlay window not available after creating for ${action}`);
		}
	}

	// CRITICAL FIX: Immediate handler for Swift overlay requests (no waiting)
	async function handleSwiftOverlayRequestImmediate(action) {
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

			return { success: true };
		} else {
			log.error(`❌ IMMEDIATE: Failed to get overlay window for Swift ${action} request`);
			return { success: false, error: 'Overlay window not available' };
		}
	}

	// Set up NotchDrop status change listener to update menu
	setupNotchDropMenuUpdates();

	// macOS dock icon click handler to reopen main window
	if (isMacRuntime) {
		app.on('activate', () => {
			log.info('🍎 Dock icon clicked - reopening main window');
			if (mainWindow && !mainWindow.isDestroyed()) {
				// Window exists, just show and focus it
				mainWindow.show();
				mainWindow.focus();
			} else {
				// Window doesn't exist, recreate it
				log.info('Main window not available, recreating from dock click');
				createWindow(true); // Pass true to restore state
			}
		});
	}

	// Register global shortcut for dynamic island (Cmd+I)
	globalShortcut.register('CommandOrControl+I', () => {
		if (dynamicIslandHelper) {
			dynamicIslandHelper.toggleVisibility();
		}
	});

	// Check if global shortcuts are working (especially important on macOS)
	if (isMacRuntime) {
		// Check if the app has accessibility permissions
		const hasAccessibilityPermission = systemPreferences.isTrustedAccessibilityClient(false);

		if (!hasAccessibilityPermission) {
			log.warn('⚠️ Global shortcuts may not work! The app needs accessibility permissions.');
			log.warn(
				'Please go to System Preferences > Security & Privacy > Privacy > Accessibility',
			);
			log.warn('and add this app to the list of allowed applications.');

			// Show a dialog to the user
			// dialog.showMessageBox(mainWindow, {
			// 	type: 'warning',
			// 	title: 'Accessibility Permission Required',
			// 	message: 'Global shortcuts (Cmd+B) require accessibility permissions',
			// 	detail: 'Please go to System Preferences > Security & Privacy > Privacy > Accessibility and add this app to the allowed applications list.',
			// 	buttons: ['OK'],
			// });
		}
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
			// Get the Ask AI window through windowHelper
			let askAIWindow = windowHelper.getAskAIWindow();

			// If Ask AI window doesn't exist or is destroyed, create it
			if (!askAIWindow || askAIWindow.isDestroyed()) {
				windowHelper.createAskAIWindow();

				// Wait for window to be created and ready
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Get the window reference again after creating it
				askAIWindow = windowHelper.getAskAIWindow();
			}

			// Ensure window is visible
			if (askAIWindow && !askAIWindow.isDestroyed()) {
				if (!askAIWindow.isVisible()) {
					windowHelper.showAskAIWindow();
					// Wait a bit for the window to be fully visible
					await new Promise((resolve) => setTimeout(resolve, 500));
				}

				// Send the chat message to Ask AI window
				askAIWindow.webContents.send('receive-chat-message', chatMessage);
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
				return { success: true };
			} else {
				// Main window doesn't exist or is destroyed, recreate it

				// Recreate the main window with state restoration
				createWindow(true);

				// Wait for the window to be ready
				await new Promise((resolve) => {
					if (mainWindow && !mainWindow.isDestroyed()) {
						mainWindow.once('ready-to-show', () => {
							mainWindow.show();
							mainWindow.focus();
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
			if (isMacRuntime) {
				const cameraStatus = systemPreferences.getMediaAccessStatus('camera');

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
			if (isMacRuntime) {
				// First check current permission status
				const currentStatus = systemPreferences.getMediaAccessStatus('camera');

				if (currentStatus === 'granted') {
					return { success: true, granted: true, status: currentStatus };
				}

				if (currentStatus === 'denied') {
					return {
						success: false,
						granted: false,
						status: currentStatus,
						error: 'Camera access denied. Please enable camera access in System Preferences > Security & Privacy > Privacy > Camera.',
					};
				}

				// Request permission if not determined
				const cameraGranted = await systemPreferences.askForMediaAccess('camera');

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

	ipcMain.handle('dynamic-island-force-show', async () => {
		try {
			if (!dynamicIslandHelper) {
				return { success: false, error: 'Dynamic Island helper not initialized' };
			}
			const result = dynamicIslandHelper.forceShow();
			return { success: result };
		} catch (error) {
			log.error('Error force showing dynamic island:', error);
			return { success: false, error: error.message };
		}
	});

	// Combined Dynamic Island show/expand and recording trigger for Windows
	ipcMain.handle('dynamic-island-start-recording-from-modal', async () => {
		try {
			log.info('🏝️ Starting recording from CreateMeetingModal via Dynamic Island');

			// Only proceed on Windows (or when forced on macOS)
			const shouldForceShowDynamicIsland = (() => {
				const value = String(process.env.VITE_ELECTRON_SHOW_DYNAMIC_ISLAND || '')
					.trim()
					.toLowerCase();
				return value === '1' || value === 'true' || value === 'yes' || value === 'on';
			})();

			if (isMacRuntime && !shouldForceShowDynamicIsland) {
				log.info('🍎 Skipping Dynamic Island recording on macOS (using NotchDrop)');
				return { success: false, error: 'Use NotchDrop on macOS' };
			}

			if (!dynamicIslandHelper) {
				log.error('❌ Dynamic Island helper not initialized');
				return { success: false, error: 'Dynamic Island helper not initialized' };
			}

			// Step 1: Force show Dynamic Island
			log.info('🏝️ Step 1: Force showing Dynamic Island');
			const showResult = dynamicIslandHelper.forceShow();
			if (!showResult) {
				log.error('❌ Failed to show Dynamic Island');
				return { success: false, error: 'Failed to show Dynamic Island' };
			}

			// Step 2: Start overlay recording (keeping Dynamic Island in closed state)
			log.info('🏝️ Step 2: Starting overlay recording (Dynamic Island remains closed)');

			// Get or create overlay window
			let overlayWindow = windowHelper?.getOverlayWindow();
			if (!overlayWindow) {
				windowHelper?.createOverlayWindow();
				// Wait for window creation
				await new Promise((resolve) => setTimeout(resolve, 300));
				overlayWindow = windowHelper?.getOverlayWindow();
			}

			if (overlayWindow) {
				// Show the overlay window if it's not visible
				if (!overlayWindow.isVisible()) {
					windowHelper?.showOverlayWindow();
					await new Promise((resolve) => setTimeout(resolve, 200));
				}

				// Send recording command using windowHelper's queuing system
				const commandSent = windowHelper?.sendOverlayCommand({
					action: 'startRecording',
				});

				log.info(
					`✅ Recording command ${
						commandSent ? 'sent immediately' : 'queued'
					} from Dynamic Island`,
				);

				// Focus overlay and bring to front
				overlayWindow.focus();
				overlayWindow.moveTop();

				// Start the Are You There timer for 30-minute intervals
				startAreYouThereTimer();

				log.info(
					'🎉 Successfully started recording from CreateMeetingModal via Dynamic Island',
				);
				return { success: true };
			} else {
				log.error('❌ Overlay window not available after creating');
				return { success: false, error: 'Overlay window not available' };
			}
		} catch (error) {
			log.error('❌ Error starting recording from Dynamic Island:', error);
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
	} catch (error) {
		console.error(error);
	}

	// Enhanced overlay integration handlers for Swift UI
	// Helper function to safely register Swift IPC handlers
	const safeRegisterSwiftHandler = (channel, handler) => {
		try {
			ipcMain.handle(channel, handler);
		} catch (error) {
			log.error(`Error registering ${channel} handler:`, error);
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

	// Update voice status in NotchDrop
	ipcMain.handle('notchdrop-update-voice-status', async (event, status) => {
		try {
			log.info('Updating NotchDrop voice status:', status);
			if (notchDropService) {
				await notchDropService.updateVoiceStatus(status);
				return { success: true };
			}
			return { success: false, error: 'NotchDrop service not available' };
		} catch (error) {
			log.error('Error updating voice status:', error);
			return { success: false, error: error.message };
		}
	});

	// Update voice connection state in NotchDrop
	ipcMain.handle('notchdrop-update-voice-connection-state', async (event, status) => {
		try {
			log.info('Updating NotchDrop voice connection state:', status);
			if (notchDropService) {
				await notchDropService.updateVoiceConnectionState(status);
				return { success: true };
			}
			return { success: false, error: 'NotchDrop service not available' };
		} catch (error) {
			log.error('Error updating voice connection state:', error);
			return { success: false, error: error.message };
		}
	});

	// Add voice message to NotchDrop
	ipcMain.handle('notchdrop-add-voice-message', async (event, messageData) => {
		try {
			log.info(
				'Adding voice message to NotchDrop:',
				messageData.sender,
				':',
				messageData.content?.substring(0, 50),
			);
			if (notchDropService) {
				await notchDropService.addVoiceMessage(messageData);
				return { success: true };
			}
			return { success: false, error: 'NotchDrop service not available' };
		} catch (error) {
			log.error('Error adding voice message:', error);
			return { success: false, error: error.message };
		}
	});

	// Update voice mute state in NotchDrop
	ipcMain.handle('notchdrop-update-voice-mute-state', async (event, isMuted) => {
		try {
			log.info('Updating NotchDrop voice mute state:', isMuted);
			if (notchDropService) {
				await notchDropService.updateVoiceMuteState(isMuted);
				return { success: true };
			}
			return { success: false, error: 'NotchDrop service not available' };
		} catch (error) {
			log.error('Error updating voice mute state:', error);
			return { success: false, error: error.message };
		}
	});

	// File system APIs for audio storage
	const fs = require('fs').promises;
	const fsSync = require('fs');
	const path = require('path');
	const os = require('os');

	// Get proper user data directory for audio storage (matching meeting/final branch)
	const getUserDataPath = () => {
		return path.join(os.homedir(), '.ve-desktop-app', 'meetings');
	};

	ipcMain.handle('fs-ensure-dir', async (event, dirPath) => {
		try {
			const fullPath = path.join(getUserDataPath(), dirPath);
			await fs.mkdir(fullPath, { recursive: true });
			return { success: true };
		} catch (error) {
			log.error('Error ensuring directory:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('fs-write-file', async (event, filePath, data) => {
		try {
			const fullPath = path.join(getUserDataPath(), filePath);
			// For text files (like JSON), ensure UTF-8 encoding
			if (typeof data === 'string') {
				await fs.writeFile(fullPath, data, 'utf8');
			} else {
				await fs.writeFile(fullPath, data);
			}
			return { success: true };
		} catch (error) {
			log.error('Error writing file:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('fs-read-file', async (event, filePath) => {
		try {
			const fullPath = path.join(getUserDataPath(), filePath);
			const data = await fs.readFile(fullPath, 'utf8');
			return { success: true, data };
		} catch (error) {
			log.error('Error reading file:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('fs-read-file-binary', async (event, filePath) => {
		try {
			const fullPath = path.join(getUserDataPath(), filePath);
			const data = await fs.readFile(fullPath);
			// Convert Buffer to Uint8Array for proper binary handling
			return { success: true, data: new Uint8Array(data) };
		} catch (error) {
			log.error('Error reading binary file:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('fs-exists', async (event, filePath) => {
		try {
			const fullPath = path.join(getUserDataPath(), filePath);
			await fs.access(fullPath);
			return { success: true, exists: true };
		} catch (error) {
			return { success: true, exists: false };
		}
	});

	ipcMain.handle('fs-remove', async (event, filePath) => {
		try {
			const fullPath = path.join(getUserDataPath(), filePath);
			const stats = await fs.stat(fullPath);
			if (stats.isDirectory()) {
				await fs.rmdir(fullPath, { recursive: true });
			} else {
				await fs.unlink(fullPath);
			}
			return { success: true };
		} catch (error) {
			log.error('Error removing file/directory:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('fs-readdir', async (event, dirPath) => {
		try {
			const fullPath = path.join(getUserDataPath(), dirPath);
			const files = await fs.readdir(fullPath);
			return { success: true, files };
		} catch (error) {
			log.error('Error reading directory:', error);
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

	// Dynamic Island notification handler
	ipcMain.handle('dynamic-island-show-notification', async (event, notification) => {
		try {
			if (!dynamicIslandHelper) {
				return { success: false, error: 'Dynamic Island Helper not initialized' };
			}

			const dynamicIslandWindow = dynamicIslandHelper.getDynamicIslandWindow();
			if (!dynamicIslandWindow || dynamicIslandWindow.isDestroyed()) {
				return { success: false, error: 'Dynamic Island window not available' };
			}

			// Send notification to Dynamic Island window
			dynamicIslandWindow.webContents.send('dynamic-island-notification', notification);

			log.info('Notification sent to Dynamic Island:', notification);
			return { success: true, message: 'Notification sent to Dynamic Island' };
		} catch (error) {
			log.error('Error showing notification in Dynamic Island:', error);
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

	ipcMain.handle('overlay-start-recording', async (event, data = {}) => {
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
					data: data,
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
			// log.debug('Received overlay state update:', state);

			// Validate state parameter
			if (!state || typeof state !== 'object') {
				log.warn('Invalid state parameter received:', state);
				return { success: false, error: 'Invalid state parameter' };
			}

			const dynamicIslandWindow = dynamicIslandHelper?.dynamicIslandWindow;
			if (dynamicIslandWindow && !dynamicIslandWindow.isDestroyed()) {
				// Forward state to Dynamic Island window
				dynamicIslandWindow.webContents.send('overlay-state-changed', state);
				log.debug('State forwarded to Dynamic Island window');
			} else {
				// log.warn('Dynamic Island window not available for state update');
			}

			// Update recording state and manage Are You There timer
			if (state && typeof state.isRecording === 'boolean') {
				if (state.isRecording) {
					// Recording started - start the timer
					if (!isRecordingActive) {
						startAreYouThereTimer();
					}
				} else {
					// Recording stopped - stop the timer and hide window
					if (isRecordingActive) {
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
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow) {
				return { success: true, exists: true, visible: overlayWindow.isVisible() };
			} else {
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
			const overlayWindow = windowHelper?.getOverlayWindow();
			if (overlayWindow && !overlayWindow.isDestroyed()) {
				overlayWindow.webContents.send('overlay-command', command);
				return { success: true, commandSent: true };
			} else {
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
			if (!windowHelper) {
				return { success: false, error: 'Window helper not initialized' };
			}

			// Create overlay window
			windowHelper.createOverlayWindow();

			// Wait a moment for the window to be created
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Get the window reference
			const overlayWindow = windowHelper.getOverlayWindow();
			if (overlayWindow && !overlayWindow.isDestroyed()) {
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
	// Enhanced image processing with batching
	ipcMain.handle('process-image-batch', async (event, { files, settings }) => {
		try {
			const results = [];
			const batchSize = 2; // Process 2 images at a time to prevent overwhelming

			for (let i = 0; i < files.length; i += batchSize) {
				const batch = files.slice(i, i + batchSize);
				const batchPromises = batch.map((fileData) =>
					imageProcessingLimit(async () => {
						return new Promise((resolve) => {
							const taskId = Date.now() + Math.random();
							const workerPath = path.join(__dirname, 'imageProcessWorker.js');
							const worker = new Worker(workerPath, {
								workerData: { data: { ...fileData, settings } },
							});

							// Prepare transfer list for ArrayBuffer transfer
							const transferList = [];
							if (fileData.imageBuffer instanceof ArrayBuffer) {
								transferList.push(fileData.imageBuffer);
							}

							worker.on('message', (result) => {
								if (result.taskId === taskId) {
									worker.terminate().catch(() => {});
									resolve(result);
								}
							});

							worker.on('error', (err) => {
								worker.terminate().catch(() => {});
								resolve({ success: false, error: `Worker error: ${err.message}` });
							});

							worker.on('exit', (code) => {
								if (code !== 0) {
									resolve({
										success: false,
										error: `Worker stopped with exit code ${code}`,
									});
								}
							});

							// Send with transfer list for zero-copy transfer
							worker.postMessage(
								{ taskId, data: { ...fileData, settings } },
								transferList,
							);
						});
					}),
				);

				const batchResults = await Promise.all(batchPromises);
				results.push(...batchResults);

				// Send progress update after each batch
				event.sender.send('image-processing-progress', {
					processed: results.length,
					total: files.length,
					results: results,
				});

				// Small delay to prevent overwhelming the system
				await new Promise((resolve) => setTimeout(resolve, 50));
			}

			return { success: true, results };
		} catch (error) {
			log.error('Batch processing error:', error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle('process-image-with-sharp', (event, data) => {
		return imageProcessingLimit(async () => {
			return new Promise((resolve) => {
				const taskId = Date.now() + Math.random();
				const workerPath = path.join(__dirname, 'imageProcessWorker.js');
				const worker = new Worker(workerPath, {
					workerData: { data },
				});

				// Prepare transfer list for ArrayBuffer transfer
				const transferList = [];
				if (data.imageBuffer instanceof ArrayBuffer) {
					transferList.push(data.imageBuffer);
				}

				worker.on('message', (result) => {
					if (result.taskId === taskId) {
						worker.terminate().catch(() => {});
						resolve(result);
					}
				});

				worker.on('error', (err) => {
					worker.terminate().catch(() => {});
					resolve({ success: false, error: `Worker error: ${err.message}` });
				});

				worker.on('exit', (code) => {
					if (code !== 0) {
						resolve({
							success: false,
							error: `Worker stopped with exit code ${code}`,
						});
					}
				});

				// Send with transfer list for zero-copy transfer
				worker.postMessage({ taskId, data }, transferList);
			});
		});
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

	// Microphone permission check handler
	ipcMain.handle('check-microphone-permission', async () => {
		try {
			if (isMacRuntime) {
				const microphoneStatus = systemPreferences.getMediaAccessStatus('microphone');

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
			if (isMacRuntime) {
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
			if (isMacRuntime) {
				// Request microphone access (this will show the system dialog)
				const granted = await systemPreferences.askForMediaAccess('microphone');

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

	// Show screen recording permission help
	ipcMain.handle('show-screen-recording-permission-help', async () => {
		try {
			if (isMacRuntime) {
				const result = await dialog.showMessageBox(mainWindow, {
					type: 'info',
					title: 'Screen Recording Permission Required',
					message: 'Screen recording access is needed for screen capture functionality',
					detail: 'To enable screen recording access:\n\n1. Go to System Preferences > Security & Privacy > Privacy\n2. Select "Screen Recording" from the left sidebar\n3. Check the box next to this app\n4. Restart the app if needed',
					buttons: ['Open System Preferences', 'Cancel'],
					defaultId: 0,
					cancelId: 1,
				});

				if (result.response === 0) {
					// Open System Preferences to Screen Recording section
					exec(
						'open "x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture"',
					);
				}

				return { success: true, openedSystemPrefs: result.response === 0 };
			} else {
				return {
					success: true,
					openedSystemPrefs: false,
					message: 'Screen recording permissions handled by system',
				};
			}
		} catch (error) {
			log.error('Error showing screen recording permission help:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	});

	// Screen capture IPC handler
	ipcMain.handle('start-screen-capture', async () => {
		try {
			log.info('Starting screen capture...');

			// Get screen sources using desktopCapturer
			const sources = await desktopCapturer.getSources({
				types: ['screen'],
				thumbnailSize: { width: 1920, height: 1080 },
			});

			if (!sources || sources.length === 0) {
				log.warn('No screen sources available for capture');
				return { success: false, error: 'No screen sources available' };
			}

			// Return the first (primary) screen source
			const primaryScreen = sources[0];
			log.info(`Screen capture source selected: ${primaryScreen.name}`);

			return {
				success: true,
				source: {
					id: primaryScreen.id,
					name: primaryScreen.name,
					thumbnail: primaryScreen.thumbnail ? primaryScreen.thumbnail.toDataURL() : null,
				},
			};
		} catch (error) {
			log.error('Error starting screen capture:', error);
			return { success: false, error: error.message };
		}
	});
});

// Handle app quit properly - but allow updates to proceed

app.on('before-quit', (event) => {
	isQuitting = true;
	// Only prevent quit if update is not in progress
	if (!isUpdateInProgress) {
		// Prevent default quit behavior to allow cleanup
		event.preventDefault();
		// Clean up all windows and processes
		handleCleanupAndQuit();
	} else {
		// Allow quit for updates
		log.info('🔄 Allowing quit for update installation...');
	}
});

// Handle macOS dock quit
app.on('quit', (event, exitCode) => {
	// Only cleanup if update is not in progress
	if (!isUpdateInProgress && (dynamicIslandHelper || windowHelper)) {
		log.info('🔄 Force cleanup on quit event...');
		handleCleanupAndQuit();
	}
});

app.on('window-all-closed', () => {
	// Only cleanup if update is not in progress
	if (!isUpdateInProgress) {
		handleCleanupAndQuit();
	}
});

app.on('will-quit', () => {
	// Unregister all global shortcuts
	try {
		globalShortcut.unregisterAll();
	} catch (error) {
		log.error('Error unregistering global shortcuts:', error);
	}
});

ipcMain.handle('update-overlay-dimensions', async (event, { width, height }) => {
	try {
		if (!windowHelper) {
			return { success: false, error: 'Window helper not initialized' };
		}

		// log.info(`🔧 Updating overlay dimensions to: ${width}x${height}`);
		windowHelper.updateWindowDimensions(width, height);

		return { success: true };
	} catch (error) {
		log.error('❌ Error updating overlay dimensions:', error);
		return { success: false, error: error.message };
	}
});

const handleCleanupAndQuit = () => {
	isQuitting = true;
	cleanupAndQuit({
		dynamicIslandHelper,
		windowHelper,
		mainWindow,
		areYouThereTimer,
		transcriptionDetectionTimer,
	});
};

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

	// Start transcription detection timer alongside the 30-minute timer
	startTranscriptionDetectionTimer();

	// Use setInterval to check every second and show window at 30-minute marks
	areYouThereTimer = setInterval(() => {
		// Check if recording is still active - if not, stop the timer
		if (!isRecordingActive || !recordingStartTime) {
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
			}

			// Show the window
			windowHelper.showAreYouThereWindow();
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

	// Use the same logic as restart function
	startTranscriptionDetectionInterval();
}

function startTranscriptionDetectionInterval() {
	// Check every 5 seconds for transcription activity
	transcriptionDetectionTimer = setInterval(() => {
		// Check if recording is still active - if not, stop the timer
		if (!isRecordingActive || !recordingStartTime) {
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
		// Reset the timer by updating the last transcription time
		lastTranscriptionTime = Date.now();
	}
}

function restartTranscriptionDetectionTimer() {
	// Only restart if recording is active
	if (!isRecordingActive || !recordingStartTime) {
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
			}

			// Show the window
			windowHelper.showAreYouThereWindow();
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
		}
	} catch (error) {
		log.error('❌ Error hiding transcription-based Are You There window:', error);
	}
}

// Handle process exit to ensure cleanup
process.on('exit', (code) => {
	log.info(`Process exiting with code: ${code}`);
});

process.on('SIGINT', () => {
	handleCleanupAndQuit();
});

process.on('SIGTERM', () => {
	handleCleanupAndQuit();
});

// Add global error handler to prevent crashes
process.on('uncaughtException', (error) => {
	log.error('Uncaught Exception:', error);
	// Don't exit the process, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
	log.error('Unhandled Rejection at:', promise, 'reason:', reason);
	// Don't exit the process, just log the error
});
