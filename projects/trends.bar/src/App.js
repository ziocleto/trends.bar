import React, {Fragment} from "react";
import {Route, Switch, useLocation} from 'react-router-dom';
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

const App = () => {
  let location = useLocation();
  const [trend] = useGlobal('trendId');
  const trendId = sanitizePathRoot(trend ? trend : location.pathname);

  return (
    <Fragment>
      <Navbar trendId={trendId}/>
      <Switch>
        <Route exact path="/">
          <Landing/>
        </Route>
        <Route path="/:trendId" component={TrendPage}/>
      </Switch>
    </Fragment>
  );
};

export default App;
