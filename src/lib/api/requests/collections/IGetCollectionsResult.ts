import { ICollection } from '../../models'
import { IResult } from '../IResult'

export interface IGetCollectionsResult extends IResult {
    collections: ICollection[]
    total_results?: number
}
