/**
 * Utility functions for handling browser permissions
 */

export const checkMicrophonePermission = async () => {
	try {
		// Check if navigator.permissions is available
		if (navigator.permissions) {
			const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
			return {
				granted: permissionStatus.state === 'granted',
				denied: permissionStatus.state === 'denied',
				prompt: permissionStatus.state === 'prompt',
				state: permissionStatus.state
			};
		}
		
		// Fallback: try to access microphone directly
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			stream.getTracks().forEach(track => track.stop());
			return { granted: true, state: 'granted' };
		} catch (error) {
			return { granted: false, denied: true, state: 'denied' };
		}
	} catch (error) {
		console.error('Error checking microphone permission:', error);
		return { granted: false, state: 'unknown' };
	}
};

export const requestMicrophonePermission = async (constraints = { audio: true }) => {
	try {
		console.log('Requesting microphone permission with constraints:', constraints);
		const stream = await navigator.mediaDevices.getUserMedia(constraints);
		
		// Stop the stream immediately - we just needed permission
		stream.getTracks().forEach(track => track.stop());
		console.log('Microphone permission granted successfully');
		
		return { success: true, stream: null };
	} catch (error) {
		console.error('Microphone permission request failed:', error);
		
		let errorMessage = 'Microphone access denied. ';
		
		if (error.name === 'NotAllowedError') {
			errorMessage += 'Please allow microphone access in your browser settings and try again.';
		} else if (error.name === 'NotFoundError') {
			errorMessage += 'No microphone found. Please connect a microphone and try again.';
		} else if (error.name === 'NotReadableError') {
			errorMessage += 'Microphone is being used by another application. Please close other applications and try again.';
		} else {
			errorMessage += 'Please check your microphone settings and try again.';
		}
		
		return { 
			success: false, 
			error: error.name,
			message: errorMessage
		};
	}
};

export const getMicrophoneDevices = async () => {
	try {
		const devices = await navigator.mediaDevices.enumerateDevices();
		return devices.filter(device => device.kind === 'audioinput');
	} catch (error) {
		console.error('Error getting microphone devices:', error);
		return [];
	}
};