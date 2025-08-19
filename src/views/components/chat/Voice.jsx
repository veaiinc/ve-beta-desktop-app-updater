import React, { useCallback, useEffect, useState, useRef, useContext } from 'react';
import '../../../assets/scss/chat/voice.scss';
// import { ReactComponent as PauseSvg } from '../../../assets/svg/ai_agents/pause.svg';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
// import { ReactComponent as VoiceSvg } from '../../../assets/svg/ai_agents/voice.svg';
// import { ReactComponent as VoiceLightSvg } from '../../../assets/svg/ai_agents/voice-light.svg';
// import { ReactComponent as VoiceMuteSvg } from '../../../assets/svg/ai_agents/voice-mute.svg';
import { ReactComponent as UserSoundSvg } from '../../../assets/svg/chat/UserSound.svg';
import { ConnectionState, LocalParticipant, Track } from 'livekit-client';
import {
	TrackToggle,
	VideoTrack,
	useConnectionState,
	useLocalParticipant,
	useRoomInfo,
	useTracks,
	useVoiceAssistant,
	useRoomContext,
	useTrackTranscription,
} from '@livekit/components-react';
import { useKrispNoiseFilter } from '@livekit/components-react/krisp';
// import webgazer from 'webgazer';
import { throttle } from 'lodash';
import Context from '../../../context/context';
import useUpdatedVoiceIntegration from '../../../hooks/useUpdatedVoiceIntegration';
// window.webgazer = webgazer;
const Voice = ({ handleDisconnect, deviceInfo }) => {
	const { name = '' } = useRoomInfo();
	const [transcripts, setTranscripts] = useState(new Map());
	const localdata = useLocalParticipant();
	const { localParticipant } = localdata;
	const [transScriptMessages, setTransScriptMessages] = useState([]);
	const voiceAssistant = useVoiceAssistant();
	const krisp = useKrispNoiseFilter();
	const roomState = useConnectionState();
	const tracks = useTracks();
	const room = useRoomContext();
	const micBtnRef = useRef(null);
	
	// Add voice integration hook
	const { shouldConnect, token, serverUrl, handleConnect, handleDisconnect: voiceIntegrationDisconnect } = useUpdatedVoiceIntegration();
	
	const {
		aiSetup: { updateAiSetupState, voiceIntegrationData },
	} = useContext(Context);
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
			localParticipant.setMicrophoneEnabled(true, {
				sampleRate: 48000, // Best for speech clarity
				sampleSize: 16, // Standard bit depth
				noiseSuppression: true,
				autoGainControl: true,
				echoCancellation: true,
				voiceIsolation: true,
			});
			// if (deviceInfo?.hasCamera) {
			// 	localParticipant.setCameraEnabled(true);
			// }
			// handleWebgazer();
		}
	}, [localParticipant, roomState, deviceInfo]);

	useEffect(() => {
		krisp.setNoiseFilterEnabled(true);
	}, []);

	// Auto-connect when component mounts (triggered from ChatBox voice-agent-btn)
	useEffect(() => {
		if (!shouldConnect && !voiceIntegrationData?.shouldConnect) {
			handleConnect();
		}
	}, [shouldConnect, voiceIntegrationData, handleConnect]);

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

		// Add agent messages
		agentMessages.segments?.forEach((s) => {
			newTranscripts.set(
				s.id,
				segmentToChatMessage(
					s,
					transcripts.get(s.id),
					voiceAssistant.audioTrack?.participant,
				),
			);
		});

		setTranscripts(newTranscripts);

		const allMessages = Array.from(newTranscripts.values());
		allMessages.sort((a, b) => a.timestamp - b.timestamp);
		setTransScriptMessages(allMessages);
	}, [
		voiceAssistant.state,
		localParticipant,
		localMessages.segments,
		voiceAssistant.audioTrack?.participant,
	]);

	// const handleWebgazer = useCallback(() => {
	// 	if (webgazer) {
	// 		const throttledGazeListener = throttle(async (data) => {
	// 			const isEnabled = micBtnRef.current.dataset.lkEnabled;

	// 			if (data && data.x !== null && data.y !== null) {
	// 				// Get face prediction asynchronously

	// 				const facePrediction = await webgazer.getCurrentPrediction();
	// 				if (facePrediction && facePrediction.eyeFeatures) {
	// 					const leftEye = facePrediction.eyeFeatures.left;
	// 					const rightEye = facePrediction.eyeFeatures.right;
	// 					// Ensure both eyes are detected and have a reasonable width
	// 					const bothEyesDetected =
	// 						leftEye && rightEye && leftEye.width > 10 && rightEye.width > 10;
	// 					if (!bothEyesDetected) {
	// 						//'User is NOT looking at the screen (one or both eyes not detected)',

	// 						if (isEnabled === 'true') {
	// 							micBtnRef?.current?.click();
	// 							micBtnRef.current.dataset.lkEnabled = 'false';
	// 							return;
	// 						}
	// 					}
	// 					const { x, y } = facePrediction;
	// 					// Check if the gaze is within screen bounds
	// 					if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) {
	// 						// User looking at the screen but out of bounds

	// 						if (isEnabled === 'false') {
	// 							micBtnRef?.current?.click();
	// 							micBtnRef.current.dataset.lkEnabled = 'true';
	// 							return;
	// 						}
	// 					} else {
	// 						//'User is looking at the screen

	// 						if (isEnabled === 'false') {
	// 							micBtnRef?.current?.click();
	// 							micBtnRef.current.dataset.lkEnabled = 'true';
	// 							return;
	// 						}
	// 					}
	// 				} else {
	// 					//'User is NOT looking at the screen facePrediction'

	// 					if (isEnabled === 'true') {
	// 						micBtnRef?.current?.click();
	// 						micBtnRef.current.dataset.lkEnabled = 'false';
	// 						return;
	// 					}
	// 				}
	// 			} else {
	// 				//'User is NOT looking at the screen'

	// 				if (isEnabled === 'true') {
	// 					micBtnRef?.current?.click();
	// 					micBtnRef.current.dataset.lkEnabled = 'false';
	// 					return;
	// 				}
	// 			}
	// 		}, 1000);
	// 		webgazer.setGazeListener(throttledGazeListener).begin();
	// 		// Hide UI elements
	// 		webgazer.showVideo(false);
	// 		webgazer.showFaceOverlay(false);
	// 		webgazer.showFaceFeedbackBox(false);
	// 		webgazer.showPredictionPoints(false);
	// 		// Debugging: Ensure WebGazer is tracking properly
	// 		setTimeout(() => {
	// 			webgazer.getCurrentPrediction().then((prediction) => {
	// 				if (!prediction) {
	// 					console.warn('WebGazer is not detecting gaze properly.');
	// 				}
	// 			});
	// 		}, 3000);
	// 	}
	// }, [webgazer, micBtnRef]);

	const customDisconnect = useCallback(() => {
		// webgazer.stopVideo();
		// webgazer.clearGazeListener();
		// webgazer.end();

		// Use voice integration disconnect and hide the voice widget
		voiceIntegrationDisconnect();
		updateAiSetupState({ showVoiceWidget: false });
		
		if (handleDisconnect) {
			handleDisconnect();
		}
	}, [
		voiceIntegrationDisconnect,
		updateAiSetupState,
		handleDisconnect,
		//  webgazer
	]);

	const getStatusText = () => {
		// If voice integration is not connected, show connection status
		if (!shouldConnect) {
			return 'Connecting...';
		}

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
		return shouldConnect && voiceAssistant.state !== 'disconnected' && voiceAssistant.state !== 'connecting';
	};

	const getStateClass = () => {
		if (localParticipant?.isSpeaking) return 'user-speaking';
		return voiceAssistant.state || '';
	};

	const getLatestMessage = () => {
		if (transScriptMessages.length === 0) {
			return null;
		}
		return transScriptMessages[transScriptMessages.length - 1];
	};

	const getDisplayText = () => {
		const latestMessage = getLatestMessage();
		if (latestMessage) {
			return `${latestMessage.name}: ${latestMessage.message}`;
		}
		return getStatusText();
	};

	return (
		<div className={`voice-input-container ${getStateClass()}`}>
			<div className="input-area">
				<UserSoundSvg className="voice-icon" />
				<span className="placeholder">{getDisplayText()}</span>
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

			{/* {localVideoTrack && (
				<VideoTrack
					trackRef={localVideoTrack}
					className={`absolute top-1/2 -translate-y-1/2 object-position-center w-full h-full`}
				/>
			)} */}

			<div className="controls">
				{/* Show mic toggle when connected */}
				{shouldConnect && (
					<TrackToggle
						className="px-2 py-1 bg-gray-900 text-gray-300 border border-gray-800 rounded-sm hover:bg-gray-800 chat-mic-icon-container icon-container custom-mic-button-toggle"
						source={Track.Source.Microphone}
						style={{ border: 'none' }}
						ref={micBtnRef}
					/>
				)}
				
				{/* <TrackToggle
					className="px-2 py-1 bg-gray-900 text-gray-300 border border-gray-800 rounded-sm hover:bg-gray-800 chat-mic-icon-container icon-container"
					source={Track.Source.Camera}
					style={{ border: 'none' }}
				/> */}

				<button className="cancel-button" onClick={customDisconnect}>
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
