import axios, { AxiosInstance } from 'axios'
import { AsyncReply } from '../../../shared/shared'
import { int64, int32, float64 } from '../../../shared/type'
import {
    PurchaseProductGroup,
    PurchaseProductGroupDetail,
} from '../provider/CartService'
import { PurchaseList } from '../provider/PurchaseService'

export default class OrderService {
    static readonly SERVICE_NAME = 'order'

    constructor(private readonly http: AxiosInstance) {}

    /**
     * 获取订单列表
     */
    list(params: OrderQuery): AsyncReply<PurchaseOrder> {
        return this.http
            .post(`/${OrderService.SERVICE_NAME}/query`, params)
            .then(r => r.data)
    }

    /**
     * 获取订单详情
     */
    purchaseList(id: string): AsyncReply<PurchaseOrderDetail> {
        return this.http
            .get(`/${OrderService.SERVICE_NAME}/detail/${id}`)
            .then(r => r.data)
    }

    /**
     * 导出订单
     */
    export(request: OrderQuery): AsyncReply<any> {
        return this.http
            .get(`/${OrderService.SERVICE_NAME}/export`, { params: request })
            .then(r => r.data)
    }
}

export interface OrderQuery {
    // 供应商id
    supplierIdList: int64[]
    // 代理地区
    agentDistrict: string
    // 公司名称
    companyName: string
    uid?: int64
    // 订单状态
    state: OrderState
    // 创建时间-起
    startDate: int64
    // 创建时间-止
    endDate: int64
    // 订单编号
    orderNo: string
    // 页号
    pageNum: int32
    // 每页数量
    pageSize: int32
}

export interface PurchaseOrder {
    list: {
        id: int64
        orderNo: string
        expressOrderNo: string
        expressName: string
        createTime: string
        productTypeCount: int32
        totalQuantity: int32
        totalAmount: string
        state: OrderState
        completedTime: string
        companyName: string
        agentDistrict: string
         // 供应商id
        supplierId: int64
    }[]
    total: int64
    totalPage: int64
    pageNum: int32
    pageSize: int32
}

export enum OrderState {
    // 待发货
    WAIT_DELIVER = 1,
    // 待收货
    WAIT_RECEIVE = 2,
    // 已完成
    COMPLETE = 3,
}

export interface PurchaseOrderDetail {
    id: int64
    orderNo: string
    expressOrderNo: string
    createTime: string
    productTypeCount: int32
    totalQuantity: int32
    totalAmount: string
    state: OrderState
    completedTime: string
    companyName: string
    agentDistrict: string
    purchaseList: PurchaseList
    contactName: string
    phone: string
    orderContactName: string
    orderContactAddressLine: string
    orderContactPhone: string
    comment: string
}
