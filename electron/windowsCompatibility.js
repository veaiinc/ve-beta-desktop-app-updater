// windowsCompatibility.js - Windows-specific compatibility fixes
const log = require('electron-log');

// Robust sharp module loader for Windows compatibility
let sharpModule = null;
let sharpLoadAttempted = false;

function loadSharpModule() {
	if (sharpModule) return sharpModule;
	if (sharpLoadAttempted) return null;

	sharpLoadAttempted = true;

	try {
		// Try to load sharp normally first
		sharpModule = require('sharp');
		return sharpModule;
	} catch (error) {
		try {
			// Windows-specific fallback - try to rebuild and load
			if (process.platform === 'win32') {
				const { execSync } = require('child_process');
				const path = require('path');

				// Try to rebuild sharp for Windows
				try {
					execSync('npm rebuild sharp --platform=win32 --arch=x64', {
						cwd: path.join(__dirname, '..'),
						stdio: 'pipe',
					});

					// Try loading again
					sharpModule = require('sharp');
					return sharpModule;
				} catch (rebuildError) {
					log.error('❌ Failed to rebuild sharp module:', rebuildError.message);
				}
			}
		} catch (rebuildError) {
			log.error('❌ Failed to rebuild sharp module:', rebuildError.message);
		}

		// Final fallback - return mock functions
		log.warn('⚠️ Using fallback image processing functions');
		sharpModule = {
			// Mock sharp functions that won't crash the app
			resize: () => Promise.resolve(Buffer.from('')),
			toFormat: () => ({ toBuffer: () => Promise.resolve(Buffer.from('')) }),
			metadata: () => Promise.resolve({}),
			// Add other sharp methods as needed
		};

		return sharpModule;
	}
}

// Safe wrapper functions that use the loaded sharp module
function safeProcessImageWithSharp(data, originalFunction) {
	try {
		const sharp = loadSharpModule();
		if (!sharp) {
			return { success: false, error: 'Image processing not available on this platform' };
		}
		return originalFunction(data, sharp);
	} catch (error) {
		log.error('Error in safeProcessImageWithSharp:', error);
		return { success: false, error: 'Image processing not available on this platform' };
	}
}

function safeExtractImageMetadata(data, originalFunction) {
	try {
		const sharp = loadSharpModule();
		if (!sharp) {
			return {
				success: false,
				width: null,
				height: null,
				format: 'jpeg',
				originalDateTime: Math.floor(Date.now() / 1000),
				error: 'Image metadata extraction not available on this platform',
			};
		}
		return originalFunction(data, sharp);
	} catch (error) {
		log.error('Error in safeExtractImageMetadata:', error);
		return {
			success: false,
			width: null,
			height: null,
			format: 'jpeg',
			originalDateTime: Math.floor(Date.now() / 1000),
			error: 'Image metadata extraction not available on this platform',
		};
	}
}

module.exports = {
	loadSharpModule,
	safeProcessImageWithSharp,
	safeExtractImageMetadata,
};
