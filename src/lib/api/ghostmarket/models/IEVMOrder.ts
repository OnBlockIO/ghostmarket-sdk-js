import { IEVMAsset } from './IEVMAsset'

export interface IEVMOrder {
    maker: string
    makeAsset: IEVMAsset
    taker: string
    takeAsset: IEVMAsset
    salt: string | number
    start: number
    end: number
    dataType: string
    data: string
}
