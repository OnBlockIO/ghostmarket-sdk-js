import { IResult } from '../IResult'

export interface IGetReferralsResult extends IResult {
    referral_id: string
    addresses: string[]
}
