import { IStatisticsDaily } from '../../models'

/** Returns daily statistics result for any statistics data */
export interface IGetDailyStatisticsResult {
    total_results?: number
    currency: string
    daily: IStatisticsDaily[]
}
