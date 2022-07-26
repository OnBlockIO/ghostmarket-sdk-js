import { IResult } from '../IResult'

interface IOpenOrder {
    /** chain */
    chain: string
    /** token contract */
    token_contract: string
    /** token id */
    token_id: string
    /** token amount - how many nfts in order */
    token_amount: string
    /** quote contract */
    quote_contract: string
    /** quote price */
    quote_price: string
    /** maker address */
    maker_address: string
    /** Contract id */
    is_buy_offer: boolean
    /** start date */
    start_date: string
    /** end date */
    end_date: string
    /** signature */
    signature: string
    /** order key hash */
    order_key_hash: string
    /** salt */
    salt: string
    /** origin_fee */
    origin_fees: number
    /** origin_address */
    origin_address: string
}

export interface IGetOpenOrdersResult extends IResult {
    open_orders: IOpenOrder[]
}
