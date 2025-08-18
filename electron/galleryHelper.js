const archiver = require('archiver');
import { dialog } from 'electron';
const { autoUpdater } = require('electron-updater');
const log = require('electron-log'); // Import electron-log
const path = require('node:path');
const sharp = require('sharp'); // Add sharp import
const axios = require('axios'); // Add axios import
const exifReader = require('exif-reader');
const fs = require('fs');
const http = require('http');
const https = require('https');

const keepAliveAgent = {
	http: new http.Agent({ keepAlive: true, maxSockets: 100, maxFreeSockets: 50 }),
	https: new https.Agent({ keepAlive: true, maxSockets: 100, maxFreeSockets: 50 }),
};

const watermarkCache = new Map();

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

export const processImageWithSharp = async (event, data) => {
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
};

export const extractImageMetadata = async (event, { imageBuffer }) => {
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
};

export const downloadAlbumZip = async (
	event,
	{ items, folderName, maxZipSize = 3 * 1024 * 1024 * 1024 },
) => {
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
					timeout: 60000, // Increased timeout for large files
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
};
