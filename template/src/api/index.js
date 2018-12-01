
// 公共接口
import COMMON_API from "@/api/common";

// 非公共接口
import poetry from "@/store/request/poetry";

const API_OTHER = {
  ...poetry
};

// 统一请求入口
const $http = {
  ...COMMON_API,
  services: API_OTHER
};

export default $http;
