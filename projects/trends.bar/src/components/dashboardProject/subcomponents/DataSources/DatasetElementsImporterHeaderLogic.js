import {api, useApi} from "../../../../futuremodules/api/apiEntryPoint";
import {putScript} from "../../../../futuremodules/fetch/fetchApiCalls";
import {isStatusCodeSuccessful} from "../../../../futuremodules/api/apiStatus";
import {useAlertSuccess} from "../../../../futuremodules/alerts/alerts";
import {getEmptyDefaultValue, startupState} from "../../../../modules/trends/layout";
import {editingDataSourceD} from "../../../dashboardUser/DashboardUserLogic";

const updateTrendDatasets = (updater, dataset) => {

  updater( prevState => {
    return {
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
    }
  });
};

export const useImportDataSource = (datasetI, setLayout, dispatch) => {

  const fetchApi = useApi('fetch');
  const alertSuccess = useAlertSuccess();

  const updater = () => {
    api(fetchApi, putScript, datasetI).then((r) => {
      if (isStatusCodeSuccessful(r.status.code)) {
        updateTrendDatasets(setLayout, datasetI);
        alertSuccess("All systems go", () => dispatch([editingDataSourceD, false]));
      }
    });
  };

  return updater;
};

export const renameScript = (script, setScript, newName) => {
  let tmp = script;
  tmp.script.name = newName;
  setScript({...tmp});
};
