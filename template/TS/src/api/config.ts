/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-19 10:35:49
 * @LastEditTime: 2019-08-23 15:58:15
 * @LastEditors: Please set LastEditors
 */
import axios from "axios";
import { message } from "antd";
import { AJAX_STATUS } from "@/utils/constant";
import { getEnv } from "@/utils/Helper";

declare let window: Window & {
  config: any;
};

const requestPath = {
  dev: "//wws.test.ximalaya.com/wws-gateway",
  prod: "//wws.ximalaya.com/wws-gateway",
  uat: "//wws.uat.ximalaya.com/wws-gateway"
};
const env = getEnv();
const basePath = requestPath[env];
const LOGIN_URL = window.location.origin + "/node-gateway/login?fromUri=cps";

const CreateAPI = (basePathSuffix = "") => {
  const instance = axios.create({
    //baseURL: `${basePath}/wws-scan-play`,
    baseURL: `${basePath}/${basePathSuffix}`,
    timeout: 10000
    // withCredentials: true
  });

  // 请求拦截器
  instance.interceptors.request.use(
    config => {
      config.headers = {
        "x-token": sessionStorage.getItem("x-token")
      };
      return config;
    },
    err => {
      message.error(err.message);
      Promise.reject(err);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    res => {
      //token 无效
      if (AJAX_STATUS.INVALID_TOKEN === res.data.code) {
        message.error("登录失效, 请重新登陆!")
        setTimeout(()=>{
          window.location.href = LOGIN_URL;
        }, 2000)
      }
      return res;
    },
    err => {
      message.error(err.message);
      Promise.reject(err);
    }
  );
  return instance;
};

export default CreateAPI;
