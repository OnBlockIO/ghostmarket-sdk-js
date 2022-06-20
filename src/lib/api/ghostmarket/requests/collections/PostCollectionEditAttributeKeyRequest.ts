import { ISignature } from './ISignature'

export interface ISignDataCollectionEditAttributeKey {
  /** Timestamp until when the operation can be performed */
  timestamp: number

  method: 'ModeratorEditAttributeKey'

  /** Slug of the collection */
  slug: string
  attribute_keys: {
    id: number
    display_name: string
    queriable: boolean
  }[]
}

export class PostCollectionEditAttributeKeyRequest {
  /** Signature */
  signature!: ISignature

  /** data signed */
  data!: ISignDataCollectionEditAttributeKey

  public constructor(init: PostCollectionEditAttributeKeyRequest) {
    ;(<any>Object).assign(this, init)
  }
}
