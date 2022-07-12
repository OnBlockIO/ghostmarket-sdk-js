# ghostmarket-sdk-ts

[![https://badges.frapsoft.com/os/mit/mit.svg?v=102](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://opensource.org/licenses/MIT)

Ghostmarket SDK offers a complete set of functionalities enabling access to GhostMarket as a full-fledged SDK written in TypeScript. 

Checkout the [Changelog](https://github.com/OnBlockIO/ghostmarket-sdk-ts/blob/master/CHANGELOG.md)

Published on [GitHub](https://github.com/OnBlockIO/ghostmarket-sdk-ts) and [npm](https://www.npmjs.com/package/ghostmarket-sdk-ts)

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage](#getting-started)
  - [Getting Assets](#getting-assets)
  - [Getting Balances](#getting-balances)
  - [Getting Orders](#getting-orders)
  - [Selling Assets](#selling-assets)
  - [Buying Assets](#buying-assets)
  - [Making Offers](#making-offers)
  - [Accepting Offers](#accepting-offers)
  - [Transfers](#transfers)
  - [Events](#events)
- [Development](#development)


## Installation

We recommend using Node.js version 16.

```bash
yarn add ghostmarket-sdk-ts
```
or if using npm
```bash
npm install --save ghostmarket-sdk-ts
```

Install [web3](https://github.com/ethereum/web3.js) if you don't have it already.

## Getting started

To get started on EVM, you can use either a read only provider, a web3 provider (ex metamask), a private key or a mnemonic (last two are to be stored in `.env` file, see `.env.example` for a reference).
To get started on Neo N3, you can use either a NEP-12 provider (ex neoline) or a private key (to be stored in `.env` file, see `.env.example` for a reference).

```js
const { GhostMarketSDK, Network, API_BASE_MAINNET, API_BASE_TESTNET } = require('ghostmarket-sdk-ts');
// if using EVM private key or mnemonic hdwallet-provider is required
// const HDWalletProvider = require('@truffle/hdwallet-provider')
// const privateKey = process.env.PRIVATE_KEY
// const mnemonic = process.env.MNEMONIC

// Specify the RPC to use, ex: https://mainnet.infura.io for default read only ethereum mainnet
const CUSTOM_RPC_URL = 'https://mainnet.infura.io'

// SDK config options.
const sdkConfig = {
    apiKey: process.env.GM_API_KEY, // GhostMarket API KEY if you have one
    baseUrl: API_BASE_MAINNET, // GhostMarket API endpoint - API_BASE_TESTNET or API_BASE_MAINNET
    rpcUrl: CUSTOM_RPC_URL,
    chainName: 'Ethereum',
    privateKey, // private key to use - only for Neo N3 private provider
}

/* chainName values
    Avalanche = 'Avalanche',
    AvalancheTestnet = 'Avalanche Testnet',
    BSC = 'BSC',
    BSCTestnet = 'BSC Testnet',
    Ethereum = 'Ethereum',
    EthereumTestnet = 'Ethereum Testnet',
    Polygon = 'Polygon',
    PolygonTestnet = 'Polygon Testnet',
    Neo3 = 'Neo3',
    Neo3Testnet = 'Neo3 Testnet',
    */

// Option 1 - Readonly provider, only reads the network state. Can not sign transactions.
const customProvider = new Web3.providers.HttpProvider(CUSTOM_RPC_URL)
// Option 2 - metamask provider
const customProvider = window.ethereum
// Option 3 - private key - EVM
const customProvider = new HDWalletProvider(privateKey, CUSTOM_RPC_URL)
// Option 4 - mnemonic
const customProvider = new HDWalletProvider(mnemonic, CUSTOM_RPC_URL)
// Option 5 - Neo N3
const customProvider = 'neoline' // neoline, o3, or private

// Create instance of GhostMarketSDK
const gmSDK = new GhostMarketSDK(customProvider, sdkConfig);

// Use the object to access GhostMarket:
(async () => {
  // Fetch 10 GhostMarket events.
  const { events } = await gmSDK.api.getEvents({ limit: 10 });
  console.info(events)
  
  // Fetch 10 GhostMarket collections.
  const { collections } = await gmSDK.api.getCollections({ limit: 10 })
  console.info(collections)
})()
```

## Usage



## Development

**Setup**

Clone this repo
```bash
git clone https://github.com/OnBlockIO/ghostmarket-sdk-ts
```

Install 
```bash
cd ghostmarket-sdk-ts/
yarn install
```

**Build**

To build
```bash
yarn build
```

**Test**

To run the tests
```bash
yarn test
```

**Contributing**

Contributions welcome! Please use [GitHub issues](https://github.com/OnBlockIO/ghostmarket-sdk-ts/issues) for suggestions/issues.