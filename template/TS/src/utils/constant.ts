/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-16 06:03:07
 * @LastEditTime: 2019-08-27 17:34:11
 * @LastEditors: Please set LastEditors
 */
// APP配置
const APP_CONFIG = {
  appName: "cps-data-center",
  registerName: "data",
  baseRouteName: "/node-gateway/cps/v1/data"
};

const BASE_PATH = `/node-gateway/cps/v1/${APP_CONFIG.registerName}`;
export const USER_INFO =  JSON.parse(sessionStorage.getItem("userInfo"))


// AJAX状态码
enum AJAX_STATUS {
  SUCCESS = 200,
  INVALID_TOKEN = 302
}

export const IS_LOGIN = sessionStorage.getItem("userInfo");

export const IncomeDetailType = {
  AGENT: 1, //代理商
  MINE: 2, //我的
  LOCK: 3 //锁订单
};

export const PublishStatusText = {
  0: "全部",
  1: "未发布",
  2: "已发布",
  3: "已下架",
  4: "封禁"
};

export { APP_CONFIG, AJAX_STATUS, BASE_PATH };
