/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['<rootDir>/tests/**/*.test.ts', '<rootDir>/tests/**/*.test.tsx'],
  moduleNameMapper: {
    '^@bacon/design-system$': '<rootDir>/src/index.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:@react-native|react-native|react-native-safe-area-context)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.tsx',
    '!src/**/index.ts',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: { statements: 80, branches: 70, functions: 80, lines: 80 },
  },
  coverageReporters: ['text-summary', 'lcov', 'json-summary'],
  clearMocks: true,
  // Capped so the suite does not spawn one worker per core on a big CI box (or a dev machine
  // already running Metro) and exhaust memory.
  maxWorkers: 2,
  workerIdleMemoryLimit: '512MB',
};
