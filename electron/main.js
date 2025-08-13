// main.js
const { app, BrowserWindow, Menu, globalShortcut, screen } = require('electron');
const ipcMain = require('electron').ipcMain;
const { autoUpdater } = require('electron-updater');
const log = require('electron-log'); // Import electron-log
const path = require('node:path');
const sharp = require('sharp'); // Add sharp import
const axios = require('axios'); // Add axios import
const exifReader = require('exif-reader');
const archiver = require('archiver');
const fs = require('fs');
const { dialog } = require('electron');

// Add watermark cache for image processing
const watermarkCache = new Map();

// Overlay window helper class

class WindowHelper {
	constructor() {
		this.overlayWindow = null;
		this.isOverlayVisible = false;
		this.windowPosition = { x: 0, y: 0 };
		this.windowSize = { width: 400, height: 150 };
		this.screenWidth = 0;
		this.screenHeight = 0;
		this.step = 0;
		this.currentX = 0;
		this.currentY = 0;
	}

	createOverlayWindow() {
		if (this.overlayWindow !== null) return;

		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;
		this.screenWidth = workArea.width;
		this.screenHeight = workArea.height;

		this.step = Math.floor(this.screenWidth / 10);
		// Position at center top
		this.currentX = Math.floor(this.screenWidth / 2) - Math.floor(this.windowSize.width / 2);
		this.currentY = 30; // Closer to top

		const windowSettings = {
			width: this.windowSize.width,
			height: this.windowSize.height,
			x: this.currentX,
			y: this.currentY,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				preload: path.join(__dirname, 'preload.js'),
			},
			show: false,
			alwaysOnTop: true,
			frame: false,
			transparent: true,
			fullscreenable: false,
			hasShadow: false,
			backgroundColor: '#00000000',
			focusable: true,
			skipTaskbar: true,
			visibleOnAllWorkspaces: true,
			type: 'panel', // Use panel type for better desktop switching behavior
			acceptFirstMouse: true,
			disableAutoHideCursor: true,
		};

		this.overlayWindow = new BrowserWindow(windowSettings);

		const devURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
		const overlayUrl =
			process.env.NODE_ENV === 'development'
				? `${devURL}/overlay.html`
				: `file://${path.join(__dirname, '..', 'build', 'overlay.html')}`;

		this.overlayWindow.loadURL(overlayUrl).catch((err) => {
			log.error('Failed to load overlay URL:', err);
		});

		if (process.platform === 'darwin') {
			// Use the highest window level for maximum visibility during desktop switching
			this.overlayWindow.setAlwaysOnTop(true, 'floating');
			
			// Configure for all workspaces/desktops with fullscreen support
			this.overlayWindow.setVisibleOnAllWorkspaces(true, { 
				visibleOnFullScreen: true,
				skipTransformProcessType: true 
			});
			
			// Hide from Mission Control but keep visible during transitions
			this.overlayWindow.setHiddenInMissionControl(true);
			
			// Start with click-through enabled - will be controlled dynamically
			this.overlayWindow.setIgnoreMouseEvents(true, { forward: true });
			this.overlayWindow.setMovable(true);
		} else {
			// For non-macOS platforms
			this.overlayWindow.setAlwaysOnTop(true, 'floating');
			// Start with click-through enabled - will be controlled dynamically
			this.overlayWindow.setIgnoreMouseEvents(true, { forward: true });
		}

		this.setupWindowListeners();

