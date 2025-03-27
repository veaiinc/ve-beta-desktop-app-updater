import React, { memo, useContext, useCallback } from 'react';
import { LiveKitRoom, RoomAudioRenderer, StartAudio } from '@livekit/components-react';
import Voice from '../components/chat/Voice';
import Context from '../../context/context';
import { message } from 'antd';
import '../../assets/scss/voice/voiceWrapper.scss';

const VoiceWrapper = () => {
	let {
		aiSetup: { updateAiSetupState, voiceIntegrationData },
	} = useContext(Context);

	const customDisconnetFunc = useCallback(() => {
		if (voiceIntegrationData?.shouldConnect) {
			updateAiSetupState({
				voiceIntegrationData: null,
			});
		}
	}, [voiceIntegrationData]);

	return (
		<div
			className={`voiceContainer ${
				voiceIntegrationData?.shouldConnect ? 'active' : 'inactive'
			}`}
		>
			<LiveKitRoom
				className="flex flex-col h-full w-full"
				serverUrl={voiceIntegrationData?.serverUrl || ''}
				token={voiceIntegrationData?.token || ''}
				connect={voiceIntegrationData?.shouldConnect || false}
				onError={(e) => {
					message.error(e.message);
					console.error(e);
				}}
			>
				<Voice handleDisconnect={customDisconnetFunc} />
				<RoomAudioRenderer />
				<StartAudio label="Click to enable audio playback" />
			</LiveKitRoom>
		</div>
	);
};

export default memo(VoiceWrapper);
