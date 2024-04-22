import { GhostMarketSDK } from './core/sdk.evm'
import { GhostMarketN3SDK } from './core/sdk.n3'

// import { GhostMarketPHASDK } from './core/sdk.pha'
import { ChainNetwork, GhostMarketApi } from '@onblockio/gm-api-js'
import { TESTNET_API_URL, MAINNET_API_URL } from './core/constants'

export {
    GhostMarketApi,
    GhostMarketSDK,
    GhostMarketN3SDK,
    // GhostMarketPHASDK,
    ChainNetwork,
    TESTNET_API_URL,
    MAINNET_API_URL,
}
