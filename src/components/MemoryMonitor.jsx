// 🚨 CRITICAL MEMORY LEAK FIX: Memory Monitor Component
// This component monitors memory usage and provides cleanup controls

import React, { useState, useEffect, useRef } from 'react';
import memoryManager from '../utils/memoryManager';

const MemoryMonitor = ({ enabled = false }) => {
	const [memoryStats, setMemoryStats] = useState({});
	const [browserMemory, setBrowserMemory] = useState({});
	const [isVisible, setIsVisible] = useState(false);
	const intervalRef = useRef(null);

	useEffect(() => {
		if (!enabled) return;

		const updateStats = () => {
			setMemoryStats(memoryManager.getStats());
			
			// Get browser memory info if available
			if (window.performance && window.performance.memory) {
				const memInfo = window.performance.memory;
				setBrowserMemory({
					used: Math.round(memInfo.usedJSHeapSize / 1048576),
					total: Math.round(memInfo.totalJSHeapSize / 1048576),
					limit: Math.round(memInfo.jsHeapSizeLimit / 1048576)
				});
			}
		};

		// Update stats immediately
		updateStats();

		// Update stats every 5 seconds
		intervalRef.current = setInterval(updateStats, 5000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [enabled]);

	const handleForceCleanup = () => {
		console.log('🧹 Manual cleanup triggered');
		memoryManager.cleanup();
		setMemoryStats(memoryManager.getStats());
	};

	const handleForceGC = () => {
		if (window.gc) {
			window.gc();
			console.log('🗑️ Forced garbage collection');
		} else {
			console.log('⚠️ Garbage collection not available');
		}
	};

	if (!enabled) return null;

	return (
		<div style={{
			position: 'fixed',
			top: '10px',
			right: '10px',
			background: 'rgba(0, 0, 0, 0.8)',
			color: 'white',
			padding: '10px',
			borderRadius: '5px',
			fontSize: '12px',
			fontFamily: 'monospace',
			zIndex: 9999,
			minWidth: '200px'
		}}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
				<strong>Memory Monitor</strong>
				<button 
					onClick={() => setIsVisible(!isVisible)}
					style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '2px 5px', cursor: 'pointer' }}
				>
					{isVisible ? '−' : '+'}
				</button>
			</div>
			
			{isVisible && (
				<div>
					<div>Connections: {memoryStats.connections}</div>
					<div>Timers: {memoryStats.timers}</div>
					<div>Intervals: {memoryStats.intervals}</div>
					<div>Workers: {memoryStats.workers}</div>
					<div>Event Listeners: {memoryStats.eventListeners}</div>
					<div>Cleanup Callbacks: {memoryStats.cleanupCallbacks}</div>
					
					{browserMemory.used && (
						<div style={{ marginTop: '5px', borderTop: '1px solid #333', paddingTop: '5px' }}>
							<div>Memory: {browserMemory.used}MB / {browserMemory.total}MB</div>
							<div>Limit: {browserMemory.limit}MB</div>
							<div style={{ 
								width: '100%', 
								height: '4px', 
								background: '#333', 
								borderRadius: '2px',
								marginTop: '2px'
							}}>
								<div style={{
									width: `${(browserMemory.used / browserMemory.limit) * 100}%`,
									height: '100%',
									background: browserMemory.used > browserMemory.limit * 0.8 ? '#ff4444' : '#44ff44',
									borderRadius: '2px'
								}} />
							</div>
						</div>
					)}
					
					<div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
						<button 
							onClick={handleForceCleanup}
							style={{ 
								background: '#ff4444', 
								border: 'none', 
								color: 'white', 
								padding: '2px 5px', 
								cursor: 'pointer',
								borderRadius: '2px',
								fontSize: '10px'
							}}
						>
							Cleanup
						</button>
						<button 
							onClick={handleForceGC}
							style={{ 
								background: '#4444ff', 
								border: 'none', 
								color: 'white', 
								padding: '2px 5px', 
								cursor: 'pointer',
								borderRadius: '2px',
								fontSize: '10px'
							}}
						>
							GC
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default MemoryMonitor;

