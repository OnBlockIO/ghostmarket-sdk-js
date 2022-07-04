/* eslint-disable @typescript-eslint/no-unused-vars */
import { numberToByteString, getScriptHashFromAddress, b64EncodeUnicode } from '../utils/n3/helpers'
import { N3_MAINNET_CONTRACTS, N3_TESTNET_CONTRACTS } from './constants'

export interface IBuyItem {
    contractAuctionId: string
    ownerAddress: string
    price: string
    quoteContractHash: string // starts with 0x
}

export interface ISellItem {
    tokenId: string
    baseContractHash: string // starts with 0x
    price: string
    quoteContractHash: string // starts with 0x
}

export interface IBidItem {
    contractAuctionId: string
    bidPrice?: string
    quoteContractHash: string // starts with 0x
}

export interface ITransferItem {
    contract: string // starts with 0x
    destAddress: string
    token_id: string
}

export interface IBurnItem {
    contract: string // starts with 0x
    token_id: string
}

export interface IAuctionItem {
    auctionType: number // classic (1) reserve (2) dutch (3) fixed (0)
    tokenId: string
    baseContractHash: string // starts with 0x
    extensionPeriod?: number
    startDate: number
    endDate: number
    startPrice?: number
    endPrice?: number
    quoteContractHash: string // starts with 0x
}

export interface IMintItem {
    quantity: number
    attrT1: string
    attrV1: string
    attrT2: string
    attrV2: string
    attrT3: string
    attrV3: string
    name: string
    description: string
    imageURL: string
    externalURI: string
    royalties: number
    type: string
}

export interface ICollectionRoyalties {
    contract: string
    royalties: number
    royaltiesRecipient: string
}

export interface IArgs {
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

export class GhostMarketN3SDK {
    providerHint = ''
    provider: any = null
    curProviderHint = ''
    isMainNet: boolean

    chainName: string
    contractExchangeAddress: string

    constructor(isMainNet: boolean) {
        // setup constants
        this.isMainNet = isMainNet
        this.chainName = this.isMainNet ? 'n3' : 'n3t'
        this.contractExchangeAddress = isMainNet
            ? N3_MAINNET_CONTRACTS.EXCHANGE
            : N3_TESTNET_CONTRACTS.EXCHANGE
    }

    getProvider(_initialize?: boolean) {
        const win = window as any

        switch (this.providerHint) {
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
                providerHint: this.providerHint,
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
                .catch(({ type, description, data }: any) => {
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

    invokeMultiple(invokeParams: any): Promise<string> {
        return new Promise((resolve, reject) => {
            ;(this.providerHint === 'o3'
                ? this.getProvider().invokeMulti(invokeParams)
                : this.getProvider().invokeMultiple(invokeParams)
            )
                .then((result: any) => {
                    console.log('Invoke multiple transaction success!')
                    console.log('Transaction ID: ' + result.txid)
                    resolve(result.txid)
                })
                .catch(({ type, description, data }: any) => {
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

    async signData(dataToSign: string) {
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

    buyMultiple(items: IBuyItem[], currentAddress: string): Promise<string> {
        const isBuyBatch = items.length > 1

        console.log(
            `buying ${isBuyBatch ? 'bulk' : 'single'} nft with ${this.providerHint} on ${
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

        return this.invokeMultiple(invokeParamsMultiple)
    }

    sellMultiple(
        items: ISellItem[],
        currentAddress: string,
        startDate: Date,
        endDate: Date,
    ): Promise<string> {
        const isListBatch = items.length > 1

        console.log(
            `selling ${isListBatch ? 'bulk' : 'single'} nft with ${this.providerHint} on ${
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
        return this.invokeMultiple(invokeParamsMultiple)
    }

    buyAuction(item: IBidItem, currentAddress: string): Promise<string> {
        console.log(`bidding on nft with ${this.providerHint} on ${this.chainName}`)

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

        return this.invoke(invokeParams)
    }

    listAuction(item: IAuctionItem, currentAddress: string): Promise<string> {
        console.log(`auction nft with ${this.providerHint} on ${this.chainName}`)

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

        return this.invoke(invokeParams)
    }

    claimAuction(contractAuctionId: string, currentAddress: string): Promise<string> {
        console.log(`claiming nft auction with ${this.providerHint} on ${this.chainName}`)

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

        return this.invoke(invokeParams)
    }

    editPrice(
        contractAuctionId: string,
        currentAddress: string,
        newPrice: string,
    ): Promise<string> {
        console.log(`edit listing price with ${this.providerHint} on ${this.chainName}`)

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

        return this.invoke(invokeParams)
    }

    transfer(items: ITransferItem[], currentAddress: string): Promise<string> {
        const isTransferBatch = items.length > 1
        console.log(
            `transfer ${isTransferBatch ? 'bulk' : 'single'} nft with ${this.providerHint} on ${
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
                        value: numberToByteString(item.token_id),
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

        return this.invokeMultiple(invokeParamsMultiple)
    }

    burn(items: IBurnItem[], currentAddress: string): Promise<string> {
        const isBurnBatch = items.length > 1
        console.log(
            `burn ${isBurnBatch ? 'bulk' : 'single'} nft with ${this.providerHint} on ${
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
                        value: numberToByteString(item.token_id),
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

        return this.invokeMultiple(invokeParamsMultiple)
    }

    mint(item: IMintItem, currentAddress: string): Promise<string> {
        const isMintBatch = item.quantity > 1
        console.log(
            `minting ${isMintBatch ? 'bulk' : 'single'} nft with ${this.providerHint} on ${
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
            scriptHash: N3_MAINNET_CONTRACTS.GHOST_NEP11,
            operation: isMintBatch ? METHOD_MULTI_MINT : METHOD_MINT,
            args: argsMint,
            fee: '0',
            signers,
        }

        return this.invoke(invokeParams)
    }

    collectionEditRoyalties(item: ICollectionRoyalties, currentAddress: string): Promise<string> {
        console.log(`edit collection royalties with ${this.providerHint} on ${this.chainName}`)

        let argsSetCollectionRoyalties = [
            {
                type: 'Hash160', // UInt160 contract
                value: item.contract,
            },
            {
                type: 'Array', // Array
                value: [],
            },
        ] as IArgs[]

        if (item.royalties > 0) {
            argsSetCollectionRoyalties = [
                {
                    type: 'Hash160', // UInt160 contract
                    value: item.contract,
                },
                {
                    type: 'Array', // Array
                    value: [
                        {
                            type: 'Array', // Array
                            value: [
                                {
                                    type: 'Hash160', // UInt160 address
                                    value: getScriptHashFromAddress(item.royaltiesRecipient),
                                },
                                {
                                    type: 'Integer', // BigInteger value
                                    value: item.royalties,
                                },
                            ] as IArgs[],
                        },
                    ] as IArgs[],
                },
            ]
        }

        const allowedContracts = [item.contract.substring(2), this.contractExchangeAddress]

        const signers = [
            {
                account: getScriptHashFromAddress(currentAddress),
                scopes: 16,
                allowedContracts,
            },
            {
                account: item.contract,
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

        return this.invoke(invokeParams)
    }

    /* TO ADD
    getTokenBalances / getOwnerships
    */
}
