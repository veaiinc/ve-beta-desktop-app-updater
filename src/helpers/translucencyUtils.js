/**
 * Enhanced Translucency Utilities
 *
 * Advanced utility functions for managing translucency effects in Electron applications.
 * Provides consistent translucency application across different components with performance optimization.
 * Now includes Ant Design component support to preserve their styling and functionality.
 */

import {
	applyAntdTranslucency,
	removeAntdTranslucency,
	isAntdComponent,
} from './antdTranslucencyUtils';

/**
 * Enhanced translucency configurations with better visual effects
 */
const TRANSLUCENCY_CONFIGS = {
	light: {
		// background: 'rgba(255, 255, 255, 0.08)',
		blur: 'blur(15px) saturate(120%)',
		// border: '1px solid rgba(255, 255, 255, 0.1)',
		// shadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
		// radius: '12px',
	},
	medium: {
		// background: 'rgba(255, 255, 255, 0.12)',
		blur: 'blur(20px) saturate(180%)',
		// border: '1px solid rgba(255, 255, 255, 0.15)',
		// shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
		// radius: '16px',
	},
	strong: {
		// background: 'rgba(255, 255, 255, 0.18)',
		blur: 'blur(25px) saturate(200%)',
		// border: '1px solid rgba(255, 255, 255, 0.2)',
		// shadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
		// radius: '20px',
	},
	dark: {
		// background: 'rgba(0, 0, 0, 0.3)',
		blur: 'blur(20px) saturate(180%)',
		// border: '1px solid rgba(255, 255, 255, 0.1)',
		// shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
		// radius: '16px',
	},
	frosted: {
		// background: 'rgba(255, 255, 255, 0.25)',
		blur: 'blur(30px) saturate(250%)',
		// border: '1px solid rgba(255, 255, 255, 0.3)',
		// shadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
		// radius: '24px',
	},
};

/**
 * Apply enhanced translucency to an element
 * @param {HTMLElement} element - The element to apply translucency to
 * @param {Object} options - Enhanced translucency options
 * @param {string} options.level - Translucency level: 'light', 'medium', 'strong', 'dark', 'frosted'
 * @param {boolean} options.performanceOptimized - Whether to apply performance optimizations
 * @param {boolean} options.includeBorder - Whether to include border styling
 * @param {boolean} options.includeShadow - Whether to include shadow styling
 * @param {string} options.customBackground - Custom background color override
 * @param {boolean} options.preserveAntdStyles - Whether to preserve Ant Design component styles
 */
export const applyTranslucency = (element, options = {}) => {
	const {
		level = 'medium',
		performanceOptimized = true,
		includeBorder = true,
		includeShadow = true,
		customBackground = null,
		preserveAntdStyles = true,
	} = options;

	if (!element) {
		console.warn('applyTranslucency: Element is null or undefined');
		return;
	}

	// Skip React Modal Portal elements
	if (element.classList && element.classList.contains('ReactModalPortal')) {
		console.log('Skipping ReactModalPortal element from translucency');
		return;
	}

	// Check if element is an Ant Design component
	if (preserveAntdStyles && isAntdComponent(element)) {
		// Use Ant Design-specific translucency
		applyAntdTranslucency(element, { level, preserveStyles: true });
		return;
	}

	// Apply regular translucency for non-Ant Design components
	const config = TRANSLUCENCY_CONFIGS[level] || TRANSLUCENCY_CONFIGS.medium;

	// Apply enhanced translucency styles
	// element.style.background = customBackground || config.background;
	element.style.backdropFilter = config.blur;
	element.style.webkitBackdropFilter = config.blur;
	// element.style.borderRadius = config.radius;

	// if (includeBorder) {
	// 	element.style.border = config.border;
	// }

	// if (includeShadow) {
	// 	element.style.boxShadow = config.shadow;
	// }

	// // Performance optimizations
	// if (performanceOptimized) {
	// 	element.style.willChange = 'backdrop-filter, transform';
	// 	element.style.transform = 'translateZ(0)';
	// 	element.style.isolation = 'isolate';
	// }

	// Add data attribute for tracking
	element.setAttribute('data-translucency-level', level);
	element.setAttribute('data-translucency-applied', 'true');
};

