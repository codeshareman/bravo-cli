import axios from "axios";

const { config: { env } } = window;
const useTestEnv = true;
const basePath =
  env === "DEV"
    ? useTestEnv
      ? "//wws.test.ximalaya.com/wws-b/v2/api/"
      : "localhost:3000/mock"
    : "//wws.ximalaya.com/wws-b/v2/api/";


const API = axios.create({
  baseURL: basePath,
  timeout: 10000,
  headers: {}
});

// 请求拦截器
API.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    Promise.reject(err);
  }
);

// 响应拦截器
API.interceptors.response.use(
  response => {
    switch (response.status) {
      case 400:
        window.location.href = "https://www.baidu.com";
        break;
      default:
        return response;
    }
  },
  err => {
    Promise.reject(err);
  }
);

export default API;
