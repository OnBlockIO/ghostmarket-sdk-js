import Web3ProviderEngine from 'web3-provider-engine'
import Web3 from 'web3'

import { createRinkebyProvider } from './create-rinkeby-provider'
import { GhostMarket } from '../ghostmarket'
import {
  GhostMarketAPIConfig,
  OrderLeft,
  Network,
  OrderRight,
  TxObject,
  ContractABI,
} from '../types'

import { enc, ERC1155, ETH } from './assets'
import { Order, Asset, sign } from './order'
import { EXCHANGEV2_PROXY_ADDRESS_RINKEBY } from '../constants'
import GhostERC1155ABI from './GhostERC1155ABI.json'

/**
 * @param  {Web3} web3
 * @param  {string} account1
 * @param  {string} account2
 * @returns orderRight, orderLeft
 */
async function prepareERC1155V1Orders(
  web3: Web3,
  account1: string,
  account2: string,
): Promise<{
  orderRight: OrderRight
  orderLeft: OrderLeft
}> {
  const ZERO = '0x0000000000000000000000000000000000000000'

  const contractHash = '0xbf49984e4A7924FE9d05A6B5D1F8d4C1b137660c'

  const ERC1155Instance = new web3.eth.Contract(GhostERC1155ABI as ContractABI, contractHash)

  const erc1155TokenId = await ERC1155Instance.methods.getCurrentCounter().call()
  const transferProxyAddress = '0x7688d9ceD8c3541dC9eE17Dc7A3AC384EF385927'

  try {
    await ERC1155Instance.methods
      .setApprovalForAll(transferProxyAddress, true)
      .send({ from: account1 })
  } catch (error) {
    console.error(error)
  }

  const orderLeft = Order(
    account2,
    Asset(ETH, '0x', 200),
    ZERO,
    Asset(ERC1155, enc(web3, contractHash, erc1155TokenId.toString()), 4),
    1,
    0,
    0,
    '0xffffffff',
    '0x',
  )

  const orderRight = Order(
    account1,
    Asset(ERC1155, enc(web3, contractHash, erc1155TokenId.toString()), 4),
    ZERO,
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
 * @param  {string} verifyingConract
 */
async function getSignature(web3: Web3, order: object, from: string, verifyingConract: string) {
  return sign(web3, order, from, verifyingConract)
}

describe('GhostMarketPlace Smart Contract method calls', () => {
  const ghostmarketBaseAPIUrl = 'https://api3.ghostmarket.io:7061'

  const ghostMarketAPIConfig: GhostMarketAPIConfig = {
    networkName: Network.Rinkeby,
    apiKey: '',
    apiBaseUrl: ghostmarketBaseAPIUrl,
    providerRPCUrl: '',
    useReadOnlyProvider: false,
  }

  let provider: Web3ProviderEngine
  let web3: Web3
  let accounts: Array<string>
  let account1: string
  let account2: string
  let ghostmarketPlace: GhostMarket

  beforeAll(async () => {
    provider = createRinkebyProvider()
    provider.start()

    web3 = new Web3(provider)
    accounts = await web3.eth.getAccounts()
    account1 = accounts[0]
    account2 = accounts[1]
    ghostmarketPlace = new GhostMarket(provider, ghostMarketAPIConfig)
  })

  afterAll(() => {
    provider.stop()
  })

  describe('Orders', () => {
    it('should transfer NFTs by matching 2 Orders', async () => {
      const { orderLeft, orderRight } = await prepareERC1155V1Orders(web3, account1, account2)

      // This is an ExchangeV2Proxy contract address
      const verifyingConract = EXCHANGEV2_PROXY_ADDRESS_RINKEBY
      const signatureRight = await getSignature(web3, orderRight, account1, verifyingConract)
      const signatureLeft = await getSignature(web3, orderLeft, account2, verifyingConract)

      const txObject: TxObject = {
        value: 300,
        from: account1,
      }

      const txResult = await ghostmarketPlace.matchOrders(
        orderLeft,
        signatureLeft,
        orderRight,
        signatureRight,
        txObject,
      )
      // Note: call to contract method via proxy contract returns`true` for sucessful transaction and `false` for a failed transaction
      expect(txResult).toBe(true)
    }, 20000)
  })

  it('should cancel an Order', async () => {
    const { orderLeft, orderRight } = await prepareERC1155V1Orders(web3, account1, account2)
    const txObject: TxObject = {
      from: account1,
      value: 300,
    }
    console.log("txObject",txObject)
    console.log("orderRight",orderRight)

    const verifyingConract = EXCHANGEV2_PROXY_ADDRESS_RINKEBY
    const signatureRight = await getSignature(web3, orderRight, account1, verifyingConract)
    const signatureLeft = await getSignature(web3, orderLeft, account2, verifyingConract)

    const cancelOrderResult = await ghostmarketPlace.cancelOrder(orderRight, txObject)

    expect(cancelOrderResult).toHaveProperty('reverted')
    const txResult = await ghostmarketPlace.matchOrders(
      orderLeft,
      signatureLeft,
      orderRight,
      signatureRight,
      txObject,
    )

    expect(txResult.reverted).toBe('not a maker')
  }, 20000)
})
