/** Returns incentives rewards for chain */
export class GetRewardsChain {
    /** Default value 0 **/
    offset = 0
    /** Default value 100 **/
    limit = 100
    /** Chain name (ex. 'PHA') */
    chain = ''

    public constructor(init?: Partial<GetRewardsChain>) {
        ;(<any>Object).assign(this, init)
    }
}
