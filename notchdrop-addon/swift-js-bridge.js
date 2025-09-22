const { ipcMain, BrowserWindow } = require('electron');

class SwiftJSBridge {
	constructor() {
		this.isInitialized = false;
		this.dynamicIslandWindow = null;
		this.swiftActionHandlers = new Map();
		this.setupSwiftActionHandlers();
	}

	async initialize() {
		if (this.isInitialized) {
			return;
		}

		try {
			// Set up IPC handlers for Swift actions
			// Note: Primary swift:action handler is managed by main.js
			this.setupIPCHandlers();

			this.isInitialized = true;
		} catch (error) {
			console.error('❌ Failed to initialize Swift-JS Bridge:', error);
			throw error;
		}
	}

	setupSwiftActionHandlers() {
		// Map Swift actions to JavaScript UI control functions
		this.swiftActionHandlers.set('startRecording', async (data) => {
			// Try overlay first for reliability, then update UI
			await this.triggerOverlayRecording(data);
			this.controlJavaScriptUI('startRecording', data);
		});

		this.swiftActionHandlers.set('stopRecording', async (data) => {
			// Ensure overlay is stopped even if UI window isn't present
			await this.triggerOverlayStopRecording(data);
			this.controlJavaScriptUI('stopRecording', data);
		});

		this.swiftActionHandlers.set('pauseRecording', async (data) => {
			await this.triggerOverlayPauseRecording(data);
			this.controlJavaScriptUI('pauseRecording', data);
		});

		this.swiftActionHandlers.set('resumeRecording', async (data) => {
			await this.triggerOverlayResumeRecording(data);
			this.controlJavaScriptUI('resumeRecording', data);
		});

		this.swiftActionHandlers.set('toggleChatMode', (data) => {
			this.controlJavaScriptUI('toggleChatMode', data);
		});

		this.swiftActionHandlers.set('submitChat', (data) => {
			this.controlJavaScriptUI('submitChat', data);
		});

		this.swiftActionHandlers.set('sendChatMessageToAskAI', async (data) => {
			console.log('🎯 Swift sending chat message to AskAI:', data);
			await this.sendChatMessageToAskAI(data);
		});

		this.swiftActionHandlers.set('setAuthenticated', (data) => {
			this.controlJavaScriptUI('setAuthenticated', data);
		});

		this.swiftActionHandlers.set('expand', (data) => {
			this.controlJavaScriptUI('expand', data);
		});

		this.swiftActionHandlers.set('collapse', (data) => {
			this.controlJavaScriptUI('collapse', data);
		});

		// Enhanced overlay integration handlers
		this.swiftActionHandlers.set('triggerOverlayRecording', (data) => {
			this.triggerOverlayRecording(data);
		});

		this.swiftActionHandlers.set('triggerOverlayToggleLiveIntelligence', (data) => {
			this.triggerOverlayToggleLiveIntelligence(data);
		});

		// Voice Assistant handlers
		this.swiftActionHandlers.set('connectVoice', (data) => {
			this.handleVoiceConnect(data);
		});

		this.swiftActionHandlers.set('disconnectVoice', (data) => {
			this.handleVoiceDisconnect(data);
		});

		this.swiftActionHandlers.set('toggleVoiceMute', (data) => {
			this.handleVoiceToggleMute(data);
		});

		this.swiftActionHandlers.set('sendVoiceMessage', (data) => {
			this.handleVoiceSendMessage(data);
		});

		this.swiftActionHandlers.set('voiceConnectionStateChanged', (data) => {
			this.handleVoiceConnectionStateChanged(data);
		});

		// Direct voice agent start
		this.swiftActionHandlers.set('startVoiceAgent', (data) => {
			this.handleStartVoiceAgent(data);
		});

		// Webcam handlers
		this.swiftActionHandlers.set('toggleWebcam', (data) => {
			this.handleWebcamToggle(data);
		});

		this.swiftActionHandlers.set('startWebcam', (data) => {
			this.handleWebcamStart(data);
		});

		this.swiftActionHandlers.set('stopWebcam', (data) => {
			this.handleWebcamStop(data);
		});

		this.swiftActionHandlers.set('checkCameraPermission', (data) => {
			this.handleCameraPermissionCheck(data);
		});

		this.swiftActionHandlers.set('requestCameraPermission', (data) => {
			this.handleCameraPermissionRequest(data);
		});
	}

