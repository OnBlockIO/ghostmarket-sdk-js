import { IAddressStatisticsWeekly } from './IAddressStatisticsWeekly'
import { IAddressStatisticsMonthly } from './IAddressStatisticsMonthly'
import { IAddressStatisticsTotal } from './IAddressStatisticsTotal'

export interface IUsersStatistics {
    weekly?: IAddressStatisticsWeekly
    monthly?: IAddressStatisticsMonthly
    total?: IAddressStatisticsTotal
}
