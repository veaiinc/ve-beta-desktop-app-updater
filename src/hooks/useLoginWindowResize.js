import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const LOGIN_WIDTH = 481;
const DEFAULT_WIDTH = 1366;
const DEFAULT_HEIGHT = 768;

// Resize queue management to prevent conflicts
const resizeQueue = [];
let isResizing = false;

const useLoginWindowResize = () => {
	const location = useLocation();
	const previousPathRef = useRef(location.pathname);
	const retryTimeoutRef = useRef(null);
	const authStateTimeoutRef = useRef(null);

	// Debug mode - can be enabled via localStorage
	const isDebugMode = localStorage.getItem('windowResizeDebug') === 'true';

	// Fallback resize mechanism
	const fallbackResize = useCallback(
		(width, height) => {
			try {
				if (window?.electronApi?.resizeMainWindow) {
					const screenWidth = window.screen.width;
					const screenHeight = window.screen.height;

					const targetX = Math.round((screenWidth - width) / 2);
					const targetY = Math.round((screenHeight - height) / 2);

					window.electronApi.resizeMainWindow({
						dimensions: { width, height, x: targetX, y: targetY },
						animate: false, // Instant fallback
						duration: 0,
					});

					return true;
				}
			} catch (error) {
				console.error('❌ Fallback resize failed:', error);
			}
			return false;
		},
		[isDebugMode],
	);

	// Enhanced resize attempt with retry logic
	const attemptResize = useCallback(
		async (dimensions, context, retryCount = 0) => {
			try {
				if (!window?.electronApi?.resizeMainWindow) {
					console.warn('⚠️ Window resize API not available');
					return false;
				}

				// logResizeAttempt(context, dimensions);

				const result = await window.electronApi.resizeMainWindow(dimensions);

				if (result?.success) {
					return true;
				} else {
					console.warn('❌ Window resize failed:', result?.error);

					// Retry up to 3 times with exponential backoff
					if (retryCount < 3) {
						const delay = Math.pow(2, retryCount) * 100; // 100ms, 200ms, 400ms

						retryTimeoutRef.current = setTimeout(() => {
							attemptResize(dimensions, context, retryCount + 1);
						}, delay);
					} else {
						const fallbackSuccess = fallbackResize(dimensions.width, dimensions.height);
						if (!fallbackSuccess) {
							console.error('❌ All resize methods failed');
						}
					}
					return false;
				}
			} catch (error) {
				console.error('❌ Window resize error:', error);

				// Try fallback on error
				if (retryCount === 0) {
					fallbackResize(dimensions.width, dimensions.height);
				}
				return false;
			}
		},
		[fallbackResize],
	);

	// Queue management to prevent simultaneous resize operations
	const queueResize = useCallback(async (dimensions, context) => {
		return new Promise((resolve) => {
			resizeQueue.push({ dimensions, context, resolve });
			processResizeQueue();
		});
	}, []);

	const processResizeQueue = useCallback(async () => {
		if (isResizing || resizeQueue.length === 0) return;

		isResizing = true;
		const { dimensions, context, resolve } = resizeQueue.shift();

		try {
			const result = await attemptResize(dimensions, context);
			resolve(result);
		} finally {
			isResizing = false;
			// Process next item in queue with small delay
			setTimeout(processResizeQueue, 100);
		}
	}, [attemptResize]);

	// Authentication state-based resize (backup mechanism)
	const handleAuthStateChange = useCallback(() => {
		const token = localStorage.getItem('usertoken');
		const isAuthenticated = token && token.trim() !== '';

		// Define login routes for comparison
		const loginRoutes = [
			'/',
			'/verify-user',
			'/onboarding',
			'/user/verify-oauth-user',
			'/early-access',
		];

		const isReferralRoute = location.pathname.startsWith('/referral/');
		const isCurrentlyOnLogin = loginRoutes.includes(location.pathname) || isReferralRoute;

		if (isAuthenticated && !isCurrentlyOnLogin) {
			// Clear any existing timeout
			if (authStateTimeoutRef.current) {
				clearTimeout(authStateTimeoutRef.current);
			}

			// Force resize after authentication with longer delay
			authStateTimeoutRef.current = setTimeout(() => {
				const screenWidth = window.screen.width;
				const screenHeight = window.screen.height;

				const targetX = Math.round((screenWidth - DEFAULT_WIDTH) / 2);
				const targetY = Math.round((screenHeight - DEFAULT_HEIGHT) / 2);

				queueResize(
					{
						dimensions: {
							width: DEFAULT_WIDTH,
							height: DEFAULT_HEIGHT,
							x: targetX,
							y: targetY,
						},
						animate: true,
						duration: 600,
						easing: 'easeInOutSmooth',
					},
					'auth-state-change',
				);
			}, 200); // Longer delay for auth completion
		}
	}, [location.pathname, queueResize, isDebugMode]);

	// Main resize logic based on route changes
	useEffect(() => {
		const currentPath = location.pathname;
		const previousPath = previousPathRef.current;

		// Define login routes (unauthenticated routes)
		const loginRoutes = [
			'/',
			'/verify-user',
			'/onboarding',
			'/user/verify-oauth-user',
			'/early-access',
		];

		// Also check for referral routes
		const isReferralRoute = currentPath.startsWith('/referral/');
		const isCurrentlyOnLogin = loginRoutes.includes(currentPath) || isReferralRoute;
		const wasPreviouslyOnLogin =
			loginRoutes.includes(previousPath) || previousPath.startsWith('/referral/');

		// Check if window resize API is available
		if (!window?.electronApi?.resizeMainWindow) {
			console.warn('⚠️ Window resize API not available, skipping resize');
			previousPathRef.current = currentPath;
			return;
		}

		// CASE 1: Navigating TO login page → Smooth resize to 481px (logout animation)
		if (isCurrentlyOnLogin && !wasPreviouslyOnLogin) {
			const screenWidth = window.screen.width;
			const screenHeight = window.screen.height;

			const targetX = Math.round((screenWidth - LOGIN_WIDTH) / 2);
			const targetY = Math.round((screenHeight - DEFAULT_HEIGHT) / 2);

			queueResize(
				{
					dimensions: {
						width: LOGIN_WIDTH,
						height: DEFAULT_HEIGHT,
						x: targetX,
						y: targetY,
					},
					animate: true,
					duration: 500,
					easing: 'easeInOutSmooth',
				},
				'logout-resize',
			);
		}

		// CASE 2: Navigating FROM login page to authenticated route → Smooth resize to default
		if (!isCurrentlyOnLogin && wasPreviouslyOnLogin) {
			// Increased delay to allow page to load and auth to complete
			setTimeout(() => {
				const screenWidth = window.screen.width;
				const screenHeight = window.screen.height;

				const targetX = Math.round((screenWidth - DEFAULT_WIDTH) / 2);
				const targetY = Math.round((screenHeight - DEFAULT_HEIGHT) / 2);

				queueResize(
					{
						dimensions: {
							width: DEFAULT_WIDTH,
							height: DEFAULT_HEIGHT,
							x: targetX,
							y: targetY,
						},
						animate: true,
						duration: 600,
						easing: 'easeInOutSmooth',
					},
					'login-resize',
				);
			}, 200); // Increased from 80ms to 200ms for better timing
		}

		// Update the previous path reference
		previousPathRef.current = currentPath;
	}, [location.pathname, queueResize, isDebugMode]);

	// Authentication state listener (backup mechanism)
	useEffect(() => {
		// Listen for storage changes (token updates)
		const handleStorageChange = (e) => {
			if (e.key === 'usertoken') {
				handleAuthStateChange();
			}
		};

		window.addEventListener('storage', handleStorageChange);

		// Also check auth state on mount
		handleAuthStateChange();

		return () => {
			window.removeEventListener('storage', handleStorageChange);

			// Cleanup timeouts
			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current);
			}
			if (authStateTimeoutRef.current) {
				clearTimeout(authStateTimeoutRef.current);
			}
		};
	}, [handleAuthStateChange]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current);
			}
			if (authStateTimeoutRef.current) {
				clearTimeout(authStateTimeoutRef.current);
			}
		};
	}, []);
};

// Simple debug utilities (no extra files needed)
if (typeof window !== 'undefined') {
	window.enableResizeDebug = () => {
		localStorage.setItem('windowResizeDebug', 'true');
	};

	window.disableResizeDebug = () => {
		localStorage.removeItem('windowResizeDebug');
	};

	window.testResize = async (width = 800, height = 600) => {
		if (!window?.electronApi?.resizeMainWindow) {
			console.error('❌ Window resize API not available');
			return false;
		}

		try {
			const result = await window.electronApi.resizeMainWindow({
				dimensions: {
					width,
					height,
					x: Math.round((window.screen.width - width) / 2),
					y: Math.round((window.screen.height - height) / 2),
				},
				animate: true,
				duration: 300,
				easing: 'easeInOutSmooth',
			});

			if (result?.success) {
				return true;
			} else {
				console.error('❌ Test resize failed:', result);
				return false;
			}
		} catch (error) {
			console.error('❌ Test resize error:', error);
			return false;
		}
	};
}

export default useLoginWindowResize;
