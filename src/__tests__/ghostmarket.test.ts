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

import { enc, ERC1155 } from './assets'
import { Order, Asset, sign } from './order'

import ERC155ABI from './GhostERC1155ABI.json'

/**
 * @param  {Web3} web3
 * @param  {string} maker
 * @param  {string} taker
 * @returns orderRight, orderLeft
 */
async function prepareERC1155V1Orders(
  web3: Web3,
  maker: string,
  taker: string,
): Promise<{
  orderRight: OrderRight
  orderLeft: OrderLeft
}> {
  const erc1155ContractAddress = '0x51Add5946571a3DcB999c622477216A0466c7a34'
  const transferProxyAddress = '0x9D55FA33713Cd19409768d04e288103e12812c9b'
  const ERC1155ContractInstance = new web3.eth.Contract(
    ERC155ABI as ContractABI,
    erc1155ContractAddress,
  )

  const erc1155TokenId = await ERC1155ContractInstance.methods.getCurrentCounter().call()
  console.info(erc1155TokenId)

  await ERC1155ContractInstance.methods.setApprovalForAll(transferProxyAddress, true)

  const orderLeft = Order(
    maker,
    Asset(ERC1155, '0x', 5),
    maker,
    Asset(ERC1155, enc(web3, erc1155ContractAddress, erc1155TokenId), 5),
    0,
    1650199607, // start
    1660927607, // end
    '0xffffffff',
    '0x',
  )

  const orderRight = Order(
    maker,
    Asset(ERC1155, enc(web3, erc1155ContractAddress, erc1155TokenId), 5),
    maker,
    Asset(ERC1155, '0x', 5),
    0,
    1650199607, // start
    1660927607, // end date, a date future timestamp
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

  const provider: Web3ProviderEngine = createRinkebyProvider()
  provider.start()

  let web3: Web3
  let accounts: Array<string>
  let maker: string
  let taker: string
  let ghostmarketPlace: GhostMarket

  beforeAll(async () => {
    web3 = new Web3(provider)
    accounts = await web3.eth.getAccounts()
    maker = accounts[0]
    taker = accounts[1]
    // A custom provider with a signer, can sign transactions
    ghostmarketPlace = new GhostMarket(provider, ghostMarketAPIConfig)
  })

  afterAll(() => {
    provider.stop()
  })

  describe('Orders', () => {
    it('should transfer NFTs by matching 2 Orders', async () => {
      const { orderLeft, orderRight } = await prepareERC1155V1Orders(web3, maker, taker)

      // this is an ExchangeV2 contract address
      const verifyingConract = '0x29CC344F21BF573422ab5780b25F295935EB2C6F'
      const signatureRight = await getSignature(web3, orderLeft, maker, verifyingConract)

      const signatureLeft = '0x'

      // gas to send with transaction
      const txObject: TxObject = {
        value: 300,
        from: maker,
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
    }, 10000)
  })

  it('should cancel an Order', async () => {
    const { orderLeft } = await prepareERC1155V1Orders(web3, maker, taker)
    const txObject: TxObject = {
      from: maker,
      value: 300,
    }
    const texResult = await ghostmarketPlace.cancelOrder(orderLeft, txObject)

    expect(texResult).toBe(true)
  }, 6000)
})
