#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');
const boringNotchDir = path.join(projectRoot, 'boring.notch');
const xcodeProject = path.join(boringNotchDir, 'boringNotch.xcodeproj');
const buildDir = path.join(boringNotchDir, 'build');
const targetAppPath = path.join(buildDir, 'boringNotch.app');

// Get build mode from environment or command line args
const buildMode = process.env.BUILD_MODE || process.argv[2] || 'development';
const isProduction = buildMode === 'production';

const builtAppPath = isProduction 
	? path.join(buildDir, 'Build', 'Products', 'Release', 'Ve.Ai.app')
	: path.join(buildDir, 'Build', 'Products', 'Debug', 'Ve.Ai.app');

console.log('🚀 Building Boring Notch app...');
console.log('📁 Project:', xcodeProject);
console.log('🔧 Build Mode:', buildMode);

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

// Function to get available code signing identities
function getAvailableIdentities() {
	try {
		const output = execSync('security find-identity -v -p codesigning', { encoding: 'utf8' });
		const identities = [];
		const lines = output.split('\n');
		
		for (const line of lines) {
			const match = line.match(/^\s*\d+\)\s+([A-F0-9]+)\s+"([^"]+)"/);
			if (match) {
				identities.push({
					hash: match[1],
					name: match[2]
				});
			}
		}
		return identities;
	} catch (error) {
		console.warn('⚠️  Could not retrieve code signing identities:', error.message);
		return [];
	}
}

// Function to determine the best code signing identity
function getCodeSignIdentity(identities) {
	if (isProduction) {
		// For production, look for Developer ID Application certificate
		const devIdApp = identities.find(id => 
			id.name.includes('Developer ID Application') && 
			id.name.includes('VE AI')
		);
		if (devIdApp) {
			return devIdApp.name;
		}
		
		// Fallback to any Developer ID Application
		const anyDevId = identities.find(id => 
			id.name.includes('Developer ID Application')
		);
		if (anyDevId) {
			return anyDevId.name;
		}
	}
	
	// For development, look for Apple Development certificate
	const appleDev = identities.find(id => 
		id.name.includes('Apple Development')
	);
	if (appleDev) {
		return appleDev.name;
	}
	
	// For development, if no Apple Development cert, return null to use automatic signing
	return null;
}

try {
	// Get available code signing identities
	const identities = getAvailableIdentities();
	console.log('🔐 Available code signing identities:');
	identities.forEach(id => console.log(`   - ${id.name}`));
	
	// Determine code signing identity
	const codeSignIdentity = getCodeSignIdentity(identities);
	
	let buildCommand;
	if (isProduction) {
		if (!codeSignIdentity) {
			console.error('❌ No suitable code signing identity found for production');
			console.log('💡 Please ensure you have a Developer ID Application certificate installed');
			process.exit(1);
		}
		console.log('✅ Using code signing identity:', codeSignIdentity);
		// Production build with manual signing
		buildCommand = `xcodebuild -project boringNotch.xcodeproj -scheme boringNotch -configuration Release -derivedDataPath build clean build CODE_SIGN_IDENTITY="${codeSignIdentity}" CODE_SIGN_STYLE=Manual DEVELOPMENT_TEAM=47J296MPWB OTHER_CODE_SIGN_FLAGS="--timestamp --options runtime"`;
	} else {
		// Development build - use Debug configuration and skip code signing
		console.log('🔧 Using Debug configuration for development build (no code signing)');
		buildCommand = `xcodebuild -project boringNotch.xcodeproj -scheme boringNotch -configuration Debug -derivedDataPath build clean build CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO`;
	}
	
	// Build the Xcode project with appropriate signing
	console.log('🔨 Building Xcode project (this may take a few minutes)...');
	
	execSync(buildCommand, {
		cwd: boringNotchDir,
		stdio: 'inherit',
	});

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
