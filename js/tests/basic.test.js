// Tests for Service Worker Registration
describe('Service Worker Registration', () => {
  let originalNavigator;

  beforeEach(() => {
    originalNavigator = global.navigator;
  });

  afterEach(() => {
    global.navigator = originalNavigator;
  });

  test('should check if service worker is supported', () => {
    // Mock navigator.serviceWorker
    Object.defineProperty(global, 'navigator', {
      value: {
        serviceWorker: {
          register: jest.fn().mockResolvedValue({})
        }
      },
      writable: true,
      configurable: true
    });

    expect('serviceWorker' in global.navigator).toBe(true);
  });

  test('should handle missing service worker support', () => {
    // Mock navigator without serviceWorker
    Object.defineProperty(global, 'navigator', {
      value: {},
      writable: true,
      configurable: true
    });

    expect('serviceWorker' in global.navigator).toBe(false);
  });
});

// Tests for basic DOM manipulation
describe('DOM Utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('should create and append elements', () => {
    const div = document.createElement('div');
    div.id = 'test-element';
    document.body.appendChild(div);

    expect(document.getElementById('test-element')).toBeTruthy();
  });

  test('should query elements by class', () => {
    document.body.innerHTML = '<div class="test-class"></div>';
    const elements = document.querySelectorAll('.test-class');

    expect(elements.length).toBe(1);
  });
});

// Tests for event handling
describe('Event Handling', () => {
  test('should add event listener to element', () => {
    const button = document.createElement('button');
    const mockHandler = jest.fn();
    
    button.addEventListener('click', mockHandler);
    button.click();

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  test('should handle DOMContentLoaded event', (done) => {
    const handler = jest.fn();
    document.addEventListener('DOMContentLoaded', handler);
    
    // Manually trigger the event
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    setTimeout(() => {
      expect(handler).toHaveBeenCalled();
      done();
    }, 0);
  });
});
