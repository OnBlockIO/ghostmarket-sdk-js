import { IUserInfo } from './IUserInfo'
import { IQuoteContractV2 } from './IQuoteContractV2'
import { IBaseContractV2 } from './IBaseContractV2'
import { IOrderDataV2 } from './IOrderDataV2'
import { IFees } from './IFees'

export interface IOfferV2 {
    endDate: number
    fiatCurrency: string
    fiatPrice: number
    maker: IUserInfo
    baseContract: IBaseContractV2
    quoteContract: IQuoteContractV2
    orderData: IOrderDataV2
    price: string
    startDate: number
    type: string
    tokenAmount: number
    originFees: IFees
    isCollectionOffer: boolean
}
