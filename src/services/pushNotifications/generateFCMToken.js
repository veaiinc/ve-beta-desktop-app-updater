import firebaseConfig from './firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const generateFCMToken = async () => {
	try {
		const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
		const token = await getToken(messaging, {
			vapidKey: import.meta.env.VITE_APP_FIREBASE_VAPID_KEY,
			serviceWorkerRegistration: registration,
		});
		return token;
	} catch (error) {
		console.error('Error generating FCM token:', error);
		throw error;
	}
};

export default generateFCMToken;
