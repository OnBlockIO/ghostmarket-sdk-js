/** Returns statistics for address on the marketplace. */
export class GetAddressStatisticsRequest {
    /** Order by */
    order_by?:
        | 'total_volume'
        | 'buys_volume'
        | 'sales_volume'
        | 'monthly_buys_volume'
        | 'monthly_sales_volume'
        | 'weekly_buys_volume'
        | 'weekly_sales_volume' = 'total_volume'
    /** Order direction */
    order_direction?: 'asc' | 'desc' = 'asc'
    /** Offset */
    offset?: string = '0'
    /** Limit */
    limit?: string = '50'
    /** Return total (slower) or not (faster) */
    with_total?: number = 0
    /** Chain name (ex. 'PHA') */
    chain?: string = ''
    /** Name (multiple values supported, comma-separated) */
    offchain_name?: string
    /** Return user weekly stats */
    with_weekly_stats = 0
    /** Return user monthly stats */
    with_monthly_stats = 0
    /** Return user total stats */
    with_total_stats = 0
    /** Fiat or crypto currency to display prices */
    currency = 'USD'

    public constructor(init?: Partial<GetAddressStatisticsRequest>) {
        ;(<any>Object).assign(this, init)
    }
}
