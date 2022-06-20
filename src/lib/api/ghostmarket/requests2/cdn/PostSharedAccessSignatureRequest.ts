import { ISignature } from './ISignature'

export interface ISignDataSharedAccess {
  /** Timestamp until when the operation can be performed */
  timestamp: number

  method: 'GetSharedAccessSignature'

  /** Slug (for collections) */
  slug?: string
  /** username (for users) */
  user?: string
}

export class PostSharedAccessSignatureRequest {
  /** Signature */
  signature!: ISignature

  /** data signed */
  data!: ISignDataSharedAccess

  public constructor(init: PostSharedAccessSignatureRequest) {
    ;(<any>Object).assign(this, init)
  }
}
