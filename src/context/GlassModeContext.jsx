import React, { createContext, useContext, useEffect, useState } from 'react';
import { syncGlassModeWithElectron } from '../helpers/glassModeSync';
import { setupUniversalBlurWithGlassMode } from '../helpers/translucencyUtils';
import { setupAntdTranslucencyObserver } from '../helpers/antdTranslucencyUtils';

/**
 * Glass Mode Context
 *
 * Provides global state management for glass mode with localStorage persistence.
 * Handles the toggle state and applies transparency effects to all DOM elements.
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

	// Universal blur system for all divs
	useEffect(() => {
		let universalBlurCleanup = null;
		let antdObserver = null;

		// Setup universal blur system
		const universalBlurSystem = setupUniversalBlurWithGlassMode(() => isGlassModeEnabled, {
			blurIntensity: '20px',
			performanceOptimized: true,
			checkInterval: 500, // Check every 500ms for responsiveness
		});

		// Setup Ant Design translucency observer
		antdObserver = setupAntdTranslucencyObserver({
			level: 'medium',
			autoApply: isGlassModeEnabled,
		});

		// Start universal blur monitoring
		universalBlurCleanup = universalBlurSystem.start();

		// Cleanup on unmount or glass mode change
		return () => {
			if (universalBlurCleanup) {
				universalBlurCleanup();
			}
			if (antdObserver) {
				antdObserver.disconnect();
			}
		};
	}, [isGlassModeEnabled]);

	// Apply glass mode effects to DOM
	useEffect(() => {
		const applyGlassModeEffects = () => {
			// Add/remove glass mode class to document root and body
			document.documentElement.classList.toggle('glass-mode-enabled', isGlassModeEnabled);
			document.body.classList.toggle('glass-mode-enabled', isGlassModeEnabled);

			// Apply transparency to main containers
			const mainContainers = [
				document.documentElement,
				document.body,
				document.getElementById('root'),
			].filter(Boolean);

			mainContainers.forEach((element) => {
				if (isGlassModeEnabled) {
					// Make backgrounds transparent
					element.style.background = 'transparent';
					// element.style.backdropFilter = 'none';
					// element.style.webkitBackdropFilter = 'none';
				} else {
					// Restore original backgrounds
					element.style.background = '';
					// element.style.backdropFilter = '';
					// element.style.webkitBackdropFilter = '';
				}
			});

			// Override CSS custom properties for glass mode
			if (isGlassModeEnabled) {
				// Check if light theme is active
				const isLightTheme = document.documentElement.getAttribute('theme') === 'light';

				if (isLightTheme) {
					// Light theme glass mode values
					document.documentElement.style.setProperty(
						'--background-color',
						'transparent',
						'important',
					);
					document.documentElement.style.setProperty(
						'--chat-background-color',
						'rgba(255, 255, 255, 0.1)',
						'important',
					);
					document.documentElement.style.setProperty(
						'--card',
						'rgba(255, 255, 255, 0.12)',
						'important',
					);
					document.documentElement.style.setProperty(
						'--new-card',
						'rgba(255, 255, 255, 0.12)',
						'important',
					);
					document.documentElement.style.setProperty(
						'--card-hover',
						'rgba(255, 255, 255, 0.18)',
						'important',
					);
					document.documentElement.style.setProperty(
						'--card-over-card',
						'rgba(255, 255, 255, 0.12)',
						'important',
					);
					document.documentElement.style.setProperty(
						'--card-over-card-hover',
						'rgba(255, 255, 255, 0.18)',
						'important',
					);
					document.documentElement.style.setProperty(
						'--popup',
						'rgba(255, 255, 255, 0.15)',
						'important',
					);
					document.documentElement.style.setProperty(
						'--navbar',
						'rgba(255, 255, 255, 0.05)',
						'important',
					);
					document.documentElement.style.setProperty(
						'--right-bar',
						'rgba(255, 255, 255, 0.12)',
						'important',
					);
				} else {
					// Dark theme glass mode values

					document.documentElement.style.setProperty(
						'backdrop-filter',
						'blur(15px)',
						'important',
					);

					document.documentElement.style.setProperty(
						'--background-color',
						'transparent',
						'important',
					);
					document.documentElement.style.setProperty(
						'--chat-background-color',
						'rgba(255, 255, 255, 0.1)',
						'important',
					);
					document.documentElement.style.setProperty(
						'--card',
						'rgba(255, 255, 255, 0.1)',
						'important',
					);
					document.documentElement.style.setProperty(
						'--new-card',
						'rgba(255, 255, 255, 0.1)',
						'important',
					);
					document.documentElement.style.setProperty(
						'--card-hover',
						'rgba(255, 255, 255, 0.1)',
						'important',
					);
					document.documentElement.style.setProperty(
						'--card-over-card',
						'rgba(255, 255, 255, 0.1)',
						'important',
					);
					document.documentElement.style.setProperty(
						'--card-over-card-hover',
						'rgba(255, 255, 255, 0.1)',
						'important',
					);
					document.documentElement.style.setProperty(
						'--popup',
						'rgba(255, 255, 255, 0.1)',
						'important',
					);
					document.documentElement.style.setProperty(
						'--navbar',
						'rgba(255, 255, 255, 0.1)',
						'important',
					);
					document.documentElement.style.setProperty(
						'--right-bar',
						'rgba(255, 255, 255, 0.1)',
						'important',
					);
				}
			} else {
				// Remove the overrides to restore original values
				document.documentElement.style.removeProperty('--background-color');
				document.documentElement.style.removeProperty('--chat-background-color');
				document.documentElement.style.removeProperty('--card');
				document.documentElement.style.removeProperty('--new-card');
				document.documentElement.style.removeProperty('--card-hover');
				document.documentElement.style.removeProperty('--card-over-card');
				document.documentElement.style.removeProperty('--card-over-card-hover');
				document.documentElement.style.removeProperty('--popup');
				document.documentElement.style.removeProperty('--navbar');
				document.documentElement.style.removeProperty('--right-bar');
			}

			// Apply glass effects to content containers
			const contentSelectors = [
				'.app-content',
				'.glass-app',
				'.card',
				'.panel',
				'.sidebar',
				'.content-panel',
				'.navbar',
				'.header',
				'.modal',
				'.overlay',
				'.popup',
				'.dialog',
			];

			contentSelectors.forEach((selector) => {
				const elements = document.querySelectorAll(selector);
				elements.forEach((element) => {
					if (isGlassModeEnabled) {
						// Apply glass morphism effects
						element.style.background = 'transparent';
						element.style.backdropFilter = 'blur(20px) saturate(180%)';
						element.style.webkitBackdropFilter = 'blur(20px) saturate(180%)';
						// element.style.borderRadius = '16px';
						// element.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
					} else {
						// Remove glass effects
						element.style.background = '';
						element.style.backdropFilter = '';
						element.style.webkitBackdropFilter = '';
						// element.style.borderRadius = '';
						// element.style.boxShadow = '';
					}
				});
			});
		};

		// Apply effects immediately
		applyGlassModeEffects();

		// Set up mutation observer for dynamic content
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === Node.ELEMENT_NODE && node.classList) {
							// Apply glass effects to new elements
							const contentSelectors = [
								'.app-content',
								'.glass-app',
								'.card',
								'.panel',
								'.sidebar',
								'.content-panel',
								'.navbar',
								'.header',
								'.modal',
								'.overlay',
								'.popup',
								'.dialog',
							];

							contentSelectors.forEach((selector) => {
								if (node.matches && node.matches(selector)) {
									if (isGlassModeEnabled) {
										node.style.background = 'transparent';
										node.style.backdropFilter = 'blur(20px) saturate(180%)';
										node.style.webkitBackdropFilter =
											'blur(20px) saturate(180%)';
										// node.style.borderRadius = '16px';
										// node.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
									}
								}
							});
						}
					});
				}
			});
		});

		// Start observing
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		return () => {
			observer.disconnect();
			// Clean up classes when component unmounts
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
