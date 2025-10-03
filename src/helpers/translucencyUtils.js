/**
 * Translucency Utilities
 *
 * Utility functions for managing translucency effects in Electron applications.
 * Provides consistent translucency application across different components.
 */

/**
 * Apply translucency to an element
 * @param {HTMLElement} element - The element to apply translucency to
 * @param {Object} options - Translucency options
 * @param {string} options.level - Translucency level: 'light', 'medium', 'strong'
 * @param {boolean} options.performanceOptimized - Whether to apply performance optimizations
 */
export const applyTranslucency = (element, options = {}) => {
	const { level = 'medium', performanceOptimized = true } = options;

	const translucencyConfigs = {
		light: {
			background: 'rgba(255, 255, 255, 0.05)',
			blur: 'blur(15px) saturate(120%)',
		},
		medium: {
			background: 'rgba(18, 18, 18, 0.2)',
			blur: 'blur(20px) saturate(180%)',
		},
		strong: {
			background: 'rgba(18, 18, 18, 0.3)',
			blur: 'blur(25px) saturate(200%)',
		},
	};

	const config = translucencyConfigs[level] || translucencyConfigs.medium;

	if (!element) return;

	// Apply translucency styles
	element.style.background = config.background;
	element.style.backdropFilter = config.blur;
	element.style.webkitBackdropFilter = config.blur;

	// Performance optimizations
	if (performanceOptimized) {
		element.style.willChange = 'backdrop-filter';
		element.style.transform = 'translateZ(0)';
	}
};

/**
 * Remove translucency from an element
 * @param {HTMLElement} element - The element to remove translucency from
 */
export const removeTranslucency = (element) => {
	if (!element) return;

	element.style.background = '';
	element.style.backdropFilter = '';
	element.style.webkitBackdropFilter = '';
	element.style.willChange = '';
	element.style.transform = '';
};

/**
 * Apply translucency to multiple elements
 * @param {HTMLElement[]} elements - Array of elements to apply translucency to
 * @param {Object} options - Translucency options
 */
export const applyTranslucencyToElements = (elements, options = {}) => {
	if (!Array.isArray(elements)) return;

	elements.forEach((element) => {
		if (element && element.nodeType === Node.ELEMENT_NODE) {
			applyTranslucency(element, options);
		}
	});
};

/**
 * Check if translucency is supported
 * @returns {boolean} Whether translucency is supported
 */
export const isTranslucencySupported = () => {
	return (
		CSS.supports('backdrop-filter', 'blur(10px)') ||
		CSS.supports('-webkit-backdrop-filter', 'blur(10px)')
	);
};

/**
 * Get optimal translucency level based on system performance
 * @returns {string} Recommended translucency level
 */
export const getOptimalTranslucencyLevel = () => {
	// Check for reduced motion preference
	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return 'light';
	}

	// Check for high contrast mode
	if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
		return 'light';
	}

	// Default to medium for good balance of effect and performance
	return 'medium';
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
			element.style.backdropFilter = 'none';
			element.style.webkitBackdropFilter = 'none';
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
