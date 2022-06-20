import { IChain } from './IChain'
import { IMarketplaceStatistics } from './IMarketplaceStatistics'

export interface IChainStatistics extends IMarketplaceStatistics {
  chain: IChain
}
