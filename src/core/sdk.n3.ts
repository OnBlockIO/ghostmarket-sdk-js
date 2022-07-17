/* eslint-disable @typescript-eslint/no-unused-vars */
import { numberToByteString, getScriptHashFromAddress, b64EncodeUnicode } from '../utils/n3/helpers'
import { N3PrivateProvider } from '../utils/n3/N3PrivateProvider'
import {
    N3_MAINNET_CONTRACTS,
    N3_TESTNET_CONTRACTS,
    MAX_INT_255,
    MAINNET_API_URL,
    Network,
} from './constants'
import { GhostMarketApi, IGhostMarketApiOptions } from '../lib/api/ghostmarket'

// not included in main frontend lib yet
interface IBuyItem {
    contractAuctionId: string // on chain contract auction ID.
    ownerAddress: string // order owner.
    price: string // order price.
    quoteContractHash: string // order quote contract hash.
}

// not included in main frontend lib yet
interface ISellItem {
    tokenId: string // NFT token id.
    baseContractHash: string // order base contract hash.
    price: string // order price.
    quoteContractHash: string // order quote contract hash.
}

// not included in main frontend lib yet
interface IBidItem {
    contractAuctionId: string // on chain contract auction ID.
    bidPrice?: string // order bid price.
    quoteContractHash: string // order quote contract hash.
}

// not included in main frontend lib yet
interface ITransferItem {
    contract: string // NFT contract hash.
    destAddress: string // Transfer destination address.
    tokenId: string // NFT token id.
}

// not included in main frontend lib yet
interface IBurnItem {
    contract: string // NFT contract hash.
    tokenId: string // NFT token id.
}

// not included in main frontend lib yet
interface IAuctionItem {
    auctionType: number // classic (1) reserve (2) dutch (3) fixed (0)
    tokenId: string // NFT token id.
    baseContractHash: string // order base contract hash.
    extensionPeriod?: number // extension period.
    startDate: number // order start date.
    endDate: number // order end date.
    startPrice?: number // order start price.
    endPrice?: number // order end price.
    quoteContractHash: string // order quote contract hash.
}

// not included in main frontend lib yet
interface IOfferItem {
    baseScriptHash: string // offer base contract hash.
    quoteScriptHash: string // offer quote contract hash.
    tokenId: string // offer token id.
    price: number // offer price.
    startDate: number // offer start date.
    endDate: number // offer end date.
    auctionId?: string // offer on chain auction id.
}

// not included in main frontend lib yet
interface IMintItem {
    quantity: number // NFT quantity.
    attrT1: string // NFT Attr Type 1.
    attrV1: string // NFT Attr Value 1.
    attrT2: string // NFT Attr Type 2.
    attrV2: string // NFT Attr Value 2.
    attrT3: string // NFT Attr Type 3.
    attrV3: string // NFT Attr Value 3.
    name: string // NFT name.
    description: string // NFT description.
    imageURL: string // image URL.
    externalURI: string // external URI.
    royalties: number // Royalties value in BPS.
    type: string // NFT Type.
}

// not included in main frontend lib yet
interface Royalties {
    royaltiesRecipients: RoyaltyRecipient[]
}

// not included in main frontend lib yet
interface RoyaltyRecipient {
    recipient: string
    amount: number
}

// not included in main frontend lib yet
interface IArgs {
    type: string
    value: string | any
}

const METHOD_BID_TOKEN = 'bidToken'
const METHOD_CANCEL_SALE = 'cancelSale'
const METHOD_LIST_TOKEN = 'listToken'
const METHOD_EDIT_SALE = 'editSale'
const METHOD_TRANSFER = 'transfer'
const METHOD_BURN = 'burn'
const METHOD_MINT = 'mint'
const METHOD_MULTI_MINT = 'multiMint'
const METHOD_SET_COLLECTION_ROYALTIES = 'setRoyaltiesForContract'
const METHOD_CLAIM_INCENTIVES = 'claim'
const METHOD_CHECK_INCENTIVES = 'getIncentive'
const METHOD_CHECK_TOKEN_BALANCE = 'balanceOf'
const METHOD_APPROVE_TOKEN = 'approve'
const METHOD_CHECK_ALLOWANCE = 'allowance'
const METHOD_PLACE_OFFER = 'placeOffer'
const METHOD_ACCEPT_OFFER = 'acceptOffer'
const METHOD_CANCEL_OFFER = 'cancelOffer'

export class GhostMarketN3SDK {
    private provider: string
    public readonly api: GhostMarketApi
    // Logger function to use when debugging.
    public logger: (arg: string) => void
    private _providerRPCUrl: string
    private _privateKey: string
    private isMainNet: boolean
    private chainName: string
    private contractExchangeAddress: string
    private contractIncentivesAddress: string

