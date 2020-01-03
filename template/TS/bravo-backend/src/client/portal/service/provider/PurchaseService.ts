import axios, {AxiosInstance} from 'axios'
import {AsyncReply} from '../../../shared/shared'
import {int64, int32, float64} from '../../../shared/type'
import {PurchaseProductGroup, PurchaseProductGroupDetail} from '../provider/CartService'

export default class PurchaseService {
    static readonly SERVICE_NAME = 'purchase'

    constructor(private readonly http: AxiosInstance) {
    }

    /**
     * 获取采购单
     */
    purchaseList(request: PurchaseProductGroup[]): AsyncReply<PurchaseList> {
        return this.http
            .post(`/${PurchaseService.SERVICE_NAME}/purchaseList`, request)
            .then(r => r.data)
    }

    /**
     * 提交订单
     * @param request
     * @returns 上下文id
     */
    submit(request: PurchaseCreateDTO): AsyncReply<string> {
        return this.http
            .post(`/${PurchaseService.SERVICE_NAME}/submit`, request)
            .then(r => r.data)
    }

    /**
     * 获取确认支付参数
     * @param contextId
     */
    getConfirmParams(contextId: string): AsyncReply<ConfirmParams> {
        return this.http
            .post(`/${PurchaseService.SERVICE_NAME}/confirmParams`, contextId)
            .then(r => r.data)
    }

    /**
     * 确认订单
     * @param request
     * @returns 订单编号
     */
    confirm(request: PurchaseConfirmDTO): AsyncReply<string> {
        return this.http
            .post(`/${PurchaseService.SERVICE_NAME}/confirm`, request)
            .then(r => r.data)
    }

    /**
     * 根据contextId查询采购信息
     * @param request
     * @returns 订单编号
     */
    getPurchaseProducts(request: string): AsyncReply<PurchaseProductGroupDetail[]> {
        return this.http
            .get(`/${PurchaseService.SERVICE_NAME}/products`, {params: request})
            .then(r => r.data)
    }
}

export interface PurchaseList {
    // 采购商品列表
    purchaseList: PurchaseProductGroupDetail[]
    // 余额
    balance: string,
    // 商品种类
    productTypeCount: int32
    // 商品item总数量
    totalQuantity: int32
    // 总金额
    totalAmount: float64
    // 优惠总金额
    totalDiscountedAmount: float64
}

export interface PurchaseCreateDTO {
    // 下单方式
    purchaseMethod: PurchaseMethod
    // 收货地址
    contactId: int64
    // 备注
    comment: string,
    // 采购商品
    purchaseProductGroups: PurchaseProductGroup[]
}

export enum PurchaseMethod {
    // 直接购买
    DIRECT = 0,
    // 购物车下单
    FROM_CART = 1,
}

export interface PurchaseConfirmDTO {
    // 采购上下文id
    contextId: string,
    // 验证码
    verifyCode: string
}

export interface ConfirmParams {
    // 公司名称
    companyName: string,
    // 公司联系人
    contactName: string,
    // 现金账户可用余额
    balance: string,
    // 订单金额
    totalAmount: string,
    // 应付货款
    payAmount: string,
    // 联系人手机
    phone: string
}
