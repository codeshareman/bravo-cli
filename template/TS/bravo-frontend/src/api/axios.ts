import axios from "axios";
import { message } from "antd";
import config, { LOGIN_URL } from "./config";
import { HTTP_STATUS } from "@/shared/common/constants";

const CreateAPI = (baseURL?: string) => {
  const instance = axios.create({
    baseURL: baseURL || config.requestUrl,
    timeout: 10000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });

  // 请求拦截器
  instance.interceptors.request.use(
    config => {
      return config;
    },
    err => {
      console.log({err},"----request--")
      message.error(err.message);
      Promise.reject(err);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    res => {
      if (HTTP_STATUS.NO_LOGIN === res.data.code) {
        //未登录
        window.location.href =
          LOGIN_URL + `?fromUri=${encodeURIComponent(window.location.href)}`;
      }
      return res;
    },
    err => {
      console.log({err},"---response---")
      message.error(err.message);
      Promise.reject(err);
    }
  );
  return instance;
};

export default CreateAPI;
