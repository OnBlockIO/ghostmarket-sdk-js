/** Deletes an offchain order */
export class GetOpenOrdersRequest {
    /** offset */
    offset = 0
    /** limit */
    limit = 50

    public constructor(init?: Partial<GetOpenOrdersRequest>) {
        ;(<any>Object).assign(this, init)
    }
}
