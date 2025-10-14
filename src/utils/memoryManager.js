// 🚨 CRITICAL MEMORY LEAK FIX: Global Memory Manager
// This utility tracks and cleans up all resources to prevent memory leaks

class MemoryManager {
	constructor() {
		this.activeConnections = new Set();
		this.activeTimers = new Set();
		this.activeIntervals = new Set();
		this.activeWorkers = new Set();
		this.activeEventListeners = new Map();
		this.cleanupCallbacks = new Set();
		this.isShuttingDown = false;
		
		// 🚨 CRITICAL FIX: Track memory usage
		this.memoryCheckInterval = null;
		this.startMemoryMonitoring();
	}

	// 🚨 CRITICAL FIX: Track WebSocket connections
	trackConnection(connection, type = 'websocket') {
		if (this.isShuttingDown) return;
		
		const connectionInfo = {
			connection,
			type,
			created: Date.now(),
			id: Math.random().toString(36).substr(2, 9)
		};
		
		this.activeConnections.add(connectionInfo);
		
		// Auto-cleanup on close
		if (connection && typeof connection.close === 'function') {
			const originalClose = connection.close.bind(connection);
			connection.close = (...args) => {
				this.activeConnections.delete(connectionInfo);
				return originalClose(...args);
			};
		}
		
		return connectionInfo.id;
	}

	// 🚨 CRITICAL FIX: Track timers
	trackTimer(timer, type = 'timeout') {
		if (this.isShuttingDown) return;
		
		const timerInfo = {
			timer,
			type,
			created: Date.now(),
			id: Math.random().toString(36).substr(2, 9)
		};
		
		this.activeTimers.add(timerInfo);
		return timerInfo.id;
	}

	// 🚨 CRITICAL FIX: Track intervals
	trackInterval(interval, type = 'interval') {
		if (this.isShuttingDown) return;
		
		const intervalInfo = {
			interval,
			type,
			created: Date.now(),
			id: Math.random().toString(36).substr(2, 9)
		};
		
		this.activeIntervals.add(intervalInfo);
		return intervalInfo.id;
	}

	// 🚨 CRITICAL FIX: Track workers
	trackWorker(worker, type = 'worker') {
		if (this.isShuttingDown) return;
		
		const workerInfo = {
			worker,
			type,
			created: Date.now(),
			id: Math.random().toString(36).substr(2, 9)
		};
		
		this.activeWorkers.add(workerInfo);
		return workerInfo.id;
	}

	// 🚨 CRITICAL FIX: Track event listeners
	trackEventListener(element, event, handler, type = 'dom') {
		if (this.isShuttingDown) return;
		
		const listenerInfo = {
			element,
			event,
			handler,
			type,
			created: Date.now(),
			id: Math.random().toString(36).substr(2, 9)
		};
		
		if (!this.activeEventListeners.has(element)) {
			this.activeEventListeners.set(element, new Set());
		}
		this.activeEventListeners.get(element).add(listenerInfo);
		
		return listenerInfo.id;
	}

	// 🚨 CRITICAL FIX: Register cleanup callback
	registerCleanup(callback, name = 'unnamed') {
		if (this.isShuttingDown) return;
		
		this.cleanupCallbacks.add({
			callback,
			name,
			created: Date.now()
		});
	}

	// 🚨 CRITICAL FIX: Start memory monitoring
	startMemoryMonitoring() {
		if (this.memoryCheckInterval) return;
		
		this.memoryCheckInterval = setInterval(() => {
			if (this.isShuttingDown) return;
			
			// Check memory usage
			if (window.performance && window.performance.memory) {
				const memInfo = window.performance.memory;
				const usedMB = Math.round(memInfo.usedJSHeapSize / 1048576);
				const totalMB = Math.round(memInfo.totalJSHeapSize / 1048576);
				
				// Log warning if memory usage is high
				if (usedMB > 200) {
					console.warn(`🚨 High memory usage: ${usedMB}MB / ${totalMB}MB`);
					console.warn(`Active connections: ${this.activeConnections.size}`);
					console.warn(`Active timers: ${this.activeTimers.size}`);
					console.warn(`Active intervals: ${this.activeIntervals.size}`);
					console.warn(`Active workers: ${this.activeWorkers.size}`);
					console.warn(`Active event listeners: ${this.activeEventListeners.size}`);
				}
			}
		}, 30000); // Check every 30 seconds
	}

