import axios from "axios";
import { message } from "antd";
import { UrlConfig, AJAX_STATUS } from "@/shared/common/constants";
import { getEnv } from "@/shared/common/utils";

const env = getEnv();
const { loginUrl } = UrlConfig[env];

const CreateAPI = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true
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
      if (res.status === 200) {
        const resData = res.data;
        if (
          // resData.code === 7 ||
          // resData.code === -1 ||
          resData.code === AJAX_STATUS.UNAUTHENTICATED
        ) {
          window.location.href = loginUrl;
        }
      }
      return res;
    },
    err => {
      // message.error(err.message);
      if (AJAX_STATUS.PERMISSION_DENIED === err.response.status) {
        console.log("权限不足");
        Promise.reject({
          message: "权限不足",
          code: AJAX_STATUS.PERMISSION_DENIED
        });
      } else {
        Promise.reject({
          message: err.message,
          code: err.response.status
        });
      }
    }
  );
  return instance;
};

declare let window: any;

export default CreateAPI;
