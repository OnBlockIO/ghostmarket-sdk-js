import { IResult } from '../IResult'

export interface ICollectionAttributeKey {
    id: number
    key?: string
    display_name: string
    display_type?: string
    path?: string
    queriable: boolean
}

export interface IGetCollectionAttributeKeysResult extends IResult {
    total_count: number
    attributes: ICollectionAttributeKey[]
}
