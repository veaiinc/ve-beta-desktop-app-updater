/**
 * Glass Mode Synchronization Utilities
 *
 * Handles synchronization between Electron main process and React renderer
 * for glass mode state management.
 */

/**
 * Initialize glass mode synchronization
 * This should be called when the app starts to sync the initial state
 */
export const initializeGlassModeSync = () => {
	// Get initial state from localStorage
	const getInitialGlassModeState = () => {
		try {
			const saved = localStorage.getItem('glassModeEnabled');
			return saved ? JSON.parse(saved) : false;
		} catch (error) {
			console.warn('Failed to load glass mode state from localStorage:', error);
			return false;
		}
	};

	// Sync initial state with Electron
	const initialState = getInitialGlassModeState();
	if (window.electronApi && window.electronApi.syncGlassModeState) {
		window.electronApi.syncGlassModeState(initialState);
	}

	// Listen for Command+G from Electron
	if (window.electronApi && window.electronApi.onTranslucencyChanged) {
		window.electronApi.onTranslucencyChanged((data) => {
			if (data && typeof data.enabled === 'boolean') {
				// Update localStorage to match Electron state
				try {
					localStorage.setItem('glassModeEnabled', JSON.stringify(data.enabled));
				} catch (error) {
					console.warn('Failed to save glass mode state to localStorage:', error);
				}
			}
		});
	}
};

/**
 * Sync glass mode state with Electron
 * @param {boolean} isEnabled - Whether glass mode is enabled
 */
export const syncGlassModeWithElectron = (isEnabled) => {
	if (window.electronApi && window.electronApi.syncGlassModeState) {
		window.electronApi.syncGlassModeState(isEnabled);
	}
};

/**
 * Get current glass mode state from localStorage
 * @returns {boolean} Current glass mode state
 */
export const getGlassModeState = () => {
	try {
		const saved = localStorage.getItem('glassModeEnabled');
		return saved ? JSON.parse(saved) : false;
	} catch (error) {
		console.warn('Failed to load glass mode state from localStorage:', error);
		return false;
	}
};

/**
 * Set glass mode state in localStorage
 * @param {boolean} isEnabled - Whether glass mode is enabled
 */
export const setGlassModeState = (isEnabled) => {
	try {
		localStorage.setItem('glassModeEnabled', JSON.stringify(isEnabled));
	} catch (error) {
		console.warn('Failed to save glass mode state to localStorage:', error);
	}
};
