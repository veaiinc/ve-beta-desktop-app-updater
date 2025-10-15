const { spawn, exec } = require('child_process');
const path = require('path');
const log = require('electron-log');

class BoringNotchService {
	constructor() {
		this.boringNotchProcess = null;
		this.isInitialized = false;
		this.mainWindow = null;
		this.mainWindowFactory = null;
		this.stealthModeController = null;
	}

	setMainWindow(window) {
		this.mainWindow = window;
	}

	setMainWindowFactory(factory) {
		this.mainWindowFactory = factory;
	}

	setStealthModeController(controller) {
		this.stealthModeController = controller;
	}

	async initialize() {
		try {
			log.info('🚀 Initializing Boring Notch service...');
			
			// Get the path to the boring.notch app
			let boringNotchPath = this.getBoringNotchPath();
			
			// If not found in expected locations, try to find it in the system
			if (!boringNotchPath) {
				log.info('🔍 Boring Notch not found in expected locations, searching system...');
				boringNotchPath = await this.findBoringNotchInSystem();
			}
			
			if (!boringNotchPath) {
				log.error('❌ Boring Notch app not found in any location');
				log.error('❌ Please ensure Boring Notch is built and available');
				throw new Error('Boring Notch app not found. Please run "npm run build:boring-notch" to build it.');
			}

			// Launch the boring.notch app
			await this.launchBoringNotch(boringNotchPath);
			
			this.isInitialized = true;
			log.info('✅ Boring Notch service initialized successfully');
			
			return true;
		} catch (error) {
			log.error('❌ Failed to initialize Boring Notch service:', error);
			return false;
		}
	}

	getBoringNotchPath() {
		const fs = require('fs');
		
		// Determine if we're in development or production
		const isDevelopment = process.env.NODE_ENV === 'development' || 
			(__dirname.includes('dist-electron') === false && __dirname.includes('node_modules') === false);
		
		log.info('🔍 Boring Notch path resolution - Development mode:', isDevelopment);
		log.info('🔍 Current __dirname:', __dirname);
		
		// Try to find the boring.notch app
		const possiblePaths = [];
		
		if (isDevelopment) {
			// Development paths
			possiblePaths.push(
				// Primary development path
				path.join(__dirname, '..', '..', 'boring.notch', 'build', 'boringNotch.app'),
				// Alternative development path (nested structure)
				path.join(__dirname, '..', '..', 'boring.notch', 'boring.notch', 'build', 'boringNotch.app'),
				// Fallback development path
				path.join(__dirname, '..', '..', 'boring.notch', 'boringNotch.app')
			);
		} else {
			// Production paths - when app is packaged
			// In production, extraResources are copied to the app bundle
			const appPath = process.resourcesPath || path.join(__dirname, '..', '..', '..');
			possiblePaths.push(
				// Primary production path (extraResources location)
				path.join(appPath, 'boringNotch.app'),
				// Alternative production paths
				path.join(__dirname, '..', '..', '..', 'boringNotch.app'),
				path.join(__dirname, '..', '..', 'boringNotch.app'),
				// Fallback to development paths in case of edge cases
				path.join(__dirname, '..', '..', 'boring.notch', 'build', 'boringNotch.app')
			);
		}

		log.info('🔍 Checking paths for Boring Notch:');
		for (let i = 0; i < possiblePaths.length; i++) {
			const possiblePath = possiblePaths[i];
			const exists = fs.existsSync(possiblePath);
			log.info(`  Path ${i + 1}: ${possiblePath}`);
			log.info(`  Exists: ${exists}`);
			
			if (exists) {
				log.info('✅ Found Boring Notch at:', possiblePath);
				return possiblePath;
			}
		}

		log.warn('⚠️ Boring Notch app not found in any expected location');
		return null;
	}

	findBoringNotchInSystem() {
		return new Promise((resolve) => {
			// Try to find boring.notch in Applications folder
			exec('find /Applications -name "*boring*" -type d 2>/dev/null', (error, stdout) => {
				if (!error && stdout.trim()) {
					const apps = stdout.trim().split('\n');
					const boringApp = apps.find(app => app.includes('boring') && app.endsWith('.app'));
					if (boringApp) {
						log.info('📁 Found Boring Notch in Applications:', boringApp);
						resolve(boringApp);
						return;
					}
				}
				
				// Try to find using mdfind (Spotlight search)
				exec('mdfind "kMDItemDisplayName == \'*boring*\'" 2>/dev/null', (error, stdout) => {
					if (!error && stdout.trim()) {
						const results = stdout.trim().split('\n');
						const boringApp = results.find(result => result.includes('boring') && result.endsWith('.app'));
						if (boringApp) {
							log.info('📁 Found Boring Notch via Spotlight:', boringApp);
							resolve(boringApp);
							return;
						}
					}
					
					log.warn('⚠️ Boring Notch app not found in system');
					resolve(null);
				});
			});
		});
	}

