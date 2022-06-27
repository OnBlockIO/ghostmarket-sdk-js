import { IResult } from '../IResult'

export interface IPutPublishCollectionResult extends IResult {
    success: boolean
    slug: string
}
