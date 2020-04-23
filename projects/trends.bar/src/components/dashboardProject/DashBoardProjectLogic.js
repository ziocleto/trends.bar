import {getDefaultCellContent} from "../../modules/trends/layout";
import {useMutation} from "@apollo/react-hooks";
import {useAlertSuccess, useAlertWarning} from "../../futuremodules/alerts/alerts";
import {editingDataSourceD} from "../dashboardUser/DashboardUserLogic";
import gql from "graphql-tag";

// ------------------------------
// Hooks
// ------------------------------

export const upsertTrendLayout = gql`
    mutation UpsertTrendLayout($trendLayout: TrendLayoutInput) {
        upsertTrendLayout(trendLayout: $trendLayout) {
            _id
        }
    }`;

export const publishTrend = gql`
    mutation PublishTrend($trendId: String!, $username: String!) {
        publishTrend(trendId: $trendId, username: $username) {
            _id
        }
    }`;

export const upsertTrendDataSource = gql`
    mutation upsertTrendDataSource($trendId: String!, $username: String!, $dataSource: DataSourceInput!) {
        upsertTrendDataSource(trendId: $trendId, username: $username, dataSource: $dataSource) {
            username
        }
    }`;

export const renameTrendDataSource = gql`
    mutation renameTrendDataSource($trendId: String!, $username: String!, $oldName: String!, $newName: String) {
        renameTrendDataSource(trendId: $trendId, username: $username, oldName: $oldName, newName: $newName) {
            username
        }
    }`;

export const removeTrendDataSource = gql`
    mutation removeTrendDataSource($trendId: String!, $username: String!, $dataSourceName: String!) {
        upsertTrendDataSource(trendId: $trendId, username: $username, dataSourceName: $dataSourceName) {
            username
        }
    }`;


// ------------------------------
// Hooks
// ------------------------------

export const useUpsertDataSource = () => {

  const [upsertTrendMutation] = useMutation(upsertTrendDataSource);
  const alertSuccess = useAlertSuccess();
  const alertWarning = useAlertWarning();

  const updater = (layout, setLayout, state, dispatch) => {
    upsertTrendMutation({
      variables: {
        trendId: layout.trendId,
        username: layout.username,
        dataSource: state.editingDataSource
      }
    }).then((res) => {
      const ds = layout.dataSources.filter( elem => elem.name !==  state.editingDataSource.name );
      setLayout( prevState => {
        return {
          ...prevState,
          dataSources: [...ds, state.editingDataSource]
        }
      });
      alertSuccess("All systems go", () => dispatch([editingDataSourceD, null]));
    }).catch( (e) => alertWarning( e.message.slice("GraqhQL error: ".length)) );
  };

  return updater;
};

export const usePublishTrend = (trendId, username) => {
  const [publishTrendMutation] = useMutation(publishTrend);
  const alertSuccess = useAlertSuccess();

  const updater = () => {
    publishTrendMutation({
      variables: {
        trendId,
        username
      }
    }).then(() => alertSuccess("Yeah, you're live!"));
  };

  return updater;
};

// ------------------------------
// Functions
// ------------------------------

export const useRemoveDataSource = (trendId, username, dataSourceName) => {
  const [removeTrendDataSourceMutation] = useMutation(removeTrendDataSource);
  const alertSuccess = useAlertSuccess();

  const updater = () => {
    removeTrendDataSourceMutation({
      variables: {
        trendId,
        username,
        dataSourceName
      }
    }).then(() => alertSuccess("Yeah, you're live!"));
  };

  return updater;
};

export const renameDataSource = (oldName, newName, state, dispatch, renameDataSourceMutation) => {
  renameDataSourceMutation( {
    variables: {
      trendId: state.editingTrend,
      username: state.username,
      oldName: oldName,
      newName
    }
  });
  dispatch([editingDataSourceD, {
    ...state.editingDataSource,
    name: newName
  }])
};

export const needsWizard = (layout) => {
  return (layout && layout.wizard);
};

export const addCell = (layout, setLayout) => {
  const newGridLayout = [...layout.gridLayout];
  const newGridContent = [...layout.gridContent];
  const newIndex = Math.max(...(layout.gridLayout.map((v) => Number(v.i)))) + 1;
  newGridLayout.push({
    i: newIndex.toString(),
    x: 0,
    y: 0,
    w: 3,
    h: 3
  });
  newGridContent.push(getDefaultCellContent(newIndex, layout.datasets));
  setLayout({
    ...layout,
    gridLayout: newGridLayout,
    gridContent: newGridContent
  });
};
