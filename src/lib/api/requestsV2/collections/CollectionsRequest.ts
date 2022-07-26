/** Returns collections of NFTs available on the marketplace */
export class CollectionsRequest {
    /** Order by [id, name, nft_count, nft_active_count, nft_infused_count] */
    orderBy?:
        | 'id'
        | 'name'
        | 'nftCount'
        | 'listedNftCount'
        | 'totalVolume'
        | 'monthlyVolume'
        | 'weeklyVolume' = 'weeklyVolume'
    /** Order direction */
    orderDirection?: 'asc' | 'desc' = 'desc'
    /** Offset */
    page?: number = 1
    /** Limit */
    size?: number = 25
    /** Return total (slower) or not (faster) */
    getTotal?: boolean = true
    /** Address of asset owner */
    owners?: string | string[] = ''
    /** Asset name/description filter (partial match) */
    nftName?: string = ''
    /** Chain name (ex. 'PHA') */
    chain?: string = ''
    /** Collection Slug */
    slug?: string = ''
    /** Category */
    category?: string = ''
    /** Quote symbol (ex. 'SOUL') */
    quoteSymbols?: string = ''
    /** Series ID */
    seriesId?: string = ''
    /** filter by issuer */
    issuer?: string
    /** Collection name filter (partial match) */
    name?: string

    /** Show only verified collections */
    onlyVerified?: boolean = false
    /** Return collection's main token contract */
    getMainTokenContract?: boolean = true
    /** Return collection's contracts */
    getContracts?: boolean = true
    /** Return collection's weekly stats */
    getStatsWeekly?: boolean = false
    /** Return collection's monthly stats */
    getStatsMonthly?: boolean = false
    /** Return collection's total stats */
    getStatsTotal?: boolean = false

    /** Fiat or crypto currency to display prices in stats */
    currency?: string = 'USD'

    public constructor(init?: Partial<CollectionsRequest>) {
        this.flat('owner', init)
        ;(<any>Object).assign(this, init)
    }

    flat(property: string, init?: Partial<CollectionsRequest>) {
        if (init) {
            if ((init as any)[property] && Array.isArray((init as any)[property])) {
                ;((init as any)[property] as any) = (init as any)[property].join(',')
            }
        }
    }
}
