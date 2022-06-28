/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
import { IEVMOrder } from '../../lib/api/ghostmarket/models/IEVMOrder'
import { IEVMAsset } from '../../lib/api/ghostmarket/models/IEVMAsset'
import { IEVMAssetType } from '../../lib/api/ghostmarket/models/IEVMAssetType'

const ethUtil = require('ethereumjs-util')

const ASSET_TYPE_TYPEHASH = ethUtil.sha3('AssetType(bytes4 assetClass,bytes data)')

const ASSET_TYPEHASH = ethUtil.sha3(
    'Asset(AssetType assetType,uint256 value)AssetType(bytes4 assetClass,bytes data)',
)

const ORDER_TYPEHASH = ethUtil.sha3(
    'Order(address maker,Asset makeAsset,address taker,Asset takeAsset,uint256 salt,uint256 start,uint256 end,bytes4 dataType,bytes data)Asset(AssetType assetType,uint256 value)AssetType(bytes4 assetClass,bytes data)',
)

export function hashKey(order: IEVMOrder) {
    return ethUtil.soliditySha3(
        ethUtil.eth.abi.encodeParameters(
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

function bufferFromHex(hex: string) {
    return Buffer.from(hex.startsWith('0x') ? hex.substr(2) : hex, 'hex')
}

function hashAssetType(assetType: IEVMAssetType) {
    return ethUtil.utils.soliditySha3(
        ethUtil.eth.abi.encodeParameters(
            ['bytes32', 'bytes4', 'bytes32'],
            [
                ASSET_TYPE_TYPEHASH,
                assetType.assetClass,
                assetType.data == '0x'
                    ? Buffer.from(
                          'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
                          'hex',
                      )
                    : ethUtil.keccak256(bufferFromHex(assetType.data)),
            ],
        ),
    )
}

function hashAsset(asset: IEVMAsset) {
    return ethUtil.utils.soliditySha3(
        ethUtil.eth.abi.encodeParameters(
            ['bytes32', 'bytes32', 'uint'],
            [ASSET_TYPEHASH, hashAssetType(asset.assetType), asset.value],
        ),
    )
}

export function hashOrder(order: IEVMOrder) {
    return ethUtil.utils.soliditySha3(
        ethUtil.eth.abi.encodeParameters(
            [
                'bytes32',
                'address',
                'bytes32',
                'address',
                'bytes32',
                'uint',
                'uint',
                'uint',
                'bytes4',
                'bytes32',
            ],
            [
                ORDER_TYPEHASH,
                order.maker,
                hashAsset(order.makeAsset),
                order.taker,
                hashAsset(order.takeAsset),
                order.salt,
                order.start,
                order.end,
                order.dataType,
                ethUtil.keccak256(bufferFromHex(order.data)),
            ],
        ),
    )
}

export function encode(data: string) {
    const result = ethUtil.eth.abi.encodeParameter('tuple(address,uint256)[][]', data)
    // compared to solidity abi.encode function, web3.eth.abi.encodeParameter adds an additional
    // 0000000000000000000000000000000000000000000000000000000000000002
    // its removed before the result is returned
    return result.replace('0000000000000000000000000000000000000000000000000000000000000002', '')
}
