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
		log.error('Sharp module not available:', error.message);
		log.error('Sharp error details:', error);
		sharpLoaded = true; // Prevent repeated attempts
		return null;
	}
};

// Normalize various incoming buffer-like payloads (ArrayBuffer, Uint8Array, Buffer, base64 string)
const toNodeBuffer = (input) => {
	if (!input) return Buffer.alloc(0);
	if (Buffer.isBuffer(input)) return input;
	// Handle { type: 'Buffer', data: [...] } objects
	if (typeof input === 'object' && input.type === 'Buffer' && Array.isArray(input.data)) {
		return Buffer.from(input.data);
	}
	// Handle ArrayBuffer
	if (typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
		return Buffer.from(new Uint8Array(input));
	}
	// Handle TypedArrays (e.g., Uint8Array)
	if (ArrayBuffer.isView && ArrayBuffer.isView(input)) {
		return Buffer.from(input.buffer, input.byteOffset, input.byteLength);
	}
	// Handle base64-encoded string
	if (typeof input === 'string') {
		try {
			return Buffer.from(input, 'base64');
		} catch (_) {
			return Buffer.from(input);
		}
	}
	// Fallback: try structured clone with JSON (may be slow, last resort)
	try {
		return Buffer.from(input);
	} catch (_) {
		return Buffer.alloc(0);
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
			quality: providedQuality,
			forceJpeg: _forceJpeg, // kept for API parity; we always output JPEG below
		} = data;

		const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2,097,152 — S3 limit
		const MIN_WIDTH = 1200; // Default minimum only for auto-scaling path
		const TARGET_QUALITY = 85; // Fallback/default quality

		const imageData = toNodeBuffer(imageBuffer);

		const metadata = await sharpModule(imageData).metadata();
		if (!metadata.width || !metadata.height) {
			return { success: false, error: 'Invalid image metadata' };
		}

		// Determine if explicit dimensions were provided (width/height/fit/position)
		const explicitWidth =
			typeof resizeOptions.width === 'number' && isFinite(resizeOptions.width)
				? resizeOptions.width
				: null;
		const explicitHeight =
			typeof resizeOptions.height === 'number' && isFinite(resizeOptions.height)
				? resizeOptions.height
				: null;
		const hasExplicitDimensions = explicitWidth !== null || explicitHeight !== null;
		const fitOption = resizeOptions.fit || (explicitHeight ? 'cover' : 'inside');
		const positionOption = resizeOptions.position || 'center';

		// Resolve quality: prefer provided, else fallback
		const resolvedQuality = Math.max(
			10,
			Math.min(95, typeof providedQuality === 'number' ? providedQuality : TARGET_QUALITY),
		);

		// Helper to compose watermark and encode to JPEG with given dimensions
		const processWithDimensions = async (width, height) => {
			let img = sharpModule(imageData);
			if (width || height) {
				img = img.resize({
					width: width || undefined,
					height: height || undefined,
					fit: fitOption,
					position: positionOption,
					withoutEnlargement: true,
				});
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

			// ✅ Respect provided quality (fallback to TARGET_QUALITY)
			return await img
				.jpeg({
					quality: resolvedQuality,
					chromaSubsampling: '4:4:4',
					trellisQuantization: true,
					optimizationMode: 3,
					progressive: true,
					mozjpeg: true,
				})
				.toBuffer();
		};

		// If explicit width/height provided, perform a single pass respecting them
		if (hasExplicitDimensions) {
			const buffer = await processWithDimensions(explicitWidth, explicitHeight);
			return {
				success: true,
				processedImage: buffer.toString('base64'),
				width:
					explicitWidth ||
					Math.floor((metadata.width * (explicitHeight || 0)) / (metadata.height || 1)) ||
					metadata.width,
				height:
					explicitHeight ||
					(explicitWidth
						? Math.floor((metadata.height * explicitWidth) / metadata.width)
						: metadata.height),
				size: buffer.length,
			};
		}

		// Auto-scaling path (legacy): Start with largest allowed width and iterate down if needed
		let currentWidth = Math.min(metadata.width, resizeOptions.maxWidth || metadata.width);

		const processAuto = async (width) => processWithDimensions(width, null);

		// Try from currentWidth downward in steps
		while (currentWidth >= MIN_WIDTH) {
			const buffer = await processAuto(currentWidth);

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
		const finalBuffer = await processAuto(MIN_WIDTH);
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
			error: `Image still exceeds 2MB even at ${MIN_WIDTH}px, quality ${resolvedQuality}`,
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

	const buffer = toNodeBuffer(imageBuffer);
	if (!buffer || buffer.length === 0) {
		log.warn('extractImageMetadata: received empty buffer');
		return {
			success: false,
			width: null,
			height: null,
			format: 'unknown',
			originalDateTime: Math.floor(Date.now() / 1000),
			error: 'Empty image buffer received',
		};
	}

	// Lightweight magic-bytes format detection
	const detectFormat = (buf) => {
		if (buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
			return 'png';
		if (buf.slice(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return 'jpeg';
		if (
			buf.slice(0, 4).toString('ascii') === 'RIFF' &&
			buf.slice(8, 12).toString('ascii') === 'WEBP'
		)
			return 'webp';
		if (
			buf.slice(4, 12).toString('ascii') === 'ftypheic' ||
			buf.slice(4, 12).toString('ascii') === 'ftypheif' ||
			buf.slice(4, 12).toString('ascii') === 'ftypmif1' ||
			buf.slice(4, 12).toString('ascii') === 'ftypheix'
		)
			return 'heic';
		return 'unknown';
	};

	const parseJpegDimensions = (buf) => {
		let offset = 2; // skip SOI
		while (offset < buf.length) {
			if (buf[offset] !== 0xff) break;
			const marker = buf[offset + 1];
			const length = buf.readUInt16BE(offset + 2);
			// SOF0..SOF3, SOF5..SOF7, SOF9..SOF11, SOF13..SOF15
			if (
				(marker >= 0xc0 && marker <= 0xc3) ||
				(marker >= 0xc5 && marker <= 0xc7) ||
				(marker >= 0xc9 && marker <= 0xcb) ||
				(marker >= 0xcd && marker <= 0xcf)
			) {
				const height = buf.readUInt16BE(offset + 5);
				const width = buf.readUInt16BE(offset + 7);
				return { width, height };
			}
			offset += 2 + length;
		}
		return null;
	};

	const parsePngDimensions = (buf) => {
		// IHDR chunk follows the 8-byte signature and a 4-byte length, 4-byte type
		if (buf.length >= 24) {
			const width = buf.readUInt32BE(16);
			const height = buf.readUInt32BE(20);
			return { width, height };
		}
		return null;
	};

	const fmt = detectFormat(buffer);
	log.info(
		`extractImageMetadata: buffer=${buffer.length} bytes, detectedFormat=${fmt}, env=${process.env.NODE_ENV}`,
	);
	try {
		// Test Sharp functionality with a simple operation first
		if (process.env.NODE_ENV === 'production') {
			log.info('Production mode: testing Sharp functionality...');
			try {
				// Test with a minimal valid JPEG buffer
				const testBuffer = Buffer.from([
					0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
					0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
					0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
					0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20,
					0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27,
					0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x01,
					0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01, 0xff, 0xc4, 0x00, 0x14,
					0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
					0x00, 0x08, 0xff, 0xc4, 0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
					0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xda, 0x00, 0x0c, 0x03, 0x01, 0x00, 0x02,
					0x11, 0x03, 0x11, 0x00, 0x3f, 0x00, 0x8a, 0x00, 0x07, 0xff, 0xd9
				]);
				await sharpModule(testBuffer).metadata();
				log.info('Sharp production test passed');
			} catch (testError) {
				log.warn('Sharp production test failed, but continuing with actual image:', testError.message);
			}
		}

		const metadata = await sharpModule(buffer).metadata();
		const { width, height, format } = metadata;

		// Validate metadata
		if (!width || !height || width <= 0 || height <= 0) {
			throw new Error(`Invalid metadata dimensions: ${width}x${height}`);
		}

		let originalDateTime = null;
		if (metadata.exif) {
			try {
				const exifData = exifReader(metadata.exif);
				const dateStr = exifData?.Photo?.DateTimeOriginal;
				if (dateStr) {
					originalDateTime = Math.floor(new Date(dateStr).getTime() / 1000);
				}
			} catch (exifError) {
				log.warn('EXIF parsing failed:', exifError.message);
			}
		}

		if (!originalDateTime) {
			originalDateTime = Math.floor(Date.now() / 1000);
		}

		log.info(`extractImageMetadata: Sharp success - ${width}x${height}, format=${format}`);
		return { success: true, width, height, format, originalDateTime };
	} catch (err) {
		log.warn('Sharp metadata failed, attempting fallback parse:', err?.message || String(err));
		log.warn('Sharp error details:', err);

		let dims = null;
		if (fmt === 'jpeg') dims = parseJpegDimensions(buffer);
		else if (fmt === 'png') dims = parsePngDimensions(buffer);

		if (dims && dims.width && dims.height) {
			log.info(`extractImageMetadata: Fallback success - ${dims.width}x${dims.height}`);
			return {
				success: true,
				width: dims.width,
				height: dims.height,
				format: fmt,
				originalDateTime: Math.floor(Date.now() / 1000),
			};
		}

		if (fmt === 'heic') {
			return {
				success: false,
				width: null,
				height: null,
				format: 'heic',
				originalDateTime: Math.floor(Date.now() / 1000),
				error: 'HEIC/HEIF not supported by Windows sharp build. Please convert to JPEG/PNG.',
			};
		}

		return {
			success: false,
			width: null,
			height: null,
			format: fmt,
			originalDateTime: Math.floor(Date.now() / 1000),
			error: `Failed to extract image metadata: ${err?.message || 'Unknown error'}`,
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
				await fs.promises
					.writeFile(path.join(tempDir, `ERROR_${safeName}.txt`), 'No URL')
					.catch(() => {});
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
						await fs.promises
							.writeFile(
								path.join(tempDir, `ERROR_${safeName}.txt`),
								`Download failed: ${errMsg}`,
							)
							.catch(() => {});
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
