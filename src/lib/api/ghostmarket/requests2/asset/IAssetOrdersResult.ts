import { IOrderV2 } from '../../models'
import { IPagedResult } from '../IPagedResult'

export interface IAssetOrdersResult extends IPagedResult {
  orders: IOrderV2[]
}
