// APP配置
const APP_CONFIG = {
  appName: "wws-template",
  registerName: "template",
  baseRouteName: "/wws-workbench/v1/template"
};

// 支付类型
const PAY_TYPE = {
  PAY: 1,
  FREE: 0
};

// 书籍类型
const BOOK_TYPE = {
  MULTI: 2,
  SINGLE: 1
};

const CATE_SCOPE = {
  SYS: 1,
  LIB: 2
};

const BookTypeText = {
  2: "声音听单",
  3: "专辑听单"
};

// AJAX状态码
const AJAX_STATUS = {
  SUCCESS: 0,

  // 客户端取消
  CANCELLED: 1,

  // 未知的服务器错误
  UNKNOWN: 2,

  // 无效的参数
  INVALID_ARGUMENT: 3,

  // 服务器超时
  DEADLINE_EXCEEDED: 4,

  // 资源未找到
  NOT_FOUND: 5,

  // 资源已存在
  ALREADY_EXISTS: 6,

  // 权限不足
  PERMISSION_DENIED: 7,

  // 未认证
  UNAUTHENTICATED: 16,

  // 资源耗尽
  RESOURCE_EXHAUSTED: 8,

  // 服务中止
  ABORTED: 10,

  // 超出范围
  OUT_OF_RANGE: 11,

  // 未实现
  UNIMPLEMENTED: 12,

  // 服务器内部错误
  INTERNAL: 13,

  // 服务不可用
  UNAVAILABLE: 14,

  // 数据丢失
  DATA_LOSS: 15,

  // 资源锁定
  LOCKED: 16,

  // 数据封送错误
  DATA_BIND_ERROR: 100,

  // 字段值越界
  DATA_INTEGRITY_VIOLATION: 102
};

// 全局BTN类型
const GLOBAL_BTN_TYPES = {
  SAVE: 1,
  EDIT: 2,
  PUBLISH: 3
};

export {
  APP_CONFIG,
  AJAX_STATUS,
  GLOBAL_BTN_TYPES,
  PAY_TYPE,
  BOOK_TYPE,
  CATE_SCOPE,
  BookTypeText
};
