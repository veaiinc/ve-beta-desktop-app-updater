import { useEffect, useContext } from 'react';
import Context from '../context/context';
import useUpdatedVoiceIntegration from '../hooks/useUpdatedVoiceIntegration';

/**
 * NotchDrop Voice Activator Component
 *
 * This component listens for NotchDrop voice activation events
 * and triggers the LiveKit voice integration system.
 */
const NotchDropVoiceActivator = () => {
	const {
		aiSetup: { updateAiSetupState, voiceIntegrationData },
	} = useContext(Context);

	// Use the voice integration hook to handle token generation and connection
	const {
		shouldConnect,
		token,
		serverUrl,
		handleConnect,
		handleDisconnect: voiceIntegrationDisconnect,
	} = useUpdatedVoiceIntegration();

	useEffect(() => {
		console.log('🎤 NotchDrop Voice Activator: Component mounted and listening for events');

		// Listen for NotchDrop voice activation events
		const handleNotchDropVoiceActivation = async (event) => {
			console.log('🎤 NotchDrop Voice Activator: Received activation event:', event.detail);
			console.log('🎤 NotchDrop Voice Activator: Current shouldConnect:', shouldConnect);
			console.log(
				'🎤 NotchDrop Voice Activator: Current voiceIntegrationData:',
				voiceIntegrationData,
			);

			// Trigger LiveKit voice integration
			if (!shouldConnect && !voiceIntegrationData?.shouldConnect) {
				console.log('🚀 NotchDrop Voice Activator: Starting LiveKit voice integration...');

				// AUTO-EXPAND DYNAMIC ISLAND when Hey Ve is detected
				console.log('🏝️ AUTO-EXPANDING Dynamic Island for Hey Ve...');
				if (window.electronApi?.dynamicIsland?.expand) {
					try {
						await window.electronApi.dynamicIsland.expand();
						console.log('✅ Dynamic Island expanded for Hey Ve');
						
						// Also trigger voice mode in Dynamic Island
						setTimeout(() => {
							if (window.electronApi?.dynamicIsland?.setChatMode) {
								window.electronApi.dynamicIsland.setChatMode(true);
								console.log('✅ Dynamic Island voice mode activated');
							}
							
							// Trigger voice mode event for Dynamic Island UI
							window.dispatchEvent(
								new CustomEvent('trigger-voice-mode', {
									detail: { source: 'hey_ve_detection' }
								})
							);
							console.log('✅ Voice mode trigger event dispatched');
						}, 500);
					} catch (error) {
						console.error('❌ Failed to expand Dynamic Island:', error);
					}
				}

				// Disable old voice integration system
				window.dispatchEvent(
					new CustomEvent('disable-old-voice-integration', {
						detail: { disable: true },
					}),
				);

				// Set up voice integration data AND show widget for LiveKit connection
				// The widget will be hidden but LiveKit room will be active
				updateAiSetupState({
					showVoiceWidget: true, // Need this for LiveKit room connection
					notchDropVoiceActive: true, // Flag to indicate NotchDrop is controlling voice
				});

				// Use the voice integration hook to handle connection
				await handleConnect();

				console.log('✅ NotchDrop Voice Activator: LiveKit voice integration triggered');
			} else {
				console.log('🔄 NotchDrop Voice Activator: Voice integration already active');
			}
		};

		const handleNotchDropVoiceDeactivation = (event) => {
			console.log('🔌 NotchDrop Voice Activator: Received deactivation event:', event.detail);

			// Deactivate LiveKit voice integration
			if (shouldConnect || voiceIntegrationData?.shouldConnect) {
				console.log('🛑 NotchDrop Voice Activator: Stopping LiveKit voice integration...');

				// Use the voice integration hook to handle disconnection
				voiceIntegrationDisconnect();

				// Hide voice widget and clear NotchDrop voice flag
				updateAiSetupState({
					showVoiceWidget: false,
					notchDropVoiceActive: false, // Clear NotchDrop control flag
				});

				// Re-enable old voice integration system
				window.dispatchEvent(
					new CustomEvent('disable-old-voice-integration', {
						detail: { disable: false },
					}),
				);

				console.log('✅ NotchDrop Voice Activator: Voice deactivated');
			}
		};

		const handleNotchDropMicrophoneToggle = (event) => {
			console.log(
				'🔇 NotchDrop Voice Activator: Received microphone toggle event:',
				event.detail,
			);

			// Dispatch a custom event that the LiveKit components can listen to
			window.dispatchEvent(
				new CustomEvent('livekit-toggle-microphone', {
					detail: {
						source: 'notchdrop',
						timestamp: Date.now(),
					},
				}),
			);

			console.log('✅ NotchDrop Voice Activator: LiveKit microphone toggle event dispatched');
		};

		// Listen for custom events from NotchDrop
		window.addEventListener('notchdrop-activate-voice', handleNotchDropVoiceActivation);
		window.addEventListener('notchdrop-deactivate-voice', handleNotchDropVoiceDeactivation);
		window.addEventListener('notchdrop-toggle-microphone', handleNotchDropMicrophoneToggle);

		// Listen for IPC events from NotchDrop (fallback)
		if (window.electronApi && window.electronApi.ipcRenderer) {
			const handleIpcVoiceActivation = (event, data) => {
				console.log('📞 NotchDrop Voice Activator: Received IPC activation:', data);
				handleNotchDropVoiceActivation({ detail: data });
			};

			const handleIpcVoiceDeactivation = (event, data) => {
				console.log('📞 NotchDrop Voice Activator: Received IPC deactivation:', data);
				handleNotchDropVoiceDeactivation({ detail: data });
			};

			window.electronApi.ipcRenderer.on('notchdrop:showVoiceAgent', handleIpcVoiceActivation);
			window.electronApi.ipcRenderer.on(
				'notchdrop:hideVoiceAgent',
				handleIpcVoiceDeactivation,
			);

			// Cleanup IPC listeners
			return () => {
				window.removeEventListener(
					'notchdrop-activate-voice',
					handleNotchDropVoiceActivation,
				);
				window.removeEventListener(
					'notchdrop-deactivate-voice',
					handleNotchDropVoiceDeactivation,
				);
				window.removeEventListener(
					'notchdrop-toggle-microphone',
					handleNotchDropMicrophoneToggle,
				);

				if (window.electronApi && window.electronApi.ipcRenderer) {
					window.electronApi.ipcRenderer.removeListener(
						'notchdrop:showVoiceAgent',
						handleIpcVoiceActivation,
					);
					window.electronApi.ipcRenderer.removeListener(
						'notchdrop:hideVoiceAgent',
						handleIpcVoiceDeactivation,
					);
				}
			};
		}

		// Cleanup event listeners
		return () => {
			window.removeEventListener('notchdrop-activate-voice', handleNotchDropVoiceActivation);
			window.removeEventListener(
				'notchdrop-deactivate-voice',
				handleNotchDropVoiceDeactivation,
			);
			window.removeEventListener(
				'notchdrop-toggle-microphone',
				handleNotchDropMicrophoneToggle,
			);
		};
	}, [updateAiSetupState, voiceIntegrationData]);

	// This component doesn't render anything - it's just for event handling
	return null;
};

export default NotchDropVoiceActivator;
