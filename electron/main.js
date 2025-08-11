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
			scale = 0.15,
			opacity = 1,
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

		if (!metadata.width || !metadata.height) {
			return { success: false, error: 'Invalid image metadata' };
		}

		// Start with high quality and full size
		let targetWidth = Math.min(metadata.width, resizeOptions.maxWidth);
		let targetQuality = quality;

		// Function to encode and optionally apply watermark
		const processImage = async (width, q, applyWatermark = false) => {
			let img = sharp(imageData);

			// Resize
			if (metadata.width > width) {
				img = img.resize({
					width,
					fit: 'inside',
					withoutEnlargement: true,
				});
			}

			// Apply watermark if requested
			if (applyWatermark && watermarkUrl) {
				try {
					const watermarkResponse = await axios.get(watermarkUrl, {
						responseType: 'arraybuffer',
					});
					const watermarkBuffer = Buffer.from(watermarkResponse.data);
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
				} catch (err) {
					log.error('Watermark application error:', err);
					// Continue without watermark if failed
				}
			}

			// Final JPEG encoding
			return await img.jpeg({ quality: q, progressive: true, mozjpeg: true }).toBuffer();
		};

		// Try to produce a compliant image
		let finalBuffer;
		let attempts = 0;
		const maxAttempts = 10; // Prevent infinite loops

		while (attempts < maxAttempts) {
			attempts++;

			// Apply watermark only if enabled
			finalBuffer = await processImage(targetWidth, targetQuality, isWaterMarkApply);

			if (finalBuffer.length <= maxSizeBytes) {
				// Success: within limit
				return {
					success: true,
					processedImage: finalBuffer.toString('base64'),
					width: targetWidth,
					height: Math.floor((metadata.height * targetWidth) / metadata.width),
					size: finalBuffer.length,
				};
			}

			// Still too big — reduce quality or size
			if (targetQuality > 65) {
				targetQuality = Math.max(65, targetQuality - 5); // Drop quality
			} else if (targetWidth > 600) {
				targetWidth = Math.max(600, Math.floor(targetWidth * 0.9)); // Shrink width
			} else {
				// Last resort: force quality down to 50 and width to 600
				targetQuality = 50;
				targetWidth = 600;
			}
		}

		// Final fallback: try one last time at minimal settings
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

		// If still too big, reject
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
