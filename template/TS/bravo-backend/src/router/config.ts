import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Pages from './page';

export type RouteItem = {
  id: number;
  path: string;
  sort?: number;
  title?: string;
  name?: string;
  icon?: string;
  exact?: boolean;
  hideMenu?: boolean; //隐藏当前菜单
  hideSubMenu?: boolean; //隐藏下级菜单
  redirect?: boolean;
  component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  children: RouteItem[];
};

const config: RouteItem[] = [
  {
    id: 100,
    sort: 1,
    title: '首页',
    icon: 'home',
    name: 'home',
    path: '/',
    component: Pages.Home,
    // hideMenu: true,
    // hideSubMenu: true,
    children: [],
  },
  {
    id: 101,
    sort: 2,
    title: '审批中心',
    icon: 'approval',
    name: 'approval-center',
    path: '/approval',
    component: Pages.Approval,
    children: [
      {
        id: 101001,
        sort: 1,
        title: '入驻审批',
        name: 'dashboard',
        path: '/approval/settle',
        component: Pages.Approval,
        children: [],
      },
    ],
  },
  {
    id: 102,
    sort: 3,
    title: '商户管理',
    icon: 'merchant',
    name: 'business-management',
    path: '/business',
    component: Pages.ServiceList,
    children: [
      {
        id: 102001,
        sort: 1,
        title: '商户列表',
        name: 'business_list',
        path: '/business/provider',
        component: Pages.ServiceList,
        hideSubMenu: true,
        children: [
          {
            id: 102001001,
            sort: 1,
            title: '新增特殊价',
            name: 'price_add',
            path: '/business/provider/specialPrice/add/:uid',
            component: Pages.speicalPriceAdd,
            children: [],
          },
          {
            id: 102001002,
            sort: 2,
            title: '账户明细',
            name: 'account_detail',
            path: '/business/provider/account/:uid',
            component: Pages.AccountDetail,
            children: [],
          },
          {
            id: 102001003,
            sort: 3,
            title: '设置特殊价',
            name: 'price_setting',
            path: '/business/provider/specialPrice/:uid',
            component: Pages.specialPriceSetting,
            children: [],
          },
          {
            id: 102001004,
            sort: 4,
            title: '设置特殊价',
            name: 'price_add',
            path: '/business/provider/specialPrice',
            component: Pages.specialPriceSetting,
            children: [],
          },
        ],
      },
      {
        id: 102003,
        sort: 2,
        title: '商户角色',
        name: 'business_role',
        path: '/business/role',
        component: Pages.Channel,
        hideSubMenu: true,
        children: [
          {
            id: 102003001,
            sort: 1,
            title: '渠道价盘',
            name: 'channel_price',
            path: '/business/role/channelPrice/:roleId',
            component: Pages.ChannelPriceSet,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 103,
    sort: 4,
    title: '订单管理',
    icon: 'order',
    name: 'order-management',
    path: '/order',
    component: Pages.Order,
    // hideMenu: true,
    // hideSubMenu: true,
    children: [
      {
        id: 103001,
        sort: 1,
        title: '实物订单',
        name: 'dashboard',
        path: '/order/physical/list',
        component: Pages.Order,
        children: [],
      },
      {
        id: 103002,
        sort: 2,
        title: '订单详情',
        name: 'dashboard',
        path: '/order/physical/detail/:id',
        component: Pages.OrderDetails,
        hideMenu: true,
        children: [],
      },
    ],
  },
  {
    id: 104,
    sort: 5,
    title: '设置',
    icon: 'setting',
    name: 'setting',
    path: '/setting',
    component: Pages.AccountManage,
    children: [
      {
        id: 104001,
        sort: 1,
        title: '用户管理',
        name: 'dashboard',
        path: '/setting/account',
        component: Pages.AccountManage,
        children: [],
      },
      {
        id: 104002,
        sort: 2,
        title: '角色管理',
        name: 'dashboard',
        path: '/setting/role',
        component: Pages.RoleManage,
        children: [],
      },
      {
        id: 104003,
        sort: 3,
        title: '功能管理',
        name: 'dashboard',
        path: '/setting/feature',
        component: Pages.FeatureManage,
        children: [],
      },
    ],
  },
];

export default config;
