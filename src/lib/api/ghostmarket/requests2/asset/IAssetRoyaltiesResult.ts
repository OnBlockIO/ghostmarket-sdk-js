import { IUserInfoV2 } from '../../models'
import { IPagedResult } from '../IPagedResult'

export interface IAssetRoyaltiesResult extends IPagedResult {
  royalties: {
    nftRoyalties: {
      recipient: IUserInfoV2
      value: number
    }
    collectionRoyalties: {
      recipient: IUserInfoV2
      value: number
    }
  }
}
