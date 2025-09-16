import { useEffect, useCallback, useState } from 'react';
import {
	useTrackTranscription,
	useVoiceAssistant,
	useLocalParticipant,
	useTracks,
	useConnectionState,
} from '@livekit/components-react';
import { ConnectionState, LocalParticipant, Track } from 'livekit-client';

/**
 * NotchDrop LiveKit Integration Component
 *
 * This component integrates LiveKit's voice transcription with NotchDrop
 * to show real-time conversation text in the NotchDrop interface.
 */
const NotchDropLiveKitIntegration = () => {
	const [transcripts, setTranscripts] = useState(new Map());
	const [lastSentMessages, setLastSentMessages] = useState([]);
	const [isMicrophoneMuted, setIsMicrophoneMuted] = useState(false);

	// LiveKit hooks
	const voiceAssistant = useVoiceAssistant();
	const { localParticipant } = useLocalParticipant();
	const tracks = useTracks();
	const roomState = useConnectionState();

	// Get local microphone track for user transcription
	const localTracks = tracks.filter(({ participant }) => participant instanceof LocalParticipant);
	const localMicTrack = localTracks.find(({ source }) => source === Track.Source.Microphone);

	// Get transcriptions
	const agentMessages = useTrackTranscription(voiceAssistant.audioTrack);
	const localMessages = useTrackTranscription(localMicTrack);

	// Debug transcription data
	if (agentMessages.segments?.length > 0) {
		console.log('🤖 AGENT TRANSCRIPTION:', agentMessages.segments);
	}
	if (localMessages.segments?.length > 0) {
		console.log('🎤 USER TRANSCRIPTION:', localMessages.segments);
	}

	// Convert LiveKit segment to NotchDrop message format
	const segmentToChatMessage = useCallback((segment, existingMessage, participant) => {
		return {
			id: segment.id,
			sender: participant instanceof LocalParticipant ? 'You' : 'AI Agent',
			content: segment.final ? segment.text : `${segment.text}...`,
			isFromAgent: !(participant instanceof LocalParticipant),
			timestamp: existingMessage?.timestamp ?? Date.now(),
			isFinal: segment.final,
		};
	}, []);

	// Send message to NotchDrop
	const sendToNotchDrop = useCallback(async (messageData) => {
		try {
			if (window.electronApi && window.electronApi.notchdrop) {
				console.log(
					'📤 SENDING TO NOTCHDROP:',
					messageData.sender,
					':',
					messageData.content,
				);
				const result = await window.electronApi.notchdrop.addVoiceMessage(messageData);
				console.log('✅ NotchDrop message sent successfully:', result);
			} else {
				console.warn('⚠️ NotchDrop API not available');
			}
		} catch (error) {
			console.error('❌ Error sending message to NotchDrop:', error);
		}
	}, []);

	// Process transcription updates
	useEffect(() => {
		console.log('🎤 NotchDrop LiveKit Integration - Processing transcription updates...');
		console.log(
			'🎤 NotchDrop LiveKit Integration - Voice Assistant State:',
			voiceAssistant.state,
		);
		console.log('🎤 NotchDrop LiveKit Integration - Room State:', roomState);

		if (voiceAssistant.state === 'disconnected') {
			console.log(
				'🎤 NotchDrop LiveKit Integration - Voice assistant disconnected, skipping transcription processing',
			);
			return;
		}

		// Clear transcripts when agent starts speaking (new conversation turn)
		if (voiceAssistant.state === 'speaking') {
			setTranscripts(new Map());
			return;
		}

		const newTranscripts = new Map(transcripts);
		let hasNewMessages = false;

		// Process local (user) messages
		console.log(
			'🎤 NotchDrop LiveKit Integration - Processing local messages, segments count:',
			localMessages.segments?.length || 0,
		);
		localMessages.segments?.forEach((segment) => {
			console.log('🎤 NotchDrop LiveKit Integration - Processing local segment:', segment);
			const chatMessage = segmentToChatMessage(
				segment,
				transcripts.get(segment.id),
				localParticipant,
			);
			const existingMessage = newTranscripts.get(segment.id);

			// Only update if content changed or it's a new message
			if (!existingMessage || existingMessage.content !== chatMessage.content) {
				newTranscripts.set(segment.id, chatMessage);
				hasNewMessages = true;
				console.log('📝 Updated local transcript:', chatMessage);
			}
		});

		// Process agent messages
		agentMessages.segments?.forEach((segment) => {
			const chatMessage = segmentToChatMessage(
				segment,
				transcripts.get(segment.id),
				voiceAssistant.audioTrack?.participant,
			);
			const existingMessage = newTranscripts.get(segment.id);

			// Only update if content changed or it's a new message
			if (!existingMessage || existingMessage.content !== chatMessage.content) {
				newTranscripts.set(segment.id, chatMessage);
				hasNewMessages = true;
				console.log('📝 Updated agent transcript:', chatMessage);
			}
		});

		if (hasNewMessages) {
			setTranscripts(newTranscripts);

			// Convert to array and sort by timestamp
			const allMessages = Array.from(newTranscripts.values());
			allMessages.sort((a, b) => a.timestamp - b.timestamp);

			console.log('📋 All transcript messages:', allMessages);

			// Send new/updated messages to NotchDrop (only final transcriptions)
			allMessages.forEach((message) => {
				const lastSent = lastSentMessages.find((m) => m.id === message.id);

				// Only send final transcriptions to avoid duplicates
				if (message.isFinal && (!lastSent || lastSent.content !== message.content)) {
					console.log(
						'📤 Sending FINAL transcription to NotchDrop:',
						message.sender,
						':',
						message.content,
					);
					sendToNotchDrop(message);
				}
			});

			// Update last sent messages
			setLastSentMessages(allMessages);
		}
	}, [
		voiceAssistant.state,
		localParticipant,
		localMessages.segments,
		agentMessages.segments,
		voiceAssistant.audioTrack?.participant,
		transcripts,
		segmentToChatMessage,
		sendToNotchDrop,
		lastSentMessages,
	]);

	// Listen for microphone toggle events from NotchDrop
	useEffect(() => {
		const handleMicrophoneToggle = async (event) => {
			console.log(
				'🔇 NotchDrop LiveKit Integration: Received microphone toggle event:',
				event.detail,
			);

			if (localParticipant && roomState === ConnectionState.Connected) {
				try {
					const newMuteState = !isMicrophoneMuted;

					// Toggle microphone using LiveKit's setMicrophoneEnabled
					await localParticipant.setMicrophoneEnabled(!newMuteState);
					setIsMicrophoneMuted(newMuteState);

					console.log(
						`🔇 NotchDrop LiveKit Integration: Microphone ${
							newMuteState ? 'muted' : 'unmuted'
						}`,
					);

					// Update NotchDrop Swift UI with the new mute state
					if (window.electronApi?.notchdrop?.updateVoiceMuteState) {
						await window.electronApi.notchdrop.updateVoiceMuteState(newMuteState);
					}
				} catch (error) {
					console.error('❌ Error toggling microphone:', error);
				}
			} else {
				console.warn('⚠️ Cannot toggle microphone: not connected or no local participant');
			}
		};

		// Listen for the microphone toggle event
		window.addEventListener('livekit-toggle-microphone', handleMicrophoneToggle);

		// Cleanup
		return () => {
			window.removeEventListener('livekit-toggle-microphone', handleMicrophoneToggle);
		};
	}, [localParticipant, roomState, isMicrophoneMuted]);

	// Update NotchDrop connection status
	useEffect(() => {
		const updateNotchDropStatus = async (status) => {
			try {
				if (window.electronApi && window.electronApi.notchdrop) {
					await window.electronApi.notchdrop.updateVoiceStatus(status);
					console.log(`🔄 NotchDrop status updated: ${status}`);
				}
			} catch (error) {
				console.error('❌ Error updating NotchDrop status:', error);
			}
		};

		// Map LiveKit states to NotchDrop states
		let notchDropStatus = 'disconnected';
		if (roomState === ConnectionState.Connected) {
			switch (voiceAssistant.state) {
				case 'listening':
				case 'thinking':
				case 'speaking':
					notchDropStatus = isMicrophoneMuted ? 'muted' : 'connected';
					break;
				case 'connecting':
				case 'initializing':
					notchDropStatus = 'connecting';
					break;
				default:
					notchDropStatus = isMicrophoneMuted ? 'muted' : 'connected';
			}
		} else if (roomState === ConnectionState.Connecting) {
			notchDropStatus = 'connecting';
		}

		updateNotchDropStatus(notchDropStatus);
	}, [roomState, voiceAssistant.state, isMicrophoneMuted]);

	// Test message on mount (disabled - transcription is working)
	// useEffect(() => {
	//     const testMessage = async () => {
	//         if (roomState === ConnectionState.Connected) {
	//             console.log('🧪 TESTING: Sending test message to NotchDrop...');
	//             await sendToNotchDrop({
	//                 id: 'test-' + Date.now(),
	//                 sender: 'System',
	//                 content: 'NotchDrop transcription integration is active!',
	//                 isFromAgent: false,
	//                 timestamp: Date.now()
	//             });
	//         }
	//     };

	//     if (roomState === ConnectionState.Connected) {
	//         setTimeout(testMessage, 2000); // Send test message 2 seconds after connection
	//     }
	// }, [roomState, sendToNotchDrop]);

	// This component doesn't render anything - it's just for integration
	return null;
};

export default NotchDropLiveKitIntegration;
