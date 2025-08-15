import React, { useEffect, useRef, useState } from 'react';
import OverlayCommands from './OverlayCommands';
import ShortcutBar from './components/ShortcutBar';
import ScreenQueryBar from './components/ScreenQueryBar';
import LiveIntelligencePanel from './components/LiveIntelligencePanel';
import TranscriptPanel from './components/TranscriptPanel';
import './overlay.scss';

const OverlayApp = () => {
	const containerRef = useRef(null);
	const [showScreenQuery, setShowScreenQuery] = useState(false);
	// Single state to control which panel is shown: 'live-intelligence' or 'transcript'
	const [activePanel, setActivePanel] = useState('live-intelligence');
	
	// Debug: Log state changes and update dimensions when panel changes
	useEffect(() => {
		console.log('activePanel state changed to:', activePanel);
		
		// Update dimensions when panel changes
		setTimeout(() => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				const height = Math.max(containerRef.current.scrollHeight, rect.height);
				const width = Math.max(containerRef.current.scrollWidth, rect.width);

				if (window.electronApi?.overlay?.updateDimensions) {
					window.electronApi.overlay.updateDimensions({ width, height });
				}
			}
		}, 100); // Slightly longer delay for panel transitions
	}, [activePanel]);

	// Update dimensions when screen query state changes
	useEffect(() => {
		setTimeout(() => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				const height = Math.max(containerRef.current.scrollHeight, rect.height);
				const width = Math.max(containerRef.current.scrollWidth, rect.width);

				if (window.electronApi?.overlay?.updateDimensions) {
					window.electronApi.overlay.updateDimensions({ width, height });
				}
			}
		}, 100);
	}, [showScreenQuery]);

	// Debug: Global click handler
	useEffect(() => {
		const handleGlobalClick = (event) => {
			console.log('Global click detected on:', event.target);
		};
		
		document.addEventListener('click', handleGlobalClick);
		return () => document.removeEventListener('click', handleGlobalClick);
	}, []);

	const handleAskAIClick = () => {
		setShowScreenQuery((prev) => !prev);
	};

	const handleCloseScreenQuery = () => {
		setShowScreenQuery(false);
	};

	const handleListenClick = () => {
		// Toggle LiveIntelligencePanel when listen button is clicked
		setActivePanel(prev => prev === 'live-intelligence' ? null : 'live-intelligence');
	};

	const handleCloseLiveIntelligence = () => {
		// Close both panels by setting to null or hide completely
		setActivePanel(null);
	};

	const handleShowTranscript = () => {
		console.log('handleShowTranscript called - switching to transcript panel');
		setActivePanel('transcript');
	};

	const handleShowLiveIntelligence = () => {
		setActivePanel('live-intelligence');
	};

	const handleCloseTranscript = () => {
		setActivePanel('live-intelligence');
	};

	useEffect(() => {
		// Update window dimensions when content changes
		const updateDimensions = () => {
			if (containerRef.current) {
				// Use a small delay to allow CSS transitions to complete
				setTimeout(() => {
					const rect = containerRef.current.getBoundingClientRect();
					const height = Math.max(containerRef.current.scrollHeight, rect.height);
					const width = Math.max(containerRef.current.scrollWidth, rect.width);

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
				characterDataOldValue: true
			});
		}

		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, []);

	// Handle click outside to close screen query
	useEffect(() => {
		if (!showScreenQuery) return;

		const handleClickOutside = (event) => {
			if (containerRef.current && !containerRef.current.contains(event.target)) {
				console.log('Click outside detected, closing screen query');
				setShowScreenQuery(false);
			}
		};

		const handleEscapeKey = (event) => {
			if (event.key === 'Escape') {
				setShowScreenQuery(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleEscapeKey);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleEscapeKey);
		};
	}, [showScreenQuery]);

	return (
		<div ref={containerRef} className="overlay-app">
			<div className="overlay-container overlay-content" data-overlay-content="true">
				{/* Shortcut bar */}
				<ShortcutBar
					onAskAIClick={handleAskAIClick}
					isQueryBarOpen={showScreenQuery}
					onListenClick={handleListenClick}
					isLiveIntelligenceOpen={activePanel === 'live-intelligence'}
				/>

				{/* Commands section */}
				<OverlayCommands />
			</div>

			{/* Screen query bar - separate window below with gap */}
			{showScreenQuery && (
				<div className="screen-query-container">
					<ScreenQueryBar onClose={handleCloseScreenQuery} />
				</div>
			)}

			{/* Live Intelligence panel - separate window below with gap */}
			{activePanel === 'live-intelligence' && (
				<div className="live-intelligence-container">
					<LiveIntelligencePanel
						onClose={handleCloseLiveIntelligence}
						onShowTranscript={handleShowTranscript}
					/>
				</div>
			)}

			{/* Transcript panel - separate window below with gap */}
			{activePanel === 'transcript' && (
				<div className="transcript-container">
					<TranscriptPanel
						onClose={handleCloseTranscript}
						onShowLiveIntelligence={handleShowLiveIntelligence}
					/>
				</div>
			)}
			
			{/* Debug: Show current activePanel state */}
			{process.env.NODE_ENV === 'development' && (
				<div style={{
					position: 'fixed',
					top: '10px',
					right: '10px',
					background: 'red',
					color: 'white',
					padding: '5px',
					fontSize: '12px',
					zIndex: 99999
				}}>
					activePanel: {activePanel || 'null'}
				</div>
			)}
		</div>
	);
};

export default OverlayApp;
