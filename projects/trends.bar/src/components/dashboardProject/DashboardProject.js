import React, {withGlobal} from "reactn";
import {getAuthUserName, getAuthWithGlobal} from "../../futuremodules/auth/authAccessors";
import {Redirect} from "react-router-dom";
import {ScriptCodeEditor} from "./subcomponents/GatherEditor";
import {Tab, Tabs} from "react-bootstrap";
import {ProjectTabs} from "./DashboardProject.styled";
import {Fragment, useState} from "react";
import {LayoutEditor} from "./subcomponents/LayoutEditor";

const DashboardProject = (props) => {

  const [activeTab, setActiveTab] = useState("DataSources");
  const username = getAuthUserName(props.auth);

  if ( props.auth === null ) {
    return (<Redirect to={"/"}/>);
  }
  if ( props.auth === undefined ) {
    return (<Fragment/>)
  }

  return (
    <ProjectTabs>
      <Tabs id={"ptabid"} activeKey={activeTab} onSelect={k => {
        setActiveTab(k)
      }}>
        <Tab eventKey="Layout" title="Layout">
          <LayoutEditor username={username}/>
        </Tab>
        <Tab eventKey="DataSources" title="DataSources">
          <ScriptCodeEditor username={username}/>
        </Tab>
      </Tabs>
    </ProjectTabs>
  );
};

export default withGlobal(
  global => getAuthWithGlobal(global)
)(DashboardProject);
