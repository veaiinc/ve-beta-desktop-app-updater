// ⚡ PERFORMANCE UTILITIES
// Debounce, throttle, and other optimization helpers

/**
 * Debounce function - delays execution until after wait milliseconds have elapsed
 * Perfect for search inputs, window resize, scroll events
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @param {boolean} immediate - Execute on leading edge instead of trailing
 */
export const debounce = (func, wait = 300, immediate = false) => {
	let timeout;
	return function executedFunction(...args) {
		const context = this;
		const later = () => {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

/**
 * Throttle function - ensures function is called at most once per specified time period
 * Perfect for scroll events, mouse move, window resize
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between calls in milliseconds
 */
export const throttle = (func, limit = 300) => {
	let inThrottle;
	return function executedFunction(...args) {
		const context = this;
		if (!inThrottle) {
			func.apply(context, args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
};

/**
 * Request Animation Frame throttle - uses RAF for smooth animations
 * Perfect for scroll animations, drag operations
 */
export const rafThrottle = (func) => {
	let rafId = null;
	return function throttled(...args) {
		if (rafId === null) {
			rafId = requestAnimationFrame(() => {
				func.apply(this, args);
				rafId = null;
			});
		}
	};
};

/**
 * Request Idle Callback wrapper - executes during browser idle time
 * Perfect for non-critical background tasks
 */
export const idleCallback = (callback, options = {}) => {
	if ('requestIdleCallback' in window) {
		return window.requestIdleCallback(callback, options);
	}
	// Fallback for browsers without requestIdleCallback
	return setTimeout(() => callback({ timeRemaining: () => 50, didTimeout: false }), 1);
};

/**
 * Cancel idle callback
 */
export const cancelIdleCallback = (id) => {
	if ('cancelIdleCallback' in window) {
		window.cancelIdleCallback(id);
	} else {
		clearTimeout(id);
	}
};

/**
 * Memoize expensive function calls
 * @param {Function} fn - Function to memoize
 * @param {Function} keyGenerator - Optional custom key generator
 */
export const memoize = (fn, keyGenerator = (...args) => JSON.stringify(args)) => {
	const cache = new Map();
	return (...args) => {
		const key = keyGenerator(...args);
		if (cache.has(key)) {
			return cache.get(key);
		}
		const result = fn(...args);
		cache.set(key, result);
		return result;
	};
};

/**
 * Batch multiple state updates into a single render
 * @param {Function[]} updates - Array of update functions
 */
export const batchUpdates = (...updates) => {
	requestAnimationFrame(() => {
		updates.forEach((update) => update());
	});
};

/**
 * Lazy load images with intersection observer
 * @param {HTMLImageElement} img - Image element
 * @param {string} src - Image source URL
 */
export const lazyLoadImage = (img, src) => {
	if ('IntersectionObserver' in window) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					img.src = src;
					observer.unobserve(img);
				}
			});
		});
		observer.observe(img);
	} else {
		// Fallback for browsers without IntersectionObserver
		img.src = src;
	}
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export const isInViewport = (element) => {
	const rect = element.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
};

/**
 * Performance mark wrapper
 * @param {string} name - Mark name
 */
export const performanceMark = (name) => {
	if ('performance' in window && 'mark' in performance) {
		performance.mark(name);
	}
};

/**
 * Performance measure wrapper
 * @param {string} name - Measure name
 * @param {string} startMark - Start mark name
 * @param {string} endMark - End mark name
 */
export const performanceMeasure = (name, startMark, endMark) => {
	if ('performance' in window && 'measure' in performance) {
		try {
			performance.measure(name, startMark, endMark);
			const measure = performance.getEntriesByName(name)[0];
			console.log(`⚡ ${name}: ${measure.duration.toFixed(2)}ms`);
			return measure.duration;
		} catch (error) {
			console.warn('Performance measurement failed:', error);
		}
	}
	return null;
};

/**
 * Create a performance observer
 * @param {string[]} entryTypes - Entry types to observe
 * @param {Function} callback - Callback function
 */
export const createPerformanceObserver = (entryTypes, callback) => {
	if ('PerformanceObserver' in window) {
		try {
			const observer = new PerformanceObserver((list) => {
				callback(list.getEntries());
			});
			observer.observe({ entryTypes });
			return observer;
		} catch (error) {
			console.warn('PerformanceObserver failed:', error);
		}
	}
	return null;
};

export default {
	debounce,
	throttle,
	rafThrottle,
	idleCallback,
	cancelIdleCallback,
	memoize,
	batchUpdates,
	lazyLoadImage,
	isInViewport,
	performanceMark,
	performanceMeasure,
	createPerformanceObserver,
};
