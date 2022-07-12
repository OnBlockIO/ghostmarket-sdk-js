import { GhostMarketSDK } from './core/sdk.evm'
import { GhostMarketN3SDK } from './core/sdk.n3'
// import { GhostMarketPHASDK } from './core/sdk.pha'
import { GhostMarketApi } from './lib/api/ghostmarket'
import { Network, TEST_ENVIRONMENT, MAIN_ENVIRONMENT } from './types/network'

export {
    GhostMarketApi,
    GhostMarketSDK,
    GhostMarketN3SDK,
    Network,
    TEST_ENVIRONMENT,
    MAIN_ENVIRONMENT,
}
