import {useEffect} from "reactn";
import {useQuery} from "@apollo/react-hooks";
import {getTrendLayouts} from "./queries";
import {checkQueryHasLoadedWithData, getQueryLoadedWithValue} from "../../futuremodules/graphqlclient/query";
import {useState} from "react";
import {graphArrayToGraphTree2} from "./dataGraphs";

const uniqueNamesGenerator = require('project-name-generator');

export const layoutStandardCols = 12;

export const generateUniqueNameWithArrayCheck = (arrayToCheck) => {
  let defaultFileName = uniqueNamesGenerator().dashed;
  while (arrayToCheck && arrayToCheck.includes(defaultFileName)) {
    defaultFileName = uniqueNamesGenerator().dashed;
  }
  return defaultFileName;
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
