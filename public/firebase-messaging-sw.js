import firebaseConfig from '../src/services/pushNotifications/firebaseConfig';
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js');

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log('Background message received: ', payload);

	const notificationTitle = payload.notification?.title || 'New Message';
	const notificationOptions = {
		body: payload.notification?.body,
		icon: payload.notification?.icon || '/icon-192x192.png',
		badge: '/badge.png',
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
});
