/* eslint-disable @typescript-eslint/no-unused-vars */
import Web3ProviderEngine from 'web3-provider-engine'
import Web3 from 'web3'

import { createGoerliProvider } from '../utils/create-goerli-provider'
import { GhostMarketSDK } from '../../sdk'
import {
  GhostMarketAPIConfig,
  OrderLeft,
  Network,
  OrderRight,
  TxObject,
  ExchangeV2ABI,
} from '../../types'

import { enc, ERC1155, ETH } from '../utils/assets'
import { Order, Asset, sign } from '../utils/order'
import {
  API_BASE_TESTNET,
  EXCHANGEV2_PROXY_ADDRESS_ETHEREUM_TESTNET,
  NULL_ADDRESS,
} from '../../constants'
import ERC1155ABI from '../../abis/ERC1155Abi.json'
import { GhostMarketAPI } from '../../api'

/**
 * @param  {Web3} web3
 * @param  {string} account1
 * @param  {string} account2
 * @returns orderRight, orderLeft
 */
async function prepareERC1155Orders(
  web3: Web3,
  account1: string,
  account2: string,
): Promise<{
  orderRight: OrderRight
  orderLeft: OrderLeft
}> {
  const contractHash = '0xbf49984e4A7924FE9d05A6B5D1F8d4C1b137660c'
  const tokenId = 4

  const orderLeft = Order(
    account2,
    Asset(ETH, '0x', 200),
    NULL_ADDRESS,
    Asset(ERC1155, enc(web3, contractHash, tokenId.toString()), 4),
    1,
    0,
    0,
    '0xffffffff',
    '0x',
  )

  const orderRight = Order(
    account1,
    Asset(ERC1155, enc(web3, contractHash, tokenId.toString()), 4),
    NULL_ADDRESS,
    Asset(ETH, '0x', 200),
    1,
    0,
    0,
    '0xffffffff',
    '0x',
  )
  return { orderLeft, orderRight }
}

/**
 * Generate an EIP712 signature for an order
 * @param  {Web3} web3 Web3 instance
 * @param  {object} order
 * @param  {string} from
 * @param  {string} verifyingContract
 */
async function getSignature(web3: Web3, order: object, from: string, verifyingContract: string) {
  return sign(web3, order, from, verifyingContract)
}

describe('GhostMarket API Post', () => {
  const ghostmarketBaseAPIUrl = API_BASE_TESTNET

  const ghostMarketAPIConfig: GhostMarketAPIConfig = {
    networkName: Network.EthereumTestnet,
    apiKey: process.env.GM_API_KEY,
    apiBaseUrl: ghostmarketBaseAPIUrl,
    providerRPCUrl: '',
    useReadOnlyProvider: false,
  }

  let provider: Web3ProviderEngine
  let web3: Web3
  let accounts: Array<string>
  let account1: string
  let account2: string
  let GhostMarket: GhostMarketSDK

  beforeAll(async () => {
    provider = createGoerliProvider()
    provider.start()

    web3 = new Web3(provider)
    accounts = await web3.eth.getAccounts()
    account1 = accounts[0]
    account2 = accounts[1]
    GhostMarket = new GhostMarketSDK(provider, ghostMarketAPIConfig)
  })

  afterAll(() => {
    provider.stop()
  })

  describe('Orders', () => {
    it('should not be able to list n3 tokens', async () => {
      const nftToList = {
        chain: 'n3',
        token_contract: NULL_ADDRESS,
        token_id: '',
        token_amount: 0,
        quote_contract: '',
        quote_price: '0',
        maker_address: '',
        is_buy_offer: false,
        start_date: 0,
        end_date: 0,
        signature: '',
        order_key_hash: '',
        salt: '',
        origin_fees: 0,
        origin_address: '',
      }

      const listing = await GhostMarket.api.createOpenOrder(nftToList)
      expect(listing).toHaveProperty('error')
      expect(listing.error).toBe(
        `Token contract '0000000000000000000000000000000000000000/n3' is not supported by backend (main db).`,
      )
    }, 10000)

    it('should not be able to list unaccepted quote_contract', async () => {
      const nftToList = {
        chain: 'etht',
        token_contract: '0xd35b5d7e184013233cc43139dc7242223ec0a708',
        token_id: '',
        token_amount: 0,
        quote_contract: NULL_ADDRESS,
        quote_price: '0',
        maker_address: '',
        is_buy_offer: false,
        start_date: 0,
        end_date: 0,
        signature: '',
        order_key_hash: '',
        salt: '',
        origin_fees: 0,
        origin_address: '',
      }

      const listing = await GhostMarket.api.createOpenOrder(nftToList)
      expect(listing).toHaveProperty('error')
      expect(listing.error).toBe(
        `Token contract 'd35b5d7e184013233cc43139dc7242223ec0a708/etht' is not supported by backend (main db).`,
      )
    }, 10000)
  })
  /* it('should not match orders blabla', async () => {
      const { orderLeft, orderRight } = await prepareERC1155Orders(web3, account1, account2)

      // This is an ExchangeV2Proxy contract address
      const verifyingContract = EXCHANGEV2_PROXY_ADDRESS_ETHEREUM_TESTNET
      const signatureRight = await getSignature(web3, orderRight, account1, verifyingContract)
      const signatureLeft = await getSignature(web3, orderLeft, account2, verifyingContract)

      const txObject: TxObject = {
        value: 300,
        from: account1,
        chainId: web3.utils.toHex(4),
      }

      console.info(txObject)

      const txResult = await GhostMarket.matchOrders(
        orderLeft,
        signatureLeft,
        orderRight,
        signatureRight,
        txObject,
      )
      // Note: call to contract method via proxy contract returns`true` for sucessful transaction and `false` for a failed transaction
      expect(txResult).toBe(false)
    }, 20000)
  }) */

  /* it('should cancel an Order', async () => {
    const { orderLeft, orderRight } = await prepareERC1155Orders(web3, account1, account2)
    const txObject: TxObject = {
      from: account1,
      value: 300,
      chainId: web3.utils.toHex(4),
    }
    // console.log("txObject",txObject)
    // console.log("orderRight",orderRight)

    const verifyingContract = EXCHANGEV2_PROXY_ADDRESS_ETHEREUM_TESTNET
    const signatureRight = await getSignature(web3, orderRight, account1, verifyingContract)
    const signatureLeft = await getSignature(web3, orderLeft, account2, verifyingContract)

    const cancelOrderResult = await GhostMarket.cancelOrder(orderRight, txObject)

    expect(cancelOrderResult).toHaveProperty('reverted')
    const txResult = await GhostMarket.matchOrders(
      orderLeft,
      signatureLeft,
      orderRight,
      signatureRight,
      txObject,
    )

    expect(txResult.reverted).toBe('not a maker')
  }, 20000) */
})
