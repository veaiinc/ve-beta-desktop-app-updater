/**
 * NotchDrop Voice Integration Hook
 *
 * This hook integrates NotchDrop Voice button with your existing voice agent system
 */

import { useEffect, useContext, useState } from 'react';
import { useVoiceAgent } from '../views/features/voiceAgent/useVoiceAgent';
import Context from '../context/context';

export const useNotchDropVoiceIntegration = () => {
	const [isNotchDropVoiceActive, setIsNotchDropVoiceActive] = useState(false);
	const [voiceAgentVisible, setVoiceAgentVisible] = useState(false);

	// Get your existing voice agent hook
	const userToken = localStorage.getItem('usertoken');
	const voiceAgent = useVoiceAgent(userToken);

	const {
		aiSetup: { updateAiSetupState },
	} = useContext(Context);

	useEffect(() => {
		// Listen for NotchDrop voice activation
		const handleNotchDropVoiceShow = (event) => {
			console.log('🎤 NotchDrop requested voice agent activation:', event.detail);
			activateVoiceAgent();
		};

		const handleNotchDropVoiceHide = (event) => {
			console.log('🎤 NotchDrop requested voice agent deactivation');
			deactivateVoiceAgent();
		};

		// Listen for IPC events from NotchDrop
		if (window.electronApi && window.electronApi.ipcRenderer) {
			// Set up the listener directly without modifying electronApi
			const handleVoiceAgentShow = (event, data) => {
				console.log('📞 IPC: NotchDrop requested voice agent activation');
				activateVoiceAgent();
			};

			window.electronApi.ipcRenderer.on('notchdrop:showVoiceAgent', handleVoiceAgentShow);

			// Cleanup function for the IPC listener
			return () => {
				if (window.electronApi && window.electronApi.ipcRenderer) {
					window.electronApi.ipcRenderer.removeListener(
						'notchdrop:showVoiceAgent',
						handleVoiceAgentShow,
					);
				}
			};
		}

		// Listen for custom events
		window.addEventListener('show-voice-agent', handleNotchDropVoiceShow);
		window.addEventListener('hide-voice-agent', handleNotchDropVoiceHide);
		window.addEventListener('notchdrop-voice-activate', handleNotchDropVoiceShow);

		return () => {
			window.removeEventListener('show-voice-agent', handleNotchDropVoiceShow);
			window.removeEventListener('hide-voice-agent', handleNotchDropVoiceHide);
			window.removeEventListener('notchdrop-voice-activate', handleNotchDropVoiceShow);
		};
	}, []);

	const activateVoiceAgent = async () => {
		try {
			console.log('🎤 Activating voice agent from NotchDrop trigger...');

			setIsNotchDropVoiceActive(true);
			setVoiceAgentVisible(true);

			// Update AI setup state to show voice is active
			updateAiSetupState({
				isVoiceIntegrationActive: true,
				voiceTriggeredBy: 'notchdrop',
			});

			// Connect to your existing voice agent
			if (!voiceAgent.isConnected && !voiceAgent.isConnecting) {
				console.log('📞 Starting voice agent connection...');
				await voiceAgent.connectAndStart();
			}

			console.log('✅ Voice agent activated from NotchDrop');
		} catch (error) {
			console.error('❌ Error activating voice agent:', error);
		}
	};

	const deactivateVoiceAgent = async () => {
		try {
			console.log('🎤 Deactivating voice agent from NotchDrop...');

			setIsNotchDropVoiceActive(false);
			setVoiceAgentVisible(false);

			// Disconnect voice agent
			if (voiceAgent.isConnected) {
				await voiceAgent.disconnect();
			}

			// Update AI setup state
			updateAiSetupState({
				isVoiceIntegrationActive: false,
				voiceTriggeredBy: null,
			});

			console.log('✅ Voice agent deactivated from NotchDrop');
		} catch (error) {
			console.error('❌ Error deactivating voice agent:', error);
		}
	};

	return {
		isNotchDropVoiceActive,
		voiceAgentVisible,
		voiceAgent,
		activateVoiceAgent,
		deactivateVoiceAgent,
	};
};

export default useNotchDropVoiceIntegration;
