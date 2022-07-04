import base58 from 'bs58'
import { BigNumber } from '@ethersproject/bignumber'

export function ab2hexstring(arr: any) {
    if (typeof arr !== 'object') {
        throw new TypeError(`ab2hexstring expects an array. Input was ${arr}`)
    }
    let result = ''
    const intArray = new Uint8Array(arr)
    for (const i of intArray) {
        let str = i.toString(16)
        str = str.length === 0 ? '00' : str.length === 1 ? '0' + str : str
        result += str
    }
    return result
}

export function reverseHex(hex: string) {
    let out = ''
    for (let i = hex.length - 2; i >= 0; i -= 2) {
        out += hex.substr(i, 2)
    }
    return out
}

export function getScriptHashFromAddress(address: string) {
    const hash = ab2hexstring(base58.decode(address))
    return reverseHex(hash.substr(2, 40))
}

export function numberToByteString(num: string) {
    const h = BigNumber.from(num).toHexString().substr(2)
    let hex = h.length % 2 ? '0' + h : h
    const fc = hex.charAt(0)

    if ((fc > '7' && fc <= '9') || (fc >= 'a' && fc <= 'f')) {
        hex = '00' + hex
    }

    return btoa(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        hex
            .match(/.{1,2}/g)!
            .reverse()
            .map((v: any) => String.fromCharCode(parseInt(v, 16)))
            .join(''),
    )
}
