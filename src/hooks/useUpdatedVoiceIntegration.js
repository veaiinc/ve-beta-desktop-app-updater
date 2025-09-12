import { useCallback, useContext, useEffect, useState } from 'react';
import Context from '../context/context';
import getBaseUrl from '../services/baseUrls';

const voiceAgentBaseUrl = getBaseUrl({ region: 'us-east-1', type: 'voice_agent_api' });

const useUpdatedVoiceIntegration = () => {
	const [shouldConnect, setShouldConnect] = useState(false);
	const [token, setToken] = useState('');
	const [serverUrl, setServerUrl] = useState(voiceAgentBaseUrl);

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
		const locationDetails = JSON.parse(localStorage.getItem('locationDetails'));
		const response = await getTokenForVoice({ location: locationDetails });

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
