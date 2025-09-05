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
} from './NotchDropIcons';
import './NotchDropUI.scss';

const NotchDropUI = () => {
	const notchDropRef = useRef(null);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	// Overlay state - synced from overlay window
	const [isRecording, setIsRecording] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [timer, setTimer] = useState(0);
	const [isLiveIntelligenceOpen, setIsLiveIntelligenceOpen] = useState(false);
	const [controlledByNotchDrop, setControlledByNotchDrop] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	// Chat mode state
	const [isChatMode, setIsChatMode] = useState(false);
	const [chatInput, setChatInput] = useState('');

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
		if (window.electronApi && window.electronApi.notchDrop) {
			setIsConnected(true);

			// Listen for notch drop state changes
			window.electronApi.notchDrop.onStateChange((data) => {
				setIsExpanded(data.expanded);
			});

			// Listen for overlay state changes to sync recording state
			window.electronApi.notchDrop.onOverlayStateChange((state) => {
				console.log('🏝️ NotchDrop received overlay state:', state);
				setIsRecording(state.isRecording);
				setIsPaused(state.isPaused);
				setTimer(state.timer);
				setIsLiveIntelligenceOpen(state.isLiveIntelligenceOpen);
				setControlledByNotchDrop(
					state.isNotchDropControlled || state.controlledByNotchDrop || false,
				);

				console.log('🎯 NotchDrop Control State:', {
					isNotchDropControlled: state.isNotchDropControlled,
					controlledByNotchDrop: state.controlledByNotchDrop,
					showShortcutBar: state.showShortcutBar,
					isRecording: state.isRecording,
				});
			});
		}

		return () => {
			// Clean up listeners
			window.removeEventListener('storage', handleStorageChange);
			if (window.electronApi?.notchDrop?.removeStateChangeListener) {
				window.electronApi.notchDrop.removeStateChangeListener();
			}
			if (window.electronApi?.notchDrop?.removeOverlayStateListener) {
				window.electronApi.notchDrop.removeOverlayStateListener();
			}
		};
	}, []);

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
			console.log('📏 Expanding NotchDrop to show rich UI');
			const result = await window.electronApi.notchDrop.expand();
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
			console.log('📏 Collapsing NotchDrop to pill');
			const result = await window.electronApi.notchDrop.collapse();
			if (result.success) {
				setIsExpanded(false);
			}
		} catch (error) {
			console.error('❌ Collapse IPC error:', error);
		}
	};

	// Click handlers for interactive elements
	const handleHomeClick = () => {
		console.log('🏠 Home icon clicked');
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
			if (!window.electronApi?.overlay?.toggleLiveIntelligence) {
				console.error('Overlay API not available in NotchDrop');
				return;
			}

			// Trigger overlay to start recording and show Live Intelligence panel
			try {
				console.log('Calling overlay.toggleLiveIntelligence()...');
				const result = await window.electronApi.overlay.toggleLiveIntelligence();
				console.log('Overlay toggle result:', result);
			} catch (error) {
				console.error('Error triggering overlay from NotchDrop:', error);
			}
		}
	};

	const handleWebcamClick = () => {
		console.log('📹 Webcam section clicked');
		// Exit chat mode when webcam is clicked
		if (isChatMode) {
			setIsChatMode(false);
			setChatInput('');
		}
	};

	const handleChatClick = () => {
		console.log('💬 Chat section clicked');
		if (!isChatMode) {
			setIsChatMode(true);
			// Ensure NotchDrop is expanded for chat mode
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
			console.error('Error starting recording from NotchDrop:', error);
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
			console.error('Error stopping recording from NotchDrop:', error);
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
			console.error('Error toggling pause/resume from NotchDrop:', error);
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
		if (notchDropRef.current) {
			console.log('✅ DOM loaded, NotchDrop UI ready');
			console.log(
				'NotchDrop dimensions:',
				notchDropRef.current.offsetWidth,
				'x',
				notchDropRef.current.offsetHeight,
			);
		}
	}, []);

	return (
		<div
			ref={notchDropRef}
			id="notchDrop"
			className={`notch-drop ${isExpanded ? 'expanded' : 'collapsed'} ${
				isRecording ? 'recording' : ''
			} ${controlledByNotchDrop ? 'controlled-by-notch-drop' : ''} ${
				isChatMode ? 'chat-mode' : ''
			}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* Simple content when collapsed */}
			<div className="island-content">
				{controlledByNotchDrop
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
											{controlledByNotchDrop
												? 'NotchDrop Control'
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

									{/* Webcam section */}
									<div className="webcam-section" onClick={handleWebcamClick}>
										<WebcamIcon />
										<div className="webcam-label">Webcam</div>
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

export default NotchDropUI;
