import {useEffect, useGlobal} from "reactn";
import {getFileNameOnlyNoExt, sanitizeURLParams} from "../../futuremodules/utils/utils";
import {useLocation} from "react-router-dom";
import {useQuery} from "@apollo/react-hooks";
import {getTrendLayouts} from "./queries";
import {getDefaultTrendLayout} from "./layout";
import {
  checkQueryHasLoadedWithData,
  getQueryLoadedWithValueArrayNotEmpty
} from "../../futuremodules/graphqlclient/query";
import {useState} from "react";
import {graphArrayToGraphTree2} from "./dataGraphs";

const uniqueNamesGenerator = require('project-name-generator');

export const EditingUserTrend = 'editingUserTrend';
export const EditingUserTrendDataSource = 'editingUserTrendDataSource';
export const currentUserTrends = 'currentUserTrends';

export const generateUniqueNameWithArrayCheck = (arrayToCheck) => {
  let defaultFileName = uniqueNamesGenerator().dashed;
  while (arrayToCheck && arrayToCheck.includes(defaultFileName)) {
    defaultFileName = uniqueNamesGenerator().dashed;
  }
  return defaultFileName;
};

export const useTrendIdGetter = () => {
  const [userTrendId] = useGlobal(EditingUserTrend);
  const urlTrendId = sanitizeURLParams(getFileNameOnlyNoExt(useLocation().pathname));
  return userTrendId ? userTrendId : urlTrendId;
};

export const useGetTrend = (trendId, username) => {
  const [datasets, setDatasets] = useState(null);
  const [layout, setLayout] = useState(null);
  const trendQueryResult = useQuery(getTrendLayouts(), {
    variables: {name: username, trendId: trendId}
  });

  useEffect(() => {
    trendQueryResult.refetch().then(() => {
      if (checkQueryHasLoadedWithData(trendQueryResult)) {
        const queryLayout = getQueryLoadedWithValueArrayNotEmpty(trendQueryResult);
        if (queryLayout) {
          setLayout(queryLayout[0]);
          const gt = graphArrayToGraphTree2(queryLayout[0].datasets, "yValueGroup", "yValueSubGroup", "yValueName", "values");
          setDatasets(previousValue => gt);
        } else {
          const ll = {
            ...getDefaultTrendLayout(null),
            trendId,
            username
          };
          setLayout(ll);
        }
      }
    });
  }, [trendQueryResult, trendId, username]);

  return {
    layout,
    setLayout,
    datasets,
    setDatasets
  }
};
