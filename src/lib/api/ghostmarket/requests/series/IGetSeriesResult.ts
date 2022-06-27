import { ISeries } from '../../models'
import { IResult } from '../IResult'

export interface IGetSeriesResult extends IResult {
    series: ISeries[]
    total_results: number
}