		const bounds = this.overlayWindow.getBounds();
		this.windowPosition = { x: bounds.x, y: bounds.y };
		this.windowSize = { width: bounds.width, height: bounds.height };
		this.currentX = bounds.x;
		this.currentY = bounds.y;
	}

	setupWindowListeners() {
		if (!this.overlayWindow) return;

		this.overlayWindow.on('move', () => {
			if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
				const bounds = this.overlayWindow.getBounds();
				this.windowPosition = { x: bounds.x, y: bounds.y };
				this.currentX = bounds.x;
				this.currentY = bounds.y;
			}
		});

		this.overlayWindow.on('resize', () => {
			if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
				const bounds = this.overlayWindow.getBounds();
				this.windowSize = { width: bounds.width, height: bounds.height };
			}
		});

		this.overlayWindow.on('closed', () => {
			this.overlayWindow = null;
			this.isOverlayVisible = false;
		});

		// Set up mouse event handling for precise click-through behavior
		this.overlayWindow.webContents.on('dom-ready', () => {
			// Inject JavaScript to handle mouse events more precisely
			this.overlayWindow.webContents.executeJavaScript(`
				let isOverContent = false;
				
				// Function to check if mouse is over actual overlay content
				function isMouseOverContent(x, y) {
					const overlayContent = document.querySelector('.overlay-content, .overlay-container, [data-overlay-content]');
					if (!overlayContent) return false;
					
					const rect = overlayContent.getBoundingClientRect();
					return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
				}
				
				// Handle mouse movement to determine if over content area
				document.addEventListener('mousemove', (e) => {
					const overContent = isMouseOverContent(e.clientX, e.clientY);
					
					if (overContent !== isOverContent) {
						isOverContent = overContent;
						window.electronApi?.setIgnoreMouseEvents?.(!isOverContent);
					}
				});
				
				// Handle mouse entering the window
				document.addEventListener('mouseenter', (e) => {
					const overContent = isMouseOverContent(e.clientX, e.clientY);
					isOverContent = overContent;
					window.electronApi?.setIgnoreMouseEvents?.(!isOverContent);
				});
				
				// Handle mouse leaving the window - always enable click-through
				document.addEventListener('mouseleave', () => {
					isOverContent = false;
					window.electronApi?.setIgnoreMouseEvents?.(true);
				});
				
				// Fallback: check every 100ms if content area has changed
				setInterval(() => {
					const overlayContent = document.querySelector('.overlay-content, .overlay-container, [data-overlay-content]');
					if (overlayContent && !isOverContent) {
						// If we have content but click-through is enabled, check mouse position
						const rect = overlayContent.getBoundingClientRect();
						// This is just a safety check - main logic is in mousemove
					}
				}, 100);
			`);
		});
	}

	getOverlayWindow() {
		return this.overlayWindow;
	}

	isVisible() {
		return this.isOverlayVisible && this.overlayWindow && !this.overlayWindow.isDestroyed();
	}

	hideOverlayWindow() {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
		const bounds = this.overlayWindow.getBounds();
		this.windowPosition = { x: bounds.x, y: bounds.y };
		this.windowSize = { width: bounds.width, height: bounds.height };
		this.overlayWindow.hide();
		this.isOverlayVisible = false;
	}

	showOverlayWindow() {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
		
		// Always position at center top when showing
		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;
		const centerX = Math.floor(workArea.width / 2) - Math.floor(this.windowSize.width / 2);
		const topY = 30;
		
		this.overlayWindow.setBounds({
			x: centerX,
			y: topY,
			width: this.windowSize.width,
			height: this.windowSize.height,
		});
		
		// Ensure window properties for all desktops/spaces on macOS
		if (process.platform === 'darwin') {
			this.overlayWindow.setAlwaysOnTop(true, 'floating');
			this.overlayWindow.setVisibleOnAllWorkspaces(true, { 
				visibleOnFullScreen: true,
				skipTransformProcessType: true 
			});
		} else {
			this.overlayWindow.setAlwaysOnTop(true, 'floating');
		}
		
		// Update current position tracking
		this.currentX = centerX;
		this.currentY = topY;
		this.windowPosition = { x: centerX, y: topY };
		
		// Show overlay and ensure main window is hidden
		this.overlayWindow.show();
		
		if (this.mainWindow && !this.mainWindow.isDestroyed()) {
			this.mainWindow.hide();
		}
		
		this.isOverlayVisible = true;
	}

	toggleOverlayWindow() {
		if (this.isOverlayVisible) {
			this.hideOverlayWindow();
		} else {
			this.showOverlayWindow();
		}
	}

	updateWindowDimensions(width, height) {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
		const { screen } = require('electron');
		const workArea = screen.getPrimaryDisplay().workAreaSize;
		const newWidth = Math.min(width + 32, Math.floor(workArea.width * 0.6));
		const newHeight = Math.ceil(height + 16);
		
		// Keep window centered horizontally at top
		const centerX = Math.floor(workArea.width / 2) - Math.floor(newWidth / 2);
		const topY = 30;
		
		this.overlayWindow.setBounds({ x: centerX, y: topY, width: newWidth, height: newHeight });
		this.windowPosition = { x: centerX, y: topY };
		this.windowSize = { width: newWidth, height: newHeight };
		this.currentX = centerX;
		this.currentY = topY;
	}

	moveWindowLeft() {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
		this.currentX = Math.max(-this.windowSize.width / 2, this.currentX - this.step);
		this.overlayWindow.setPosition(Math.round(this.currentX), Math.round(this.currentY));
	}

	moveWindowRight() {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
		this.currentX = Math.min(
			this.screenWidth - this.windowSize.width / 2,
			this.currentX + this.step,
		);
		this.overlayWindow.setPosition(Math.round(this.currentX), Math.round(this.currentY));
	}

	moveWindowUp() {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
		this.currentY = Math.max(-this.windowSize.height / 2, this.currentY - this.step);
		this.overlayWindow.setPosition(Math.round(this.currentX), Math.round(this.currentY));
	}

	moveWindowDown() {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
		this.currentY = Math.min(
			this.screenHeight - this.windowSize.height / 2,
			this.currentY + this.step,
		);
		this.overlayWindow.setPosition(Math.round(this.currentX), Math.round(this.currentY));
	}

	registerGlobalShortcuts(mainWindow) {
		this.mainWindow = mainWindow;
		
		// Register Cmd+B to toggle overlay window
		globalShortcut.register('CommandOrControl+B', () => {
			log.info('Cmd+B pressed - toggling overlay window');

			// Create overlay window if it doesn't exist
			if (!this.getOverlayWindow()) {
				this.createOverlayWindow();
			}

			const isOverlayVisible = this.isVisible();
			
			if (isOverlayVisible) {
				// Hide overlay and show main window
				this.hideOverlayWindow();
				if (this.mainWindow && !this.mainWindow.isDestroyed()) {
					this.mainWindow.show();
					this.mainWindow.focus();
					this.mainWindow.moveTop(); // Ensure main window is brought to front
				}
			} else {
				// Show overlay (which will automatically hide main window)
				this.showOverlayWindow();
			}
		});

		// Register arrow keys for window movement
		globalShortcut.register('CommandOrControl+Left', () => {
			if (this.isVisible()) this.moveWindowLeft();
		});

		globalShortcut.register('CommandOrControl+Right', () => {
			if (this.isVisible()) this.moveWindowRight();
		});

		globalShortcut.register('CommandOrControl+Up', () => {
			if (this.isVisible()) this.moveWindowUp();
		});

		globalShortcut.register('CommandOrControl+Down', () => {
			if (this.isVisible()) this.moveWindowDown();
		});

		app.on('will-quit', () => globalShortcut.unregisterAll());
		log.info('Global shortcuts registered successfully');
	}
}

