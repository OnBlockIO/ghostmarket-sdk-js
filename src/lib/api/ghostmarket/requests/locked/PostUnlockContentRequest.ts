import { ISignature } from '../users/ISignature'

export interface IPostUnlockContentData {
    /** Timestamp until when the operation can be performed */
    timestamp: number

    /** Method */
    method: 'UnlockContent'

    /** Content to lock or unlock (Base 16) */
    content: string
    /** Contract (symbol) */
    contract?: string
    /** Token ID */
    token_id?: any
}

export class PostUnlockContentRequest {
    /** Unlock request signature */
    signature!: ISignature

    data!: IPostUnlockContentData

    public constructor(init: PostUnlockContentRequest) {
        ;(<any>Object).assign(this, init)
    }
}
