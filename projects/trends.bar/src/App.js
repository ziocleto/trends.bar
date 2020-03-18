import React, {Fragment, useEffect} from "react";
import {Route, Switch, useLocation} from 'react-router-dom';
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import {setGlobal, useGlobal} from 'reactn';
import TrendPage from "./components/TrendPage";
import {sanitizePathRoot} from "./futuremodules/utils/utils";
import {initEH} from "./init";
import Register from "./futuremodules/auth/components/Register";
import Login from "./futuremodules/auth/components/Login";
import DashboardUser from "./components/DashboardUser";
import {EHAlert} from "./futuremodules/alerts/alerts";
import "./App.css";
import {api, useApiSilent} from "./futuremodules/api/apiEntryPoint";
import {loadUser} from "./futuremodules/auth/authApiCalls";
import {Auth} from "./futuremodules/auth/authAccessors";

setGlobal({
  trendId: null,
  loading: false
});

initEH();

const App = () => {
  const location = useLocation();
  const [trend] = useGlobal('trendId');
  const trendId = sanitizePathRoot(trend ? trend : location.pathname);

  const authApi = useApiSilent(Auth);
  useEffect(() => {
    api( authApi, loadUser );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <Navbar trendId={trendId}/>
      <Switch>
        <Route exact path="/">
          <Landing/>
        </Route>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/dashboarduser" component={DashboardUser}/>
        <Route path="/:trendId" component={TrendPage}/>
      </Switch>
      <EHAlert/>
    </Fragment>
  );
};

export default App;
