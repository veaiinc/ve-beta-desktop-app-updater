import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { Track } from 'livekit-client';
import { useTrackTranscription } from '@livekit/components-react';
import Context from '../context/context';
import useNote from '../hooks/useNote';
import useLiveIntelligenceStream from '../hooks/useLiveIntelligenceStream';
import useRecallStream from '../hooks/useRecallStream';
import { requestAndTestMicrophoneAccess, testLiveKitCompatibility } from './utils/permissionUtils';
import ObjectID from 'bson-objectid';
import OverlayCommands from './OverlayCommands';
import ShortcutBar from './components/ShortcutBar';
import LiveIntelligencePanel from './components/LiveIntelligencePanel';
import TranscriptPanel from './components/TranscriptPanel';
import OverlayNotification, { useOverlayNotification } from './components/OverlayNotification';
import './overlay.scss';

const OverlayApp = () => {
	const containerRef = useRef(null);
	// State to control which panel is shown: 'live-intelligence', 'transcript', or null
	const [activePanel, setActivePanel] = useState(null);

	// Custom notification system
	const notification = useOverlayNotification();

	// Shared Recording State
	const wsUrl = 'wss://ve-ai-transcriptions-8p8k0b44.livekit.cloud';
	const [liveKitToken, setLiveKitToken] = useState(null);
	const [transcriptions, setTranscriptions] = useState([]);
	const [isRecording, setIsRecording] = useState(false);
	const [timer, setTimer] = useState(0);
	const [recordingStartTime, setRecordingStartTime] = useState(null);

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
	const isStoppingRef = useRef(false);

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
		// Show current time
		const now = new Date();
		const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');
		return `${hours}:${minutes}`;
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
		// Reset stopping flag
		isStoppingRef.current = false;

		// Clear all previous state before starting new recording
		setTranscriptions([]);
		transcriptionsMapRef.current.clear();
		displayedTextMapRef.current.clear();
		processedSegmentsRef.current.clear();
		typingIntervalsRef.current.forEach((interval) => clearInterval(interval));
		typingIntervalsRef.current.clear();
		setTimer(0);
		setRecordingStartTime(null);

		// Clear Live Intelligence data
		setLiveIntelligenceData({
			allThreads: [],
			askUser: [],
			needHelp: [],
			actions: [],
			files: [],
		});

		const newSessionId = ObjectID().toString();
		sessionIdRef.current = newSessionId;
		setRecallSessionId(newSessionId);

		try {
			// First, request and test microphone access - this will prompt user if needed
			console.log('Starting transcription - requesting microphone access...');

			// Show info notification that we're requesting permission
			const permissionNotificationId = notification.info(
				'Requesting microphone access',
				'Please allow microphone access when prompted by your browser.',
				0, // Don't auto-dismiss
			);

			const permissionResult = await requestAndTestMicrophoneAccess();

			// Dismiss the permission request notification
			notification.dismissNotification(permissionNotificationId);

			if (!permissionResult.success) {
				let errorMessage = 'Microphone access failed';
				let errorDescription = 'Please check your microphone settings and try again.';

				if (permissionResult.needsPermission) {
					if (permissionResult.needsManualEnable) {
						errorMessage = 'Microphone permission required';
						errorDescription =
							'Please enable microphone access in your browser/system settings and restart the app.';
					} else {
						errorMessage = 'Microphone permission needed';
						errorDescription =
							'Please allow microphone access when prompted and try again.';
					}
				} else {
					// Handle other errors (no device, device busy, etc.)
					errorMessage =
						permissionResult.error?.name === 'NotFoundError'
							? 'No microphone found'
							: 'Microphone access failed';
					errorDescription = permissionResult.error?.message || errorDescription;
				}

				console.error(
					'Microphone access failed before LiveKit connection:',
					permissionResult,
				);
				notification.error(errorMessage, errorDescription);
				return;
			}

			// Test LiveKit compatibility
			const compatibilityResult = await testLiveKitCompatibility();
			if (!compatibilityResult.success) {
				console.warn(
					'LiveKit compatibility test failed, but proceeding with connection attempt:',
					compatibilityResult.error,
				);
			}

			const response = await getLiveKitToken({
				meetingId: newSessionId,
				sessionId: newSessionId,
			});
			if (response && response[0] === true && response[1]?.accessToken) {
				setLiveKitToken(response[1].accessToken);
				setIsRecording(true);
				setRecordingStartTime(Date.now()); // Set the start time

				// Show success notification
				notification.success('Recording started', 'Microphone connected successfully');

				// Start Recall connection for Live Intelligence
				createRecallConnection(
					newSessionId,
					newSessionId,
					handleRecallSocketMessage,
					true, // isAiIntelligenceEnabled
				);
			} else {
				console.error('Failed to fetch LiveKit token: Invalid response format', response);
				notification.error(
					'Connection failed',
					'Failed to fetch transcription token. Please try again.',
				);
			}
		} catch (err) {
			console.error('Error fetching LiveKit token:', err);
			// Check if it's a microphone permission error
			if (err.message && err.message.includes('Microphone permission')) {
				notification.error('Microphone permission error', err.message);
			} else {
				notification.error(
					'Connection error',
					'Error fetching transcription token. Please try again.',
				);
			}
		}
	};

	const handleStopTranscription = () => {
		// Set stopping flag to prevent further processing
		isStoppingRef.current = true;

		// Immediately clear UI and session
		setTranscriptions([]);
		setIsRecording(false);
		setLiveKitToken(null);
		setRecordingStartTime(null);
		setTimer(0);

		// Clear session reference immediately
		const currentSessionId = sessionIdRef.current;
		sessionIdRef.current = null;

		// Clear all refs and intervals
		transcriptionsMapRef.current.clear();
		displayedTextMapRef.current.clear();
		processedSegmentsRef.current.clear();
		typingIntervalsRef.current.forEach((interval) => clearInterval(interval));
		typingIntervalsRef.current.clear();

		// Clean up connections
		if (currentSessionId) {
			deleteLiveKitRoom({ meetingId: currentSessionId });
		}
		disconnect();
		closeLiveIntelligenceConnection();
		closeRecallConnection();

		setRecallSessionId(null);
		// Clear Live Intelligence data
		setLiveIntelligenceData({
			allThreads: [],
			askUser: [],
			needHelp: [],
			actions: [],
			files: [],
		});

		// Reset stopping flag after cleanup
		setTimeout(() => {
			isStoppingRef.current = false;
		}, 100);
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
		if (!segments || segments.length === 0 || isStoppingRef.current) return;

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

	// Debug function to test notifications (remove after testing)
	const handleTestNotifications = () => {
		notification.success('Test Success', 'This is a success notification');
		setTimeout(() => {
			notification.error(
				'Test Error',
				'This is an error notification with a longer description to test wrapping',
			);
		}, 500);
		setTimeout(() => {
			notification.info('Test Info', 'This is an info notification');
		}, 1000);
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
				height,
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
					isRecording={isRecording}
					onStopRecording={handleStopTranscription}
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

			{/* Custom notification system - appears above everything */}
			<OverlayNotification
				notifications={notification.notifications}
				onDismiss={notification.dismissNotification}
			/>
		</div>
	);
};

export default OverlayApp;
