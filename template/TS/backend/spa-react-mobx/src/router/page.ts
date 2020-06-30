import { lazy } from 'react'
import { BundleCompo } from './utils'
// 首页
const Home = lazy(() => import('@/pages/home'))

// 审批中心
const Approval = lazy(() => import('@/pages/approval'))

// 商户管理
const ServiceList = lazy(() => import('@/pages/merchant/provider'))
const AccountDetail = lazy(() => import('@/pages/merchant/provider/account_detail'))
const specialPriceSetting = lazy(() => import('@/pages/merchant/provider/price_setting'))
const speicalPriceAdd = lazy(() => import('@/pages/merchant/provider/price_add'))
const Channel = lazy(() => import('@/pages/merchant/roles'))
const ChannelPriceSet = lazy(() => import('@/pages/merchant/roles/channel_price'))

// 订单管理
const Order = lazy(() => import('@/pages/order'))
const OrderDetail = lazy(() => import('@/pages/order/details'))

// 设置
const AccountManage = lazy(() => import('@/pages/setting/account'))
const AccountEdit = lazy(() => import('@/pages/setting/account/account_edit'))
const FeatureManage = lazy(() => import('@/pages/setting/feature'))
const RoleManage = lazy(() => import('@/pages/setting/role'))

// 奖励
const MerchantList = lazy(() => import('@/pages/award/merchantList'))
const AwardDetail = lazy(() => import('@/pages/award/awardDetail'))
const AddActivity = lazy(() => import('@/pages/award/addActivity'))
const ActivityList = lazy(() => import('@/pages/award/activityList'))

// 供应商管理
const SCMList = lazy(() => import('@/pages/scm/scmList'))
const SCMDetail = lazy(() => import('@/pages/scm/scmDetail'))

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
  AccountEdit: BundleCompo(AccountEdit),
  FeatureManage: BundleCompo(FeatureManage),
  RoleManage: BundleCompo(RoleManage),
  MerchantList: BundleCompo(MerchantList),
  AwardDetail: BundleCompo(AwardDetail),
  AddActivity: BundleCompo(AddActivity),
  ActivityList: BundleCompo(ActivityList),
  SCMList: BundleCompo(SCMList),
  SCMDetail: BundleCompo(SCMDetail),
}

export default Pages
