/**
 * 排序类型
 */
declare enum OrderType {
  UPDATE, //  最近更新
  CREATED, //  最早创建
  QUOTE //  引用最多
  // PLAY  // 播放最多
}


export default OrderType;
// AJAX状态码
export declare interface AJAX_STATUS {
  SUCCESS: 0;

  // 客户端取消
  CANCELLED: 1;

  // 未知的服务器错误
  UNKNOWN: 2;

  // 无效的参数
  INVALID_ARGUMENT: 3;

  // 服务器超时
  DEADLINE_EXCEEDED: 4;

  // 资源未找到
  NOT_FOUND: 5;

  // 资源已存在
  ALREADY_EXISTS: 6;

  // 权限不足
  PERMISSION_DENIED: 7;

  // 未认证
  UNAUTHENTICATED: 16;

  // 资源耗尽
  RESOURCE_EXHAUSTED: 8;

  // 服务中止
  ABORTED: 10;

  // 超出范围
  OUT_OF_RANGE: 11;

  // 未实现
  UNIMPLEMENTED: 12;

  // 服务器内部错误
  INTERNAL: 13;

  // 服务不可用
  UNAVAILABLE: 14;

  // 数据丢失
  DATA_LOSS: 15;

  // 资源锁定
  LOCKED: 16;

  // 数据封送错误
  DATA_BIND_ERROR: 100;

  // 字段值越界
  DATA_INTEGRITY_VIOLATION: 102;
}
