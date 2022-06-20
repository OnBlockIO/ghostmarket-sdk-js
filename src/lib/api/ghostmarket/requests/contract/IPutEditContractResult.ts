import { IResult } from '../IResult'

export interface IPutEditContractResult extends IResult {
  success: boolean
  slug: string
}
