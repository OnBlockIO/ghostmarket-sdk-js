import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  automock: false,
  clearMocks: true,
  collectCoverage: true,
  // https://github.com/jest-community/jest-extended: Extended matchers
  setupFilesAfterEnv: ['jest-extended/all'],
}

export default config
