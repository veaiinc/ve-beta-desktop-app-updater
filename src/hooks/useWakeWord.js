// WAKE WORD FUNCTIONALITY DISABLED FOR BUILD
// import { useEffect, useState, useCallback } from 'react';

// export const useWakeWord = () => {
// 	const [isEnabled, setIsEnabled] = useState(false);
// 	const [isDetecting, setIsDetecting] = useState(false);

// 	const startDetection = useCallback(async () => {
// 		try {
// 			const result = await window.electronApi.wakeWord.start();
// 			if (result.success) {
// 				setIsEnabled(true);
// 				setIsDetecting(true);
// 			}
// 		} catch (error) {
// 			console.error('Failed to start wake word detection:', error);
// 		}
// 	}, []);

// 	const stopDetection = useCallback(async () => {
// 		try {
// 			const result = await window.electronApi.wakeWord.stop();
// 			if (result.success) {
// 				setIsEnabled(false);
// 				setIsDetecting(false);
// 			}
// 		} catch (error) {
// 			console.error('Failed to stop wake word detection:', error);
// 		}
// 	}, []);

// 	const checkStatus = useCallback(async () => {
// 		try {
// 			const result = await window.electronApi.wakeWord.getStatus();
// 			setIsDetecting(result.isRunning);
// 			return result;
// 		} catch (error) {
// 			console.error('Failed to check wake word status:', error);
// 			return { success: false, isRunning: false };
// 		}
// 	}, []);

// 	useEffect(() => {
// 		// Check initial status
// 		checkStatus();
// 	}, [checkStatus]);

// 	return {
// 		isEnabled,
// 		isDetecting,
// 		startDetection,
// 		stopDetection,
// 		checkStatus,
// 	};
// };

// Disabled wake word hook - returns safe defaults
export const useWakeWord = () => {
	return {
		isEnabled: false,
		isDetecting: false,
		startDetection: async () => ({ success: false, message: 'Wake word disabled' }),
		stopDetection: async () => ({ success: false, message: 'Wake word disabled' }),
		checkStatus: async () => ({
			success: false,
			isRunning: false,
			message: 'Wake word disabled',
		}),
	};
};