/**
 * Remove translucency from an element
 * @param {HTMLElement} element - The element to remove translucency from
 * @param {boolean} resetToDefault - Whether to reset to default styles
 */
export const removeTranslucency = (element, resetToDefault = false) => {
	if (!element) {
		console.warn('removeTranslucency: Element is null or undefined');
		return;
	}

	// Check if element is an Ant Design component
	if (isAntdComponent(element)) {
		// Use Ant Design-specific removal
		removeAntdTranslucency(element, resetToDefault);
		return;
	}

	// Remove translucency-specific styles for regular components
	element.style.background = resetToDefault ? '' : 'transparent';
	element.style.backdropFilter = '';
	element.style.webkitBackdropFilter = '';
	element.style.border = '';
	element.style.boxShadow = '';
	element.style.borderRadius = '';
	element.style.willChange = '';
	element.style.transform = '';
	element.style.isolation = '';

	// Remove data attributes
	element.removeAttribute('data-translucency-level');
	element.removeAttribute('data-translucency-applied');
};

/**
 * Apply translucency to multiple elements
 * @param {HTMLElement[]} elements - Array of elements to apply translucency to
 * @param {Object} options - Translucency options
 * @param {boolean} options.batchMode - Whether to use batch processing for performance
 */
export const applyTranslucencyToElements = (elements, options = {}) => {
	if (!Array.isArray(elements)) {
		console.warn('applyTranslucencyToElements: Elements must be an array');
		return;
	}

	const { batchMode = true } = options;

	if (batchMode) {
		// Use requestAnimationFrame for better performance
		requestAnimationFrame(() => {
			elements.forEach((element) => {
				if (element?.nodeType === Node.ELEMENT_NODE) {
					applyTranslucency(element, options);
				}
			});
		});
	} else {
		elements.forEach((element) => {
			if (element?.nodeType === Node.ELEMENT_NODE) {
				applyTranslucency(element, options);
			}
		});
	}
};

/**
 * Enhanced translucency support detection with performance checks
 * @returns {Object} Support information and performance metrics
 */
export const isTranslucencySupported = () => {
	const basicSupport =
		CSS.supports('backdrop-filter', 'blur(10px)') ||
		CSS.supports('-webkit-backdrop-filter', 'blur(10px)');

	// Check for advanced features
	const advancedSupport = {
		backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
		webkitBackdropFilter: CSS.supports('-webkit-backdrop-filter', 'blur(10px)'),
		willChange: CSS.supports('will-change', 'backdrop-filter'),
		isolation: CSS.supports('isolation', 'isolate'),
		transform3d: CSS.supports('transform', 'translateZ(0)'),
	};

	// Performance checks
	const performanceChecks = {
		hasReducedMotion:
			window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
		hasHighContrast: window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches,
		devicePixelRatio: window.devicePixelRatio || 1,
		connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
	};

	return {
		supported: basicSupport,
		advanced: advancedSupport,
		performance: performanceChecks,
		recommended: basicSupport && !performanceChecks.hasReducedMotion,
	};
};

/**
 * Enhanced optimal translucency level detection with comprehensive performance analysis
 * @returns {Object} Optimal settings and recommendations
 */
