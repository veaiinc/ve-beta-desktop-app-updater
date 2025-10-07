import React, { createContext, useContext, useEffect, useState } from 'react';
import { syncGlassModeWithElectron } from '../helpers/glassModeSync';

/**
 * Glass Mode Context - Simplified Approach
 *
 * Provides global state management for glass mode with localStorage persistence.
 * Uses CSS custom properties and classes for simple, performant glass effects.
 */
const GlassModeContext = createContext();

export const useGlassMode = () => {
	const context = useContext(GlassModeContext);
	if (!context) {
		throw new Error('useGlassMode must be used within a GlassModeProvider');
	}
	return context;
};

export const GlassModeProvider = ({ children }) => {
	const [isGlassModeEnabled, setIsGlassModeEnabled] = useState(() => {
		// Initialize from localStorage
		try {
			const saved = localStorage.getItem('glassModeEnabled');
			return saved ? JSON.parse(saved) : false;
		} catch (error) {
			console.warn('Failed to load glass mode state from localStorage:', error);
			return false;
		}
	});

	// Persist to localStorage whenever state changes
	useEffect(() => {
		try {
			localStorage.setItem('glassModeEnabled', JSON.stringify(isGlassModeEnabled));
		} catch (error) {
			console.warn('Failed to save glass mode state to localStorage:', error);
		}
	}, [isGlassModeEnabled]);

	// Apply glass mode effects using CSS classes
	useEffect(() => {
		// Simply toggle the glass-mode-enabled class on document root and body
		document.documentElement.classList.toggle('glass-mode-enabled', isGlassModeEnabled);
		document.body.classList.toggle('glass-mode-enabled', isGlassModeEnabled);

		// Cleanup function
		return () => {
			document.documentElement.classList.remove('glass-mode-enabled');
			document.body.classList.remove('glass-mode-enabled');
		};
	}, [isGlassModeEnabled]);

	// Listen for Command+G from Electron
	useEffect(() => {
		const handleTranslucencyChanged = (data) => {
			if (data && typeof data.enabled === 'boolean') {
				setIsGlassModeEnabled(data.enabled);

				// Show visual feedback for glass mode toggle
				if (data.source === 'keyboard-shortcut') {
					showGlassModeFeedback(data.enabled);
				}
			}
		};

		// Listen for IPC events from Electron
		if (window.electronApi && window.electronApi.onTranslucencyChanged) {
			window.electronApi.onTranslucencyChanged(handleTranslucencyChanged);
		}

		return () => {
			if (window.electronApi && window.electronApi.removeTranslucencyChangedListener) {
				window.electronApi.removeTranslucencyChangedListener();
			}
		};
	}, []);

	// Visual feedback for glass mode toggle
	const showGlassModeFeedback = (enabled) => {
		// Create a temporary visual indicator
		const feedback = document.createElement('div');
		feedback.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			background: ${enabled ? 'rgba(0, 255, 0, 0.9)' : 'rgba(255, 0, 0, 0.9)'};
			color: white;
			padding: 12px 20px;
			border-radius: 8px;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			font-size: 14px;
			font-weight: 600;
			z-index: 10000;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
			transition: all 0.3s ease;
			transform: translateX(100%);
		`;

		feedback.textContent = enabled ? '🎨 Glass Mode ON' : '🎨 Glass Mode OFF';

		document.body.appendChild(feedback);

		// Animate in
		requestAnimationFrame(() => {
			feedback.style.transform = 'translateX(0)';
		});

		// Remove after 2 seconds
		setTimeout(() => {
			feedback.style.transform = 'translateX(100%)';
			setTimeout(() => {
				if (feedback.parentNode) {
					feedback.parentNode.removeChild(feedback);
				}
			}, 300);
		}, 2000);
	};

	// Sync state changes with Electron
	useEffect(() => {
		syncGlassModeWithElectron(isGlassModeEnabled);
	}, [isGlassModeEnabled]);

	const toggleGlassMode = () => {
		setIsGlassModeEnabled((prev) => !prev);
	};

	const value = {
		isGlassModeEnabled,
		toggleGlassMode,
		setIsGlassModeEnabled,
	};

	return <GlassModeContext.Provider value={value}>{children}</GlassModeContext.Provider>;
};

export default GlassModeContext;
