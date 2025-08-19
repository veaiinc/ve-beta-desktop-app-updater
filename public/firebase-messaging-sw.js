// importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js');

// const firebaseConfig = {
// 	apiKey: 'AIzaSyCoWbQyV42a2GNWIAcHPf3PBbm9D3glDJU',
// 	authDomain: 'veai-notifications.firebaseapp.com',
// 	projectId: 'veai-notifications',
// 	storageBucket: 'veai-notifications.firebasestorage.app',
// 	messagingSenderId: '719556623749',
// 	appId: '1:719556623749:web:5834eb840431480e5318ec',
// 	measurementId: 'G-B7K087ZV97',
// };

// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
// 	console.log('Background message received: ', payload);

// 	const notificationTitle = payload.notification?.title || 'New Message';
// 	const notificationOptions = {
// 		body: payload.notification?.body,
// 		icon: payload.notification?.icon || '/icon-192x192.png',
// 		badge: '/badge.png',
// 	};

// 	self.registration.showNotification(notificationTitle, notificationOptions);
// });

// firebase-messaging-sw.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
	getMessaging,
	onBackgroundMessage,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-sw.js';

// Your Firebase config
const firebaseConfig = {
	apiKey: 'AIzaSyCoWbQyV42a2GNWIAcHPf3PBbm9D3glDJU',
	authDomain: 'veai-notifications.firebaseapp.com',
	projectId: 'veai-notifications',
	storageBucket: 'veai-notifications.firebasestorage.app',
	messagingSenderId: '719556623749',
	appId: '1:719556623749:web:5834eb840431480e5318ec',
	measurementId: 'G-B7K087ZV97',
};

// Initialize Firebase inside the service worker
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handle background push messages
onBackgroundMessage(messaging, (payload) => {
	console.log('[firebase-messaging-sw.js] Background message received:', payload);

	const { title, body, icon } = payload.notification;

	self.registration.showNotification(title, {
		body,
		icon: icon || '/icon-192x192.png', // fallback icon if not provided
	});
});
