import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import Context from '../../../context/context';
import audioStorageService from '../../../services/audioStorageService';
import ObjectID from 'bson-objectid';
import { useOverlayNotification } from '../../../overlay/components/OverlayNotification';
import useAssemblyTranscription from '../../../overlay/hooks/useAssemblyTranscription';
import { useDispatch } from '@zubridge/electron';
import { useStore, storeActions } from '../../../store/store';
import { useNavigate } from 'react-router-dom';

const GlobalMeetingHelper = () => {
	// State to control which panel is shown: 'live-intelligence', 'transcript', or null
	const navigate = useNavigate();
	const [activePanel, setActivePanel] = useState(null);

	// State to control whether to show ShortcutBar (false when controlled by Dynamic Island)
	const [showShortcutBar, setShowShortcutBar] = useState(false);
	const [isDynamicIslandControlled, setIsDynamicIslandControlled] = useState(false);

	// Track seen thread count for badge
	const [lastSeenThreadCount, setLastSeenThreadCount] = useState(0);

	// Custom notification system
	const notification = useOverlayNotification();
	const dispatch = useDispatch();
	const { pastMeetings } = useStore((state) => state.meeting) || {};

	const [info, setInfo] = useState({
		isMeetIsOngoing: false,
		isPaused: false,
		meetingData: null,
		liveIntelligenceData: {
			askUser: [],
			needHelp: [],
			actions: [],
			files: [],
			allThreads: [],
		},
	});

	// Ask AI input state
	const [isAskAIInputFocused, setIsAskAIInputFocused] = useState(false);

	// Refs for data management
	const isMountedRef = useRef(false);
	const sessionIdRef = useRef(null);
	const isStoppingRef = useRef(false);
	const meetingIdRef = useRef(null);

	// Local transcription ref for accessing latest values in event listeners
	const localTranscriptionsRef = useRef([]);

	// Context
	const {
		notes: {
			getLiveKitToken,
			deleteLiveKitRoom,
			createMeetBot,
			activeMeetingDetails,
			updateActiveMeetingDetails,
			handleLiveIntelligenceData,
			getMeetingAnalytics,
		},
		profileInfo: { tennantSettingsData, getTenantSettings },
		templates: {
			handleTranscriptionSuggestions,
			aiTranscriptionSuggestions,
			updateStateValues,
		},
	} = useContext(Context);

	// Keep local transcription ref in sync with context state
	useEffect(() => {
		if (activeMeetingDetails?.transcriptions) {
			localTranscriptionsRef.current = activeMeetingDetails.transcriptions;
		}
	}, [activeMeetingDetails?.transcriptions]);

	const updateTranscriptionHelper = (newTranscript) => {
		const { source } = newTranscript;
		const currentTranscriptions = localTranscriptionsRef.current;

		if (currentTranscriptions.length > 0) {
			// Find the most recent transcript from the same source
			for (let i = currentTranscriptions.length - 1; i >= 0; i--) {
				if (currentTranscriptions[i].source === source) {
					const oldTranscript = currentTranscriptions[i];

					// Logic based on the state of the previous transcript:
					// - Final AND formatted → Append new transcript (start new entry)
					// - Final but NOT formatted → Replace with new transcript
					// - Not final → Replace with new transcript
					if (oldTranscript.isFinal && oldTranscript.isTurnFormatted) {
						const updatedTranscriptions = [...currentTranscriptions, newTranscript];
						localTranscriptionsRef.current = updatedTranscriptions;
						updateActiveMeetingDetails({
							transcriptions: updatedTranscriptions,
						});
						return updatedTranscriptions;
					} else {
						// Replace existing transcript (whether final-unformatted or not-final)
						const updatedTranscriptions = [...currentTranscriptions];
						updatedTranscriptions[i] = newTranscript;
						localTranscriptionsRef.current = updatedTranscriptions;
						updateActiveMeetingDetails({
							transcriptions: updatedTranscriptions,
						});
						return updatedTranscriptions;
					}
				}
			}
		}

		// If no match found or array is empty, append the new transcript
		const updatedTranscriptions = [...currentTranscriptions, newTranscript];
		localTranscriptionsRef.current = updatedTranscriptions;
		updateActiveMeetingDetails({
			transcriptions: updatedTranscriptions,
		});
		return updatedTranscriptions;
	};

	const updateLiveIntelligenceDataHelper = (liveIntelligenceData) => {
		const { suggested_prompt } = liveIntelligenceData;
		if (!suggested_prompt) {
			return;
		}
		handleLiveIntelligenceData({ suggested_prompt });
	};

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

	const {
		isConnected,
		isRecording,
		isMuted,
		timer,
		connectionStatus,
		startAudioCapture,
		stopRecording,
		toggleMute,
		// formatTime,
		startRecording,
		toggleAiIntelligence,
	} = useAssemblyTranscription({
		onTranscriptionUpdate: updateTranscriptionHelper,
		onLiveIntelligenceResponse: updateLiveIntelligenceDataHelper,
		notification,
	});

	// Audio recording hook for local audio storage
	const meetingId = info.meetingData?._id || null;

	const handleStartTranscription = async (data = {}) => {
		// Reset stopping flag
		isStoppingRef.current = false;

		if (data?.meetingId) {
			meetingIdRef.current = data?.meetingId;
		}

		const newSessionId = ObjectID().toString();
		sessionIdRef.current = newSessionId;
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

		let meetingData = null;

		if (data?._id) {
			meetingData = data;
		} else {
			const meetingResponse = await createMeetBot({ input: meetingInput });

			if (meetingResponse && meetingResponse[0] === true) {
				meetingData = meetingResponse[1]?.data?.startMeeting;

				const payload = {
					...(pastMeetings || {}),
					data: [meetingData, ...(pastMeetings?.data || [])],
					totalDocs: (pastMeetings?.totalDocs ?? 0) + 1,
				};

				dispatch({
					type: storeActions.meeting.SET_PAST_MEETINGS,
					payload,
				});
			}
		}

		if (meetingData) {
			// Store meeting data and ID for later use
			dispatch({
				type: storeActions.meeting.SET_ACTIVE_MEETING_ID,
				payload: meetingData._id,
			});

			updateActiveMeetingDetails({
				meetingId: meetingData._id,
				transcriptions: [],
				liveIntelligenceData: {
					askUser: [],
					needHelp: [],
					actions: [],
					files: [],
					allThreads: [],
				},
			});

			meetingIdRef.current = meetingData._id;

			setInfo((prev) => ({
				...prev,
				meetingData: meetingData,
				isPaused: false,
			}));

			startRecording({
				tenantId: meetingData.tenantId,
				sessionId: meetingData._id,
				meetingId: meetingData._id,
				jwtToken: localStorage.getItem('usertoken'),
				isAiIntelligenceEnabled: meetingData.isAiIntelligenceEnabled,
			});

			updateStateValues({ aiTranscriptionSuggestions: null });

			// Reset local transcription ref and context
			localTranscriptionsRef.current = [];

			setInfo((prev) => ({
				...prev,
				isMeetIsOngoing: true,
				meetingData: meetingData,
				liveIntelligenceData: {
					askUser: [],
					needHelp: [],
					actions: [],
					files: [],
					allThreads: [],
				},
			}));

			navigate(`/ongoing-meeting`, { replace: true });
		} else {
			console.error('Failed to create meeting');
			notification.error(
				'Meeting creation failed',
				'Failed to create meeting. Please try again.',
			);
			return;
		}
	};

	useEffect(() => {
		if (activeMeetingDetails?.transcriptions) {
			window.electronApi.sendTranscriptionDataToNotch(activeMeetingDetails?.transcriptions);
		}
	}, [activeMeetingDetails?.transcriptions]);

	useEffect(() => {
		if (activeMeetingDetails?.liveIntelligenceData) {
			window.electronApi.sendLiveIntelligenceDataToNotch(
				activeMeetingDetails?.liveIntelligenceData?.allThreads,
			);
		}
	}, [activeMeetingDetails?.liveIntelligenceData]);

	const handleStopTranscription = async () => {
		// Set stopping flag to prevent further processing
		isStoppingRef.current = true;

		// Use stored meeting ID from ref (more reliable than state)
		const currentMeetingId = meetingIdRef.current;

		sessionIdRef.current = null;

		updateActiveMeetingDetails({
			transcriptions: [],
			meetingId: null,
			liveIntelligenceData: {
				askUser: [],
				needHelp: [],
				actions: [],
				files: [],
				allThreads: [],
			},
		});

		await stopRecording({ meetingId: info?.meetingData?._id });

		// Generate meeting analytics when meeting ends (only if not already exists)
		if (currentMeetingId) {
			try {
				// First, check if analytics data already exists
				const [success, data] = await getMeetingAnalytics(currentMeetingId);

				if (success && data) {
					return;
				}

				const result = await audioStorageService.generateMeetingAnalytics(currentMeetingId);
				if (result.success) {
				} else {
					console.error(
						'GlobalMeetingHelper: Failed to generate meeting analytics:',
						result.error,
					);
				}
			} catch (error) {
				console.error('GlobalMeetingHelper: Error generating meeting analytics:', error);
			}
		}

		dispatch({
			type: storeActions.meeting.SET_ACTIVE_MEETING_ID,
			payload: null,
		});

		// Stop audio recording for local storage
		try {
			// Note: stopAudioRecording function would need to be available from useAssemblyTranscription
			// stopAudioRecording();
		} catch (error) {
			console.error('GlobalMeetingHelper: Error stopping audio recording:', error);
		}

		// Reset local transcription ref and context
		localTranscriptionsRef.current = [];

		setInfo((prev) => ({
			...prev,
			isMeetIsOngoing: false,
			meetingData: null,
			liveIntelligenceData: {
				askUser: [],
				needHelp: [],
				actions: [],
				files: [],
				allThreads: [],
			},
		}));

		// Send empty arrays to notch to clear data when meeting ends
		try {
			// Clear transcriptions in notch
			if (window.electronApi?.notchdrop?.replaceTranscriptions) {
				window.electronApi.notchdrop.replaceTranscriptions([]);
			}

			// Clear live intelligence data in notch
			if (window.electronApi?.notchdrop?.clearLiveIntelligenceData) {
				window.electronApi.notchdrop.clearLiveIntelligenceData();
			}
		} catch (e) {
			console.error('Failed to clear data in NotchDrop during meeting cleanup:', e);
		}

		// Reset stopping flag after cleanup
		setTimeout(() => {
			isStoppingRef.current = false;
		}, 100);
	};

	const handleTogglePause = () => {
		const newIsPaused = !info?.isPaused;
		setInfo((prev) => ({
			...prev,
			isPaused: newIsPaused,
		}));
		toggleMute();
	};

	const handleListenClick = async () => {
		// Toggle live intelligence panel and automatically start recording when opening
		// This is used by ShortcutBar - shows ShortcutBar
		setShowShortcutBar(true);
		if (activePanel === 'live-intelligence') {
			// If panel is open, close it and stop recording
			setActivePanel(null);
			if (isRecording) {
				handleStopTranscription();
			}
		} else {
			// Open live intelligence panel and start recording automatically
			setActivePanel('live-intelligence');

			// Ensure overlay window is visible for proper Ask AI positioning
			window?.electronApi?.overlay?.showOverlayWindow();

			// Mark current threads as seen when opening live intelligence
			const currentThreadCount = info?.liveIntelligenceData?.allThreads?.length || 0;
			setLastSeenThreadCount(currentThreadCount);

			// Always clear previous transcriptions and data when starting fresh
			if (!isRecording) {
				await handleStartTranscription();
			}
		}
	};

	const handleDynamicIslandListenClick = async (data = {}) => {
		// Open live intelligence panel for Dynamic Island - NO ShortcutBar
		setIsDynamicIslandControlled(true);
		setShowShortcutBar(false);

		// Always open live intelligence panel when triggered from Dynamic Island
		setActivePanel('live-intelligence');

		// Ensure overlay window is visible for proper Ask AI positioning
		window?.electronApi?.overlay?.showOverlayWindow();

		// Mark current threads as seen when opening live intelligence via Dynamic Island
		const currentThreadCount = info?.liveIntelligenceData?.allThreads?.length || 0;
		setLastSeenThreadCount(currentThreadCount);

		if (!isRecording) {
			await handleStartTranscription(data);
		}
	};

	const handleClosePanel = () => {
		// Close panel and stop recording
		window?.electronApi?.overlay?.hideOverlayWindow();

		if (!isDynamicIslandControlled) {
			setShowShortcutBar(true);
		} else {
		}
	};

	const handleShowTranscript = () => {
		setActivePanel('transcript');
	};

	const handleShowLiveIntelligence = () => {
		// Mark current threads as seen when switching to live intelligence
		const currentThreadCount = info?.liveIntelligenceData?.allThreads?.length || 0;
		setLastSeenThreadCount(currentThreadCount);

		setActivePanel('live-intelligence');
	};

	// Function to send recording state updates to Dynamic Island
	const sendRecordingStateUpdate = () => {
		const state = {
			isRecording,
			isPaused: isMuted,
			timer,
			isLiveIntelligenceOpen: activePanel === 'live-intelligence',
			transcriptionsCount: localTranscriptionsRef.current?.length || 0,
			showShortcutBar,
			controlledByDynamicIsland: isDynamicIslandControlled,
			isDynamicIslandControlled,
		};

		// Use IPC to send state update to main process, which will forward to Dynamic Island
		window?.electronApi.overlay.sendStateUpdate(state);
	};

	const handleAskAIClick = () => {
		// Open Ask AI window via electron API
		window?.electronApi.askAI.toggleWindow();
	};

	// Effects
	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, []);

	useEffect(() => {
		isMountedRef.current = true;

		// Listen for commands from Dynamic Island via main process
		const handleOverlayCommand = (event) => {
			const { action, data } = event;

			// Mark as Dynamic Island controlled and hide ShortcutBar permanently
			setIsDynamicIslandControlled(true);
			setShowShortcutBar(false);

			switch (action) {
				case 'startRecording':
					handleDynamicIslandListenClick(data);
					break;
				case 'stopRecording':
					handleStopTranscription();
					break;
				case 'pauseRecording':
					handleTogglePause();
					break;
				case 'resumeRecording':
					handleTogglePause();
					break;
				case 'toggleLiveIntelligence':
					handleDynamicIslandListenClick();
					break;
				case 'getRecordingState':
					// Send current state back to Dynamic Island
					sendRecordingStateUpdate();
					break;
				case 'enableAiIntelligence':
					toggleAiIntelligence(true);
					break;
				case 'disableAiIntelligence':
					toggleAiIntelligence(false);
					break;
				default:
					console.warn('❓ Unknown Dynamic Island command:', event.action);
			}
		};

		// Set up listener for overlay commands from Dynamic Island
		if (window.electronApi?.overlay?.onCommand) {
			window.electronApi.onNotchdropToMainWindowEvent(handleOverlayCommand);
		} else {
			console.error('❌ Overlay command listener not available');
		}

		return () => {
			isMountedRef.current = false;
			// Clean up overlay command listener
			if (window.electronApi?.removeNotchdropToMainWindowEventListener) {
				window.electronApi.removeNotchdropToMainWindowEventListener();
			}
		};
	}, [toggleMute, startRecording, stopRecording]);

	// Check ask AI input focus state periodically
	useEffect(() => {
		const checkAskAIFocus = async () => {
			try {
				const result = await window.electronApi.askAI.getInputFocus();
				if (result.success) {
					setIsAskAIInputFocused(result.isFocused);
				}
			} catch (error) {
				console.error('Error checking ask AI input focus:', error);
			}
		};

		// Check immediately
		checkAskAIFocus();

		// Check every 500ms to stay in sync
		const interval = setInterval(checkAskAIFocus, 500);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (isRecording) {
			if (window.electronApi) {
				window.electronApi.sendMessageFrmVeApp('meetingstarted');
			}
		}
	}, [isRecording]);

	// Send state updates to Dynamic Island when recording state changes
	useEffect(() => {
		sendRecordingStateUpdate();
	}, [
		isRecording,
		isMuted,
		timer,
		activePanel,
		localTranscriptionsRef.current?.length || 0,
		showShortcutBar,
		isDynamicIslandControlled,
		isConnected,
	]);

	useEffect(() => {
		if (aiTranscriptionSuggestions && aiTranscriptionSuggestions?.suggestions?.length > 0) {
			const allThreads = [];
			const askUser = [];
			const needHelp = [];
			const actions = [];
			const files = [];
			aiTranscriptionSuggestions.suggestions.forEach((suggestion) => {
				if (suggestion.entity === 'user') {
					askUser.push(suggestion);
				} else if (suggestion.entity === 'agent' && suggestion.type === 'search') {
					needHelp.push(suggestion);
				} else if (suggestion.entity === 'agent' && suggestion.type === 'action') {
					actions.push(suggestion);
				} else if (suggestion.entity === 'file') {
					files.push(suggestion);
				}
				allThreads.push(suggestion);
			});

			setInfo((prev) => ({
				...prev,
				liveIntelligenceData: {
					askUser,
					needHelp,
					actions,
					files,
					allThreads,
				},
			}));
		}
	}, [aiTranscriptionSuggestions]);

	return null;
};

export default GlobalMeetingHelper;