let mainWindow = null;
let windowHelper = null;

// Set the autoUpdater logger to electron-log
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info'; // Adjust log level as needed

// Disable console transport to prevent EPIPE errors
log.transports.console = false;

log.info('App started'); // Log app start

let template = [];

// if (process.platform === 'darwin') {
// 	const name = app.getName();
// 	template.unshift({
// 		label: name,
// 		submenu: [
// 			{
// 				label: 'About ' + name,
// 				role: 'about',
// 			},
// 			{
// 				label: 'Quit',
// 				accelerator: 'Command+Q',
// 				click() {
// 					app.quit();
// 				},
// 			},
// 		],
// 	});
// }

const activeZips = new Map(); // Map<sessionId, { output, zip, size, filePath, zipsCreated[] }>

function getActiveZip(sessionId) {
	return activeZips.get(sessionId);
}

function setActiveZip(sessionId, data) {
	activeZips.set(sessionId, data);
}

function removeActiveZip(sessionId) {
	const session = activeZips.get(sessionId);
	if (session && session.output && session.zip) {
		session.zip.finalize(); // Try to close cleanly
	}
	activeZips.delete(sessionId);
}

function createWindow() {
	mainWindow = new BrowserWindow({
		title: 'Main window',
		width: 1366,
		height: 768,
		show: false, // wait to show until ready
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	// Load your front-end
	if (process.env.NODE_ENV === 'development') {
		const devURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
		mainWindow.loadURL(devURL);
	} else {
		mainWindow.loadFile('build/index.html');
	}

	// When content is ready, show the window
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		log.info('Window ready-to-show'); // Log window ready event
	});

	// Check for updates after the app is ready (only in production)
	if (process.env.NODE_ENV !== 'development') {
		autoUpdater.checkForUpdatesAndNotify();
	}
}

