/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
import { IEVMOrder } from '../../lib/api/ghostmarket/models/IEVMOrder'

import web3 from 'web3'
const Web3 = new web3()

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

export default {
    createTypeData(domainData: any, primaryType: string, message: IEVMOrder, types: any): any {
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
    },

    signTypedData(from: string, data: any): any {
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
            if (Web3.givenProvider.currentProvider.isMetaMask) {
                Web3.givenProvider.currentProvider.sendAsync(
                    {
                        jsonrpc: '2.0',
                        method: 'eth_signTypedData_v3',
                        params: [from, JSON.stringify(data)],
                        id: new Date().getTime(),
                    },
                    cb,
                )
            } else {
                let send = Web3.givenProvider.currentProvider.sendAsync
                if (!send) send = Web3.givenProvider.currentProvider.send
                send.bind(Web3.givenProvider.currentProvider)(
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
    },
}
