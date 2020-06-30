import axios, { AxiosInstance } from 'axios'
import { AsyncReply } from '../../../shared/shared'
import { int64, int32, float64 } from '../../../shared/type'

export default class FavoriteService {
    static readonly SERVICE_NAME = 'favorite'

    constructor(private readonly http: AxiosInstance) {}

    /**
     * 收藏商品
     */
    add(productId: int64): AsyncReply<any> {
        return this.http
            .post(`/${FavoriteService.SERVICE_NAME}/add/${productId}`)
            .then(r => r.data)
    }

    /**
     * 取消收藏
     */
    cancel(productId: int64): AsyncReply<any> {
        return this.http
            .post(`/${FavoriteService.SERVICE_NAME}/cancel/${productId}`)
            .then(r => r.data)
    }


    /**
     * 查询用户收藏商品列表
     */
    search(request: FavoriteProductQuery): AsyncReply<FavoriteProductVO> {
        return this.http
            .get(`/${FavoriteService.SERVICE_NAME}/search`)
            .then(r => r.data)
    }
}

export interface FavoriteProductQuery {
    // 查询条件
    search?: String,
    // 页号
    pageNum?: int32,
    // 每页数量
    pageSize?: int32
}

export interface PurchaseProductItemPair {
    // 商品item id
    productItemId: int64,
    // 数量
    quantity: int32
}

export interface PurchaseProductGroupDetail {
    // 商品id
    productId: int64,
    // 商品名称
    name: String,
    // 商品item详情
    productItemDetails: PurchaseProductItemDetail[],
    // 商品item总数量
    totalQuantity: int32,
    // 总金额
    totalAmount: float64,
    // 总优惠金额
    totalDiscountedAmount: float64
}

export interface PurchaseProductItemDetail {
    // 商品item id
    productItemId: int64,
    // 数量
    quantity: int32
    // 商品item名称
    name: String,
    // 封面
    coverUrl: String,
    // 原价
    price: float64,
    // 采购价
    purchasePrice: float64,
    // 总金额
    totalAmount: float64,
    // 总优惠金额
    totalDiscountedAmount: float64
}

export interface FavoriteProductVO {
    list: {
        // 商品id
        productId: int64,
        // 商品名称
        name: String,
        // 封面
        coverUrl: String,
        // 价格
        price: String
    }[]
    total: int64,
    totalPage: int64,
    pageNum: int32,
    pageSize: int32
}