// Setup update events and log them
autoUpdater.on('checking-for-update', () => {
	log.info('Checking for updates...');
	if (mainWindow) {
		mainWindow.webContents.send('update-status', { status: 'checking' });
	}
});
autoUpdater.on('update-available', (info) => {
	log.info('Update available, download started:', info);
	if (mainWindow) {
		mainWindow.webContents.send('update-status', {
			status: 'download-started',
			version: info.version,
		});
	}
});
autoUpdater.on('update-not-available', (info) => {
	log.info('Update not available:', info);
	if (mainWindow) {
		mainWindow.webContents.send('update-status', { status: 'not-available' });
	}
});
autoUpdater.on('error', (err) => {
	log.error('Error during update:', err); // Log error
	log.error('Error details:', {
		message: err.message,
		stack: err.stack,
		code: err.code,
		errno: err.errno,
	});
	if (mainWindow) {
		mainWindow.webContents.send('update-status', {
			status: 'error',
			error: err.message,
			details: {
				code: err.code,
				errno: err.errno,
			},
		});
	}
});
// Removed download-progress event handler to avoid showing downloading status

autoUpdater.on('update-downloaded', (info) => {
	log.info('Update download completed:', info); // Log downloaded update
	if (mainWindow) {
		mainWindow.webContents.send('update-status', {
			status: 'download-completed',
			version: info.version,
		});

		// Show notification to user that app will restart
		mainWindow.webContents.send('update-status', {
			status: 'restarting',
			version: info.version,
			message:
				'Update downloaded successfully. The app will restart in 3 seconds to install the new version.',
		});

		// Wait 3 seconds then quit and install
		setTimeout(() => {
			log.info('Quitting app to install update');
			autoUpdater.quitAndInstall();
		}, 3000);
	} else {
		// If mainWindow is not available, quit immediately
		autoUpdater.quitAndInstall();
	}
});

app.whenReady().then(() => {
	// const menu = Menu.buildFromTemplate(template);
	// Menu.setApplicationMenu(menu);
	createWindow();

	// Initialize overlay window helper
	windowHelper = new WindowHelper();

	// Register global shortcuts
	windowHelper.registerGlobalShortcuts(mainWindow);
});

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

ipcMain.handle('set-ignore-mouse-events', async (event, ignore) => {
	try {
		if (!windowHelper || !windowHelper.getOverlayWindow()) {
			return { success: false, error: 'Overlay window not available' };
		}
		const overlayWindow = windowHelper.getOverlayWindow();
		overlayWindow.setIgnoreMouseEvents(ignore, { forward: true });
		return { success: true };
	} catch (error) {
		log.error('Error setting ignore mouse events:', error);
		return { success: false, error: error.message };
	}
});


ipcMain.handle('check-for-updates', async () => {
	log.info('Check for updates triggered by renderer'); // Log triggered update check
	try {
		// Check if we're in development mode
		if (process.env.NODE_ENV === 'development') {
			log.info('Skipping update check in development mode');
			return { success: true, message: 'Update check skipped in development mode' };
		}

		// Just trigger the update check, don't return the result
		// The result will be handled by the autoUpdater events
		await autoUpdater.checkForUpdatesAndNotify();
		return { success: true, message: 'Update check initiated' };
	} catch (error) {
		log.error('Error checking for updates:', error);
		return { success: false, error: error.message };
	}
});

