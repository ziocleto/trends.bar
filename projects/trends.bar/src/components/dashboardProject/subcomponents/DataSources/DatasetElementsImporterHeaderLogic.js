import {api} from "../../../../futuremodules/api/apiEntryPoint";
import {putScript} from "../../../../futuremodules/fetch/fetchApiCalls";
import {isStatusCodeSuccessful} from "../../../../futuremodules/api/apiStatus";
import {updateTrendDatasets} from "../../../../modules/trends/globals";

export const publishGraphs = (fetchApi, graphTree, layout, setLayout) => {
  api(fetchApi, putScript, graphTree.script).then((r) => {
    if (isStatusCodeSuccessful(r.status.code)) {
      updateTrendDatasets(layout, setLayout, graphTree.tree);
      // alertSuccess(alertStore, "All set and done!", () => setEditingDataSource(false));
    }
  });
};

export const renameScript = (script, setScript, newName) => {
  let tmp = script;
  tmp.script.name = newName;
  setScript({...tmp});
};
