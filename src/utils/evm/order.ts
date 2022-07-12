/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
import { IEVMOrder } from '../../lib/api/ghostmarket/models/IEVMOrder'
import { IEVMAsset } from '../../lib/api/ghostmarket/models/IEVMAsset'
import { IEVMAssetType } from '../../lib/api/ghostmarket/models/IEVMAssetType'
import EIP712 from './EIP712'

import web3 from 'web3'
const Web3 = new web3()

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

export async function sign(order: IEVMOrder, account: string, verifyingContract: string) {
    const chainId = Number(await Web3.eth.getChainId())
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
    return (await EIP712.signTypedData(account, data)).sig
}