// Add handler for manual download trigger
ipcMain.handle('download-update', async () => {
	log.info('Manual download triggered by renderer');
	try {
		if (process.env.NODE_ENV === 'development') {
			return { success: false, error: 'Download not available in development mode' };
		}

		await autoUpdater.downloadUpdate();
		return { success: true, message: 'Download started' };
	} catch (error) {
		log.error('Error downloading update:', error);
		return { success: false, error: error.message };
	}
});

// Add handler for manual restart after update
ipcMain.handle('restart-app', async () => {
	log.info('Manual restart triggered by renderer');
	try {
		if (process.env.NODE_ENV === 'development') {
			return { success: false, error: 'Restart not available in development mode' };
		}

		// Quit and install the update
		autoUpdater.quitAndInstall();
		return { success: true, message: 'App restarting to install update' };
	} catch (error) {
		log.error('Error restarting app:', error);
		return { success: false, error: error.message };
	}
});

// Image processing handlers
ipcMain.handle('process-image-with-sharp', async (event, data) => {
	try {
		const {
			imageBuffer,
			watermarkUrl,
			watermarkPosition,
			scale = 0.15,
			opacity = 1,
			isWaterMarkApply,
			resizeOptions = { maxWidth: 1000 }, // Reduced from 1200
			quality = 75, // Reduced from 85
		} = data;

		const maxSizeBytes = 2 * 1024 * 1024;
		let imageData =
			typeof imageBuffer === 'string'
				? Buffer.from(imageBuffer, 'base64')
				: Buffer.from(imageBuffer);

		let sharpImage = sharp(imageData);
		const metadata = await sharpImage.metadata();

		if (!metadata.width || !metadata.height) {
			return { success: false, error: 'Invalid image metadata' };
		}

		let targetWidth = Math.min(metadata.width, resizeOptions.maxWidth);
		let targetQuality = quality;

		const processImage = async (width, q, applyWatermark = false) => {
			let img = sharp(imageData);

			if (metadata.width > width) {
				img = img.resize({
					width,
					fit: 'inside',
					withoutEnlargement: true,
				});
			}

			if (applyWatermark && watermarkUrl) {
				let watermarkBuffer = watermarkCache.get(watermarkUrl);
				if (!watermarkBuffer) {
					const watermarkResponse = await axios.get(watermarkUrl, {
						responseType: 'arraybuffer',
					});
					watermarkBuffer = Buffer.from(watermarkResponse.data);
					watermarkCache.set(watermarkUrl, watermarkBuffer); // Cache it
				}

				const wmMeta = await sharp(watermarkBuffer).metadata();
				const wmWidth = Math.floor(width * scale);
				const wmHeight = Math.floor((wmMeta.height / wmMeta.width) * wmWidth);

				const resizedWatermark = await sharp(watermarkBuffer)
					.resize({ width: wmWidth, height: wmHeight })
					.toBuffer();

				const pos =
					watermarkPosition.name === 'northwest'
						? { left: 10, top: 10 }
						: {
								left: width - wmWidth - 10,
								top: Math.floor(
									(metadata.height * width) / metadata.width - wmHeight - 10,
								),
						  };

				img = img.composite([
					{
						input: resizedWatermark,
						left: pos.left,
						top: pos.top,
						blend: 'over',
						opacity,
					},
				]);
			}

			return await img.jpeg({ quality: q, progressive: true, mozjpeg: true }).toBuffer();
		};

		let finalBuffer;
		let attempts = 0;
		const maxAttempts = 10;

		while (attempts < maxAttempts) {
			attempts++;
			finalBuffer = await processImage(targetWidth, targetQuality, isWaterMarkApply);

			if (finalBuffer.length <= maxSizeBytes) {
				return {
					success: true,
					processedImage: finalBuffer.toString('base64'),
					width: targetWidth,
					height: Math.floor((metadata.height * targetWidth) / metadata.width),
					size: finalBuffer.length,
				};
			}

			if (targetQuality > 65) {
				targetQuality = Math.max(65, targetQuality - 5);
			} else if (targetWidth > 600) {
				targetWidth = Math.max(600, Math.floor(targetWidth * 0.9));
			} else {
				targetQuality = 50;
				targetWidth = 600;
			}
		}

		finalBuffer = await processImage(600, 50, isWaterMarkApply);

		if (finalBuffer.length <= maxSizeBytes) {
			return {
				success: true,
				processedImage: finalBuffer.toString('base64'),
				width: 600,
				height: Math.floor((metadata.height * 600) / metadata.width),
				size: finalBuffer.length,
			};
		}

		return {
			success: false,
			error: `Optimized image still exceeds 2MB (${Math.round(
				finalBuffer.length / 1024,
			)} KB) after aggressive compression`,
		};
	} catch (error) {
		log.error('Processing error:', error);
		return { success: false, error: error.message };
	}
});

