import firebaseConfig from './firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const generateFCMToken = async () => {
	try {
		await navigator.serviceWorker.register('/firebase-messaging-sw.js');
		const registration = await navigator.serviceWorker.ready;

		const token = await getToken(messaging, {
			vapidKey: import.meta.env.VITE_APP_FIREBASE_VAPID_KEY,
			serviceWorkerRegistration: registration,
		});

		if (token) {
			return token;
		} else {
			console.warn('No FCM token retrieved. Permission might not be granted.');
			return null;
		}
	} catch (error) {
		console.error('Error generating FCM token:', error);
		throw error;
	}
};

export default generateFCMToken;
