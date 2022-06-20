import { IOffer } from './IOffer'
import { Asset } from '~/core/plugins/models'

export interface IAssetOffer {
  asset: Asset
  offer: IOffer
}
