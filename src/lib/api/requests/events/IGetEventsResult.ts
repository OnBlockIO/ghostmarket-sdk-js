import { IEvent } from '../../models'
import { IResult } from '../IResult'

export interface IGetEventsResult extends IResult {
    events: IEvent[]
    total_results?: number
    error?: string
}
