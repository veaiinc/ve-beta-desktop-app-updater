import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Room, RoomEvent, createLocalTracks } from 'livekit-client';
import Context from '../../context/context';
import { message } from 'antd';

const useUpdatedVoiceIntegration = () => {
	const [shouldConnect, setShouldConnect] = useState(false);
	const [token, setToken] = useState('');
	const [serverUrl, setServerUrl] = useState('wss://veai-naymm7ww.livekit.cloud');

	let {
		aiSetup: { getTokenForVoice, updateAiSetupState },
	} = useContext(Context);

	const fetchToken = useCallback(async () => {
		const { token } = await getTokenForVoice();
		setToken(token);
	}, []);

	const handleConnect = useCallback(async () => {
		if (!shouldConnect) {
			await fetchToken();
			setShouldConnect(true);
		}
	}, [token]);

	const handleDisconnect = useCallback(() => {
		if (shouldConnect) {
			setShouldConnect(false);
		}
	}, [shouldConnect]);

	return { shouldConnect, token, serverUrl, handleConnect, handleDisconnect };
};

export default useUpdatedVoiceIntegration;
