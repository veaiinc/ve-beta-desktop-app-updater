#!/usr/bin/env node

/**
 * NotchDrop Addon Build Validation Script
 * Validates build environment and dependencies before building
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for console output
const colors = {
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	reset: '\x1b[0m',
	bold: '\x1b[1m',
};

function log(level, message) {
	const timestamp = new Date().toISOString();
	const color = colors[level] || colors.reset;
	console.log(`${color}[${timestamp}] ${level.toUpperCase()}: ${message}${colors.reset}`);
}

function checkCommand(command, name) {
	try {
		execSync(`which ${command}`, { stdio: 'ignore' });
		log('green', `✅ ${name} is available`);
		return true;
	} catch (error) {
		log('red', `❌ ${name} is not available. Please install ${name}.`);
		return false;
	}
}

function checkSwiftVersion() {
	try {
		const version = execSync('swiftc --version', { encoding: 'utf8' }).trim();
		log('green', `✅ Swift compiler: ${version.split('\n')[0]}`);
		return true;
	} catch (error) {
		log('red', '❌ Swift compiler not available. Please install Xcode and command line tools.');
		return false;
	}
}

function checkMacOSVersion() {
	try {
		const version = execSync('sw_vers -productVersion', { encoding: 'utf8' }).trim();
		const [major, minor] = version.split('.').map(Number);

		if (major >= 11 || (major === 10 && minor >= 15)) {
			log('green', `✅ macOS version: ${version} (supported)`);
			return true;
		} else {
			log('red', `❌ macOS version: ${version} (requires 10.15+ or 11.0+)`);
			return false;
		}
	} catch (error) {
		log('yellow', '⚠️  Could not determine macOS version');
		return true; // Continue anyway
	}
}

function checkNodeVersion() {
	const version = process.version;
	const major = parseInt(version.slice(1).split('.')[0]);

	if (major >= 18) {
		log('green', `✅ Node.js version: ${version} (supported)`);
		return true;
	} else {
		log('red', `❌ Node.js version: ${version} (requires 18.x or higher)`);
		return false;
	}
}

function checkNotchDropFiles() {
	const addonPath = path.join(__dirname, '..', 'notchdrop-addon');
	const requiredFiles = [
		'binding.gyp',
		'index.js',
		'package.json',
		'src/notchdrop_addon.mm',
		'src/NotchDropBridge.m',
		'src/NotchDropCore.swift',
	];

	let allExist = true;

	requiredFiles.forEach((file) => {
		const filePath = path.join(addonPath, file);
		if (fs.existsSync(filePath)) {
			log('green', `✅ Found: ${file}`);
		} else {
			log('red', `❌ Missing: ${file}`);
			allExist = false;
		}
	});

	return allExist;
}

function checkElectronVersion() {
	try {
		const packagePath = path.join(__dirname, '..', 'package.json');
		const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
		const electronVersion = pkg.devDependencies?.electron || 'not found';

		log('green', `✅ Electron version: ${electronVersion}`);
		return true;
	} catch (error) {
		log('red', '❌ Could not determine Electron version');
		return false;
	}
}

function checkBuildArtifacts() {
	const buildPath = path.join(__dirname, '..', 'notchdrop-addon', 'build', 'Release');
	const artifacts = ['notchdrop_addon.node', 'libNotchDropCore.a'];

	let hasArtifacts = true;

	artifacts.forEach((artifact) => {
		const artifactPath = path.join(buildPath, artifact);
		if (fs.existsSync(artifactPath)) {
			const stats = fs.statSync(artifactPath);
			log(
				'green',
				`✅ Found build artifact: ${artifact} (${(stats.size / 1024).toFixed(1)}KB)`,
			);
		} else {
			log('yellow', `⚠️  Build artifact not found: ${artifact} (will be built)`);
			hasArtifacts = false;
		}
	});

	return hasArtifacts;
}

function checkXcodeTools() {
	try {
		const output = execSync('xcode-select -p', { encoding: 'utf8' }).trim();
		log('green', `✅ Xcode command line tools: ${output}`);
		return true;
	} catch (error) {
		log('red', '❌ Xcode command line tools not available. Run: xcode-select --install');
		return false;
	}
}

function main() {
	log('blue', '🔍 Starting NotchDrop addon build validation...\n');

	const checks = [
		{
			name: 'Platform check',
			fn: () =>
				process.platform === 'darwin' ||
				(log('red', '❌ NotchDrop addon only supports macOS'), false),
		},
		{ name: 'Node.js version', fn: checkNodeVersion },
		{ name: 'macOS version', fn: checkMacOSVersion },
		{ name: 'Xcode tools', fn: checkXcodeTools },
		{ name: 'Swift compiler', fn: checkSwiftVersion },
		{ name: 'node-gyp', fn: () => checkCommand('node-gyp', 'node-gyp') },
		{ name: 'Required files', fn: checkNotchDropFiles },
		{ name: 'Electron version', fn: checkElectronVersion },
		{ name: 'Build artifacts', fn: checkBuildArtifacts },
	];

	let allPassed = true;

	checks.forEach((check) => {
		log('blue', `\n📋 Checking: ${check.name}`);
		if (!check.fn()) {
			allPassed = false;
		}
	});

	console.log('\n' + '='.repeat(60));

	if (allPassed) {
		log(
			'green',
			`${colors.bold}✅ All validation checks passed! NotchDrop addon is ready to build.${colors.reset}`,
		);
		process.exit(0);
	} else {
		log(
			'red',
			`${colors.bold}❌ Some validation checks failed. Please fix the issues above before building.${colors.reset}`,
		);
		process.exit(1);
	}
}

if (require.main === module) {
	main();
}

module.exports = { checkNotchDropFiles, checkSwiftVersion, checkMacOSVersion };
