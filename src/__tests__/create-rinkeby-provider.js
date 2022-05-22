/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { MnemonicWalletSubprovider } = require('@0x/subproviders/')

// NOTE:
// https://www.npmjs.com/package/web3-provider-engine allow us to create our own custom providers
const Web3ProviderEngine = require('web3-provider-engine')
const RPCProvider = require('web3-provider-engine/subproviders/rpc')

function createRinkebyProvider() {
  const BASE_DERIVATION_PATH = `44'/60'/0'/0`
  const MNEMONIC = 'hill coyote hungry green glass provide valve rookie mad tell capable vintage'

  const mnemonicWalletProvider = new MnemonicWalletSubprovider({
    mnemonic: MNEMONIC,
    baseDerivationPath: BASE_DERIVATION_PATH,
  })

  const infuraRinkebyRPCUrl = 'https://rinkeby.infura.io/v3/73cf78206642489d9a34dd2eccd3c593'

  const infuraRPCProvider = new RPCProvider({
    rpcUrl: infuraRinkebyRPCUrl,
  })

  const providerEngine = new Web3ProviderEngine()
  providerEngine.addProvider(mnemonicWalletProvider)
  providerEngine.addProvider(infuraRPCProvider)

  return providerEngine
}

module.exports = { createRinkebyProvider }
