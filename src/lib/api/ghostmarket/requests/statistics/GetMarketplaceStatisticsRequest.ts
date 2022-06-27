/** Returns w/m/t statistics for marketplace. */
export class GetMarketplaceStatisticsRequest {
    /** Return marketplace weekly stats */
    with_weekly_stats = 1
    /** Return marketplace montly stats */
    with_monthly_stats = 1
    /** Return marketplace total stats */
    with_total_stats = 1
    /** Fiat or crypto currency to display prices */
    currency = 'USD'

    public constructor(init?: Partial<GetMarketplaceStatisticsRequest>) {
        ;(<any>Object).assign(this, init)
    }
}
