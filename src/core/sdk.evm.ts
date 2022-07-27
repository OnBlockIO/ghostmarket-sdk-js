/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Web3 from 'web3'
import { BigNumber } from '@ethersproject/bignumber'
import {
    ERC20Contract,
    ERC20WrappedContract,
    ERC721Contract,
    ERC1155Contract,
    ERC165Contract,
    ExchangeV2Contract,
    RoyaltiesRegistryContract,
    IncentivesContract,
} from './abi'
import {
    GHOSTMARKET_TRADE_FEE_BPS,
    MAINNET_API_URL,
    Chain,
    ChainFullName,
    ChainId,
    AddressesByChain,
} from './constants'
import {
    MAX_UINT_256,
    NULL_ADDRESS_EVM,
    ERC1155_INTERFACE_ID,
    ERC721_INTERFACE_ID,
} from './constants/evm'
import { ETH, ERC20, ERC721, ERC1155, COLLECTION } from '../utils/evm/assets'
import { hashKey } from '../utils/evm/hash'
import { sign, enc, Order, Asset } from '../utils/evm/order'
import { IEVMOrder, IOrderItem, IMintItem, IRoyalties, TxObject } from '../core/models/evm'
import {
    GhostMarketApi,
    IGhostMarketApiOptions,
    PostCreateOrderRequest,
    IResult,
} from '../lib/api/'

