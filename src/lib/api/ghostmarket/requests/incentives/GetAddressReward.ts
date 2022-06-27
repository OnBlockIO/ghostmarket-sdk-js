/** Returns incentives rewards for address */
export class GetAddressReward {
    /** Address to query */
    address = ''
    /** Chain name (ex. 'PHA') */
    chain = ''

    public constructor(init?: Partial<GetAddressReward>) {
        ;(<any>Object).assign(this, init)
    }
}
