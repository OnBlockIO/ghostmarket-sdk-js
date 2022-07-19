import { CONST, u, rpc, sc, wallet, tx } from '@cityofzion/neon-core'

export interface Invocation {
    scriptHash: string
    operation: string
    args?: Argument[]
}

export interface Argument {
    type: string
    value: any
}

export interface Signer {
    account: string
    scopes: string
    allowedContracts?: string[]
    allowedGroups?: string[]
}

export class N3PrivateProvider {
    rpcClient: rpc.RPCClient
    account: wallet.Account
    isMainNet: boolean

    constructor(rpcUrl: string, pk: string, isMainNet: boolean) {
        this.account = new wallet.Account(pk)
        this.rpcClient = new rpc.RPCClient(
            rpcUrl
                ? rpcUrl
                : isMainNet
                ? 'https://mainnet1.neo.coz.io:443/'
                : 'https://testnet1.neo.coz.io:443/',
        )
        this.isMainNet = isMainNet ? isMainNet : false
    }

    private convertArgs(args?: Argument[]): any {
        if (!args) return []
        return args.map(a => {
            if (a.type == 'Hash160') return sc.ContractParam.hash160(a.value)
            if (a.type == 'ByteArray') return sc.ContractParam.byteArray(a.value)
            if (a.type == 'Integer') return sc.ContractParam.integer(a.value)
            if (a.type == 'Array')
                return sc.ContractParam.array(...(a.value as any[]).map(v => this.convertArgs(v)))
            return sc.ContractParam.any(a.value)
        })
    }

    async invoke(params: {
        scriptHash: string
        operation: string
        args?: Argument[]
        signers?: Signer[]
        networkFee?: string
        systemFee?: string
    }): Promise<any> {
        const scArgs = this.convertArgs(params.args)
        const script = sc.createScript({
            scriptHash: params.scriptHash,
            operation: params.operation,
            args: scArgs,
        })

        const inputs = {
            signers: params.signers,
            script: script,
            networkFee: params.networkFee ? parseFloat(params.networkFee) * Math.pow(10, 8) : 0,
            systemFee: params.networkFee ? parseFloat(params.networkFee) * Math.pow(10, 8) : 0,
        }

        return this.createTransaction(inputs)
    }

    async invokeMultiple(params: {
        invokeArgs: Invocation[]
        signers?: Signer[]
        networkFee?: string
        systemFee?: string
    }): Promise<any> {
        const script = sc.createScript(
            ...params.invokeArgs.map(i => {
                return {
                    scriptHash: i.scriptHash,
                    operation: i.operation,
                    args: this.convertArgs(i.args),
                }
            }),
        )

        const inputs = {
            signers: params.signers,
            script: script,
            networkFee: params.networkFee ? parseFloat(params.networkFee) * Math.pow(10, 8) : 0,
            systemFee: params.networkFee ? parseFloat(params.networkFee) * Math.pow(10, 8) : 0,
        }

        return this.createTransaction(inputs)
    }

    async invokeRead(params: {
        scriptHash: string
        operation: string
        args?: Argument[]
        signers?: Signer[]
    }): Promise<any> {
        const scArgs = this.convertArgs(params.args)
        const result = await this.rpcClient.invokeFunction(
            params.scriptHash,
            params.operation,
            scArgs,
            params.signers,
        )

        return result
    }

    async createTransaction(inputs: any): Promise<any> {
        // Retreive the current block height to calculate expiry
        const currentHeight = await this.rpcClient.getBlockCount()
        const txn = new tx.Transaction({
            signers: inputs.signers,
            validUntilBlock: currentHeight + 1000,
            script: inputs.script,
        })
        console.log('\u001b[32m  ✓ Transaction created \u001b[0m')

        // calculate network fee
        try {
            const feePerByteInvokeResponse = await this.rpcClient.invokeFunction(
                CONST.NATIVE_CONTRACT_HASH.PolicyContract,
                'getFeePerByte',
            )

            if (feePerByteInvokeResponse.state !== 'HALT') {
                if (inputs.networkFee === 0) {
                    throw new Error('Unable to retrieve data to calculate network fee.')
                } else {
                    console.log(
                        '\u001b[31m  ✗ Unable to get information to calculate network fee.  Using user provided value.\u001b[0m',
                    )
                    txn.networkFee = u.BigInteger.fromNumber(inputs.networkFee)
                }
            }
            const feePerByte = u.BigInteger.fromNumber(
                feePerByteInvokeResponse.stack[0].value as any,
            )
            // Account for witness size
            const transactionByteSize = txn.serialize().length / 2 + 109
            // Hardcoded. Running a witness is always the same cost for the basic account.
            const witnessProcessingFee = u.BigInteger.fromNumber(1000390)
            const networkFeeEstimate = feePerByte.mul(transactionByteSize).add(witnessProcessingFee)
            if (inputs.networkFee && inputs.networkFee >= networkFeeEstimate) {
                txn.networkFee = u.BigInteger.fromNumber(inputs.networkFee)
                console.log(
                    `  i Node indicates ${networkFeeEstimate.toDecimal(
                        8,
                    )} networkFee but using user provided value of ${
                        inputs.networkFee / Math.pow(10, 8)
                    }`,
                )
            } else {
                txn.networkFee = networkFeeEstimate
            }
        } catch (e) {
            console.log(e)
            throw new Error(`Network fee calculation error: ${e}`)
        }

        console.log(`\u001b[32m  ✓ Network Fee set: ${txn.networkFee.toDecimal(8)} \u001b[0m`)

        // calculate system fee
        try {
            const invokeFunctionResponse = await this.rpcClient.invokeScript(
                u.HexString.fromHex(txn.script),
                inputs.signers,
            )
            if (invokeFunctionResponse.state !== 'HALT') {
                throw new Error(`Transfer script errored out: ${invokeFunctionResponse.exception}`)
            }
            const requiredSystemFee = u.BigInteger.fromNumber(invokeFunctionResponse.gasconsumed)
            if (inputs.systemFee && inputs.systemFee >= requiredSystemFee) {
                txn.systemFee = u.BigInteger.fromNumber(inputs.systemFee)
                console.log(
                    `  i Node indicates ${requiredSystemFee.toDecimal(
                        8,
                    )} systemFee but using user provided value of ${
                        inputs.systemFee / Math.pow(10, 8)
                    }`,
                )
            } else {
                txn.systemFee = requiredSystemFee
            }
        } catch (e) {
            console.log(e)
            throw new Error(`System fee calculation error: ${e}`)
        }

        console.log(`\u001b[32m  ✓ System Fee set: ${txn.systemFee.toDecimal(8)}\u001b[0m`)

        // sign transaction
        const signedTransaction = txn.sign(
            this.account,
            CONST.MAGIC_NUMBER[this.isMainNet ? 'MainNet' : 'TestNet'],
        )

        // send transaction
        try {
            const result = await this.rpcClient.sendRawTransaction(
                u.HexString.fromHex(signedTransaction.serialize(true)),
            )

            const txhash = {
                txid: result,
            }
            return txhash
        } catch (e) {
            console.log(e)
            throw new Error(`Send transaction error: ${e}`)
        }
    }
}
