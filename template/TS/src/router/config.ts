/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-31 17:50:12
 * @LastEditTime: 2019-08-26 09:55:44
 * @LastEditors: Please set LastEditors
 */
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Pages from "./lazyPage";

export type RouteItem = {
  id: number;
  path: string;
  sort?: number;
  title?: string;
  name?: string;
  icon?: string;
  exact?: boolean;
  hideMenu?: boolean;
  component?:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
  children: RouteItem[];
};

const config: RouteItem[] = [
  {
    id: 118,
    title: "数据中心",
    name: "data-center",
    icon: "dashboard",
    path: "/",
    component: Pages.Sell,
    children: [
      {
        id: 100,
        title: "收益中心",
        icon: "dashboard",
        path: "/income",
        component: Pages.Sell,
        children: [
          {
            id: 100100,
            title: "销售收益",
            icon: "dashboard",
            path: "/income/sell",
            component: Pages.Sell,
            children: [
              {
                id: 100100,
                title: "销售收益详情",
                icon: "dashboard",
                hideMenu: true,
                path: "/income/sell/:id",
                component: Pages.SellDetails,
                children: []
              }
            ]
          },
          {
            id: 100100,
            title: "锁订单收益",
            icon: "dashboard",
            path: "/income/lock",
            component: Pages.Lock,
            children: []
          },
          {
            id: 100100,
            title: "大数据看版",
            icon: "dashboard",
            path: "/income/databoard",
            hideMenu: true,
            component: Pages.DataBoard,
            children: []
          },
          {
            id: 100100,
            title: "大屏数据配置",
            icon: "dashboard",
            path: "/income/dataset",
            component: Pages.DataBoardSeting,
            children: []
          },
          {
            id: 100100,
            title: "大数据中心",
            icon: "dashboard",
            path: "/income/viewboard",
            component: Pages.ViewBoard,
            children: []
          }
        ]
      }
    ]
  }
];

export default config;
