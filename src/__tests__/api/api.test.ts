import { GhostMarketAPI } from '../../api'
import { GhostMarketAPIConfig, Network } from '../../types'
import { API_BASE_MAINNET, API_BASE_TESTNET, NULL_ADDRESS } from '../../constants'
import * as matchers from 'jest-extended'
expect.extend(matchers)

describe('GhostMarket API Basics', () => {
  const apiBaseUrl = API_BASE_TESTNET
  const ghostMarketAPIConfig: GhostMarketAPIConfig = {
    networkName: Network.EthereumTestnet,
    apiKey: process.env.GM_API_KEY,
    apiBaseUrl,
    useReadOnlyProvider: true,
  }

  let ghostmarketAPI: GhostMarketAPI
  beforeAll(() => {
    ghostmarketAPI = new GhostMarketAPI(ghostMarketAPIConfig)
  })

  describe('Misc', () => {
    it('API endpoints have correct base URL', async () => {
      expect(API_BASE_MAINNET).toBe('https://api.ghostmarket.io')
      expect(API_BASE_TESTNET).toBe('https://api-testnet.ghostmarket.io')
    }, 10000)

    it('API key included in request', async () => {
      const oldLogger = ghostmarketAPI.logger

      const logPromise = new Promise<void>((resolve, reject) => {
        ghostmarketAPI.logger = log => {
          try {
            expect(log).toInclude(`"X-API-KEY":"${process.env.GM_API_KEY}"`)
            resolve()
          } catch (e) {
            reject(e)
          } finally {
            ghostmarketAPI.logger = oldLogger
          }
        }
        ghostmarketAPI.getAssets()
      })
      await logPromise
    }, 10000)

    it('API handles errors', async () => {
      try {
        // contract passed but no chain
        const assetsQuery = {
          contract: NULL_ADDRESS,
        }
        await ghostmarketAPI.getAssets(assetsQuery)
      } catch (error) {
        expect(error).toInclude('Pass chain when using contract filter.')
      }
    }, 10000)
  })
})

