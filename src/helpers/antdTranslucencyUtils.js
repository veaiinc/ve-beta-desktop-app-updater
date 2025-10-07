/**
 * Ant Design Translucency Utilities
 *
 * Specialized utilities for applying translucency effects to Ant Design components
 * while preserving their original styling and functionality.
 */

/**
 * Ant Design component selectors that should be handled specially
 */
const ANT_DESIGN_SELECTORS = {
	// Core components
	button: '.ant-btn',
	input: '.ant-input, .ant-input-affix-wrapper',
	select: '.ant-select-selector',
	modal: '.ant-modal-content',
	tooltip: '.ant-tooltip-inner',
	popover: '.ant-popover-inner',
	dropdown: '.ant-dropdown-menu',
	table: '.ant-table-tbody > tr',
	card: '.ant-card',
	form: '.ant-form-item',

	// Layout components
	layout: '.ant-layout',
	header: '.ant-layout-header',
	sider: '.ant-layout-sider',
	content: '.ant-layout-content',
	footer: '.ant-layout-footer',

	// Navigation
	menu: '.ant-menu',
	breadcrumb: '.ant-breadcrumb',
	pagination: '.ant-pagination',

	// Data display
	descriptions: '.ant-descriptions-item',
	list: '.ant-list-item',
	timeline: '.ant-timeline-item',

	// Feedback
	alert: '.ant-alert',
	message: '.ant-message',
	notification: '.ant-notification',
	spin: '.ant-spin',
	progress: '.ant-progress',

	// Other
	drawer: '.ant-drawer-content',
	affix: '.ant-affix',
	anchor: '.ant-anchor',
	backtop: '.ant-back-top',
};

/**
 * Enhanced translucency configurations for Ant Design components
 */
const ANT_TRANSLUCENCY_CONFIGS = {
	light: {
		blur: 'blur(8px) saturate(120%)',
	},
	medium: {
		blur: 'blur(12px) saturate(150%)',
	},
	strong: {
		blur: 'blur(16px) saturate(180%)',
	},
};

/**
 * Apply translucency to Ant Design components using CSS classes instead of direct styles
 * @param {HTMLElement} element - The element to apply translucency to
 * @param {Object} options - Translucency options
 */
export const applyAntdTranslucency = (element, options = {}) => {
	const { level = 'medium', preserveStyles = true } = options;

	if (!element) return;

	// Skip React Modal Portal elements
	if (element.classList && element.classList.contains('ReactModalPortal')) {
		console.log('Skipping ReactModalPortal element from translucency');
		return;
	}

	// Check if element is an Ant Design component
	const isAntdComponent = Object.values(ANT_DESIGN_SELECTORS).some((selector) => {
		return element.matches && element.matches(selector);
	});

	if (!isAntdComponent) {
		// Use regular translucency for non-Ant Design components
		applyRegularTranslucency(element, options);
		return;
	}

	// Apply Ant Design-specific translucency
	applyAntdSpecificTranslucency(element, level, preserveStyles);
};

/**
 * Apply regular translucency (for non-Ant Design components)
 */
const applyRegularTranslucency = (element, options) => {
	const { level = 'medium' } = options;

	// Skip React Modal Portal elements
	if (element.classList && element.classList.contains('ReactModalPortal')) {
		console.log('Skipping ReactModalPortal element from regular translucency');
		return;
	}

	const config = ANT_TRANSLUCENCY_CONFIGS[level];

	element.style.backdropFilter = config.blur;
	element.style.webkitBackdropFilter = config.blur;
	element.setAttribute('data-translucency-applied', 'true');
	element.setAttribute('data-translucency-level', level);
};

/**
 * Apply Ant Design-specific translucency using CSS classes
 */
const applyAntdSpecificTranslucency = (element, level, preserveStyles) => {
	// Skip React Modal Portal elements
	if (element.classList && element.classList.contains('ReactModalPortal')) {
		console.log('Skipping ReactModalPortal element from Ant Design translucency');
		return;
	}

	// Remove any existing translucency classes
	element.classList.remove(
		'antd-translucent-light',
		'antd-translucent-medium',
		'antd-translucent-strong',
	);

	// Add appropriate translucency class
	element.classList.add(`antd-translucent-${level}`);

	// Store original styles if preserving
	if (preserveStyles) {
		storeOriginalStyles(element);
	}

	element.setAttribute('data-antd-translucency-applied', 'true');
	element.setAttribute('data-antd-translucency-level', level);
};

