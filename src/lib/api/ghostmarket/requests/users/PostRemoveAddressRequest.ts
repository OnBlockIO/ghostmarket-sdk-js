import { ISignature } from './ISignature'

export interface ISignDataRemoveAddress {
  /** Timestamp until when the operation can be performed */
  timestamp: number

  /** Method */
  method: 'RemoveAddress'

  /** Chain name of the address to be removed */
  chain: string
  /** Address to be removed */
  address: string
}

export class PostRemoveAddressRequest {
  /** Signature */
  signature!: ISignature

  /** data signed */
  data!: ISignDataRemoveAddress

  public constructor(init: PostRemoveAddressRequest) {
    ;(<any>Object).assign(this, init)
  }
}
