/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
const ethUtil = require('ethereumjs-util')

export function id(str: string) {
  const hex = `0x${ethUtil.keccak256(Buffer.from(str)).toString('hex').substring(0, 8)}`
  // console.log("id: "+ str + ": ",hex)
  return hex
}

export function enc(token: string, tokenId: string) {
  if (tokenId) {
    return ethUtil.encodeParameters(['address', 'uint256'], [token, tokenId])
  } else {
    return ethUtil.encodeParameter('address', token)
  }
}

// asset types that can be transfered
export const ETH = id('ETH')
export const ERC20 = id('ERC20')
export const ERC721 = id('ERC721')
export const ERC1155 = id('ERC1155')
export const COLLECTION = id('COLLECTION')

// order types
export const ORDER_DATA_V1 = id('V1')
export const ORDER_DATA_V2 = id('V2')

// used as a variable for emitting event, transferDirection
export const TO_MAKER = id('TO_MAKER')
// used as variable for emitting event, transferDirection
export const TO_TAKER = id('TO_TAKER')
// used as variable for emitting event, transferType
export const PROTOCOL = id('PROTOCOL')
// used as variable for emitting event, transferType
export const ROYALTY = id('ROYALTY')
// used as variable for emitting event, transferType
export const ORIGIN = id('ORIGIN')
// used as variable for emitting event, transferType
export const PAYOUT = id('PAYOUT')
