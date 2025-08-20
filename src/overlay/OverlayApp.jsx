import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { Track } from 'livekit-client';
import { useTrackTranscription } from '@livekit/components-react';
import Context from '../context/context';
import useNote from '../hooks/useNote';
import useLiveIntelligenceStream from '../hooks/useLiveIntelligenceStream';
import useRecallStream from '../hooks/useRecallStream';
import { message } from 'antd';
import ObjectID from 'bson-objectid';
import OverlayCommands from './OverlayCommands';
import ShortcutBar from './components/ShortcutBar';
import LiveIntelligencePanel from './components/LiveIntelligencePanel';
import TranscriptPanel from './components/TranscriptPanel';
import './overlay.scss';

const OverlayApp = () => {
	const containerRef = useRef(null);
	// State to control which panel is shown: 'live-intelligence', 'transcript', or null
	const [activePanel, setActivePanel] = useState(null);

	// Shared Recording State
	const wsUrl = 'wss://ve-ai-transcriptions-8p8k0b44.livekit.cloud';
	const [liveKitToken, setLiveKitToken] = useState(null);
	const [transcriptions, setTranscriptions] = useState([]);
	const [isRecording, setIsRecording] = useState(false);
	const [timer, setTimer] = useState(0);

	// Live Intelligence Socket Data
	const [liveIntelligenceData, setLiveIntelligenceData] = useState({
		allThreads: [],
		askUser: [],
		needHelp: [],
		actions: [],
		files: [],
	});
	const [recallSessionId, setRecallSessionId] = useState(null);

	// Refs for data management
	const transcriptionsMapRef = useRef(new Map());
	const displayedTextMapRef = useRef(new Map());
	const typingIntervalsRef = useRef(new Map());
	const processedSegmentsRef = useRef(new Map());
	const isMountedRef = useRef(false);
	const sessionIdRef = useRef(null);

	// Context
	const {
		notes: { getLiveKitToken, deleteLiveKitRoom },
		profileInfo: { tennantSettingsData, getTenantSettings },
	} = useContext(Context);

	// Custom Hooks
	const {
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

	const { closeWebSocketConnection: closeLiveIntelligenceConnection } =
		useLiveIntelligenceStream();

	// Recall Stream Hook for Live Intelligence
	const {
		createWebSocketConnection: createRecallConnection,
		closeWebSocketConnection: closeRecallConnection,
		sendMessage: sendRecallMessage,
	} = useRecallStream();

	// Track reference for transcription
	const trackRef =
		localParticipant && localAudioTrack
			? {
					publication: localParticipant.getTrackPublication(Track.Source.Microphone),
					source: Track.Source.Microphone,
					participant: localParticipant,
			  }
			: undefined;

	const { segments } = useTrackTranscription(trackRef);

	// Utility Functions
	const formatTime = (seconds) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(1, '0');
		const s = (seconds % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	};

	const formatTimestamp = () => {
		const now = new Date();
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const seconds = now.getSeconds().toString().padStart(2, '0');
		return `${minutes}:${seconds}`;
	};

	// Typing Effect Function
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
				displayedTextMapRef.current.set(id, fullText);
			}
			const updatedTranscriptions = Array.from(transcriptionsMapRef.current.values()).map(
				(transcription) => ({
					id: transcription.id,
					speaker: transcription.speaker,
					text: displayedTextMapRef.current.get(transcription.id) || '',
					timestamp: transcription.timestamp,
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

			const updatedTranscriptions = Array.from(transcriptionsMapRef.current.values()).map(
				(transcription) => ({
					id: transcription.id,
					speaker: transcription.speaker,
					text: displayedTextMapRef.current.get(transcription.id) || '',
					timestamp: transcription.timestamp,
					isFinal: transcription.isFinal,
				}),
			);
			setTranscriptions(updatedTranscriptions);

			if (index >= remainingText.length) {
				clearInterval(interval);
				typingIntervalsRef.current.delete(id);
			}
		}, 30);

		typingIntervalsRef.current.set(id, interval);
	}, []);

	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, []);
	// Handle Recall Socket Messages for Live Intelligence
	const handleRecallSocketMessage = useCallback((event) => {
		try {
			const msg = JSON.parse(event?.data || null);
			console.log('Received socket message:', msg); // Debug log

			if (msg?.event === 'live_intelligence.response' && msg?.data?.suggested_prompt) {
				const suggestion = msg.data.suggested_prompt;

				// Add timestamp from the message
				const enhancedSuggestion = {
					...suggestion,
					timestamp: msg.data.timestamps?.start_timestamp
						? msg.data.timestamps.start_timestamp * 1000 // Convert to milliseconds
						: Date.now(),
				};

				setLiveIntelligenceData((prev) => {
					const userQuestions = [...prev.askUser];
					const aiQuestions = [...prev.needHelp];
					const actions = [...prev.actions];
					const files = [...prev.files];
					let allThreads = [...prev.allThreads];

					// Categorize the new suggestion
					if (suggestion?.entity === 'user' || suggestion?.entity === 'other_user') {
						userQuestions.push(enhancedSuggestion);
						console.log('Added to askUser:', enhancedSuggestion);
					} else if (
						suggestion?.entity === 'agent' ||
						suggestion?.entity?.includes('agent')
					) {
						if (suggestion?.type === 'search') {
							aiQuestions.push(enhancedSuggestion);
							console.log('Added to needHelp:', enhancedSuggestion);
						} else if (suggestion?.type === 'action') {
							actions.push(enhancedSuggestion);
							console.log('Added to actions:', enhancedSuggestion);
						}
					} else if (suggestion?.entity === 'file') {
						files.push(enhancedSuggestion);
						console.log('Added to files:', enhancedSuggestion);
					}

					// Add to all threads
					allThreads.push(enhancedSuggestion);

					// Sort all threads by timestamp (newest first)
					allThreads.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

					const newData = {
						allThreads,
						askUser: userQuestions,
						needHelp: aiQuestions,
						actions,
						files,
					};

					console.log('Updated liveIntelligenceData:', newData);
					return newData;
				});
			}
		} catch (error) {
			console.error('Error parsing recall socket message:', error);
		}
	}, []);

	// Send transcription to Recall socket
	const sendTranscriptionToRecall = useCallback(
		(transcriptionData) => {
			if (
				transcriptionData?.isFinal &&
				sendRecallMessage &&
				recallSessionId &&
				tennantSettingsData?._id
			) {
				const message = {
					tenantId: tennantSettingsData._id,
					sessionId: recallSessionId,
					pageId: '688b653dde81dd3d71a41584', // Default pageId from NoteTakerTranscript
					meetingId: recallSessionId,
					speakerName: 'VE Note Taker',
					transcript: transcriptionData.text || transcriptionData.transcript,
					description: '',
				};
				sendRecallMessage({ noteTakerTranscript: message });
			}
		},
		[sendRecallMessage, recallSessionId, tennantSettingsData?._id],
	);

	// Recording Controls (called from TranscriptPanel)
	const handleStartTranscription = async () => {
		const newSessionId = ObjectID().toString();
		sessionIdRef.current = newSessionId;
		setRecallSessionId(newSessionId);

		try {
			const response = await getLiveKitToken({ meetingId: newSessionId });
			if (response && response[0] === true && response[1]?.accessToken) {
				setLiveKitToken(response[1].accessToken);
				setIsRecording(true);

				// Start Recall connection for Live Intelligence
				createRecallConnection(
					newSessionId,
					newSessionId,
					handleRecallSocketMessage,
					true, // isAiIntelligenceEnabled
				);
			} else {
				console.error('Failed to fetch LiveKit token: Invalid response format', response);
				message.error('Failed to fetch transcription token. Please try again.');
			}
		} catch (err) {
			console.error('Error fetching LiveKit token:', err);
			// Check if it's a microphone permission error
			if (err.message && err.message.includes('Microphone permission')) {
				message.error(err.message);
			} else {
				message.error('Error fetching transcription token. Please try again.');
			}
		}
	};

	const handleStopTranscription = () => {
		setIsRecording(false);
		setLiveKitToken(null);
		typingIntervalsRef.current.forEach((interval) => clearInterval(interval));
		typingIntervalsRef.current.clear();
		if (sessionIdRef.current) {
			deleteLiveKitRoom({ meetingId: sessionIdRef.current });
		}
		disconnect();
		closeLiveIntelligenceConnection();
		closeRecallConnection();
		setTimer(0);
		setRecallSessionId(null);
		// Clear Live Intelligence data
		setLiveIntelligenceData({
			allThreads: [],
			askUser: [],
			needHelp: [],
			actions: [],
			files: [],
		});
	};

	const handleClearTranscripts = () => {
		setTranscriptions([]);
		transcriptionsMapRef.current.clear();
		displayedTextMapRef.current.clear();
		processedSegmentsRef.current.clear();
	};

	// Effects
	useEffect(() => {
		isMountedRef.current = true;

		return () => {
			isMountedRef.current = false;
			typingIntervalsRef.current.forEach((interval) => clearInterval(interval));
			typingIntervalsRef.current.clear();
		};
	}, []);

	// Timer Effect
	useEffect(() => {
		let interval;
		if (isRecording && !isMuted) {
			interval = setInterval(() => {
				setTimer((prev) => prev + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isRecording, isMuted]);

	// Process transcription segments
	useEffect(() => {
		if (!segments || segments.length === 0) return;

		const transcriptionsMap = transcriptionsMapRef.current;

		segments.forEach((segment) => {
			const fullText = segment.final ? segment.text : `${segment.text}...`;
			const existing = transcriptionsMap.get(segment.id);

			// Single speaker - VE Note Taker
			const speaker = 'VE Note Taker';

			if (!existing || existing.fullText !== fullText || existing.isFinal !== segment.final) {
				transcriptionsMap.set(segment.id, {
					id: segment.id,
					fullText,
					speaker,
					isFinal: segment.final,
					timestamp: formatTimestamp(),
				});
				startTypingEffect(segment.id, fullText, segment.final);
			}

			const processed = processedSegmentsRef.current.get(segment.id);
			if (
				!processed ||
				processed.text !== segment.text ||
				(!processed.isFinal && segment.final)
			) {
				processedSegmentsRef.current.set(segment.id, {
					text: segment.text,
					isFinal: segment.final,
				});

				// Send to Recall socket for Live Intelligence if it's a final transcript
				if (segment.final) {
					sendTranscriptionToRecall({
						id: segment.id,
						text: segment.text,
						transcript: segment.text,
						isFinal: segment.final,
						speaker: speaker,
					});
				}
			}
		});

		const updatedTranscriptions = Array.from(transcriptionsMap.values()).map(
			(transcription) => ({
				id: transcription.id,
				speaker: transcription.speaker,
				text: displayedTextMapRef.current.get(transcription.id) || '',
				timestamp: transcription.timestamp,
				isFinal: transcription.isFinal,
			}),
		);
		setTranscriptions(updatedTranscriptions);
	}, [segments, startTypingEffect, sendTranscriptionToRecall]);

	// These effects are now handled by the main dimension update effect above



	const handleListenClick = async () => {
		// Toggle live intelligence panel and automatically start recording when opening
		if (activePanel === 'live-intelligence') {
			// If panel is open, close it and stop recording
			setActivePanel(null);
			if (isRecording) {
				handleStopTranscription();
			}
		} else {
			// Open live intelligence panel and start recording automatically
			setActivePanel('live-intelligence');
			if (!isRecording) {
				await handleStartTranscription();
			}
		}
	};

	const handleClosePanel = () => {
		// Close panel and stop recording
		setActivePanel(null);
		if (isRecording) {
			handleStopTranscription();
		}
	};

	const handleShowTranscript = () => {
		setActivePanel('transcript');
	};

	const handleShowLiveIntelligence = () => {
		setActivePanel('live-intelligence');
	};

	const handleAskAIClick = () => {
		// Open Ask AI window via electron API
		if (window.electronApi?.askAI?.toggleWindow) {
			window.electronApi.askAI.toggleWindow();
		}
	};

	const calculateDynamicDimensions = useCallback(() => {
		if (!containerRef.current) return { width: 800, height: 150 };

		const rect = containerRef.current.getBoundingClientRect();
		let calculatedWidth = rect.width;
		let calculatedHeight = rect.height;

		// Dynamic width calculation based on layout
		if (activePanel === 'live-intelligence' || activePanel === 'transcript') {
			// Single panel: Panel width + padding
			calculatedWidth = 768 + 32; // ~800px
		} else {
			// Only shortcut bar: minimal width
			calculatedWidth = 400;
		}

		// Add some buffer for safe scrolling
		calculatedHeight = Math.max(calculatedHeight, 150);

		return {
			width: Math.min(calculatedWidth, window.screen.width * 0.8), // Max 80% of screen width
			height: Math.min(calculatedHeight + 32, window.screen.height * 0.8), // Max 80% of screen height
		};
	}, [activePanel]);

	useEffect(() => {
		// Update window dimensions when content changes
		const updateDimensions = () => {
			if (containerRef.current) {
				// Use a small delay to allow CSS transitions to complete
				setTimeout(() => {
					const { width, height } = calculateDynamicDimensions();

					if (window.electronApi?.overlay?.updateDimensions) {
						window.electronApi.overlay.updateDimensions({ width, height });
					}
				}, 50);
			}
		};

		// Initial dimension update
		updateDimensions();

		// Set up ResizeObserver to watch for content changes
		const resizeObserver = new ResizeObserver(() => {
			updateDimensions();
		});

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		// Set up MutationObserver to watch for DOM changes
		const mutationObserver = new MutationObserver(() => {
			updateDimensions();
		});

		if (containerRef.current) {
			mutationObserver.observe(containerRef.current, {
				childList: true,
				subtree: true,
				attributes: true,
				characterData: true,
				attributeOldValue: true,
				characterDataOldValue: true,
			});
		}

		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, [calculateDynamicDimensions]);

	// Update dimensions when layout state changes
	useEffect(() => {
		if (containerRef.current) {
			const { width, height } = calculateDynamicDimensions();
			console.log('Layout state changed, updating dimensions:', { 
				activePanel, 
				width, 
				height 
			});
			
			if (window.electronApi?.overlay?.updateDimensions) {
				// Small delay to ensure DOM has updated
				setTimeout(() => {
					window.electronApi.overlay.updateDimensions({ width, height });
				}, 100);
			}
		}
	}, [activePanel, calculateDynamicDimensions]);

	return (
		<div ref={containerRef} className="overlay-app">
			<div className="overlay-container overlay-content" data-overlay-content="true">
				{/* Shortcut bar */}
				<ShortcutBar
					onListenClick={handleListenClick}
					isLiveIntelligenceOpen={activePanel === 'live-intelligence'}
					onAskAIClick={handleAskAIClick}
				/>

				{/* Commands section */}
				<OverlayCommands />
			</div>

			{/* Live Intelligence panel */}
			{activePanel === 'live-intelligence' && (
				<div className="live-intelligence-container">
					<LiveIntelligencePanel
						onClose={handleClosePanel}
						onShowTranscript={handleShowTranscript}
						transcriptions={transcriptions}
						isRecording={isRecording}
						timer={timer}
						formatTime={formatTime}
						socketData={liveIntelligenceData}
					/>
				</div>
			)}

			{/* Transcript panel */}
			{activePanel === 'transcript' && (
				<div className="transcript-container">
					<TranscriptPanel
						onClose={handleClosePanel}
						onShowLiveIntelligence={handleShowLiveIntelligence}
						transcriptions={transcriptions}
						isRecording={isRecording}
						timer={timer}
						isMuted={isMuted}
						isConnected={isConnected}
						localAudioTrack={localAudioTrack}
						formatTime={formatTime}
						onStartTranscription={handleStartTranscription}
						onStopTranscription={handleStopTranscription}
						onMuteAudio={muteAudio}
						onUnmuteAudio={unmuteAudio}
						onClearTranscripts={handleClearTranscripts}
					/>
				</div>
			)}
		</div>
	);
};

export default OverlayApp;
