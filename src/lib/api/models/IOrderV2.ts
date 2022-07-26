import { IBaseContractV2 } from './IBaseContractV2'
import { IQuoteContractV2 } from './IQuoteContractV2'
import { IUserInfoV2 } from './IUserInfoV2'
import { IBidV2 } from './IBidV2'
import { IOrderDataV2 } from './IOrderDataV2'
import { IFees } from './IFees'

export interface IOrderV2 {
    baseContract: IBaseContractV2
    bids: IBidV2[]
    contractAuctionId: string
    currentWinner: IUserInfoV2
    duration: number
    endDate: number
    endPrice: string
    extensionPeriod: number
    fiatCurrency: string
    fiatEndPrice: number
    fiatPrice: number
    groupSize: number
    listingFee: number
    maker: IUserInfoV2
    orderId: number
    orderData: IOrderDataV2
    originFees: IFees
    price: string
    quoteContract: IQuoteContractV2
    startDate: number
    tokenAmount: number
    type: string
}
