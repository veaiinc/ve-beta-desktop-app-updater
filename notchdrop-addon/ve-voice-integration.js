/**
 * VE.AI Voice Assistant Integration for NotchDrop
 *
 * This service integrates NotchDrop with your existing VE.AI voice agent system
 * using your LiveKit configuration and token generation API.
 */

const { ipcMain } = require('electron');

class VEVoiceIntegration {
	constructor(notchDropService) {
		this.notchDropService = notchDropService;
		this.isVoiceConnected = false;
		this.currentSession = null;

		// Enable debug logging
		process.env.DEBUG_VE_VOICE = 'true';
		console.log('🎤 VE Voice Integration initialized with debug logging enabled');

		// VE.AI Configuration
		this.config = {
			liveKitURL: 'wss://ve-ai-voice-agent-9yzwlzsg.livekit.cloud',
			tokenGenerationURL: 'https://voice.us-east-1.ve.ai',
			currentToken: null,
			roomName: null,
		};

		// Authentication context storage
		this.authContext = {
			workspaceId: null,
			userToken: null,
			locationDetails: null,
		};

		this.setupIPCHandlers();
		this.setupNotchDropListeners();
	}

	// MARK: - IPC Handlers for Electron Integration

	setupIPCHandlers() {
		// Handle voice connection requests from any renderer process
		ipcMain.handle('ve-voice:connect', async (event, options = {}) => {
			try {
				const result = await this.connectVoiceAssistant(options.participantName);
				return result;
			} catch (error) {
				console.error('❌ Error connecting VE voice:', error);
				return { success: false, error: error.message };
			}
		});

		// Handle voice disconnection requests
		ipcMain.handle('ve-voice:disconnect', async (event) => {
			try {
				await this.disconnectVoiceAssistant();
				return { success: true };
			} catch (error) {
				console.error('❌ Error disconnecting VE voice:', error);
				return { success: false, error: error.message };
			}
		});

		// Handle voice status requests
		ipcMain.handle('ve-voice:status', async (event) => {
			try {
				return {
					success: true,
					isConnected: this.isVoiceConnected,
					hasToken: !!this.config.currentToken,
					roomName: this.config.roomName,
				};
			} catch (error) {
				return { success: false, error: error.message };
			}
		});

		// Handle token generation requests
		ipcMain.handle('ve-voice:generateToken', async (event, { participantName = 'User' }) => {
			try {
				const tokenData = await this.generateVoiceToken(participantName);
				return tokenData;
			} catch (error) {
				console.error('❌ Error generating VE voice token:', error);
				return { success: false, error: error.message };
			}
		});

		// Handle manual token refresh
		ipcMain.handle('ve-voice:refreshToken', async (event, { participantName = 'User' }) => {
			try {
				const tokenData = await this.generateVoiceToken(participantName);
				if (tokenData.success) {
					this.config.currentToken = tokenData.token;
					this.config.roomName = tokenData.room_name;

					// Reconfigure NotchDrop with new token
					this.configureNotchDropVoice();
				}
				return tokenData;
			} catch (error) {
				return { success: false, error: error.message };
			}
		});
	}

	// MARK: - NotchDrop Event Listeners

	setupNotchDropListeners() {
		if (!this.notchDropService || !this.notchDropService.notchDrop) {
			console.warn('⚠️ NotchDrop service not available for VE voice integration');
			return;
		}

		// Listen for voice connection events from Swift UI
		this.notchDropService.notchDrop.on('connectVoice', async () => {
			console.log('🎤 VE Voice connection requested from NotchDrop');
			await this.handleVoiceConnectFromNotch();
		});

		this.notchDropService.notchDrop.on('disconnectVoice', async () => {
			console.log('🎤 VE Voice disconnection requested from NotchDrop');
			await this.handleVoiceDisconnectFromNotch();
		});

		this.notchDropService.notchDrop.on('voiceConnectionStateChanged', (state) => {
			console.log('🎤 VE Voice connection state changed:', state);
			this.isVoiceConnected = state === 'connected';
			this.broadcastVoiceStateChange(state);
		});

		this.notchDropService.notchDrop.on('sendVoiceMessage', (message) => {
			console.log('🎤 VE Voice message from NotchDrop:', message);
			// Handle voice messages if needed
		});
	}

