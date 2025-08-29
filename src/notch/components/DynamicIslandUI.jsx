import React, { useEffect, useRef, useState } from 'react';
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
} from './DynamicIslandIcons';
import './DynamicIslandUI.scss';

// Camera permission utilities - simplified for Electron
const stopCamera = (stream) => {
	if (stream) {
		stream.getTracks().forEach((track) => track.stop());
	}
};

const DynamicIslandUI = () => {
	const dynamicIslandRef = useRef(null);
	const videoRef = useRef(null);
	const [isExpanded, setIsExpanded] = useState(false);
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
	// Camera state
	const [isCameraActive, setIsCameraActive] = useState(false);
	const [cameraStream, setCameraStream] = useState(null);
	const [cameraPermission, setCameraPermission] = useState('not-determined');
	const [cameraError, setCameraError] = useState(null);
	const [isCameraStarting, setIsCameraStarting] = useState(false);
	const [cameraStatus, setCameraStatus] = useState('idle'); // 'idle', 'starting', 'active', 'error'
	
	// Device detection state
	const [hasCamera, setHasCamera] = useState(true); // Default to true, will be updated
	const [isCheckingDevices, setIsCheckingDevices] = useState(true);

	useEffect(() => {
		// Check authentication status
		const checkAuthStatus = () => {
			const usertoken = localStorage.getItem('usertoken');
			setIsAuthenticated(!!usertoken);
		};

		// Initial check
		checkAuthStatus();
		checkDeviceAvailability();

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
				setIsExpanded(data.expanded);
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
		};
	}, []);

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
			console.log('📹 Camera device changed, rechecking availability...');
			checkDeviceAvailability();
		};

		if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
			navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
		}

		return () => {
			if (navigator.mediaDevices && navigator.mediaDevices.removeEventListener) {
				navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
			}
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
			}
		} catch (error) {
			console.error('❌ Collapse IPC error:', error);
		}
	};

	// Click handlers for interactive elements
	const handleHomeClick = async () => {
		console.log('🏠 Home icon clicked - opening main app window');
		
		try {
			// Check if main window API is available
			if (!window.electronApi?.mainWindow?.showAndFocus) {
				console.error('Main window API not available in Dynamic Island');
				return;
			}

			// Show, restore (if minimized), and focus the main window
			const result = await window.electronApi.mainWindow.showAndFocus();
			
			if (result.success) {
				console.log('✅ Main window opened and focused successfully');
				
				// Optionally collapse the dynamic island after opening main window
				if (isExpanded && isConnected) {
					setTimeout(() => {
						collapse();
					}, 500); // Small delay to show the action was successful
				}
			} else {
				console.error('❌ Failed to open main window:', result.error);
			}
		} catch (error) {
			console.error('❌ Error opening main window:', error);
		}
	};

	const handleSecurityClick = () => {
		console.log('🔒 Security icon clicked');
	};

	const handleSettingsClick = () => {
		console.log('⚙️ Settings icon clicked');
	};

	const handleAudioClick = async () => {
		console.log('🎵 Start recording clicked - triggering overlay');
		// Exit chat mode when starting recording
		if (isChatMode) {
			setIsChatMode(false);
			setChatInput('');
		}

		if (!isRecording) {
			// Check if overlay API is available
			if (!window.electronApi?.overlay?.startRecording) {
				console.error('Overlay startRecording API not available in Dynamic Island');
				return;
			}

			// Trigger overlay to start recording and show Live Intelligence panel
			try {
				console.log('Calling overlay.startRecording()...');
				const result = await window.electronApi.overlay.startRecording();
				console.log('Overlay start recording result:', result);
			} catch (error) {
				console.error('Error triggering overlay from Dynamic Island:', error);
			}
		}
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
		if (!isChatMode) {
			setIsChatMode(true);
			// Ensure Dynamic Island is expanded for chat mode
			if (!isExpanded && isConnected) {
				expand();
			}
		}
	};

	const handleChatSubmit = () => {
		if (chatInput.trim()) {
			console.log('💬 Chat submitted:', chatInput);
			// Here you can add logic to send the chat message
			// For now, just clear the input
			setChatInput('');
		}
	};

	const handleChatInputChange = (e) => {
		setChatInput(e.target.value);
	};

	const handleChatInputKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleChatSubmit();
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
	}, []);

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

			// Check device availability
		const checkDeviceAvailability = async () => {
			try {
				setIsCheckingDevices(true);
				const devices = await checkDevices();
				if (devices) {
					setHasCamera(devices.hasCamera);
					console.log('📹 Camera available:', devices.hasCamera);
				}
			} catch (error) {
				console.error('Error checking device availability:', error);
				setHasCamera(false); // Assume no camera on error
			} finally {
				setIsCheckingDevices(false);
			}
		};

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
				{controlledByDynamicIsland
					? isRecording
						? `● Recording ${formatTime(timer)}`
						: 'Living Intelligence'
					: isChatMode
					? 'Chat Mode'
					: 'Living Intelligence'}
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
								{!isRecording ? (
									<div className="start-button" onClick={handleAudioClick}>
										<div className="start-icon">
											<PlayIcon />
										</div>
										<span className="start-text">start</span>
									</div>
								) : (
									<div className="recording-controls">
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

										{/* Control mode label */}
										<div className="meeting-mode-label">
											{controlledByDynamicIsland
												? 'Dynamic Island Control'
												: 'Meeting mode'}
										</div>
									</div>
								)}

								{/* Audio visualizer */}
								<div className="audio-visualizer">
									<div className="audio-bar"></div>
									<div className="audio-bar"></div>
									<div className="audio-bar"></div>
									<div className="audio-bar"></div>
									<div className="audio-bar"></div>
								</div>
							</div>

							{/* Right side icons */}
							<div className="right-icons">
								{isChatMode && (
									<div
										className="back-button"
										title="Back to main view"
										onClick={() => {
											setIsChatMode(false);
											setChatInput('');
										}}
									>
										<BackIcon />
										<span className="back-text">Back</span>
									</div>
								)}
								<div className="icon-button" title="Home" onClick={handleHomeClick}>
									<HomeIcon />
								</div>
								<div
									className="icon-button"
									title="Security"
									onClick={handleSecurityClick}
								>
									<LockIcon />
								</div>
							</div>
						</div>

						{/* Main content area */}
						<div className="main-content">
							{isChatMode ? (
								/* Chat mode - expanded chat interface */
								<div className="chat-expanded">
									<div className="chat-input-container">
										<input
											type="text"
											className="chat-input-field"
											placeholder="Ask me anything..."
											value={chatInput}
											onChange={handleChatInputChange}
											onKeyPress={handleChatInputKeyPress}
										/>
										<div
											className="chat-submit-button"
											onClick={handleChatSubmit}
										>
											<ArrowIcon />
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

									{/* Webcam section - always show, with different states */}
									{isCheckingDevices ? (
										<div className="webcam-section device-checking">
											<div className="loading-spinner"></div>
											<div className="webcam-label">Checking devices...</div>
										</div>
									) : hasCamera ? (
										<div
											className={`webcam-section ${
												isCameraActive ? 'camera-active' : ''
											} ${
												cameraPermission === 'denied' ||
												cameraPermission === 'restricted'
													? 'camera-denied'
													: ''
											}`}
											onClick={
												cameraPermission === 'denied' ||
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
											}
											onMouseEnter={handleWebcamMouseEnter}
											title={
												isCameraActive
													? 'Click to stop camera'
													: cameraPermission === 'denied' ||
													  cameraPermission === 'restricted'
													? 'Click to open system permissions'
													: 'Click to start camera'
											}
										>
										{isCameraStarting ? (
											<div className="camera-loading">
												<div className="loading-spinner"></div>
												<div className="loading-text">Starting...</div>
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
												<div className="camera-live-indicator">Live</div>
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
											<div className="camera-error">{cameraError}</div>
										)}

										{/* Camera status for different states */}
										{cameraStatus === 'starting' && (
											<div className="camera-status starting">
												Starting...
											</div>
										)}

										{cameraStatus === 'error' && (
											<div className="camera-status error">⚠ Error</div>
										)}
									</div>
									) : (
										<div 
											className="webcam-section no-camera"
											title="No camera found"
										>
											<WebcamIcon />
											<div className="webcam-label">No camera found</div>
										</div>
									)}
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
