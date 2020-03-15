import React, {Fragment} from "react";
import {useHistory, useLocation} from 'react-router-dom';
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import {setGlobal, useGlobal} from 'reactn';
import "./App.css";
import TrendPage from "./components/TrendPage";
import {sanitizePathRoot} from "./futuremodules/utils/utils";
import {initEH} from "./init";

setGlobal({
  trendId: null,
  loading: false
});

initEH();

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
  const trendId = sanitizePathRoot(path);

  return (
    <Fragment>
      <Navbar trendId={trendId}/>
      {router(path, trendId, history)}
    </Fragment>
  );
};

export default App;
