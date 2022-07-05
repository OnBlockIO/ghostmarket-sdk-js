import { CONST, rpc, sc, wallet, tx } from '@cityofzion/neon-core'

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
        this.rpcClient = new rpc.RPCClient(rpcUrl ?? 'http://neo3.edgeofneo.com:10332')
        this.isMainNet = isMainNet
    }

    private convertArgs(args?: Argument[]) {
        if (!args) return []
        return args.map(a => {
            if (a.type == 'Hash160') return sc.ContractParam.hash160(a.value)
            if (a.type == 'ByteArray') return sc.ContractParam.byteArray(a.value)
            if (a.type == 'Integer') return sc.ContractParam.integer(a.value)
            if (a.type == 'Array') return sc.ContractParam.array(a.value)
            return sc.ContractParam.any(a.value)
        })
    }

    async invoke(params: {
        scriptHash: string
        operation: string
        args?: Argument[]
        signers?: Signer[]
    }): Promise<string> {
        const scArgs = this.convertArgs(params.args)
        const script = sc.createScript({
            scriptHash: params.scriptHash,
            operation: params.operation,
            args: scArgs,
        })

        // Retrieve the current block height to calculate expiry
        const currentHeight = await this.rpcClient.getBlockCount()

        const txn = new tx.Transaction({
            systemFee: 0,
            signers: params.signers,
            validUntilBlock: currentHeight + 10000,
            script,
        })

        const signedTransaction = txn.sign(
            this.account,
            CONST.MAGIC_NUMBER[this.isMainNet ? 'MainNet' : 'TestNet'],
        )
        const result = await this.rpcClient.sendRawTransaction(signedTransaction.serialize(true))

        return result
    }

    async invokeMulti(params: { invocations: Invocation[]; signers?: Signer[] }): Promise<string> {
        const script = sc.createScript(
            ...params.invocations.map(i => {
                return {
                    scriptHash: i.scriptHash,
                    operation: i.operation,
                    args: this.convertArgs(i.args),
                }
            }),
        )

        // Retrieve the current block height to calculate expiry
        const currentHeight = await this.rpcClient.getBlockCount()

        const txn = new tx.Transaction({
            systemFee: 0,
            signers: params.signers,
            validUntilBlock: currentHeight + 10000,
            script,
        })

        const signedTransaction = txn.sign(
            this.account,
            CONST.MAGIC_NUMBER[this.isMainNet ? 'MainNet' : 'TestNet'],
        )
        const result = await this.rpcClient.sendRawTransaction(signedTransaction.serialize(true))

        return result
    }
}
