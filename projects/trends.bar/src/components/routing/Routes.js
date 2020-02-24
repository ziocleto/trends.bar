import React, {Fragment} from "react";
import {Route, Switch} from "react-router-dom";
import TrendPage from "../layout/TrendPage";
import NotFound from "../layout/NotFound";

const Routes = () => {

  return (
    <Fragment>
      {/*<AlertContainer/>*/}
      <Switch>
        {/*<Route exact path="/register" component={Register} />*/}
        {/*<Route exact path="/login" component={Login} />*/}
        {/*<PrivateRoute exact path="/dashboarduser" component={DashboardUser} />*/}
        <Route path="/:id" component={TrendPage}/>
        <Route component={NotFound}/>
      </Switch>
    </Fragment>
  );
};

export default Routes;
