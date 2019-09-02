import { SET_SALE_REVENUE_PARAMS } from "../actionTypes/sale-revenue";

const initialState = {
  saleRevenueParams: null
};

export default function(state = initialState, actions) {
  switch (actions.type) {
    case SET_SALE_REVENUE_PARAMS:
      return {
        ...state,
        saleRevenueParams: actions.payload
      };
    default:
      return state;
  }
}
