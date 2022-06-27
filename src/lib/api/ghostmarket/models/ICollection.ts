import { ISymbolFilters } from './ISymbolFilters'

export interface ICollection {
    name: string
    slug: string
    description: string
    website: string
    tradable: boolean
    featured_image: string
    logo_url: string
    background_color: string
    socials_instagram: string
    socials_telegram: string
    socials_facebook: string
    socials_youtube: string
    socials_twitter: string
    category: string
    contracts?: [
        {
            chain: string
            hash: string
            owner_address?: string
            owner_address_verified?: string
            owner_onchain_name?: string
            owner_offchain_name?: string
            owner_offchain_title?: string
            owner_avatar?: string
            royalty_bps?: number
            royalty_recipient?: string
        },
    ]
    nft_count: number
    nft_active_count: number
    nft_infused_count: number
    main_token_contract?: {
        chain: string
        hash: string
        symbol: string
    }
    listed_nft_count: number
    filters: ISymbolFilters[]
    join_date: number
    verified: boolean
    weekly_volume: number
    floor_price: number
}
