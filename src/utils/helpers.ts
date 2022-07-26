import { IAsset } from '../lib/api/'
import { SITE_HOST_MAINNET, SITE_HOST_TESTNET } from '../core/constants'

export function getGhostMarketLink(asset: IAsset, isMainNet = true) {
    const chain = asset.nft.contract.chain
    const contract = asset.nft.contract.hash
    const tokenId = asset.nft.token_id
    if (isMainNet) return `${SITE_HOST_MAINNET}/${chain}/${contract}/${tokenId}`
    return `${SITE_HOST_TESTNET}/${chain}/${contract}/${tokenId}`
}
