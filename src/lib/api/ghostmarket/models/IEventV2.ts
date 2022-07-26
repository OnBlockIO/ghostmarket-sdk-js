/* eslint-disable @typescript-eslint/no-unused-vars */
import { IContractInfoV2 } from './IContractInfoV2'
import { IUserInfoV2 } from './IUserInfoV2'

export interface IEventV2 {
    contract: IContractInfoV2
    date: number
    transactionHash: string
    tokenId: string
    eventKind: string
    auctionType: string
    quoteContract: IContractInfoV2
    price: string
    tokenAmount: number
    infusedSymbol: string
    infusedValue: string
    fiatPrice: string
    sourceAddress?: IUserInfoV2
    address: IUserInfoV2
    verified: boolean
    blacklisted?: boolean
    burned?: boolean
    blacklistType?: string
    metadata: {
        name: string
        mediaUri: string
        mediaType: string
        mintNumber: number
    }
    series?: {
        maxSupply: number
    }
    collection?: {
        name: string
        slug: string
        verified: boolean
    }
    groupSize: number
    eventId: number
}
