import { ISignature } from './ISignature'

export interface ISignDataBlacklistUser {
  /** Timestamp until when the operation can be performed */
  timestamp: number

  method: 'ModeratorBlacklistUser'

  /** Offhain name */
  offchain_name: string
  /** On - Off toggle */
  blacklist: boolean
  /** Reason to (un)blacklist */
  reason: string
}

export class PostBlacklistUserRequest {
  /** Signature */
  signature!: ISignature

  /** data signed */
  data!: ISignDataBlacklistUser

  public constructor(init: PostBlacklistUserRequest) {
    ;(<any>Object).assign(this, init)
  }
}
