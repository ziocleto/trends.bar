import React, {Fragment} from "react";
import {Route, Switch, useLocation} from 'react-router-dom';
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import {setGlobal, useGlobal} from 'reactn';
import TrendPage from "./components/TrendPage";
import {sanitizePathRoot} from "./futuremodules/utils/utils";
import {initEH} from "./init";
import Register from "./futuremodules/auth/components/Register";
import Login from "./futuremodules/auth/components/Login";
import {EHAlert} from "./futuremodules/alerts/alerts";
import Cookies from 'js-cookie'
import "./App.css";

setGlobal({
  trendId: null,
  loading: false
});

initEH();

const App = () => {
  let location = useLocation();
  const [trend] = useGlobal('trendId');
  const trendId = sanitizePathRoot(trend ? trend : location.pathname);

  console.log("Tomorrow is...");
  if (Cookies.get('token')) {
    console.log("Tomorrow is another day");
  }

  return (
    <Fragment>
      <Navbar trendId={trendId}/>
      <Switch>
        <Route exact path="/">
          <Landing/>
        </Route>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Login}/>
        <Route path="/:trendId" component={TrendPage}/>
      </Switch>
      <EHAlert/>
    </Fragment>
  );
};

export default App;
