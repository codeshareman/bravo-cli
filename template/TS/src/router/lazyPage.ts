/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-31 17:50:12
 * @LastEditTime: 2019-08-15 14:48:27
 * @LastEditors: Please set LastEditors
 */
import React, { lazy } from "react";

// 组件
import BundleCompo from "../HOC/BundleCompo";

// 页面
const Sell = lazy(() => import("@/pages/income/sell"));
const SellDetails = lazy(() => import("@/pages/income/sell/details"));
const Lock = lazy(() => import("@/pages/income/lock"));
const ViewBoard = lazy(() => import("@/pages/income/viewboard"));
const DataBoard = lazy(() => import("@/pages/income/databoard"));
const DataBoardSeting = lazy(() => import("@/pages/income/big-screen/index"));

const Pages = {
  Sell: BundleCompo(Sell),
  SellDetails: BundleCompo(SellDetails),
  Lock: BundleCompo(Lock),
  ViewBoard: BundleCompo(ViewBoard),
  DataBoard: BundleCompo(DataBoard),
  DataBoardSeting: BundleCompo(DataBoardSeting)
};

export default Pages;
