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
  roots: ['src/__tests__'],
  coveragePathIgnorePatterns: [
    'src/__tests__/test-helpers.ts',
    'src/__tests__/GhostMarketERC721ABI.ts',
    'src/__tests__/GhostMarketERC1155ABI.ts',
  ],
  testPathIgnorePatterns: [
    'src/src/__tests__/test-helpers.ts',
    'src/__tests__/GhostMarketERC721ABI.ts',
    'src/__tests__/GhostMarketERC1155ABI.ts',
  ],
}

export default config
