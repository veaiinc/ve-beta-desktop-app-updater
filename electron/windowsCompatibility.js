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
		
		// Test if Sharp is actually functional
		try {
			const testBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xd9]);
			// Don't await this test - just check if the function exists and can be called
			sharpModule(testBuffer).metadata().catch(() => {
				// If this fails, Sharp is not functional
				log.warn('Sharp module loaded but not functional');
				sharpModule = null;
			});
		} catch (testError) {
			log.warn('Sharp module loaded but test failed:', testError.message);
			sharpModule = null;
		}
		
		return sharpModule;
	} catch (error) {
		log.error('Sharp module not available:', error.message);
		
		// Try alternative loading methods for Windows production
		if (process.platform === 'win32' && process.env.NODE_ENV === 'production') {
			try {
				const path = require('path');
				const fs = require('fs');
				
				// Try loading from extraResources path
				const appPath = process.resourcesPath || process.cwd();
				const sharpPath = path.join(appPath, 'sharp');
				
				if (fs.existsSync(sharpPath)) {
					log.info('🔧 Attempting to load Sharp from extraResources...');
					sharpModule = require(path.join(sharpPath, 'index.js'));
					
					// Test the loaded Sharp module
					try {
						const testBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xd9]);
						sharpModule(testBuffer).metadata().then(() => {
							log.info('✅ Sharp extraResources test passed');
						}).catch((testError) => {
							log.warn('⚠️ Sharp extraResources test failed:', testError.message);
							sharpModule = null;
						});
					} catch (testError) {
						log.warn('⚠️ Sharp extraResources test failed:', testError.message);
						sharpModule = null;
					}
					
					return sharpModule;
				}
				
				// Try loading from @img directory
				const imgPath = path.join(appPath, '@img');
				if (fs.existsSync(imgPath)) {
					log.info('🔧 Attempting to load Sharp from @img directory...');
					const sharpWinPath = path.join(imgPath, 'sharp-win32-x64', 'index.js');
					if (fs.existsSync(sharpWinPath)) {
						sharpModule = require(sharpWinPath);
						return sharpModule;
					}
				}
			} catch (altError) {
				log.warn('⚠️ Alternative Sharp loading failed:', altError.message);
			}
		}
		
		// Don't try to rebuild in production - this can cause issues
		if (process.env.NODE_ENV !== 'production') {
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
		}

		// Return null instead of mock functions - let the calling code handle the fallback
		log.warn('⚠️ Sharp module not available, returning null');
		return null;
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
