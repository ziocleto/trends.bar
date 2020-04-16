import React, {useGlobal, withGlobal} from "reactn";
import {getAuthUserName, getAuthWithGlobal} from "../../futuremodules/auth/authAccessors";
import {Redirect} from "react-router-dom";
import {DataSources} from "./subcomponents/DataSources/DataSources";
import {Tab, Tabs} from "react-bootstrap";
import {ProjectClose, ProjectContent, ProjectTabs} from "./DashboardProject.styled";
import {Fragment, useState} from "react";
import {LayoutEditor} from "./subcomponents/Layout/LayoutEditor";
import {ButtonDiv} from "../../futuremodules/reactComponentStyles/reactCommon.styled";
import {EditingUserTrend} from "../../modules/trends/globals";
import {OverviewEditor} from "./subcomponents/OverviewEditor";

const DashboardProject = (props) => {

  const [activeTab, setActiveTab] = useState("Layout");
  const [currEditingTrend, setEditingUserTrend] = useGlobal(EditingUserTrend);
  const username = getAuthUserName(props.auth);

  if (props.auth === null) {
    return (<Redirect to={"/"}/>);
  }
  if (props.auth === undefined) {
    return (<Fragment/>)
  }
  if (currEditingTrend === null) {
    return (<Redirect to={"/dashboarduser"}/>);
  }

  return (
    <ProjectTabs>
      <ProjectClose>
        <ButtonDiv onClick={ () => setEditingUserTrend(null)}>
          <b><i className="fas fa-times"/></b>
        </ButtonDiv>
      </ProjectClose>
      <ProjectContent>
        <Tabs id={"ptabid"} activeKey={activeTab} onSelect={k => {
          setActiveTab(k)
        }}>
          <Tab eventKey="Overview" title="Overview">
            <OverviewEditor username={username}/>
          </Tab>
          <Tab eventKey="Layout" title="Layout">
            <LayoutEditor username={username}/>
          </Tab>
          <Tab eventKey="DataSources" title="DataSources">
            <DataSources username={username}/>
          </Tab>
        </Tabs>
      </ProjectContent>
    </ProjectTabs>
  );
};

export default withGlobal(
  global => getAuthWithGlobal(global)
)(DashboardProject);
