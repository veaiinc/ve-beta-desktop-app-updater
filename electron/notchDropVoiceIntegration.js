/**
 * NotchDrop Voice Integration for VE.AI
 * 
 * This service integrates NotchDrop Voice button with your existing VoiceAgentParent component
 */

const { ipcMain, BrowserWindow } = require('electron');

class NotchDropVoiceIntegration {
    constructor() {
        this.isVoiceAgentActive = false;
        this.voiceAgentWindow = null;
        this.setupIPCHandlers();
        
        console.log('🎤 NotchDrop Voice Integration initialized');
    }

    setupIPCHandlers() {
        // Handle voice activation from NotchDrop
        ipcMain.handle('notchdrop:activateVoiceAgent', async (event, data) => {
            console.log('🎤 NotchDrop requested voice agent activation:', data);
            return await this.activateVoiceAgent();
        });

        // Handle voice deactivation
        ipcMain.handle('notchdrop:deactivateVoiceAgent', async (event, data) => {
            console.log('🎤 NotchDrop requested voice agent deactivation');
            return await this.deactivateVoiceAgent();
        });

        // Handle voice status requests
        ipcMain.handle('notchdrop:getVoiceAgentStatus', async (event) => {
            return {
                isActive: this.isVoiceAgentActive,
                hasWindow: !!this.voiceAgentWindow
            };
        });
    }

    async activateVoiceAgent() {
        try {
            console.log('🎤 Activating voice agent for NotchDrop...');

            // Find the main window
            const mainWindow = BrowserWindow.getAllWindows().find(window => {
                const title = window.getTitle();
                return !title.includes('Overlay') && !title.includes('Dynamic Island') && !title.includes('AskAI');
            });

            if (!mainWindow) {
                throw new Error('Main window not found');
            }

            // Method 1: Try to trigger existing voice agent in the main window
            console.log('📞 Attempting to activate existing voice agent...');
            
            const result = await mainWindow.webContents.executeJavaScript(`
                (async () => {
                    try {
                        console.log('🎤 NotchDrop triggered voice agent activation in main window');
                        
                        // Look for your VoiceAgentParent component
                        const voiceContainers = document.querySelectorAll('.voiceContainer, [class*="voice"], [class*="VoiceAgent"]');
                        
                        if (voiceContainers.length > 0) {
                            console.log('📞 Found voice agent UI, attempting to activate...');
                            
                            // Try to find and click the action button (mic button)
                            const actionButtons = document.querySelectorAll('.action-button, [class*="mic"], button[class*="voice"]');
                            
                            if (actionButtons.length > 0) {
                                console.log('🎤 Found action button, clicking...');
                                actionButtons[0].click();
                                return { success: true, method: 'ui-click' };
                            }
                        }
                        
                        // If voice agent UI is not visible, try to make it visible
                        // Dispatch a custom event to show the voice agent
                        const showVoiceEvent = new CustomEvent('show-voice-agent', {
                            detail: { source: 'notchdrop', timestamp: Date.now() }
                        });
                        window.dispatchEvent(showVoiceEvent);
                        
                        // Wait a bit and try to find it again
                        setTimeout(() => {
                            const voiceContainers = document.querySelectorAll('.voiceContainer, [class*="voice"]');
                            if (voiceContainers.length > 0) {
                                const actionButtons = document.querySelectorAll('.action-button, [class*="mic"]');
                                if (actionButtons.length > 0) {
                                    actionButtons[0].click();
                                }
                            }
                        }, 500);
                        
                        return { success: true, method: 'custom-event' };
                        
                    } catch (error) {
                        console.error('❌ Error activating voice agent:', error);
                        return { success: false, error: error.message };
                    }
                })()
            `);

            console.log('🎤 Voice agent activation result:', result);

            // Method 2: Create a dedicated voice agent window if needed
            if (!result.success) {
                console.log('📱 Creating dedicated voice agent window...');
                await this.createVoiceAgentWindow();
            }

            this.isVoiceAgentActive = true;
            return { success: true };

        } catch (error) {
            console.error('❌ Error activating voice agent:', error);
            return { success: false, error: error.message };
        }
    }

    async createVoiceAgentWindow() {
        try {
            // Create a small window for the voice agent
            this.voiceAgentWindow = new BrowserWindow({
                width: 300,
                height: 400,
                x: 100,
                y: 100,
                frame: false,
                transparent: true,
                alwaysOnTop: true,
                skipTaskbar: true,
                resizable: false,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                    preload: path.join(__dirname, 'preload.js')
                }
            });

            // Load your voice agent component
            await this.voiceAgentWindow.loadURL('http://localhost:5173/#/voice-agent');

            // Position it near the NotchDrop
            this.voiceAgentWindow.setAlwaysOnTop(true, 'screen-saver');

            console.log('✅ Voice agent window created');

        } catch (error) {
            console.error('❌ Error creating voice agent window:', error);
        }
    }

    async deactivateVoiceAgent() {
        try {
            console.log('🎤 Deactivating voice agent...');

            // Close dedicated window if it exists
            if (this.voiceAgentWindow) {
                this.voiceAgentWindow.close();
                this.voiceAgentWindow = null;
            }

            // Try to deactivate in main window
            const mainWindow = BrowserWindow.getAllWindows().find(window => {
                const title = window.getTitle();
                return !title.includes('Overlay') && !title.includes('Dynamic Island');
            });

            if (mainWindow) {
                await mainWindow.webContents.executeJavaScript(`
                    // Try to disconnect existing voice agent
                    const disconnectButtons = document.querySelectorAll('.cancel-button, [class*="disconnect"], [class*="close"]');
                    if (disconnectButtons.length > 0) {
                        disconnectButtons[0].click();
                    }
                    
                    // Dispatch custom event to hide voice agent
                    const hideVoiceEvent = new CustomEvent('hide-voice-agent', {
                        detail: { source: 'notchdrop' }
                    });
                    window.dispatchEvent(hideVoiceEvent);
                `);
            }

            this.isVoiceAgentActive = false;
            console.log('✅ Voice agent deactivated');

        } catch (error) {
            console.error('❌ Error deactivating voice agent:', error);
        }
    }

    // Method to be called when NotchDrop voice button is clicked
    async handleNotchDropVoiceClick() {
        if (this.isVoiceAgentActive) {
            return await this.deactivateVoiceAgent();
        } else {
            return await this.activateVoiceAgent();
        }
    }
}

module.exports = NotchDropVoiceIntegration;
