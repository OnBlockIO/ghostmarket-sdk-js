import { IUserInfoV2 } from '..'

export interface IOwnership {
    amount?: number
    chain: string
    owner: IUserInfoV2
}
