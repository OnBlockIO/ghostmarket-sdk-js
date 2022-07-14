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
interface ICollectionRoyalties {
    contract: string // NFT contract hash.
    royalties: number // Royalties value in BPS.
    royaltiesRecipient: string // Royalties recipient.
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
const METHOD_READ_INCENTIVES = 'getIncentive'
const METHOD_APPROVE_TOKEN = 'approve'
const METHOD_CHECK_ALLOWANCE = 'allowance'
const METHOD_PLACE_OFFER = 'placeOffer'
const METHOD_ACCEPT_OFFER = 'acceptOffer'
const METHOD_CANCEL_OFFER = 'cancelOffer'

export class GhostMarketN3SDK {
    private provider: 'neoline' | 'o3' | 'private' = 'private'
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
        provider: 'neoline' | 'o3' | 'private',
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
        options.rpcUrl = options.rpcUrl || 'https://n3seed1.ngd.network:10332'
        this._providerRPCUrl = options.rpcUrl
        options.chainName = options.chainName || Network.Neo3
        this.chainName = this.isMainNet ? 'n3' : 'n3t'
        this._privateKey = options.privateKey
        this.provider = provider
        const apiConfig = {
            apiKey: options.apiKey,
            baseUrl: options.environment,
        } as IGhostMarketApiOptions
        this.api = new GhostMarketApi(apiConfig)
        // Logger: Default to nothing.
        this.logger = logger || ((arg: string) => arg)
    }

    getProvider(_initialize?: boolean) {
        if (this.provider) return this.provider
        const win = window as any

        switch (this.provider) {
            case 'private': {
                return new N3PrivateProvider(this._providerRPCUrl, this._privateKey, this.isMainNet)
            }
            case 'neoline': {
                if (!win.NEOLineN3) {
                    throw new Error('Neoline not installed. Please install it and try again.')
                }
                return new win.NEOLineN3.Init()
            }
            case 'o3':
            default:
                if (!win.NEOLineN3) {
                    throw new Error('O3 not installed. Please install it and try again.')
                }
                return win.neo3Dapi
        }
    }

    async login(): Promise<any> {
        return await this.loginDapi()
    }

