/**
 * Jest Test Setup
 * Authored by Shuvam Banerji Seal
 * 
 * Global test configuration for ChemActiva website tests.
 */

// Mock localStorage for jsdom environment
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve(''),
    json: () => Promise.resolve({}),
  })
);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
