/* eslint-disable @typescript-eslint/no-unused-vars */
import Web3 from 'web3'
import { ExchangeV2Core } from '././abis/ExchangeV2Core'
import { GhostMarketAPI } from './api'
import {
  EXCHANGEV2_PROXY_ADDRESS_AVALANCHE,
  EXCHANGEV2_PROXY_ADDRESS_BSC,
  EXCHANGEV2_PROXY_ADDRESS_ETHEREUM,
  EXCHANGEV2_PROXY_ADDRESS_POLYGON,
  EXCHANGEV2_PROXY_ADDRESS_AVALANCHE_TESTNET,
  EXCHANGEV2_PROXY_ADDRESS_BSC_TESTNET,
  EXCHANGEV2_PROXY_ADDRESS_ETHEREUM_TESTNET,
  EXCHANGEV2_PROXY_ADDRESS_POLYGON_TESTNET,
  ROYALTIES_REGISTRY_ADDRESS_AVALANCHE,
  ROYALTIES_REGISTRY_ADDRESS_BSC,
  ROYALTIES_REGISTRY_ADDRESS_ETHEREUM,
  ROYALTIES_REGISTRY_ADDRESS_POLYGON,
  ROYALTIES_REGISTRY_ADDRESS_AVALANCHE_TESTNET,
  ROYALTIES_REGISTRY_ADDRESS_BSC_TESTNET,
  ROYALTIES_REGISTRY_ADDRESS_ETHEREUM_TESTNET,
  ROYALTIES_REGISTRY_ADDRESS_POLYGON_TESTNET,
  PROXY_NFT_ADDRESS_AVALANCHE,
  PROXY_NFT_ADDRESS_BSC,
  PROXY_NFT_ADDRESS_ETHEREUM,
  PROXY_NFT_ADDRESS_POLYGON,
  PROXY_NFT_ADDRESS_AVALANCHE_TESTNET,
  PROXY_NFT_ADDRESS_BSC_TESTNET,
  PROXY_NFT_ADDRESS_ETHEREUM_TESTNET,
  PROXY_NFT_ADDRESS_POLYGON_TESTNET,
  PROXY_ERC20_ADDRESS_AVALANCHE,
  PROXY_ERC20_ADDRESS_BSC,
  PROXY_ERC20_ADDRESS_ETHEREUM,
  PROXY_ERC20_ADDRESS_POLYGON,
  PROXY_ERC20_ADDRESS_AVALANCHE_TESTNET,
  PROXY_ERC20_ADDRESS_BSC_TESTNET,
  PROXY_ERC20_ADDRESS_ETHEREUM_TESTNET,
  PROXY_ERC20_ADDRESS_POLYGON_TESTNET,
} from './constants'
import { GhostMarketAPIConfig, Network, OrderLeft, OrderRight, Signature, TxObject } from './types'

export class GhostMarketSDK {
  // Instance of Web3 to use.
  private web3: Web3
  private web3Readonly: Web3
  public readonly api: GhostMarketAPI
  // Logger function to use when debugging.
  public logger: (arg: string) => void
  private _networkname: Network
  private _isReadonlyProvider: boolean

  /**
   * Your instance of GhostMarket.
   * Make API calls and GhostMarket Smart Contract method calls.
   * @param  {Web3['currentProvider']} provider To use for creating a Web3 instance. Can be also be `window.ethereum` for browser injected web3 providers.
   * @param  {GhostMarketAPIConfig} apiConfig with options for accessing GhostMarket APIs.
   * @param  {(arg:string)=>void} logger? // Optional logger function for logging debug messages.
   */
  constructor(
    provider: Web3['currentProvider'],
    apiConfig: GhostMarketAPIConfig,
    logger?: (arg: string) => void,
  ) {
    const useReadOnlyProvider = apiConfig.useReadOnlyProvider ?? true
    this._isReadonlyProvider = useReadOnlyProvider
    apiConfig.providerRPCUrl = apiConfig.providerRPCUrl || ''

    const readonlyProvider = useReadOnlyProvider
      ? new Web3.providers.HttpProvider(apiConfig.providerRPCUrl)
      : null

    apiConfig.networkName = apiConfig.networkName || Network.EthereumTestnet
    this._networkname = apiConfig.networkName
    this.web3 = new Web3(provider)
    this.web3Readonly = useReadOnlyProvider ? new Web3(readonlyProvider) : this.web3
    this.api = new GhostMarketAPI(apiConfig)
    // Logger: Default to nothing.
    this.logger = logger || ((arg: string) => arg)
  }

  /**
   * @param {OrderLeft} orderLeft
   * @param {Signature} signatureLeft
   * @param {OrderRight} orderRight
   * @param {Signature} signatureRight
   * @param {TxObject} txObject
   */
  public async matchOrders(
    orderLeft: OrderLeft,
    signatureLeft: Signature,
    orderRight: OrderRight,
    signatureRight: Signature,
    txObject: TxObject,
  ) {
    if (this._isReadonlyProvider) return
    const exchangeV2ProxyAddress = this._getExchangeV2ProxyContractAddress(this._networkname)
    const ExchangeV2CoreContractInstance = new this.web3.eth.Contract(
      ExchangeV2Core,
      exchangeV2ProxyAddress,
    )

    try {
      const txResult = await ExchangeV2CoreContractInstance.methods
        .matchOrders(orderLeft, signatureLeft, orderRight, signatureRight)
        .send(txObject)
      return txResult
    } catch (e) {
      console.error(`Failed to execute method for ${exchangeV2ProxyAddress} with:`, e)
    }
  }

  /** Cancel an order
   * @param  {OrderLeft | OrderRight} order Order to be reverted/canceled.
   * @param  {TxObject} txObject Transaction object to send when calling `cancel`.
   */
  public async cancelOrder(order: OrderLeft | OrderLeft, txObject: TxObject) {
    if (this._isReadonlyProvider) return
    const exchangeV2ProxyAddress = this._getExchangeV2ProxyContractAddress(this._networkname)
    const ExchangeV2CoreContractInstance = new this.web3.eth.Contract(
      ExchangeV2Core,
      exchangeV2ProxyAddress,
    )

    try {
      const txResult = await ExchangeV2CoreContractInstance.methods.cancel(order).send(txObject)
      return txResult
    } catch (e) {
      console.error(`Failed to execute method for ${exchangeV2ProxyAddress} with:`, e)
    }
  }

  private _getExchangeV2ProxyContractAddress(networkName: string): string {
    switch (networkName) {
      case Network.Avalanche:
        return EXCHANGEV2_PROXY_ADDRESS_AVALANCHE
      case Network.AvalancheTestnet:
        return EXCHANGEV2_PROXY_ADDRESS_AVALANCHE_TESTNET
      case Network.BSC:
        return EXCHANGEV2_PROXY_ADDRESS_BSC
      case Network.BSCTestnet:
        return EXCHANGEV2_PROXY_ADDRESS_BSC_TESTNET
      case Network.Ethereum:
        return EXCHANGEV2_PROXY_ADDRESS_ETHEREUM
      case Network.EthereumTestnet:
        return EXCHANGEV2_PROXY_ADDRESS_ETHEREUM_TESTNET
      case Network.Polygon:
        return EXCHANGEV2_PROXY_ADDRESS_POLYGON
      case Network.PolygonTestnet:
        return EXCHANGEV2_PROXY_ADDRESS_POLYGON_TESTNET
      default:
        throw new Error('Unsupported Network')
    }
  }
}
