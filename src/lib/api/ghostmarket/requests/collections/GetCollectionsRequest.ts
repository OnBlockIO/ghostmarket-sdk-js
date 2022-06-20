/** Returns collections of NFTs available on the marketplace */
export class GetCollectionsRequest {
  /** Order by [id, name, nft_count, nft_active_count, nft_infused_count] */
  order_by?:
    | 'id'
    | 'name'
    | 'nft_count'
    | 'nft_active_count'
    | 'nft_infused_count'
    | 'listed_nft_count'
    | 'total_volume'
    | 'monthly_volume'
    | 'weekly_volume' = 'weekly_volume'
  /** Order direction */
  order_direction?: 'asc' | 'desc' = 'desc'
  /** Offset */
  offset?: string = '0'
  /** Limit */
  limit?: string = '10'
  /** Return total (slower) or not (faster) */
  with_total?: number = 1
  /** Address of asset owner */
  owner?: string | string[] = ''
  /** Asset name/description filter (partial match) */
  nft_name?: string = ''
  /** Chain name (ex. 'PHA') */
  chain?: string = ''
  /** Quote symbol (ex. 'SOUL') */
  quote_symbol?: string = ''
  /** Collection slug */
  collection_slug?: string = ''
  /** Series ID */
  series_id?: string = ''
  /** filter by issuer */
  public issuer?: string
  /** Collection name filter (partial match) */
  name?: string
  /** Fiat currency to calculate Fiat price */
  fiat_currency?: string = 'USD'

  public constructor(init?: Partial<GetCollectionsRequest>) {
    this.flat('owner', init)
    ;(<any>Object).assign(this, init)
  }

  flat(property: string, init?: Partial<GetCollectionsRequest>) {
    if (init) {
      if ((init as any)[property] && Array.isArray((init as any)[property])) {
        ;((init as any)[property] as any) = (init as any)[property].join(',')
      }
    }
  }
}
