import React, { useCallback, useEffect, useState } from 'react';
import '../../../assets/scss/chat/voice.scss';
import { ReactComponent as PauseSvg } from '../../../assets/svg/ai_agents/pause.svg';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as VoiceSvg } from '../../../assets/svg/ai_agents/voice.svg';
import { ReactComponent as VoiceLightSvg } from '../../../assets/svg/ai_agents/voice-light.svg';
import { ReactComponent as VoiceMuteSvg } from '../../../assets/svg/ai_agents/voice-mute.svg';
import { ConnectionState, LocalParticipant, Track } from 'livekit-client';
import useUpdatedVoiceIntegration from '../../hooks/useUpdatedVoiceIntegration';
import { message } from 'antd';
import {
	BarVisualizer,
	VideoTrack,
	useConnectionState,
	useDataChannel,
	useLocalParticipant,
	useRoomInfo,
	useTracks,
	useVoiceAssistant,
	useRoomContext,
} from '@livekit/components-react';

const Voice = ({ shouldConnect, token, serverUrl, handleDisconnect }) => {
	const { name } = useRoomInfo();
	const [transcripts, setTranscripts] = useState([]);
	const { localParticipant } = useLocalParticipant();

	const voiceAssistant = useVoiceAssistant();

	const roomState = useConnectionState();
	const tracks = useTracks();
	const room = useRoomContext();

	useEffect(() => {
		if (roomState === ConnectionState.Connected) {
			localParticipant.setMicrophoneEnabled(true);
		}
	}, [localParticipant, roomState]);

	const localTracks = tracks.filter(({ participant }) => participant instanceof LocalParticipant);
	const localVideoTrack = localTracks.find(({ source }) => source === Track.Source.Camera);
	const localMicTrack = localTracks.find(({ source }) => source === Track.Source.Microphone);

	const onDataReceived = useCallback(
		(msg) => {
			if (msg.topic === 'transcription') {
				const decoded = JSON.parse(new TextDecoder('utf-8').decode(msg.payload));
				let timestamp = new Date().getTime();
				if ('timestamp' in decoded && decoded.timestamp > 0) {
					timestamp = decoded.timestamp;
				}
				setTranscripts([
					...transcripts,
					{
						name: 'You',
						message: decoded.text,
						timestamp: timestamp,
						isSelf: true,
					},
				]);
			}
		},
		[transcripts],
	);

	useDataChannel(onDataReceived);

	console.log('name==>', name, transcripts, localParticipant);
	return (
		<div className="voiceIntegrationContainer">
			{/* <div className="voiceIntegrationText">Speak I am Listening</div> */}
			<div className="voiceIntegrationIconsContainer">
				{/* <div className="icon-container" onClick={handleToggleMute}>
						{isVoiceMuted ? <VoiceMuteSvg /> : <VoiceLightSvg />}
					</div> */}
				<div className="speaking-icon-container">
					<div className="voice-container">
						<img
							src={'https://ap.assets.ve.ai/logo/speaking%20final.gif'}
							width={'40px'}
							height={'40px'}
							style={{ marginBottom: '12px' }}
						/>
					</div>
				</div>
				<div className="icon-container" onClick={handleDisconnect}>
					<CloseSvg />
				</div>
			</div>
		</div>
	);
};

export default Voice;
