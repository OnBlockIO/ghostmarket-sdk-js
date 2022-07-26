import { IContractDev } from './IContractDev'

export interface IDeveloperStatisticsTotal {
    nft_count: number
    burned_nft_count: number
    nft_without_metadata: number
    nft_without_extended: number
    nft_without_collection: number
    price_history_loaded_till: string
    collections_daily_stats_calculated_till: string
    contracts: IContractDev[]
}
