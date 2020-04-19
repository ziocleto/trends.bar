import {useTrendIdGetter} from "../../modules/trends/globals";
import {
  getFileNameOnlyNoExt,
  isReservedWordSanitized,
  sanitizeAvoidReservedWords
} from "../../futuremodules/utils/utils";
import {useLocation} from "react-router-dom";

export const useGetNavbarTitle = () => {
  const trendId = useTrendIdGetter();
  const isLocationReserved = isReservedWordSanitized(useLocation().pathname);

  const updater = () => {
    return !isLocationReserved && getFileNameOnlyNoExt(sanitizeAvoidReservedWords(trendId));
  };

  return updater;
};
