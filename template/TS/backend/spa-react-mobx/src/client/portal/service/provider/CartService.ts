import axios, { AxiosInstance } from 'axios'
import { AsyncReply } from '../../../shared/shared'
import { int64, int32, float64 } from '../../../shared/type'


export default class CartService {
    static readonly SERVICE_NAME = 'portal-provider/cart'

    constructor(private readonly http: AxiosInstance) {}

    /**
     * 添加到购物车
     */
    add(request: PurchaseProductGroup[]): AsyncReply<any> {
        return this.http
            .post(`/${CartService.SERVICE_NAME}/add`, request)
            .then(r => r.data)
    }

    /**
     * 查询用户购物车中商品的总数量
     */
    total(): AsyncReply<int64> {
        return this.http
            .get(`/${CartService.SERVICE_NAME}/total`)
            .then(r => r.data)
    }

    /**
     * 查询用户购物车中商品详情
     */
    all(): AsyncReply<PurchaseProductGroupDetail[]> {
        return this.http
            .get(`/${CartService.SERVICE_NAME}/all`)
            .then(r => r.data)
    }

    /**
     * 移除购物车中的商品
     */
    remove(request: int64[]): AsyncReply<any> {
        return this.http
            .post(`/${CartService.SERVICE_NAME}/remove`, request)
            .then(r => r.data)
    }
}

export interface PurchaseProductGroup {
    // 商品id
    productId: int64,
    // 商品item
    productItemPairs: PurchaseProductItemPair[]
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
    name: string,
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
    name: string,
    // 封面
    coverUrl: string,
    // 原价
    price: float64,
    // 采购价
    purchasePrice: float64,
    // 总金额
    totalAmount: float64,
    // 总优惠金额
    totalDiscountedAmount: float64
}