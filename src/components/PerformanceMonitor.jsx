import { useEffect, useRef } from 'react';

/**
 * ⚡ PERFORMANCE MONITOR COMPONENT
 * Tracks app performance metrics and logs them to console in development
 * Helps identify bottlenecks and slow renders
 */
const PerformanceMonitor = ({ enabled = process.env.NODE_ENV === 'development' }) => {
	const renderCountRef = useRef(0);
	const startTimeRef = useRef(Date.now());

	useEffect(() => {
		if (!enabled) return;

		renderCountRef.current++;

		// Track initial load time
		if (renderCountRef.current === 1) {
			const loadTime = Date.now() - startTimeRef.current;
			console.log(`⚡ App Initial Render: ${loadTime}ms`);

			// Mark performance milestones
			if (window.performance && window.performance.mark) {
				window.performance.mark('app-first-render');
			}
		}

		// Monitor Web Vitals if available
		if ('PerformanceObserver' in window) {
			// Largest Contentful Paint (LCP)
			try {
				const lcpObserver = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					const lastEntry = entries[entries.length - 1];
					console.log(
						`📊 LCP (Largest Contentful Paint): ${
							lastEntry.renderTime || lastEntry.loadTime
						}ms`,
					);
				});
				lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
			} catch (e) {
				// Observer not supported
			}

			// First Input Delay (FID)
			try {
				const fidObserver = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					entries.forEach((entry) => {
						console.log(
							`⚡ FID (First Input Delay): ${
								entry.processingStart - entry.startTime
							}ms`,
						);
					});
				});
				fidObserver.observe({ entryTypes: ['first-input'] });
			} catch (e) {
				// Observer not supported
			}

			// Cumulative Layout Shift (CLS)
			try {
				let clsScore = 0;
				const clsObserver = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					entries.forEach((entry) => {
						if (!entry.hadRecentInput) {
							clsScore += entry.value;
							console.log(`📊 CLS (Cumulative Layout Shift): ${clsScore.toFixed(4)}`);
						}
					});
				});
				clsObserver.observe({ entryTypes: ['layout-shift'] });
			} catch (e) {
				// Observer not supported
			}
		}

		// Log long tasks (tasks taking > 50ms)
		if ('PerformanceObserver' in window) {
			try {
				const longTaskObserver = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					entries.forEach((entry) => {
						if (entry.duration > 50) {
							console.warn(`⚠️ Long Task Detected: ${entry.duration.toFixed(2)}ms`);
						}
					});
				});
				longTaskObserver.observe({ entryTypes: ['longtask'] });
			} catch (e) {
				// Observer not supported
			}
		}

		// Track memory usage (Chrome only)
		if (window.performance && window.performance.memory) {
			const logMemory = () => {
				const used = (window.performance.memory.usedJSHeapSize / 1048576).toFixed(2);
				const total = (window.performance.memory.totalJSHeapSize / 1048576).toFixed(2);
				const limit = (window.performance.memory.jsHeapSizeLimit / 1048576).toFixed(2);
				console.log(`💾 Memory: ${used}MB / ${total}MB (Limit: ${limit}MB)`);
			};

			// Log memory every 60 seconds (reduced frequency)
			const memoryInterval = setInterval(logMemory, 60000);
			logMemory(); // Log immediately

			return () => clearInterval(memoryInterval);
		}
	}, [enabled]);

	// Monitor route changes
	useEffect(() => {
		if (!enabled) return;

		const logRouteChange = () => {
			// Only log route changes in development mode
			if (process.env.NODE_ENV === 'development') {
				console.log(`🔄 Route Changed: ${window.location.pathname}`);
			}
			if (window.performance && window.performance.mark) {
				window.performance.mark(`route-${window.location.pathname}`);
			}
		};

		// Listen for route changes
		window.addEventListener('popstate', logRouteChange);
		logRouteChange(); // Log current route

		return () => {
			window.removeEventListener('popstate', logRouteChange);
		};
	}, [enabled]);

	return null; // This component doesn't render anything
};

export default PerformanceMonitor;
