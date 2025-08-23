import React, { useEffect, useRef, useState } from 'react';
import { HomeIcon, LockIcon, WebcamIcon, ArrowIcon } from './DynamicIslandIcons';
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
		// Enable mouse events when hovering over the dynamic island
		if (isConnected) {
			window.electronAPI.dynamicIsland.setIgnoreMouseEvents(false);
		}
		if (!isExpanded && isConnected) {
			expand();
		}
	};

	const handleMouseLeave = () => {
		console.log('🚪 MOUSE LEAVE - Collapsing to pill!');
		if (isExpanded && isConnected) {
			collapse();
		}
		// Re-enable click-through after a short delay
		setTimeout(() => {
			if (isConnected) {
				window.electronAPI.dynamicIsland.setIgnoreMouseEvents(true);
			}
		}, 100);
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
				{/* Top row with icons */}
				<div className="top-row">
					<div className="icon-button" title="Home" onClick={handleHomeClick}>
						<HomeIcon />
					</div>

					<div className="icon-button" title="Security" onClick={handleSecurityClick}>
						<LockIcon />
					</div>
				</div>

				{/* Main content area */}
				<div className="main-content">
					{/* Audio visualizer section */}
					<div className="audio-section" onClick={handleAudioClick}>
						<div className="glow-effect glow-1"></div>
						<div className="glow-effect glow-2"></div>
						<div className="glow-effect glow-3"></div>
						<div className="glow-effect glow-4"></div>
						<div className="glow-effect glow-5"></div>
						<div className="glow-effect glow-6"></div>
						<div className="glow-effect glow-7"></div>
						<div className="glow-effect glow-8"></div>

						<div className="audio-bars">
							<div className="audio-bar"></div>
							<div className="audio-bar"></div>
							<div className="audio-bar"></div>
							<div className="audio-bar"></div>
							<div className="audio-bar"></div>
						</div>

						<div className="audio-label">Start</div>
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
