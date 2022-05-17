import Web3 from 'web3'
import { ExchangeV2CoreABI } from './abis'

import { GhostMarketAPI } from './api'
import {
  EXCHANGEV2_PROXY_ADDRESS_AVAX,
  EXCHANGEV2_PROXY_ADDRESS_BSC,
  EXCHANGEV2_PROXY_ADDRESS_ETHEREUM,
  EXCHANGEV2_PROXY_ADDRESS_POLYGON,
  EXCHANGEV2_PROXY_ADDRESS_RINKEBY,
} from './constants'
import { GhostMarketAPIConfig, Left, Network, Right, Signature, TxObject } from './types'

export class GhostMarket {
  // Instance of Web3 to use.
  private web3: Web3
  private web3Readonly: Web3
  public readonly api: GhostMarketAPI
  // Logger function to use when debugging.
  public logger: (arg: string) => void
  private _networkname: Network
  private _isReadonlyProvider: boolean

  /**
   * Your instance of the GhostMarketplace.
   * Access API calls and Smart Contract method calls.
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

    apiConfig.networkName = apiConfig.networkName || Network.Main
    this._networkname = apiConfig.networkName
    this.web3 = new Web3(provider)
    this.web3Readonly = useReadOnlyProvider ? new Web3(readonlyProvider) : this.web3
    this.api = new GhostMarketAPI(apiConfig)
    // Logger: Default to nothing.
    this.logger = logger || ((arg: string) => arg)
  }

  /**
   * @param  {Left} left maker order
   * @param  {Signature} signatureLeft EIP712 signature of maker
   * @param  {Right} right taker order
   * @param  {Signature} signatureRight EIP712 signature of taker
   * @param  {TxObject} txObject Gas and transaction to send for executing matchOrder method
   */
  public async matchOrders(
    left: Left,
    signatureLeft: Signature,
    right: Right,
    signatureRight: Signature,
    txObject: TxObject,
  ) {
    if (this._isReadonlyProvider) return
    const exchangeV2ProxyAddress = this._getExchangeV2ProxyContractAddress(this._networkname)
    const ExchangeV2CoreContractInstance = new this.web3.eth.Contract(
      ExchangeV2CoreABI,
      exchangeV2ProxyAddress,
    )

    try {
      const tx = await ExchangeV2CoreContractInstance.methods
        .matchOrders(left, signatureLeft, right, signatureRight)
        .send(txObject)
        .call()
      return tx
    } catch (e) {
      console.error(`Failed to execute method for ${exchangeV2ProxyAddress} with:`, e)
    }
  }

  private _getExchangeV2ProxyContractAddress(networkName: string): string {
    switch (networkName) {
      case Network.Main:
        return EXCHANGEV2_PROXY_ADDRESS_ETHEREUM
      case Network.Avax:
        return EXCHANGEV2_PROXY_ADDRESS_AVAX
      case Network.BSC:
        return EXCHANGEV2_PROXY_ADDRESS_BSC
      case Network.Polygon:
        return EXCHANGEV2_PROXY_ADDRESS_POLYGON
      case Network.Rinkeby:
        return EXCHANGEV2_PROXY_ADDRESS_RINKEBY
      default:
        throw new Error('Unsupported Network')
    }
  }
}
