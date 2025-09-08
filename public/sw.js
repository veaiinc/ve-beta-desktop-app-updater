// Unified Service Worker - Handles both offline functionality and Firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// ===== OFFLINE FUNCTIONALITY =====
const CACHE_NAME = 'offline-cache-v7';
const OFFLINE_URL = '/offline.html';
const FONTS_URL = '/src/assets/fonts/generalSans/general-sans.css';

// ===== DYNAMIC FIREBASE CONFIG =====
let firebaseConfig = {
	apiKey: 'AIzaSyCoWbQyV42a2GNWIAcHPf3PBbm9D3glDJU',
	authDomain: 'veai-notifications.firebaseapp.com',
	projectId: 'veai-notifications',
	storageBucket: 'veai-notifications.firebasestorage.app',
	messagingSenderId: '719556623749',
	appId: '1:719556623749:web:5834eb840431480e5318ec',
	measurementId: 'G-B7K087ZV97',
};

// Listen for messages from main thread
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'FIREBASE_CONFIG') {
		// console.log('[SW] Received Firebase config update:', event.data.config);
		firebaseConfig = { ...firebaseConfig, ...event.data.config };

		// Reinitialize Firebase with new config if needed
		try {
			firebase.initializeApp(firebaseConfig);
		} catch (error) {
			// App might already be initialized, that's okay
			// console.log('[SW] Firebase app already initialized or error:', error.message);
		}
	} else if (event.data && event.data.type === 'TEST_MESSAGE') {
		// console.log('[SW] Test message received:', event.data.message);
	} else if (event.data && event.data.type === 'TEST_NOTIFICATION') {
		// console.log('[SW] Test notification requested:', event.data.data);

		// Show test notification
		const { title, body, icon } = event.data.data;
		self.registration.showNotification(title || 'Test Notification', {
			body: body || 'This is a test notification',
			icon: icon || '/icon-192x192.png',
			badge: '/icon-192x192.png',
			tag: 'debug-test-notification',
			requireInteraction: false,
			actions: [
				{
					action: 'close',
					title: 'Close',
				},
			],
		});
	}
});

// Initialize Firebase
try {
	firebase.initializeApp(firebaseConfig);
	// console.log('[SW] Firebase initialized successfully');
} catch (error) {
	// console.error('[SW] Firebase initialization error:', error);
}

const messaging = firebase.messaging();

// ===== SERVICE WORKER LIFECYCLE =====

// Install SW and cache offline resources
self.addEventListener('install', (event) => {
	console.log('[SW] Installing service worker...');
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll([OFFLINE_URL, FONTS_URL]);
		}),
	);
	self.skipWaiting();
});

// Activate and clean old caches
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(
				keys.map((key) => {
					if (key !== CACHE_NAME) {
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
	// console.log('[SW] Background message received:', payload);

	const notificationTitle =
		payload.notification?.title || payload.data?.title || 'New Notification';
	const notificationOptions = {
		body: payload.notification?.body || payload.data?.body || 'You have a new message.',
		icon: payload.notification?.icon || payload.data?.icon || '/icon-192x192.png',
		badge: '/icon-192x192.png',
		tag: payload.data?.tag || 'default-notification',
		requireInteraction: false,
		silent: false,
		timestamp: Date.now(),
		data: payload.data || {},
		actions: [
			{
				action: 'open',
				title: 'Open App',
				icon: '/icon-192x192.png',
			},
		],
		// Add vibration pattern for better UX
		vibrate: [200, 100, 200],
		// Show notification even if app is in foreground
		renotify: true,
	};

	// Add image if provided
	if (payload.notification?.image || payload.data?.image) {
		notificationOptions.image = payload.notification.image || payload.data.image;
	}

	return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
	// console.log('[SW] Notification clicked:', event.notification.tag, event.action);
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

// Handle push events (fallback for when onBackgroundMessage doesn't work)
self.addEventListener('push', (event) => {
	// console.log('[SW] Push event received:', event);

	if (!event.data) {
		// console.log('[SW] Push event has no data');
		return;
	}

	try {
		const payload = event.data.json();
		// console.log('[SW] Push payload:', payload);

		const notificationTitle =
			payload.notification?.title || payload.data?.title || 'New Notification';
		const notificationOptions = {
			body: payload.notification?.body || payload.data?.body || 'You have a new message.',
			icon: payload.notification?.icon || payload.data?.icon || '/icon-192x192.png',
			badge: '/icon-192x192.png',
			tag: payload.data?.tag || 'push-notification',
			requireInteraction: false,
			silent: false,
			timestamp: Date.now(),
			data: payload.data || payload,
			actions: [
				{
					action: 'open',
					title: 'Open App',
					icon: '/icon-192x192.png',
				},
			],
			vibrate: [200, 100, 200],
			renotify: true,
		};

		if (payload.notification?.image || payload.data?.image) {
			notificationOptions.image = payload.notification.image || payload.data.image;
		}

		event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
	} catch (error) {
		console.error('[SW] Error parsing push data:', error);
		// Fallback notification
		event.waitUntil(
			self.registration.showNotification('New Notification', {
				body: 'You have received a new message.',
				icon: '/icon-192x192.png',
				badge: '/icon-192x192.png',
				tag: 'fallback-notification',
			}),
		);
	}
});

// Add error handling
self.addEventListener('error', (event) => {
	console.error('[SW] Service Worker Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
	console.error('[SW] Unhandled Promise Rejection:', event.reason);
});

console.log('[SW] Unified service worker loaded successfully');
