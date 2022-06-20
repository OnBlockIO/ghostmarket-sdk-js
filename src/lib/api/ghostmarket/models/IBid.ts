import { IQuoteContract, IUserInfo } from '.'

export interface IBid {
  date: number
  price: string
  fiat_price: number
  bidder: IUserInfo
  quote_contract: IQuoteContract
  tx_hash: string
}
