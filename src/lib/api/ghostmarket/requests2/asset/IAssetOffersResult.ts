import { IPagedResult } from '../IPagedResult'
import { IUserInfo } from '../../models/IUserInfo'
import { IBaseContractV2 } from '../../models/IBaseContractV2'
import { IQuoteContractV2 } from '../../models/IQuoteContractV2'
import { IOrderDataV2 } from '../../models/IOrderDataV2'
import { IFees } from '../../models/IFees'

export interface IAssetOffersResult extends IPagedResult {
  offers: {
    baseContract: IBaseContractV2
    endDate: number
    fiatCurrency: string
    fiatPrice: number
    maker: IUserInfo
    offerId: number
    orderData: IOrderDataV2
    originFees: IFees
    price: string
    quoteContract: IQuoteContractV2
    startDate: number
    tokenAmount: number
    type: string
  }[]
}
