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
  setupFilesAfterEnv: ['jest-extended/all'],
  roots: ['src/__tests__'],
  coveragePathIgnorePatterns: [
    'node_modules/',
    'src/__tests__/GhostMarketERC721ABI.ts',
    'src/__tests__/GhostMarketERC1155ABI.ts',
    'src/__tests__/EIP712.js',
    'src/__tests__/create-rinkeby-provider.js',
    'src/__tests__/order.js',
    'src/__tests__/assets.js',
  ],
  testPathIgnorePatterns: [
    'src/__tests__/EIP712.js',
    'src/__tests__/create-rinkeby-provider.js',
    'src/__tests__/order.js',
    'src/__tests__/assets.js',
    'src/__tests__/GhostMarketERC721ABI.ts',
    'src/__tests__/GhostMarketERC1155ABI.ts',
  ],
  transformIgnorePatterns: ['node_modules/(?!(level-sublevel/node_modules/lgtgt)/)'],
  transform: {
    '\\.[jt]s?$': 'babel-jest',
  },
}

export default config
