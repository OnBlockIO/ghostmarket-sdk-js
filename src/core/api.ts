import 'isomorphic-unfetch'
import pjson from '../../package.json'
import * as QueryString from 'query-string'
import {
  API_BASE_MAINNET,
  API_BASE_TESTNET,
  API_PATH,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ORDERBOOK_VERSION,
  SITE_HOST_MAINNET,
  SITE_HOST_TESTNET,
} from './constants'
import {
  GhostMarketAPIConfig,
  Network,
  AssetsQuery,
  Assets,
  AssetsQueryV2,
  AssetsV2,
  CollectionsQuery,
  Collections,
  EventsQuery,
  Events,
  SeriesQuery,
  SeriesResponse as Series,
  OpenMintingsQuery,
  OpenMintings,
  OpenOrders,
  OrderQuery,
  StatisticsQuery,
  TokenMetadata,
  TokenRefreshMetadata,
  TokenURI,
  UsersQuery,
  Users,
  UserExists,
  ListNFT,
  ListNFTResult,
  MarketplaceStatistics,
} from '../types/types'

export class GhostMarketAPI {
  /**
   * Host url for GhostMarket
   */
  public readonly hostUrl: string

  /**
   * Base url for the API
   */
  public readonly apiBaseUrl: string

  /**
   * Logger function to use when debugging
   */
  public logger: (arg: string) => void

  /**
   * Page size to use for fetching orders
   */
  public pageSize = 25

  private apiKey: string | undefined

  /**
   * Create an instance of GhostMarket API
   * @param config GhostMarketAPIConfig for setting up the API, including an optional API key, network name, and base URL
   * @param logger Optional function for logging debug strings before and after requests are made
   */
  constructor(config: GhostMarketAPIConfig, logger?: (arg: string) => void) {
    this.apiKey = config.apiKey

    switch (config.networkName) {
      case Network.Avalanche:
        this.apiBaseUrl = config.apiBaseUrl || API_BASE_MAINNET
        this.hostUrl = SITE_HOST_MAINNET
        break
      case Network.AvalancheTestnet:
        this.apiBaseUrl = config.apiBaseUrl || API_BASE_TESTNET
        this.hostUrl = SITE_HOST_TESTNET
        break
      case Network.BSC:
        this.apiBaseUrl = config.apiBaseUrl || API_BASE_MAINNET
        this.hostUrl = SITE_HOST_MAINNET
        break
      case Network.BSCTestnet:
        this.apiBaseUrl = config.apiBaseUrl || API_BASE_TESTNET
        this.hostUrl = SITE_HOST_TESTNET
        break
      case Network.Ethereum:
      default:
        this.apiBaseUrl = config.apiBaseUrl || API_BASE_MAINNET
        this.hostUrl = SITE_HOST_MAINNET
        break
      case Network.EthereumTestnet:
        this.apiBaseUrl = config.apiBaseUrl || API_BASE_TESTNET
        this.hostUrl = SITE_HOST_TESTNET
        break
      case Network.Polygon:
        this.apiBaseUrl = config.apiBaseUrl || API_BASE_MAINNET
        this.hostUrl = SITE_HOST_MAINNET
        break
      case Network.PolygonTestnet:
        this.apiBaseUrl = config.apiBaseUrl || API_BASE_TESTNET
        this.hostUrl = SITE_HOST_TESTNET
        break
      case Network.Neo3:
        this.apiBaseUrl = config.apiBaseUrl || API_BASE_MAINNET
        this.hostUrl = SITE_HOST_MAINNET
        break
      case Network.Neo3Testnet:
        this.apiBaseUrl = config.apiBaseUrl || API_BASE_TESTNET
        this.hostUrl = SITE_HOST_TESTNET
        break
      case Network.Phantasma:
        this.apiBaseUrl = config.apiBaseUrl || API_BASE_MAINNET
        this.hostUrl = SITE_HOST_MAINNET
        break
      case Network.PhantasmaTestnet:
        this.apiBaseUrl = config.apiBaseUrl || API_BASE_TESTNET
        this.hostUrl = SITE_HOST_TESTNET
        break
    }

    // Debugging: default to nothing
    this.logger = logger || ((arg: string) => arg)
  }

  // -- ASSETS -- //