export const getOptimalTranslucencyLevel = () => {
	const support = isTranslucencySupported();

	// Base level determination
	let level = 'medium';
	let performanceOptimized = true;
	let includeAnimations = true;

	// Check for reduced motion preference
	if (support.performance.hasReducedMotion) {
		level = 'light';
		includeAnimations = false;
	}

	// Check for high contrast mode
	if (support.performance.hasHighContrast) {
		level = 'light';
	}

	// Check device pixel ratio for high-DPI displays
	if (support.performance.devicePixelRatio > 2) {
		level = 'medium'; // High-DPI displays can handle more blur
	}

	// Check connection type for performance optimization
	if (
		support.performance.connectionType === 'slow-2g' ||
		support.performance.connectionType === '2g'
	) {
		level = 'light';
		performanceOptimized = false;
	}

	// Check for low-end devices (heuristic)
	const isLowEndDevice =
		(navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
		support.performance.devicePixelRatio < 1.5;

	if (isLowEndDevice) {
		level = 'light';
		performanceOptimized = true;
	}

	return {
		level,
		performanceOptimized,
		includeAnimations,
		reason: {
			reducedMotion: support.performance.hasReducedMotion,
			highContrast: support.performance.hasHighContrast,
			lowEndDevice: isLowEndDevice,
			connectionType: support.performance.connectionType,
		},
		recommendations: {
			useCSSClasses: true,
			enableFallbacks: !support.supported,
			monitorPerformance: true,
		},
	};
};

/**
 * Initialize translucency for the main application
 * @param {Object} options - Initialization options
 */
export const initializeTranslucency = (options = {}) => {
	const {
		level = getOptimalTranslucencyLevel(),
		performanceOptimized = true,
		applyToMainElements = true,
	} = options;

	// Check if translucency is supported
	if (!isTranslucencySupported()) {
		console.warn('Translucency not supported in this browser');
		return;
	}

	// CRITICAL: Do NOT apply translucency to main elements - they must be fully transparent
	// Only apply to specific content containers
	if (applyToMainElements) {
		// Force main elements to be fully transparent
		const mainElements = [
			document.documentElement,
			document.body,
			document.getElementById('root'),
		].filter(Boolean);

		mainElements.forEach((element) => {
			element.style.background = 'transparent';
			// element.style.backdropFilter = 'none';
			// element.style.webkitBackdropFilter = 'none';
		});
	}

	// Set up mutation observer for dynamic content
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === 'childList') {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE && node.classList) {
						// Apply glass morphism to elements with specific classes
						if (
							node.classList.contains('glass-effect') ||
							node.classList.contains('translucent') ||
							node.classList.contains('app-content') ||
							node.classList.contains('glass-effect-main')
						) {
							applyTranslucency(node, { level, performanceOptimized });
						}
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

	return observer;
};

/**
 * Create a translucency toggle function
 * @param {HTMLElement} element - Element to toggle translucency on
 * @param {Object} options - Translucency options
 * @returns {Function} Toggle function
 */
export const createTranslucencyToggle = (element, options = {}) => {
	let isTranslucent = false;

	return () => {
		if (isTranslucent) {
			removeTranslucency(element);
			isTranslucent = false;
		} else {
			applyTranslucency(element, options);
			isTranslucent = true;
		}
	};
};

/**
 * Enhanced div targeting system for automatic translucency application
 * @param {Object} options - Targeting options
 * @param {string[]} options.selectors - CSS selectors to target
 * @param {string} options.level - Default translucency level
 * @param {boolean} options.autoApply - Whether to automatically apply to new elements
 */
export const setupDivTargeting = (options = {}) => {
	const {
		selectors = [
			'.glass-effect',
			'.translucent',
			'.app-content',
			'.glass-effect-main',
			'.glass-container',
			'.glass-panel',
			'.glass-card',
			'.content-panel',
			'.sidebar',
			'.card',
			'.panel',
		],
		level = 'medium',
		autoApply = true,
	} = options;

	// Apply to existing elements
	const applyToExisting = () => {
		selectors.forEach((selector) => {
			const elements = document.querySelectorAll(selector);
			elements.forEach((element) => {
				if (!element.getAttribute('data-translucency-applied')) {
					applyTranslucency(element, { level });
				}
			});
		});
	};

	// Set up mutation observer for new elements
	let observer = null;
	if (autoApply) {
		observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === Node.ELEMENT_NODE) {
							// Check if node matches any selector
							selectors.forEach((selector) => {
								if (node.matches && node.matches(selector)) {
									if (!node.getAttribute('data-translucency-applied')) {
										applyTranslucency(node, { level });
									}
								}
							});

							// Check children of the node
							selectors.forEach((selector) => {
								const children = node.querySelectorAll
									? node.querySelectorAll(selector)
									: [];
								children.forEach((child) => {
									if (!child.getAttribute('data-translucency-applied')) {
										applyTranslucency(child, { level });
									}
								});
							});
						}
					});
				}
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	// Apply to existing elements immediately
	applyToExisting();

	return {
		observer,
		applyToExisting,
		stopObserving: () => observer?.disconnect(),
	};
};

