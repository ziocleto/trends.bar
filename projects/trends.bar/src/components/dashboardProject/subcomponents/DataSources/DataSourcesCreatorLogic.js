import {api, useApi} from "../../../../futuremodules/api/apiEntryPoint";
import {addNewScript} from "../../../../futuremodules/fetch/fetchApiCalls";
import {useEffect} from "react";
import {editingDataSourceD} from "../../../dashboardUser/DashboardUserLogic";

export const useGatherSource = (layout, setLayout, dispatch) => {
  const fetchApi = useApi('fetch');
  const fetchResult = fetchApi[0];
  const fetchDispatch = fetchApi[1];

  useEffect(() => {
      if ( fetchResult && fetchResult.ret ) {
        console.log("Redraw useGatherSource", fetchResult.ret);
        dispatch([editingDataSourceD, fetchResult.ret]);
        fetchDispatch(null);
      }
    },
    [fetchResult, fetchDispatch, dispatch]
  );

  const updater = (sourceDocument) => {
    api(fetchApi, addNewScript, {url: sourceDocument, trendId: layout.trendId}).then();
  };

  return updater;
};
