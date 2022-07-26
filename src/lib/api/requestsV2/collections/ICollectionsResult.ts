import { IContractInfoV2 } from '../../models/IContractInfoV2'
import { IPagedResult } from '../IPagedResult'

export interface ICollectionStats {
    sales: number
    users: number
    transactions: number
    volume: number
    volumeChange: number
    averagePrice: number
}

export interface ICollectionV2 {
    name: string
    slug: string
    verified: boolean
    issuer: string
    category: string
    description: string
    website: string
    socials: {
        facebook: string
        instagram: string
        spotify: string
        telegram: string
        twitter: string
        youtube: string
    }
    tradable: boolean
    featuredImage: string
    logoUrl: string
    backgroundColor: string
    nftCount: number
    nftActiveCount: number
    nftInfusedCount: number
    listedNftCount: number
    weeklyVolume: number
    floorPrice: number
    mainTokenContract?: IContractInfoV2
    contracts?: IContractInfoV2[]
    weeklyStats?: ICollectionStats
    monthlyStats?: ICollectionStats
    totalStats?: ICollectionStats
}

export interface ICollectionsResult extends IPagedResult {
    collections: ICollectionV2[] | null
    currency: string
}
