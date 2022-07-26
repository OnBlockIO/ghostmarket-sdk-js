/** Returns statistics for collections of NFTs available on the marketplace. */
export class GetStatisticsRequest {
    /** Order by */
    order_by?: string = 'collection_name'
    /** Order direction */
    order_direction?: 'asc' | 'dec' = 'asc'
    /** Offset */
    offset?: string = '0'
    /** Limit */
    limit?: string = '50'
    /** Chain name (ex. 'PHA') */
    chain?: string = ''
    /** Return collections daily stats */
    with_collections_daily_stats = 0
    /** Return collections weekly stats */
    with_collections_weekly_stats = 0
    /** Return collections monthly stats */
    with_collections_monthly_stats = 0
    /** Return collections total stats */
    with_collections_total_stats = 0
    /** Return chains daily stats */
    with_chains_daily_stats = 0
    /** Return chains weekly stats */
    with_chains_weekly_stats = 0
    /** Return chains monthly stats */
    with_chains_monthly_stats = 0
    /** Return chains total stats */
    with_chains_total_stats = 0
    /** Return marketplace daily stats */
    with_marketplace_daily_stats = 0
    /** Return marketplace weekly stats */
    with_marketplace_weekly_stats = 0
    /** Return marketplace monthly stats */
    with_marketplace_monthly_stats = 0
    /** Return marketplace total stats */
    with_marketplace_total_stats = 0
    /** Return developer-specific stats */
    with_developer_stats = 0
    /** Collection slug */
    collection_slug = ''
    /** Fiat or crypto currency to display prices */
    currency = 'USD'

    public constructor(init?: Partial<GetStatisticsRequest>) {
        ;(<any>Object).assign(this, init)
    }
}
