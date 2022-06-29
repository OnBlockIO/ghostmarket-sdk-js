/* eslint-disable @typescript-eslint/no-unused-vars */
import Web3ProviderEngine from 'web3-provider-engine'
import Web3 from 'web3'

import { createGoerliProvider } from '../../utils/evm/create-goerli-provider'
import { GhostMarketSDK } from '../../core/sdk'
import { GhostMarketApi, IGhostMarketApiOptions } from '../../lib/api/ghostmarket'
import { Network, TxObject } from '../../types/types'
import {
    API_BASE_TESTNET,
    ORDERBOOK_VERSION,
    ETHEREUM_TESTNET_CONTRACTS,
    NULL_ADDRESS,
} from '../../core/constants'

describe(`GhostMarket API Post V${ORDERBOOK_VERSION}`, () => {
    const apiBaseUrl = API_BASE_TESTNET
    const ghostMarketAPIConfig: IGhostMarketApiOptions = {
        apiKey: process.env.GM_API_KEY,
        baseUrl: apiBaseUrl + '/api/v1',
    }

    let ghostmarketAPI: GhostMarketApi
    let provider: Web3ProviderEngine
    let web3: Web3
    let accounts: Array<string>
    let account1: string
    let account2: string
    let GhostMarket: GhostMarketSDK

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

    describe('Orders', () => {
        const dummyErc721Contract = '0xd35b5d7e184013233cc43139dc7242223ec0a708'
        const dummyErc20Contract = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'
        const dummyAddress = '0x83'
        const dummyToken = '83'
        const dummyChain = 'etht'
        const dummyAmount = 1
        const dummyPrice = '83'

        it('should not be able to list unaccepted chain', async () => {
            try {
                const nftToList = {
                    chain: 'ethtt',
                    token_contract: dummyErc721Contract,
                    token_id: dummyToken,
                    token_amount: dummyAmount,
                    quote_contract: dummyErc20Contract,
                    quote_price: dummyPrice,
                    maker_address: dummyErc721Contract,
                    is_buy_offer: false,
                    start_date: 0,
                    end_date: 0,
                    signature: dummyAddress,
                    order_key_hash: dummyAddress,
                    salt: dummyAddress,
                    origin_fees: 0,
                    origin_address: dummyErc721Contract,
                }
                await ghostmarketAPI.postCreateOrder(nftToList)
            } catch (err: any) {
                expect(err.toString()).toInclude(`Error: Unsupported value for 'chain' parameter.`)
            }
        }, 10000)

        it('should not be able to list unaccepted token_contract', async () => {
            try {
                const nftToList = {
                    chain: dummyChain,
                    token_contract: dummyAddress,
                    token_id: dummyToken,
                    token_amount: dummyAmount,
                    quote_contract: dummyErc20Contract,
                    quote_price: dummyPrice,
                    maker_address: dummyErc721Contract,
                    is_buy_offer: false,
                    start_date: 0,
                    end_date: 0,
                    signature: dummyAddress,
                    order_key_hash: dummyAddress,
                    salt: dummyAddress,
                    origin_fees: 0,
                    origin_address: dummyErc721Contract,
                }
                await ghostmarketAPI.postCreateOrder(nftToList)
            } catch (err: any) {
                expect(err.toString()).toInclude(
                    `Error: Token contract '${dummyAddress.slice(
                        2,
                    )}/etht' is not supported by backend (main db).`,
                )
            }
        }, 10000)

        it('should not be able to list unaccepted token_id', async () => {
            try {
                const nftToList = {
                    chain: dummyChain,
                    token_contract: dummyErc721Contract,
                    token_id: dummyAddress,
                    token_amount: dummyAmount,
                    quote_contract: dummyErc20Contract,
                    quote_price: dummyPrice,
                    maker_address: dummyErc721Contract,
                    is_buy_offer: false,
                    start_date: 0,
                    end_date: 0,
                    signature: dummyAddress,
                    order_key_hash: dummyAddress,
                    salt: dummyAddress,
                    origin_fees: 0,
                    origin_address: dummyErc721Contract,
                }
                await ghostmarketAPI.postCreateOrder(nftToList)
            } catch (err: any) {
                expect(err.toString()).toInclude(
                    `Error: Unsupported value for 'token_id' parameter`,
                )
            }
        }, 10000)

        it('should not be able to list unaccepted token_amount', async () => {
            try {
                const nftToList = {
                    chain: dummyChain,
                    token_contract: dummyErc721Contract,
                    token_id: dummyToken,
                    token_amount: -1,
                    quote_contract: dummyErc20Contract,
                    quote_price: dummyPrice,
                    maker_address: dummyErc721Contract,
                    is_buy_offer: false,
                    start_date: 0,
                    end_date: 0,
                    signature: dummyAddress,
                    order_key_hash: dummyAddress,
                    salt: dummyAddress,
                    origin_fees: 0,
                    origin_address: dummyErc721Contract,
                }
                await ghostmarketAPI.postCreateOrder(nftToList)
            } catch (err: any) {
                expect(err.toString()).toInclude(
                    `Error: Unsupported value for 'token_amount' parameter`,
                )
            }
        }, 10000)

        it('should not be able to list unaccepted quote_contract', async () => {
            try {
                const nftToList = {
                    chain: dummyChain,
                    token_contract: dummyErc721Contract,
                    token_id: dummyToken,
                    token_amount: dummyAmount,
                    quote_contract: dummyAddress,
                    quote_price: dummyPrice,
                    maker_address: dummyErc721Contract,
                    is_buy_offer: false,
                    start_date: 0,
                    end_date: 0,
                    signature: dummyAddress,
                    order_key_hash: dummyAddress,
                    salt: dummyAddress,
                    origin_fees: 0,
                    origin_address: dummyErc721Contract,
                }
                await ghostmarketAPI.postCreateOrder(nftToList)
            } catch (err: any) {
                expect(err.toString()).toInclude(
                    `Error: Quote contract '${dummyAddress.slice(
                        2,
                    )}/etht' is not supported by backend (main db).`,
                )
            }
        }, 10000)

        it('should not be able to list unaccepted quote_price', async () => {
            try {
                const nftToList = {
                    chain: dummyChain,
                    token_contract: dummyErc721Contract,
                    token_id: dummyToken,
                    token_amount: dummyAmount,
                    quote_contract: dummyErc20Contract,
                    quote_price: '-2',
                    maker_address: dummyErc721Contract,
                    is_buy_offer: false,
                    start_date: 0,
                    end_date: 0,
                    signature: dummyAddress,
                    order_key_hash: dummyAddress,
                    salt: dummyAddress,
                    origin_fees: 0,
                    origin_address: dummyErc721Contract,
                }
                await ghostmarketAPI.postCreateOrder(nftToList)
            } catch (err: any) {
                expect(err.toString()).toInclude(
                    `Error: Unsupported value for 'quote_price' parameter`,
                )
            }
        }, 10000)
    })

    // TO ADD , match fake orders?
    // TO ADD , others ?
})
