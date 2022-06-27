import { ISignature } from './ISignature'

export interface ISignDataCollectionAttributesReprocess {
    /** Timestamp until when the operation can be performed */
    timestamp: number

    method: 'ModeratorCollectionAttributeReprocess'

    /** Slug of the collection */
    slug: string
    /** Breaks the connection between AttributeKey, AttributeValue and Nft. This information is only stored in the main database. */
    remove_connection: boolean
    /** Deletes the AttributeKeys in the main database and triggers a synchronisation to fetch the attribute keys in user database. */
    remove_main_keys: boolean
    /** Deletes AttributesKeys in user AND main database, AttributeValues in user AND main database and removes the connection between
     *  AttributeKey, AttributeValue and Nft in main database.
     *  This may lead to a loss of information and requires a backend restart to restore attribute keys configured in the backend configuration files. */
    remove_user_keys: boolean
    /** Deletes AttributeValues in user AND main database and removes the connection between AttributeKey, AttributeValue and Nft in main database This may
     * lead to a loss of information and requires a backend restart to restore attribute value mapping configured in the backend configuration files. */
    remove_values: boolean
    /** Force a refetching onchain and offchain metadata. This may lead to performance issues, due to querying data for all NFTs in this collection.
     * Backend may be rate limited by external resources */
    metadata_force_refetch: boolean
    /** Queue all NFTs for being reprocess in the collection */
    metadata_update: boolean
}

export class PostCollectionAttributesReprocessRequest {
    /** Signature */
    signature!: ISignature

    /** data signed */
    data!: ISignDataCollectionAttributesReprocess

    public constructor(init: PostCollectionAttributesReprocessRequest) {
        ;(<any>Object).assign(this, init)
    }
}
