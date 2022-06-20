export enum GetCollectionStatisticsRequestVerifiedTypes {
  all = 'all',
  verified = 'yes',
  unverified = 'no',
}

/** Returns statistics for collections of NFTs available on the marketplace. */
export class GetCollectionStatisticsRequest {
  /** Order by ['collection_name', 'weekly_volume', 'monthly_volume', 'total_volume'] */
  order_by?: string = 'collection_name'
  /** Order direction */
  order_direction?: 'asc' | 'desc' = 'asc'
  /** Offset */
  offset = 0
  /** Limit */
  limit = 50
  /** Chain name (ex. 'PHA') */
  chain?: string
  /** Returns total (slower) or not (faster) */
  with_total = 1
  /** Return collections daily stats */
  /** deprecated and moved to separate endpoint */
  // with_daily_stats: number = 1;
  /** Return collections weekly stats */
  with_weekly_stats = 1
  /** Return collections montly stats */
  with_monthly_stats = 1
  /** Return collections total stats */
  with_total_stats = 1
  /** Category */
  category?: string
  /** Collection slug */
  collection_slug?: string
  /** Collection name partial match */
  name?: string
  /** Fiat or crypto currency to display prices */
  currency = 'USD'
  /** filter by issuer */
  public issuer?: string
  /** Return only verified collections */
  verified?: string = GetCollectionStatisticsRequestVerifiedTypes.all

  public constructor(...inits: Partial<GetCollectionStatisticsRequest>[]) {
    inits.forEach(init => {
      ;(<any>Object).assign(this, init)
    })
  }
}
