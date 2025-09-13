const { parentPort, workerData } = require('worker_threads');
const path = require('path');

// Load galleryHelper in worker context
let galleryHelper = null;

try {
	const helperPath = path.join(__dirname, 'galleryHelper.js');
	galleryHelper = require(helperPath);
} catch (error) {
	parentPort.postMessage({
		success: false,
		error: `Failed to load galleryHelper in worker: ${error.message}`,
	});
	return;
}

async function processCompleteImage(fileData, settings) {
	try {
		const { file, fileName } = fileData;

		// Convert file to buffer (this was blocking UI in renderer)
		const imageBuffer = Array.from(new Uint8Array(await file.arrayBuffer()));

		// Extract metadata first
		const metadataResult = await galleryHelper.extractImageMetadata(null, { imageBuffer });
		if (!metadataResult.success) {
			throw new Error('Failed to extract metadata');
		}

		const { width, height, format, originalDateTime } = metadataResult;

		// Process optimized version (WITH watermark)
		const optimizedResult = await galleryHelper.processImageWithSharp(null, {
			imageBuffer,
			watermarkUrl: settings.isWaterMarkApply ? settings.watermarkUrl : null,
			watermarkPosition: settings.watermarkPosition,
			scale: settings.scaleWatermark,
			opacity: settings.watermarkOpacity,
			isWaterMarkApply: settings.isWaterMarkApply,
			resizeOptions: { width: 1200 },
			quality: 85,
			forceJpeg: true,
		});

		if (!optimizedResult.success) {
			throw new Error(optimizedResult.error);
		}

		// Process thumbnail 300w (NO watermark)
		const thumbnailResult = await galleryHelper.processImageWithSharp(null, {
			imageBuffer,
			watermarkUrl: null,
			isWaterMarkApply: false,
			resizeOptions: { width: 300 },
			quality: 70,
			forceJpeg: true,
		});

		if (!thumbnailResult.success) {
			throw new Error(thumbnailResult.error);
		}

		// Process thumbnail 100h (NO watermark, cropped to 100px height)
		const thumbnail100hResult = await galleryHelper.processImageWithSharp(null, {
			imageBuffer,
			watermarkUrl: null,
			isWaterMarkApply: false,
			resizeOptions: { height: 100, fit: 'cover', position: 'center' },
			quality: 70,
			forceJpeg: true,
		});

		if (!thumbnail100hResult.success) {
			throw new Error(thumbnail100hResult.error);
		}

		// Return all processed data
		return {
			success: true,
			fileName,
			originalSize: file.size,
			processedImage: optimizedResult.processedImage,
			thumbnailImage: thumbnailResult.processedImage,
			thumbnail100hImage: thumbnail100hResult.processedImage,
			width,
			height,
			format,
			originalDateTime,
			processedSize: Buffer.from(optimizedResult.processedImage, 'base64').length,
			thumbnailSize: Buffer.from(thumbnailResult.processedImage, 'base64').length,
			thumbnail100hSize: Buffer.from(thumbnail100hResult.processedImage, 'base64').length,
		};
	} catch (error) {
		return {
			success: false,
			fileName: fileData.fileName,
			error: error.message || 'Unknown error in worker',
		};
	}
}

async function processImageInWorker(data) {
	try {
		// Check if this is complete processing or just single image processing
		if (data.settings && data.file) {
			return await processCompleteImage(data, data.settings);
		} else {
			// Fallback to original processing
			const result = await galleryHelper.processImageWithSharp(null, data);
			return result;
		}
	} catch (error) {
		return {
			success: false,
			error: error.message || 'Unknown error in worker',
		};
	}
}

parentPort.on('message', async (task) => {
	const { taskId, data } = task;

	try {
		// Check if data.imageBuffer is an ArrayBuffer (transferred)
		// If it's an array, convert it back to a Buffer for Sharp
		let imageBufferForProcessing;
		if (data.imageBuffer instanceof ArrayBuffer) {
			imageBufferForProcessing = Buffer.from(data.imageBuffer);
		} else if (Array.isArray(data.imageBuffer)) {
			// Fallback for old method (for compatibility)
			imageBufferForProcessing = Buffer.from(data.imageBuffer);
		} else {
			throw new Error('Invalid imageBuffer format');
		}

		// Modify your galleryHelper functions to accept a Buffer directly
		// For example, in galleryHelper.js, the function should start with:
		// if (imageBuffer instanceof Buffer) {
		//     const sharpInstance = sharp(imageBuffer);
		// } else {
		//     // Handle legacy array format
		//     const buffer = Buffer.from(imageBuffer);
		//     const sharpInstance = sharp(buffer);
		// }

		const result = await processImageInWorker({
			...data,
			imageBuffer: imageBufferForProcessing, // Pass the Buffer
		});

		// If the result contains processed images as Buffers, convert them to ArrayBuffers for transfer
		let transferList = [];
		if (result.success) {
			// Convert processed image buffers to ArrayBuffer for zero-copy transfer
			if (result.processedImage instanceof Buffer) {
				result.processedImage = result.processedImage.buffer;
				transferList.push(result.processedImage);
			}
			if (result.thumbnailFile instanceof Buffer) {
				result.thumbnailFile = result.thumbnailFile.buffer;
				transferList.push(result.thumbnailFile);
			}
			if (result.thumbnail100hFile instanceof Buffer) {
				result.thumbnail100hFile = result.thumbnail100hFile.buffer;
				transferList.push(result.thumbnail100hFile);
			}
		}

		parentPort.postMessage(
			{
				taskId,
				...result,
			},
			transferList,
		); // <-- Transfer the ArrayBuffers
	} catch (error) {
		parentPort.postMessage({
			taskId,
			success: false,
			error: error.message || 'Worker crashed',
		});
	}
});
