/** Returns attribute keys available for a collection */
export class GetCollectionAttributeKeysRequest {
    /** Collection slug */
    collection_slug!: string
    /** Queriable status */
    queriable?: boolean
}
