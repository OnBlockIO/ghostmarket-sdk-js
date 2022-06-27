import { ISignatureV2 } from './ISignatureV2'

export interface ISignDataEditContract {
    /** Timestamp until when the operation can be performed */
    timestamp: number

    method: 'ModeratorEditContract'

    chain: string
    hash: string
    name?: string
    transactionHash?: string
    owner?: string
    symbol?: string
    standard?: string
    template?: string
    hasRoyalties?: boolean
    enabled?: boolean
    useApiCache?: boolean
    trading?: boolean
    height?: number
    blocksPerRequest?: number
    syncedHeight?: number
    metadataRetries?: number
    metadataNamePath?: string
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

export class PutEditContractRequest {
    /** Signature */
    signature!: ISignatureV2

    /** data signed */
    data!: ISignDataEditContract

    public constructor(init: PutEditContractRequest) {
        ;(<any>Object).assign(this, init)
    }
}
