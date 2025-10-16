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
			return saved ? JSON.parse(saved) : true;
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
