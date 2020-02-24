import {
  LOAD_TREND,
  TREND_ERROR
} from "../actions/types";

const initialState = {
  name: null,
  error: null
};

export default function (state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case LOAD_TREND:
      console.log(payload)
      if ( payload === null ) {
        return initialState;
      }
      return {
        ...state,
        name: payload
      };
    case TREND_ERROR:
      return {
        ...state,
        error: payload,
      };
    default:
      return state;
  }
}