  /** Get NFT assets available on GhostMarket.
   * @deprecated The method should not be used
   * @param query Query to use for getting assets.
   */
  public async getAssets(
    query: AssetsQuery = {},
    offset = 0,
    order_by = 'list_or_bid_time',
    order_direction = 'desc',
    with_total = 0,
    limit = 25,
    fiat_currency = 'USD',
    auction_state = 'all',
    auction_started = 'all',
    light_mode = 0,
  ): Promise<Assets> {
    const assetsData = await this._get(`${API_PATH}/assets/`, {
      limit: limit,
      offset: offset,
      order_by: order_by,
      order_direction: order_direction,
      with_total: with_total,
      fiat_currency: fiat_currency,
      auction_state: auction_state,
      auction_started: auction_started,
      light_mode: light_mode,
      ...query,
    })

    return assetsData as Assets
  }

  /** Get NFT assets available on GhostMarket.
   * @param query Query to use for getting assets.
   */
  public async getAssetsV2(
    query: AssetsQueryV2 = {},
    page = 1,
    size = 25,
    orderBy = 'listOrBidTime',
    orderDirection = 'desc',
    withTotal = false,
    fiatCurrency = 'USD',
  ): Promise<AssetsV2> {
    const assetsData = await this._get(`${API_PATH}/assets/`, {
      page: page,
      size: size,
      orderBy: orderBy,
      orderDirection: orderDirection,
      withTotal: withTotal,
      fiatCurrency: fiatCurrency,
      ...query,
    })

    return assetsData as Assets
  }

  // -- END ASSETS -- //

  // -- COLLECTIONS -- //

  /** Get NFT collections available on GhostMarket.
   * @param query Query to use for getting collections.
   */
  public async getCollections(
    query: CollectionsQuery = {},
    offset = 0,
    order_by = 'weekly_volume',
    order_direction = 'desc',
    with_total = 1,
    limit = 25,
  ): Promise<Collections> {
    const collectionsData = await this._get(`${API_PATH}/collections/`, {
      limit: limit,
      offset: offset,
      order_by: order_by,
      order_direction: order_direction,
      with_total: with_total,
      ...query,
    })

    return collectionsData as Collections
  }

  // -- END COLLECTIONS -- //

  // -- EVENTS -- //

  /** Get NFT events available on GhostMarket.
   * @param query Query to use for getting events.
   */
  public async getEvents(
    query: EventsQuery = {},
    offset = 0,
    order_by = 'id',
    order_direction = 'asc',
    limit = 50,
    show_events = 'not_hidden',
    fiat_currency = 'USD',
    grouping = 0,
    with_metadata = 0,
    with_series = 0,
    with_total = 0,
  ): Promise<Events> {
    const eventsData = await this._get(`${API_PATH}/events/`, {
      limit: limit,
      offset: offset,
      order_by: order_by,
      order_direction: order_direction,
      show_events: show_events,
      fiat_currency: fiat_currency,
      grouping: grouping,
      with_metadata: with_metadata,
      with_series: with_series,
      with_total: with_total,
      ...query,
    })

    return eventsData as Events
  }

  // -- END EVENTS -- //

  // -- SERIES -- //

  /** Get NFT series available on GhostMarket.
   * @param query Query to use for getting users.
   */
  public async getSeries(
    query: SeriesQuery = {},
    offset = 0,
    order_by = 'id',
    order_direction = 'asc',
    limit = 50,
  ): Promise<Series> {
    const seriesData = await this._get(`${API_PATH}/series/`, {
      limit: limit,
      offset: offset,
      order_by: order_by,
      order_direction: order_direction,
      ...query,
    })

    return seriesData as Series
  }

  // -- END SERIES -- //

  // -- USERS -- //

  /** Get users from GhostMarket userbase API.
   * @param query Query to use for getting users.
   */
  public async getUsers(
    query: UsersQuery = {},
    offset = 0,
    order_by = 'join_order',
    order_direction = 'asc',
    with_sales_statistics = 0,
    with_total = 0,
    limit = 50,
  ): Promise<Users> {
    const usersData = await this._get(`${API_PATH}/users/`, {
      limit: limit,
      offset: offset,
      order_by: order_by,
      order_direction: order_direction,
      with_sales_statistics: with_sales_statistics,
      with_total: with_total,
      ...query,
    })

    return usersData as Users
  }

