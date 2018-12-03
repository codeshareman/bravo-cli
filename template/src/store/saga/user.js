import { call, put, takeLatest } from "redux-saga/effects";
import $http from "@/api";

export function* helloSaga() {
  console.log('hello saga');
}

/**
 * 随机获取诗歌
 * @export
 */
export function* getRandomPoetry() {
    yield takeLatest("GET_RANDOM_POETRY", function*(data) {
      try {
        const { services } = $http;
        const res = yield call(services.getRandomPoetry, { name: "李白" });
        yield put({ type: "SET_USER_NAME", name: "1111" });
        console.log(res);
      } catch (e) {
        console.log(e.message);
      }
    });
}