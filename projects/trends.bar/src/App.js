import "./App.css";
import React, {useEffect} from "react";
import {Route, Switch, useLocation} from 'react-router-dom';
import Landing from "./components/Landing/Landing";
import Navbar from "./components/Navbar";
import {useGlobal} from 'reactn';
import TrendPage from "./components/Trend/TrendPage";
import {sanitizePathRoot} from "./futuremodules/utils/utils";
import {initEH} from "./init";
import Register from "./futuremodules/auth/components/Register";
import Login from "./futuremodules/auth/components/Login";
import DashboardUser from "./components/dashboardUser/DashboardUser";
import {EHAlert} from "./futuremodules/alerts/alerts";
import {apiSilent, useApi} from "./futuremodules/api/apiEntryPoint";
import {loadUser} from "./futuremodules/auth/authApiCalls";
import {Auth} from "./futuremodules/auth/authAccessors";
import {DashboardProject} from "./components/dashboardProject/DashboardProject";
import {Body} from "./components/common.styled";


initEH();

const App = () => {
  const location = useLocation();
  const [trend] = useGlobal('trendId');
  const trendId = sanitizePathRoot(trend ? trend : location.pathname);
  // const [usernameSplit, trendIdSplit] = trendId.split("/");

  const authApi = useApi(Auth);
  useEffect(() => {
    apiSilent(authApi, loadUser).then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Body>
      <Navbar trendId={trendId}/>
      <Switch>
        <Route exact path="/"  component={Landing}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/dashboarduser" render={ () => <DashboardUser auth={authApi}/> } />
        <Route path="/dashboardproject" render={ () => <DashboardProject auth={authApi}/> }/>
        <Route path="/:usernameSplit/:trendIdSplit" component={TrendPage}/>
      </Switch>
      <EHAlert/>
    </Body>
  );
};

export default App;
