import { ICollection } from './ICollection'
import { IInfusedInto } from './IInfusedInto'
import { IInfusion } from './IInfusion'
import { INftMetadata } from './INftMetadata'
import { IOwnership } from './IOwnership'
import { ISeriesV2 } from './ISeriesV2'
import { ISocial } from './ISocial'
import { IUserInfo } from './IUserInfo'
import { IFees } from './IFees'
import { IBaseContractV2 } from './IBaseContractV2'
import { ILastSale } from './ILastSale'

export interface INftMain {
  token_id: string
  creator: IUserInfo
  royalties?: IFees
  social: ISocial
  ownerships: IOwnership[]
  // owner: string;
  // owner_name: string;
  contract: IBaseContractV2
  api_url: string
  nft_type: string[]
  verified: number
  collection: ICollection
  background_color: string
  nft_metadata: INftMetadata
  series: ISeriesV2
  infusion?: IInfusion[]
  infused_into?: IInfusedInto
  last_sale: ILastSale
  blacklisted: number
  blacklist_type: string
  burned: number
}
