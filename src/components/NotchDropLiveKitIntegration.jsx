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

	// Debug transcription data (removed console logs)

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
				const result = await window.electronApi.notchdrop.addVoiceMessage(messageData);
			}
		} catch (error) {
			// Error handling without console logging
		}
	}, []);

	// Process transcription updates
	useEffect(() => {
		if (voiceAssistant.state === 'disconnected') {
			return;
		}

		// Clear transcripts when agent starts speaking (new conversation turn)
		if (voiceAssistant.state === 'speaking') {
			setTranscripts(new Map());
			return;
		}

		setTranscripts((currentTranscripts) => {
			const newTranscripts = new Map(currentTranscripts);
			let hasNewMessages = false;

			// Process local (user) messages
			localMessages.segments?.forEach((segment) => {
				const chatMessage = segmentToChatMessage(
					segment,
					currentTranscripts.get(segment.id),
					localParticipant,
				);
				const existingMessage = newTranscripts.get(segment.id);

				// Only update if content changed or it's a new message
				if (!existingMessage || existingMessage.content !== chatMessage.content) {
					newTranscripts.set(segment.id, chatMessage);
					hasNewMessages = true;
				}
			});

			// Process agent messages
			agentMessages.segments?.forEach((segment) => {
				const chatMessage = segmentToChatMessage(
					segment,
					currentTranscripts.get(segment.id),
					voiceAssistant.audioTrack?.participant,
				);
				const existingMessage = newTranscripts.get(segment.id);

				// Only update if content changed or it's a new message
				if (!existingMessage || existingMessage.content !== chatMessage.content) {
					newTranscripts.set(segment.id, chatMessage);
					hasNewMessages = true;
				}
			});

			if (hasNewMessages) {
				// Convert to array and sort by timestamp
				const allMessages = Array.from(newTranscripts.values());
				allMessages.sort((a, b) => a.timestamp - b.timestamp);

				// Send new/updated messages to NotchDrop (only final transcriptions)
				setLastSentMessages((currentLastSent) => {
					allMessages.forEach((message) => {
						const lastSent = currentLastSent.find((m) => m.id === message.id);

						// Only send final transcriptions to avoid duplicates
						if (
							message.isFinal &&
							(!lastSent || lastSent.content !== message.content)
						) {
							sendToNotchDrop(message);
						}
					});

					return allMessages;
				});

				return newTranscripts;
			}

			return currentTranscripts;
		});
	}, [
		voiceAssistant.state,
		localParticipant,
		localMessages.segments,
		agentMessages.segments,
		voiceAssistant.audioTrack?.participant,
		segmentToChatMessage,
		sendToNotchDrop,
	]);

	// Listen for microphone toggle events from NotchDrop
	useEffect(() => {
		const handleMicrophoneToggle = async (event) => {
			if (localParticipant && roomState === ConnectionState.Connected) {
				try {
					const newMuteState = !isMicrophoneMuted;

					// Toggle microphone using LiveKit's setMicrophoneEnabled
					await localParticipant.setMicrophoneEnabled(!newMuteState);
					setIsMicrophoneMuted(newMuteState);

					// Update NotchDrop Swift UI with the new mute state
					if (window.electronApi?.notchdrop?.updateVoiceMuteState) {
						await window.electronApi.notchdrop.updateVoiceMuteState(newMuteState);
					}
				} catch (error) {
					// Error handling without console logging
				}
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
					// Use updateVoiceConnectionState for connection status changes
					await window.electronApi.notchdrop.updateVoiceConnectionState(status);
				}
			} catch (error) {
				// Error handling without console logging
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

	// Test message functionality removed

	// This component doesn't render anything - it's just for integration
	return null;
};

export default NotchDropLiveKitIntegration;
