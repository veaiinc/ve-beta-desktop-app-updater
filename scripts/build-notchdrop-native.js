#!/usr/bin/env node

/**
 * Cross-platform NotchDrop native build script
 * Only builds on macOS, skips on other platforms
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 NotchDrop Native Build Script');
console.log('================================');

// Check if we're on macOS
if (process.platform !== 'darwin') {
	process.exit(0);
}

try {
	const notchdropDir = path.join(__dirname, '..', 'notchdrop-addon');
	const buildScript = path.join(notchdropDir, 'build.sh');

	// Change to notchdrop directory and run build script
	process.chdir(notchdropDir);
	execSync('sh build.sh', { stdio: 'inherit' });
} catch (error) {
	console.error('❌ NotchDrop native build failed:');
	console.error(error.message);
	process.exit(1);
}
