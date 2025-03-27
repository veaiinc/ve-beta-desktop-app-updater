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
			setTranscripts(new Map());
			setTransScriptMessages([]);
			return;
		}

		const newTranscripts = new Map(transcripts);

		localMessages.segments?.forEach((s) => {
			newTranscripts.set(
				s.id,
				segmentToChatMessage(s, transcripts.get(s.id), localParticipant),
			);
		});

		setTranscripts(newTranscripts);

		const allMessages = Array.from(newTranscripts.values());
		allMessages.sort((a, b) => a.timestamp - b.timestamp);
		setTransScriptMessages(allMessages);
	}, [voiceAssistant.state, localParticipant, localMessages.segments]);
	const getStatusText = () => {
		if (localParticipant?.isSpeaking) {
			return 'Listening to you...';
		}

		switch (voiceAssistant.state) {
			case 'disconnected':
				return 'Click mic to start';
			case 'connecting':
				return 'Connecting...';
			case 'initializing':
				return 'Initializing...';
			case 'listening':
				return 'Listening...';
			case 'thinking':
				return 'Thinking...';
			case 'speaking':
				return 'Speaking...';
			default:
				return 'Speak I am listening';
		}
	};

	const shouldShowAnimation = () => {
		return voiceAssistant.state !== 'disconnected' && voiceAssistant.state !== 'connecting';
	};

	const getStateClass = () => {
		if (localParticipant?.isSpeaking) return 'user-speaking';
		return voiceAssistant.state || '';
	};

	const getMicIcon = () => {
		const isEnabled = localMicTrack?.publication?.isEnabled;
		return isEnabled ? <VoiceSvg className="mic-icon" /> : <></>;
	};
	return (
		<div className={`voice-input-container ${getStateClass()}`}>
			<div className="input-area">
				<VoiceLightSvg className="voice-icon" />
				<span className="placeholder">{getStatusText()}</span>
			</div>

			{shouldShowAnimation() && (
				<div className="animation-container">
					<div className="state-label">{getStatusText()}</div>
					<div className="voice-animation">
						<img
							src={'https://ap.assets.ve.ai/logo/speaking%20final.gif'}
							width={'40px'}
							height={'40px'}
							alt="Speaking animation"
						/>
					</div>
				</div>
			)}

			<div className="controls">
				<TrackToggle
					className="px-2 py-1 bg-gray-900 text-gray-300 border border-gray-800 rounded-sm hover:bg-gray-800 chat-mic-icon-container icon-container"
					source={Track.Source.Microphone}
					style={{ border: 'none' }}
				/>

				<button className="cancel-button" onClick={handleDisconnect}>
					<CloseSvg className="cancel-icon" />
				</button>
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
