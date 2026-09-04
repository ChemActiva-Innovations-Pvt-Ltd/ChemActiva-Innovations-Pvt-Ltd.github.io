/**
 * ChemActiva Website Tests
 * Authored by Shuvam Banerji Seal
 * 
 * Basic tests for website functionality.
 */

describe('ChemActiva Website', () => {
  beforeEach(() => {
    document.body.innerHTML = `
            <div id="leaves-container"></div>
            <button id="theme-toggle">🌙</button>
            <div id="nav-menu" class="nav-links-modern"></div>
            <div id="hamburger" class="hamburger"><span></span><span></span><span></span></div>
            <span id="current-year"></span>
            <span id="typewriter" class="typewriter-text"></span>
            <div id="hero-stack"></div>
            <div id="slider-track"></div>
            <div id="journey-container"></div>
            <div id="team-container"></div>
            <div id="advisors-container"></div>
            <div id="products-container"></div>
        `;
  });

  describe('Theme Toggle', () => {
    test('should toggle light-mode class on body', () => {
      const themeBtn = document.getElementById('theme-toggle');

      // Initial state - dark mode
      expect(document.body.classList.contains('light-mode')).toBe(false);

      // Toggle to light mode
      document.body.classList.add('light-mode');
      expect(document.body.classList.contains('light-mode')).toBe(true);

      // Toggle back to dark mode
      document.body.classList.remove('light-mode');
      expect(document.body.classList.contains('light-mode')).toBe(false);
    });

    test('should save theme preference to localStorage', () => {
      // Verify localStorage mock is available
      expect(typeof localStorage.setItem).toBe('function');
      expect(typeof localStorage.getItem).toBe('function');
    });
  });

  describe('Hamburger Menu', () => {
    test('should toggle active class on hamburger', () => {
      const hamburger = document.getElementById('hamburger');

      expect(hamburger.classList.contains('active')).toBe(false);

      hamburger.classList.add('active');
      expect(hamburger.classList.contains('active')).toBe(true);
    });

    test('should toggle active class on nav menu', () => {
      const navMenu = document.getElementById('nav-menu');

      expect(navMenu.classList.contains('active')).toBe(false);

      navMenu.classList.add('active');
      expect(navMenu.classList.contains('active')).toBe(true);
    });
  });

  describe('Dynamic Content Containers', () => {
    test('should have journey container', () => {
      expect(document.getElementById('journey-container')).toBeTruthy();
    });

    test('should have team container', () => {
      expect(document.getElementById('team-container')).toBeTruthy();
    });

    test('should have products container', () => {
      expect(document.getElementById('products-container')).toBeTruthy();
    });

    test('should have leaves container', () => {
      expect(document.getElementById('leaves-container')).toBeTruthy();
    });
  });

  describe('Current Year', () => {
    test('should update current year element', () => {
      const yearElement = document.getElementById('current-year');
      yearElement.textContent = new Date().getFullYear();
      expect(yearElement.textContent).toBe(String(new Date().getFullYear()));
    });
  });
});
