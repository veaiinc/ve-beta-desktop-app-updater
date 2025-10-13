import { useCallback, useRef } from 'react';

/**
 * Navigation Cache Hook
 * Caches navigation state and provides optimized navigation methods
 */
export const useNavigationCache = () => {
	const cacheRef = useRef(new Map());
	const lastNavigationRef = useRef({ path: null, timestamp: 0 });

	const getCachedRoute = useCallback((path) => {
		return cacheRef.current.get(path);
	}, []);

	const setCachedRoute = useCallback((path, data) => {
		// Limit cache size to prevent memory leaks
		if (cacheRef.current.size > 50) {
			const firstKey = cacheRef.current.keys().next().value;
			cacheRef.current.delete(firstKey);
		}
		cacheRef.current.set(path, { ...data, timestamp: Date.now() });
	}, []);

	const clearCache = useCallback(() => {
		cacheRef.current.clear();
	}, []);

	const isRecentNavigation = useCallback((path, threshold = 200) => {
		const now = Date.now();
		const last = lastNavigationRef.current;
		
		if (last.path === path && now - last.timestamp < threshold) {
			return true;
		}
		
		lastNavigationRef.current = { path, timestamp: now };
		return false;
	}, []);

	const getCacheStats = useCallback(() => {
		return {
			size: cacheRef.current.size,
			keys: Array.from(cacheRef.current.keys()),
		};
	}, []);

	return {
		getCachedRoute,
		setCachedRoute,
		clearCache,
		isRecentNavigation,
		getCacheStats,
	};
};
