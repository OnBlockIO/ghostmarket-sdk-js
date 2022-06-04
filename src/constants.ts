/* eslint-disable prettier/prettier */
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const NULL_BLOCK_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const MAX_UINT_256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
export const GHOSTMARKET_TRADE_FEE_BPS = 200
export const MIN_BID_INCREASE_BPS = 500

export const ORDERBOOK_VERSION = 1
export const API_BASE_MAINNET = 'https://api.ghostmarket.io'
export const API_BASE_TESTNET = 'https://api-testnet.ghostmarket.io'
export const SITE_HOST_MAINNET = 'https://ghostmarket.io'
export const SITE_HOST_TESTNET = 'https://testnet.ghostmarket.io'
export const API_PATH = `/api/v${ORDERBOOK_VERSION}`
export const MAINNET_API_URL = `${API_BASE_MAINNET}/${API_PATH}`
export const TESTNET_API_URL = `${API_BASE_TESTNET}/${API_PATH}`

export const ETHEREUM_MAINNET_CONTRACTS = {
    PROXY_EXCHANGEV2: '0xfB2F452639cBB0850B46b20D24DE7b0a9cCb665f',
    PROXY_ROYALTIES: '0x3dA0bD10dfD98E96E04fbAa8e0512b2c413b096A',
    PROXY_NFT: '0x1bb6C21e6adB8757F46e77A7F4c5Ad9118f4A04d',
    PROXY_ERC20: '0x153909fB5232c72B5E613aae4898291b014785a1',
    PROXY_GM_TOKEN: '0x35609dC59E15d03c5c865507e1348FA5abB319A8',
    WRAPPED_TOKEN: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
}

export const ETHEREUM_TESTNET_CONTRACTS = {
    PROXY_EXCHANGEV2: '0x6c3E76022bEAAA29c12aca09823EDB6369F4bC6E',
    PROXY_ROYALTIES: '0xca1284B5EEb97c31cc693c4b182C8E1075Dc57f9',
    PROXY_NFT: '0x7aa199E2D5cFf1E6275A33c8dCE3c6085E393781',
    PROXY_ERC20: '0x34A40153C91a411b0a94eEa4506733e59d523495',
    PROXY_GM_TOKEN: '0x54cd0f7627597b8ea25dfc1dd0cc81f952c2d900',
    WRAPPED_TOKEN: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
}

export const AVALANCHE_MAINNET_CONTRACTS = {
    PROXY_EXCHANGEV2: '0xEb4ABA7aeba732Fc2FC92a673585d950cCFC1de0',
    PROXY_ROYALTIES: '0x913FbdC42a77edb0aEFFCEEAe00240C368d9B6b1',
    PROXY_NFT: '0x3d7e2A3ecb2AE2a516465c611DFf813d7B9297f8',
    PROXY_ERC20: '0x3417E77e81Cf31bb210c2364883EB83E5077f0Dd',
    PROXY_GM_TOKEN: '0x0B53b5dA7d0F275C31a6A182622bDF02474aF253',
    WRAPPED_TOKEN: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
}

export const AVALANCHE_TESTNET_CONTRACTS = {
    PROXY_EXCHANGEV2: '0x32fD06f88AFc3ce26bbD1cD9FA97dd27BD0826Cd',
    PROXY_ROYALTIES: '0x92bf637c4FadEC1b698002cbA1583850e6EC97d3',
    PROXY_NFT: '0x05Ebd261CBd932eaA8e7Dc6C858AF189c77BcdB8',
    PROXY_ERC20: '0xF23121871c3117FFAF860E97A854162900Bd4eaf',
    PROXY_GM_TOKEN: '0x7D35e9D90bD91BA82dAe43d7e03cF1e04c14aea8',
    WRAPPED_TOKEN: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
}

export const POLYGON_MAINNET_CONTRACTS = {
    PROXY_EXCHANGEV2: '0x3B48563237C32a1f886FD19DB6F5AFFD23855E2a',
    PROXY_ROYALTIES: '0x7eD7Bff3bEfa9cEDf6A6d4768F4051fEd7fC1975',
    PROXY_NFT: '0x26D583e2CDa958b13CC319FAd124aa729f8A196e',
    PROXY_ERC20: '0x44C5CE28c29934B71A2a0447745d551DfC7B5133',
    PROXY_GM_TOKEN: '0x6a335AC6A3cdf444967Fe03E7b6B273c86043990',
    WRAPPED_TOKEN: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
}

export const POLYGON_TESTNET_CONTRACTS = {
    PROXY_EXCHANGEV2: '0x5B2e6bEE51bC4Cc389503DD186bA66d98405320F',
    PROXY_ROYALTIES: '0x7E20461EcC3B27586EFEa0e3dB9E80bfbE55B9eB',
    PROXY_NFT: '0x42c81EF5CCd03242c642164037d588557563F085',
    PROXY_ERC20: '0xb24BB6B0d477eA8c0F1eEe4c00b1281B3eF25397',
    PROXY_GM_TOKEN: '0x957404188EA8804eFF6dc052e6B35c58aE351357',
    WRAPPED_TOKEN: '0x9c3c9283d3e44854697cd22d3faa240cfb032889',
}

export const BSC_MAINNET_CONTRACTS = {
    PROXY_EXCHANGEV2: '0x388171F81FC91EfC7338E07E52555a90c7D87972',
    PROXY_ROYALTIES: '0x1073e1d5977002d5db4F9E776482E8BF113C745c',
    PROXY_NFT: '0x7f61f22C7962F733853C8902Ccf55BC78F379431',
    PROXY_ERC20: '0x2617Ad006cC4D4ed52D3Ed688316feF5b4658845',
    PROXY_GM_TOKEN: '0x0B53b5dA7d0F275C31a6A182622bDF02474aF253',
    WRAPPED_TOKEN: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
}

export const BSC_TESTNET_CONTRACTS = {
    PROXY_EXCHANGEV2: '0x00FCf5E8FF15D8b4753c94DdE10fB5a244af74CC',
    PROXY_ROYALTIES: '0x5EC6bFE900C140323C66FC9Fc53619631B46Cb69',
    PROXY_NFT: '0x5267e6176b87526979CbE6449a30deD076CA7BA9',
    PROXY_ERC20: '0x8e590eBb2D67bf86b543F6d96Fc1a6A989793c39',
    PROXY_GM_TOKEN: '0x7D35e9D90bD91BA82dAe43d7e03cF1e04c14aea8',
    WRAPPED_TOKEN: '0x094616f0bdfb0b526bd735bf66eca0ad254ca81f',
}

export const N3_MAINNET_CONTRACTS = {
    EXCHANGE: '0xcc638d55d99fc81295daccbaf722b84f179fb9c4',
    GM_TOKEN: '0x9b049f1283515eef1d3f6ac610e1595ed25ca3e9'
}

export const N3_TESTNET_CONTRACTS = {
    EXCHANGE: '0xa4276772f429fc31032c4cd8bf3c98c806318f3e',
    GM_TOKEN: '0x0e07f8d653133c023b4168699f38182956c58968'
}

export const PHA_MAINNET_CONTRACTS = {
    EXCHANGE: '',
    GM_TOKEN: ''
}

export const PHA_TESTNET_CONTRACTS = {
    EXCHANGE: '',
    GM_TOKEN: ''
}
