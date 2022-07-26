import { IUserInfo } from './IUserInfo'
import { IQuoteContractV2 } from './IQuoteContractV2'
import { IBaseContractV2 } from './IBaseContractV2'
import { IOrderDataV2 } from './IOrderDataV2'
import { IFees } from './IFees'

export interface IOffer {
    end_date: number
    fiat_currency: string
    fiat_price: number
    maker: IUserInfo
    base_contract: IBaseContractV2
    quote_contract: IQuoteContractV2
    order_data: IOrderDataV2
    price: string
    start_date: number
    type: string
    token_amount: number
    origin_fees: IFees
    is_collection_offer: boolean
}
