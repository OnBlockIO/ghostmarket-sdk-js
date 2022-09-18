/* eslint-disable prettier/prettier */
export const GHOSTMARKET_TRADE_FEE_BPS = 200
export const MIN_BID_INCREASE_BPS = 500

export const ORDERBOOK_VERSION = 1
export const API_BASE_MAINNET = 'https://api.ghostmarket.io'
export const API_BASE_TESTNET = 'https://api-testnet.ghostmarket.io'
export const API_BASE_DEV = 'https://api-dev.ghostmarket.io'
export const SITE_HOST_MAINNET = 'https://ghostmarket.io'
export const SITE_HOST_TESTNET = 'https://testnet.ghostmarket.io'
export const API_PATH = `/api/v${ORDERBOOK_VERSION}`
export const MAINNET_API_URL = `${API_BASE_MAINNET}${API_PATH}`
export const TESTNET_API_URL = `${API_BASE_TESTNET}${API_PATH}`
export const DEV_API_URL = `${API_BASE_DEV}${API_PATH}`

export interface ContractAddresses {
    EXCHANGE: string
    INCENTIVES: string
    GM_TOKEN: string
    FLM_TOKEN?: string
    LP_TOKEN?: string
    LP_STAKING?: string
    DEX?: string
    ROYALTIES?: string
    PROXY_NFT?: string
    PROXY_ERC20?: string
    WRAPPED_TOKEN?: string
    GAS_TOKEN?: string
    GHOST_NEP11?: string
    GHOST_PEPE12?: string
    GHOST_ERC721?: string
    GHOST_ERC1155?: string
    CONTRACT_MANAGEMENT?: string
}

export const ETHEREUM_MAINNET_ADDRESSES: ContractAddresses = {
    EXCHANGE: '0xfB2F452639cBB0850B46b20D24DE7b0a9cCb665f',
    INCENTIVES: '0x3417E77e81Cf31bb210c2364883EB83E5077f0Dd',
    GM_TOKEN: '0x35609dC59E15d03c5c865507e1348FA5abB319A8',
    ROYALTIES: '0x3dA0bD10dfD98E96E04fbAa8e0512b2c413b096A',
    PROXY_NFT: '0x1bb6C21e6adB8757F46e77A7F4c5Ad9118f4A04d',
    PROXY_ERC20: '0x153909fB5232c72B5E613aae4898291b014785a1',
    WRAPPED_TOKEN: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    LP_TOKEN: '',
    LP_STAKING: '',
}

export const ETHEREUM_TESTNET_ADDRESSES: ContractAddresses = {
    EXCHANGE: '0x6c3E76022bEAAA29c12aca09823EDB6369F4bC6E',
    INCENTIVES: '0x8313F1124ca12962e450Ab7bDf04422676a897bc',
    GM_TOKEN: '0x54cd0f7627597b8ea25dfc1dd0cc81f952c2d900',
    ROYALTIES: '0xca1284B5EEb97c31cc693c4b182C8E1075Dc57f9',
    PROXY_NFT: '0x7aa199E2D5cFf1E6275A33c8dCE3c6085E393781',
    PROXY_ERC20: '0x34A40153C91a411b0a94eEa4506733e59d523495',
    WRAPPED_TOKEN: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    GHOST_ERC721: '0xd35b5d7e184013233cc43139dc7242223ec0a708',
    GHOST_ERC1155: '0x76ffb975ca6c3f0f9e036561824c542374885e95',
    LP_TOKEN: '',
    LP_STAKING: '',
}

