export default {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/src/domain'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
}
