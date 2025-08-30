// windowsCompatibility.js - Windows-specific compatibility fixes
const log = require('electron-log');

// Robust sharp module loader for Windows compatibility
let sharpModule = null;

function loadSharpModule() {
	if (sharpModule) return sharpModule;
	
	try {
		// Try to load sharp normally first
		sharpModule = require('sharp');
		log.info('✅ Sharp module loaded successfully');
		return sharpModule;
	} catch (error) {
		log.warn('⚠️ Sharp module load failed, attempting Windows-specific fix...');
		
		try {
			// Windows-specific fallback - try to rebuild and load
			if (process.platform === 'win32') {
				const { execSync } = require('child_process');
				const path = require('path');
				
				// Try to rebuild sharp for Windows
				log.info('🔧 Rebuilding sharp module for Windows...');
				execSync('npm rebuild sharp', { 
					cwd: path.join(__dirname, '..'),
					stdio: 'pipe'
				});
				
				// Try loading again
				sharpModule = require('sharp');
				log.info('✅ Sharp module rebuilt and loaded successfully for Windows');
				return sharpModule;
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
		return originalFunction(data, sharp);
	} catch (error) {
		log.error('Error in safeProcessImageWithSharp:', error);
		return { success: false, error: 'Image processing not available on this platform' };
	}
}

function safeExtractImageMetadata(data, originalFunction) {
	try {
		const sharp = loadSharpModule();
		return originalFunction(data, sharp);
	} catch (error) {
		log.error('Error in safeExtractImageMetadata:', error);
		return { success: false, error: 'Image metadata extraction not available on this platform' };
	}
}

module.exports = {
	loadSharpModule,
	safeProcessImageWithSharp,
	safeExtractImageMetadata
};
