/**
 * Clipboard helper utilities with proper permission handling
 */

/**
 * Copy text to clipboard with permission handling
 * @param {string} text - Text to copy
 * @param {Object} options - Options for error handling
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 * @param {boolean} options.requestPermission - Whether to request permission first
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text, options = {}) => {
	const {
		onSuccess = () => console.log('✅ Copied to clipboard successfully'),
		onError = (error) => console.error('❌ Failed to copy to clipboard:', error),
		requestPermission = true,
	} = options;

	try {
		// First, try to use Electron's clipboard API (no permission issues)
		if (window.electronApi?.clipboard?.writeText) {
			const result = await window.electronApi.clipboard.writeText(text);
			if (result.success) {
				console.log('✅ Copied to clipboard via Electron API');
				onSuccess();
				return true;
			} else {
				console.log('❌ Electron clipboard failed, falling back to browser API');
			}
		}

		// Fallback to browser clipboard API
		if (!navigator.clipboard || !navigator.clipboard.writeText) {
			throw new Error('Clipboard API not supported in this browser');
		}

		// Request permission first if needed
		if (requestPermission && navigator.permissions) {
			try {
				const permission = await navigator.permissions.query({ name: 'clipboard-write' });

				if (permission.state === 'denied') {
					const error = new Error(
						'Clipboard permission denied. Please allow clipboard access in your browser settings.',
					);
					error.name = 'PermissionDeniedError';
					throw error;
				}

				if (permission.state === 'prompt') {
					// Permission will be requested when we try to write
					console.log('Clipboard permission will be requested...');
				}
			} catch (e) {
				// Some browsers don't support clipboard-write permission query
				console.log('Clipboard permission query not supported, attempting direct write');
			}
		}

		// Attempt to copy to clipboard
		await navigator.clipboard.writeText(text);
		onSuccess();
		return true;
	} catch (error) {
		// Handle specific error types
		if (error.name === 'NotAllowedError') {
			const permissionError = new Error(
				'Clipboard permission denied. Please allow clipboard access and try again.',
			);
			permissionError.name = 'PermissionDeniedError';
			onError(permissionError);
		} else if (error.name === 'PermissionDeniedError') {
			onError(error);
		} else {
			onError(error);
		}
		return false;
	}
};

/**
 * Copy text to clipboard with user notification
 * @param {string} text - Text to copy
 * @param {Object} notification - Notification system (optional)
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboardWithNotification = async (text, notification = null) => {
	return await copyToClipboard(text, {
		onSuccess: () => {
			if (notification) {
				notification.success('Copied!', 'Text copied to clipboard successfully');
			} else {
				console.log('✅ Copied to clipboard successfully');
			}
		},
		onError: (error) => {
			if (notification) {
				if (error.name === 'PermissionDeniedError') {
					notification.error(
						'Permission required',
						'Please allow clipboard access in your browser settings and try again.',
					);
				} else {
					notification.error(
						'Copy failed',
						'Failed to copy to clipboard. Please try again.',
					);
				}
			} else {
				console.error('❌ Failed to copy to clipboard:', error);
			}
		},
	});
};

/**
 * Check if clipboard write permission is available
 * @returns {Promise<Object>} - Permission status
 */
export const checkClipboardWritePermission = async () => {
	try {
		if (!navigator.clipboard || !navigator.clipboard.writeText) {
			return {
				available: false,
				state: 'not-supported',
				message: 'Clipboard API not supported',
			};
		}

		if (navigator.permissions) {
			try {
				const permission = await navigator.permissions.query({ name: 'clipboard-write' });
				return {
					available: true,
					state: permission.state,
					message: `Clipboard permission: ${permission.state}`,
				};
			} catch (e) {
				// Fallback for browsers that don't support clipboard-write permission query
				return {
					available: true,
					state: 'unknown',
					message: 'Clipboard permission query not supported, but API available',
				};
			}
		}

		return {
			available: true,
			state: 'unknown',
			message: 'Clipboard API available, permissions API not supported',
		};
	} catch (error) {
		return {
			available: false,
			state: 'error',
			message: error.message,
		};
	}
};

/**
 * Test clipboard functionality
 * @returns {Promise<boolean>} - Test success status
 */
export const testClipboard = async () => {
	try {
		const testText = 'clipboard_test';
		const success = await copyToClipboard(testText, {
			onSuccess: () => console.log('Clipboard test successful'),
			onError: (error) => console.log('Clipboard test failed:', error),
		});
		return success;
	} catch (error) {
		console.error('Clipboard test error:', error);
		return false;
	}
};
