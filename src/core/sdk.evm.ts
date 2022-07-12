/* eslint-disable @typescript-eslint/no-unused-vars */
import Web3 from 'web3'
import { BigNumber } from '@ethersproject/bignumber'
import {
    ERC20WrappedContract,
    ExchangeV2Contract,
    RoyaltiesRegistryContract,
    ERC721Contract,
    ERC1155Contract,
    IncentivesContract,
} from '../abi'
import {
    ETHEREUM_MAINNET_CONTRACTS,
    ETHEREUM_TESTNET_CONTRACTS,
    AVALANCHE_MAINNET_CONTRACTS,
    AVALANCHE_TESTNET_CONTRACTS,
    POLYGON_MAINNET_CONTRACTS,
    POLYGON_TESTNET_CONTRACTS,
    BSC_MAINNET_CONTRACTS,
    BSC_TESTNET_CONTRACTS,
    MAX_UINT_256,
    NULL_ADDRESS,
    GHOSTMARKET_TRADE_FEE_BPS,
    API_BASE_MAINNET,
} from './constants'
import { Network, TxObject } from '../types/network'
import { IEVMOrder } from '../lib/api/ghostmarket/models'
import { enc, ETH, ERC20, ERC721, ERC1155, COLLECTION } from '../utils/evm/assets'
import { hashKey } from '../utils/evm/hash'
import { sign, Order, Asset } from '../utils/evm/order'
import {
    GhostMarketApi,
    IGhostMarketApiOptions,
    PostCreateOrderRequest,
} from '../lib/api/ghostmarket'

// not included in main frontend lib yet
export interface Royalties {
    royaltiesRecipients: RoyaltyRecipient[]
}

// not included in main frontend lib yet
export interface RoyaltyRecipient {
    recipient: string
    amount: number
}

// not included in main frontend lib yet
export interface GhostMarketSDKConfig {
    apiKey?: string
    baseUrl?: string
    useReadOnlyProvider?: boolean
    rpcUrl?: string
    chainName?: Network
}

export class GhostMarketSDK {
    // Instance of Web3 to use.
    private web3: Web3
    public readonly api: GhostMarketApi
    // Logger function to use when debugging.
    public logger: (arg: string) => void
    private _chainName: Network
    private _isReadonlyProvider: boolean

    /**
     * Your instance of GhostMarket.
     * Make API calls and GhostMarket Smart Contract method calls.
     * @param  {Web3['currentProvider']} provider To use for creating a Web3 instance. Can be also be `window.ethereum` for browser injected web3 providers.
     * @param  {GhostMarketSDKConfig} options with options for accessing GhostMarket SDK.
     * @param  {(arg:string)=>void} logger? // Optional logger function for logging debug messages.
     */
    constructor(
        provider: Web3['currentProvider'],
        options: {
            apiKey?: string
            baseUrl?: string
            useReadOnlyProvider?: boolean
            rpcUrl?: string
            chainName?: Network
        },
        logger?: (arg: string) => void,
    ) {
        options.apiKey = options.apiKey || ''
        options.baseUrl = options.baseUrl || API_BASE_MAINNET
        options.rpcUrl = options.rpcUrl || ''
        const useReadOnlyProvider = options.useReadOnlyProvider ?? true
        this._isReadonlyProvider = useReadOnlyProvider
        options.chainName = options.chainName || Network.Ethereum
        this._chainName = options.chainName
        this.web3 = new Web3(provider)
        const apiConfig = {
            apiKey: options.apiKey,
            baseUrl: options.baseUrl,
        } as IGhostMarketApiOptions
        this.api = new GhostMarketApi(apiConfig)
        // Logger: Default to nothing.
        this.logger = logger || ((arg: string) => arg)
    }

    // -- EVM METHODS -- //

