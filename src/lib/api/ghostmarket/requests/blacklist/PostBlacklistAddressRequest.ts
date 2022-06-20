import { ISignature } from './ISignature'

export interface ISignDataBlacklistAddress {
  /** Timestamp until when the operation can be performed */
  timestamp: number

  method: 'ModeratorBlacklistAddress'

  /** Chain name (ex. 'PHA') */
  chain: string
  /** Address to (un)blacklist */
  address: string
  /** On - Off toggle */
  blacklist: boolean
  /** Reason to (un)blacklist */
  reason: string
}

export class PostBlacklistAddressRequest {
  /** Signature */
  signature!: ISignature

  /** data signed */
  data!: ISignDataBlacklistAddress

  public constructor(init: PostBlacklistAddressRequest) {
    ;(<any>Object).assign(this, init)
  }
}
