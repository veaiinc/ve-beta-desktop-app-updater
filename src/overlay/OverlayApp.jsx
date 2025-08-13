import React, { useEffect, useRef, useState } from 'react';
import OverlayCommands from './OverlayCommands';
import ShortcutBar from './components/ShortcutBar';
import ScreenQueryBar from './components/ScreenQueryBar';
import './overlay.scss';

const OverlayApp = () => {
	const containerRef = useRef(null);
	const [showScreenQuery, setShowScreenQuery] = useState(false);

	const handleAskAIClick = () => {
		setShowScreenQuery(prev => !prev);
	};

	const handleCloseScreenQuery = () => {
		setShowScreenQuery(false);
	};

	useEffect(() => {
		// Update window dimensions when content changes
		const updateDimensions = () => {
			if (containerRef.current) {
				const height = containerRef.current.scrollHeight;
				const width = containerRef.current.scrollWidth;
				
				if (window.electronApi?.overlay?.updateDimensions) {
					window.electronApi.overlay.updateDimensions({ width, height });
				}
			}
		};

		// Initial dimension update
		updateDimensions();

		// Set up ResizeObserver to watch for content changes
		const resizeObserver = new ResizeObserver(updateDimensions);
		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		// Set up MutationObserver to watch for DOM changes
		const mutationObserver = new MutationObserver(updateDimensions);
		if (containerRef.current) {
			mutationObserver.observe(containerRef.current, {
				childList: true,
				subtree: true,
				attributes: true,
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
				<ShortcutBar onAskAIClick={handleAskAIClick} isQueryBarOpen={showScreenQuery} />
				
				{/* Commands section */}
				<OverlayCommands />
			</div>
			
			{/* Screen query bar - separate window below with gap */}
			{showScreenQuery && (
				<div className="screen-query-container">
					<ScreenQueryBar onClose={handleCloseScreenQuery} />
				</div>
			)}
		</div>
	);
};

export default OverlayApp;