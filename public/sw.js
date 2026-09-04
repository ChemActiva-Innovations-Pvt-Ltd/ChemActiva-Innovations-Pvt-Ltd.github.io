// Service Worker for ChemActiva Website — v2.1.0
// Strategy:
//   - Navigations (HTML): network-first with cache fallback (users always get
//     the latest deploy; offline falls back to cache). The v2.0.0 cache-first
//     strategy served stale HTML referencing deleted hashed assets -> 404s.
//   - Hashed assets (_astro/*): cache-first (immutable content hashes).
//   - Images: stale-while-revalidate in a dedicated cache.
//   - Data (jsonl): network-first with cache fallback.

const CACHE_NAME = 'chemactiva-v2.1.0';
const IMAGE_CACHE = 'chemactiva-images-v2';
const PRECACHE_URLS = [
    '/manifest.json',
    '/favicon.svg',
    '/assets/images/icon-192.png',
    '/assets/images/icon-512.png',
    '/assets/images/logo.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
            .catch((error) => console.error('[SW] Precache failed:', error))
    );
});

self.addEventListener('activate', (event) => {
    const keep = [CACHE_NAME, IMAGE_CACHE];
    event.waitUntil(
        caches.keys()
            .then((names) => Promise.all(
                names.filter((n) => !keep.includes(n)).map((n) => caches.delete(n))
            ))
            .then(() => self.clients.claim())
    );
});

async function networkFirst(request, cacheName, fallbackUrl) {
    const cache = await caches.open(cacheName);
    try {
        const response = await fetch(request);
        if (response && response.status === 200 && response.type === 'basic') {
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        const cached = await cache.match(request);
        if (cached) return cached;
        if (fallbackUrl) {
            const fallback = await cache.match(fallbackUrl);
            if (fallback) return fallback;
        }
        throw err;
    }
}

async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response && response.status === 200 && response.type === 'basic') {
        cache.put(request, response.clone());
    }
    return response;
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    const fetchPromise = fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => cached);
    return cached || fetchPromise;
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    // HTML navigations: network-first (fresh deploys), cache fallback offline
    if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
        event.respondWith(
            networkFirst(request, CACHE_NAME, '/').catch(() => caches.match('/'))
        );
        return;
    }

    // Hashed build assets: immutable, cache-first
    if (url.pathname.startsWith('/_astro/')) {
        event.respondWith(cacheFirst(request, CACHE_NAME));
        return;
    }

    // Images: stale-while-revalidate
    if (/\.(webp|png|jpg|jpeg|svg|avif)$/i.test(url.pathname)) {
        event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
        return;
    }

    // Data files (jsonl): network-first
    if (url.pathname.endsWith('.jsonl')) {
        event.respondWith(networkFirst(request, CACHE_NAME));
        return;
    }

    // Everything else same-origin GET: network-first with cache fallback
    event.respondWith(networkFirst(request, CACHE_NAME));
});
