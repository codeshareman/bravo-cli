import React, { lazy } from 'react';
import { BundleCompo } from './utils';
// 首页
const Home = lazy(() => import('@/pages/home'));

// 审批中心
const Approval = lazy(() => import('@/pages/approval'));

// 商户管理
const ServiceList = lazy(() => import('@/pages/merchant/provider'));
const AccountDetail = lazy(() => import('@/pages/merchant/provider/account_detail'));
const specialPriceSetting = lazy(() => import('@/pages/merchant/provider/price_setting'));
const speicalPriceAdd = lazy(() => import('@/pages/merchant/provider/price_add'));
const Channel = lazy(() => import('@/pages/merchant/roles'));
const ChannelPriceSet = lazy(() => import('@/pages/merchant/roles/channel_price'));

// 订单管理
const Order = lazy(() => import('@/pages/order'));
const OrderDetail = lazy(() => import('@/pages/order/details'));

// 设置
const AccountManage = lazy(() => import('@/pages/setting/account'));
const FeatureManage = lazy(() => import('@/pages/setting/feature'));
const RoleManage = lazy(() => import('@/pages/setting/role'));

const Pages = {
  Home: BundleCompo(Home),
  Approval: BundleCompo(Approval),
  ServiceList: BundleCompo(ServiceList),
  AccountDetail: BundleCompo(AccountDetail),
  specialPriceSetting: BundleCompo(specialPriceSetting),
  speicalPriceAdd: BundleCompo(speicalPriceAdd),
  Channel: BundleCompo(Channel),
  ChannelPriceSet: BundleCompo(ChannelPriceSet),
  Order: BundleCompo(Order),
  OrderDetails: BundleCompo(OrderDetail),
  AccountManage: BundleCompo(AccountManage),
  FeatureManage: BundleCompo(FeatureManage),
  RoleManage: BundleCompo(RoleManage),
};

export default Pages;
