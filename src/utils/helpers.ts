import { IAssetV2 } from '@onblockio/gm-api-js'
import { SITE_HOST_MAINNET, SITE_HOST_TESTNET } from '../core/constants'

export function getGhostMarketLink(asset: IAssetV2, isMainNet = true) {
    const chain = asset.contract.chain
    const contract = asset.contract.hash
    const tokenId = asset.nftId
    if (isMainNet) return `${SITE_HOST_MAINNET}/${chain}/${contract}/${tokenId}`
    return `${SITE_HOST_TESTNET}/${chain}/${contract}/${tokenId}`
}