/**
 * Apply translucency to all divs with specific classes or attributes
 * @param {Object} options - Application options
 */
export const applyTranslucencyToDivs = (options = {}) => {
	const {
		level = 'medium',
		includeGenericDivs = false,
		excludeSelectors = ['.no-translucency', '.text-content'],
	} = options;

	// Target specific div classes
	const targetSelectors = [
		'.glass-effect',
		'.translucent',
		'.app-content',
		'.glass-effect-main',
		'.glass-container',
		'.glass-panel',
		'.glass-card',
		'.content-panel',
		'.sidebar',
		'.card',
		'.panel',
	];

	if (includeGenericDivs) {
		targetSelectors.push('div');
	}

	targetSelectors.forEach((selector) => {
		const elements = document.querySelectorAll(selector);
		elements.forEach((element) => {
			// Skip if element has exclusion class
			const shouldExclude = excludeSelectors.some(
				(excludeSelector) => element.matches && element.matches(excludeSelector),
			);

			if (!shouldExclude && !element.getAttribute('data-translucency-applied')) {
				applyTranslucency(element, { level });
			}
		});
	});
};

/**
 * Enhanced performance metrics for translucency with monitoring
 * @returns {Object} Comprehensive performance metrics
 */
export const getTranslucencyPerformance = () => {
	const translucentElements = document.querySelectorAll('[data-translucency-applied="true"]');
	const support = isTranslucencySupported();
	const optimal = getOptimalTranslucencyLevel();

	// Calculate performance impact
	const performanceImpact = {
		totalElements: translucentElements.length,
		heavyElements: Array.from(translucentElements).filter(
			(el) =>
				el.getAttribute('data-translucency-level') === 'strong' ||
				el.getAttribute('data-translucency-level') === 'frosted',
		).length,
		lightElements: Array.from(translucentElements).filter(
			(el) => el.getAttribute('data-translucency-level') === 'light',
		).length,
	};

	// Memory usage estimation (rough calculation)
	const estimatedMemoryUsage = translucentElements.length * 0.5; // KB per element

	// Performance recommendations
	const recommendations = [];
	if (performanceImpact.totalElements > 20) {
		recommendations.push('Consider reducing the number of translucent elements');
	}
	if (performanceImpact.heavyElements > 5) {
		recommendations.push('Consider using lighter translucency levels');
	}
	if (!support.supported) {
		recommendations.push('Enable fallback styles for unsupported browsers');
	}

	return {
		...performanceImpact,
		levels: Array.from(translucentElements).reduce((acc, el) => {
			const level = el.getAttribute('data-translucency-level');
			acc[level] = (acc[level] || 0) + 1;
			return acc;
		}, {}),
		support,
		optimal,
		estimatedMemoryUsage: `${estimatedMemoryUsage.toFixed(1)} KB`,
		recommendations,
		timestamp: Date.now(),
	};
};

/**
 * Performance monitoring and optimization
 * @param {Object} options - Monitoring options
 */
