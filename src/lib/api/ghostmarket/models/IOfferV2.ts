import { IUserInfo } from '../models/IUserInfo'
import { IQuoteContractV2 } from '../models/IQuoteContractV2'
import { IBaseContractV2 } from '../models/IBaseContractV2'
import { IOrderDataV2 } from '../models/IOrderDataV2'
import { IFees } from '../models/IFees'

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
