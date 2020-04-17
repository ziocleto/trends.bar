import {useEffect, useGlobal} from "reactn";
import {getFileNameOnlyNoExt, sanitizeURLParams} from "../../futuremodules/utils/utils";
import {useLocation} from "react-router-dom";
import {useQuery} from "@apollo/react-hooks";
import {getTrendGraphsByUserTrendId, getTrendLayouts} from "./queries";
import {getDefaultTrendLayout} from "./layout";
import {
  checkQueryHasLoadedWithData,
  getQueryLoadedWithValueArrayNotEmpty
} from "../../futuremodules/graphqlclient/query";
import {graphArrayToGraphTree2} from "./dataGraphs";
import {useState} from "react";

const uniqueNamesGenerator = require('project-name-generator');

export const EditingUserTrend            = 'editingUserTrend';
export const EditingUserTrendDataSource  = 'editingUserTrendDataSource';
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
  const [datasets, setDatasets] = useState();
  const [layout, setLayout] = useState();
  const trendLayoutQuery = useQuery(getTrendLayouts(), {variables: {name: username, trendId: trendId}});

  const trendDataQuery = useQuery(getTrendGraphsByUserTrendId(), {
    variables: {
      name: username,
      trendId: trendId
    }
  });

  useEffect(() => {
    if ( username && trendId ) {
      trendDataQuery.refetch().then(() => {
          if ( checkQueryHasLoadedWithData(trendDataQuery) ) {
            const queryData = getQueryLoadedWithValueArrayNotEmpty(trendDataQuery);
            if (queryData) {
              const gt = graphArrayToGraphTree2(queryData, "yValueGroup", "yValueSubGroup", "yValueName", "values");
              setDatasets({
                ...datasets,
                ...gt
              });
            } else {
              setDatasets({});
            }
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trendDataQuery, username, trendId]);

  useEffect(() => {
    if ( datasets ) {
      trendLayoutQuery.refetch().then(() => {
          const queryLayout = getQueryLoadedWithValueArrayNotEmpty(trendLayoutQuery);
          if (queryLayout) {
            setLayout(queryLayout[0]);
          } else {
            const ll = {
              ...getDefaultTrendLayout(datasets),
              trendId,
              username
            };
            setLayout(ll);
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
