import {api, useApi} from "../../../../futuremodules/api/apiEntryPoint";
import {putScript} from "../../../../futuremodules/fetch/fetchApiCalls";
import {isStatusCodeSuccessful} from "../../../../futuremodules/api/apiStatus";
import {updateTrendDatasets} from "../../../../modules/trends/globals";
import {useAlertSuccess} from "../../../../futuremodules/alerts/alerts";

export const useImportDataSource = (graphTree, layout, setLayout, setEditingDataSource) => {

  const fetchApi = useApi('fetch');
  const alertSuccess = useAlertSuccess();

  const updater = () => {
    api(fetchApi, putScript, graphTree.script).then((r) => {
      if (isStatusCodeSuccessful(r.status.code)) {
        updateTrendDatasets(layout, setLayout, graphTree.tree);
        alertSuccess("All systems go", () => setEditingDataSource(false));
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
