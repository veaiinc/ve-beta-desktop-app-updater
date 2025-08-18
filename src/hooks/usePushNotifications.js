import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '../services/pushNotifications/firebaseConfig';

const usePushNotifications = (callback) => {
	useEffect(() => {
		const unsubscribe = onMessage(messaging, (payload) => {
			if (typeof callback === 'function') {
				console.log('📩 Foreground push notification:', payload);
				callback(payload);
			}
		});

		return () => unsubscribe();
	}, [callback]);
};

export default usePushNotifications;
