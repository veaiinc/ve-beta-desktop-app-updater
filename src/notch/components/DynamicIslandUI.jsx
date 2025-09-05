import React, { useEffect, useRef, useState, useContext } from 'react';
import {
	HomeIcon,
	LockIcon,
	WebcamIcon,
	ArrowIcon,
	ClockIcon,
	PlayIcon,
	PauseIcon,
	StopIcon,
	PlusIcon,
	BackIcon,
	VoiceModeIcon,
	VoiceModeIconWhite,
	CloseIcon,
	MicrophoneIcon,
	MutedMicrophoneIcon,
	AudioVisualizerIcon,
} from './DynamicIslandIcons';
import './DynamicIslandUI.scss';
import useUpdatedVoiceIntegration from '../../hooks/useUpdatedVoiceIntegration';
import Context from '../../context/context';
import { LiveKitRoom, RoomAudioRenderer, StartAudio } from '@livekit/components-react';
import Voice from '../../views/components/chat/Voice';
import { checkDevices } from '../../helpers';

// Camera permission utilities - simplified for Electron
const stopCamera = (stream) => {
	if (stream) {
		stream.getTracks().forEach((track) => track.stop());
	}
};

const DynamicIslandUI = () => {
	console.log('🏝️ DynamicIslandUI component rendering...');
	const dynamicIslandRef = useRef(null);
	const videoRef = useRef(null);
	const chatInputRef = useRef(null); // Add ref for chat input
	const voiceMessagesRef = useRef(null); // Add ref for voice messages container
	const [isExpanded, setIsExpanded] = useState(false); // Start collapsed by default
	console.log('🏝️ Initial isExpanded state:', false);
	const [isConnected, setIsConnected] = useState(false);
	// Overlay state - synced from overlay window
	const [isRecording, setIsRecording] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [timer, setTimer] = useState(0);
	const [isLiveIntelligenceOpen, setIsLiveIntelligenceOpen] = useState(false);
	const [controlledByDynamicIsland, setControlledByDynamicIsland] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	// Chat mode state
	const [isChatMode, setIsChatMode] = useState(false);
	const [chatInput, setChatInput] = useState('');
	const [isSendingMessage, setIsSendingMessage] = useState(false);
	const [isSettingChatMode, setIsSettingChatMode] = useState(false); // Prevent rapid focus changes
	// Audio recording state to prevent rapid clicks
	const [isAudioClickProcessing, setIsAudioClickProcessing] = useState(false);
	// Camera state
	const [isCameraActive, setIsCameraActive] = useState(false);
	const [cameraStream, setCameraStream] = useState(null);
	const [cameraPermission, setCameraPermission] = useState('not-determined');
	const [cameraError, setCameraError] = useState(null);
	const [isCameraStarting, setIsCameraStarting] = useState(false);
	const [cameraStatus, setCameraStatus] = useState('idle'); // 'idle', 'starting', 'active', 'error'

	// Voice mode state
	const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
	const [voiceConnectionStatus, setVoiceConnectionStatus] = useState('disconnected'); // 'disconnected', 'connecting', 'connected', 'error'
	const [voiceError, setVoiceError] = useState(null);
	const [showVoiceInterface, setShowVoiceInterface] = useState(false);
	const [deviceInfo, setDeviceInfo] = useState({});
	const [voiceMessages, setVoiceMessages] = useState([]);
	const [currentVoiceStatus, setCurrentVoiceStatus] = useState('Listening');
	const [isMicrophoneMuted, setIsMicrophoneMuted] = useState(false);

	// Voice integration hook
	const { shouldConnect, token, serverUrl, handleConnect, handleDisconnect, resetState } =
		useUpdatedVoiceIntegration();

	// Get voice integration data from context
	const {
		aiSetup: { voiceIntegrationData, updateAiSetupState },
	} = useContext(Context);

	useEffect(() => {
		// Check authentication status
		const checkAuthStatus = () => {
			const usertoken = localStorage.getItem('usertoken');
			setIsAuthenticated(!!usertoken);
		};

		// Initial check
		checkAuthStatus();

		// Listen for storage changes to detect login/logout
		const handleStorageChange = (e) => {
			if (e.key === 'usertoken') {
				checkAuthStatus();
			}
		};

		window.addEventListener('storage', handleStorageChange);

		// Check if we're in Electron environment
		if (window.electronApi && window.electronApi.dynamicIsland) {
			setIsConnected(true);

			// Listen for dynamic island state changes
			window.electronApi.dynamicIsland.onStateChange((data) => {
				console.log('🏝️ Dynamic Island state changed:', data);
				if (data.expanded !== undefined) {
					console.log('🏝️ Setting isExpanded to:', data.expanded);
					setIsExpanded(data.expanded);
				}
			});

			// Listen for overlay state changes to sync recording state
			window.electronApi.dynamicIsland.onOverlayStateChange((state) => {
				console.log('🏝️ Dynamic Island received overlay state:', state);
				setIsRecording(state.isRecording);
				setIsPaused(state.isPaused);
				setTimer(state.timer);
				setIsLiveIntelligenceOpen(state.isLiveIntelligenceOpen);
				setControlledByDynamicIsland(
					state.isDynamicIslandControlled || state.controlledByDynamicIsland || false,
				);

				console.log('🎯 Dynamic Island Control State:', {
					isDynamicIslandControlled: state.isDynamicIslandControlled,
					controlledByDynamicIsland: state.controlledByDynamicIsland,
					showShortcutBar: state.showShortcutBar,
					isRecording: state.isRecording,
				});
			});

			// Listen for voice mode trigger from wake word
			window.electronApi.dynamicIsland.onVoiceModeTrigger(() => {
				console.log('🎤 Voice mode triggered from wake word');
				// Like "Hey Siri" - always start voice mode if not already active
				// Don't toggle off if already active, just ensure it's running
				if (!isVoiceModeActive) {
					console.log('🎤 Starting voice mode from wake word');
					handleVoiceModeClick();
				} else {
					console.log('🎤 Voice mode already active, keeping it running');
				}
			});
		}

		return () => {
			// Clean up listeners
			window.removeEventListener('storage', handleStorageChange);
			if (window.electronApi?.dynamicIsland?.removeStateChangeListener) {
				window.electronApi.dynamicIsland.removeStateChangeListener();
			}
			if (window.electronApi?.dynamicIsland?.removeOverlayStateListener) {
				window.electronApi.dynamicIsland.removeOverlayStateListener();
			}
			if (window.electronApi?.dynamicIsland?.removeVoiceModeTriggerListener) {
				window.electronApi.dynamicIsland.removeVoiceModeTriggerListener();
			}
		};
	}, []);

	// Initialize device info
	useEffect(() => {
		const getDeviceInfo = async () => {
			try {
				const devices = await checkDevices();
				setDeviceInfo(devices);
			} catch (error) {
				console.error('Error getting device info:', error);
			}
		};
		getDeviceInfo();
	}, []);

	// Monitor voice connection status changes
	useEffect(() => {
		if (shouldConnect && token) {
			setVoiceConnectionStatus('connected');
			setIsVoiceModeActive(true);
			setVoiceError(null);
			setShowVoiceInterface(true);
		} else if (!shouldConnect) {
			setVoiceConnectionStatus('disconnected');
			setIsVoiceModeActive(false);
			setShowVoiceInterface(false);
		}
	}, [shouldConnect, token]);

	// Monitor voice integration data from context
	useEffect(() => {
		if (voiceIntegrationData?.shouldConnect) {
			setVoiceConnectionStatus('connected');
			setIsVoiceModeActive(true);
			setVoiceError(null);
			setShowVoiceInterface(true);
		} else if (!voiceIntegrationData?.shouldConnect) {
			setVoiceConnectionStatus('disconnected');
			setIsVoiceModeActive(false);
			setShowVoiceInterface(false);
		}
	}, [voiceIntegrationData]);

	// Reset audio click processing state when recording starts
	useEffect(() => {
		if (isRecording && isAudioClickProcessing) {
			console.log('✅ Recording started - resetting audio click processing state');
			setIsAudioClickProcessing(false);
		} else if (isRecording && !isAudioClickProcessing) {
			console.log('🔍 Recording is active but processing state was already reset');
		} else if (!isRecording && isAudioClickProcessing) {
			console.log('🔍 Not recording but processing state is still active');
		}
	}, [isRecording, isAudioClickProcessing]);

	// Fallback timeout to reset processing state if something goes wrong
	useEffect(() => {
		if (isAudioClickProcessing) {
			const timeout = setTimeout(() => {
				console.warn('⚠️ Audio click processing timeout - resetting state');
				setIsAudioClickProcessing(false);
			}, 10000); // 10 second timeout

			return () => clearTimeout(timeout);
		}
	}, [isAudioClickProcessing]);

	// Debug audio click processing state changes
	useEffect(() => {
		console.log('🎯 Audio click processing state changed:', isAudioClickProcessing);
	}, [isAudioClickProcessing]);

	// Check camera permission on mount and when app gains focus
	useEffect(() => {
		const checkCameraPermission = async () => {
			if (window.electronApi?.askAI?.camera?.checkPermission) {
				try {
					const result = await window.electronApi.askAI.camera.checkPermission();
					if (result.success) {
						setCameraPermission(result.permission);
						console.log('Camera permission status:', result.permission);
					}
				} catch (error) {
					console.error('Error checking camera permission:', error);
					setCameraPermission('error');
				}
			}
		};

		// Initial check
		checkCameraPermission();

		// Check permission when app gains focus (user might have changed system settings)
		const handleFocus = () => {
			console.log('App gained focus - checking camera permission...');
			checkCameraPermission();
		};

		// Listen for focus events
		window.addEventListener('focus', handleFocus);
		window.addEventListener('visibilitychange', () => {
			if (!document.hidden) {
				handleFocus();
			}
		});

		return () => {
			window.removeEventListener('focus', handleFocus);
			window.removeEventListener('visibilitychange', handleFocus);
		};
	}, []);

	// Cleanup camera stream on unmount
	useEffect(() => {
		return () => {
			if (cameraStream) {
				console.log('Cleaning up camera stream on unmount');
				stopCamera(cameraStream);
				setCameraStream(null);
				setIsCameraActive(false);
				setCameraStatus('idle');
			}
		};
	}, [cameraStream]);

	// Handle camera device changes - simplified
	useEffect(() => {
		const handleDeviceChange = () => {
			console.log('Camera device changed');
		};

		navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

		return () => {
			navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
		};
	}, []);

	// Handle camera stream errors - simplified
	useEffect(() => {
		if (cameraStream) {
			const handleTrackEnded = () => {
				console.log('Camera track ended');
			};

			cameraStream.getVideoTracks().forEach((track) => {
				track.addEventListener('ended', handleTrackEnded);
			});

			return () => {
				cameraStream.getVideoTracks().forEach((track) => {
					track.removeEventListener('ended', handleTrackEnded);
				});
			};
		}
	}, [cameraStream]);

	// Handle video element setup when camera stream changes
	useEffect(() => {
		if (cameraStream && videoRef.current) {
			try {
				console.log('Setting up video element with camera stream...');
				videoRef.current.srcObject = cameraStream;

				// Add event listeners for debugging
				videoRef.current.onloadedmetadata = () => {
					console.log('✅ Video metadata loaded');
					console.log(
						'Video dimensions:',
						videoRef.current.videoWidth,
						'x',
						videoRef.current.videoHeight,
					);
				};

				videoRef.current.oncanplay = () => {
					console.log('✅ Video can play');
				};

				videoRef.current.onplay = () => {
					console.log('✅ Video started playing');
				};

				videoRef.current.onerror = (e) => {
					console.error('❌ Video error:', e);
				};

				// Start playing the video
				videoRef.current.play().catch((e) => {
					console.error('Error playing video:', e);
				});
			} catch (error) {
				console.error('Error setting up video element:', error);
			}
		}
	}, [cameraStream]);

	// Timer is now managed by overlay system, no local timer effect needed

	// Hover events
	const handleMouseEnter = () => {
		console.log('🎯 MOUSE ENTER - Expanding to show rich UI!');
		if (!isExpanded && isConnected) {
			expand();
		}
	};

	const handleMouseLeave = () => {
		console.log('🚪 MOUSE LEAVE - Collapsing to pill!');
		// Always allow collapse - voice mode should continue working in background
		if (isExpanded && isConnected) {
			collapse();
		}
	};

	const expand = async () => {
		if (isExpanded || !isConnected) return;

		try {
			console.log('📏 Expanding Dynamic Island to show rich UI');
			const result = await window.electronApi.dynamicIsland.expand();
			if (result.success) {
				setIsExpanded(true);
				// Ensure window is focusable when expanded, but only if not already setting
				if (window.electronApi?.dynamicIsland?.setChatMode && !isSettingChatMode) {
					setIsSettingChatMode(true);
					window.electronApi.dynamicIsland
						.setChatMode(true)
						.then(() => {
							setIsSettingChatMode(false);
						})
						.catch(() => {
							setIsSettingChatMode(false);
						});
				}
			}
		} catch (error) {
			console.error('❌ Expand IPC error:', error);
		}
	};

	const collapse = async () => {
		if (!isExpanded || !isConnected) return;

		try {
			console.log('📏 Collapsing Dynamic Island to pill');
			const result = await window.electronApi.dynamicIsland.collapse();
			if (result.success) {
				setIsExpanded(false);
				// Disable focus when collapsing
				if (window.electronApi?.dynamicIsland?.setChatMode) {
					window.electronApi.dynamicIsland.setChatMode(false);
				}
			}
		} catch (error) {
			console.error('❌ Collapse IPC error:', error);
		}
	};

	// Click handlers for interactive elements
	const handleHomeClick = () => {
		console.log('🏠 Home icon clicked');

		// Restore or recreate main window when home icon is clicked (cross-platform)
		if (window.electronApi?.home?.restoreMainWindow) {
			window.electronApi.home
				.restoreMainWindow()
				.then((result) => {
					if (result.success) {
						console.log('✅ Main window restored/recreated successfully');
						if (result.message) {
							console.log('ℹ️', result.message);
						}
					} else {
						console.warn('⚠️ Failed to restore/recreate main window:', result.error);
					}
				})
				.catch((error) => {
					console.error('❌ Error restoring/recreating main window:', error);
				});
		}
	};

	const handleAudioClick = async () => {
		console.log('🎵 Start recording clicked - triggering overlay');

		// Prevent rapid clicking and multiple API calls
		if (isAudioClickProcessing || isRecording) {
			console.log('⚠️ Audio click blocked - already processing or recording in progress');
			return;
		}

		// Additional safety check for API availability
		if (!window.electronApi?.overlay?.startRecording) {
			console.error('❌ Overlay startRecording API not available in Dynamic Island');
			return;
		}

		// Exit chat mode when starting recording
		if (isChatMode) {
			setIsChatMode(false);
			setChatInput('');
		}

		// Set processing state to prevent rapid clicks
		setIsAudioClickProcessing(true);
		console.log('🔒 Audio click processing state set - preventing rapid clicks');

		try {
			console.log('🚀 Calling overlay.startRecording()...');
			const result = await window.electronApi.overlay.startRecording();
			console.log('📥 Overlay start recording result:', result);

			// Only reset processing state if API call was successful
			if (result && result.success) {
				console.log(
					'✅ Recording started successfully - processing state will be reset when recording begins',
				);
			} else {
				console.warn('⚠️ Recording start failed:', result?.error);
				// Reset processing state on failure so user can retry
				setIsAudioClickProcessing(false);
				console.log('🔄 Processing state reset due to API failure');
			}
		} catch (error) {
			console.error('❌ Error triggering overlay from Dynamic Island:', error);
			// Reset processing state on error so user can retry
			setIsAudioClickProcessing(false);
			console.log('🔄 Processing state reset due to error');
		}
	};

	const handleVoiceModeClick = async () => {
		console.log('🎤 Clicked for voice mode');

		try {
			if (isVoiceModeActive) {
				// Disconnect voice assistant
				console.log('Disconnecting voice assistant...');
				setVoiceConnectionStatus('disconnecting');
				setShowVoiceInterface(false);
				await handleDisconnect();
				setVoiceConnectionStatus('disconnected');
				setIsVoiceModeActive(false);
				setVoiceError(null);

				// Don't show external voice widget, we're showing it inline
				updateAiSetupState({ showVoiceWidget: false });

				// Reset the voice integration hook state if available
				if (resetState) {
					resetState();
				}
			} else {
				// Connect to voice assistant - clear previous data for fresh start
				console.log('Connecting to voice assistant...');
				setVoiceConnectionStatus('connecting');
				setVoiceError(null);

				// Clear previous voice data for fresh start
				setVoiceMessages([]);
				setCurrentVoiceStatus('Listening');
				setIsMicrophoneMuted(false);

				await handleConnect();

				// Don't show external voice widget, we'll show it inline
				updateAiSetupState({ showVoiceWidget: false });

				// The useEffect will handle the status update when shouldConnect changes
				console.log('Voice assistant connection initiated');
			}
		} catch (error) {
			console.error('Error in voice mode:', error);
			setVoiceConnectionStatus('error');
			setVoiceError(error.message || 'Failed to connect to voice assistant');
		}
	};

	// Custom disconnect handler for inline voice component
	const handleInlineVoiceDisconnect = async () => {
		console.log('🔌 Disconnecting inline voice assistant...');
		setVoiceConnectionStatus('disconnecting');
		setShowVoiceInterface(false);
		setVoiceMessages([]); // Clear messages
		setCurrentVoiceStatus('Listening');
		setIsMicrophoneMuted(false); // Reset microphone state
		await handleDisconnect();
		setVoiceConnectionStatus('disconnected');
		setIsVoiceModeActive(false);
		setVoiceError(null);
		updateAiSetupState({ showVoiceWidget: false });

		// Reset voice integration data to restart fresh
		if (updateAiSetupState) {
			updateAiSetupState({
				showVoiceWidget: false,
				voiceIntegrationData: {
					...voiceIntegrationData,
					shouldConnect: false,
					token: null,
					serverUrl: null,
				},
			});
		}

		// Reset the voice integration hook state if available
		if (resetState) {
			resetState();
		}
	};

	// Handle voice messages from the Voice component
	const handleVoiceMessage = (message, isUser = false) => {
		setVoiceMessages((prev) => [...prev, { text: message, isUser, timestamp: Date.now() }]);
	};

	// Handle voice status updates
	const handleVoiceStatusUpdate = (status) => {
		// Don't override mute status unless it's a significant state change
		if (status === 'disconnected' || status === 'connecting') {
			setCurrentVoiceStatus(status);
		} else if (!isMicrophoneMuted) {
			// Only update status if microphone is not muted
			switch (status) {
				case 'listening':
				case 'Listening...':
					setCurrentVoiceStatus('Listening');
					break;
				case 'thinking':
				case 'Thinking...':
					setCurrentVoiceStatus('Thinking');
					break;
				case 'speaking':
				case 'Speaking...':
					setCurrentVoiceStatus('Speaking');
					break;
				default:
					setCurrentVoiceStatus('Listening');
			}
		} else {
			// When muted, always show "Muted" status
			setCurrentVoiceStatus('Muted');
		}
	};

	// Handle real-time transcription updates from Voice component
	const handleTranscriptionUpdate = (transcripts) => {
		if (transcripts && transcripts.length > 0) {
			const newMessages = transcripts.map((msg) => ({
				text: msg.message || msg.text || '',
				isUser: msg.isSelf || msg.name === 'You',
				timestamp: msg.timestamp || Date.now(),
			}));

			setVoiceMessages(newMessages);
		}
	};

	// Auto-scroll voice messages to bottom when new messages arrive
	useEffect(() => {
		if (voiceMessagesRef.current && voiceMessages.length > 0) {
			// Small delay to ensure DOM has updated
			setTimeout(() => {
				voiceMessagesRef.current.scrollTop = voiceMessagesRef.current.scrollHeight;
			}, 50);
		}
	}, [voiceMessages]);

	// Handle microphone mute/unmute toggle
	const handleMicrophoneToggle = () => {
		const newMuteState = !isMicrophoneMuted;
		setIsMicrophoneMuted(newMuteState);

		// Update voice status based on mute state
		if (newMuteState) {
			setCurrentVoiceStatus('Muted');
		} else {
			setCurrentVoiceStatus('Listening');
		}

		// Disable/enable microphone access in LiveKit when toggling
		if (window.electronApi?.dynamicIsland?.setMicrophoneAccess) {
			window.electronApi.dynamicIsland.setMicrophoneAccess(!newMuteState);
		}

		console.log('🎤 Microphone toggled:', newMuteState ? 'Muted' : 'Unmuted');
	};

	const handleWebcamClick = async () => {
		console.log('📹 Webcam section clicked');

		// Exit chat mode when webcam is clicked
		if (isChatMode) {
			setIsChatMode(false);
			setChatInput('');
		}

		// Clear any previous errors
		setCameraError(null);

		// If camera is already active, stop it
		if (isCameraActive) {
			console.log('Stopping active camera...');
			stopCamera(cameraStream);
			setCameraStream(null);
			setIsCameraActive(false);
			setCameraStatus('idle');
			return;
		}

		// Check if getUserMedia is available
		if (!navigator.mediaDevices?.getUserMedia) {
			setCameraError('Camera not supported in this browser');
			return;
		}

		// Check current camera permission status first
		if (window.electronApi?.askAI?.camera?.checkPermission) {
			try {
				console.log('Checking current camera permission status...');
				const checkResult = await window.electronApi.askAI.camera.checkPermission();
				console.log('Camera permission check result:', checkResult);

				if (checkResult.success) {
					if (checkResult.permission === 'denied') {
						setCameraError(
							'Camera access denied. Please enable camera access in System Preferences > Security & Privacy > Privacy > Camera.',
						);
						return;
					} else if (checkResult.permission === 'restricted') {
						setCameraError('Camera access is restricted by system policy.');
						return;
					}
				}
			} catch (error) {
				console.error('Error checking camera permission:', error);
			}
		}

		// Request camera permission if not determined
		if (window.electronApi?.askAI?.camera?.requestPermission) {
			try {
				console.log('Requesting camera permission through Electron...');
				const permissionResult = await window.electronApi.askAI.camera.requestPermission();
				console.log('Camera permission result:', permissionResult);

				if (!permissionResult.success || !permissionResult.granted) {
					setCameraError(
						permissionResult.error ||
							'Camera permission denied. Please allow camera access in system settings.',
					);
					return;
				}

				// Update permission status
				setCameraPermission(permissionResult.status);
			} catch (error) {
				console.error('Error requesting camera permission:', error);
				setCameraError('Failed to request camera permission');
				return;
			}
		}

		// Start camera immediately
		console.log('Starting camera...');
		setIsCameraStarting(true);
		setCameraStatus('starting');

		try {
			// Simple camera start with basic constraints
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 200 },
					height: { ideal: 200 },
					frameRate: { ideal: 24 },
				},
			});

			console.log('Camera started successfully');
			setCameraStream(stream);
			setIsCameraActive(true);
			setIsCameraStarting(false);
			setCameraStatus('active');

			// Set up video element
			if (videoRef.current) {
				console.log('Setting up video element in handleWebcamClick...');
				videoRef.current.srcObject = stream;
				console.log('Video srcObject set:', videoRef.current.srcObject);

				// Force video to be visible
				videoRef.current.style.display = 'block';
				videoRef.current.style.visibility = 'visible';

				videoRef.current.play().catch((e) => {
					console.error('Error playing video:', e);
				});
			} else {
				console.error('Video ref not available');
			}
		} catch (error) {
			console.error('Camera start failed:', error);
			setCameraError(`Camera error: ${error.message}`);
			setIsCameraStarting(false);
			setCameraStatus('error');
		}
	};

	// Clear camera error when user interacts with webcam section
	const handleWebcamMouseEnter = () => {
		if (cameraError) {
			setCameraError(null);
		}
	};

	// Function to manually refresh camera permissions
	const refreshCameraPermissions = async () => {
		if (window.electronApi?.askAI?.camera?.checkPermission) {
			try {
				console.log('Manually refreshing camera permissions...');
				const result = await window.electronApi.askAI.camera.checkPermission();
				if (result.success) {
					setCameraPermission(result.permission);
					console.log('Updated camera permission status:', result.permission);

					// Clear any errors if permission is now granted
					if (result.permission === 'granted' && cameraError) {
						setCameraError(null);
					}
				}
			} catch (error) {
				console.error('Error refreshing camera permissions:', error);
			}
		}
	};

	const handleChatClick = () => {
		console.log('💬 Chat section clicked');
		if (!isChatMode && !isSettingChatMode) {
			setIsChatMode(true);
			// Ensure Dynamic Island is expanded for chat mode
			if (!isExpanded && isConnected) {
				expand();
			}
			// Enable focus for input field when entering chat mode
			if (window.electronApi?.dynamicIsland?.setChatMode) {
				console.log('🔧 Enabling focus for chat mode...');
				setIsSettingChatMode(true);
				window.electronApi.dynamicIsland
					.setChatMode(true)
					.then((result) => {
						console.log('✅ Chat mode focus result:', result);
						setIsSettingChatMode(false);
					})
					.catch((error) => {
						console.error('❌ Error setting chat mode focus:', error);
						setIsSettingChatMode(false);
					});
			}
		}
	};

	const handleChatSubmit = async () => {
		console.log('🚀 handleChatSubmit called with:', { chatInput, isSendingMessage });

		if (chatInput.trim() && !isSendingMessage) {
			console.log('💬 Chat submitted:', chatInput);
			setIsSendingMessage(true);

			try {
				// Check if the API is available
				console.log('🔍 Checking if sendChatMessage API is available...');
				console.log('🔍 window.electronApi:', window.electronApi);
				console.log(
					'🔍 window.electronApi?.dynamicIsland:',
					window.electronApi?.dynamicIsland,
				);
				console.log(
					'🔍 window.electronApi?.dynamicIsland?.sendChatMessage:',
					window.electronApi?.dynamicIsland?.sendChatMessage,
				);

				// Send the chat message to AskAI via Dynamic Island API
				if (window.electronApi?.dynamicIsland?.sendChatMessage) {
					console.log(
						'🚀 Sending chat message to AskAI via Dynamic Island API:',
						chatInput,
					);

					const chatMessage = {
						type: 'dynamic-island-chat',
						message: chatInput.trim(),
						timestamp: new Date().toISOString(),
						source: 'dynamic-island',
					};

					console.log('📤 Sending chat message:', chatMessage);
					const result = await window.electronApi.dynamicIsland.sendChatMessage(
						chatMessage,
					);
					console.log('📥 Received result:', result);

					if (result.success) {
						console.log('✅ Chat message sent successfully to AskAI');
						// Clear the input after successful send
						setChatInput('');
					} else {
						console.error('❌ Failed to send chat message:', result.error);
						// Keep the input if sending failed
					}
				} else {
					console.error('❌ sendChatMessage API not available, trying overlay API...');

					// Fallback to overlay API
					if (window.electronApi?.overlay?.sendChatMessageToAskAI) {
						console.log('🔄 Using overlay API fallback...');
						const chatMessage = {
							type: 'dynamic-island-chat',
							message: chatInput.trim(),
							timestamp: new Date().toISOString(),
							source: 'dynamic-island',
						};

						const result = await window.electronApi.overlay.sendChatMessageToAskAI(
							chatMessage,
						);

						if (result.success) {
							console.log('✅ Chat message sent successfully via overlay API');
							setChatInput('');
						} else {
							console.error(
								'❌ Failed to send chat message via overlay API:',
								result.error,
							);
						}
					} else {
						console.error('❌ Both APIs not available');
						// Fallback: just clear the input
						setChatInput('');
					}
				}
			} catch (error) {
				console.error('❌ Error sending chat message:', error);
				// Keep the input if sending failed
			} finally {
				setIsSendingMessage(false);
			}
		} else {
			console.log('⚠️ Chat submit blocked:', {
				hasInput: !!chatInput.trim(),
				isSending: isSendingMessage,
			});
		}
	};

	const handleChatInputChange = (e) => {
		console.log('💬 Chat input changed:', e.target.value);
		console.log('💬 Input element:', e.target);
		console.log('💬 Input value:', e.target.value);
		console.log('💬 Input type:', e.target.type);
		console.log('💬 Input disabled:', e.target.disabled);
		console.log('💬 Input readOnly:', e.target.readOnly);
		console.log('💬 Current chatInput state:', chatInput);
		setChatInput(e.target.value);
		console.log('💬 chatInput state after setChatInput:', e.target.value);

		// Auto-resize textarea with better scrolling support
		if (chatInputRef.current) {
			const textarea = chatInputRef.current;
			const maxHeight = 200; // Maximum height before enabling scroll

			// Reset height to calculate actual content height
			textarea.style.height = 'auto';
			const scrollHeight = textarea.scrollHeight;

			// Set height based on content, but cap it at maxHeight
			if (scrollHeight <= maxHeight) {
				textarea.style.height = scrollHeight + 'px';
			} else {
				textarea.style.height = maxHeight + 'px';
				// Ensure scrollbar is visible when content exceeds maxHeight
				textarea.style.overflowY = 'auto';
			}

			// Auto-scroll to bottom when typing (common chat UX pattern)
			textarea.scrollTop = textarea.scrollHeight;
		}
	};

	const handleChatInputKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault(); // Prevent default textarea behavior
			handleChatSubmit();
		}
		// Allow Shift+Enter for new lines in textarea

		// Keyboard shortcuts for navigation in long text
		if (e.ctrlKey || e.metaKey) {
			// Ctrl (Windows) or Cmd (Mac)
			switch (e.key) {
				case 'Home':
				case 'ArrowUp':
					e.preventDefault();
					if (chatInputRef.current) {
						chatInputRef.current.scrollTop = 0; // Scroll to top
					}
					break;
				case 'End':
				case 'ArrowDown':
					e.preventDefault();
					if (chatInputRef.current) {
						chatInputRef.current.scrollTop = chatInputRef.current.scrollHeight; // Scroll to bottom
					}
					break;
			}
		}
	};

	// Recording control handlers - now use overlay API
	const handleStartRecording = async () => {
		console.log('🎤 Start recording clicked - triggering overlay');
		if (!window.electronApi?.overlay?.startRecording) {
			console.error('Overlay startRecording API not available');
			return;
		}
		try {
			const result = await window.electronApi.overlay.startRecording();
			console.log('Start recording result:', result);
		} catch (error) {
			console.error('Error starting recording from Dynamic Island:', error);
		}
	};

	const handleStopRecording = async () => {
		console.log('⏹️ Stop recording clicked - triggering overlay');
		if (!window.electronApi?.overlay?.stopRecording) {
			console.error('Overlay stopRecording API not available');
			return;
		}
		try {
			const result = await window.electronApi.overlay.stopRecording();
			console.log('Stop recording result:', result);
		} catch (error) {
			console.error('Error stopping recording from Dynamic Island:', error);
		}
	};

	const handlePauseResume = async () => {
		console.log('⏸️/▶️ Pause/Resume clicked - triggering overlay');
		try {
			if (isPaused) {
				if (!window.electronApi?.overlay?.resumeRecording) {
					console.error('Overlay resumeRecording API not available');
					return;
				}
				const result = await window.electronApi.overlay.resumeRecording();
				console.log('Resume recording result:', result);
			} else {
				if (!window.electronApi?.overlay?.pauseRecording) {
					console.error('Overlay pauseRecording API not available');
					return;
				}
				const result = await window.electronApi.overlay.pauseRecording();
				console.log('Pause recording result:', result);
			}
		} catch (error) {
			console.error('Error toggling pause/resume from Dynamic Island:', error);
		}
	};

	// Format time for display
	const formatTime = (seconds) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(1, '0');
		const s = (seconds % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	};

	// Initialize
	useEffect(() => {
		if (dynamicIslandRef.current) {
			console.log('✅ DOM loaded, Dynamic Island UI ready');
			console.log(
				'Dynamic Island dimensions:',
				dynamicIslandRef.current.offsetWidth,
				'x',
				dynamicIslandRef.current.offsetHeight,
			);
		}

		// Debug initial state
		console.log('🔍 Initial state:', {
			isConnected,
			isExpanded,
			isChatMode,
			isAuthenticated,
			chatInput,
		});
	}, []);

	// Debug chat mode changes
	useEffect(() => {
		console.log('🔍 Chat mode changed:', isChatMode);
		console.log('🔍 Chat input value:', chatInput);

		// Handle initial focus when entering chat mode with a delay to prevent rapid blinking
		if (isChatMode && chatInputRef.current && !isSettingChatMode) {
			const timer = setTimeout(() => {
				if (chatInputRef.current && isChatMode) {
					chatInputRef.current.focus();
					console.log('💬 Chat input focused after delay');
				}
			}, 150); // Small delay to prevent rapid focus changes

			return () => clearTimeout(timer);
		}

		// Reset textarea height when chat mode changes
		if (chatInputRef.current) {
			chatInputRef.current.style.height = 'auto';
		}
	}, [isChatMode, isSettingChatMode]);

	// Reset textarea height when chat input is cleared
	useEffect(() => {
		if (chatInputRef.current && !chatInput) {
			chatInputRef.current.style.height = 'auto';
		}
	}, [chatInput]);

	// Manual mouse event control (for debugging or special cases)
	const setMouseEvents = async (ignore) => {
		if (!isConnected) return;

		try {
			console.log(`🔧 Manually setting mouse events to ${ignore ? 'ignore' : 'enable'}`);
			const result = await window.electronApi.dynamicIsland.setMouseEvents(ignore);
			if (result.success) {
				console.log(`✅ Mouse events ${ignore ? 'ignored' : 'enabled'} successfully`);
			}
		} catch (error) {
			console.error('❌ Error setting mouse events:', error);
		}
	};

	console.log('🏝️ Rendering Dynamic Island with isExpanded:', isExpanded);
	return (
		<div
			ref={dynamicIslandRef}
			id="dynamicIsland"
			className={`dynamic-island ${isExpanded ? 'expanded' : 'collapsed'} ${
				isRecording ? 'recording' : ''
			} ${controlledByDynamicIsland ? 'controlled-by-dynamic-island' : ''} ${
				isChatMode ? 'chat-mode' : ''
			}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* Simple content when collapsed */}
			<div className="island-content">
				{controlledByDynamicIsland ? (
					isRecording ? (
						<div className="collapsed-recording-content">
							{isChatMode ? (
								// Chat mode in collapsed recording state
								<div className="collapsed-chat-recording">
									<div className="collapsed-chat-input">
										<input
											type="text"
											placeholder="Ask about recording..."
											className="collapsed-chat-field"
											value={chatInput}
											onChange={handleChatInputChange}
											onKeyPress={handleChatInputKeyPress}
											onFocus={() => {
												if (
													window.electronApi?.dynamicIsland
														?.setChatMode &&
													!isSettingChatMode
												) {
													setIsSettingChatMode(true);
													window.electronApi.dynamicIsland
														.setChatMode(true)
														.then(() => setIsSettingChatMode(false))
														.catch(() => setIsSettingChatMode(false));
												}
											}}
										/>
									</div>
									<div
										className="collapsed-chat-submit"
										onClick={handleChatSubmit}
									>
										<ArrowIcon />
									</div>
								</div>
							) : (
								// Normal recording state
								<>
									<span className="collapsed-recording-text">
										{isPaused
											? `Paused ${formatTime(timer)}`
											: `Recording ${formatTime(timer)}`}
									</span>
									{!isPaused && (
										<div className="collapsed-voice-animation">
											<div className="collapsed-voice-visualizer">
												<div className="audio-bar"></div>
												<div className="audio-bar"></div>
												<div className="audio-bar"></div>
												<div className="audio-bar"></div>
												<div className="audio-bar"></div>
											</div>
										</div>
									)}
									{isPaused && <PauseIcon />}
								</>
							)}
						</div>
					) : (
						'Living Intelligence'
					)
				) : showVoiceInterface ? (
					<div className="voice-agent-collapsed">
						<span>Voice Agent</span>
						<div className="voice-wave-animation">
							<div className="wave-bar"></div>
							<div className="wave-bar"></div>
							<div className="wave-bar"></div>
							<div className="wave-bar"></div>
							<div className="wave-bar"></div>
						</div>
					</div>
				) : isChatMode ? (
					'Chat Mode'
				) : (
					'Living Intelligence'
				)}
			</div>

			{/* Rich UI when expanded */}
			<div className="ui-container">
				{!isAuthenticated ? (
					/* Show hello message when not authenticated */
					<div className="welcome-section">
						<div className="welcome-message">hello</div>
						<div className="welcome-subtitle">Please log in to access features</div>
					</div>
				) : (
					/* Show full UI when authenticated */
					<>
						{/* Top row with start button and icons */}
						<div className="top-row">
							{/* Start button section */}
							<div className="start-section">
								{!isRecording && !showVoiceInterface ? (
									<div
										className={`start-button ${
											isAudioClickProcessing ? 'processing' : ''
										}`}
										onClick={handleAudioClick}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												if (!isAudioClickProcessing) {
													handleAudioClick();
												}
											}
										}}
										role="button"
										aria-label={
											isAudioClickProcessing
												? 'Starting recording...'
												: 'Start recording'
										}
										aria-disabled={isAudioClickProcessing}
										tabIndex={isAudioClickProcessing ? -1 : 0}
										style={{
											opacity: isAudioClickProcessing ? 0.6 : 1,
											pointerEvents: isAudioClickProcessing ? 'none' : 'auto',
											cursor: isAudioClickProcessing
												? 'not-allowed'
												: 'pointer',
										}}
									>
										<div className="start-icon">
											<AudioVisualizerIcon />
										</div>
										<span className="start-text">
											{isAudioClickProcessing ? (
												<>
													<div className="start-loading-spinner"></div>
													Starting...
												</>
											) : (
												'Start'
											)}
										</span>
									</div>
								) : showVoiceInterface ? (
									<div className="voice-mode-indicators">
										<div
											className="voice-mic-icon"
											onClick={handleMicrophoneToggle}
											title={
												isMicrophoneMuted
													? 'Click to unmute'
													: 'Click to mute'
											}
										>
											{isMicrophoneMuted ? (
												<MutedMicrophoneIcon />
											) : (
												<MicrophoneIcon />
											)}
										</div>
										<div
											className="voice-stop-btn"
											onClick={handleInlineVoiceDisconnect}
											title="Stop voice assistant"
										>
											<div className="stop-icon"></div>
											<span className="stop-text">Stop</span>
										</div>
									</div>
								) : (
									<div className="recording-controls">
										{/* Control mode label */}
										<div className="meeting-mode-label">
											{controlledByDynamicIsland && (
												<>
													<span>Meeting mode</span>
													{isPaused ? (
														<PauseIcon />
													) : (
														<div className="meeting-wave-animation">
															<div className="wave-bar"></div>
															<div className="wave-bar"></div>
															<div className="wave-bar"></div>
															<div className="wave-bar"></div>
															<div className="wave-bar"></div>
														</div>
													)}
												</>
											)}
										</div>
										<div
											className="control-button pause-resume-button"
											onClick={handlePauseResume}
										>
											<div className="control-icon">
												{isPaused ? <PlayIcon /> : <PauseIcon />}
											</div>
										</div>
										<div
											className="control-button stop-button"
											onClick={handleStopRecording}
										>
											<div className="control-icon">
												<StopIcon />
											</div>
										</div>
									</div>
								)}
							</div>

							{/* Right side icons */}
							<div className="right-icons">
								<div className="icon-button" title="Home" onClick={handleHomeClick}>
									<HomeIcon />
								</div>
								{/* <div className="icon-button" title="Lock" onClick={handleLockClick}>
									<LockIcon />
								</div> */}
							</div>
						</div>

						{/* Main content area */}
						<div className="main-content">
							{showVoiceInterface ? (
								/* Voice Assistant Mode - Split layout: Left=Conversation, Right=Assistant UI */
								<div className="voice-split-layout">
									{/* Left side: Conversation messages */}
									<div className="voice-conversation-left">
										<div className="voice-messages-area" ref={voiceMessagesRef}>
											{/* Show real-time voice messages or fallback to sample */}
											{voiceMessages.length > 0 ? (
												voiceMessages.map((msg, index) => (
													<div
														key={`voice-msg-${index}`}
														className="voice-message-frame"
													>
														<div className="voice-message-sender">
															{msg.isUser ? 'You' : 'Agent'}
														</div>
														<div className="voice-message-text">
															{msg.text || 'Listening...'}
														</div>
													</div>
												))
											) : (
												/* Fallback sample messages when no real-time data */
												<>
													<div className="voice-message-frame">
														<div className="voice-message-sender">
															Agent
														</div>
														<div className="voice-message-text">
															Hello, how can I help you today?
														</div>
													</div>
													<div className="voice-message-frame">
														<div className="voice-message-sender">
															You
														</div>
														<div className="voice-message-text">
															{currentVoiceStatus === 'Listening'
																? 'Listening...'
																: 'Ready to speak'}
														</div>
													</div>
												</>
											)}
										</div>
									</div>

									{/* Right side: Assistant UI with voice controls */}
									<div className="voice-assistant-right">
										{/* Hidden LiveKit integration */}
										{voiceIntegrationData?.shouldConnect &&
											voiceIntegrationData?.token && (
												<LiveKitRoom
													className="hidden-livekit-room"
													serverUrl={voiceIntegrationData.serverUrl || ''}
													token={voiceIntegrationData.token || ''}
													connect={
														voiceIntegrationData.shouldConnect || false
													}
													onError={(e) => {
														console.error(
															'LiveKit connection error:',
															e,
														);
														setVoiceError(e.message);
														setVoiceConnectionStatus('error');
													}}
												>
													<Voice
														key={`voice-${
															isMicrophoneMuted ? 'muted' : 'unmuted'
														}`}
														handleDisconnect={
															handleInlineVoiceDisconnect
														}
														deviceInfo={deviceInfo}
														onTranscriptUpdate={
															handleTranscriptionUpdate
														}
														onStatusUpdate={handleVoiceStatusUpdate}
														isMicrophoneMuted={isMicrophoneMuted}
													/>
													<RoomAudioRenderer />
													<StartAudio label="Click to enable audio playback" />
												</LiveKitRoom>
											)}

										{/* Voice controls section - positioned on right side */}
										<div
											className={`voice-controls-section ${
												currentVoiceStatus === 'Listening' &&
												!isMicrophoneMuted
													? 'listening'
													: ''
											}`}
										>
											<div className="voice-status-area">
												{/* Only show animation when not muted */}
												{!isMicrophoneMuted && (
													<div className="voice-animation-container">
														<div className="voice-visualizer">
															<div className="audio-bar"></div>
															<div className="audio-bar"></div>
															<div className="audio-bar"></div>
															<div className="audio-bar"></div>
															<div className="audio-bar"></div>
														</div>
													</div>
												)}
												<div className="voice-status-text">
													{currentVoiceStatus}
													{isMicrophoneMuted && (
														<span className="mute-indicator"> 🔇</span>
													)}
												</div>
											</div>

										</div>
									</div>
								</div>
							) : isChatMode ? (
								/* Chat mode - expanded chat interface */
								<div className="chat-expanded">
									<div className="chat-input-container">
										<textarea
											ref={chatInputRef}
											className="chat-input-field"
											placeholder="Ask me anything..."
											value={chatInput}
											onChange={handleChatInputChange}
											onKeyPress={handleChatInputKeyPress}
											onFocus={() => {
												console.log('💬 Chat input focused');
												// Only set chat mode if not already setting to prevent rapid focus changes
												if (
													window.electronApi?.dynamicIsland
														?.setChatMode &&
													!isSettingChatMode
												) {
													setIsSettingChatMode(true);
													window.electronApi.dynamicIsland
														.setChatMode(true)
														.then(() => {
															setIsSettingChatMode(false);
														})
														.catch(() => {
															setIsSettingChatMode(false);
														});
												}
											}}
											// Remove onClick handler to prevent duplicate focus events
											autoFocus={isChatMode}
											rows={1}
											style={{ resize: 'none' }}
										/>
										<div
											className={`chat-submit-button ${
												isSendingMessage ? 'sending' : ''
											}`}
											onClick={handleChatSubmit}
											title={isSendingMessage ? 'Sending...' : 'Send message'}
										>
											{isSendingMessage ? (
												<div className="sending-spinner"></div>
											) : (
												<ArrowIcon />
											)}
										</div>
									</div>
								</div>
							) : (
								/* Normal mode - chat and webcam sections */
								<>
									{/* Chat input section */}
									<div className="chat-section" onClick={handleChatClick}>
										<div className="chat-input">Ask about screen or audio</div>
										<div className="chat-arrow">
											<ArrowIcon />
										</div>
									</div>

									{/* Voice mode / Webcam section */}
									<div
										className={`webcam-section ${
											isCameraActive ? 'camera-active' : ''
										} ${
											cameraPermission === 'denied' ||
											cameraPermission === 'restricted'
												? 'camera-denied'
												: ''
										} ${!isRecording ? 'voice-mode' : ''}`}
										onClick={
											isRecording
												? cameraPermission === 'denied' ||
												  cameraPermission === 'restricted'
													? (e) => {
															e.stopPropagation();
															if (
																window.electronApi?.askAI?.camera
																	?.showPermissionHelp
															) {
																window.electronApi.askAI.camera.showPermissionHelp();
															}
													  }
													: handleWebcamClick
												: handleVoiceModeClick
										}
										onMouseEnter={handleWebcamMouseEnter}
										title={
											isRecording
												? isCameraActive
													? 'Click to stop camera'
													: cameraPermission === 'denied' ||
													  cameraPermission === 'restricted'
													? 'Click to open system permissions'
													: 'Click to start camera'
												: voiceConnectionStatus === 'connected'
												? 'Click to stop voice assistant'
												: voiceConnectionStatus === 'connecting'
												? 'Connecting to voice assistant...'
												: voiceConnectionStatus === 'error'
												? 'Voice assistant error - Click to retry'
												: 'Click to start voice assistant'
										}
									>
										{isRecording ? (
											/* Show camera when recording is active */
											<>
												{isCameraStarting ? (
													<div className="camera-loading">
														<div className="loading-spinner"></div>
														<div className="loading-text">
															Starting...
														</div>
													</div>
												) : isCameraActive && cameraStream ? (
													<>
														<video
															ref={videoRef}
															autoPlay
															playsInline
															muted
															className="webcam-video"
															style={{
																width: '100%',
																height: '100%',
																objectFit: 'cover',
																borderRadius: '100px',
																display: 'block',
																visibility: 'visible',
															}}
														/>
														{/* Debug info */}
														<div className="camera-live-indicator">
															Live
														</div>
														{/* Hover overlay to show "Click to stop" */}
														<div className="camera-hover-overlay">
															Click to stop
														</div>
													</>
												) : cameraPermission === 'denied' ||
												  cameraPermission === 'restricted' ? (
													<>
														<div className="webcam-label permission-required">
															Permission Required
														</div>
													</>
												) : (
													<>
														<WebcamIcon />
														<div className="webcam-label">Webcam</div>
														{/* Debug info */}
														<div className="camera-click-instruction">
															Click to start
														</div>
													</>
												)}

												{/* Camera error display */}
												{cameraError && (
													<div className="camera-error">
														{cameraError}
													</div>
												)}

												{/* Camera status for different states */}
												{cameraStatus === 'starting' && (
													<div className="camera-status starting">
														Starting...
													</div>
												)}

												{cameraStatus === 'error' && (
													<div className="camera-status error">
														⚠ Error
													</div>
												)}
											</>
										) : (
											/* Show voice mode when not recording */
											<>
												{voiceConnectionStatus === 'connecting' ? (
													<>
														<div className="voice-loading">
															<div className="loading-spinner"></div>
															<div className="loading-text">
																Connecting...
															</div>
														</div>
													</>
												) : voiceConnectionStatus === 'connected' ? (
													<>
														<VoiceModeIcon />
														<div className="webcam-label voice-connected">
															Voice Active
														</div>
														<div className="voice-status-indicator">
															<div className="voice-pulse"></div>
														</div>
														{/* Voice hover overlay - similar to camera */}
														<div className="voice-hover-overlay">
															Click to stop
														</div>
													</>
												) : voiceConnectionStatus === 'error' ? (
													<>
														<VoiceModeIcon />
														<div className="webcam-label voice-error">
															Voice Error
														</div>
														{voiceError && (
															<div className="voice-error-message">
																{voiceError}
															</div>
														)}
													</>
												) : (
													<>
														<VoiceModeIconWhite />
														{/* <div className="webcam-label">
															Voice Mode
														</div> */}
														{/* <div className="voice-click-instruction">
															Click to start
														</div> */}
													</>
												)}
											</>
										)}
									</div>
								</>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default DynamicIslandUI;
