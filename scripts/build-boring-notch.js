#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');
const boringNotchDir = path.join(projectRoot, 'boring.notch');
const xcodeProject = path.join(boringNotchDir, 'boringNotch.xcodeproj');
const buildDir = path.join(boringNotchDir, 'build');
const builtAppPath = path.join(buildDir, 'Build', 'Products', 'Debug', 'Ve.Ai.app');
const targetAppPath = path.join(buildDir, 'boringNotch.app');

console.log('🚀 Building Boring Notch app...');
console.log('📁 Project:', xcodeProject);

// Check if Xcode project exists
if (!fs.existsSync(xcodeProject)) {
	console.error('❌ Boring Notch Xcode project not found at:', xcodeProject);
	process.exit(1);
}

// Check if running on macOS
if (process.platform !== 'darwin') {
	console.warn('⚠️  Boring Notch can only be built on macOS');
	process.exit(0);
}

try {
	// Build the Xcode project
	console.log('🔨 Building Xcode project (this may take a few minutes)...');
	execSync(
		`xcodebuild -project boringNotch.xcodeproj -scheme boringNotch -configuration Debug -derivedDataPath build clean build CODE_SIGN_IDENTITY="" CODE_SIGN_STYLE=Automatic`,
		{
			cwd: boringNotchDir,
			stdio: 'inherit',
		},
	);

	// Check if build was successful
	if (!fs.existsSync(builtAppPath)) {
		console.error('❌ Build failed: App not found at', builtAppPath);
		process.exit(1);
	}

	// Copy to expected location
	console.log('📦 Copying app to expected location...');

	// Remove old app if it exists
	if (fs.existsSync(targetAppPath)) {
		execSync(`rm -rf "${targetAppPath}"`, { stdio: 'inherit' });
	}

	// Copy the built app
	execSync(`cp -r "${builtAppPath}" "${targetAppPath}"`, { stdio: 'inherit' });

	// Verify the copy
	if (!fs.existsSync(targetAppPath)) {
		console.error('❌ Failed to copy app to:', targetAppPath);
		process.exit(1);
	}

	console.log('✅ Boring Notch app built successfully!');
	console.log('📁 Location:', targetAppPath);
	console.log('');
	console.log('You can now run your Electron app with: npm run dev');
} catch (error) {
	console.error('❌ Build failed:', error.message);
	process.exit(1);
}
