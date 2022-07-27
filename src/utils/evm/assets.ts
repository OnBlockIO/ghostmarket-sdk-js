import web3 from 'web3'
const Web3 = new web3()

function id(str: string): string {
    const hex = `${Web3.utils
        .keccak256(str)
        .toString()
        .substring(0, 2 + 8)}`
    return hex
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
// used as a variable for emitting event, transferDirection
export const TO_TAKER = id('TO_TAKER')
// used as a variable for emitting event, transferType
export const PROTOCOL = id('PROTOCOL')
// used as a variable for emitting event, transferType
export const ROYALTY = id('ROYALTY')
// used as a variable for emitting event, transferType
export const ORIGIN = id('ORIGIN')
// used as a variable for emitting event, transferType
export const PAYOUT = id('PAYOUT')
