/* eslint-disable @typescript-eslint/no-unused-vars */
import Web3 from 'web3'
import { BigNumber } from '@ethersproject/bignumber'
import {
    ERC20Contract,
    ERC20WrappedContract,
    ERC721Contract,
    ERC1155Contract,
    ExchangeV2Contract,
    RoyaltiesRegistryContract,
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
    MAINNET_API_URL,
    ChainName,
    ChainId,
    ChainSlug,
} from './constants'
import { IEVMOrder } from '../lib/api/ghostmarket/models'
import { enc, ETH, ERC20, ERC721, ERC1155, COLLECTION } from '../utils/evm/assets'
import { hashKey } from '../utils/evm/hash'
import { sign, Order, Asset } from '../utils/evm/order'
import {
    GhostMarketApi,
    IGhostMarketApiOptions,
    PostCreateOrderRequest,
} from '../lib/api/ghostmarket'

interface IOrderItem {
    tokenContract: string // token contract for the order.
    tokenId: string // token id for the order.
    tokenAmount: number // token amount for the order.
    quoteContract: string // quote contract for the order.
    quotePrice: string // quote price for the order.
    makerAddress: string // maker address for the order.
    type: number // type of order. // 1 - sell order, 2 - offer, 3 - collection offer
    typeAsset: number // asset type of order. // 1 - ERC721, 2 - ERC1155
    startDate: number // start date the order can be matched.
    endDate: number // end date the order can be matched.
}

interface IMintItem {
    creatorAddress: string
    royalties: Royalties[]
    externalURI: string
}

interface Royalties {
    address: string
    value: number
}

interface TxObject {
    from: string
    value?: string
    gasPrice?: number
}

