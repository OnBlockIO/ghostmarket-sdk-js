import { IBid } from './IBid'
import { IBaseContract } from './IBaseContract'
import { IQuoteContract } from './IQuoteContract'
import { IOrderData } from './IOrderData'
import { IUserInfo } from './IUserInfo'

export interface IOrder {
  base_contract: IBaseContract
  bids?: IBid[]
  contract_auction_id?: string
  duration?: number
  end_date: number
  extension_period: number
  fiat_currency: string
  fiat_end_price: number
  fiat_price: number
  group_size: number
  listing_fee: number
  maker: IUserInfo
  order_data: IOrderData
  price: string
  token_amount?: number
  quote_contract: IQuoteContract
  start_date: number
  type: string
  end_price: string
  current_winner?: IUserInfo
}
