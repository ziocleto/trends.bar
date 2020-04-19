import "./App.css";
import React from "react";
import {Route, Switch} from 'react-router-dom';
import Landing from "./components/Landing/Landing";
import Navbar from "./components/Navbar/Navbar";
import TrendPage from "./components/Trend/TrendPage";
import Register from "./futuremodules/auth/components/Register";
import Login from "./futuremodules/auth/components/Login";
import DashboardUser from "./components/dashboardUser/DashboardUser";
import {EHAlert} from "./futuremodules/alerts/alerts";
import {Body, FakeNavBar} from "./futuremodules/reactComponentStyles/reactCommon.styled";
import {useAuth} from "./AppLogic";

export const App = () => {

  useAuth();

  return (
    <Body>
      <Navbar/>
      <FakeNavBar/>
      <Switch>
        <Route exact path="/" component={Landing}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/dashboarduser" component={DashboardUser} />
        <Route path="/:usernameSplit/:trendIdSplit" component={TrendPage}/>
      </Switch>
      <EHAlert/>
    </Body>
  );
};
