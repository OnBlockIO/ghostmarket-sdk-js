/** Returns daily statistics for chain */
export class GetChainDailyStatisticsRequest {
  /** Chain name (ex. 'PHA') */
  chain = ''
  /** Order by ['date'] */
  order_by?: string = 'date'
  /** Order direction */
  order_direction?: 'asc' | 'desc' = 'asc'
  /** Offset */
  offset = 0
  /** Limit */
  limit = 50
  /** Returns total (slower) or not (faster) */
  with_total = 1
  /** Fiat or crypto currency to display prices */
  currency = 'USD'

  public constructor(init?: Partial<GetChainDailyStatisticsRequest>) {
    ;(<any>Object).assign(this, init)
  }
}
