/**
 * Voice Assistant Integration Example
 * 
 * This file demonstrates how to integrate the LiveKit Voice Assistant
 * with the NotchDrop Swift UI and Electron main process.
 */

const { ipcMain } = require('electron');

class VoiceAssistantIntegration {
    constructor(notchDropService) {
        this.notchDropService = notchDropService;
        this.isVoiceConnected = false;
        this.liveKitConfig = {
            url: '',
            token: ''
        };
        
        this.setupIPCHandlers();
        this.setupNotchDropListeners();
    }

    // MARK: - Configuration
    
    /**
     * Configure LiveKit connection parameters
     * These would typically come from your backend service
     */
    configureLiveKit(url, token) {
        this.liveKitConfig = { url, token };
        
        // Configure the Swift side
        if (this.notchDropService && this.notchDropService.notchDrop) {
            try {
                this.notchDropService.notchDrop.configureLiveKit(url, token);
                console.log('✅ LiveKit configured for voice assistant');
            } catch (error) {
                console.error('❌ Error configuring LiveKit:', error);
            }
        }
    }

    // MARK: - IPC Handlers for Electron Integration
    
    setupIPCHandlers() {
        // Handle voice configuration from renderer process
        ipcMain.handle('voice:configure', async (event, { url, token }) => {
            try {
                this.configureLiveKit(url, token);
                return { success: true };
            } catch (error) {
                console.error('❌ Error configuring voice:', error);
                return { success: false, error: error.message };
            }
        });

        // Handle voice connection requests
        ipcMain.handle('voice:connect', async (event) => {
            try {
                if (!this.liveKitConfig.url || !this.liveKitConfig.token) {
                    throw new Error('LiveKit not configured. Please provide URL and token.');
                }

                await this.connectVoiceAssistant();
                return { success: true };
            } catch (error) {
                console.error('❌ Error connecting voice:', error);
                return { success: false, error: error.message };
            }
        });

        // Handle voice disconnection requests
        ipcMain.handle('voice:disconnect', async (event) => {
            try {
                await this.disconnectVoiceAssistant();
                return { success: true };
            } catch (error) {
                console.error('❌ Error disconnecting voice:', error);
                return { success: false, error: error.message };
            }
        });

        // Handle voice status requests
        ipcMain.handle('voice:status', async (event) => {
            try {
                const status = this.getVoiceConnectionStatus();
                return { success: true, status };
            } catch (error) {
                console.error('❌ Error getting voice status:', error);
                return { success: false, error: error.message };
            }
        });

        // Handle LiveKit token generation requests
        ipcMain.handle('voice:generateToken', async (event, { participantName = 'User' }) => {
            try {
                // This is where you would call your backend service to generate a LiveKit token
                // For demonstration purposes, we'll return a placeholder
                const token = await this.generateLiveKitToken(participantName);
                return { success: true, token };
            } catch (error) {
                console.error('❌ Error generating token:', error);
                return { success: false, error: error.message };
            }
        });
    }

    // MARK: - NotchDrop Event Listeners
    
    setupNotchDropListeners() {
        if (!this.notchDropService || !this.notchDropService.notchDrop) {
            console.warn('⚠️ NotchDrop service not available for voice integration');
            return;
        }

        // Listen for voice connection events from Swift UI
        this.notchDropService.notchDrop.on('connectVoice', () => {
            console.log('🎤 Voice connection requested from Swift UI');
            this.handleVoiceConnectFromSwift();
        });

        this.notchDropService.notchDrop.on('disconnectVoice', () => {
            console.log('🎤 Voice disconnection requested from Swift UI');
            this.handleVoiceDisconnectFromSwift();
        });

        this.notchDropService.notchDrop.on('voiceConnectionStateChanged', (state) => {
            console.log('🎤 Voice connection state changed:', state);
            this.isVoiceConnected = state === 'connected';
            this.broadcastVoiceStateChange(state);
        });

        this.notchDropService.notchDrop.on('sendVoiceMessage', (message) => {
            console.log('🎤 Voice message from Swift UI:', message);
            this.handleVoiceMessageFromSwift(message);
        });
    }

    // MARK: - Voice Assistant Methods
    
    async connectVoiceAssistant() {
        if (!this.notchDropService || !this.notchDropService.notchDrop) {
            throw new Error('NotchDrop service not available');
        }

        if (!this.liveKitConfig.url || !this.liveKitConfig.token) {
            throw new Error('LiveKit not configured');
        }

        try {
            // Connect via Swift UI
            this.notchDropService.notchDrop.connectVoiceAssistant();
            console.log('✅ Voice assistant connection initiated');
        } catch (error) {
            console.error('❌ Error connecting voice assistant:', error);
            throw error;
        }
    }

