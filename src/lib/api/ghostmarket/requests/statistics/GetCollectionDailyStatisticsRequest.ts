/** Returns daily statistics for collection. */
export class GetCollectionDailyStatisticsRequest {
    /** Collection slug */
    collection_slug = ''
    /** Order by ['date'] */
    order_by?: string = 'date'
    /** Order direction */
    order_direction?: 'asc' | 'desc' = 'asc'
    /** Returns total (slower) or not (faster) */
    with_total = 1
    /** Fiat or crypto currency to display prices */
    currency = 'USD'

    public constructor(init?: Partial<GetCollectionDailyStatisticsRequest>) {
        ;(<any>Object).assign(this, init)
    }
}
