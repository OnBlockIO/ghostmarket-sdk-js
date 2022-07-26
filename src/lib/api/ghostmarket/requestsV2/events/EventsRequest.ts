import { GetEventsRequestEventKind } from '../../requests/events/GetEventsRequest'

export enum EventsRequestOrderBy {
    date = 'date',
    tokenId = 'tokenId',
    price = 'price',
}

export enum EventsRequestOrderDirection {
    desc = 'desc',
    asc = 'asc',
}

/** Returns assets available on the marketplace. */
export class EventsRequest {
    /** Page number */
    public page?: number = 1
    /** Size of page */
    public size?: number = 25
    /** Order by */
    public orderBy?: EventsRequestOrderBy = EventsRequestOrderBy.date
    /** Order direction */
    public orderDirection?: EventsRequestOrderDirection = EventsRequestOrderDirection.desc
    /** Return total (slower) or not (faster) */
    public getTotal?: boolean = false
    /** Fiat currency to calculate Fiat price */
    public fiatCurrency?: string = 'USD'

    /** Event kind:  */
    public eventKind?: GetEventsRequestEventKind
    /** Address of asset creator (multiple values supported, comma-separated) */
    public addresses?: string | string[]
    /** Addresses chains, corresponding to Addresses[] array */
    public addressesChains?: string | string[]
    /** Event date (greater than or equal) */
    public dateFrom = 0
    /** Event date (less than or equal) */
    public dateTill = 0

    /** Chain name (ex. 'PHA') */
    public chain?: string = ''
    /** Address of asset contract */
    public contract?: string
    /** Collection slug */
    public collection?: string
    /** Token ID */
    public tokenId?: string

    /** NFT name/description (partial match) */
    public nftName?: string

    /** Enable grouping of similar events */
    public grouping?: boolean = true
    /** Show only verified users */
    public onlyVerified?: boolean = false
    /** Infusion status (all if undefined/true=infused/false=not-infused) */
    public showInfused?: boolean | string
    /** NSFW show state (all if undefined/true=only-nsfw/false=only-safe) */
    public showNsfw?: boolean | string
    /** blacklisted status (all if undefined / true=blacklisted / false=not-blacklisted) */
    public showBlacklisted?: boolean | string
    /** burned status (all if undefined / true=burned / false=not-burned) */
    public showBurned?: boolean | string = false

    /** filter by issuer */
    public issuer?: string

    public constructor(...inits: Partial<EventsRequest>[]) {
        inits.forEach(init => {
            this.unflat('addresses', init)
            ;(<any>Object).assign(this, init)
        })
    }

    unflat(property: string, init?: Partial<EventsRequest>) {
        if (init && typeof (init as any)[property] == 'string') {
            ;(init as any)[property] = (init as any)[property].split(',')
        }
    }

    flat(property: string, init?: Partial<EventsRequest>) {
        if (init) {
            if ((init as any)[property] && Array.isArray((init as any)[property])) {
                ;((init as any)[property] as any) = (init as any)[property].join(',')
            }
        }
    }
}
