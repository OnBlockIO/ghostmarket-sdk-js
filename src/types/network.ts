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
