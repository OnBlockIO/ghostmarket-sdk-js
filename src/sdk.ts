/* eslint-disable @typescript-eslint/no-unused-vars */
import Web3 from 'web3'
import { ERC20 } from './abis/ERC20'
import { ERC20Wrapped } from './abis/ERC20Wrapped'
import { ERC721 } from './abis/ERC721'
import { ERC1155 } from './abis/ERC1155'
import { ExchangeV2Core } from './abis/ExchangeV2Core'
import { RoyaltiesRegistry } from './abis/RoyaltiesRegistry'
import { GhostMarketAPI } from './api'
import {
  ETHEREUM_MAINNET_CONTRACTS,
  ETHEREUM_TESTNET_CONTRACTS,
  AVALANCHE_MAINNET_CONTRACTS,
  AVALANCHE_TESTNET_CONTRACTS,
  POLYGON_MAINNET_CONTRACTS,
  POLYGON_TESTNET_CONTRACTS,
  BSC_MAINNET_CONTRACTS,
  BSC_TESTNET_CONTRACTS,
  N3_MAINNET_CONTRACTS,
  N3_TESTNET_CONTRACTS,
  PHA_MAINNET_CONTRACTS,
  PHA_TESTNET_CONTRACTS,
} from './constants'
import {
  GhostMarketAPIConfig,
  Network,
  OrderLeft,
  OrderRight,
  Signature,
  Royalties,
  TxObject,
} from './types'

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

  // -- EVM METHODS -- //

  /** Match orders
   * @param {OrderLeft} orderLeft
   * @param {Signature} signatureLeft
   * @param {OrderRight} orderRight
   * @param {Signature} signatureRight
   * @param {TxObject} txObject Transaction object to send when calling `matchOrders`.
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
      console.error(`Failed to execute matchOrders for ${exchangeV2ProxyAddress} with:`, e)
    }
  }

  /** Cancel one order
   * @param  {OrderLeft | OrderRight} order Order to be reverted/cancelled.
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
      console.error(`Failed to execute cancelOrder for ${exchangeV2ProxyAddress} with:`, e)
    }
  }

  /** Cancel multiple orders
   * @param  {OrderLeft | OrderRight} orders[] Orders to be reverted/cancelled.
   * @param  {TxObject} txObject Transaction object to send when calling `bulkCancelOrders`.
   */
  public async bulkCancelOrders(orders: OrderLeft[] | OrderLeft[], txObject: TxObject) {
    if (this._isReadonlyProvider) return
    const exchangeV2ProxyAddress = this._getExchangeV2ProxyContractAddress(this._networkname)
    const ExchangeV2CoreContractInstance = new this.web3.eth.Contract(
      ExchangeV2Core,
      exchangeV2ProxyAddress,
    )

    try {
      const txResult = await ExchangeV2CoreContractInstance.methods
        .bulkCancelOrders(orders)
        .send(txObject)
      return txResult
    } catch (e) {
      console.error(`Failed to execute bulkCancelOrders for ${exchangeV2ProxyAddress} with:`, e)
    }
  }

  /** Set royalties for contract
   * @param  {address} string contract address to set royalties for.
   * @param  {Royalties} royalties Royalties settings to use for the contract.
   * @param  {TxObject} txObject Transaction object to send when calling `setRoyaltiesByToken`.
   */
  public async setRoyaltiesForContract(address: string, royalties: Royalties, txObject: TxObject) {
    if (this._isReadonlyProvider) return
    const royaltiesRegistryProxyAddress = this._getRoyaltiesRegistryContractAddress(
      this._networkname,
    )
    const RoyaltiesRegistryContractInstance = new this.web3.eth.Contract(
      RoyaltiesRegistry,
      royaltiesRegistryProxyAddress,
    )

    try {
      const txResult = await RoyaltiesRegistryContractInstance.methods
        .setRoyaltiesByToken(address, royalties)
        .send(txObject)
      return txResult
    } catch (e) {
      console.error(
        `Failed to execute setRoyaltiesByToken for ${royaltiesRegistryProxyAddress} with:`,
        e,
      )
    }
  }

  /** Wrap token or unwrap token
   * @param  {amount} number value to wrap token from/to.
   * @param  {isFromNativeToWrap} boolean true if native to wrap, or false from wrap to native
   * @param  {TxObject} txObject Transaction object to send when calling `deposit` or `withdraw`.
   */
  public async wrapToken(amount: number, isFromNativeToWrap: boolean, txObject: TxObject) {
    if (this._isReadonlyProvider) return
    const wrappedTokenAddress = this._getWrappedTokenContractAddress(this._networkname)
    const WrappedTokenContractInstance = new this.web3.eth.Contract(
      ERC20Wrapped,
      wrappedTokenAddress,
    )

    if (isFromNativeToWrap) {
      try {
        const txResult = await WrappedTokenContractInstance.methods.deposit().send(amount, txObject)
        return txResult
      } catch (e) {
        console.error(`Failed to execute deposit for ${wrappedTokenAddress} with:`, e)
      }
    } else {
      try {
        const txResult = await WrappedTokenContractInstance.methods.withdraw(amount).send(txObject)
        return txResult
      } catch (e) {
        console.error(`Failed to execute withdraw for ${wrappedTokenAddress} with:`, e)
      }
    }
  }

  /* TO ADD ALL BELOW
    buyMultiple (nfts: IBuyCartItem[], currentAddress: string, refAddress: string | undefined) : Promise<any>;
    sellMultiple (nfts: ISellCartItem[], currentAddress: string, startDate: Date, endDate: Date) : Promise<any>;
    editPrice (item: ICartItem<null>, currentAddress: string, newPrice: number) : Promise<any>;
    burn (nfts: IBurnCartItem[], currentAddress: string) : Promise<any>;
    signData (data: string, address: string, providerHint?: string) : Promise<any>;
    mint (item: ICartItem<MintData>) : Promise<any>;
    transfer (nfts: ITransferCartItem[], currentAddress: string) : Promise<any>;
    processOffer? (offers: ICartItem<IOffer>[], currentAddress: string) : Promise<any>;
    processOfferCollection? (offers: ICartItem<IOffer>[], currentAddress: string) : Promise<any>;
    placeOffer? (offers: IOfferCartItem[], address: string, startDate: Date, endDate: Date | number): Promise<any>;
    placeOfferCollection? (offers: IOfferCartItem[], address: string, startDate: Date, endDate: Date | number): Promise<any>;
    approveNFT? (contractHash: string, currentAddress: string) : Promise<any>;
    approveToken? (symbol: string, amount: string, currentAddress: string) : Promise<any>;
    checkNFTContractApproval? (contractHash: string, currentAddress: string) : Promise<any>;
    checkTokenContractApproval? (symbol: string, currentAddress: string) : Promise<string>;
    */

  // -- END EVM METHODS -- //

  // -- N3 METHODS -- //

  // -- END N3 METHODS -- //

  // -- PHA METHODS -- //

  // -- END PHA METHODS -- //

  // -- COMMON METHODS -- //

  private _getExchangeV2ProxyContractAddress(networkName: string): string {
    switch (networkName) {
      case Network.Avalanche:
        return AVALANCHE_MAINNET_CONTRACTS.PROXY_EXCHANGEV2
      case Network.AvalancheTestnet:
        return AVALANCHE_TESTNET_CONTRACTS.PROXY_EXCHANGEV2
      case Network.BSC:
        return BSC_MAINNET_CONTRACTS.PROXY_EXCHANGEV2
      case Network.BSCTestnet:
        return BSC_TESTNET_CONTRACTS.PROXY_EXCHANGEV2
      case Network.Ethereum:
        return ETHEREUM_MAINNET_CONTRACTS.PROXY_EXCHANGEV2
      case Network.EthereumTestnet:
        return ETHEREUM_TESTNET_CONTRACTS.PROXY_EXCHANGEV2
      case Network.Polygon:
        return POLYGON_MAINNET_CONTRACTS.PROXY_EXCHANGEV2
      case Network.PolygonTestnet:
        return POLYGON_TESTNET_CONTRACTS.PROXY_EXCHANGEV2
      default:
        throw new Error('Unsupported Network')
    }
  }

  private _getRoyaltiesRegistryContractAddress(networkName: string): string {
    switch (networkName) {
      case Network.Avalanche:
        return AVALANCHE_MAINNET_CONTRACTS.PROXY_ROYALTIES
      case Network.AvalancheTestnet:
        return AVALANCHE_TESTNET_CONTRACTS.PROXY_ROYALTIES
      case Network.BSC:
        return BSC_MAINNET_CONTRACTS.PROXY_ROYALTIES
      case Network.BSCTestnet:
        return BSC_TESTNET_CONTRACTS.PROXY_ROYALTIES
      case Network.Ethereum:
        return ETHEREUM_MAINNET_CONTRACTS.PROXY_ROYALTIES
      case Network.EthereumTestnet:
        return ETHEREUM_TESTNET_CONTRACTS.PROXY_ROYALTIES
      case Network.Polygon:
        return POLYGON_MAINNET_CONTRACTS.PROXY_ROYALTIES
      case Network.PolygonTestnet:
        return POLYGON_TESTNET_CONTRACTS.PROXY_ROYALTIES
      default:
        throw new Error('Unsupported Network')
    }
  }

  private _getWrappedTokenContractAddress(networkName: string): string {
    switch (networkName) {
      case Network.Avalanche:
        return AVALANCHE_MAINNET_CONTRACTS.WRAPPED_TOKEN
      case Network.AvalancheTestnet:
        return AVALANCHE_TESTNET_CONTRACTS.WRAPPED_TOKEN
      case Network.BSC:
        return BSC_MAINNET_CONTRACTS.WRAPPED_TOKEN
      case Network.BSCTestnet:
        return BSC_TESTNET_CONTRACTS.WRAPPED_TOKEN
      case Network.Ethereum:
        return ETHEREUM_MAINNET_CONTRACTS.WRAPPED_TOKEN
      case Network.EthereumTestnet:
        return ETHEREUM_TESTNET_CONTRACTS.WRAPPED_TOKEN
      case Network.Polygon:
        return POLYGON_MAINNET_CONTRACTS.WRAPPED_TOKEN
      case Network.PolygonTestnet:
        return POLYGON_TESTNET_CONTRACTS.WRAPPED_TOKEN
      default:
        throw new Error('Unsupported Network')
    }
  }

  // -- END COMMON METHODS -- //
}
