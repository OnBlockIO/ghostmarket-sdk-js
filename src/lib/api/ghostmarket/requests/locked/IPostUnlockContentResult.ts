import { IResult } from '../IResult'

export interface IPostUnlockContentResult extends IResult {
    locked_content: string
    unlocked_content: string
}
