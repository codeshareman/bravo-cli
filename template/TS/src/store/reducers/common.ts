import { SET_LOADING } from "../actionTypes/common";

const initialState = {
  isLoading: false
};

export default function(state = initialState, payload) {
  switch (payload.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: payload.isLoading
      };
    default:
      return state;
  }
}
