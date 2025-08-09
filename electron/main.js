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

let mainWindow = null;

// Set the autoUpdater logger to electron-log
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info'; // Adjust log level as needed
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
	if (process.env.VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
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
			scale,
			opacity,
			isWaterMarkApply,
			resizeOptions = { maxWidth: 1200 },
			quality = 85,
		} = data;

		const maxSizeBytes = 2 * 1024 * 1024; // 2MB limit
		let imageData =
			typeof imageBuffer === 'string'
				? Buffer.from(imageBuffer, 'base64')
				: Buffer.from(imageBuffer);

		let sharpImage = sharp(imageData);
		const metadata = await sharpImage.metadata();

		let targetWidth = Math.min(metadata.width, resizeOptions.maxWidth);
		let targetQuality = quality;
		let optimizedBuffer;

		// Function to encode with given width & quality
		const encodeImage = async (width, q) => {
			let img = sharp(imageData);

			if (metadata.width > width) {
				img = img.resize({
					width,
					fit: 'inside',
					withoutEnlargement: true,
				});
			}

			return await img
				.jpeg({
					quality: q,
					progressive: true,
					mozjpeg: true,
				})
				.toBuffer();
		};

		// First encode
		optimizedBuffer = await encodeImage(targetWidth, targetQuality);

		let attempts = 0; // limit to 3 adjustments total

		// STEP 1: Lower quality until size fits or hits 65
		while (optimizedBuffer.length > maxSizeBytes && targetQuality > 65 && attempts < 3) {
			attempts++;
			targetQuality -= 5;
			optimizedBuffer = await encodeImage(targetWidth, targetQuality);
		}

		// STEP 2: If still too big, start reducing width in 10% steps
		while (optimizedBuffer.length > maxSizeBytes && targetWidth > 600 && attempts < 3) {
			attempts++;
			targetWidth = Math.floor(targetWidth * 0.9);
			optimizedBuffer = await encodeImage(targetWidth, targetQuality);
		}

		// Apply watermark if enabled
		if (isWaterMarkApply && watermarkUrl) {
			try {
				const watermarkResponse = await axios.get(watermarkUrl, {
					responseType: 'arraybuffer',
				});
				const watermarkBuffer = Buffer.from(watermarkResponse.data);
				const watermarkMetadata = await sharp(watermarkBuffer).metadata();

				const watermarkWidth = Math.floor(targetWidth * scale);
				const watermarkHeight = Math.floor(
					(watermarkMetadata.height / watermarkMetadata.width) * watermarkWidth,
				);

				const resizedWatermark = await sharp(watermarkBuffer)
					.resize({ width: watermarkWidth, height: watermarkHeight })
					.toBuffer();

				let position = { top: 0, left: 0 };
				const offset = 10;
				if (watermarkPosition.name === 'southeast') {
					position = {
						left: targetWidth - watermarkWidth - offset,
						top: Math.floor(
							(metadata.height * targetWidth) / metadata.width -
								watermarkHeight -
								offset,
						),
					};
				} else if (watermarkPosition.name === 'northwest') {
					position = { left: offset, top: offset };
				}

				optimizedBuffer = await sharp(optimizedBuffer)
					.composite([
						{
							input: resizedWatermark,
							top: position.top,
							left: position.left,
							blend: 'over',
							opacity,
						},
					])
					.jpeg({ quality: targetQuality, progressive: true, mozjpeg: true })
					.toBuffer();
			} catch (err) {
				log.error('Watermark error:', err);
			}
		}

		return {
			success: true,
			processedImage: optimizedBuffer.toString('base64'),
			width: targetWidth,
			height: Math.floor((metadata.height * targetWidth) / metadata.width),
			size: optimizedBuffer.length,
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
		console.error('Metadata extraction failed:', err);
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
				console.log(`Created ZIP: ${zipPath}`);
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
					console.warn(`Failed to add ${item.filename}:`, err.message);
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
			console.error('ZIP creation failed:', err);
			return { success: false, error: err.message };
		}
	},
);
// Graceful exit on macOS
app.on('window-all-closed', () => {
	app.quit();
});
