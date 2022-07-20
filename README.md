# ghostmarket-sdk-js

[![https://badges.frapsoft.com/os/mit/mit.svg?v=102](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://opensource.org/licenses/MIT)

Ghostmarket SDK offers a complete set of functionalities enabling access to GhostMarket as a full-fledged SDK written in TypeScript/Javascript. 

Checkout the [Changelog](https://github.com/OnBlockIO/ghostmarket-sdk-js/blob/master/CHANGELOG.md)

Published on [GitHub](https://github.com/OnBlockIO/ghostmarket-sdk-js) and [npm](https://www.npmjs.com/package/ghostmarket-sdk-js)

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage](#getting-started)
    - [Getting Assets](#getting-assets)
    - [Getting Events](#getting-events)
    - [Getting Collections](#getting-collections)
    - [Getting Offers](#getting-offers)
    - [Getting Orders](#getting-orders)
    - [Getting NFT balances](#getting-nft-balances)
    - [Getting FT balances](#getting-ft-balances)
    - [Getting Token Approval](#getting-token-approval)
    - [Getting Contract Approval](#getting-contract-approval)
    - [Getting Incentives](#getting-incentives)
    - [Signing Data](#signing-data)
    - [Setting Contract Royalties](#setting-contract-royalties)
    - [Wrap/Unwrap Token](#wrap-unwrap-token)
    - [Approve Token](#approve-token)
    - [Approve Contract](#approve-contract)
    - [Transfer ERC20](#transfer-erc20)
    - [Transfer ERC721](#transfer-erc721)
    - [Transfer ERC1155](#transfer-erc1155)
    - [Burn ERC721](#burn-erc721)
    - [Burn ERC1155](#burn-erc1155)
    - [Mint ERC721](#mint-erc721)
    - [Mint ERC1155](#mint-erc1155)
    - [Claim Incentives](#claim-incentives)

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
import Web3 from 'web3' // only for EVM
import { GhostMarketSDK, GhostMarketN3SDK, Network, TESTNET_API_URL, MAINNET_API_URL } from 'ghostmarket-sdk-js';
// if using EVM private key or mnemonic hdwallet-provider is required
// import HDWalletProvider from '@truffle/hdwallet-provider'


// Variables
const apiKey = process.env.GM_API_KEY // GhostMarket API KEY if you have one
const privateKey = process.env.PRIVATE_KEY // private key to use - only for Neo N3 private provider or EVM
const mnemonic = process.env.MNEMONIC // mnemonic to use - only for EVM
const rpcUrl = process.env.RPC_URL // RPC to use, ex 'https://mainnet.infura.io'
const environment = MAINNET_API_URL // GhostMarket Infrastructure - MAIN_ENVIRONMENT or TEST_ENVIRONMENT
const chainName = Network.Ethereum // see below for chain values

/* chainName values : 
    Network.Ethereum / Network.EthereumTestnet
    Network.Polygon / Network.PolygonTestnet
    Network.BSC / Network.BSCTestnet
    Network.Avalanche / Network.AvalancheTestnet
    Network.Neo3 / Network.Neo3Testnet
    */

// SDK config options.
const sdkConfig = {
    apiKey,
    rpcUrl,
    environment,
    chainName,
}

//////// EVM provider options ////////
// Option 1 - Readonly provider, only reads the network state. Can not sign transactions.
const customProvider = new Web3.providers.HttpProvider(rpcUrl)
// Option 2 - metamask provider
const customProvider = window.ethereum
// Option 3 - private key - EVM
const customProvider = new HDWalletProvider(KEY, rpcUrl)
// Option 4 - mnemonic
const customProvider = new HDWalletProvider(MNEMONIC, rpcUrl)
// Create instance of GhostMarketSDK - EVM
const gmSDK = new GhostMarketSDK(customProvider, sdkConfig);
// Connected address
const address = customProvider.addresses[0]
//////// EVM provider options ////////


//////// Neo N3 provider options ////////
const customProvider = 'neoline' // neoline, o3, or private
// Create instance of GhostMarketN3SDK - Neo N3
const gmSDK = new GhostMarketN3SDK(customProvider, sdkConfig);
// Connected address
// const address = customProvider.addresses[0]
//////// Neo N3 provider options ////////


// All set - use the object to access GhostMarket SDK
```


## Usage - Common

### Fetching assets

```js
// Fetch 1 GhostMarket asset.
const { asset } = await gmSDK.api.getAssetsV2({ limit: 1 });
console.info(asset)
```

### Fetching events

```js
// Fetch 10 GhostMarket events.
const { events } = await gmSDK.api.getEventsV2({ limit: 10 });
console.info(events)
```

### Fetching collections
```js
// Fetch 10 GhostMarket collections.
const { collections } = await gmSDK.api.getCollectionsV2({ limit: 10 })
console.info(collections)
```

### Fetching offers 
```js
// Fetch offers from asset.
const chain = '' // filter by chain
const contractAddress = '' // filter for one contract
const tokenId = '' // filter for one tokenId
const { offers } = await gmSDK.api.getAssetOffersV2({ chain, contractAddress, tokenId })
console.info(offers)
```

### Fetching orders 
```js
// Fetch orders from asset.
const chain = '' // filter by chain
const contractAddress = '0x....' // filter for one contract
const tokenId = '' // filter for one tokenId
const { orders } = await gmSDK.api.getAssetOrdersV2({ chain, contractAddress, tokenId })
console.info(orders)
```

### Fetching Non Fungible Token (NFT) balances
```js
const chain = '' // filter by chain
const contractAddress =  '' // filter for one contract
const owners = ['0x....'] // filter by one or more owner
const balance = await gmSDK.api.getAssetsV2({ chain, contractAddress, owners })
console.info(balance)
```

### Checking Fungible Token balances
```js
const contract =  '' 
const balance = await gmSDK.checkTokenBalance(contract, address)
console.info(`balance: ` + balance)
```

### Set contract royalties
```js
const contractAddress = '0x....'
const royaltiesArray = [{address, value: 1000}] // array of recipient/value array (in bps)
const royalties = await gmSDK.setRoyaltiesForContract(contractAddress, royaltiesArray, {from: address})
console.info(`tx hash: ${royalties}`)
```

### Approve token
```js
const contract = '0x....'
const approve = await gmSDK.approveToken(contract, {from: address})
console.info(`tx hash: ${approve}`)
```

### Checking token approval
```js
const contract = '0x....'
const tokenApproval = await gmSDK.checkTokenApproval(contract, address)
console.info(`amount approved: ` + tokenApproval)
```

### Claiming incentives
```js
const claim = await gmSDK.claimIncentives({from: address})
console.info(`tx hash: ${claim}`)
```

### Checking incentives
```js
const incentives = await gmSDK.checkIncentives(address)
const availableIncentives = incentives ? incentives.availableIncentives / Math.pow(10, 8) : 0 // EVM
const availableIncentives = incentives[5].value// Neo N3
console.info(`available incentives: ${availableIncentives}`)
```

### Signing data
```js
const message = 'signing stuff'
const signed = await gmSDK.signData(message, address)
console.info(`signed data: ${signed}`)
```

## Usage - EVM

prepareMatchOrders
createOpenOrder
matchOrders
cancelOrder
bulkCancelOrders

You can override automatic calculation of gas price if you add it to the last argument object on each transaction requiring signature.
Example when wrapping a token:

instead of `const wrap = await gmSDK.wrapToken(amount, isWrap, {from: address})` simply do `const wrap = await gmSDK.wrapToken(amount, isWrap, {from: address, gasPrice: 50000})` if you want to override gas price to `50000`.

### Fetching contract approval
```js
const contract = '0x....'
const approval = await gmSDK.checkContractApproval(contract, address)
console.info(`is contract approved: ` + contractApproval)
```

### Wrap / Unwrap native token
```js
const amount = '1' // in wei
const isWrap = true // set to false to unwrap
const wrap = await gmSDK.wrapToken(amount, isWrap, {from: address})
console.info(`tx hash: ${wrap}`)
```

### Approve contract
```js
const contract = '0x....'
const approval = await gmSDK.approveContract(contract, {from: address})
console.info(`tx hash: ${approval}`)
```

### Transfer ERC20
```js
const destination = '0x....'
const contract = '0x....'
const amount = '1' // in wei
const transfer = await gmSDK.transferERC20(destination, contract, amount, {from: address})
console.info(`tx hash: ${transfer}`)
```

### Transfer ERC721 NFT
```js
const destination = '0x....'
const contract = '0x....'
const tokenId = ''
const transfer = await gmSDK.transferERC721(destination, contract, tokenId, {from: address})
console.info(`tx hash: ${transfer}`)
```

### Transfer ERC1155 NFT
```js
const destination = '0x....'
const contract = '0x....'
const tokenId = ''
const amount = 1
const transfer = await gmSDK.transferERC1155(destination, contract, [tokenId], [amount], {from: address})
console.info(`tx hash: ${transfer}`)
```

### Burn ERC721 NFT
```js
const contract = '0x....'
const tokenId = ''
const burn = await gmSDK.burnERC721(contract, tokenId, {from: address})
console.info(`tx hash: ${burn}`)
```

### Burn ERC1155 NFT
```js
const contract = '0x....'
const tokenId = ''
const amount = 1
const burn = await gmSDK.burnERC721(contract, tokenId, amount, {from: address})
console.info(`tx hash: ${burn}`)
```

### Minting ERC721 GHOST NFT
```js
const mintDetails = {
    creatorAddress: creator,
    royalties: [{address: creator, value: 1000}], // use bps
    externalURI: 'ipfs://xxx'
}
const token = await gmSDK.mintERC721(mintDetails, {from: address})
console.info(`tx hash: ${token}`)
```

### Minting ERC1155 GHOST NFT
```js
const creator = '0x...'
const mintDetails = {
    creatorAddress: creator,
    royalties: [{address: creator, value: 1000}], // use bps
    externalURI: 'ipfs://xxx'
}
const amount = 1
const token = await gmSDK.mintERC1155(mintDetails, amount, {from: address})
console.info(`tx hash: ${token}`)
```

## Usage Neo N3

setRoyaltiesForContract
CustomContracts

You can override automatic calculation of network fee and system fee if you add it to the last argument object on each transaction requiring signature.
Example when buying a NFT:

instead of `const buying = await gmSDK.buyMultiple(buyingDetails, {from: address})` simply do `const buying = await gmSDK.buyMultiple(buyingDetails, {from: address, systemFee: 0.2, networkFee: 0.2})` if you want to override both with 0.2 GAS


### Buying one or more NFT (or cancel listing)
```js
const buyingDetails = [{ 
    contractAuctionId: '', // on chain contract auction ID.
    price: '', // order price - unused for cancellation
    quoteContractAddress: '0x....', // order quote contract address.
    isCancellation: false, // is it a cancellation.
}]
const buying = await gmSDK.buyMultiple(buyingDetails, {from: address})
console.info(`tx hash: ${buying}`)
```

### Listing one or more NFT - fixed price
```js
const startDate = new Date().getTime()
const listingDetails = [{ 
    tokenId: '', // order NFT tokenId - token id for listing
    baseContractAddress: '0x....', // order base contract address - nft contract for listing
    price: '1', // order price - in biginteger format
    quoteContractAddress: '0x....', // order quote contract address - currency accepted for listing
    startDate, // order start date - set to custom one or it will default to right now
    endDate: 0, // order end date - set to 0 for unexpiring
}]
const listing = await gmSDK.sellMultiple(listingDetails, {from: address})
console.info(`tx hash: ${listing}`)
```

### Listing NFT - auction
```js
const startDate = new Date().getTime()
const auctionDetails = { 
    auctionType: 1, // classic (1) reserve (2) dutch (3)
    tokenId: '', // auction NFT tokenId.
    baseContractAddress: '0x....', // auction base contract address.
    extensionPeriod: 600, // auction extension period - 600 for 10 min
    startDate, // auction start date.
    endDate: startDate + 604800 // auction end date. - startDate + 604800 for one week
    startPrice: '', // auction start price.
    endPrice: 0, // auction end price - only used for dutch auctions.
    quoteContractAddress: '0x....', // auction quote contract address.
}
const auction = await gmSDK.listAuction(auctionDetails, {from: address})
console.info(`tx hash: ${auction}`)
```

### Edit listing price NFT - fixed price only
```js
const contractAuctionId = '' // on chain contract auction ID.
const price = '' // new price
const edit = await gmSDK.editPrice(contractAuctionId, price, {from: address})
console.info(`tx hash: ${edit}`)
```

### Place offer (or collection offer) on NFT
```js
const startDate = new Date().getTime()
const offerDetails = { 
    baseContractAddress: '0x....', // offer base contract address - nft contract for offer
    quoteContractAddress: '0x....', // offer quote contract address - currency for offer - only GM supported for now
    tokenId: '', // offer NFT tokenId - token id for listing - leave empty for collection offer
    price: '1', // offer price - in biginteger format
    startDate, // offer start date - set to custom one or it will default to right now
    endDate: startDate + 604800, // offer end date - set to 0 for unexpiring - startDate + 604800 for one week
}
const offer = await gmSDK.placeOffer(offerDetails, {from: address})
console.info(`tx hash: ${offer}`)
```

### Accept offer (or collection offer) on NFT
```js
const offerDetails = { 
    auctionId: '', // on chain contract auction ID.
    quoteContractAddress: '0x....', // offer quote contract address - currency for offer - only GM supported for now
    tokenId: '', // offer NFT tokenId - token id for listing - pass tokenId for collection offer
    isCancellation: false, // is it an offer (true) or a cancellation (false).
}
const offer = await gmSDK.processOffer(offerDetails, {from: address})
console.info(`tx hash: ${offer}`)
```

### Cancel offer (or collection offer) on NFT
```js
const offerDetails = { 
    auctionId: '', // on chain contract auction ID.
    quoteContractAddress: '0x....', // offer quote contract address - currency for offer - only GM supported for now
    tokenId: '', // offer NFT tokenId - token id for listing - pass tokenId for collection offer
    isCancellation: true, // is it an offer (true) or a cancellation (false).
}
const offer = await gmSDK.processOffer(offerDetails, {from: address})
console.info(`tx hash: ${offer}`)
```
### Transfer NEP17
```js
const destination = 'N....'
const contract = '0x....'
const amount = ''
const transfer = await gmSDK.transferNEP17(destination, contract, amount, {from: address})
console.info(`tx hash: ${transfer}`)
```

### Transfer NEP11 NFT
```js
const transferDetails = [{ 
    destinationAddress: 'N....', // destination address
    contractAddress: '0x....', // contract address
    tokenId: '', // tokenId.
}]
const transfer = await gmSDK.transferNEP11(transferDetails, {from: address})
console.info(`tx hash: ${transfer}`)
```

### Burn NEP11 NFT
```js
const burnDetails = [{ 
    contractAddress: '0x....', // contract address
    tokenId: '', // tokenId.
}]
const burn = await gmSDK.burnNEP11(burnDetails, {from: address})
console.info(`tx hash: ${burn}`)
```

### Minting NEP11 GHOST NFT
```js
const royaltyRecipient = 'NLp9MRxBHH2YJrsF1D1VMXg3mvze3WSTqn'
const mintDetails = { 
    quantity: 1, // NFT quantity.
    name: 'test name', // NFT name.
    description: 'test description', // NFT description.
    imageURL: 'ipfs://xxx', // image URL.
    externalURI: 'ipfs://yyy', // external URI.
    royalties: [{address: royaltyRecipient, value: 100}], // royalties - use bps.
    type: '1', // NFT Type.
}
const token = await gmSDK.mintNEP11(mintDetails, {from: address})
console.info(`tx hash: ${token}`)
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