import { useState, useEffect, useCallback } from 'react';
import { ipcRenderer } from 'electron';

export const useNotchDrop = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [status, setStatus] = useState('closed');
	const [autoOpen, setAutoOpen] = useState(true);
	const [droppedFiles, setDroppedFiles] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// Initialize state on mount
	useEffect(() => {
		initializeState();
		setupEventListeners();
		return cleanupEventListeners;
	}, []);

	const initializeState = async () => {
		try {
			setIsLoading(true);
			setError(null);

			const [visibilityResult, statusResult, autoOpenResult] = await Promise.all([
				ipcRenderer.invoke('notchdrop-is-visible'),
				ipcRenderer.invoke('notchdrop-get-status'),
				ipcRenderer.invoke('notchdrop-get-auto-open'),
			]);

			if (visibilityResult.success) setIsVisible(visibilityResult.visible);
			if (statusResult.success) setStatus(statusResult.status);
			if (autoOpenResult.success) setAutoOpen(autoOpenResult.enabled);
		} catch (err) {
			setError(err.message);
			console.error('Error initializing NotchDrop state:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const setupEventListeners = () => {
		const handleStatusChanged = (event, newStatus) => {
			setStatus(newStatus);
			console.log('NotchDrop status changed:', newStatus);
		};

		const handleFileDropped = (event, filePath) => {
			setDroppedFiles((prev) => [...prev, filePath]);
			console.log('File dropped on NotchDrop:', filePath);
		};

		const handleItemAdded = (event, itemData) => {
			console.log('Item added to NotchDrop:', itemData);
		};

		const handleItemRemoved = (event, itemData) => {
			console.log('Item removed from NotchDrop:', itemData);
		};

		ipcRenderer.on('notchdrop-status-changed', handleStatusChanged);
		ipcRenderer.on('notchdrop-file-dropped', handleFileDropped);
		ipcRenderer.on('notchdrop-item-added', handleItemAdded);
		ipcRenderer.on('notchdrop-item-removed', handleItemRemoved);

		// Store references for cleanup
		window._notchDropEventHandlers = {
			handleStatusChanged,
			handleFileDropped,
			handleItemAdded,
			handleItemRemoved,
		};
	};

	const cleanupEventListeners = () => {
		if (window._notchDropEventHandlers) {
			const handlers = window._notchDropEventHandlers;
			ipcRenderer.removeListener('notchdrop-status-changed', handlers.handleStatusChanged);
			ipcRenderer.removeListener('notchdrop-file-dropped', handlers.handleFileDropped);
			ipcRenderer.removeListener('notchdrop-item-added', handlers.handleItemAdded);
			ipcRenderer.removeListener('notchdrop-item-removed', handlers.handleItemRemoved);
			delete window._notchDropEventHandlers;
		}
	};

	const enable = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await ipcRenderer.invoke('notchdrop-enable');
			if (result.success) {
				setIsVisible(true);
				return { success: true };
			} else {
				setError(result.error);
				return { success: false, error: result.error };
			}
		} catch (err) {
			setError(err.message);
			return { success: false, error: err.message };
		} finally {
			setIsLoading(false);
		}
	}, []);

	const disable = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await ipcRenderer.invoke('notchdrop-disable');
			if (result.success) {
				setIsVisible(false);
				return { success: true };
			} else {
				setError(result.error);
				return { success: false, error: result.error };
			}
		} catch (err) {
			setError(err.message);
			return { success: false, error: err.message };
		} finally {
			setIsLoading(false);
		}
	}, []);

	const toggle = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await ipcRenderer.invoke('notchdrop-toggle');
			if (result.success) {
				setIsVisible(!isVisible);
				return { success: true };
			} else {
				setError(result.error);
				return { success: false, error: result.error };
			}
		} catch (err) {
			setError(err.message);
			return { success: false, error: err.message };
		} finally {
			setIsLoading(false);
		}
	}, [isVisible]);

	const setStatus = useCallback(async (newStatus) => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await ipcRenderer.invoke('notchdrop-set-status', newStatus);
			if (result.success) {
				setStatus(newStatus);
				return { success: true };
			} else {
				setError(result.error);
				return { success: false, error: result.error };
			}
		} catch (err) {
			setError(err.message);
			return { success: false, error: err.message };
		} finally {
			setIsLoading(false);
		}
	}, []);

	const setAutoOpenSetting = useCallback(async (enabled) => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await ipcRenderer.invoke('notchdrop-set-auto-open', enabled);
			if (result.success) {
				setAutoOpen(enabled);
				return { success: true };
			} else {
				setError(result.error);
				return { success: false, error: result.error };
			}
		} catch (err) {
			setError(err.message);
			return { success: false, error: err.message };
		} finally {
			setIsLoading(false);
		}
	}, []);

	const clearDroppedFiles = useCallback(() => {
		setDroppedFiles([]);
	}, []);

	const refresh = useCallback(() => {
		initializeState();
	}, []);

	return {
		// State
		isVisible,
		status,
		autoOpen,
		droppedFiles,
		isLoading,
		error,

		// Actions
		enable,
		disable,
		toggle,
		setStatus,
		setAutoOpenSetting,
		clearDroppedFiles,
		refresh,

		// Computed
		isEnabled: isVisible,
		canToggle: !isLoading,
		hasError: !!error,
	};
};
