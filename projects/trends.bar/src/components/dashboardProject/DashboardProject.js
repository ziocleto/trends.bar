import React, {useGlobal, withGlobal} from "reactn";
import {getAuthUserName, getAuthWithGlobal} from "../../futuremodules/auth/authAccessors";
import {Redirect} from "react-router-dom";
import {DataSources} from "./subcomponents/DataSources/DataSources";
import {Button, ButtonGroup, ButtonToolbar, Tab, Tabs} from "react-bootstrap";
import {ProjectClose, ProjectContent, ProjectTabs} from "./DashboardProject.styled";
import {Fragment, useState} from "react";
import {LayoutEditor} from "./subcomponents/Layout/LayoutEditor";
import {ButtonDiv, FlexToolbar, FlexWithBorder} from "../../futuremodules/reactComponentStyles/reactCommon.styled";
import {EditingUserTrend, useGetTrend, useTrendIdGetter} from "../../modules/trends/globals";
import {getDefaultCellContent} from "../../modules/trends/layout";
import {RocketTitle} from "../../futuremodules/reactComponentStyles/reactCommon";
import {useMutation} from "@apollo/react-hooks";
import {upsertTrendLayout} from "../../modules/trends/mutations";

const DashboardProject = (props) => {

  const [activeTab, setActiveTab] = useState("Layout");
  const [currEditingTrend, setEditingUserTrend] = useGlobal(EditingUserTrend);
  const username = getAuthUserName(props.auth);
  const trendId = useTrendIdGetter();
  const {layout, setLayout, datasets} = useGetTrend(trendId, username);
  const [trendLayoutMutation] = useMutation(upsertTrendLayout);

  if (props.auth === null) {
    return (<Redirect to={"/"}/>);
  }
  if (props.auth === undefined) {
    return (<Fragment/>)
  }
  if (currEditingTrend === null) {
    return (<Redirect to={"/dashboarduser"}/>);
  }

  const onAddCell = () => {
    const newGridLayout = [...layout.gridLayout];
    const newGridContent = [...layout.gridContent];
    const newIndex = Math.max(...(layout.gridLayout.map((v) => Number(v.i)))) + 1;
    newGridLayout.push({
      i: newIndex.toString(),
      x: 0,
      y: Infinity,
      w: 1,
      h: 1
    });
    newGridContent.push(getDefaultCellContent(newIndex));
    setLayout({
      ...layout,
      gridLayout: newGridLayout,
      gridContent: newGridContent
    });
  };

  const onSaveLayout = () => {
    console.log("SAVING:", layout);
    trendLayoutMutation({
      variables: {
        trendLayout: layout
      }
    }).then();
  };

  return (
    <Fragment>
      <FlexToolbar margin={"10px"}>
      <ButtonToolbar className="justify-content-between" aria-label="Toolbar with Button groups">
        <ButtonGroup aria-label="First group">
          <Button onClick={onAddCell}>Add Cell</Button>{' '}
        </ButtonGroup>
        <ButtonGroup>
          <Button variant={"outline-success"} onClick={onSaveLayout}><RocketTitle text={"Publish"}/></Button>
        </ButtonGroup>
      </ButtonToolbar>
      </FlexToolbar>

      <ProjectClose>
        <ButtonDiv onClick={ () => setEditingUserTrend(null)}>
          <b><i className="fas fa-times"/></b>
        </ButtonDiv>
      </ProjectClose>
      <ProjectContent>
        <Tabs id={"ptabid"} activeKey={activeTab} onSelect={k => {
          setActiveTab(k)
        }}>
          <Tab eventKey="Layout" title="Layout">
            <LayoutEditor
              username={username}
              layout={layout}
              setLayout={setLayout}
              datasets={datasets}
            />
          </Tab>
          <Tab eventKey="DataSources" title="DataSources">
            <DataSources username={username}/>
          </Tab>
        </Tabs>
      </ProjectContent>
    </Fragment>
  );
};

export default withGlobal(
  global => getAuthWithGlobal(global)
)(DashboardProject);
