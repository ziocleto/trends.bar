import {useGlobal} from "reactn";
import {Auth} from "../../futuremodules/auth/authAccessors";
import {useEffect} from "react";
import {getQueryLoadedWithValue, getQueryLoadedWithValueArrayNotEmpty} from "../../futuremodules/graphqlclient/query";
import {alertWarning, NotificationAlert, useConfirmAlertWithWriteCheckShort} from "../../futuremodules/alerts/alerts";
import {useMutation} from "@apollo/react-hooks";
import {CREATE_TREND, REMOVE_TREND} from "../../modules/trends/mutations";
import {getEmptyDefaultValue, startupState} from "../../modules/trends/layout";

export const editingTrendD = "editingTrend";
export const editingDataSourceD = "editingDataSource";
export const addUserTrendsD = "addUserTrends";
export const userTrendsD = 'currentUserTrends';

export const dashBoardManagerInitialState = {
  editingTrend: null,
  editingDataSource: null,
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

export const useRemoveTrend = (dispatch) => {
  const [removeTrendMutation] = useMutation(REMOVE_TREND);
  const confirmDeleteAlert = useConfirmAlertWithWriteCheckShort();

  const removeTrend = async (trendId, username, removeTrendMutation, dispatch) => {
    await removeTrendMutation({
      variables: {
        trendId,
        username
      }
    }).then(r => {
        const res = getQueryLoadedWithValueArrayNotEmpty(r);
        dispatch([userTrendsD, res]);
      }
    );
  };

  const updater = (trendId, username) => {
    confirmDeleteAlert(trendId, () => removeTrend(trendId, username, removeTrendMutation, dispatch)).then();
  };

  return updater;
};

export const upsertTrend = (prevState, updater, dataset) => {

  updater( {
      ...prevState,
      // Check if it needs to update gridContent if the former is empty, a random act of kindness goes a long way!
      gridContent: prevState.gridContent.map( elem => {
        if (elem.valueFunctionName === getEmptyDefaultValue.name) {
          elem = {
            ...elem,
            ...startupState(null) // will be dataset
          };
        }
        return elem;
      }),
      datasets: prevState.datasets ? [...prevState.datasets, dataset] : [dataset]
  });
};