	// MARK: - Voice Assistant Methods

	async connectVoiceAssistant(participantName = 'User') {
		try {
			console.log('🎤 Starting VE Voice Assistant connection...');

			// Step 1: Generate fresh token
			const tokenData = await this.generateVoiceToken(participantName);
			if (!tokenData.success) {
				throw new Error(`Token generation failed: ${tokenData.error}`);
			}

			// Step 2: Update configuration
			this.config.currentToken = tokenData.token;
			this.config.roomName = tokenData.room_name;

			// Step 3: Configure NotchDrop with VE.AI settings
			this.configureNotchDropVoice();

			// Step 4: Trigger connection via NotchDrop
			if (this.notchDropService && this.notchDropService.notchDrop) {
				this.notchDropService.notchDrop.connectVoiceAssistant();
			}

			console.log('✅ VE Voice Assistant connection initiated');
			return {
				success: true,
				roomName: this.config.roomName,
				url: this.config.liveKitURL,
			};
		} catch (error) {
			console.error('❌ Error connecting VE Voice Assistant:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	async disconnectVoiceAssistant() {
		try {
			console.log('🎤 Disconnecting VE Voice Assistant...');

			// Disconnect via NotchDrop
			if (this.notchDropService && this.notchDropService.notchDrop) {
				this.notchDropService.notchDrop.disconnectVoiceAssistant();
			}

			// Clear session data
			this.config.currentToken = null;
			this.config.roomName = null;
			this.isVoiceConnected = false;

			console.log('✅ VE Voice Assistant disconnected');
			return { success: true };
		} catch (error) {
			console.error('❌ Error disconnecting VE Voice Assistant:', error);
			throw error;
		}
	}

	// MARK: - Token Management

	async generateVoiceToken(participantName = 'User') {
		try {
			console.log('🎤 Generating VE voice token for:', participantName);

			// Get authentication context exactly like your web version
			const workspaceId = this.getWorkspaceId();
			const userToken = this.getBearerToken(); // This should be 'usertoken' from localStorage
			const locationDetails = this.getUserLocation();

			if (!userToken) {
				throw new Error('No authentication token available. Please log in.');
			}

			// Use exact URL pattern from your web version: /{workspaceId}/generate-voice-agent-token
			const url = `/${workspaceId}/generate-voice-agent-token`;

			// Payload should match your web version - location details only
			const requestBody = {
				location: locationDetails,
			};

			console.log('📤 Sending token request to:', this.config.tokenGenerationURL + url);
			console.log('📤 Request body:', requestBody);

			// Use exact headers pattern from your service layer
			const headers = {
				'Content-Type': 'application/json',
				'x-access-token': userToken,
				Authorization: `Bearer ${userToken}`,
			};

			const response = await fetch(this.config.tokenGenerationURL + url, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Token generation failed: ${response.status} ${errorText}`);
			}

			const data = await response.json();

			if (data.token || data.session_info?.user_token) {
				const token = data.session_info?.user_token || data.token;
				const roomName =
					data.room_name || data.session_info?.room_name || `voice-session-${Date.now()}`;

				console.log('✅ VE voice token generated successfully');
				console.log('📋 Token response structure:', Object.keys(data));

				return {
					success: true,
					token: token,
					room_name: roomName,
					url: this.config.liveKitURL,
					full_response: data, // Include full response for debugging
				};
			} else {
				throw new Error(data.error || 'Token generation failed - no token returned');
			}
		} catch (error) {
			console.error('❌ Error generating VE voice token:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	// MARK: - Helper Methods

	configureNotchDropVoice() {
		if (!this.notchDropService || !this.notchDropService.notchDrop) {
			console.warn('⚠️ NotchDrop not available for voice configuration');
			return;
		}

		try {
			this.notchDropService.notchDrop.configureLiveKit(
				this.config.liveKitURL,
				this.config.currentToken,
			);
			console.log('✅ NotchDrop configured with VE voice settings');
		} catch (error) {
			console.error('❌ Error configuring NotchDrop voice:', error);
		}
	}

	// Get workspace ID from storage or context
	getWorkspaceId() {
		// Try to get from environment or stored context
		return this.authContext?.workspaceId || process.env.WORKSPACE_ID || 'default-workspace';
	}

	// Get bearer token from storage or context
	getBearerToken() {
		// Try to get from environment or stored context
		return this.authContext?.userToken || process.env.VE_BEARER_TOKEN || null;
	}

	// Get user location from storage or context
	getUserLocation() {
		// Use stored location or default
		return (
			this.authContext?.locationDetails || {
				countryCode: 'IN',
				countryRegionCode: 'TS',
				countryRegion: 'Telangana',
				country: 'India',
				city: 'Hyderabad',
				timezone: 'Asia/Kolkata',
				postalCode: '500009',
				currency: 'INR',
				region: 'ap-south-1',
			}
		);
	}

	// Generate session ID (following your ObjectID pattern)
	generateSessionId() {
		// Simple session ID generation (you can use ObjectID if available)
		return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	// MARK: - Event Handlers

	async handleVoiceConnectFromNotch() {
		try {
			// The connection process is already handled by connectVoiceAssistant
			// This is called when the Swift UI triggers the connection
			console.log('📞 Handling voice connect from NotchDrop UI');
		} catch (error) {
			console.error('❌ Error handling voice connect from NotchDrop:', error);
		}
	}

	async handleVoiceDisconnectFromNotch() {
		try {
			this.isVoiceConnected = false;
			console.log('📞 Handled voice disconnect from NotchDrop UI');
		} catch (error) {
			console.error('❌ Error handling voice disconnect from NotchDrop:', error);
		}
	}

	// MARK: - Event Broadcasting

	broadcastVoiceStateChange(state) {
		// Broadcast voice state changes to all renderer processes
		const { BrowserWindow } = require('electron');
		BrowserWindow.getAllWindows().forEach((window) => {
			if (window.webContents && !window.isDestroyed()) {
				window.webContents.send('ve-voice:stateChanged', {
					state,
					isConnected: this.isVoiceConnected,
					roomName: this.config.roomName,
				});
			}
		});
	}

	// MARK: - Integration Example

	/**
	 * Create VE Voice Integration instance
	 */
	static createIntegration(notchDropService) {
		const integration = new VEVoiceIntegration(notchDropService);

		console.log('🎤 VE Voice Integration initialized');
		console.log('   LiveKit URL:', integration.config.liveKitURL);
		console.log('   Token API:', integration.config.tokenGenerationURL);

		return integration;
	}

	// MARK: - Public Methods for External Use

	/**
	 * Set authentication context (call this from your main process)
	 */
	setAuthContext(workspaceId, userToken, locationDetails = null) {
		this.authContext = {
			workspaceId: workspaceId,
			userToken: userToken,
			locationDetails: locationDetails || this.getUserLocation(),
		};

		// Also set environment variables as backup
		process.env.WORKSPACE_ID = workspaceId;
		process.env.VE_BEARER_TOKEN = userToken;

		console.log('🔐 VE Voice authentication context updated');
		console.log('   Workspace ID:', workspaceId);
		console.log('   Token available:', !!userToken);
		console.log('   Location:', locationDetails?.country || 'Default');
	}

	/**
	 * Get current voice connection status
	 */
	getStatus() {
		return {
			isConnected: this.isVoiceConnected,
			hasToken: !!this.config.currentToken,
			roomName: this.config.roomName,
			liveKitURL: this.config.liveKitURL,
		};
	}
}

module.exports = VEVoiceIntegration;
