export enum GetEventsRequestOrderBy {
    date = 'date',
    price = 'price',
}

export enum GetEventsRequestOrderDirection {
    desc = 'desc',
    asc = 'asc',
}

export enum GetEventsRequestShow {
    all = 'all',
    hidden = 'hidden',
    not_hidden = 'not_hidden',
}

export enum GetEventsRequestNSFWMode {
    all = 'all',
    only_safe = 'only_safe',
    only_unsafe = 'only_unsafe',
}

export enum GetEventsRequestEventKind {
    all = '',
    tokenmint = 'tokenmint', // Mint
    ordercreated = 'ordercreated', // Listing
    ordercancelled = 'ordercancelled', // Cancel Listing
    orderbid = 'orderbid', // Bid
    orderfilled = 'orderfilled', // Sales
    offercreated = 'offercreated', // Offer
    offercancelled = 'offercancelled', // Offer Cancelled
    tokentransfer = 'tokentransfer', // Transfers
    infusion = 'infusion', // Infusion
    openmintpayment = 'openmintpayment', // OpenMintPayment
}

export class GetEventsRequest {
    /** Order by */
    order_by?: string = GetEventsRequestOrderBy.date
    /** Order direction */
    order_direction?: string = GetEventsRequestOrderDirection.desc
    /** Offset */
    offset?: number = 0
    /** Limit */
    limit?: number = 25
    /** Chain name (ex. 'PHA') */
    chain?: string = ''
    /** Contract hash or symbol */
    contract?: string
    /** Collection slug */
    collection_slug?: string
    /** Token ID */
    token_id?: string
    /** Date day match (matchet whole given day) */
    date_day?: string
    /** Date (less than) */
    date_less?: number
    /** Date (greater than) */
    date_greater?: number
    /** Event kind */
    event_kind?: string = GetEventsRequestEventKind.all
    /** Event kind (parial match) */
    event_kind_partial?: string
    /** Nft name (parial match) */
    nft_name_partial?: string
    /** Nft description (parial match) */
    nft_description_partial?: string
    /** Show all events, hidden events [claim, unprocessed send/receive/burn], not hidden events, not hidden and burn events (all/not_hidden/not_hidden_and_burn/hidden) */
    show_events?: string = GetEventsRequestShow.all
    /** Address */
    address?: string | string[]
    /** Address (parial match) */
    address_partial?: string
    /** Return NFT metadata with events */
    with_metadata?: number = 0
    /** Return NFT series with events */
    with_series?: number = 0
    /** Enable grouping of similar events */
    grouping?: number = 0
    /** NSFW show state (all/only_safe/only_unsafe) */
    nsfw_mode?: string
    /** Return total (slower) or not (faster) */
    with_total?: number = 0
    /** Fiat currency to calculate Fiat price */
    fiat_currency?: string = 'USD'
    /** filter by issuer */
    public issuer?: string
    /** blacklisted status */
    public blacklisted_mode?: 'all' | 'not_blacklisted' | 'blacklisted' = 'not_blacklisted'

    public constructor(...inits: Partial<GetEventsRequest>[]) {
        inits.forEach(init => {
            this.flat('address', init)
            ;(<any>Object).assign(this, init)
        })
    }

    flat(property: string, init?: Partial<GetEventsRequest>) {
        if (init) {
            if ((init as any)[property] && Array.isArray((init as any)[property])) {
                ;((init as any)[property] as any) = (init as any)[property].join(',')
            }
        }
    }
}
