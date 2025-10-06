// Performance Monitoring Utility
// Tracks app performance metrics and helps identify bottlenecks

class PerformanceMonitor {
	constructor() {
		this.metrics = {
			renderTimes: [],
			memoryUsage: [],
			fps: [],
			swiftUpdates: [],
			electronIPC: [],
			reactRenders: []
		};
		this.isEnabled = process.env.NODE_ENV === 'development';
		this.startTime = Date.now();
	}

	// Track render performance
	trackRender(componentName, renderTime) {
		if (!this.isEnabled) return;
		
		this.metrics.renderTimes.push({
			component: componentName,
			time: renderTime,
			timestamp: Date.now()
		});

		// Keep only last 100 render times
		if (this.metrics.renderTimes.length > 100) {
			this.metrics.renderTimes = this.metrics.renderTimes.slice(-100);
		}

		// Log slow renders
		if (renderTime > 16) { // > 60fps threshold
			console.warn(`🐌 Slow render detected: ${componentName} took ${renderTime}ms`);
		}
	}

	// Track memory usage
	trackMemory() {
		if (!this.isEnabled || !performance.memory) return;

		const memory = {
			used: performance.memory.usedJSHeapSize,
			total: performance.memory.totalJSHeapSize,
			limit: performance.memory.jsHeapSizeLimit,
			timestamp: Date.now()
		};

		this.metrics.memoryUsage.push(memory);

		// Keep only last 50 memory snapshots
		if (this.metrics.memoryUsage.length > 50) {
			this.metrics.memoryUsage = this.metrics.memoryUsage.slice(-50);
		}

		// Log high memory usage
		const usagePercent = (memory.used / memory.limit) * 100;
		if (usagePercent > 80) {
			console.warn(`🧠 High memory usage: ${usagePercent.toFixed(1)}%`);
		}
	}

	// Track FPS
	trackFPS() {
		if (!this.isEnabled) return;

		let lastTime = performance.now();
		let frameCount = 0;

		const measureFPS = () => {
			frameCount++;
			const currentTime = performance.now();
			
			if (currentTime - lastTime >= 1000) {
				const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
				this.metrics.fps.push({
					fps,
					timestamp: Date.now()
				});

				// Keep only last 30 FPS measurements
				if (this.metrics.fps.length > 30) {
					this.metrics.fps = this.metrics.fps.slice(-30);
				}

				// Log low FPS
				if (fps < 30) {
					console.warn(`📉 Low FPS detected: ${fps}`);
				}

				frameCount = 0;
				lastTime = currentTime;
			}

			requestAnimationFrame(measureFPS);
		};

		requestAnimationFrame(measureFPS);
	}

	// Track Swift updates
	trackSwiftUpdate(action, duration) {
		if (!this.isEnabled) return;

		this.metrics.swiftUpdates.push({
			action,
			duration,
			timestamp: Date.now()
		});

		// Keep only last 50 updates
		if (this.metrics.swiftUpdates.length > 50) {
			this.metrics.swiftUpdates = this.metrics.swiftUpdates.slice(-50);
		}

		// Log slow Swift updates
		if (duration > 100) {
			console.warn(`🐌 Slow Swift update: ${action} took ${duration}ms`);
		}
	}

	// Track Electron IPC performance
	trackElectronIPC(channel, duration) {
		if (!this.isEnabled) return;

		this.metrics.electronIPC.push({
			channel,
			duration,
			timestamp: Date.now()
		});

		// Keep only last 50 IPC calls
		if (this.metrics.electronIPC.length > 50) {
			this.metrics.electronIPC = this.metrics.electronIPC.slice(-50);
		}

		// Log slow IPC calls
		if (duration > 50) {
			console.warn(`🐌 Slow IPC call: ${channel} took ${duration}ms`);
		}
	}

	// Track React renders
	trackReactRender(componentName, reason) {
		if (!this.isEnabled) return;

		this.metrics.reactRenders.push({
			component: componentName,
			reason,
			timestamp: Date.now()
		});

		// Keep only last 100 renders
		if (this.metrics.reactRenders.length > 100) {
			this.metrics.reactRenders = this.metrics.reactRenders.slice(-100);
		}
	}

	// Get performance summary
	getSummary() {
		const now = Date.now();
		const uptime = now - this.startTime;

		const avgRenderTime = this.metrics.renderTimes.length > 0
			? this.metrics.renderTimes.reduce((sum, r) => sum + r.time, 0) / this.metrics.renderTimes.length
			: 0;

		const avgFPS = this.metrics.fps.length > 0
			? this.metrics.fps.reduce((sum, f) => sum + f.fps, 0) / this.metrics.fps.length
			: 0;

		const currentMemory = this.metrics.memoryUsage.length > 0
			? this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1]
			: null;

		return {
			uptime: Math.round(uptime / 1000),
			avgRenderTime: Math.round(avgRenderTime * 100) / 100,
			avgFPS: Math.round(avgFPS),
			currentMemory: currentMemory ? {
				used: Math.round(currentMemory.used / 1024 / 1024),
				total: Math.round(currentMemory.total / 1024 / 1024),
				limit: Math.round(currentMemory.limit / 1024 / 1024),
				usagePercent: Math.round((currentMemory.used / currentMemory.limit) * 100)
			} : null,
			totalRenders: this.metrics.renderTimes.length,
			totalSwiftUpdates: this.metrics.swiftUpdates.length,
			totalIPC: this.metrics.electronIPC.length,
			totalReactRenders: this.metrics.reactRenders.length
		};
	}

	// Log performance summary
	logSummary() {
		const summary = this.getSummary();
		console.log('📊 Performance Summary:', summary);
		return summary;
	}

	// Start monitoring
	start() {
		if (!this.isEnabled) return;

		console.log('🚀 Performance monitoring started');
		
		// Track memory every 5 seconds
		setInterval(() => {
			this.trackMemory();
		}, 5000);

		// Start FPS tracking
		this.trackFPS();

		// Log summary every 30 seconds
		setInterval(() => {
			this.logSummary();
		}, 30000);
	}

	// Stop monitoring
	stop() {
		console.log('🛑 Performance monitoring stopped');
		this.logSummary();
	}
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// React hook for performance tracking
export const usePerformanceTracking = (componentName) => {
	const startTime = React.useRef(0);

	React.useEffect(() => {
		startTime.current = performance.now();
	});

	React.useEffect(() => {
		const renderTime = performance.now() - startTime.current;
		performanceMonitor.trackRender(componentName, renderTime);
		performanceMonitor.trackReactRender(componentName, 'render');
	});
};

// Higher-order component for performance tracking
export const withPerformanceTracking = (WrappedComponent) => {
	return React.memo((props) => {
		const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
		usePerformanceTracking(componentName);
		return React.createElement(WrappedComponent, props);
	});
};

// Utility functions
export const trackSwiftUpdate = (action, duration) => {
	performanceMonitor.trackSwiftUpdate(action, duration);
};

export const trackElectronIPC = (channel, duration) => {
	performanceMonitor.trackElectronIPC(channel, duration);
};

export const getPerformanceSummary = () => {
	return performanceMonitor.getSummary();
};

export const startPerformanceMonitoring = () => {
	performanceMonitor.start();
};

export const stopPerformanceMonitoring = () => {
	performanceMonitor.stop();
};

export default performanceMonitor;
