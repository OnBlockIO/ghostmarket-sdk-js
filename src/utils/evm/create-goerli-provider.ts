/* eslint-disable @typescript-eslint/no-var-requires */
const { MnemonicWalletSubprovider } = require('@0x/subproviders/')

// NOTE:
// https://www.npmjs.com/package/web3-provider-engine allow us to create our own custom providers
const Web3ProviderEngine = require('web3-provider-engine')
const RPCProvider = require('web3-provider-engine/subproviders/rpc')

export function createGoerliProvider() {
    const BASE_DERIVATION_PATH = `44'/60'/0'/0`
    const MNEMONIC = process.env.MNEMONIC

    const mnemonicWalletProvider = new MnemonicWalletSubprovider({
        mnemonic: MNEMONIC,
        baseDerivationPath: BASE_DERIVATION_PATH,
    })

    const goerliPublicRPCUrl = 'https://ethereum-goerli.publicnode.com'	
    const infuraGoerliRPCUrl = `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`

    const goerliRPCUrl = process.env.INFURA_API_KEY ? infuraGoerliRPCUrl : goerliPublicRPCUrl

    const infuraRPCProvider = new RPCProvider({
        rpcUrl: goerliRPCUrl,
    })

    const providerEngine = new Web3ProviderEngine()
    providerEngine.addProvider(mnemonicWalletProvider)
    providerEngine.addProvider(infuraRPCProvider)

    return providerEngine
}
