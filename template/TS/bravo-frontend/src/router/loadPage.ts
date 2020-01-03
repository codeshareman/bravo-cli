import React, { lazy } from "react";
import { BundleCompo } from "./utils";

// 页面
const Home = lazy(() => import('../pages/home'));
const Main = lazy(() => import('../pages/main'));
const Dashboard = lazy(() => import('../pages/dashboard'));
const PurchaseList = lazy(() => import('../pages/purchase/list'));
const PurchaseDetails = lazy(() => import('../pages/purchase/details'));
const PurchaseSettlement = lazy(() => import("../pages/purchase/settlement"));
const AccountCenter = lazy(() => import('../pages/account'));
const AccountInfo = lazy(() => import('../pages/account/info/info'));
const ShopCart = lazy(() => import('../pages/account/cart'));
const Settlement = lazy(() => import('../pages/account/settlement'));
const AccountProfile = lazy(() => import('../pages/account/profile'));
const OrderCenter = lazy(() => import('../pages/order'));
const OrderDetails = lazy(() => import('../pages/order/details'));

const Review = lazy(() => import('../pages/review'));
const Apply = lazy(() => import('../pages/apply'));
const PaymentConfirm = lazy(() => import('../pages/paymentConfirm'));

// 权益充值
const ChargeInfo = lazy(() => import('../pages/recharge/info'));
const ChargeRecord = lazy(() => import('../pages/recharge/record'));

const Pages = {
  Home: BundleCompo(Home),
  Main: BundleCompo(Main),
  Dashboard: BundleCompo(Dashboard),
  PurchaseList: BundleCompo(PurchaseList),
  PurchaseDetails: BundleCompo(PurchaseDetails),
  PurchaseSettlement: BundleCompo(PurchaseSettlement),
  AccountCenter: BundleCompo(AccountCenter),
  AccountInfo: BundleCompo(AccountInfo),
  AccountProfile: BundleCompo(AccountProfile),
  OrderCenter: BundleCompo(OrderCenter),
  OrderDetails: BundleCompo(OrderDetails),
  ShopCart: BundleCompo(ShopCart),
  Settlement: BundleCompo(Settlement),
  Review: BundleCompo(Review),
  Apply: BundleCompo(Apply),
  ChargeInfo: BundleCompo(ChargeInfo),
  ChargeRecord: BundleCompo(ChargeRecord),
  PaymentConfirm: BundleCompo(PaymentConfirm)
};

export default Pages;
