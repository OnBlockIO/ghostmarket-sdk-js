import { IAsset } from '../../models'
import { IResult } from '../IResult'

export interface IGetAssetsResult extends IResult {
    assets: IAsset[]
    total_results?: number
}
