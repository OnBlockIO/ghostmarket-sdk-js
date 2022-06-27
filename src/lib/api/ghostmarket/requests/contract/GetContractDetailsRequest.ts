/** Returns informations for a specific chain / transaction hash */
export class GetContractDetailsRequest {
    /** Contract Chain */
    chain!: string
    /** Contract Transaction Hash */
    transactionHash?: string
    /** Contract Hash */
    hash?: string
}
