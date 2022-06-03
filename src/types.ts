import { AbiItem } from 'web3-utils'
/**
 * @param Avalanche Avalanche mainnet
 * @param AvalancheTestnet Avalanche testnet
 * @param BSC BSC mainnet
 * @param BSCTestnet BSC testnet
 * @param Ethereum Ethereum mainnet
 * @param EthereumTestnet Ethereum testnet
 * @param Polygon Polygon mainnet
 * @param PolygonTestnet Polygon testnet
 */
export enum Network {
  Avalanche = 'Avalanche',
  AvalancheTestnet = 'Avalanche Testnet',
  BSC = 'BSC',
  BSCTestnet = 'BSC Testnet',
  Ethereum = 'Ethereum',
  EthereumTestnet = 'Ethereum Goerli Testnet',
  Polygon = 'Polygon',
  PolygonTestnet = 'Polygon Mumbai Testnet',
}

/**
 * GhostMarket API config object.
 * @param apiKey Optional key to use for API.
 * @param networkName `Network` type to use. Defaults to `Network.Ethereum` (Ethereum mainnet)
 * @param gasPrice Default gas price to use.
 * @param apiBaseUrl Optional base URL to use for the API.
 * @param providerRPCUrl HTTP provider URL for use for setting up a read only provider.
 * @param useReadOnlyProvider Boolean option enable/disable use of a read only provider that reads only Blockchain state and can't make transactions.
 */
export interface GhostMarketAPIConfig {
  networkName?: Network
  apiKey?: string
  apiBaseUrl?: string
  providerRPCUrl?: string
  useReadOnlyProvider?: boolean
}

export interface Order {
  id: number
  chain: string
  token_contract: string
  token_id: string
  token_amount: string
  quote_contract: string
  quote_price: string
  maker_address: string
  start_date: string
  end_date: string
  signature: string
  order_key_hash: string
  salt: string
  origin_fees: string
  origin_address: string
}

/**
 * Query interface for finding open mintings
 */
export interface OpenMintingsQuery {
  offset?: number
  limit?: number
}

/**
 * Query interface for orders
 */
export interface OrderQuery {
  chain?: string
  contract?: string
  token_id?: string
  offset?: number
  limit?: number
  with_deleted?: boolean
}

/**
 * Order attributes, including orderbook-specific query options
 */
export interface OrderJSON {
  id: number
  chain: string
  token_contract: string
  token_id: string
  token_amount: string
  quote_contract: string
  quote_price: string
  maker_address: string
  start_date: string
  end_date: string
  signature: string
  order_key_hash: string
  salt: string
  origin_fees: string
  origin_address: string
}

/**
 * Query interface for Assets
 */
export interface AssetsQuery {
  auction_started?: string
  auction_state?: string
  auction_type?: string
  bidder?: string
  chain?: string
  chain_name?: string
  collection_slug?: string
  contract?: string
  contract_id?: string
  creator?: string
  fiat_currency?: string
  filter1name?: string
  filter1value?: string
  filter2name?: string
  filter2value?: string
  filter3name?: string
  filter3value?: string
  filter4name?: string
  filter4value?: string
  filter5name?: string
  filter5value?: string
  grouping?: number
  issuer?: string
  light_mode?: number
  limit?: number
  maker?: string
  name?: string
  nsfw_mode?: string
  offset?: number
  only_verified?: number
  order_by?: string
  order_direction?: string
  owner?: string
  price_similar?: number
  price_similar_delta?: number
  quote_symbol?: string
  series_id?: string
  status?: string
  symbol?: string
  token_id?: string
  with_total?: number
}

/**
 * Interface for Assets from API response
 */
export interface Assets {
  total_results?: number
  assets: Array<Asset> | null
}

interface Asset {
  orders: Array<Order>
  offers: Array<Offer>
  nft: NFT
}

/**
 * Standard interface for NFTs as per API response
 */
