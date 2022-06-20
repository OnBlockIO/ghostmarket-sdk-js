import { ICollection } from './ICollection'
import { IMarketplaceStatistics } from './IMarketplaceStatistics'

export interface ICollectionStatistics extends IMarketplaceStatistics {
  collection: ICollection
}
