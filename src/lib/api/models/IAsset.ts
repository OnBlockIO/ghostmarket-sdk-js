import { INftMain } from './INftMain'
import { IOffer } from './IOffer'
import { IOrder } from './IOrder'
import { ISocial } from './ISocial'

export interface IAsset {
    nftId?: number
    nft: INftMain
    orders?: IOrder[]
    offers?: IOffer[]
    social?: ISocial
}
