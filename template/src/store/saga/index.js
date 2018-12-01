import { all } from "redux-saga/effects";
import { getRandomPoetry, helloSaga } from "@/store/saga/user";

export default function* rootSaga() {
  yield all([
      getRandomPoetry(),
      helloSaga()
    ]);
}