export const setupPerformanceMonitoring = (options = {}) => {
	const {
		interval = 5000, // Check every 5 seconds
		threshold = 20, // Alert if more than 20 translucent elements
		onPerformanceIssue = null,
	} = options;

	const monitor = () => {
		const metrics = getTranslucencyPerformance();

		// Check for performance issues
		if (metrics.totalElements > threshold) {
			console.warn(`High number of translucent elements detected: ${metrics.totalElements}`);
			onPerformanceIssue?.(metrics);
		}

		// Log performance metrics in development
		if (process.env.NODE_ENV === 'development') {
			console.log('Translucency Performance:', metrics);
		}
	};

	// Start monitoring
	const intervalId = setInterval(monitor, interval);

	// Return cleanup function
	return () => {
		clearInterval(intervalId);
	};
};

/**
 * Optimize translucency performance
 * @param {Object} options - Optimization options
 */
export const optimizeTranslucencyPerformance = (options = {}) => {
	const { reduceHeavyElements = true, enableFallbacks = true, limitElements = 15 } = options;

	const translucentElements = document.querySelectorAll('[data-translucency-applied="true"]');

	if (translucentElements.length > limitElements) {
		// Convert some heavy elements to lighter ones
		Array.from(translucentElements)
			.slice(limitElements)
			.forEach((element) => {
				const currentLevel = element.getAttribute('data-translucency-level');
				if (currentLevel === 'strong' || currentLevel === 'frosted') {
					applyTranslucency(element, { level: 'light' });
				}
			});
	}

	// Enable fallbacks for unsupported browsers
	if (enableFallbacks && !isTranslucencySupported().supported) {
		translucentElements.forEach((element) => {
			element.classList.add('translucency-fallback');
		});
	}

	return {
		optimized: true,
		reducedElements: translucentElements.length - limitElements,
		timestamp: Date.now(),
	};
};

/**
 * Universal Div Blur System
 * Applies backdrop-filter: blur(20px) to ALL divs when glass mode is enabled
 */

/**
 * Apply universal blur to all divs
 * @param {boolean} enabled - Whether to enable or disable universal blur
 * @param {Object} options - Blur options
 */
export const applyUniversalDivBlur = (enabled, options = {}) => {
	const {
		blurIntensity = '20px',
		excludeSelectors = [
			'.no-blur',
			'.text-content',
			'.transparent',
			'.ReactModalPortal', // Exclude React Modal Portal elements
			'p',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'span',
			'a',
			'button',
			'input',
			'textarea',
			'select',
		],
		performanceOptimized = true,
	} = options;

	// Get all divs in the document
	const allDivs = document.querySelectorAll('div');

	if (!allDivs.length) {
		console.warn('No divs found for universal blur application');
		return;
	}

	// Performance optimization: batch DOM updates
	if (performanceOptimized) {
		requestAnimationFrame(() => {
			processDivsBatch(allDivs, enabled, blurIntensity, excludeSelectors);
		});
	} else {
		processDivsBatch(allDivs, enabled, blurIntensity, excludeSelectors);
	}

	// Log performance metrics
	if (process.env.NODE_ENV === 'development') {
		console.log(
			`Universal div blur ${enabled ? 'enabled' : 'disabled'} for ${allDivs.length} divs`,
		);
	}
};

/**
 * Process divs in batches for better performance
 * @param {NodeList} divs - All div elements
 * @param {boolean} enabled - Whether blur is enabled
 * @param {string} blurIntensity - Blur intensity
 * @param {string[]} excludeSelectors - Selectors to exclude
 */
