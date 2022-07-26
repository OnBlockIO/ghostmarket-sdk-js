# ghostmarket-sdk-js

[![https://badges.frapsoft.com/os/mit/mit.svg?v=102](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://opensource.org/licenses/MIT)

Ghostmarket SDK offers a complete set of functionalities enabling access to GhostMarket as a full-fledged SDK written in TypeScript/Javascript. 

Checkout the [Changelog](https://github.com/OnBlockIO/ghostmarket-sdk-js/blob/master/CHANGELOG.md)

Published on [GitHub](https://github.com/OnBlockIO/ghostmarket-sdk-js) and [npm](https://www.npmjs.com/package/ghostmarket-sdk-js)

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage - Common](#usage-common)
    - [Fetching assets](#fetching-assets)
    - [Fetching events](#fetching-events)
    - [Fetching collections](#fetching-collections)
    - [Fetching offers](#fetching-offers)
    - [Fetching orders](#fetching-orders)
    - [Fetching NFT balances](#fetching-nft-balances)
    - [Checking FT balances](#getting-ft-balances)
    - [Set contract royalties](#set-contract-royalties)
    - [Approve token](#approve-token)
    - [Checking token approval](#checking-token-approval)
    - [Claiming Incentives](#claiming-incentives)
    - [Checking Incentives](#checking-incentives)
    - [Signing Data](#signing-data)
- [Usage - EVM](#usage-evm)
    - [Buying NFT](#buying-nft)
    - [Accepting offer](#accepting-offer)
    - [Listing NFT fixed price](#listing-nft-fixed-price)
    - [Cancel one or more NFT](#cancel-one-or-more-nft)
    - [Edit listing price](#edit-listing-price)
    - [Getting contract approval](#getting-contract-approval)
    - [Wrap token](#wrap-token)
    - [Approve contract](#approve-contract)
    - [Checking native balance](#checking-native-balance)
    - [Transfer ERC20](#transfer-ERC20)
    - [Transfer ERC721 NFT](#transfer-ERC721-nft)
    - [Transfer ERC1155 NFT](#transfer-ERC1155-nft)
    - [Burn ERC721 NFT](#burn-erc721-nft)
    - [Burn ERC1155 NFT](#burn-erc1155-nft)
    - [Mint ERC721 NFT](#mint-erc721-nft)
    - [Mint ERC1155 NFT](#mint-erc1155-nft)
- [Usage - Neo N3](#usage-neo-n3)
    - [Buying one or more NFT](#buying-one-or-more-nft)
    - [Listing NFT fixed price](#listing-nft-fixed-price)
    - [Listing NFT auction](#listing-nft-auction)
    - [Bid NFT auction](#bid-nft-auction)
    - [Claim NFT auction](#claim-nft-auction)
    - [Cancel one or more NFT](#cancel-one-or-more-nft)
    - [Edit listing price](#edit-listing-price)
    - [Place offer](#place-offer)
    - [Accept offer](#accept-offer)
    - [Cancel offer](#cancel-offer)
    - [Transfer NEP17](#transfer-nep17)
    - [Transfer NEP11](#transfer-nep11)
    - [Burn NEP11](#burn-nep11)
    - [Mint NEP11](#mint-nep11)


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
import { GhostMarketSDK, GhostMarketN3SDK, ChainName, TESTNET_API_URL, MAINNET_API_URL } from 'ghostmarket-sdk-js';
// if using EVM private key or mnemonic hdwallet-provider is required
// import HDWalletProvider from '@truffle/hdwallet-provider'


// Variables
const apiKey = process.env.GM_API_KEY // GhostMarket API KEY if you have one
const privateKey = process.env.PRIVATE_KEY // private key to use - only for Neo N3 private provider or EVM
const mnemonic = process.env.MNEMONIC // mnemonic to use - only for EVM
const rpcUrl = process.env.RPC_URL // RPC to use, ex 'https://mainnet.infura.io'
const environment = MAINNET_API_URL // GhostMarket Infrastructure - MAIN_ENVIRONMENT or TEST_ENVIRONMENT
const chainName = ChainName.ETHEREUM // see below for chain values

/* chainName values : 
    ChainName.ETHEREUM / ChainName.ETHEREUM_TESTNET
    ChainName.POLYGON / ChainName.POLYGON_TESTNET
    ChainName.BSC / ChainName.BSC_TESTNET
    ChainName.AVALANCHE / ChainName.AVALANCHE_TESTNET
    ChainName.NEO3 / ChainName.NEO3_TESTNET
    */

// SDK config options.
const sdkConfig = {
    apiKey,
    rpcUrl, // only required for EVM, or to override default ones on Neo N3
    environment,
    chainName,
    privateKey // only required for Neo N3 private key provider
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
// Start and stop provider engine - when using HDWalletProvider
// customProvider.engine.start();
// customProvider.engine.stop();
//////// EVM provider options ////////


//////// Neo N3 provider options ////////
// Option 1 - Neoline
const customProvider = 'neoline'
// Option 2 - o3
const customProvider = 'o3'
// Option 3 - private key
const customProvider = 'private'
// Create instance of GhostMarketN3SDK - Neo N3
const gmSDK = new GhostMarketN3SDK(customProvider, sdkConfig);
// Connected address (neoline / o3)
const address = (await gmSDK.getProvider().getAccount()).address
//////// Neo N3 provider options ////////


// All set - use the object gmSDK to access GhostMarket SDK
```


## Usage - Common

### Fetching assets

```js
// Fetch 10 GhostMarket assets.
const { assets } = await gmSDK.api.getAssetsV2({ size: 10 })
console.info(assets)
```

### Fetching events

```js
// Fetch 10 GhostMarket events.
const { events } = await gmSDK.api.getEvents({ limit: 1 })
console.info(events)
```

### Fetching collections
```js
// Fetch 10 GhostMarket collections.
const { collections } = await gmSDK.api.getCollections({ limit: 1 })
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

### Fetching NFT balances
```js
const chain = '' // filter by chain
const contractAddress =  '' // filter for one contract
const owners = ['0x....'] // filter by one or more owner
const balance = await gmSDK.api.getAssetsV2({ chain, contractAddress, owners })
console.info(balance)
```

### Checking FT balances
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
const approval = await gmSDK.checkTokenApproval(contract, address)
console.info(`amount approved: ` + approval)
```

### Claiming incentives
```js
const claim = await gmSDK.claimIncentives({from: address})
console.info(`tx hash: ${claim}`)
```

### Checking incentives
```js
const incentives = await gmSDK.checkIncentives(address)
const availableIncentives = incentives ? incentives.availableIncentives : 0 // EVM
const availableIncentives = incentives[5] ? incentives[5].value : 0 // Neo N3
console.info(`available incentives: ${availableIncentives}`)
```

### Signing data
```js
const message = 'signing stuff'
const signed = await gmSDK.signData(message, address) // EVM
const signed = await gmSDK.signData(message) // N3
console.info(`signed data: ${signed}`)
```

## Usage - EVM

You can override automatic calculation of gas price if you add it to the last argument object on each transaction requiring signature.
Example when wrapping a token:

instead of `const wrap = await gmSDK.wrapToken(amount, isWrap, {from: address})` simply do `const wrap = await gmSDK.wrapToken(amount, isWrap, {from: address, gasPrice: 50000})` if you want to override gas price to `50000`.

### Buying NFT
```js
const orderDetails = [{ 
    baseContract: '', // order maker base contract address
    baseTokenId: '', // order maker NFT tokenId - set to the one to offer for a collection offer
    baseTokenAmount: 1, // order maker amount - only needed for ERC1155 otherwise default to 1
    quoteContract: '', // order maker quote contract address
    quotePrice: '', // order maker price - in biginteger format
    makerAddress: '', // order maker
    type: 1, // orer maker type 1 - listing, 2 - offer
    startDate, // order maker start date
    endDate, // order maker end date
    salt, // order maker salt
    signature, // order maker signature
}]
const buying = await gmSDK.matchOrders(orderDetails, {from: address})
console.info(buying)
```

### Accepting offer
```js
const orderDetails = [{ 
    baseContract: '', // order maker base contract address
    baseTokenId: '', // order maker NFT tokenId - set to the one to offer for a collection offer
    baseTokenAmount: 1, // order maker amount - only needed for ERC1155 otherwise default to 1
    quoteContract: '', // order maker quote contract address
    quotePrice: '', // order maker price - in biginteger format
    makerAddress: '', // order maker
    type: 2, // orer maker type 1 - listing, 2 - offer
    startDate, // order maker start date
    endDate, // order maker end date
    salt, // order maker salt
    signature, // order maker signature
}]
const buying = await gmSDK.matchOrders(orderDetails, {from: address})
console.info(buying)
```

### Listing NFT fixed price
```js
const startDate = parseInt(new Date().getTime() / 1000)
const orderDetails = [{ 
    baseContract: '', // order base contract address - nft contract for listing
    baseTokenId: '', // order NFT tokenId - token id for listing - set to empty for collection offer
    baseTokenAmount: 1, // order amount - only needed for ERC1155 otherwise default to 1
    quoteContract: '', // order quote contract address - currency accepted for listing
    quotePrice: '', // order price - in biginteger format
    makerAddress: '', // order maker
    type: 1, // 1 - listing, 2 - offer
    startDate, // order start date
    endDate: startDate + (3600 * 24) // order end date
}]
const listing = await gmSDK.createOrder(orderDetails)
console.info(listing)
```

### Cancel Listing NFT
```js
const orderDetails = [{ 
    baseContract: '', // order base contract address - nft contract for listing
    baseTokenId: '', // order NFT tokenId - token id for listing - set to empty for collection offer
    baseTokenAmount: 1, // order amount - only needed for ERC1155 otherwise default to 1
    quoteContract: '', // order quote contract address - currency accepted for listing
    quotePrice: '', // order price - in biginteger format
    makerAddress: '', // order maker
    type, // 1 - listing, 2 - offer
    startDate, // order start date
    endDate, // order end date
    salt // required for cancellation, use the salt from the order/offer
}]
const cancel = await gmSDK.bulkCancelOrders(orderDetails, {from: address})
console.info(`tx hash: ${cancel}`)
```

### Edit listing price
Note: edit listing price does not cancel current order, it just hides it on API and exposes the new one only, but the old one can still be matched later. Only a true cancellation will make it un matcheable.
```js
const orderDetails = [{ 
    baseContract: '', // order base contract address - nft contract for listing
    baseTokenId: '', // order NFT tokenId - token id for listing - set to empty for collection offer
    baseTokenAmount: 1, // order amount - only needed for ERC1155 otherwise default to 1
    quoteContract: '', // order quote contract address - currency accepted for listing
    quotePrice: '', // order new price - in biginteger format - has to be lower than current price
    makerAddress: '', // order maker
    type, // 1 - listing, 2 - offer
    startDate, // order start date
    endDate // order end date
    salt // required for edit, use the salt from the order/offer
}]
const edit = await gmSDK.createOrder(orderDetails)
console.info(edit)
```

### Getting contract approval
```js
const contract = '0x....'
const approval = await gmSDK.checkContractApproval(contract, address)
console.info(`is contract approved: ` + contractApproval)
```

### Wrap token
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

### Checking native balance
```js
const balance = await gmSDK.checkBalance(contract)
console.info(`balance: ` + balance)
```

### Transfer ERC20
```js
const destination = '0x....'
const contract = '0x....'
const amount = '1' // in wei
const transfer = await gmSDK.transferERC20(destination, contract, amount, {from: address})
console.info(`tx hash: ${transfer}`)
```

### Transfer ERC721
```js
const destination = '0x....'
const contract = '0x....'
const tokenId = ''
const transfer = await gmSDK.transferERC721(destination, contract, tokenId, {from: address})
console.info(`tx hash: ${transfer}`)
```

### Transfer ERC1155
```js
const destination = '0x....'
const contract = '0x....'
const tokenId = ''
const amount = 1
const transfer = await gmSDK.transferERC1155(destination, contract, [tokenId], [amount], {from: address})
console.info(`tx hash: ${transfer}`)
```

### Burn ERC721
```js
const contract = '0x....'
const tokenId = ''
const burn = await gmSDK.burnERC721(contract, tokenId, {from: address})
console.info(`tx hash: ${burn}`)
```

### Burn ERC1155
```js
const contract = '0x....'
const tokenId = ''
const amount = 1
const burn = await gmSDK.burnERC1155(contract, tokenId, amount, {from: address})
console.info(`tx hash: ${burn}`)
```

### Minting ERC721
```js
const royaltyRecipient = '0x....'
const mintDetails = {
    creatorAddress: address,
    royalties: [{address: royaltyRecipient, value: 1000}], // use bps
    externalURI: 'ipfs://xxx'
}
const token = await gmSDK.mintERC721(mintDetails, {from: address})
console.info(`tx hash: ${token}`)
```

### Minting ERC1155
```js
const royaltyRecipient = '0x...'
const mintDetails = {
    creatorAddress: address,
    royalties: [{address: royaltyRecipient, value: 1000}], // use bps
    externalURI: 'ipfs://xxx'
}
const amount = 1
const token = await gmSDK.mintERC1155(mintDetails, amount, {from: address})
console.info(`tx hash: ${token}`)
```

## Usage Neo N3

You can override automatic calculation of network fee and system fee if you add it to the last argument object on each transaction requiring signature.
Example when buying a NFT:

instead of `const buying = await gmSDK.buyMultiple(buyingDetails, {from: address})` simply do `const buying = await gmSDK.buyMultiple(buyingDetails, {from: address, systemFee: '0.2', networkFee: '0.2'})` if you want to override both with 0.2 GAS


### Buying one or more NFT
```js
const buyingDetails = [{ 
    contractAuctionId: '', // on chain contract auction ID.
    price: '', // order price - unused for cancellation
    quoteContract: '0x....', // order quote contract address.
    isCancellation: false, // is it a cancellation.
}]
const buying = await gmSDK.buyMultiple(buyingDetails, {from: address})
console.info(`tx hash: ${buying}`)
```

### Listing NFT fixed price
```js
const startDate = new Date().getTime()
const listingDetails = [{ 
    tokenId: '', // order NFT tokenId - token id for listing
    baseContract: '0x....', // order base contract address - nft contract for listing
    price: '1', // order price - in biginteger format
    quoteContract: '0x....', // order quote contract address - currency accepted for listing
    startDate, // order start date - set to custom one or it will default to right now
    endDate: 0, // order end date - set to custom one or it will default to unexpiring
}]
const listing = await gmSDK.sellMultiple(listingDetails, {from: address})
console.info(`tx hash: ${listing}`)
```

### Listing NFT auction
```js
const startDate = new Date().getTime()
const auctionDetails = { 
    auctionType: 1, // classic (1) reserve (2) dutch (3)
    tokenId: '', // auction NFT tokenId.
    baseContract: '0x....', // auction base contract address.
    extensionPeriod: 600, // auction extension period - 600 for 10 min
    startDate, // auction start date.
    endDate: startDate + 600000, // auction end date. - startDate + 600000 for ten minutes
    startPrice: '', // auction start price.
    endPrice: 0, // auction end price - only used for dutch auctions.
    quoteContract: '0x....', // auction quote contract address.
}
const auction = await gmSDK.listAuction(auctionDetails, {from: address})
console.info(`tx hash: ${auction}`)
```

### Bid NFT auction
```js
const auctionDetails = { 
    contractAuctionId: '', // on chain contract auction ID.
    bidPrice: '', // bid price
    quoteContract: '0x....', // auction quote contract address.
}
const auction = await gmSDK.bidAuction(auctionDetails, {from: address})
console.info(`tx hash: ${auction}`)
```

### Claim NFT auction
```js
const contractAuctionId = '' // on chain contract auction ID.
const auction = await gmSDK.claimAuction(contractAuctionId, {from: address})
console.info(`tx hash: ${auction}`)
```

### Cancel one or more NFT
```js
const buyingDetails = [{ 
    contractAuctionId: '', // on chain contract auction ID.
    quoteContract: '0x....', // order quote contract address.
    isCancellation: true, // is it a cancellation.
}]
const cancel = await gmSDK.buyMultiple(buyingDetails, {from: address})
console.info(`tx hash: ${cancel}`)
```

### Edit listing price
```js
const contractAuctionId = '' // on chain contract auction ID.
const price = '' // new price
const edit = await gmSDK.editPrice(contractAuctionId, price, {from: address})
console.info(`tx hash: ${edit}`)
```

### Place offer
```js
const startDate = new Date().getTime()
const offerDetails = [{ 
    baseContract: '0x....', // offer base contract address - nft contract for offer
    quoteContract: '0x....', // offer quote contract address - currency for offer - only GM supported for now
    tokenId: '', // offer NFT tokenId - token id for listing - leave empty for collection offer
    price: '1', // offer price - in biginteger format
    startDate, // offer start date - set to custom one or it will default to right now
    endDate: startDate + 604800, // offer end date - set to 0 for unexpiring - startDate + 604800 for one week
}]
const offer = await gmSDK.placeOffer(offerDetails, {from: address})
console.info(`tx hash: ${offer}`)
```

### Accept offer
```js
const offerDetails = { 
    auctionId: '', // on chain contract auction ID.
    quoteContract: '0x....', // offer quote contract address - currency for offer - only GM supported for now
    tokenId: '', // offer NFT tokenId - token id for listing - pass tokenId for collection offer
    isCancellation: false, // is it an offer (true) or a cancellation (false).
}
const offer = await gmSDK.processOffer(offerDetails, {from: address})
console.info(`tx hash: ${offer}`)
```

### Cancel offer
```js
const offerDetails = { 
    auctionId: '', // on chain contract auction ID.
    quoteContract: '0x....', // offer quote contract address - currency for offer - only GM supported for now
    tokenId: '', // offer NFT tokenId - token id for listing - pass tokenId for collection offer
    isCancellation: true, // is it an offer (true) or a cancellation (false).
}
const offer = await gmSDK.processOffer(offerDetails, {from: address})
console.info(`tx hash: ${offer}`)
```

### Transfer NEP17
```js
const destination = 'N....'
const quoteContract = '0x....'
const amount = ''
const transfer = await gmSDK.transferNEP17(destination, quoteContract, amount, {from: address})
console.info(`tx hash: ${transfer}`)
```

### Transfer NEP11
```js
const transferDetails = [{ 
    destination: 'N....', // destination address
    baseContract: '0x....', // contract address
    tokenId: '', // tokenId.
}]
const transfer = await gmSDK.transferNEP11(transferDetails, {from: address})
console.info(`tx hash: ${transfer}`)
```

### Burn NEP11
```js
const burnDetails = [{ 
    contractAddress: '0x....', // contract address
    tokenId: '', // tokenId.
}]
const burn = await gmSDK.burnNEP11(burnDetails, {from: address})
console.info(`tx hash: ${burn}`)
```

### Mint NEP11
```js
const royaltyRecipient = 'NLp9MRxBHH2YJrsF1D1VMXg3mvze3WSTqn'
const mintDetails = { 
    name: 'test name', // NFT name.
    description: 'test description', // NFT description.
    imageURL: 'ipfs://xxx', // image URL.
    royalties: [{address: royaltyRecipient, value: 100}], // royalties - use bps.
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