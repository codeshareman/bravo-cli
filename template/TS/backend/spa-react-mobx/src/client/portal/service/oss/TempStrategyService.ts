import {AxiosInstance} from "axios";
import {int32, int64} from "../../../shared/type";
import {AsyncReply, Page} from "../../../shared/shared";

export default class TempStrategyService {

    static readonly SERVICE_NAME = 'temp-strategy'

    constructor(private readonly http: AxiosInstance) {
    }

    /**
     * 查询特殊价格信息
     * @param input
     */
    queryProducts(input: ProductQueryRequest): AsyncReply<Page<TempProduct>> {
        return this.http.post(`/${TempStrategyService.SERVICE_NAME}/query`, input)
            .then(r => r.data)
    }

    /**
     * 设置特殊价格
     * @param input
     */
    createStrategy(input: StrategyCreateRequest): AsyncReply<int64> {
        return this.http.post(`/${TempStrategyService.SERVICE_NAME}/create`, input)
            .then(r => r.data)
    }

    /**
     * 取消特殊价格
     * @param input
     */
    cancel(input: int64): AsyncReply<void> {
        return this.http.post(`/${TempStrategyService.SERVICE_NAME}/cancel/${input}`)
            .then(r => r.data)

    }
}

export interface ProductQueryRequest {
    pageIndex: int32
    pageSize: int32
    productId?: int64
    userId: int64
    status: int32
}

export enum StrategyStatus {
    BEFORE_EFFECTIVE = 0, //"未生效"
    EFFECTIVE = 1,        //"已生效"
    EXPIRED = 2,          //"已失效"
    CANCELED = 3          // "已取消"
}

export interface TempProduct {
    strategyId: int64
    productId: int64
    productName: string
    coverPath: string
    price: string
    channelPrice: string
    tempPrice: string
    startTime: int64
    endTime: int64
    remark: string
    approvalId: string
    items: Array<TempProductItem>
}

export interface TempProductItem {
    strategyId: int64
    itemId: int64
    itemName: string
    coverPath: string
    price: string
    channelPrice: string
    tempPrice: string
}

export interface StrategyCreateRequest {
    productId: int64
    userId: int64
    remark: string
    startTime: int64
    endTime: int64
    approvalId: string
    items: Array<StrategyItemCreateRequest>

}

export interface StrategyItemCreateRequest {
    itemId: int64
    strategyPrice: string
}