module.exports = {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  coveragePathIgnorePatterns: [
    '/index\\.ts$',
    'src/server.ts',
    '/src/factories/.*\\.ts',
    '/src/mocks/.*\\.ts',
    '/src/database/.*\\.ts',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/src/mocks/',
    '<rootDir>/src/database/',
    '<rootDir>/src/factories/',
    '<rootDir>/src/protocols/',
    '<rootDir>/src/configurations/',
    '<rootDir>/src/documentation/',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: [
    'dotenv/config',
  ],
}
