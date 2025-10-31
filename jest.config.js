module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/vendor.*.js',
    '!js/**/*.min.js',
    '!js/*.CmOfqZsh.js',
    '!js/*.BgEkQAtb.js',
    '!js/*.XXBai8XY.js',
    '!js/*.wYy8LG9Z.js',
    '!js/*.jD3-7TUA.js',
    '!js/*.CPcilrEE.js',
    '!js/*.CqjTI3bh.js',
    '!js/*.D26ZPjJ_.js',
    '!js/*.CdQ_VlLu.js',
    '!js/*.BtrVqNFs.js',
    '!js/*.BWOQ4zFL.js',
    '!js/*.BvIaTjIT.js'
  ],
  coverageDirectory: 'coverage',
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/js/tests/setup.js']
};
