// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },

  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },

  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.{js,ts}',
    '!src/setupTests.ts',
  ],

  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/index.tsx',
    'src/reportWebVitals.{js,ts}',
    'src/setupTests.ts',
  ],

  transformIgnorePatterns: [
    'node_modules/(?!(web-vitals)/)',
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
