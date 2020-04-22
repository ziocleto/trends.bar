import {useGlobal} from "reactn";
import {Auth} from "../../futuremodules/auth/authAccessors";
import {useEffect} from "react";
import {getQueryLoadedWithValue, getQueryLoadedWithValueArrayNotEmpty} from "../../futuremodules/graphqlclient/query";
import {alertWarning, NotificationAlert, useConfirmAlertWithWriteCheckShort} from "../../futuremodules/alerts/alerts";
import {useMutation} from "@apollo/react-hooks";
import {CREATE_TREND, REMOVE_TREND} from "../../modules/trends/mutations";

export const editingTrendD = "editingTrend";
export const editingDataSourceD = "editingDataSource";
export const addUserTrendsD = "addUserTrends";
export const userTrendsD = 'currentUserTrends';

export const dashBoardManagerInitialState = {
  editingTrend: null,
  editingDataSource: false,
  currentUserTrends: null,
  username: null
};

export const dashBoardManager = (state, action) => {
  switch (action[0]) {
    case 'username':
      return {
        ...state,
        username: action[1]
      };
    case editingTrendD:
      return {
        ...state,
        editingTrend: action[1]
      };
    case editingDataSourceD:
      return {
        ...state,
        editingDataSource: action[1]
      };
    case userTrendsD:
      return {
        ...state,
        currentUserTrends: action[1]
      };
    case addUserTrendsD:
      return {
        ...state,
        currentUserTrends: state.currentUserTrends ? [...state.currentUserTrends, action[1]] : [action[1]],
        editingTrend: action[1]
      };
    default:
      throw new Error("dashBoardManager reducer is handling an invalid action: " + JSON.stringify(action));
  }
};

export const useDispatchUserName = (dispatch) => {
  const [auth] = useGlobal(Auth);

  useEffect(() => {
    if (auth && auth.user) {
      dispatch(["username",auth.user.name]);
    }
  }, [auth, dispatch]);

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
        dispatch([addUserTrendsD,newValue]);
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
