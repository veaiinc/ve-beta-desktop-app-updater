import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { GripHorizontal } from 'lucide-react';
import Context from '../context/context';
import ObjectID from 'bson-objectid';
import OverlayCommands from './OverlayCommands';
import ShortcutBar from './components/ShortcutBar';
import LiveIntelligencePanel from './components/LiveIntelligencePanel';
import TranscriptPanel from './components/TranscriptPanel';
import OverlayNotification, { useOverlayNotification } from './components/OverlayNotification';
import './overlay.scss';
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
		isMeetIsOngoing: false,
		transcriptions: [],
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

	// Hashmap for live intelligence responses keyed by box_id
	const [liveIntelligenceHashmap, setLiveIntelligenceHashmap] = useState({});
	const hashmapRef = useRef({});

	// Tracking hashmap: prompt_id -> box_id mapping
	const promptToBoxMapping = useRef({});
	const boxIdCounter = useRef(0);



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

	// const handleUpdateTranscription = (newTranscript) => {
	const updateTranscriptionHelper = (transcriptionArray, newTranscript) => {
		const { source } = newTranscript;

		if (transcriptionArray.length > 0) {
			// Find the most recent transcript from the same source
			for (let i = transcriptionArray.length - 1; i >= 0; i--) {
				if (transcriptionArray[i].source === source) {
					const oldTranscript = transcriptionArray[i];

					// Logic based on the state of the previous transcript:
					// - Final AND formatted → Append new transcript (start new entry)
					// - Final but NOT formatted → Replace with new transcript
					// - Not final → Replace with new transcript
					if (oldTranscript.isFinal && oldTranscript.isTurnFormatted) {
						return [...transcriptionArray, newTranscript];
					} else {
						// Replace existing transcript (whether final-unformatted or not-final)
						const updatedArray = [...transcriptionArray];
						updatedArray[i] = newTranscript;
						return updatedArray;
					}
				}
			}
		}

		// If no match found or array is empty, append the new transcript
		return [...transcriptionArray, newTranscript];
	};

	const handleUpdateTranscription = (newTranscript) => {
		setInfo((prev) => ({
			...prev,
			transcriptions: updateTranscriptionHelper(prev.transcriptions, newTranscript),
		}));
		
		// Reset the 5-minute Are You There timer when transcription is received
		if (window.electronApi?.areYouThere?.updateTranscriptionActivity) {
			window.electronApi.areYouThere.updateTranscriptionActivity();
		}
	};

	const {
		isConnected,
		isRecording,
		isMuted,
		isPaused,
		timer,
		connectionStatus,
		startAudioCapture,
		stopRecording,
		toggleMute,
		pauseRecording,
		resumeRecording,
		// formatTime,
		startRecording,
	} = useAssemblyTranscription({
		// onTranscriptionUpdate: handleUpdateTranscription,
		onTranscriptionUpdate: handleUpdateTranscription,
		onLiveIntelligenceResponse: handleTranscriptionSuggestions,
		notification,
	});

	// Utility Functions
	const formatTime = (seconds) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(1, '0');
		const s = (seconds % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	};

	// Pure hashmap algorithm with prompt_id to box_id mapping
	const updateResponseMap = useCallback((responseMap, response) => {
		const promptId = response.prompt_id;
		const referenceId = response.reference_id;

		let targetBoxId;

		if (!referenceId || referenceId === '') {
			// Case A: Empty reference_id → Create new box for this prompt_id
			if (promptToBoxMapping.current[promptId]) {
				// prompt_id already has a box, use existing box
				targetBoxId = promptToBoxMapping.current[promptId];
				console.log(
					`📝 Empty reference_id, prompt_id ${promptId} → Using existing box: ${targetBoxId}`,
				);
			} else {
				// Create new box for this prompt_id
				targetBoxId = `b${boxIdCounter.current}`;
				boxIdCounter.current += 1;
				promptToBoxMapping.current[promptId] = targetBoxId;
				console.log(
					`📝 Empty reference_id, prompt_id ${promptId} → Created new box: ${targetBoxId}`,
				);
			}
		} else {
			// Case B: reference_id exists → Check if it maps to existing prompt_id's box
			const existingBoxId = promptToBoxMapping.current[referenceId];
			if (existingBoxId) {
				// reference_id matches a previous prompt_id, update that box
				targetBoxId = existingBoxId;
				promptToBoxMapping.current[promptId] = targetBoxId; // Update mapping for current prompt_id
				console.log(
					`🔄 reference_id ${referenceId} found in mapping → Updating box: ${targetBoxId}`,
				);
			} else {
				// New reference_id, create new box
				targetBoxId = `b${boxIdCounter.current}`;
				boxIdCounter.current += 1;
				promptToBoxMapping.current[promptId] = targetBoxId;
				console.log(
					`➕ New reference_id ${referenceId}, prompt_id ${promptId} → Created new box: ${targetBoxId}`,
				);
			}
		}

		// Update the response map with the target box
		responseMap[targetBoxId] = {
			...response,
			box_id: targetBoxId,
			reference_id: referenceId || '',
		};

		console.log(`📊 Current mapping:`, promptToBoxMapping.current);
		console.log(`📊 Current boxes:`, Object.keys(responseMap));

		return responseMap;
	}, []);

	// Process live intelligence response with timestamp
	const processLiveIntelligenceResponse = useCallback((suggestion) => {
		const timestamp = new Date().toISOString();

		// Create enhanced suggestion object with timestamp
		const enhancedSuggestion = {
			...suggestion,
			timestamp,
		};

		return enhancedSuggestion;
	}, []);

	// Apply hashmap algorithm to update responses
	const updateLiveIntelligenceHashmap = useCallback(
		(suggestion) => {
			setLiveIntelligenceHashmap((prev) => {
				// Create a copy of current hashmap
				const newHashmap = { ...prev };

				// Apply pure hashmap algorithm
				updateResponseMap(newHashmap, suggestion);

				// Update ref for consistent state
				hashmapRef.current = newHashmap;

				return newHashmap;
			});
		},
		[updateResponseMap],
	);

	// Convert hashmap to categorized arrays for UI
	const categorizeLiveIntelligenceData = useCallback((hashmap) => {
		const allThreads = [];
		const askUser = [];
		const needHelp = [];
		const actions = [];
		const files = [];

		Object.values(hashmap).forEach((suggestion) => {
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

		// Sort by timestamp (newest first)
		const sortByTimestamp = (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0);

		return {
			askUser: askUser.sort(sortByTimestamp),
			needHelp: needHelp.sort(sortByTimestamp),
			actions: actions.sort(sortByTimestamp),
			files: files.sort(sortByTimestamp),
			allThreads: allThreads.sort(sortByTimestamp),
		};
	}, []);

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

			// Clear hashmap for fresh start
			setLiveIntelligenceHashmap({});
			hashmapRef.current = {};
			promptToBoxMapping.current = {};
			boxIdCounter.current = 0;
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

		stopRecording({ meetingId: info?.meetingData?._id });

		// Reset stopping flag after cleanup
		setTimeout(() => {
			isStoppingRef.current = false;
		}, 100);
	};

	const handleTogglePause = () => {
		if (isPaused) {
			resumeRecording();
		} else {
			pauseRecording();
		}
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
					pauseRecording();
					break;
				case 'resumeRecording':
					console.log('▶️ Dynamic Island RESUME: Resuming recording...');
					resumeRecording();
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
	}, [toggleMute, startRecording, stopRecording]);

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

	// Listen for Are You There window events to hide overlay content
	useEffect(() => {
		const handleAreYouThereShow = (data) => {
			console.log('🏠 Are You There window shown - hiding overlay content', data);

			// Hide the overlay content when Are You There window appears
			if (activePanel) {
				setActivePanel(null);
			}
			setShowShortcutBar(false);
		};

		const handleAreYouThereHide = () => {
			console.log('🏠 Are You There window hidden - overlay content can be shown again');
			// Note: We don't automatically restore the panel here as it should be controlled by user interaction
		};

		// Set up listeners for Are You There window events
		if (window.electronApi?.areYouThere?.onShowCommand) {
			window.electronApi.areYouThere.onShowCommand(handleAreYouThereShow);
		}

		if (window.electronApi?.areYouThere?.onCloseCommand) {
			window.electronApi.areYouThere.onCloseCommand(handleAreYouThereHide);
		}

		return () => {
			if (window.electronApi?.areYouThere?.removeShowCommandListener) {
				window.electronApi.areYouThere.removeShowCommandListener();
			}
			if (window.electronApi?.areYouThere?.removeCloseCommandListener) {
				window.electronApi.areYouThere.removeCloseCommandListener();
			}
		};
	}, [activePanel]);

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

	const handleHideOverlay = () => {
		// Hide overlay window without stopping recording
		if (window.electronApi?.overlay?.hideOverlayWindow) {
			window.electronApi.overlay.hideOverlayWindow();
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
			isPaused: isPaused,
			timer,
			isLiveIntelligenceOpen: activePanel === 'live-intelligence',
			transcriptionsCount: info?.transcriptions?.length,
			showShortcutBar,
			controlledByDynamicIsland: isDynamicIslandControlled,
			isDynamicIslandControlled,
		};

		console.log('📡 Sending state to Dynamic Island:', state);

		// Use IPC to send state update to main process, which will forward to Dynamic Island
		window.electronApi.overlay?.sendStateUpdate?.(state);
	};

	const handleAskAIClick = () => {
		// Open Ask AI window via electron API
		window.electronApi.askAI?.toggleWindow?.();
	};

	// Function to manually reset Dynamic Island control state
	const resetDynamicIslandControl = () => {
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
		if (!containerRef.current) return { width: 600, height: 50 };

		const rect = containerRef.current.getBoundingClientRect();
		let calculatedWidth = rect.width;
		let calculatedHeight = rect.height;

		// Dynamic width calculation based on layout - use exact content width
		if (activePanel === 'live-intelligence') {
			// Panel is open: use exact panel width without extra padding
			calculatedWidth = 555; // Exact panel width
		} else if (activePanel === 'transcript') {
			calculatedWidth = 555; // Exact panel width
		} else if (showShortcutBar && !isDynamicIslandControlled) {
			// Only shortcut bar visible: use actual content width
			calculatedWidth = Math.max(rect.width, 400);
		} else {
			// Controlled by Dynamic Island or no controls: minimal width
			calculatedWidth = 32; // Just padding
		}

		// Dynamic height calculation - use exact content height
		if (activePanel === 'live-intelligence' || activePanel === 'transcript') {
			// Panel is open: use exact content height without extra padding
			calculatedHeight = Math.max(rect.height, 200);
		} else if (showShortcutBar && !isDynamicIslandControlled) {
			// Only shortcut bar visible: use actual content height
			calculatedHeight = Math.max(rect.height, 50);
		} else {
			// Controlled by Dynamic Island: minimal height
			calculatedHeight = 32; // Minimal height when hidden
		}

		return {
			width: Math.min(calculatedWidth, window.screen.width * 0.8), // Max 80% of screen width
			height: Math.min(calculatedHeight, window.screen.height * 0.8), // Max 80% of screen height
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

		// ResizeObserver removed - resizing is disabled, only content changes trigger updates

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

	// Sync isPaused state with hook
	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			isPaused: isPaused,
		}));
	}, [isPaused]);

	// Send state updates to Dynamic Island when recording state changes
	useEffect(() => {
		sendRecordingStateUpdate();
	}, [
		isRecording,
		isMuted,
		isPaused,
		timer,
		activePanel,
		info?.transcriptions?.length,
		showShortcutBar,
		isDynamicIslandControlled,
		isConnected,
	]);

	// Process aiTranscriptionSuggestions with hashmap logic
	useEffect(() => {
		if (aiTranscriptionSuggestions && aiTranscriptionSuggestions?.suggestions?.length > 0) {
			console.log(
				'🧠 Processing live intelligence suggestions with hashmap logic:',
				aiTranscriptionSuggestions.suggestions,
			);

			// Process each suggestion with pure hashmap algorithm
			aiTranscriptionSuggestions.suggestions.forEach((suggestion) => {
				const enhancedSuggestion = processLiveIntelligenceResponse(suggestion);
				updateLiveIntelligenceHashmap(enhancedSuggestion);
			});
		}
	}, [
		aiTranscriptionSuggestions,
		processLiveIntelligenceResponse,
		updateLiveIntelligenceHashmap,
	]);

	// Update categorized data when hashmap changes
	useEffect(() => {
		const categorizedData = categorizeLiveIntelligenceData(liveIntelligenceHashmap);

		setInfo((prev) => ({
			...prev,
			liveIntelligenceData: categorizedData,
		}));

		console.log('📊 Updated categorized live intelligence data:', categorizedData);
	}, [liveIntelligenceHashmap, categorizeLiveIntelligenceData]);

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
					<div className="live-intelligence-drag-handle">
						<GripHorizontal size={16} color="rgba(255, 255, 255, 0.7)" />
					</div>
					<LiveIntelligencePanel
						onClose={handleHideOverlay}
						onShowTranscript={handleShowTranscript}
						transcriptions={aiTranscriptionSuggestions}
						isRecording={isRecording}
						isPaused={isPaused}
						timer={timer}
						formatTime={formatTime}
						socketData={info?.liveIntelligenceData}
					/>
				</div>
			)}
			{/* Transcript panel */}
			{activePanel === 'transcript' && (
				<div className="transcript-container">
					<div className="transcript-drag-handle">
						<GripHorizontal size={16} color="rgba(255, 255, 255, 0.7)" />
					</div>
					<TranscriptPanel
						onClose={handleHideOverlay}
						onShowLiveIntelligence={handleShowLiveIntelligence}
						transcriptions={info?.transcriptions}
						isRecording={isRecording}
						isPaused={isPaused}
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
