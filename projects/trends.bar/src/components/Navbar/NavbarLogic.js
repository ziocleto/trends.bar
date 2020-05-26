import {
  getFileNameOnlyNoExt,
  isReservedWordSanitized,
  sanitizeAvoidReservedWords,
  sanitizeURLParams
} from "../../futuremodules/utils/utils";
import {useLocation} from "react-router-dom";

const useTrendIdGetter = () => {
  return sanitizeURLParams(getFileNameOnlyNoExt(useLocation().pathname));
};

export const useGetNavbarTitle = () => {
  const trendId = useTrendIdGetter();
  const isLocationReserved = isReservedWordSanitized(useLocation().pathname);

  const updater = () => {
    return !isLocationReserved && getFileNameOnlyNoExt(sanitizeAvoidReservedWords(trendId));
  };

  return updater;
};
