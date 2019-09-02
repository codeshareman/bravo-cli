import { combineReducers } from "redux";

import common from "./reducers/common";
import saleRevenue from "./reducers/sale-revenue";
import lockRevenue from "./reducers/lock-revenue";
import viewBoard from "./reducers/viewboard";

export default combineReducers({
  common,
  saleRevenue,
  lockRevenue,
  viewBoard
});
