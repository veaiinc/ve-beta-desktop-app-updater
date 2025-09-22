// Wake Word Integration Service
// Connects Python wake word detection to Swift voice agent

const { WakeWordService } = require('../electron/wakeWordService');

class WakeWordIntegration {
    constructor(notchDropService) {
        this.notchDropService = notchDropService;
        this.wakeWordService = null;
        this.isEnabled = false;
        
        console.log('🎤 Wake Word Integration initialized');
    }

    async start() {
        if (this.isEnabled) {
            console.log('⚠️ Wake word integration already running');
            return;
        }

        try {
            // Initialize wake word service
            this.wakeWordService = new WakeWordService();
            
            // Listen for wake word detection events
            this.wakeWordService.addListener((event) => {
                this.handleWakeWordEvent(event);
            });
            
            // Start the Python wake word detection
            this.wakeWordService.start();
            this.isEnabled = true;
            
            console.log('✅ Wake word integration started - listening for "Hey Ve"');
        } catch (error) {
            console.error('❌ Failed to start wake word integration:', error);
            throw error;
        }
    }

    stop() {
        if (!this.isEnabled) {
            console.log('⚠️ Wake word integration not running');
            return;
        }

        try {
            if (this.wakeWordService) {
                this.wakeWordService.stop();
                this.wakeWordService = null;
            }
            
            this.isEnabled = false;
            console.log('🛑 Wake word integration stopped');
        } catch (error) {
            console.error('❌ Error stopping wake word integration:', error);
        }
    }

    handleWakeWordEvent(event) {
        console.log('📡 Received wake word event:', event);
        
        if (event.type === 'wake_word_detected') {
            const { score, action } = event.data;
            console.log(`🎯 "Hey Ve" detected! Score: ${score}, Action: ${action}`);
            
            // Forward to Swift voice agent via NotchDrop
            if (this.notchDropService && this.notchDropService.notchDropAddon) {
                try {
                    // Trigger voice agent activation in Swift
                    this.notchDropService.notchDropAddon.handleWakeWordDetected(score);
                    console.log('🚀 Voice agent activation sent to Swift NotchDrop');
                } catch (error) {
                    console.error('❌ Error forwarding to Swift voice agent:', error);
                }
            } else {
                console.warn('⚠️ NotchDrop service not available for voice agent activation');
                console.log('🔍 Debug - notchDropService:', !!this.notchDropService);
                console.log('🔍 Debug - notchDropAddon:', !!this.notchDropService?.notchDropAddon);
            }
        }
    }

    getStatus() {
        return {
            isEnabled: this.isEnabled,
            isListening: this.wakeWordService ? this.wakeWordService.isRunning : false
        };
    }
}

module.exports = { WakeWordIntegration };
