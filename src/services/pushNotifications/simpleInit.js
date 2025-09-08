// Simple push notification initialization
// Use this instead of the complex initializePushNotifications

import generateFCMToken from './generateFCMToken';
import requestPushNotificationPermission from './requestPushNotificationPermission';

/**
 * Simple push notification setup - just the essentials
 */
export const setupPushNotifications = async () => {
	try {
		// Request permission
		const permission = await requestPushNotificationPermission();
		if (permission !== 'granted') {
			console.warn('Push notification permission not granted');
			return null;
		}

		// Generate token
		const token = await generateFCMToken();
		if (token) {
			// console.log('✅ Push notifications ready:', token);
			return token;
		}

		return null;
	} catch (error) {
		console.error('❌ Push notification setup failed:', error);
		return null;
	}
};

export default setupPushNotifications;
