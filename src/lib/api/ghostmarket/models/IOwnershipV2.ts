import { IUserInfoV2 } from '..'

export interface IOwnershipV2 {
  amount?: number
  chain: string
  owner: IUserInfoV2
}
