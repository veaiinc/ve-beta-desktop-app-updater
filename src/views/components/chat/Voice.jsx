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
	TrackToggle,
	BarVisualizer,
	VideoTrack,
	useConnectionState,
	useDataChannel,
	useLocalParticipant,
	useRoomInfo,
	useTracks,
	useVoiceAssistant,
	useRoomContext,
	useTrackToggle,
	useTrackTranscription,
} from '@livekit/components-react';
import { useKrispNoiseFilter } from '@livekit/components-react/krisp';
const Voice = ({ shouldConnect, token, serverUrl, handleDisconnect }) => {
	const { name } = useRoomInfo();
	const [transcripts, setTranscripts] = useState(new Map());
	const localdata = useLocalParticipant();
	const { localParticipant } = localdata;
	const [transScriptMessages, setTransScriptMessages] = useState([]);
	const voiceAssistant = useVoiceAssistant();
	const krisp = useKrispNoiseFilter();
	const roomState = useConnectionState();
	const tracks = useTracks();

	// tracks?.setMediaStreamTrack(
	// 	new MediaStreamTrack({
	// 		echoCancellation: true,
	// 		noiseSuppression: true,
	// 		autoGainControl: true,
	// 	}),
	// );
	const room = useRoomContext();

	const localTracks = tracks.filter(({ participant }) => participant instanceof LocalParticipant);
	const localVideoTrack = localTracks.find(({ source }) => source === Track.Source.Camera);
	const localMicTrack = localTracks.find(({ source }) => source === Track.Source.Microphone);

	const agentMessages = useTrackTranscription(voiceAssistant.audioTrack);
	const localMessages = useTrackTranscription({
		publication: localdata.microphoneTrack,
		source: Track.Source.Microphone,
		participant: localParticipant,
	});

	useEffect(() => {
		if (roomState === ConnectionState.Connected) {
			localParticipant.setMicrophoneEnabled(true);
		}
	}, [localParticipant, roomState]);

	useEffect(() => {
		krisp.setNoiseFilterEnabled(true);
	}, []);

	useEffect(() => {
		if (voiceAssistant.state === 'disconnected') {
			return;
		}
		if (voiceAssistant.state === 'speaking') {
			transcripts.clear();
			setTransScriptMessages([]);
			return;
		}
		// agentMessages.segments.forEach((s) =>
		// 	transcripts.set(
		// 		s.id,
		// 		segmentToChatMessage(
		// 			s,
		// 			transcripts.get(s.id),
		// 			voiceAssistant?.audioTrack?.participant,
		// 		),
		// 	),
		// );
		localMessages.segments.forEach((s) =>
			transcripts.set(s.id, segmentToChatMessage(s, transcripts.get(s.id), localParticipant)),
		);

		const allMessages = Array.from(transcripts.values());
		allMessages.sort((a, b) => a.timestamp - b.timestamp);
		setTransScriptMessages(allMessages);
	}, [voiceAssistant, localParticipant, agentMessages?.segments, localMessages?.segments]);

	return (
		<div className="voiceIntegrationContainer">
			<div className="voiceIntegrationIconsContainer">
				<TrackToggle
					className="px-2 py-1 bg-gray-900 text-gray-300 border border-gray-800 rounded-sm hover:bg-gray-800 chat-mic-icon-container icon-container"
					source={Track.Source.Microphone}
					style={{ border: 'none' }}
				/>

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

function segmentToChatMessage(s, existingMessage, participant) {
	const msg = {
		message: s.final ? s.text : `${s.text} ...`,
		name: participant instanceof LocalParticipant ? 'You' : 'Agent',
		isSelf: participant instanceof LocalParticipant,
		timestamp: existingMessage?.timestamp ?? Date.now(),
	};
	return msg;
}