interface NFT {
  token_id: string
  chain: string
  symbol: string
  creator_address: string
  creator_address_verified: boolean
  creator_onchain_name: string
  creator_offchain_name: string
  creator_offchain_title: string
  creator_avatar: string
  royalties_recipient_address: string
  royalties_recipient_address_verified: boolean
  royalties_recipient_onchain_name: string
  royalties_recipient_offchain_name: string
  royalties_recipient_offchain_title: string
  royalties_recipient_avatar: string
  owners: Array<Owner>
  contract: string
  api_url: string
  nft_type: Array<string>
  verified: number
  blacklisted: number
  burned: number
  blacklist_type: string
  collection: Collection
  background_color: string
  nft_metadata: NFTMetadata
  series: Series
  infusion: Array<Infusion>
  infused_into: InfusedInto
  last_sale_date: string
  last_sale_price: string
  last_sale_symbol: string
  last_sale_price_fiat: string
  last_sale_fiat_currency: string
  nft_id: number
}

interface InfusedInto {
  token_id: string
  chain: string
  contract: string
}

interface Infusion {
  key: string
  value: string
}

interface Series {
  id: string
  chain: string
  contract: string
  symbol: string
  creator: string
  current_supply: number
  max_supply: number
  mode_name: string
  name: string
  description: string
  image: string
  royalties: string
  type: number
  attrType1: string
  attrValue1: string
  attrType2: string
  attrValue2: string
  attrType3: string
  attrValue3: string
  hasLocked: boolean
  sold: number
  series_id: number
}

/**
 * Standard interface NFT Metadata as per API response
 */
interface NFTMetadata {
  description: string
  name: string
  image: string
  video: string
  media_uri: string
  media_type: string
  info_url: string
  rom: string
  ram: string
  mint_date: string
  mint_number: string
  unlock_count: string
  attributes: Array<Attribute>
}

/**
 * Standard interface for NFT Attribute per API response
 */
interface Attribute {
  name_id: number
  name: string
  display_name: string
  display_type: string
  value_id: number
  value: string
  display_value: string
  count: number
  count_overall: number
  count_on_sale: number
  rarity: number
}

/**
 * Standard interface for Collection per API response
 */
interface Collection {
  name: string
  slug: string
  verified: boolean
  category: string
  description: string
  website: string
  socials_telegram: string
  socials_facebook: string
  socials_twitter: string
  socials_instagram: string
  socials_spotify: string
  socials_youtube: string
  featured_image: string
  logo_url: string
  background_color: string
  tradable: boolean
  nft_count: number
  nft_active_count: number
  nft_infused_count: number
  listed_nft_count: number
  weekly_volume: number
  floor_price: number
  main_token_contract: MainTokenContract
  contracts: Array<Contract>
}

interface Contract {
  chain: string
  hash: string
  owner_address: string
  owner_address_verified: boolean
  owner_onchain_name: string
  owner_offchain_name: string
  owner_offchain_title: string
  owner_avatar: string
}

interface MainTokenContract {
  chain: string
  symbol: string
  hash: string
}

/**
 * Standard interface for NFT owner per API response
 */
interface Owner {
  address: string
  address_verified: boolean
  onchain_name: string
  offchain_name: string
  offchain_title: string
  avatar: string
  amount: number
}

/**
 * Standard interface for an Offer per API response
 */
interface Offer {
  type: string
  start_date: string
  end_date: string
  base_symbol: string
  base_contract: string
  quote_symbol: string
  quote_contract: string
  price: string
  token_amount: string
  maker_address: string
  maker_address_verified: boolean
  maker_onchain_name: string
  maker_offchain_name: string
  maker_avatar: string
  signature: string
  order_key_hash: string
  salt: string
  origin_fees: string
  origin_address: string
  fiat_price: string
  fiat_currency: string
  offer_id: number
}

/**
 * Standard interface for an Order in the order book per API response
 */
