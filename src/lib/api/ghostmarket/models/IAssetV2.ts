import { INftAttribute } from './INftAttribute'
import { IOwnership } from './IOwnership'
import { IUserInfoV2, IBaseContractV2, IQuoteContract, ILastSale, IFees, IOrderDataV2 } from '.'

export interface IAssetV2 {
    apiUrl: string
    backgroundColor: string
    bestOffer: {
        baseContract: IBaseContractV2
        quoteContract: IQuoteContract
        price: string
        fiatPrice: number
    }
    blacklistType: string
    blacklisted: boolean
    burned: boolean
    chain: string
    collection: {
        logoUrl: string
        name: string
        nftCount: number
        slug: string
        tradable: boolean
        verified: boolean
    }
    contract: IBaseContractV2
    creator: IUserInfoV2
    infusedInto: {
        tokenId?: string
        contract?: IBaseContractV2
    }
    infusion: {
        key: string
        value: string
    }[]
    lastSale: ILastSale
    lowestOrder: {
        bidsCount: number
        startDate: number
        endDate: number
        fiatPrice: number
        groupSize: number
        maker: IUserInfoV2
        highestBid: { price: string; fiatPrice: number }
        price: string
        endPrice: string
        quoteContract: IQuoteContract
        tokenAmount: number
        type: string
        extensionPeriod: number
        contractAuctionId: string
        duration: number
        orderData: IOrderDataV2
    }
    metadata: {
        description: string
        infoUrl: string
        mediaType: string
        mediaUri: string
        mintDate: number
        mintNumber: number
        name: string
        unlockCount: number
        attributes: INftAttribute[]
    }
    nftId: number
    nftType: string[]
    ownerships: IOwnership[]
    royalties: IFees
    series: {
        attrType1: string
        attrType2: string
        attrType3: string
        attrValue1: string
        attrValue2: string
        attrValue3: string
        contract: IBaseContractV2
        creator: string
        currentSupply: number
        hasLocked: boolean
        image: string
        maxSupply: number
        modeName: string
        seriesId: number
        seriesOnchainId: string
        sold: number
        type: number
    }
    symbol: string
    tokenId: string
    verified: boolean
}
