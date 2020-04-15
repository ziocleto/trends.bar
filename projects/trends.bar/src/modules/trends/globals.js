import {useGlobal} from "reactn";
import {getFileNameOnlyNoExt, sanitizeURLParams} from "../../futuremodules/utils/utils";
import {useLocation} from "react-router-dom";

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