    async loginDapi() {
        const dapi = this.getProvider()

        try {
            const provider = await dapi.getProvider()
            const account = await dapi.getAccount()
            const results = await dapi.getBalance({
                params: [
                    {
                        address: account.address,
                        contracts: [] as string[], // should be removed?,
                    },
                ],
                // network: this.isMainNet ? 'N3MainNet' : 'TestNet'
            } as any)

            const accountData = {
                chain: this.chainName,
                providerHint: this.provider,
                provider: provider.name.toLowerCase(),
                version: provider.version,
                label: account.label,
                address: account.address,
                balances: results[account.address].map((b: any) => {
                    return {
                        contract: b.contract,
                        symbol: b.symbol.toUpperCase(), // uppercase to fix bNEO vs BNEO issue
                        amount: parseFloat(b.amount),
                    }
                }),
                theme: provider.extra.theme ? provider.extra.theme : 'dark',
                currency: provider.extra.currency ? provider.extra.currency : 'USD',
            }
            // console.log('accountData', accountData)
            return accountData
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

    /** Buy one or more NFT(s)
     * @param {IBuyItem[]} items details.
     * @param {string} currentAddress address used to sign transaction.
     */
    public async buyMultiple(items: IBuyItem[], currentAddress: string) {
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

            if (currentAddress == owner) {
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
                            value: getScriptHashFromAddress(currentAddress),
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
                account: getScriptHashFromAddress(currentAddress),
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
                `Failed to execute buyMultiple on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Create one or more sell order(s)
     * @param {ISellItem[]} items details.
     * @param {string} currentAddress address used to sign transaction.
     * @param {Date} currentAddress start date of listing.
     * @param {Date} currentAddress end date of listing.
     */
    public async sellMultiple(
        items: ISellItem[],
        currentAddress: string,
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
                        value: getScriptHashFromAddress(currentAddress),
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
                account: getScriptHashFromAddress(currentAddress),
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
                `Failed to execute sellMultiple on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Place Bid on NFT Auction
     * @param {IBidItem} item details.
     * @param {string} currentAddress address used to sign transaction.
     */
    public async buyAuction(item: IBidItem, currentAddress: string) {
        console.log(`bidding on nft with ${this.provider} on ${this.chainName}`)

        const currentBidFormatted = item.bidPrice || 0

        const argsBidToken = [
            {
                type: 'Hash160', // UInt160 from
                value: getScriptHashFromAddress(currentAddress),
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
                account: getScriptHashFromAddress(currentAddress),
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
                `Failed to execute buyAuction on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Put NFT on Auction
     * @param {IAuctionItem} item details.
     * @param {string} currentAddress address used to sign transaction.
     */
    public async listAuction(item: IAuctionItem, currentAddress: string) {
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
                value: getScriptHashFromAddress(currentAddress),
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
                account: getScriptHashFromAddress(currentAddress),
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
                `Failed to execute listAuction on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Claim ended NFT Auction
     * @param {string} contractAuctionId on chain contract auction ID.
     * @param {string} currentAddress address used to sign transaction.
     */
    public async claimAuction(contractAuctionId: string, currentAddress: string) {
        console.log(`claiming nft auction with ${this.provider} on ${this.chainName}`)

        const argsBidToken = [
            {
                type: 'Hash160', // UInt160 from
                value: getScriptHashFromAddress(currentAddress),
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
                account: getScriptHashFromAddress(currentAddress),
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
                `Failed to execute claimAuction on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Create a single nft offer or a collection offer
     * @param {IOfferItem} item details.
     * @param {string} currentAddress used to sign transaction.
     */
    public async placeOffer(item: IOfferItem, currentAddress: string) {
        console.log(`placing offer on nft with ${this.provider} on ${this.chainName}`)

        const argsPlaceOffer = [
            {
                type: 'Hash160', // UInt160 baseScriptHash
                value: item.baseScriptHash,
            },
            {
                type: 'Hash160', // UInt160 from
                value: getScriptHashFromAddress(currentAddress),
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
                account: getScriptHashFromAddress(currentAddress),
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
                `Failed to execute placeOffer on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Accept or cancel a single nft offer or a collection offer
     * @param {IOfferItem} item details.
     * @param {string} currentAddress used to sign transaction.
     * @param {boolean} isCancellation used to sign transaction.
     */
    public async processOffer(item: IOfferItem, currentAddress: string, isCancellation: boolean) {
        console.log(`accept offer on nft with ${this.provider} on ${this.chainName}`)

        const argsAcceptOffer = [
            {
                type: 'Hash160', // UInt160 from
                value: getScriptHashFromAddress(currentAddress),
            },
            {
                type: 'ByteArray', // ByteString auctionId
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                value: numberToByteString(item.auctionId!),
            },
            {
                type: 'ByteArray', // ByteString tokenId
                value: numberToByteString(item.tokenId),
            },
        ]

        const argsCancelOffer = [
            {
                type: 'ByteArray', // ByteString auctionId
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                value: numberToByteString(item.auctionId!),
            },
        ]

        const allowedContracts = [this.contractExchangeAddress, item.quoteScriptHash]

        const signers = isCancellation
            ? [
                  {
                      account: getScriptHashFromAddress(currentAddress),
                      scopes: 1,
                  },
              ]
            : [
                  {
                      account: getScriptHashFromAddress(currentAddress),
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
                `Failed to execute processOffer on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Edit NFT Listing
     * @param {string} contractAuctionId on chain contract auction ID.
     * @param {string} currentAddress address used to sign transaction.
     * @param {string} newPrice new price to use for the listing.
     */
    public async editPrice(contractAuctionId: string, currentAddress: string, newPrice: string) {
        console.log(`edit listing price with ${this.provider} on ${this.chainName}`)

        const argsEditSale = [
            {
                type: 'Hash160', // UInt160 from
                value: getScriptHashFromAddress(currentAddress),
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
                account: getScriptHashFromAddress(currentAddress),
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
                `Failed to execute editPrice on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Approve Token Contract
     * @param {contractHash} string contract to approve.
     * @param {string} currentAddress address used to sign transaction.
     */
    public async approveToken(contractHash: string, currentAddress: string) {
        console.log(`approve ${contractHash} with ${this.provider} on ${this.chainName}`)

        const argsApproveToken = [
            {
                type: 'Hash160', // UInt160 from_address
                value: getScriptHashFromAddress(currentAddress),
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

        let invokeParams = null

        const signers = [
            {
                account: getScriptHashFromAddress(currentAddress),
                scopes: 1,
            },
        ]
        invokeParams = {
            scriptHash: contractHash,
            operation: METHOD_APPROVE_TOKEN,
            args: argsApproveToken,
            signers,
        }

        try {
            return this.invoke(invokeParams)
        } catch (e) {
            return console.error(
                `Failed to execute approveToken on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Check NEP17 Token Contract Approval
     * @param {address} string address to check approval.
     * @param {decimals} number decimals of contract to check approval.
     * @param {contract} string address of contract to check approval.
     */
    public async checkTokenApproval(address: string, decimals: number, contract: string) {
        console.log(
            `checking ${contract} approval with ${this.provider} on N3 ${
                this.isMainNet ? 'MainNet' : 'TestNet'
            }`,
        )

        const argsCheckAllowance = [
            {
                type: 'Hash160',
                value: getScriptHashFromAddress(address),
            },
            {
                type: 'Hash160',
                value: this.contractExchangeAddress,
            },
        ] as IArgs[]

        const signers = [
            {
                account: getScriptHashFromAddress(address),
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
            const decoded = response.stack[0].value / Math.pow(10, decimals)
            return decoded
        } catch (e) {
            return console.error(
                `Failed to execute checkTokenApproval on ${contract} with error:`,
                e,
            )
        }
    }

    /** Transfer NEP11 NFT
     * @param {ITransferItem[]} items details.
     * @param {string} currentAddress address used to sign transaction.
     */
    public async transfer(items: ITransferItem[], currentAddress: string) {
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
                account: getScriptHashFromAddress(currentAddress),
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
                `Failed to execute transfer on ${items[0].contract} with error:`,
                e,
            )
        }
    }

    /** Burn NEP11 NFT
     * @param {IBurnItem[]} items details.
     * @param {string} currentAddress address used to sign transaction.
     */
    public async burn(items: IBurnItem[], currentAddress: string) {
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
                account: getScriptHashFromAddress(currentAddress),
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
            return console.error(`Failed to execute burn on ${items[0].contract} with error:`, e)
        }
    }

    /** Mint NEP11 NFT
     * @param {IMintItem} item details.
     * @param {string} currentAddress address used to sign transaction.
     */
    public async mint(item: IMintItem, currentAddress: string) {
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

        const creator = currentAddress
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
                account: getScriptHashFromAddress(currentAddress),
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
            fee: '0',
            signers,
        }

        try {
            return this.invoke(invokeParams)
        } catch (e) {
            return console.error(
                `Failed to execute mint on ${
                    this.isMainNet
                        ? N3_MAINNET_CONTRACTS.GHOST_NEP11
                        : N3_TESTNET_CONTRACTS.GHOST_NEP11
                } with error:`,
                e,
            )
        }
    }

    /** Set royalties for contract
     * @param {ICollectionRoyalties} collection details.
     * @param {string} currentAddress address used to sign transaction.
     */
    public async collectionEditRoyalties(collection: ICollectionRoyalties, currentAddress: string) {
        console.log(`edit collection royalties with ${this.provider} on ${this.chainName}`)

        let argsSetCollectionRoyalties = [
            {
                type: 'Hash160', // UInt160 contract
                value: collection.contract,
            },
            {
                type: 'Array', // Array
                value: [],
            },
        ] as IArgs[]

        if (collection.royalties > 0) {
            argsSetCollectionRoyalties = [
                {
                    type: 'Hash160', // UInt160 contract
                    value: collection.contract,
                },
                {
                    type: 'Array', // Array
                    value: [
                        {
                            type: 'Array', // Array
                            value: [
                                {
                                    type: 'Hash160', // UInt160 address
                                    value: getScriptHashFromAddress(collection.royaltiesRecipient),
                                },
                                {
                                    type: 'Integer', // BigInteger value
                                    value: collection.royalties,
                                },
                            ] as IArgs[],
                        },
                    ] as IArgs[],
                },
            ]
        }

        const allowedContracts = [collection.contract.substring(2), this.contractExchangeAddress]

        const signers = [
            {
                account: getScriptHashFromAddress(currentAddress),
                scopes: 16,
                allowedContracts,
            },
            {
                account: collection.contract,
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
                `Failed to execute collectionEditRoyalties on ${this.contractExchangeAddress} with error:`,
                e,
            )
        }
    }

    /** Get incentives for address
     * @param {string} currentAddress address used to check incentives.
     */
    public async readIncentives(currentAddress: string) {
        console.log(`reading incentives with ${this.provider} on ${this.chainName}`)

        const argsReadIncentives = [
            {
                type: 'Hash160',
                value: getScriptHashFromAddress(currentAddress),
            },
        ] as IArgs[]

        const signers = [
            {
                account: getScriptHashFromAddress(currentAddress),
                scopes: 1,
            },
        ]

        const invokeParams = {
            scriptHash: this.contractIncentivesAddress,
            operation: METHOD_READ_INCENTIVES,
            args: argsReadIncentives,
            signers,
        }

        try {
            const response = await this.invokeRead(invokeParams)
            const decoded = response.result.stack[0].value[5].value / Math.pow(10, 8)
            return decoded
        } catch (e) {
            return console.error(
                `Failed to execute readIncentives on ${this.contractIncentivesAddress} with error:`,
                e,
            )
        }
    }

    /** Claim incentives for address
     * @param {string} currentAddress address used to claim incentives.
     */
    public async claimIncentives(currentAddress: string) {
        console.log(
            `claiming incentives with ${this.provider} on N3 ${
                this.isMainNet ? 'MainNet' : 'TestNet'
            }`,
        )

        const argsClaimIncentives = [
            {
                type: 'Hash160', // UInt160 from
                value: getScriptHashFromAddress(currentAddress),
            },
        ] as IArgs[]

        const signers = [
            {
                account: getScriptHashFromAddress(currentAddress),
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
                `Failed to execute claimIncentives on ${this.contractIncentivesAddress} with error:`,
                e,
            )
        }
    }

    /* TO ADD
    getTokenBalances / getOwnerships
    */
}
