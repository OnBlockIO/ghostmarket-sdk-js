import { IStatisticsWeekly } from './IStatisticsWeekly'
import { IStatisticsMonthly } from './IStatisticsMonthly'
import { IStatisticsTotal } from './IStatisticsTotal'

export interface IMarketplaceStatistics {
  weekly?: IStatisticsWeekly
  monthly?: IStatisticsMonthly
  total?: IStatisticsTotal
  currency: string
}
