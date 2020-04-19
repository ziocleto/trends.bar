import {useEffect} from "reactn";
import {getFileNameOnlyNoExt, sanitizeURLParams} from "../../futuremodules/utils/utils";
import {useLocation} from "react-router-dom";
import {useQuery} from "@apollo/react-hooks";
import {getTrendLayouts} from "./queries";
import {checkQueryHasLoadedWithData, getQueryLoadedWithValue} from "../../futuremodules/graphqlclient/query";
import {useState} from "react";
import {graphArrayToGraphTree2} from "./dataGraphs";
import {getEmptyDefaultValue, startupState} from "./layout";

const uniqueNamesGenerator = require('project-name-generator');

export const EditingUserTrend = 'editingUserTrend';
export const EditingUserTrendDataSource = 'editingUserTrendDataSource';
export const currentUserTrends = 'currentUserTrends';
export const layoutStandardCols = 12;

export const generateUniqueNameWithArrayCheck = (arrayToCheck) => {
  let defaultFileName = uniqueNamesGenerator().dashed;
  while (arrayToCheck && arrayToCheck.includes(defaultFileName)) {
    defaultFileName = uniqueNamesGenerator().dashed;
  }
  return defaultFileName;
};

export const useTrendIdGetter = () => {
  return sanitizeURLParams(getFileNameOnlyNoExt(useLocation().pathname));
};

export const updateTrendDatasets = (prevState, updater, dataset) => {

  // Check if it needs to update gridContent if the former is empty, a random act of kindness goes a long way!
  const newGridContent = prevState.gridContent.map( elem => {
    if (elem.valueFunctionName === getEmptyDefaultValue.name) {
      elem = {
        ...elem,
        ...startupState(dataset)
      };
    }
    return elem;
  });

  updater({
    ...prevState,
    gridContent: newGridContent,
    datasets: {
      ...prevState.datasets,
      ...dataset
    }
  });
};

export const useGetTrend = (trendId, username) => {
  const [layout, setLayout] = useState(null);
  const trendQueryResult = useQuery(getTrendLayouts(), {
    variables: {name: username, trendId: trendId}
  });

  useEffect(() => {
    trendQueryResult.refetch().then(() => {
      if (checkQueryHasLoadedWithData(trendQueryResult)) {
        const queryLayout = getQueryLoadedWithValue(trendQueryResult);
        if (queryLayout) {
          setLayout({
            ...queryLayout,
            datasets: graphArrayToGraphTree2(queryLayout.trendGraphs)
          });
        } else {
          setLayout({
            wizard: true
          });
        }
      }
    });
  }, [trendQueryResult]);

  return {
    layout,
    setLayout,
  }
};
