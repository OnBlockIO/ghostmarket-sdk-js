export interface IOrderItem {
    baseContract: string // token contract for the order.
    baseTokenId?: string // token id for the order - set to empty for collection offer.
    baseTokenAmount?: number // token amount for the order - only used for ERC1155.
    quoteContract: string // quote contract for the order.
    quotePrice: string // quote price for the order.
    makerAddress: string // maker address for the order.
    type: number // type of order. // 1 - listing, 2 - offer.
    startDate?: number // start date the order can be matched - optional default to now, need to be passed to cancel or match order.
    endDate?: number // end date the order can be matched - optional default to unexpiring, need to be passed to cancel or match order.
    salt?: string // salt - calculated automatically, need to be passed to cancel or match order.
    signature?: string // signature - calculated automatically, need to be passed to match order.
}

export interface IMintItem {
    creatorAddress: string // nft creator.
    royalties?: IRoyalties[] // nft royalties.
    externalURI: string // nft externalURI.
}

export interface IRoyalties {
    address: string // recipient.
    value: number // amount in bps.
}

export interface TxObject {
    from: string // transaction sender.
    value?: string // value to send.
    gasPrice?: number // gas price.
}

// constructed dynamically
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

// constructed dynamically
export interface IEVMAsset {
    assetType: {
        assetClass: string
        data: string
    }
    value: string
}

// constructed dynamically
export interface IEVMAssetType {
    assetClass: string
    data: string
}
