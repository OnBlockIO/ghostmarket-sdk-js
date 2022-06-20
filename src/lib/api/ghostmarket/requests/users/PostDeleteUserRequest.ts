import { ISignature } from './ISignature'

export interface ISignDataDeleteUser {
  /** Timestamp until when the operation can be performed */
  timestamp: number

  /** Method */
  method: 'DeleteUser'

  /** Username (offchain_name) */
  name: string
}

export class PostDeleteUserRequest {
  /** Signature */
  signature!: ISignature

  /** data signed */
  data!: ISignDataDeleteUser

  public constructor(init: PostDeleteUserRequest) {
    ;(<any>Object).assign(this, init)
  }
}
