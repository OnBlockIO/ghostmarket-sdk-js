export interface ISignatureV2 {
    /** Timestamp until when the operation can be performed */
    timestamp: number
    /** Chain name */
    chain: string
    /** Siganture */
    signature: string
    /** Public key of signing address */
    publicKey: string
    /** Random prefix of data for signature */
    randomPrefix: string
}

export interface IDataSignatureV2 {
    timestamp: number
    method: string
}
