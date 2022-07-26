import { ICollection } from './ICollection'
import { INftMetadata } from './INftMetadata'
import { ISeries } from './ISeries'

export interface IEvent {
    chain: string
    contract: string
    date: number
    transaction_hash: string
    token_id: string
    event_kind: string
    auction_type: string
    base_symbol: string
    quote_symbol: string
    price: string
    token_amount: string
    infused_symbol: string
    infused_value: string
    fiat_price: string
    fiat_currency: string
    source_address?: string
    source_onchain_name?: string | undefined
    source_offchain_title?: string | undefined
    source_offchain_name?: string | undefined
    address: string
    onchain_name: string
    offchain_name: string
    offchain_title: string
    nft_metadata?: INftMetadata
    series?: ISeries
    collection?: ICollection
    group_size: number
}
