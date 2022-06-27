import { ISignature } from './ISignature'

export interface ISignDataBlacklistSeries {
    /** Timestamp until when the operation can be performed */
    timestamp: number

    method: 'ModeratorBlacklistSeries'

    /** Chain name (ex. 'PHA') */
    chain: string
    /** Contract id */
    contract: string
    /** Series to (un)blacklist */
    series: string
    /** On - Off toggle */
    blacklist: boolean
    /** Reason to (un)blacklist */
    reason: string
}

export class PostBlacklistSeriesRequest {
    /** Signature */
    signature!: ISignature

    /** data signed */
    data!: ISignDataBlacklistSeries

    public constructor(init: PostBlacklistSeriesRequest) {
        ;(<any>Object).assign(this, init)
    }
}