export class GhostMarketSDK {
    // Instance of Web3 to use.
    private web3: Web3
    public readonly api: GhostMarketApi
    // Logger function to use when debugging.
    public logger: (arg: string) => void
    private _chainName: Chain
    private _chainFullName: ChainFullName
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
            chainName?: Chain
        },
        logger?: (arg: string) => void,
    ) {
        options.apiKey = options.apiKey || ''
        options.environment = options.environment || MAINNET_API_URL
        options.rpcUrl = options.rpcUrl || ''
        const useReadOnlyProvider = options.useReadOnlyProvider ?? false
        this._isReadonlyProvider = useReadOnlyProvider
        options.chainName = options.chainName || Chain.ETHEREUM
        this._chainName = options.chainName
        this._chainFullName = ChainFullName[this._chainName as keyof typeof ChainFullName]
        this._chainId = ChainId[this._chainName as keyof typeof ChainId]
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
     * @param {IOrderItem[]} items items for the order or offer.
     */
    public async createOrder(items: IOrderItem[]): Promise<IResult> {
        for (let i = 0; i < items.length; i++) {
            console.log(
                `createOrder: creating ${
                    items[i].type === 1
                        ? 'listing'
                        : items[i].baseTokenId
                        ? 'collection offer'
                        : 'offer'
                } on ${this._chainFullName}`,
            )

            if (this._isReadonlyProvider)
                throw new Error(`Can not sign transaction with a read only provider.`)

            try {
                const supportsERC721 = await this._supportsERC721(items[i].baseContract)
                const supportsERC155 = await this._supportsERC1155(items[i].baseContract)

                if (!supportsERC721 && !supportsERC155)
                    throw new Error(
                        `contract: ${items[i].baseContract} does not support ERC721 or ERC1155`,
                    )

                if (items[i].type === 1) {
                    const owner = await this._ownerOf(items[i].baseContract, items[i].baseTokenId!)

                    if (owner.toLowerCase() !== items[i].makerAddress.toLowerCase())
                        throw new Error(
                            `owner: ${owner} does not match maker: ${items[i].makerAddress}`,
                        )
                }

                const salt =
                    '0x' +
                    [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')

                const baseTokenAmount = items[i].baseTokenAmount
                    ? supportsERC721
                        ? 1
                        : items[i].baseTokenAmount
                    : 1

                const encType = supportsERC721 ? ERC721 : ERC1155

                const now = new Date().getTime() / 1000
                const startDate = items[i].startDate
                    ? parseInt(items[i].startDate!.toString()) < now
                        ? parseInt(now.toString())
                        : items[i].startDate!
                    : now
                const endDate = items[i].endDate ?? 0

                const order = Order(
                    items[i].makerAddress,
                    items[i].type === 2
                        ? Asset(
                              items[i].quoteContract === '0x' ? ETH : ERC20,
                              enc(items[i].quoteContract),
                              items[i].quotePrice,
                          )
                        : Asset(
                              encType,
                              enc(items[i].baseContract, items[i].baseTokenId),
                              baseTokenAmount!.toString(),
                          ),
                    NULL_ADDRESS_EVM,
                    items[i].type === 2 && items[i].baseTokenId
                        ? Asset(
                              encType,
                              enc(items[i].baseContract, items[i].baseTokenId),
                              baseTokenAmount!.toString(),
                          )
                        : items[i].type === 2
                        ? Asset(COLLECTION, enc(items[i].quoteContract), items[i].quotePrice)
                        : Asset(
                              items[i].quoteContract === '0x' ? ETH : ERC20,
                              enc(items[i].quoteContract),
                              items[i].quotePrice,
                          ),
                    salt,
                    startDate,
                    endDate,
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
                    chain: this._chainName,
                    token_contract: items[i].baseContract,
                    token_id: items[i].baseTokenId ?? '',
                    token_amount: baseTokenAmount,
                    quote_contract: items[i].quoteContract,
                    quote_price: items[i].quotePrice,
                    maker_address: items[i].makerAddress,
                    is_buy_offer: items[i].type === 2,
                    start_date: startDate,
                    end_date: endDate,
                    signature,
                    order_key_hash: orderKeyHash,
                    salt,
                    origin_fees: 0,
                    origin_address: '',
                } as PostCreateOrderRequest
                const listing = await this.api.postCreateOrder(
                    new PostCreateOrderRequest(nftToList),
                )
                return listing
            } catch (e) {
                throw new Error(`Failed to execute postCreateOrder ${i + 1} with error:, ${e}`)
            }
        }
        return {}
    }

    /** Cancel one or more sell order or nft offer or collection offer
     * @param {IOrderItem[]} items[] items for the order or offer cancel.
     * @param {TxObject} txObject transaction object to send when calling `bulkCancelOrders`.
     */
    public async bulkCancelOrders(items: IOrderItem[], txObject: TxObject): Promise<any> {
        console.log(
            `bulkCancelOrders: cancel ${items.length} order${items.length > 1 ? 's' : ''} on ${
                this._chainFullName
            }`,
        )

        if (this._isReadonlyProvider)
            throw new Error(`Can not sign transaction with a read only provider.`)

        const exchangeV2ProxyAddress = this._getExchangeV2ProxyContractAddress(this._chainName)
        const ExchangeV2CoreContractInstance = new this.web3.eth.Contract(
            ExchangeV2Contract,
            exchangeV2ProxyAddress,
        )

        const ordersArray = []
        for (let i = 0; i < items.length; i++) {
            const supportsERC721 = await this._supportsERC721(items[i].baseContract)

            if (items[i].makerAddress.toLowerCase() !== txObject.from.toLowerCase())
                throw new Error(
                    `maker: ${items[i].makerAddress} does not match tx.sender: ${txObject.from}`,
                )

            const baseTokenAmount = items[i].baseTokenAmount
                ? supportsERC721
                    ? 1
                    : items[i].baseTokenAmount
                : 1

            const encType = supportsERC721 ? ERC721 : ERC1155

            const order = Order(
                items[i].makerAddress,
                items[i].type === 2 && items[i].baseTokenId
                    ? Asset(
                          items[i].quoteContract === '0x' ? ETH : ERC20,
                          enc(items[i].quoteContract),
                          items[i].quotePrice,
                      )
                    : items[i].type === 2
                    ? Asset(
                          items[i].quoteContract === '0x' ? ETH : ERC20,
                          enc(items[i].quoteContract),
                          items[i].quotePrice,
                      )
                    : Asset(
                          encType,
                          enc(items[i].baseContract, items[i].baseTokenId),
                          baseTokenAmount!.toString(),
                      ),
                NULL_ADDRESS_EVM,
                items[i].type === 2 && items[i].baseTokenId
                    ? Asset(
                          encType,
                          enc(items[i].baseContract, items[i].baseTokenId),
                          baseTokenAmount!.toString(),
                      )
                    : items[i].type === 2
                    ? Asset(COLLECTION, enc(items[i].quoteContract), items[i].quotePrice)
                    : Asset(
                          items[i].quoteContract === '0x' ? ETH : ERC20,
                          enc(items[i].quoteContract),
                          items[i].quotePrice,
                      ),
                items[i].salt!,
                items[i].startDate!,
                items[i].endDate!,
                '0xffffffff',
                '0x',
            )

            ordersArray.push(order)
        }

        try {
            const data = await ExchangeV2CoreContractInstance.methods.bulkCancelOrders(ordersArray)
            return this.sendMethod(data, txObject.from, exchangeV2ProxyAddress, undefined)
        } catch (e) {
            throw new Error(
                `bulkCancelOrders: failed to execute bulkCancelOrders on ${exchangeV2ProxyAddress} with error: ${e}`,
            )
        }
    }

    /** Prepare match of a sell order or a single nft offer or a collection offer
     * @param {IOrderItem} orderMaker order to match.
     * @param {TxObject} txObject transaction object to send when calling `matchOrders`.
     */
    public async matchOrders(orderMaker: IOrderItem, txObject: TxObject): Promise<any> {
        console.log(
            `matchOrders: matching ${
                orderMaker.type === 1
                    ? 'listing'
                    : orderMaker.baseTokenId
                    ? 'offer'
                    : 'collection offer'
            } on ${this._chainFullName}`,
        )

        if (this._isReadonlyProvider)
            throw new Error(`Can not sign transaction with a read only provider.`)

        try {
            const supportsERC721 = await this._supportsERC721(orderMaker.baseContract)

            if (orderMaker.makerAddress.toLowerCase() === txObject.from.toLowerCase())
                throw new Error(
                    `maker: ${orderMaker.makerAddress} and tx.sender: ${txObject.from} can not be the same`,
                )

            const baseTokenAmount = orderMaker.baseTokenAmount
                ? supportsERC721
                    ? 1
                    : orderMaker.baseTokenAmount
                : 1

            const encType = supportsERC721 ? ERC721 : ERC1155

            const _orderMaker = Order(
                orderMaker.type === 2 && orderMaker.baseTokenId
                    ? orderMaker.makerAddress
                    : orderMaker.type === 2
                    ? txObject.from
                    : orderMaker.makerAddress,
                orderMaker.type === 2 && orderMaker.baseTokenId
                    ? Asset(
                          orderMaker.quoteContract === '0x' ? ETH : ERC20,
                          enc(orderMaker.quoteContract),
                          orderMaker.quotePrice,
                      )
                    : orderMaker.type === 2
                    ? Asset(
                          encType,
                          enc(orderMaker.baseContract, orderMaker.baseTokenId),
                          baseTokenAmount!.toString(),
                      )
                    : Asset(
                          encType,
                          enc(orderMaker.baseContract, orderMaker.baseTokenId),
                          baseTokenAmount!.toString(),
                      ),
                NULL_ADDRESS_EVM,
                orderMaker.type === 2 && orderMaker.baseTokenId
                    ? Asset(
                          encType,
                          enc(orderMaker.baseContract, orderMaker.baseTokenId),
                          baseTokenAmount!.toString(),
                      )
                    : orderMaker.type === 2
                    ? Asset(
                          orderMaker.quoteContract === '0x' ? ETH : ERC20,
                          enc(orderMaker.quoteContract),
                          orderMaker.quotePrice,
                      )
                    : Asset(
                          orderMaker.quoteContract === '0x' ? ETH : ERC20,
                          enc(orderMaker.quoteContract),
                          orderMaker.quotePrice,
                      ),
                orderMaker.salt!,
                orderMaker.startDate!,
                orderMaker.endDate!,
                '0xffffffff',
                '0x',
            )

            const _orderTaker = Order(
                orderMaker.type === 2 && orderMaker.baseTokenId
                    ? txObject.from
                    : orderMaker.type === 2
                    ? orderMaker.makerAddress
                    : txObject.from,
                orderMaker.type === 2 && orderMaker.baseTokenId
                    ? Asset(
                          encType,
                          enc(orderMaker.baseContract, orderMaker.baseTokenId),
                          baseTokenAmount.toString(),
                      )
                    : orderMaker.type === 2
                    ? Asset(
                          orderMaker.quoteContract === '0x' ? ETH : ERC20,
                          enc(orderMaker.quoteContract),
                          orderMaker.quotePrice,
                      )
                    : Asset(
                          orderMaker.quoteContract === '0x' ? ETH : ERC20,
                          enc(orderMaker.quoteContract),
                          orderMaker.quotePrice,
                      ),
                NULL_ADDRESS_EVM,
                orderMaker.type === 2 && orderMaker.baseTokenId
                    ? Asset(
                          orderMaker.quoteContract === '0x' ? ETH : ERC20,
                          enc(orderMaker.quoteContract),
                          orderMaker.quotePrice,
                      )
                    : orderMaker.type === 2
                    ? Asset(COLLECTION, enc(orderMaker.baseContract), baseTokenAmount.toString())
                    : Asset(
                          encType,
                          enc(orderMaker.baseContract, orderMaker.baseTokenId),
                          baseTokenAmount.toString(),
                      ),
                orderMaker.salt!,
                orderMaker.startDate!,
                orderMaker.endDate!,
                '0xffffffff',
                '0x',
            )

            const _signatureTaker = '0x'

            const priceTotal = BigNumber.from(orderMaker.quotePrice)
            const priceToSend =
                orderMaker.quoteContract === '0x' && orderMaker.type === 1
                    ? priceTotal.mul(GHOSTMARKET_TRADE_FEE_BPS).div(10000).toString()
                    : undefined

            txObject = {
                from: txObject.from,
                value: priceToSend,
            }

            return this._matchOrders(
                _orderMaker,
                orderMaker.signature!,
                _orderTaker,
                _signatureTaker,
                txObject,
            )
        } catch (e) {
            throw new Error(`matchOrders: failed to execute with error: ${e}`)
        }
    }

    /** Match orders
     * @param {IEVMOrder} orderLeft order left to match.
     * @param {string} signatureLeft signature left to match.
     * @param {IEVMOrder} orderRight order right to match.
     * @param {string} signatureRight signature right to match.
     * @param {TxObject} txObject transaction object to send when calling `_matchOrders`.
     */
    public async _matchOrders(
        orderLeft: IEVMOrder,
        signatureLeft: string,
        orderRight: IEVMOrder,
        signatureRight: string,
        txObject: TxObject,
    ): Promise<any> {
        if (this._isReadonlyProvider)
            throw new Error(`Can not sign transaction with a read only provider.`)

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
            throw new Error(
                `_matchOrders: failed to execute matchOrders on ${exchangeV2ProxyAddress} with error:
                ${e}`,
            )
        }
    }

    /** Set royalties for contract
     * @param {string} contractAddress contract address to set royalties for.
     * @param {IRoyalties[]} royalties royalties settings to use for the contract.
     * @param {TxObject} txObject transaction object to send when calling `setRoyaltiesForContract`.
     */
    public async setRoyaltiesForContract(
        contractAddress: string,
        royalties: IRoyalties[],
        txObject: TxObject,
    ): Promise<any> {
        console.log(
            `setRoyaltiesForContract: set royalties for contract ${contractAddress} on ${this._chainFullName}`,
        )

        if (this._isReadonlyProvider)
            throw new Error(`Can not sign transaction with a read only provider.`)

        const supportsERC721 = await this._supportsERC721(contractAddress)
        const supportsERC155 = await this._supportsERC1155(contractAddress)

        if (!supportsERC721 && !supportsERC155)
            throw new Error(`contract: ${contractAddress} does not support ERC721 or ERC1155`)

        const owner = await this._getOwner(contractAddress, supportsERC721)

        if (owner.toLowerCase() !== txObject.from.toLowerCase())
            throw new Error(`owner: ${owner} does not match tx.sender: ${txObject.from}`)

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
            throw new Error(
                `setRoyaltiesForContract: failed to execute setRoyaltiesByToken on ${royaltiesRegistryProxyAddress} with error: 
                ${e}`,
            )
        }
    }

    /** Wrap token or unwrap token
     * @param {string} amount value to wrap token from/to.
     * @param {boolean} isFromNativeToWrap true if native to wrap, or false from wrap to native.
     * @param {TxObject} txObject transaction object to send when calling `wrapToken`.
     */
    public async wrapToken(
        amount: string,
        isFromNativeToWrap: boolean,
        txObject: TxObject,
    ): Promise<any> {
        console.log(
            `wrapToken: ${isFromNativeToWrap ? '' : 'un'}wrap token amount of ${amount} on ${
                this._chainFullName
            }`,
        )

        if (this._isReadonlyProvider)
            throw new Error(`Can not sign transaction with a read only provider.`)

        const wrappedTokenAddress = this._getWrappedTokenContractAddress(this._chainName)
        const WrappedTokenContractInstance = new this.web3.eth.Contract(
            ERC20WrappedContract,
            wrappedTokenAddress,
        )

        if (isFromNativeToWrap) {
            const bal = await this.checkBalance(txObject.from)
            let balance = 0
            if (bal) {
                balance = parseFloat(bal)
            }

            const amountDiff = BigNumber.from(amount)
            const balanceDiff = BigNumber.from(balance.toString())
            const diff = amountDiff.sub(balanceDiff)
            if (diff.gt(BigNumber.from(0))) {
                throw new Error(
                    `Not enough balance to convert from native to wrapped, missing: ${BigNumber.from(
                        diff,
                    )}`,
                )
            }
        } else {
            const balance = await this.checkTokenBalance(wrappedTokenAddress, txObject.from)

            const amountDiff = BigNumber.from(amount)
            const balanceDiff = BigNumber.from(balance.toString())
            const diff = amountDiff.sub(balanceDiff)
            if (diff.gt(BigNumber.from(0))) {
                throw new Error(
                    `Not enough balance to convert from wrapped to native, missing: ${BigNumber.from(
                        diff,
                    )}`,
                )
            }
        }

        if (isFromNativeToWrap) {
            try {
                const data = await WrappedTokenContractInstance.methods.deposit()
                return this.sendMethod(data, txObject.from, wrappedTokenAddress, amount)
            } catch (e) {
                throw new Error(
                    `wrapToken: Failed to execute deposit on ${wrappedTokenAddress} with error:
                    ${e}`,
                )
            }
        } else {
            try {
                const data = await WrappedTokenContractInstance.methods.withdraw(amount)
                return this.sendMethod(data, txObject.from, wrappedTokenAddress, undefined)
            } catch (e) {
                throw new Error(
                    `wrapToken: failed to execute withdraw on ${wrappedTokenAddress} with error:
                    ${e}`,
                )
            }
        }
    }

    /** Approve NFT Contract
     * @param {string} contractAddress nft contract to approve.
     * @param {TxObject} txObject transaction object to send when calling `approveContract`.
     */
    public async approveContract(contractAddress: string, txObject: TxObject): Promise<any> {
        console.log(
            `approveContract: approve nft contract ${contractAddress} on ${this._chainFullName}`,
        )

        if (this._isReadonlyProvider)
            throw new Error(`Can not sign transaction with a read only provider.`)

        const supportsERC721 = await this._supportsERC721(contractAddress)
        const supportsERC155 = await this._supportsERC1155(contractAddress)

        if (!supportsERC721 && !supportsERC155)
            throw new Error(`contract: ${contractAddress} does not support ERC721 or ERC1155`)

        const proxyContractAddress = this._getNFTProxyContractAddress(this._chainName)
        const ContractInstance = new this.web3.eth.Contract(ERC721Contract, contractAddress)

        try {
            const data = await ContractInstance.methods.setApprovalForAll(
                proxyContractAddress,
                true,
            )
            return this.sendMethod(data, txObject.from, contractAddress, undefined)
        } catch (e) {
            throw new Error(
                `approveContract: failed to execute setApprovalForAll on ${contractAddress} with error: ${e}`,
            )
        }
    }

    /** Approve Token Contract
     * @param {string} contractAddress token contract to approve.
     * @param {TxObject} txObject transaction object to send when calling `approveToken`.
     */
    public async approveToken(contractAddress: string, txObject: TxObject): Promise<any> {
        console.log(
            `approveToken: approve token contract ${contractAddress} on ${this._chainFullName}`,
        )

        if (this._isReadonlyProvider)
            throw new Error(`Can not sign transaction with a read only provider.`)

        const proxyContractAddress = this._getERC20ProxyContractAddress(this._chainName)
        const ContractInstance = new this.web3.eth.Contract(ERC721Contract, contractAddress)

        try {
            const data = await ContractInstance.methods.approve(proxyContractAddress, MAX_UINT_256)
            return this.sendMethod(data, txObject.from, contractAddress, undefined)
        } catch (e) {
            throw new Error(`Failed to execute approve on ${contractAddress} with error: ${e}`)
        }
    }

    /** Check NFT Contract Approval
     * @param {string} contractAddress nft contract to check approval.
     * @param {string} accountAddress address used to check.
     */
    public async checkContractApproval(
        contractAddress: string,
        accountAddress: string,
    ): Promise<any> {
        console.log(
            `checkContractApproval: check nft contract ${contractAddress} approval on ${this._chainFullName}`,
        )

        const supportsERC721 = await this._supportsERC721(contractAddress)
        const supportsERC1155 = await this._supportsERC1155(contractAddress)

        if (!supportsERC721 && !supportsERC1155)
            throw new Error(`contract: ${contractAddress} does not support ERC721 or ERC1155`)

        const proxyContractAddress = this._getNFTProxyContractAddress(this._chainName)
        const ContractInstance = new this.web3.eth.Contract(ERC721Contract, contractAddress)

        try {
            const data = await ContractInstance.methods.isApprovedForAll(
                accountAddress,
                proxyContractAddress,
            )
            return await this.callMethod(data, accountAddress)
        } catch (e) {
            throw new Error(
                `checkContractApproval: failed to execute isApprovedForAll on ${contractAddress} with error: 
                    ${e}`,
            )
        }
    }

    /** Check ERC20 Token Contract Approval
     * @param {string} contractAddress token contract to check approval.
     * @param {string} accountAddress address used to check.
     */
    public async checkTokenApproval(contractAddress: string, accountAddress: string): Promise<any> {
        console.log(
            `checkTokenApproval: check token contract ${contractAddress} approval for ${accountAddress} on ${this._chainFullName}`,
        )

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
            throw new Error(
                `checkTokenApproval: failed to execute allowance on ${contractAddress} with error: ${e}`,
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
    ): Promise<any> {
        console.log(
            `transferERC20: transfer ${amount} from ERC20 contract ${contractAddress} to ${destinationAddress} on ${this._chainFullName}`,
        )

        if (this._isReadonlyProvider)
            throw new Error(`Can not sign transaction with a read only provider.`)

        const balance = await this.checkTokenBalance(contractAddress, txObject.from)

        const amountDiff = BigNumber.from(amount)
        const balanceDiff = BigNumber.from(balance.toString())
        const diff = amountDiff.sub(balanceDiff)
        if (diff.gt(BigNumber.from(0))) {
            throw new Error(
                `not enough ERC20 balance to transfer, missing: ${BigNumber.from(diff)}`,
            )
        }

        const ContractInstance = new this.web3.eth.Contract(ERC20Contract, contractAddress)

        try {
            const data = await ContractInstance.methods.transfer(destinationAddress, amount)
            return this.sendMethod(data, txObject.from, contractAddress, undefined)
        } catch (e) {
            throw new Error(
                `transferERC20: failed to execute transfer on ${contractAddress} with error: ${e}`,
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
    ): Promise<any> {
        console.log(
            `transferERC721: transfer NFT with token id ${tokenId} from ERC721 contract ${contractAddress} to ${destinationAddress} on ${this._chainFullName}`,
        )

        if (this._isReadonlyProvider)
            throw new Error(`Can not sign transaction with a read only provider.`)

        const owner = await this._ownerOf(contractAddress, tokenId)

        if (owner.toLowerCase() !== txObject.from.toLowerCase())
            throw new Error(`owner: ${owner} does not match tx.sender: ${txObject.from}`)

        const ContractInstance = new this.web3.eth.Contract(ERC721Contract, contractAddress)

        try {
            const data = await ContractInstance.methods.safeTransferFrom(
                txObject.from,
                destinationAddress,
                tokenId,
            )
            return this.sendMethod(data, txObject.from, contractAddress, undefined)
        } catch (e) {
            throw new Error(
                `transferERC721: failed to execute safeTransferFrom on ${contractAddress} with error: ${e}`,
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
    ): Promise<any> {
        console.log(
            `transferERC1155: transfer ${tokenIds.length} NFT${
                tokenIds.length > 1 ? 's' : ''
            } from ERC1155 contract ${contractAddress} to ${destinationAddress} on ${
                this._chainFullName
            }`,
        )

        if (this._isReadonlyProvider)
            throw new Error(`Can not sign transaction with a read only provider.`)

        for (let i = 0; i < tokenIds.length; i++) {
            const balance = await this._balanceOf(txObject.from, contractAddress, tokenIds[i])

            if (balance === 0)
                throw new Error(
                    `sender: ${txObject.from} does not own enough tokenId ${tokenIds[i]}`,
                )
        }
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
            throw new Error(
                `transferERC1155: failed to execute safeBatchTransferFrom on ${contractAddress} with error: ${e}`,
            )
        }
    }

    /** Burn ERC721 NFT
     * @param {string} contractAddress contract of NFT to transfer.
     * @param {string} tokenId tokenId of NFT to transfer.
     * @param {TxObject} txObject transaction object to send when calling `burnERC721`.
     */
    public async burnERC721(
        contractAddress: string,
        tokenId: string,
        txObject: TxObject,
    ): Promise<any> {
        console.log(
            `burnERC721: burn 1 NFT from ERC721 contract ${contractAddress} with token id ${tokenId} on ${this._chainFullName}`,
        )
        if (this._isReadonlyProvider)
            throw new Error(`Can not sign transaction with a read only provider.`)

        const owner = await this._ownerOf(contractAddress, tokenId)

        if (owner.toLowerCase() !== txObject.from.toLowerCase())
            throw new Error(`owner: ${owner} does not match tx.sender: ${txObject.from}`)

        const ContractInstance = new this.web3.eth.Contract(ERC721Contract, contractAddress)

        try {
            const data = await ContractInstance.methods.burn(tokenId)
            return this.sendMethod(data, txObject.from, contractAddress, undefined)
        } catch (e) {
            throw new Error(
                `burnERC721: failed to execute burn on ${contractAddress} with error: ${e}`,
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
    ): Promise<any> {
        console.log(
            `burnERC1155: burn ${amount} NFT${
                amount > 1 ? 's' : ''
            } from ERC1155 contract ${contractAddress} with token id ${tokenId} on ${
                this._chainFullName
            }`,
        )

        if (this._isReadonlyProvider)
            throw new Error(`Can not sign transaction with a read only provider.`)

        const balance = await this._balanceOf(txObject.from, contractAddress, tokenId)

        if (balance === 0)
            throw new Error(`sender: ${txObject.from} does not own enough token ${tokenId}`)

        const ContractInstance = new this.web3.eth.Contract(ERC1155Contract, contractAddress)

        try {
            const data = await ContractInstance.methods.burn(txObject.from, tokenId, amount)
            return this.sendMethod(data, txObject.from, contractAddress, undefined)
        } catch (e) {
            throw new Error(
                `burnERC1155: failed to execute burn on ${contractAddress} with error: ${e}`,
            )
        }
    }

    /** Mint ERC721 GHOST NFT
     * @param {IMintItem} item details.
     * @param {TxObject} txObject transaction object to send when calling `mintERC721`.
     */
    public async mintERC721(item: IMintItem, txObject: TxObject): Promise<any> {
        console.log(`mintERC721: mint 1 ERC721 NFT on ${this._chainFullName}`)

        if (this._isReadonlyProvider)
            throw new Error(`Can not sign transaction with a read only provider.`)

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
            throw new Error(
                `mintERC721: failed to execute mintGhost on ${ERC721GhostAddress} with error: ${e}`,
            )
        }
    }

    /** Mint ERC1155 GHOST NFT
     * @param {IMintItem} item details.
     * @param {number} amount amount of NFT to mint.
     * @param {TxObject} txObject transaction object to send when calling `mintERC1155`.
     */
    public async mintERC1155(item: IMintItem, amount: number, txObject: TxObject): Promise<any> {
        console.log(`mintERC1155: mint ${amount} ERC1155 NFT on ${this._chainFullName}`)

        if (this._isReadonlyProvider)
            throw new Error(`Can not sign transaction with a read only provider.`)

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
            throw new Error(
                `mintERC1155: failed to execute mintGhost on ${ERC1155GhostAddress} with error: ${e}`,
            )
        }
    }

    /** Check native balance for address
     * @param {string} accountAddress address used to check.
     */
    public async checkBalance(accountAddress: string): Promise<any> {
        console.log(
            `checkBalance: checking native balance for address ${accountAddress} on ${this._chainFullName}`,
        )

        try {
            const data = await this.web3.eth.getBalance(accountAddress)
            return data
        } catch (e) {
            throw new Error(`checkBalance: failed to execute getBalance with error: ${e}`)
        }
    }

    /** Check one token balance for address
     * @param {string} contractAddress token contract to check approval.
     * @param {string} accountAddress address used to check.
     */
    public async checkTokenBalance(contractAddress: string, accountAddress: string): Promise<any> {
        console.log(
            `checkTokenBalance: checking token balance for contract ${contractAddress} for address ${accountAddress} on ${this._chainFullName}`,
        )

        const ERC20ContractInstance = new this.web3.eth.Contract(
            ERC20WrappedContract,
            contractAddress,
        )

        try {
            const data = await ERC20ContractInstance.methods.balanceOf(accountAddress)
            return await this.callMethod(data, accountAddress)
        } catch (e) {
            throw new Error(
                `checkTokenBalance: failed to execute balanceOf on ${contractAddress} with error: ${e}`,
            )
        }
    }

    /** Check incentives for address
     * @param {string} accountAddress address used to check.
     */
    public async checkIncentives(accountAddress: string): Promise<any> {
        console.log(
            `checkIncentives: checking incentives for address ${accountAddress} on ${this._chainFullName}`,
        )

        const IncentivesContractAddressAddress = this._getIncentivesContractAddress(this._chainName)
        const IncentivesContractInstance = new this.web3.eth.Contract(
            IncentivesContract,
            IncentivesContractAddressAddress,
        )

        try {
            const data = await IncentivesContractInstance.methods.incentives(accountAddress)
            return this.callMethod(data, accountAddress)
        } catch (e) {
            throw new Error(
                `checkIncentives: failed to execute incentives on ${IncentivesContractAddressAddress} with error: ${e}`,
            )
        }
    }

    /** Claim incentives
     * @param {TxObject} txObject transaction object to send when calling `claimIncentives`.
     */
    public async claimIncentives(txObject: TxObject): Promise<any> {
        console.log(
            `claimIncentives: claiming incentives for address ${txObject.from} on ${this._chainFullName}`,
        )

        if (this._isReadonlyProvider)
            throw new Error(`Can not sign transaction with a read only provider.`)

        const balance = await this.checkIncentives(txObject.from)
        if (parseInt(balance.availableIncentives) === 0) {
            throw new Error(`nothing to claim on incentives contract`)
        }

        const IncentivesContractAddressAddress = this._getIncentivesContractAddress(this._chainName)
        const IncentivesContractInstance = new this.web3.eth.Contract(
            IncentivesContract,
            IncentivesContractAddressAddress,
        )

        try {
            const data = await IncentivesContractInstance.methods.claim()
            return this.sendMethod(data, txObject.from, IncentivesContractAddressAddress, undefined)
        } catch (e) {
            throw new Error(
                `claimIncentives: failed to execute claim on ${IncentivesContractAddressAddress} with error: ${e}`,
            )
        }
    }

    /** Sign Data
     * @param {string} dataToSign data to sign.
     * @param {string} accountAddress address used to sign data.
     */
    public async signData(dataToSign: string, accountAddress: string): Promise<any> {
        console.log(
            `signData: signing data with address ${accountAddress} on ${this._chainFullName}`,
        )

        try {
            const hash = this.web3.utils.sha3(dataToSign)!
            const data = this.web3.eth.sign(hash, accountAddress)
            return data
        } catch (e) {
            throw new Error(`signData: Failed to execute sign with error: ${e}`)
        }
    }

    /** Get Incentives contract address
     * @param {string} chainName chain name to check.
     */
    private _getIncentivesContractAddress(chainName: string): string {
        return AddressesByChain[chainName as keyof typeof AddressesByChain].INCENTIVES
    }

    /** Get ERC721 Ghost contract address
     * @param {string} chainName chain name to check.
     */
    private _getERC721GhostContractAddress(chainName: string): string {
        return AddressesByChain[chainName as keyof typeof AddressesByChain].GHOST_ERC721!
    }

    /** Get ERC1155 Ghost contract address
     * @param {string} chainName chain name to check.
     */
    private _getERC1155GhostContractAddress(chainName: string): string {
        return AddressesByChain[chainName as keyof typeof AddressesByChain].GHOST_ERC1155!
    }

    /** Get ERC20 Proxy contract address
     * @param {string} chainName chain name to check.
     */
    private _getERC20ProxyContractAddress(chainName: string): string {
        return AddressesByChain[chainName as keyof typeof AddressesByChain].PROXY_ERC20!
    }

    /** Get NFT Proxy contract address
     * @param {string} chainName chain name to check.
     */
    private _getNFTProxyContractAddress(chainName: string): string {
        return AddressesByChain[chainName as keyof typeof AddressesByChain].PROXY_NFT!
    }

    /** Get ExchangeV2 contract address
     * @param {string} chainName chain name to check.
     */
    private _getExchangeV2ProxyContractAddress(chainName: string): string {
        return AddressesByChain[chainName as keyof typeof AddressesByChain].EXCHANGE
    }

    /** Get Royalties contract address
     * @param {string} chainName chain name to check.
     */
    private _getRoyaltiesRegistryContractAddress(chainName: string): string {
        return AddressesByChain[chainName as keyof typeof AddressesByChain].ROYALTIES!
    }

    /** Get Wrapped Token contract address
     * @param {string} chainName chain name to check.
     */
    private _getWrappedTokenContractAddress(chainName: string): string {
        return AddressesByChain[chainName as keyof typeof AddressesByChain].WRAPPED_TOKEN!
    }

    /** Get chain support for EIP1559
     * @param {string} chainName chain name to check.
     */
    private _supportsEIP1559(chainName: string): boolean {
        switch (chainName) {
            case Chain.AVALANCHE:
                return true
            case Chain.AVALANCHE_TESTNET:
                return true
            case Chain.ETHEREUM:
                return true
            case Chain.ETHEREUM_TESTNET:
                return true
            case Chain.BSC:
                return false
            case Chain.BSC_TESTNET:
                return false
            case Chain.POLYGON:
                return true
            case Chain.POLYGON_TESTNET:
                return true
            default:
                return false
        }
    }

    /** Get owner of a contract
     * @param {string} contractAddress contract address.
     * @param {boolean} isERC721 true for ERC721, false for ERC1155.
     */
    private _getOwner(contractAddress: string, isERC721: boolean): Promise<any> {
        console.log(
            `_getOwner: checking ${
                isERC721 ? 'ERC721' : 'ERC1155'
            } contract ownership for contract ${contractAddress} on ${this._chainFullName}`,
        )

        const ContractInstance = new this.web3.eth.Contract(
            isERC721 ? ERC721Contract : ERC1155Contract,
            contractAddress,
        )

        return ContractInstance.methods
            .owner()
            .call()
            .then((res: any) => {
                return res
            })
            .catch((e: any) => {
                console.log(e)
                return NULL_ADDRESS_EVM
            })
    }

    /** Get owner of an ERC721 NFT
     * @param {string} contractAddress contract address of NFT.
     * @param {string} tokenId tokenId of NFT.
     */
    private async _ownerOf(contractAddress: string, tokenId: string): Promise<any> {
        console.log(
            `_balanceOf: checking ERC721 owner for contract ${contractAddress} for token id ${tokenId} on ${this._chainFullName}`,
        )

        const supportsERC721 = await this._supportsERC721(contractAddress)
        if (supportsERC721) {
            const NFTContractInstance = new this.web3.eth.Contract(ERC721Contract, contractAddress)

            return NFTContractInstance.methods
                .ownerOf(tokenId)
                .call()
                .then((res: any) => {
                    return res
                })
                .catch((e: any) => {
                    console.log(e)
                    return NULL_ADDRESS_EVM
                })
        }
        return NULL_ADDRESS_EVM
    }

    /** Get balance of one address for an ERC1155 NFT
     * @param {string} address addres to check.
     * @param {string} contractAddress contract address of NFT.
     * @param {string} tokenId tokenId of NFT.
     */
    private async _balanceOf(
        address: string,
        contractAddress: string,
        tokenId: string,
    ): Promise<number> {
        console.log(
            `_balanceOf: checking ERC1155 balance for contract ${contractAddress} for address ${address} for token id ${tokenId} on ${this._chainFullName}`,
        )

        const supportsERC1555 = await this._supportsERC1155(contractAddress)
        if (supportsERC1555) {
            const NFTContractInstance = new this.web3.eth.Contract(ERC1155Contract, contractAddress)

            return NFTContractInstance.methods
                .balanceOf(address, tokenId)
                .call()
                .then((res: any) => {
                    return res
                })
                .catch((e: any) => {
                    console.log(e)
                    return 0
                })
        }
        return 0
    }

    /** Get contract support for ERC721
     * @param {string} contractAddress contract address to check.
     */
    private _supportsERC721(contractAddress: string): Promise<boolean> {
        console.log(
            `_supportsERC721: checking support for ERC721 for contract ${contractAddress} on ${this._chainFullName}`,
        )

        const NFTContractInstance = new this.web3.eth.Contract(ERC165Contract, contractAddress)

        return NFTContractInstance.methods
            .supportsInterface(ERC721_INTERFACE_ID)
            .call()
            .then((res: any) => {
                return res
            })
            .catch((e: any) => {
                console.log(e)
                return false
            })
    }

    /** Get contract support for ERC1155
     * @param {string} contractAddress contract address to check.
     */
    private _supportsERC1155(contractAddress: string): Promise<boolean> {
        console.log(
            `_supportsERC1155: checking support for ERC1155 for contract ${contractAddress} on ${this._chainFullName}`,
        )

        const NFTContractInstance = new this.web3.eth.Contract(ERC165Contract, contractAddress)

        return NFTContractInstance.methods
            .supportsInterface(ERC1155_INTERFACE_ID)
            .call()
            .then((res: any) => {
                return res
            })
            .catch((e: any) => {
                console.log(e)
                return false
            })
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
