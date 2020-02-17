import {LOAD_TREND, TREND_ERROR,} from "./types";
import store from "../store";

// Get entries
export const loadTrend = (trendName) => async dispatch => {
  try {
    const state = store.getState();
    if (trendName !== state.trend.name) {
      dispatch({
        type: LOAD_TREND,
        payload: trendName
      });
    }

  } catch (err) {
    console.log(err);
    dispatch({
      type: TREND_ERROR,
      payload: {msg: err.response}
    });
  }
};

