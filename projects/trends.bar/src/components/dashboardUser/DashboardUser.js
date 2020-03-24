import React from "reactn";
import {DashboardUserFragment} from "./DashboardUser.styled";
import {isUserAuthenticated} from "../../futuremodules/auth/authAccessors";
import {WelcomeToTheJungle} from "./subcomponents/WelcomeToTheJungle"
import {UserAssets} from "./subcomponents/UserAssets";
import {Logoff} from "./subcomponents/Logoff";
import {AssetCreator} from "./subcomponents/AssetCreator";
import {Redirect} from "react-router-dom";

const DashboardUser = ({auth}) => {

  if (!isUserAuthenticated(auth)) {
    return (<Redirect to={"/"}/>)
  }

  return (
    <DashboardUserFragment>
      <WelcomeToTheJungle auth={auth}/>
      <UserAssets auth={auth}/>
      <AssetCreator auth={auth}/>
      {/*<AssetInvitations auth={auth}/>*/}
      <Logoff auth={auth}/>
    </DashboardUserFragment>
  );
};

export default DashboardUser;
