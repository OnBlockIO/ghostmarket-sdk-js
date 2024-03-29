import axios from 'axios'
import {
    API_BASE_MAINNET,
    API_BASE_TESTNET,
    API_PATH,
    ORDERBOOK_VERSION,
} from '../../core/constants'
import { NULL_ADDRESS_EVM } from '../../core/constants/evm'
import * as matchers from 'jest-extended'
import {
    GetAssetsRequest,
    GetCollectionsRequest,
    GetEventsRequest,
    GetMarketplaceStatisticsRequest,
    GetOpenMintingsRequest,
    GetOpenOrdersRequest,
    GetSeriesRequest,
    GetUsersRequest,
    GhostMarketApi,
    IGhostMarketApiOptions,
} from '../../lib/api/'
import { AssetsRequest, EventsRequest, CollectionsRequest } from '../../lib/api/requestsV2'
expect.extend(matchers)

describe(`GhostMarket API Basics V${ORDERBOOK_VERSION}`, () => {
    const url = API_BASE_TESTNET + API_PATH
    const ghostMarketAPIConfig: IGhostMarketApiOptions = {
        apiKey: process.env.GM_API_KEY,
        baseUrl: url,
    }

    let ghostmarketAPI: GhostMarketApi
    beforeAll(() => {
        ghostmarketAPI = new GhostMarketApi(ghostMarketAPIConfig)
    })

    describe('Misc', () => {
        it('API endpoints have correct base URL', async () => {
            expect(API_BASE_MAINNET).toBe('https://api.ghostmarket.io')
            expect(API_BASE_TESTNET).toBe('https://api-testnet.ghostmarket.io')
        }, 10000)

        it('API only support version 1 and 2', async () => {
            try {
                // wrong orderbook version passed
                const incorrectVersion = `${API_BASE_TESTNET}/api/v${ORDERBOOK_VERSION + 2}`
                await axios.get(incorrectVersion)
            } catch (err: any) {
                expect(err.response.status).toBe(404)
            }
        }, 10000)

        it('API handles errors', async () => {
            try {
                // contract passed but no chain
                const assetsQuery = {
                    contract: NULL_ADDRESS_EVM,
                }
                ORDERBOOK_VERSION > 1
                    ? ghostmarketAPI.getAssetsV2(new AssetsRequest(assetsQuery))
                    : ghostmarketAPI.getAssetsV1(new GetAssetsRequest(assetsQuery))
            } catch (error) {
                expect(error).toInclude('Pass chain when using contract filter.')
            }
        }, 10000)
    })
})

