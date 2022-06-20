import { IQuoteContract, IUserInfoV2 } from '.'

export interface IBidV2 {
  date: number
  price: string
  fiatPrice: number
  bidder: IUserInfoV2
  quoteContract: IQuoteContract
  txHash: string
}