export const AVALANCHE_MAINNET_ADDRESSES: ContractAddresses = {
    EXCHANGE: '0xEb4ABA7aeba732Fc2FC92a673585d950cCFC1de0',
    INCENTIVES: '0xb57201fa5c1E81bA8FcC8BeFB8C59c6cE96Adf1d',
    GM_TOKEN: '0x0B53b5dA7d0F275C31a6A182622bDF02474aF253',
    ROYALTIES: '0x913FbdC42a77edb0aEFFCEEAe00240C368d9B6b1',
    PROXY_NFT: '0x3d7e2A3ecb2AE2a516465c611DFf813d7B9297f8',
    PROXY_ERC20: '0x3417E77e81Cf31bb210c2364883EB83E5077f0Dd',
    WRAPPED_TOKEN: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    GHOST_ERC721: '0x068bEF92987D16eF682FF017B822CA1211401EaF',
    GHOST_ERC1155: '0xdcdaB251151c345AD527851ECa783521Ea3209E0',
    LP_TOKEN: '0xef61490aa6316d06d5375164f0db7d472cd0029f',
    LP_STAKING: '0xF3fd0F360aCE3B0e83843221a763FEC857291060',
}

export const AVALANCHE_TESTNET_ADDRESSES: ContractAddresses = {
    EXCHANGE: '0x32fD06f88AFc3ce26bbD1cD9FA97dd27BD0826Cd',
    INCENTIVES: '0xFD6e94f4E136E375ea48EcC06Baa476AB7545519',
    GM_TOKEN: '0x7D35e9D90bD91BA82dAe43d7e03cF1e04c14aea8',
    ROYALTIES: '0x92bf637c4FadEC1b698002cbA1583850e6EC97d3',
    PROXY_NFT: '0x05Ebd261CBd932eaA8e7Dc6C858AF189c77BcdB8',
    PROXY_ERC20: '0xF23121871c3117FFAF860E97A854162900Bd4eaf',
    WRAPPED_TOKEN: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
    GHOST_ERC721: '0x31681e95A89034612926908F48A5E1Aa734EBf05',
    GHOST_ERC1155: '0xE98E9D752d6104aDa0520988cd1834035762C8c7',
    LP_TOKEN: '',
    LP_STAKING: '',
}

export const POLYGON_MAINNET_ADDRESSES: ContractAddresses = {
    EXCHANGE: '0x3B48563237C32a1f886FD19DB6F5AFFD23855E2a',
    INCENTIVES: '0x8bd85e91b20308449e4115FAF544a4275B4b30F1',
    GM_TOKEN: '0x6a335AC6A3cdf444967Fe03E7b6B273c86043990',
    ROYALTIES: '0x7eD7Bff3bEfa9cEDf6A6d4768F4051fEd7fC1975',
    PROXY_NFT: '0x26D583e2CDa958b13CC319FAd124aa729f8A196e',
    PROXY_ERC20: '0x44C5CE28c29934B71A2a0447745d551DfC7B5133',
    WRAPPED_TOKEN: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    GHOST_ERC721: '0x068bef92987d16ef682ff017b822ca1211401eaf',
    GHOST_ERC1155: '0xf1c82f5ddb4f1a6a8f3eed2eb25fc39fc6d33fb3',
    LP_TOKEN: '0x66eae4669e5bc9a391d97d8aa2bffd7dffb2690e',
    LP_STAKING: '0x32fD06f88AFc3ce26bbD1cD9FA97dd27BD0826Cd',
}

export const POLYGON_TESTNET_ADDRESSES: ContractAddresses = {
    EXCHANGE: '0x5B2e6bEE51bC4Cc389503DD186bA66d98405320F',
    INCENTIVES: '0xFD6e94f4E136E375ea48EcC06Baa476AB7545519',
    GM_TOKEN: '0x957404188EA8804eFF6dc052e6B35c58aE351357',
    ROYALTIES: '0x7E20461EcC3B27586EFEa0e3dB9E80bfbE55B9eB',
    PROXY_NFT: '0x42c81EF5CCd03242c642164037d588557563F085',
    PROXY_ERC20: '0xb24BB6B0d477eA8c0F1eEe4c00b1281B3eF25397',
    WRAPPED_TOKEN: '0x9c3c9283d3e44854697cd22d3faa240cfb032889',
    GHOST_ERC721: '0x9b7e1a760751de8251e9f1ad09ed9039d4b7a676',
    GHOST_ERC1155: '0x7aa199E2D5cFf1E6275A33c8dCE3c6085E393781',
    LP_TOKEN: '',
    LP_STAKING: '',
}

