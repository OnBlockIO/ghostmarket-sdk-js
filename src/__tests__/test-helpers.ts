/* eslint-disable @typescript-eslint/ban-ts-comment */
import Web3 from 'web3'
import { MnemonicWalletSubprovider } from '@0x/subproviders'
import ethUtil from 'ethereumjs-util'
// NOTE:
// https://www.npmjs.com/package/web3-provider-engine allow us to create our own custom providers
import Web3ProviderEngine from 'web3-provider-engine'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore : web3-provider-engine/subproviders/rpc.js' implicitly has an 'any' type.
import RPCProvider = require('web3-provider-engine/subproviders/rpc.js')

export function createRinkebyProvider() {
  const BASE_DERIVATION = `44'/60'/0'/0`
  const MNEMONIC = 'hill coyote hungry green glass provide valve rookie mad tell capable vintage'

  const mnemonicWalletProvider = new MnemonicWalletSubprovider({
    mnemonic: MNEMONIC,
    baseDerivationPath: BASE_DERIVATION,
  })

  const infuraRPCUrl = 'https://rinkeby.infura.io/v3/73cf78206642489d9a34dd2eccd3c593'

  const infuraRPCProvider = new RPCProvider({
    rpcUrl: infuraRPCUrl,
  })

  const providerEngine = new Web3ProviderEngine()
  providerEngine.addProvider(mnemonicWalletProvider)
  providerEngine.addProvider(infuraRPCProvider)
  return providerEngine
}

// Assets: https://github.com/selimerunkut/nft_market_contracts/blob/main/test/assets.js
export function AssetType(assetClass: string, data: string) {
  return { assetClass, data }
}

export function Asset(assetClass: string, assetData: string, value: number) {
  return { assetType: AssetType(assetClass, assetData), value }
}

// EIP712 schema: https://github.com/selimerunkut/nft_market_contracts/blob/main/test/EIP712.js
const DOMAIN_TYPE = [
  {
    type: 'string',
    name: 'name',
  },
  {
    type: 'string',
    name: 'version',
  },
  {
    type: 'uint256',
    name: 'chainId',
  },
  {
    type: 'address',
    name: 'verifyingContract',
  },
]

// https://eips.ethereum.org/EIPS/eip-712#simple-summary : eth_signTypedData RPC method response
interface Result {
  error?: string
  id: number
  jsonrpc: string
  result: string
}

export const EIP712 = {
  createTypeData: function (
    domainData: object,
    primaryType: string,
    message: string | object,
    types: object,
  ) {
    return {
      types: Object.assign(
        {
          EIP712Domain: DOMAIN_TYPE,
        },
        types,
      ),
      domain: domainData,
      primaryType: primaryType,
      message: message,
    }
  },

  signTypedData: function (web3: Web3, from: string, data: object) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      function cb(err: Error, result: Result) {
        if (err) {
          return reject(err)
        }
        if (result.error) {
          return reject(result.error)
        }

        const sig = result.result
        const sig0 = sig.substring(2)
        const r = '0x' + sig0.substring(0, 64)
        const s = '0x' + sig0.substring(64, 128)
        const v = parseInt(sig0.substring(128, 130), 16)

        resolve({
          data,
          sig,
          v,
          r,
          s,
        })
      }
      if (web3) {
        // @ts-ignore
        let send = web3?.currentProvider?.sendAsync
        // @ts-ignore
        if (!send) send = web3?.currentProvider?.send
        send.bind(web3.currentProvider)(
          {
            jsonrpc: '2.0',
            method: 'eth_signTypedData',
            params: [from, data],
            id: new Date().getTime(),
          },
          cb,
        )
      }
    })
  },
}

// Order: https://github.com/selimerunkut/nft_market_contracts/blob/main/test/order.js
export function Order(
  maker: string,
  makeAsset: object,
  taker: string,
  takeAsset: object,
  salt: number,
  start: Date | number,
  end: Date | number,
  dataType: string,
  data: string,
) {
  return { maker, makeAsset, taker, takeAsset, salt, start, end, dataType, data }
}

const Types = {
  AssetType: [
    { name: 'assetClass', type: 'bytes4' },
    { name: 'data', type: 'bytes' },
  ],
  Asset: [
    { name: 'assetType', type: 'AssetType' },
    { name: 'value', type: 'uint256' },
  ],
  Order: [
    { name: 'maker', type: 'address' },
    { name: 'makeAsset', type: 'Asset' },
    { name: 'taker', type: 'address' },
    { name: 'takeAsset', type: 'Asset' },
    { name: 'salt', type: 'uint256' },
    { name: 'start', type: 'uint256' },
    { name: 'end', type: 'uint256' },
    { name: 'dataType', type: 'bytes4' },
    { name: 'data', type: 'bytes' },
  ],
}

export async function getSignature(
  web3: Web3,
  order: object,
  account: string,
  verifyingContract: string,
): Promise<unknown> {
  const chainId = Number(await web3.eth.getChainId())
  console.info('chainId: ', chainId)
  const data: object = EIP712.createTypeData(
    {
      name: 'GhostMarket',
      version: '2',
      chainId,
      verifyingContract,
    },
    'Order',
    order,
    Types,
  )
  try {
    const result = await EIP712.signTypedData(web3, account, data)
    return result
  } catch (err) {
    console.error(`getSignature failed with`, err)
  }
}

export function generateHexId(str: string) {
  const hexId = `0x${ethUtil.keccak256(Buffer.from(str)).toString('hex').substring(0, 8)}`
  console.info('id: ' + str + ': ', hexId)
  return hexId
}

export function encodeTokenParams(web3: Web3, token: string, tokenId: string) {
  if (tokenId) return web3.eth.abi.encodeParameters(['address', 'uint256'], [token, tokenId])
  else return web3.eth.abi.encodeParameter('address', token)
}

//asset types that can be transfered
export const ETH = generateHexId('ETH')
export const ERC20 = generateHexId('ERC20')
export const ERC721 = generateHexId('ERC721')
export const ERC1155 = generateHexId('ERC1155')
export const ORDER_DATA_V1 = generateHexId('V1')

//for transferDirection and transferType see contracts/SimpleTransferManager.sol
// used as a variable for emitting event, transferDirection
export const TO_MAKER = generateHexId('TO_MAKER')
// used as variable for emitting event, transferDirection
export const TO_TAKER = generateHexId('TO_TAKER')
// used as variable for emitting event, transferType
export const PROTOCOL = generateHexId('PROTOCOL')
// used as variable for emitting event, transferType
export const ROYALTY = generateHexId('ROYALTY')
// used as variable for emitting event, transferType
export const ORIGIN = generateHexId('ORIGIN')
// used as variable for emitting event, transferType
export const PAYOUT = generateHexId('PAYOUT')
