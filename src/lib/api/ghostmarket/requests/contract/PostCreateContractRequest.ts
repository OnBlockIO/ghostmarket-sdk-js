import { ISignatureV2 } from './ISignatureV2'

export interface ISignDataCreateContract {
  /** Timestamp until when the operation can be performed */
  timestamp: number

  method: 'ModeratorCreateContract'

  chain: string
  hash: string
  name: string
  transactionHash: string
  owner: string
  symbol: string
  standard: string
  template: string
  hasRoyalties: boolean
  height?: number
  blocksPerRequest?: number
  metadataRetries?: number
  metadataNamePath: string
  metadataDescriptionPath?: string
  metadataImagePath?: string
  metadataMintNumberPath?: string
  metadataAttributesPath?: string
  metadataAttributeKeysPath?: string
  metadataAttributeValuesPath?: string
  metadataAttributeTypesPath?: string
  metadataNameTemplate?: string
  metadataDescriptionDefault?: string
  metadataOnchainExample?: string
  metadataOffchainExample?: string
  externalApi?: string
}

export class PostCreateContractRequest {
  /** Signature */
  signature!: ISignatureV2

  /** data signed */
  data!: ISignDataCreateContract

  public constructor(init: PostCreateContractRequest) {
    ;(<any>Object).assign(this, init)
  }
}
