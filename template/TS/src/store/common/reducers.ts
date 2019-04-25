import { SET_LOADING } from "./actionTypes";

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
