// galleryUtils.js
// TODO: PERFORMANCE - Image processing operations could benefit from worker thread optimization
// TODO: PERFORMANCE - Consider implementing image processing queue with priority levels

// Conditional sharp import - only load when needed to prevent Windows crashes
let sharp = null;
let sharpLoaded = false;

const loadSharp = () => {
	if (sharpLoaded) return sharp;

	try {
		sharp = require('sharp');
		sharpLoaded = true;
		return sharp;
	} catch (error) {
		console.warn('Sharp module not available:', error.message);
		return null;
	}
};

const axios = require('axios');
const exifReader = require('exif-reader');
const archiver = require('archiver');
const fs = require('fs');
const { dialog, ipcMain } = require('electron');
const http = require('http');
const https = require('https');
const { PassThrough } = require('stream');
const path = require('path');
const log = require('electron-log');

// Add error handling wrapper
const safeExecute = (fn, fallback) => {
	try {
		return fn();
	} catch (error) {
		log.error('Error in gallery helper:', error);
		return fallback;
	}
};

// ———————————————————————
// 🔧 Shared Utilities
// ———————————————————————

// TODO: PERFORMANCE - HTTP agents should be configured based on system resources
const keepAliveAgent = {
	http: new http.Agent({ keepAlive: true, maxSockets: 100, maxFreeSockets: 50 }),
	https: new https.Agent({ keepAlive: true, maxSockets: 100, maxFreeSockets: 50 }),
};

const sanitizeFilename = (name) => {
	return (
		name
			.replace(/[^a-zA-Z0-9._\-]/g, '_')
			.replace(/\s+/g, '_')
			.substring(0, 200) || 'file.jpg'
	);
};

const streamToPromise = (readable, writable) => {
	return new Promise((resolve, reject) => {
		readable.pipe(writable);
		writable.on('finish', resolve);
		writable.on('error', reject);
		readable.on('error', reject);
	});
};

const watermarkCache = new Map();

