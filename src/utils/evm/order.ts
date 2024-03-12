import { ChainId } from '@onblockio/gm-api-js'
import { IEVMOrder, IEVMAsset, IEVMAssetType } from '../../core/models/evm'
import EIP712 from './EIP712'

import web3 from 'web3'
const Web3 = new web3()

export function enc(token: string, tokenId?: string): string {
    if (tokenId) {
        return Web3.eth.abi.encodeParameters(['address', 'uint256'], [token, tokenId])
    } else if (token === '0x') {
        return '0x'
    } else {
        return Web3.eth.abi.encodeParameter('address', token)
    }
}

export function AssetType(assetClass: string, data: string): IEVMAssetType {
    return { assetClass, data }
}

export function Asset(assetClass: string, assetData: string, value: string): IEVMAsset {
    return { assetType: AssetType(assetClass, assetData), value }
}

export function Order(
    maker: string,
    makeAsset: IEVMAsset,
    taker: string,
    takeAsset: IEVMAsset,
    salt: string,
    start: number,
    end: number,
    dataType: string,
    data: string,
): IEVMOrder {
    return { maker, makeAsset, taker, takeAsset, salt, start, end, dataType, data }
}

const Types = {
    AssetType: [
        { name: 'assetClass', type: 'bytes4' },
        { name: 'data', type: 'bytes' },
    ],
    Asset: [
        { name: 'assetType', type: 'AssetType' },
        { name: 'value', type: 'uint256' },
    ],
    Order: [
        { name: 'maker', type: 'address' },
        { name: 'makeAsset', type: 'Asset' },
        { name: 'taker', type: 'address' },
        { name: 'takeAsset', type: 'Asset' },
        { name: 'salt', type: 'uint256' },
        { name: 'start', type: 'uint256' },
        { name: 'end', type: 'uint256' },
        { name: 'dataType', type: 'bytes4' },
        { name: 'data', type: 'bytes' },
    ],
}

export async function sign(
    order: IEVMOrder,
    account: string,
    verifyingContract: string,
    provider: any,
    chainId: ChainId,
) {
    const data = EIP712.createTypeData(
        {
            name: 'GhostMarket',
            version: '2',
            chainId,
            verifyingContract,
        },
        'Order',
        order,
        Types,
    )
    return (await EIP712.signTypedData(account, data, provider)).sig
}
