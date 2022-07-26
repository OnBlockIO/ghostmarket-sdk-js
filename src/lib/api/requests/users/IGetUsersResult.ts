import { IUser } from '../../models'
import { IResult } from '../IResult'

export interface IGetUsersResult extends IResult {
    users: IUser[]
    total_results?: number
}
