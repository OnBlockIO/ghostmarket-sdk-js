export interface IAddressIncentive {
    chainId: number
    chainName: string
    address: string
    intervalAddressVolume: number
    intervalAddressReward: number
    cumAddressVolume: number
    cumAddressReward: number
    committedReward: number
    rank: number
    username: string
    userTitle: string
    userAvatar: string
    userVerified: boolean
    isCurrentUser?: boolean
    lastUpdate: number
    wtFlagged: boolean
}

export interface IAddressIncentiveResults {
    result: IAddressIncentive[]
    totalCount: number
}
