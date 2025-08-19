importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js');

const firebaseConfig = {
	apiKey: 'AIzaSyCoWbQyV42a2GNWIAcHPf3PBbm9D3glDJU',
	authDomain: 'veai-notifications.firebaseapp.com',
	projectId: 'veai-notifications',
	storageBucket: 'veai-notifications.firebasestorage.app',
	messagingSenderId: '719556623749',
	appId: '1:719556623749:web:5834eb840431480e5318ec',
	measurementId: 'G-B7K087ZV97',
};

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
