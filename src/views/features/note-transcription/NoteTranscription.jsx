import React, { useState, useEffect, useRef, useCallback, memo, useContext } from 'react';
import Context from '../../../context/context';
import { Track } from 'livekit-client';
import { useTrackTranscription } from '@livekit/components-react';
import useNote from '../../hooks/useNote';
import useLiveIntelligenceStream from '../../hooks/useLiveIntelligenceStream';
import '../../../assets/scss/noteTranscription/note-transcription.scss';
import { message } from 'antd';
import ObjectID from 'bson-objectid';

// Memoized TranscriptionItem to prevent unnecessary re-renders
const TranscriptionItem = memo(({ displayedText, isFinal }) => {
	return (
		<div className={`transcription-item ${isFinal ? 'final' : 'partial'}`}>{displayedText}</div>
	);
});

export default function NoteTranscription({ pageId, updateTranscription }) {
	const wsUrl = 'wss://ve-ai-transcriptions-8p8k0b44.livekit.cloud';
	const [liveKitToken, setLiveKitToken] = useState(null);
	const [transcriptions, setTranscriptions] = useState([]); // For rendering
	const transcriptionsMapRef = useRef(new Map()); // Full transcription text
	const displayedTextMapRef = useRef(new Map()); // Currently displayed text
	const typingIntervalsRef = useRef(new Map()); // Track typing intervals
	const processedSegmentsRef = useRef(new Map()); // Track processed segment text and final state
	const isMountedRef = useRef(false);
	const [isRecording, setIsRecording] = useState(false); // Control transcription start
	const sessionIdRef = useRef(ObjectID().toString()); // Unique session ID for live intelligence

	const {
		notes: { getLiveKitToken },
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
		console.log('Transcriptions cleared on mount');
		return () => {
			isMountedRef.current = false;
			// Clean up all typing intervals
			typingIntervalsRef.current.forEach((interval) => clearInterval(interval));
			typingIntervalsRef.current.clear();
			disconnect();
			closeLiveIntelligenceConnection();
		};
	}, [disconnect]);










	// Connect to LiveKit when recording starts, disconnect when it stops
	useEffect(() => {
		if (isRecording && liveKitToken && !isConnected && isMountedRef.current) {
			console.log('Initiating LiveKit connection');
			connect();
		} else if (!isRecording && isConnected && isMountedRef.current) {
			console.log('Disconnecting LiveKit due to recording stopped');
			disconnect();
		}
	}, [isRecording, liveKitToken, connect, disconnect, isConnected]);

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
					debouncedUpdateTranscription(updateTranscription, segment);
				} else {
				}
			}
		});

		// Update live intelligence context with accumulated transcription text
		if (transcriptionText.trim()) {
			updateCurrentContext(transcriptionText.trim());
		}

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
	const containerRef = React.useRef(null);
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [transcriptions]);

	// Handle start transcription
	const handleStartTranscription = async () => {
		// Fetch a new LiveKit token
		try {
			const response = await getLiveKitToken({ pageId: pageId });
			if (response && response[0] === true && response[1]?.accessToken) {
				setLiveKitToken(response[1].accessToken);
				setIsRecording(true);
				console.log('Fetched new LiveKit token for transcription');

				// Start live intelligence connection
				createLiveIntelligenceConnection(
					sessionIdRef.current,
					handleLiveIntelligenceMessage,
				);
				console.log(
					'Started live intelligence connection with session ID:',
					sessionIdRef.current,
				);
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
		// Disconnect LiveKit
		disconnect();
		// Close live intelligence connection
		closeLiveIntelligenceConnection();
		// Reset transcriptions
		setTranscriptions([]);
		transcriptionsMapRef.current.clear();
		displayedTextMapRef.current.clear();
		processedSegmentsRef.current.clear();
	};

	// Handle live intelligence messages
	const handleLiveIntelligenceMessage = useCallback((event) => {
		try {
			const data = JSON.parse(event.data);
			console.log('Live Intelligence message received:', data);
			// Handle any responses from live intelligence here
		} catch (error) {
			console.error('Error parsing live intelligence message:', error);
		}
	}, []);

	return (
		<div className="note-transcription">
			<h3>Transcriptions</h3>
			<div style={{ marginBottom: '10px' }}>
				{isRecording ? (
					<button
						onClick={handleStopTranscription}
						style={{
							padding: '8px 16px',
							marginRight: '10px',
							backgroundColor: '#ff4d4f',
							color: '#fff',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						Stop Transcription
					</button>
				) : (
					<button
						onClick={handleStartTranscription}
						disabled={isRecording}
						style={{
							padding: '8px 16px',
							marginRight: '10px',
							backgroundColor: isRecording ? '#555' : '#1890ff',
							color: '#fff',
							border: 'none',
							borderRadius: '4px',
							cursor: isRecording ? 'not-allowed' : 'pointer',
						}}
					>
						Start Transcription
					</button>
				)}
				<button
					onClick={muteAudio}
					disabled={isMuted || !localAudioTrack || !isConnected}
					style={{
						padding: '8px 16px',
						marginRight: '10px',
						backgroundColor:
							isMuted || !localAudioTrack || !isConnected ? '#555' : '#ff4d4f',
						color: '#fff',
						border: 'none',
						borderRadius: '4px',
						cursor:
							isMuted || !localAudioTrack || !isConnected ? 'not-allowed' : 'pointer',
					}}
				>
					Mute Mic
				</button>
				<button
					onClick={unmuteAudio}
					disabled={!isMuted || !localAudioTrack || !isConnected}
					style={{
						padding: '8px 16px',
						backgroundColor:
							!isMuted || !localAudioTrack || !isConnected ? '#555' : '#52c41a',
						color: '#fff',
						border: 'none',
						borderRadius: '4px',
						cursor:
							!isMuted || !localAudioTrack || !isConnected
								? 'not-allowed'
								: 'pointer',
					}}
				>
					Unmute Mic
				</button>
			</div>
			{/* <div ref={containerRef} className="transcriptions-container">
				{transcriptions.length > 0 ? (
					transcriptions.map((transcription) => (
						<TranscriptionItem
							key={transcription.id}
							displayedText={transcription.displayedText}
							isFinal={transcription.isFinal}
						/>
					))
				) : (
					<p className="waiting-message">Waiting for transcriptions...</p>
				)}
			</div> */}
		</div>
	);
}
