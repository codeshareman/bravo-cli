import { SET_LOCK_REVENUE_PARAMS } from "../actionTypes/lock-revenue";

const initialState = {
  lockRevenueParams: {
    businessType: 0,
    params: {}
  }
};

export default function(state = initialState, actions) {
  switch (actions.type) {
    case SET_LOCK_REVENUE_PARAMS:
      return {
        ...state,
        lockRevenueParams: actions.payload
      };
    default:
      return state;
  }
}
