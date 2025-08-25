import { useCallback, useContext, useEffect, useState } from 'react';
import Context from '../context/context';
import { generate_voice_agent_token_api } from '../services/config.live';

const useUpdatedVoiceIntegration = () => {
	const [shouldConnect, setShouldConnect] = useState(false);
	const [token, setToken] = useState('');
	const [serverUrl, setServerUrl] = useState('wss://ve-voice-agent-g4ptyv6v.livekit.cloud');

	let {
		aiSetup: { getTokenForVoice, updateAiSetupState, triggerVoiceDisconnect },
	} = useContext(Context);

	useEffect(() => {
		if (triggerVoiceDisconnect) {
			handleDisconnect();
			updateAiSetupState({ triggerVoiceDisconnect: null });
		}
	}, [triggerVoiceDisconnect]);

	const fetchToken = useCallback(async () => {
		const response = await getTokenForVoice({ timezone: 'Asia/Calcutta' });

		const token = response?.session_info?.user_token || response?.token || response;
		const url = response?.session_info?.url || response?.url || serverUrl;

		setToken(token);
		if (url && url !== serverUrl) {
			setServerUrl(url);
		}
		return token;
	}, [getTokenForVoice, serverUrl]);

	const handleConnect = useCallback(async () => {
		if (!shouldConnect) {
			const fetchedToken = await fetchToken();
			setShouldConnect(true);
			updateAiSetupState({
				voiceIntegrationData: {
					token: fetchedToken,
					serverUrl, // This will be the updated serverUrl from fetchToken
					shouldConnect: true,
				},
			});
		}
	}, [fetchToken, serverUrl, shouldConnect, updateAiSetupState]);

	const handleDisconnect = useCallback(() => {
		if (shouldConnect) {
			setShouldConnect(false);
			updateAiSetupState({
				voiceIntegrationData: null,
			});
		}
	}, [shouldConnect]);

	return { shouldConnect, token, serverUrl, handleConnect, handleDisconnect };
};

export default useUpdatedVoiceIntegration;
