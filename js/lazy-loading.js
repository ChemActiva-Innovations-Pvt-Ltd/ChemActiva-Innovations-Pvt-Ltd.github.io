// Enhanced Lazy Loading for Images
// Improves performance by loading images only when they're about to enter the viewport

(function() {
    'use strict';

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver not supported, loading all images immediately');
        // Fallback: load all images immediately for older browsers
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
        return;
    }

    // Configuration for IntersectionObserver
    const config = {
        // Load images 200px before they enter the viewport
        rootMargin: '200px 0px',
        threshold: 0.01
    };

    // Create the observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Load the image
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                // Add loaded class for fade-in animation
                img.addEventListener('load', () => {
                    img.classList.add('lazy-loaded');
                }, { once: true });
                
                // Stop observing this image
                observer.unobserve(img);
            }
        });
    }, config);

    // Function to initialize lazy loading
    function initLazyLoading() {
        // Find all images with loading="lazy" attribute
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        lazyImages.forEach(img => {
            // Add lazy-image class for styling
            img.classList.add('lazy-image');
            
            // Observe the image
            imageObserver.observe(img);
        });

        console.log(`Lazy loading initialized for ${lazyImages.length} images`);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLazyLoading);
    } else {
        initLazyLoading();
    }

    // Re-initialize when new content is added dynamically
    const contentObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    // Only process element nodes
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the node itself is a lazy image
                        if (node.tagName === 'IMG' && node.getAttribute('loading') === 'lazy') {
                            node.classList.add('lazy-image');
                            imageObserver.observe(node);
                        }
                        
                        // Check for lazy images within the node
                        const newLazyImages = node.querySelectorAll('img[loading="lazy"]');
                        newLazyImages.forEach(img => {
                            img.classList.add('lazy-image');
                            imageObserver.observe(img);
                        });
                    }
                });
            }
        });
    });

    // Observe the main content container for new images (more efficient than observing entire body)
    const mainContent = document.querySelector('main') || document.body;
    contentObserver.observe(mainContent, {
        childList: true,
        subtree: true
    });

    // Add CSS for lazy loading animation
    const style = document.createElement('style');
    style.textContent = `
        img.lazy-image {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        
        img.lazy-image.lazy-loaded {
            opacity: 1;
        }
        
        /* Placeholder background for lazy images */
        img.lazy-image:not(.lazy-loaded) {
            background: linear-gradient(
                90deg,
                rgba(var(--color-accent-rgb-values, 50, 142, 110), 0.05) 0%,
                rgba(var(--color-accent-rgb-values, 50, 142, 110), 0.1) 50%,
                rgba(var(--color-accent-rgb-values, 50, 142, 110), 0.05) 100%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
        }
        
        @keyframes shimmer {
            0% {
                background-position: -200% 0;
            }
            100% {
                background-position: 200% 0;
            }
        }

        /* Dark mode placeholder */
        body.dark-mode img.lazy-image:not(.lazy-loaded) {
            background: linear-gradient(
                90deg,
                rgba(var(--dm-glow-color-rgb-values, 52, 211, 153), 0.05) 0%,
                rgba(var(--dm-glow-color-rgb-values, 52, 211, 153), 0.1) 50%,
                rgba(var(--dm-glow-color-rgb-values, 52, 211, 153), 0.05) 100%
            );
        }
    `;
    document.head.appendChild(style);

})();
