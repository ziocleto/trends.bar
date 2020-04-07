import React from "reactn";
import {getUserName, isUserAuthenticated} from "../../futuremodules/auth/authAccessors";
import {getFileNameOnlyNoExt, sanitizeURLParams} from "../../futuremodules/utils/utils";
import {useLocation} from "react-router-dom";
import {ScriptCodeEditor} from "./subcomponents/GatherEditor";
import {Tab, Tabs} from "react-bootstrap";
import {ProjectTabs} from "./DashboardProject.styled";
import {Fragment, useState} from "react";
import {LayoutEditor} from "./subcomponents/LayoutEditor";

export const DashboardProject = ({auth}) => {

  const trendId = sanitizeURLParams(getFileNameOnlyNoExt(useLocation().pathname));
  const [activeTab, setActiveTab] = useState("DataSources");

  if (!isUserAuthenticated(auth) || trendId === null) {
    return (<Fragment/>)
    // return (<Redirect to={"/"}/>)
  }

  const username = getUserName(auth);

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
