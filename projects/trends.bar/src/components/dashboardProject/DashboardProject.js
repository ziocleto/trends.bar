import React, {useGlobal, withGlobal} from "reactn";
import {getAuthUserName, getAuthWithGlobal} from "../../futuremodules/auth/authAccessors";
import {Redirect} from "react-router-dom";
import {DataSources} from "./subcomponents/DataSources/DataSources";
import {Button, ButtonGroup, ButtonToolbar, Dropdown, SplitButton} from "react-bootstrap";
import {ProjectContent} from "./DashboardProject.styled";
import {Fragment, useState} from "react";
import {LayoutEditor} from "./subcomponents/Layout/LayoutEditor";
import {FlexToolbar} from "../../futuremodules/reactComponentStyles/reactCommon.styled";
import {EditingUserTrend, useGetTrend, useTrendIdGetter} from "../../modules/trends/globals";
import {getDefaultCellContent} from "../../modules/trends/layout";
import {CustomTitle, RocketTitle} from "../../futuremodules/reactComponentStyles/reactCommon";
import {useMutation} from "@apollo/react-hooks";
import {upsertTrendLayout} from "../../modules/trends/mutations";

const DashboardProject = (props) => {

  const dataSourcesId = "DataSources";
  const trendTabId = "Trend";
  const [activeTab, setActiveTab] = useState(trendTabId);
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
    trendLayoutMutation({
      variables: {
        trendLayout: layout
      }
    }).then();
  };

  return (
    <Fragment>
      <FlexToolbar margin={"12px"}>
        <div>
          <ButtonToolbar>
              <Button
                className="mr-4"
                variant={"outline-light"}
                onClick={() => setEditingUserTrend(null)}>
                <i className="fas fa-times"/></Button>
            <ButtonGroup>
              <SplitButton as={ButtonGroup} title={<CustomTitle text={"Trend"} icon={"poll"}/>}
                           active={true}
                              variant={activeTab && activeTab === trendTabId ? "info" : "primary"}
                              onClick={() => setActiveTab(trendTabId)}>
                <Dropdown.Item onClick={onAddCell}>
                  <CustomTitle text={"Add Trend Box"} icon={"plus"}/>
                </Dropdown.Item>
              </SplitButton>
              <Button
                variant={activeTab && activeTab === dataSourcesId ? "info" : "primary"}
                onClick={() => setActiveTab(dataSourcesId)}>
                <CustomTitle text={"Sources"} icon={"layer-group"}/>
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>
        <div>
          <Button variant={"outline-success"} onClick={onSaveLayout}><RocketTitle text={"Publish"}/></Button>
        </div>
      </FlexToolbar>
      <ProjectContent>
        {activeTab && activeTab === trendTabId &&
        <LayoutEditor
          username={username}
          layout={layout}
          setLayout={setLayout}
          datasets={datasets}
        />
        }
        {activeTab && activeTab === dataSourcesId && <DataSources username={username}/>}
      </ProjectContent>
    </Fragment>
  );
};

export default withGlobal(
  global => getAuthWithGlobal(global)
)(DashboardProject);