describe('GhostMarket API Get', () => {
  const apiBaseUrl = API_BASE_TESTNET
  const ghostMarketAPIConfig: GhostMarketAPIConfig = {
    networkName: Network.EthereumTestnet,
    apiKey: process.env.GM_API_KEY,
    apiBaseUrl,
    useReadOnlyProvider: true,
  }

  let ghostmarketAPI: GhostMarketAPI
  beforeAll(() => {
    ghostmarketAPI = new GhostMarketAPI(ghostMarketAPIConfig)
  })

  describe('Assets', () => {
    it('should get Assets', async () => {
      const assetsData = await ghostmarketAPI.getAssets()
      expect(assetsData).toHaveProperty('assets')
      const { assets } = assetsData
      expect(assets).toBeArray()
      expect(assets).toBeArrayOfSize(25)
    }, 10000)

    it('should get single Asset', async () => {
      const assetsData = await ghostmarketAPI.getAssets({ limit: 1 })
      expect(assetsData).toHaveProperty('assets')
      const { assets } = assetsData
      expect(assets).toBeArray()
      expect(assets).toBeArrayOfSize(1)
    }, 10000)
  })

  describe('Collections', () => {
    it('should get Collections', async () => {
      const collectionsData = await ghostmarketAPI.getCollections()
      expect(collectionsData).toHaveProperty('collections')
      const { collections } = collectionsData
      expect(collections).toBeArray()
      expect(collections).toBeArrayOfSize(50)
    }, 10000)

    it('should get single Collection', async () => {
      const collectionsData = await ghostmarketAPI.getCollections({ limit: 1 })
      expect(collectionsData).toHaveProperty('collections')
      const { collections } = collectionsData
      expect(collections).toBeArray()
      expect(collections).toBeArrayOfSize(1)
    }, 10000)
  })

  describe('Events', () => {
    it('should get Events', async () => {
      const eventsData = await ghostmarketAPI.getEvents()
      expect(eventsData).toHaveProperty('events')
      const { events } = eventsData
      expect(events).toBeArray()
      expect(events).toBeArrayOfSize(50)
    }, 10000)

    it('should get single Event', async () => {
      const eventsData = await ghostmarketAPI.getEvents({ limit: 1 })
      expect(eventsData).toHaveProperty('events')
      const { events } = eventsData
      expect(events).toBeArray()
      expect(events).toBeArrayOfSize(1)
    }, 10000)
  })

  describe('Series', () => {
    it('should get Series', async () => {
      const serriesData = await ghostmarketAPI.getSeries()
      expect(serriesData).toHaveProperty('series')
      const { series } = serriesData
      expect(series).toBeArray()
      expect(series).toBeArrayOfSize(50)
    }, 10000)

    it('should get single Serie', async () => {
      const serriesData = await ghostmarketAPI.getSeries({ limit: 1 })
      expect(serriesData).toHaveProperty('series')
      const { series } = serriesData
      expect(series).toBeArray()
      expect(series).toBeArrayOfSize(1)
    }, 10000)
  })

  describe('Open Orders', () => {
    it('should get Open Orders ', async () => {
      const openOrdersData = await ghostmarketAPI.getOpenOrders({ with_deleted: false })
      expect(openOrdersData).toHaveProperty('open_orders')
      const { open_orders: openOrders } = openOrdersData
      expect(openOrders).toBeArray()
      expect(openOrders).toBeArrayOfSize(50)
    }, 10000)

    it('should get single Open Order', async () => {
      const { open_orders: orders } = await ghostmarketAPI.getOrders({
        with_deleted: false,
        limit: 1,
      })
      expect(orders).toBeArray()
      expect(orders).toBeArrayOfSize(1)
    }, 10000)
  })

  describe('Open Mintings', () => {
    it('should get Open Mintings', async () => {
      const openMintingsData = await ghostmarketAPI.getOpenMintings()
      expect(openMintingsData).toHaveProperty('open_mintings')
      const { open_mintings: openMintings } = openMintingsData
      expect(openMintings).toBeArray()
      expect(openMintings).toBeArrayOfSize(9)
    }, 10000)

    it('should get single Open Minting', async () => {
      const openMintingsData = await ghostmarketAPI.getOpenMintings({ limit: 1 })
      expect(openMintingsData).toHaveProperty('open_mintings')
      const { open_mintings: openMintings } = openMintingsData
      expect(openMintings).toBeArray()
      expect(openMintings).toBeArrayOfSize(1)
    }, 10000)
  })

  describe('Users', () => {
    it('should get Users', async () => {
      const usersData = await ghostmarketAPI.getUsers()
      expect(usersData).toHaveProperty('users')
      const { users } = usersData
      expect(users).toBeArray()
      expect(users).toBeArrayOfSize(50)
    }, 10000)

    it('should get single User', async () => {
      const usersData = await ghostmarketAPI.getUsers({ limit: 1 })
      expect(usersData).toHaveProperty('users')
      const { users } = usersData
      expect(users).toBeArray()
      expect(users).toBeArrayOfSize(1)
    }, 10000)
  })

  describe('Statistics', () => {
    it('should get Statistics', async () => {
      const statistics = await ghostmarketAPI.getStatistics()
      expect(statistics).toHaveProperty('currency')
      expect(statistics).toHaveProperty('monthly')
      expect(statistics).toHaveProperty('weekly')
    }, 6000)
  })

  describe('Token Metadata', () => {
    it('should get Metadata for a token', async () => {
      const tokenQueryData = {
        token_id: '825243442',
        contract: '0x76a8f8a7a901b29a33013b469949f4b08db15756',
        chain: 'n3',
      }
      const tokenMetadata = await ghostmarketAPI.getMetadata(tokenQueryData)
      expect(tokenMetadata).toBeObject()
      expect(tokenMetadata).toHaveProperty('name')
      expect(tokenMetadata).toHaveProperty('description')
    })
  })

  describe('Token URI', () => {
    it('Should get Token URI for a token', async () => {
      const tokenQueryData = {
        token_id: '37945',
        contract: '0x2d956093d27621ec0c4628b77eaeac6c734da02c',
        chain: 'bsc',
      }
      const tokenURIData = await ghostmarketAPI.getTokenURI(tokenQueryData)
      expect(tokenURIData).toHaveProperty('token_uri')
      expect(tokenURIData.token_uri).toBeString()
    })

    it('Should return an object with "error" property for token with no tokenURI', async () => {
      const tokenQueryData = {
        token_id: '3618701890081213769',
        contract: '0xaa4fb927b3fe004e689a278d188689c9f050a8b2',
        chain: 'n3',
      }
      const tokenURIData = await ghostmarketAPI.getTokenURI(tokenQueryData)
      expect(tokenURIData).toHaveProperty('error')
      expect(tokenURIData.error).toBe('NFT with token id 3618701890081213769 has no URI.')
    })
  })
})
