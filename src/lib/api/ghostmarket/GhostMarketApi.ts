import axios from 'axios'
import {
    IAddressIncentive,
    IAddressIncentiveResults,
    ICollectionCategory,
    IMarketplaceStatistics,
    IOffer,
} from './models'
import {
    GetUsersRequest,
    IGetUsersResult,
    GetAssetsRequest,
    IGetAssetsResult,
    GetCollectionsRequest,
    IGetCollectionsResult,
    GetEventsRequest,
    IGetEventsResult,
    GetSeriesRequest,
    IGetSeriesResult,
    IGetStatisticsResult,
    GetAddressStatisticsRequest,
    IGetAddressStatisticsResult,
    PostCreateOrderRequest,
    IPostCreateOrderResult,
    PostDeleteOrderRequest,
    IPostDeleteOrderResult,
    GetOpenMintingsRequest,
    GetMetadataRequest,
    IGetRefreshMetadataResult,
    IGetDailyStatisticsResult,
    GetMarketplaceStatisticsRequest,
    GetMarketplaceDailyStatisticsRequest,
    GetChainStatisticsRequest,
    GetChainDailyStatisticsRequest,
    IGetOpenMintingsResult,
    GetCollectionDailyStatisticsRequest,
    GetUserExistsRequest,
    IGetUserExistsResult,
    GetCollectionAttributesRequest,
    IGetCollectionAttributesResult,
    GetCollectionAttributeKeysRequest,
    IGetCollectionAttributeKeysResult,
    GetCollectionStatisticsRequest,
    GetAddressReward,
    GetRewardsChain,
    IGetTokenURIResult,
    GetOpenOrdersRequest,
    IGetOpenOrdersResult,
} from './requests'
import {
    AssetsRequest,
    IAssetAttributesResult,
    IAssetOffersResult,
    IAssetOrdersResult,
    IAssetRoyaltiesResult,
    IAssetsResult,
} from './requestsV2'

export interface IGhostMarketApiOptions {
    baseUrl: string
    issuer?: string
    apiKey?: string
}

export class GhostMarketApi {
    public options: IGhostMarketApiOptions

    get baseUrl2() {
        return this.options.baseUrl.replace('api/v1', 'api/v2')
    }

    get isTestnet() {
        return [
            'https://api-testnet.ghostmarket.io/api/v1',
            'https://api-testnet.ghostmarket.io/api/v2',
        ].includes(this.options.baseUrl)
    }

    constructor(options: IGhostMarketApiOptions) {
        this.options = options
    }

    config(reqParams?: any, headers?: any, timeout: number | null = 15000) {
        const apiKey = this.options.apiKey
        const config = {
            ...(reqParams ? { params: reqParams } : {}),
            ...(timeout ? { timeout } : {}),
            headers: {
                ...(apiKey ? { 'X-API-KEY': apiKey } : {}),
                ...(headers || {}),
            },
        }
        return config
    }

    configPost() {
        return this.config(undefined, { 'Content-Type': 'application/json' })
    }

    async getUsers(request: GetUsersRequest): Promise<IGetUsersResult> {
        try {
            const url = this.options.baseUrl + '/users'
            const res = await axios.get(url, this.config(request))
            return res.data
        } catch (err: any) {
            console.log(err)
            throw new Error(err)
        }
    }

