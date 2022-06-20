import { IBaseContractV2 } from './IBaseContractV2'

export interface ISeriesV2 {
  attrType1?: string
  attrValue1?: string
  attrType2?: string
  attrValue2?: string
  attrType3?: string
  attrValue3?: string
  mode_name?: string
  image?: string
  royalties?: number
  contract: IBaseContractV2
  current_supply: number
  max_supply: number
  burned_supply?: number
  hasLocked: boolean
  type: number
  sold: number
  series_id: number
  series_onchain_id: string
}
