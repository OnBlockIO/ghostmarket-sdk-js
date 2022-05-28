import 'isomorphic-unfetch'
import * as QueryString from 'query-string'
import {
  DEFAULT_NETWORK,
  API_BASE_MAINNET,
  API_BASE_RINKEBY,
  API_PATH,
  SITE_HOST_MAINNET,
  SITE_HOST_RINKEBY,
} from './constants'
import {
  AssetsQuery,
  Assets,
  CollectionsQuery,
  Collections,
  EventsQuery,
  Events,
  GhostMarketAPIConfig,
  MarketplaceStatistics,
  Network,
  ListNFT,
  OpenMintingsQuery,
  OpenMintings,
  OpenOrders,
  OrderQuery,
  SeriesQuery,
  SeriesResponse as Series,
  StatisticsQuery,
  TokenMetadata,
  TokenRefreshMetadata,
  TokenURI,
  UserExists,
  UsersQuery,
  Users,
  ListNFTResult,
} from './types'

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
  public pageSize = 20

  private apiKey: string | undefined

  public static DEFAULT_NETWORK = DEFAULT_NETWORK
  // public static TokenClient = TokenClient
  // network: Network;

  // configOverride: Partial<NetworkConfig>;

  // token: TokenClient;

  // neo: NEOClient;
  // eth: ETHClient;
  // bsc: ETHClient;

  constructor(config: GhostMarketAPIConfig, logger?: (arg: string) => void) {
    this.apiKey = config.apiKey

    switch (config.networkName) {
      case Network.Rinkeby:
        this.apiBaseUrl = config.apiBaseUrl || API_BASE_RINKEBY
        this.hostUrl = SITE_HOST_RINKEBY
        break
      case Network.Main:
      default:
        this.apiBaseUrl = config.apiBaseUrl || API_BASE_MAINNET
        this.hostUrl = SITE_HOST_MAINNET
        break
    }

    // Debugging: default to nothing
    this.logger = logger || ((arg: string) => arg)
  }

  /** Get NFT assets available on the GhostMarket marketplace, throwing if none is found.
   * @param query Query to use for getting assets.
   */
  public async getAssets(
    query: AssetsQuery = {},
    offset = 0,
    order_by = 'mint_date',
    order_direction = 'asc',
    with_total = 0,
    limit = 50,
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

  /** Get NFT collection available on the GhostMarket marketplace, throwing if none is found.
   * @param query Query to use for getting users.
   */
  public async getCollections(
    query: CollectionsQuery = {},
    offset = 0,
    order_by = 'mint_date',
    order_direction = 'asc',
    with_total = 1,
    limit = 50,
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

  /** Get NFT serices available on the GhostMarket marketplace, throwing if none is found.
   * @param query Query to use for getting users.
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

  /** Get NFT Metadata, throwing if none is found.
   * @param query Query to use for getting NFT metadata.
   */
  public async getMetadata(query: TokenMetadata = {}): Promise<TokenMetadata> {
    const tokenMetadata = await this._get(`${API_PATH}/metadata/`, {
      ...query,
    })
    return tokenMetadata as TokenMetadata
  }

  /** Get Open Mintings availabe on the GhostMarket marketplace, throwing if none is found.
   * @param query Query to use for getting NFT metadata.
   */
  public async getOpenMintings(query: OpenMintingsQuery = {}): Promise<OpenMintings> {
    const openMintingsData = await this._get(`${API_PATH}/getopenmintings/`, {
      ...query,
    })
    return openMintingsData as OpenMintings
  }

  /** Get Open Orders on the GhostMarket marketplace, throwing if none is found.
   * @param query Query to use for getting NFT metadata.
   */
  public async getOpenOrders(query: OrderQuery = {}): Promise<OpenOrders> {
    const _query = { ...query, with_deleted: Number(query.with_deleted) }
    const openOrdersData = await this._get(`${API_PATH}/getopenorders/`, {
      ..._query,
    })
    return openOrdersData as OpenOrders
  }

  /** Get order from the orderbook, throwing if none is found.
   * @param query Query to use for getting orders. A subset of parameters
   *  on the `Order` type is supported
   */
  public async getOrder(query: OrderQuery = {}, page = 1): Promise<OpenOrders> {
    // with_deleted is (cast to a number 0 or 1) from Boolean True or false
    const _query = { ...query, with_deleted: Number(query.with_deleted) }

    const orderData = await this._get(`${API_PATH}/openorders/`, {
      limit: this.pageSize,
      offset: (page - 1) * this.pageSize,
      ..._query,
    })

    return orderData as OpenOrders
  }

  /** Get orders from the orderbook, throwing if none is found.
   * @param query Query to use for getting orders. A subset of parameters
   *  on the `Order` type is supported
   */
  public async getOrders(query: OrderQuery = {}, page = 1): Promise<OpenOrders> {
    const _query = { ...query, with_deleted: Number(query.with_deleted) }

    const ordersData = await this._get(`${API_PATH}/openorders/`, {
      limit: this.pageSize,
      offset: (page - 1) * this.pageSize,
      ..._query,
    })

    return ordersData as OpenOrders
  }

  /** Refresh Token Metadata on GhostMarket marketplace, throwing if none is found.
   * @param query Query to use for refreshing the metadata of a specific token.
   */
  public async getRefreshMetadata(query: TokenMetadata = {}): Promise<TokenRefreshMetadata> {
    const tokenRefreshMetadata = await this._get(`${API_PATH}/refreshmetadata/`, {
      ...query,
    })

    return tokenRefreshMetadata as TokenRefreshMetadata
  }

  /** Get NFT serices available on the GhostMarket marketplace, throwing if none is found.
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

  /** Get statistics about the GhostMarket marketplace, throwing if none is found.
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

  /** Get NFT Token URI, throwing if none is found.
   * @param query Query to use for getting Token URI.
   */
  public async getTokenURI(query: TokenMetadata = {}): Promise<TokenURI> {
    const tokenUriData = await this._get(`${API_PATH}/tokenuri/`, {
      ...query,
    })

    return tokenUriData as TokenURI
  }

  /** Check if user exists on GhostMarket, returns True or False.
   * @param username Check if this username already exists on GhostMarket.
   */
  public async getUserExists(username: string): Promise<UserExists> {
    const userExistsResult = await this._get(`${API_PATH}/userexists/`, {
      username: username,
    })

    return userExistsResult as UserExists
  }

  /** Get users from the GhostMarket userbase API, throwing if none is found.
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

  /**
   * createOpenOrder List an NFT on the marketplace
   * @param  {NFTListing} nftListing NFT details
   */
  public async createOpenOrder(nftListing: ListNFT) {
    const result = await this._post<ListNFT>(`${API_PATH}/createopenorder`, nftListing)
    return result as ListNFTResult
  }

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

    const data = await this._fetch(url)
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
      case 404:
        errorMessage = `Not found. Full message was '${JSON.stringify(result)}'`
        break
      case 500:
        errorMessage = `Internal server error. Ghost Market has been alerted, but if the problem persists please contact us via Discord: https://discord.gg/ga8EJbv - full message was ${JSON.stringify(
          result,
        )}`
        break
      case 503:
        errorMessage = `Service unavailable. Please try again in a few minutes. If the problem persists please contact us via Discord: https://discord.gg/ga8EJbv - full message was ${JSON.stringify(
          result,
        )}`
        break
      default:
        errorMessage = `Message: ${JSON.stringify(result)}`
        break
    }

    throw new Error(`API Error ${response.status}: ${errorMessage}`)
  }
}
