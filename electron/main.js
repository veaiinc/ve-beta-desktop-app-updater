// main.js
const { app, BrowserWindow, Menu } = require('electron');
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
const http = require('http');
const https = require('https');
const { WindowHelper } = require('./helpers/windowHelper.js');
const {
	processImageWithSharp,
	extractImageMetadata,
	downloadAlbumZip,
} = require('./galleryHelper.js');

// Keep-alive agents for better performance
const keepAliveAgent = {
	http: new http.Agent({ keepAlive: true, maxSockets: 50 }),
	https: new https.Agent({ keepAlive: true, maxSockets: 50 }),
};

const {
	checkUpdates,
	updateAvailable,
	updateNotAvailable,
	updateErrorLog,
	updateDownloaded,
} = require('./updateHelper.js');

const { toggleOverlayWindow, updateOverlayDimensions } = require('./overlayWindowHelper.js');

let mainWindow = null;
let deeplinkingUrl;
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

// const activeZips = new Map();

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
app.on('open-url', (event, url) => {
	event.preventDefault();
	log.info('Deep link received:', url);

	// Store globally for later use
	deeplinkingUrl = url;

	if (mainWindow && !mainWindow.isDestroyed()) {
		if (mainWindow.webContents && !mainWindow.webContents.isDestroyed()) {
			mainWindow.webContents.send('protocol-url', url);
		} else {
			log.warn('webContents destroyed, will send on load');
			// It will be sent in dom-ready
		}
	} else {
		log.warn('mainWindow destroyed or missing, recreating...');
		mainWindow = null;
		createWindow();
	}
});

