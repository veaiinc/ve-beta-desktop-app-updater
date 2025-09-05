// Unified Service Worker - Handles both offline functionality and Firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// ===== OFFLINE FUNCTIONALITY =====
const CACHE_NAME = 'offline-cache-v6';
const OFFLINE_URL = '/offline.html';
const FONTS_URL = '/src/assets/fonts/generalSans/general-sans.css';

// ===== FIREBASE MESSAGING SETUP =====
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

// ===== SERVICE WORKER LIFECYCLE =====

// Install SW and cache offline resources
self.addEventListener('install', (event) => {
	console.log('[SW] Installing service worker...');
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('[SW] Caching offline resources');
			return cache.addAll([OFFLINE_URL, FONTS_URL]);
		}),
	);
	self.skipWaiting();
});

// Activate and clean old caches
self.addEventListener('activate', (event) => {
	console.log('[SW] Activating service worker...');
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(
				keys.map((key) => {
					if (key !== CACHE_NAME) {
						console.log('[SW] Deleting old cache:', key);
						return caches.delete(key);
					}
				}),
			),
		),
	);
	self.clients.claim();
});

// ===== OFFLINE FUNCTIONALITY =====

// Intercept fetch requests for offline support
self.addEventListener('fetch', (event) => {
	if (event.request.mode === 'navigate') {
		// This is a navigation request (user trying to load a page)
		event.respondWith(
			(async () => {
				try {
					// Try network first
					return await fetch(event.request);
				} catch (error) {
					console.log('[SW] Network failed, serving offline page');
					// If offline, return offline.html
					return await caches.match(OFFLINE_URL, { ignoreSearch: true });
				}
			})(),
		);
	}
});

// ===== FIREBASE MESSAGING =====

// Handle background messages (push notifications)
messaging.onBackgroundMessage((payload) => {
	console.log('[SW] Background message received:', payload);

	const { title, body, image } = payload.notification || {};

	self.registration.showNotification(title || 'New Notification', {
		body: body || 'You have a new message.',
		icon: image || '/icon-192x192.png',
		badge: '/icon-192x192.png',
		tag: 'notification',
		requireInteraction: false,
		actions: [
			{
				action: 'open',
				title: 'Open App',
			},
		],
	});
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
	console.log('[SW] Notification clicked:', event);

	event.notification.close();

	if (event.action === 'open' || !event.action) {
		// Open the app
		event.waitUntil(
			clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
				// If app is already open, focus it
				for (let client of clientList) {
					if (client.url.includes(self.location.origin) && 'focus' in client) {
						return client.focus();
					}
				}
				// Otherwise open new window
				if (clients.openWindow) {
					return clients.openWindow('/');
				}
			}),
		);
	}
});

console.log('[SW] Unified service worker loaded successfully');
