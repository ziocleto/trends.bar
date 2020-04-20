import {api, useApi} from "../../../../futuremodules/api/apiEntryPoint";
import {addNewScript, getSimilarScripts} from "../../../../futuremodules/fetch/fetchApiCalls";
import {arrayExistsNotEmpty} from "../../../../futuremodules/utils/utils";

export const useGatherSource = (trendId) => {
  const fetchApi = useApi('fetch');

  const updater = (sourceDocument) => {
    api(fetchApi, addNewScript, {url: sourceDocument, trendId}).then();
  };

  return updater;
};

export const useGetSimilarSources = () => {
  const fetchApi = useApi('fetch');

  const updater = (trendIdPartial) => {
    if ( arrayExistsNotEmpty(trendIdPartial) ) {
      api(fetchApi, getSimilarScripts, trendIdPartial).then();
    }
  };

  return updater;
};
