import { GhostMarketAPI } from './api'
import { Network } from './types'
import * as matchers from 'jest-extended'
expect.extend(matchers)

describe('GhostMarketAPI', () => {
  const apiBaseUrl = 'https://api3.ghostmarket.io:7061'
  const ghostMarketAPIConfig = {
    networkName: Network.Rinkeby,
    apiKey: '',
    apiBaseUrl,
    useReadOnlyProvider: true,
  }

  let ghostmarketAPI: GhostMarketAPI
  beforeAll(() => {
    ghostmarketAPI = new GhostMarketAPI(ghostMarketAPIConfig)
  })

  describe('Assets', () => {
    it('should getAssets', async () => {
      const assetsQuery = {
        order_by: 'mint_date',
        order_direction: 'asc',
        offset: 0,
        limit: 10, // total number of assets to fetch
        with_total: 10,
        fiat_currency: 'USD',
        auction_state: 'all',
        auction_started: 'all', // auction can have any start date: https://api3.ghostmarket.io:7061/swagger/index.html
        auction_type: 'all', // all, classic, fixed, dutch, reserve, offer - or coma-separated list of types (except all and offer
        creator: '',
        maker: '',
        contract: '',
        contract_id: '',
        name: '',
        chain: '',
        symbol: '',
        collection_slug: '',
        issuer: '', // NFT issuer
        token_id: '',
        grouping: 0,
        only_verified: 0,
        status: 'active', // all, active, infused,
        nfsw_mode: 'all', // all, only_safe, only_unsafe
        blacklisted_mode: 'not_blacklisted', // all, not_blacklisted, only_unsafe
        burned_mode: 'not_burned', // all, not_burned, burned
      }

      const assetsData = await ghostmarketAPI.getAssets(assetsQuery)
      expect(assetsData).toHaveProperty('assets')
      const { assets } = assetsData
      expect(assets).toBeArray()
      expect(assets).toBeArrayOfSize(10)
    }, 10000)
  })

  describe('Collections', () => {
    it('should getCollections', async () => {
      const colletcionsQuery = {
        order_by: 'id', // [id, name, nft_count, nft_active_count, nft_infused_count, listed_nft_count, total_volume, monthly_volume, weekly_volume]
        order_direction: 'asc',
        offset: 0,
        limit: 10, // total number of collections to fetch
        with_total: 1,
        owner: '', // an adress of the asset owner
        nft_name: '', // Asset name
        chain: '', // chain name (ex: 'BSC', 'N3')
        quote_symbol: '',
        category: '',
        collection_slug: '',
        issuer: '', // NFT issuer
        series_id: '',
        name: '', // collection name filter(partial match),
      }

      const collectionsData = await ghostmarketAPI.getCollections(colletcionsQuery)
      expect(collectionsData).toHaveProperty('collections')

      const { collections } = collectionsData
      expect(collections).toBeArray()
      expect(collections).toBeArrayOfSize(10)
    })
  })

  describe('Events', () => {
    it('should getEvents', async () => {
      const eventsQuery = {
        order_by: 'data', // [data, token_id, price]
        order_direction: 'asc', // [asc, desc]
        offset: 0,
        limit: 25, // total events to fetch
        chain: '', // Short chain name (ex: 'BSC')
        collection_slug: '',
        issuer: '', // NFT issuer
        contract: '', // Token contract hash
        token_id: '',
        date_day: '', // Date day match
        date_less: '', // Date less than
        date_greater: '', // Date, greater than
        event_kind: '',
        nft_name_partial: '', // Partial NFT name
        nft_description_partial: '', // Partial NFT description
        show_events: 'all', // claim, unprocessed, send/receive/burn, all, not_hidden,not_hidden_and_burn/hidden
        address: '',
        address_partial: '',
        with_metadata: 0, // Return NFT metadata with events, 0,1
        with_serries: 0, // Return NFT series with events
        grouping: 1, // Enable grouping of similar events, 0,1
        only_verified: 0, // Show only verified users
        nsfw_mode: 'all', // NSFW show state(all, only_safe, only_unsafe)
        blaclisted_mode: 'all', // (all, not_blacklisted, blacklisted)
        burned_mode: 'all', // all, not_burned, burned
        with_total: 0, // return with a 'total' field,
        fiat_currency: 'USD', // Fiat currency to calculate Fiat Price
      }
      const eventsData = await ghostmarketAPI.getEvents(eventsQuery)
      expect(eventsData).toHaveProperty('events')

      const { events } = eventsData
      expect(events).toBeArray()
      expect(events).toBeArrayOfSize(25)
    })

    it('should return an object with "error" property calling getEvents with wrong query parameters', async () => {
      const eventsQuery = {
        order_by: 'data', // [data, token_id, price]
        order_direction: 'asc', // [asc, desc]
        offset: 0,
        limit: 25, // total events to fetch
        chain: '', // Short chain name (ex: 'BSC')
        collection_slug: '',
        issuer: '', // NFT issuer
        contract: '', // Token contract hash
        token_id: '',
        date_day: '', // Date day match
        date_less: '', // Date less than
        date_greater: '', // Date, greater than
        event_kind: '',
        nft_name_partial: '', // Partial NFT name
        nft_description_partial: '', // Partial NFT description
        show_events: '', // claim, unprocessed, send/receive/burn, all, not_hidden,not_hidden_and_burn/hidden
        address: '',
        address_partial: '',
        with_metadata: 0, // Return NFT metadata with events, 0,1
        with_serries: 0, // Return NFT series with events
        grouping: 1, // Enable grouping of similar events, 0,1
        only_verified: 0, // Show only verified users
        nsfw_mode: 'all', // NSFW show state(all, only_safe, only_unsafe)
        blaclisted_mode: 'all', // (all, not_blacklisted, blacklisted)
        burned_mode: 'all', // all, not_burned, burned
        with_total: 0, // return with a 'total' field,
        fiat_currency: 'USD', // Fiat currency to calculate Fiat Price
      }
      const eventsData = await ghostmarketAPI.getEvents(eventsQuery)
      expect(eventsData).toHaveProperty('error')
      expect(eventsData.error).toBe("Unsupported value for 'show_events' parameter.")
    })
  })

  describe('Token Metadata', () => {
    it('should getMetadata for a token', async () => {
      const tokenQueryData = {
        token_id: '825243442',
        contract: '0x76a8f8a7a901b29a33013b469949f4b08db15756',
        chain: 'N3', // short chain name (ex: 'BSC', 'N3')
      }

      const tokenMetadata = await ghostmarketAPI.getMetadata(tokenQueryData)

      expect(tokenMetadata).toBeObject()
      expect(tokenMetadata).toHaveProperty('name')
      expect(tokenMetadata).toHaveProperty('description')
    })

    it('should getToken refresh metadata', async () => {
      const tokenQueryData = {
        token_id: '825243442',
        contract: '0x76a8f8a7a901b29a33013b469949f4b08db15756',
        chain: 'N3', // short chain name (ex: 'BSC', 'N3')
      }

      const tokenRefreshMetadata = await ghostmarketAPI.getRefreshMetadata(tokenQueryData)

      expect(tokenRefreshMetadata).toBeObject()
    }, 10000)

    it('Should get Token URI', async () => {
      const tokenQueryData = {
        token_id: '37945',
        contract: '0x2d956093d27621ec0c4628b77eaeac6c734da02c',
        chain: 'BSC', // Chain short name,e.g 'N3', 'BSC'
      }

      const tokenUriData = await ghostmarketAPI.getTokenURI(tokenQueryData)

      expect(tokenUriData).toHaveProperty('token_uri')
      expect(tokenUriData.token_uri).toBeString()
    })

    it('Should return an object with "error" property for token with no tokenURI', async () => {
      const tokenQueryData = {
        token_id: '3618701890081213769',
        contract: '0xaa4fb927b3fe004e689a278d188689c9f050a8b2',
        chain: 'N3',
      }

      const tokenUriData = await ghostmarketAPI.getTokenURI(tokenQueryData)

      expect(tokenUriData).toHaveProperty('error')
      expect(tokenUriData.error).toBe('NFT with token id 3618701890081213769 has no URI.')
    })
  })

  describe('Mintings', () => {
    it('should getOpenMintings', async () => {
      const mockOpenMintingsQuery = { offset: 0, limit: 5 }

      const openMintingsData = await ghostmarketAPI.getOpenMintings(mockOpenMintingsQuery)

      expect(openMintingsData).toHaveProperty('open_mintings')
      const { open_mintings: openMintings } = openMintingsData
      expect(openMintings).toBeArray()
      expect(openMintings).toBeArrayOfSize(5)
    }, 10000)
  })

  describe('Orders', () => {
    it('should return get open Orders in the order book', async () => {
      const openOrdersData = await ghostmarketAPI.getOpenOrders({ limit: 15, with_deleted: false })

      expect(openOrdersData).toHaveProperty('open_orders')

      const { open_orders: openOrders } = openOrdersData
      expect(openOrders).toBeArray()
      expect(openOrders).toBeArrayOfSize(15)
    }, 6000)

    it('should return null when no open Orders in are in the order book for a provided query', async () => {
      const openOrdersQuery = {
        chain: 'N3',
        contract: '0x76a8f8a7a901b29a33013b469949f4b08db15756',
        token_id: '825243442',
        offset: 0,
        limit: 4,
        with_deleted: true,
      }

      // this returns null if no open orders exist for the given query
      const openOrdersData = await ghostmarketAPI.getOpenOrders(openOrdersQuery)

      expect(openOrdersData).toHaveProperty('open_orders')
      const { open_orders: openOrders } = openOrdersData
      expect(openOrders).toBeNull()
    }, 6000)

    it('should get Orders in the order book', async () => {
      const ordersQuery = {
        chain: 'N3',
        contract: '0x76a8f8a7a901b29a33013b469949f4b08db15756',
        token_id: '825243442',
        offset: 0,
        limit: 4,
        with_deleted: true,
      }

      const { open_orders: orders } = await ghostmarketAPI.getOrders(ordersQuery)
      expect(orders).toBeArray()
      expect(orders).toBeArrayOfSize(4)
    })

    it('should an get order in the order book', async () => {
      const openOrdersQuery = {
        chain: 'N3',
        contract: '0x76a8f8a7a901b29a33013b469949f4b08db15756',
        token_id: '825243442',
        offset: 0,
        limit: 4,
        with_deleted: true,
      }

      const orderData = await ghostmarketAPI.getOrder(openOrdersQuery)

      expect(orderData).toHaveProperty('open_orders')

      const { open_orders: orders } = orderData
      expect(orders).toBeArray()
      expect(orders).toBeArrayOfSize(4)
    }, 10000)
  })

  describe('Series', () => {
    it('should getSeries', async () => {
      const serriesData = await ghostmarketAPI.getSeries({ limit: 15 })

      expect(serriesData).toHaveProperty('series')
      const { series } = serriesData
      expect(series).toBeArray()
      expect(series).toBeArrayOfSize(15)
    }, 10000)
  })

  describe('Statistics', () => {
    it('should get statistics', async () => {
      const statistics = await ghostmarketAPI.getStatistics()

      expect(statistics).toHaveProperty('currency')
      expect(statistics).toHaveProperty('monthly')
      expect(statistics).toHaveProperty('weekly')
    }, 6000)
  })

  describe('Users', () => {
    it('should get Users', async () => {
      const usersData = await ghostmarketAPI.getUsers({ limit: 20 })

      expect(usersData).toHaveProperty('users')

      const { users } = usersData

      expect(users).toBeArray()
      expect(users).toBeArrayOfSize(20)
    }, 6000)

    it('should return false is user of provided username does not exist', async () => {
      const dummyUsername = '0xnaftali'
      const { success } = await ghostmarketAPI.getUserExists(dummyUsername)
      expect(success).toBe(false)
    }, 6000)

    it('should return true if user of provided username exists', async () => {
      const username = 'wakeupneo'
      const { success } = await ghostmarketAPI.getUserExists(username)
      expect(success).toBe(true)
    }, 6000)
  })
})
