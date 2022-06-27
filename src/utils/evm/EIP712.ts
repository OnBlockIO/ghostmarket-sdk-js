/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
const ethUtil = require('ethereumjs-util')
const DOMAIN_TYPE = [
    {
        type: 'string',
        name: 'name',
    },
    {
        type: 'string',
        name: 'version',
    },
    {
        type: 'uint256',
        name: 'chainId',
    },
    {
        type: 'address',
        name: 'verifyingContract',
    },
]

export function createTypeData(domainData: any, primaryType: any, message: any, types: any) {
    return {
        types: Object.assign(
            {
                EIP712Domain: DOMAIN_TYPE,
            },
            types,
        ),
        domain: domainData,
        primaryType: primaryType,
        message: message,
    }
}

export function signTypedData(from: string, data: any) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        function cb(err: Error, result: any) {
            if (err) {
                return reject(err)
            }
            if (result.error) {
                return reject(result.error)
            }

            const sig = result.result
            const sig0 = sig.substring(2)
            const r = '0x' + sig0.substring(0, 64)
            const s = '0x' + sig0.substring(64, 128)
            const v = parseInt(sig0.substring(128, 130), 16)

            resolve({
                data,
                sig,
                v,
                r,
                s,
            })
        }
        if (ethUtil.currentProvider.isMetaMask) {
            ethUtil.currentProvider.sendAsync(
                {
                    jsonrpc: '2.0',
                    method: 'eth_signTypedData_v3',
                    params: [from, JSON.stringify(data)],
                    id: new Date().getTime(),
                },
                cb,
            )
        } else {
            let send = ethUtil.currentProvider.sendAsync
            if (!send) send = ethUtil.currentProvider.send
            send.bind(ethUtil.currentProvider)(
                {
                    jsonrpc: '2.0',
                    method: 'eth_signTypedData',
                    params: [from, data],
                    id: new Date().getTime(),
                },
                cb,
            )
        }
    })
}
