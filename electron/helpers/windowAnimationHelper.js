/**
 * Window Animation Helper
 * 
 * Provides smooth, eased animations for Electron window resizing
 * across all platforms (macOS, Windows, Linux)
 * 
 * @module windowAnimationHelper
 */

const log = require('electron-log');

/**
 * Easing functions for smooth animations
 */
const easingFunctions = {
	// Smooth ease-in-out (default)
	easeInOutCubic: (t) => {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	},

	// Ease out (fast start, slow end)
	easeOutCubic: (t) => {
		return 1 - Math.pow(1 - t, 3);
	},

	// Ease in (slow start, fast end)
	easeInCubic: (t) => {
		return t * t * t;
	},

	// Smooth ease-in-out (quad)
	easeInOutQuad: (t) => {
		return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
	},

	// Ultra-smooth ease-in-out (quintic) - even smoother than cubic
	easeInOutQuint: (t) => {
		return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
	},

	// Custom smooth curve for window resizing
	easeInOutSmooth: (t) => {
		// Custom curve that feels natural for window resizing
		const c1 = 0.25;
		const c2 = 0.25;
		const c3 = 0.75;
		const c4 = 0.75;
		
		// Bezier curve implementation
		const t2 = t * t;
		const t3 = t2 * t;
		const mt = 1 - t;
		const mt2 = mt * mt;
		const mt3 = mt2 * mt;
		
		return 3 * mt2 * t * c1 + 3 * mt * t2 * c3 + t3;
	},

	// Linear (no easing)
	linear: (t) => t,
};

/**
 * Interpolate between two values using easing function
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} progress - Progress (0 to 1)
 * @param {Function} easingFn - Easing function
 * @returns {number} Interpolated value
 */
function interpolate(start, end, progress, easingFn) {
	const easedProgress = easingFn(progress);
	return Math.round(start + (end - start) * easedProgress);
}

/**
 * Animate window bounds with smooth easing
 * 
 * @param {BrowserWindow} window - Electron BrowserWindow instance
 * @param {Object} targetBounds - Target dimensions/position
 * @param {number} targetBounds.width - Target width (optional)
 * @param {number} targetBounds.height - Target height (optional)
 * @param {number} targetBounds.x - Target x position (optional)
 * @param {number} targetBounds.y - Target y position (optional)
 * @param {Object} options - Animation options
 * @param {number} options.duration - Duration in milliseconds (default: 250)
 * @param {string} options.easing - Easing function name (default: 'easeInOutCubic')
 * @param {Function} options.onComplete - Callback when animation completes
 * @returns {Promise<void>}
 */
async function animateWindowBounds(window, targetBounds, options = {}) {
	if (!window || window.isDestroyed()) {
		log.warn('⚠️ Cannot animate: window is destroyed or invalid');
		return Promise.reject(new Error('Window is invalid'));
	}

	// Default options
	const duration = options.duration || 250; // ms
	const easingName = options.easing || 'easeInOutCubic';
	const onComplete = options.onComplete || (() => {});

	// Get easing function
	const easingFn = easingFunctions[easingName] || easingFunctions.easeInOutCubic;

	// Get current bounds
	const currentBounds = window.getBounds();

	// Build target bounds (merge with current for any missing values)
	const target = {
		x: targetBounds.x !== undefined ? targetBounds.x : currentBounds.x,
		y: targetBounds.y !== undefined ? targetBounds.y : currentBounds.y,
		width: targetBounds.width !== undefined ? targetBounds.width : currentBounds.width,
		height: targetBounds.height !== undefined ? targetBounds.height : currentBounds.height,
	};

	// Check if animation is needed
	if (
		currentBounds.x === target.x &&
		currentBounds.y === target.y &&
		currentBounds.width === target.width &&
		currentBounds.height === target.height
	) {
		log.info('✅ Window already at target bounds, skipping animation');
		onComplete();
		return Promise.resolve();
	}

	log.info('🎬 Starting window animation:', {
		from: currentBounds,
		to: target,
		duration: `${duration}ms`,
		easing: easingName,
	});

	// On macOS, we can use native animation for smoother results
	if (process.platform === 'darwin') {
		return new Promise((resolve) => {
			try {
				window.setBounds(target, true); // true enables native animation
				
				// Wait for animation duration
				setTimeout(() => {
					log.info('✅ Window animation completed (native macOS)');
					onComplete();
					resolve();
				}, duration);
			} catch (error) {
				log.error('❌ Error in native animation:', error);
				resolve();
			}
		});
	}

	// For Windows/Linux: Custom frame-based animation
	return new Promise((resolve) => {
		const startTime = Date.now();
		const fps = 120; // Higher FPS for smoother animation
		const frameTime = 1000 / fps;
		let animationFrameId = null;

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			if (window.isDestroyed()) {
				log.warn('⚠️ Window destroyed during animation');
				if (animationFrameId) clearTimeout(animationFrameId);
				resolve();
				return;
			}

			// Calculate interpolated bounds
			const newBounds = {
				x: interpolate(currentBounds.x, target.x, progress, easingFn),
				y: interpolate(currentBounds.y, target.y, progress, easingFn),
				width: interpolate(currentBounds.width, target.width, progress, easingFn),
				height: interpolate(currentBounds.height, target.height, progress, easingFn),
			};

			// Apply bounds
			try {
				window.setBounds(newBounds);
			} catch (error) {
				log.error('❌ Error setting bounds during animation:', error);
				if (animationFrameId) clearTimeout(animationFrameId);
				resolve();
				return;
			}

			// Continue animation or complete
			if (progress < 1) {
				animationFrameId = setTimeout(animate, frameTime);
			} else {
				log.info('✅ Window animation completed (custom animation)');
				onComplete();
				resolve();
			}
		};

		// Start animation
		animate();
	});
}

/**
 * Resize window with smooth animation
 * 
 * @param {BrowserWindow} window - Electron BrowserWindow instance
 * @param {Object} dimensions - Target dimensions
 * @param {number} dimensions.width - Target width (optional)
 * @param {number} dimensions.height - Target height (optional)
 * @param {Object} options - Animation options
 * @returns {Promise<void>}
 */
async function resizeWindowAnimated(window, dimensions, options = {}) {
	const targetBounds = {};

	if (dimensions.width !== undefined) {
		targetBounds.width = dimensions.width;
	}

	if (dimensions.height !== undefined) {
		targetBounds.height = dimensions.height;
	}

	if (dimensions.x !== undefined) {
		targetBounds.x = dimensions.x;
	}

	if (dimensions.y !== undefined) {
		targetBounds.y = dimensions.y;
	}

	return animateWindowBounds(window, targetBounds, options);
}

/**
 * Move and resize window with smooth animation
 * 
 * @param {BrowserWindow} window - Electron BrowserWindow instance
 * @param {Object} bounds - Target bounds
 * @param {number} bounds.x - Target x position (optional)
 * @param {number} bounds.y - Target y position (optional)
 * @param {number} bounds.width - Target width (optional)
 * @param {number} bounds.height - Target height (optional)
 * @param {Object} options - Animation options
 * @returns {Promise<void>}
 */
async function setBoundsAnimated(window, bounds, options = {}) {
	return animateWindowBounds(window, bounds, options);
}

module.exports = {
	animateWindowBounds,
	resizeWindowAnimated,
	setBoundsAnimated,
	easingFunctions,
};

