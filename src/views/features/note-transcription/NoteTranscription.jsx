import { useState, useEffect, useRef, useCallback, memo, useContext } from 'react';
import Context from '../../../context/context';
import { Track } from 'livekit-client';
import { useTrackTranscription } from '@livekit/components-react';
import useNote from '../../../hooks/useNote';
import useLiveIntelligenceStream from '../../../hooks/useLiveIntelligenceStream';
import '../../../assets/scss/noteTranscription/note-transcription.scss';
import { message } from 'antd';
import Waveform from '../../../assets/svg/note-transcription.gif';
import { ReactComponent as Mic } from '../../../assets/svg/microphone.svg';
import { ReactComponent as MuteMic } from '../../../assets/svg/ai_agents/mutemic.svg';
import { ReactComponent as Close } from '../../../assets/svg/ai_agents/close.svg';
import ObjectID from 'bson-objectid';
import { checkDevices } from '../../../helpers';
// Memoized TranscriptionItem to prevent unnecessary re-renders
const TranscriptionItem = memo(({ displayedText, isFinal }) => {
	return (
		<div className={`transcription-item ${isFinal ? 'final' : 'partial'}`}>{displayedText}</div>
	);
});

export default function NoteTranscription({
	pageId,
	updateTranscription,
	sendMessage,
	tenantId,
	sessionId,
	recallPageId,
	meetingId,
}) {
	const wsUrl = 'wss://ve-ai-transcriptions-8p8k0b44.livekit.cloud';
	const [liveKitToken, setLiveKitToken] = useState(null);
	const [transcriptions, setTranscriptions] = useState([]); // For rendering
	const transcriptionsMapRef = useRef(new Map()); // Full transcription text
	const displayedTextMapRef = useRef(new Map()); // Currently displayed text
	const typingIntervalsRef = useRef(new Map()); // Track typing intervals
	const processedSegmentsRef = useRef(new Map()); // Track processed segment text and final state
	const isMountedRef = useRef(false);
	const [isRecording, setIsRecording] = useState(false); // Control transcription start
	const sessionIdRef = useRef(null); // Unique session ID for live intelligence

	const {
		notes: { getLiveKitToken, deleteLiveKitRoom, initializeMeetingSummary },
	} = useContext(Context);

	// Initialize useNote unconditionally
	const {
		connect,
		disconnect,
		isConnected,
		localAudioTrack,
		localParticipant,
		isMuted,
		muteAudio,
		unmuteAudio,
	} = useNote({
		wsUrl,
		token: liveKitToken,
		isRecording,
	});

	// Initialize live intelligence stream
	const {
		createWebSocketConnection: createLiveIntelligenceConnection,
		closeWebSocketConnection: closeLiveIntelligenceConnection,
		updateCurrentContext,
	} = useLiveIntelligenceStream();

	// Track mounted state and clear transcriptions on mount
	useEffect(() => {
		isMountedRef.current = true;
		// Clear transcriptions on mount to avoid stale data
		setTranscriptions([]);
		transcriptionsMapRef.current.clear();
		displayedTextMapRef.current.clear();
		processedSegmentsRef.current.clear();
		return () => {
			isMountedRef.current = false;
			// Clean up all typing intervals
			typingIntervalsRef.current.forEach((interval) => clearInterval(interval));
			typingIntervalsRef.current.clear();
			disconnect();
			closeLiveIntelligenceConnection();
			deleteLiveKitRoom({ meetingId: sessionIdRef.current });
		};
	}, [disconnect]);

	// Connect to LiveKit when recording starts, disconnect when it stops
	useEffect(() => {
		if (isRecording && liveKitToken && !isConnected && isMountedRef.current) {
			connect();
		} else if (!isRecording && isConnected && isMountedRef.current) {
			disconnect();
		}
	}, [isRecording, liveKitToken, connect, disconnect, isConnected]);

	useEffect(() => {
		const lastTranscription = transcriptions[transcriptions.length - 1];
		const prevTranscriptionId = transcriptions[transcriptions.length - 2]?.id || null;
	}, [transcriptions]);

	// Use useTrackTranscription to get transcription segments
	const trackRef =
		localParticipant && localAudioTrack
			? {
					publication: localParticipant.getTrackPublication(Track.Source.Microphone),
					source: Track.Source.Microphone,
					participant: localParticipant,
			  }
			: undefined;

	const { segments } = useTrackTranscription(trackRef);

	// Debounce updateTranscription to prevent rapid state updates
	const debounce = useCallback((fn, delay) => {
		let timeout;
		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => fn(...args), delay);
		};
	}, []);

	const debouncedUpdateTranscription = useCallback(
		(fn, ...args) => {
			debounce(fn, 200)(...args);
		},
		[debounce],
	);

	// Function to send LiveKit token to recall socket (one time only)
	const sendLiveKitTokenToSocket = useCallback(
		(token) => {
			if (sendMessage && token) {
				const message = {
					liveKitToken: token,
					tenantId,
					sessionId,
					pageId: recallPageId,
					meetingId: meetingId,
				};
				sendMessage({ liveKitTokenData: message });
			}
		},
		[sendMessage, tenantId, sessionId, recallPageId, meetingId],
	);

	// Typing effect for a single transcription
	const startTypingEffect = useCallback((id, fullText, isFinal) => {
		// Clear any existing interval for this transcription
		if (typingIntervalsRef.current.has(id)) {
			clearInterval(typingIntervalsRef.current.get(id));
			typingIntervalsRef.current.delete(id);
		}

		const currentDisplayed = displayedTextMapRef.current.get(id) || '';
		const remainingText = fullText.slice(currentDisplayed.length);
		if (remainingText.length === 0) {
			if (isFinal) {
				displayedTextMapRef.current.set(id, fullText); // Ensure final text is set without "..."
			}
			// Update transcriptions to reflect the final state
			const updatedTranscriptions = Array.from(transcriptionsMapRef.current.values()).map(
				(transcription) => ({
					id: transcription.id,
					displayedText: displayedTextMapRef.current.get(transcription.id) || '',
					isFinal: transcription.isFinal,
				}),
			);
			setTranscriptions(updatedTranscriptions);
			return;
		}

		let index = 0;
		const interval = setInterval(() => {
			if (!isMountedRef.current) {
				clearInterval(interval);
				typingIntervalsRef.current.delete(id);
				return;
			}

			index += 1;
			const newDisplayedText = currentDisplayed + remainingText.slice(0, index);
			displayedTextMapRef.current.set(id, newDisplayedText);

			// Update transcriptions with the new displayed text
			const updatedTranscriptions = Array.from(transcriptionsMapRef.current.values()).map(
				(transcription) => ({
					id: transcription.id,
					displayedText: displayedTextMapRef.current.get(transcription.id) || '',
					isFinal: transcription.isFinal,
				}),
			);
			setTranscriptions(updatedTranscriptions);

			// Stop typing when all characters are displayed
			if (index >= remainingText.length) {
				clearInterval(interval);
				typingIntervalsRef.current.delete(id);
				if (isFinal) {
					displayedTextMapRef.current.set(id, fullText); // Ensure final text is set
					const finalTranscriptions = Array.from(
						transcriptionsMapRef.current.values(),
					).map((transcription) => ({
						id: transcription.id,
						displayedText: displayedTextMapRef.current.get(transcription.id) || '',
						isFinal: transcription.isFinal,
					}));
					setTranscriptions(finalTranscriptions);
				}
			}
		}, 30); // 30ms per character for smooth typing effect

		typingIntervalsRef.current.set(id, interval);
	}, []);

	// Process transcription segments for UI display
	useEffect(() => {
		if (!segments || segments.length === 0) return;

		const transcriptionsMap = transcriptionsMapRef.current;
		let transcriptionText = '';

		segments.forEach((segment) => {
			transcriptionText += '\n\n' + segment.text;
			const fullText = segment.final ? segment.text : `${segment.text} ...`;
			const existing = transcriptionsMap.get(segment.id);

			// Update transcription map and typing effect if segment is new or changed
			if (!existing || existing.fullText !== fullText || existing.isFinal !== segment.final) {
				transcriptionsMap.set(segment.id, {
					id: segment.id,
					fullText,
					isFinal: segment.final,
					timestamp: segment.timestamp || Date.now(),
				});
				startTypingEffect(segment.id, fullText, segment.final);
			}

			// Only send to updateTranscription if the segment is new or text has changed
			const processed = processedSegmentsRef.current.get(segment.id);
			if (
				!processed ||
				processed.text !== segment.text ||
				(!processed.isFinal && segment.final)
			) {
				// Check if text already exists in transcriptions to avoid duplicates
				const textExists = Array.from(transcriptionsMap.values()).some(
					(t) => t.id !== segment.id && t.fullText === segment.text,
				);
				if (!textExists) {
					processedSegmentsRef.current.set(segment.id, {
						text: segment.text,
						isFinal: segment.final,
					});

					// Call updateTranscription with the correct format
					const transcriptionData = {
						id: segment.id,
						displayedText: segment.text,
						isFinal: segment.final,
					};

					// Only send to parent if it's a final transcript
					if (segment.final) {
						debouncedUpdateTranscription(updateTranscription, transcriptionData);
					}

					// Note: No longer sending transcription data to recall socket
				}
			}
		});
		// Update live intelligence context with accumulated transcription text
		// if (transcriptionText.trim()) {
		// 	updateCurrentContext(transcriptionText.trim());
		// }

		// Update local transcriptions for display
		const updatedTranscriptions = Array.from(transcriptionsMap.values()).map(
			(transcription) => ({
				id: transcription.id,
				displayedText: displayedTextMapRef.current.get(transcription.id) || '',
				isFinal: transcription.isFinal,
			}),
		);
		setTranscriptions(updatedTranscriptions);
	}, [segments]);

	// Auto-scroll to the latest transcription
	const containerRef = useRef(null);
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [transcriptions]);
	// Handle start transcription
	const handleStartTranscription = async () => {
		const { hasMic = false } = await checkDevices();
		if (!hasMic) {
			message?.error('No microphone detected.');
			return;
		}
		sessionIdRef.current = ObjectID().toString();
		// Fetch a new LiveKit token
		try {
			const response = await getLiveKitToken({
				meetingId: sessionIdRef.current,
				sessionId: sessionIdRef.current,
			});
			if (response && response[0] === true && response[1]?.accessToken) {
				const token = response[1].accessToken;
				setLiveKitToken(token);
				setIsRecording(true);

				// Send LiveKit token to recall socket (one time only)
				sendLiveKitTokenToSocket(token);

				// Start live intelligence connection
				// createLiveIntelligenceConnection(
				// 	sessionIdRef.current,
				// 	pageId,
				// );
			} else {
				console.error('Failed to fetch LiveKit token: Invalid response format', response);
				message.error('Failed to fetch transcription token. Please try again.');
			}
		} catch (err) {
			console.error('Error fetching LiveKit token:', err);
			message.error('Error fetching transcription token. Please try again.');
		}
	};

	// Handle stop transcription
	const handleStopTranscription = () => {
		setIsRecording(false);
		setLiveKitToken(null); // Clear token to ensure fresh fetch on next start
		// Clean up typing intervals
		typingIntervalsRef.current.forEach((interval) => clearInterval(interval));
		typingIntervalsRef.current.clear();
		deleteLiveKitRoom({ meetingId: sessionIdRef.current });
		// Disconnect LiveKit
		disconnect();
		// Close live intelligence connection
		closeLiveIntelligenceConnection();
		// Reset transcriptions
		setTranscriptions([]);
		transcriptionsMapRef.current.clear();
		displayedTextMapRef.current.clear();
		processedSegmentsRef.current.clear();
		initializeMeetingSummary({ meeting_id: meetingId });
	};


	// Helper for formatting time
	const formatTime = (seconds) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(1, '0');
		const s = (seconds % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	};

	const [timer, setTimer] = useState(0);
	useEffect(() => {
		let interval;
		if (isRecording) {
			if (isMuted) {
				clearInterval(interval);
			} else {
				interval = setInterval(() => {
					setTimer((prev) => prev + 1);
				}, 1000);
			}
		} else {
			setTimer(0);
		}
		return () => clearInterval(interval);
	}, [isRecording, isMuted]);

	return (
		<div className="note-transcription">
			<div className="transcription-bar">
				<span className="transcription-timer">
					{isRecording ? formatTime(timer) : '0:00'}
				</span>
				<span className="transcription-waveform">
					{isRecording ? (
						isMuted ? (
							<div className="straight-line"></div>
						) : (
							<img src={Waveform} alt="Waveform" />
						)
					) : (
						<div className="transcription-waveform-placeholder">
							<span className="transcription-waveform-placeholder-text">
								Start recording
							</span>
						</div>
					)}
				</span>
				{isRecording ? (
					<>
						<button
							className="transcription-btn stop"
							onClick={handleStopTranscription}
						>
							<Close />
						</button>
						<button
							className={`transcription-btn mic ${isMuted ? 'muted' : ''}`}
							onClick={isMuted ? unmuteAudio : muteAudio}
							disabled={!localAudioTrack || !isConnected}
						>
							{isMuted ? (
								// Muted mic icon (mic with slash)
								<MuteMic />
							) : (
								// Normal mic icon
								<Mic />
							)}
						</button>
					</>
				) : (
					<button className="transcription-btn mic" onClick={handleStartTranscription}>
						<Mic />
					</button>
				)}
			</div>
		</div>
	);
}
