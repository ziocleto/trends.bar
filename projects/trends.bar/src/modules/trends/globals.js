import {useEffect} from "reactn";
import {useQuery} from "@apollo/react-hooks";
import {getTrend} from "./queries";
import {checkQueryHasLoadedWithData, getQueryLoadedWithValue} from "../../futuremodules/graphqlclient/query";
import {useState} from "react";

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
  const trendQueryResult = useQuery(getTrend(trendId, username));

  useEffect(() => {
    // trendQueryResult.refetch().then(() => {
      if (checkQueryHasLoadedWithData(trendQueryResult)) {
        const queryLayout = getQueryLoadedWithValue(trendQueryResult);
        if (queryLayout) {
          setLayout(queryLayout);
        } else {
          setLayout({
            wizard: true
          });
        }
      }
    // });
  }, [trendQueryResult]);

  return {
    layout,
    setLayout,
  }
};
