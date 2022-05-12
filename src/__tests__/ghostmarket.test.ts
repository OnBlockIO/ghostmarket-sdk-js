import Web3ProviderEngine from 'web3-provider-engine'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'

import {
  createRinkebyProvider,
  encodeTokenParams,
  Order,
  Asset,
  getSignature,
  ERC1155,
  ETH,
} from './test-helpers'
import { GhostMarket } from '../ghostmarket'
import { GhostMarketAPIConfig, Network, Signature, TxObject } from '../types'
import GhostMarketERC115 from './GhostMarketERC1155ABI'

describe('GhostMarketPlace', () => {
  const ghostmarketBaseAPIUrl = 'https://api3.ghostmarket.io:7061'

  const ghostMarketAPIConfig: GhostMarketAPIConfig = {
    networkName: Network.Rinkeby,
    apiKey: '',
    apiBaseUrl: ghostmarketBaseAPIUrl,
    providerRPCUrl: '',
    useReadOnlyProvider: false,
  }

  const provider: Web3ProviderEngine = createRinkebyProvider()
  let web3: Web3
  let ghostmarketPlace: GhostMarket

  beforeAll(() => {
    // A custom provider with a signer.
    provider.start()
    web3 = new Web3(provider)
    ghostmarketPlace = new GhostMarket(provider, ghostMarketAPIConfig)
  })

  afterAll(() => {
    provider.stop()
  })

  describe('GhostMarketPlace Smart Contract method calls', () => {
    it('should transfer NFTs', async () => {
      const accounts = await web3.eth.getAccounts()
      const account1 = accounts[0]
      const account2 = accounts[1]
      const account3 = accounts[2]
      const account4 = accounts[3]
      const ZERO = '0x0000000000000000000000000000000000000000'

      const ghostERC1155ProxyAddress = '0xE8B43d9F9DC2ae1A303cDA55cf348BB483AB0C1D'
      const GhostERC1155ProxyInstance = new web3.eth.Contract(
        GhostMarketERC115,
        ghostERC1155ProxyAddress,
      )

      async function getLastTokenID(tokenContractInstance: Contract) {
        const counter = await tokenContractInstance.methods.getCurrentCounter().call()
        const tokenId = parseInt(counter)
        if (counter == 1) return web3.utils.toBN(tokenId)
        else return web3.utils.toBN(tokenId - 1)
      }

      async function prepareERC1155V1Orders(erc1155amount = 10) {
        await GhostERC1155ProxyInstance.methods
          .mintGhost(
            account1,
            erc1155amount,
            '0x',
            [
              [account3, 1000],
              [account4, 500],
            ],
            'ext_uri',
            '',
            '',
          )
          .call()

        const erc1155TokenId1 = (
          await getLastTokenID(GhostERC1155ProxyInstance as unknown as Contract)
        ).toString()
        console.info('erc1155TokenId1', erc1155TokenId1)

        const left = Order(
          account2,
          Asset(ETH, '0x', 200),
          ZERO,
          Asset(ERC1155, encodeTokenParams(web3, account1, erc1155TokenId1), 4),
          1,
          0,
          0,
          '0xffffffff',
          '0x',
        )

        const right = Order(
          account1,
          Asset(ERC1155, encodeTokenParams(web3, account2, erc1155TokenId1), 4),
          ZERO,
          Asset(ETH, '0x', 200),
          1,
          0,
          0,
          '0xffffffff',
          '0x',
        )
        return { left, right, erc1155TokenId1 }
      }

      const { left, right } = await prepareERC1155V1Orders()
      const signatureRight = (await getSignature(web3, right, account1, account2)) as Signature
      const signatureLeft = (await getSignature(web3, left, account3, account4)) as Signature
      const txObject: TxObject = {
        value: 0,
        from: account1,
        gasprice: 300,
      }

      const txResult = await ghostmarketPlace.matchOrders(
        left,
        signatureLeft,
        right,
        signatureRight,
        txObject,
      )
      // call to contract method via proxy contract returns true for sucessful transaction and `false` for failed transaction
      expect(txResult).toBe(true)
    })
  })
})
