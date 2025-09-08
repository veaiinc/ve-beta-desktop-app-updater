import firebaseConfig from './firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const generateFCMToken = async () => {
	try {
		// Register the unified service worker
		const registration = await navigator.serviceWorker.register('/sw.js', {
			scope: '/',
		});

		// console.log('Service Worker registered successfully:', registration.scope);

		// Wait for service worker to be ready
		await navigator.serviceWorker.ready;

		// Send Firebase config to service worker for production compatibility
		if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
			navigator.serviceWorker.controller.postMessage({
				type: 'FIREBASE_CONFIG',
				config: {
					apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
					authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
					projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
					storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
					messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
					appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
					measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
				},
			});
		}

		// Generate FCM token
		const token = await getToken(messaging, {
			vapidKey: import.meta.env.VITE_APP_FIREBASE_VAPID_KEY,
			serviceWorkerRegistration: registration,
		});

		if (token) {
			// console.log('FCM Token generated successfully:', token);
			return token;
		} else {
			console.warn('No FCM token retrieved. Permission might not be granted.');
			return null;
		}
	} catch (error) {
		console.error('Error generating FCM token:', error);

		// Additional debugging for production
		if (error.code === 'messaging/permission-blocked') {
			console.error(
				'Push notifications are blocked. Please enable them in browser settings.',
			);
		} else if (error.code === 'messaging/vapid-key-required') {
			console.error('VAPID key is required but not provided.');
		} else if (error.code === 'messaging/registration-token-not-retrieved') {
			console.error('Failed to retrieve registration token.');
		}

		throw error;
	}
};

export default generateFCMToken;
