import { IEVMOrder, IEVMAssetType } from '../../core/models/evm'

import web3 from 'web3'
const Web3 = new web3()

const ASSET_TYPE_TYPEHASH = Web3.utils.sha3('AssetType(bytes4 assetClass,bytes data)')

export function hashKey(order: IEVMOrder) {
    return Web3.utils.soliditySha3(
        Web3.eth.abi.encodeParameters(
            ['address', 'bytes32', 'bytes32', 'uint'],
            [
                order.maker,
                hashAssetType(order.makeAsset.assetType),
                hashAssetType(order.takeAsset.assetType),
                order.salt,
            ],
        ),
    )
}

function hashAssetType(assetType: IEVMAssetType) {
    return Web3.utils.soliditySha3(
        Web3.eth.abi.encodeParameters(
            ['bytes32', 'bytes4', 'bytes32'],
            [
                ASSET_TYPE_TYPEHASH,
                assetType.assetClass,
                assetType.data == '0x'
                    ? Buffer.from(
                          'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
                          'hex',
                      )
                    : Web3.utils.soliditySha3(assetType.data),
            ],
        ),
    )
}