export class GhostMarketSDK {
    // Instance of Web3 to use.
    private web3: Web3
    public readonly api: GhostMarketApi
    // Logger function to use when debugging.
    public logger: (arg: string) => void
    private _chainName: ChainName
    private _chainSlug: ChainSlug
    private _chainId: ChainId
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
            environment?: string
            useReadOnlyProvider?: boolean
            rpcUrl?: string
            chainName?: ChainName
        },
        logger?: (arg: string) => void,
    ) {
        options.apiKey = options.apiKey || ''
        options.environment = options.environment || MAINNET_API_URL
        options.rpcUrl = options.rpcUrl || ''
        const useReadOnlyProvider = options.useReadOnlyProvider ?? false
        this._isReadonlyProvider = useReadOnlyProvider
        options.chainName = options.chainName || ChainName.Ethereum
        this._chainName = options.chainName
        this._chainSlug = ChainSlug[this._chainName.replace(/\s/g, '') as keyof typeof ChainSlug]
        this._chainId = ChainId[this._chainName.replace(/\s/g, '') as keyof typeof ChainId]
        this.web3 = new Web3(provider)
        const apiConfig = {
            apiKey: options.apiKey,
            baseUrl: options.environment,
        } as IGhostMarketApiOptions
        this.api = new GhostMarketApi(apiConfig)
        // Logger: Default to nothing.
        this.logger = logger || ((arg: string) => arg)
    }

    /** Create one or more sell order or nft offer or collection offer
     * @param {IOrderItem[]} items for the order.
     */
    public async createOrder(items: IOrderItem[]): Promise<void> {
        console.log(
            `createOrder: creating order with ${this.web3.currentProvider?.toString()} on ${
                this._chainName
            }`,
        )

        for (let i = 0; i < items.length; i++) {
            try {
                const salt =
                    '0x' +
                    [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')

                const encType = items[i].typeAsset == 1 ? ERC721 : ERC1155

                const order = Order(
                    items[i].makerAddress,
                    items[i].type === 2
                        ? Asset(
                              items[i].quoteContract === '0x' ? ETH : ERC20,
                              enc(items[i].quoteContract),
                              items[i].quotePrice,
                          )
                        : items[i].type === 3
                        ? Asset(
                              items[i].quoteContract === '0x' ? ETH : ERC20,
                              enc(items[i].tokenContract),
                              items[i].quotePrice,
                          )
                        : Asset(
                              encType,
                              enc(items[i].tokenContract, items[i].tokenId),
                              items[i].tokenAmount.toString(),
                          ),
                    NULL_ADDRESS,
                    items[i].type === 2
                        ? Asset(
                              encType,
                              enc(items[i].tokenContract, items[i].tokenId),
                              items[i].tokenAmount.toString(),
                          )
                        : items[i].type === 3
                        ? Asset(COLLECTION, enc(items[i].quoteContract), items[i].quotePrice)
                        : Asset(
                              items[i].quoteContract === '0x' ? ETH : ERC20,
                              enc(items[i].quoteContract),
                              items[i].quotePrice,
                          ),
                    salt,
                    items[i].startDate,
                    items[i].endDate,
                    '0xffffffff',
                    '0x',
                )

                const verifyingContract = this._getExchangeV2ProxyContractAddress(this._chainName)

                const signature = await sign(
                    order,
                    items[i].makerAddress,
                    verifyingContract,
                    this.web3,
                    this._chainId,
                )

                const orderKeyHash = hashKey(order)

                const nftToList = {
                    chain: this._chainSlug,
                    token_contract: items[i].tokenContract,
                    token_id: items[i].tokenId,
                    token_amount: items[i].tokenAmount,
                    quote_contract: items[i].quoteContract,
                    quote_price: items[i].quotePrice,
                    maker_address: items[i].makerAddress,
                    is_buy_offer: items[i].type === 2,
                    start_date: items[i].startDate,
                    end_date: items[i].endDate,
                    signature,
                    order_key_hash: orderKeyHash,
                    salt,
                    origin_fees: 0,
                    origin_address: '',
                } as PostCreateOrderRequest
                const listing = await this.api.postCreateOrder(
                    new PostCreateOrderRequest(nftToList),
                )
                console.log(listing)
            } catch (e) {
                return console.error(`Failed to execute postCreateOrder ${i + 1} with error:`, e)
            }
        }
        return
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
     * @param {TxObject} txObject transaction object to send when calling `prepareMatchOrders`.
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
        type: number,
        typeAsset: number,
        startDate: number,
        endDate: number,
        txObject: TxObject,
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
                txObject.from,
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
                    : undefined

            txObject = {
                from: txObject.from,
                value: priceToSend,
            }

            this.matchOrders(orderLeft, signatureLeft, orderRight, signatureRight, txObject)
        } catch (e) {
            return console.error(`prepareMatchOrders: failed to execute with error:`, e)
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
            const data = await ExchangeV2CoreContractInstance.methods.matchOrders(
                orderLeft,
                signatureLeft,
                orderRight,
                signatureRight,
            )
            return this.sendMethod(data, txObject.from, exchangeV2ProxyAddress, txObject.value)
        } catch (e) {
            return console.error(
                `matchOrders: failed to execute matchOrders on ${exchangeV2ProxyAddress} with error:`,
                e,
            )
        }
    }

    /** Cancel one or more orders
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
            const data = await ExchangeV2CoreContractInstance.methods.bulkCancelOrders(orders)
            return this.sendMethod(data, txObject.from, exchangeV2ProxyAddress, undefined)
        } catch (e) {
            return console.error(
                `bulkCancelOrders: failed to execute bulkCancelOrders on ${exchangeV2ProxyAddress} with error:`,
                e,
            )
        }
    }

    /** Set royalties for contract
     * @param {string} contractAddress contract address to set royalties for.
     * @param {Royalties[]} royalties royalties settings to use for the contract.
     * @param {TxObject} txObject transaction object to send when calling `setRoyaltiesForContract`.
     */
    public async setRoyaltiesForContract(
        contractAddress: string,
        royalties: Royalties[],
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

        const contractRoyalties = []
        if (royalties) {
            for (let i = 0; i < royalties.length; i++) {
                contractRoyalties.push([royalties[i].address, royalties[i].value.toString()])
            }
        }

        try {
            const data = await RoyaltiesRegistryContractInstance.methods.setRoyaltiesByToken(
                contractAddress,
                contractRoyalties,
            )
            return this.sendMethod(data, txObject.from, royaltiesRegistryProxyAddress, undefined)
        } catch (e) {
            return console.error(
                `setRoyaltiesForContract: failed to execute setRoyaltiesByToken on ${royaltiesRegistryProxyAddress} with error:`,
                e,
            )
        }
    }

    /** Wrap token or unwrap token
     * @param {string} amount value to wrap token from/to.
     * @param {boolean} isFromNativeToWrap true if native to wrap, or false from wrap to native
     * @param {TxObject} txObject transaction object to send when calling `wrapToken`.
     */
    public async wrapToken(amount: string, isFromNativeToWrap: boolean, txObject: TxObject) {
        if (this._isReadonlyProvider) return
        const wrappedTokenAddress = this._getWrappedTokenContractAddress(this._chainName)
        const WrappedTokenContractInstance = new this.web3.eth.Contract(
            ERC20WrappedContract,
            wrappedTokenAddress,
        )

        if (isFromNativeToWrap) {
            try {
                const data = await WrappedTokenContractInstance.methods.deposit()
                return this.sendMethod(
                    data,
                    txObject.from,
                    wrappedTokenAddress,
                    !isFromNativeToWrap ? undefined : amount,
                )
            } catch (e) {
                return console.error(
                    `wrapToken: Failed to execute deposit on ${wrappedTokenAddress} with error:`,
                    e,
                )
            }
        } else {
            try {
                const data = await WrappedTokenContractInstance.methods.withdraw(amount)
                return this.sendMethod(data, txObject.from, wrappedTokenAddress, undefined)
            } catch (e) {
                return console.error(
                    `wrapToken: failed to execute withdraw on ${wrappedTokenAddress} with error:`,
                    e,
                )
            }
        }
    }

    /** Approve NFT Contract
     * @param {string} contractAddress nft contract to approve.
     * @param {TxObject} txObject transaction object to send when calling `approveContract`.
     */
    public async approveContract(contractAddress: string, txObject: TxObject) {
        if (this._isReadonlyProvider) return
        const proxyContractAddress = this._getNFTProxyContractAddress(this._chainName)
        const ContractInstance = new this.web3.eth.Contract(ERC721Contract, contractAddress)

        try {
            const data = await ContractInstance.methods.setApprovalForAll(
                proxyContractAddress,
                true,
            )
            return this.sendMethod(data, txObject.from, contractAddress, undefined)
        } catch (e) {
            return console.error(
                `approveContract: failed to execute setApprovalForAll on ${contractAddress} with error:`,
                e,
            )
        }
    }

    /** Approve Token Contract
     * @param {string} contractAddress token contract to approve.
     * @param {TxObject} txObject transaction object to send when calling `approveToken`.
     */
    public async approveToken(contractAddress: string, txObject: TxObject) {
        if (this._isReadonlyProvider) return
        const proxyContractAddress = this._getERC20ProxyContractAddress(this._chainName)
        const ContractInstance = new this.web3.eth.Contract(ERC721Contract, contractAddress)

        try {
            const data = await ContractInstance.methods.approve(proxyContractAddress, MAX_UINT_256)
            return this.sendMethod(data, txObject.from, contractAddress, undefined)
        } catch (e) {
            return console.error(`Failed to execute approve on ${contractAddress} with error:`, e)
        }
    }

    /** Check NFT Contract Approval
     * @param {string} contractAddress nft contract to check approval.
     * @param {string} accountAddress address used to check.
     */
    public async checkContractApproval(contractAddress: string, accountAddress: string) {
        const proxyContractAddress = this._getNFTProxyContractAddress(this._chainName)
        const ContractInstance = new this.web3.eth.Contract(ERC721Contract, contractAddress)

        try {
            const data = await ContractInstance.methods.isApprovedForAll(
                accountAddress,
                proxyContractAddress,
            )
            return await this.callMethod(data, accountAddress)
        } catch (e) {
            return console.error(
                `checkContractApproval: failed to execute isApprovedForAll on ${contractAddress} with error:`,
                e,
            )
        }
    }

    /** Check ERC20 Token Contract Approval
     * @param {string} contractAddress token contract to check approval.
     * @param {string} accountAddress address used to check.
     */
    public async checkTokenApproval(contractAddress: string, accountAddress: string) {
        const proxyContractAddress = this._getERC20ProxyContractAddress(this._chainName)
        const ERC20ContractInstance = new this.web3.eth.Contract(
            ERC20WrappedContract,
            contractAddress,
        )

        try {
            const data = await ERC20ContractInstance.methods.allowance(
                accountAddress,
                proxyContractAddress,
            )
            return await this.callMethod(data, accountAddress)
        } catch (e) {
            return console.error(
                `checkTokenApproval: failed to execute allowance on ${contractAddress} with error:`,
                e,
            )
        }
    }

    /** Transfer ERC20
     * @param {string} destinationAddress destination address .
     * @param {string} contractAddress contract of token to transfer.
     * @param {string} amount amount to transfer.
     * @param {TxObject} txObject transaction object to send when calling `transferERC20`.
     */
    public async transferERC20(
        destinationAddress: string,
        contractAddress: string,
        amount: string,
        txObject: TxObject,
    ) {
        if (this._isReadonlyProvider) return
        const ContractInstance = new this.web3.eth.Contract(ERC20Contract, contractAddress)

        try {
            const data = await ContractInstance.methods.transfer(destinationAddress, amount)
            return this.sendMethod(data, txObject.from, contractAddress, undefined)
        } catch (e) {
            return console.error(
                `transferERC20: failed to execute transfer on ${contractAddress} with error:`,
                e,
            )
        }
    }

    /** Transfer ERC721 NFT
     * @param {string} destinationAddress destination address of NFT.
     * @param {string} contractAddress contract of NFT to transfer.
     * @param {string} tokenId token ID of NFT to transfer.
     * @param {TxObject} txObject transaction object to send when calling `transferERC721`.
     */
    public async transferERC721(
        destinationAddress: string,
        contractAddress: string,
        tokenId: string,
        txObject: TxObject,
    ) {
        if (this._isReadonlyProvider) return
        const ContractInstance = new this.web3.eth.Contract(ERC721Contract, contractAddress)

        try {
            const data = await ContractInstance.methods.safeTransferFrom(
                txObject.from,
                destinationAddress,
                tokenId,
            )
            return this.sendMethod(data, txObject.from, contractAddress, undefined)
        } catch (e) {
            return console.error(
                `transferERC721: failed to execute safeTransferFrom on ${contractAddress} with error:`,
                e,
            )
        }
    }

    /** Transfer Batch ERC1155 NFT
     * @param {string} destinationAddress destination address of transfer.
     * @param {string} contractAddress contract of NFT to transfer.
     * @param {string[]} tokenIds token ID of NFTs to transfer.
     * @param {string[]} amounts amount of NFTs to transfer.
     * @param {TxObject} txObject transaction object to send when calling `transferERC1155`.
     */
    public async transferERC1155(
        destinationAddress: string,
        contractAddress: string,
        tokenIds: string[],
        amounts: number[],
        txObject: TxObject,
    ) {
        if (this._isReadonlyProvider) return
        const ContractInstance = new this.web3.eth.Contract(ERC1155Contract, contractAddress)

        try {
            const data = await ContractInstance.methods.safeBatchTransferFrom(
                txObject.from,
                destinationAddress,
                tokenIds,
                amounts,
                '0x',
            )
            return this.sendMethod(data, txObject.from, contractAddress, undefined)
        } catch (e) {
            return console.error(
                `transferERC1155: failed to execute safeBatchTransferFrom on ${contractAddress} with error:`,
                e,
            )
        }
    }

    /** Burn ERC721 NFT
     * @param {string} contractAddress contract of NFT to transfer.
     * @param {string} tokenId token ID of NFTs to transfer.
     * @param {TxObject} txObject transaction object to send when calling `burnERC721`.
     */
    public async burnERC721(contractAddress: string, tokenId: string, txObject: TxObject) {
        if (this._isReadonlyProvider) return
        const ContractInstance = new this.web3.eth.Contract(ERC721Contract, contractAddress)

        try {
            const data = await ContractInstance.methods.burn(tokenId)
            return this.sendMethod(data, txObject.from, contractAddress, undefined)
        } catch (e) {
            return console.error(
                `burnERC721: failed to execute burn on ${contractAddress} with error:`,
                e,
            )
        }
    }

    /** Burn ERC1155 NFT
     * @param {string} contractAddress contract of NFT to transfer.
     * @param {string} tokenId token ID of NFTs to transfer.
     * @param {string} amount amount of NFTs to transfer.
     * @param {TxObject} txObject transaction object to send when calling `burnERC1155`.
     */
    public async burnERC1155(
        contractAddress: string,
        tokenId: string,
        amount: number,
        txObject: TxObject,
    ) {
        if (this._isReadonlyProvider) return
        const ContractInstance = new this.web3.eth.Contract(ERC1155Contract, contractAddress)

        try {
            const data = await ContractInstance.methods.burn(tokenId, amount)
            return this.sendMethod(data, txObject.from, contractAddress, undefined)
        } catch (e) {
            return console.error(
                `burnERC1155: failed to execute burn on ${contractAddress} with error:`,
                e,
            )
        }
    }

    /** Mint ERC721 GHOST NFT
     * @param {IMintItem} item details.
     * @param {TxObject} txObject transaction object to send when calling `mintERC721`.
     */
    public async mintERC721(item: IMintItem, txObject: TxObject) {
        if (this._isReadonlyProvider) return
        const ERC721GhostAddress = this._getERC721GhostContractAddress(this._chainName)
        const ERC721GhostAddressInstance = new this.web3.eth.Contract(
            ERC721Contract,
            ERC721GhostAddress,
        )

        const contractRoyalties = []
        if (item.royalties) {
            for (let i = 0; i < item.royalties.length; i++) {
                contractRoyalties.push([
                    item.royalties[i].address,
                    item.royalties[i].value.toString(),
                ])
            }
        }

        try {
            const data = await ERC721GhostAddressInstance.methods.mintGhost(
                item.creatorAddress,
                contractRoyalties,
                item.externalURI,
                '',
                '',
            ) // lock content & onchain metadata not available at the moment on SDK
            return this.sendMethod(data, txObject.from, ERC721GhostAddress, undefined)
        } catch (e) {
            return console.error(
                `mintERC721: failed to execute mintGhost on ${ERC721GhostAddress} with error:`,
                e,
            )
        }
    }

    /** Mint ERC1155 GHOST NFT
     * @param {IMintItem} item details.
     * @param {number} amount amount of NFT to mint.
     * @param {TxObject} txObject transaction object to send when calling `mintERC1155`.
     */
    public async mintERC1155(item: IMintItem, amount: number, txObject: TxObject) {
        if (this._isReadonlyProvider) return
        const ERC1155GhostAddress = this._getERC1155GhostContractAddress(this._chainName)
        const ERC1155GhostAddressInstance = new this.web3.eth.Contract(
            ERC1155Contract,
            ERC1155GhostAddress,
        )

        const contractRoyalties = []
        if (item.royalties) {
            for (let i = 0; i < item.royalties.length; i++) {
                contractRoyalties.push([
                    item.royalties[i].address,
                    item.royalties[i].value.toString(),
                ])
            }
        }

        try {
            const data = await ERC1155GhostAddressInstance.methods.mintGhost(
                item.creatorAddress,
                amount,
                [],
                contractRoyalties,
                item.externalURI,
                '',
                '',
            ) // data && lock content & onchain metadata not available at the moment on SDK
            return this.sendMethod(data, txObject.from, ERC1155GhostAddress, undefined)
        } catch (e) {
            return console.error(
                `mintERC1155: failed to execute mintGhost on ${ERC1155GhostAddress} with error:`,
                e,
            )
        }
    }

    /** Check one token balance for address
     * @param {string} contractAddress token contract to check approval.
     * @param {string} accountAddress address used to check.
     */
    public async checkTokenBalance(contractAddress: string, accountAddress: string) {
        const ERC20ContractInstance = new this.web3.eth.Contract(
            ERC20WrappedContract,
            contractAddress,
        )

        try {
            const data = await ERC20ContractInstance.methods.balanceOf(accountAddress)
            return await this.callMethod(data, accountAddress)
        } catch (e) {
            return console.error(
                `checkTokenBalance: failed to execute balanceOf on ${contractAddress} with error:`,
                e,
            )
        }
    }

    /** Check incentives for address
     * @param {string} accountAddress address used to check.
     */
    public async checkIncentives(accountAddress: string) {
        const IncentivesContractAddressAddress = this._getIncentivesContractAddress(this._chainName)
        const IncentivesContractInstance = new this.web3.eth.Contract(
            IncentivesContract,
            IncentivesContractAddressAddress,
        )

        try {
            const data = await IncentivesContractInstance.methods.incentives(accountAddress)
            return this.callMethod(data, accountAddress)
        } catch (e) {
            return console.error(
                `checkIncentives: failed to execute incentives on ${IncentivesContractAddressAddress} with error:`,
                e,
            )
        }
    }

    /** Claim incentives
     * @param {TxObject} txObject transaction object to send when calling `claimIncentives`.
     */
    public async claimIncentives(txObject: TxObject) {
        if (this._isReadonlyProvider) return
        const IncentivesContractAddressAddress = this._getIncentivesContractAddress(this._chainName)
        const IncentivesContractInstance = new this.web3.eth.Contract(
            IncentivesContract,
            IncentivesContractAddressAddress,
        )

        try {
            const data = await IncentivesContractInstance.methods.claim()
            return this.sendMethod(data, txObject.from, IncentivesContractAddressAddress, undefined)
        } catch (e) {
            return console.error(
                `claimIncentives: failed to execute claim on ${IncentivesContractAddressAddress} with error:`,
                e,
            )
        }
    }

    /** Sign Data
     * @param {string} dataToSign data to sign.
     * @param {string} accountAddress address used to sign data.
     */
    public async signData(dataToSign: string, accountAddress: string) {
        try {
            const data = this.web3.eth.sign(dataToSign, accountAddress)
            return data
        } catch (e) {
            return console.error(`signData: Failed to execute sign with error:`, e)
        }
    }

    private _getIncentivesContractAddress(chainName: string): string {
        switch (chainName) {
            case ChainName.Avalanche:
                return AVALANCHE_MAINNET_CONTRACTS.INCENTIVES
            case ChainName.AvalancheTestnet:
                return AVALANCHE_TESTNET_CONTRACTS.INCENTIVES
            case ChainName.Ethereum:
                return ETHEREUM_MAINNET_CONTRACTS.INCENTIVES
            case ChainName.EthereumTestnet:
                return ETHEREUM_TESTNET_CONTRACTS.INCENTIVES
            case ChainName.BSC:
                return BSC_MAINNET_CONTRACTS.INCENTIVES
            case ChainName.BSCTestnet:
                return BSC_TESTNET_CONTRACTS.INCENTIVES
            case ChainName.Polygon:
                return POLYGON_MAINNET_CONTRACTS.INCENTIVES
            case ChainName.PolygonTestnet:
                return POLYGON_TESTNET_CONTRACTS.INCENTIVES
            default:
                throw new Error('Unsupported Network')
        }
    }

    private _getERC721GhostContractAddress(chainName: string): string {
        switch (chainName) {
            case ChainName.Avalanche:
                return AVALANCHE_MAINNET_CONTRACTS.GHOST_ERC721
            case ChainName.AvalancheTestnet:
                return AVALANCHE_TESTNET_CONTRACTS.GHOST_ERC721
            // Not available yet on Ethereum Mainnet
            /* case ChainName.Ethereum:
                return ETHEREUM_MAINNET_CONTRACTS.GHOST_ERC721 */
            case ChainName.EthereumTestnet:
                return ETHEREUM_TESTNET_CONTRACTS.GHOST_ERC721
            case ChainName.BSC:
                return BSC_MAINNET_CONTRACTS.GHOST_ERC721
            case ChainName.BSCTestnet:
                return BSC_TESTNET_CONTRACTS.GHOST_ERC721
            case ChainName.Polygon:
                return POLYGON_MAINNET_CONTRACTS.GHOST_ERC721
            case ChainName.PolygonTestnet:
                return POLYGON_TESTNET_CONTRACTS.GHOST_ERC721
            default:
                throw new Error('Unsupported Network')
        }
    }

    private _getERC1155GhostContractAddress(chainName: string): string {
        switch (chainName) {
            case ChainName.Avalanche:
                return AVALANCHE_MAINNET_CONTRACTS.GHOST_ERC1155
            case ChainName.AvalancheTestnet:
                return AVALANCHE_TESTNET_CONTRACTS.GHOST_ERC1155
            // Not available yet on Ethereum Mainnet
            /* case ChainName.Ethereum:
                return ETHEREUM_MAINNET_CONTRACTS.GHOST_ERC1155 */
            case ChainName.EthereumTestnet:
                return ETHEREUM_TESTNET_CONTRACTS.GHOST_ERC1155
            case ChainName.BSC:
                return BSC_MAINNET_CONTRACTS.GHOST_ERC1155
            case ChainName.BSCTestnet:
                return BSC_TESTNET_CONTRACTS.GHOST_ERC1155
            case ChainName.Polygon:
                return POLYGON_MAINNET_CONTRACTS.GHOST_ERC1155
            case ChainName.PolygonTestnet:
                return POLYGON_TESTNET_CONTRACTS.GHOST_ERC1155
            default:
                throw new Error('Unsupported Network')
        }
    }

    private _getERC20ProxyContractAddress(chainName: string): string {
        switch (chainName) {
            case ChainName.Avalanche:
                return AVALANCHE_MAINNET_CONTRACTS.PROXY_ERC20
            case ChainName.AvalancheTestnet:
                return AVALANCHE_TESTNET_CONTRACTS.PROXY_ERC20
            case ChainName.Ethereum:
                return ETHEREUM_MAINNET_CONTRACTS.PROXY_ERC20
            case ChainName.EthereumTestnet:
                return ETHEREUM_TESTNET_CONTRACTS.PROXY_ERC20
            case ChainName.BSC:
                return BSC_MAINNET_CONTRACTS.PROXY_ERC20
            case ChainName.BSCTestnet:
                return BSC_TESTNET_CONTRACTS.PROXY_ERC20
            case ChainName.Polygon:
                return POLYGON_MAINNET_CONTRACTS.PROXY_ERC20
            case ChainName.PolygonTestnet:
                return POLYGON_TESTNET_CONTRACTS.PROXY_ERC20
            default:
                throw new Error('Unsupported Network')
        }
    }

    private _getNFTProxyContractAddress(chainName: string): string {
        switch (chainName) {
            case ChainName.Avalanche:
                return AVALANCHE_MAINNET_CONTRACTS.PROXY_NFT
            case ChainName.AvalancheTestnet:
                return AVALANCHE_TESTNET_CONTRACTS.PROXY_NFT
            case ChainName.Ethereum:
                return ETHEREUM_MAINNET_CONTRACTS.PROXY_NFT
            case ChainName.EthereumTestnet:
                return ETHEREUM_TESTNET_CONTRACTS.PROXY_NFT
            case ChainName.BSC:
                return BSC_MAINNET_CONTRACTS.PROXY_NFT
            case ChainName.BSCTestnet:
                return BSC_TESTNET_CONTRACTS.PROXY_NFT
            case ChainName.Polygon:
                return POLYGON_MAINNET_CONTRACTS.PROXY_NFT
            case ChainName.PolygonTestnet:
                return POLYGON_TESTNET_CONTRACTS.PROXY_NFT
            default:
                throw new Error('Unsupported Network')
        }
    }

    private _getExchangeV2ProxyContractAddress(chainName: string): string {
        switch (chainName) {
            case ChainName.Avalanche:
                return AVALANCHE_MAINNET_CONTRACTS.PROXY_EXCHANGEV2
            case ChainName.AvalancheTestnet:
                return AVALANCHE_TESTNET_CONTRACTS.PROXY_EXCHANGEV2
            case ChainName.Ethereum:
                return ETHEREUM_MAINNET_CONTRACTS.PROXY_EXCHANGEV2
            case ChainName.EthereumTestnet:
                return ETHEREUM_TESTNET_CONTRACTS.PROXY_EXCHANGEV2
            case ChainName.BSC:
                return BSC_MAINNET_CONTRACTS.PROXY_EXCHANGEV2
            case ChainName.BSCTestnet:
                return BSC_TESTNET_CONTRACTS.PROXY_EXCHANGEV2
            case ChainName.Polygon:
                return POLYGON_MAINNET_CONTRACTS.PROXY_EXCHANGEV2
            case ChainName.PolygonTestnet:
                return POLYGON_TESTNET_CONTRACTS.PROXY_EXCHANGEV2
            default:
                throw new Error('Unsupported Network')
        }
    }

    private _getRoyaltiesRegistryContractAddress(chainName: string): string {
        switch (chainName) {
            case ChainName.Avalanche:
                return AVALANCHE_MAINNET_CONTRACTS.PROXY_ROYALTIES
            case ChainName.AvalancheTestnet:
                return AVALANCHE_TESTNET_CONTRACTS.PROXY_ROYALTIES
            case ChainName.Ethereum:
                return ETHEREUM_MAINNET_CONTRACTS.PROXY_ROYALTIES
            case ChainName.EthereumTestnet:
                return ETHEREUM_TESTNET_CONTRACTS.PROXY_ROYALTIES
            case ChainName.BSC:
                return BSC_MAINNET_CONTRACTS.PROXY_ROYALTIES
            case ChainName.BSCTestnet:
                return BSC_TESTNET_CONTRACTS.PROXY_ROYALTIES
            case ChainName.Polygon:
                return POLYGON_MAINNET_CONTRACTS.PROXY_ROYALTIES
            case ChainName.PolygonTestnet:
                return POLYGON_TESTNET_CONTRACTS.PROXY_ROYALTIES
            default:
                throw new Error('Unsupported Network')
        }
    }

    private _getWrappedTokenContractAddress(chainName: string): string {
        switch (chainName) {
            case ChainName.Avalanche:
                return AVALANCHE_MAINNET_CONTRACTS.WRAPPED_TOKEN
            case ChainName.AvalancheTestnet:
                return AVALANCHE_TESTNET_CONTRACTS.WRAPPED_TOKEN
            case ChainName.Ethereum:
                return ETHEREUM_MAINNET_CONTRACTS.WRAPPED_TOKEN
            case ChainName.EthereumTestnet:
                return ETHEREUM_TESTNET_CONTRACTS.WRAPPED_TOKEN
            case ChainName.BSC:
                return BSC_MAINNET_CONTRACTS.WRAPPED_TOKEN
            case ChainName.BSCTestnet:
                return BSC_TESTNET_CONTRACTS.WRAPPED_TOKEN
            case ChainName.Polygon:
                return POLYGON_MAINNET_CONTRACTS.WRAPPED_TOKEN
            case ChainName.PolygonTestnet:
                return POLYGON_TESTNET_CONTRACTS.WRAPPED_TOKEN
            default:
                throw new Error('Unsupported Network')
        }
    }

    private _supportsEIP1559(chainName: string): boolean {
        switch (chainName) {
            case ChainName.Avalanche:
                return true
            case ChainName.AvalancheTestnet:
                return true
            case ChainName.Ethereum:
                return true
            case ChainName.EthereumTestnet:
                return true
            case ChainName.BSC:
                return false
            case ChainName.BSCTestnet:
                return false
            case ChainName.Polygon:
                return true
            case ChainName.PolygonTestnet:
                return true
            default:
                return false
        }
    }

    sendMethod(
        dataOrMethod: any,
        from: string,
        _to: string,
        value: string | undefined,
    ): Promise<any> {
        const type = this._supportsEIP1559(this._chainName) ? '0x2' : ''
        return new Promise((resolve, reject) =>
            dataOrMethod
                .send({ from, value, type })
                // .then((res:any) => resolve(res.transactionHash)) // unused as this would mean waiting for the tx to be included in a block
                .on('transactionHash', (hash: string) => resolve(hash)) // returns hash instantly
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
}
