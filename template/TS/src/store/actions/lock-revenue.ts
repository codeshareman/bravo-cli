import { SET_LOCK_REVENUE_PARAMS } from "../actionTypes/lock-revenue";

// 设置销售收益
export const setLockRevenue = payload => ({
  type: SET_LOCK_REVENUE_PARAMS,
  payload
});
