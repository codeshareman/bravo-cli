import { RouteProps } from "react-router-dom";
import Pages from "./loadPage";

export type IRouteItem = {
  id: number;
  path: string;
  sort?: number;
  title?: string;
  name?: string;
  icon?: string;
  hideMenu?: boolean; //隐藏当前菜单
  hideSubMenu?: boolean; //隐藏下级菜单
  noAuth?: boolean; //不需要登录
  childRoute: IRouteItem[];
} & RouteProps;

const config: IRouteItem[] = [
  {
    id: 100,
    title: "首页",
    icon: "dashboard",
    name: "dashboard",
    path: "/dashboard",
    component: Pages.Dashboard,
    childRoute: []
  },
  {
    id: 101,
    title: "采购中心",
    name: "dashboard",
    path: "/purchase",
    hideSubMenu: true,
    component: Pages.PurchaseList,
    childRoute: [
      {
        id: 101001,
        title: "订单结算",
        name: "dashboard",
        path: "/purchase/settlement/order",
        component: Pages.PurchaseSettlement,
        childRoute: []
      },
      {
        id: 101002,
        title: "商品详情",
        name: "dashboard",
        path: "/purchase/details/:id",
        component: Pages.PurchaseDetails,
        childRoute: []
      }
    ]
  },
  {
    id: 102,
    title: "订单中心",
    icon: "form",
    name: "form",
    path: "/order",
    component: Pages.OrderCenter,
    hideSubMenu: true,
    childRoute: [
      {
        id: 102001,
        title: "订单详情",
        icon: "dashboard",
        name: "dashboard",
        path: "/order/details/:id",
        component: Pages.OrderDetails,
        childRoute: []
      },
      {
        id: 102002,
        title: "提交订单",
        icon: "dashboard",
        name: "dashboard",
        path: "/order/settlement",
        component: Pages.Settlement,
        hideMenu: true,
        childRoute: []
      },
      {
        id: 102003,
        title: "订单确认",
        icon: "dashboard",
        name: "dashboard",
        path: "/order/paymentConfirm",
        component: Pages.PaymentConfirm,
        hideMenu: true,
        childRoute: []
      }
    ]
  },
  {
    id: 103,
    title: "账户中心",
    icon: "form",
    name: "form",
    path: "/account",
    component: Pages.AccountProfile,
    // hideMenu: true,
    childRoute: [
      {
        id: 103001,
        title: "我的账户",
        icon: "dashboard",
        name: "dashboard",
        path: "/account/profile",
        component: Pages.AccountProfile,
        childRoute: []
      },
      {
        id: 103002,
        title: "我的信息",
        icon: "dashboard",
        name: "dashboard",
        path: "/account/info",
        component: Pages.AccountInfo,
        childRoute: []
      },
      {
        id: 103003,
        title: "我的购物车",
        icon: "dashboard",
        name: "dashboard",
        path: "/account/cart",
        component: Pages.ShopCart,
        hideMenu: true,
        childRoute: []
      }
    ]
  },
  {
    id: 104,
    title: "权益充值",
    icon: "form",
    name: "form",
    path: "/recharge",
    component: Pages.ChargeInfo,
    childRoute: [
      {
        id: 104001,
        title: "权益充值",
        icon: "dashboard",
        name: "dashboard",
        path: "/recharge/info",
        component: Pages.ChargeInfo,
        childRoute: []
      },
      {
        id: 104002,
        title: "充值记录",
        icon: "dashboard",
        name: "dashboard",
        path: "/recharge/record",
        component: Pages.ChargeRecord,
        childRoute: []
      }
    ]
  }
];

//不需要顶部菜单的路由
export const noMenuConfig: IRouteItem[] = [
  {
    id: 10,
    sort: 1,
    title: "对外展示页",
    icon: "dashboard",
    name: "home",
    noAuth: true,
    path: "/",
    component: Pages.Home,
    childRoute: []
  },
  {
    id: 11,
    sort: 1,
    title: "入口页",
    icon: "dashboard",
    name: "main",
    path: "/index",
    noAuth: true,
    component: Pages.Main,
    childRoute: []
  },
  {
    id: 100,
    sort: 1,
    title: "入驻申请页",
    icon: "dashboard",
    name: "apply",
    path: "/apply",
    noAuth: true,
    component: Pages.Apply,
    childRoute: []
  }
];

export default config;

export const enum PermsKey {
  INDEX = "index",
  RECHARGE = "recharge",
  PURCHASE = "purchase",
  ORDER = "order",
  ACCOUNT = "account"
}

//权限控制preset
export const permsConfig = {
  [PermsKey.INDEX]: ["/", "/index", "/apply", "/dashboard"],
  [PermsKey.RECHARGE]: ["/recharge", "/recharge/info", "/recharge/record"],
  [PermsKey.PURCHASE]: [
    "/purchase",
    "/purchase/settlement/order",
    "/purchase/details/:id",
    "/order",
    "/order/details/:id",
    "/order/settlement",
    "/account",
    "/account/profile",
    "/account/info",
    "/account/cart"
  ]
};
