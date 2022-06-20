export enum AssetsRequestOrderBy {
  mint_date = 'mintDate',
  price = 'price',
  bid_time = 'bid_time',
  list_or_bid_time = 'listOrBidTime',
  bid_price = 'bidPrice',
  start_date = 'listingStartDate',
  end_date = 'listingEndDate',
  mint_number = 'mintNumber',
}

export enum AssetsRequestOrderDirection {
  desc = 'desc',
  asc = 'asc',
}

export enum AssetsRequestListingTypes {
  all = '',
  classic = 'classic',
  fixed = 'fixed',
  dutch = 'dutch',
  reserve = 'reserve',
}

export enum AssetsRequestListingStates {
  all = '',
  buy_now = 'buyNow',
  auction = 'auction',
  on_sale_all = 'onSaleAll',
  on_sale_not_expired = 'onSaleNotExpired',
  not_on_sale = 'notOnSale',
}

export enum AssetsRequestListingStarted {
  all = '',
  started = 'started',
  not_started = 'notStarted',
  no_start_date = 'noStartDate',
}

/** Returns assets available on the marketplace. */
export class AssetsRequest {
  /** Page number */
  public page?: number = 1
  /** Size of page */
  public size?: number = 25
  /** Order by */
  public orderBy?: AssetsRequestOrderBy = AssetsRequestOrderBy.list_or_bid_time // "list_or_bid_time";
  /** Order direction */
  public orderDirection?: AssetsRequestOrderDirection = AssetsRequestOrderDirection.desc
  /** Return total (slower) or not (faster) */
  public getTotal?: boolean = false
  /** Fiat currency to calculate Fiat price */
  public fiatCurrency?: string = 'USD'
  /** Listing state: all, buy_now, auction, on_sale_all, on_sale_not_expired, not_on_sale */
  public listingState?: string
  /** Listing type: all, classic, fixed, dutch, reserve, offer - or comma-separated list of types (except all and offer) */
  public listingTypes?: string | string[]
  /**
   * all              > listing can have any start date
   * started          > listing has been started, unrelated to end date
   * not_started      > listing's start date is not initialized or has not come yet
   * no_start_date    > listing's start date is not yet initialized
   */
  public listingStarted?: string
  /** Auction bidder address or name (multiple values supported, comma-separated) */
  public bidders?: string | string[]
  /** Address of asset creator (multiple values supported, comma-separated) */
  public creators?: string | string[]
  /** Address of asset owner (multiple values supported, comma-separated) */
  public owners?: string | string[]
  /** Asset name/description filter (partial match) */
  public name?: string
  /** Chain name (ex. 'PHA') */
  public chain?: string = ''
  /** Address of asset contract */
  public contract?: string
  /** Symbol (ex. 'TTRS') (multiple values supported, comma-separated) */
  public symbols?: string | string[]
  /** Quote symbol (ex. 'SOUL') (multiple values supported, comma-separated) */
  public quoteSymbols?: string | string[]
  /** Collection slug */
  public collection?: string
  /** Token ID (multiple values supported, comma-separated) */
  public tokenIds?: string | string[]
  /** Series ID */
  public seriesOnchainId?: string
  /** Enable grouping by series and price */
  public grouping?: boolean = true
  /** Show only verified users */
  public onlyVerified?: boolean = false
  /** Infusion status (all if undefined/true=infused/false=not-infused) */
  public showInfused?: boolean | string
  /** NSFW show state (all if undefined/true=only-nsfw/false=only-safe) */
  public showNsfw?: boolean | string
  /** blacklisted status (all if undefined / true=blacklisted / false=not-blacklisted) */
  public showBlacklisted?: boolean | string = false
  /** burned status (all if undefined / true=burned / false=not-burned) */
  public showBurned?: boolean | string = false
  /** Search for NFTs with similar price */
  public priceSimilar?: number = 0
  /** Sets delta to create price range from price_similar - price_similar*price_similar_delta/100 to price_similar + price_similar*price_similar_delta/100 */
  public priceSimilarDelta?: number = 0
  /** Search for NFTs with price in the range between PriceFrom and PriceTill, using PriceSymbol (fiat or crypto) */
  public priceFrom?: number
  /** Search for NFTs with price in the range between PriceFrom and PriceTill, using PriceSymbol (fiat or crypto) */
  public priceTill?: number
  /** Search for NFTs with price in the range between PriceFrom and PriceTill, using PriceSymbol (fiat or crypto) */
  public priceSymbol?: string = 'USD'
  /** filter by issuer */
  public issuer?: string

  /** AttributeName [] */
  public attributeNames?: string[]
  /** AttributeValue [] */
  public attributeValues?: string[]

  /** AttributeNameId [] */
  public attributeNameIds?: string[]
  /** AttributeValueId [] */
  public attributeValueIds?: string[]

  public constructor(...inits: Partial<AssetsRequest>[]) {
    inits.forEach(init => {
      this.unflat('symbols', init)
      this.unflat('tokenIds', init)
      this.unflat('creators', init)
      this.unflat('owners', init)
      this.unflat('quoteSymbols', init)
      this.unflat('bidders', init)
      this.unflat('listingTypes', init)
      ;(<any>Object).assign(this, init)
    })
  }

  unflat(property: string, init?: Partial<AssetsRequest>) {
    if (init && typeof (init as any)[property] == 'string') {
      ;(init as any)[property] = (init as any)[property].split(',')
    }
  }

  flat(property: string, init?: Partial<AssetsRequest>) {
    if (init) {
      if ((init as any)[property] && Array.isArray((init as any)[property])) {
        ;((init as any)[property] as any) = (init as any)[property].join(',')
      }
    }
  }
}