	async launchBoringNotch(appPath) {
		return new Promise((resolve, reject) => {
			try {
				log.info('🚀 Launching Boring Notch app from:', appPath);
				
				// Check if it's an Xcode project or a built app
				if (appPath.endsWith('.xcodeproj')) {
					// For development - build and run the Xcode project
					this.buildAndRunXcodeProject(appPath)
						.then(resolve)
						.catch(reject);
				} else if (appPath.endsWith('.app')) {
					// For production - launch the built app
					this.launchBuiltApp(appPath)
						.then(resolve)
						.catch(reject);
				} else {
					reject(new Error('Invalid app path format'));
				}
			} catch (error) {
				reject(error);
			}
		});
	}

	async buildAndRunXcodeProject(projectPath) {
		return new Promise((resolve, reject) => {
			log.info('🔨 Building and running Xcode project...');
			
			// Use xcodebuild to build and run the project
			const buildCommand = `cd "${path.dirname(projectPath)}" && xcodebuild -project boringNotch.xcodeproj -scheme boringNotch -configuration Debug build && open -a boringNotch`;
			
			exec(buildCommand, (error, stdout, stderr) => {
				if (error) {
					log.error('❌ Failed to build/run Xcode project:', error);
					reject(error);
					return;
				}
				
				log.info('✅ Boring Notch Xcode project built and launched successfully');
				log.info('Build output:', stdout);
				
				// Store the process reference (though we can't directly control the built app)
				this.boringNotchProcess = { type: 'xcode-built', path: projectPath };
				resolve();
			});
		});
	}

	async launchBuiltApp(appPath) {
		return new Promise((resolve, reject) => {
			log.info('🚀 Launching built Boring Notch app...');
			
			// Use 'open' command to launch the .app bundle
			const launchCommand = `open "${appPath}"`;
			
			exec(launchCommand, (error, stdout, stderr) => {
				if (error) {
					log.error('❌ Failed to launch built app:', error);
					reject(error);
					return;
				}
				
				log.info('✅ Boring Notch app launched successfully');
				
				// Store the process reference
				this.boringNotchProcess = { type: 'built-app', path: appPath };
				resolve();
			});
		});
	}

	async cleanup() {
		try {
			log.info('🧹 Cleaning up Boring Notch service...');
			
			if (this.boringNotchProcess) {
				await this.terminateBoringNotch();
			}
			
			this.isInitialized = false;
			this.boringNotchProcess = null;
			
			log.info('✅ Boring Notch service cleaned up successfully');
		} catch (error) {
			log.error('❌ Error cleaning up Boring Notch service:', error);
		}
	}

	// 🚨 CRITICAL FIX: Add terminate method for proper app termination
	async terminate() {
		try {
			log.info('🛑 Terminating Boring Notch app...');
			
			if (this.boringNotchProcess) {
				await this.terminateBoringNotch();
			}
			
			// Also cleanup after termination
			await this.cleanup();
			
			log.info('✅ Boring Notch app terminated successfully');
		} catch (error) {
			log.error('❌ Error terminating Boring Notch app:', error);
			// Still cleanup even if termination fails
			await this.cleanup();
		}
	}

	async terminateBoringNotch() {
		return new Promise((resolve) => {
			try {
				log.info('🛑 Terminating Boring Notch app...');
				
				// Try to find and terminate the boring.notch process
				exec('pkill -f "boringNotch"', (error, stdout, stderr) => {
					if (error && !error.message.includes('No matching processes')) {
						log.warn('⚠️ Error terminating Boring Notch process:', error.message);
					} else {
						log.info('✅ Boring Notch process terminated');
					}
					
					// Also try to quit the app gracefully using AppleScript
					const quitScript = `
						tell application "boringNotch"
							quit
						end tell
					`;
					
					exec(`osascript -e '${quitScript}'`, (quitError) => {
						if (quitError && !quitError.message.includes('Application isn\'t running')) {
							log.warn('⚠️ Error gracefully quitting Boring Notch:', quitError.message);
						} else {
							log.info('✅ Boring Notch app quit gracefully');
						}
						
						resolve();
					});
				});
			} catch (error) {
				log.error('❌ Error terminating Boring Notch:', error);
				resolve();
			}
		});
	}