/**
 * Store original styles for restoration
 */
const storeOriginalStyles = (element) => {
	const originalStyles = {
		background: element.style.background || '',
		backgroundColor: element.style.backgroundColor || '',
		backdropFilter: element.style.backdropFilter || '',
		webkitBackdropFilter: element.style.webkitBackdropFilter || '',
		border: element.style.border || '',
		borderRadius: element.style.borderRadius || '',
		boxShadow: element.style.boxShadow || '',
	};

	element.setAttribute('data-original-styles', JSON.stringify(originalStyles));
};

/**
 * Remove Ant Design translucency
 */
export const removeAntdTranslucency = (element, restoreStyles = true) => {
	if (!element) return;

	// Remove translucency classes
	element.classList.remove(
		'antd-translucent-light',
		'antd-translucent-medium',
		'antd-translucent-strong',
	);

	// Restore original styles if requested
	if (restoreStyles) {
		restoreOriginalStyles(element);
	}

	// Remove attributes
	element.removeAttribute('data-antd-translucency-applied');
	element.removeAttribute('data-antd-translucency-level');
};

/**
 * Restore original styles
 */
const restoreOriginalStyles = (element) => {
	const originalStylesData = element.getAttribute('data-original-styles');
	if (!originalStylesData) return;

	try {
		const originalStyles = JSON.parse(originalStylesData);
		Object.entries(originalStyles).forEach(([property, value]) => {
			element.style[property] = value;
		});
		element.removeAttribute('data-original-styles');
	} catch (error) {
		console.warn('Failed to restore original styles:', error);
	}
};

/**
 * Check if element is an Ant Design component
 */
export const isAntdComponent = (element) => {
	if (!element || !element.matches) return false;

	return Object.values(ANT_DESIGN_SELECTORS).some((selector) => {
		return element.matches(selector);
	});
};

/**
 * Get Ant Design component type
 */
export const getAntdComponentType = (element) => {
	if (!element || !element.matches) return null;

	for (const [type, selector] of Object.entries(ANT_DESIGN_SELECTORS)) {
		if (element.matches(selector)) {
			return type;
		}
	}
	return null;
};

/**
 * Apply translucency to multiple Ant Design components
 */
export const applyAntdTranslucencyToElements = (elements, options = {}) => {
	if (!Array.isArray(elements)) {
		console.warn('applyAntdTranslucencyToElements: Elements must be an array');
		return;
	}

	const { batchMode = true, level = 'medium' } = options;

	if (batchMode) {
		requestAnimationFrame(() => {
			elements.forEach((element) => {
				if (element?.nodeType === Node.ELEMENT_NODE) {
					applyAntdTranslucency(element, { level });
				}
			});
		});
	} else {
		elements.forEach((element) => {
			if (element?.nodeType === Node.ELEMENT_NODE) {
				applyAntdTranslucency(element, { level });
			}
		});
	}
};

/**
 * Setup Ant Design translucency with mutation observer
 */
export const setupAntdTranslucencyObserver = (options = {}) => {
	const { level = 'medium', autoApply = true } = options;

	if (!autoApply) return null;

	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === 'childList') {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						// Check if it's an Ant Design component
						if (isAntdComponent(node)) {
							applyAntdTranslucency(node, { level });
						}

						// Check children for Ant Design components
						Object.values(ANT_DESIGN_SELECTORS).forEach((selector) => {
							const children = node.querySelectorAll?.(selector) || [];
							children.forEach((child) => {
								if (!child.getAttribute('data-antd-translucency-applied')) {
									applyAntdTranslucency(child, { level });
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

	return observer;
};

/**
 * Get translucency performance metrics for Ant Design components
 */
export const getAntdTranslucencyPerformance = () => {
	const antdTranslucentElements = document.querySelectorAll(
		'[data-antd-translucency-applied="true"]',
	);
	const regularTranslucentElements = document.querySelectorAll(
		'[data-translucency-applied="true"]',
	);

	return {
		antdComponents: antdTranslucentElements.length,
		regularComponents: regularTranslucentElements.length,
		total: antdTranslucentElements.length + regularTranslucentElements.length,
		antdLevels: Array.from(antdTranslucentElements).reduce((acc, el) => {
			const level = el.getAttribute('data-antd-translucency-level');
			acc[level] = (acc[level] || 0) + 1;
			return acc;
		}, {}),
	};
};