export const BSC_MAINNET_ADDRESSES: ContractAddresses = {
    EXCHANGE: '0x388171F81FC91EfC7338E07E52555a90c7D87972',
    INCENTIVES: '0x48a01604B48730B9DeD362C000968D5361362d76',
    GM_TOKEN: '0x0B53b5dA7d0F275C31a6A182622bDF02474aF253',
    ROYALTIES: '0x1073e1d5977002d5db4F9E776482E8BF113C745c',
    PROXY_NFT: '0x7f61f22C7962F733853C8902Ccf55BC78F379431',
    PROXY_ERC20: '0x2617Ad006cC4D4ed52D3Ed688316feF5b4658845',
    WRAPPED_TOKEN: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    GHOST_ERC721: '0xF41db445D7eaF45536985cE185ce131FA4b42E68',
    GHOST_ERC1155: '0x44c5ce28c29934b71a2a0447745d551dfc7b5133',
    LP_TOKEN: '0x83895b0512c88f03c2513751475a3ea9cbec4fbe',
    LP_STAKING: '0x5992cD0fF3074A7849AA2f2799bD3ce1DD17e747',
}

export const BSC_TESTNET_ADDRESSES: ContractAddresses = {
    EXCHANGE: '0x00FCf5E8FF15D8b4753c94DdE10fB5a244af74CC',
    INCENTIVES: '0xFD6e94f4E136E375ea48EcC06Baa476AB7545519',
    GM_TOKEN: '0xf3fd0f360ace3b0e83843221a763fec857291060',
    ROYALTIES: '0x5EC6bFE900C140323C66FC9Fc53619631B46Cb69',
    PROXY_NFT: '0x5267e6176b87526979CbE6449a30deD076CA7BA9',
    PROXY_ERC20: '0x8e590eBb2D67bf86b543F6d96Fc1a6A989793c39',
    WRAPPED_TOKEN: '0x094616f0bdfb0b526bd735bf66eca0ad254ca81f',
    GHOST_ERC721: '0x92832367C614A9e36D4d6394f0DA44306DF2D4D7',
    GHOST_ERC1155: '0xf1daF0C96d13251dE0FdbB60acD2caD3C9CF15BB',
    LP_TOKEN: '0x179b6b41cd9ba207ccfd77fbb4c232dd4962a9eb',
    LP_STAKING: '0x9395c79A9074F8DB64A815bF19133E7959c3DAd6',
}

export const N3_MAINNET_ADDRESSES: ContractAddresses = {
    EXCHANGE: '0xcc638d55d99fc81295daccbaf722b84f179fb9c4',
    INCENTIVES: '0x77ea91034026654ba85ab0042dcc43b91ac6e442',
    GM_TOKEN: '0x9b049f1283515eef1d3f6ac610e1595ed25ca3e9',
    FLM_TOKEN: '0xf0151f528127558851b39c2cd8aa47da7418ab28',
    GHOST_NEP11: '0x577a51f7d39162c9de1db12a6b319c848e4c54e5',
    GAS_TOKEN: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
    CONTRACT_MANAGEMENT: '0xfffdc93764dbaddd97c48f252a53ea4643faa3fd',
    LP_TOKEN: '0xf23221a92c29beffbea6e46c681c8380d9794579',
    LP_STAKING: '0xd1a9f78e1940f6322fef4df2340a963a9ec46f63',
    DEX: '0xf970f4ccecd765b63732b821775dc38c25d74f23',
}