    async disconnectVoiceAssistant() {
        if (!this.notchDropService || !this.notchDropService.notchDrop) {
            throw new Error('NotchDrop service not available');
        }

        try {
            this.notchDropService.notchDrop.disconnectVoiceAssistant();
            console.log('✅ Voice assistant disconnection initiated');
        } catch (error) {
            console.error('❌ Error disconnecting voice assistant:', error);
            throw error;
        }
    }

    getVoiceConnectionStatus() {
        if (!this.notchDropService || !this.notchDropService.notchDrop) {
            return 'unavailable';
        }

        try {
            return this.notchDropService.notchDrop.getVoiceConnectionStatus();
        } catch (error) {
            console.error('❌ Error getting voice status:', error);
            return 'error';
        }
    }

    // MARK: - Event Handlers
    
    async handleVoiceConnectFromSwift() {
        try {
            // Generate fresh token if needed
            if (!this.liveKitConfig.token || this.isTokenExpired()) {
                const tokenResponse = await this.generateLiveKitToken();
                if (tokenResponse.success) {
                    this.liveKitConfig.token = tokenResponse.token;
                    // Reconfigure with new token
                    this.configureLiveKit(this.liveKitConfig.url, this.liveKitConfig.token);
                }
            }

            // The actual connection is handled by the Swift LiveKit service
            console.log('✅ Voice connection handled from Swift UI');
        } catch (error) {
            console.error('❌ Error handling voice connect from Swift:', error);
        }
    }

    async handleVoiceDisconnectFromSwift() {
        try {
            this.isVoiceConnected = false;
            console.log('✅ Voice disconnection handled from Swift UI');
        } catch (error) {
            console.error('❌ Error handling voice disconnect from Swift:', error);
        }
    }

    handleVoiceMessageFromSwift(message) {
        try {
            // Handle voice messages from the Swift UI
            // This could be used for debugging or additional processing
            console.log('📝 Voice message processed:', message);
        } catch (error) {
            console.error('❌ Error handling voice message from Swift:', error);
        }
    }

    // MARK: - Token Management
    
    /**
     * Generate LiveKit access token using VE.AI backend service
     */
    async generateLiveKitToken(participantName = 'User') {
        try {
            console.log('🎤 Generating LiveKit token for:', participantName);
            
            // Get user context from localStorage (following your existing pattern)
            const workspaceId = localStorage.getItem('workspaceId');
            const bearerToken = localStorage.getItem('token');
            const userLocation = JSON.parse(localStorage.getItem('location') || '{}');
            
            if (!bearerToken) {
                throw new Error('No authentication token available');
            }
            
            // Call your voice agent token generation API
            const response = await fetch('https://voice.us-east-1.ve.ai/generate-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({
                    participant_name: participantName,
                    workspace_id: workspaceId,
                    location: userLocation,
                    session_type: 'voice_assistant',
                    capabilities: {
                        can_publish: true,
                        can_subscribe: true,
                        can_publish_data: true
                    }
                })
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Token generation failed: ${response.status} ${errorData}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.token) {
                console.log('✅ LiveKit token generated successfully');
                return {
                    success: true,
                    token: data.token,
                    room_name: data.room_name || `voice-session-${Date.now()}`,
                    url: 'wss://ve-ai-voice-agent-ginreaey.livekit.cloud'
                };
            } else {
                throw new Error(data.error || 'Token generation failed');
            }
            
        } catch (error) {
            console.error('❌ Error generating LiveKit token:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    isTokenExpired() {
        // Simple token expiration check
        // In a real app, you would decode the JWT and check the expiration
        return false;
    }

    // MARK: - Event Broadcasting
    
    broadcastVoiceStateChange(state) {
        // Broadcast voice state changes to all renderer processes
        const { BrowserWindow } = require('electron');
        BrowserWindow.getAllWindows().forEach(window => {
            if (window.webContents && !window.isDestroyed()) {
                window.webContents.send('voice:stateChanged', { state });
            }
        });
    }

    // MARK: - Integration Example
    
    /**
     * Example of how to integrate with your existing app
     */
    static createIntegration(notchDropService) {
        const integration = new VoiceAssistantIntegration(notchDropService);
        
        // Example: Configure with your LiveKit server
        // integration.configureLiveKit('wss://your-livekit-server.com', 'your-token');
        
        return integration;
    }
}

module.exports = VoiceAssistantIntegration;
