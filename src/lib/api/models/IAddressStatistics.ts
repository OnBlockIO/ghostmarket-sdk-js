import { IUsersStatistics } from './IUsersStatistics'

export interface IAddressStatistics extends IUsersStatistics {
    address: string
    address_verified: boolean
    chain: string
    onchain_name: string
    offchain_name: string
    offchain_title: string
    avatar: string
}
