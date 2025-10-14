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
			const boringNotchPath = this.getBoringNotchPath();
			
			if (!boringNotchPath) {
				throw new Error('Boring Notch app not found');
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
		// Try to find the boring.notch app in the project directory
		const possiblePaths = [
			// Development path - built app (correct nested path)
			path.join(__dirname, '..', '..', 'boring.notch', 'boring.notch', 'build', 'boringNotch.app'),
			// Alternative development path
			path.join(__dirname, '..', '..', 'boring.notch', 'build', 'boringNotch.app'),
			// Production path - if the app is built and placed in a specific location
			path.join(__dirname, '..', '..', 'boring.notch', 'boringNotch.app'),
		];

		for (const possiblePath of possiblePaths) {
			if (require('fs').existsSync(possiblePath)) {
				log.info('📁 Found Boring Notch at:', possiblePath);
				return possiblePath;
			}
		}

		// If not found in project directory, return null for now
		// The findBoringNotchInSystem method is async and would need to be handled differently
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
			
			try {
				// Launch the app normally using 'open' command first
				const launchCommand = `open "${appPath}"`;
				
				exec(launchCommand, (error, stdout, stderr) => {
					if (error) {
						log.error('❌ Failed to launch built app:', error);
						reject(error);
						return;
					}
					
					log.info('✅ Boring Notch app launched successfully');
					
					// Wait a moment for the app to start, then try to establish stdin communication
					setTimeout(() => {
						this.establishStdinCommunication(appPath);
						resolve();
					}, 2000);
				});
				
			} catch (error) {
				log.error('❌ Failed to launch built app:', error);
				reject(error);
			}
		});
	}

	establishStdinCommunication(appPath) {
		try {
			// Get the executable path inside the .app bundle
			const executablePath = path.join(appPath, 'Contents', 'MacOS', 'boringNotch');
			
			// Try to spawn a separate process for stdin communication
			this.boringNotchProcess = spawn(executablePath, [], {
				stdio: ['pipe', 'pipe', 'pipe'], // stdin, stdout, stderr
				detached: false
			});
			
			// Handle process events
			this.boringNotchProcess.on('error', (error) => {
				log.error('❌ Failed to establish stdin communication:', error);
				this.boringNotchProcess = null;
			});
			
			this.boringNotchProcess.on('exit', (code, signal) => {
				log.info('📱 Boring Notch stdin process exited with code:', code, 'signal:', signal);
				this.boringNotchProcess = null;
			});
			
			// Handle stdout/stderr for debugging and command processing
			this.boringNotchProcess.stdout?.on('data', (data) => {
				const output = data.toString().trim();
				log.info('📱 Boring Notch stdout:', output);
				
				// Process direct commands from boring.notch
				this.handleBoringNotchOutput(output);
			});
			
			this.boringNotchProcess.stderr?.on('data', (data) => {
				log.info('📱 Boring Notch stderr:', data.toString());
			});
			
			log.info('✅ Boring Notch stdin communication established');
			
		} catch (error) {
			log.error('❌ Failed to establish stdin communication:', error);
			this.boringNotchProcess = null;
		}
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


	async sendMessage(messageData) {
		log.info('📤 Boring Notch general message sent:', messageData);
		return { success: true };
	}

	async updateVoiceMuteState(isMuted) {
		log.info('🔇 Boring Notch voice mute state updated:', isMuted);
		return { success: true };
	}

	async updateVoiceConnectionStatus(status) {
		try {
			log.info('🔗 Boring Notch voice connection state updated:', status);
			
			// Send connection status update to boring.notch app
			if (this.boringNotchProcess && this.boringNotchProcess.stdin && !this.boringNotchProcess.stdin.destroyed) {
				const statusMessage = JSON.stringify({
					type: 'update_voice_connection_status',
					status: status,
					timestamp: Date.now(),
					source: 'electron'
				});
				this.boringNotchProcess.stdin.write(statusMessage + '\n');
				log.info('🔗 Voice connection status update sent to boring.notch app:', status);
			}
			
			return { success: true };
		} catch (error) {
			log.error('❌ Error updating voice connection status:', error);
			return { success: false, error: error.message };
		}
	}

	async addVoiceMessage(messageData) {
		try {
			log.info('💬 Boring Notch voice message added:', messageData);
			
			// Send voice message to boring.notch app
			if (this.boringNotchProcess && this.boringNotchProcess.stdin && !this.boringNotchProcess.stdin.destroyed) {
				const messageUpdate = JSON.stringify({
					type: 'add_voice_message',
					content: messageData.content,
					isFromAgent: messageData.isFromAgent,
					timestamp: Date.now(),
					source: 'electron'
				});
				this.boringNotchProcess.stdin.write(messageUpdate + '\n');
				log.info('💬 Voice message sent to boring.notch app');
			}
			
			return { success: true };
		} catch (error) {
			log.error('❌ Error adding voice message:', error);
			return { success: false, error: error.message };
		}
	}

	async disconnectVoiceAgent() {
		try {
			log.info('🔌 Disconnecting voice agent from Boring Notch service');

			// Send disconnect message to boring.notch app
			if (this.boringNotchProcess && this.boringNotchProcess.stdin && !this.boringNotchProcess.stdin.destroyed) {
				const disconnectMessage = JSON.stringify({
					type: 'disconnect_voice_agent',
					timestamp: Date.now(),
					source: 'electron'
				});
				this.boringNotchProcess.stdin.write(disconnectMessage + '\n');
				log.info('🔌 Voice agent disconnect message sent to boring.notch app');
			} else {
				log.warn('⚠️ Boring Notch stdin not available or destroyed. Cannot send disconnect message.');
			}

			// Also dispatch disconnect event to main window
			if (this.mainWindow) {
				const result = await this.mainWindow.webContents.executeJavaScript(`
					window.dispatchEvent(new CustomEvent('notchdrop-disconnect-voice', {
						detail: {
							source: 'boring-notch',
							timestamp: Date.now(),
							action: 'disconnect_voice_agent'
						}
					}));
					'{ "success": true, "method": "Boring Notch voice disconnect event" }';
				`);
				log.info('🔌 Voice disconnect event dispatched to main window:', result);
			}

			return { success: true };
		} catch (error) {
			log.error('❌ Error disconnecting voice agent in Boring Notch service:', error);
			return { success: false, error: error.message };
		}
	}

	async toggleVoiceMute(isMuted) {
		try {
			log.info('🎤 Toggling voice mute in Boring Notch service:', isMuted);

			// Send mute toggle message to boring.notch app
			if (this.boringNotchProcess && this.boringNotchProcess.stdin && !this.boringNotchProcess.stdin.destroyed) {
				const muteMessage = JSON.stringify({
					type: 'toggle_voice_mute',
					isMuted: isMuted,
					timestamp: Date.now(),
					source: 'electron'
				});
				this.boringNotchProcess.stdin.write(muteMessage + '\n');
				log.info('🎤 Voice mute toggle message sent to boring.notch app');
			} else {
				log.warn('⚠️ Boring Notch stdin not available or destroyed. Cannot send mute toggle message.');
			}

			// Also dispatch mute event to main window
			if (this.mainWindow) {
				const result = await this.mainWindow.webContents.executeJavaScript(`
					window.dispatchEvent(new CustomEvent('notchdrop-toggle-mute', {
						detail: {
							source: 'boring-notch',
							timestamp: Date.now(),
							isMuted: ${isMuted},
							action: 'toggle_voice_mute'
						}
					}));
					'{ "success": true, "method": "Boring Notch voice mute event" }';
				`);
				log.info('🎤 Voice mute event dispatched to main window:', result);
			}

			return { success: true };
		} catch (error) {
			log.error('❌ Error toggling voice mute in Boring Notch service:', error);
			return { success: false, error: error.message };
		}
	}

	// Handle direct commands from boring.notch app
	handleBoringNotchOutput(output) {
		try {
			// Try to parse as JSON
			const message = JSON.parse(output);
			
			if (message.type === 'electron_voice_mute') {
				log.info('🎤 Received direct voice mute command from boring.notch:', message.isMuted);
				this.handleDirectVoiceMute(message.isMuted);
			} else if (message.type === 'electron_voice_disconnect') {
				log.info('🔌 Received direct voice disconnect command from boring.notch');
				this.handleDirectVoiceDisconnect();
			}
		} catch (error) {
			// Not a JSON message, just log it
			log.info('📱 Boring Notch output (non-JSON):', output);
		}
	}

	// Handle direct voice mute command
	async handleDirectVoiceMute(isMuted) {
		try {
			log.info('🎤 Handling direct voice mute command:', isMuted);
			
			// Dispatch mute event to main window to control the actual voice agent
			if (this.mainWindow) {
				const result = await this.mainWindow.webContents.executeJavaScript(`
					// Dispatch mute toggle event
					const muteEvent = new CustomEvent('notchdrop-toggle-mute', {
						detail: {
							source: 'boring-notch-direct',
							timestamp: Date.now(),
							isMuted: ${isMuted},
							action: 'direct_voice_mute'
						}
					});
					window.dispatchEvent(muteEvent);
					
					// Also try to find and click mute buttons
					const muteButtons = document.querySelectorAll('.mute-button, [class*="mute"]');
					if (muteButtons.length > 0) {
						console.log('🎤 Found mute button, clicking...');
						muteButtons[0].click();
					}
					
					'{ "success": true, "method": "direct voice mute" }';
				`);
				log.info('🎤 Direct voice mute event dispatched to main window:', result);
			}
		} catch (error) {
			log.error('❌ Error handling direct voice mute:', error);
		}
	}

	// Handle direct voice disconnect command
	async handleDirectVoiceDisconnect() {
		try {
			log.info('🔌 Handling direct voice disconnect command');
			
			// Dispatch disconnect event to main window to control the actual voice agent
			if (this.mainWindow) {
				const result = await this.mainWindow.webContents.executeJavaScript(`
					// Dispatch disconnect event
					const disconnectEvent = new CustomEvent('notchdrop-disconnect-voice', {
						detail: {
							source: 'boring-notch-direct',
							timestamp: Date.now(),
							action: 'direct_voice_disconnect'
						}
					});
					window.dispatchEvent(disconnectEvent);
					
					// Also try to find and click disconnect buttons
					const disconnectButtons = document.querySelectorAll('.cancel-button, [class*="disconnect"], [class*="close"]');
					if (disconnectButtons.length > 0) {
						console.log('🔌 Found disconnect button, clicking...');
						disconnectButtons[0].click();
					}
					
					// Hide voice agent UI
					const voiceContainers = document.querySelectorAll('.voiceContainer');
					voiceContainers.forEach(container => {
						container.style.display = 'none';
					});
					
					'{ "success": true, "method": "direct voice disconnect" }';
				`);
				log.info('🔌 Direct voice disconnect event dispatched to main window:', result);
			}
		} catch (error) {
			log.error('❌ Error handling direct voice disconnect:', error);
		}
	}

	async activateVoiceAgent() {
		try {
			log.info('🎤 Activating voice agent from Boring Notch service');
			
			// First, try to activate the voice interface in the boring.notch app
			try {
				// Send message to boring.notch app to show voice interface
				if (this.boringNotchProcess && this.boringNotchProcess.stdin && !this.boringNotchProcess.stdin.destroyed) {
					const voiceActivationMessage = JSON.stringify({
						type: 'activate_voice_interface',
						timestamp: Date.now(),
						source: 'electron'
					});
					this.boringNotchProcess.stdin.write(voiceActivationMessage + '\n');
					log.info('🎤 Voice activation message sent to boring.notch app');
				} else {
					log.warn('⚠️ Boring Notch process or stdin not available:', {
						hasProcess: !!this.boringNotchProcess,
						hasStdin: !!(this.boringNotchProcess && this.boringNotchProcess.stdin),
						stdinDestroyed: this.boringNotchProcess?.stdin?.destroyed
					});
				}
			} catch (appError) {
				log.warn('⚠️ Could not send message to boring.notch app:', appError.message);
			}
			
			// Also dispatch voice activation event to main window for fallback
			if (this.mainWindow) {
				const result = await this.mainWindow.webContents.executeJavaScript(`
					window.dispatchEvent(new CustomEvent('notchdrop-activate-voice', {
						detail: {
							source: 'boring-notch',
							timestamp: Date.now(),
							action: 'activate_livekit_voice'
						}
					}));
					'{ "success": true, "method": "Boring Notch voice activation event" }';
				`);
				log.info('🎤 Voice activation event dispatched to main window:', result);
			}
			
			return { success: true };
		} catch (error) {
			log.error('❌ Error activating voice agent in Boring Notch service:', error);
			return { success: false, error: error.message };
		}
	}

	updateStealthModeState(isEnabled) {
		log.info('🥷 Boring Notch stealth mode state updated:', isEnabled);
		// Could implement stealth mode logic if needed
	}
}

module.exports = BoringNotchService;
