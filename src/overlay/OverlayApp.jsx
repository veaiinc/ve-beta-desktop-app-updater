import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import Context from '../context/context';
import useLiveIntelligenceStream from '../hooks/useLiveIntelligenceStream';
import useRecallStream from '../hooks/useRecallStream';
import ObjectID from 'bson-objectid';
import OverlayCommands from './OverlayCommands';
import ShortcutBar from './components/ShortcutBar';
import LiveIntelligencePanel from './components/LiveIntelligencePanel';
import TranscriptPanel from './components/TranscriptPanel';
import OverlayNotification, { useOverlayNotification } from './components/OverlayNotification';
import './overlay.scss';
import { transcription_socket } from '../services/config.live';
import useAssemblyTranscription from './hooks/useAssemblyTranscription';

const OverlayApp = () => {
	const containerRef = useRef(null);
	// State to control which panel is shown: 'live-intelligence', 'transcript', or null
	const [activePanel, setActivePanel] = useState(null);

	// State to control whether to show ShortcutBar (false when controlled by Dynamic Island)
	const [showShortcutBar, setShowShortcutBar] = useState(false);
	const [isDynamicIslandControlled, setIsDynamicIslandControlled] = useState(false);

	// Custom notification system
	const notification = useOverlayNotification();

	const [info, setInfo] = useState({
		meetingId: null,
		isMeetIsOngoing: false,
		transcriptions: [],
		isPaused: false,
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

	// Context
	const {
		notes: { getLiveKitToken, deleteLiveKitRoom, createMeetBot },
		profileInfo: { tennantSettingsData, getTenantSettings },
		templates: {
			handleTranscriptionSuggestions,
			aiTranscriptionSuggestions,
			updateStateValues,
		},
	} = useContext(Context);

	const handleUpdateTranscription = (newTranscript) => {
		setInfo((prev) => {
			const transcriptions = prev.transcriptions || [];

			// Get the transcript text from various possible sources
			const transcriptText =
				newTranscript.transcript || newTranscript.displayedText || newTranscript.text || '';

			// Check if this transcript already exists (to avoid duplicates)
			const existingTranscript = transcriptions.find(
				(t) =>
					t.text === transcriptText ||
					t.transcript === transcriptText ||
					t.id === newTranscript.id, // Also check by ID
			);

			if (existingTranscript) {
				return prev; // Don't add duplicate
			}

			// Check if this is a continuation of the last transcript (same session)
			const lastTranscript = transcriptions[transcriptions.length - 1];
			let isContinuation = false;
			if (newTranscript?.isTurnFormatted) {
				isContinuation = true;
			} else {
				isContinuation = lastTranscript && !lastTranscript.isFinal;
			}

			if (!newTranscript.isFinal) {
				// Partial transcript - update the last entry if it's a continuation
				if (isContinuation) {
					// Update the last entry with the new partial text
					const updated = [...transcriptions];
					updated[updated.length - 1] = {
						...updated[updated.length - 1],
						...newTranscript,
						text: transcriptText,
						transcript: transcriptText,
						time: new Date().toLocaleTimeString(),
					};
					return { ...prev, transcriptions: updated };
				} else {
					// New partial transcript - add as new entry
					return {
						...prev,
						transcriptions: [
							...transcriptions,
							{
								...newTranscript,
								text: transcriptText,
								transcript: transcriptText,
								time: new Date().toLocaleTimeString(),
							},
						],
					};
				}
			} else {
				// Final transcript - update the last entry if it's a continuation, otherwise append
				if (isContinuation) {
					// Finalize the last entry
					const updated = [...transcriptions];
					updated[updated.length - 1] = {
						...updated[updated.length - 1],
						...newTranscript,
						text: transcriptText,
						transcript: transcriptText,
						time: new Date().toLocaleTimeString(),
						isFinal: true,
					};
					return { ...prev, transcriptions: updated };
				} else {
					// New final transcript - append as new entry
					return {
						...prev,
						transcriptions: [
							...transcriptions,
							{
								...newTranscript,
								text: transcriptText,
								transcript: transcriptText,
								time: new Date().toLocaleTimeString(),
								isFinal: true,
							},
						],
					};
				}
			}
		});
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
	} = useAssemblyTranscription({
		onTranscriptionUpdate: handleUpdateTranscription,
		onLiveIntelligenceResponse: handleTranscriptionSuggestions,
		notification,
	});

	const { closeWebSocketConnection: closeLiveIntelligenceConnection } =
		useLiveIntelligenceStream();

	// Recall Stream Hook for Live Intelligence
	const {
		createWebSocketConnection: createRecallConnection,
		closeWebSocketConnection: closeRecallConnection,
		sendMessage: sendRecallMessage,
	} = useRecallStream();

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

	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, []);

	const handleStartTranscription = async () => {
		// Reset stopping flag
		isStoppingRef.current = false;

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

		// Create meeting via API
		const meetingResponse = await createMeetBot({ input: meetingInput });

		if (meetingResponse && meetingResponse[0] === true) {
			const meetingData = meetingResponse[1]?.data?.startMeeting;
			console.log('Meeting created successfully:', meetingData);

			// Store meeting data and ID for later use

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

			setInfo((prev) => ({
				...prev,
				isMeetIsOngoing: true,
				meetingData: meetingData,
				transcriptions: [],
				liveIntelligenceData: {
					askUser: [],
					needHelp: [],
					actions: [],
					files: [],
					allThreads: [],
				},
			}));
		} else {
			console.error('Failed to create meeting:', meetingResponse);
			notification.error(
				'Meeting creation failed',
				'Failed to create meeting. Please try again.',
			);
			return;
		}
	};

	const handleStopTranscription = () => {
		// Set stopping flag to prevent further processing
		isStoppingRef.current = true;

		sessionIdRef.current = null;

		stopRecording();
		closeLiveIntelligenceConnection();
		closeRecallConnection();

		setInfo((prev) => ({
			...prev,
			isMeetIsOngoing: false,
			meetingData: null,
			transcriptions: [],
			liveIntelligenceData: {
				askUser: [],
				needHelp: [],
				actions: [],
				files: [],
				allThreads: [],
			},
		}));

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
		console.log('isMuted', isMuted);
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
					handleTogglePause();
					break;
				case 'resumeRecording':
					console.log('▶️ Dynamic Island RESUME: Resuming recording...');
					handleTogglePause();
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
			// Clean up overlay command listener
			if (window.electronApi?.overlay?.removeCommandListener) {
				window.electronApi.overlay.removeCommandListener();
			}
		};
	}, [toggleMute]);

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

	// Function to send recording state updates to Dynamic Island
	const sendRecordingStateUpdate = () => {
		const state = {
			isRecording,
			isPaused: isMuted,
			timer,
			isLiveIntelligenceOpen: activePanel === 'live-intelligence',
			transcriptionsCount: info?.transcriptions?.length,
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

	// Function to manually reset Dynamic Island control state
	const resetDynamicIslandControl = () => {
		console.log('🔄 Manually resetting Dynamic Island control state');
		setIsDynamicIslandControlled(false);
		setShowShortcutBar(false);
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
		isMuted,
		timer,
		activePanel,
		info?.transcriptions?.length,
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

	return (
		<div
			ref={containerRef}
			className="overlay-app"
			// style={{ backgroundColor: 'red', width: '400px', height: '500px',display:"block" }}
		>
			{/* {meetingData && <MeetingBody meetingData={meetingData} />} */}

			<div className="overlay-container overlay-content" data-overlay-content="true">
				{/* Shortcut bar - only show when not controlled by Dynamic Island */}
				{showShortcutBar && (
					<ShortcutBar
						onListenClick={handleListenClick}
						isLiveIntelligenceOpen={activePanel === 'live-intelligence'}
						onAskAIClick={handleAskAIClick}
						isRecording={isRecording}
						onStopRecording={handleStopTranscription}
						// onPauseRecording={handlePauseTranscription}
						// onResumeRecording={handleResumeTranscription}
						onPauseRecording={() => {}}
						onResumeRecording={() => {}}
						isPaused={isMuted}
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
						transcriptions={aiTranscriptionSuggestions}
						isRecording={isRecording}
						isPaused={isMuted}
						timer={timer}
						formatTime={formatTime}
						socketData={info?.liveIntelligenceData}
					/>
				</div>
			)}
			{/* Transcript panel */}
			{activePanel === 'transcript' && (
				<div className="transcript-container">
					<TranscriptPanel
						onClose={handleClosePanel}
						onShowLiveIntelligence={handleShowLiveIntelligence}
						transcriptions={info?.transcriptions}
						isRecording={isRecording}
						isPaused={isMuted}
						timer={timer}
						isConnected={isConnected}
						// localAudioTrack={localAudioTrack}
						formatTime={formatTime}
						onStartTranscription={handleStartTranscription}
						onStopTranscription={handleStopTranscription}
						// onMuteAudio={muteAudio}
						// onUnmuteAudio={unmuteAudio}
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