  /** Check if user exists on GhostMarket.
   * @param username Check if this username already exists on GhostMarket.
   */
  public async getUserExists(username: string): Promise<UserExists> {
    const userExistsResult = await this._get(`${API_PATH}/userexists/`, {
      username: username,
    })

    return userExistsResult as UserExists
  }

  // -- END USERS -- //

  // -- OPEN MINTINGS -- //

  /** Get Open Mintings available on GhostMarket.
   * @param query Query to use for getting Open Mintings.
   */
  public async getOpenMintings(query: OpenMintingsQuery = {}): Promise<OpenMintings> {
    const openMintingsData = await this._get(`${API_PATH}/getopenmintings/`, {
      ...query,
    })
    return openMintingsData as OpenMintings
  }

  // -- END OPEN MINTINGS -- //

  // -- OPEN ORDERS -- //

  /** Get orders from the orderbook.
   * @param query Query to use for getting orders. A subset of parameters
   *  on the `Order` type is supported
   */
  public async getOpenOrders(query: OrderQuery = {}, page = 1): Promise<OpenOrders> {
    const _query = { ...query, with_deleted: Number(query.with_deleted) }

    const ordersData = await this._get(`${API_PATH}/openorders/`, {
      limit: this.pageSize,
      offset: (page - 1) * this.pageSize,
      ..._query,
    })

    return ordersData as OpenOrders
  }

  /**
   * createOpenOrder list an NFT on GhostMarket
   * @param  {NFTListing} nftListing NFT details
   */
  public async createOpenOrder(nftListing: ListNFT) {
    const result = await this._post<ListNFT>(`${API_PATH}/createopenorder`, nftListing)
    return result as ListNFTResult
  }

  // -- END OPEN ORDERS -- //

  // -- STATISTICS -- //

  /** Get statistics about GhostMarket.
   * @param query Query to use for getting statistics.
   */
  public async getStatistics(
    query: StatisticsQuery = {},
    offset = 0,
    order_by = 'id',
    order_direction = 'asc',
    limit = 50,
    currency = 'USD',
    with_collections_daily_stats = 1,
    with_collections_weekly_stats = 1,
    with_collections_monthly_stats = 1,
    with_collections_total_stats = 1,
    with_chains_daily_stats = 1,
    with_chains_weekly_stats = 1,
    with_chains_monthly_stats = 1,
    with_chains_total_stats = 1,
    with_marketplace_daily_stats = 1,
    with_marketplace_weekly_stats = 1,
    with_marketplace_monthly_stats = 1,
    with_marketplace_total_stats = 1,
  ): Promise<MarketplaceStatistics> {
    const statisticsData = await this._get(`${API_PATH}/marketPlaceStatistics/`, {
      limit: limit,
      offset: offset,
      order_by: order_by,
      order_direction: order_direction,
      currency: currency,
      with_collections_daily_stats: with_collections_daily_stats,
      with_collections_weekly_stats: with_collections_weekly_stats,
      with_collections_monthly_stats: with_collections_monthly_stats,
      with_collections_total_stats: with_collections_total_stats,
      with_chains_daily_stats: with_chains_daily_stats,
      with_chains_weekly_stats: with_chains_weekly_stats,
      with_chains_monthly_stats: with_chains_monthly_stats,
      with_chains_total_stats: with_chains_total_stats,
      with_marketplace_daily_stats: with_marketplace_daily_stats,
      with_marketplace_weekly_stats: with_marketplace_weekly_stats,
      with_marketplace_monthly_stats: with_marketplace_monthly_stats,
      with_marketplace_total_stats: with_marketplace_total_stats,
      ...query,
    })

    return statisticsData as MarketplaceStatistics
  }

  // -- END STATISTICS -- //

  // -- METADATA -- //

  /** Get NFT Metadata.
   * @param query Query to use for getting NFT metadata.
   */
  public async getMetadata(query: TokenMetadata = {}): Promise<TokenMetadata> {
    const tokenMetadata = await this._get(`${API_PATH}/metadata/`, {
      ...query,
    })
    return tokenMetadata as TokenMetadata
  }

