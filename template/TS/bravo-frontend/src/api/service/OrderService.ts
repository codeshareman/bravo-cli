import axios, { AxiosInstance } from "axios";
import { AsyncReply } from "../shared";
import { int64, int32, float64 } from "../type";
import { PurchaseList } from "./PurchaseService";

export default class OrderService {
  static readonly SERVICE_NAME = "portal-provider/order";

  constructor(private readonly http: AxiosInstance) {}

  /**
   * 获取订单列表
   */
  list(params: OrderQuery): AsyncReply<PurchaseOrder> {
    return this.http
      .post(`/${OrderService.SERVICE_NAME}/query`, params)
      .then(r => r.data);
  }

  /**
   * 获取订单详情
   */
  detail(orderNo: string): AsyncReply<PurchaseOrderDetail> {
    return this.http
      .get(`/${OrderService.SERVICE_NAME}/detail/${orderNo}`)
      .then(r => r.data);
  }
}

export interface OrderQuery {
  // 订单状态
  state: OrderState;
  // 创建时间-起
  startDate: int64;
  // 创建时间-止
  endDate: int64;
  // 订单编号
  orderNo: string;
  // 页号
  pageNum: int32;
  // 每页数量
  pageSize: int32;
}

export interface PurchaseOrder {
  list: OrderItem[];
  total: int64;
  totalPage: int64;
  pageNum: int32;
  pageSize: int32;
}

export type OrderItem = {
  id: int64;
  orderNo: string;
  createTime: string;
  productTypeCount: int32;
  totalQuantity: int32;
  totalAmount: string;
  state: OrderState;
  completedTime: string;
  companyName: string;
  agentDistrict: string;
};

export const enum OrderState {
  // 待发货
  WAIT_DELIVER = 1,
  // 待收货
  WAIT_RECEIVE = 2,
  // 已完成
  COMPLETE = 3
}

export interface PurchaseOrderDetail {
  id: int64;
  orderNo: string;
  createTime: string;
  productTypeCount: int32;
  totalQuantity: int32;
  totalAmount: string;
  state: OrderState;
  completedTime: string;
  companyName: string;
  agentDistrict: string;
  purchaseList: PurchaseList;
  contactName: string;
  phone: string;
  orderContactName: string;
  orderContactAddressLine: string;
  orderContactPhone: string;
  orderContactArea: string;
  orderContactCity: string;
  orderContactProvince: string;
  comment: string;
}
