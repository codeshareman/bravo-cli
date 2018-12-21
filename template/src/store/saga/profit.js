import { call, put, takeLatest, select } from "redux-saga/effects";
import $http from "@SRC/api";

const { services } = $http;

/**
 * 获取本月结算统计
 */
export function* getProfitSummary() {
  yield takeLatest("GET_PROFIT_SUMMARY", function*(action) {
    try {
      const res = yield call(services.getProfitSummary, action.data);
      const resData = res.data;
      yield put({ type: "SET_LOADING", isLoading: true });
      if (resData.code === 200) {
        yield put({ type: "SET_PROFIT_SUMMARY", data: res.data.data });
        action.callback && action.callback();
      } else {
        console.log(resData.msg);
      }
      yield put({ type: "SET_LOADING", isLoading: false });
    } catch (e) {
      console.log(e.message);
      yield put({ type: "SET_PROFIT_SUMMARY", data: [] });
      yield put({ type: "SET_LOADING", isLoading: false });
    }
  });
}

/**
 * 获取收益明细
 */
export function* getProfitDetail() {
  yield takeLatest("GET_PROFIT_DETAIL", function*(action) {
    try {
      const res = yield call(services.getProfitDetail, action.data);
      const resData = res.data;
      yield put({ type: "SET_LOADING", isLoading: true });
      if (resData.code === 200) {
        yield put({ type: "SET_DETAIL_TOTAL", data: resData.total });
        yield put({ type: "SET_PROFIT_DETAIL", data: resData.data });
        const profit = yield select(state => state.profit);
        action.callback && action.callback();
      } else {
        console.log(resData.msg);
      }
      yield put({ type: "SET_LOADING", isLoading: false });
    } catch (e) {
      console.log(e.message);
      yield put({ type: "SET_PROFIT_DETAIL", data: [] });
      yield put({ type: "SET_LOADING", isLoading: false });
    }
  });
}

/**
 * 获取banner内容
 */
export function* getBannerConten() {
  yield takeLatest("GET_BANNER_CONTEN", function*(action) {
    try {
      const res = yield call(services.getBannerConten);
      const resData = res.data;
      yield put({ type: "SET_LOADING", isLoading: true });
      if (resData.code === 200) {
        yield put({ type: "SET_BANNER_CONTEN", data: resData.data });
        action.callback && action.callback();
      } else {
        console.log(resData.msg);
      }
      yield put({ type: "SET_LOADING", isLoading: false });
    } catch (e) {
      console.log(e.message);
      yield put({ type: "SET_BANNER_CONTEN", data: [] });
      yield put({ type: "SET_LOADING", isLoading: false });
    }
  });
}
