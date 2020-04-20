import {api, useApi} from "../../../../futuremodules/api/apiEntryPoint";
import {addNewScript} from "../../../../futuremodules/fetch/fetchApiCalls";

export const useGatherSource = (trendId) => {
  const fetchApi = useApi('fetch');

  const updater = (sourceDocument) => {
    api(fetchApi, addNewScript, {url: sourceDocument, trendId}).then();
  };

  return updater;
};