    /** Create a sell order or a single nft offer or a collection offer
     * @param {string} chain for the order.
     * @param {string} tokenContract token contract for the order.
     * @param {string} tokenId token id for the order.
     * @param {number} tokenAmount token amount for the order.
     * @param {string} quoteContract quote contract for the order.
     * @param {string} quotePrice quote price for the order.
     * @param {string} makerAddress maker address for the order.
     * @param {number} type type of order. // 1 - sell order, 2 - offer, 3 - collection offer
     * @param {number} typeAsset asset type of order. // 1 - ERC721, 2 - ERC1155
     * @param {number} startDate start date the order can be matched.
     * @param {number} endDate end date the order can be matched.
     */
    public async createOrder(
        chain: string,
        tokenContract: string,
        tokenId: string,
        tokenAmount: number,
        quoteContract: string,
        quotePrice: string,
        makerAddress: string,
        type: number,
        typeAsset: number,
        startDate: number,
        endDate: number,
    ) {
        try {
            const salt =
                '0x' +
                [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')

            const encType = typeAsset == 1 ? ERC721 : ERC1155

            const order = Order(
                makerAddress,
                type === 2
                    ? Asset(quoteContract === '0x' ? ETH : ERC20, enc(quoteContract), quotePrice)
                    : type === 3
                    ? Asset(quoteContract === '0x' ? ETH : ERC20, enc(tokenContract), quotePrice)
                    : Asset(encType, enc(tokenContract, tokenId), tokenAmount.toString()),
                NULL_ADDRESS,
                type === 2
                    ? Asset(encType, enc(tokenContract, tokenId), tokenAmount.toString())
                    : type === 3
                    ? Asset(COLLECTION, enc(quoteContract), quotePrice)
                    : Asset(quoteContract === '0x' ? ETH : ERC20, enc(quoteContract), quotePrice),
                salt,
                startDate,
                endDate,
                '0xffffffff',
                '0x',
            )

            const verifyingContract = this._getExchangeV2ProxyContractAddress(this._chainName)
            const signature = await sign(order, makerAddress, verifyingContract)
            const orderKeyHash = hashKey(order)

            const nftToList = {
                chain,
                token_contract: tokenContract,
                token_id: tokenId,
                token_amount: tokenAmount,
                quote_contract: quoteContract,
                quote_price: quotePrice,
                maker_address: makerAddress,
                is_buy_offer: type === 2,
                start_date: startDate,
                end_date: endDate,
                signature,
                order_key_hash: orderKeyHash,
                salt,
                origin_fees: 0,
                origin_address: '',
            } as PostCreateOrderRequest
            await this.api.postCreateOrder(new PostCreateOrderRequest(nftToList))
        } catch (e) {
            return console.error(`Failed to execute postCreateOrder with error:`, e)
        }
    }

    /** Prepare match of a sell order or a single nft offer or a collection offer
     * @param {string} signatureLeft left signature for the order match.
     * @param {string} salt salt for the order match.
     * @param {string} tokenContract token contract for the order.
     * @param {string} tokenId token id for the order.
     * @param {number} tokenAmount token amount for the order.
     * @param {string} quoteContract quote contract for the order.
     * @param {string} quotePrice quote price for the order.
     * @param {string} makerAddress maker address for the order.
     * @param {number} type type of order. // 1 - sell order, 2 - offer, 3 - collection offer
     * @param {number} typeAsset asset type of order. // 1 - ERC721, 2 - ERC1155
     * @param {number} startDate start date the order can be matched.
     * @param {number} endDate end date the order can be matched.
     */
    public async prepareMatchOrders(
        signatureLeft: string,
        salt: string,
        tokenContract: string,
        tokenId: string,
        tokenAmount: number,
        quoteContract: string,
        quotePrice: string,
        makerAddress: string,
        takerAddress: string,
        type: number,
        typeAsset: number,
        startDate: number,
        endDate: number,
    ) {
        try {
            const encType = typeAsset == 1 ? ERC721 : ERC1155

            const orderLeft = Order(
                makerAddress,
                type === 2
                    ? Asset(quoteContract === '0x' ? ETH : ERC20, enc(quoteContract), quotePrice)
                    : type === 3
                    ? Asset(encType, enc(tokenContract, tokenId), tokenAmount.toString())
                    : Asset(encType, enc(tokenContract, tokenId), tokenAmount.toString()),
                NULL_ADDRESS,
                type === 2
                    ? Asset(encType, enc(tokenContract, tokenId), tokenAmount.toString())
                    : type === 3
                    ? Asset(COLLECTION, enc(tokenContract), tokenAmount.toString())
                    : Asset(quoteContract === '0x' ? ETH : ERC20, enc(quoteContract), quotePrice),
                salt,
                startDate,
                endDate,
                '0xffffffff',
                '0x',
            )

            const orderRight = Order(
                takerAddress,
                type === 2
                    ? Asset(encType, enc(tokenContract, tokenId), tokenAmount.toString())
                    : type === 3
                    ? Asset(quoteContract === '0x' ? ETH : ERC20, enc(quoteContract), quotePrice)
                    : Asset(quoteContract === '0x' ? ETH : ERC20, enc(quoteContract), quotePrice),
                NULL_ADDRESS,
                type === 2
                    ? Asset(encType, enc(tokenContract, tokenId), tokenAmount.toString())
                    : type === 3
                    ? Asset(COLLECTION, enc(tokenContract), tokenAmount.toString())
                    : Asset(encType, enc(tokenContract, tokenId), tokenAmount.toString()),
                salt,
                startDate,
                endDate,
                '0xffffffff',
                '0x',
            )

            const signatureRight = '0x'

            const priceTotal = BigNumber.from(quotePrice)
            const priceToSend =
                quoteContract === '0x' && type === 1
                    ? priceTotal.mul(GHOSTMARKET_TRADE_FEE_BPS).div(10000).toString()
                    : 0

            const tx = {
                from: takerAddress,
                value: priceToSend,
            } as TxObject

            this.matchOrders(orderLeft, signatureLeft, orderRight, signatureRight, tx)
        } catch (e) {
            return console.error(`Failed to execute prepareMatchOrders with error:`, e)
        }
    }

    /** Match orders
     * @param {IEVMOrder} orderLeft order left to match.
     * @param {string} signatureLeft signature left to match.
     * @param {IEVMOrder} orderRight order right to match.
     * @param {string} signatureRight signature right to match.
     * @param {TxObject} txObject transaction object to send when calling `matchOrders`.
     */
    public async matchOrders(
        orderLeft: IEVMOrder,
        signatureLeft: string,
        orderRight: IEVMOrder,
        signatureRight: string,
        txObject: TxObject,
    ) {
        if (this._isReadonlyProvider) return
        const exchangeV2ProxyAddress = this._getExchangeV2ProxyContractAddress(this._chainName)
        const ExchangeV2CoreContractInstance = new this.web3.eth.Contract(
            ExchangeV2Contract,
            exchangeV2ProxyAddress,
        )

        try {
            const txResult = await ExchangeV2CoreContractInstance.methods
                .matchOrders(orderLeft, signatureLeft, orderRight, signatureRight)
                .send(txObject)
            return txResult
        } catch (e) {
            return console.error(
                `Failed to execute matchOrders on ${exchangeV2ProxyAddress} with error:`,
                e,
            )
        }
    }

    /** Cancel one order
     * @param {IEVMOrder} order order to cancel.
     * @param {TxObject} txObject transaction object to send when calling `cancelOrder`.
     */
    public async cancelOrder(order: IEVMOrder, txObject: TxObject) {
        if (this._isReadonlyProvider) return
        const exchangeV2ProxyAddress = this._getExchangeV2ProxyContractAddress(this._chainName)
        const ExchangeV2CoreContractInstance = new this.web3.eth.Contract(
            ExchangeV2Contract,
            exchangeV2ProxyAddress,
        )

        try {
            const txResult = await ExchangeV2CoreContractInstance.methods
                .cancel(order)
                .send(txObject)
            return txResult
        } catch (e) {
            return console.error(
                `Failed to execute cancelOrder on ${exchangeV2ProxyAddress} with error:`,
                e,
            )
        }
    }

    /** Cancel multiple orders
     * @param {IEVMOrder[]} orders[] orders to cancel.
     * @param {TxObject} txObject transaction object to send when calling `bulkCancelOrders`.
     */
    public async bulkCancelOrders(orders: IEVMOrder[], txObject: TxObject) {
        if (this._isReadonlyProvider) return
        const exchangeV2ProxyAddress = this._getExchangeV2ProxyContractAddress(this._chainName)
        const ExchangeV2CoreContractInstance = new this.web3.eth.Contract(
            ExchangeV2Contract,
            exchangeV2ProxyAddress,
        )

        try {
            const txResult = await ExchangeV2CoreContractInstance.methods
                .bulkCancelOrders(orders)
                .send(txObject)
            return txResult
        } catch (e) {
            return console.error(
                `Failed to execute bulkCancelOrders on ${exchangeV2ProxyAddress} with error:`,
                e,
            )
        }
    }

    /** Set royalties for contract
     * @param {string} address contract address to set royalties for.
     * @param {Royalties} royalties royalties settings to use for the contract.
     * @param {TxObject} txObject transaction object to send when calling `setRoyaltiesByToken`.
     */
    public async setRoyaltiesForContract(
        address: string,
        royalties: Royalties,
        txObject: TxObject,
    ) {
        if (this._isReadonlyProvider) return
        const royaltiesRegistryProxyAddress = this._getRoyaltiesRegistryContractAddress(
            this._chainName,
        )
        const RoyaltiesRegistryContractInstance = new this.web3.eth.Contract(
            RoyaltiesRegistryContract,
            royaltiesRegistryProxyAddress,
        )

        try {
            const txResult = await RoyaltiesRegistryContractInstance.methods
                .setRoyaltiesByToken(address, royalties)
                .send(txObject)
            return txResult
        } catch (e) {
            return console.error(
                `Failed to execute setRoyaltiesByToken on ${royaltiesRegistryProxyAddress} with error:`,
                e,
            )
        }
    }

    /** Wrap token or unwrap token
     * @param {amount} number value to wrap token from/to.
     * @param {isFromNativeToWrap} boolean true if native to wrap, or false from wrap to native
     * @param {TxObject} txObject transaction object to send when calling `wrapToken`.
     */
    public async wrapToken(amount: number, isFromNativeToWrap: boolean, txObject: TxObject) {
        if (this._isReadonlyProvider) return
        const wrappedTokenAddress = this._getWrappedTokenContractAddress(this._chainName)
        const WrappedTokenContractInstance = new this.web3.eth.Contract(
            ERC20WrappedContract,
            wrappedTokenAddress,
        )

        if (isFromNativeToWrap) {
            try {
                const txResult = await WrappedTokenContractInstance.methods
                    .deposit()
                    .send(amount, txObject)
                return txResult
            } catch (e) {
                return console.error(
                    `Failed to execute deposit on ${wrappedTokenAddress} with error:`,
                    e,
                )
            }
        } else {
            try {
                const txResult = await WrappedTokenContractInstance.methods
                    .withdraw(amount)
                    .send(txObject)
                return txResult
            } catch (e) {
                return console.error(
                    `Failed to execute withdraw on ${wrappedTokenAddress} with error:`,
                    e,
                )
            }
        }
    }

    /** Approve NFT Contract
     * @param {hash} string contract to approve.
     * @param {TxObject} txObject transaction object to send when calling `approveContract`.
     */
    public async approveContract(hash: string, txObject: TxObject) {
        if (this._isReadonlyProvider) return
        const proxyContractAddress = this._getNFTProxyContractAddress(this._chainName)
        const ContractInstance = new this.web3.eth.Contract(ERC721Contract, hash)

        try {
            const txResult = await ContractInstance.methods
                .setApprovalForAll(proxyContractAddress, true)
                .send(txObject)
            return txResult
        } catch (e) {
            return console.error(`Failed to execute setApprovalForAll on ${hash} with error:`, e)
        }
    }

    /** Approve Token Contract
     * @param {hash} string contract to approve.
     * @param {TxObject} txObject transaction object to send when calling `approveToken`.
     */
    public async approveToken(hash: string, txObject: TxObject) {
        if (this._isReadonlyProvider) return
        const proxyContractAddress = this._getERC20ProxyContractAddress(this._chainName)
        const ContractInstance = new this.web3.eth.Contract(ERC721Contract, hash)

        try {
            const txResult = await ContractInstance.methods
                .approve(proxyContractAddress, MAX_UINT_256)
                .send(txObject)
            return txResult
        } catch (e) {
            return console.error(`Failed to execute approve on ${hash} with error:`, e)
        }
    }

    /** Check NFT Contract Approval
     * @param {address} string address to check approval.
     * @param {hash} string contract to check approval.
     */
    public async checkContractApproval(address: string, hash: string) {
        const proxyContractAddress = this._getNFTProxyContractAddress(this._chainName)
        const ContractInstance = new this.web3.eth.Contract(ERC721Contract, hash)

        try {
            const txResult = await ContractInstance.methods.isApprovedForAll(
                address,
                proxyContractAddress,
            )
            return txResult
        } catch (e) {
            return console.error(`Failed to execute isApprovedForAll on ${hash} with error:`, e)
        }
    }

    /** Check ERC20 Token Contract Approval
     * @param {address} string address to check approval.
     * @param {hash} string contract to check approval.
     */
    public async checkTokenApproval(address: string, hash: string) {
        const ERC20ContractInstance = new this.web3.eth.Contract(ERC20WrappedContract, hash)

        try {
            const txResult = await ERC20ContractInstance.methods.allowance(address, hash)
            return txResult
        } catch (e) {
            return console.error(`Failed to execute allowance on ${hash} with error:`, e)
        }
    }

    /** Transfer ERC721 NFT
     * @param {address} string address transferring NFT.
     * @param {destination} string destination address of NFT.
     * @param {hash} string contract of NFT to transfer.
     * @param {tokenId} string token ID of NFT to transfer.
     * @param {TxObject} txObject transaction object to send when calling `transferERC721`.
     */
    public async transferERC721(
        address: string,
        destination: string,
        hash: string,
        tokenId: string,
        txObject: TxObject,
    ) {
        const ContractInstance = new this.web3.eth.Contract(ERC721Contract, hash)

        try {
            const txResult = await ContractInstance.methods
                .safeTransferFrom(address, destination, tokenId)
                .send(txObject)
            return txResult
        } catch (e) {
            return console.error(`Failed to execute safeTransferFrom on ${hash} with error:`, e)
        }
    }

    /** Transfer Batch ERC1155 NFT
     * @param {address} string address transferring NFT.
     * @param {destination} string destination address of NFT.
     * @param {hash} string contract of NFT to transfer.
     * @param {tokenIds} string token ID of NFTs to transfer.
     * @param {amounts} string amount of NFTs to transfer.
     * @param {TxObject} txObject transaction object to send when calling `transferERC1155`.
     */
    public async transferERC1155(
        address: string,
        destination: string,
        hash: string,
        tokenIds: string,
        amounts: number,
        txObject: TxObject,
    ) {
        const ContractInstance = new this.web3.eth.Contract(ERC1155Contract, hash)

        try {
            const txResult = await ContractInstance.methods
                .safeBatchTransferFrom(address, destination, tokenIds, amounts, '0x')
                .send(txObject)
            return txResult
        } catch (e) {
            return console.error(
                `Failed to execute safeBatchTransferFrom on ${hash} with error:`,
                e,
            )
        }
    }

    /** Burn ERC721 NFT
     * @param {address} string address transferring NFT.
     * @param {hash} string contract of NFT to transfer.
     * @param {tokenId} string token ID of NFTs to transfer.
     * @param {TxObject} txObject transaction object to send when calling `burnERC721`.
     */
    public async burnERC721(address: string, hash: string, tokenId: string, txObject: TxObject) {
        const ContractInstance = new this.web3.eth.Contract(ERC721Contract, hash)

        try {
            const txResult = await ContractInstance.methods.burn(address, tokenId).send(txObject)
            return txResult
        } catch (e) {
            return console.error(`Failed to execute burn on ${hash} with error:`, e)
        }
    }

    /** Burn ERC1155 NFT
     * @param {address} string address transferring NFT.
     * @param {hash} string contract of NFT to transfer.
     * @param {tokenId} string token ID of NFTs to transfer.
     * @param {amount} string amount of NFTs to transfer.
     * @param {TxObject} txObject transaction object to send when calling `burnERC1155`.
     */
    public async burnERC1155(
        address: string,
        hash: string,
        tokenId: string,
        amount: number,
        txObject: TxObject,
    ) {
        const ContractInstance = new this.web3.eth.Contract(ERC1155Contract, hash)

        try {
            const txResult = await ContractInstance.methods
                .burn(address, tokenId, amount)
                .send(txObject)
            return txResult
        } catch (e) {
            return console.error(`Failed to execute burn on ${hash} with error:`, e)
        }
    }

    /** Mint ERC1155 GHOST NFT
     * @param {creator} string creator of the NFT.
     * @param {amount} number amount of NFT to mint.
     * @param {royalties} any royalties of the NFT.
     * @param {externalURI} string externalURI of the NFT.
     * @param {TxObject} txObject transaction object to send when calling `mintERC721`.
     */
    public async mintERC721(
        creator: string,
        royalties: any,
        externalURI: string,
        txObject: TxObject,
    ) {
        const ERC721GhostAddress = this._getERC721GhostContractAddress(this._chainName)
        const ERC721GhostAddressInstance = new this.web3.eth.Contract(
            ERC721Contract,
            ERC721GhostAddress,
        )

        try {
            const txResult = await ERC721GhostAddressInstance.methods
                .mintGhost(creator, royalties, externalURI, '', '') // lock content & onchain metadata not available at the moment on SDK
                .send(txObject)
            return txResult
        } catch (e) {
            return console.error(
                `Failed to execute mintGhost on ${ERC721GhostAddress} with error:`,
                e,
            )
        }
    }

    /** Mint ERC1155 GHOST NFT
     * @param {creator} string creator of the NFT.
     * @param {amount} number amount of NFT to mint.
     * @param {royalties} any royalties of the NFT.
     * @param {externalURI} string externalURI of the NFT.
     * @param {TxObject} txObject transaction object to send when calling `mintERC1155`.
     */
    public async mintERC1155(
        creator: string,
        amount: number,
        royalties: any,
        externalURI: string,
        txObject: TxObject,
    ) {
        const ERC1155GhostAddress = this._getERC1155GhostContractAddress(this._chainName)
        const ERC1155GhostAddressInstance = new this.web3.eth.Contract(
            ERC1155Contract,
            ERC1155GhostAddress,
        )

        try {
            const txResult = await ERC1155GhostAddressInstance.methods
                .mintGhost(creator, amount, [], royalties, externalURI, '', '') // data && lock content & onchain metadata not available at the moment on SDK
                .send(txObject)
            return txResult
        } catch (e) {
            return console.error(
                `Failed to execute mintGhost on ${ERC1155GhostAddress} with error:`,
                e,
            )
        }
    }

    /** Get incentives for address
     * @param {string} currentAddress address used to check incentives.
     */
    public async readIncentives(currentAddress: string) {
        const IncentivesContractAddressAddress = this._getIncentivesContractAddress(this._chainName)
        const IncentivesContractInstance = new this.web3.eth.Contract(
            IncentivesContract,
            IncentivesContractAddressAddress,
        )

        try {
            const data = await IncentivesContractInstance.methods.incentives(currentAddress)
            return this.callMethod(data, currentAddress)
        } catch (e) {
            return console.error(
                `Failed to execute readIncentives on ${IncentivesContractAddressAddress} with error:`,
                e,
            )
        }
    }

    /** Claim incentives
     * @param {string} currentAddress address claiming incentives.
     * @param {TxObject} txObject transaction object to send when calling `claimIncentives`.
     */
    public async claimIncentives(currentAddress: string) {
        const IncentivesContractAddressAddress = this._getIncentivesContractAddress(this._chainName)
        const IncentivesContractInstance = new this.web3.eth.Contract(
            IncentivesContract,
            IncentivesContractAddressAddress,
        )

        try {
            const data = await IncentivesContractInstance.methods.claim()
            return this.sendMethod(
                data,
                currentAddress,
                IncentivesContractAddressAddress,
                undefined,
            )
        } catch (e) {
            return console.error(
                `Failed to execute claimIncentives on ${IncentivesContractAddressAddress} with error:`,
                e,
            )
        }
    }

    /** Sign Data
     * @param {data} string data to sign.
     * @param {addresss} string address to sign message.
     */
    public async signData(data: string, address: string) {
        try {
            const txResult = this.web3.eth.sign(data, address)
            return txResult
        } catch (e) {
            return console.error(`Failed to execute signData with error:`, e)
        }
    }

    /* TO ADD
    getTokenBalances / getOwnerships
    */

    // -- END EVM METHODS -- //

    // -- N3 METHODS -- //

    // -- END N3 METHODS -- //

    // -- PHA METHODS -- //

    // -- END PHA METHODS -- //

    // -- COMMON METHODS -- //

    private _getIncentivesContractAddress(networkName: string): string {
        switch (networkName) {
            case Network.Avalanche:
                return AVALANCHE_MAINNET_CONTRACTS.INCENTIVES
            case Network.AvalancheTestnet:
                return AVALANCHE_TESTNET_CONTRACTS.INCENTIVES
            case Network.EthereumTestnet:
                return ETHEREUM_TESTNET_CONTRACTS.INCENTIVES
            case Network.BSC:
                return BSC_MAINNET_CONTRACTS.INCENTIVES
            case Network.BSCTestnet:
                return BSC_TESTNET_CONTRACTS.INCENTIVES
            case Network.Polygon:
                return POLYGON_MAINNET_CONTRACTS.INCENTIVES
            case Network.PolygonTestnet:
                return POLYGON_TESTNET_CONTRACTS.INCENTIVES
            default:
                throw new Error('Unsupported Network')
        }
    }

    private _getERC721GhostContractAddress(networkName: string): string {
        switch (networkName) {
            case Network.Avalanche:
                return AVALANCHE_MAINNET_CONTRACTS.GHOST_ERC721
            case Network.AvalancheTestnet:
                return AVALANCHE_TESTNET_CONTRACTS.GHOST_ERC721
            case Network.EthereumTestnet:
                return ETHEREUM_TESTNET_CONTRACTS.GHOST_ERC721
            case Network.BSC:
                return BSC_MAINNET_CONTRACTS.GHOST_ERC721
            case Network.BSCTestnet:
                return BSC_TESTNET_CONTRACTS.GHOST_ERC721
            case Network.Polygon:
                return POLYGON_MAINNET_CONTRACTS.GHOST_ERC721
            case Network.PolygonTestnet:
                return POLYGON_TESTNET_CONTRACTS.GHOST_ERC721
            default:
                throw new Error('Unsupported Network')
        }
    }

    private _getERC1155GhostContractAddress(networkName: string): string {
        switch (networkName) {
            case Network.Avalanche:
                return AVALANCHE_MAINNET_CONTRACTS.GHOST_ERC1155
            case Network.AvalancheTestnet:
                return AVALANCHE_TESTNET_CONTRACTS.GHOST_ERC1155
            case Network.EthereumTestnet:
                return ETHEREUM_TESTNET_CONTRACTS.GHOST_ERC1155
            case Network.BSC:
                return BSC_MAINNET_CONTRACTS.GHOST_ERC1155
            case Network.BSCTestnet:
                return BSC_TESTNET_CONTRACTS.GHOST_ERC1155
            case Network.Polygon:
                return POLYGON_MAINNET_CONTRACTS.GHOST_ERC1155
            case Network.PolygonTestnet:
                return POLYGON_TESTNET_CONTRACTS.GHOST_ERC1155
            default:
                throw new Error('Unsupported Network')
        }
    }

    private _getERC20ProxyContractAddress(networkName: string): string {
        switch (networkName) {
            case Network.Avalanche:
                return AVALANCHE_MAINNET_CONTRACTS.PROXY_ERC20
            case Network.AvalancheTestnet:
                return AVALANCHE_TESTNET_CONTRACTS.PROXY_ERC20
            case Network.BSC:
                return BSC_MAINNET_CONTRACTS.PROXY_ERC20
            case Network.BSCTestnet:
                return BSC_TESTNET_CONTRACTS.PROXY_ERC20
            case Network.Ethereum:
                return ETHEREUM_MAINNET_CONTRACTS.PROXY_ERC20
            case Network.EthereumTestnet:
                return ETHEREUM_TESTNET_CONTRACTS.PROXY_ERC20
            case Network.Polygon:
                return POLYGON_MAINNET_CONTRACTS.PROXY_ERC20
            case Network.PolygonTestnet:
                return POLYGON_TESTNET_CONTRACTS.PROXY_ERC20
            default:
                throw new Error('Unsupported Network')
        }
    }

    private _getNFTProxyContractAddress(networkName: string): string {
        switch (networkName) {
            case Network.Avalanche:
                return AVALANCHE_MAINNET_CONTRACTS.PROXY_NFT
            case Network.AvalancheTestnet:
                return AVALANCHE_TESTNET_CONTRACTS.PROXY_NFT
            case Network.BSC:
                return BSC_MAINNET_CONTRACTS.PROXY_NFT
            case Network.BSCTestnet:
                return BSC_TESTNET_CONTRACTS.PROXY_NFT
            case Network.Ethereum:
                return ETHEREUM_MAINNET_CONTRACTS.PROXY_NFT
            case Network.EthereumTestnet:
                return ETHEREUM_TESTNET_CONTRACTS.PROXY_NFT
            case Network.Polygon:
                return POLYGON_MAINNET_CONTRACTS.PROXY_NFT
            case Network.PolygonTestnet:
                return POLYGON_TESTNET_CONTRACTS.PROXY_NFT
            default:
                throw new Error('Unsupported Network')
        }
    }

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

    sendMethod(
        dataOrMethod: any,
        from: string,
        value: any,
        type = '', // 0x2
    ): Promise<any> {
        return new Promise((resolve, reject) =>
            dataOrMethod
                .send({ from, value, type })
                // .then((res:any) => resolve(res.transactionHash)) // unused as this would mean waiting for the tx to be included in a block
                .on('transactionHash', (hash: any) => resolve(hash)) // returns hash instantly
                .catch((err: any) => reject(err)),
        )
    }

    callMethod(dataOrMethod: any, from: string): Promise<any> {
        return new Promise((resolve, reject) =>
            dataOrMethod
                .call({ from })
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err)),
        )
    }

    // -- END COMMON METHODS -- //
}
