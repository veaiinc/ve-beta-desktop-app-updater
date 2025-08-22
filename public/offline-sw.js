const CACHE_NAME = 'offline-cache-v1';
const OFFLINE_URL = '/offline.html';

// Install SW and cache offline.html
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll([OFFLINE_URL]);
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
					if (key !== CACHE_NAME) return caches.delete(key);
				}),
			),
		),
	);
	self.clients.claim();
});

// Intercept fetch requests
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
