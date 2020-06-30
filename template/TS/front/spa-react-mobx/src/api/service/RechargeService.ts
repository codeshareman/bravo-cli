import { AxiosInstance } from "axios";
import { AsyncReply } from "../shared";
import { int64, int32 } from "../type";

export default class RechargeService {
  static readonly SERVICE_NAME = "portal-provider";

  constructor(private readonly http: AxiosInstance) {}

  /**
   * 商户应用列表
   */
  APPList(): AsyncReply<APPList[]> {
    return this.http
      .get(`/${RechargeService.SERVICE_NAME}/account/getAllApp`)
      .then(r => r.data);
  }

  /**
   * 获取专辑信息
   */
  getAlbumInfo(itemId: string): AsyncReply<object[]> {
    return this.http
      .get(`/${RechargeService.SERVICE_NAME}/product/getItemByItemId/${itemId}`)
      .then(r => r.data);
  }

  /**
   * check充值信息
   * @param request
   */
  applyRecharge(request: ChargeInfo): AsyncReply<CheckRes> {
    return this.http
      .post(`/${RechargeService.SERVICE_NAME}/batchRecharge/apply`, request)
      .then(r => r.data);
  }

  /**
   * 确认充值
   */
  confirmRechage(taskId: string): AsyncReply<ChargeRes> {
    return this.http
      .get(`/${RechargeService.SERVICE_NAME}/batchRecharge/confirm/${taskId}`)
      .then(r => r.data);
  }

  /**
   * 充值记录
   */
  queryTaskList(request: QueryTaskParam): AsyncReply<TaskList> {
    return this.http
      .post(
        `/${RechargeService.SERVICE_NAME}/batchRecharge/queryTaskList`,
        request
      )
      .then(r => r.data);
  }
}

export interface APPList {
  appId: int32;
  appKey: string;
  appName: string;
  developerId: int64;
  promotionUid: int64;
}

export interface ChargeInfo {
  taskId?: string;
  itemType?: string;
  albumId?: string;
  vipType?: string;
  xiDianNum?: int32;
  clientOsType?: string;
  mobileList: string[];
  appKey: string;
}

export interface CheckRes {
  batchRechargeParam: ChargeInfo;
  discount: string;
  totalAmount: string;
  realityTotalAmount: string;
  availableAmount: string;
  enough: boolean;
}

export interface ChargeRes {
  appId: int32;
  appKey: string;
  appName: string;
  developerId: int64;
  promotionUid: int64;
}

export interface QueryTaskParam {
  taskId?: int64;
  taskState?: string;
  startTime?: int64;
  endTime?: int64;
  itemType?: string;
  itemId?: string;
  pageNum?: int32;
  pageSize?: int32;
}

export interface TaskList {
  list: TaskInfo[];
  pageNum: int32;
  pageSize: int32;
  total: int32;
  totalPage: int32;
}

interface TaskInfo{
  clientOsType: string;
  createTime: string;
  discount: string;
  item: string;
  itemType: string;
  price: string;
  taskId: int64;
  taskState: string;
}
