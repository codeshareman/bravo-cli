import {AxiosInstance} from "axios";
import {AsyncReply, Page} from "../../../shared/shared";
import {int32, int64} from "../../../shared/type";

export default class ChannelStrategyService {
    static readonly SERVICE_NAME = 'channel-strategy'

    constructor(private readonly http: AxiosInstance) {
    }

    /**
     * 获取全部角色列表
     */
    getAllCharacters(): AsyncReply<Array<Character>> {
        return this.http.get(`/${ChannelStrategyService.SERVICE_NAME}/character/all`)
            .then(r => r.data)
    }

    /**
     * 创建角色
     * @param input
     */
    createCharacter(input: CreateCharacterRequest): AsyncReply<int64> {
        return this.http.post(`/${ChannelStrategyService.SERVICE_NAME}/character/create`, input)
            .then(r => r.data)
    }

    /**
     * 条件查询商品信息，包括渠道价格信息
     * @param input
     */
    queryProducts(input: ProductQueryRequest): AsyncReply<Page<ChannelProduct>> {
        return this.http.post(`/${ChannelStrategyService.SERVICE_NAME}/product/page`, input)
            .then(r => r.data)
    }

    /**
     * 创建渠道价格
     * @param input
     */
    createChannelStrategies(input: SavePriceRequest): AsyncReply<void> {
        return this.http.post(`/${ChannelStrategyService.SERVICE_NAME}/strategies/create`, input)
            .then(r => r.data)
    }

}

export interface Character {
    id: int64
    name: string
    description: string
}

export interface CreateCharacterRequest {
    name: string
    description: string
}

export interface ProductQueryRequest {
    pageIndex: int32
    pageSize: int32
    characterId: int64
    productId?: int64
}

export interface ChannelProduct {
    productId: int64
    productName: string
    coverPath: string
    price: string
    channelPrice: string
    items: Array<ChannelProductItem>
}

export interface ChannelProductItem {
    itemId: int64
    itemName: string
    coverPath: string
    price: string
    channelPrice: string
}

export interface SavePriceRequest {
    productId: int64
    characterId: int64
    items: Array<SavePriceRequestItems>
}

export interface SavePriceRequestItems {
    itemId: int64
    channelPrice: string
}