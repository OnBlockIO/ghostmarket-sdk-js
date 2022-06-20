import { IResult } from '../../requests/IResult'

export interface IPostSharedAccessSignatureResult extends IResult {
  signature: string
  market: string
}
