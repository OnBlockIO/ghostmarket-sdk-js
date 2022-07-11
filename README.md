# ghostmarket-sdk-ts

[![https://badges.frapsoft.com/os/mit/mit.svg?v=102](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://opensource.org/licenses/MIT)
[![Coverage Status](https://coveralls.io/repos/github/OnBlockIO/ghostmarket-sdk-ts/badge.svg?branch=master)](https://coveralls.io/github/OnBlockIO/ghostmarket-sdk-ts?branch=master)

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

## Getting started

To get started, you can use either a read only provider, metamask provider, a private key or a mnemonic (last two are to be stored in `.env` file, see `.env.example` for a reference).

```js
const { GhostMarketSDK, Network, API_BASE_TESTNET } = require('ghostmarket-sdk-ts');
// if using private key or mnemonic hdwallet-provider is required
// const HDWalletProvider = require('@truffle/hdwallet-provider')
// const privateKey = process.env.PRIVATE_KEY
// const mnemonic = process.env.MNEMONIC

// Specify the RPC to use, ex: https://mainnet.infura.io for default read only ethereum mainnet
const CUSTOM_RPC_URL = 'YOUR_CUSTOM_RPC_URL'

// SDK config options.
const options = {
  networkName: Network.Ethereum, // blockchain to use - ex: Network.Ethereum or Network.EthereumTestnet
  apiKey: process.env.GM_API_KEY, // GhostMarket API KEY if you have one
  apiBaseUrl: API_BASE_TESTNET, // GhostMarket API endpoint - API_BASE_TESTNET or API_BASE_MAINNET
}

// Option 1 - Readonly provider, only reads the network state. Can not sign transactions. (EVM only)
const customProvider = new Web3.providers.HttpProvider(CUSTOM_RPC_URL)
// Option 2 - metamask provider (EVM only)
const customProvider = window.ethereum
// Option 3 - private key (EVM only)
const customProvider = new HDWalletProvider(privateKey, CUSTOM_RPC_URL)
// Option 4 - mnemonic (EVM only)
const customProvider = new HDWalletProvider(privateKey, CUSTOM_RPC_URL)

// Create instance of GhostMarketSDK
const gmSDK = new GhostMarketSDK(customProvider, options);

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