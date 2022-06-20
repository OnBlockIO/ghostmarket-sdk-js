export interface IStatisticsDaily {
  date: string
  sales_count: number // Count of all sells.
  users_count: number // Count of unique addresses that bought or sold that day.
  transactions_count: number // Count of transactions containing sells.
  nft_count: number // Count of all NFTs available up to date.
  listed_nft_count: number // Count of all NFTs currently listed.
  owners_count: number // Count of all NFTs' owners up to date.
  average_price: number // = VOLUME / SALES_COUNT.
  market_cap: number // = AVERAGE_PRICE * NFT_COUNT.
}
