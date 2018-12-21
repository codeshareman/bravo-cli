
// 公共接口
import COMMON_API from "@SRC/api/common";

// 非公共接口
import profit from "@SRC/api/request/profit";

const API_OTHER = {
  ...profit
};

// 统一请求入口
const $http = {
  ...COMMON_API,
  services: API_OTHER
};

export default $http;