	setupIPCHandlers() {
		// Check if handlers are already registered to prevent duplicates
		const registeredHandlers = new Set();

		// Helper function to safely register IPC handlers
		const safeRegisterHandler = (channel, handler) => {
			if (!registeredHandlers.has(channel)) {
				try {
					ipcMain.handle(channel, handler);
					registeredHandlers.add(channel);
				} catch (error) {
					if (error.message.includes('second handler')) {
					} else {
						throw error;
					}
				}
			}
		};

		// Note: swift:action is handled by main.js to route to NotchDrop service
		// This bridge focuses on UI-specific handlers

		// Handle JavaScript UI state requests
		safeRegisterHandler('js:getState', async () => {
			return this.getJavaScriptUIState();
		});

		// Handle JavaScript UI control requests
		safeRegisterHandler('js:control', async (event, action, data) => {
			return await this.controlJavaScriptUI(action, data);
		});
	}

	async handleSwiftAction(action, data) {
		try {
			const handler = this.swiftActionHandlers.get(action);
			if (handler) {
				await handler(data);
				return { success: true, action, data };
			} else {
				return { success: false, error: 'No handler found' };
			}
		} catch (error) {
			console.error('❌ Error handling Swift action:', error);
			return { success: false, error: error.message };
		}
	}

	async controlJavaScriptUI(action, data) {
		try {
			// Find the Dynamic Island window
			const dynamicIslandWindow = this.findDynamicIslandWindow();
			if (!dynamicIslandWindow) {
				return { success: false, error: 'Dynamic Island window not found' };
			}

			// Send action to JavaScript UI
			dynamicIslandWindow.webContents.send('swift:control', { action, data });

			return { success: true, action, data };
		} catch (error) {
			console.error('❌ Error controlling JavaScript UI:', error);
			return { success: false, error: error.message };
		}
	}

	findDynamicIslandWindow() {
		// Find the window that contains the Dynamic Island UI
		const windows = BrowserWindow.getAllWindows();
		for (const window of windows) {
			if (window.webContents && !window.isDestroyed()) {
				// Check if this window has the Dynamic Island UI
				// You might need to add a specific identifier to the window
				const title = window.getTitle();
				if (title.includes('Dynamic Island') || title.includes('NotchDrop')) {
					return window;
				}
			}
		}
		return null;
	}

	getJavaScriptUIState() {
		const dynamicIslandWindow = this.findDynamicIslandWindow();
		if (dynamicIslandWindow) {
			// Request state from JavaScript UI
			dynamicIslandWindow.webContents.send('swift:getState');
			return { success: true, message: 'State request sent' };
		}
		return { success: false, error: 'Dynamic Island window not found' };
	}

	// Method to be called from Swift side
	onSwiftAction(action, data) {
		this.handleSwiftAction(action, data);
	}