export const N3_TESTNET_ADDRESSES: ContractAddresses = {
    EXCHANGE: '0xb531a2ec582c2806023c63cba7c3e752a459afaa',
    INCENTIVES: '0x282b30f05be6c01b3bc65c0a91686ea8903db4e4',
    GM_TOKEN: '0xc13b05fc0e6fe3cc681e29a574557784b4f79aff',
    FLM_TOKEN: '0x1415ab3b409a95555b77bc4ab6a7d9d7be0eddbd',
    GHOST_NEP11: '0xc414275b3eca3969c4ca49f6a1fb67013fbe0544',
    GAS_TOKEN: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
    CONTRACT_MANAGEMENT: '0xfffdc93764dbaddd97c48f252a53ea4643faa3fd',
    LP_TOKEN: '',
    LP_STAKING: '',
    DEX: '0x6f0910fa26290f4a423930c8f833395790c71705',
}

export const PHA_MAINNET_CONTRACTS = {
    EXCHANGE: '',
    INCENTIVES: '',
    GM_TOKEN: '',
    GHOST_PEPE12: ''
}

export const PHA_TESTNET_CONTRACTS = {
    EXCHANGE: '',
    INCENTIVES: '',
    GM_TOKEN: '',
    GHOST_PEPE12: ''
}

export enum ChainId {
    avalanche = 43114,
    avalanchet = 43113,
    bsc = 56,
    bsct = 97,
    eth = 1,
    etht = 5,
    polygon = 137,
    polygont = 80001,
}

export enum ChainFullName {
    avalanche = 'Avalanche',
    avalanchet = 'Avalanche Testnet',
    bsc = 'BSC',
    bsct = 'BSC Testnet',
    eth = 'Ethereum',
    etht = 'Ethereum Testnet',
    polygon = 'Polygon',
    polygont = 'Polygon Testnet',
    n3 = 'Neo3',
    n3t = 'Neo3 Testnet',
    pha = 'Phantasma',
    phat = 'Phantasma Testnet',
}

export enum ChainCurrency {
    avalanche = 'AVAX',
    avalanchet = 'AVAX',
    bsc = 'BNB',
    bsct = 'BNB',
    eth = 'ETH',
    etht = 'ETH',
    polygon = 'MATIC',
    polygont = 'MATIC',
    n3 = 'GAS',
    n3t = 'GAS',
    pha = 'KCAL',
    phat = 'KCAL',
}

export enum Chain {
    AVALANCHE = 'avalanche',
    AVALANCHE_TESTNET = 'avalanchet',
    BSC = 'bsc',
    BSC_TESTNET = 'bsct',
    ETHEREUM = 'eth',
    ETHEREUM_TESTNET = 'etht',
    POLYGON = 'polygon',
    POLYGON_TESTNET = 'polygont',
    NEO3 = 'n3',
    NEO3_TESTNET = 'n3t',
    PHANTASMA = 'pha',
    PHANTASMA_TESTNET = 'phat',
}

export const AddressesByChain: { [name in Chain]: ContractAddresses } = {
    [Chain.AVALANCHE]: AVALANCHE_MAINNET_ADDRESSES,
    [Chain.AVALANCHE_TESTNET]: AVALANCHE_TESTNET_ADDRESSES,
    [Chain.BSC]: BSC_MAINNET_ADDRESSES,
    [Chain.BSC_TESTNET]: BSC_TESTNET_ADDRESSES,
    [Chain.ETHEREUM]: ETHEREUM_MAINNET_ADDRESSES,
    [Chain.ETHEREUM_TESTNET]: ETHEREUM_TESTNET_ADDRESSES,
    [Chain.POLYGON]: POLYGON_MAINNET_ADDRESSES,
    [Chain.POLYGON_TESTNET]: POLYGON_TESTNET_ADDRESSES,
    [Chain.NEO3]: N3_MAINNET_ADDRESSES,
    [Chain.NEO3_TESTNET]: N3_TESTNET_ADDRESSES,
    [Chain.PHANTASMA]: PHA_MAINNET_CONTRACTS,
    [Chain.PHANTASMA_TESTNET]: PHA_TESTNET_CONTRACTS,
}