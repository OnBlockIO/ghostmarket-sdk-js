/** Returns statistics for chains. */
export class GetChainStatisticsRequest {
  /** Order by ['chain'] */
  order_by?: string = 'chain'
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
  /** Return chain weekly stats */
  with_weekly_stats = 1
  /** Return chain montly stats */
  with_monthly_stats = 1
  /** Return chain total stats */
  with_total_stats = 1
  currency = 'USD'

  public constructor(init?: Partial<GetChainStatisticsRequest>) {
    ;(<any>Object).assign(this, init)
  }
}