ipcMain.handle('extract-image-metadata', async (event, { imageBuffer }) => {
	const buffer = Buffer.from(imageBuffer);
	try {
		const metadata = await sharp(buffer).metadata();
		const { width, height, format } = metadata;

		let originalDateTime = null;
		if (metadata.exif) {
			const exifData = exifReader(metadata.exif);
			const dateStr = exifData?.Photo?.DateTimeOriginal;
			if (dateStr) {
				originalDateTime = Math.floor(new Date(dateStr).getTime() / 1000);
			}
		}

		// Fallback to current time if no EXIF
		if (!originalDateTime) {
			originalDateTime = Math.floor(Date.now() / 1000);
		}

		return { success: true, metadata, width, height, format, originalDateTime };
	} catch (err) {
		log.error('Metadata extraction failed:', err);
		return {
			success: false,
			width: null,
			height: null,
			format: 'jpeg',
			originalDateTime: Math.floor(Date.now() / 1000),
		};
	}
});

ipcMain.handle(
	'download-album-zip',
	async (event, { items, folderName, maxZipSize = 3 * 1024 * 1024 * 1024 }) => {
		try {
			// ✅ Open dialog without requiring a focused window
			const { filePath } = await dialog.showSaveDialog({
				title: 'Save Album ZIP',
				defaultPath: `${folderName}_1.zip`,
				filters: [{ name: 'ZIP Files', extensions: ['zip'] }],
				properties: ['createDirectory'],
			});

			if (!filePath) {
				return { success: false, error: 'User cancelled' };
			}

			let archive, output;
			let currentSize = 0;
			let zipIndex = 0;
			const zipsCreated = [];

			const startNewArchive = () => {
				if (archive) archive.finalize();

				zipIndex++;
				const zipPath = filePath.replace(/(_\d+)?\.zip$/, `_${zipIndex}.zip`);
				output = fs.createWriteStream(zipPath);
				archive = archiver('zip', { zlib: { level: 6 } });
				archive.pipe(output);
				currentSize = 0;

				zipsCreated.push(path.basename(zipPath));
			};

			startNewArchive();

			for (const item of items) {
				try {
					const res = await axios({
						method: 'GET',
						url: item.url,
						responseType: 'stream',
						timeout: 30000,
					});

					const fileSize = parseInt(res.headers['content-length'], 10) || 0;

					if (currentSize + fileSize > maxZipSize && currentSize > 0) {
						await archive.finalize();
						await new Promise((resolve, reject) => {
							output.on('close', resolve);
							output.on('error', reject);
						});
						startNewArchive();
					}

					archive.append(res.data, { name: item.filename });
					currentSize += fileSize;
				} catch (err) {
					log.warn(`Failed to add ${item.filename}:`, err.message);
					archive.append(`Download failed: ${err.message}`, {
						name: `ERROR_${item.filename}.txt`,
					});
				}
			}

			// Finalize last archive
			await archive.finalize();
			await new Promise((resolve, reject) => {
				output.on('close', resolve);
				output.on('error', reject);
			});

			return {
				success: true,
				zips: zipsCreated,
			};
		} catch (err) {
			log.error('ZIP creation failed:', err);
			return { success: false, error: err.message };
		}
	},
);

