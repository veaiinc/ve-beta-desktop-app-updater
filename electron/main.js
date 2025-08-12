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
