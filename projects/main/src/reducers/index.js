import { combineReducers } from "redux";
import auth from "./auth";
import trend from "./TrendReducer";

export default combineReducers({
  auth,
  trend
});