ipcMain.handle(
	'create-zip-from-urls',
	async (
		event,
		{ items, folderName, maxZipSize = 3 * 1024 * 1024 * 1024, sessionId, isFinalBatch = false },
	) => {
		const sanitizeFilename = (filename) => {
			return (
				filename
					.replace(/[^a-zA-Z0-9._\-]/g, '_')
					.replace(/\s+/g, '_')
					.substring(0, 200) || 'unknown.jpg'
			);
		};

		const finalizeZip = (session) => {
			return new Promise((resolve) => {
				if (!session.output) return resolve();

				session.output.on('close', () => {
					resolve();
				});

				session.zip.on('error', (err) => {
					console.error('Archiver error:', err);
					resolve();
				});

				session.zip.finalize();
			});
		};

		try {
			let session = getActiveZip(sessionId);

			// 🟢 First batch: initialize
			if (!session) {
				const { filePath } = await dialog.showSaveDialog({
					title: `Save Original Images: ${folderName}`,
					defaultPath: `${folderName}_1.zip`,
					filters: [{ name: 'ZIP Files', extensions: ['zip'] }],
					properties: ['createDirectory'],
				});

				if (!filePath) {
					return { success: false, error: 'User cancelled' };
				}

				const output = fs.createWriteStream(filePath);
				const zip = archiver('zip', { zlib: { level: 9 } });
				zip.pipe(output);

				session = {
					output,
					zip,
					size: 0,
					filePath,
					zipsCreated: [path.basename(filePath)],
					firstFilePath: filePath,
				};
				setActiveZip(sessionId, session);
			}

			// Process each item
			for (const item of items) {
				const { url, filename } = item;
				const safeName = sanitizeFilename(filename);

				if (!url) {
					session.zip.append(`No URL provided`, { name: `ERROR_${safeName}.txt` });
					continue;
				}

				try {
					const res = await axios({
						method: 'GET',
						url,
						responseType: 'stream',
						timeout: 30000,
						headers: { 'User-Agent': 'Electron-Album-Downloader' },
					});

					if (res.status !== 200) throw new Error(`HTTP ${res.status}`);

					const fileSize = parseInt(res.headers['content-length'], 10) || 0;

					// 🟡 Check if adding this file would exceed limit
					if (fileSize > 0 && session.size + fileSize > maxZipSize) {
						await finalizeZip(session);

						// 🔴 Start new ZIP
						const newFilePath = session.firstFilePath.replace(
							/(_\d+)?(\.zip)$/i,
							`_${session.zipsCreated.length + 1}$2`,
						);
						const newOutput = fs.createWriteStream(newFilePath);
						const newZip = archiver('zip', { zlib: { level: 9 } });
						newZip.pipe(newOutput);

						// Update session
						session.output = newOutput;
						session.zip = newZip;
						session.size = 0;
						session.filePath = newFilePath;
						session.zipsCreated.push(path.basename(newFilePath));
					}

					session.zip.append(res.data, { name: safeName });
					session.size += fileSize;

					await new Promise((resolve, reject) => {
						res.data.on('end', resolve);
						res.data.on('error', reject);
					});
				} catch (err) {
					session.zip.append(`Error: ${err.message}`, { name: `ERROR_${safeName}.txt` });
				}
			}

			// 🟢 Final batch: finalize
			if (isFinalBatch) {
				await finalizeZip(session);
				removeActiveZip(sessionId);
			}

			return {
				success: true,
				zips: session.zipsCreated,
			};
		} catch (error) {
			console.error('ZIP error:', error);
			removeActiveZip(sessionId);
			return {
				success: false,
				error: error.message,
			};
		}
	},
);

// Graceful exit on macOS
app.on('window-all-closed', () => {
	app.quit();
});
