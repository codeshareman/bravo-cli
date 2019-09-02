/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-02 11:28:40
 * @LastEditTime: 2019-08-27 18:28:15
 * @LastEditors: Please set LastEditors
 */
import moment from "moment";
import { SET_BOARD_PARAMS } from "../actionTypes/viewboard";
import {
  VisitDimensionType,
  ContenDimensionType,
  ActionDimensionType
} from "@/pages/income/viewboard/children/CombineFilter/enums";
import { StatisticalType } from "../../../client/service/DashboardService2";
import { formatDateTime } from "@/utils/Helper";

const dateFormat = "YYYY/MM/DD";
const toDate = formatDateTime(Date.now(), "/");
const fromDate = formatDateTime(Date.now() - 24 * 60 * 60 * 30 * 1000, "/");

const initialState = {
  queryParams: {
    productVal: -1,
    libVisitDis: VisitDimensionType.PV,
    statisticalType: StatisticalType.DAY,
    resourceType: ContenDimensionType.SOUND,
    libContenActionDis: ActionDimensionType.PLAYCOUNT,
    rangeTime: [moment(fromDate, dateFormat), moment(toDate, dateFormat)],
    area: "",
    queryString: "",
    dismension: StatisticalType.DAY
  }
};

export default function(state = initialState, actions) {
  switch (actions.type) {
    case SET_BOARD_PARAMS:
      return {
        ...state,
        queryParams: Object.assign({}, state.queryParams, actions.payload)
      };
    default:
      return state;
  }
}
