import React, {useGlobal, withGlobal} from "reactn";
import {DashboardUserFragment} from "./DashboardUser.styled";
import {getAuthUserName, getAuthWithGlobal} from "../../futuremodules/auth/authAccessors";
import UserAssets from "./subcomponents/UserAssets";
import {AssetCreator} from "./subcomponents/AssetCreator";
import {Redirect} from "react-router-dom";
import {Fragment} from "react";
import WelcomeToTheJungle from "../../futuremodules/auth/components/WelcomeToTheJungle";
import {Logoff} from "../../futuremodules/auth/components/Logoff";
import {EditingUserTrend} from "../../modules/trends/globals";
import {DashboardProject} from "../dashboardProject/DashboardProject";
import {SpinnerTopMiddle} from "../../futuremodules/spinner/Spinner";

const DashboardUser = ({auth}) => {

  const [editingTrend] = useGlobal(EditingUserTrend);

  if (auth === null) {
    return (<Redirect to={"/"}/>);
  }
  if (auth === undefined) {
    return (<SpinnerTopMiddle/>)
  }

  return (
    <Fragment>
      {editingTrend && <DashboardProject username={getAuthUserName(auth)} trendId={editingTrend}/>}
      {!editingTrend &&
      <DashboardUserFragment>
        <WelcomeToTheJungle/>
        <UserAssets/>
        <AssetCreator username={getAuthUserName(auth)}/>
        <Logoff/>
      </DashboardUserFragment>
      }
    </Fragment>
  );
};

export default withGlobal(
  global => getAuthWithGlobal(global)
)(DashboardUser);
