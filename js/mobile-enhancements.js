// Mobile Enhancements for ChemActiva Website
class MobileEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        // Add swipe gestures for image galleries
        this.initSwipeGestures();
        
        // Add pull-to-refresh indicator
        this.initPullToRefresh();
        
        // Enhance touch interactions
        this.enhanceTouchInteractions();
        
        // Add mobile-specific optimizations
        this.addMobileOptimizations();
    }
    
    initSwipeGestures() {
        const galleries = document.querySelectorAll('.product-card-image-gallery, .slider-container');
        
        galleries.forEach(gallery => {
            let startX = 0;
            let startY = 0;
            let moving = false;
            
            gallery.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                moving = true;
            }, { passive: true });
            
            gallery.addEventListener('touchmove', (e) => {
                if (!moving) return;
                
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const diffX = startX - currentX;
                const diffY = startY - currentY;
                
                // Detect horizontal swipe
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        // Swipe left - next
                        this.handleSwipe(gallery, 'next');
                    } else {
                        // Swipe right - prev
                        this.handleSwipe(gallery, 'prev');
                    }
                    moving = false;
                }
            }, { passive: true });
            
            gallery.addEventListener('touchend', () => {
                moving = false;
            }, { passive: true });
        });
    }
    
    handleSwipe(gallery, direction) {
        // Check if it's a slider
        const nextBtn = gallery.querySelector('.next-btn');
        const prevBtn = gallery.querySelector('.prev-btn');
        
        if (direction === 'next' && nextBtn) {
            nextBtn.click();
        } else if (direction === 'prev' && prevBtn) {
            prevBtn.click();
        }
        
        // Add haptic feedback if available
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    }
    
    initPullToRefresh() {
        let startY = 0;
        let pulling = false;
        const threshold = 100;
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                pulling = true;
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!pulling) return;
            
            const currentY = e.touches[0].clientY;
            const pullDistance = currentY - startY;
            
            if (pullDistance > threshold) {
                // Show refresh indicator
                this.showRefreshIndicator();
            }
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            if (pulling) {
                pulling = false;
                this.hideRefreshIndicator();
            }
        }, { passive: true });
    }
    
    showRefreshIndicator() {
        let indicator = document.getElementById('pull-refresh-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'pull-refresh-indicator';
            indicator.innerHTML = '↻ Release to refresh';
            indicator.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                padding: 1rem;
                background: var(--color-accent-primary);
                color: white;
                text-align: center;
                z-index: 10000;
                transform: translateY(-100%);
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(indicator);
        }
        indicator.style.transform = 'translateY(0)';
    }
    
    hideRefreshIndicator() {
        const indicator = document.getElementById('pull-refresh-indicator');
        if (indicator) {
            indicator.style.transform = 'translateY(-100%)';
            setTimeout(() => indicator.remove(), 300);
        }
    }
    
    enhanceTouchInteractions() {
        // Add active states for touch
        const touchElements = document.querySelectorAll('.btn, .product-card-modern, .feature-tag, .timeline-content, .team-card-modern, .advisor-card-modern');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function(e) {
                this.classList.add('touch-active');
                
                // Add ripple effect
                const ripple = document.createElement('span');
                ripple.classList.add('touch-ripple');
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.touches[0].clientX - rect.left - size / 2;
                const y = e.touches[0].clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                this.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => ripple.remove(), 600);
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
            
            element.addEventListener('touchcancel', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
        });
        
        // Add scroll-based touch feedback
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            document.body.classList.add('scrolling');
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('scrolling');
            }, 150);
        }, { passive: true });
    }
    
    addMobileOptimizations() {
        // Lazy load images on mobile
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
        
        // Optimize scrolling performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Handle scroll-based animations
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Add viewport height fix for mobile browsers
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MobileEnhancements();
    });
} else {
    new MobileEnhancements();
}

export default MobileEnhancements;
