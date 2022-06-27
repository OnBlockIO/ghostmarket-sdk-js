import { ISignatureV2 } from './ISignatureV2'

export interface ISignDataPublishCollection {
    /** Timestamp until when the operation can be performed */
    timestamp: number

    method: 'ModeratorPublishCollection'

    collection: string

    dismiss: boolean
}

export class PutPublishCollectionRequest {
    /** Signature */
    signature!: ISignatureV2

    /** data signed */
    data!: ISignDataPublishCollection

    public constructor(init: PutPublishCollectionRequest) {
        ;(<any>Object).assign(this, init)
    }
}