	// Enhanced overlay integration methods
	async triggerOverlayRecording(data) {
		try {
			// Check if we're in main process or renderer process
			try {
				// Try to use ipcRenderer (renderer process)
				const { ipcRenderer } = require('electron');
				if (ipcRenderer) {
					const result = await ipcRenderer.invoke('overlay-start-recording');
				}
			} catch (e) {
				// ipcRenderer not available, we're in main process

				// Main process approach - find overlay window and send command directly
				const { BrowserWindow } = require('electron');
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', {
								action: 'startRecording',
							});
							break;
						}
					}
				}
			}

			// Also control the JavaScript UI
			await this.controlJavaScriptUI('startRecording', data);

			return { success: true };
		} catch (error) {
			console.error('❌ Error triggering overlay recording:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayStopRecording(data) {
		try {
			try {
				const { ipcRenderer } = require('electron');
				if (ipcRenderer) {
					const result = await ipcRenderer.invoke(
						'notchdrop:triggerOverlayStopRecording',
					);
				}
			} catch (e) {
				const { BrowserWindow } = require('electron');
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', { action: 'stopRecording' });
							break;
						}
					}
				}
			}

			return { success: true };
		} catch (error) {
			console.error('❌ Error triggering overlay stop recording:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayPauseRecording(data) {
		try {
			try {
				const { ipcRenderer } = require('electron');
				if (ipcRenderer) {
					const result = await ipcRenderer.invoke(
						'notchdrop:triggerOverlayPauseRecording',
					);
				}
			} catch (e) {
				const { BrowserWindow } = require('electron');
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', {
								action: 'pauseRecording',
							});
							break;
						}
					}
				}
			}

			return { success: true };
		} catch (error) {
			console.error('❌ Error triggering overlay pause recording:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayResumeRecording(data) {
		try {
			try {
				const { ipcRenderer } = require('electron');
				if (ipcRenderer) {
					const result = await ipcRenderer.invoke(
						'notchdrop:triggerOverlayResumeRecording',
					);
				}
			} catch (e) {
				const { BrowserWindow } = require('electron');
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', {
								action: 'resumeRecording',
							});
							break;
						}
					}
				}
			}

			return { success: true };
		} catch (error) {
			console.error('❌ Error triggering overlay resume recording:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayToggleLiveIntelligence(data) {
		try {
			console.log('🧠 Triggering overlay toggle live intelligence from Swift-JS bridge');

			// Check if we're in main process or renderer process
			try {
				// Try to use ipcRenderer (renderer process)
				const { ipcRenderer } = require('electron');
				if (ipcRenderer) {
					const result = await ipcRenderer.invoke('overlay-toggle-live-intelligence');
				}
			} catch (e) {
				// ipcRenderer not available, we're in main process

				// Main process approach - find overlay window and send command directly
				const { BrowserWindow } = require('electron');
				const windows = BrowserWindow.getAllWindows();
				for (const window of windows) {
					if (window.webContents && !window.isDestroyed()) {
						const title = window.getTitle();
						if (title.includes('Overlay') || title.includes('Live Intelligence')) {
							window.webContents.send('overlay-command', {
								action: 'toggleLiveIntelligence',
							});
							break;
						}
					}
				}
			}

			// Also control the JavaScript UI
			await this.controlJavaScriptUI('startRecording', data);

			return { success: true };
		} catch (error) {
			console.error('❌ Error triggering overlay toggle live intelligence:', error);
			return { success: false, error: error.message };
		}
	}

	findOverlayWindow() {
		// Find the overlay window
		const windows = BrowserWindow.getAllWindows();
		for (const window of windows) {
			if (window.webContents && !window.isDestroyed()) {
				const title = window.getTitle();
				if (title.includes('Overlay') || title.includes('Live Intelligence')) {
					return window;
				}
			}
		}
		return null;
	}

	// Send chat message to AskAI window using the same event as Dynamic Island
	async sendChatMessageToAskAI(chatMessage) {
		try {
			// Use the same IPC event that Dynamic Island uses
			const { ipcRenderer } = require('electron');
			if (ipcRenderer && ipcRenderer.invoke) {
				const result = await ipcRenderer.invoke('send-chat-message-to-askai', chatMessage);
				return result;
			} else {
				console.error('❌ ipcRenderer not available in NotchDrop context');
				return { success: false, error: 'IPC not available' };
			}
		} catch (error) {
			console.error('❌ Error sending chat message to AskAI from NotchDrop:', error);
			return { success: false, error: error.message };
		}
	}

	// MARK: - Voice Assistant Handlers

	async handleVoiceConnect(data) {
		try {
			console.log('🎤 Swift requested voice connection - triggering existing voice agent');

			// Find the main window to trigger the existing voice agent
			const { BrowserWindow } = require('electron');
			const windows = BrowserWindow.getAllWindows();

			for (const window of windows) {
				if (window.webContents && !window.isDestroyed()) {
					const title = window.getTitle();
					// Look for main window (not overlay or dynamic island)
					if (!title.includes('Overlay') && !title.includes('Dynamic Island')) {
						console.log('📤 Sending voice agent activation to main window');

						// Trigger direct voice activation via IPC
						window.webContents.send('notchdrop:showVoiceAgent', {
							source: 'notchdrop',
							timestamp: Date.now(),
						});

						// Also call the direct IPC handler
						try {
							const { ipcMain } = require('electron');
							if (ipcMain) {
								// Emit direct activation event
								process.emit('notchdrop-voice-activate', {
									source: 'swift-bridge',
								});
							}
						} catch (e) {
							console.log('📞 Process emit fallback used');
						}

						// Try to trigger your existing voice agent component
						try {
							const result = await window.webContents.executeJavaScript(`
								(async () => {
									try {
										console.log('🎤 NotchDrop triggered voice agent activation');
										
										// Method 1: Try to find existing voice agent hook/context
										if (window.voiceAgentContext && window.voiceAgentContext.connectAndStart) {
											console.log('📞 Found voice agent context, connecting...');
											await window.voiceAgentContext.connectAndStart();
											return { success: true, method: 'context' };
										}
										
										// Method 2: Try to trigger via React state/context
										if (window.React && window.ReactDOM) {
											console.log('📞 Attempting to trigger voice agent via React...');
											
											// Dispatch a custom event that your voice agent can listen for
											const event = new CustomEvent('notchdrop-voice-activate', {
												detail: { source: 'notchdrop', timestamp: Date.now() }
											});
											window.dispatchEvent(event);
											
											return { success: true, method: 'custom-event' };
										}
										
										// Method 3: Try to find and click existing voice agent button
										const voiceButtons = document.querySelectorAll('[class*="voice"], [class*="mic"], [data-testid*="voice"]');
										if (voiceButtons.length > 0) {
											console.log('📞 Found voice UI elements, attempting to trigger...');
											voiceButtons[0].click();
											return { success: true, method: 'ui-click' };
										}
										
										console.log('⚠️ No voice agent found, will need manual integration');
										return { success: false, method: 'none' };
										
									} catch (error) {
										console.error('❌ Error in voice agent activation:', error);
										return { success: false, error: error.message };
									}
								})()
							`);

							console.log('🎤 Voice agent activation result:', result);
						} catch (jsError) {
							console.warn(
								'⚠️ Could not execute voice agent JavaScript:',
								jsError.message,
							);
						}

						break;
					}
				}
			}

			return { success: true, action: 'connectVoice', data };
		} catch (error) {
			console.error('❌ Error handling voice connect:', error);
			return { success: false, error: error.message };
		}
	}

	async handleVoiceDisconnect(data) {
		try {
			console.log('🎤 Swift requested voice disconnection:', data);

			const dynamicIslandWindow = this.findDynamicIslandWindow();
			if (dynamicIslandWindow) {
				dynamicIslandWindow.webContents.send('voice:disconnect', data);
			}

			return { success: true, action: 'disconnectVoice', data };
		} catch (error) {
			console.error('❌ Error handling voice disconnect:', error);
			return { success: false, error: error.message };
		}
	}

	async handleVoiceToggleMute(data) {
		try {
			console.log('🎤 Swift requested voice mute toggle:', data);

			const dynamicIslandWindow = this.findDynamicIslandWindow();
			if (dynamicIslandWindow) {
				dynamicIslandWindow.webContents.send('voice:toggleMute', data);
			}

			return { success: true, action: 'toggleVoiceMute', data };
		} catch (error) {
			console.error('❌ Error handling voice toggle mute:', error);
			return { success: false, error: error.message };
		}
	}

	async handleVoiceSendMessage(data) {
		try {
			console.log('🎤 Swift sent voice message:', data);

			const dynamicIslandWindow = this.findDynamicIslandWindow();
			if (dynamicIslandWindow) {
				dynamicIslandWindow.webContents.send('voice:message', { message: data });
			}

			return { success: true, action: 'sendVoiceMessage', data };
		} catch (error) {
			console.error('❌ Error handling voice send message:', error);
			return { success: false, error: error.message };
		}
	}

	async handleVoiceConnectionStateChanged(data) {
		try {
			console.log('🎤 Swift voice connection state changed:', data);

			const dynamicIslandWindow = this.findDynamicIslandWindow();
			if (dynamicIslandWindow) {
				dynamicIslandWindow.webContents.send('voice:stateChanged', { state: data });
			}

			return { success: true, action: 'voiceConnectionStateChanged', data };
		} catch (error) {
			console.error('❌ Error handling voice connection state change:', error);
			return { success: false, error: error.message };
		}
	}

	async handleStartVoiceAgent(data) {
		try {
			console.log('🎤 DIRECT: Starting voice agent from NotchDrop button');

			// Find the main window to trigger your existing voice agent
			const { BrowserWindow } = require('electron');
			const windows = BrowserWindow.getAllWindows();

			for (const window of windows) {
				if (window.webContents && !window.isDestroyed()) {
					const title = window.getTitle();
					// Look for main window (not overlay or dynamic island)
					if (!title.includes('Overlay') && !title.includes('Dynamic Island')) {
						console.log('🎤 Triggering voice agent in main window');

						// Execute JavaScript to start voice agent using the working approach
						try {
							const result = await window.webContents.executeJavaScript(`
								(async () => {
									try {
										console.log('🎤 NotchDrop Voice: Starting voice agent...');
										
										// Method 1: Look for the working useVoiceIntegration hook
										console.log('🔍 Checking window.voiceIntegration:', !!window.voiceIntegration);
										console.log('🔍 Available window properties:', Object.keys(window).filter(k => k.includes('voice')));
										
										if (window.voiceIntegration && window.voiceIntegration.connectToRoom) {
											console.log('🎤 Found voiceIntegration.connectToRoom(), calling directly...');
											await window.voiceIntegration.connectToRoom();
											console.log('✅ Voice agent started successfully from NotchDrop!');
											return { success: true, method: 'voiceIntegration.connectToRoom' };
										}
										
										// Method 2: Try to find it in React context
										console.log('⚠️ voiceIntegration not found on window, trying custom event...');
										const event = new CustomEvent('notchdrop-start-voice-agent', {
											detail: { 
												source: 'notchdrop-voice-button',
												timestamp: Date.now()
											}
										});
										window.dispatchEvent(event);
										
										return { success: true, method: 'custom-event' };
										
									} catch (error) {
										console.error('❌ NotchDrop voice agent error:', error);
										return { success: false, error: error.message };
									}
								})()
							`);

							console.log('🎤 NotchDrop voice agent result:', result);
						} catch (jsError) {
							console.warn(
								'⚠️ Could not execute NotchDrop voice JavaScript:',
								jsError.message,
							);
						}

						break;
					}
				}
			}

			return { success: true, action: 'startVoiceAgent', data };
		} catch (error) {
			console.error('❌ Error handling start voice agent:', error);
			return { success: false, error: error.message };
		}
	}

	// MARK: - Webcam Handlers

	async handleWebcamToggle(data) {
		try {
			console.log('📹 Swift requested webcam toggle:', data);

			// Find the main window to trigger webcam functionality
			const { BrowserWindow } = require('electron');
			const windows = BrowserWindow.getAllWindows();

			for (const window of windows) {
				if (window.webContents && !window.isDestroyed()) {
					const title = window.getTitle();
					// Look for main window (not overlay or dynamic island)
					if (!title.includes('Overlay') && !title.includes('Dynamic Island')) {
						console.log('📹 Triggering webcam toggle in main window');

						// Execute JavaScript to toggle webcam using the existing Dynamic Island approach
						try {
							const result = await window.webContents.executeJavaScript(`
								(async () => {
									try {
										console.log('📹 NotchDrop: Toggling webcam...');
										
										// Use the same approach as Dynamic Island webcam functionality
										if (window.electronApi?.askAI?.camera?.checkPermission) {
											const permission = await window.electronApi.askAI.camera.checkPermission();
											console.log('📹 Camera permission status:', permission);
											
											if (permission === 'granted') {
												// Trigger webcam toggle via existing Dynamic Island functionality
												if (window.electronApi?.dynamicIsland?.toggleWebcam) {
													await window.electronApi.dynamicIsland.toggleWebcam();
													return { success: true, method: 'dynamicIsland.toggleWebcam' };
												}
											} else {
												// Request permission first
												await window.electronApi.askAI.camera.requestPermission();
												return { success: true, method: 'requestPermission' };
											}
										}
										
										// Fallback: dispatch custom event
										const event = new CustomEvent('notchdrop-toggle-webcam', {
											detail: { 
												source: 'notchdrop-webcam-button',
												timestamp: Date.now()
											}
										});
										window.dispatchEvent(event);
										
										return { success: true, method: 'custom-event' };
										
									} catch (error) {
										console.error('❌ NotchDrop webcam toggle error:', error);
										return { success: false, error: error.message };
									}
								})()
							`);

							console.log('📹 NotchDrop webcam toggle result:', result);
						} catch (jsError) {
							console.warn(
								'⚠️ Could not execute NotchDrop webcam JavaScript:',
								jsError.message,
							);
						}

						break;
					}
				}
			}

			return { success: true, action: 'toggleWebcam', data };
		} catch (error) {
			console.error('❌ Error handling webcam toggle:', error);
			return { success: false, error: error.message };
		}
	}

	async handleWebcamStart(data) {
		try {
			console.log('📹 Swift requested webcam start:', data);

			// Find the main window to trigger webcam start
			const { BrowserWindow } = require('electron');
			const windows = BrowserWindow.getAllWindows();

			for (const window of windows) {
				if (window.webContents && !window.isDestroyed()) {
					const title = window.getTitle();
					if (!title.includes('Overlay') && !title.includes('Dynamic Island')) {
						console.log('📹 Triggering webcam start in main window');

						try {
							const result = await window.webContents.executeJavaScript(`
								(async () => {
									try {
										console.log('📹 NotchDrop: Starting webcam...');
										
										// Use existing Dynamic Island webcam functionality
										if (window.electronApi?.dynamicIsland?.startWebcam) {
											await window.electronApi.dynamicIsland.startWebcam();
											return { success: true, method: 'dynamicIsland.startWebcam' };
										}
										
										// Fallback: dispatch custom event
										const event = new CustomEvent('notchdrop-start-webcam', {
											detail: { 
												source: 'notchdrop-webcam-start',
												timestamp: Date.now()
											}
										});
										window.dispatchEvent(event);
										
										return { success: true, method: 'custom-event' };
										
									} catch (error) {
										console.error('❌ NotchDrop webcam start error:', error);
										return { success: false, error: error.message };
									}
								})()
							`);

							console.log('📹 NotchDrop webcam start result:', result);
						} catch (jsError) {
							console.warn(
								'⚠️ Could not execute NotchDrop webcam start JavaScript:',
								jsError.message,
							);
						}

						break;
					}
				}
			}

			return { success: true, action: 'startWebcam', data };
		} catch (error) {
			console.error('❌ Error handling webcam start:', error);
			return { success: false, error: error.message };
		}
	}

	async handleWebcamStop(data) {
		try {
			console.log('📹 Swift requested webcam stop:', data);

			// Find the main window to trigger webcam stop
			const { BrowserWindow } = require('electron');
			const windows = BrowserWindow.getAllWindows();

			for (const window of windows) {
				if (window.webContents && !window.isDestroyed()) {
					const title = window.getTitle();
					if (!title.includes('Overlay') && !title.includes('Dynamic Island')) {
						console.log('📹 Triggering webcam stop in main window');

						try {
							const result = await window.webContents.executeJavaScript(`
								(async () => {
									try {
										console.log('📹 NotchDrop: Stopping webcam...');
										
										// Use existing Dynamic Island webcam functionality
										if (window.electronApi?.dynamicIsland?.stopWebcam) {
											await window.electronApi.dynamicIsland.stopWebcam();
											return { success: true, method: 'dynamicIsland.stopWebcam' };
										}
										
										// Fallback: dispatch custom event
										const event = new CustomEvent('notchdrop-stop-webcam', {
											detail: { 
												source: 'notchdrop-webcam-stop',
												timestamp: Date.now()
											}
										});
										window.dispatchEvent(event);
										
										return { success: true, method: 'custom-event' };
										
									} catch (error) {
										console.error('❌ NotchDrop webcam stop error:', error);
										return { success: false, error: error.message };
									}
								})()
							`);

							console.log('📹 NotchDrop webcam stop result:', result);
						} catch (jsError) {
							console.warn(
								'⚠️ Could not execute NotchDrop webcam stop JavaScript:',
								jsError.message,
							);
						}

						break;
					}
				}
			}

			return { success: true, action: 'stopWebcam', data };
		} catch (error) {
			console.error('❌ Error handling webcam stop:', error);
			return { success: false, error: error.message };
		}
	}

	async handleCameraPermissionCheck(data) {
		try {
			console.log('📹 Swift requested camera permission check:', data);

			// Find the main window to check camera permission
			const { BrowserWindow } = require('electron');
			const windows = BrowserWindow.getAllWindows();

			for (const window of windows) {
				if (window.webContents && !window.isDestroyed()) {
					const title = window.getTitle();
					if (!title.includes('Overlay') && !title.includes('Dynamic Island')) {
						console.log('📹 Checking camera permission in main window');

						try {
							const result = await window.webContents.executeJavaScript(`
								(async () => {
									try {
										console.log('📹 NotchDrop: Checking camera permission...');
										
										// Use existing Dynamic Island camera permission functionality
										if (window.electronApi?.askAI?.camera?.checkPermission) {
											const permission = await window.electronApi.askAI.camera.checkPermission();
											return { success: true, permission, method: 'askAI.camera.checkPermission' };
										}
										
										return { success: false, error: 'Camera permission API not available' };
										
									} catch (error) {
										console.error('❌ NotchDrop camera permission check error:', error);
										return { success: false, error: error.message };
									}
								})()
							`);
						} catch (jsError) {
							console.warn(
								'⚠️ Could not execute NotchDrop camera permission check JavaScript:',
								jsError.message,
							);
						}

						break;
					}
				}
			}

			return { success: true, action: 'checkCameraPermission', data };
		} catch (error) {
			console.error('❌ Error handling camera permission check:', error);
			return { success: false, error: error.message };
		}
	}

	async handleCameraPermissionRequest(data) {
		try {
			console.log('📹 Swift requested camera permission request:', data);

			// Find the main window to request camera permission
			const { BrowserWindow } = require('electron');
			const windows = BrowserWindow.getAllWindows();

			for (const window of windows) {
				if (window.webContents && !window.isDestroyed()) {
					const title = window.getTitle();
					if (!title.includes('Overlay') && !title.includes('Dynamic Island')) {
						console.log('📹 Requesting camera permission in main window');

						try {
							const result = await window.webContents.executeJavaScript(`
								(async () => {
									try {
										console.log('📹 NotchDrop: Requesting camera permission...');
										
										// Use existing Dynamic Island camera permission functionality
										if (window.electronApi?.askAI?.camera?.requestPermission) {
											const permission = await window.electronApi.askAI.camera.requestPermission();
											console.log('📹 Camera permission request result:', permission);
											return { success: true, permission, method: 'askAI.camera.requestPermission' };
										}
										
										return { success: false, error: 'Camera permission request API not available' };
										
									} catch (error) {
										console.error('❌ NotchDrop camera permission request error:', error);
										return { success: false, error: error.message };
									}
								})()
							`);

							console.log('📹 NotchDrop camera permission request result:', result);
						} catch (jsError) {
							console.warn(
								'⚠️ Could not execute NotchDrop camera permission request JavaScript:',
								jsError.message,
							);
						}

						break;
					}
				}
			}

			return { success: true, action: 'requestCameraPermission', data };
		} catch (error) {
			console.error('❌ Error handling camera permission request:', error);
			return { success: false, error: error.message };
		}
	}

	// Cleanup
	destroy() {
		this.isInitialized = false;
		this.swiftActionHandlers.clear();
	}
}

// Create singleton instance
const swiftJSBridge = new SwiftJSBridge();

// Export both the class and singleton instance
module.exports = SwiftJSBridge;
module.exports.bridge = swiftJSBridge;
