// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // specific check for localhost
        const isLocalhost = Boolean(
            window.location.hostname === 'localhost' ||
            // [::1] is the IPv6 localhost address.
            window.location.hostname === '[::1]' ||
            // 127.0.0.1/8 is considered localhost for IPv4.
            window.location.hostname.match(
                /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
            )
        );

        if (isLocalhost) {
            // Unregister service worker on localhost to prevent caching issues
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
                for (let registration of registrations) {
                    registration.unregister();
                }
            });
            console.log('[SW] Localhost detected. Service Worker unregistered/skipped for development.');
        } else {
            // Register service worker for production
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('[SW] Service Worker registered successfully:', registration.scope);

                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New content is available
                                console.log('[SW] New content available, please refresh.');
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.warn('[SW] Service Worker registration failed:', error);
                });
        }
    });
}
