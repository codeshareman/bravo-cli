export const BASE_PATH = "/app/entry/merchant";
import { AccountRole, TradeType } from "@/api/service/AccountService";
import {
  OrderItem,
  OrderState,
  PurchaseOrder
} from "@/api/service/OrderService";
export const FirstRouteIndex = 4;

export const EnvEnum = {
  DEV: "dev",
  TEST: "test",
  UAT: "uat",
  PROD: "prod"
};

export const HTTP_STATUS = {
  SUCCESSS: 0,
  NO_LOGIN: 1000 //未登录
};

//申请状态
export const enum ApplyStatus {
  APPLY, //正常申请
  RE_APPLY, //重新申请
  NON_DEVELOPER, //未注册成为开发者
  NON_CSP //已成为开发者账号，未入驻城市服务商
}

export const AccountRoleText = {
  [AccountRole.SERVICE_PROVIDER]: "服务商",
  [AccountRole.DEALER]: "经销商",
  [AccountRole.DIRECT_CUSTOMER]: "直客"
};

//选中状态
export const enum CheckedStatus {
  NON, //全部未选中
  All, //全部选中
  INDETERMINATE //部分选中
}

export const enum CartStatisticsType {
  All, //统计所有
  SELECTED //统计选中的数量
}

export const TradeTypeText = {
  [TradeType.WITHDRAW]: "提现",
  [TradeType.RECHARGE]: "充值",
  [TradeType.TRANSER_IN]: "转入",
  [TradeType.TRANSER_OUT]: "转出",
  [TradeType.DEDUCT]: "扣除",
  [TradeType.COMMISSION]: "佣金",
  [TradeType.WITHDRAW_FEE]: "免费撤销",
  [TradeType.UNKNOWN]: "未知"
};

//选中状态
export const OrderStateText = {
  [OrderState.WAIT_DELIVER]: "待发货",
  [OrderState.WAIT_RECEIVE]: "待收货",
  [OrderState.COMPLETE]: "已完成"
};
