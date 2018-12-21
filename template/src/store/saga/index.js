import { all } from "redux-saga/effects";
import { getProfitSummary, getProfitDetail, getBannerConten} from "./profit";

export default function* rootSaga() {
  yield all([
    getProfitSummary(),
    getProfitDetail(),
    getBannerConten()
  ]);
}
