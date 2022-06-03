import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  automock: false,
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: 'babel',
  // https://github.com/jest-community/jest-extended: Extended matchers
  setupFilesAfterEnv: ['jest-extended/all', './setEnvVar'],
  roots: ['src/__tests__'],
  coveragePathIgnorePatterns: [
    'node_modules/',
    'src/__tests__/utils/*',
    'src/constants.ts',
    'src/types.ts',
    'src/abis/',
  ],
  testPathIgnorePatterns: [
    'node_modules/',
    'src/__tests__/utils/*',
    'src/constants.ts',
    'src/types.ts',
    'src/abis/',
  ],
  transformIgnorePatterns: ['node_modules/(?!(level-sublevel/node_modules/lgtgt)/)'],
  transform: {
    '\\.[jt]s?$': 'babel-jest',
  },
}

export default config
