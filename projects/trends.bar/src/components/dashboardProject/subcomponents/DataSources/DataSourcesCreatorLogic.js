import {api, useApi} from "../../../../futuremodules/api/apiEntryPoint";
import {addNewScript} from "../../../../futuremodules/fetch/fetchApiCalls";
import {useEffect} from "react";
import {editingDataSourceD} from "../../../dashboardUser/DashboardUserLogic";

export const useGatherSource = (layout, setLayout, dispatch) => {
  const fetchApi = useApi('fetch');
  const fetchResult = fetchApi[0];

  useEffect(() => {
      if ( fetchResult && fetchResult.ret ) {
        dispatch([editingDataSourceD, fetchResult.ret]);
      }
    },
    [fetchResult, setLayout]
  );

  const updater = (sourceDocument) => {
    api(fetchApi, addNewScript, {url: sourceDocument, trendId: layout.trendId}).then();
  };

  return updater;
};
