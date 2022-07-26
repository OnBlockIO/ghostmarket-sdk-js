/** Returns daily statistics for marketplace */
export class GetMarketplaceDailyStatisticsRequest {
    /** Offset */
    offset = 0
    /** Limit */
    limit = 50
    /** Returns total (slower) or not (faster) */
    with_total = 1
    /** Fiat or crypto currency to display prices */
    currency = 'USD'
    /** Order by ['date'] */
    order_by?: string = 'date'
    /** Order direction */
    order_direction?: 'asc' | 'desc' = 'asc'

    public constructor(init?: Partial<GetMarketplaceDailyStatisticsRequest>) {
        ;(<any>Object).assign(this, init)
    }
}
