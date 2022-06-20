import { ISignature } from './ISignature'

export interface ISignDataNsfwSeries {
  /** Timestamp until when the operation can be performed */
  timestamp: number

  method: 'ModeratorNsfwSeries'

  /** Chain name (ex. 'PHA') */
  chain: string
  /** Contract id */
  contract: string
  /** Series to (un)blacklist */
  series: string
  /** On - Off toggle */
  nsfw: boolean
  /** Reason to (un)blacklist */
  reason: string
}

export class PostNsfwSeriesRequest {
  /** Signature */
  signature!: ISignature

  /** data signed */
  data!: ISignDataNsfwSeries

  public constructor(init: PostNsfwSeriesRequest) {
    ;(<any>Object).assign(this, init)
  }
}
