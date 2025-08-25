import React, { useEffect, useRef, useState } from 'react';
import { HomeIcon, LockIcon, WebcamIcon, ArrowIcon, ClockIcon } from './DynamicIslandIcons';
import './DynamicIslandUI.scss';

const DynamicIslandUI = () => {
	const dynamicIslandRef = useRef(null);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isConnected, setIsConnected] = useState(false);

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

	const handleAudioClick = () => {
		console.log('🎵 Audio section clicked');
	};

	const handleWebcamClick = () => {
		console.log('📹 Webcam section clicked');
	};

	const handleChatClick = () => {
		console.log('💬 Chat section clicked');
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
			className={`dynamic-island ${isExpanded ? 'expanded' : 'collapsed'}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* Simple content when collapsed */}
			<div className="island-content">Ve.Ai Live Intelligence</div>

			{/* Rich UI when expanded */}
			<div className="ui-container">
				{/* Top row with notification and icons */}
				<div className="top-row">
					{/* Notification badge */}
					<div className="notification-badge" onClick={handleAudioClick}>
						<div className="badge-content">
							<div className="audio-visualizer">
								<div className="audio-bar"></div>
								<div className="audio-bar"></div>
								<div className="audio-bar"></div>
								<div className="audio-bar"></div>
								<div className="audio-bar"></div>
							</div>
						</div>
						<span className="badge-number">
							start
						</span>
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
