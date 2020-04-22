import {useAlertSuccess, useAlertWarning} from "../../../../futuremodules/alerts/alerts";
import {editingDataSourceD} from "../../../dashboardUser/DashboardUserLogic";
import {useMutation} from "@apollo/react-hooks";
import {upsertTrendDataSource} from "../../../../modules/trends/mutations";

export const useImportDataSource = () => {

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
      setLayout( prevState => {
        return {
          ...prevState,
          dataSources: [...prevState.dataSources, state.editingDataSource]
        }
      });
      alertSuccess("All systems go", () => dispatch([editingDataSourceD, null]))
    }).catch( (e) => alertWarning( e.message.slice("GraqhQL error: ".length)) );
  };

  return updater;
};

export const renameScript = (script, setScript, newName) => {
  let tmp = script;
  tmp.script.name = newName;
  setScript({...tmp});
};
