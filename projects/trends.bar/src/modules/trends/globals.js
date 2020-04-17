import {useEffect, useGlobal} from "reactn";
import {getFileNameOnlyNoExt, sanitizeURLParams} from "../../futuremodules/utils/utils";
import {useLocation} from "react-router-dom";
import {useQuery} from "@apollo/react-hooks";
import {getTrendGraphsByUserTrendId, getTrendLayouts} from "./queries";
import {getDefaultTrendLayout, globalLayoutState} from "./layout";
import {getQueryLoadedWithValueArrayNotEmpty} from "../../futuremodules/graphqlclient/query";
import {graphArrayToGraphTree2} from "./dataGraphs";

const uniqueNamesGenerator = require('project-name-generator');

export const EditingUserTrend            = 'editingUserTrend';
export const EditingUserTrendDataSource  = 'editingUserTrendDataSource';
export const EditingLayoutDataSource     = 'editingLayoutDataSource';
export const currentUserTrends           = 'currentUserTrends';

export const generateUniqueNameWithArrayCheck = (arrayToCheck) => {
  let defaultFileName = uniqueNamesGenerator().dashed;
  while ( arrayToCheck && arrayToCheck.includes(defaultFileName)) {
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
  const [datasets, setDatasets] = useGlobal(EditingLayoutDataSource);
  const trendLayoutQuery = useQuery(getTrendLayouts(), {variables: {name: username, trendId: trendId}});
  const [layout, setLayout] = useGlobal(globalLayoutState);

  const trendDataQuery = useQuery(getTrendGraphsByUserTrendId(), {
    variables: {
      name: username,
      trendId: trendId
    }
  });

  useEffect(() => {
    trendDataQuery.refetch().then(() => {
        const queryData = getQueryLoadedWithValueArrayNotEmpty(trendDataQuery);
        if (queryData) {
          const gt = graphArrayToGraphTree2(queryData, "yValueGroup", "yValueSubGroup", "yValueName", "values");
          setDatasets({
            ...datasets,
            ...gt
          }).then();
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trendDataQuery]);

  useEffect(() => {
    if ( datasets ) {
      trendLayoutQuery.refetch().then(() => {
          const queryLayout = getQueryLoadedWithValueArrayNotEmpty(trendLayoutQuery);
          if (queryLayout) {
            setLayout(queryLayout[0]).then();
          } else {
            const ll = {
              ...getDefaultTrendLayout(datasets),
              trendId,
              username
            };
            setLayout(ll).then();
          }
        }
      );
    }
  }, [trendLayoutQuery, setLayout, datasets, trendId, username]);

  return {
    layout,
    setLayout,
    datasets,
    setDatasets,
    trendLayoutQuery,
    trendDataQuery
  }
};
