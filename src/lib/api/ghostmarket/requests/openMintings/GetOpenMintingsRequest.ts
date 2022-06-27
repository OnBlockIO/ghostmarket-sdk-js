export class GetOpenMintingsRequest {
    /** Offset */
    public offset?: number = 0
    /** Limit */
    public limit?: number = 50

    public constructor(init?: Partial<GetOpenMintingsRequest>) {
        if (init) {
            Object.assign(this, init)
        }
    }
}
