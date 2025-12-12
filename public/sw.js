// Service Worker for ChemActiva Website
// Version 1.0.0

const CACHE_NAME = 'chemactiva-v1.0.0';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/products/',
    '/products/index.html',
    '/css/base.css',
    '/css/theme.css',
    '/css/typography.css',
    '/css/layout.css',
    '/css/components.css',
    '/css/navbar.css',
    '/css/hero.css',
    '/css/sections.css',
    '/css/modern-sections.css',
    '/css/products-redesigned.css',
    '/css/journey.css',
    '/css/team.css',
    '/css/team-modernized.css',
    '/css/advisors-modernized.css',
    '/css/enhanced-hero-banner.css',
    '/css/loader.css',
    '/css/mobile-fixes.css',
    '/js/main.js',
    '/js/HeroLoader.js',
    '/js/ModernCursorEffects.js',
    '/assets/images/logo.png',
    '/assets/images/logo-small_size.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => self.skipWaiting())
            .catch((error) => {
                console.error('[Service Worker] Cache failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[Service Worker] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    // Return cached version
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    // Cache dynamic content
                    caches.open(CACHE_NAME).then((cache) => {
                        // Only cache GET requests
                        if (event.request.method === 'GET') {
                            cache.put(event.request, responseToCache);
                        }
                    });

                    return response;
                }).catch((error) => {
                    console.error('[Service Worker] Fetch failed:', error);
                    // Return offline page if available
                    return caches.match('/offline.html');
                });
            })
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

function syncData() {
    console.log('[Service Worker] Syncing data...');
    return Promise.resolve();
}

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: '/assets/images/logo-small_size.png',
        badge: '/assets/images/logo-small_size.png',
        vibrate: [200, 100, 200]
    };

    event.waitUntil(
        self.registration.showNotification('ChemActiva', options)
    );
});
