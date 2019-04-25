import axios from "axios";
import { message } from "antd";

declare let window: Window & {
  config: any;
};

const {
  config: { env }
} = window;

const requestPath = {
  //dev: "//wws.test.ximalaya.com",
  dev: "http://192.168.1.3:8888",
  prod: "//wws.ximalaya.com",
  uat: "//wws.uat.ximalaya.com"
};

const basePath = requestPath[env];

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
      return res;
    },
    err => {
      message.error(err.message);
      Promise.reject(err);
    }
  );
  return instance;
};


export default CreateAPI