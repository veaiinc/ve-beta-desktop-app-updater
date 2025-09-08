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
    console.log(`⚠️  Skipping NotchDrop native build on ${process.platform}`);
    console.log('   NotchDrop native components only work on macOS');
    process.exit(0);
}

console.log('✅ Running on macOS, building NotchDrop native components...');

try {
    const notchdropDir = path.join(__dirname, '..', 'notchdrop-addon');
    const buildScript = path.join(notchdropDir, 'build.sh');
    
    console.log(`📁 Building in: ${notchdropDir}`);
    console.log(`🔨 Running: ${buildScript}`);
    
    // Change to notchdrop directory and run build script
    process.chdir(notchdropDir);
    execSync('sh build.sh', { stdio: 'inherit' });
    
    console.log('✅ NotchDrop native build completed successfully!');
} catch (error) {
    console.error('❌ NotchDrop native build failed:');
    console.error(error.message);
    process.exit(1);
}
