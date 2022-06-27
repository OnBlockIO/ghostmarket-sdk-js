import { IResult } from '../IResult'

export interface IGetContractDetailsResult extends IResult {
    blocksPerRequest: number
    template: string
    hasRoyalties: boolean
    hash: string
    height: number
    metadataAttributeKeysPath: string
    metadataAttributeTypesPath: string
    metadataAttributeValuesPath: string
    metadataAttributesPath: string
    metadataDescriptionPath: string
    metadataImagePath: string
    metadataNamePath: string
    metadataOffchainExample: string
    metadataOffchainExampleUri: string
    metadataRetries: number
    metadataMintNumberPath: string
    metadataNameTemplate: string
    metadataDescriptionDefault: string
    externalApi: string
    name: string
    owner: string
    standard: string
    symbol: string
    transactionHash: string
}