  /** Refresh Token Metadata on GhostMarket.
   * @param query Query to use for refreshing the metadata of a specific token.
   */
  public async getRefreshMetadata(query: TokenMetadata = {}): Promise<TokenRefreshMetadata> {
    const tokenRefreshMetadata = await this._get(`${API_PATH}/refreshmetadata/`, {
      ...query,
    })

    return tokenRefreshMetadata as TokenRefreshMetadata
  }

  // -- END METADATA -- //

  // -- TOKEN URI -- //

  /** Get NFT Token URI.
   * @param query Query to use for getting Token URI.
   */
  public async getTokenURI(query: TokenMetadata = {}): Promise<TokenURI> {
    const tokenUriData = await this._get(`${API_PATH}/tokenuri/`, {
      ...query,
    })

    return tokenUriData as TokenURI
  }

  // -- END TOKEN URI -- //

  // -- API INTERACTION -- //

  /**
   * POST JSON data to API
   * @param  {string} apiEndpoint Full URL to endpoint under API
   * @param  {T} body Data object to send to API. stringified using `JSON.stringify` method
   */
  private async _post<T>(apiEndpoint: string, body: T) {
    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        // eslint-disable-next-line prettier/prettier
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'nodejs/' + pjson.version,
      },
    }

    const data = await this._fetch(apiEndpoint, options)
    return data
  }

  /**
   * Get JSON data from API, sending auth token in headers
   * @param apiEndpoint Path to URL endpoint under API
   * @param query Data to send. Will be stringified using QueryString
   */
  private async _get<T>(apiEndpoint: string, query: T): Promise<unknown> {
    const qs = QueryString.stringify(query)
    const url = `${apiEndpoint}?${qs}`

    const options = {
      headers: {
        // eslint-disable-next-line prettier/prettier
        'User-Agent': 'nodejs/' + pjson.version,
      },
    }

    const data = await this._fetch(url, options)
    return data
  }

  /**
   * Get from an API Endpoint, sending auth token in headers
   * @param apiPath Path to URL endpoint under API
   * @param opts RequestInit opts, similar to Fetch API
   */
  private async _fetch(apiPath: string, opts: RequestInit = {}) {
    const apiBase = this.apiBaseUrl
    const apiKey = this.apiKey
    const finalUrl = apiBase + apiPath
    const finalOpts = {
      ...opts,
      headers: {
        ...(apiKey ? { 'X-API-KEY': apiKey } : {}),
        ...(opts.headers || {}),
      },
    }

    this.logger(`Sending request: ${finalUrl} ${JSON.stringify(finalOpts).substr(0, 100)}...`)

    try {
      const res = await fetch(finalUrl, finalOpts)
      return await this._handleApiResponse(res)
    } catch (error) {
      console.error(`GhostMarketAPI: Failed to fetch from ${finalUrl}`, error)
    }
  }

  private async _handleApiResponse(response: Response) {
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      return this._handleErrorResponse(response)
    }
  }

  private async _handleErrorResponse(response: Response) {
    let result
    let errorMessage
    try {
      result = await response.text()
      result = JSON.parse(result)
    } catch {
      // Result will be undefined or text
    }

    this.logger(`Got error ${response.status}: ${JSON.stringify(result)}`)

    switch (response.status) {
      case 400:
        errorMessage =
          result && result.errors
            ? result.errors.join(', ')
            : `Invalid request: ${JSON.stringify(result)}`
        break
      case 401:
      case 403:
        errorMessage = `Unauthorized. Full message was '${JSON.stringify(result)}'`
        break
      case 429:
        errorMessage = `Rate limited. Full message was '${JSON.stringify(result)}'`
        break
      case 404:
        errorMessage = `Not found. Full message was '${JSON.stringify(result)}'`
        break
      case 500:
        errorMessage = `Internal server error. GhostMarket has been alerted, but if the problem persists please contact us via Discord: https://discord.gg/WraGYyJTvz - full message was ${JSON.stringify(
          result,
        )}`
        break
      case 503:
        errorMessage = `Service unavailable. Please try again in a few minutes. If the problem persists please contact us via Discord: https://discord.gg/WraGYyJTvz - full message was ${JSON.stringify(
          result,
        )}`
        break
      default:
        errorMessage = `Message: ${JSON.stringify(result)}`
        break
    }

    throw new Error(`API Error ${response.status}: ${errorMessage}`)
  }

  // -- END API INTERACTION -- //
}