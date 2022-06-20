import { IResult } from '../IResult'

export interface IPostCreateContractResult extends IResult {
  success: boolean
  slug: string
}
