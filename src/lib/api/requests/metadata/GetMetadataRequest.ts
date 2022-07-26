/** Deletes an offchain order */
export class GetMetadataRequest {
    /** chain */
    chain = ''
    /** token contract */
    contract = ''
    /** token id */
    token_id = ''

    public constructor(init: GetMetadataRequest) {
        ;(<any>Object).assign(this, init)
    }
}
