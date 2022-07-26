/** Deletes an offchain order */
export class GetRefreshMetadataRequest {
    /** chain */
    chain = ''
    /** token contract */
    contract = ''
    /** token id */
    token_id = ''

    public constructor(init: GetRefreshMetadataRequest) {
        ;(<any>Object).assign(this, init)
    }
}
