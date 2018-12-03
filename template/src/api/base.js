import axios from "axios";

const API = axios.create({
  baseURL: "",
  timeout: 1500,
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
