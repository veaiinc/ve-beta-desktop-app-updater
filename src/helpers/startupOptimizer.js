/**
 * ⚡ STARTUP OPTIMIZER
 * Defers non-critical operations to improve initial load time
 */

/**
 * Defer execution of non-critical functions until after initial render
 * @param {Function} callback - Function to defer
 * @param {number} priority - Priority level (lower = higher priority)
 */
export const deferExecution = (callback, priority = 1) => {
	if ('requestIdleCallback' in window) {
		window.requestIdleCallback(callback, { timeout: priority * 1000 });
	} else {
		setTimeout(callback, priority * 100);
	}
};

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
	// Preload fonts
	const fonts = [
		'/assets/fonts/Inter-Regular.woff2',
		'/assets/fonts/Inter-Medium.woff2',
		'/assets/fonts/Inter-SemiBold.woff2',
	];

	fonts.forEach((font) => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = 'font';
		link.type = 'font/woff2';
		link.crossOrigin = 'anonymous';
		link.href = font;
		document.head.appendChild(link);
	});
};

/**
 * Initialize app with performance optimizations
 */
export const initializeApp = () => {
	// Priority 1: Critical - Execute immediately after first render
	deferExecution(() => {
		// Preload critical resources
		preloadCriticalResources();
	}, 1);

	// Priority 2: Important - Execute after critical operations
	deferExecution(() => {
		// Initialize analytics (if any)
		if (window.analytics && typeof window.analytics.init === 'function') {
			window.analytics.init();
		}
	}, 2);

	// Priority 3: Nice to have - Execute when browser is idle
	deferExecution(() => {
		// Prefetch next route
		if ('connection' in navigator && !navigator.connection.saveData) {
			// Only prefetch on good connections
			const nextRoutes = ['/home', '/chat'];
			nextRoutes.forEach((route) => {
				const link = document.createElement('link');
				link.rel = 'prefetch';
				link.href = route;
				document.head.appendChild(link);
			});
		}
	}, 3);
};

/**
 * Optimize images on the page
 */
export const optimizeImages = () => {
	if ('IntersectionObserver' in window) {
		const imageObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const img = entry.target;
					const src = img.dataset.src;
					if (src) {
						img.src = src;
						img.removeAttribute('data-src');
						observer.unobserve(img);
					}
				}
			});
		});

		// Observe all images with data-src
		document.querySelectorAll('img[data-src]').forEach((img) => {
			imageObserver.observe(img);
		});
	}
};

/**
 * Enable progressive web app features
 */
export const enablePWAFeatures = () => {
	deferExecution(() => {
		// Register service worker
		if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
			navigator.serviceWorker
				.register('/sw.js')
				.then((registration) => {
					console.log('⚡ Service Worker registered:', registration);
				})
				.catch((error) => {
					console.warn('Service Worker registration failed:', error);
				});
		}
	}, 2);
};

/**
 * Cleanup on app unmount
 */
export const cleanupApp = () => {
	// Clear any pending idle callbacks
	if (window.__idleCallbacks) {
		window.__idleCallbacks.forEach((id) => {
			if ('cancelIdleCallback' in window) {
				window.cancelIdleCallback(id);
			} else {
				clearTimeout(id);
			}
		});
		window.__idleCallbacks = [];
	}

	// Cleanup observers
	if (window.__observers) {
		window.__observers.forEach((observer) => {
			observer.disconnect();
		});
		window.__observers = [];
	}
};

export default {
	deferExecution,
	preloadCriticalResources,
	initializeApp,
	optimizeImages,
	enablePWAFeatures,
	cleanupApp,
};