// 🔹 Register protocol handler
app.whenReady().then(() => {
	if (!app.isDefaultProtocolClient('veai')) {
		app.setAsDefaultProtocolClient('veai');
	}
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

// Setup update events and log them
autoUpdater.on('checking-for-update', () => checkUpdates(mainWindow));

autoUpdater.on('update-available', (info) => updateAvailable(info, mainWindow));

autoUpdater.on('update-not-available', (info) => updateNotAvailable(info, mainWindow));

autoUpdater.on('error', (err) => updateErrorLog(err, mainWindow));

autoUpdater.on('update-downloaded', (info) => updateDownloaded(info, mainWindow));

app.whenReady().then(() => {
	// const menu = Menu.buildFromTemplate(template);
	// Menu.setApplicationMenu(menu);
	createWindow();

	// Initialize overlay window helper
	windowHelper = new WindowHelper();

	// Register global shortcuts
	windowHelper.registerGlobalShortcuts(mainWindow);
});

ipcMain.handle('toggle-overlay-window', toggleOverlayWindow);

ipcMain.handle('update-overlay-dimensions', (event, { width, height }) =>
	updateOverlayDimensions(event, { width, height }, windowHelper),
);

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
ipcMain.handle('process-image-with-sharp', processImageWithSharp);

ipcMain.handle('extract-image-metadata', extractImageMetadata);

ipcMain.handle(
	'download-album-zip',
	(event, { items, folderName, maxZipSize = 3 * 1024 * 1024 * 1024 }) =>
		downloadAlbumZip(event, { items, folderName, maxZipSize }),
);

const streamToPromise = (readable, writable) => {
	return new Promise((resolve, reject) => {
		readable.pipe(writable);
		writable.on('finish', resolve);
		writable.on('error', reject);
		readable.on('error', reject);
	});
};

ipcMain.handle(
	'create-zip-from-urls',
	async (
		event,
		{
			items,
			folderName = 'Album',
			maxZipSize = 3 * 1024 * 1024 * 1024,
			sessionId,
			parallelLimit = 50, // Increased from 20 to 50 for better performance
		},
	) => {
		const sanitize = (name) =>
			name
				.replace(/[^a-zA-Z0-9._\-]/g, '_')
				.replace(/\s+/g, '_')
				.substring(0, 200) || 'file.jpg';

		const tempDir = path.join(app.getPath('temp'), `album-download-${sessionId}`);

		try {
			if (!Array.isArray(items) || items.length === 0) {
				return { success: false, error: 'No items to download' };
			}

			// Create temp directory
			fs.mkdirSync(tempDir, { recursive: true });

			const downloadedFiles = [];
			const errors = [];
			const total = items.length;

			// --- PHASE 1: Download all to temp folder (truly parallel) ---
			const startTime = Date.now();
			let completedDownloads = 0;

			// Create all download promises at once for maximum parallelism
			const downloadPromises = items.map(async ({ url, filename }) => {
				const safeName = sanitize(filename || 'unknown.jpg');
				const filePath = path.join(tempDir, safeName);

				if (!url) {
					fs.writeFileSync(path.join(tempDir, `ERROR_${safeName}.txt`), 'No URL');
					errors.push({ file: safeName, error: 'No URL' });
					return;
				}

				const MAX_RETRIES = 3;
				for (let retry = 0; retry < MAX_RETRIES; retry++) {
					try {
						const res = await axios({
							method: 'GET',
							url,
							responseType: 'stream',
							timeout: 60000, // Increased from 3000ms to 60 seconds for large files
							maxContentLength: Infinity,
							maxBodyLength: Infinity,
							httpAgent: keepAliveAgent.http,
							httpsAgent: keepAliveAgent.https,
							headers: {
								Accept: '*/*',
								'Accept-Encoding': 'gzip, deflate, br',
								Connection: 'keep-alive',
								'User-Agent':
									'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
							},
						});

						const writer = fs.createWriteStream(filePath);
						await streamToPromise(res.data, writer);

						downloadedFiles.push({ path: filePath, name: safeName });
						completedDownloads++;

						// Calculate and send progress with speed info
						const elapsed = (Date.now() - startTime) / 1000;
						const speed = completedDownloads / elapsed;
						const remaining = total - completedDownloads;
						const eta = remaining / speed;

						try {
							event.sender.send('download-progress', {
								sessionId,
								current: completedDownloads,
								total,
								phase: 'download',
								speed: Math.round(speed * 10) / 10,
								eta: Math.round(eta),
								elapsed: Math.round(elapsed),
							});
						} catch (e) {}

						return;
					} catch (err) {
						if (retry === MAX_RETRIES - 1) {
							fs.writeFileSync(
								path.join(tempDir, `ERROR_${safeName}.txt`),
								`Download failed: ${err.message}`,
							);
							errors.push({ file: safeName, error: err.message });
						} else {
							// Exponential backoff: 2s, 4s, 8s
							const delay = Math.min(2000 * Math.pow(2, retry), 8000);
							await new Promise((r) => setTimeout(r, delay));
						}
					}
				}
			});

			// Process downloads in chunks to control concurrency
			const chunkSize = parallelLimit;
			for (let i = 0; i < downloadPromises.length; i += chunkSize) {
				const chunk = downloadPromises.slice(i, i + chunkSize);
				await Promise.all(chunk);
			}

			if (downloadedFiles.length === 0) {
				fs.rmSync(tempDir, { recursive: true, force: true });
				return { success: false, error: 'All downloads failed' };
			}

			// --- PHASE 2: Show save dialog ---
			const { filePath: baseZipPath } = await dialog.showSaveDialog({
				browserWindow: BrowserWindow.getFocusedWindow() || null,
				title: `Save Album: ${folderName}`,
				defaultPath: `${folderName}_1.zip`,
				filters: [{ name: 'ZIP Files', extensions: ['zip'] }],
				properties: ['createDirectory'],
			});

			if (!baseZipPath) {
				fs.rmSync(tempDir, { recursive: true, force: true });
				return { success: false, error: 'User cancelled' };
			}

			// --- PHASE 3: Create ZIP from local files ---
			const zipsCreated = [];
			let currentSize = 0;
			let zipIndex = 0;
			let archive, output;

			const startNewArchive = () => {
				if (archive) archive.finalize();
				zipIndex++;
				const zipPath = baseZipPath.replace(/(_\d+)?\.zip$/i, `_${zipIndex}.zip`);
				output = fs.createWriteStream(zipPath);
				archive = archiver('zip', { zlib: { level: 0 }, forceZip64: true });
				archive.pipe(output);
				currentSize = 0;
				zipsCreated.push(path.basename(zipPath));
			};

			startNewArchive();

			for (const { path: filePath, name } of downloadedFiles) {
				const stats = fs.statSync(filePath);
				const fileSize = stats.size;

				if (currentSize > 0 && currentSize + fileSize > maxZipSize) {
					await new Promise((resolve, reject) => {
						archive.finalize();
						output.on('close', resolve);
						output.on('error', reject);
					});
					startNewArchive();
				}

				archive.file(filePath, { name });
				currentSize += fileSize;
			}

			// Finalize last ZIP
			await new Promise((resolve, reject) => {
				archive.finalize();
				output.on('close', resolve);
				output.on('error', reject);
			});

			// Cleanup temp folder
			fs.rmSync(tempDir, { recursive: true, force: true });

			// Send final progress
			try {
				event.sender.send('download-progress', {
					sessionId,
					current: total,
					total,
					phase: 'complete',
					zips: zipsCreated,
				});
			} catch (e) {}

			return { success: true, zips: zipsCreated };
		} catch (err) {
			console.error('Failed:', err);
			return { success: false, error: err.message };
		}
	},
);

// Graceful exit on macOS
app.on('window-all-closed', () => {
	app.quit();
});
