/** Returns series of NFTs available on the marketplace */
export class GetSeriesRequest {
    /** Order by */
    order_by?: 'id' | 'name' | 'nft_count' | 'nft_active_count' | 'nft_infused_count' = 'id'
    /** Order direction */
    order_direction?: 'desc' | 'asc' = 'asc'
    /** Offset */
    offset = 0
    /** Limit */
    limit = 25
    /** Series ID */
    id?: string
    /** Creator of series */
    creator?: string | string[]
    /** Series name/description filter (partial match) */
    name?: string
    /** Chain name (ex. 'PHA') */
    chain?: string = ''
    /** Symbol (ex. 'SOUL') */
    contract?: string
    /** Collection slug */
    public collection_slug?: string
    /** Return total (slower) or not (faster) */
    with_total?: number = 0

    public constructor(init?: Partial<GetSeriesRequest>) {
        this.flat('creator', init)
        ;(<any>Object).assign(this, init)
    }

    flat(property: string, init?: Partial<GetSeriesRequest>) {
        if (init) {
            if ((init as any)[property] && Array.isArray((init as any)[property])) {
                ;((init as any)[property] as any) = (init as any)[property].join(',')
            }
        }
    }
}
