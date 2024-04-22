/* eslint-disable @typescript-eslint/no-unused-vars */
import Web3ProviderEngine from 'web3-provider-engine'
import Web3 from 'web3'

import { createGoerliProvider } from '../../utils/evm/create-goerli-provider'
import { GhostMarketSDK } from '../../core/sdk.evm'
import { ChainId, GhostMarketApi, IEVMOrderExtendedV2, IGhostMarketApiOptions, PutEvmOrderV2Request } from '@onblockio/gm-api-js'
import { API_BASE_TESTNET, API_PATH, ORDERBOOK_VERSION } from '../../core/constants'
import { Asset, enc } from '../../utils/evm/order'
import { ERC20, ERC721 } from '../../utils/evm/assets'

describe(`GhostMarket API Post V${ORDERBOOK_VERSION}`, () => {
    const url = API_BASE_TESTNET + API_PATH
    const ghostMarketAPIConfig: IGhostMarketApiOptions = {
        apiKey: process.env.GM_API_KEY,
        baseUrl: url,
    }

    let ghostmarketAPI: GhostMarketApi
    let provider: Web3ProviderEngine
    let web3: Web3
    let accounts: Array<string>
    // @ts-ignore
    let account1: string
    // @ts-ignore
    let account2: string
    // @ts-ignore
    let GhostMarket: GhostMarketSDK

    const unixNow = () =>  {
       return parseInt((Date.now() /  1000).toFixed(0)) 
    }

    beforeAll(async () => {
        provider = createGoerliProvider()
        provider.start()
        web3 = new Web3(provider)
        accounts = await web3.eth.getAccounts()
        account1 = accounts[0]
        account2 = accounts[1]
        ghostmarketAPI = new GhostMarketApi(ghostMarketAPIConfig)
    })

    afterAll(() => {
        provider.stop()
    })

    describe('Common', () => {
        it('Check provider', () => {
              // check provider validity
            expect(provider == undefined).toBeFalse()
            expect(provider.start == undefined).toBeFalse()
            expect(provider.stop == undefined).toBeFalse()
        })
    })

    describe('Orders', () => {
        const dummyErc721Contract = '0xd35b5d7e184013233cc43139dc7242223ec0a708'
        const dummyErc20Contract = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'
        const dummyAddress = '0x81'
        const dummyToken = '81'
        const dummyChain = 'etht'
        const dummyAmount = 1
        const dummyPrice = '10000000000000000'
        const dummySignature = '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const dummySalt = '0x0000000000000000'

        xit('should not be able to list unaccepted chain', async () => {
            try {
                const nftToList = {
                    domain: {
                        chainId: ChainId.EthT.toString(),
                        verifyingContract: '0x6c3E76022bEAAA29c12aca09823EDB6369F4bC6E' 
                    },
                    order: {
                        orderKeyHash: dummyAddress,
                        maker: dummyErc721Contract,
                        makeAsset: Asset(ERC20, enc(dummyErc20Contract), dummyPrice),
                        taker: '0x0000000000000000000000000000000000000000',
                        takeAsset: Asset(ERC721, enc(dummyErc721Contract), dummyPrice),
                        salt: dummySalt,
                        start: unixNow(),
                        end: unixNow() + 432000,
                        dataType: '0xffffffff',
                        data: '0x',
                        isBuyOffer: false,
                        originFees: [],
                        payouts: []
                    } as IEVMOrderExtendedV2,
                    signature: dummySignature
                } as PutEvmOrderV2Request                
                
                await ghostmarketAPI.putEvmOrderV2(new PutEvmOrderV2Request(nftToList))
                
            } catch (err: any) {
                expect(err.toString()).toInclude(`Error: Unsupported value for 'chain' parameter.`)
            }
        }, 10000)

        xit('should not be able to list unaccepted token_contract', async () => {
            try {
                const nftToList = {
                    domain: {
                        chainId: ChainId.EthT.toString(),
                        verifyingContract: '0x6c3E76022bEAAA29c12aca09823EDB6369F4bC6E' 
                    },
                    order: {
                        orderKeyHash: dummyAddress,
                        maker: dummyErc721Contract,
                        makeAsset: Asset(ERC20, enc(dummyErc20Contract), dummyPrice),
                        taker: '0x0000000000000000000000000000000000000000',
                        takeAsset: Asset(ERC721, enc(dummyErc721Contract), dummyPrice),
                        salt: dummySalt,
                        start: unixNow(),
                        end: unixNow() + 432000,
                        dataType: '0xffffffff',
                        data: '0x',
                        isBuyOffer: false,
                        originFees: [],
                        payouts: []
                    } as IEVMOrderExtendedV2,
                    signature: dummySignature
                } as PutEvmOrderV2Request                
                
                await ghostmarketAPI.putEvmOrderV2(new PutEvmOrderV2Request(nftToList))
            } catch (err: any) {
                expect(err.toString()).toInclude(
                    `Error: Token contract '${dummyAddress.slice(
                        2,
                    )}/etht' is not supported by backend (main db).`,
                )
            }
        }, 10000)

        xit('should not be able to list unaccepted token_id', async () => {
            try {
                const nftToList = {
                    domain: {
                        chainId: ChainId.EthT.toString(),
                        verifyingContract: '0x6c3E76022bEAAA29c12aca09823EDB6369F4bC6E' 
                    },
                    order: {
                        orderKeyHash: dummyAddress,
                        maker: dummyErc721Contract,
                        makeAsset: Asset(ERC20, enc(dummyErc20Contract), dummyPrice),
                        taker: '0x0000000000000000000000000000000000000000',
                        takeAsset: Asset(ERC721, enc(dummyErc721Contract), dummyPrice),
                        salt: dummySalt,
                        start: unixNow(),
                        end: unixNow() + 432000,
                        dataType: '0xffffffff',
                        data: '0x',
                        isBuyOffer: false,
                        originFees: [],
                        payouts: []
                    } as IEVMOrderExtendedV2,
                    signature: dummySignature
                } as PutEvmOrderV2Request                
                
                await ghostmarketAPI.putEvmOrderV2(new PutEvmOrderV2Request(nftToList))
            } catch (err: any) {
                expect(err.toString()).toInclude(
                    `Error: NFT with token ID '${dummyAddress}' was not found in backend's database.`,
                )
            }
        }, 10000)

        xit('should not be able to list unaccepted token_amount', async () => {
            try {
                const nftToList = {
                    domain: {
                        chainId: ChainId.EthT.toString(),
                        verifyingContract: '0x6c3E76022bEAAA29c12aca09823EDB6369F4bC6E' 
                    },
                    order: {
                        orderKeyHash: dummyAddress,
                        maker: dummyErc721Contract,
                        makeAsset: Asset(ERC20, enc(dummyErc20Contract), dummyPrice),
                        taker: '0x0000000000000000000000000000000000000000',
                        takeAsset: Asset(ERC721, enc(dummyErc721Contract), dummyPrice),
                        salt: dummySalt,
                        start: unixNow(),
                        end: unixNow() + 432000,
                        dataType: '0xffffffff',
                        data: '0x',
                        isBuyOffer: false,
                        originFees: [],
                        payouts: []
                    } as IEVMOrderExtendedV2,
                    signature: dummySignature
                } as PutEvmOrderV2Request                
                
                await ghostmarketAPI.putEvmOrderV2(new PutEvmOrderV2Request(nftToList))
            } catch (err: any) {
                expect(err.toString()).toInclude(
                    `Error: Unsupported value for 'token_amount' parameter`,
                )
            }
        }, 10000)

        xit('should not be able to list unaccepted quote_contract', async () => {
            try {
                const nftToList = {
                    domain: {
                        chainId: ChainId.EthT.toString(),
                        verifyingContract: '0x6c3E76022bEAAA29c12aca09823EDB6369F4bC6E' 
                    },
                    order: {
                        orderKeyHash: dummyAddress,
                        maker: dummyErc721Contract,
                        makeAsset: Asset(ERC20, enc(dummyErc20Contract), dummyPrice),
                        taker: '0x0000000000000000000000000000000000000000',
                        takeAsset: Asset(ERC721, enc(dummyErc721Contract), dummyPrice),
                        salt: dummySalt,
                        start: unixNow(),
                        end: unixNow() + 432000,
                        dataType: '0xffffffff',
                        data: '0x',
                        isBuyOffer: false,
                        originFees: [],
                        payouts: []
                    } as IEVMOrderExtendedV2,
                    signature: dummySignature
                } as PutEvmOrderV2Request                
                
                await ghostmarketAPI.putEvmOrderV2(new PutEvmOrderV2Request(nftToList))
            } catch (err: any) {
                expect(err.toString()).toInclude(
                    `Error: Quote contract '${dummyAddress.slice(
                        2,
                    )}/etht' is not supported by backend (main db).`,
                )
            }
        }, 10000)

        xit('should not be able to list unaccepted quote_price', async () => {
            try {
                const nftToList = {
                    domain: {
                        chainId: ChainId.EthT.toString(),
                        verifyingContract: '0x6c3E76022bEAAA29c12aca09823EDB6369F4bC6E' 
                    },
                    order: {
                        orderKeyHash: dummyAddress,
                        maker: dummyErc721Contract,
                        makeAsset: Asset(ERC20, enc(dummyErc20Contract), dummyPrice),
                        taker: '0x0000000000000000000000000000000000000000',
                        takeAsset: Asset(ERC721, enc(dummyErc721Contract), dummyPrice),
                        salt: dummySalt,
                        start: unixNow(),
                        end: unixNow() + 432000,
                        dataType: '0xffffffff',
                        data: '0x',
                        isBuyOffer: false,
                        originFees: [],
                        payouts: []
                    } as IEVMOrderExtendedV2,
                    signature: dummySignature
                } as PutEvmOrderV2Request                
                
                await ghostmarketAPI.putEvmOrderV2(new PutEvmOrderV2Request(nftToList))
            } catch (err: any) {
                expect(err.toString()).toInclude(
                    `Error: Unsupported value for 'quote_price' parameter`,
                )
            }
        }, 10000)
    })
})