describe(`GhostMarket API Get V${ORDERBOOK_VERSION}`, () => {
    const url = API_BASE_TESTNET + API_PATH
    const ghostMarketAPIConfig: IGhostMarketApiOptions = {
        apiKey: process.env.GM_API_KEY,
        baseUrl: url,
    }

    let ghostmarketAPI: GhostMarketApi
    beforeAll(() => {
        ghostmarketAPI = new GhostMarketApi(ghostMarketAPIConfig)
    })

    describe('Assets', () => {
        it('should get Assets', async () => {
            const assetsData =
                ORDERBOOK_VERSION > 1
                    ? await ghostmarketAPI.getAssetsV2(new AssetsRequest())
                    : await ghostmarketAPI.getAssetsV1(new GetAssetsRequest())
            expect(assetsData).toHaveProperty('assets')
            const { assets } = assetsData
            expect(assets).toBeArray()
            expect(assets).toBeArrayOfSize(25)
        }, 10000)

        it('should get single Asset', async () => {
            const assetsData =
                ORDERBOOK_VERSION > 1
                    ? await ghostmarketAPI.getAssetsV2(new AssetsRequest({ size: 1 }))
                    : await ghostmarketAPI.getAssetsV1(new GetAssetsRequest({ limit: 1 }))
            expect(assetsData).toHaveProperty('assets')
            const { assets } = assetsData
            expect(assets).toBeArray()
            expect(assets).toBeArrayOfSize(1)
        }, 10000)
    })

    describe('Collections', () => {
        it('should get Collections', async () => {
            const collectionsData =
                ORDERBOOK_VERSION > 1
                    ? await ghostmarketAPI.getCollectionsV2(new CollectionsRequest())
                    : await ghostmarketAPI.getCollectionsV1(new GetCollectionsRequest())
            expect(collectionsData).toHaveProperty('collections')
            const { collections } = collectionsData
            expect(collections).toBeArray()
            expect(collections).toBeArrayOfSize(10)
        }, 10000)

        it('should get single Collection', async () => {
            const collectionsData =
                ORDERBOOK_VERSION > 1
                    ? await ghostmarketAPI.getCollectionsV2(new CollectionsRequest({ size: 1 }))
                    : await ghostmarketAPI.getCollectionsV1(new GetCollectionsRequest({ limit: 1 }))
            expect(collectionsData).toHaveProperty('collections')
            const { collections } = collectionsData
            expect(collections).toBeArray()
            expect(collections).toBeArrayOfSize(1)
        }, 10000)
    })

    describe('Events', () => {
        it('should get Events', async () => {
            const eventsData =
                ORDERBOOK_VERSION > 1
                    ? await ghostmarketAPI.getEventsV2(new EventsRequest())
                    : await ghostmarketAPI.getEventsV1(new GetEventsRequest())
            expect(eventsData).toHaveProperty('events')
            const { events } = eventsData
            expect(events).toBeArray()
            expect(events).toBeArrayOfSize(25)
        }, 10000)

        it('should get single Event', async () => {
            const eventsData =
                ORDERBOOK_VERSION > 1
                    ? await ghostmarketAPI.getEventsV2(new EventsRequest({ size: 1 }))
                    : await ghostmarketAPI.getEventsV1(new GetEventsRequest({ limit: 1 }))
            expect(eventsData).toHaveProperty('events')
            const { events } = eventsData
            expect(events).toBeArray()
            expect(events).toBeArrayOfSize(1)
        }, 10000)
    })

    describe('Series', () => {
        it('should get Series', async () => {
            const serriesData = await ghostmarketAPI.getSeries(new GetSeriesRequest())
            expect(serriesData).toHaveProperty('series')
            const { series } = serriesData
            expect(series).toBeArray()
            expect(series).toBeArrayOfSize(25)
        }, 10000)

        it('should get single Serie', async () => {
            const serriesData = await ghostmarketAPI.getSeries(new GetSeriesRequest({ limit: 1 }))
            expect(serriesData).toHaveProperty('series')
            const { series } = serriesData
            expect(series).toBeArray()
            expect(series).toBeArrayOfSize(1)
        }, 10000)
    })

    describe('Open Orders', () => {
        it('should get Open Orders ', async () => {
            const openOrdersData = await ghostmarketAPI.getOpenOrders(new GetOpenOrdersRequest())
            expect(openOrdersData).toHaveProperty('open_orders')
            const { open_orders: openOrders } = openOrdersData
            expect(openOrders).toBeArray()
            expect(openOrders).toBeArrayOfSize(50)
        }, 10000)

        it('should get single Open Order', async () => {
            const { open_orders: orders } = await ghostmarketAPI.getOpenOrders(
                new GetOpenOrdersRequest({ limit: 1 }),
            )
            expect(orders).toBeArray()
            expect(orders).toBeArrayOfSize(1)
        }, 10000)
    })

    describe('Open Mintings', () => {
        it('should get Open Mintings', async () => {
            const openMintingsData = await ghostmarketAPI.getOpenMintings(
                new GetOpenMintingsRequest(),
            )
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
            const usersData = await ghostmarketAPI.getUsers(new GetUsersRequest())
            expect(usersData).toHaveProperty('users')
            const { users } = usersData
            expect(users).toBeArray()
            expect(users).toBeArrayOfSize(25)
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
            const statistics = await ghostmarketAPI.getMarketplaceStatistic(
                new GetMarketplaceStatisticsRequest(),
            )
            expect(statistics).toHaveProperty('currency')
            expect(statistics).toHaveProperty('monthly')
            expect(statistics).toHaveProperty('weekly')
        }, 6000)
    })

    describe('Token Metadata', () => {
        it('should get Metadata for a token', async () => {
            const tokenQueryData = {
                token_id: 'MjcwMQ==',
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

        it('Should return an error for token with no tokenURI', async () => {
            try {
                // non existent token id passed
                const tokenQueryData = {
                    token_id: 'SU1TQjI2ODI=',
                    contract: '0xaa4fb927b3fe004e689a278d188689c9f050a8b2',
                    chain: 'n3',
                }
                await ghostmarketAPI.getTokenURI(tokenQueryData)
            } catch (error: any) {
                expect(error.toString()).toInclude('NFT with token id SU1TQjI2ODI= has no URI.')
            }
        })
    })
})