const processDivsBatch = (divs, enabled, blurIntensity, excludeSelectors) => {
	let processedCount = 0;
	let excludedCount = 0;
	let skippedCount = 0;

	// Performance optimization: process in smaller chunks
	const chunkSize = 50;
	const divsArray = Array.from(divs);

	const processChunk = (startIndex) => {
		const endIndex = Math.min(startIndex + chunkSize, divsArray.length);

		for (let i = startIndex; i < endIndex; i++) {
			const div = divsArray[i];

			// Skip if already processed and state hasn't changed
			const currentBlurState = div.getAttribute('data-universal-blur') === 'true';
			if (currentBlurState === enabled) {
				skippedCount++;
				continue;
			}

			// Check if div should be excluded
			const shouldExclude = excludeSelectors.some((selector) => {
				if (div.matches && div.matches(selector)) {
					return true;
				}
				// Check if div has exclusion class
				if (div.classList && div.classList.contains(selector.replace('.', ''))) {
					return true;
				}
				return false;
			});

			if (shouldExclude) {
				excludedCount++;
				continue;
			}

			// Apply or remove blur
			if (enabled) {
				div.style.backdropFilter = `blur(${blurIntensity})`;
				div.style.webkitBackdropFilter = `blur(${blurIntensity})`;
				div.setAttribute('data-universal-blur', 'true');
			} else {
				div.style.backdropFilter = '';
				div.style.webkitBackdropFilter = '';
				div.removeAttribute('data-universal-blur');
			}

			processedCount++;
		}

		// Continue processing next chunk if there are more divs
		if (endIndex < divsArray.length) {
			requestAnimationFrame(() => processChunk(endIndex));
		} else {
			// Log results when all chunks are processed
			if (process.env.NODE_ENV === 'development') {
				console.log(
					`Universal blur: ${processedCount} divs processed, ${excludedCount} excluded, ${skippedCount} skipped`,
				);
			}
		}
	};

	// Start processing from the beginning
	processChunk(0);
};

/**
 * Remove universal blur from all divs
 */
export const removeUniversalDivBlur = () => {
	applyUniversalDivBlur(false);
};

/**
 * Get universal blur status
 * @returns {Object} Universal blur status and metrics
 */
export const getUniversalBlurStatus = () => {
	const blurredDivs = document.querySelectorAll('[data-universal-blur="true"]');
	const allDivs = document.querySelectorAll('div');

	return {
		isActive: blurredDivs.length > 0,
		totalDivs: allDivs.length,
		blurredDivs: blurredDivs.length,
		coverage:
			allDivs.length > 0
				? ((blurredDivs.length / allDivs.length) * 100).toFixed(1) + '%'
				: '0%',
	};
};

/**
 * Setup universal blur with glass mode integration
 * @param {Function} glassModeCallback - Callback to check glass mode state
 * @param {Object} options - Universal blur options
 */
export const setupUniversalBlurWithGlassMode = (glassModeCallback, options = {}) => {
	const {
		checkInterval = 1000, // Check glass mode state every second
		blurIntensity = '20px',
		performanceOptimized = true,
	} = options;

	let lastGlassModeState = null;
	let isMonitoring = false;

	const checkAndApplyBlur = () => {
		if (!isMonitoring) return;

		const currentGlassModeState = glassModeCallback();

		// Only apply changes if state has changed
		if (currentGlassModeState !== lastGlassModeState) {
			applyUniversalDivBlur(currentGlassModeState, {
				blurIntensity,
				performanceOptimized,
			});
			lastGlassModeState = currentGlassModeState;
		}
	};

	// Start monitoring
	const startMonitoring = () => {
		if (isMonitoring) return;

		isMonitoring = true;
		checkAndApplyBlur(); // Apply immediately

		const intervalId = setInterval(checkAndApplyBlur, checkInterval);

		// Return cleanup function
		return () => {
			clearInterval(intervalId);
			isMonitoring = false;
		};
	};

	// Stop monitoring
	const stopMonitoring = () => {
		isMonitoring = false;
		removeUniversalDivBlur();
	};

	return {
		start: startMonitoring,
		stop: stopMonitoring,
		apply: () =>
			applyUniversalDivBlur(glassModeCallback(), { blurIntensity, performanceOptimized }),
		remove: removeUniversalDivBlur,
		status: getUniversalBlurStatus,
	};
};
