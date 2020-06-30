import { EnvEnum } from "./constants";

export const getEnv = () => {
  const host = window.location.hostname;
  let env = EnvEnum.DEV;
  const is_xmly_domain = ~host.indexOf(".ximalaya.com");

  if (is_xmly_domain) {
    if (~host.indexOf("test")) {
      env = EnvEnum.TEST;
    } else if (~host.indexOf("uat")) {
      env = EnvEnum.UAT;
    } else {
      env = EnvEnum.PROD;
    }
  }
  return env;
};

/**头像图片路径前缀 */
export const getImgPath = () => {
  const path = {
    [EnvEnum.DEV]: "//imagev2.test.ximalaya.com",
    [EnvEnum.TEST]: "//imagev2.test.ximalaya.com",
    [EnvEnum.UAT]: "//imagev2.uat.ximalaya.com",
    [EnvEnum.PROD]: "//imagev2.prod.ximalaya.com"
  };
  return path[getEnv()];
};

//获取开放平台前缀
export const getOpenOrigin = () => {
  const env = getEnv();
  const path = {
    [EnvEnum.DEV]: "//open.test.ximalaya.com",
    [EnvEnum.TEST]: "//open.test.ximalaya.com",
    [EnvEnum.UAT]: "//open.uat.ximalaya.com",
    [EnvEnum.PROD]: "//open.ximalaya.com"
  };
  return path[env];
};

/**
 * 开放平台充值地址
 */
export const getOpenRechargeURL = () => {
  return getOpenOrigin() + "/Management/cost-center/overview/paid";
};

/**
 * 开放平台提现地址
 */
export const getOpenWithdrawURL = () => {
  return getOpenOrigin() + "/Management/cost-center/overview/putout";
};

/**
 * 乘法
 */
export const multi = (a, b) => {
  return a * b;
};
/**
 * 开放平台创建应用地址
 */
export const getOpenCreateAPPUrl = () => {
  return getOpenOrigin() + "/developer/app/create/web";
};

/**
 *
 * @param fn {Function}   实际要执行的函数
 * @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
 *
 * @return {Function}     返回一个“去弹跳”了的函数
 */
export const debounce = function(func: Function, wait: number) {
  let timer: number;
  return function() {
    !!timer && clearTimeout(timer);
    timer = setTimeout(func, wait);
  };
};
