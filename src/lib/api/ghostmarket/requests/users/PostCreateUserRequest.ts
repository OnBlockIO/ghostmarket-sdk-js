import { ISignature } from './ISignature'

export interface ISignDataCreateUser {
    /** Timestamp until when the operation can be performed */
    timestamp: number

    /** Method */
    method: 'CreateUser'

    /** Name of the user */
    name: string
}

export class PostCreateUserRequest {
    /** Signature */
    signature!: ISignature

    /** data signed */
    data!: ISignDataCreateUser

    public constructor(init: PostCreateUserRequest) {
        ;(<any>Object).assign(this, init)
    }
}
