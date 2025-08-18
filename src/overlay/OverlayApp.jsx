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
import ScreenQueryBar from './components/ScreenQueryBar';
import LiveIntelligencePanel from './components/LiveIntelligencePanel';
import TranscriptPanel from './components/TranscriptPanel';
import './overlay.scss';

const OverlayApp = () => {
	const containerRef = useRef(null);
	const [showScreenQuery, setShowScreenQuery] = useState(false);
	// Single state to control which panel is shown: 'live-intelligence' or 'transcript'
	const [activePanel, setActivePanel] = useState('live-intelligence');

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
			message.error('Error fetching transcription token. Please try again.');
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

	// Debug: Log state changes and update dimensions when panel changes
	useEffect(() => {
		console.log('activePanel state changed to:', activePanel);

		// Update dimensions when panel changes
		setTimeout(() => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				const height = Math.max(containerRef.current.scrollHeight, rect.height);
				const width = Math.max(containerRef.current.scrollWidth, rect.width);

				if (window.electronApi?.overlay?.updateDimensions) {
					window.electronApi.overlay.updateDimensions({ width, height });
				}
			}
		}, 100); // Slightly longer delay for panel transitions
	}, [activePanel]);

	// Update dimensions when screen query state changes
	useEffect(() => {
		setTimeout(() => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				const height = Math.max(containerRef.current.scrollHeight, rect.height);
				const width = Math.max(containerRef.current.scrollWidth, rect.width);

				if (window.electronApi?.overlay?.updateDimensions) {
					window.electronApi.overlay.updateDimensions({ width, height });
				}
			}
		}, 100);
	}, [showScreenQuery]);

	// Debug: Global click handler
	useEffect(() => {
		const handleGlobalClick = (event) => {
			console.log('Global click detected on:', event.target);
		};

		document.addEventListener('click', handleGlobalClick);
		return () => document.removeEventListener('click', handleGlobalClick);
	}, []);

	const handleAskAIClick = () => {
		setShowScreenQuery((prev) => !prev);
	};

	const handleCloseScreenQuery = () => {
		setShowScreenQuery(false);
	};

	const handleListenClick = () => {
		// Toggle LiveIntelligencePanel when listen button is clicked
		setActivePanel((prev) => (prev === 'live-intelligence' ? null : 'live-intelligence'));
	};

	const handleCloseLiveIntelligence = () => {
		// Close both panels by setting to null or hide completely
		setActivePanel(null);
	};

	const handleShowTranscript = () => {
		console.log('handleShowTranscript called - switching to transcript panel');
		setActivePanel('transcript');
	};

	const handleShowLiveIntelligence = () => {
		setActivePanel('live-intelligence');
	};

	const handleCloseTranscript = () => {
		setActivePanel('live-intelligence');
	};

	useEffect(() => {
		// Update window dimensions when content changes
		const updateDimensions = () => {
			if (containerRef.current) {
				// Use a small delay to allow CSS transitions to complete
				setTimeout(() => {
					const rect = containerRef.current.getBoundingClientRect();
					const height = Math.max(containerRef.current.scrollHeight, rect.height);
					const width = Math.max(containerRef.current.scrollWidth, rect.width);

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
	}, []);

	// Handle click outside to close screen query
	useEffect(() => {
		if (!showScreenQuery) return;

		const handleClickOutside = (event) => {
			if (containerRef.current && !containerRef.current.contains(event.target)) {
				console.log('Click outside detected, closing screen query');
				setShowScreenQuery(false);
			}
		};

		const handleEscapeKey = (event) => {
			if (event.key === 'Escape') {
				setShowScreenQuery(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleEscapeKey);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleEscapeKey);
		};
	}, [showScreenQuery]);

	return (
		<div ref={containerRef} className="overlay-app">
			<div className="overlay-container overlay-content" data-overlay-content="true">
				{/* Shortcut bar */}
				<ShortcutBar
					onAskAIClick={handleAskAIClick}
					isQueryBarOpen={showScreenQuery}
					onListenClick={handleListenClick}
					isLiveIntelligenceOpen={activePanel === 'live-intelligence'}
				/>

				{/* Commands section */}
				<OverlayCommands />
			</div>

			{/* Screen query bar - separate window below with gap */}
			{showScreenQuery && (
				<div className="screen-query-container">
					<ScreenQueryBar onClose={handleCloseScreenQuery} />
				</div>
			)}

			{/* Live Intelligence panel - separate window below with gap */}
			{activePanel === 'live-intelligence' && (
				<div className="live-intelligence-container">
					<LiveIntelligencePanel
						onClose={handleCloseLiveIntelligence}
						onShowTranscript={handleShowTranscript}
						// Pass transcription data for future Live Intelligence features
						transcriptions={transcriptions}
						isRecording={isRecording}
						timer={timer}
						formatTime={formatTime}
						// Pass socket data for tabs
						socketData={liveIntelligenceData}
					/>
				</div>
			)}

			{/* Transcript panel - separate window below with gap */}
			{activePanel === 'transcript' && (
				<div className="transcript-container">
					<TranscriptPanel
						onClose={handleCloseTranscript}
						onShowLiveIntelligence={handleShowLiveIntelligence}
						// Pass shared recording state and controls
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
