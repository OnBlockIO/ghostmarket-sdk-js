/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
const ethUtil = require('ethereumjs-util')

// https://eips.ethereum.org/EIPS/eip-712
const EIP712 = require('./EIP712')

export function AssetType(assetClass: any, data: any) {
    return { assetClass, data }
}

export function Asset(assetClass: string, assetData: string, value: number) {
    return { assetType: AssetType(assetClass, assetData), value }
}

export function Order(
    maker: string,
    makeAsset: { assetType: { assetClass: any; data: any }; value: any },
    taker: string,
    takeAsset: { assetType: { assetClass: any; data: any }; value: any },
    salt: number,
    start: number,
    end: number,
    dataType: string,
    data: string,
) {
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

export async function sign(order: object, account: string, verifyingContract: string) {
    const chainId = Number(await ethUtil.eth.getChainId())
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
