importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
	apiKey: 'AIzaSyCoWbQyV42a2GNWIAcHPf3PBbm9D3glDJU',
	authDomain: 'veai-notifications.firebaseapp.com',
	projectId: 'veai-notifications',
	storageBucket: 'veai-notifications.firebasestorage.app',
	messagingSenderId: '719556623749',
	appId: '1:719556623749:web:5834eb840431480e5318ec',
	measurementId: 'G-B7K087ZV97',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log('[firebase-messaging-sw.js] Background message received:', payload);

	const { title, body, image } = payload.notification || {};

	self.registration.showNotification(title || 'New Notification', {
		body: body || 'You have a new message.',
		icon: image || '/icon-192x192.png',
	});
});
