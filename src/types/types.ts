import { AbiItem } from 'web3-utils'
/**
 * @param Avalanche Avalanche mainnet
 * @param AvalancheTestnet Avalanche testnet
 * @param BSC BSC mainnet
 * @param BSCTestnet BSC testnet
 * @param Ethereum Ethereum mainnet
 * @param EthereumTestnet Ethereum testnet
 * @param Polygon Polygon mainnet
 * @param PolygonTestnet Polygon testnet
 * @param Neo3 Neo3 mainnet
 * @param Neo3Testnet Neo3 testnet
 * @param Phantasma Phantasma mainnet
 * @param PhantasmaTestnet Phantasma testnet
 */
export enum Network {
    Avalanche = 'Avalanche',
    AvalancheTestnet = 'Avalanche Testnet',
    BSC = 'BSC',
    BSCTestnet = 'BSC Testnet',
    Ethereum = 'Ethereum',
    EthereumTestnet = 'Ethereum Testnet',
    Polygon = 'Polygon',
    PolygonTestnet = 'Polygon Testnet',
    Neo3 = 'Neo3',
    Neo3Testnet = 'Neo3 Testnet',
    Phantasma = 'Phantasma',
    PhantasmaTestnet = 'Phantasma Testnet',
}

/**
 * GhostMarket API config object.
 * @param apiKey Optional key to use for API.
 * @param networkName `Network` type to use. Defaults to `Network.Ethereum` (Ethereum mainnet)
 * @param gasPrice Default gas price to use.
 * @param apiBaseUrl Optional base URL to use for the API.
 * @param providerRPCUrl HTTP provider URL for use for setting up a read only provider.
 * @param useReadOnlyProvider Boolean option enable/disable use of a read only provider that reads only Blockchain state and can't make transactions.
 */
export interface GhostMarketSDKConfig {
    networkName?: Network
    apiKey?: string
    apiBaseUrl?: string
    providerRPCUrl?: string
    useReadOnlyProvider?: boolean
}

/**
 * Order attributes, including orderbook-specific query options
 */
export interface OrderJSONV2 {
    id: number
    chain: string
    tokenContract: string
    tokenId: string
    tokenAmount: string
    quoteContract: string
    quotePrice: string
    makerAddress: string
    startDate: string
    endDate: string
    signature: string
    orderKeyHash: string
    salt: string
    originFees: string
    originAddress: string
}

/**
 * Smart Contract Related types
 */
export type ExchangeV2ABI = Array<AbiItem>

/**
 * Left
 * @param maker Address of the order maker
 * @param makeAsset Asset to be matched
 * @param taker Address of the asset taker
 * @param takeAsset
 * @param salt Unique salt that uniquely identifies an order
 * @param start A unix timestamp when matching of order can start
 * @param end A unix timestamp which matching of order
 * @param dataType
 * @param data
 */
export interface OrderLeft {
    maker: string
    makeAsset: object
    taker: string
    takeAsset: object
    salt: number
    start: Date | number
    end: Date | number
    dataType: string
    data: string
}

export type OrderRight = OrderLeft
/**
 * An EIP712 signature for verifying orders.
 */
export type Signature = string

/**
 * Tx object
 * @param from Transaction sender address
 * @param value Value to send with the Transaction
 * @param gasPrice The Current gasPrice. Optional to let client libs estimate the value.
 */
export interface TxObject {
    from: string
    value: number | string
    gasPrice?: number
    chainId: string
}

export interface Royalties {
    royaltiesRecipients: RoyaltyRecipient[]
}

export interface RoyaltyRecipient {
    recipient: string
    amount: number
}

export type PartialReadonlyContractAbi = AbiItem[]
