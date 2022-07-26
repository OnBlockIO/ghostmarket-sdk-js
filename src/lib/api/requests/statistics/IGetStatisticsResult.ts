import {
    IChainStatistics,
    ICollectionStatistics,
    IDeveloperStatisticsTotal,
    IMarketplaceStatistics,
} from '../../models'
import { IResult } from '../IResult'

export interface IGetStatisticsResult extends IResult {
    total_results: number
    currency: string
    collection_statistics: ICollectionStatistics[]
    chain_statistics: IChainStatistics[]
    marketplace_statistics?: IMarketplaceStatistics
    developer_statistics?: IDeveloperStatisticsTotal
}
