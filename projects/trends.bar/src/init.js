import {initHostEnv} from "./futuremodules/config/HostEnv";
import {DBConfig} from "./futuremodules/config/DBConfig";
import {initDB} from "react-indexed-db";

export const initEH = () => {
  initHostEnv();
  initDB(DBConfig);
}
