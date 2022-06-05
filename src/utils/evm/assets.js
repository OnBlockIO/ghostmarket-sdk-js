/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
const ethUtil = require('ethereumjs-util')

function id(str) {
  const hex = `0x${ethUtil.keccak256(Buffer.from(str)).toString('hex').substring(0, 8)}`
  // console.log("id: "+ str + ": ",hex)
  return hex
}

function enc(web3, token, tokenId) {
  if (tokenId) {
    return web3.eth.abi.encodeParameters(['address', 'uint256'], [token, tokenId])
  } else {
    return web3.eth.abi.encodeParameter('address', token)
  }
}

// asset types that can be transfered
const ETH = id('ETH')
const ERC20 = id('ERC20')
const ERC721 = id('ERC721')
const ERC1155 = id('ERC1155')
const COLLECTION = id('COLLECTION')

// order types
const ORDER_DATA_V1 = id('V1')
const ORDER_DATA_V2 = id('V2')

// used as a variable for emitting event, transferDirection
const TO_MAKER = id('TO_MAKER')
// used as variable for emitting event, transferDirection
const TO_TAKER = id('TO_TAKER')
// used as variable for emitting event, transferType
const PROTOCOL = id('PROTOCOL')
// used as variable for emitting event, transferType
const ROYALTY = id('ROYALTY')
// used as variable for emitting event, transferType
const ORIGIN = id('ORIGIN')
// used as variable for emitting event, transferType
const PAYOUT = id('PAYOUT')

// eslint-disable-next-line no-undef
module.exports = {
  id,
  ETH,
  ERC20,
  ERC721,
  ERC1155,
  COLLECTION,
  ORDER_DATA_V1,
  ORDER_DATA_V2,
  TO_MAKER,
  TO_TAKER,
  PROTOCOL,
  ROYALTY,
  ORIGIN,
  PAYOUT,
  enc,
}