	// Compatibility methods to maintain interface with existing code
	async sendMessageToSwiftUI(message) {
		log.info('📤 Message to Boring Notch (placeholder):', message);
		// Since we're launching a separate app, we can't directly send messages
		// This could be implemented using inter-process communication if needed
		return { success: true, message: 'Message logged (Boring Notch is separate app)' };
	}

	enable() {
		log.info('🔧 Boring Notch enable called (already running as separate app)');
		return true;
	}

	disable() {
		log.info('🔧 Boring Notch disable called');
		// Could implement logic to hide/show the Boring Notch app if needed
		return true;
	}

	toggle() {
		log.info('🔄 Boring Notch toggle called');
		// Since Boring Notch is a separate app, we can't directly toggle it
		// The app manages its own visibility
		return true;
	}

	isVisible() {
		// Since Boring Notch is a separate app, we assume it's visible when running
		return this.isInitialized;
	}

	getStatus() {
		// Return a basic status for compatibility
		return this.isInitialized ? 'running' : 'stopped';
	}

	getAutoOpenOnStartup() {
		// Boring Notch manages its own startup preferences
		return true;
	}

	setAutoOpenOnStartup(enabled) {
		log.info('🔧 Boring Notch auto-open on startup set to:', enabled);
		return true;
	}

	setStatus(status) {
		log.info('🔧 Boring Notch status set to:', status);
		return true;
	}

	handleDroppedFiles(filePaths) {
		log.info('📁 Boring Notch handle dropped files:', filePaths);
		// Could implement file handling if needed
		return true;
	}

	setHapticFeedback(enabled) {
		log.info('🔧 Boring Notch haptic feedback set to:', enabled);
		return true;
	}

	getHapticFeedback() {
		// Return default value for compatibility
		return true;
	}

	async handleSwiftAction(action, data) {
		log.info('🎯 Boring Notch Swift action:', action, data);
		// Since Boring Notch is a separate app, we can't directly handle Swift actions
		return { success: true, message: 'Action logged (Boring Notch is separate app)' };
	}

	async updateVoiceStatus(status) {
		log.info('🎤 Boring Notch voice status updated:', status);
		return { success: true };
	}

	async updateVoiceConnectionState(status) {
		log.info('🔗 Boring Notch voice connection state updated:', status);
		return { success: true };
	}

	async addVoiceMessage(messageData) {
		log.info('💬 Boring Notch voice message added:', messageData);
		return { success: true };
	}

	async sendMessage(messageData) {
		log.info('📤 Boring Notch general message sent:', messageData);
		return { success: true };
	}

	async updateVoiceMuteState(isMuted) {
		log.info('🔇 Boring Notch voice mute state updated:', isMuted);
		return { success: true };
	}

	updateStealthModeState(isEnabled) {
		log.info('🥷 Boring Notch stealth mode state updated:', isEnabled);
		// Could implement stealth mode logic if needed
	}

	// Debug method to help troubleshoot Boring Notch issues
	getDebugInfo() {
		const fs = require('fs');
		const debugInfo = {
			isInitialized: this.isInitialized,
			processPlatform: process.platform,
			nodeEnv: process.env.NODE_ENV,
			currentDir: __dirname,
			resourcesPath: process.resourcesPath,
			possiblePaths: [],
			existingPaths: [],
			missingPaths: []
		};

		// Check all possible paths
		const allPossiblePaths = [
			// Development paths
			path.join(__dirname, '..', '..', 'boring.notch', 'build', 'boringNotch.app'),
			path.join(__dirname, '..', '..', 'boring.notch', 'boring.notch', 'build', 'boringNotch.app'),
			path.join(__dirname, '..', '..', 'boring.notch', 'boringNotch.app'),
			// Production paths
			path.join(process.resourcesPath || path.join(__dirname, '..', '..', '..'), 'boringNotch.app'),
			path.join(__dirname, '..', '..', '..', 'boringNotch.app'),
			path.join(__dirname, '..', '..', 'boringNotch.app')
		];

		allPossiblePaths.forEach(possiblePath => {
			debugInfo.possiblePaths.push(possiblePath);
			if (fs.existsSync(possiblePath)) {
				debugInfo.existingPaths.push(possiblePath);
			} else {
				debugInfo.missingPaths.push(possiblePath);
			}
		});

		return debugInfo;
	}
}

module.exports = BoringNotchService;
