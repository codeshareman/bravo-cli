import axios from 'axios';
import { message } from 'antd';

const CreateAPI = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
    headers: {
      'Index-Url': '192.168.136.70:8888',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    config => {
      return config;
    },
    err => {
      message.error(err.message);
      Promise.reject(err);
    },
  );

  // 响应拦截器
  instance.interceptors.response.use(
    res => {
      if (res.status === 200) {
        const resData = res.data;
        if (resData.code === 399) {
          window.location.href = resData.data;
        }
      }
      return res;
    },
    err => {
      message.error(err.message);
      Promise.reject(err);
    },
  );
  return instance;
};

export default CreateAPI;
