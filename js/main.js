// Simplified main.js for basic functionality
import ModernCursorEffects from './ModernCursorEffects.js';
import './HeroLoader.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('ChemActiva website loaded');

    // Initialize modern cursor effects
    try {
        const modernCursorEffects = new ModernCursorEffects();
        console.log('Modern cursor effects initialized');
    } catch (error) {
        console.warn('Modern cursor effects failed to initialize:', error);
    }

    // Initialize theme switching
    initThemeSwitcher();

    // Initialize navigation
    initNavigation();

    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});

// Theme switching functionality
function initThemeSwitcher() {
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const themeToggleDesktop = document.getElementById('theme-toggle');

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggleMobile) themeToggleMobile.checked = true;
        if (themeToggleDesktop) themeToggleDesktop.checked = true;
    }

    // Theme toggle handlers
    [themeToggleMobile, themeToggleDesktop].forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    document.body.classList.add('dark-mode');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.body.classList.remove('dark-mode');
                    localStorage.setItem('theme', 'light');
                }
                // Sync both toggles
                if (toggle === themeToggleMobile && themeToggleDesktop) {
                    themeToggleDesktop.checked = e.target.checked;
                } else if (toggle === themeToggleDesktop && themeToggleMobile) {
                    themeToggleMobile.checked = e.target.checked;
                }
            });
        }
    });
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar scroll handler
    const navbar = document.getElementById('navbar');
    if (navbar) {
        let lastScrollY = window.scrollY;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        };
        
        // Initial check
        handleScroll();
        
        // Add scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
}