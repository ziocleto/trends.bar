import {apiSilent, useApi} from "./futuremodules/api/apiEntryPoint";
import {Auth} from "./futuremodules/auth/authAccessors";
import {useEffect} from "react";
import {loadUser} from "./futuremodules/auth/authApiCalls";

export const useAuth = () => {
  const authApi = useApi(Auth);
  useEffect(() => {
    apiSilent(authApi, loadUser).then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
