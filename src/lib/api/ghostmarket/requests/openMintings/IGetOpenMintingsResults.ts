import { IOpenAsset } from '../../models'
import { IResult } from '../IResult'

export interface IGetOpenMintingsResult extends IResult {
  open_mintings: IOpenAsset[]
}
