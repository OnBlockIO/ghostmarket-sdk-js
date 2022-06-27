import { ISignature } from './ISignature'

export interface ISignDataAddAddress {
    /** Timestamp until when the operation can be performed */
    timestamp: number

    /** Method */
    method: 'AddAddress'

    /** Address must be the same as signature_add */
    address: string
}

export class PostAddAddressRequest {
    /** Master Signature */
    signature_linked!: ISignature

    /** New Address Signature */
    signature_add!: ISignature

    /** data signed */
    data!: ISignDataAddAddress

    public constructor(init: PostAddAddressRequest) {
        ;(<any>Object).assign(this, init)
    }
}
