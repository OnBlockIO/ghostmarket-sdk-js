import { IEventV2 } from '../../models'
import { IPagedResult } from '../IPagedResult'

export interface IEventsResult extends IPagedResult {
    fiatCurrency: string
    events: IEventV2[]
}