// ———————————————————————————————————————
// ✅ 1. Process Image with Sharp
// ———————————————————————————————————————
const processImageWithSharp = async (event, data) => {
	try {
		// Load sharp module when needed
		const sharpModule = loadSharp();
		if (!sharpModule) {
			return { success: false, error: 'Image processing not available on this platform' };
		}

		const {
			imageBuffer,
			watermarkUrl,
			watermarkPosition,
			scale = 0.15,
			opacity = 1,
			isWaterMarkApply,
			resizeOptions = { maxWidth: 1600 },
		} = data;

		const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2,097,152 — S3 limit
		const MIN_WIDTH = 1200; // Don't go below this
		const TARGET_QUALITY = 85; // Max allowed

		let imageData =
			typeof imageBuffer === 'string'
				? Buffer.from(imageBuffer, 'base64')
				: Buffer.from(imageBuffer);

		const metadata = await sharpModule(imageData).metadata();
		if (!metadata.width || !metadata.height) {
			return { success: false, error: 'Invalid image metadata' };
		}

		// Start with largest allowed width
		let currentWidth = Math.min(metadata.width, resizeOptions.maxWidth);

		const processImage = async (width) => {
			let img = sharpModule(imageData);
			if (metadata.width > width) {
				img = img.resize({ width, fit: 'inside', withoutEnlargement: true });
			}

			// Apply watermark if needed
			if (isWaterMarkApply && watermarkUrl) {
				let watermarkBuffer = watermarkCache.get(watermarkUrl);
				if (!watermarkBuffer) {
					const res = await axios.get(watermarkUrl, { responseType: 'arraybuffer' });
					watermarkBuffer = Buffer.from(res.data);
					watermarkCache.set(watermarkUrl, watermarkBuffer);
				}

				const wmMeta = await sharpModule(watermarkBuffer).metadata();
				const wmWidth = Math.floor(width * scale);
				const wmHeight = Math.floor((wmMeta.height / wmMeta.width) * wmWidth);

				const resizedWatermark = await sharpModule(watermarkBuffer)
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

			// ✅ Always use quality 85 — never higher
			return await img
				.jpeg({
					quality: TARGET_QUALITY,
					chromaSubsampling: '4:4:4',
					trellisQuantization: true,
					optimizationMode: 3,
					progressive: true,
					mozjpeg: true,
				})
				.toBuffer();
		};

		// Try from currentWidth downward in steps
		while (currentWidth >= MIN_WIDTH) {
			const buffer = await processImage(currentWidth);

			if (buffer.length <= MAX_SIZE_BYTES) {
				return {
					success: true,
					processedImage: buffer.toString('base64'),
					width: currentWidth,
					height: Math.floor((metadata.height * currentWidth) / metadata.width),
					size: buffer.length,
				};
			}

			// Too big → reduce width
			currentWidth = Math.max(MIN_WIDTH, Math.floor(currentWidth * 0.95)); // shrink by 5%
		}

		// Final try at 1200px
		const finalBuffer = await processImage(MIN_WIDTH);
		if (finalBuffer.length <= MAX_SIZE_BYTES) {
			return {
				success: true,
				processedImage: finalBuffer.toString('base64'),
				width: MIN_WIDTH,
				height: Math.floor((metadata.height * MIN_WIDTH) / metadata.width),
				size: finalBuffer.length,
			};
		}

		// Still too big? This is rare — but possible with huge, complex images
		return {
			success: false,
			error: `Image still exceeds 2MB (${Math.round(
				finalBuffer.length / 1024,
			)} KB) even at 1200px, quality 85`,
		};
	} catch (error) {
		log.error('Image processing error:', error);
		return { success: false, error: error.message };
	}
};

// ———————————————————————————————————————
// ✅ 2. Extract Image Metadata
// ———————————————————————————————————————
const extractImageMetadata = async (event, { imageBuffer }) => {
	// Load sharp module when needed
	const sharpModule = loadSharp();
	if (!sharpModule) {
		return {
			success: false,
			width: null,
			height: null,
			format: 'jpeg',
			originalDateTime: Math.floor(Date.now() / 1000),
			error: 'Image metadata extraction not available on this platform',
		};
	}

	const buffer = Buffer.from(imageBuffer);
	try {
		const metadata = await sharpModule(buffer).metadata();
		const { width, height, format } = metadata;

		let originalDateTime = null;
		if (metadata.exif) {
			const exifData = exifReader(metadata.exif);
			const dateStr = exifData?.Photo?.DateTimeOriginal;
			if (dateStr) {
				originalDateTime = Math.floor(new Date(dateStr).getTime() / 1000);
			}
		}

		if (!originalDateTime) {
			originalDateTime = Math.floor(Date.now() / 1000);
		}

		return { success: true, width, height, format, originalDateTime };
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
};

// ———————————————————————————————————————
// ✅ 3. download-album-zip (Streaming ZIP)
// Fast, low memory — but fragile
// Use when URLs are stable and fast
// ———————————————————————————————————————
const downloadAlbumZip = async (
	event,
	{ items, folderName, maxZipSize = 3 * 1024 * 1024 * 1024 },
) => {
	try {
		const { filePath } = await dialog.showSaveDialog({
			title: 'Save Album ZIP',
			defaultPath: `${folderName}_1.zip`,
			filters: [{ name: 'ZIP Files', extensions: ['zip'] }],
			properties: ['createDirectory'],
		});

		if (!filePath) return { success: false, error: 'User cancelled' };

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
					timeout: 60000,
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

		await archive.finalize();
		await new Promise((resolve, reject) => {
			output.on('close', resolve);
			output.on('error', reject);
		});

		return { success: true, zips: zipsCreated };
	} catch (err) {
		console.error('Streaming ZIP failed:', err);
		return { success: false, error: err.message };
	}
};

// ———————————————————————————————————————
// ✅ 4. create-zip-from-urls (Reliable, with temp files)
// Best for production — handles retries, progress, errors
// ———————————————————————————————————————
const createZipFromUrls = async (
	event,
	{
		items,
		folderName = 'Album',
		maxZipSize = 3 * 1024 * 1024 * 1024,
		sessionId,
		parallelLimit = 50,
	},
) => {
	const sanitize = sanitizeFilename;
	const tempDir = path.join(
		require('electron').app.getPath('temp'),
		`album-download-${sessionId}`,
	);

	try {
		if (!Array.isArray(items) || items.length === 0) {
			return { success: false, error: 'No items to download' };
		}

		fs.mkdirSync(tempDir, { recursive: true });

		const downloadedFiles = [];
		const errors = [];
		const total = items.length;
		let completedDownloads = 0;
		const startTime = Date.now();

		const downloadPromises = items.map(async ({ url, filename }) => {
			const safeName = sanitize(filename || 'unknown.jpg');
			const filePath = path.join(tempDir, safeName);

		if (!url) {
			// ⚡ OPTIMIZATION: Use async file write
			await fs.promises.writeFile(path.join(tempDir, `ERROR_${safeName}.txt`), 'No URL').catch(() => {});
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
						timeout: 60000,
						maxContentLength: Infinity,
						maxBodyLength: Infinity,
						httpAgent: keepAliveAgent.http,
						httpsAgent: keepAliveAgent.https,
						headers: {
							Accept: 'image/webp,image/apng,image/*,*/*',
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'keep-alive',
							Referer: new URL(url).origin + '/',
							'User-Agent':
								'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
						},
						validateStatus: (status) => status < 400,
					});

					const contentType = res.headers['content-type'] || '';
					if (!contentType.startsWith('image/')) {
						throw new Error(`Not an image: ${contentType}`);
					}

			const writer = fs.createWriteStream(filePath);
			await streamToPromise(res.data, writer);

			// ⚡ OPTIMIZATION: Use async file operations
			const stats = await fs.promises.stat(filePath);
			if (stats.size === 0) {
				await fs.promises.unlink(filePath);
				throw new Error('Empty file');
			}

					downloadedFiles.push({ path: filePath, name: safeName });
					completedDownloads++;

					const elapsed = (Date.now() - startTime) / 1000;
					const speed = completedDownloads / elapsed;
					const eta = (total - completedDownloads) / speed;

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
					if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

					const errMsg = err.response
						? `HTTP ${err.response.status}`
						: err.code === 'ECONNABORTED'
						? 'Timeout'
						: err.message;

				if (retry === MAX_RETRIES - 1) {
					// ⚡ OPTIMIZATION: Use async file write
					await fs.promises.writeFile(
						path.join(tempDir, `ERROR_${safeName}.txt`),
						`Download failed: ${errMsg}`,
					).catch(() => {});
					errors.push({ file: safeName, error: errMsg });
				} else {
						const delay = Math.min(2000 * Math.pow(2, retry), 8000);
						await new Promise((r) => setTimeout(r, delay));
					}
				}
			}
		});

		for (let i = 0; i < downloadPromises.length; i += parallelLimit) {
			const chunk = downloadPromises.slice(i, i + parallelLimit);
			await Promise.all(chunk);
		}

		if (downloadedFiles.length === 0) {
			fs.rmSync(tempDir, { recursive: true, force: true });
			return { success: false, error: 'All downloads failed' };
		}

		const { filePath: baseZipPath } = await dialog.showSaveDialog({
			title: `Save Album: ${folderName}`,
			defaultPath: `${folderName}_1.zip`,
			filters: [{ name: 'ZIP Files', extensions: ['zip'] }],
			properties: ['createDirectory'],
		});

		if (!baseZipPath) {
			fs.rmSync(tempDir, { recursive: true, force: true });
			return { success: false, error: 'User cancelled' };
		}

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
		// ⚡ OPTIMIZATION: Use async file stat
		const fileSize = (await fs.promises.stat(filePath)).size;
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

		await new Promise((resolve, reject) => {
			archive.finalize();
			output.on('close', resolve);
			output.on('error', reject);
		});

		fs.rmSync(tempDir, { recursive: true, force: true });

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
		console.error('ZIP creation failed:', err);
		return { success: false, error: err.message };
	}
};

// ———————————————————————
// ✅ Export All
// ———————————————————————
module.exports = {
	processImageWithSharp,
	extractImageMetadata,
	downloadAlbumZip,
	createZipFromUrls,
};