export interface Order {
  contract_auction_id: string
  type: string
  start_date: string
  end_date: string
  duration: string
  base_symbol: string
  base_contract: string
  quote_symbol: string
  quote_contract: string
  price: string
  token_amount: string
  maker_address: string
  signature: string
  order_key_hash: string
  salt: string
  fiat_price: string
  end_price: string
  fiat_end_price: string
  extension_period: string
  listing_fee: number
  current_winner_address: string
  current_winner_address_verified: boolean
  current_winner_onchain_name: string
  current_winner_offchain_name: string
  current_winner_avatar: string
  origin_fees: string
  origin_address: string
  fiat_currency: string
  group_size: string
  bids: Array<Bid>
  order_id: number
}

/**
 * Standard interface for a bid per API response
 */
interface Bid {
  chain: string
  date: string
  price: string
  fiat_price: string
  address: string
  address_verified: boolean
  onchain_name: string
  offchain_name: string
  avatar: string
  tx_hash: string
  quote_symbol: string
  bid_id: number
}

/**
 * Query interface for Collections
 */
export interface CollectionsQuery {
  chain?: string
  collection_slug?: string
  issuer?: string
  limit?: number
  nft_name?: string
  offset?: number
  order_by?: string
  order_direction?: string
  owner?: string
  quote_symbol?: string
  series_id?: string
  with_total?: number
}

/**
 * Response interface for Collections
 */
export interface Collections {
  total_results?: number
  collections: Array<Collection> | null
}

/**
 * Standard interface for Collection from API Response.
 */
interface Collection {
  name: string
  slug: string
  verified: boolean
  category: string
  description: string
  website: string
  socials_telegram: string
  socials_facebook: string
  socials_twitter: string
  socials_instagram: string
  socials_spotify: string
  socials_youtube: string
  featured_image: string
  logo_url: string
  background_color: string
  tradable: boolean
  nft_count: number
  nft_active_count: number
  nft_infused_count: number
  listed_nft_count: number
  weekly_volume: number
  floor_price: number
  main_token_contract: MainTokenContract
  contracts: Array<Contract>
}

/**
 * Standard interface for a Contract as per API Response.
 */
interface Contract {
  chain: string
  hash: string
  owner_address: string
  owner_address_verified: boolean
  owner_onchain_name: string
  owner_offchain_name: string
  owner_offchain_title: string
  owner_avatar: string
}

interface MainTokenContract {
  chain: string
  symbol: string
  hash: string
}

/**
 * Query interface for Events.
 */
export interface EventsQuery {
  address?: string
  address_partial?: string
  chain?: string
  collection_slug?: string
  contract?: string
  date_day?: string
  date_less?: string
  date_greater?: string
  event_kind?: string
  event_kind_partial?: string
  fiat_currency?: string
  grouping?: number
  issuer?: string
  limit?: number
  nft_description_partial?: string
  nft_name_partial?: string
  nsfw_mode?: string
  offset?: number
  order_by?: string
  order_direction?: string
  show_events?: string
  token_id?: string
  with_metadata?: number
  with_series?: number
  with_total?: number
}

/**
 * Standard interface for Events as per API Response
 */
export interface Events {
  total_results: number
  events: Array<Event> | null
  error?: string
}

/**
 * Standard interface for an Event as per API response.
 */
interface Event {
  chain: string
  contract: string
  date: string
  transaction_hash: string
  token_id: string
  token_amount: number
  event_kind: string
  auction_type: string
  base_symbol: string
  quote_symbol: string
  price: string
  infused_symbol: string
  infused_value: string
  fiat_price: string
  fiat_currency: string
  source_address: string
  source_address_verified: boolean
  source_onchain_name: string
  source_offchain_name: string
  source_offchain_title: string
  source_avatar: string
  verified: number
  blacklisted: number
  burned: number
  blacklist_type: string
  address: string
  address_verified: boolean
  onchain_name: string
  offchain_name: string
  offchain_title: string
  avatar: string
  nft_metadata: NFTMetadata
  series: Series
  collection: Collection
  group_size: number
  event_id: number
}

