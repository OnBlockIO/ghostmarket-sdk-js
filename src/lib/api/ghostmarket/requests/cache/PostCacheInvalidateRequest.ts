import { ISignature } from './ISignature'

export interface ISignDataCacheInvalidate {
  /** Timestamp until when the operation can be performed */
  timestamp: number

  method: 'InvalidateCache'

  /** Tag to invalidate */
  tag: string
}

export class PostCacheInvalidateRequest {
  /** Signature */
  signature!: ISignature

  /** data signed */
  data!: ISignDataCacheInvalidate

  public constructor(init: PostCacheInvalidateRequest) {
    ;(<any>Object).assign(this, init)
  }
}
