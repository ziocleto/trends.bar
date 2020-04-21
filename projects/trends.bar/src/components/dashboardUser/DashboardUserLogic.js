import {useGlobal} from "reactn";
import {Auth} from "../../futuremodules/auth/authAccessors";
import {useEffect} from "react";
import {getQueryLoadedWithValue, getQueryLoadedWithValueArrayNotEmpty} from "../../futuremodules/graphqlclient/query";
import {alertWarning, NotificationAlert, useConfirmAlertWithWriteCheckShort} from "../../futuremodules/alerts/alerts";
import {useMutation} from "@apollo/react-hooks";
import {CREATE_TREND, REMOVE_TREND} from "../../modules/trends/mutations";

const editingTrend = "editingTrend";
const addUserTrendsDispatchId = "addUserTrends";
export const userTrendsDispatchId = 'currentUserTrends';

export const dashBoardManagerInitialState = {
  editingTrend: null,
  currentUserTrends: null,
  username: null
};

export const dashBoardManager = (state, action) => {
  switch (action.type) {
    case 'username':
      return {
        ...state,
        username: action.value
      };
    case editingTrend:
      return {
        ...state,
        editingTrend: action.value
      };
    case userTrendsDispatchId:
      return {
        ...state,
        currentUserTrends: action.value
      };
    case addUserTrendsDispatchId:
      return {
        ...state,
        currentUserTrends: state.currentUserTrends ? [...state.currentUserTrends, action.value] : [action.value]
      };
    default:
      throw new Error("dashBoardManager reducer is handling an invalid action: " + JSON.stringify(action));
  }
};

export const useDispatchUserName = (dispatch) => {
  const [auth] = useGlobal(Auth);

  useEffect(() => {
    if (auth && auth.user) {
      dispatch({type: "username", value: auth.user.name})
    }
  }, [auth, dispatch]);

};

export const dispatchSetEditingUserTrend = (dispatch) => {
  return (value) => dispatch({type: editingTrend, value: value});
};

export const dispatchSetCurrentUserTrends = (dispatch) => {
  return (value) => dispatch({type: userTrendsDispatchId, value: value});
};

export const useCreateTrend = (dispatch) => {

  const [, alertStore] = useGlobal(NotificationAlert);
  const [createTrendM] = useMutation(CREATE_TREND);

  const updater = (trendId, username) => {
    createTrendM({
      variables: {
        trendId: trendId,
        username: username
      }
    }).then(r => {
        const newValue = getQueryLoadedWithValue(r).trendId;
        console.log("New value: ", newValue);
        dispatch({type: addUserTrendsDispatchId, value: newValue});
        dispatch({type: editingTrend, value: newValue});
      }
    ).catch((e) => {
      alertWarning(alertStore, e.message.slice("GraqhQL error: ".length));
    });
  }

  return updater;
};

export const useRemoveTrend = (setUserTrends) => {
  const [removeTrendMutation] = useMutation(REMOVE_TREND);
  const confirmDeleteAlert = useConfirmAlertWithWriteCheckShort();

  const removeTrend = async (trendId, username, removeTrendMutation, setUserTrends) => {
    await removeTrendMutation({
      variables: {
        trendId,
        username
      }
    }).then(r => {
        const res = getQueryLoadedWithValueArrayNotEmpty(r);
        setUserTrends(res);
      }
    );
  };

  const updater = (trendId, username) => {
    confirmDeleteAlert(trendId, () => removeTrend(trendId, username, removeTrendMutation, setUserTrends)).then();
  };

  return updater;
};