interface Collection {
  name: string
  slug: string
  verified: boolean
  category: string
  description: string
  website: string
  socials_telegram: string
  socials_facebook: string
  socials_twitter: string
  socials_instagram: string
  socials_spotify: string
  socials_youtube: string
  featured_image: string
  logo_url: string
  background_color: string
  tradable: boolean
  nft_count: number
  nft_active_count: number
  nft_infused_count: number
  listed_nft_count: number
  weekly_volume: number
  floor_price: number
  main_token_contract: MainTokenContract
  contracts: Array<Contract>
}

interface Contract {
  chain: string
  hash: string
  owner_address: string
  owner_address_verified: boolean
  owner_onchain_name: string
  owner_offchain_name: string
  owner_offchain_title: string
  owner_avatar: string
}

interface MainTokenContract {
  chain: string
  symbol: string
  hash: string
}

/**
 * Standard interface for OpenOrders Result per API response.
 */
export interface OpenOrders {
  open_orders: Array<OpenOrder>
}

interface OpenOrder {
  id: number
  chain: string
  token_contract: string
  token_id: string
  token_amount: string
  quote_contract: string
  quote_price: string
  maker_address: string
  is_buy_offer: boolean
  start_date: string
  end_date: string
  signature: string
  order_key_hash: string
  salt: string
  origin_fees: string
  origin_address: string
}

export interface OpenMintings {
  open_mintings: Array<OpenMinting>
}

/**
 * Standard interface for an OpenMinting per API response.
 */
interface OpenMinting {
  id: number
  end_date: string
  start_date: string
  price: string
  quote_symbol: string
  name: string
  description: string
  image: string
  creator: string
  address: string
  payment_address: string
  fiat_price: string
  fiat_currency: string
  type: string
  sold_count: number
  wif: string
  synced_height: string
  complete: boolean
}

/**
 * Query interface for Series.
 */
export interface SeriesQuery {
  chain?: string
  contract?: string
  creator?: string
  id?: string
  limit?: number
  name?: string
  offset?: number
  order_by?: string
  order_direction?: string
  symbol?: string
}

/**
 *  Serries Result as per API response.
 */
export interface SeriesResponse {
  total_results?: number
  series: Array<SeriesItem> | null
}

interface SeriesItem {
  id: string
  chain: string
  contract: string
  symbol: string
  creator: string
  current_supply: number
  max_supply: number
  mode_name: string
  name: string
  description: string
  image: string
  royalties: string
  type: number
  attrType1: string
  attrValue1: string
  attrType2: string
  attrValue2: string
  attrType3: string
  attrValue3: string
  hasLocked: boolean
  sold: number
  series_id: number
}

/**
 * Query interface for Statistics
 */
export interface StatisticsQuery {
  chain?: string
  collection_slug?: string
  currency?: string
  limit?: number
  offset?: number
  order_by?: string
  order_direction?: string
  with_collections_daily_stats?: number
  with_collections_weekly_stats?: number
  with_collections_monthly_stats?: number
  with_collections_total_stats?: number
  with_chains_daily_stats?: number
  with_chains_weekly_stats?: number
  with_chains_monthly_stats?: number
  with_chains_total_stats?: number
  with_marketplace_daily_stats?: number
  with_marketplace_weekly_stats?: number
  with_marketplace_monthly_stats?: number
  with_marketplace_total_stats?: number
}

/**
 * Interface for MarkeplaceStatistics (weekly, weekly, total)as per API Response
 */
export interface MarketplaceStatistics {
  currency: string
  weekly: Weekly
  monthly: Weekly
  total: Total
}

interface Total {
  sales: number
  users: number
  transactions: number
  volume: number
  average_price: number
  lowest_price: number
  highest_price: number
  nft_count: number
  nft_active_count: number
  nft_infused_count: number
  listed_nft_count: number
  owners_count: number
  market_cap: number
}

interface Weekly {
  sales: number
  users: number
  transactions: number
  volume: number
  volume_change: number
  average_price: number
}

/**
 * Interface for basic Token information.
 */
