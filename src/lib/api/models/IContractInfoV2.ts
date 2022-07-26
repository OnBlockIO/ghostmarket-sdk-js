import { IBaseContractV2 } from './IBaseContractV2'
import { IUserInfoV2 } from './IUserInfoV2'

export interface IContractInfoV2 extends IBaseContractV2 {
    trading: boolean
    owner: IUserInfoV2
    royalties: {
        recipient: IUserInfoV2
        value: number
    }
}
