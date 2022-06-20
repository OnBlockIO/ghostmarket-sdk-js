export interface ISignatureV2 {
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
