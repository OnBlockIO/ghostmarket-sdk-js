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
  CollectionsQuery,
  EventsQuery,
  GhostMarketAPIConfig,
  Network,
  OpenMintingsQuery,
  OrderQuery,
  SeriesQuery,
  StatisticsQuery,
  TokenMetadata,
  UsersQuery,
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
  ): Promise<Record<string, unknown>> {
    console.info('Inside getAssets!')

    const result = await this.get(`${API_PATH}/assets/`, {
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

    const json = result as Record<string, unknown>
    return json
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
  ): Promise<Record<string, unknown>> {
    console.info('Inside getCollections!')
    const result = await this.get(`${API_PATH}/collections/`, {
      limit: limit,
      offset: offset,
      order_by: order_by,
      order_direction: order_direction,
      with_total: with_total,
      ...query,
    })

    const json = result as Record<string, unknown>
    return json
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
  ): Promise<Record<string, unknown>> {
    console.info('Inside getEvents!')
    const result = await this.get(`${API_PATH}/events/`, {
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

    const json = result as Record<string, unknown>
    return json
  }

  /** Get NFT Metadata, throwing if none is found.
   * @param query Query to use for getting NFT metadata.
   */
  public async getMetadata(query: TokenMetadata = {}): Promise<Record<string, unknown>> {
    console.info('Inside getMetadata!')
    const result = await this.get(`${API_PATH}/metadata/`, {
      ...query,
    })

    const json = result as Record<string, unknown>
    return json
  }

  /** Get Open Mintings availabe on the GhostMarket marketplace, throwing if none is found.
   * @param query Query to use for getting NFT metadata.
   */
  public async getOpenMintings(query: OpenMintingsQuery = {}): Promise<Record<string, unknown>> {
    console.info('Inside getOpenMintings!')
    const result = await this.get(`${API_PATH}/getopenmintings/`, {
      ...query,
    })

    const json = result as Record<string, unknown>
    return json
  }

  /** Get Open Orders on the GhostMarket marketplace, throwing if none is found.
   * @param query Query to use for getting NFT metadata.
   */
  public async getOpenOrders(query: OrderQuery = {}): Promise<Record<string, unknown>> {
    console.info('Inside getOpenOrders!')
    const _query = { ...query, with_deleted: Number(query.with_deleted) }
    const result = await this.get(`${API_PATH}/getopenorders/`, {
      ..._query,
    })

    const json = result as Record<string, unknown>
    return json
  }

  /** Get order from the orderbook, throwing if none is found.
   * @param query Query to use for getting orders. A subset of parameters
   *  on the `OrderJSON` type is supported
   */
  public async getOrder(query: OrderQuery = {}, page = 1): Promise<Record<string, unknown>> {
    console.info('Inside getOrders!')
    const _query = { ...query, with_deleted: Number(query.with_deleted) }

    const result = await this.get(`${API_PATH}/openorders/`, {
      limit: this.pageSize,
      offset: (page - 1) * this.pageSize,
      ..._query,
    })

    const json = result as Record<string, unknown>
    return json
  }

  /** Get orders from the orderbook, throwing if none is found.
   * @param query Query to use for getting orders. A subset of parameters
   *  on the `OrderJSON` type is supported
   */
  public async getOrders(query: OrderQuery = {}, page = 1): Promise<Record<string, unknown>> {
    console.info('Inside getOrders!')
    const _query = { ...query, with_deleted: Number(query.with_deleted) }
    const result = await this.get(`${API_PATH}/openorders/`, {
      limit: this.pageSize,
      offset: (page - 1) * this.pageSize,
      ..._query,
    })

    const json = result as Record<string, unknown>
    return json
  }

  /** Refresh Token Metadata on GhostMarket marketplace, throwing if none is found.
   * @param query Query to use for refreshing the metadata of a specific token.
   */
  public async getRefreshMetadata(query: TokenMetadata = {}): Promise<Record<string, unknown>> {
    console.info('Inside getRefreshMetadata!')
    const result = await this.get(`${API_PATH}/refreshmetadata/`, {
      ...query,
    })

    const json = result as Record<string, unknown>
    return json
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
  ): Promise<Record<string, unknown>> {
    console.info('Inside getSeries!')
    const result = await this.get(`${API_PATH}/series/`, {
      limit: limit,
      offset: offset,
      order_by: order_by,
      order_direction: order_direction,
      ...query,
    })

    const json = result as Record<string, unknown>
    return json
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
  ): Promise<Record<string, unknown>> {
    console.info('Inside getStatistics!')
    const result = await this.get(`${API_PATH}/marketPlaceStatistics/`, {
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

    const json = result as Record<string, unknown>
    return json
  }

  /** Get NFT Token URI, throwing if none is found.
   * @param query Query to use for getting Token URI.
   */
  public async getTokenURI(query: TokenMetadata = {}): Promise<Record<string, unknown>> {
    console.info('Inside getTokenURI!')
    const result = await this.get(`${API_PATH}/tokenuri/`, {
      ...query,
    })

    const json = result as Record<string, unknown>
    return json
  }

  /** Check if user exists on GhostMarket, returns True or False.
   * @param username Check if this username already exists on GhostMarket.
   */
  public async getUserExists(username: string): Promise<Record<string, unknown>> {
    console.info('Inside getCheckUserExists!')
    const result = await this.get(`${API_PATH}/userexists/`, {
      username: username,
    })

    const json = result as Record<string, unknown>
    return json
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
  ): Promise<Record<string, unknown>> {
    console.info('Inside getUsers!')
    const result = await this.get(`${API_PATH}/users/`, {
      limit: limit,
      offset: offset,
      order_by: order_by,
      order_direction: order_direction,
      with_sales_statistics: with_sales_statistics,
      with_total: with_total,
      ...query,
    })

    const json = result as Record<string, unknown>
    return json
  }

  /**
   * Get JSON data from API, sending auth token in headers
   * @param apiPath Path to URL endpoint under API
   * @param query Data to send. Will be stringified using QueryString
   */
  public async get<T>(apiPath: string, query: object = {}): Promise<T> {
    const qs = QueryString.stringify(query)
    const url = `${apiPath}?${qs}`

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
      console.error(`GhostMarketAPI: Failed to fetch from ${finalUrl}`)
    }
  }

  private async _handleApiResponse(response: Response) {
    if (response.ok) {
      this.logger(`Got success: ${response.status}`)
      return await response.json()
    }

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
