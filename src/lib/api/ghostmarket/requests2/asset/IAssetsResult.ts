import { IAssetV2 } from '../../models'
import { IPagedResult } from '../IPagedResult'

export interface IAssetsResult extends IPagedResult {
    fiatCurrency: string
    assets: IAssetV2[]
}