	// 🚨 CRITICAL FIX: Comprehensive cleanup
	cleanup() {
		if (this.isShuttingDown) return;
		
		this.isShuttingDown = true;
		console.log('🧹 Starting comprehensive memory cleanup...');
		
		// Clear memory monitoring
		if (this.memoryCheckInterval) {
			clearInterval(this.memoryCheckInterval);
			this.memoryCheckInterval = null;
		}
		
		// Cleanup connections
		this.activeConnections.forEach(connInfo => {
			try {
				if (connInfo.connection && typeof connInfo.connection.close === 'function') {
					connInfo.connection.close();
				}
			} catch (error) {
				console.warn('Error closing connection:', error);
			}
		});
		this.activeConnections.clear();
		
		// Cleanup timers
		this.activeTimers.forEach(timerInfo => {
			try {
				clearTimeout(timerInfo.timer);
			} catch (error) {
				console.warn('Error clearing timer:', error);
			}
		});
		this.activeTimers.clear();
		
		// Cleanup intervals
		this.activeIntervals.forEach(intervalInfo => {
			try {
				clearInterval(intervalInfo.interval);
			} catch (error) {
				console.warn('Error clearing interval:', error);
			}
		});
		this.activeIntervals.clear();
		
		// Cleanup workers
		this.activeWorkers.forEach(workerInfo => {
			try {
				if (workerInfo.worker && typeof workerInfo.worker.terminate === 'function') {
					workerInfo.worker.terminate();
				}
			} catch (error) {
				console.warn('Error terminating worker:', error);
			}
		});
		this.activeWorkers.clear();
		
		// Cleanup event listeners
		this.activeEventListeners.forEach((listeners, element) => {
			listeners.forEach(listenerInfo => {
				try {
					element.removeEventListener(listenerInfo.event, listenerInfo.handler);
				} catch (error) {
					console.warn('Error removing event listener:', error);
				}
			});
		});
		this.activeEventListeners.clear();
		
		// Run cleanup callbacks
		this.cleanupCallbacks.forEach(callbackInfo => {
			try {
				callbackInfo.callback();
			} catch (error) {
				console.warn(`Error in cleanup callback ${callbackInfo.name}:`, error);
			}
		});
		this.cleanupCallbacks.clear();
		
		console.log('✅ Memory cleanup completed');
	}

	// 🚨 CRITICAL FIX: Get memory stats
	getStats() {
		return {
			connections: this.activeConnections.size,
			timers: this.activeTimers.size,
			intervals: this.activeIntervals.size,
			workers: this.activeWorkers.size,
			eventListeners: this.activeEventListeners.size,
			cleanupCallbacks: this.cleanupCallbacks.size,
			isShuttingDown: this.isShuttingDown
		};
	}
}

// 🚨 CRITICAL FIX: Create global instance
const memoryManager = new MemoryManager();

// 🚨 CRITICAL FIX: Cleanup on page unload
window.addEventListener('beforeunload', () => {
	memoryManager.cleanup();
});

// 🚨 CRITICAL FIX: Cleanup on visibility change (when app is hidden)
document.addEventListener('visibilitychange', () => {
	if (document.hidden) {
		// App is hidden, perform light cleanup
		console.log('App hidden, performing light cleanup...');
		// Don't do full cleanup, just log stats
		console.log('Memory stats:', memoryManager.getStats());
	}
});

export default memoryManager;

