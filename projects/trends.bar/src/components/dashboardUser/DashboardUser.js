import React, {withGlobal} from "reactn";
import {DashboardUserFragment} from "./DashboardUser.styled";
import {getAuthWithGlobal} from "../../futuremodules/auth/authAccessors";
import UserAssets from "./subcomponents/UserAssets";
import {Logoff} from "./subcomponents/Logoff";
import AssetCreator from "./subcomponents/AssetCreator";
import {Redirect} from "react-router-dom";
import WelcomeToTheJungle from "./subcomponents/WelcomeToTheJungle";
import {Fragment} from "react";

const DashboardUser = (props) => {

  if ( props.auth === null ) {
    return (<Redirect to={"/"}/>);
  }
  if ( props.auth === undefined ) {
    return (<Fragment/>)
  }

  return (
    <DashboardUserFragment>
      <WelcomeToTheJungle/>
      <UserAssets/>
      <AssetCreator/>
      {/*<AssetInvitations auth={auth}/>*/}
      <Logoff/>
    </DashboardUserFragment>
  );
};

export default withGlobal(
  global => getAuthWithGlobal(global)
)(DashboardUser);
