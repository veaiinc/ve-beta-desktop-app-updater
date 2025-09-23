#!/usr/bin/env node

/**
 * Script to trigger GitHub Actions release workflows
 * Usage: node scripts/trigger-release.js [patch|minor|major|quick|test]
 */

/* eslint-env node */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);
const releaseType = args[0] || 'patch';

// Validate release type
const validTypes = ['patch', 'minor', 'major', 'quick', 'test'];
if (!validTypes.includes(releaseType)) {
	console.error(`❌ Invalid release type: ${releaseType}`);
	console.error(`Valid types: ${validTypes.join(', ')}`);
	process.exit(1);
}

// Get current version
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentVersion = packageJson.version;

console.log(`🚀 Triggering ${releaseType} release from version ${currentVersion}`);

try {
	if (releaseType === 'test') {
		// Trigger test build
		console.log('🧪 Triggering test build workflow...');
		execSync(`gh workflow run test-build.yml --field platform=all`, { stdio: 'inherit' });
		console.log('✅ Test build workflow triggered!');
		console.log('📊 Check the Actions tab to monitor progress');
	} else if (releaseType === 'quick') {
		// Trigger quick release
		console.log('⚡ Triggering quick release workflow...');
		execSync(`gh workflow run quick-release.yml`, { stdio: 'inherit' });
		console.log('✅ Quick release workflow triggered!');
		console.log('📊 Check the Actions tab to monitor progress');
	} else {
		// Trigger full release with version type
		console.log(`📦 Triggering automated release workflow (${releaseType})...`);
		execSync(`gh workflow run auto-release.yml --field version_type=${releaseType}`, {
			stdio: 'inherit',
		});
		console.log('✅ Automated release workflow triggered!');
		console.log('📊 Check the Actions tab to monitor progress');
	}

	console.log(
		'\n🔗 Monitor progress at: https://github.com/veaiinc/ve-desktop-app-updater/actions',
	);
} catch (error) {
	console.error('❌ Failed to trigger workflow:', error.message);
	console.error('\n💡 Make sure you have:');
	console.error('   - GitHub CLI installed (gh)');
	console.error('   - Authenticated with GitHub (gh auth login)');
	console.error('   - Push access to the repository');
	process.exit(1);
}
