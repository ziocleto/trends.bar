import React from "reactn";
import {DataSources} from "./subcomponents/DataSources/DataSources";
import {Badge, Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownButton, SplitButton} from "react-bootstrap";
import {ProjectContent} from "./DashboardProject.styled";
import {Fragment, useState} from "react";
import {LayoutEditor} from "./subcomponents/Layout/LayoutEditor";
import {DivWL, DivWR, Flex, FlexToolbar, Mx1, My1} from "../../futuremodules/reactComponentStyles/reactCommon.styled";
import {CustomTitle, RocketTitle} from "../../futuremodules/reactComponentStyles/reactCommon";
import {SpinnerTopMiddle} from "../../futuremodules/spinner/Spinner";
import {MakeDefaultLayoutWizard} from "./subcomponents/Layout/MakeDefaultLayoutWizard";
import {addCell, needsWizard, useGetTrend, usePublishTrend} from "./DashBoardProjectLogic";
import {editingTrendD} from "../dashboardUser/DashboardUserLogic";

const dataSourcesId = "DataSources";
const trendTabId = "Trend";

export const DashboardProject = ({state, dispatch}) => {

  const {username, editingTrend} = state;
  const [activeTab, setActiveTab] = useState(trendTabId);
  const {layout, setLayout} = useGetTrend(editingTrend, username);
  const publish = usePublishTrend(editingTrend, username);

  console.log("Layout", layout);
  if (needsWizard(layout)) {
    return <MakeDefaultLayoutWizard layout={layout} setLayout={setLayout} state={state} dispatch={dispatch}/>;
  }

  if (!layout) {
    return <SpinnerTopMiddle/>
  }

  return (
    <Fragment>
      <My1/>
      <FlexToolbar alignItems={"center"} padding={"0px 10px"}>
        <DivWL width={"200px"}>
          <Flex alignItems={"center"} justifyContent={"flex-start"}>
            <h2><Badge variant="primary">{editingTrend}</Badge></h2>
            <Mx1/>
            <Button variant={"outline-success"} onClick={() => publish()}>
              <RocketTitle text={"Publish"}/>
            </Button>
          </Flex>
        </DivWL>
        <div>
          <ButtonToolbar>
            <ButtonGroup>
              <DropdownButton as={ButtonGroup} title={<CustomTitle text={"Trend"} icon={"poll"}/>}
                           variant={activeTab && activeTab === trendTabId ? "info" : "primary"}
                           onClick={() => setActiveTab(trendTabId)}>
                <Dropdown.Item onClick={() => addCell(layout, setLayout)}>
                  <CustomTitle text={"Add Box"} icon={"plus"}/>
                </Dropdown.Item>
                <Dropdown.Item
                  variant={activeTab && activeTab === dataSourcesId ? "info" : "primary"}
                  onClick={() => setActiveTab(dataSourcesId)}>
                  <CustomTitle text={"Sources"} icon={"layer-group"}/>
                </Dropdown.Item>
              </DropdownButton>
            </ButtonGroup>
          </ButtonToolbar>
        </div>
        <DivWR width={"200px"}>
          <Button
            variant={"outline-light"}
            onClick={() => {
              dispatch([editingTrendD, null]);
              setLayout(null);
            }}>
            <i className="fas fa-arrow-left"/>
          </Button>
        </DivWR>
      </FlexToolbar>
      <ProjectContent>
        {activeTab && activeTab === trendTabId &&
        <LayoutEditor
          username={username}
          layout={layout}
          setLayout={setLayout}
        />
        }
        {activeTab && activeTab === dataSourcesId &&
        <DataSources state={state} dispatch={dispatch} layout={layout} setLayout={setLayout}/>}
      </ProjectContent>
    </Fragment>
  );
};

// export default DashboardProject;
