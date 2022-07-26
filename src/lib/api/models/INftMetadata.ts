import { INftAttribute } from './INftAttribute'

export interface INftMetadata {
    description: string
    name: string
    media_uri: string
    media_type: string
    info_url: string
    mint_date: number
    mint_number: number
    unlock_count: number
    attributes: INftAttribute[]
}
