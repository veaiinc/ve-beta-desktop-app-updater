import React, { useEffect, useRef, useState } from 'react';
import { HomeIcon, LockIcon, WebcamIcon, ArrowIcon, ClockIcon, PlayIcon, PauseIcon, StopIcon, PlusIcon } from './DynamicIslandIcons';
import './DynamicIslandUI.scss';

const DynamicIslandUI = () => {
	const dynamicIslandRef = useRef(null);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [timer, setTimer] = useState(0);
	const [transcriptions, setTranscriptions] = useState([
		{
			id: 1,
			speaker: 'You',
			text: 'Thanks for joining today! To kick things off, can you tell me how you typically use our product in your day-to-day work?',
			time: '0:05'
		},
		{
			id: 2,
			speaker: 'Other',
			text: 'Sure. I mostly use it to manage client proposals and share timelines internally. I really like the auto-fill templates, but sometimes I wish there was a faster way to switch between different document types.',
			time: '0:08'
		}
	]);

	useEffect(() => {
		// Check if we're in Electron environment
		if (window.electronAPI && window.electronAPI.dynamicIsland) {
			setIsConnected(true);

			// Listen for dynamic island state changes
			window.electronAPI.dynamicIsland.onStateChange((data) => {
				setIsExpanded(data.expanded);
			});
		}
	}, []);

	// Timer effect for recording
	useEffect(() => {
		let interval;
		if (isRecording && !isPaused) {
			interval = setInterval(() => {
				setTimer(prev => prev + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isRecording, isPaused]);

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
			const result = await window.electronAPI.dynamicIsland.expand();
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
			const result = await window.electronAPI.dynamicIsland.collapse();
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

	const handleAudioClick = () => {
		console.log('🎵 Start recording clicked');
		if (!isRecording) {
			setIsRecording(true);
			setIsPaused(false);
			setTimer(0);
		}
	};

	const handleWebcamClick = () => {
		console.log('📹 Webcam section clicked');
	};

	const handleChatClick = () => {
		console.log('💬 Chat section clicked');
	};

	// Recording control handlers
	const handleStartRecording = () => {
		console.log('🎤 Start recording clicked');
		setIsRecording(true);
		setIsPaused(false);
		setTimer(0);
	};

	const handleStopRecording = () => {
		console.log('⏹️ Stop recording clicked');
		setIsRecording(false);
		setIsPaused(false);
		setTimer(0);
	};

	const handlePauseResume = () => {
		console.log('⏸️/▶️ Pause/Resume clicked');
		setIsPaused(!isPaused);
	};

	// Format time for display
	const formatTime = (seconds) => {
		const m = Math.floor(seconds / 60).toString().padStart(1, '0');
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

	return (
		<div
			ref={dynamicIslandRef}
			id="dynamicIsland"
			className={`dynamic-island ${isExpanded ? 'expanded' : 'collapsed'} ${isRecording ? 'recording' : ''}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* Simple content when collapsed */}
			<div className="island-content">Ve.Ai Live Intelligence</div>

			{/* Rich UI when expanded */}
			<div className="ui-container">
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
								<div className="control-button pause-resume-button" onClick={handlePauseResume}>
									<div className="control-icon">
										{isPaused ? <PlayIcon /> : <PauseIcon />}
									</div>
								</div>
								<div className="control-button stop-button" onClick={handleStopRecording}>
									<div className="control-icon">
										<StopIcon />
									</div>
								</div>
								
								{/* Meeting mode label */}
								<div className="meeting-mode-label">
									Meeting mode
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
						<div className="icon-button" title="Home" onClick={handleHomeClick}>
							<HomeIcon />
						</div>
						<div className="icon-button" title="Security" onClick={handleSecurityClick}>
							<LockIcon />
						</div>
					</div>
				</div>

				{/* Main content area */}
				<div className="main-content">
					{/* Live transcription section */}
					{isRecording && transcriptions.length > 0 ? (
						<div className="transcription-section">
							{transcriptions.slice(-3).map((transcription, index) => (
								<div key={transcription.id || index} className="transcription-bubble">
									<div className="bubble-header">
										<span className="speaker-name">{transcription.speaker}</span>
										<div className="speaker-avatar"></div>
										<div className="time-info">
											<ClockIcon />
											<span className="time-text">{transcription.time}</span>
										</div>
									</div>
									<div className="bubble-text">
										{transcription.text}
									</div>
								</div>
							))}
						</div>
					) : (
						<>
							{/* Product Interview section */}
							<div className="product-interview-section">
								<div className="interview-header">
									<span className="interview-title">Product Interview</span>
								</div>
								<div className="interview-timer">
									<ClockIcon />
									<span className="timer-text">In 5 min</span>
								</div>
							</div>
						</>
					)}

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
				</div>
			</div>
		</div>
	);
};

export default DynamicIslandUI;
