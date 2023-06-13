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
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/src/domain',
    '<rootDir>/src/protocols',
    '<rootDir>/src/configurations',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: [
    'dotenv/config',
  ],
}
