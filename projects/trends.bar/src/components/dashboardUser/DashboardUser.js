import React, {Fragment, useReducer} from "react";
import {DashboardUserFragment} from "./DashboardUser.styled";
import {UserAssets} from "./subcomponents/UserAssets";
import {AssetCreator} from "./subcomponents/AssetCreator";
import {WelcomeToTheJungle} from "../../futuremodules/auth/components/WelcomeToTheJungle";
import {Logoff} from "../../futuremodules/auth/components/Logoff";
import {DashboardProject} from "../dashboardProject/DashboardProject";
import {dashBoardManager, dashBoardManagerInitialState, useDispatchUserName} from "./DashboardUserLogic";
import {SpinnerTopMiddle} from "../../futuremodules/spinner/Spinner";

export const DashboardUser = () => {

  const [state, dispatch] = useReducer(dashBoardManager, dashBoardManagerInitialState);
  useDispatchUserName(dispatch);

  if (!state.username) {
    return <SpinnerTopMiddle/>;
  }

  return (
    <Fragment>
      {state.editingTrend &&
      <DashboardProject state={state} dispatch={dispatch}/>}
      {!state.editingTrend &&
      <DashboardUserFragment>
        <WelcomeToTheJungle username={state.username}/>
        <UserAssets state={state} dispatch={dispatch}/>
        <AssetCreator state={state} dispatch={dispatch}/>
        <Logoff tagline={"Great Scott, let me out of here!"}/>
      </DashboardUserFragment>
      }
    </Fragment>
  );
};
