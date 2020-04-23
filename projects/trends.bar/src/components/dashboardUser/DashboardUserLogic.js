import {useGlobal} from "reactn";
import {Auth} from "../../futuremodules/auth/authAccessors";
import {useEffect} from "react";
import {getQueryLoadedWithValue, getQueryLoadedWithValueArrayNotEmpty} from "../../futuremodules/graphqlclient/query";
import {
  alertWarning,
  NotificationAlert,
  useAlertWarning,
  useConfirmAlertWithWriteCheckShort
} from "../../futuremodules/alerts/alerts";
import {useMutation} from "@apollo/react-hooks";
import {getEmptyDefaultValue, startupState} from "../../modules/trends/layout";
import gql from "graphql-tag";

const createTrend = gql`
    mutation CreateTrend($trendId: String!, $username: String!) {
        createTrend(trendId: $trendId, username: $username) {
            trendId
            username
        }
    }`;

const removeTrend = gql`
    mutation RemoveTrend($trendId: String!, $username: String!) {
        removeTrend(trendId: $trendId, username: $username) {
            trendId
            username
        }
    }`;

export const editingTrendD = "editingTrend";
export const editingDataSourceD = "editingDataSource";
export const removeDataSourceFieldD = "removeDataSourceField";
export const renameDataSourceFieldD = "renameDataSourceField";
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
    case removeDataSourceFieldD:
      const index = state.editingDataSource.headers.findIndex( (elem) => elem.name === action[1] );
      if ( index === -1 ) {
        return state;
      }
      let newHeaders = state.editingDataSource.headers;
      newHeaders.splice(index, 1);
      return {
        ...state,
        editingDataSource: {
          ...state.editingDataSource,
          headers: newHeaders,
          sourceData: state.editingDataSource.sourceData.map( elem => { let ne = elem; ne.splice(index,1); return ne} )
        }
      };
    case renameDataSourceFieldD:
      return {
        ...state,
        editingDataSource: {
          ...state.editingDataSource,
          headers: state.editingDataSource.headers.map(val => {
            if ( val.displayName === action[1] ) {
              val.displayName = action[2];
            }
            return val;
          })
        }
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
  const [createTrendM] = useMutation(createTrend);
  const alert = useAlertWarning();

  const updater = (trendId, username) => {

    if ( !trendId || trendId.length === 0 ) {
      alert("I see no trend in here!");
      return;
    }
    if ( trendId.length > 30 ) {
      alert("Dude, that's way too long, nobody's going to remember it! (Max 30 letters please)");
      return;
    }

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
  const [removeTrendMutation] = useMutation(removeTrend);
  const confirmDeleteAlert = useConfirmAlertWithWriteCheckShort();

  const removeTrendCallback = async (trendId, username, removeTrendMutation, dispatch) => {
    await removeTrendMutation({
      variables: {
        trendId,
        username
      }
    }).then(r => {
        const res = getQueryLoadedWithValueArrayNotEmpty(r);
        dispatch([userTrendsD, res]);
        dispatch([editingTrendD, null]);
      }
    );
  };

  const updater = (trendId, username) => {
    confirmDeleteAlert(trendId, () => removeTrendCallback(trendId, username, removeTrendMutation, dispatch)).then();
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
