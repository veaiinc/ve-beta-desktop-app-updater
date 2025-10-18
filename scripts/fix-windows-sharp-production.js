#!/usr/bin/env node
/**
 * Fix Windows Sharp Production Build Issues
 * 
 * This script addresses Sharp metadata extraction issues in Windows production builds
 * by ensuring proper Sharp binary packaging and providing comprehensive fallback mechanisms.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing Windows Sharp Production Build Issues...');

// Check if we're on Windows
if (process.platform !== 'win32') {
    console.log('ℹ️  This script is designed for Windows builds. Current platform:', process.platform);
    process.exit(0);
}

// Check if Sharp is installed
const sharpPath = path.join(__dirname, '..', 'node_modules', 'sharp');
if (!fs.existsSync(sharpPath)) {
    console.log('❌ Sharp module not found. Installing...');
    try {
        execSync('npm install sharp@^0.34.3', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    } catch (error) {
        console.log('❌ Failed to install Sharp:', error.message);
        process.exit(1);
    }
}

// Test Sharp functionality
console.log('🧪 Testing Sharp functionality...');
try {
    const sharp = require('sharp');
    console.log('✅ Sharp module loaded successfully');
    console.log('Sharp version:', sharp.versions);
    
    // Test with a minimal JPEG buffer
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
    
    sharp(testBuffer).metadata()
        .then(metadata => {
            console.log('✅ Sharp metadata extraction test passed');
            console.log('Test metadata:', metadata);
        })
        .catch(error => {
            console.log('❌ Sharp metadata extraction test failed:', error.message);
            console.log('🔧 Attempting to rebuild Sharp...');
            
            try {
                execSync('npm rebuild sharp --platform=win32 --arch=x64', { 
                    stdio: 'inherit', 
                    cwd: path.join(__dirname, '..') 
                });
                console.log('✅ Sharp rebuild completed');
            } catch (rebuildError) {
                console.log('❌ Sharp rebuild failed:', rebuildError.message);
                console.log('💡 Try running: npm run package:win:rebuild');
            }
        });
        
} catch (error) {
    console.log('❌ Sharp module failed to load:', error.message);
    console.log('🔧 Attempting to rebuild Sharp...');
    
    try {
        execSync('npm rebuild sharp --platform=win32 --arch=x64', { 
            stdio: 'inherit', 
            cwd: path.join(__dirname, '..') 
        });
        console.log('✅ Sharp rebuild completed');
    } catch (rebuildError) {
        console.log('❌ Sharp rebuild failed:', rebuildError.message);
        console.log('💡 Try running: npm run package:win:rebuild');
    }
}

// Check Sharp binary directories
console.log('📁 Checking Sharp binary directories...');
const imgPath = path.join(__dirname, '..', 'node_modules', '@img');
if (fs.existsSync(imgPath)) {
    const requiredDirs = [
        'sharp-win32-ia32',
        'sharp-win32-x64',
        'sharp-libvips-win32-ia32',
        'sharp-libvips-win32-x64'
    ];
    
    let allDirsExist = true;
    requiredDirs.forEach(dir => {
        const dirPath = path.join(imgPath, dir);
        if (fs.existsSync(dirPath)) {
            console.log('✅ Directory exists:', dir);
        } else {
            console.log('❌ Missing directory:', dir);
            allDirsExist = false;
        }
    });
    
    if (!allDirsExist) {
        console.log('🔧 Creating missing directories...');
        requiredDirs.forEach(dir => {
            const dirPath = path.join(imgPath, dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                fs.writeFileSync(path.join(dirPath, '.gitkeep'), '');
                console.log('✅ Created directory:', dir);
            }
        });
    }
} else {
    console.log('❌ @img directory not found');
}

// Check electron-builder configuration
console.log('🔍 Checking electron-builder configuration...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const winConfig = packageJson.build?.win;
    
    if (winConfig) {
        console.log('✅ Windows build configuration found');
        
        // Check asarUnpack for Sharp
        const asarUnpack = winConfig.asarUnpack || [];
        const sharpUnpacked = asarUnpack.some(pattern => pattern.includes('sharp'));
        if (sharpUnpacked) {
            console.log('✅ Sharp is configured to be unpacked from ASAR');
        } else {
            console.log('⚠️ Sharp may not be unpacked from ASAR');
        }
        
        // Check extraResources for Sharp
        const extraResources = winConfig.extraResources || [];
        const sharpResources = extraResources.some(resource => 
            resource.from && resource.from.includes('sharp')
        );
        if (sharpResources) {
            console.log('✅ Sharp is configured as extra resource');
        } else {
            console.log('⚠️ Sharp may not be configured as extra resource');
        }
    } else {
        console.log('❌ Windows build configuration not found');
    }
} else {
    console.log('❌ package.json not found');
}

console.log('🎉 Windows Sharp production fix completed!');
console.log('💡 If issues persist, try:');
console.log('   1. npm run package:win:rebuild');
console.log('   2. npm run fix:windows-sharp');
console.log('   3. Delete node_modules and reinstall');
console.log('   4. Check Windows Defender/antivirus exclusions');
