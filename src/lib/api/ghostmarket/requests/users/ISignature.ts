export interface ISignature {
    /** Timestamp until when the operation can be performed */
    timestamp: number
    /** Chain name */
    chain: string
    /** Siganture */
    signature: string
    /** Public key of signing address */
    public_key: string
    /** Random prefix of data for signature */
    random_prefix: string
}

export interface IDataSignature {
    timestamp: number
    method: string
}
