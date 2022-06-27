import { INftAttribute } from '../../models'
import { IPagedResult } from '../IPagedResult'

export interface IAssetAttributesResult extends IPagedResult {
    attributes: INftAttribute[]
}
