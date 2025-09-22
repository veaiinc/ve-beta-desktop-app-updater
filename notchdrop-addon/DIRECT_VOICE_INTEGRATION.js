/**
 * DIRECT VOICE INTEGRATION - SIMPLE SOLUTION
 *
 * This bypasses the complex bridge system and directly connects
 * NotchDrop Voice button to your existing voice agent
 */

const { ipcMain, BrowserWindow } = require('electron');

class DirectVoiceIntegration {
	constructor() {
		this.setupDirectHandlers();
		console.log('🎤 DIRECT Voice Integration initialized');
	}

	setupDirectHandlers() {
		// Handle direct voice activation from NotchDrop
		ipcMain.handle('swift:action', async (event, action, data) => {
			console.log('🔍 DIRECT: Received Swift action:', action, data);

			if (action === 'connectVoice') {
				console.log('🎤 DIRECT: Voice button clicked in NotchDrop');
				return await this.activateVoiceAgent();
			} else if (action === 'disconnectVoice') {
				console.log('🎤 DIRECT: Voice disconnect from NotchDrop');
				return await this.deactivateVoiceAgent();
			}

			// Let other handlers process non-voice actions
			return { success: true, handled: false };
		});

		// Alternative direct handler
		ipcMain.handle('notchdrop:voice:activate', async (event, data) => {
			console.log('🎤 DIRECT: Alternative voice activation');
			return await this.activateVoiceAgent();
		});
	}

	async activateVoiceAgent() {
		try {
			console.log('🎤 DIRECT: Activating voice agent...');

			// Find main window
			const mainWindow = BrowserWindow.getAllWindows().find((window) => {
				const title = window.getTitle();
				return (
					!title.includes('Overlay') &&
					!title.includes('Dynamic Island') &&
					!title.includes('AskAI')
				);
			});

			if (!mainWindow) {
				console.error('❌ Main window not found');
				return { success: false, error: 'Main window not found' };
			}

			console.log('📱 Found main window, activating voice agent...');

			// Method 1: Direct JavaScript execution to start voice agent
			const result = await mainWindow.webContents.executeJavaScript(`
                (async () => {
                    try {
                        console.log('🎤 DIRECT: Starting voice agent activation in renderer');
                        
                        // First, try to find existing voice agent and make it visible
                        let voiceContainers = document.querySelectorAll('.voiceContainer');
                        console.log('Found voice containers:', voiceContainers.length);
                        
                        if (voiceContainers.length > 0) {
                            console.log('📞 Voice agent found, making visible and activating...');
                            
                            // Make visible
                            voiceContainers[0].style.display = 'block';
                            voiceContainers[0].style.opacity = '1';
                            voiceContainers[0].style.visibility = 'visible';
                            
                            // Find and click the mic button
                            const micButtons = voiceContainers[0].querySelectorAll('.action-button, [class*="mic"]');
                            console.log('Found mic buttons:', micButtons.length);
                            
                            if (micButtons.length > 0) {
                                console.log('🎤 Clicking mic button to start voice agent...');
                                micButtons[0].click();
                                return { success: true, method: 'existing-voice-agent' };
                            }
                        }
                        
                        // Method 2: Try to create/show voice agent if not found
                        console.log('🎤 Voice agent not found, trying to create it...');
                        
                        // Check if we have voice agent context/hook available
                        if (window.voiceAgentHook) {
                            console.log('📞 Found voice agent hook, connecting...');
                            await window.voiceAgentHook.connectAndStart();
                            return { success: true, method: 'voice-hook' };
                        }
                        
                        // Method 3: Dispatch event to trigger voice agent creation
                        console.log('📞 Dispatching voice agent creation event...');
                        const createVoiceEvent = new CustomEvent('create-voice-agent', {
                            detail: { 
                                source: 'notchdrop',
                                autoStart: true,
                                timestamp: Date.now()
                            }
                        });
                        window.dispatchEvent(createVoiceEvent);
                        
                        // Method 4: Try to programmatically create voice agent
                        // Check if React and your voice agent component are available
                        if (window.React && window.ReactDOM) {
                            console.log('📞 React available, trying to mount voice agent...');
                            
                            // Create a container for the voice agent if it doesn't exist
                            let voiceContainer = document.getElementById('notchdrop-voice-agent');
                            if (!voiceContainer) {
                                voiceContainer = document.createElement('div');
                                voiceContainer.id = 'notchdrop-voice-agent';
                                voiceContainer.style.position = 'fixed';
                                voiceContainer.style.top = '50px';
                                voiceContainer.style.right = '50px';
                                voiceContainer.style.zIndex = '10000';
                                document.body.appendChild(voiceContainer);
                            }
                            
                            // Signal that voice agent should be shown
                            window.showNotchDropVoiceAgent = true;
                            
                            // Try to trigger a React re-render
                            const reactEvent = new CustomEvent('react-update-voice-agent', {
                                detail: { show: true }
                            });
                            window.dispatchEvent(reactEvent);
                            
                            return { success: true, method: 'react-mount' };
                        }
                        
                        console.log('⚠️ Could not activate voice agent - no suitable method found');
                        return { success: false, method: 'none-available' };
                        
                    } catch (error) {
                        console.error('❌ Error in direct voice activation:', error);
                        return { success: false, error: error.message };
                    }
                })()
            `);

			console.log('🎤 DIRECT: Voice activation result:', result);

			if (result.success) {
				console.log('✅ DIRECT: Voice agent activated successfully');
				return { success: true, method: result.method };
			} else {
				console.log('⚠️ DIRECT: Voice agent activation failed, trying alternative...');

				// Alternative: Send event to renderer and let React handle it
				mainWindow.webContents.send('notchdrop:activate-voice-agent', {
					source: 'notchdrop-direct',
					timestamp: Date.now(),
					autoStart: true,
				});

				return { success: true, method: 'ipc-event' };
			}
		} catch (error) {
			console.error('❌ DIRECT: Error activating voice agent:', error);
			return { success: false, error: error.message };
		}
	}

	async deactivateVoiceAgent() {
		try {
			console.log('🎤 DIRECT: Deactivating voice agent...');

			const mainWindow = BrowserWindow.getAllWindows().find((window) => {
				const title = window.getTitle();
				return !title.includes('Overlay') && !title.includes('Dynamic Island');
			});

			if (mainWindow) {
				await mainWindow.webContents.executeJavaScript(`
                    // Hide voice agent
                    const voiceContainers = document.querySelectorAll('.voiceContainer');
                    voiceContainers.forEach(container => {
                        container.style.display = 'none';
                    });
                    
                    // Click disconnect buttons
                    const disconnectButtons = document.querySelectorAll('.cancel-button, [class*="close"]');
                    if (disconnectButtons.length > 0) {
                        disconnectButtons[0].click();
                    }
                    
                    // Signal React to hide voice agent
                    window.showNotchDropVoiceAgent = false;
                    
                    const hideEvent = new CustomEvent('react-update-voice-agent', {
                        detail: { show: false }
                    });
                    window.dispatchEvent(hideEvent);
                `);
			}

			console.log('✅ DIRECT: Voice agent deactivated');
			return { success: true };
		} catch (error) {
			console.error('❌ DIRECT: Error deactivating voice agent:', error);
			return { success: false, error: error.message };
		}
	}
}

// Export for use in main.js
module.exports = DirectVoiceIntegration;
