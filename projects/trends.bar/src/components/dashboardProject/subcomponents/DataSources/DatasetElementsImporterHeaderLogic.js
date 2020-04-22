import {api, useApi} from "../../../../futuremodules/api/apiEntryPoint";
import {putScript} from "../../../../futuremodules/fetch/fetchApiCalls";
import {isStatusCodeSuccessful} from "../../../../futuremodules/api/apiStatus";
import {useAlertSuccess} from "../../../../futuremodules/alerts/alerts";
import {editingDataSourceD, upsertTrend} from "../../../dashboardUser/DashboardUserLogic";

export const useImportDataSource = () => {

  const fetchApi = useApi('fetch');
  const alertSuccess = useAlertSuccess();

  const updater = (datasetI, layout, setLayout, dispatch) => {
    api(fetchApi, putScript, datasetI).then((r) => {
      if (isStatusCodeSuccessful(r.status.code)) {
        upsertTrend(layout, setLayout, datasetI);
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
