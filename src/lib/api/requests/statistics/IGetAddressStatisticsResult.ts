import { IAddressStatistics } from '../../models'
import { IResult } from '../IResult'

export interface IGetAddressStatisticsResult extends IResult {
    total_results: number
    statistics: IAddressStatistics[]
}
