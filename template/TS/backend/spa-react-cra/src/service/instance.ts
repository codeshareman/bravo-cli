import { message } from 'antd';
import { HOST_PORT, DEFAULT_HEADER } from 'common/constants/service';
import axios from 'axios';

const instance = axios.create({
  baseURL: `${HOST_PORT}/api/v1`,
  timeout: 30000,
  headers: {
    ...DEFAULT_HEADER,
  },
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    err?.message && message.error(err.message);
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (res) => {
    const resBody = res.data;
    if ('error' === resBody.status) {
      message.error(resBody.data);
      return Promise.reject(resBody);
    }
    return resBody.data;
  },
  (err) => {
    err?.message && message.error(err.message);
    return Promise.reject(err);
  }
);

export default instance;
