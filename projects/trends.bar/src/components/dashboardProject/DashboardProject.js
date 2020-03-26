import React from "reactn";
import {TrendGrid, TrendLayout} from "../common.styled";
import {getUserName, isUserAuthenticated} from "../../futuremodules/auth/authAccessors";
import {getFileNameOnlyNoExt, sanitizeURLParams} from "../../futuremodules/utils/utils";
import {Redirect, useLocation} from "react-router-dom";
import {ScriptCodeEditor} from "./subcomponents/GatherEditor";
import {Tab, Tabs} from "react-bootstrap";
import {ProjectTabs} from "./DashboardProject.styled";
import {useState} from "react";
import {OverviewEditor} from "./subcomponents/OverviewEditor";
import {LayoutEditor} from "./subcomponents/LayoutEditor";

export const DashboardProject = ({auth}) => {

  const trendId = sanitizeURLParams(getFileNameOnlyNoExt(useLocation().pathname));
  const [activeTab, setActiveTab] = useState("Gather");

  if (!isUserAuthenticated(auth) || trendId === null) {
    return (<Redirect to={"/"}/>)
  }

  const username = getUserName(auth);

  return (
    <TrendLayout>
      <TrendGrid>
        <ProjectTabs>
          <Tabs activeKey={activeTab} onSelect={k => {setActiveTab(k)}}>
            <Tab eventKey="Overview" title="Overview">
              <OverviewEditor trendId={trendId} username={username}/>
            </Tab>
            <Tab eventKey="Layout" title="Layout">
              <LayoutEditor trendId={trendId} username={username}/>
            </Tab>
            <Tab eventKey="Gather" title="Gather">
              <ScriptCodeEditor trendId={trendId} username={username}/>
            </Tab>
          </Tabs>
        </ProjectTabs>
      </TrendGrid>
    </TrendLayout>
  );
};
