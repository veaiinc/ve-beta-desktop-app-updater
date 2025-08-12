import React, { useEffect, useRef, useState } from 'react';
import OverlayCommands from './OverlayCommands';
import './overlay.scss';

const OverlayApp = () => {
	const containerRef = useRef(null);
	const [screenshots, setScreenshots] = useState([]);

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

	useEffect(() => {
		// Listen for screenshot requests from global shortcut
		if (window.electronApi?.overlay?.onTakeScreenshotRequested) {
			const cleanup = window.electronApi.overlay.onTakeScreenshotRequested(() => {
				handleTakeScreenshot();
			});
			
			return cleanup;
		}
	}, []);

	const handleTakeScreenshot = async () => {
		try {
			if (window.electronApi?.overlay?.takeScreenshot) {
				const result = await window.electronApi.overlay.takeScreenshot();
				
				if (result.success) {
					// Add screenshot to the list
					setScreenshots(prev => [result.screenshot, ...prev.slice(0, 4)]); // Keep only 5 screenshots
					
					// Show success notification
					console.log('Screenshot taken successfully:', result.screenshot.filename);
				} else {
					console.error('Failed to take screenshot:', result.error);
				}
			}
		} catch (error) {
			console.error('Error taking screenshot:', error);
		}
	};

	const handleDeleteScreenshot = (index) => {
		setScreenshots(prev => prev.filter((_, i) => i !== index));
	};

	return (
		<div ref={containerRef} className="overlay-app">
			<div className="overlay-container">
				{/* Screenshots display */}
				{screenshots.length > 0 && (
					<div className="overlay-screenshots">
						{screenshots.slice(0, 3).map((screenshot, index) => (
							<div key={screenshot.timestamp} className="screenshot-item">
								<img 
									src={`data:image/png;base64,${screenshot.data}`} 
									alt={screenshot.filename}
									className="screenshot-thumbnail"
								/>
								<button 
									className="screenshot-delete"
									onClick={() => handleDeleteScreenshot(index)}
									title="Delete screenshot"
								>
									×
								</button>
							</div>
						))}
					</div>
				)}

				{/* Commands section */}
				<OverlayCommands 
					screenshots={screenshots}
					onTakeScreenshot={handleTakeScreenshot}
				/>
			</div>
		</div>
	);
};

export default OverlayApp;