export interface TokenMetadata {
  chain?: string
  contract?: string
  token_id?: string
}

/**
 * Interface for TokenRefreshMetadata per API response. Current API returns: { sucess: boolean }
 */
export type TokenRefreshMetadata = {
  success: boolean
}

export type TokenRefreshMetadataError = {
  error?: string
}

/**
 * Interface for TokenURI for a Token as per API response
 */
export type TokenURI = {
  token_uri?: string
  error?: TokenURIError
}

/**
 * Interface for TokenURIError for a Token that does not have a URI as per API response
 */
export type TokenURIError = {
  error: string
}

/**
 * Query interface for Users
 */
export interface UsersQuery {
  address?: string
  chain?: string
  issuer?: string
  limit?: number
  offchain_name?: string
  offchain_name_partial?: string
  offset?: number
  order_by?: string
  order_direction?: string
  verified?: boolean
  with_sales_statistics?: number
  with_total?: number
}

/**
 * Interface for  Users as per API response
 */
export interface Users {
  total_results?: number
  users: Array<User> | null
}

/**
 * Standard interface for a User as per API response
 */
interface User {
  offchain_name: string
  title: string
  issuer: string
  join_date: string
  description: string
  verified: boolean
  moderator: boolean
  url: string
  avatar: string
  banner: string
  socials_facebook: string
  socials_twitter: string
  socials_instagram: string
  socials_spotify: string
  socials_youtube: string
  socials_discord: string
  socials_telegram: string
  addresses: Array<Address>
  follow: number
  followers: number
  likes: number
  sales: Sales
}

/**
 * Standard interface for Sales of a User as per API response
 */
interface Sales {
  series_sales: Array<SeriesSale>
  overall_sales: Array<SalePair>
  overall_usd_amount_historical: string
  overall_usd_amount_current: string
  sales_count: number
  addresses_count: number
  addresses: Array<Address>
}

interface Address {
  address: string
  timestamp: string
  tx: string
}

interface SeriesSale {
  mint_type: string
  series_id: string
  series_name: string
  sale_pairs: Array<SalePair>
  usd_amount_historical: string
  sales_count: number
}

interface SalePair {
  symbol: string
  amount: string
  usd_amount_historical: string
  sales_count: number
}

export interface UsersError {
  error: string
}

/**
 * Interface for userexists API response
 */
export interface UserExists {
  success: boolean
}

/**
 * Smart Contract Related types
 */
export type ExchangeV2ABI = Array<AbiItem>

/**
 * Left
 * @param maker Address of the order maker
 * @param makeAsset Asset to be matched
 * @param taker Address of the asset taker
 * @param takeAsset
 * @param salt Unique salt that uniquely identifies an order
 * @param start A unix timestamp when matching of order can start
 * @param end A unix timestamp which matching of order
 * @param dataType
 * @param data
 */
export interface OrderLeft {
  maker: string
  makeAsset: object
  taker: string
  takeAsset: object
  salt: number
  start: Date | number
  end: Date | number
  dataType: string
  data: string
}

export type OrderRight = OrderLeft
/**
 * An EIP712 signature for verifying orders.
 */
export type Signature = string

/**
 * Tx object
 * @param from Transaction sender address
 * @param value Value to send with the Transaction
 * @param gasPrice The Current gasPrice. Optional to let client libs estimate the value.
 */
export interface TxObject {
  from: string
  value: number | string
  gasPrice?: number
  chainId: string
}

/* 
Request body interface for `createopenorder` API endpoint, for listing an NFT
*
*/
export interface ListNFT {
  chain: string
  token_contract: string
  token_id: string
  token_amount: number
  quote_contract: string
  quote_price: string
  maker_address: string
  is_buy_offer?: boolean
  start_date: number
  end_date: number
  signature: string
  order_key_hash: string
  salt: string
  origin_fees: number
  origin_address: string
}

export interface ListNFTResult {
  success: boolean
}

export type PartialReadonlyContractAbi = AbiItem[]
