import { ICollectionAttribute } from '../../models'
import { IResult } from '../IResult'

export interface IGetCollectionAttributesResult extends IResult {
  attributes: ICollectionAttribute[]
}
