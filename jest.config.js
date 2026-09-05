module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['js/**/*.js'],
  coverageDirectory: 'coverage',
  testMatch: ['<rootDir>/js/tests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/js/tests/setup.js']
};
