import { useCallback, useContext, useEffect, useState } from 'react';
import Context from '../../context/context';

const useUpdatedVoiceIntegration = () => {
	const [shouldConnect, setShouldConnect] = useState(false);
	const [token, setToken] = useState('');
	const [serverUrl, setServerUrl] = useState('wss://veai-naymm7ww.livekit.cloud');

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
		const { token } = await getTokenForVoice();
		setToken(token);
		return token;
	}, []);

	const handleConnect = useCallback(async () => {
		if (!shouldConnect) {
			const token = await fetchToken();
			setShouldConnect(true);
			updateAiSetupState({
				voiceIntegrationData: {
					token,
					serverUrl,
					shouldConnect: true,
				},
			});
		}
	}, [token, serverUrl, shouldConnect]);

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
