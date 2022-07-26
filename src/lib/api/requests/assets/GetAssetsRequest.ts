export enum GetAssetsRequestOrderBy {
    // start_date = 'listing_start_date',
    list_or_bid_time = 'list_or_bid_time',
    end_date = 'listing_end_date',
    mint_date = 'mint_date',
    mint_number = 'mint_number',
    price = 'price',
    bid_price = 'bid_price',
}

export enum GetAssetsRequestOrderDirection {
    desc = 'desc',
    asc = 'asc',
}

export enum GetAssetsRequestListingTypes {
    all = '',
    classic = 'classic',
    fixed = 'fixed',
    dutch = 'dutch',
    reserve = 'reserve',
    offer = 'offer',
}

export enum GetAssetsRequestListingStates {
    all = '',
    buy_now = 'buy_now',
    auction = 'auction',
    on_sale_all = 'on_sale_all',
    on_sale_not_expired = 'on_sale_not_expired',
    not_on_sale = 'not_on_sale',
}

export enum GetAssetsRequestListingStarted {
    all = '',
    started = 'started',
    not_started = 'not_started',
    no_start_date = 'no_start_date',
}

/** Returns assets available on the marketplace. */
export class GetAssetsRequest {
    /** Order by */
    public order_by?: string = GetAssetsRequestOrderBy.list_or_bid_time // "list_or_bid_time";
    /** Order direction */
    public order_direction?: string = GetAssetsRequestOrderDirection.desc
    /** Offset */
    public offset?: number = 0
    /** Limit */
    public limit?: number = 25
    /** Return total (slower) or not (faster) */
    public get_total?: number = 0
    /** Fiat currency to calculate Fiat price */
    public fiat_currency?: string = 'USD'
    /** Listing state: all, buy_now, auction, on_sale_all, on_sale_not_expired, not_on_sale */
    public listing_state?: string = GetAssetsRequestListingStates.on_sale_not_expired
    /** Listing type: all, classic, fixed, dutch, reserve, offer - or comma-separated list of types */
    public listing_types?: string | string[]
    /**
     * all              > listing can have any start date
     * started          > listing has been started, unrelated to end date
     * not_started      > listing's start date is not initialized or has not come yet
     * no_start_date    > listing's start date is not yet initialized
     */
    public listing_started?: string = GetAssetsRequestListingStarted.all
    /** Auction bidder address or name (multiple values supported, comma-separated) */
    public bidder?: string | string[]
    /** Address of asset creator (multiple values supported, comma-separated) */
    public creator?: string | string[]
    /** Address of asset owner (multiple values supported, comma-separated) */
    public owner?: string | string[]
    /** Address of asset contract */
    public contract?: string
    /** Asset name/description filter (partial match) */
    public name?: string
    /** Chain name (ex. 'PHA') */
    public chain?: string
    /** Symbol (ex. 'TTRS') (multiple values supported, comma-separated) */
    public symbol?: string | string[]
    /** Quote symbol (ex. 'SOUL') (multiple values supported, comma-separated) */
    public quote_symbol?: string | string[]
    /** Collection slug */
    public collection_slug?: string
    /** Token ID (multiple values supported, comma-separated) */
    public token_id?: string | string[]
    /** Series ID */
    public series_id?: string
    /** Enable grouping by series and price */
    public grouping?: number = 1
    /** Show only verified users */
    public only_verified?: number = 0
    /** Infusion status (all/active/infused) */
    public status?: 'all' | 'active' | 'infused' = 'all'
    /** NSFW show state (all/only_safe/only_unsafe) */
    public nsfw_mode?: 'all' | 'only_safe' | 'only_unsafe' = 'all'
    /** Search for NFTs with similar price */
    public price_similar?: number
    /** Sets delta to create price range from price_similar - price_similar*price_similar_delta/100 to price_similar + price_similar*price_similar_delta/100 */
    public price_similar_delta?: number
    /** Search for NFTs with price in the range between PriceFrom and PriceTill, using PriceSymbol (fiat or crypto) */
    public price_from?: number
    /** Search for NFTs with price in the range between PriceFrom and PriceTill, using PriceSymbol (fiat or crypto) */
    public price_till?: number
    /** Search for NFTs with price in the range between PriceFrom and PriceTill, using PriceSymbol (fiat or crypto) */
    public price_symbol?: string = 'USD'
    /** Send less data */
    public light_mode?: number = 0
    /** filter by issuer */
    public issuer?: string
    /** blacklisted status */
    public blacklisted_mode?: 'all' | 'not_blacklisted' | 'blacklisted' = 'not_blacklisted'
    /** burned status */
    public burned_mode?: 'all' | 'not_burned' | 'burned' = 'not_burned'

    public constructor(...inits: Partial<GetAssetsRequest>[]) {
        inits.forEach(init => {
            // this.flat('listing_types', init)
            // this.flat('bidder', init)
            // this.flat('creator', init)
            // this.flat('owner', init)
            // this.flat('symbol', init)
            // this.flat('quote_symbol', init)
            // this.flat('token_id', init);
            ;(<any>Object).assign(this, init)
        })
    }

    flat(property: string, init?: Partial<GetAssetsRequest>) {
        if (init) {
            if ((init as any)[property] && Array.isArray((init as any)[property])) {
                ;((init as any)[property] as any) = (init as any)[property].join(',')
            }
        }
    }
}
