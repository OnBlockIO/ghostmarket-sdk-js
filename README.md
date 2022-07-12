# ghostmarket-sdk-js

[![https://badges.frapsoft.com/os/mit/mit.svg?v=102](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://opensource.org/licenses/MIT)

Ghostmarket SDK offers a complete set of functionalities enabling access to GhostMarket as a full-fledged SDK written in TypeScript/Javascript. 

Checkout the [Changelog](https://github.com/OnBlockIO/ghostmarket-sdk-js/blob/master/CHANGELOG.md)

Published on [GitHub](https://github.com/OnBlockIO/ghostmarket-sdk-js) and [npm](https://www.npmjs.com/package/ghostmarket-sdk-js)

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
yarn add ghostmarket-sdk-js
```
or if using npm
```bash
npm install --save ghostmarket-sdk-js
```

Install [web3](https://github.com/ethereum/web3.js) if you don't have it already.

## Getting started

To get started on EVM, you can use either a read only provider, a web3 provider (ex metamask), a private key or a mnemonic (last two are to be stored in `.env` file, see `.env.example` for a reference).
To get started on Neo N3, you can use either a NEP-12 provider (ex neoline) or a private key (to be stored in `.env` file, see `.env.example` for a reference).

```js
import { GhostMarketSDK, GhostMarketN3SDK, Network, TEST_ENVIRONMENT, MAIN_ENVIRONMENT } from 'ghostmarket-sdk-js';
// if using EVM private key or mnemonic hdwallet-provider is required
// const HDWalletProvider = require('@truffle/hdwallet-provider')

// Variables
const API_KEY = '' // GhostMarket API KEY if you have one
const CUSTOM_RPC_URL = 'https://mainnet.infura.io' // RPC to use
const CHAIN = 'Ethereum'
const KEY = '' // private key to use - only for Neo N3 private provider or EVM
const MNEMONIC = '' // mnemonic to use - only for EVM

/* CHAIN values
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

// SDK config options.
const sdkConfig = {
    apiKey: API_KEY,
    environment: MAIN_ENVIRONMENT, // GhostMarket Infrastructure - MAIN_ENVIRONMENT or TEST_ENVIRONMENT
    rpcUrl: CUSTOM_RPC_URL,
    chainName: CHAIN,
    privateKey: KEY, // private key to use - only for Neo N3 private provider
}

//////// EVM provider options ////////
// Option 1 - Readonly provider, only reads the network state. Can not sign transactions.
const customProvider = new Web3.providers.HttpProvider(CUSTOM_RPC_URL)
// Option 2 - metamask provider
const customProvider = window.ethereum
// Option 3 - private key - EVM
const customProvider = new HDWalletProvider(KEY, CUSTOM_RPC_URL)
// Option 4 - mnemonic
const customProvider = new HDWalletProvider(MNEMONIC, CUSTOM_RPC_URL)
// Create instance of GhostMarketSDK - EVM
const gmSDK = new GhostMarketSDK(customProvider, sdkConfig);
//////// EVM provider options ////////


//////// Neo N3 provider options ////////
const customProvider = 'neoline' // neoline, o3, or private
// Create instance of GhostMarketN3SDK - Neo N3
const gmSDK = new GhostMarketN3SDK(customProvider, sdkConfig);
//////// Neo N3 provider options ////////


// All set - use the object to access GhostMarket SDK
// Fetch 10 GhostMarket events.
const { events } = await gmSDK.api.getEvents({ limit: 10 });
console.info(events)

// Fetch 10 GhostMarket collections.
const { collections } = await gmSDK.api.getCollections({ limit: 10 })
console.info(collections)
```

## Usage

### Making an offer

```js
// Token ID and smart contract address for a non-fungible token:
const { tokenId, tokenContract } = YOUR_ASSET
// Address placing offer
const makerAddress = "0x..."

const offer = await gmSDK.sdk.evm.placeOffer({
    chain: string,
    tokenContract: string,
    tokenId: string,
    tokenAmount: 1,
    quoteContract: string,
    quotePrice: 1111,
    makerAddress,
    type: number,
    typeAsset: number,
    startDate: number,
    endDate: number,
})
```


## Development

**Setup**

Clone this repo
```bash
git clone https://github.com/OnBlockIO/ghostmarket-sdk-js
```

Install 
```bash
cd ghostmarket-sdk-js/
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

Contributions welcome! Please use [GitHub issues](https://github.com/OnBlockIO/ghostmarket-sdk-js/issues) for suggestions/issues.