/**
 * NotchDrop VE Voice Integration Example
 *
 * This example shows how to integrate the VE.AI voice assistant
 * with NotchDrop in your Electron main process.
 */

// Import the integration services
const VEVoiceIntegration = require('./ve-voice-integration');

/**
 * Setup NotchDrop with VE Voice Integration
 * Call this in your main Electron process after NotchDrop is initialized
 */
function setupNotchDropVoiceIntegration(notchDropService) {
	console.log('🎤 Setting up NotchDrop VE Voice Integration...');

	// Create the VE Voice integration
	const veVoiceIntegration = VEVoiceIntegration.createIntegration(notchDropService);

	// Example: Set authentication context from your app's state
	// You would get these values from your existing authentication system
	const exampleSetup = () => {
		// Get these from your app's authentication state
		const workspaceId = 'your-workspace-id'; // From localStorage or app state
		const bearerToken = 'your-bearer-token'; // From localStorage or app state
		const userLocation = {
			countryCode: 'IN',
			countryRegionCode: 'TS',
			countryRegion: 'Telangana',
			country: 'India',
			city: 'Hyderabad',
			timezone: 'Asia/Kolkata',
			postalCode: '500009',
			currency: 'INR',
			region: 'ap-south-1',
		};

		// Set authentication context for token generation
		veVoiceIntegration.setAuthContext(workspaceId, bearerToken, userLocation);
	};

	// You would call this when your app is authenticated
	// exampleSetup();

	console.log('✅ NotchDrop VE Voice Integration setup complete');
	return veVoiceIntegration;
}

/**
 * Example usage in your main Electron process
 */
function exampleMainProcessIntegration() {
	// Assuming you have your NotchDropService initialized
	// const notchDropService = new NotchDropService();
	// const veVoiceIntegration = setupNotchDropVoiceIntegration(notchDropService);
	// Example: Programmatically connect to voice assistant
	/*
    async function connectToVoiceAssistant() {
        try {
            const result = await veVoiceIntegration.connectVoiceAssistant('User');
            if (result.success) {
                console.log('✅ Connected to voice assistant:', result.roomName);
            } else {
                console.error('❌ Failed to connect:', result.error);
            }
        } catch (error) {
            console.error('❌ Connection error:', error);
        }
    }
    */
	// Example: Check voice status
	/*
    function checkVoiceStatus() {
        const status = veVoiceIntegration.getStatus();
        console.log('🎤 Voice Status:', status);
        return status;
    }
    */
}

/**
 * Example renderer process integration
 * Use this in your renderer process to interact with the voice assistant
 */
const exampleRendererIntegration = `
// In your renderer process (e.g., React component)
const { ipcRenderer } = require('electron');

// Connect to voice assistant
async function connectVoice() {
    try {
        const result = await ipcRenderer.invoke('ve-voice:connect', {
            participantName: 'User'
        });
        
        if (result.success) {
            console.log('✅ Connected to VE Voice Assistant');
        } else {
            console.error('❌ Connection failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Disconnect from voice assistant
async function disconnectVoice() {
    try {
        const result = await ipcRenderer.invoke('ve-voice:disconnect');
        console.log('🔌 Disconnected from voice assistant');
    } catch (error) {
        console.error('❌ Disconnect error:', error);
    }
}

// Check voice status
async function checkVoiceStatus() {
    try {
        const result = await ipcRenderer.invoke('ve-voice:status');
        console.log('🎤 Voice status:', result);
        return result;
    } catch (error) {
        console.error('❌ Status error:', error);
    }
}

// Generate fresh token
async function refreshVoiceToken() {
    try {
        const result = await ipcRenderer.invoke('ve-voice:refreshToken', {
            participantName: 'User'
        });
        
        if (result.success) {
            console.log('🔄 Token refreshed successfully');
        }
        return result;
    } catch (error) {
        console.error('❌ Token refresh error:', error);
    }
}

// Listen for voice state changes
ipcRenderer.on('ve-voice:stateChanged', (event, data) => {
    console.log('🎤 Voice state changed:', data);
    // Update your UI based on voice state
});

// Example React hook for voice integration
function useVEVoiceIntegration() {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Listen for voice state changes
        const handleStateChange = (event, data) => {
            setIsConnected(data.isConnected);
            if (data.state === 'connecting') {
                setIsConnecting(true);
            } else {
                setIsConnecting(false);
            }
        };

        ipcRenderer.on('ve-voice:stateChanged', handleStateChange);

        return () => {
            ipcRenderer.removeListener('ve-voice:stateChanged', handleStateChange);
        };
    }, []);

    const connect = async () => {
        try {
            setIsConnecting(true);
            setError(null);
            
            const result = await ipcRenderer.invoke('ve-voice:connect', {
                participantName: 'User'
            });
            
            if (!result.success) {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnect = async () => {
        try {
            await ipcRenderer.invoke('ve-voice:disconnect');
        } catch (err) {
            setError(err.message);
        }
    };

    return {
        isConnected,
        isConnecting,
        error,
        connect,
        disconnect
    };
}
`;

// Export the setup function for use in your main process
module.exports = {
	setupNotchDropVoiceIntegration,
	exampleMainProcessIntegration,
	exampleRendererIntegration,
};