    /**
     * Your instance of GhostMarket.
     * Make API calls and GhostMarket Smart Contract method calls.
     * @param  {string} provider To use for creating an instance.
     * @param  {GhostMarketSDKConfig} options with options for accessing GhostMarket SDK.
     * @param  {(arg:string)=>void} logger? // Optional logger function for logging debug messages.
     */
    constructor(
        provider: string,
        options: {
            apiKey?: string
            environment?: string
            privateKey?: string
            rpcUrl?: string
            chainName?: Network
        },
        logger?: (arg: string) => void,
    ) {
        options.apiKey = options.apiKey || ''
        options.environment = options.environment || MAINNET_API_URL
        this.isMainNet = options.chainName === Network.Neo3
        this.contractExchangeAddress = this.isMainNet
            ? N3_MAINNET_CONTRACTS.EXCHANGE
            : N3_TESTNET_CONTRACTS.EXCHANGE
        this.contractIncentivesAddress = this.isMainNet
            ? N3_MAINNET_CONTRACTS.INCENTIVES
            : N3_TESTNET_CONTRACTS.INCENTIVES
        options.privateKey = options.privateKey || ''
        options.rpcUrl = options.rpcUrl || ''
        this._providerRPCUrl = options.rpcUrl
        options.chainName = options.chainName || Network.Neo3
        this.chainName = this.isMainNet ? 'n3' : 'n3t'
        this._privateKey = options.privateKey
        this.provider = provider || 'private'
        const apiConfig = {
            apiKey: options.apiKey,
            baseUrl: options.environment,
        } as IGhostMarketApiOptions
        this.api = new GhostMarketApi(apiConfig)
        // Logger: Default to nothing.
        this.logger = logger || ((arg: string) => arg)
        if (provider === 'private' && !options.privateKey) {
            console.error('Please set a private key!')
            return
        }
    }

    getProvider(_initialize?: boolean) {
        console.log(this.provider)

        switch (this.provider) {
            case 'private': {
                console.log(this._providerRPCUrl, this._privateKey, this.isMainNet)
                return new N3PrivateProvider(this._providerRPCUrl, this._privateKey, this.isMainNet)
            }
            case 'neoline': {
                // eslint-disable-next-line no-case-declarations
                const win = window as any
                if (!win.NEOLineN3) {
                    throw new Error('Neoline not installed. Please install it and try again.')
                }
                return new win.NEOLineN3.Init()
            }
            case 'o3':
            default:
                // eslint-disable-next-line no-case-declarations
                const win = window as any
                if (!win.NEOLineN3) {
                    throw new Error('O3 not installed. Please install it and try again.')
                }
                return win.neo3Dapi
        }
    }

