// Service Worker for ChemActiva Website — v2.0.0
// Precaches the real app shell (built routes + assets) and runtime-caches
// images/data with stale-while-revalidate. Previous v1 precache list pointed
// at pre-Astro URLs (/css/*, /js/main.js, /index.html) that 404 on the Astro
// build, which made install() fail and the SW never activate.

const CACHE_NAME = 'chemactiva-v2.0.0';
const IMAGE_CACHE = 'chemactiva-images-v2';

// App shell: routes + the assets every page needs (all exist in dist/)
const PRECACHE_URLS = [
    '/',
    '/products/',
    '/blog/',
    '/manifest.json',
    '/favicon.svg',
    '/assets/images/icon-512.png',
    '/assets/images/icon-192.png',
    '/blog.jsonl',
    '/team.jsonl',
    '/journey.jsonl',
    '/research.jsonl'
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

// Stale-while-revalidate for images (immutable-ish, byte-optimized webp)
async function swr(request, cacheName) {
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

    // Images: stale-while-revalidate in dedicated cache
    if (/\.(webp|png|jpg|jpeg|svg|avif)$/i.test(url.pathname)) {
        event.respondWith(swr(request, IMAGE_CACHE));
        return;
    }

    // Everything else same-origin: cache-first, then network, cache the 200s
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((response) => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return response;
            }).catch(() => caches.match('/'));
            }).catch(() => caches.match('/'))
    );
});
