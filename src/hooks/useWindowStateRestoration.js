import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Hook to handle window state restoration when the app is reopened from dynamic island
 * This ensures the app returns to the same page/state where it was closed
 */
export const useWindowStateRestoration = () => {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		// Save current route whenever it changes
		if (window.electronApi?.home?.saveCurrentRoute) {
			window.electronApi.home.saveCurrentRoute(location.pathname);
		}

		// Listen for window state restoration messages
		if (window.electronApi?.home?.onRestoreWindowState) {
			const handleRestoreState = (state) => {
				console.log('🔄 Restoring window state:', state);

				if (state.route && state.route !== location.pathname) {
					console.log(`📍 Navigating to saved route: ${state.route}`);
					navigate(state.route);
				}
			};

			window.electronApi.home.onRestoreWindowState(handleRestoreState);

			// Cleanup listener on unmount
			return () => {
				if (window.electronApi?.home?.removeRestoreWindowStateListener) {
					window.electronApi.home.removeRestoreWindowStateListener();
				}
			};
		}
	}, [location.pathname, navigate]);

	return null;
};