    async getAssetsV1(request: GetAssetsRequest): Promise<IGetAssetsResult> {
        const url = this.options.baseUrl + '/assets'
        // fix for backend not supporting collection_slug with series_id
        if (request.collection_slug && request.series_id) {
            request.contract = request.collection_slug
            delete request.collection_slug
        }
        if (this.options.issuer && !request.issuer) {
            request.issuer = this.options.issuer
        }
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    async getOpenMintings(request: GetOpenMintingsRequest): Promise<IGetOpenMintingsResult> {
        const url = this.options.baseUrl + '/getOpenMintings'
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    async getCollections(request: GetCollectionsRequest): Promise<IGetCollectionsResult> {
        const url = this.options.baseUrl + '/collections'
        if (this.options.issuer && !request.issuer) {
            request.issuer = this.options.issuer
        }
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    async getCollectionsAttributes(
        request: GetCollectionAttributesRequest,
    ): Promise<IGetCollectionAttributesResult> {
        const url = this.options.baseUrl + '/collectionAttributes'
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    async getCollectionCategories(): Promise<ICollectionCategory[]> {
        const url = this.options.baseUrl + '/collection/categories'
        const res = await axios.get(url, this.config())
        return res.data.categories ?? []
    }

    async getCollectionAttributeKeys(
        request: GetCollectionAttributeKeysRequest,
    ): Promise<IGetCollectionAttributeKeysResult> {
        const url = this.options.baseUrl + '/collection/attribute/keys'
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    async getEvents(request: GetEventsRequest): Promise<IGetEventsResult> {
        const url = this.options.baseUrl + '/events'
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    async getSeries(request: GetSeriesRequest): Promise<IGetSeriesResult> {
        const url = this.options.baseUrl + '/series'
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    async getAddressStatistic(
        request: GetAddressStatisticsRequest,
    ): Promise<IGetAddressStatisticsResult> {
        const url = this.options.baseUrl + '/addressStatistics'
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    /** get collection w/m/t statistics */
    async getCollectionStatistic(
        request: GetCollectionStatisticsRequest,
    ): Promise<IGetStatisticsResult> {
        const url = this.options.baseUrl + '/collectionStatistics'
        if (this.options.issuer && !request.issuer) {
            request.issuer = this.options.issuer
        }
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    /** get collection daily statistics */
    async getCollectionDailyStatistic(
        request: GetCollectionDailyStatisticsRequest,
    ): Promise<IGetDailyStatisticsResult> {
        const url = this.options.baseUrl + '/collectionDailyStatistics'
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    /** get marketplace w/m/t statistics */
    async getMarketplaceStatistic(
        request: GetMarketplaceStatisticsRequest,
    ): Promise<IMarketplaceStatistics> {
        const url = this.options.baseUrl + '/marketplaceStatistics'
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    /** get marketplace daily statistics */
    async getMarketplaceDailyStatistic(
        request: GetMarketplaceDailyStatisticsRequest,
    ): Promise<IGetDailyStatisticsResult> {
        const url = this.options.baseUrl + '/marketplaceDailyStatistics'
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    /** get chain w/m/t statistics */
    async getChainStatistic(request: GetChainStatisticsRequest): Promise<IGetStatisticsResult> {
        const url = this.options.baseUrl + '/chainStatistics'
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    /** get chain daily statistics */
    async getChainDailyStatistic(
        request: GetChainDailyStatisticsRequest,
    ): Promise<IGetDailyStatisticsResult> {
        const url = this.options.baseUrl + '/chainDailyStatistics'
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    /** get address reward */
    async getAddressReward(request: GetAddressReward): Promise<IAddressIncentive> {
        // TODO: change to commented url when endpoints will be deployed
        const url = 'https://api-incentives.ghostmarket.io/statistics/get_address_reward'
        // const url = this.options.baseUrl + '/get_rewards_chain'
        const res = await axios.post(url, {}, this.config(request))
        return res.data
    }

    /** get chain rewards */
    async getRewardsChain(request: GetRewardsChain): Promise<IAddressIncentiveResults> {
        // TODO: change to commented url when endpoints will be deployed
        const url = 'https://api-incentives.ghostmarket.io/statistics/get_rewards_chain'
        // const url = this.options.baseUrl + '/get_rewards_chain'
        const res = await axios.post(url, {}, this.config(request))
        return res.data
    }

    async buyOpenMint(hash: string, id: string, address: string) {
        const data = {
            txHash: hash,
            openMintId: id,
            sender: address,
        }
        const url = this.options.baseUrl + '/buyOpenMint'
        const res = await axios.post(url, data, this.config())
        return res.data
    }

    async postCreateOrder(request: PostCreateOrderRequest): Promise<IPostCreateOrderResult> {
        const url = this.options.baseUrl + '/createOpenOrder'
        const res = await axios.post<IPostCreateOrderResult>(url, request, this.configPost())
        if (res.data.error) {
            throw new Error(res.data.error)
        }
        return res.data
    }

    async postDeleteOrder(request: PostDeleteOrderRequest): Promise<IPostDeleteOrderResult> {
        const url = this.options.baseUrl + '/deleteOpenOrder'
        const res = await axios.post<IPostDeleteOrderResult>(url, request, this.configPost())
        if (res.data.error) {
            throw new Error(res.data.error)
        }
        return res.data
    }

    async getMetadata(request: GetMetadataRequest): Promise<string> {
        const url = this.options.baseUrl + '/metadata'
        const res = await axios.get(url, this.config(request))
        if (res.data.error) {
            throw new Error(res.data.error)
        }
        return res.data
    }

    async getRefreshMetadata(request: GetMetadataRequest): Promise<IGetRefreshMetadataResult> {
        const url = this.options.baseUrl + '/refreshMetadata'
        const res = await axios.get(url, this.config(request))
        if (res.data.error) {
            throw new Error(res.data.error)
        }
        return res.data
    }

    async getTokenURI(request: GetMetadataRequest): Promise<IGetTokenURIResult> {
        const url = this.options.baseUrl + '/tokenuri'
        const res = await axios.get(url, this.config(request))
        if (res.data.error) {
            throw new Error(res.data.error)
        }
        return res.data
    }

    async getUserExists(request: GetUserExistsRequest): Promise<IGetUserExistsResult> {
        const url = this.options.baseUrl + '/userExists'
        const res = await axios.get(url, this.config(request))
        if (res.data.error) {
            throw new Error(res.data.error)
        }
        return res.data
    }

    async getOpenOrders(request: GetOpenOrdersRequest): Promise<IGetOpenOrdersResult> {
        const url = this.options.baseUrl + '/openorders'
        const res = await axios.get(url, this.config(request))
        if (res.data.error) {
            throw new Error(res.data.error)
        }
        return res.data
    }

    // v2 api
    async getAssetAttributesV2(request: {
        page?: number
        size?: number
        chain: string
        contract: string
        tokenId: string
    }): Promise<IAssetAttributesResult> {
        const url = this.baseUrl2 + '/asset/attributes'
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    async getAssetAttributesByIdV2(
        id: number,
        request: { page?: number; size?: number },
    ): Promise<IAssetAttributesResult> {
        const url = this.baseUrl2 + `/asset/${id}/attributes`
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    async getAssetOffersV2(request: {
        page?: number
        size?: number
        chain: string
        contract: string
        tokenId: string
    }): Promise<IAssetOffersResult> {
        const url = this.baseUrl2 + '/asset/offers'
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    async getAssetOffersByIdV2(
        id: number,
        request: { page?: number; size?: number; getTotal?: boolean },
    ): Promise<IAssetOffersResult> {
        const url = this.baseUrl2 + `/asset/${id}/offers`
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    async getContractOffersByIdV2(
        id: number,
        request: { page?: number; size?: number; getTotal?: boolean },
    ): Promise<IAssetOffersResult> {
        const url = this.baseUrl2 + `/contract/${id}/offers`
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    async getContractOffersV2(
        request: {
            chain: string
            contract: string
            page?: number
            size?: number
            getTotal?: boolean
        },
        v1Compat = true,
    ): Promise<IAssetOffersResult> {
        const url = this.baseUrl2 + '/contract/offers'
        const res = await axios.get(url, this.config(request))

        if (v1Compat) {
            if (res.data.offers) {
                res.data.offers = (res.data as IAssetOffersResult).offers.map(o => {
                    const off: IOffer = {
                        base_contract: o.baseContract,
                        end_date: o.endDate,
                        fiat_currency: o.fiatCurrency,
                        fiat_price: o.fiatPrice,
                        maker: o.maker,
                        origin_fees: o.originFees,
                        price: o.price,
                        quote_contract: o.quoteContract,
                        order_data: o.orderData,
                        start_date: o.startDate,
                        token_amount: o.tokenAmount,
                        type: o.type,
                        is_collection_offer: true,
                    }
                    return off
                })
            }
        }
        return res.data
    }

    async getAssetOrdersV2(request: {
        page?: number
        size?: number
        chain: string
        contract: string
        tokenId: string
        getTotal?: boolean
    }): Promise<IAssetOrdersResult> {
        const url = this.baseUrl2 + '/asset/orders'
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    async getAssetOrdersByIdV2(
        id: number,
        request: { page?: number; size?: number; makers?: string[]; getTotal?: boolean },
    ): Promise<IAssetOrdersResult> {
        const url = this.baseUrl2 + `/asset/${id}/orders`
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    async getAssetRoyaltiesByIdV2(id: number): Promise<IAssetRoyaltiesResult> {
        const url = this.baseUrl2 + `/asset/${id}/royalties`
        const res = await axios.get(url, this.config())
        return res.data
    }

    async getAssetsV2(request: AssetsRequest): Promise<IAssetsResult> {
        const url = this.baseUrl2 + '/assets'
        if (this.options.issuer && !request.issuer) {
            request.issuer = this.options.issuer
        }
        const res = await axios.get(url, this.config(request))
        return res.data
    }

    async getAssetsAdapterV2(req: GetAssetsRequest): Promise<IAssetsResult> {
        const url = this.baseUrl2 + '/assets'

        // console.log('req', req)

        const attributeNameIds = []
        const attributeValueIds = []

        const reqa = req as any
        for (let i = 0; i < 15; ++i) {
            const attrN = `attribute${i}_name_id`
            const attrV = `attribute${i}_value_id`
            if (reqa[attrN] && reqa[attrV]) {
                attributeNameIds.push(reqa[attrN])
                attributeValueIds.push(reqa[attrV])
            }
        }

        const request: AssetsRequest = new AssetsRequest({
            page: req.offset && req.limit ? 1 + Math.round(req.offset / req.limit) : 1,
            size: req.limit,
            chain: req.chain,
            contract: req.contract,
            collection: req.collection_slug,
            symbols: req.symbol,
            tokenIds: req.token_id,
            issuer: req.issuer,
            creators: req.creator,
            name: req.name,
            owners: req.owner,
            priceSimilar: req.price_similar,
            priceSimilarDelta: req.price_similar_delta,
            priceFrom: req.price_from,
            priceTill: req.price_till,
            priceSymbol: req.price_symbol,
            onlyVerified: req.only_verified == 1,
            quoteSymbols: req.quote_symbol,
            showBurned: req.burned_mode == 'burned' ? '' : req.burned_mode == 'all',
            showInfused: req.status == 'all' ? '' : req.status == 'infused',
            showBlacklisted:
                req.blacklisted_mode == 'blacklisted' ? '' : req.blacklisted_mode == 'all',
            showNsfw: req.nsfw_mode == 'all' ? '' : !(req.nsfw_mode == 'only_safe'),
            seriesOnchainId: req.series_id,

            attributeNameIds: attributeNameIds.length == 0 ? undefined : attributeNameIds,
            attributeValueIds: attributeValueIds.length == 0 ? undefined : attributeValueIds,

            listingStarted: req.listing_started,
            listingTypes: req.listing_types,
            listingState: req.listing_state,

            orderBy: req.order_by as any, // to check
            orderDirection: req.order_direction as any,
            fiatCurrency: req.fiat_currency,
            grouping: req.grouping == 1,
            getTotal: req.get_total == 1,
            bidders: req.bidder,
        })

        if (this.options.issuer && !request.issuer) {
            request.issuer = this.options.issuer
        }
        const res = await axios.get(url, this.config(request, undefined, 2 * 15000))
        return res.data
    }
}
