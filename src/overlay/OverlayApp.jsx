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
import { transcription_socket } from '../services/config.live';

const initialState = {
	allThreads: [],
	askUser: [],
	needHelp: [],
	actions: [],
	files: [],
};

const OverlayApp = () => {
	const containerRef = useRef(null);
	// State to control which panel is shown: 'live-intelligence', 'transcript', or null
	const [activePanel, setActivePanel] = useState(null);

	// State to control whether to show ShortcutBar (false when controlled by Dynamic Island)
	const [showShortcutBar, setShowShortcutBar] = useState(false);
	const [isDynamicIslandControlled, setIsDynamicIslandControlled] = useState(false);

	// Custom notification system
	const notification = useOverlayNotification();

	// Shared Recording State
	const wsUrl = transcription_socket;
	const [liveKitToken, setLiveKitToken] = useState(null);
	const [transcriptions, setTranscriptions] = useState([]);
	const [isRecording, setIsRecording] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [timer, setTimer] = useState(0);
	const [recordingStartTime, setRecordingStartTime] = useState(null);

	// Live Intelligence Socket Data
	const [liveIntelligenceData, setLiveIntelligenceData] = useState(initialState);
	const [recallSessionId, setRecallSessionId] = useState(null);
	const [meetingData, setMeetingData] = useState(null);

	// Ask AI input state
	const [isAskAIInputFocused, setIsAskAIInputFocused] = useState(false);

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
		notes: { getLiveKitToken, deleteLiveKitRoom, createMeetBot },
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
		isPaused,
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

	// Log trackRef changes for debugging
	useEffect(() => {
		console.log('🎯 TrackRef updated:', {
			hasLocalParticipant: !!localParticipant,
			hasLocalAudioTrack: !!localAudioTrack,
			hasTrackRef: !!trackRef,
			isRecording,
			isPaused,
			isConnected,
		});
	}, [trackRef, localParticipant, localAudioTrack, isRecording, isPaused, isConnected]);

	const { segments } = useTrackTranscription(trackRef);

	// Log segments changes for debugging
	useEffect(() => {
		console.log('📝 Segments updated:', {
			segmentsCount: segments?.length || 0,
			hasSegments: !!segments && segments.length > 0,
			isRecording,
			isPaused,
			isConnected,
			hasTrackRef: !!trackRef,
		});
	}, [segments, isRecording, isPaused, isConnected, trackRef]);

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
					pageId: recallSessionId, // Use meeting ID as page ID since it's the same meeting
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
		clearAllTranscriptionData();

		const newSessionId = ObjectID().toString();
		sessionIdRef.current = newSessionId;
		setRecallSessionId(newSessionId);

		try {
			// First, create a meeting via API
			console.log('Creating meeting via API...');

			// Generate default title with current date and time
			const now = new Date();
			const day = now.getDate().toString().padStart(2, '0');
			const month = now.toLocaleString('en-US', { month: 'short' });
			const year = now.getFullYear();
			const hours = now.getHours().toString().padStart(2, '0');
			const minutes = now.getMinutes().toString().padStart(2, '0');
			const defaultTitle = `${day} ${month} ${year} ${hours}:${minutes}`;

			const meetingInput = {
				title: defaultTitle,
				transcriptionSource: 'desktop',
				isAiIntelligenceEnabled: true,
				meetingMode: 'meeting',
				agenda: '',
			};

			// Create meeting via API
			const meetingResponse = await createMeetBot({ input: meetingInput });

			if (meetingResponse && meetingResponse[0] === true) {
				const meetingData = meetingResponse[1]?.data?.startMeeting;
				console.log('Meeting created successfully:', meetingData);

				// Store meeting data and ID for later use
				setMeetingData(meetingData);
				sessionIdRef.current = meetingData._id;
				setRecallSessionId(meetingData._id);
			} else {
				console.error('Failed to create meeting:', meetingResponse);
				notification.error(
					'Meeting creation failed',
					'Failed to create meeting. Please try again.',
				);
				return;
			}

			// Request and test microphone access - this will prompt user if needed
			console.log('Starting transcription - requesting microphone access...');

			// Show info notification that we're requesting permission
			const permissionNotificationId = notification.info(
				'Requesting microphone access',
				'Requesting microphone access',
				'Please allow microphone access when prompted by your browser.',
				0, // Don't auto-dismiss
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
						errorDescription =
							'Please enable microphone access in your browser/system settings and restart the app.';
					} else {
						errorMessage = 'Microphone permission needed';
						errorDescription =
							'Please allow microphone access when prompted and try again.';
						errorDescription =
							'Please allow microphone access when prompted and try again.';
					}
				} else {
					// Handle other errors (no device, device busy, etc.)
					errorMessage =
						permissionResult.error?.name === 'NotFoundError'
							? 'No microphone found'
							: 'Microphone access failed';
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
				console.warn(
					'LiveKit compatibility test failed, but proceeding with connection attempt:',
					compatibilityResult.error,
				);
			}

			// Use the meeting ID from the API response for LiveKit token
			const meetingId = sessionIdRef.current;
			const response = await getLiveKitToken({
				meetingId: meetingId,
				sessionId: meetingId,
			});
			if (response && response[0] === true && response[1]?.accessToken) {
				setLiveKitToken(response[1].accessToken);
				setIsRecording(true);
				setRecordingStartTime(Date.now()); // Set the start time

				// Show success notification
				notification.success(
					'Recording started',
					'Meeting created and microphone connected successfully',
				);

				// Start Recall connection for Live Intelligence
				createRecallConnection(
					meetingId,
					meetingId,
					handleRecallSocketMessage,
					true, // isAiIntelligenceEnabled
				);
			} else {
				console.error('Failed to fetch LiveKit token: Invalid response format', response);
				notification.error(
					'Connection failed',
					'Failed to fetch transcription token. Please try again.',
				);
				notification.error(
					'Connection failed',
					'Failed to fetch transcription token. Please try again.',
				);
			}
		} catch (err) {
			console.error('Error starting transcription:', err);
			// Check if it's a microphone permission error
			if (err.message && err.message.includes('Microphone permission')) {
				notification.error('Microphone permission error', err.message);
			} else {
				notification.error(
					'Connection error',
					'Error starting transcription. Please try again.',
				);
				notification.error(
					'Connection error',
					'Error starting transcription. Please try again.',
				);
			}
		}
	};

	const handlePauseTranscription = () => {
		console.log('🔄 Pausing transcription...');
		setIsPaused(true);
		// Pause the timer
		setTimer((prev) => prev);
		console.log('✅ Transcription paused');
	};

	const handleResumeTranscription = () => {
		console.log('🔄 Resuming transcription...');
		setIsPaused(false);
		// Resume the timer
		setTimer((prev) => prev);
		console.log('✅ Transcription resumed');
	};

	const handleStopTranscription = () => {
		// Set stopping flag to prevent further processing
		isStoppingRef.current = true;

		// Immediately clear UI and session
		clearAllTranscriptionData();
		setIsRecording(false);
		setIsPaused(false);
		setLiveKitToken(null);

		// Clear session reference immediately
		const currentSessionId = sessionIdRef.current;
		sessionIdRef.current = null;

		// Clean up connections
		if (currentSessionId) {
			deleteLiveKitRoom({ meetingId: currentSessionId });
		}
		disconnect();
		closeLiveIntelligenceConnection();
		closeRecallConnection();

		setRecallSessionId(null);

		// Reset stopping flag after cleanup
		setTimeout(() => {
			isStoppingRef.current = false;
		}, 100);
	};

	const handleClearTranscripts = () => {
		clearAllTranscriptionData();
	};

	// Effects
	useEffect(() => {
		isMountedRef.current = true;

		// Listen for commands from Dynamic Island via main process
		const handleOverlayCommand = (event, command) => {
			console.log('🏝️ Dynamic Island Command Received:', command);

			// Mark as Dynamic Island controlled and hide ShortcutBar permanently
			setIsDynamicIslandControlled(true);
			setShowShortcutBar(false);

			switch (command.action) {
				case 'startRecording':
					console.log(
						'🚀 Dynamic Island START: Opening Live Intelligence without ShortcutBar...',
					);
					handleDynamicIslandListenClick();
					break;
				case 'stopRecording':
					console.log('⏹️ Dynamic Island STOP: Stopping recording...');
					handleStopTranscription();
					break;
				case 'pauseRecording':
					console.log('⏸️ Dynamic Island PAUSE: Pausing recording...');
					handlePauseTranscription();
					break;
				case 'resumeRecording':
					console.log('▶️ Dynamic Island RESUME: Resuming recording...');
					handleResumeTranscription();
					break;
				case 'toggleLiveIntelligence':
					console.log(
						'🧠 Dynamic Island: Opening Live Intelligence without ShortcutBar...',
					);
					handleDynamicIslandListenClick();
					break;
				case 'getRecordingState':
					console.log('📊 Dynamic Island: Getting recording state...');
					// Send current state back to Dynamic Island
					sendRecordingStateUpdate();
					break;
				default:
					console.warn('❓ Unknown Dynamic Island command:', command.action);
			}
		};

		// Set up listener for overlay commands from Dynamic Island
		console.log('🔍 Setting up overlay command listener...');
		console.log(
			'window.electronApi?.overlay?.onCommand available:',
			!!window.electronApi?.overlay?.onCommand,
		);

		if (window.electronApi?.overlay?.onCommand) {
			console.log('✅ Setting up overlay command listener');
			window.electronApi.overlay.onCommand(handleOverlayCommand);
		} else {
			console.error('❌ Overlay command listener not available');
			console.log(
				'Available overlay methods:',
				Object.keys(window.electronApi?.overlay || {}),
			);
		}

		return () => {
			isMountedRef.current = false;
			typingIntervalsRef.current.forEach((interval) => clearInterval(interval));
			typingIntervalsRef.current.clear();
			// Clean up overlay command listener
			if (window.electronApi?.overlay?.removeCommandListener) {
				window.electronApi.overlay.removeCommandListener();
			}
		};
	}, []);

	// Check ask AI input focus state periodically
	useEffect(() => {
		const checkAskAIFocus = async () => {
			if (window.electronApi?.askAI?.getInputFocus) {
				try {
					const result = await window.electronApi.askAI.getInputFocus();
					if (result.success) {
						setIsAskAIInputFocused(result.isFocused);
					}
				} catch (error) {
					console.error('Error checking ask AI input focus:', error);
				}
			}
		};

		// Check immediately
		checkAskAIFocus();

		// Check every 500ms to stay in sync
		const interval = setInterval(checkAskAIFocus, 500);

		return () => clearInterval(interval);
	}, []);

	// Timer Effect
	useEffect(() => {
		let interval;
		if (isRecording && !isMuted && !isPaused) {
			interval = setInterval(() => {
				setTimer((prev) => prev + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isRecording, isMuted, isPaused]);

	// Process transcription segments
	useEffect(() => {
		if (!segments || segments.length === 0 || isStoppingRef.current) return;

		console.log('🎤 Processing transcription segments:', {
			segmentsCount: segments.length,
			isRecording,
			isPaused,
			isConnected,
			hasLocalAudioTrack: !!localAudioTrack,
		});

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

		// const updatedTranscriptions = Array.from(transcriptionsMap.values()).map(
		// 	(transcription) => ({
		// 		id: transcription.id,
		// 		speaker: transcription.speaker,
		// 		text: displayedTextMapRef.current.get(transcription.id) || '',
		// 		timestamp: transcription.timestamp,
		// 		isFinal: transcription.isFinal,
		// 	}),
		// );
		// setTranscriptions(updatedTranscriptions);
	}, [segments, startTypingEffect, sendTranscriptionToRecall]);

	// These effects are now handled by the main dimension update effect above

	const handleListenClick = async () => {
		// Toggle live intelligence panel and automatically start recording when opening
		// This is used by ShortcutBar - shows ShortcutBar
		setShowShortcutBar(true);
		clearAllTranscriptionData();
		if (activePanel === 'live-intelligence') {
			// If panel is open, close it and stop recording
			setActivePanel(null);
			if (isRecording) {
				handleStopTranscription();
			}
		} else {
			// Open live intelligence panel and start recording automatically
			setActivePanel('live-intelligence');

			// Always clear previous transcriptions and data when starting fresh

			if (!isRecording) {
				await handleStartTranscription();
			}
		}
	};

	const handleDynamicIslandListenClick = async () => {
		// Open live intelligence panel for Dynamic Island - NO ShortcutBar
		console.log('🏝️ Dynamic Island Control: Opening Live Intelligence - ShortcutBar DISABLED');
		setIsDynamicIslandControlled(true);
		setShowShortcutBar(false);
		clearAllTranscriptionData();

		// Always open live intelligence panel when triggered from Dynamic Island
		setActivePanel('live-intelligence');

		if (!isRecording) {
			await handleStartTranscription();
		}
	};

	const handleClosePanel = () => {
		// Close panel and stop recording
		setActivePanel(null);
		if (isRecording) {
			handleStopTranscription();
		}

		// Clear transcriptions and data when panel is closed
		// This ensures a fresh start when reopening
		clearAllTranscriptionData();

		// Only restore ShortcutBar if NOT controlled by Dynamic Island
		if (!isDynamicIslandControlled) {
			setShowShortcutBar(true);
		} else {
			console.log('🏝️ Panel closed but keeping Dynamic Island control - NO ShortcutBar');
		}
	};

	const handleShowTranscript = () => {
		setActivePanel('transcript');
	};

	const handleShowLiveIntelligence = () => {
		setActivePanel('live-intelligence');
	};

	// Helper function to clear all transcription data
	const clearAllTranscriptionData = () => {
		setTranscriptions([]);
		transcriptionsMapRef.current.clear();
		displayedTextMapRef.current.clear();
		processedSegmentsRef.current.clear();
		typingIntervalsRef.current.forEach((interval) => clearInterval(interval));
		typingIntervalsRef.current.clear();
		setTimer(0);
		setRecordingStartTime(null);

		// Clear Live Intelligence data
		setLiveIntelligenceData(initialState);
		setMeetingData(null);
	};

	// Function to send recording state updates to Dynamic Island
	const sendRecordingStateUpdate = () => {
		const state = {
			isRecording,
			isPaused,
			timer,
			isLiveIntelligenceOpen: activePanel === 'live-intelligence',
			transcriptionsCount: transcriptions.length,
			showShortcutBar,
			controlledByDynamicIsland: isDynamicIslandControlled,
			isDynamicIslandControlled,
		};

		console.log('📡 Sending state to Dynamic Island:', state);

		// Use IPC to send state update to main process, which will forward to Dynamic Island
		if (window.electronApi?.overlay?.sendStateUpdate) {
			window.electronApi.overlay.sendStateUpdate(state);
		}
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
			// Panel is open: Panel width + padding
			calculatedWidth = 768 + 32; // ~800px
		} else if (showShortcutBar && !isDynamicIslandControlled) {
			// Only shortcut bar visible (traditional mode): minimal width
			calculatedWidth = 400;
		} else {
			// Controlled by Dynamic Island or no controls: minimal width
			calculatedWidth = 32; // Just padding
		}

		// Dynamic height calculation
		if (activePanel === 'live-intelligence' || activePanel === 'transcript') {
			// Panel is open: use actual height
			calculatedHeight = Math.max(calculatedHeight, 400);
		} else if (showShortcutBar && !isDynamicIslandControlled) {
			// Only shortcut bar visible (traditional mode): minimal height
			calculatedHeight = Math.max(calculatedHeight, 150);
		} else {
			// Controlled by Dynamic Island: minimal height (controls are in Dynamic Island)
			calculatedHeight = 32; // Minimal height when hidden
		}

		return {
			width: Math.min(calculatedWidth, window.screen.width * 0.8), // Max 80% of screen width
			height: Math.min(calculatedHeight + 32, window.screen.height * 0.8), // Max 80% of screen height
		};
	}, [activePanel, showShortcutBar, isDynamicIslandControlled]);

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

	// Send state updates to Dynamic Island when recording state changes
	useEffect(() => {
		sendRecordingStateUpdate();
	}, [
		isRecording,
		isPaused,
		timer,
		activePanel,
		transcriptions.length,
		showShortcutBar,
		isDynamicIslandControlled,
	]);

	return (
		<div ref={containerRef} className="overlay-app">
			<div className="overlay-container overlay-content" data-overlay-content="true">
				{/* Shortcut bar - only show when not controlled by Dynamic Island */}
				{showShortcutBar && (
					<ShortcutBar
						onListenClick={handleListenClick}
						isLiveIntelligenceOpen={activePanel === 'live-intelligence'}
						onAskAIClick={handleAskAIClick}
						isRecording={isRecording}
						onStopRecording={handleStopTranscription}
						onPauseRecording={handlePauseTranscription}
						onResumeRecording={handleResumeTranscription}
						isPaused={isPaused}
						isAskAIInputFocused={isAskAIInputFocused}
					/>
				)}

				{/* Commands section - only show when not controlled by Dynamic Island */}
				{showShortcutBar && <OverlayCommands />}
			</div>

			{/* Live Intelligence panel */}
			{activePanel === 'live-intelligence' && (
				<div className="live-intelligence-container">
					<LiveIntelligencePanel
						onClose={handleClosePanel}
						onShowTranscript={handleShowTranscript}
						transcriptions={transcriptions}
						isRecording={isRecording}
						isPaused={isPaused}
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
						isPaused={isPaused}
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