    async invoke(invokeParams: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.getProvider()
                .invoke(invokeParams)
                .then((result: any) => {
                    console.log('Invoke transaction success!')
                    console.log('Transaction ID: ' + result.txid)
                    resolve(result.txid)
                })
                .catch(({ type, description }: any) => {
                    let errMsg = 'Unknown error'
                    switch (type) {
                        case 'NO_PROVIDER':
                            errMsg = 'No provider available.'
                            break
                        case 'RPC_ERROR':
                            errMsg =
                                'There was an error when broadcasting this transaction to the network.'
                            if (description.exception) {
                                errMsg = description.exception
                            }
                            break
                        case 'CANCELED':
                            errMsg = 'The user has cancelled this transaction.'
                            break
                        default:
                            if (description) {
                                errMsg = description
                            }
                            if (description && description.msg) {
                                errMsg = description.msg
                            }
                    }
                    reject(new Error(errMsg))
                })
        })
    }

    async invokeMultiple(invokeParams: any): Promise<string> {
        return new Promise((resolve, reject) => {
            ;(this.provider === 'o3'
                ? this.getProvider().invokeMulti(invokeParams)
                : this.getProvider().invokeMultiple(invokeParams)
            )
                .then((result: any) => {
                    console.log('Invoke multiple transaction success!')
                    console.log('Transaction ID: ' + result.txid)
                    resolve(result.txid)
                })
                .catch(({ type, description }: any) => {
                    let errMsg = 'Unknown error'
                    switch (type) {
                        case 'NO_PROVIDER':
                            errMsg = 'No provider available.'
                            break
                        case 'RPC_ERROR':
                            errMsg =
                                'There was an error when broadcasting this transaction to the network.'
                            if (description.exception) {
                                errMsg = description.exception
                            }
                            break
                        case 'CANCELED':
                            errMsg = 'The user has cancelled this transaction.'
                            break
                        default:
                            if (description) {
                                errMsg = description
                            }
                    }
                    reject(new Error(errMsg))
                })
        })
    }

    async invokeRead(invokeParams: any): Promise<any> {
        // console.log('invokeRead', invokeParams)
        return new Promise((resolve, reject) => {
            this.getProvider()
                .invokeRead(invokeParams)
                .then((result: any) => {
                    console.log('InvokeRead success!')
                    resolve(result)
                })
                .catch(({ type, description }: any) => {
                    let errMsg = 'Unknown error'
                    switch (type) {
                        case 'NO_PROVIDER':
                            errMsg = 'No provider available.'
                            break
                        case 'Remote rpc error':
                        case 'RPC_ERROR':
                            errMsg =
                                'There was an error when broadcasting this transaction to the network.'
                            if (description.exception) {
                                errMsg = description.exception
                            }
                            break
                        case 'User rejected':
                        case 'CANCELLED':
                        case 'CANCELED':
                            errMsg = 'The user has cancelled this transaction.'
                            break
                        default:
                            if (description) {
                                errMsg = description
                            }
                            if (description && description.msg) {
                                errMsg = description.msg
                            }
                    }
                    reject(new Error(errMsg))
                })
        })
    }

    /** Buy one or more NFT(s)
     * @param {IBuyItem[]} items details.
     * @param {string} accountAddress address used to sign transaction.
     */
    public async buyMultiple(items: IBuyItem[], accountAddress: string) {
        const isBuyBatch = items.length > 1

        console.log(
            `buying ${isBuyBatch ? 'bulk' : 'single'} nft with ${this.provider} on ${
                this.chainName
            }`,
        )

        const allowedContracts = [this.contractExchangeAddress.substring(2)]
        const argsBuyMultiple = []

        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            const owner = item.ownerAddress
            const priceNFTFormatted = item.price

            if (accountAddress == owner) {
                argsBuyMultiple.push({
                    scriptHash: this.contractExchangeAddress,
                    operation: METHOD_CANCEL_SALE,
                    args: [
                        {
                            type: 'ByteArray', // ByteString auctionId
                            value: numberToByteString(item.contractAuctionId.toString()),
                        },
                    ] as IArgs[],
                })
            } else {
                const quoteContract = item.quoteContractHash.substring(2)
                if (!allowedContracts.includes(quoteContract)) {
                    allowedContracts.push(quoteContract)
                }

                argsBuyMultiple.push({
                    scriptHash: this.contractExchangeAddress,
                    operation: METHOD_BID_TOKEN,
                    args: [
                        {
                            type: 'Hash160', // UInt160 from
                            value: getScriptHashFromAddress(accountAddress),
                        },
                        {
                            type: 'ByteArray', // ByteString auctionId
                            value: numberToByteString(item.contractAuctionId.toString()),
                        },
                        {
                            type: 'Integer', // BigInteger price
                            value: priceNFTFormatted,
                        },
                    ] as IArgs[],
                })
            }
        }

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 16,
                allowedContracts,
            },
        ]
        const invokeParamsMultiple = {
            invokeArgs: argsBuyMultiple,
            fee: (0.01 * items.length).toString(),
            signers,
        }

        try {
            return this.invokeMultiple(invokeParamsMultiple)
        } catch (e) {
            return console.error(
                `buyMultiple: failed to execute ${
                    accountAddress == items[0].ownerAddress ? METHOD_CANCEL_SALE : METHOD_BID_TOKEN
                } on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Create one or more sell order(s)
     * @param {ISellItem[]} items details.
     * @param {string} accountAddress address used to sign transaction.
     * @param {Date} startDate start date of listing.
     * @param {Date} endDate end date of listing.
     */
    public async sellMultiple(
        items: ISellItem[],
        accountAddress: string,
        startDate: Date,
        endDate: Date,
    ) {
        const isListBatch = items.length > 1

        console.log(
            `selling ${isListBatch ? 'bulk' : 'single'} nft with ${this.provider} on ${
                this.chainName
            }`,
        )

        const currentDateFormatted =
            startDate === null ? new Date().getTime() : new Date(startDate).getTime()
        const endDateFormatted = endDate === null ? 0 : new Date(endDate).getTime()

        const allowedContracts = [this.contractExchangeAddress.substring(2)]

        const argsListTokenMultiple = []

        for (let i = 0; i < items.length; i++) {
            const item = items[i]

            const baseContract = item.baseContractHash.substring(2)
            if (!allowedContracts.includes(baseContract)) {
                allowedContracts.push(baseContract)
            }

            argsListTokenMultiple.push({
                scriptHash: this.contractExchangeAddress,
                operation: METHOD_LIST_TOKEN,
                args: [
                    {
                        type: 'Hash160', // UInt160 baseScriptHash
                        value: item.baseContractHash,
                    },
                    {
                        type: 'Hash160', // UInt160 from
                        value: getScriptHashFromAddress(accountAddress),
                    },
                    {
                        type: 'Hash160', // UInt160 quoteScriptHash
                        value: item.quoteContractHash,
                    },
                    {
                        type: 'ByteArray', // ByteString tokenId
                        value: numberToByteString(item.tokenId),
                    },
                    {
                        type: 'Integer', // BigInteger price
                        value: item.price,
                    },
                    {
                        type: 'Integer', // BigInteger endPrice
                        value: 0,
                    },
                    {
                        type: 'Integer', // BigInteger startDate
                        value: currentDateFormatted,
                    },
                    {
                        type: 'Integer', // BigInteger endDate
                        value: endDateFormatted,
                    },
                    {
                        type: 'Integer', // BigInteger extensionPeriod
                        value: 0,
                    },
                    {
                        type: 'Integer', // BigInteger auctionType
                        value: 0, // auction type fixed listing
                    },
                ] as IArgs[],
            })
        }

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 16,
                allowedContracts,
            },
        ]
        const invokeParamsMultiple = {
            invokeArgs: argsListTokenMultiple,
            fee: (0.01 * items.length).toString(),
            signers,
        }

        try {
            return this.invokeMultiple(invokeParamsMultiple)
        } catch (e) {
            return console.error(
                `sellMultiple: failed to execute ${METHOD_LIST_TOKEN} on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Place Bid on NFT Auction
     * @param {IBidItem} item details.
     * @param {string} accountAddress address used to sign transaction.
     */
    public async buyAuction(item: IBidItem, accountAddress: string) {
        console.log(`bidding on nft with ${this.provider} on ${this.chainName}`)

        const currentBidFormatted = item.bidPrice || 0

        const argsBidToken = [
            {
                type: 'Hash160', // UInt160 from
                value: getScriptHashFromAddress(accountAddress),
            },
            {
                type: 'ByteArray', // ByteString auctionId
                value: numberToByteString(item.contractAuctionId.toString()),
            },
            {
                type: 'Integer', // BigInteger price
                value: currentBidFormatted,
            },
        ] as IArgs[]

        const allowedContracts = [this.contractExchangeAddress.substring(2)]
        const quoteContract = item.quoteContractHash.substring(2)
        if (!allowedContracts.includes(quoteContract)) {
            allowedContracts.push(quoteContract)
        }

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 16,
                allowedContracts,
            },
        ]
        const invokeParams = {
            scriptHash: this.contractExchangeAddress,
            operation: METHOD_BID_TOKEN,
            args: argsBidToken,
            signers,
        }

        try {
            return this.invoke(invokeParams)
        } catch (e) {
            return console.error(
                `buyAuction: failed to execute ${METHOD_BID_TOKEN} on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Put NFT on Auction
     * @param {IAuctionItem} item details.
     * @param {string} accountAddress address used to sign transaction.
     */
    public async listAuction(item: IAuctionItem, accountAddress: string) {
        console.log(`auction nft with ${this.provider} on ${this.chainName}`)

        let extensionPeriod = item.extensionPeriod ? item.extensionPeriod * 60 : 0 // min 0 - max 1h (3600)
        switch (item.auctionType) {
            case 1: // classic
                break
            case 2: // reserve
                break
            case 3: // dutch
                extensionPeriod = 0
                break
            case 0: // fixed
                extensionPeriod = 0
                break
        }

        const priceNFTFormatted = item.startPrice ?? 0
        const endPriceNFTFormatted = item.endPrice ?? 0

        const startDateFormatted = new Date(item.startDate).getTime()
        const endDateFormatted = new Date(item.endDate).getTime()

        const argsListToken = [
            {
                type: 'Hash160', // UInt160 baseScriptHash
                value: item.baseContractHash,
            },
            {
                type: 'Hash160', // UInt160 from
                value: getScriptHashFromAddress(accountAddress),
            },
            {
                type: 'Hash160', // UInt160 quoteScriptHash
                value: item.quoteContractHash,
            },
            {
                type: 'ByteArray', // ByteString tokenId
                value: numberToByteString(item.tokenId),
            },
            {
                type: 'Integer', // BigInteger price
                value: priceNFTFormatted,
            },
            {
                type: 'Integer', // BigInteger endPrice
                value: endPriceNFTFormatted,
            },
            {
                type: 'Integer', // BigInteger startDate
                value: startDateFormatted,
            },
            {
                type: 'Integer', // BigInteger endDate
                value: endDateFormatted,
            },
            {
                type: 'Integer', // BigInteger extensionPeriod
                value: extensionPeriod,
            },
            {
                type: 'Integer', // BigInteger auctionType
                value: item.auctionType,
            },
        ] as IArgs[]

        const allowedContracts = [this.contractExchangeAddress.substring(2)]
        const baseContract = item.baseContractHash.substring(2)
        if (!allowedContracts.includes(baseContract)) {
            allowedContracts.push(baseContract)
        }

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 16,
                allowedContracts,
            },
        ]
        const invokeParams = {
            scriptHash: this.contractExchangeAddress,
            operation: METHOD_LIST_TOKEN,
            args: argsListToken,
            signers,
        }

        try {
            return this.invoke(invokeParams)
        } catch (e) {
            return console.error(
                `listAuction: failed to execute ${METHOD_LIST_TOKEN} on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Claim ended NFT Auction
     * @param {string} contractAuctionId on chain contract auction ID.
     * @param {string} accountAddress address used to sign transaction.
     */
    public async claimAuction(contractAuctionId: string, accountAddress: string) {
        console.log(`claiming nft auction with ${this.provider} on ${this.chainName}`)

        const argsBidToken = [
            {
                type: 'Hash160', // UInt160 from
                value: getScriptHashFromAddress(accountAddress),
            },
            {
                type: 'ByteArray', // ByteString auctionId
                value: numberToByteString(contractAuctionId),
            },
            {
                type: 'Integer', // BigInteger price
                value: 0,
            },
        ] as IArgs[]

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 1,
            },
        ]
        const invokeParams = {
            scriptHash: this.contractExchangeAddress,
            operation: METHOD_BID_TOKEN,
            args: argsBidToken,
            signers,
        }

        try {
            return this.invoke(invokeParams)
        } catch (e) {
            return console.error(
                `claimAuction: failed to execute ${METHOD_BID_TOKEN} on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Create a single nft offer or a collection offer
     * @param {IOfferItem} item details.
     * @param {string} accountAddress address used to sign transaction.
     */
    public async placeOffer(item: IOfferItem, accountAddress: string) {
        console.log(`placing offer on nft with ${this.provider} on ${this.chainName}`)

        const argsPlaceOffer = [
            {
                type: 'Hash160', // UInt160 baseScriptHash
                value: item.baseScriptHash,
            },
            {
                type: 'Hash160', // UInt160 from
                value: getScriptHashFromAddress(accountAddress),
            },
            {
                type: 'Hash160', // UInt160 quoteScriptHash
                value: item.quoteScriptHash,
            },
            {
                type: 'ByteArray', // ByteString tokenId
                value: item.tokenId, // set to null for collection offer
            },
            {
                type: 'Integer', // BigInteger price
                value: item.price,
            },
            {
                type: 'Integer', // BigInteger startDate
                value: item.startDate,
            },
            {
                type: 'Integer', // BigInteger endDate
                value: item.endDate,
            },
        ]

        const allowedContracts = [this.contractExchangeAddress]

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 16,
                allowedContracts,
            },
        ]
        const invokeParams = {
            scriptHash: this.contractExchangeAddress,
            operation: METHOD_PLACE_OFFER,
            args: argsPlaceOffer,
            signers,
        }

        try {
            return this.invoke(invokeParams)
        } catch (e) {
            return console.error(
                `placeOffer: failed to execute ${METHOD_PLACE_OFFER} on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Accept or cancel a single nft offer or a collection offer
     * @param {auctionId} string auctionId of offer to accept or cancel.
     * @param {quoteScriptHash} string contract of currency to use in offer.
     * @param {tokenId} string tokenId of nft to use in offer. Only used for collection offer accept.
     * @param {boolean} isCancellation used to sign transaction.
     * @param {string} accountAddress address used to sign transaction.
     */
    public async processOffer(
        auctionId: string,
        quoteScriptHash: string,
        tokenId: string,
        isCancellation: boolean,
        accountAddress: string,
    ) {
        console.log(
            `${isCancellation ? 'cancel offer' : 'accept offer'} on nft with ${this.provider} on ${
                this.chainName
            }`,
        )

        const argsAcceptOffer = [
            {
                type: 'Hash160', // UInt160 from
                value: getScriptHashFromAddress(accountAddress),
            },
            {
                type: 'ByteArray', // ByteString auctionId
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                value: numberToByteString(auctionId),
            },
            {
                type: 'ByteArray', // ByteString tokenId
                value: tokenId ? numberToByteString(tokenId) : '',
            },
        ]

        const argsCancelOffer = [
            {
                type: 'ByteArray', // ByteString auctionId
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                value: numberToByteString(auctionId),
            },
        ]

        const allowedContracts = [this.contractExchangeAddress, quoteScriptHash]

        const signers = isCancellation
            ? [
                  {
                      account: getScriptHashFromAddress(accountAddress),
                      scopes: 1,
                  },
              ]
            : [
                  {
                      account: getScriptHashFromAddress(accountAddress),
                      scopes: 16,
                      allowedContracts,
                  },
              ]
        const invokeParams = {
            scriptHash: this.contractExchangeAddress,
            operation: isCancellation ? METHOD_CANCEL_OFFER : METHOD_ACCEPT_OFFER,
            args: isCancellation ? argsCancelOffer : argsAcceptOffer,
            signers,
        }

        try {
            return this.invoke(invokeParams)
        } catch (e) {
            return console.error(
                `processOffer: failed to execute ${
                    isCancellation ? METHOD_CANCEL_OFFER : METHOD_ACCEPT_OFFER
                } on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Edit NFT Listing
     * @param {string} contractAuctionId on chain contract auction ID.
     * @param {string} newPrice new price to use for the listing.
     * @param {string} accountAddress address used to sign transaction.
     */
    public async editPrice(contractAuctionId: string, newPrice: string, accountAddress: string) {
        console.log(
            `edit auction ${contractAuctionId} listing price with ${this.provider} on ${this.chainName}`,
        )

        const argsEditSale = [
            {
                type: 'Hash160', // UInt160 from
                value: getScriptHashFromAddress(accountAddress),
            },
            {
                type: 'ByteArray', // ByteString auctionId
                value: numberToByteString(contractAuctionId.toString()),
            },
            {
                type: 'Integer', // BigInteger price
                value: newPrice,
            },
            {
                type: 'Integer', // BigInteger endPrice
                value: 0,
            },
            {
                type: 'Integer', // BigInteger startDate
                value: 0, // set to 0 - re use current one
            },
            {
                type: 'Integer', // BigInteger endDate
                value: 0, // set to 0 - re use current one
            },
            {
                type: 'Integer', // BigInteger extensionPeriod
                value: 0,
            },
        ] as IArgs[]

        let invokeParams = null

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 1,
            },
        ]
        invokeParams = {
            scriptHash: this.contractExchangeAddress,
            operation: METHOD_EDIT_SALE,
            args: argsEditSale,
            signers,
        }

        try {
            return this.invoke(invokeParams)
        } catch (e) {
            return console.error(
                `editPrice: failed to execute ${METHOD_EDIT_SALE} on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    // cancel multiple order

    /** Set royalties for contract
     * @param {string} contract contract address to set royalties for.
     * @param {Royalties} royalties royalties settings to use for the contract.
     * @param {string} accountAddress address used to sign transaction.
     */
    public async setRoyaltiesForContract(
        contract: string,
        royalties: Royalties,
        accountAddress: string,
    ) {
        console.log(`edit collection royalties with ${this.provider} on ${this.chainName}`)

        let argsSetCollectionRoyalties = [
            {
                type: 'Hash160', // UInt160 contract
                value: contract,
            },
            {
                type: 'Array', // Array
                value: [],
            },
        ] as IArgs[]

        if (royalties.royaltiesRecipients[0].amount > 0) {
            argsSetCollectionRoyalties = [
                {
                    type: 'Hash160', // UInt160 contract
                    value: contract,
                },
                {
                    type: 'Array', // Array
                    value: [
                        {
                            type: 'Array', // Array
                            value: [
                                {
                                    type: 'Hash160', // UInt160 address
                                    value: getScriptHashFromAddress(
                                        royalties.royaltiesRecipients[0].recipient,
                                    ),
                                },
                                {
                                    type: 'Integer', // BigInteger value
                                    value: royalties.royaltiesRecipients[0].amount,
                                },
                            ] as IArgs[],
                        },
                    ] as IArgs[],
                },
            ]
        }

        const allowedContracts = [contract.substring(2), this.contractExchangeAddress]

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 16,
                allowedContracts,
            },
            {
                account: contract,
                scopes: 16,
                allowedContracts,
            },
        ]
        const invokeParams = {
            scriptHash: this.contractExchangeAddress,
            operation: METHOD_SET_COLLECTION_ROYALTIES,
            args: argsSetCollectionRoyalties,
            signers,
        }

        try {
            return this.invoke(invokeParams)
        } catch (e) {
            return console.error(
                `setRoyaltiesForContract: Failed to execute ${METHOD_SET_COLLECTION_ROYALTIES} on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Approve Token Contract
     * @param {string} contract contract to approve.
     * @param {string} accountAddress address used to sign transaction.
     */
    public async approveToken(contract: string, accountAddress: string) {
        console.log(`approve ${contract} with ${this.provider} on ${this.chainName}`)

        const argsApproveToken = [
            {
                type: 'Hash160', // UInt160 from_address
                value: getScriptHashFromAddress(accountAddress),
            },
            {
                type: 'Hash160', // UInt160 spender
                value: this.contractExchangeAddress,
            },
            {
                type: 'Integer', // BigInteger amount
                value: MAX_INT_255,
            },
        ] as IArgs[]

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 1,
            },
        ]
        const invokeParams = {
            scriptHash: contract,
            operation: METHOD_APPROVE_TOKEN,
            args: argsApproveToken,
            signers,
        }

        try {
            return this.invoke(invokeParams)
        } catch (e) {
            return console.error(
                `approveToken: failed to execute ${METHOD_APPROVE_TOKEN} on ${contract} with error:`,
                e,
            )
        }
    }

    /** Check NEP17 Token Contract Approval
     * @param {string} contract token contract to check approval.
     * @param {string} accountAddress address used to check.
     */
    public async checkTokenApproval(contract: string, accountAddress: string) {
        console.log(`reading ${contract} approval with ${this.provider} on N3 ${this.chainName}`)

        const argsCheckAllowance = [
            {
                type: 'Hash160',
                value: getScriptHashFromAddress(accountAddress),
            },
            {
                type: 'Hash160',
                value: this.contractExchangeAddress,
            },
        ] as IArgs[]

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 1,
            },
        ]

        const invokeParams = {
            scriptHash: contract,
            operation: METHOD_CHECK_ALLOWANCE,
            args: argsCheckAllowance,
            signers,
        }

        try {
            const response = await this.invokeRead(invokeParams)
            if (response.exception) return `Exception: ${response.exception}`
            const decoded = response.stack[0].value
            return decoded
        } catch (e) {
            return console.error(
                `checkTokenApproval: failed to execute ${METHOD_CHECK_ALLOWANCE} on ${contract} with error:`,
                e,
            )
        }
    }

    /** Transfer NEP17 Token
     * @param {string} destination destination address .
     * @param {string} contract contract of token to transfer.
     * @param {string} amount amount to transfer.
     * @param {string} accountAddress address used to sign transaction.
     */
    public async transferNEP17(
        destination: string,
        contract: string,
        amount: string,
        accountAddress: string,
    ) {
        console.log(`transfer token with ${this.provider} on ${this.chainName}`)

        const argsTransfer = [
            {
                type: 'Hash160', // frm
                value: getScriptHashFromAddress(accountAddress),
            },
            {
                type: 'Hash160', // to
                value: getScriptHashFromAddress(destination),
            },
            {
                type: 'Integer', // amount
                value: amount,
            },
            {
                type: 'String', // data
                value: '',
            },
        ] as IArgs[]

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 1,
            },
        ]

        const invokeParams = {
            scriptHash: contract,
            operation: METHOD_TRANSFER,
            args: argsTransfer,
            signers,
        }

        try {
            return this.invoke(invokeParams)
        } catch (e) {
            return console.error(
                `transferNEP17: failed to execute ${METHOD_TRANSFER} on ${contract} with error:`,
                e,
            )
        }
    }

    /** Transfer one or more NEP11 NFT
     * @param {ITransferItem[]} items details.
     * @param {string} accountAddress address used to sign transaction.
     */
    public async transferNEP11(items: ITransferItem[], accountAddress: string) {
        const isTransferBatch = items.length > 1

        console.log(
            `transfer ${isTransferBatch ? 'bulk' : 'single'} nft with ${this.provider} on ${
                this.chainName
            }`,
        )

        const argsTransferMultiple = []

        for (let i = 0; i < items.length; i++) {
            const item = items[i]

            argsTransferMultiple.push({
                scriptHash: item.contract,
                operation: METHOD_TRANSFER,
                args: [
                    {
                        type: 'Hash160',
                        value: getScriptHashFromAddress(item.destAddress),
                    },
                    {
                        type: 'ByteArray',
                        value: numberToByteString(item.tokenId),
                    },
                    {
                        type: 'String', // data
                        value: '',
                    },
                ] as IArgs[],
            })
        }

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 1,
            },
        ]

        const invokeParamsMultiple = {
            invokeArgs: argsTransferMultiple,
            fee: (0.01 * items.length).toString(),
            signers,
        }

        try {
            return this.invokeMultiple(invokeParamsMultiple)
        } catch (e) {
            return console.error(
                `transferNEP11: failed to execute ${METHOD_TRANSFER} on ${items[0].contract} with error:`,
                e,
            )
        }
    }

    /** Burn one or more NEP11 NFT
     * @param {IBurnItem[]} items details.
     * @param {string} accountAddress address used to sign transaction.
     */
    public async burnNEP11(items: IBurnItem[], accountAddress: string) {
        const isBurnBatch = items.length > 1

        console.log(
            `burn ${isBurnBatch ? 'bulk' : 'single'} nft with ${this.provider} on ${
                this.chainName
            }`,
        )

        const argsBurnMultiple = []

        for (let i = 0; i < items.length; i++) {
            const item = items[i]

            argsBurnMultiple.push({
                scriptHash: item.contract,
                operation: METHOD_BURN,
                args: [
                    {
                        type: 'ByteArray',
                        value: numberToByteString(item.tokenId),
                    },
                ] as IArgs[],
            })
        }

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 1,
            },
        ]
        const invokeParamsMultiple = {
            invokeArgs: argsBurnMultiple,
            fee: (0.01 * items.length).toString(),
            signers,
        }

        try {
            return this.invokeMultiple(invokeParamsMultiple)
        } catch (e) {
            return console.error(
                `burnNEP11: failed to execute ${METHOD_BURN} on ${items[0].contract} with error:`,
                e,
            )
        }
    }

    /** Mint one or more NEP11 NFT
     * @param {IMintItem} item details.
     * @param {string} accountAddress address used to sign transaction.
     */
    public async mintNEP11(item: IMintItem, accountAddress: string) {
        const isMintBatch = item.quantity > 1
        console.log(
            `minting ${isMintBatch ? 'bulk' : 'single'} nft with ${this.provider} on ${
                this.chainName
            }`,
        )

        const isOnChainMetadata = true
        const allowedContracts = [
            this.isMainNet ? N3_MAINNET_CONTRACTS.GAS_TOKEN : N3_TESTNET_CONTRACTS.GAS_TOKEN,
            this.isMainNet ? N3_MAINNET_CONTRACTS.GHOST_NEP11 : N3_TESTNET_CONTRACTS.GHOST_NEP11,
        ]

        const creator = accountAddress
        const type = item.type
        const hasLocked = false
        const attributes: {
            trait_type: string | number
            value: string | number
            display_type?: string
        }[] = []

        // display_type unused for now
        if (item.attrT1 !== '') {
            attributes.push({ trait_type: item.attrT1, value: item.attrV1 })
        }
        if (item.attrT2 !== '') {
            attributes.push({ trait_type: item.attrT2, value: item.attrV2 })
        }
        if (item.attrT3 !== '') {
            attributes.push({ trait_type: item.attrT3, value: item.attrV3 })
        }

        let jsonMetadata = JSON.stringify({
            name: item.name,
            description: item.description,
            image: item.imageURL,
            tokenURI: '',
            attributes,
            properties: {
                has_locked: hasLocked,
                type,
            },
        })

        if (!isOnChainMetadata) {
            jsonMetadata = JSON.stringify({
                name: item.name,
                tokenURI: item.externalURI,
            })
        }

        const contractRoyalties = item.royalties
            ? JSON.stringify([{ address: creator, value: (item.royalties * 100).toString() }])
            : ''

        let argsMint = [
            {
                type: 'Hash160', // account
                value: getScriptHashFromAddress(creator),
            },
            {
                type: 'ByteArray', // meta
                value: b64EncodeUnicode(jsonMetadata),
            },
            {
                type: 'ByteArray', // lockedContent
                value: '', // lock content not available at the moment on SDK
            },
            {
                type: 'ByteArray', // royalties
                value: btoa(contractRoyalties.toString()),
            },
        ] as IArgs[]

        if (isMintBatch) {
            const tokensMeta = []
            const tokensLock = []
            const tokensRoya = []
            for (let i = 0; i < item.quantity; i++) {
                tokensMeta.push({
                    type: 'ByteArray',
                    value: b64EncodeUnicode(jsonMetadata),
                })
                tokensLock.push({
                    type: 'ByteArray',
                    value: '', // lock content not available at the moment on SDK
                })
                tokensRoya.push({
                    type: 'ByteArray',
                    value: btoa(contractRoyalties.toString()),
                })
            }
            argsMint = [
                {
                    type: 'Hash160',
                    value: getScriptHashFromAddress(creator),
                },
                {
                    type: 'Array',
                    value: tokensMeta,
                },
                {
                    type: 'Array',
                    value: '', // lock content not available at the moment on SDK
                },
                {
                    type: 'Array',
                    value: tokensRoya,
                },
            ] as IArgs[]
        }

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 16,
                allowedContracts,
            },
        ]

        const invokeParams = {
            scriptHash: this.isMainNet
                ? N3_MAINNET_CONTRACTS.GHOST_NEP11
                : N3_TESTNET_CONTRACTS.GHOST_NEP11,
            operation: isMintBatch ? METHOD_MULTI_MINT : METHOD_MINT,
            args: argsMint,
            fee: (0.01 * item.quantity).toString(),
            signers,
        }

        try {
            return this.invoke(invokeParams)
        } catch (e) {
            return console.error(
                `mintNEP11: failed to execute ${isMintBatch ? METHOD_MULTI_MINT : METHOD_MINT} on ${
                    this.isMainNet
                        ? N3_MAINNET_CONTRACTS.GHOST_NEP11
                        : N3_TESTNET_CONTRACTS.GHOST_NEP11
                } with error:`,
                e,
            )
        }
    }

    /** Check one token balance for address
     * @param {string} contract token contract to check approval.
     * @param {string} accountAddress address used to check.
     */
    public async checkTokenBalance(contract: string, accountAddress: string) {
        console.log(`checking ${contract} balance with ${this.provider} on ${this.chainName}`)

        const argsCheckTokenBalance = [
            {
                type: 'Hash160',
                value: getScriptHashFromAddress(accountAddress),
            },
        ] as IArgs[]

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 1,
            },
        ]

        const invokeParams = {
            scriptHash: contract,
            operation: METHOD_CHECK_TOKEN_BALANCE,
            args: argsCheckTokenBalance,
            signers,
        }

        try {
            const response = await this.invokeRead(invokeParams)
            if (response.exception) return `Exception: ${response.exception}`
            const decoded = response.result.stack[0].value
            return decoded
        } catch (e) {
            return console.error(
                `checkTokenBalance: failed to execute ${METHOD_CHECK_TOKEN_BALANCE} on ${contract} with error:`,
                e,
            )
        }
    }

    /** Check incentives for address
     * @param {string} accountAddress address used to check.
     */
    public async checkIncentives(accountAddress: string) {
        console.log(`reading incentives with ${this.provider} on ${this.chainName}`)

        const argsCheckIncentives = [
            {
                type: 'Hash160',
                value: getScriptHashFromAddress(accountAddress),
            },
        ] as IArgs[]

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 1,
            },
        ]

        const invokeParams = {
            scriptHash: this.contractIncentivesAddress,
            operation: METHOD_CHECK_INCENTIVES,
            args: argsCheckIncentives,
            signers,
        }

        try {
            const response = await this.invokeRead(invokeParams)
            if (response.exception) return `Exception: ${response.exception}`
            const decoded = response.result.stack[0]
            return decoded
        } catch (e) {
            return console.error(
                `checkIncentives: failed to execute ${METHOD_CHECK_INCENTIVES} on ${this.contractIncentivesAddress} with error:`,
                e,
            )
        }
    }

    /** Claim incentives for address
     * @param {string} accountAddress address used to sign transaction.
     */
    public async claimIncentives(accountAddress: string) {
        console.log(`claiming incentives with ${this.provider} on N3 ${this.chainName}`)

        const argsClaimIncentives = [
            {
                type: 'Hash160', // UInt160 from
                value: getScriptHashFromAddress(accountAddress),
            },
        ] as IArgs[]

        const signers = [
            {
                account: getScriptHashFromAddress(accountAddress),
                scopes: 1,
            },
        ]

        const invokeParams = {
            scriptHash: this.contractIncentivesAddress,
            operation: METHOD_CLAIM_INCENTIVES,
            args: argsClaimIncentives,
            signers,
        }

        try {
            return this.invoke(invokeParams)
        } catch (e) {
            return console.error(
                `claimIncentives: failed to execute ${METHOD_CLAIM_INCENTIVES} on ${this.contractIncentivesAddress} with error:`,
                e,
            )
        }
    }

    /** Sign Data
     * @param {string} dataToSign data to sign.
     */
    public async signData(dataToSign: string) {
        const neo = this.getProvider(true)
        try {
            const signedMessage = await neo.signMessage({ message: dataToSign })

            const { publicKey, message, salt, data } = signedMessage

            console.log('Public key used to sign:', publicKey)
            console.log('Original message:', message)
            console.log('Salt added to message:', salt)
            console.log('Signed data:', data)

            return { signature: data, random: salt, pub_key: publicKey }
        } catch ({ type, description, data }: any) {
            switch (type) {
                case 'NO_PROVIDER':
                    throw new Error('No provider available.')
                case 'RPC_ERROR':
                    throw new Error(
                        'There was an error when broadcasting this transaction to the network.',
                    )
                case 'CANCELED':
                    throw new Error('The user has canceled this transaction.')
                default:
                    throw new Error(description as string)
            }
        }
    }

    /* TO ADD
    getTokenBalances / getOwnerships
    transfer nep17
    */
}
