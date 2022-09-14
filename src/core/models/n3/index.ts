export interface IBuyItem {
    contractAuctionId: string // on chain contract auction ID.
    price: string // order price.
    quoteContract: string // order quote contract address.
    isCancellation?: boolean // is it a cancellation.
}

export interface ISellItem {
    tokenId: string // order NFT tokenId.
    baseContract: string // order base contract address.
    price: string // order price.
    quoteContract: string // order quote contract address.
    startDate?: number // order start date.
    endDate?: number // order end date - set to 0 for unexpiring.
}

export interface IBidItem {
    contractAuctionId: string // on chain contract auction ID.
    bidPrice?: string // order bid price.
    quoteContract: string // order quote contract address.
}

export interface ITransferItem {
    baseContract: string // NFT contract address.
    destination: string // destination address.
    tokenId: string // NFT tokenId.
}

export interface IBurnItem {
    contractAddress: string // NFT contract address.
    tokenId: string // NFT tokenId.
}

export interface IAuctionItem {
    auctionType: number // classic (1) reserve (2) dutch (3) fixed (0).
    tokenId: string // auction NFT tokenId.
    baseContract: string // auction base contract address.
    extensionPeriod: number // auction extension period.
    startDate?: number // auction start date.
    endDate?: number // auction end date
    startPrice: string // auction start price.
    endPrice: string // auction end price.
    quoteContract: string // auction quote contract address.
}

export interface IOfferItem {
    baseContract: string // offer base contract address.
    quoteContract: string // offer quote contract address.
    tokenId?: string // offer tokenId.
    price: string // offer price.
    startDate?: number // offer start date.
    endDate?: number // offer end date.
}

export interface IProcessOfferItem {
    contractAuctionId: string // on chain contract auction ID.
    quoteContract: string // quote contract address to use in offer.
    tokenId?: string // tokenId of nft to use in offer.
    isCancellation?: boolean // is it an offer (true) or a cancellation (false).
}

export interface IMintItem {
    quantity?: number // NFT quantity.
    attrT1?: string // NFT Attr Type 1.
    attrV1?: string // NFT Attr Value 1.
    attrT2?: string // NFT Attr Type 2.
    attrV2?: string // NFT Attr Value 2.
    attrT3?: string // NFT Attr Type 3.
    attrV3?: string // NFT Attr Value 3.
    name: string // NFT name.
    description: string // NFT description.
    imageURL: string // image URL.
    externalURI?: string // external URI.
    royalties?: IRoyalties[] // royalties.
    type?: string // NFT Type.
}

export interface IRoyalties {
    address: string // recipient.
    value: number // amount in bps.
}

export interface IArgs {
    type: string
    value: string | any
}

export interface TxObject {
    from: string // transaction sender.
    networkFee?: string // network fee.
    systemFee?: string // system fee.
}

export enum Method {
    BID_TOKEN = 'bidToken',
    CANCEL_SALE = 'cancelSale',
    LIST_TOKEN = 'listToken',
    EDIT_SALE = 'editSale',
    TRANSFER = 'transfer',
    BURN = 'burn',
    MINT = 'mint',
    MULTI_MINT = 'multiMint',
    SET_ROYALTIES_FOR_CONTRACT = 'setRoyaltiesForContract',
    CLAIM = 'claim',
    GET_INCENTIVE = 'getIncentive',
    BALANCE_OF = 'balanceOf',
    APPROVE = 'approve',
    ALLOWANCE = 'allowance',
    PLACE_OFFER = 'placeOffer',
    ACCEPT_OFFER = 'acceptOffer',
    CANCEL_OFFER = 'cancelOffer',
    GET_CONTRACT = 'getContract',
    OWNER_OF = 'ownerOf',
    READ_LP_STAKES = 'getStakingAmount',
    READ_LP_REWARDS = 'checkFLM',
    CLAIM_LP_INCENTIVES = 'claimFLM',
    STAKE_LP = 'transfer',
    UNSTAKE_LP = 'refund',
    SWAP_TOKEN_OUT_FOR_TOKEN_IN = 'swapTokenOutForTokenIn',
}

export enum Standard {
    NEP_11 = 'NEP-11',
    NEP_17 = 'NEP-17',
    NEP_17_1 = 'NEP-17-1',
}
