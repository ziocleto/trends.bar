import React, {Fragment} from "react";
import { useHistory, useLocation } from 'react-router-dom';
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";

import {initHostEnv} from "./HostEnv";

import {DBConfig} from "./DBConfig";
import {initDB} from "react-indexed-db";
import {setGlobal, useGlobal} from 'reactn';
import "./App.css";
import TrendPage from "./components/TrendPage";
import {sanitize} from "./utils/utils";

setGlobal({
  trendId: null,
  loading: false
});

initHostEnv();
initDB(DBConfig);

const router = (path, trendId, history) => {
  let ret = (<Landing/>);

  if (path !== "/") {
    ret = <TrendPage trendId={trendId}/>
  }

  if ( path !== history.location.pathname ) {
    history.push(path);
  }

  return ret;
}

const App = () => {
  let history = useHistory();
  let location = useLocation();
  const [trend] = useGlobal('trendId');
  const path = trend ? "/"+ trend : location.pathname;
  const trendId = sanitize(path);

  return (
    <Fragment>
      <Navbar trendId={trendId}/>
      {router(path, trendId, history)}
    </Fragment>
  );
};

export default App;
