/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-16 06:03:07
 * @LastEditTime: 2019-08-26 10:25:09
 * @LastEditors: Please set LastEditors
 */
import CreateAPI from "./config";
import RevenueService from "../../client/service/RevenueService";
import DashboardService from "../../client/service/DashboardService";
import ViewBoardService from "../../client/service/DashboardService2";

// 数据中心
const revenue = new RevenueService(CreateAPI("wws-revenue"));
const dashboard = new DashboardService(CreateAPI("wws-revenue"));
const viewboard = new ViewBoardService(CreateAPI("wws-revenue"));

export default {
  revenue,
  dashboard,
  viewboard
};
