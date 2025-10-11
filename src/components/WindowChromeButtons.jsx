import React, { useEffect, useState } from 'react';
import s from './windowChromeButtons.module.scss';
import { Minus, Minimize2, Maximize2 } from 'lucide-react';

const WindowChromeButtons = () => {
	const [isFullscreen, setIsFullscreen] = useState(false);

	// Check initial fullscreen state
	useEffect(() => {
		const checkFullscreenState = async () => {
			try {
				const result = await window.electronApi.getFullscreenState();
				if (result.success) {
					setIsFullscreen(result.isFullscreen);
				}
			} catch (error) {
				console.error('Error checking fullscreen state:', error);
			}
		};

		checkFullscreenState();
	}, []);

	const handleToggleFullscreen = async () => {
		try {
			const result = await window.electronApi.toggleFullscreen();
			if (result.success) {
				setIsFullscreen(result.isFullscreen);
			}
		} catch (error) {
			console.error('Error toggling fullscreen:', error);
		}
	};

	const handleCloseWindow = async () => {
		try {
			await window.electronApi.closeWindow();
		} catch (error) {
			console.error('Error closing window:', error);
		}
	};

	return (
		<div className={s.windowChromeButtons}>
			<button
				className={s.windowChromeButton}
				onClick={handleCloseWindow}
				title="Minimize window"
			>
				<Minus size={11} strokeWidth={4} />
			</button>
			<button
				className={s.windowChromeButton + ' ' + s.windowChromeButtonClose}
				onClick={handleToggleFullscreen}
				title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
			>
				{isFullscreen ? (
					<Minimize2 size={8} strokeWidth={4} />
				) : (
					<Maximize2 size={8} strokeWidth={4} />
				)}
			</button>
		</div>
	);
};

export default WindowChromeButtons;
